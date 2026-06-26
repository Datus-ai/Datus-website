---
title: "OSI vs MetricFlow: Semantic Standard vs Execution Engine"
description: "OSI vs MetricFlow: Open Semantic Interchange is the portable semantic standard; MetricFlow is dbt's execution engine—how they differ and when to use each."
author: "Harrison Zhao"
date: 2026-06-25
lastmod: 2026-06-25
head:
  - - meta
    - name: keywords
      content: "OSI vs MetricFlow, Open Semantic Interchange, MetricFlow, dbt semantic layer, semantic layer standard, semantic interchange, portable metrics, dbt MetricFlow OSI"
  - - meta
    - property: og:title
      content: "OSI vs MetricFlow: Semantic Standard vs Execution Engine"
  - - meta
    - property: og:description
      content: "OSI vs MetricFlow: Open Semantic Interchange is the portable semantic standard; MetricFlow is dbt's execution engine—how they differ and when to use each."
  - - meta
    - property: og:type
      content: article
  - - meta
    - property: og:url
      content: https://datus.ai/blog/posts/osi-vs-metricflow
  - - meta
    - property: og:image
      content: https://datus.ai/logo_dark.svg
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - link
    - rel: canonical
      href: https://datus.ai/blog/posts/osi-vs-metricflow
---

# OSI vs MetricFlow: Semantic Standard vs Execution Engine

"OSI vs MetricFlow" is one of those comparisons that sounds like a head-to-head product choice but mostly isn't. Once you disambiguate the acronym, the useful version of the question is **Open Semantic Interchange (OSI) vs MetricFlow** — and there the honest answer is that they are not substitutes. OSI is a portable **specification** for semantic metadata; MetricFlow is an **execution engine** that turns semantic definitions into warehouse SQL. One is a contract, the other is a runtime. This article clears up the ambiguity, compares the two on the dimensions that actually matter, and explains when to reach for each — or, more often, both together.

> **Disclosure:** This is an independent analysis published on the Datus blog. Datus builds a [data engineering agent](/blog/what-is-data-engineering-agent-2026/); where that perspective is relevant it is flagged explicitly, and the comparison itself is vendor-neutral.

## TL;DR

- **OSI** ([Open Semantic Interchange](/blog/open-semantic-interchange-osi/)) is an Apache 2.0, vendor-neutral **standard** for representing and exchanging semantic metadata — metrics, dimensions, datasets, relationships — across tools.
- **MetricFlow** is dbt Labs' open-source **semantic metrics engine**: it consumes semantic definitions, builds a query plan, and generates warehouse-specific SQL.
- They operate at **different layers**. OSI = portable definition; MetricFlow = execution of that definition. dbt has stated MetricFlow is maintained as part of the OSI initiative, and recent dbt Core versions can parse OSI semantic documents alongside native dbt semantics.
- "OSI" is genuinely ambiguous: it can also mean the **networking OSI model** (ISO/IEC 7498-1) or **Amazon OpenSearch Ingestion** (a telemetry service). Neither competes with MetricFlow — they belong to different decision categories.
- Practical rule: choose **OSI** for portable semantics across tools, **MetricFlow** for governed metric execution in a dbt-centered stack, and **OSI + MetricFlow** when you want both.

## 1. First, disambiguate "OSI"

Before comparing anything, settle which OSI you mean — the recommendation changes completely depending on the answer.

| "OSI" interpretation | What it is | Comparable to MetricFlow? |
| --- | --- | --- |
| **Open Semantic Interchange** | A vendor-neutral standard for exchanging semantic metadata across analytics, AI, and BI tools | **Yes** — same problem space; complementary layers |
| **OSI model** (networking) | The ISO/IEC seven-layer Open Systems Interconnection *reference* model | No — a conceptual networking model, not software |
| **Amazon OpenSearch Ingestion** | A serverless AWS pipeline for streaming logs, metrics, and traces into OpenSearch | No — telemetry ingestion, not a business-metrics layer |

The rest of this article is about **Open Semantic Interchange**, because that is the only interpretation where "OSI vs MetricFlow" is a meaningful, decision-relevant comparison. If you actually meant the networking model or the AWS service, the right move is not to "choose" between them and MetricFlow — it is to clarify the underlying problem, because the technologies live in different layers of the stack entirely.

## 2. Specification vs execution: the core distinction

The cleanest mental model is to separate **what a metric is** from **how a metric runs**.

- **OSI is the specification layer.** It defines a portable schema for datasets, fields, relationships, metrics, dialects, and extensions. An OSI document says *what* `net_revenue` means and how it relates to other entities — it does not execute anything. Its value is interoperability: a definition authored once can move across compatible tools without re-authoring. The specification is developed in the open at <a href="https://github.com/open-semantic-interchange/OSI" rel="nofollow noopener">github.com/open-semantic-interchange/OSI</a> as a JSON- and YAML-based standard with converters, examples, and validation tooling.
- **MetricFlow is the execution layer.** It consumes semantic definitions, builds a semantic graph, plans the query through an internal dataflow DAG, and emits warehouse-specific SQL. Its value is correctness and governance at runtime: automatic join selection, protection against fan-out and chasm joins, time-spine handling for cumulative metrics, and actual SQL execution against supported warehouses. MetricFlow is documented as part of <a href="https://docs.getdbt.com/docs/build/about-metricflow" rel="nofollow noopener">dbt's semantic layer</a>.

Put differently: **OSI is a semantic contract; MetricFlow is a semantic runtime.** That is exactly why they complement each other better than they compete. You can author a portable definition in OSI and execute it through MetricFlow — and because dbt parses OSI documents alongside native dbt semantic YAML, the two can coexist in a single project.

## 3. Architecture and data flow

In a combined setup, the handoff between specification and execution runs through dbt's semantic manifest:

```
Author semantics
  (OSI JSON  ·  or dbt semantic YAML)
        │
        ▼
dbt parse / compile  ──►  semantic_manifest.json
        │
        ▼
MetricFlow planner  ──►  dataflow DAG + SQL generation
        │
        ▼
Warehouse engine
  (Snowflake · BigQuery · Databricks · Redshift · Postgres · Trino)
        │
        ▼
Consumer interfaces
  (CLI · GraphQL · JDBC · Python SDK · BI integrations)
```

The semantic manifest is the join point between *authored semantics* and *runtime execution*. OSI contributes portability and converter-based interoperability into that pipeline; MetricFlow contributes graph traversal, join logic, and SQL generation out of it. Neither replaces the other — they sit on opposite ends of the same flow.

## 4. Side-by-side comparison

The dimensions below assume the **Open Semantic Interchange** reading of OSI — the only one where the comparison is apples-to-apples.

| Dimension | Open Semantic Interchange (OSI) | MetricFlow |
| --- | --- | --- |
| **Category** | Vendor-neutral interchange **standard** | Semantic metrics **engine** (dbt) |
| **Primary job** | Define and exchange semantic metadata across tools | Compile semantic definitions into warehouse SQL |
| **Core artifacts** | Datasets, fields, relationships, metrics, dialects, extensions | Semantic models, entities, dimensions, measures, metrics, time spine, saved queries |
| **Runtime?** | No — authored and exchanged as files/converters | Yes — builds a dataflow plan and renders SQL |
| **Query interfaces** | None by itself; relies on consuming tools | CLI, GraphQL API, JDBC, Python SDK; BI integrations on the dbt platform |
| **Warehouses** | Engine-agnostic (depends on the consumer) | Snowflake, BigQuery, Databricks, Redshift, Postgres, Trino |
| **Deployment** | Git-managed spec files + converters; parseable by recent dbt Core | Open-source CLI in dbt Core; cloud APIs via the dbt platform |
| **Performance** | No runtime benchmark category — depends on the consuming engine | Latency dominated by warehouse execution, join cardinality, and caching; validate against your schema |
| **Maturity** | Emerging: launched Sept 2025, 60+ participating organizations, still early version (0.1.x) | Production-grade within dbt ecosystems; first-class dbt integration |
| **Best for** | Portability, AI/BI interoperability, escaping vendor lock-in | Centralized metric governance and execution in a dbt-centered stack |
| **Main limitation** | Not an execution engine or query API on its own | Richest API/integration experience leans on dbt platform plans; warehouse-dependent performance |

The single most important row is **"Runtime?"** — OSI's *No* and MetricFlow's *Yes* are the whole story. A standard that does not execute and an engine that needs definitions to execute are natural partners, not rivals.

## 5. When to choose which

A direct decision rule:

- **Choose OSI** when the problem is **portable semantic definitions across tools** — you want `revenue`, `active customers`, and `retention` defined once and consumed by multiple BI tools, warehouses, and AI agents without metric drift.
- **Choose MetricFlow** when the problem is **executing governed business metrics** in a dbt-centered warehouse stack — you want one metric definition exposed to Tableau, Power BI, Excel, or Google Sheets through dynamic SQL generation instead of copy-pasted dashboard logic.
- **Choose OSI + MetricFlow** when you want **both portability and execution** — OSI as the interchange layer, MetricFlow as the runtime. Because dbt can parse OSI documents next to native dbt semantics, this is a supported combination rather than a hack.
- **Do not frame it as a product choice at all** if you meant the networking OSI model or AWS OpenSearch Ingestion — clarify the business problem first.

The migration trap worth calling out: these are **not drop-in replacements** for one another. Moving from native dbt semantic YAML to OSI is mostly an export/import exercise. Moving from OSI to MetricFlow is about choosing an execution engine. And moving between AWS OpenSearch Ingestion and MetricFlow is not a migration at all — it is a platform redesign, because one handles telemetry ingestion and the other handles warehouse-side business metrics.

## 6. Where the standard stops — and agents begin

Both OSI and MetricFlow address how semantics are **represented** and **executed**. Neither, on its own, solves how semantics get **created, validated, and kept current** — which is where most organizations actually struggle. A perfectly portable, perfectly executable metric that was authored six months ago and never revisited is still stale.

This is the gap [data engineering agents](/blog/what-is-data-engineering-agent-2026/) target. The durable pattern is a layered one: a portable standard (OSI) for distribution, an execution engine (MetricFlow) for runtime, and an evolvable [context](/blog/contextual-data-engineering/) layer that bootstraps definitions from historical SQL, validates them through feedback, and promotes proven ad-hoc queries into the formal model. *(Disclosure: this layered "context" approach is the problem space Datus works in — it complements OSI and MetricFlow rather than replacing either.)* Treat OSI as the interchange rails and MetricFlow as the execution engine; the open question every team still owns is how those definitions stay accurate over time.

## 7. Common misconceptions

A few recurring misreadings make this comparison harder than it needs to be.

**"OSI is a Snowflake product."** Snowflake initiated and leads the working group, but the specification is Apache 2.0 and vendor-neutral by design, with Databricks, Google, AWS, dbt Labs, and 60+ organizations participating. Treating it as a single-vendor play misreads both the licensing and the incentive structure — a portability standard only works if competing platforms adopt it, which is precisely why the membership is so broad.

**"Adopting OSI means replacing MetricFlow."** The opposite is closer to the truth. OSI standardizes the interchange format while MetricFlow remains a way to author and execute, and dbt's ability to parse OSI documents alongside native semantics means the two coexist in a single project. Moving to OSI is an export/import exercise, not an engine swap, so framing adoption as "OSI instead of MetricFlow" usually leads teams to over-scope the work.

**"MetricFlow requires the paid dbt platform."** MetricFlow is open-source and runs in dbt Core through the CLI for authoring and local query execution. What the commercial dbt platform adds is the hosted Semantic Layer APIs — GraphQL, JDBC, the Python SDK — and managed BI integrations. Those matter for metrics-as-API patterns, but they are not a prerequisite for defining metrics or compiling them into SQL.

**"A portable, executable metric is automatically a correct metric."** Neither tool validates that a definition matches business reality. They guarantee that the definition travels (OSI) and runs (MetricFlow) — not that `net_revenue` excludes the right test accounts or recognizes revenue on the right date. Correctness is a governance and validation problem that sits upstream of both, which is why review processes and feedback loops still matter no matter which tools you standardize on. It is also why "OSI vs MetricFlow" is rarely a single buying decision: the realistic question is not *which one*, but whether you need portability, execution, or both.

## Conclusion

"OSI vs MetricFlow" dissolves into clarity the moment you pin down the acronym. In the **Open Semantic Interchange** reading — the only one that makes the comparison meaningful — OSI is the portable standard and MetricFlow is the execution engine, and the right architecture usually uses both. In the networking-model or AWS-OpenSearch-Ingestion readings, there is no contest to be had; they are different layers of the stack. The broader lesson holds regardless of interpretation: semantic definitions are infrastructure, infrastructure should be portable *and* executable, and the part no standard fully solves — keeping those definitions current — is where the next layer of tooling earns its place.

## Frequently asked questions

### What is the difference between OSI and MetricFlow?

Open Semantic Interchange (OSI) is a **standard** for representing and exchanging semantic metadata across tools. MetricFlow is an **engine** that consumes semantic definitions and generates warehouse SQL. OSI defines *what* a metric is in a portable way; MetricFlow executes it. They operate at different layers and are typically complementary.

### Does OSI replace MetricFlow?

No. OSI is an interchange format, not an execution engine — it cannot run queries on its own. MetricFlow still does the query planning and SQL generation. OSI makes definitions portable so an engine like MetricFlow can consume them.

### Is MetricFlow part of OSI?

dbt Labs has stated that MetricFlow is maintained as part of the OSI initiative, and recent dbt Core versions can parse OSI semantic documents alongside native dbt semantic definitions. They are aligned, not in competition.

### Are there other things called "OSI"?

Yes — and they are unrelated to MetricFlow. The **OSI model** (ISO/IEC 7498-1) is a seven-layer networking *reference* model. **Amazon OpenSearch Ingestion** is a serverless AWS service for streaming logs, metrics, and traces into OpenSearch. Neither is a business-metrics layer, so neither competes with MetricFlow.

### Should I use OSI, MetricFlow, or both?

Use OSI for portable semantics across multiple tools, MetricFlow for executing governed metrics in a dbt-centered warehouse stack, and both together when you want portability and execution. Because dbt can parse OSI documents next to native dbt semantics, combining them is a supported pattern.

### Does OSI or MetricFlow improve text-to-SQL accuracy?

Indirectly, yes. The top failure mode of [text-to-SQL](/blog/what-is-text-to-sql/) is semantic ambiguity — correct SQL for the wrong business definition. Machine-readable, governed metric definitions (whether exchanged via OSI or executed via MetricFlow) give AI systems grounded business logic instead of raw schema, which is where most accuracy gains actually come from.

## Related articles

- [Open Semantic Interchange (OSI)](/blog/open-semantic-interchange-osi/) — the standard, in depth: who's behind it and why portable semantics matter
- [What is a semantic layer?](/blog/what-is-semantic-layer/) — the business translation layer OSI makes portable and MetricFlow executes
- [dbt Semantic Layer & MetricFlow](/blog/dbt-semantic-layer-metricflow/) — a complete guide to defining metrics with MetricFlow
- [What is a metric layer?](/blog/what-is-metric-layer/) — the KPI-focused subset these tools standardize
- [Datus glossary](/glossary#modeling) — short definitions for the semantic layer, metric layer, and related terms

## About the author

**Harrison Zhao** researches semantic-layer standards and data infrastructure. Connect on <a href="https://www.linkedin.com/in/harrison-zhao-ba920621/" rel="nofollow noopener">LinkedIn</a>.
