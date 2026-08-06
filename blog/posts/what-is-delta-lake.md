---
title: "What Is Delta Lake? Definition, Transaction Log & Delta vs Iceberg"
description: "Delta Lake definition, how its ACID transaction log, deletion vectors and UniForm work, Delta Lake vs Iceberg vs Hudi, and why AI agents need table context."
author: "Evan Paul"
date: 2026-07-02
lastmod: 2026-07-02
head:
  - - meta
    - name: keywords
      content: "delta lake, what is delta lake, delta lake table format, delta lake vs iceberg, delta lake transaction log, deletion vectors, delta uniform, lakehouse table format"
  - - meta
    - property: og:title
      content: "What Is Delta Lake? Definition, Transaction Log & Delta vs Iceberg"
  - - meta
    - property: og:description
      content: "Delta Lake definition, how its ACID transaction log, deletion vectors and UniForm work, Delta Lake vs Iceberg vs Hudi, and why AI agents need table context."
  - - meta
    - property: og:type
      content: article
  - - meta
    - property: og:url
      content: https://datus.ai/blog/what-is-delta-lake/
  - - meta
    - property: og:image
      content: https://datus.ai/logo_dark.svg
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - link
    - rel: canonical
      href: https://datus.ai/blog/what-is-delta-lake/
---

# What Is Delta Lake? Definition, Transaction Log & Delta vs Iceberg

A compliance ticket says "delete every row for user 88213." An engineer runs that delete against a Parquet-based data lake at the exact moment a streaming job is appending the day's events to the same table. Nothing coordinates the two writers, so for a few minutes the folder holds a half-rewritten set of files — and a revenue dashboard that reads the table during that window returns a number that is neither the value before the delete nor the value after. No error is thrown; the figure just looks plausible and is wrong. **Delta Lake** exists to make that window impossible: it wraps a directory of Parquet files in an ACID transaction log so every reader resolves to one fully committed version of the table. This glossary entry defines what Delta Lake is, how its transaction log works, how it compares to Apache Iceberg and Hudi, and why AI agents querying a lakehouse have to understand it.

*Disclosure: Datus is a data engineering agent platform. This article explains Delta Lake as a general concept, referencing Datus alongside other tools and architectures in the category. See the end for more detail.*

## TL;DR

- **Delta Lake** is an open-source table format that adds an ACID **transaction log** on top of Parquet files, turning object storage into a database-style table with schema enforcement, time travel, DML, and unified batch/streaming reads.
- It is **not** a query engine, **not** a catalog, and **not** a Databricks-only feature — it is an open protocol (Linux Foundation) that Spark, Trino, Flink, and warehouses like Snowflake and BigQuery can read.
- The **transaction log** (`_delta_log`) is the core mechanism: an ordered series of JSON commits, with periodic checkpoints, that records exactly which Parquet files make up each version of the table.
- Modern Delta adds **deletion vectors** (row-level deletes without rewriting files), **liquid clustering** (adaptive layout that supersedes Z-ordering), and **UniForm** (exposing Delta tables through Iceberg/Hudi metadata).
- Against Iceberg and Hudi, Delta's edge is the **depth of its Spark/Databricks integration**; agents break on Delta when they ignore the log, assume `MERGE` is free, or read files already removed by `VACUUM`.

## 1. Delta Lake: a working definition

Delta Lake originated at Databricks and was open-sourced in 2019, later moving under the neutral governance of the Linux Foundation. The problem it set out to solve was specific. Data lakes built on cheap object storage were fast, open, and cheap, but they had no transactions: two concurrent writers could corrupt a table, a job that died halfway left orphaned files behind, and there was no clean way to roll a table back to a known-good state. Delta's answer was deliberately conservative — keep the data as ordinary Parquet, but add a transaction log directory (`_delta_log`) alongside it that records every change as an atomic commit.

The mechanics are worth stating plainly, because they drive everything else. A write produces new Parquet data files and then appends a JSON commit to the log that lists which files this version *adds* and which it *removes*. A reader reconstructs the current table by replaying that log — accelerated by periodic Parquet checkpoints — so it always lands on a fully committed version rather than a folder mid-rewrite. Concurrency is optimistic: two writers can work in parallel, but whichever commit lands second must validate that it does not conflict with the first, and it retries if it does. That is how Delta delivers ACID guarantees on storage systems that natively offer only single-file atomicity.

A useful working definition:

> **Delta Lake** is an open-source storage and table format that layers a file-based ACID **transaction log** over Apache Parquet data files on object storage or a file system. The log — an ordered sequence of JSON commits with periodic checkpoints — records which data files constitute each version of a table, giving readers a consistent snapshot and writers atomic, serializable commits. On that foundation Delta provides **schema enforcement and evolution, time travel, `MERGE`/`UPDATE`/`DELETE` DML, and unified batch-and-streaming** access to a single copy of data. It is **not** a query engine (Spark, Trino, Flink, or a warehouse executes the SQL), **not** a catalog (it still needs one to map table names to storage paths), and **not** proprietary to Databricks (the protocol is open and multi-engine). Delta Lake is, in short, the reliability layer that lets a directory of files behave like a transactional table.

That definition deliberately draws a few boundaries. Delta Lake is not a [data warehouse](/blog/what-is-data-warehouse/); it is the table abstraction that lets a [lakehouse](/blog/what-is-lakehouse/) behave warehouse-like on open storage. It is not a substitute for a [data catalog](/blog/what-is-data-catalog/), which still maps names, owners, and permissions to the tables Delta manages. And it is a level above Parquet rather than a replacement for it: Parquet is the columnar file, while Delta is the protocol that turns many Parquet files plus a log into one governed, versioned table.

## 2. Delta Lake vs Iceberg vs Hudi

Delta Lake is one of three dominant open table formats, and because we cover [Apache Iceberg](/blog/what-is-apache-iceberg/) and [Apache Hudi](/blog/what-is-apache-hudi/) in depth elsewhere, the table below reads the field from Delta's vantage point. The question teams actually ask is not "which has more features" — all three now deliver ACID tables on object storage — but "which format leans toward which ecosystem and workload."

| Dimension | Delta Lake | Apache Iceberg | Apache Hudi |
| --- | --- | --- | --- |
| **Origin / steward** | Databricks → Linux Foundation | Netflix → Apache | Uber → Apache |
| **Core design bet** | Deep Spark/Databricks integration | Engine-neutral metadata | Streaming upserts & incremental |
| **Metadata model** | Ordered log + checkpoints | Snapshot/manifest tree | Timeline + record-level index |
| **Row-level deletes** | Deletion vectors (merge-on-read) | Copy-on-write / merge-on-read | Copy-on-write **and** merge-on-read |
| **Cross-format reads** | UniForm exposes Iceberg/Hudi metadata | Broad native engine support | Reads via Spark, Flink, Trino, Hive |
| **Sweet spot** | Databricks-centric lakehouse, unified batch+streaming | Multi-engine analytics, vendor exit | High-frequency upserts, CDC ingest |

Read the table by sweet spot rather than by row count, because the three formats have steadily copied one another's capabilities. Delta Lake is hard to beat when your stack is already centered on Spark and Databricks, where its integration — from `MERGE` performance to streaming sinks to Unity Catalog governance — runs deepest. Iceberg's strongest counter-argument is engine neutrality: if reading the same tables from several engines and avoiding lock-in to one compute vendor is a strategic requirement, Iceberg was built for that from day one, and that is a genuine advantage Delta answers with UniForm rather than out-argues. Hudi earns its place where mutable, high-frequency upserts and change-data-capture ingestion dominate, because record-level indexing is its native concern.

The more interesting development is that the format war is softening. Delta's **UniForm** writes Iceberg (and Hudi) metadata alongside the Delta log, so an Iceberg-only reader can consume a Delta table without a migration. Treating the choice as tribal allegiance is the common mistake; most organizations standardize on one primary format per lake to limit operational sprawl, then document the exceptions where a specific domain genuinely needs another.

## 3. How Delta Lake works: log, deletion vectors, and clustering

The features teams lean on most in production are the transaction log, deletion vectors, and adaptive clustering, and each is easiest to understand through the failure it prevents.

The **transaction log** is the whole trick. Every commit is an ordered, numbered JSON file in `_delta_log` describing the add/remove file actions for that version, plus metadata and schema. Because a read replays this log to a single version, a report generated at 9:00 a.m. is reproducible even after a noon backfill, and `VERSION AS OF` or `TIMESTAMP AS OF` lets you audit exactly what a dashboard saw last week. Rollback is the same mechanism in reverse: a bad write is undone by restoring an earlier version rather than by hunting through file backups.

**Deletion vectors** changed how Delta handles row-level deletes. Introduced in the Delta Lake 2.x line and matured across 3.x, they let an `UPDATE` or `DELETE` mark affected rows in a compact bitmap instead of rewriting entire Parquet files — a merge-on-read approach that, per <a href="https://delta.io/blog/" rel="nofollow noopener">the Delta Lake project</a>, cuts write amplification dramatically for the small, compliance-driven deletes (like that "delete user 88213" ticket) that used to force a full-file rewrite. **Liquid clustering**, the successor to fixed partitioning and Z-ordering, then keeps high-cardinality data physically well-organized for queries without the brittleness of a hand-chosen partition column. Both features are documented in the <a href="https://docs.delta.io/latest/index.html" rel="nofollow noopener">Delta Lake protocol and documentation</a>, and both raise the reader-version requirement — a detail that matters when a non-Databricks engine tries to read the table.

There is a sharp edge here worth naming: `VACUUM`. It permanently removes data files no longer referenced by recent versions, which reclaims storage but also caps how far back time travel can reach. Set the retention window too low and you break not only historical `AS OF` queries but, occasionally, long-running readers that still reference now-deleted files and fail with a missing-file error.

## 4. Why organizations adopt Delta Lake

The triggers for adopting Delta are usually painful enough to be concrete rather than aspirational. Teams move when the cost of *not* having table semantics shows up in incidents, in compliance exposure, or in a duplicated batch-and-streaming pipeline that is expensive to keep in sync.

- **Reliability incidents** — partial reads, orphaned files from failed jobs, and "the dashboard changed overnight" mysteries that trace back to non-atomic writes.
- **Row-level compliance** — GDPR/CCPA deletes and corrections that need to touch specific rows without rewriting terabytes, which is exactly what deletion vectors are for.
- **Unified batch + streaming** — one Delta table serving both a Structured Streaming sink and hourly batch reads, avoiding a second copy of the data.
- **Databricks-centric stacks** — organizations standardizing on Spark and Unity Catalog, where Delta is the default and best-integrated format.

Adoption disappoints, however, when Delta is treated as a switch to flip rather than a set of operational habits. The most common failure mode is never scheduling `OPTIMIZE`, so a streaming pipeline accumulates thousands of tiny files and query latency quietly degrades until someone blames "the lakehouse." A close second is setting `VACUUM` retention too aggressively and losing the ability to roll back or time-travel exactly when an incident makes those features valuable. The maturity signal is not "we use Delta" but "we run compaction, retention, and catalog governance as routine operations" — the same discipline any serious lakehouse table format demands.

## 5. Delta Lake and AI agents: the context problem

Delta Lake makes human-written SQL more trustworthy, but it raises the bar for AI agents and [text-to-SQL](/blog/what-is-text-to-sql/) systems, because a column list alone does not capture what the format cares about. An agent that knows table and column names but nothing about the log, deletion vectors, or reader-version requirements will generate SQL that is syntactically valid and semantically wrong.

| Context gap | Agent symptom | What it needs injected |
| --- | --- | --- |
| **Path vs table** | Targets `s3://.../*.parquet` instead of the Delta table | Catalog entry mapping files to a logical table |
| **Version semantics** | Mixes table versions across a multi-step report | A version/timestamp policy or pinned `AS OF` |
| **MERGE cost** | Assumes an `UPDATE`/`MERGE` is cheap and non-blocking | Deletion-vector vs rewrite behavior and table size |
| **Engine/reader version** | Runs Databricks-only SQL on a Trino reader | Engine-scoped dialect + supported protocol version |
| **VACUUM window** | Queries a version already purged by retention | Retention policy and available time-travel range |

This is why [schema linking](/blog/what-is-schema-linking/) on a Delta estate is harder than on a small Postgres instance: there are more tables, more table versions, and more engines, and therefore more ways to be right in syntax and wrong in result. A [data engineering agent](/blog/what-is-data-engineering-agent/) needs evolvable, table-format-aware context — not a one-time DDL dump that goes stale the moment a schema evolves or `VACUUM` runs.

Open-source agents that target cross-stack work approach this by reading lakehouse tables through a catalog view rather than raw paths, and by carrying protocol and layout metadata into the model's context. As of June 2026, Datus connects to Delta Lake and Hudi tables through a Spark adapter (v0.2.6) and builds a catalog-backed context tree, so generated SQL references governed tables and their current versions rather than guessing at folder layouts. That is one implementation pattern among several; the general requirement — context that evolves with the table — holds regardless of tool.

## 6. Production-readiness checklist for Delta + agents

Before pointing analysts or an agent at Delta tables, a short checklist predicts most downstream failures.

1. **Catalog registration** — Is every table registered with an owner, description, and physical/logical mapping?
2. **Compaction** — Is `OPTIMIZE` (and clustering) scheduled so streaming writes do not degrade into a small-file problem?
3. **Retention policy** — Is `VACUUM` retention set to protect the time-travel and rollback window your incidents actually need?
4. **Reader-version matrix** — Which engines read each table, and do they support the protocol features (deletion vectors, column mapping) in use?
5. **Certified tables** — Which Delta tables are approved for executive metrics versus exploratory use?
6. **Reference SQL** — Are vetted queries tagged by engine so agents have correct examples to imitate?

Missing items 1–3 reliably reproduce the small-file and lost-history failures described above; missing items 4–6 are where agents specifically go wrong. The checklist is intentionally engine-agnostic — it holds whether your compute is Databricks, open-source Spark, or a warehouse reading Delta externally.

## Conclusion

**Delta Lake** is best understood as a transaction log that turns a pile of Parquet files into a trustworthy table: ordered commits for atomic, reproducible reads; deletion vectors for cheap row-level compliance; and adaptive clustering that keeps queries fast without brittle partitioning. Its defining strength against Iceberg and Hudi is the depth of its Spark and Databricks integration, while UniForm quietly lowers the stakes of picking a format at all. For AI agents, Delta moves the hard problems from syntax to **version, protocol, and retention context** — the same shift that separates a demo from a production-grade [data engineering agent](/blog/what-is-data-engineering-agent/).

## Frequently asked questions

### Is Delta Lake open source, or is it a Databricks product?

Both descriptions are partly right, which is the source of the confusion. The Delta Lake format and protocol are **open source** and governed by the Linux Foundation, and multiple engines — Spark, Trino, Flink, and warehouses reading external tables — can work with Delta tables. Databricks created Delta and offers the deepest managed implementation of it (with Unity Catalog, Photon, and proprietary optimizations), but the table format itself is not locked to Databricks.

### Delta Lake vs Parquet — what's the difference?

Parquet is a **columnar file format**: one file of compressed, columnar data. Delta Lake is a **table format** layered on top of many Parquet files plus a transaction log. Parquet gives you efficient storage and scans; Delta adds ACID transactions, schema enforcement, time travel, row-level DML, and a single consistent view across all those files. You do not choose one *or* the other — a Delta table *is* Parquet data with a log that makes it transactional.

### Delta Lake vs Iceberg — which should I choose?

Choose by ecosystem rather than a feature checklist, since the two have converged on most capabilities. **Delta Lake** is the natural fit when your stack is centered on Spark and Databricks, where its integration runs deepest. **Iceberg** wins when engine neutrality and avoiding vendor lock-in are strategic goals. Delta's UniForm narrows the gap by exposing Iceberg metadata over Delta tables, so many teams standardize on one format and document the exceptions.

### Can a text-to-SQL agent query Delta Lake without extra context?

For a tiny POC table, paste the DDL and it may work. For a production Delta estate with many tables, evolving schemas, multiple engines, and a `VACUUM` retention policy, an agent needs **catalog mappings, a version/time-travel policy, and an engine/reader-version matrix** in its context, or it will produce valid SQL with wrong results. Invest in catalog and certified-table context before blaming the model for inaccuracy.

## Related articles

- [What is Apache Iceberg?](/blog/what-is-apache-iceberg/) — the engine-neutral table format Delta is most often compared to
- [What is a lakehouse?](/blog/what-is-lakehouse/) — the architecture Delta tables make possible
- [What is a data engineering agent?](/blog/what-is-data-engineering-agent/) — why table-format-aware context matters

---

*Disclosure: Datus is a data engineering agent platform. This glossary entry explains Delta Lake as a general concept and how cross-stack agents approach lakehouse context — alongside other tools and architectures in the category.*
