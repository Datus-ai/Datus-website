---
title: "Open Semantic Interchange (OSI): What the New Standard Means for Data Engineering and AI Agents"
description: "A complete guide to the Open Semantic Interchange (OSI) specification — what it standardizes, who's behind it, and why portable semantics matter for AI agents."
author: "Evan Paul"
date: 2026-06-09
lastmod: 2026-06-10
head:
  - - meta
    - name: keywords
      content: "Open Semantic Interchange, OSI semantic layer, OSI specification, semantic layer standard, portable semantics, Snowflake OSI, semantic interoperability"
  - - meta
    - property: og:title
      content: "Open Semantic Interchange (OSI): What the New Standard Means for Data Engineering and AI Agents"
  - - meta
    - property: og:description
      content: "A complete guide to the Open Semantic Interchange (OSI) specification — what it standardizes, who's behind it, and why portable semantics matter for AI agents."
  - - meta
    - property: og:type
      content: article
  - - meta
    - property: og:url
      content: https://datus.ai/blog/posts/open-semantic-interchange-osi
  - - meta
    - property: og:image
      content: https://datus.ai/logo_dark.svg
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - link
    - rel: canonical
      href: https://datus.ai/blog/posts/open-semantic-interchange-osi
---

# Open Semantic Interchange (OSI): What the New Standard Means for Data Engineering and AI Agents

Until January 2026, if your team defined `net_revenue` in MetricFlow inside a dbt project, that definition was trapped in the dbt ecosystem. Your Looker dashboard had a separate copy — same metric name, independently maintained logic. Your Python analytics stack had a third. Your AI agent, deprived of any of these, queried raw schema and guessed at the business logic. Three copies of the same metric, three maintenance surfaces, three opportunities to drift — and each new consumption tool added another. The **Open Semantic Interchange (OSI)** specification — finalized in January 2026 under Apache 2.0 with over 30 participating organizations — is the industry's answer to this fragmentation. It does not replace MetricFlow, Cube, or LookML. It provides an interchange format so a metric authored in any of them can be consumed by all of them. This article explains what OSI standardizes, who is behind it, and why portable semantics change the architecture conversation for [data engineering agents](/blog/what-is-data-engineering-agent/) — not by solving every problem, but by making the problems that remain more visible.

## TL;DR

- **OSI** (Open Semantic Interchange) is an Apache 2.0–licensed specification that defines a standard format for semantic metadata — metrics, dimensions, datasets, relationships, and business context — so definitions authored in one tool can be consumed in another without re-authoring.
- It is led by **Snowflake**, with **dbt Labs, Databricks, Google BigQuery, Cube, AtScale, Qlik, Atlan, Collibra, DataHub, and 20+ others** in the working group.
- OSI does **not** replace existing semantic layers (Cube, MetricFlow, LookML). It provides an **interchange format** — a common language they can all speak. Think USB-C for semantics, not a new semantic layer product.
- For data engineering, OSI means **metric definitions become portable infrastructure**, not tool-specific configuration. For AI agents, it means governed, machine-readable business context available across platforms.
- The limit of OSI — and where agent-driven approaches add value — is that OSI standardizes the **exchange format**, not the **evolution cycle**. Semantics still need to be authored, validated, and kept current. Data engineering agents that generate, validate, and refine semantic definitions are the natural complement: OSI provides the rails; agents provide the fuel.

## 1. What problem OSI solves

Every major data platform has built its own semantic layer: dbt has MetricFlow, Cube has cube data models, Looker has LookML, Snowflake has Semantic Views, Power BI has data models. Each defines metrics, dimensions, and relationships in its own format — and definitions authored in one cannot be consumed in another without manual translation.

The result is what the industry calls **semantic fragmentation**: the same `net_revenue` metric exists in five tools with five definitions, and keeping them synchronized is a manual process that breaks under scale. Organizations that run Snowflake + Looker + a Python analytics stack + embedded Cube analytics — a common enterprise pattern — are maintaining four copies of the same metric logic with four different syntaxes.

OSI solves this by defining a **single, vendor-neutral interchange format**. A metric defined in OSI format can be consumed by any tool that implements the OSI specification — regardless of whether the metric was originally authored in MetricFlow YAML, Cube JavaScript, or a Snowflake Semantic View. The ambition is not to replace those authoring tools but to make their output interoperable.

## 2. What OSI standardizes

The OSI specification (available at <a href="https://github.com/open-semantic-interchange/OSI" rel="nofollow noopener">github.com/open-semantic-interchange/OSI</a>) defines a common representation for:

| Semantic artifact | What it encodes | Example |
| --- | --- | --- |
| **Metrics** | Business KPIs — calculation logic, aggregation type, time grain, dimensions | `net_revenue`: `SUM(revenue) - SUM(refunds)`, daily grain, filter `order_status = 'completed'` |
| **Dimensions** | Attributes you group or filter by — hierarchies, types, valid values | `region`: categorical, hierarchy `region → country → city` |
| **Datasets** | Physical data assets — tables, views, schemas, with column-level metadata | `orders` table: columns, types, primary keys, foreign keys |
| **Relationships** | How datasets connect — join keys, cardinality, grain implications | `orders.customer_id → customers.id`, many-to-one, inner join preferred |
| **Business context** | Human-readable descriptions, owners, certification status, deprecation notes | `net_revenue`: "Excludes test accounts and internal orders. Certified by Finance team. Supersedes legacy `revenue_net_v1`." |

Critically, OSI separates **definition** from **implementation**. A metric defined in OSI says *what* the metric is and *how* it relates to other entities; it does not say *where* to execute the query or *which SQL dialect* to use. That separation is what makes OSI portable: the same metric definition can generate Snowflake SQL, BigQuery SQL, or a Cube API query, depending on which engine consumes it.

## 3. Who is behind OSI

The working group is unusually broad for a standards initiative in the data space. As of early 2026:

| Category | Participants |
| --- | --- |
| **Cloud platforms** | Snowflake (lead), Databricks, Google BigQuery |
| **BI & analytics** | Qlik, Preset (Apache Superset), Sigma, ThoughtSpot, Omni, Domo, Lightdash, Hex |
| **Semantic layer** | dbt Labs (MetricFlow), AtScale, Cube, Denodo |
| **Data governance** | Alation, Atlan, Collibra, Select Star, DataHub (Acryl), Informatica |
| **AI / ML** | Mistral AI, RelationalAI, Elementum AI |
| **Enterprise** | BlackRock, Blue Yonder, JetBrains, Salesforce, Instacart, Starburst, Coalesce, Collate, Credible |

This breadth matters because it signals that OSI is not a Snowflake competitive play — it is an industry acknowledgment that semantic fragmentation is a shared problem. When Databricks and dbt Labs sit alongside Snowflake in the same working group, the intent is interoperability, not platform lock-in.

dbt Labs' role is particularly significant: MetricFlow is the most widely adopted open-source metric layer, and dbt's participation means OSI has a path to being natively supported by the tool that defines metrics for tens of thousands of data teams. The open-sourcing of MetricFlow in late 2025 — separate from OSI but aligned in timing — created the conditions for an open, composable semantic stack: author in MetricFlow, interchange through OSI, consume anywhere.

## 4. What OSI means for data engineering

For data engineering teams, OSI changes the build-vs-buy calculus around semantic infrastructure in three ways:

**1. Semantic layers become infrastructure, not tool features.** When metric definitions are portable, the semantic layer is no longer a feature of your BI tool — it is shared infrastructure that any tool can consume. This means data engineering teams can invest in building one governed semantic layer without betting on a single consumption surface. Author in MetricFlow today, consume through a Cube API tomorrow, expose to a new AI agent next quarter — without re-authoring.

**2. The integration tax drops.** Every new data tool today requires manual semantic integration: wire it to the warehouse, re-define the metrics, re-document the joins. OSI replaces N-point manual integration with one standard format. New tools that implement OSI can consume existing semantic definitions on day one. This shifts the evaluation criteria for new tools from "how hard is it to integrate?" to "does it support OSI?"

**3. Governance becomes enforceable across the stack.** Today, governance is tool-by-tool: you can enforce that certified metrics are used in Looker, but you cannot enforce that the Python notebook uses the same definitions. OSI makes it possible to enforce "use the certified metric definition" as a platform-level rule — because every tool reads from the same semantic source of truth.

The caveat: OSI provides the format; it does not provide the **process** for keeping semantics current. That remains a data engineering responsibility — and it is the part that most organizations under-invest in. A static OSI-compliant metric that was authored six months ago and never updated is still stale, even if it is portable.

## 5. What OSI means for AI agents

AI agents — text-to-SQL engines, chat BI interfaces, data copilots — are the most demanding consumers of semantic metadata. They need:

- **Machine-readable metric definitions** — not documentation pages, but structured definitions they can parse at query time.
- **Accurate join paths** — to avoid generating silently wrong queries when joining across tables.
- **Business context** — to know that `amount_usd` means "net revenue after refunds," not "gross transaction amount."
- **Up-to-date definitions** — because stale semantics produce confident wrong answers.

OSI directly addresses the first three. A data engineering agent that implements OSI can read governed metric definitions, understand join relationships, and apply business filters — all from the same OSI-compliant semantic source that feeds dashboards and APIs. This closes the gap between "metrics the BI team trusts" and "metrics the AI agent queries."

The fourth — keeping definitions up to date — is where OSI stops and agent-driven approaches begin. OSI standardizes the **format** for semantic metadata. It does not standardize how that metadata gets **created, validated, and evolved**. That process — bootstrapping metrics from historical SQL, refining them through feedback, promoting validated ad-hoc queries into the formal metric catalog — is what data engineering agents are built to do.

A concrete workflow: a Datus agent generates a query that surfaces a new metric candidate ("cohort retention by plan tier, 90-day window"). The analyst validates and upvotes. The agent stores the validated SQL as reference context. After sufficient validation — consistent upvotes, no issues reported, multiple analysts using the pattern — the metric is promoted to a formal OSI-compliant definition. Downstream, any OSI-compatible tool can now consume "cohort_retention_90d_by_plan" alongside the certified metric catalog.

## 6. OSI and the semantic layer ecosystem: who wins, who adapts

OSI does not disrupt existing semantic layer products — it makes them more valuable by expanding their addressable consumption surface. But it does shift competitive dynamics:

- **dbt / MetricFlow** — Strengthened. MetricFlow is the leading open-source authoring tool for metrics, and OSI makes MetricFlow-authored definitions portable to non-dbt environments. Expect native MetricFlow → OSI export.
- **Cube** — Adapting well. Cube joined OSI and has been building toward open standards; OSI aligns with their headless, API-first philosophy. Cube-authored metrics become portable beyond the Cube API surface.
- **Looker / LookML** — The most exposed. LookML is deeply integrated with Looker's exploration engine, and OSI introduces a path for LookML-authored definitions to be consumed outside Looker — which is either a feature (for customers who want portability) or a threat (for Google Cloud's lock-in strategy), depending on your perspective.
- **Warehouse-native semantics** (Snowflake Semantic Views, BigQuery semantic features) — OSI is the bridge that makes warehouse-native semantics portable to other warehouses. Without OSI, a Snowflake Semantic View is a Snowflake asset. With OSI, it is a portable semantic definition that BigQuery or a Cube API can consume.
- **Data catalogs** (Alation, Atlan, DataHub) — OSI gives catalogs a standard format to ingest and display semantic metadata alongside technical metadata. A catalog that supports OSI can show not just that a table exists, but what business metrics it supports and how they are defined — closing the gap between "where is the data?" and "what does it mean?"

For the Datus perspective: OSI is an infrastructure standard that makes the semantic layer portable. Datus is a system that makes it **evolvable**. The two are complementary: OSI provides the interchange rails; Datus (and other agent-driven approaches) provide the continuous creation, validation, and refinement loop that keeps semantics current. The teams that will win are the ones that treat OSI as the **distribution layer** and agent-driven context evolution as the **creation layer**.

## 7. How to think about adopting OSI

OSI is v1. It is real, it is open-source, and it has significant industry backing. But it is also new — the ecosystem of tools with native OSI support is growing but not yet mature. A practical stance:

**Do adopt OSI thinking now.** Even if you cannot implement OSI format today, the architectural pattern — one governed semantic source, consumed by many tools — is the right target. Start building your semantic layer with the assumption that definitions should be portable. Choose tools that commit to open standards (MetricFlow over closed proprietary formats, APIs over UI-only metric builders).

**Watch the tooling.** The critical signal is when the first BI tool ships native OSI import — "connect to your OSI semantic source and all your metrics appear." At that point, OSI moves from specification to infrastructure. Based on the working group participants, the first wave of native support is likely within 2026.

**Don't wait for OSI to start governing metrics.** The biggest semantic problem today is not format fragmentation — it is that most organizations have no governed metric definitions at all. Start with MetricFlow or Cube. Define your 20 most important KPIs. Enforce them in your primary BI tool. When OSI-native tooling matures, you will have something to export. The teams that "wait for the standard" will have nothing to standardize.

## Conclusion

OSI is the most significant standards effort in the semantic layer space — and if adoption follows the breadth of the working group, it could do for business semantics what Apache Iceberg did for table formats: turn a fragmented, vendor-specific landscape into an open, interoperable one. That outcome is not guaranteed. Standards efforts in data infrastructure have succeeded when they solved a problem that everyone agreed was expensive (Iceberg: table format lock-in) and failed when they tried to solve a problem that the largest vendors benefited from keeping unsolved. Semantic fragmentation is expensive for users but strategically useful for platforms — a Snowflake customer locked into Snowflake Semantic Views is a retained customer. OSI's inclusion of Databricks, Google, dbt Labs, and Snowflake in the same working group is the strongest signal that the industry recognizes this as a shared problem rather than a competitive weapon, but the standard's long-term viability depends on whether the largest platforms ship native OSI import/export — not just participate in the working group. If they do, OSI becomes infrastructure. If they do not, it becomes a specification with impressive endorsements and limited adoption. Either way, the architectural direction is correct: metric definitions are infrastructure, and infrastructure should be portable. Build your semantic layer with that assumption, and you will be ready whether OSI succeeds, a successor standard emerges, or the industry finds another path to the same outcome.

## Frequently asked questions

### What does OSI stand for?

**Open Semantic Interchange.** It is an open-source specification (Apache 2.0) for representing and exchanging semantic metadata — metrics, dimensions, datasets, and relationships — across tools and platforms.

### Who created OSI?

OSI is led by **Snowflake** with a working group that includes dbt Labs, Databricks, Google BigQuery, Cube, AtScale, Qlik, Atlan, Collibra, DataHub, and over 20 other organizations. The specification is developed in the open at <a href="https://github.com/open-semantic-interchange/OSI" rel="nofollow noopener">github.com/open-semantic-interchange/OSI</a>.

### Is OSI a semantic layer product?

No. OSI is a **specification** — a standard format for describing semantics — not a product that stores, serves, or queries semantic definitions. Think of it as the PDF for semantic metadata: you can author a document in Word, Google Docs, or Notion, but export it as a PDF that anyone can read. OSI is the PDF; MetricFlow, Cube, and LookML are the Word, Google Docs, and Notion.

### Does OSI replace MetricFlow or Cube?

No. OSI is an **interchange format**, not an authoring tool. You still need a semantic layer to author and govern metric definitions — MetricFlow, Cube, or LookML. OSI makes the output of those tools portable so definitions authored in one can be consumed by another. It is a complement to existing semantic layers, not a replacement.

### What does OSI mean for text-to-SQL accuracy?

Potentially a lot. The #1 failure mode of text-to-SQL is semantic ambiguity — the model generates correct SQL for the wrong business definition. If OSI makes governed metric definitions machine-readable and widely available, text-to-SQL engines can ground queries in certified business logic rather than raw schema. The accuracy gain comes not from better models but from richer, more consistent context — and OSI is a step toward making that context universally available.

### When should our team pay attention to OSI?

Now, for architectural direction. Start building semantic infrastructure with the assumption that definitions should be portable. Watch for native OSI support in your BI and data tools — the first wave is likely within 2026. But do not wait for OSI to start governing metrics: define your KPIs in MetricFlow or Cube today, and you will have something valuable to export when the ecosystem matures.

## Related articles

- [What is a semantic layer?](/blog/what-is-semantic-layer/) — the business dictionary OSI makes portable
- [What is a metric layer?](/blog/what-is-metric-layer/) — the KPI catalog OSI standardizes
- [What is a data engineering agent?](/blog/what-is-data-engineering-agent/) — how agents operationalize semantics
