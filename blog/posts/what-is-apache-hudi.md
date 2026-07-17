---
title: "What Is Apache Hudi? Upserts, Copy-on-Write vs Merge-on-Read & CDC"
description: "Apache Hudi definition, how copy-on-write and merge-on-read tables, record-level upserts and incremental queries work, Hudi vs Iceberg vs Delta, and agent context."
author: "John Smith"
date: 2026-06-30
lastmod: 2026-06-30
head:
  - - meta
    - name: keywords
      content: "apache hudi, what is apache hudi, hudi upsert, copy on write vs merge on read, hudi incremental query, hudi vs iceberg, hudi vs delta lake"
  - - meta
    - property: og:title
      content: "What Is Apache Hudi? Upserts, Copy-on-Write vs Merge-on-Read & CDC"
  - - meta
    - property: og:description
      content: "Apache Hudi definition, how copy-on-write and merge-on-read tables, record-level upserts and incremental queries work, Hudi vs Iceberg vs Delta, and agent context."
  - - meta
    - property: og:type
      content: article
  - - meta
    - property: og:url
      content: https://datus.ai/blog/what-is-apache-hudi/
  - - meta
    - property: og:image
      content: https://datus.ai/logo_dark.svg
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - link
    - rel: canonical
      href: https://datus.ai/blog/what-is-apache-hudi/
---

# What Is Apache Hudi? Upserts, Copy-on-Write vs Merge-on-Read & CDC

## TL;DR

- **Apache Hudi** is an open table format and incremental data platform that adds **record-level upserts, deletes, change tracking, and incremental queries** to data lakes on object storage.
- Its defining capability is **mutability**: applying a continuous stream of inserts and updates — for example from CDC — to lake tables without full rewrites, which append-only formats handle poorly.
- Hudi offers two table types: **Copy-on-Write (CoW)** optimizes read performance, while **Merge-on-Read (MoR)** optimizes write/ingest latency by deferring compaction.
- A **record-level index** lets Hudi locate and update individual records quickly, which is what makes high-frequency upsert workloads practical at lake scale.
- Against **Iceberg** and **Delta Lake**, Hudi's sweet spot is **streaming ingest and CDC-heavy pipelines**; agents querying Hudi must understand table type and query type, or they will read stale or partial data.

**Apache Hudi** is an open table format and ingestion framework that brings database-style **upserts, deletes, and incremental processing** to data lakes built on object storage. Where most lake tables were designed to be appended to, Hudi was designed from the start to be *mutated*: it can apply a stream of changed records to an existing table efficiently, track every change on a timeline, and let downstream jobs read only what changed since the last run. This glossary entry defines what Hudi is, how its two table types work, how record-level upserts and incremental queries differ from append-only formats, how it compares to Iceberg and Delta Lake, and why AI agents querying a Hudi lakehouse need format-aware context.

## 1. Apache Hudi: a working definition

Hudi was created at Uber to solve a problem append-only lake formats handled badly: ingesting a high-volume stream of *updates*, not just new rows. Uber's data — trips, payments, driver and rider state — changed constantly after first landing, and rewriting entire partitions to apply a handful of updated records was prohibitively expensive. Hudi (the name comes from "Hadoop Upserts Deletes and Incrementals") was donated to the Apache Software Foundation and is now a top-level project. The original problem still defines its character: Hudi treats a lake table as something you continuously merge changes into, with a managed **timeline** recording every commit, so the table can be both mutated and audited.

The mechanics follow from that goal. Every write is recorded on the Hudi **timeline** as an instant with a state, which gives the table a consistent, ordered history and enables rollback and time travel. To make updates cheap, Hudi maintains a **record-level index** that maps a record key to the file group holding it, so an upsert can rewrite or append to the right file instead of scanning everything. This index is the feature most responsible for Hudi's reputation in upsert-heavy workloads, and it is the thing most absent from formats that began as append-only and added updates later.

Consider a concrete pipeline. A change-data-capture stream from an operational Postgres delivers `orders` events — new orders, status changes, cancellations — every few minutes. With an append-only table you would accumulate a log and reconstruct current state with expensive window functions at query time. With Hudi, you define `order_id` as the record key and continuously **upsert** the stream into an `orders` table; the table always reflects current state, late updates land in the right file group via the index, and a deletion propagates as a real delete rather than a tombstone you must remember to filter. The same table also supports an **incremental query** that returns only records changed since a given commit, so a downstream Silver-layer job processes deltas instead of rescanning the whole table.

A useful working definition:

> **Apache Hudi** is an open table format and incremental processing framework for data lakes that provides **record-level upserts and deletes, a managed commit timeline, time travel, and incremental queries** over open file formats on object storage. It is built for **mutable, continuously updated lake tables** — especially streaming and change-data-capture ingestion — exposing files as transactional tables that engines such as Spark, Flink, and Trino can read and write.

That definition draws a few boundaries. Hudi is **not** only a file format — it ships ingestion tooling (the streaming ingest utility, formerly DeltaStreamer) and table services like compaction and clustering, making it more of an *incremental data platform* than a passive spec. It is **not** a query engine — Spark, Flink, Presto/Trino, and Hive execute the SQL. And it is **not** the right default for purely append-only, read-optimized analytics, where a simpler [lakehouse](/blog/what-is-lakehouse/) table format may carry less operational overhead.

## 2. Copy-on-Write vs Merge-on-Read

The single most important Hudi concept to understand before querying or designing a table is its **table type**, because it determines the trade-off between write latency and read latency. The choice is not cosmetic — it changes how fresh data appears and how much work each query does.

| Aspect | Copy-on-Write (CoW) | Merge-on-Read (MoR) |
| --- | --- | --- |
| **On write** | Rewrites affected files with merged data | Writes lightweight delta logs; defers merge |
| **On read** | Reads columnar files directly — fast | Merges base files + delta logs at read time |
| **Write latency** | Higher | Lower |
| **Read latency** | Lower | Higher (until compaction) |
| **Best for** | Read-heavy, moderate update rate | High-frequency ingest, streaming |
| **Freshness** | Visible after each commit | Near-real-time via delta logs |

**Copy-on-Write** rewrites the data files touched by an update so that every read hits clean, columnar files with no merge cost — excellent for read-heavy tables where updates arrive at a moderate pace. The price is paid on write: applying many small updates means repeatedly rewriting files, which becomes expensive under high-frequency ingestion.

**Merge-on-Read** inverts the trade-off. Updates are written as compact delta log files alongside the base files, so ingestion is fast and near-real-time, but readers must merge base and delta files on the fly until a background **compaction** folds the logs into new base files. MoR is the natural choice for streaming and CDC pipelines where ingest latency matters most, provided the team actually runs compaction on a schedule rather than letting delta logs pile up. Choosing CoW for a high-velocity CDC stream — or MoR without scheduled compaction — is a common, self-inflicted performance problem, which is exactly why the table type belongs in any documentation an analyst or agent consults.

## 3. Record-level upserts and incremental queries

Two capabilities distinguish Hudi from append-first formats in day-to-day use: record-level writes and incremental reads. Understanding them is the difference between using Hudi as intended and fighting it.

On the write side, Hudi's **record-level index** is what makes upserts and deletes efficient. Each record has a key, and the index knows which file group holds that key, so applying an update touches only the relevant files rather than rewriting a whole partition. This is why Hudi handles late-arriving and mutating data — corrections, status transitions, GDPR-style deletes — without the partition-rewrite tax that append-only formats incur when forced to update. Deletes are first-class: a delete removes the record, which matters for compliance workflows where a tombstone you must remember to filter is not acceptable.

On the read side, **incremental queries** let a consumer ask "give me only the records that changed since commit *X*." Instead of rescanning an entire table to find what is new, a downstream job pulls the delta and processes it — the lake-native equivalent of reading a change feed. This composes naturally with [medallion architecture](/blog/what-is-medallion-architecture/): a Bronze table ingests raw CDC, and a Silver job incrementally consumes only changed Bronze records to maintain conformed tables, cutting compute dramatically versus full reprocessing. The official <a href="https://hudi.apache.org/docs/overview" rel="nofollow noopener">Apache Hudi documentation</a> details the query types, and the distinction between a *snapshot* query (current state) and an *incremental* query (changes only) is one an agent must respect to avoid double-counting or missing rows.

## 4. Hudi vs Iceberg vs Delta Lake

Hudi sits alongside two other dominant open table formats — <a href="https://iceberg.apache.org/" rel="nofollow noopener">Apache Iceberg</a> and <a href="https://docs.delta.io/" rel="nofollow noopener">Delta Lake</a> — and the comparison is less about who has which feature — they have converged substantially — and more about which workload each was built around. The table below answers which format leans toward which problem.

| Dimension | Apache Hudi | Apache Iceberg | Delta Lake |
| --- | --- | --- | --- |
| **Origin / steward** | Uber → Apache | Netflix → Apache | Databricks → Linux Foundation |
| **Core design bet** | Upserts, CDC, incremental | Engine-neutral metadata | Spark/Databricks integration |
| **Update model** | CoW **and** MoR, record-level index | CoW / MoR, hidden partitioning | CoW; deletion vectors |
| **Incremental reads** | First-class incremental queries | Snapshot-based incremental | Change Data Feed |
| **Sweet spot** | Streaming ingest, mutable tables | Multi-engine analytics, vendor exit | Databricks-centric lakehouse |
| **Engine breadth** | Spark, Flink, Hive, Presto/Trino | Broadest | Strongest in Spark/Databricks |

Read this by sweet spot, because feature-by-feature the three formats keep narrowing the gaps. Hudi's strongest argument is **mutable, high-frequency ingestion**: if your central problem is applying a relentless CDC stream to lake tables with low latency and reading only deltas downstream, Hudi's record-level index and MoR design target exactly that. [Apache Iceberg](/blog/what-is-apache-iceberg/) is the safer default when **engine neutrality and avoiding vendor lock-in** dominate, given its broad engine support. Delta Lake is hard to beat inside the **Spark and Databricks** ecosystem where its integration is deepest.

The honest framing is that there is no universal winner, and a team optimizing purely for read-heavy, multi-engine analytics may find Iceberg simpler to operate than Hudi, whose richer ingest machinery carries more moving parts. The right move is to match the format to the dominant workload, write the decision down, and make it discoverable — because implicit format choices are where both humans and agents go wrong.

## 5. Hudi and AI agents: format-aware context

Hudi's mutability is powerful for pipelines but raises the bar for AI agents and text-to-SQL systems, because correct results depend on concepts a column list never reveals: table type, query type, and the meaning of "current." An agent that knows table and column names but nothing about MoR semantics will confidently return stale or partial data.

| Context gap | Agent symptom | What it needs injected |
| --- | --- | --- |
| **Table type unknown** | Assumes CoW freshness on a MoR table | Table type (CoW/MoR) and compaction status |
| **Query type confusion** | Uses snapshot read when an incremental delta was intended | Query-type policy (snapshot vs incremental) |
| **Record key blindness** | Re-aggregates a log instead of reading current state | Record key and precombine field semantics |
| **Partition + index** | Full scan, ignores record-level index | Partition spec and indexed key documentation |
| **Engine divergence** | Spark-only SQL on a Trino/Hive reader | Engine-scoped dialect and supported operations |

This is why [schema linking](/blog/what-is-schema-linking/) on a Hudi estate is harder than on a plain relational database: the same table answers differently depending on whether you read it as a snapshot or incrementally, and on whether compaction has run. A [data engineering agent](/blog/what-is-data-engineering-agent/) needs evolvable context that captures table type and query semantics, not a static DDL dump that says nothing about how the table is meant to be read.

Open-source agents aimed at cross-stack work address this by reading lake tables through a catalog and carrying table-format metadata into the model's context. As of June 2026, Datus includes a Spark adapter (v0.2.6) that connects to Hudi and Delta Lake tables and builds a catalog-backed context tree, so generated SQL references governed tables and their semantics rather than guessing at raw files. That is one implementation pattern among several; the general requirement — context that reflects how a mutable table is actually read — holds regardless of tool, and acknowledging that a managed Databricks or warehouse path may suit some teams better is part of choosing honestly.

## 6. Production-readiness checklist for Hudi + agents

Before pointing analysts or an agent at Hudi tables, a short checklist predicts most failures, because Hudi's flexibility is also its sharpest edge.

1. **Table type documented** — Is each table CoW or MoR, and is the choice justified by its workload?
2. **Compaction scheduled** — For MoR tables, does compaction run on a schedule so reads do not degrade?
3. **Record keys and precombine** — Are record keys and the precombine (ordering) field documented per table?
4. **Query-type policy** — When should consumers use snapshot vs incremental queries?
5. **Catalog registration** — Are tables registered with owners, partitions, and physical/logical mappings?
6. **Reference SQL** — Are vetted queries tagged by engine and query type so agents imitate correct patterns?

Missing items 1–2 produce the stale-read and slow-query failures most often blamed on "the lakehouse," while missing items 3–6 are where agents specifically generate wrong results. The list is engine-agnostic by design — it holds whether your compute is Spark, Flink, or Trino.

## Conclusion

**Apache Hudi** is best understood as the open table format that made data lakes *mutable*: record-level upserts and deletes, a managed timeline for audit and rollback, and incremental queries that turn a lake table into a change feed. Its defining bet against Iceberg and Delta Lake is **streaming and CDC ingestion**, anchored by a record-level index and the Copy-on-Write versus Merge-on-Read trade-off. For AI agents, Hudi moves the hard problems from syntax to **table-type, query-type, and freshness context** — the same shift that separates a demo from a production-grade [data engineering agent](/blog/what-is-data-engineering-agent/).

## Frequently asked questions

### What is Apache Hudi used for?

Hudi is used to build **mutable, incrementally updated data lake tables**, most commonly for change-data-capture and streaming ingestion. It applies a continuous stream of inserts, updates, and deletes to lake tables efficiently using a record-level index, tracks every change on a timeline for audit and rollback, and lets downstream jobs read only what changed via incremental queries — workloads that append-only lake formats handle poorly.

### What is the difference between Copy-on-Write and Merge-on-Read in Hudi?

**Copy-on-Write (CoW)** rewrites data files on each update, so reads are fast but writes are heavier — ideal for read-heavy tables with moderate update rates. **Merge-on-Read (MoR)** writes lightweight delta logs and defers merging to a background compaction, so ingestion is fast and near-real-time but reads must merge base and delta files until compaction runs. CoW optimizes read latency; MoR optimizes write latency for streaming and CDC.

### Hudi vs Iceberg — when should I pick Hudi?

Pick **Hudi** when your dominant workload is **high-frequency upserts, CDC ingestion, or incremental processing**, where its record-level index and Merge-on-Read design were purpose-built to apply changes cheaply. Choose **Iceberg** when engine neutrality, broad multi-engine support, and avoiding vendor lock-in matter more than streaming-update performance. Many teams pick one primary format and document exceptions per domain rather than running both everywhere.

### Can a text-to-SQL agent query Hudi tables reliably?

Only with format-aware context. On a small POC, pasting DDL may work, but on production Hudi tables an agent must know each table's **type (CoW or MoR)**, the intended **query type (snapshot vs incremental)**, and the **record key**, or it will return stale or partial results that look valid. Supply table-type and query-type metadata through a catalog before relying on agent-generated SQL.

## Related articles

- [What is Apache Iceberg?](/blog/what-is-apache-iceberg/) — the engine-neutral table format Hudi is often compared to
- [What is a lakehouse?](/blog/what-is-lakehouse/) — the architecture Hudi tables make possible
- [What is change data capture (CDC)?](/blog/what-is-cdc/) — the change streams Hudi upserts are built to absorb
- [What is a data engineering agent?](/blog/what-is-data-engineering-agent/) — why table-format-aware context matters
