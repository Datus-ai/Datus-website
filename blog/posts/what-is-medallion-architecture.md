---
title: "What Is Medallion Architecture? Bronze, Silver & Gold Layers"
description: "Medallion architecture definition: Bronze, Silver, and Gold lakehouse layers, what belongs in each, the anti-patterns, and which layer an AI agent should query."
author: "Evan Paul"
date: 2026-06-30
lastmod: 2026-07-10
head:
  - - meta
    - name: keywords
      content: "medallion architecture, bronze silver gold, what is medallion architecture, medallion lakehouse architecture, multi-hop architecture, gold layer vs semantic layer"
  - - meta
    - property: og:title
      content: "What Is Medallion Architecture? Bronze, Silver & Gold Layers"
  - - meta
    - property: og:description
      content: "Medallion architecture definition: Bronze, Silver, and Gold lakehouse layers, what belongs in each, the anti-patterns, and which layer an AI agent should query."
  - - meta
    - property: og:type
      content: article
  - - meta
    - property: og:url
      content: https://datus.ai/blog/what-is-medallion-architecture/
  - - meta
    - property: og:image
      content: https://datus.ai/logo_dark.svg
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - link
    - rel: canonical
      href: https://datus.ai/blog/what-is-medallion-architecture/
---

# What Is Medallion Architecture? Bronze, Silver & Gold Layers

## TL;DR

- **Medallion architecture** = Bronze → Silver → Gold, a "multi-hop" convention that progressively refines data quality across layers.
- **Bronze** is raw and immutable (the audit trail), **Silver** is cleaned and joined at full grain, **Gold** is aggregated and modeled for the business.
- It is a *labeling discipline*, not a technology — you can run a lakehouse without it, or apply the labels inside a warehouse.
- The common failure modes: forcing all three layers onto every dataset, a sprawling Gold that drifts into competing "single sources of truth," and quality debt that propagates downstream unchecked.
- **Gold is not a semantic layer.** Gold holds structured tables; meaning — what a metric means, which table is authoritative, how to join — lives above and around it.
- An AI agent usually needs **Silver's granularity** for causal analysis and **Gold's definitions** for headline metrics — plus context medallion layers alone don't encode.

**Medallion architecture** is a data design pattern that organizes a [lakehouse](/blog/what-is-lakehouse/) into three named layers — **Bronze** (raw), **Silver** (cleaned and validated), and **Gold** (business-ready) — so data quality improves at each hop from source to consumption. It is a naming convention for pipeline stages, not a product you install, and Databricks itself calls it "a recommended best practice but not a requirement." This guide defines the pattern, says exactly what belongs in each layer, walks the anti-patterns the vendor pages downplay, and answers the question those pages skip: **which layer should an AI agent actually query?**

## 1. Medallion architecture: a working definition

The term comes from Databricks, where it is also called a **multi-hop architecture**. The layers are named after medals — bronze, silver, gold — to signal increasing value.

> **Medallion architecture** is a convention for organizing lakehouse tables into ordered layers (Bronze → Silver → Gold) that incrementally and progressively improve the structure, quality, and business-readiness of data as it flows from raw ingestion to consumption.

The important word is *convention*. Medallion does not enforce anything on its own — no engine checks that your "Silver" table is actually clean. It is a shared vocabulary that lets a team agree on **how processed and trustworthy** any given table is. That shared vocabulary is genuinely useful: it answers a question that file paths and table names cannot, namely *how far along the refinement path is this dataset, and can I trust it for what I'm doing?*

| Layer | Data quality | Primary users | Typical contents |
| --- | --- | --- | --- |
| **Bronze** | Raw, unvalidated | Data engineers, audit/compliance | As-is source data, append-only, metadata columns |
| **Silver** | Cleaned, validated | Data engineers, analysts, data scientists | Deduplicated, conformed, joined records at full grain |
| **Gold** | Business-ready | BI developers, executives, ML, operations | Aggregated, dimensional models, project-specific marts |

Per the official <a href="https://learn.microsoft.com/en-us/azure/databricks/lakehouse/medallion" rel="nofollow noopener">Azure Databricks documentation</a>, the layers "denote the quality of data stored in the lakehouse" and the pattern guarantees ACID properties as data passes through validations and transformations. The <a href="https://www.databricks.com/glossary/medallion-architecture" rel="nofollow noopener">Databricks glossary</a> frames the goal as a single source of truth that can be rebuilt from raw data at any time.

## 2. What actually goes in each layer

Most confusion about medallion is boundary confusion — teams disagree about where a given transformation belongs. Here is the practical division, with real objects.

### Bronze — raw, immutable, append-only

Bronze captures source data in its original shape and never mutates it. It is the **audit trail and the reprocessing safety net**: if a Silver job has a bug, you rebuild from Bronze rather than re-reading the source system.

- Ingest from cloud storage (S3, GCS, ADLS), message buses (Kafka, Kinesis), and federated systems, as either streaming or batch.
- Add provenance metadata — a load timestamp, a process ID, `_metadata.file_name`.
- Store loosely. Databricks recommends keeping fields as `STRING`, `VARIANT`, or binary in Bronze so an upstream schema change does not drop rows on ingest.
- Do **not** point analysts at Bronze. It exists to feed Silver, not to answer questions.

### Silver — cleaned, conformed, full grain

Silver is where the real work happens: cleansing, deduplication, null handling, type casting, resolving late-arriving records, schema enforcement, and joins. The rule that keeps Silver honest: it should always contain **at least one validated, non-aggregated representation of each record** — you clean, you do not yet summarize.

Concretely, a `bronze.customers_raw` and `bronze.transactions_raw` become a cleaned, joined `silver.customer_transactions` with nulls dropped and invalid rows quarantined. Type 2 [slowly changing dimensions](/blog/what-is-lakehouse/) are commonly resolved here, and modeling toward 3rd-normal-form or Data Vault begins in Silver. Databricks explicitly recommends **not** writing to Silver directly from ingestion — read from Bronze — because writing straight from the source reintroduces the schema-change and corrupt-record failures Bronze was meant to absorb.

### Gold — aggregated, modeled, business-facing

Gold holds consumption-ready tables that map to business functions. This is where dimensional modeling lives — a Kimball star schema or Inmon-style marts — with denormalized, read-optimized tables and pre-computed aggregates.

```sql
-- A typical Gold materialized view: pre-aggregated weekly sales
CREATE OR REPLACE MATERIALIZED VIEW gold.weekly_sales AS
SELECT week,
       prod_id,
       region,
       SUM(units)         AS total_units,
       SUM(units * rate)  AS total_sales
FROM   silver.orders
GROUP BY week, prod_id, region;
```

Gold tables like `gold.customer_spending`, `gold.account_performance`, or `gold.business_summary` answer specific questions fast. Because Gold models a business domain, many teams run **multiple Gold schemas** — finance, HR, marketing — rather than one monolith.

## 3. Where medallion sits: the lakehouse and open formats

Medallion is a **layering convention** that rides on top of a storage architecture; it is not itself the architecture. It became popular alongside the [lakehouse](/blog/what-is-lakehouse/), where open table formats supply the ACID transactions, schema enforcement, and time travel that make "rebuild Silver from Bronze" practical.

That physical foundation matters. The same raw → cleaned → curated idea existed in the [data lake](/blog/what-is-data-lake/) world as raw/staging/curated zones, and in the [data warehouse](/blog/what-is-data-warehouse/) as staging/ODS/marts. Medallion is the lakehouse-era name for a decades-old idea. On formats like [Apache Iceberg](/blog/what-is-apache-iceberg/) and [Apache Hudi](/blog/what-is-apache-hudi/), incremental processing lets a Silver job consume only the Bronze records that changed since the last commit — the mechanism that makes multi-hop refinement affordable at scale rather than a full rescan on every run.

Crucially: **medallion is not synonymous with lakehouse.** You can run a lakehouse with no medallion labels, and you can label medallion layers inside a plain warehouse. The labels are organizational, not physical.

## 4. Why medallion breaks in production

The vendor pages present medallion as a smooth escalator from raw to gold. In practice, teams hit predictable failure modes. Naming them is the honest part most "what is medallion" articles skip.

### Three layers forced onto everything

The most common anti-pattern is applying all three layers to *every* dataset — including a tiny reference table feeding one dashboard. That adds storage, latency, and maintenance for no return. Medallion is a default, not a mandate; a small dimension can go Bronze → Gold, or skip the ceremony entirely.

### Gold sprawl and metric drift

When every team builds its own "gold" tables, you get **competing single sources of truth**: three tables all called some variant of `revenue`, each with a slightly different filter, none authoritative. This is the metric-drift problem — the same word means different numbers in different marts. Practitioners like <a href="https://lakshmanok.medium.com/what-goes-into-bronze-silver-and-gold-layers-of-a-medallion-data-architecture-4b6fdfb405fc" rel="nofollow noopener">Lak Lakshmanan</a> argue Gold should be "kept as small as possible" — only the cross-company entities and KPIs that truly need centralized agreement — with domain marts pushed into a separate "Platinum" layer so they don't pollute the shared source of truth.

### Quality debt propagates

Because layers are sequential, an error introduced in Bronze or Silver flows downstream unchecked unless each hop actively tests for it. Accountability fragments: when a Gold number is wrong, is it a Gold aggregation bug, a Silver join, or a Bronze ingestion gap? Without checks at each boundary — the job a [data contract](/blog/what-is-data-contract/) does — the medallion becomes a long pipe in which bad data travels a long way before anyone notices.

### It is producer-centric, and assumes one stack

Critics point out that medallion describes the **pipeline's internal stages of refinement**, not the **consumer's mental model of the business** — it organizes data around engineering convenience. It also quietly assumes technological homogeneity: one engine and one table format for streaming, point lookups, search, time-series, and vector similarity, when real stacks often need specialized systems for each. Medallion is a good default for batch analytical refinement; it is not a universal law of data architecture.

## 5. Gold layer vs semantic layer

A frequent mistake is treating the Gold layer as the [semantic layer](/blog/what-is-semantic-layer/). They are different things at different altitudes.

| | Gold layer | Semantic layer |
| --- | --- | --- |
| **What it is** | Physical tables in the lakehouse | A definition layer above the tables |
| **Contains** | Aggregated rows, dimensional models | Metric formulas, entity relationships, governed names |
| **Answers** | "What are the numbers?" | "What does this number *mean*, and how is it computed?" |
| **Form** | Parquet/Delta/Iceberg tables | YAML/metadata, queried through an API |

Gold *forms the basis for* a semantic layer — but the semantic layer sits outside the storage, adding human- and machine-readable meaning: friendly names, the exact definition of "net revenue," which grain a metric lives at, and the relationships between entities. Gold gives you `gold.weekly_sales`; the semantic layer tells an agent that "weekly revenue" means `SUM(total_sales)` from that table, excluding test accounts, at the fiscal-week grain. One is structure; the other is meaning.

## 6. Which layer should an AI agent query?

This is the question medallion guides written for humans never ask — and it is exactly where AI agents change the calculus. A human executive wants a clean line chart, so Gold is perfect. An agent diagnosing *why* a metric moved needs the granular, causal detail that aggregation throws away. Strip transactional context to save compute in Gold, and you blind the agent.

| Agent task | Best layer | Why |
| --- | --- | --- |
| Report a headline KPI | **Gold** | Governed, pre-aggregated, matches the board deck |
| Diagnose *why* a metric changed | **Silver** | Full grain preserves the causal detail Gold discards |
| Reconcile against a source system | **Bronze** | The immutable as-is record is the ground truth |
| Answer an ad-hoc, cross-domain question | **Silver + reference SQL** | No single Gold mart spans the join; validated queries carry the path |

The practical consequence: an agent restricted to Gold answers headline questions well and investigative questions badly. But an agent turned loose on Silver and Bronze without guidance re-derives metrics inconsistently — the very drift Gold was built to prevent. Neither extreme works. What the agent actually needs is to know **which table is authoritative for which question**, and that knowledge is not encoded in the layer name. `silver.customer_transactions` and `gold.customer_spending` both mention customers; only context says which one answers "monthly churn."

## 7. How context engines work across medallion layers

Medallion gives an agent a **navigable hierarchy** — prefer Gold for KPIs, drop to Silver to investigate, reach Bronze to reconcile. What it does not give is **meaning**: the layer label says how refined a table is, not what its columns mean, which of three revenue tables is canonical, or that `status_v2` replaced `status` last quarter. That gap is what [contextual data engineering](/blog/contextual-data-engineering/) addresses.

An **evolvable context engine** layers three kinds of knowledge over the medallion tables:

- **Catalog context** — what exists, annotated: this Gold table is authoritative for finance; that Silver table is the full-grain source for causal analysis; this Bronze path is the reconciliation ground truth.
- **Semantic context** — governed metric and entity definitions, so "revenue" resolves to one formula against one table regardless of how many marts exist.
- **Institutional context** — validated **reference SQL** whose join paths tell the agent how to answer cross-domain questions no single Gold mart covers, plus deprecations so it stops selecting last quarter's column.

This is where [schema linking](/blog/what-is-schema-linking/) meets medallion: choosing the right table across Bronze/Silver/Gold is a linking problem, and it is solved with context, not with a bigger model. A [data engineering agent](/blog/what-is-data-engineering-agent-2026/) built this way treats every validated query as training data for the next one — so the answer to "which layer answers this?" gets more accurate every week, rather than being re-guessed on each run. Medallion organizes the *data*; the context engine organizes the *meaning* on top of it. The two are complementary — the context engine does not replace your Gold layer, it makes it navigable to an agent.

## 8. Practical checklist

1. **Treat medallion as a default, not a mandate.** Small or simple datasets can skip layers. Apply the ceremony where refinement genuinely earns it.
2. **Keep Gold small and authoritative.** Reserve it for cross-team KPIs; push domain-specific marts into a separate layer so you don't breed competing sources of truth.
3. **Never write to Silver straight from ingestion.** Land in Bronze first so schema changes and corrupt records don't break the clean layer.
4. **Test at every hop.** Add quality checks (or [data contracts](/blog/what-is-data-contract/)) at each boundary so errors surface at the layer that introduced them, not three hops later.
5. **Document which table is authoritative for which question** — the layer name doesn't. Annotate the canonical Gold definitions and the full-grain Silver sources.
6. **Give agents the whole ladder, plus context.** Let them reach Silver and Bronze for investigation, but ground them with governed definitions and reference SQL so they don't re-derive metrics inconsistently.

## Conclusion

**Medallion architecture** is a durable, useful convention: Bronze preserves truth, Silver makes it clean, Gold makes it usable. But it is a labeling discipline for *data quality*, not a system that encodes *meaning* — and it was designed for human consumers reading dashboards, not agents diagnosing causes. Teams that stop at "we have Bronze, Silver, Gold" still watch agents pick the wrong table and re-derive the wrong number. The layers tell you how refined a table is; only evolvable context tells an agent which table to trust for the question in front of it — and keeps getting that right as the warehouse changes.

## Frequently asked questions

### What is the difference between Bronze, Silver, and Gold layers?

**Bronze** is raw, immutable source data — appended as-is with provenance metadata, used for auditing and reprocessing, and not meant for analyst access. **Silver** is cleaned, deduplicated, and conformed data at full grain, with at least one validated non-aggregated record per entity; this is where joins, type casting, and schema enforcement happen. **Gold** is business-ready: aggregated, dimensionally modeled (star schema or marts), denormalized and optimized for dashboards and reporting. Quality and business-readiness increase Bronze → Silver → Gold, while row-level granularity typically decreases.

### Is the medallion architecture required for a lakehouse?

No. Databricks, which popularized the term, explicitly calls it "a recommended best practice but not a requirement." Medallion is a naming convention layered on top of a lakehouse — you can run a lakehouse with no medallion labels at all, and you can apply the Bronze/Silver/Gold labels inside a traditional data warehouse. It is most valuable for batch analytical refinement across many datasets; for a small or simple pipeline the three-layer ceremony can add more overhead than value.

### Is the Gold layer the same as a semantic layer?

No. The Gold layer is a set of physical, aggregated tables in the lakehouse. A semantic layer sits above those tables and adds *meaning*: governed metric formulas, entity relationships, friendly names, and the grain and filters a metric uses. Gold forms the basis for a semantic layer, but querying Gold directly still requires an agent or analyst to know which table is authoritative and how a metric is defined — which is exactly what the semantic layer, and broader evolvable context, supplies.

### Which medallion layer should an AI agent query?

It depends on the task. For a governed headline KPI, Gold is correct — it matches the certified numbers. To diagnose *why* a metric changed, an agent needs Silver, because aggregation in Gold discards the causal detail. To reconcile against a source system, Bronze is the ground truth. Ad-hoc cross-domain questions usually need Silver joined via validated reference SQL, since no single Gold mart spans them. The hard part is not reaching the layers but knowing which table within them is authoritative — knowledge that lives in context, not in the layer name.

## Related articles

- [What is a lakehouse?](/blog/what-is-lakehouse/) — the storage architecture medallion layers ride on
- [What is a data lake?](/blog/what-is-data-lake/) — the raw/curated zones medallion formalized
- [What is a semantic layer?](/blog/what-is-semantic-layer/) — the meaning layer above Gold
- [What is schema linking?](/blog/what-is-schema-linking/) — how agents pick the right table across layers
- [Contextual data engineering](/blog/contextual-data-engineering/) — evolvable context over the medallion
