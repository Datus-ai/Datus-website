---
title: "What Is a Lakehouse? Definition, Architecture & Open Table Formats Explained"
description: "Lakehouse definition, how it differs from data lakes and warehouses, open table formats (Iceberg, Delta, Hudi), and why AI agents need lakehouse-aware context."
author: "Evan Paul"
date: 2026-06-18
lastmod: 2026-06-18
head:
  - - meta
    - name: keywords
      content: "lakehouse, what is a lakehouse, lakehouse architecture, lakehouse vs data warehouse, open table format lakehouse, lakehouse vs data lake"
  - - meta
    - property: og:title
      content: "What Is a Lakehouse? Definition, Architecture & Open Table Formats Explained"
  - - meta
    - property: og:description
      content: "Lakehouse definition, how it differs from data lakes and warehouses, open table formats (Iceberg, Delta, Hudi), and why AI agents need lakehouse-aware context."
  - - meta
    - property: og:type
      content: article
  - - meta
    - property: og:url
      content: https://datus.ai/blog/what-is-lakehouse/
  - - meta
    - property: og:image
      content: https://datus.ai/logo_dark.svg
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - link
    - rel: canonical
      href: https://datus.ai/blog/what-is-lakehouse/
---

# What Is a Lakehouse? Definition, Architecture & Open Table Formats Explained

A data team stores years of clickstream logs in cheap object storage, runs nightly ETL into a cloud warehouse for BI, and maintains a separate streaming pipeline for real-time dashboards. Three systems, three copies of "customer," three definitions of "active user," and a growing bill for moving the same bytes twice. A **lakehouse** is the architecture pattern that tries to collapse this sprawl: keep data in open, low-cost storage, but add warehouse-grade transactions, SQL performance, and governance on top through **open table formats**. This glossary entry defines what a lakehouse is, how it differs from a data lake and a data warehouse, which technologies make it work, and why AI agents querying your stack need to understand it.

*Disclosure: Datus is a data engineering agent platform. This article explains lakehouse architecture as a general concept, referencing Datus alongside other tools and architectures in the category. See the end for more detail.*

## TL;DR

- A **lakehouse** combines **data lake economics and flexibility** with **warehouse-style ACID transactions, schema enforcement, and SQL analytics** — typically on object storage plus an open table format layer.
- It is **not** a vendor product name, **not** a data lake with a SQL engine bolted on, and **not** a replacement for every warehouse — but it reduces duplicate pipelines and copy-heavy "lake + warehouse" splits.
- **Open table formats** — <a href="https://iceberg.apache.org/" rel="nofollow noopener">Apache Iceberg</a>, <a href="https://docs.delta.io/" rel="nofollow noopener">Delta Lake</a>, <a href="https://hudi.apache.org/" rel="nofollow noopener">Apache Hudi</a> — are the technical foundation that makes lakehouse semantics (upserts, time travel, schema evolution) possible on files.
- **Medallion architecture** (Bronze / Silver / Gold) is a common organizational pattern on lakehouses, not a requirement of the definition.
- AI agents and text-to-SQL systems fail on lakehouse estates when they see file paths instead of **table semantics**, miss **partition keys**, or treat **Silver and Gold** layers interchangeably — context must be lakehouse-aware.

## 1. Lakehouse: a working definition

Historically, organizations split analytics into two worlds. **Data lakes** stored raw files cheaply in S3, ADLS, or GCS — flexible, schema-on-read, weak on concurrent SQL and transactional updates. **Data warehouses** offered fast SQL, strong governance, and ACID guarantees — but often at higher cost and with less openness for ML and custom file processing.

A lakehouse merges the storage economics of the lake with warehouse-like capabilities by inserting a **table abstraction layer** on object storage. You still store Parquet (or similar) files in a bucket. But an open table format tracks which files belong to which table version, enables concurrent writers, supports `UPDATE`/`MERGE`, and exposes the table through SQL engines (Spark, Trino, Snowflake external tables, Databricks SQL, etc.).

Consider a concrete example. A growth team asks for "weekly active users by country from our product events table." In a pure data lake, an analyst might grep paths like `s3://events/year=2026/month=06/day=15/*.parquet`, hope partition columns are consistent, and write fragile SQL that breaks when someone adds a new folder layout. In a lakehouse, they query `analytics.events` — a governed table with documented columns, partition spec `country`, and ACID commits so yesterday's backfill does not race with today's stream ingest. The SQL looks like a warehouse. The storage underneath is still open files.

A useful working definition:

> **Lakehouse** is an architecture that stores analytical data primarily on **open, low-cost object storage**, managed through **open table formats** that provide **ACID transactions, schema evolution, and SQL-accessible tables**, blending data lake flexibility with warehouse-grade reliability.

That definition excludes "we put Parquet in S3 and query it with Athena sometimes" without transactional table semantics — that is a **data lake with ad hoc SQL**, not a full lakehouse practice. It also excludes proprietary walled gardens with no open format exit — those may behave like a lakehouse operationally but fail the openness part of the industry definition.

## 2. Lakehouse vs data lake vs data warehouse

These three terms overlap in marketing but differ in default guarantees:

| Dimension | Data lake | Lakehouse | Data warehouse |
| --- | --- | --- | --- |
| **Primary storage** | Object storage, raw files | Object storage + table format layer | Proprietary columnar store (often) |
| **Schema** | Schema-on-read; weak enforcement | Schema evolution with enforced table metadata | Schema-on-write; strong typing |
| **Transactions** | Usually none at file set level | ACID at table level (format-dependent) | Full ACID |
| **Typical workloads** | Ingest everything; ML feature stores | Unified analytics + ML on same tables | BI SQL, curated marts |
| **Cost profile** | Lowest storage $ | Low storage + compute separation | Higher platform $ |
| **Openness** | Open files | Open files + open formats | Often proprietary |

**Lakehouse vs data lake:** A data lake optimizes for **landing raw data cheaply**. A lakehouse adds **table contracts** — you agree on what `events` means, which files are visible, and which commits are atomic. Without that layer, agents and analysts inherit path archaeology.

**Lakehouse vs data warehouse:** Modern cloud warehouses increasingly support external tables and Iceberg/Delta reads — the boundary blurs. The architectural intent differs: lakehouse centers **open storage you can read with multiple engines**; traditional warehouse centers **a single optimized SQL runtime**. Many teams run **both** — lakehouse for raw and ML zones, warehouse for certified marts — which is why [data catalog](/blog/what-is-data-catalog/) and [semantic layer](/blog/what-is-semantic-layer/) work spans both.

## 3. Open table formats: the lakehouse engine room

Lakehouse is not one product — it is a pattern built on **open table formats** (sometimes called **table formats** or **lakehouse formats**):

| Format | Origin / ecosystem | Strengths | Common engines |
| --- | --- | --- | --- |
| **Apache Iceberg** | Netflix → Apache; vendor-neutral | Hidden partitioning, time travel, broad engine support | Spark, Trino, Flink, Snowflake, BigQuery |
| **Delta Lake** | Databricks → Linux Foundation | Unified batch/streaming, tight Spark integration | Spark, Databricks SQL, some external readers |
| **Apache Hudi** | Uber → Apache | Incremental upserts, streaming ingest | Spark, Flink, Hive |

All three solve a similar problem: **object storage is not a database**. Files appear, disappear, and list inconsistently under concurrent writers. Table formats maintain a **metadata layer** (manifests, snapshots) so queries see consistent snapshots and writers can commit atomically.

For data engineering agents, this matters practically. An agent generating SQL against `iceberg.analytics.orders` must understand **snapshot isolation**, **partition transforms** (day vs hour buckets), and whether **`MERGE`** is supported — not just column names. Schema evolution — adding a column without rewriting all history — is a lakehouse benefit that also breaks naive "dump entire DDL into the prompt" context strategies.

## 4. Why organizations adopt lakehouse architecture

Common triggers:

- **Copy fatigue** — ETL copies raw lake → warehouse daily; storage and sync cost dominate.
- **ML + SQL convergence** — Data scientists want Python/Spark on the same tables analysts query in SQL.
- **Governance on raw zones** — Bronze layers need auditability, not just a dumping ground.
- **Vendor exit strategy** — Open formats reduce lock-in vs proprietary storage only.

Failure modes when the pattern is adopted without discipline:

- **"Lakehouse" label on a raw bucket** — no table format, no governance → worse than a honest data lake.
- **Gold-layer sprawl** — dozens of "curated" tables with overlapping grains and no [semantic layer](/blog/what-is-semantic-layer/) → metric drift returns.
- **Engine fragmentation** — Iceberg table readable in Spark but not tested in the BI tool users actually run.

Adoption signals that indicate maturity: documented **medallion** or domain layers, catalog integration, format choice written down, and SLAs on Silver/Gold freshness — not just a POC notebook.

## 5. Medallion architecture on a lakehouse

**Medallion architecture** (Bronze / Silver / Gold) is a **layering convention** popularized in Databricks documentation and widely reused:

| Layer | Typical contents | Quality bar |
| --- | --- | --- |
| **Bronze** | Raw ingest, minimal transform | Append-only, schema as landed |
| **Silver** | Cleaned, conformed, deduplicated | Typed columns, standard keys |
| **Gold** | Business aggregates, KPI-ready | Certified metrics, star/summary tables |

Medallion is **not** synonymous with lakehouse — you can run a lakehouse without medallion labels, or label medallion layers inside a warehouse. But on lakehouses, medallion gives agents and humans a **navigable hierarchy**: an agent answering executive KPI questions should prefer Gold definitions; an engineer debugging ingest should inspect Bronze paths and Silver rejects.

Agents that treat all layers as interchangeable produce **plausible wrong numbers** — e.g., counting raw click events in Bronze when Gold already deduplicates sessions.

## 6. Lakehouse and AI agents — context requirements

Text-to-SQL and [data engineering agents](/blog/what-is-data-engineering-agent/) need more than column lists on lakehouse estates:

| Context gap | Symptom | What to inject |
| --- | --- | --- |
| **Table vs path confusion** | SQL targets `s3://...` instead of registered table | Catalog entries with physical + logical names |
| **Layer ambiguity** | Revenue from Bronze vs Gold | Layer tags, certified table list |
| **Format capabilities** | `MERGE` against read-only snapshot | Engine + format feature matrix |
| **Partition pruning** | Full table scan, timeout | Partition spec, required filters |
| **Time travel** | Mixing snapshots in one report | Snapshot ID or "as of" policy |

This is why [schema linking](/blog/what-is-schema-linking/) on lakehouse data is harder than on a 50-table Postgres instance: more tables, more layers, more engines — and more ways to be syntactically correct but semantically wrong.

Tools in the ecosystem — Spark, Trino, Databricks, Snowflake Iceberg tables — each expose slightly different SQL dialect and transaction boundaries. An agent without engine-scoped context may generate valid Spark SQL for a Trino cluster.

## 7. Evaluation checklist: is your lakehouse ready for agents?

Before pointing an agent at lakehouse tables, teams can sanity-check:

1. **Catalog coverage** — Are Bronze/Silver/Gold tables registered with owners and descriptions?
2. **Certified Gold list** — Which tables are approved for executive metrics?
3. **Semantic definitions** — Do top KPIs link to Gold tables with documented grain?
4. **Reference SQL library** — Are vetted queries tagged by layer and engine?
5. **Format documentation** — Iceberg vs Delta vs Hudi per domain — and which engines are supported?
6. **Freshness SLAs** — When did Silver last succeed? Is Gold stale?

Missing items 1–3 predict the same class of failures as text-to-SQL on large warehouses — with extra layer confusion.

## 8. When a lakehouse is enough — and when to keep a warehouse

**Lakehouse-first fits when:**

- Open storage + multi-engine access is a strategic requirement
- ML and SQL share large raw/intermediate datasets
- Team can invest in table format operations (compaction, retention, ACLs on storage)

**Keep a dedicated warehouse (or warehouse marts) when:**

- Sub-second BI on heavily modeled dimensions is the primary SLA
- Organization standardizes on one vendor SQL runtime with mature workload management
- Legal/compliance mandates proprietary storage controls hard to map to object ACLs alone

Hybrid architectures are normal — lakehouse for ingest and ML features, warehouse for curated BI — bridged by [semantic layers](/blog/what-is-semantic-layer/) and catalogs.

Open-source data engineering agents that emphasize **cross-stack context** aim to span both sides without forcing a rip-and-replace narrative — connecting to warehouse adapters and lakehouse tables through a unified catalog view rather than betting on one storage religion.

## Conclusion

A **lakehouse** is best understood as **governed tables on open storage** — not a marketing sticker on a raw bucket. Open table formats supply the ACID and schema machinery; medallion and domain layering supply organizational clarity. For AI agents, lakehouse complexity moves failures from syntax to **layer, format, and engine context** — the same shift that separates demo-grade text-to-SQL from production-grade [data engineering agents](/blog/what-is-data-engineering-agent/).

## Frequently asked questions

### Is Databricks a lakehouse?

Databricks popularized the term and ships a tightly integrated lakehouse stack (Delta Lake + Spark + SQL warehouse). Databricks is **a vendor implementation**, not the definition of lakehouse. Teams run lakehouse patterns on AWS, GCP, Azure, and OSS stacks without Databricks — using Iceberg or Hudi with Trino, Flink, or Snowflake external tables.

### Lakehouse vs data mesh — are they the same?

No. **Lakehouse** describes **how data is stored and queried** (storage + table format + SQL). [Data mesh](/blog/what-is-data-mesh/) describes **how ownership and delivery are organized** (domain-oriented data products). A mesh domain can expose a lakehouse table as its product API — complementary ideas.

### Do I need all three formats (Iceberg, Delta, Hudi)?

No. Most organizations standardize on **one primary format per lake** (often Iceberg or Delta) to reduce operational sprawl. Multi-format estates usually reflect mergers or team autonomy — agents and catalogs should document which format applies where.

### Can text-to-SQL work on a lakehouse without a catalog?

For small POC schemas, yes — paste DDL and pray. For production lakehouses with hundreds of tables across layers, **without a catalog and semantic definitions**, accuracy collapses. Invest in catalog + certified Gold + reference SQL before blaming the model.

### What changed in 2024–2026 for lakehouses?

Engine support for Iceberg converged across major warehouses and query engines; **Iceberg became the default "neutral" format** in many greenfield architectures. Agent and copilot vendors began advertising lakehouse awareness — but awareness in marketing rarely equals layer-aware context in the product. Verify with your own tables, not slide decks.

## Related articles

- [What is a data engineering agent?](/blog/what-is-data-engineering-agent/) — why persistent context matters on complex estates
- [What is a data catalog?](/blog/what-is-data-catalog/) — discovery layer lakehouses depend on
- [What is a semantic layer?](/blog/what-is-semantic-layer/) — governed metrics atop Gold tables

---

*Disclosure: Datus is a data engineering agent platform. This glossary entry explains lakehouse architecture as a general concept and how cross-stack agents approach lakehouse context — alongside other tools and architectures in the category.*
