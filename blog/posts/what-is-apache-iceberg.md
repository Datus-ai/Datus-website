---
title: "What Is Apache Iceberg? Table Format, Features & Iceberg vs Delta Lake"
description: "Apache Iceberg definition, how its hidden partitioning, snapshots and schema evolution work, Iceberg vs Delta Lake vs Hudi, and why AI agents need table-aware context."
author: "John Smith"
date: 2026-06-30
lastmod: 2026-06-30
head:
  - - meta
    - name: keywords
      content: "apache iceberg, what is apache iceberg, iceberg table format, iceberg vs delta lake, iceberg vs hudi, iceberg hidden partitioning, lakehouse table format"
  - - meta
    - property: og:title
      content: "What Is Apache Iceberg? Table Format, Features & Iceberg vs Delta Lake"
  - - meta
    - property: og:description
      content: "Apache Iceberg definition, how its hidden partitioning, snapshots and schema evolution work, Iceberg vs Delta Lake vs Hudi, and why AI agents need table-aware context."
  - - meta
    - property: og:type
      content: article
  - - meta
    - property: og:url
      content: https://datus.ai/blog/what-is-apache-iceberg/
  - - meta
    - property: og:image
      content: https://datus.ai/logo_dark.svg
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - link
    - rel: canonical
      href: https://datus.ai/blog/what-is-apache-iceberg/
---

# What Is Apache Iceberg? Table Format, Features & Iceberg vs Delta Lake

## TL;DR

- **Apache Iceberg** is an open table format that turns a directory of files on object storage into a database-style table with **ACID transactions, schema evolution, hidden partitioning, and time travel** — readable by many engines, owned by no single vendor.
- It is **not** a query engine, **not** a catalog, and **not** a storage system — it is a **metadata specification** layered on top of Parquet, ORC, or Avro files that engines like Spark, Trino, and Flink read and write.
- **Hidden partitioning** and **partition evolution** let you change how a table is physically laid out without rewriting queries — the failure mode in the opening story simply cannot occur.
- Against **Delta Lake** and **Apache Hudi**, Iceberg's distinguishing bet is **engine neutrality**: it was designed from the start to avoid coupling table semantics to one compute vendor.
- AI agents and text-to-SQL systems break on Iceberg estates when they reason about **file paths instead of table snapshots**, ignore **partition transforms**, or assume a `MERGE` works the same across engines — context must be table-format-aware.

A data engineer partitions a large events table in Hive by a string column, `dt='2026-06-15'`, and ships it. Six months later the business wants hourly granularity. A backfill rewrites the underlying folders, a few late files land in the wrong directory, and every downstream query that hard-coded `WHERE dt = '2026-06-15'` quietly returns partial results — no error, just wrong numbers in a board deck. **Apache Iceberg** is the open table format designed to make this entire class of failure structurally impossible: it tracks which files belong to a table, hides partition logic from the query, and commits changes atomically. This glossary entry defines what Iceberg is, how its core mechanics work, how it compares to Delta Lake and Hudi, and why AI agents querying a lakehouse need to understand it.

## 1. Apache Iceberg: a working definition

Iceberg originated at Netflix to solve correctness and scale problems with Hive tables on petabyte-scale data lakes, and was donated to the Apache Software Foundation, where it is now a top-level project. The motivation was concrete: Hive tracked tables as directory listings, so concurrent writers, partial commits, and partition layout changes produced silent corruption and inconsistent reads. Iceberg replaced directory-as-table with an explicit metadata tree that records exactly which data files constitute each version of a table.

The mechanics are worth stating plainly because they drive everything downstream. A write does not modify a folder in place; it produces a new **snapshot** that points to a manifest list, which points to manifest files, which point to the actual data files. Readers always resolve a table to one immutable snapshot, so a long-running analytics query never sees a half-finished backfill. Writers commit by atomically swapping a metadata pointer, which is how Iceberg delivers ACID semantics on storage that is itself only eventually consistent.

Consider the opening scenario again, but on Iceberg. The events table is partitioned with a **transform** — say `days(event_ts)` — rather than a hand-maintained `dt` string. Analysts query `WHERE event_ts >= '2026-06-15'` against logical columns, and Iceberg prunes partitions internally. When the team later wants hourly buckets, they evolve the partition spec; old data keeps its old layout, new data uses the new one, and **no query is rewritten**. The string-partition trap that returned partial board numbers is gone because the query never referenced physical partitions at all.

A useful working definition:

> **Apache Iceberg** is an open, vendor-neutral table format that manages large analytic datasets on object storage by maintaining a metadata layer of snapshots, manifests, and partition specifications. It provides **ACID transactions, full schema and partition evolution, hidden partitioning, and time travel** over open file formats such as Parquet — exposing a directory of files as a single SQL-accessible table that multiple engines can read and write consistently.

That definition deliberately excludes a few things. Iceberg is **not** a database engine — it executes no SQL itself; Spark, Trino, Flink, Dremio, Snowflake, or BigQuery do that. It is **not** a catalog, though it requires one to map table names to metadata locations. And it is **not** a replacement for a [data warehouse](/blog/what-is-data-warehouse/) — it is the table abstraction that lets a [lakehouse](/blog/what-is-lakehouse/) behave warehouse-like on open storage.

## 2. Iceberg vs Delta Lake vs Hudi

Iceberg is one of three dominant open table formats — alongside <a href="https://docs.delta.io/" rel="nofollow noopener">Delta Lake</a> and <a href="https://hudi.apache.org/" rel="nofollow noopener">Apache Hudi</a> — and the differences are real even though all three deliver ACID tables on object storage. The table below answers a single question teams actually ask: which format leans toward which workload and ecosystem?

| Dimension | Apache Iceberg | Delta Lake | Apache Hudi |
| --- | --- | --- | --- |
| **Origin / steward** | Netflix → Apache | Databricks → Linux Foundation | Uber → Apache |
| **Core design bet** | Engine-neutral metadata | Tight Spark/Databricks integration | Streaming upserts & incremental |
| **Partition handling** | Hidden partitioning + evolution | Directory partitioning, generated columns | Partition + record-level index |
| **Update model** | Copy-on-write / merge-on-read | Copy-on-write (deletion vectors for MOR-like) | Copy-on-write **and** merge-on-read |
| **Engine breadth** | Broadest (Spark, Trino, Flink, Snowflake, BigQuery) | Strongest in Spark/Databricks; readers elsewhere | Spark, Flink, Hive, Presto/Trino |
| **Sweet spot** | Multi-engine analytics, vendor exit | Databricks-centric lakehouse | High-frequency upserts, CDC ingest |

Read the table by sweet spot rather than by feature count, because the formats have steadily copied each other's capabilities. Iceberg's strongest argument is **engine neutrality**: if your strategy depends on reading the same tables from several engines and avoiding lock-in to one compute vendor, Iceberg was built for that from day one. Delta Lake is hard to beat when your stack is already centered on Spark and Databricks, where its integration is deepest. [Apache Hudi](/blog/what-is-apache-hudi/) earns its place where **mutable, high-frequency upserts and change-data-capture ingestion** dominate, because record-level indexing is its native concern rather than a later addition.

None of these is a universal winner, and treating the choice as a tribal allegiance is the common mistake. Many organizations standardize on one primary format per lake to limit operational sprawl, then document exceptions where a specific domain genuinely needs another. The decision should be written down and discoverable, because — as the next sections show — both humans and agents make wrong calls when the format and its capabilities are implicit.

## 3. How Iceberg works: snapshots, schema evolution, and hidden partitioning

The three Iceberg features teams rely on most in practice are snapshots, schema evolution, and hidden partitioning, and they are easiest to understand through what each one prevents.

**Snapshots and time travel** turn every commit into an immutable, addressable version of the table. Because a read resolves to exactly one snapshot, a report generated at 9:00 a.m. is reproducible even after a noon backfill, and you can query `AS OF` a prior snapshot to audit what a dashboard saw last week. This is also the mechanism behind safe rollbacks: a bad write is undone by repointing metadata at the previous snapshot rather than by restoring files from backup.

**Schema evolution** in Iceberg tracks columns by a stable internal ID rather than by name or position. That detail sounds academic until someone renames a column or reorders fields: in directory-listing formats this can silently re-map data, but in Iceberg the IDs keep historical data correct. You can add, drop, rename, and reorder columns without rewriting existing files, which is what makes long-lived analytic tables maintainable over years rather than quarters.

**Hidden partitioning** is the feature most directly tied to the opening story. The user writes queries against logical columns, and Iceberg stores a partition *transform* — `days(ts)`, `bucket(16, user_id)`, `truncate(10, zip)` — separately from the query. Engines prune partitions automatically, so analysts cannot forget a partition predicate, and the layout can evolve without breaking a single query. For deeper detail, the format is specified publicly in the <a href="https://iceberg.apache.org/spec/" rel="nofollow noopener">Apache Iceberg table specification</a>, which is itself a useful signal of the project's openness.

## 4. Why organizations adopt Iceberg

The triggers for adopting Iceberg are usually painful enough to be specific, not aspirational. Teams move when the cost of *not* having table semantics becomes visible in incidents and bills.

- **Correctness incidents** — silent partial reads, double-counted backfills, and "the dashboard changed overnight" mysteries traceable to non-atomic writes.
- **Multi-engine reality** — data scientists on Spark, analysts on Trino, and a warehouse reading external tables, all needing one consistent view.
- **Vendor-exit strategy** — a board-level requirement that analytical data not be trapped in one proprietary storage format.
- **Schema churn** — fast-moving product schemas where columns are added monthly and rewriting history is not viable.

Adoption fails, however, when Iceberg is treated as a checkbox rather than an operational commitment. A frequent failure mode is enabling Iceberg but never running **compaction**, so thousands of tiny files from streaming writes accumulate and query latency degrades until someone blames "the lakehouse." Another is leaving **snapshot expiration** unconfigured, which quietly grows storage and metadata until expensive cleanups become necessary. The maturity signal is not "we use Iceberg" but "we run compaction, expiration, and catalog governance as routine operations," which is the same discipline a serious [data catalog](/blog/what-is-data-catalog/) practice demands.

## 5. Iceberg and AI agents: the context problem

Iceberg solves correctness for human-written SQL, but it raises the bar for AI agents and text-to-SQL systems, because the format introduces concepts a column list alone does not capture. An agent that knows table and column names but nothing about snapshots, transforms, or engine differences will generate SQL that is syntactically valid and semantically wrong.

| Context gap | Agent symptom | What it needs injected |
| --- | --- | --- |
| **Path vs table** | Targets `s3://.../*.parquet` instead of the registered table | Catalog entry mapping physical files to a logical table |
| **Partition transforms** | Full table scan and timeout; no pruning | Partition spec (`days`, `bucket`, `truncate`) and required filters |
| **Snapshot semantics** | Mixes snapshots across a multi-step report | Snapshot ID or an explicit "as of" policy |
| **Engine divergence** | Spark-only SQL run against a Trino cluster | Engine-scoped dialect and supported operations |
| **Update capability** | Assumes `MERGE` works on a read-only snapshot | Format + engine feature matrix |

This is why [schema linking](/blog/what-is-schema-linking/) on an Iceberg estate is harder than on a small Postgres instance: there are more tables, more layers, and more engines, and therefore more ways to be correct in syntax but wrong in result. A [data engineering agent](/blog/what-is-data-engineering-agent/) needs evolvable, table-format-aware context — not a one-time dump of DDL that goes stale the moment a partition spec evolves.

Open-source agents that target cross-stack work approach this by reading lakehouse tables through a catalog view rather than raw paths, and by carrying metadata about partitions and supported operations into the model's context. As of June 2026, Datus connects to lakehouse tables through native database and Spark adapters and builds a catalog-backed context tree so generated SQL references governed tables and their partitions rather than guessing at folder layouts. That is one implementation pattern among several; the general requirement — context that evolves with the table — holds regardless of tool.

## 6. Production-readiness checklist for Iceberg + agents

Before pointing analysts or an agent at Iceberg tables, teams can sanity-check a short list that predicts most downstream failures.

1. **Catalog registration** — Is every table registered with an owner, description, and physical/logical mapping?
2. **Partition documentation** — Are partition transforms recorded so queries and agents apply the right filters?
3. **Compaction and expiration** — Are small-file compaction and snapshot expiration scheduled, not ad hoc?
4. **Engine matrix** — Which engines read and write each table, and which support `MERGE`/`DELETE`?
5. **Certified tables** — Which Iceberg tables are approved for executive metrics versus exploratory use?
6. **Reference SQL** — Are vetted queries tagged by engine so agents have correct examples to imitate?

Missing items 1–3 reliably reproduce the small-file and partial-read failures described earlier; missing items 4–6 are where agents specifically go wrong. The checklist is engine-agnostic on purpose — it works whether your compute is Spark, Trino, or a warehouse reading Iceberg externally.

## Conclusion

**Apache Iceberg** is best understood as a metadata contract that turns a pile of files into a trustworthy table: snapshots for atomic, reproducible reads; schema evolution for tables that survive years of change; and hidden partitioning that eliminates a whole category of silent wrong-number bugs. Its defining bet against Delta Lake and Hudi is engine neutrality, which matters most to teams that refuse to couple their data to one compute vendor. For AI agents, Iceberg moves the hard problems from syntax to **snapshot, partition, and engine context** — the same shift that separates a demo from a production-grade [data engineering agent](/blog/what-is-data-engineering-agent/).

## Frequently asked questions

### Is Apache Iceberg a database?

No. Iceberg is a **table format** — a metadata specification — not a database or query engine. It defines how files, snapshots, and partitions are tracked so that engines like Spark, Trino, Flink, Snowflake, and BigQuery can read and write the same table consistently. The SQL execution, indexing, and caching all live in those engines, while Iceberg supplies the shared, open table contract underneath them.

### Iceberg vs Delta Lake — which should I choose?

Choose by ecosystem and goals rather than feature checklists, since the two have converged on most capabilities. **Delta Lake** is the natural fit when your stack is centered on Spark and Databricks, where its integration runs deepest. **Iceberg** wins when engine neutrality and avoiding vendor lock-in are strategic — its broad engine support and open governance were design goals from the start. Many teams standardize on one and document the exceptions.

### What is hidden partitioning in Iceberg?

Hidden partitioning means the table's physical partition layout is defined by a transform (such as `days(event_ts)` or `bucket(16, user_id)`) that is stored in metadata, not written into every query. Engines prune partitions automatically from filters on logical columns, so analysts cannot forget a partition predicate, and the partition scheme can evolve without rewriting any existing queries — the single biggest source of Hive-era partition bugs.

### Can a text-to-SQL agent query Iceberg without extra context?

For a tiny POC schema, paste DDL and it may work. For a production Iceberg estate with many tables, evolving partition specs, and multiple engines, an agent needs **catalog mappings, partition specifications, and an engine feature matrix** in its context, or it will produce valid SQL with wrong results. Invest in catalog and certified-table context before blaming the model for inaccuracy.

## Related articles

- [What is a lakehouse?](/blog/what-is-lakehouse/) — the architecture Iceberg tables make possible
- [What is Apache Hudi?](/blog/what-is-apache-hudi/) — the upsert-first table format Iceberg is often compared to
- [What is a data engineering agent?](/blog/what-is-data-engineering-agent/) — why table-format-aware context matters
