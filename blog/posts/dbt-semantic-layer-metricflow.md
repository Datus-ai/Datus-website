---
title: "dbt Semantic Layer & MetricFlow: Architecture and Limits"
description: "How MetricFlow powers dbt's Semantic Layer, where it works, where it falls short, and how AI data agents and OSI-native alternatives extend governed metrics."
author: "Evan Paul"
date: 2026-06-09
lastmod: 2026-09-13
head:
  - - meta
    - name: keywords
      content: "dbt semantic layer, MetricFlow, MetricFlow architecture, MetricFlow license, MetricFlow Apache 2.0, dbt semantic layer explained, dbt metrics, semantic layer dbt, MetricFlow alternatives, Dosi"
  - - meta
    - property: og:title
      content: "dbt Semantic Layer & MetricFlow: Architecture and Limits"
  - - meta
    - property: og:description
      content: "How MetricFlow powers dbt's Semantic Layer, where it works, where it falls short, and how AI data agents and OSI-native alternatives extend governed metrics."
  - - meta
    - property: og:type
      content: article
  - - meta
    - property: og:url
      content: https://datus.ai/blog/dbt-semantic-layer-metricflow/
  - - meta
    - property: og:image
      content: https://datus.ai/logo_dark.svg
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - link
    - rel: canonical
      href: https://datus.ai/blog/dbt-semantic-layer-metricflow/
---

# dbt Semantic Layer & MetricFlow: Architecture and Limits

## TL;DR

- **MetricFlow is the query engine behind [dbt's Semantic Layer](https://docs.getdbt.com/docs/use-dbt-semantic-layer/dbt-sl)** — define metrics, dimensions, and semantic models in YAML, and it generates correct SQL at query time across Snowflake, BigQuery, Databricks, Postgres, and DuckDB.
- **The license path matters:** MetricFlow shipped under AGPL, moved to the restrictive BSL after dbt Labs acquired Transform in 2023 (production serving required dbt Cloud), then [relicensed to permissive Apache 2.0 in October 2025](https://www.getdbt.com/blog/open-source-metricflow-governed-metrics), aligning it with [Open Semantic Interchange (OSI, now Apache Ossie)](/blog/open-semantic-interchange-osi/).
- **Strengths:** Git-managed governance, CI/CD-validated definitions, grain enforcement, multi-engine SQL, and composable derived metrics.
- **Limits:** it is engineer-maintained and batch-updated — ad-hoc queries and corrections have no path into the YAML until someone opens a PR.
- **Alternatives & complements:** OSI-native runtimes like [Dosi](/blog/introducing-dosi/) compile the same definitions across 15+ dialects, and AI data agents keep provisional context current between PRs.

**MetricFlow is the query engine behind dbt's Semantic Layer** — the runtime that turns a declarative metric definition into correct SQL. You define a metric like `net_revenue` once in YAML — its measures, dimensions, joins, and grain — and MetricFlow generates the right query for whatever BI tool, notebook, API, or AI agent asks for it, on whatever warehouse you run. Data teams care because it kills metric drift: the number in the dashboard, the number in the code, and the number an agent returns all resolve to one governed definition. Its limits are the flip side of that governance — every metric change is a PR, so the layer is always one review cycle behind the analysis happening on top of it. This article covers how MetricFlow works, its licensing path to Apache 2.0, where it excels, where it falls short, and the [OSI-native](/blog/osi-vs-metricflow/) and agent-driven approaches that extend it.

## 1. What dbt Semantic Layer actually is

The dbt Semantic Layer has two parts:

- **[MetricFlow](https://github.com/dbt-labs/metricflow)** — the open-source engine that defines and queries metrics. This is the technology. Since October 2025 it is [Apache 2.0](https://docs.getdbt.com/docs/build/about-metricflow), standalone, and usable without dbt Cloud.
- **dbt Cloud Semantic Layer** — the hosted query API and governance layer. This is the product. It exposes MetricFlow definitions through a REST API with caching, access control, and integrations with BI tools (Looker, Tableau, ThoughtSpot, Hex, Mode).

The separation matters: you can run MetricFlow locally or in your own infrastructure (open-source), and you can optionally use dbt Cloud to serve it at scale (product). Most teams start with MetricFlow definitions in their dbt project and evaluate dbt Cloud for production serving.

The Apache 2.0 license is recent, and the path to it shapes today's ecosystem. MetricFlow began at Transform (acquired by dbt Labs in 2023) under the Affero GPL, then moved to the Business Source License (BSL) — open to read and run locally, but production serving was gated behind dbt Cloud. At Coalesce 2025, dbt Labs relicensed it to Apache 2.0 and committed it to the [Open Semantic Interchange (OSI)](/blog/osi-vs-metricflow/) effort alongside Snowflake and Salesforce, so any vendor can now build on the engine without lock-in. That shift is what makes portable, OSI-native alternatives practical rather than theoretical.

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

## 5. Extending MetricFlow: OSI, Dosi, and continuous context

The limits above are not flaws in MetricFlow — they are the cost of governance. Review takes time, and the gap between "this SQL is correct and useful" and "this SQL is a certified metric" is inherent to any review-gated system. Two moves extend MetricFlow without giving up that governance.

**Portability through OSI.** Since the Apache 2.0 relicensing, MetricFlow is aligned with [Open Semantic Interchange (OSI)](/blog/osi-vs-metricflow/) — a portable specification for metric definitions — so a metric authored for MetricFlow can be read by other engines. [Dosi](/blog/introducing-dosi/) is an OSI-native runtime that compiles the same semantic definitions into SQL across 15+ warehouse dialects and serves them over CLI, REST, and MCP. That is useful when you want metric execution outside the dbt Cloud query API, or a lighter path for [serving governed metrics to AI agents](/blog/dosi-mcp-semantic-layer-for-agents/). See [Dosi vs MetricFlow](/blog/dosi-vs-metricflow/) for a runtime-level comparison of the two.

**Continuous context.** MetricFlow captures metrics as they *were* at the last deploy. The ad-hoc query an analyst wrote this morning, the deprecation note ("use `status_v2` after March"), the edge-case filter surfaced in review — none of it reaches the YAML until a PR lands. Keeping that provisional context live between deploys, and promoting it to formal MetricFlow definitions once it has accumulated validation, is how teams stay both current and governed.

Together: MetricFlow for governed, certified metrics; OSI and Dosi for portable execution; a live context layer for the fast-moving edge. MetricFlow alone is precise but slow to change. Paired with a portable runtime and continuous context, metrics stay both current and certified.

## 6. Practical: how to start with MetricFlow

**If you already use dbt:** Add MetricFlow to your project. Start with 5–10 core metrics — the ones that cause arguments in leadership meetings. Define them, validate the generated SQL against known correct queries, and serve them through dbt Cloud or the open-source MetricFlow server. Expand to 20–30 metrics as the pattern proves out.

**If you do not use dbt:** MetricFlow can run standalone, but most of its value comes from the dbt ecosystem — semantic models that reference dbt models, CI that validates semantic definitions alongside transformations, and the dbt Cloud query API. Evaluate whether adopting dbt for transformations is a prerequisite or whether Cube (which has a different architecture but comparable capability) is a better fit for your stack.

**If you are evaluating both MetricFlow and Cube:** The decision comes down to architectural preference more than capability: MetricFlow is Git-centric, transformation-aligned, and strongest in dbt-native environments. Cube is API-centric, consumption-aligned, and strongest in embedded analytics and multi-tool environments. Both support OSI; both are moving toward agentic analytics. The durable advice: choose the one whose authoring workflow fits your team, and ensure your metric definitions are exportable (OSI-compatible) so you are not locked in.

## Conclusion

MetricFlow solved the right problem at the right time: metric governance through Git, at a moment when the modern data stack had produced thousands of dbt projects with thousands of metric definitions scattered across models, docs, and BI tools. Its strengths — composability, grain enforcement, multi-engine SQL generation — are real and well-executed. Its limitation is not technical but philosophical: governance through PR review and governance through continuous feedback are in tension. A PR-gated metric definition is safe. A continuously-evolving metric definition is current. The industry needs both — and the unresolved question is who owns the boundary between them. Should the certified metric catalog be the only source of truth that agents query, with everything else treated as provisional? Should agent-validated SQL have a fast path to promotion that bypasses the full PR cycle? Should the governance model itself become event-driven — metrics promoted automatically when they cross a validation threshold — rather than calendar-driven? These are not implementation details. They are architectural decisions about who and what gets to define "the number," and at what speed. The teams that answer them well will have metrics that are both governed and current. The teams that default to PR-only governance will have metrics that are governed and stale.

## Frequently asked questions

### What is MetricFlow?

**MetricFlow** is the open-source engine (Apache 2.0) behind dbt's Semantic Layer. It defines metrics, dimensions, and semantic models in YAML, then generates correct SQL at query time for Snowflake, BigQuery, Databricks, Postgres, and DuckDB. It is the reference implementation for Git-managed, composable metric definitions.

### Is MetricFlow free? What license is it under?

Yes. Since October 2025, MetricFlow is open-source under **Apache 2.0**. Earlier versions shipped under AGPL and then the BSL — under BSL you could run it locally, but serving metrics in production required dbt Cloud. The Apache 2.0 relicensing removed that restriction; the query API for serving metrics at scale (caching, access control, BI integrations) is still part of dbt Cloud, a paid product, but the engine itself now runs standalone at no cost.

### Do I need dbt to use MetricFlow?

MetricFlow is designed to work with dbt transformations — semantic models typically reference dbt models — but the engine itself can be used standalone. In practice, most teams adopt MetricFlow as part of a dbt project because the integration (semantic models referencing dbt models, CI/CD validation, documentation) is where the value lives.

### How is MetricFlow different from Cube?

MetricFlow is **Git-centric**: metrics are YAML files in a dbt project, governed through PRs and CI/CD, and served through a query API (dbt Cloud). Cube is **API-centric**: metrics are defined in JavaScript or YAML cube models, governed through Cube's platform, and served through SQL, REST, and GraphQL APIs. MetricFlow is strongest in dbt-native environments; Cube is strongest in embedded analytics and headless BI. Both support the OSI standard for semantic interoperability.

### What are the alternatives to MetricFlow?

The closest alternatives are other semantic-layer engines: [Cube](/blog/osi-vs-cube/) (API-centric, strong in embedded analytics) and OSI-native runtimes such as [Dosi](/blog/dosi-vs-metricflow/), which compile the same OSI metric definitions into SQL across 15+ dialects and serve them over CLI, REST, and MCP. Because MetricFlow is now Apache 2.0 and OSI-aligned, a definition authored for MetricFlow is increasingly portable across these engines rather than locking you into one runtime.

## Related articles

- [OSI vs MetricFlow](/blog/osi-vs-metricflow/) — the portable standard vs the execution engine
- [Dosi vs MetricFlow](/blog/dosi-vs-metricflow/) — OSI-native runtime vs dbt-centric runtime
- [What is a metric layer?](/blog/what-is-metric-layer/) — the KPI catalog MetricFlow implements
- [What is a semantic model?](/blog/what-is-semantic-model/) — the building block MetricFlow queries

## External references

- [Announcing open source MetricFlow](https://www.getdbt.com/blog/open-source-metricflow-governed-metrics) — dbt Labs on the Apache 2.0 relicensing
- [About MetricFlow](https://docs.getdbt.com/docs/build/about-metricflow) — dbt developer docs
- [dbt-labs/metricflow](https://github.com/dbt-labs/metricflow) — the source repository
