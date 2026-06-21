---
title: "What Is a Semantic Model? Definition, Examples & How It Differs From a Semantic View"
description: "Semantic model definition, key components, how it fits into a semantic layer, and how it differs from warehouse-native semantic views."
author: "Evan Paul"
date: 2026-06-08
lastmod: 2026-06-10
head:
  - - meta
    - name: keywords
      content: "semantic model, what is a semantic model, semantic model definition, semantic model vs semantic layer, semantic view, semantic model data engineering, semantic model example"
  - - meta
    - property: og:title
      content: "What Is a Semantic Model? Definition, Examples & How It Differs From a Semantic View"
  - - meta
    - property: og:description
      content: "Semantic model definition, key components, how it fits into a semantic layer, and how it differs from warehouse-native semantic views."
  - - meta
    - property: og:type
      content: article
  - - meta
    - property: og:url
      content: https://datus.ai/blog/posts/what-is-semantic-model
  - - meta
    - property: og:image
      content: https://datus.ai/logo_dark.svg
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - link
    - rel: canonical
      href: https://datus.ai/blog/posts/what-is-semantic-model
---

# What Is a Semantic Model? Definition, Examples & How It Differs From a Semantic View

A data engineer inherits a 500-table Snowflake instance. Somewhere in `analytics_prod` is the data the marketing team needs for their Q3 campaign attribution analysis — but the schema is a landscape of cryptic column names (`attrib_windows_30d_v2`, `conv_type_id_fk`), undocumented join paths, and tribal knowledge that left with the previous engineer. A [semantic layer](/blog/what-is-semantic-layer/) would give her the full business dictionary. But before you can build a dictionary, you need to write the entries. A **semantic model** is a single entry — one dataset, described in business terms: which columns are measures you can quantify, which are dimensions you can group by, how this dataset connects to others, and what business rules apply. This article defines what goes into a semantic model, walks through a MetricFlow example, and distinguishes it from the newer concept of warehouse-native semantic views — including when you would use one over the other.

## TL;DR

- A **semantic model** describes one data source in business language: measures, dimensions, joins, metadata, and business rules — turning `fact_orders.amount_usd` into "Net Revenue, filtered to completed orders."
- It is the **building block** of a semantic layer. A semantic layer is composed of multiple semantic models connected by relationships. A [metric layer](/blog/what-is-metric-layer/) is the subset that standardizes KPIs across those models.
- Common formats: MetricFlow `semantic_model` YAML (dbt), Cube data model JavaScript/YAML, LookML `view` files, GoodData LDM.
- A **semantic view** (Snowflake, BigQuery) is a warehouse-native alternative — semantics defined in SQL inside the database rather than in an external modeling layer. See §5 for the tradeoffs.
- Datus auto-generates semantic models from live schema (`/gen_semantic_model`), stores them in MetricFlow-compatible YAML, and refines them through agent feedback — turning model creation from a manual, sprint-gated process into a continuous one.

## 1. Semantic model: a working definition

A semantic model answers four questions about a dataset that raw schema cannot:

1. **What can I measure here?** — e.g. `orders` lets you measure `net_revenue`, `order_count`, `avg_order_value`, and `gross_margin`.
2. **How do I slice those measures?** — by `region`, `product_line`, `customer_segment`, `order_date`, `acquisition_channel`.
3. **How does this dataset connect to others?** — `orders.customer_id` joins to `customers.id` (many-to-one); `orders.product_id` joins to `products.id` (many-to-one); do NOT join `orders` directly to `subscriptions` — use `customers` as the bridge table.
4. **What business rules apply?** — "Net revenue" always excludes refunds, chargebacks, and test accounts. `order_status` must be `'completed'`. Revenue is recognized at `order_completed_at`, not `order_created_at`.

A useful working definition: a **semantic model** is a machine-readable description of a data source that translates physical schema into business-meaningful objects — measures, dimensions, relationships, and rules — so downstream tools (BI, APIs, agents) can generate correct queries without re-deriving business logic.

## 2. What a semantic model contains

The components are similar across tools, though naming varies. Here is the breakdown using MetricFlow's `semantic_model` format as the reference (since it is open-source and increasingly the standard):

```yaml
semantic_model:
  name: orders
  description: "Completed customer orders with revenue, cost, and channel attribution"
  
  # Which table or view this model maps to
  node_relation:
    schema_name: prod
    alias: fact_orders
  
  # Things you measure — numeric, aggregatable
  measures:
    - name: net_revenue
      description: "Revenue after refunds and chargebacks"
      agg: sum
      expr: revenue_usd - refund_usd - chargeback_usd
    - name: order_count
      agg: count
      expr: order_id
  
  # Things you group or filter by
  dimensions:
    - name: region
      type: categorical
      expr: dim_geo.region_name
    - name: order_date
      type: time
      type_params:
        time_granularity: day
  
  # How this model connects to others
  entities:
    - name: order
      type: primary
      expr: order_id
    - name: customer
      type: foreign
      expr: customer_id
```

Each component serves a different consumer:

| Component | What it does | Who needs it |
| --- | --- | --- |
| **Measures** | Defines what you can quantify and how | Analysts building queries, agents generating SQL, BI tools rendering charts |
| **Dimensions** | Defines valid grouping and filtering axes | Self-serve BI users, agents slicing metrics by "region" or "plan_tier" |
| **Entities / keys** | Defines how this dataset connects to others — primary keys, foreign keys, join paths | Agents generating multi-table queries, BI tools building explores |
| **Description & metadata** | Human-readable context — what this dataset represents, what edge cases to watch for | Anyone encountering this data for the first time, including AI agents that benefit from natural-language context |

## 3. Semantic model vs semantic layer vs metric layer

The three terms form a hierarchy of scope:

| Artifact | Scope | Example |
| --- | --- | --- |
| **Semantic model** | One data source | "The `orders` model: measures (net_revenue, order_count), dimensions (region, date), joins (to customers, products)" |
| **Semantic layer** | The full business dictionary — all semantic models + their relationships + governance rules | "Our semantic layer: 30 models across finance, product, and marketing domains, connected through shared entities" |
| **Metric layer** | The standardized KPI catalog — metrics that span models and are consumable through APIs | "`net_revenue` metric: defined across orders and refunds models, certified by Finance, queryable through the metric API" |

Think of it as a book: a semantic model is a chapter describing one subject. The semantic layer is the entire book — all chapters plus the index of relationships between them. The metric layer is the appendix of standardized formulas that readers across the organization agree to use.

Common confusion: people say "we need a semantic layer" when they mean "we need to build semantic models for our 10 most important tables." The semantic layer is the container; semantic models are the content. You build semantic models first, then connect them, then govern the whole thing as a layer.

## 4. How semantic models are created — traditional vs agent-driven

**Traditional approach (dbt / Looker / Cube):**

An analytics engineer examines a table, interviews domain experts, writes a semantic model YAML or LookML file, opens a PR, gets review, merges, and deploys. This produces high-quality, well-governed models — but at the pace of a development sprint. For a team with 500 tables and 3 analytics engineers, modeling everything is impossible; they model the 20% that serves 80% of queries and leave the rest as raw schema.

**Agent-driven approach (Datus `/gen_semantic_model`):**

A data engineering agent connects to the database, inspects the schema, reads column statistics, analyzes historical SQL usage, and auto-generates a semantic model draft — identifying likely measures (numeric columns with aggregation patterns), dimensions (categorical columns used in GROUP BY), and primary/foreign key relationships. The engineer reviews and refines the draft — not building from scratch, but editing an 80%-correct proposal to 100%. This shifts the bottleneck from creation to review, making it practical to maintain semantic models for a much larger portion of the data estate.

The two approaches are not opposed — they are sequential. The agent drafts; the engineer curates. For a table with high query volume and business criticality, human review is thorough. For a table queried twice a month by one analyst, an 80%-accurate agent-generated model is better than no model at all.

## 5. Semantic model vs semantic view: the warehouse-native alternative

A newer pattern, championed by Snowflake's **Semantic Views** and emerging BigQuery semantic features, embeds semantic definitions directly in the database:

```sql
CREATE OR REPLACE SEMANTIC VIEW orders_semantic
AS SELECT * FROM prod.fact_orders
WITH SEMANTIC METADATA (
  measures: {
    net_revenue: SUM(revenue_usd - refund_usd - chargeback_usd),
    order_count: COUNT(order_id)
  },
  dimensions: {
    region: dim_geo.region_name,
    order_date: order_completed_at
  }
);
```

**Advantages of semantic views:** co-located with storage — no additional infrastructure; IAM and access control inherited from the database; no tool-chain fragmentation (everything lives in SQL, which data engineers already use).

**Disadvantages of semantic views:** platform-locked — a Snowflake Semantic View is a Snowflake asset and does not travel to BigQuery or a lakehouse; less modeling expressiveness (no entity relationships, no composition across views, no metric derivation); no Git-native workflow (the definition lives in the database, not in version control — though you can manage the DDL in Git, the running definition can drift from the file).

**When to use which:**

| Use semantic models (MetricFlow / Cube) when… | Use semantic views when… |
| --- | --- |
| You run more than one data platform or plan to | Everything lives in one warehouse and will for the foreseeable future |
| You need metrics that compose across models | Metrics are per-table and rarely cross schemas |
| Multiple BI tools consume the same definitions | One BI tool, one warehouse — the integrated path is simpler |
| You want Git-managed, reviewed, CI/CD-validated semantics | You prioritize operational simplicity over governance workflow |
| You are building for AI agent consumption | You are building for human SQL consumers |

In practice, larger organizations often have both: semantic models for cross-platform, governed definitions, and semantic views for quick, warehouse-scoped use cases. The OSI standard (see [Open Semantic Interchange explained](/blog/open-semantic-interchange-osi/)) aims to make both patterns interoperable — so a semantic view in Snowflake and a semantic model in MetricFlow can exchange definitions through a common format.

## 6. When you need more than ad-hoc semantic models

Signals that informal modeling is insufficient:

- **The same table generates different numbers in different tools** — because each tool reinvents which columns are measures and which filters apply.
- **New team members take weeks to understand a dataset** — because metadata lives in Slack threads and tribal knowledge, not in machine-readable models.
- **AI agents produce inconsistent results from the same table** — because they see raw column names without business context.
- **You are building Subagents or domain-scoped ChatBots** — because scoping context requires explicit model boundaries: which tables, which measures, which dimensions are in scope.

## Conclusion

A semantic model is what turns "column `attrib_windows_30d_v2` in table `mktg_analytics.fact_attrib_daily`" into "30-day attribution window revenue, grouped by channel." It is, in one sense, straightforward — describe a data source in business language. But the scaling problem is the real one: a team with 500 tables and three analytics engineers cannot manually model every dataset, so they model the 20% that serves 80% of queries and leave the rest as raw schema. Agent-assisted generation changes that calculus — not by replacing the engineer's judgment, but by producing an 80%-correct draft in seconds instead of requiring a blank-page start. What still requires human judgment, and will for the foreseeable future, is the business rule that no schema inspection can surface: the test accounts that should be excluded from revenue, the column rename that changed meaning between March and April, the join path that technically works but produces misleading aggregates at certain grains. Semantic models are a collaboration between what machines can infer and what only humans know. The teams that treat them that way — agent proposes, engineer curates — will have model coverage that grows with their data estate rather than trailing it.

## Frequently asked questions

### What is a semantic model in one sentence?

A **semantic model** is a machine-readable description of a data source that maps physical columns to business concepts — measures, dimensions, relationships, and rules — so tools can generate correct queries without re-deriving business logic.

### How is a semantic model different from a data model?

A **data model** (e.g. a dbt model, a SQL view) defines the **physical structure** of data — tables, columns, transformations. A **semantic model** adds the **business meaning** on top — which columns are measures, which are dimensions, what joins are valid, what filters apply. A data model says "this table has a column called `amount_usd`." A semantic model says "that column is `net_revenue`, aggregated as a sum, filtered to completed orders, sliced by region and date."

### How is a semantic model different from a semantic view?

A **semantic model** is tooling-layer metadata — defined in YAML (MetricFlow), JavaScript (Cube), or LookML (Looker), stored in version control, and consumed by a semantic layer engine. A **semantic view** is database-layer metadata — defined in SQL inside the database itself (Snowflake Semantic Views, BigQuery semantic features), inheriting IAM and storage co-location but with less modeling expressiveness and limited portability across platforms. See §5 for the full comparison.

### How many semantic models does a typical team need?

Start with models for the 10-20 tables that generate 80% of queries — your core fact tables (orders, subscriptions, events) and their primary dimension tables (customers, products, geographies). Expand to secondary tables as analytics demand grows. The teams that fail try to model everything upfront; the teams that succeed model what matters and add models incrementally as dashboards, agents, and analysts demand them.

### Can a data engineering agent generate semantic models automatically?

Partially — and that partial automation is the pragmatic sweet spot. A data engineering agent can inspect schema, analyze column statistics, and review historical SQL to generate an 80%-correct semantic model draft. The engineer reviews and corrects the remaining 20% — adding business rules ("always exclude test accounts"), verifying join paths, and confirming measure logic. This is materially faster than building from scratch, and it makes it practical to maintain semantic models for a much larger portion of the data estate than manual-only workflows allow.

## Related articles

- [What is a semantic layer?](/blog/what-is-semantic-layer/) — the full business dictionary composed of semantic models
- [What is a metric layer?](/blog/what-is-metric-layer/) — the KPI catalog built from semantic model measures
- [What is a data catalog?](/blog/what-is-data-catalog/) — discovery metadata vs executable semantics
