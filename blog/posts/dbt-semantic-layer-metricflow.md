---
title: "dbt Semantic Layer & MetricFlow: A Complete Guide for Data Engineers"
description: "How dbt Semantic Layer and MetricFlow work, what they mean for data engineering teams, and how they fit with data engineering agents."
author: "Evan Paul"
date: 2026-06-09
lastmod: 2026-06-10
head:
  - - meta
    - name: keywords
      content: "dbt semantic layer, MetricFlow, dbt MetricFlow guide, dbt semantic layer explained, MetricFlow architecture, dbt metrics, semantic layer dbt"
  - - meta
    - property: og:title
      content: "dbt Semantic Layer & MetricFlow: A Complete Guide for Data Engineers"
  - - meta
    - property: og:description
      content: "How dbt Semantic Layer and MetricFlow work, what they mean for data engineering teams, and how they fit with data engineering agents."
  - - meta
    - property: og:type
      content: article
  - - meta
    - property: og:url
      content: https://datus.ai/blog/posts/dbt-semantic-layer-metricflow
  - - meta
    - property: og:image
      content: https://datus.ai/logo_dark.svg
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - link
    - rel: canonical
      href: https://datus.ai/blog/posts/dbt-semantic-layer-metricflow
---

# dbt Semantic Layer & MetricFlow: A Complete Guide for Data Engineers

Last year, defining a new metric in a dbt project worked like this: write the transformation SQL in a dbt model, document the business logic in a YAML description field (if you remembered), repeat the same logic in Looker's LookML for the dashboard layer, and hope that whoever queries the data six months later understands that `mktg_analytics.fact_attrib_daily.attrib_windows_30d_v2` means "30-day attribution window revenue." The metric existed in four places — the dbt model, the docs, the LookML, and the analyst's head — and keeping them synchronized was a manual process that everyone agreed was valuable and nobody had time to maintain. MetricFlow — the open-source engine behind dbt's Semantic Layer — changes this by making metric definitions a standalone, governed artifact: define `net_revenue` once in YAML, and every BI tool, notebook, API, and AI agent queries the same definition. This article explains how MetricFlow works, what it does well, where it hits its limits, and how it fits into a broader architecture that includes [data engineering agents](/posts/what-is-data-engineering-agent).

## TL;DR

- **MetricFlow** is the open-source engine behind dbt's Semantic Layer — defining metrics, dimensions, and semantic models in YAML, generating correct SQL at query time.
- It was **open-sourced in late 2025** (Apache 2.0), making it the reference implementation for Git-managed, composable, grain-aware metric definitions.
- Core architecture: **semantic models** describe data sources (measures, dimensions, entities); **metrics** compose measures across models with dimensions, filters, and time granularity; the **query API** (dbt Cloud) serves metrics to BI tools, notebooks, and agents.
- Strengths: Git-managed governance, CI/CD-validated definitions, multi-engine SQL generation, composable derived metrics, strong dbt ecosystem integration.
- Limitations: **engineer-maintained, batch-updated** — new ad-hoc queries and feedback cycles have no path into MetricFlow YAML until a PR is opened. This is the gap data engineering agents fill: bootstrapping metric candidates from production SQL and feeding validated queries back into context continuously.
- Datus auto-generates MetricFlow-compatible semantic models and metrics (`/gen_semantic_model`, `/gen_metrics`), stores them alongside existing dbt definitions, and uses them to ground agent-generated SQL — complementing dbt's governance with continuous context evolution.

## 1. What dbt Semantic Layer actually is

The dbt Semantic Layer has two parts:

- **MetricFlow** — the open-source engine that defines and queries metrics. This is the technology. It is Apache 2.0, standalone, and usable without dbt Cloud.
- **dbt Cloud Semantic Layer** — the hosted query API and governance layer. This is the product. It exposes MetricFlow definitions through a REST API with caching, access control, and integrations with BI tools (Looker, Tableau, ThoughtSpot, Hex, Mode).

The separation matters: you can run MetricFlow locally or in your own infrastructure (open-source), and you can optionally use dbt Cloud to serve it at scale (product). Most teams start with MetricFlow definitions in their dbt project and evaluate dbt Cloud for production serving.

A minimal MetricFlow project has three artifact types:

```yaml
# 1. Semantic model — describes one data source
semantic_model:
  name: orders
  node_relation:
    schema_name: prod
    alias: fact_orders
  measures:
    - name: net_revenue_amount
      agg: sum
      expr: revenue_usd - refund_usd - chargeback_usd
  dimensions:
    - name: order_date
      type: time
      type_params:
        time_granularity: day
    - name: region
      type: categorical
  entities:
    - name: order
      type: primary
    - name: customer
      type: foreign
      expr: customer_id

# 2. Metric — a governed KPI, potentially composable
metric:
  name: net_revenue
  description: "Revenue net of refunds and chargebacks, completed orders only"
  type: simple
  type_params:
    measure:
      name: net_revenue_amount
      filter: |
        {{ Dimension('order_id__order_status') }} = 'completed'
  time_granularity: day
  dimensions:
    - region
    - product_line

# 3. Derived metric — composes multiple simple metrics
metric:
  name: gross_margin_pct
  type: ratio
  type_params:
    numerator: net_revenue
    denominator: net_revenue
    numerator_measure: net_revenue_amount
    denominator_measure: revenue_amount
```

When a BI tool or an agent queries `net_revenue` by region for the last month, MetricFlow resolves the semantic model reference, constructs the correct SQL with joins, filters, and aggregations, and executes it against the configured data platform — same metric definition, different SQL dialects depending on whether the target is Snowflake, BigQuery, or DuckDB.

## 2. MetricFlow's architecture: what happens at query time

MetricFlow's query resolution is what makes it more than a YAML-to-SQL transpiler:

1. **Parse the metric request** — which metric, which dimensions, which time range, which filters.
2. **Resolve semantic model references** — the metric references a measure in a semantic model; MetricFlow locates the model, reads its `node_relation` (which physical table), and loads its dimensions and entities.
3. **Construct the join graph** — if the requested dimensions live in different semantic models (e.g. `region` in the `geo` model, `plan_tier` in the `subscriptions` model), MetricFlow walks the entity graph to find valid join paths and warns if the path is ambiguous.
4. **Validate grain** — ensures that aggregating a monthly metric at daily grain requires explicit configuration; prevents the most common class of silent aggregation errors.
5. **Generate SQL** — produces optimized SQL for the target engine, handling dialect-specific syntax (e.g. Snowflake's `DATE_TRUNC` vs BigQuery's `TIMESTAMP_TRUNC`).
6. **Execute and return** — optionally through dbt Cloud's caching layer for repeated queries.

The value is not in any single step but in the **entirety**: MetricFlow takes a declarative metric definition and handles everything from semantic resolution to engine-specific SQL generation — without the consumer needing to know which tables, which joins, or which SQL dialect.

## 3. What MetricFlow does well

**Governance through Git.** Metric definitions live in the same repo as transformations, reviewed through the same PR process, validated through the same CI pipeline. This is the gold standard for metric governance — no drift between "the metric in the dashboard" and "the metric in the code."

**Grain enforcement.** MetricFlow's grain validation catches a class of errors that silently corrupt dashboards — typically, aggregating a metric defined at "order" grain at "customer" grain without a defined allocation rule. Most BI tools either produce wrong numbers silently or require the analyst to know which metrics are safe to re-aggregate.

**Multi-engine portability.** Define once, query on Snowflake, BigQuery, Databricks, Postgres, or DuckDB. This is not just convenience — it is architecture. Teams running a Snowflake warehouse and a DuckDB analytics layer can share metric definitions without maintaining parallel implementations.

**Composable derived metrics.** `gross_margin_pct = (net_revenue - cogs) / net_revenue` — with `net_revenue` and `cogs` potentially defined in different semantic models, at different grains, with different filters. MetricFlow resolves the composition, constructs the combined SQL, and returns a single result. This composability is what separates a metric layer from a curated view library.

**Ecosystem momentum.** dbt's 30K+ customer base means MetricFlow has the largest adoption surface of any semantic layer engine. When Looker, Tableau, and ThoughtSpot integrate with dbt Semantic Layer, they are integrating with MetricFlow — making it a de facto standard for governed metrics.

## 4. Where MetricFlow hits its limits

**Engineer-maintained, batch-updated.** Every metric definition requires a PR. This works beautifully for certified, stable KPIs — `net_revenue`, `active_users_28d`, `gross_margin_pct`. It breaks down for the metrics that emerge from ad-hoc analysis: the cohort retention query an analyst wrote this morning, the dimensional split that surfaced in a board deck review, the edge-case filter that an agent discovered through user feedback. These have no path into MetricFlow YAML until someone opens a PR — which, in practice, often means never.

**No feedback loop.** When a BI tool or an agent queries MetricFlow and the result is wrong — wrong filter, wrong join, wrong grain — there is no mechanism for the consumer to feed that correction back into the metric definition. The correction lives in Slack, in a Jira ticket, or in the analyst's head. The next consumer makes the same mistake.

**Authoring overhead.** Defining a semantic model requires understanding the physical schema, the business meaning of each column, the valid join paths, and the applicable business rules — then encoding all of that in YAML with correct syntax. For a team with 500 tables and 3 analytics engineers, comprehensive semantic modeling is an aspiration, not a practical goal. Most teams model the top 20% of tables and accept that the remaining 80% is raw schema.

**Static context.** MetricFlow defines metrics as they *were* at the last deploy. It has no mechanism for incorporating provisional context — "don't use `status` before March; use `status_v2`" — or validated ad-hoc SQL that has not been promoted to a formal metric. In the AI agent era, where agents generate new SQL daily, static context at deploy-time granularity is increasingly insufficient.

## 5. How data engineering agents complement MetricFlow

The limitations above are not flaws in MetricFlow — they are consequences of its design as a **governance layer**. Governance requires review; review takes time; the gap between "this SQL is correct and useful" and "this SQL is a certified metric in MetricFlow" is inherent to any review-gated system.

Data engineering agents operate in that gap. The pattern:

1. **Agent bootstraps metric candidates** — Datus `/gen_metrics` scans historical SQL, identifies recurring aggregation patterns, and generates MetricFlow-compatible metric YAML drafts. These are candidates, not certified metrics — but they are 80%-correct starting points that skip the "blank page" phase of metric authoring.

2. **Agent maintains provisional context** — validated ad-hoc SQL, deprecation notes, edge-case filters, and dimensional splits that have not been promoted to MetricFlow yet live in the agent's context and are injected into every query. This is the "fast feedback buffer" between discovery and formal governance.

3. **Feedback flow is continuous** — when an analyst upvotes a query, that SQL becomes candidate reference material. When an issue is reported, the context is refined. This cycle operates at query-time speed, not sprint-cycle speed.

4. **Promotion is a deliberate step** — metrics that have accumulated sufficient validation (consistent upvotes, no issues, multiple analysts using the pattern) are promoted to formal MetricFlow definitions. The promotion is still PR-gated — governance is preserved — but the metric arrives at the PR with production validation, not as a greenfield proposal.

This combination — MetricFlow for governed, certified metrics; data engineering agent for continuous context evolution — is the durable pattern. MetricFlow without an agent is precise but slow. An agent without MetricFlow is fast but ungoverned. Together, they produce metrics that are both current and certified.

## 6. Practical: how to start with MetricFlow

**If you already use dbt:** Add MetricFlow to your project. Start with 5–10 core metrics — the ones that cause arguments in leadership meetings. Define them, validate the generated SQL against known correct queries, and serve them through dbt Cloud or the open-source MetricFlow server. Expand to 20–30 metrics as the pattern proves out.

**If you do not use dbt:** MetricFlow can run standalone, but most of its value comes from the dbt ecosystem — semantic models that reference dbt models, CI that validates semantic definitions alongside transformations, and the dbt Cloud query API. Evaluate whether adopting dbt for transformations is a prerequisite or whether Cube (which has a different architecture but comparable capability) is a better fit for your stack.

**If you are evaluating both MetricFlow and Cube:** The decision comes down to architectural preference more than capability: MetricFlow is Git-centric, transformation-aligned, and strongest in dbt-native environments. Cube is API-centric, consumption-aligned, and strongest in embedded analytics and multi-tool environments. Both support OSI; both are moving toward agentic analytics. The durable advice: choose the one whose authoring workflow fits your team, and ensure your metric definitions are exportable (OSI-compatible) so you are not locked in.

## Conclusion

MetricFlow solved the right problem at the right time: metric governance through Git, at a moment when the modern data stack had produced thousands of dbt projects with thousands of metric definitions scattered across models, docs, and BI tools. Its strengths — composability, grain enforcement, multi-engine SQL generation — are real and well-executed. Its limitation is not technical but philosophical: governance through PR review and governance through continuous feedback are in tension. A PR-gated metric definition is safe. A continuously-evolving metric definition is current. The industry needs both — and the unresolved question is who owns the boundary between them. Should the certified metric catalog be the only source of truth that agents query, with everything else treated as provisional? Should agent-validated SQL have a fast path to promotion that bypasses the full PR cycle? Should the governance model itself become event-driven — metrics promoted automatically when they cross a validation threshold — rather than calendar-driven? These are not implementation details. They are architectural decisions about who and what gets to define "the number," and at what speed. The teams that answer them well will have metrics that are both governed and current. The teams that default to PR-only governance will have metrics that are governed and stale.

## Frequently asked questions

### What is MetricFlow?

**MetricFlow** is the open-source engine (Apache 2.0) behind dbt's Semantic Layer. It defines metrics, dimensions, and semantic models in YAML, then generates correct SQL at query time for Snowflake, BigQuery, Databricks, Postgres, and DuckDB. It is the reference implementation for Git-managed, composable metric definitions.

### Is MetricFlow free?

Yes. MetricFlow is open-source under Apache 2.0. The query API for serving metrics at scale (with caching, access control, BI integrations) is part of dbt Cloud, which is a paid product. You can run MetricFlow standalone at no cost.

### Do I need dbt to use MetricFlow?

MetricFlow is designed to work with dbt transformations — semantic models typically reference dbt models — but the engine itself can be used standalone. In practice, most teams adopt MetricFlow as part of a dbt project because the integration (semantic models referencing dbt models, CI/CD validation, documentation) is where the value lives.

### How is MetricFlow different from Cube?

MetricFlow is **Git-centric**: metrics are YAML files in a dbt project, governed through PRs and CI/CD, and served through a query API (dbt Cloud). Cube is **API-centric**: metrics are defined in JavaScript or YAML cube models, governed through Cube's platform, and served through SQL, REST, and GraphQL APIs. MetricFlow is strongest in dbt-native environments; Cube is strongest in embedded analytics and headless BI. Both support the OSI standard for semantic interoperability.

### Can a data engineering agent generate MetricFlow definitions?

Yes. Datus `/gen_semantic_model` and `/gen_metrics` generate MetricFlow-compatible YAML from live schema and historical SQL. These are metric candidates — 80%-correct drafts that engineers review and refine — rather than auto-committed certified metrics. The value is speed: the agent produces a draft in seconds that would take an engineer 20–40 minutes to write from scratch, and the review step preserves governance.

## Related articles

- [What is a metric layer?](/posts/what-is-metric-layer) — the KPI catalog MetricFlow implements
- [What is a semantic model?](/posts/what-is-semantic-model) — the building block MetricFlow queries
- [What is a semantic layer?](/posts/what-is-semantic-layer) — the full business dictionary
