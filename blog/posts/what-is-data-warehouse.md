---
title: "What Is a Data Warehouse? Definition, Architecture & How It Differs From a Data Lake"
description: "Data warehouse definition, architecture (ETL, dimensional models, columnar MPP), how it differs from a data lake and lakehouse, and what AI agents need to query one."
author: "Evan Paul"
date: 2026-06-24
lastmod: 2026-06-24
head:
  - - meta
    - name: keywords
      content: "data warehouse, what is a data warehouse, data warehouse definition, data warehouse vs data lake, cloud data warehouse, data warehouse architecture"
  - - meta
    - property: og:title
      content: "What Is a Data Warehouse? Definition, Architecture & How It Differs From a Data Lake"
  - - meta
    - property: og:description
      content: "Data warehouse definition, architecture (ETL, dimensional models, columnar MPP), how it differs from a data lake and lakehouse, and what AI agents need to query one."
  - - meta
    - property: og:type
      content: article
  - - meta
    - property: og:url
      content: https://datus.ai/blog/what-is-data-warehouse/
  - - meta
    - property: og:image
      content: https://datus.ai/logo_dark.svg
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - link
    - rel: canonical
      href: https://datus.ai/blog/what-is-data-warehouse/
---

# What Is a Data Warehouse? Definition, Architecture & How It Differs From a Data Lake

A finance team needs the same revenue number in the board deck, the investor update, and the daily ops dashboard — computed the same way every time, and fast enough to slice by region and quarter on demand. Delivering that consistency is the job a **data warehouse** was built to do: a central, structured store where data is cleaned, conformed, and modeled *before* it lands, so analytical SQL runs quickly and returns the same answer to everyone. This glossary entry defines what a data warehouse is, how its schema-on-write design differs from a data lake and a lakehouse, what the architecture looks like under the hood, and why AI agents generating SQL against a warehouse still need far more than a list of table names.

*Disclosure: Datus is a data engineering agent platform. This article explains the data warehouse as a general concept, referencing Datus alongside other tools and architectures in the category. See the end for more detail.*

## TL;DR

- A **data warehouse** is a central, query-optimized store for **structured, modeled data**, where schema is defined up front (schema-on-write) and data is loaded in cleaned form for BI, reporting, and analytics.
- It differs from a **data lake** (raw files, schema-on-read, cheap and flexible) and a **lakehouse** (warehouse semantics layered on open lake storage) — most mature organizations run more than one of the three.
- Inside, a warehouse couples an **ELT/ETL pipeline**, a **modeling layer** (star schemas, conformed dimensions, marts), and a **columnar, often MPP query engine** tuned for large aggregations.
- **Cloud data warehouses** — Snowflake, BigQuery, Amazon Redshift — separated storage from compute and made the pattern elastic and pay-per-query.
- AI agents and text-to-SQL fail on warehouses not because SQL is hard, but because they miss **which mart is certified**, **what grain a table is at**, and **how a metric is actually defined** — context the schema alone never carries.

## 1. Data warehouse: a working definition

The data warehouse is one of the oldest ideas in analytics, formalized in the 1990s by practitioners like Bill Inmon and Ralph Kimball. The motivating problem has not changed: operational databases (the systems that run checkout, billing, and CRM) are tuned for many small writes, not for scanning years of history to answer "what was gross margin by product line last quarter?" Running that query against production would be slow and would compete with live traffic. A warehouse solves this by copying data out of source systems, reshaping it into an analytics-friendly model, and serving it from an engine built for large reads.

The defining choice is **schema-on-write**. Before a row is queryable, you decide what columns exist, what types they hold, and how tables relate — and the load process enforces that contract. This is the opposite of a data lake's schema-on-read approach, and it is the root of every other warehouse trait: strong typing, predictable joins, governed definitions, and fast SQL, traded against less flexibility for unstructured or rapidly changing data.

A useful working definition:

> A **data warehouse** is a central repository of **structured, modeled data** integrated from multiple source systems, where **schema is defined and enforced on write**, data is stored in cleaned and conformed form, and a query engine is optimized for **complex analytical reads** (aggregations, joins, historical scans) rather than transactional writes.

That definition deliberately excludes a few things. A single reporting table copied into Postgres is not a warehouse — there is no integration across sources and no modeling discipline. A bucket of raw Parquet you occasionally query with [a data lake](/blog/what-is-data-lake/) engine is not a warehouse either, because nothing is conformed on write. And a warehouse is not merely "a big database": the distinction is the **OLAP workload** it is tuned for, which is why teams reach for columnar storage and parallel query execution rather than the row stores that power applications.

## 2. Data warehouse vs data lake vs lakehouse

These three architectures dominate analytics conversations and are constantly conflated in vendor decks. The table below answers one question: what does each one optimize for by default?

| Dimension | Data warehouse | Data lake | Lakehouse |
| --- | --- | --- | --- |
| **Primary storage** | Proprietary columnar store (often) | Object storage, raw files | Object storage + open table format |
| **Schema** | Schema-on-write; strong typing | Schema-on-read; weak enforcement | Schema evolution on enforced table metadata |
| **Data shape** | Structured, modeled | Anything: JSON, CSV, Parquet, logs, images | Structured + semi-structured on tables |
| **Transactions** | Full ACID | Usually none at file-set level | ACID at table level (format-dependent) |
| **Typical workloads** | BI, certified marts, finance | Raw ingest, ML feature stores, archives | Unified analytics + ML on shared tables |
| **Cost profile** | Higher platform cost | Lowest storage cost | Low storage + separated compute |
| **Openness** | Often proprietary | Open files | Open files + open formats |

**Data warehouse vs data lake** is the comparison most teams actually care about, because the two answer different questions. A warehouse asks "what is the certified, governed truth I can put in front of an executive?" A [data lake](/blog/what-is-data-lake/) asks "how do I keep everything cheaply, including data I do not yet know how to model?" Choosing one over the other is rarely the real decision — the failure mode is forcing raw exploratory data into a rigid warehouse, or forcing certified financial reporting onto an ungoverned lake.

The [lakehouse](/blog/what-is-lakehouse/) emerged precisely to collapse that split, putting warehouse-style table semantics on top of lake storage through open formats like Iceberg and Delta. The boundary keeps blurring: cloud warehouses now read external Iceberg tables, and lakehouses now run governed SQL marts. What stays stable is the *intent* — warehouse-first means a single optimized SQL runtime over modeled data; lake-first means open storage you can read with many engines.

## 3. Why organizations build a data warehouse

Teams adopt a warehouse when scattered, inconsistent reporting starts costing real money or credibility. The trigger is usually one of a few recurring pains, and naming them explains what a warehouse is for better than any abstract definition.

- **Conflicting numbers** — marketing, finance, and product each compute "active users" from their own extract, and the three never match in a meeting.
- **Query contention** — analysts run heavy reports against the production database and slow down the application.
- **Lost history** — operational systems overwrite or purge old rows, so year-over-year analysis becomes impossible.
- **Compliance and audit** — finance needs a governed, reproducible source for revenue recognition, not a spreadsheet pulled by hand.

A warehouse addresses all four by integrating sources into one modeled layer with retained history and enforced definitions. But the pattern also fails in predictable ways when discipline lapses. Marts proliferate until there are six tables that all claim to hold "orders," each at a different grain. Transformations accumulate undocumented business logic that only one engineer understands. And the warehouse becomes so governed that adding a new data source takes a quarter, which is exactly the friction that pushed teams toward data lakes in the first place. Maturity is not "we have a warehouse" — it is documented grain, a small set of certified marts, and a [semantic layer](/blog/what-is-semantic-layer/) so that "revenue" means one thing everywhere.

## 4. Inside a data warehouse: the architecture

A production warehouse is three layers working together, not a single database. Understanding them is what separates someone who *uses* a warehouse from someone who can reason about why a number is wrong.

The first layer is **ingestion and transformation**. Data moves out of source systems on a schedule (or via change data capture) and is reshaped before it serves queries. Historically this was **ETL** — transform the data, then load it — because storage and compute were expensive. Modern cloud warehouses inverted this to **ELT**: load raw data first, then transform it inside the warehouse using SQL, often orchestrated by <a href="https://docs.getdbt.com/docs/introduction" rel="nofollow noopener">dbt</a>. The second layer is the **model**: staging tables get conformed into [dimensional models](/glossary) — fact tables for events and measurements, dimension tables for the who/what/where — typically arranged as star schemas and rolled up into business-facing marts. The third layer is the **query engine**, which is where warehouses earn their performance: **columnar storage** so a query touching three columns over a billion rows reads only those columns, and **massively parallel processing (MPP)** so that scan is split across many nodes.

Consider a concrete failure that shows why the model layer matters. A growth analyst writes `SELECT COUNT(*) FROM fact_orders WHERE created_at >= '2026-06-01'` to report June orders. The query is syntactically perfect and runs in two seconds. It is also wrong, because `fact_orders` is at the *order-line* grain, not the *order* grain — a three-item order counts as three. The warehouse did not protect them; the schema looked the same either way. The protection lives in **documented grain and certified definitions**, which is the part of the architecture that no query engine enforces and that every downstream consumer — human or AI — depends on.

This is also why warehouse SQL has a reputation for being deceptively easy to get plausibly wrong. Joins fan out when grains mismatch, additive metrics get double-counted across snapshot tables, and slowly changing dimensions silently change which version of a customer attribute applies. None of these are SQL-syntax problems; they are modeling-context problems.

## 5. Cloud data warehouses

The biggest shift of the last decade was the move from on-premise appliances (Teradata, early Netezza) to **cloud data warehouses** that separate storage from compute. That separation is the whole story: storage became cheap object storage you pay for by the gigabyte, and compute became elastic clusters you spin up per query and pay for by the second. The result is that a startup and a Fortune 500 can run the same engine, scaling compute up for a heavy backfill and down to near-zero overnight.

Three platforms anchor the category, with different design centers. <a href="https://docs.snowflake.com/" rel="nofollow noopener">Snowflake</a> popularized the storage/compute split with independent "virtual warehouses" so teams do not fight over resources. <a href="https://cloud.google.com/bigquery/docs" rel="nofollow noopener">Google BigQuery</a> went serverless, hiding clusters entirely and pricing by data scanned. <a href="https://docs.aws.amazon.com/redshift/" rel="nofollow noopener">Amazon Redshift</a> brought the warehouse into the AWS ecosystem and has since added serverless and lake-integration options. All three now read open table formats directly, which is why the line between "cloud warehouse" and "lakehouse" is increasingly an architectural preference rather than a hard technical wall.

For data teams, the practical consequence is that storage is rarely the constraint anymore — **modeling discipline and cost governance are.** Elastic compute makes it trivially easy to run an unoptimized query that scans a terabyte, and pay-per-query pricing turns that mistake into a line item. The skills that matter shifted from tuning a fixed cluster to writing efficient, well-modeled SQL and giving every consumer the context to do the same.

## 6. Data warehouses and AI agents

[Text-to-SQL](/blog/what-is-text-to-sql/) and [data engineering agents](/blog/what-is-data-engineering-agent/) are now pointed at warehouses constantly, and they fail for the same reasons human analysts do — only faster and with more confidence. A model that sees only `information_schema` will happily join two tables at incompatible grains, pick the staging copy of a table over the certified mart, or invent a `revenue` calculation that ignores the team's actual definition. The schema told it the columns; it never told it the meaning.

| Context gap | Symptom | What the agent needs |
| --- | --- | --- |
| **Grain ambiguity** | `COUNT(*)` over order-line table reported as order count | Documented grain per table |
| **Certified vs staging** | Query hits `stg_orders` instead of `mart_orders` | Marked certified marts |
| **Metric definitions** | Hand-rolled `revenue` ignores returns and discounts | Governed metric definitions |
| **SCD versioning** | Joins to current dimension row for a historical fact | Slowly-changing-dimension policy |

Closing those gaps is a context-engineering problem, not a bigger-model problem. This is the layer Datus operates in: it connects to warehouses through native database adapters (Snowflake, PostgreSQL, and others), reads their schema to build a Context Tree, and attaches a semantic model that records grain, certified tables, and metric definitions. Generated SQL is then grounded in that context plus a library of vetted reference queries, rather than guessed from column names alone.

The honest caveat is that none of this is automatic on day one. An agent is only as reliable as the context it is given, and a warehouse with undocumented marts and no metric definitions will produce shaky agent output no matter how the context is engineered — the same way it produces shaky output from new human analysts. The work of documenting grain and certifying marts does not disappear; it becomes the foundation that makes both humans and agents trustworthy.

## 7. When a warehouse is enough — and when it is not

A dedicated data warehouse is the right anchor when governed, fast BI over modeled data is the primary job. It is overkill, or actively the wrong tool, in other situations — and being honest about that is part of using one well.

**Warehouse-first fits when:**

- Certified, sub-second BI on heavily modeled dimensions is a core SLA.
- The organization wants one optimized SQL runtime with mature workload management and governance.
- Compliance favors strong typing, access controls, and reproducible definitions.

**Reach past a warehouse when:**

- You need to land raw, schema-less, or rapidly changing data cheaply before you know how to model it — that is a [data lake](/blog/what-is-data-lake/) job.
- ML and SQL workloads need to share the same large datasets without copying — a [lakehouse](/blog/what-is-lakehouse/) reduces the duplicate pipelines.
- Domain teams want to own and publish their own data products rather than route everything through one central team — that is the [data mesh](/blog/what-is-data-mesh/) organizational pattern.

In practice, most mature stacks are hybrids: a lake or lakehouse for raw and ML zones, a warehouse (or warehouse-style marts) for certified reporting, bridged by a [data catalog](/blog/what-is-data-catalog/) and a semantic layer. The architecture question is rarely "which one wins" — it is "what is each layer for, and how does an agent or analyst know which one to trust for a given question."

## Conclusion

A **data warehouse** is best understood as **governed, modeled truth optimized for analytical SQL** — schema enforced on write, history retained, definitions conformed. Its strengths (consistency, speed, governance) and its weaknesses (rigidity, slower onboarding of new data) are two sides of the same schema-on-write choice, which is exactly what distinguishes it from a data lake and a lakehouse. For AI agents, the warehouse's hard part was never the SQL syntax; it is the grain, the certified marts, and the metric definitions that the schema never carries — the same context that separates demo-grade text-to-SQL from production-grade [data engineering agents](/blog/what-is-data-engineering-agent/).

## Frequently asked questions

### Is a data warehouse the same as a database?

No. Every warehouse is a database, but it is one tuned for **OLAP** — large analytical reads over modeled, historical data — rather than the **OLTP** workload (many small reads and writes) that powers applications. The differences show up in storage (columnar vs row), execution (parallel scans vs single-row lookups), and design (denormalized marts vs normalized transactional schemas). Running heavy analytics on your application database is the problem a warehouse exists to fix.

### Data warehouse vs data lake — which do I need?

Most teams that ask this eventually run **both**. A warehouse serves certified, governed BI over structured data; a [data lake](/blog/what-is-data-lake/) cheaply retains raw and semi-structured data — including data you cannot yet model — and feeds ML. If you only have clean, structured reporting needs, a warehouse alone is simpler. If you are drowning in logs, events, and files you want to keep but not yet shape, you need lake economics first. The lakehouse exists to avoid choosing.

### Is Snowflake a data warehouse or a lakehouse?

Snowflake started as a cloud **data warehouse** built on separated storage and compute, and that is still its core. It has since added external-table and Iceberg support that let it read open lake storage, which gives it lakehouse-style capabilities. Labels matter less than how you use it — a Snowflake account serving certified marts behaves like a warehouse; one querying external Iceberg tables behaves like a lakehouse front end.

### Do I still need a data warehouse if I have a lakehouse?

Often not as a separate system — a [lakehouse](/blog/what-is-lakehouse/) can host warehouse-style Gold marts on open storage. Teams keep a dedicated warehouse when they need sub-second BI on heavily modeled dimensions, mature workload management, or compliance controls that are easier to enforce in a single proprietary runtime. The decision is about SLAs and governance maturity, not about which word is on the invoice.

### Can text-to-SQL work reliably on a data warehouse?

For a small, well-documented schema, yes. For a real warehouse with hundreds of tables, overlapping marts, and undocumented grain, accuracy collapses without **grain documentation, certified table lists, and governed metric definitions** injected as context. The model is rarely the bottleneck; the missing semantic context is. Invest in that context before blaming the model — it is the same investment that makes new human analysts productive.

## Related articles

- [What is a data lake?](/blog/what-is-data-lake/) — the schema-on-read counterpart, and when raw storage wins
- [What is a lakehouse?](/blog/what-is-lakehouse/) — warehouse semantics on open lake storage
- [What is a semantic layer?](/blog/what-is-semantic-layer/) — how "revenue" stays one number across every mart

---

*Disclosure: Datus is a data engineering agent platform. This glossary entry explains the data warehouse as a general concept and how cross-stack agents approach warehouse context — alongside other tools and architectures in the category.*
