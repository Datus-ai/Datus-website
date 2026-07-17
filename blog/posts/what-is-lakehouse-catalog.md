---
title: "What Is a Lakehouse Catalog? Hive, Glue, Unity, Polaris & Horizon"
description: "A lakehouse catalog tracks table metadata for query engines. Compare Hive Metastore, AWS Glue, Unity Catalog, Apache Polaris and Snowflake Horizon."
author: "Harrison Zhao"
date: 2026-06-26
lastmod: 2026-06-26
head:
  - - meta
    - name: keywords
      content: "lakehouse catalog, what is a lakehouse catalog, table catalog, hive metastore, aws glue data catalog, unity catalog, apache polaris, snowflake horizon, iceberg rest catalog, apache gravitino"
  - - meta
    - property: og:title
      content: "What Is a Lakehouse Catalog? Hive, Glue, Unity, Polaris & Horizon"
  - - meta
    - property: og:description
      content: "A lakehouse catalog tracks table metadata for query engines. Compare Hive Metastore, AWS Glue, Unity Catalog, Apache Polaris and Snowflake Horizon."
  - - meta
    - property: og:type
      content: article
  - - meta
    - property: og:url
      content: https://datus.ai/blog/posts/what-is-lakehouse-catalog
  - - meta
    - property: og:image
      content: https://datus.ai/logo_dark.svg
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - link
    - rel: canonical
      href: https://datus.ai/blog/posts/what-is-lakehouse-catalog
---

# What Is a Lakehouse Catalog? Hive, Glue, Unity, Polaris & Horizon

## TL;DR

- A **lakehouse catalog** is an engine-facing metadata service that maps logical table names to physical storage locations, schemas, and table-format snapshots — it is what makes object storage queryable as tables.
- It is **not** the same as a discovery-oriented **[data catalog](/blog/what-is-data-catalog/)** (DataHub, Atlan): one serves query engines, the other serves humans searching for data.
- The lineage runs **Hive Metastore → AWS Glue Data Catalog → Unity Catalog / Apache Polaris / Snowflake Horizon**, with open table formats (Iceberg, Delta) pushing catalogs toward standardized REST APIs.
- The defining tension today is **open vs managed**: Apache Polaris and the Iceberg REST spec favor portability; Unity Catalog and Snowflake Horizon offer deeper integration with a single control plane — and both vendors now ship an open and a managed face.
- Catalogs are also becoming the **grounding layer for AI agents**: an agent that generates SQL needs the same table, schema, and location metadata a query engine does, plus executable context the catalog alone does not carry.

A **lakehouse catalog** is the metadata service that tells a query engine which tables exist, where their files live, and what their schema is. When Spark, Trino, Snowflake, or Databricks resolves `SELECT * FROM sales.orders`, it does not scan object storage hoping to find the right Parquet files — it asks a catalog. That catalog returns the table's location, current schema, partition layout, and, for open table formats, the pointer to the latest metadata snapshot. This glossary entry defines the lakehouse catalog, traces its evolution from the Hive Metastore to AWS Glue, Unity Catalog, Apache Polaris, and Snowflake Horizon, and explains the open-versus-managed split that now shapes every lakehouse architecture decision.

## 1. Lakehouse catalog: a working definition

Before object storage, a database engine owned both the data and the metadata about that data. The lakehouse pulled those apart: files (Parquet, ORC) sit in S3 or GCS, while a separate catalog records what those files mean. That separation is what lets five engines query the same table — but it only works if every engine agrees on a single source of truth for metadata.

A useful working definition:

> A **lakehouse catalog** is a metadata service that registers tables and namespaces, resolves a logical table name to its physical storage location and current schema, and exposes that metadata to query engines so they can plan and execute SQL over files in object storage. For open table formats such as Apache Iceberg and Delta Lake, the catalog is also the authority for the latest committed snapshot, making it the coordination point for atomic commits and concurrent writes. A lakehouse catalog is **not** a human discovery portal, a BI semantic layer, or a transformation engine — it is the engine-facing index that turns a bucket of files into queryable tables.

The phrase "engine-facing" is the boundary that matters. A lakehouse catalog answers machine questions — *where are the files, what is the schema, which snapshot is current* — many times per query, in milliseconds. It is read on every query plan and written on every commit, so latency and concurrency control are first-order concerns. Capabilities most teams expect from one include namespace and table registration, schema and partition tracking, snapshot or version pointers for time travel, and increasingly access control enforced at the catalog boundary rather than per-engine.

## 2. Lakehouse catalog vs metastore vs data catalog

The word "catalog" is badly overloaded, and conflating the three meanings is the most common source of confusion in lakehouse design reviews. A team will say "we need a catalog" and three people will picture three different systems. The distinctions are worth pinning down before comparing vendors.

| Dimension | Lakehouse catalog | Metastore (legacy term) | Data catalog (discovery) |
| --- | --- | --- | --- |
| Primary consumer | Query engines | Query engines | Humans, governance teams |
| Core question | Where/what is this table? | Where/what is this table? | Does this data exist, who owns it? |
| Read frequency | Per query, machine speed | Per query, machine speed | Occasional, human speed |
| Examples | Unity Catalog, Polaris, Glue | Hive Metastore | DataHub, Atlan, Select Star |
| Writes on | Every commit | Every DDL/commit | Crawls and ingestion jobs |

The metastore is best understood as the *original term* for a lakehouse catalog — the Hive Metastore was the first widely adopted one, and "metastore" stuck as a synonym even though modern catalogs do far more. The discovery **[data catalog](/blog/what-is-data-catalog/)**, by contrast, is a genuinely different product: it indexes assets so a human can find and trust them, and it is read at human speed during exploration, not on the hot path of every query. The two layers complement each other — a discovery catalog often reads *from* the lakehouse catalog to populate its inventory — but they solve different problems. The rest of this article is about the engine-facing catalog.

## 3. Hive Metastore: the origin

The Hive Metastore (HMS) is where the lakehouse catalog story begins. Shipped with Apache Hive in the late 2000s, it was a relational database — typically MySQL or PostgreSQL — wrapped in a Thrift service that recorded databases, tables, columns, and partition locations for data sitting in HDFS. When a Hive query ran, it asked the metastore for the partitions matching a filter, then read those files directly. That pattern, mundane as it sounds, defined two decades of big-data architecture.

What made HMS durable was its protocol. Spark, Presto, Trino, and Impala all learned to speak the Hive Metastore API, so a single metastore could back an entire multi-engine platform. Even today, many "modern" catalogs ship a Hive-compatible endpoint precisely because so much tooling assumes it exists. You can read the design in the <a href="https://cwiki.apache.org/confluence/display/Hive/AdminManual+Metastore+Administration" rel="nofollow noopener">Apache Hive Metastore administration docs</a>, which still describe the schema that newer systems emulate.

HMS also carries real limitations, and those limitations are the reason every cloud vendor eventually built a replacement. Partition metadata lives in rows, so listing a table with hundreds of thousands of partitions is slow; the service is stateful and operationally heavy to run at scale; and it predates open table formats, so it has no native concept of snapshots, schema evolution, or atomic multi-table commits. Teams running large Hive deployments learned to dread the metastore as a bottleneck — partition explosions could make a simple `MSCK REPAIR TABLE` run for hours. The lakehouse catalogs that followed were, in large part, an answer to those specific pains.

## 4. AWS Glue Data Catalog

The AWS Glue Data Catalog was the first cloud-native answer to "run a Hive Metastore without running a Hive Metastore." It is a fully managed, serverless catalog that exposes a Hive-compatible interface, so Athena, EMR, Redshift Spectrum, and Spark on AWS can all resolve tables against it without anyone provisioning a MySQL instance. For teams already on AWS, Glue removed the single most annoying piece of Hadoop-era operations: keeping the metastore alive.

Glue's design choices reflect its cloud-native origins. Schemas are populated either by crawlers that infer structure from files in S3 or by direct registration from ETL jobs, and the catalog integrates with AWS Lake Formation for table-, column-, and row-level access control. Because it is serverless, it scales partition handling far better than a self-managed HMS, and it bills per object stored and per request rather than per provisioned server. The official <a href="https://docs.aws.amazon.com/glue/latest/dg/components-overview.html" rel="nofollow noopener">AWS Glue Data Catalog documentation</a> describes how crawlers, databases, and tables fit together.

The trade-off is the one that recurs throughout this article: Glue is excellent inside AWS and awkward outside it. Its API is Hive-flavored rather than the newer Iceberg REST standard, and its access model is tied to Lake Formation and IAM, so portability to another cloud means re-pointing every engine at a different catalog. AWS has since added Iceberg REST endpoints and an S3 Tables service to narrow that gap, but the posture is unchanged — Glue is the catalog that makes the AWS lakehouse cohesive, and that cohesion is also its lock-in.

## 5. Databricks Unity Catalog: open vs closed

Unity Catalog is Databricks' governance and catalog layer, and it is the clearest example of a vendor running two versions of the same catalog at once. The original Unity Catalog is the proprietary control plane inside the Databricks platform: it governs tables, volumes, models, and functions across workspaces, enforces fine-grained access control, and tracks lineage automatically. In that managed form it is tightly coupled to Databricks and is the backbone of the platform's governance story.

In 2024, Databricks open-sourced **Unity Catalog OSS** under a permissive license and donated it to the LF AI & Data Foundation, reframing it as an open standard with an OpenAPI-defined REST interface and support for Iceberg, Delta, and Hudi tables. The open version aims to be engine-agnostic — any client that speaks its API can read and govern tables, not just Databricks compute. You can compare the two faces directly in the <a href="https://github.com/unitycatalog/unitycatalog" rel="nofollow noopener">Unity Catalog open-source repository</a>, which is distinct from the managed service billed inside Databricks workspaces.

The open-versus-closed split is not a contradiction so much as a strategy, and it is worth naming plainly because it confuses many evaluations. The managed Unity Catalog offers depth — lineage, governance, and platform features that only work when Databricks owns the control plane. The open Unity Catalog offers reach — a standard interface other engines can adopt, hedging against the perception of lock-in. A team adopting "Unity Catalog" should always ask *which one*, because the operational model, feature set, and portability guarantees differ sharply between them.

## 6. Snowflake Horizon and Apache Polaris

Snowflake followed almost the same two-version playbook, and seeing it twice makes the industry pattern unmistakable. **Snowflake Horizon** is the managed governance and catalog layer inside Snowflake: it unifies discovery, lineage, data quality, and access policies for assets governed by the Snowflake control plane, in the same way the managed Unity Catalog does for Databricks. It is deep, integrated, and proprietary by design.

Alongside it, Snowflake built and then donated **Apache Polaris**, an open-source catalog implementation of the Iceberg REST specification. Polaris lets any Iceberg-compatible engine — Spark, Trino, Flink, Snowflake itself — read and write the same tables through a vendor-neutral API, with credential vending and role-based access control built in. As an Apache project it is governed in the open; the <a href="https://polaris.apache.org/" rel="nofollow noopener">Apache Polaris site</a> documents the REST catalog model and how engines connect to it. The pairing is deliberate: Horizon for teams that live inside Snowflake, Polaris for teams that want their Iceberg tables to outlive any single platform.

The Iceberg REST catalog standard is the connective tissue under all of this, and it is the most important structural shift since the Hive Metastore. Because Polaris, the open Unity Catalog, Glue's newer endpoints, and others increasingly implement the same REST spec, a table written through one can, in principle, be read through another. That convergence is what makes "open catalog" more than marketing — it is a real, testable interface contract, and it pushes differentiation up the stack into governance, lineage, and performance rather than the raw question of where a table's files live.

## 7. Open metadata catalogs: Apache Gravitino and DataHub

A third category sits beside the engine-native catalogs: open metadata catalogs that aim to *federate* across many underlying systems rather than own one. These tools answer a different question — not "where is this one table" but "give me one consistent metadata plane across Hive, Iceberg, Kafka, and three clouds at once." They matter most in heterogeneous estates where no single vendor catalog covers everything.

**Apache Gravitino** is the clearest example. It is an open-source, geo-distributed metadata lake that presents a unified catalog over multiple sources — relational databases, file systems, message queues, and table-format catalogs alike — through a single API, so an engine or agent can resolve metadata without caring which backend stores it. The project is developed in the open at <a href="https://github.com/apache/gravitino" rel="nofollow noopener">apache/gravitino</a>, and its federation model is what distinguishes it from a single-engine catalog like Glue or Horizon. Where Polaris standardizes the interface to one kind of catalog, Gravitino tries to unify many kinds behind one.

DataHub belongs to this open-metadata family too, though it leans toward discovery and lineage rather than serving query engines on the hot path. It ingests metadata from warehouses, lakes, BI tools, and pipelines into a searchable graph, which is closer to the human-facing **[data catalog](/blog/what-is-data-catalog/)** discussed in §2 than to an engine-facing table catalog. The line between "metadata federation" and "discovery catalog" is genuinely blurry here, and that blurriness is the point: as catalogs converge on shared APIs, the same metadata plane is increasingly asked to serve both engines and humans. For teams whose pain is fragmentation across many systems rather than governance within one, this federated layer is often the missing piece.

## 8. Open vs managed catalogs, and how agents use them

Every choice above reduces to one decision, so it helps to make the trade-off explicit rather than vendor by vendor. The table below summarizes how the main options line up on the axes that actually drive the decision.

| Catalog | Model | Open standard | Best when |
| --- | --- | --- | --- |
| Hive Metastore | Self-managed | Hive API (de facto) | Legacy Hadoop/Spark estates already on it |
| AWS Glue | Managed (AWS) | Hive + Iceberg REST | All-in on AWS, want serverless metadata |
| Unity Catalog (managed) | Managed (Databricks) | Proprietary | Deep Databricks governance and lineage |
| Unity Catalog (OSS) | Self/managed | OpenAPI REST | Engine-agnostic governance, hedge lock-in |
| Snowflake Horizon | Managed (Snowflake) | Proprietary | Governance inside Snowflake |
| Apache Polaris | Self/managed | Iceberg REST | Portable Iceberg tables across engines |
| Apache Gravitino | Self-managed | Open, federated | Unifying many catalogs across a mixed estate |

The pattern in that table is the whole story: managed catalogs trade portability for depth, open catalogs trade depth for portability, and the major vendors now offer one of each. A practical rule is to pick the open standard — the Iceberg REST spec, or a federated layer like Gravitino — when more than one query engine will touch the same tables or when avoiding lock-in is a stated goal, and to accept a managed catalog when a single platform is your center of gravity and its governance features earn their keep. Most real architectures end up mixed, which is exactly why the REST standardization matters.

AI data agents add a new consumer to this picture, and they need the catalog for the same reason a query engine does. An agent translating a natural-language question into SQL must know which tables exist, what their columns mean, and where they physically live before it can write a correct query — that is catalog metadata, read at plan time. But a catalog alone is not enough for reliable generation: it records that a `revenue` column exists without recording that net revenue excludes refunds, or that an analyst's last three correct queries joined `orders` to `refunds` a particular way.

This is where executable context layers on top of catalog metadata. Datus, an open-source data engineering agent, builds a Context Engine whose physical dimension reads catalog, schema, and table metadata — surfaced through retrieval handles such as `@catalog` and `@table` — and pairs it with semantic models, reference SQL, and a feedback loop the catalog does not carry. Its native adapters connect to engines like Snowflake and Spark (Delta, Hudi) so the same context spans whichever catalog backs the tables. The catalog answers *what and where*; the agent's context has to answer *what it means and how it has been queried correctly before*. For more on that grounding problem, see [what is a data engineering agent](/blog/what-is-data-engineering-agent/).

## Conclusion

A lakehouse catalog is the engine-facing metadata service that turns files in object storage into queryable tables — registering tables, resolving schemas and locations, and, for open formats, coordinating snapshots and commits. The category evolved from the Hive Metastore through AWS Glue into today's split-personality offerings, where Databricks and Snowflake each run a managed catalog (Unity Catalog, Horizon) beside an open one (Unity Catalog OSS, Apache Polaris), and federated layers like Apache Gravitino unify many catalogs at once. The durable decision is open versus managed: standardize on the Iceberg REST interface when portability matters, lean managed when a single platform's depth pays off. And as AI agents join query engines as catalog consumers, the catalog remains necessary but not sufficient — correct, reliable SQL needs executable context layered on top of the metadata the catalog provides.

## Frequently asked questions

### Is a lakehouse catalog the same as a Hive Metastore?

A Hive Metastore is one early implementation of a lakehouse catalog, and "metastore" became a generic synonym because of how widely it was adopted. Modern lakehouse catalogs do more than HMS did — they natively understand open table formats, snapshots, schema evolution, and fine-grained access control, and many expose an Iceberg REST API rather than the older Hive Thrift interface. Most also ship a Hive-compatible endpoint for backward compatibility, which is why the term persists.

### What is the difference between a lakehouse catalog and a data catalog?

They serve different consumers. A lakehouse catalog is engine-facing: query engines read it on every query to find tables, schemas, and file locations, and write to it on every commit. A discovery [data catalog](/blog/what-is-data-catalog/) such as DataHub or Atlan is human-facing: it indexes assets so people can search, understand, and govern them, and it is read during exploration rather than on the query hot path. The two often integrate — a discovery catalog frequently ingests metadata from the lakehouse catalog — but they are distinct layers.

### Why do Snowflake and Databricks each have two catalogs?

Both vendors run a managed, proprietary catalog (Snowflake Horizon, the managed Unity Catalog) for deep governance and lineage inside their own platform, and an open-source catalog (Apache Polaris from Snowflake, Unity Catalog OSS from Databricks) that implements a vendor-neutral REST interface. The managed version maximizes integration depth; the open version maximizes portability and counters lock-in concerns. Adopting either should start with the question of *which* catalog you mean, since their feature sets and operational models differ.

### How do AI data agents use a lakehouse catalog?

An agent that generates SQL reads the same catalog metadata a query engine does — table names, schemas, and physical locations — to ground its queries in what actually exists. The catalog is necessary but not sufficient: it does not encode business semantics (how net revenue is computed) or historical query patterns. Reliable agents pair catalog metadata with an executable context layer of semantic models, reference SQL, and feedback, so the catalog answers *what and where* while the context answers *what it means*.

## Related articles

- [What Is a Data Catalog? Definition, Tools & How It Differs From Agent Context](/blog/what-is-data-catalog/)
- [What Is a Lakehouse? Definition, Architecture & Open Table Formats](/blog/what-is-lakehouse/)
- [What Is a Data Engineering Agent?](/blog/what-is-data-engineering-agent/)

## About the author

**Harrison Zhao** is the founder of Datus and previously worked on data infrastructure at Alibaba and on the StarRocks TSC. Connect on <a href="https://www.linkedin.com/in/harrison-zhao-ba920621/" rel="nofollow noopener">LinkedIn</a>.
