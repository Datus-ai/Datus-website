---
title: "What Is Change Data Capture (CDC)? Methods & Use Cases"
description: "Change data capture (CDC) definition, the three CDC methods — log-based, trigger, query — plus real-time use cases, pitfalls, and CDC to the lakehouse."
author: "Evan Paul"
date: 2026-07-17
lastmod: 2026-07-17
head:
  - - meta
    - name: keywords
      content: "change data capture, what is CDC, CDC methods, log-based CDC, Debezium, CDC to lakehouse, CDC pipeline"
  - - meta
    - property: og:title
      content: "What Is Change Data Capture (CDC)? Methods & Use Cases"
  - - meta
    - property: og:description
      content: "Change data capture (CDC) definition, the three CDC methods — log-based, trigger, query — plus real-time use cases, pitfalls, and CDC to the lakehouse."
  - - meta
    - property: og:type
      content: article
  - - meta
    - property: og:url
      content: https://datus.ai/blog/what-is-cdc/
  - - meta
    - property: og:image
      content: https://datus.ai/logo_dark.svg
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - link
    - rel: canonical
      href: https://datus.ai/blog/what-is-cdc/
---

# What Is Change Data Capture (CDC)? Methods & Use Cases

**Change data capture (CDC)** is the practice of detecting every row-level insert, update, and delete in a source database and propagating those changes to downstream systems — a warehouse, a lake, a cache, another service — instead of re-copying the whole table. When CDC is done well, an analytics table can trail its operational source by seconds rather than a day. This guide defines CDC, compares the three ways to capture change, and covers where it breaks and how agents should treat CDC-fed tables.

*Disclosure: Datus is a data engineering agent platform. This article explains change data capture as a general concept, referencing Datus alongside other tools and approaches in the category. See the end for more detail.*

## TL;DR

- **CDC** streams row-level changes (INSERT/UPDATE/DELETE) out of a source system as they happen, so targets stay in sync without full reloads.
- There are three methods: **log-based** (read the transaction log), **trigger-based** (fire a database trigger into a shadow table), and **query-based** (poll a timestamp or version column). Log-based is the production default.
- CDC powers real-time replication, zero-downtime migration, cache invalidation, event-driven microservices, and incremental loads into the lakehouse.
- The hard parts are not extraction — they are **initial snapshots, ordering, exactly-once delivery, deletes, and schema drift**.
- For AI agents, CDC decides *freshness*. An agent that doesn't know a table is CDC-backed with a 30-second lag — or has fallen behind — will answer confidently from stale data.

## 1. Change data capture: a working definition

The narrow definition is mechanical. The useful one is about intent.

> **Change data capture** is the process of identifying and delivering the individual data changes committed to a source system — as an ordered stream of insert, update, and delete events — so that one or more downstream systems can be kept consistent with the source without re-reading unchanged data.

Two words carry the weight. **Individual** — CDC works at the granularity of a changed row (often a changed column set), not a table or a partition. **Ordered** — the events must arrive in an order that lets the target reconstruct the same state the source reached. A stream of changes that arrives out of order is often worse than a nightly full reload, because it produces a table that looks fresh and is quietly wrong.

CDC is frequently described as a form of ETL where only the *delta* is extracted, per <a href="https://rivery.io/blog/what-is-change-data-capture-cdc/" rel="nofollow noopener">Rivery</a> and others. That framing is fine as long as you remember what makes CDC distinct from an incremental batch job: batch loads a *range* of rows on a schedule; CDC loads *events* continuously, and — crucially — it can capture **deletes**, which a naive `WHERE updated_at > :last_run` query never sees.

| Change type | Batch `updated_at` poll | Log-based CDC |
| --- | --- | --- |
| INSERT | Captured | Captured |
| UPDATE | Captured (if the column is maintained) | Captured |
| DELETE | **Missed** (row is gone) | Captured |
| Hard delete then re-insert same key | Looks like one update | Two distinct events |

That DELETE row is the single most common reason a hand-rolled "incremental" pipeline drifts away from its source over months.

## 2. The three CDC methods

Practitioners and vendors — <a href="https://www.confluent.io/learn/change-data-capture/" rel="nofollow noopener">Confluent</a>, <a href="https://www.striim.com/blog/change-data-capture-cdc-what-it-is-and-how-it-works/" rel="nofollow noopener">Striim</a>, and others — converge on the same three approaches.

| Method | How it detects change | Captures deletes? | Source load | Latency | Main drawback |
| --- | --- | --- | --- | --- | --- |
| **Log-based** | Reads the database's transaction log (WAL, binlog, redo log) | Yes | Very low (log already exists) | Seconds or less | Log formats are vendor-specific; harder to set up |
| **Trigger-based** | Database triggers write change rows into a shadow/audit table | Yes | Higher — extra write per change | Near real-time | Adds write overhead; needs schema changes |
| **Query-based** | Polls a `LAST_MODIFIED` timestamp or version column | **No** | Repeated scans of the source | Bounded by poll interval | Misses deletes; constant query load |

### Log-based CDC

The database already writes an ordered, durable record of every committed change so it can recover from a crash and feed replicas — Postgres's write-ahead log (WAL), MySQL's binlog, Oracle's redo log, SQL Server's transaction log. Log-based CDC **tails that log** rather than querying tables. Because it piggybacks on infrastructure the database maintains anyway, it is low-impact, captures all change types including deletes, and requires no `Last Updated` column or schema change. <a href="https://debezium.io/documentation/reference/stable/features.html" rel="nofollow noopener">Debezium</a>, the dominant open-source engine, reports change-event latency in the millisecond range for MySQL and PostgreSQL, since it reacts to log writes instead of polling.

The cost is complexity: every database's log format differs, initial setup requires elevated privileges and correct log-retention settings, and you must handle the handoff from a first full snapshot to the ongoing stream (see §4).

### Trigger-based CDC

A trigger fires on INSERT/UPDATE/DELETE and writes a row describing the change into a separate audit table, which a downstream process then reads. It captures every change type and works on databases without accessible logs. The problem is that the trigger executes **inside the source transaction**, so it adds write latency to production workloads; with many triggers on hot tables, that overhead compounds. It also requires adding objects to the source schema.

### Query-based (timestamp/version) CDC

The simplest to build: add a `LAST_MODIFIED` (or monotonic version) column and periodically `SELECT` rows changed since the last watermark. It needs no special access. But it **cannot see deletes** — a deleted row simply stops appearing, so downstream copies keep the ghost — it puts a repeated scan load on the source, and its freshness can never beat the poll interval. It is acceptable for small, append-mostly tables and a poor fit for anything where deletes or hard updates matter.

## 3. What CDC is used for

CDC is the plumbing under a surprising amount of the modern stack:

- **Real-time replication and warehouse sync.** Keep an analytical copy in Snowflake, BigQuery, or a [data warehouse](/blog/what-is-data-warehouse/) within seconds of the operational source, instead of a nightly dump.
- **Zero-downtime migration.** Snapshot the old system, then stream ongoing changes with CDC until the cutover, so the new system is never behind.
- **Event-driven microservices.** Turn committed database changes into events other services react to — the outbox pattern — without dual-write bugs.
- **Cache and search-index invalidation.** Update Redis, Elasticsearch, or a feature store the moment the source row changes.
- **Audit and compliance.** Because the change stream is an ordered, immutable record of every mutation, it doubles as a tamper-evident audit trail.
- **Incremental loads into the lakehouse.** Land only changed rows into open table formats, avoiding full-table rewrites — the pattern §5 covers.

## 4. Where CDC breaks in production

The hard part of CDC is rarely getting a change out of the log. It is everything around the edges.

### The initial snapshot handoff

CDC captures *future* changes. To populate the target you first need the *current* state — a consistent snapshot of the existing rows — and then you must begin streaming from the exact log position that snapshot corresponds to. Get that boundary wrong and you either lose changes that happened during the snapshot or double-apply them. Skipping the snapshot entirely (a common mistake) leaves the target permanently missing all history that predates the pipeline.

### Ordering

Multi-row transactions and rapid successive updates to the same key must be applied downstream in source-commit order, or the target converges to the wrong value. Log-based CDC preserves the source's order, and engines expose transaction metadata to help — but the moment events pass through a partitioned message bus, preserving per-key order becomes the pipeline designer's responsibility.

### Exactly-once vs at-least-once

Most streaming transports guarantee *at-least-once* delivery, so retries produce duplicates. The standard fix is not exactly-once magic; it is **idempotent sinks** — apply changes with an upsert/merge keyed by primary key so replaying an event is harmless. This is the same [idempotency](/blog/what-is-medallion-architecture/) discipline that makes any pipeline safe to retry.

### Deletes

Query-based CDC misses deletes outright; even with log-based CDC, teams sometimes filter delete events to "keep the history," and the target silently diverges. Decide explicitly whether deletes are hard-applied, soft-flagged, or archived.

### Schema drift

Source schemas change — a column is added, a type widens, a field is dropped. These **schema drift** events break naive consumers and corrupt downstream tables. This is exactly the failure a [data contract](/blog/what-is-data-contract/) exists to catch: a machine-checked agreement on schema and semantics between producer and consumer, so a breaking change is rejected at the boundary instead of discovered in a dashboard.

## 5. CDC and the lakehouse

The most active area for CDC in 2025–2026 is landing change streams directly into open table formats rather than a proprietary warehouse. Open formats added the primitive that makes this practical: row-level deletes and `MERGE`. [Apache Iceberg](/blog/what-is-apache-iceberg/) can apply UPDATE and DELETE events efficiently, which makes it a natural CDC target — the resulting table is fresh, ACID-compliant, and readable by many engines (Spark, Trino, Flink, and warehouses that read Iceberg externally).

[Apache Hudi](/blog/what-is-apache-hudi/) took this furthest early, building around upserts and *incremental* queries that expose a table's own change stream so downstream jobs process only what moved. Vendors have followed the pattern: <a href="https://www.fivetran.com/press/fivetran-expands-snowflake-partnership-with-iceberg-table-support-and-enterprise-ready-native-applications" rel="nofollow noopener">Fivetran</a> now writes into Iceberg tables that Snowflake can read, letting a CDC-sourced lakehouse sit alongside native warehouse tables.

In [lakehouse](/blog/what-is-lakehouse/) terms, CDC most often feeds the raw landing zone — the Bronze layer of a [medallion architecture](/blog/what-is-medallion-architecture/) — which is then cleaned and modeled into Silver and Gold. CDC decides how fresh Bronze is; the medallion layers decide what the data *means*.

## 6. Why CDC matters for data agents

A [data engineering agent](/blog/what-is-data-engineering-agent-2026/) that answers questions over your warehouse inherits one property directly from CDC: **freshness**. And freshness is invisible in the SQL. A query against `fact_orders` returns rows whether the CDC stream is current, lagging by an hour, or stalled since last night. The agent cannot tell from the result set alone.

That is a context problem, not a modeling one. To answer "how many orders in the last hour" reliably, the agent needs to know that `fact_orders` is CDC-backed from the production Postgres, that its expected lag is under a minute, and that if the stream is behind, "the last hour" is a misleading window. None of that lives in the table's DDL. It lives in operational context — which is why [contextual data engineering](/blog/contextual-data-engineering/) treats freshness expectations, source lineage, and load method as first-class, evolvable context rather than tribal knowledge.

CDC also raises the reconciliation question agents should be built to answer: *does the CDC copy match the source?* Row counts, primary-key coverage, and per-column checksums between the operational database and its CDC target are exactly the kind of tolerance-bounded comparison a well-designed agent runs as a check, not a one-time migration task. When the answer drifts, the value of an agent is catching it before a human reads a wrong number — which requires the agent to hold the context that a given table *has* a source of truth to reconcile against in the first place.

## 7. Adopting CDC: a practical checklist

1. **Prefer log-based** unless you cannot get log access — it is the only method that is both low-impact and complete (captures deletes).
2. **Design the snapshot-to-stream handoff first.** It is where most implementations go wrong. Record the exact log position at snapshot start.
3. **Make sinks idempotent.** Upsert/merge by primary key so at-least-once delivery and replays are safe.
4. **Decide the delete policy explicitly** — hard delete, soft flag, or archive — and document it per table.
5. **Guard the schema boundary** with a contract or drift check so a producer's change fails loudly instead of corrupting the target.
6. **Publish freshness expectations.** Every CDC-backed table should carry its source and expected lag as context anything downstream — dashboards, agents, alerts — can read.
7. **Reconcile periodically.** Compare target to source on counts and checksums; a CDC pipeline that isn't reconciled is a guess.

## Conclusion

**Change data capture** is how data stays in sync without moving all of it. The method choice — log-based, trigger, or query — is mostly settled: log-based wins in production because it is cheap on the source and captures deletes. The real work is in the seams: the initial snapshot, ordering, idempotent application, deletes, and schema drift. And for the AI layer now sitting on top of the warehouse, CDC is what turns "fresh" from an assumption into a fact the system can actually check — but only if freshness and source-of-truth are captured as context the agent can read.

## Frequently asked questions

### What is the difference between CDC and ETL?

ETL is the broad process of extracting, transforming, and loading data; CDC is a *technique* for the extract step that moves only what changed. A traditional batch ETL job reloads a table or a date range on a schedule. A CDC-based pipeline streams individual insert/update/delete events continuously. The most important practical difference: CDC captures deletes, while a batch job that filters on an `updated_at` column silently misses rows that were removed from the source. CDC is often described as "streaming ETL of the delta."

### Which CDC method should I use?

Use **log-based CDC** if you can get access to the database's transaction log — it is low-impact on the source, captures all change types including deletes, and needs no schema changes. Choose **trigger-based** only when logs are inaccessible and you can tolerate extra write overhead on the source. Use **query-based** (timestamp polling) only for small, append-mostly tables where missing deletes and poll-interval latency are acceptable. In 2026, managed connectors and open-source Debezium make log-based CDC the default for most teams.

### Does CDC give you real-time data?

Close, but be precise about it. Log-based CDC engines can propagate a change in well under a second — Debezium reports millisecond-range latency for MySQL and PostgreSQL — but end-to-end freshness also depends on the message bus, the sink, and how the target applies changes (streaming upsert vs micro-batch). "Real-time" in practice usually means seconds to low minutes end-to-end. Query-based CDC can never be faster than its polling interval. Always measure freshness at the target, not at the connector.

### How does CDC handle deletes?

Log-based and trigger-based CDC both capture DELETE events, because the transaction log and triggers both record removals. Query-based CDC cannot — once a row is gone, a `SELECT ... WHERE updated_at > watermark` has nothing to find, so downstream copies keep the deleted row forever. Even with a method that captures deletes, teams must decide how the target applies them: hard delete the target row, set a soft-delete flag, or move it to an archive. Leaving deletes unhandled is a leading cause of a CDC copy slowly diverging from its source.

### Can CDC feed a data lake or lakehouse?

Yes, and it is now a common pattern. Open table formats like Apache Iceberg, Delta Lake, and Apache Hudi support row-level `MERGE`/UPDATE/DELETE, so a CDC stream can be applied to a lakehouse table to keep it current and ACID-compliant. CDC typically lands in the raw (Bronze) layer, which downstream jobs refine. This lets a lakehouse serve fresh, query-consistent data to many engines without copying it into a proprietary warehouse first.

## Related articles

- [What is Apache Hudi?](/blog/what-is-apache-hudi/) — upserts and incremental queries built for change streams
- [What is Apache Iceberg?](/blog/what-is-apache-iceberg/) — the open table format CDC increasingly targets
- [What is a data contract?](/blog/what-is-data-contract/) — catching schema drift at the producer/consumer boundary
- [What is medallion architecture?](/blog/what-is-medallion-architecture/) — where CDC lands and how it is refined
- [Contextual data engineering](/blog/contextual-data-engineering/) — making freshness and source-of-truth first-class context

---

*Disclosure: Datus is a data engineering agent platform. This glossary entry explains change data capture as a general concept and how Datus addresses the context around it — tracking which tables are CDC-backed, their expected freshness, and reconciliation against the source of truth, through dual-dimension context and domain-scoped Subagents.*
