---
title: "Semantic Layer Tools in 2026: Complete List + OSI (Apache Ossie) Status"
description: "Every semantic layer tool in 2026 — dbt MetricFlow, Cube, AtScale, Snowflake, LookML and more — with each one's current OSI (Apache Ossie) support status."
author: "Evan Paul"
date: 2026-07-21
lastmod: 2026-07-21
head:
  - - meta
    - name: keywords
      content: "semantic layer tools, semantic layer tools list, OSI support, Apache Ossie, dbt Semantic Layer, Cube semantic layer, AtScale, Snowflake Semantic Views, semantic layer comparison 2026"
  - - meta
    - property: og:title
      content: "Semantic Layer Tools in 2026: Complete List + OSI (Apache Ossie) Status"
  - - meta
    - property: og:description
      content: "Every semantic layer tool in 2026 — dbt MetricFlow, Cube, AtScale, Snowflake, LookML and more — with each one's current OSI (Apache Ossie) support status."
  - - meta
    - property: og:type
      content: article
  - - meta
    - property: og:url
      content: https://datus.ai/blog/semantic-layer-tools-list-osi/
  - - meta
    - property: og:image
      content: https://datus.ai/logo_dark.svg
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - link
    - rel: canonical
      href: https://datus.ai/blog/semantic-layer-tools-list-osi/
---

# Semantic Layer Tools in 2026: Complete List + OSI (Apache Ossie) Status

A vendor-neutral directory of every [semantic layer](/blog/what-is-semantic-layer/) tool available in mid-2026 — 15 products across three architecture categories — with the most up-to-date OSI (Apache Ossie) compatibility status for each.

## TL;DR

- **15 semantic layer tools** are available in 2026, split into three architecture categories: standalone (dbt Semantic Layer, Cube, AtScale), platform-native (Snowflake Semantic Views, Databricks Metric Views, Looker LookML, Power BI), and API/BI-native (GoodData, ThoughtSpot, Sigma, Lightdash, Preset, Omni, Domo, Dremio).
- **No product ships native OSI support yet.** Open Semantic Interchange entered the Apache Incubator as **Apache Ossie** in June 2026. The only working OSI path today is through reference converters in the `apache/ossie` repository.
- **Four converters are merged**: dbt (MetricFlow), GoodData, Salesforce, and Apache Polaris. A Spark converter is in review.
- **50+ organizations** participate in the OSI working group, including Snowflake, Databricks, dbt Labs, Cube, AtScale, ThoughtSpot, and Atlan. Participation signals intent; it does not equal shipped support.
- **OSI compatibility will be a differentiating factor by late 2026.** Tools with merged converters and active working-group participation are the safest bets for teams that want portable, multi-tool semantic definitions.

## 1. The three architecture categories

Semantic layer tools in 2026 fall into three architectural buckets. The category you pick shapes portability, performance, and lock-in — and it also shapes how quickly a vendor can adopt [Open Semantic Interchange (OSI)](/blog/open-semantic-interchange-osi/). Before scanning the full grid in the next section, it helps to know which trade-off each bucket is making.

**Standalone / pure-play semantic layers** treat the semantic layer as the product. They sit between your warehouse and consumption tools — BI, notebooks, APIs, and AI agents — without bundling a full BI suite or requiring a single cloud. **dbt Semantic Layer (MetricFlow)** is code-first: metrics live as YAML versioned next to transformations, with JDBC/GraphQL and an MCP server for agents, while MetricFlow itself is open source and the Semantic Layer API still requires dbt Cloud (see the [dbt Semantic Layer / MetricFlow guide](/blog/dbt-semantic-layer-metricflow/)). **Cube** is API-first and headless, with pre-aggregation caching across 25+ connectors and a broad surface (SQL, REST, GraphQL, MCP, plus a dedicated AI API) — covered in [Cube for agentic analytics](/blog/cube-agentic-analytics/). **AtScale** is virtual OLAP with intelligent query pushdown and MDX/DAX/SQL/REST access for teams that still live in Excel, Power BI, or Tableau. These three are the clearest "buy a semantic layer" options when you want semantics to travel with the stack rather than live inside one platform.

**Platform-native semantic layers** embed definitions inside a warehouse or BI control plane. They are the lowest-friction path when your estate already lives on one platform — and the highest-friction path if you add a second. **Snowflake Semantic Views** and **Databricks Metric Views** ship with Cortex Analyst and Genie for natural-language querying, at the cost of definitions that do not leave the host. **Looker (LookML)** still offers the tightest BI-to-model loop in the Google ecosystem, with Gemini-assisted modeling and broad SQL dialect coverage historically coupled to Looker. **Microsoft Power BI semantic models** dominate Microsoft shops but remain DAX-centric and Fabric-aligned. If zero extra infrastructure is the requirement, start here; if portable, multi-tool definitions are the requirement, treat platform lock-in as an explicit trade-off rather than a surprise.

**API / BI-native semantic layers** embed modeling inside analytics products, so semantics are a feature of the BI or query platform rather than a standalone layer. **GoodData** stands out for an OSI converter already merged and an AI-native repositioning around FlexQuery — see [GoodData's shift from BI to AI-native](/blog/what-is-gooddata/). **ThoughtSpot** markets search-driven analytics with a self-described "OSI-compatible" posture. Spreadsheet-style **Sigma**, dbt-native open-source **Lightdash**, Superset-based **Preset**, hybrid-modeling **Omni**, end-to-end **Domo**, and lakehouse query engine **Dremio** (with an open-source Community Edition and active Apache Ossie advocacy) all sit in the OSI working-group conversation to varying degrees. Choose this bucket when the BI product is already the system of record for how the business sees metrics — and verify whether those definitions can ever leave that product.

## 2. The full product list: features, pricing, and OSI status

The table below is the single reference grid for this article: every tool from the categories above, plus entry pricing and OSI support status as of July 2026. Use it when you need a side-by-side scan; use the category prose above when you need to understand architectural fit. Treat every pricing figure as an entry signal to verify with the vendor, not a quote.

| Tool | Category | Open Source | Entry Pricing (July 2026) | AI Agent Access | OSI Status |
|---|---|---|---|---|---|
| **dbt Semantic Layer** | Standalone | MetricFlow: yes; SL: dbt Cloud required | $100/user/mo (Starter); 5K queried metrics included | JDBC, GraphQL, MCP | 🟢 **Converter merged** |
| **Cube** | Standalone | Yes (Core, Apache 2.0) | $40/dev/mo (Cloud Starter); self-hosted free | SQL, REST, GraphQL, MCP, AI API | 🟡 Working group member |
| **AtScale** | Standalone | No (SML language open-sourced) | $10–28/DSO/mo; floors $2,500–7,000/mo | MDX, DAX, SQL, REST, MCP | 🟡 Working group member |
| **Snowflake Semantic Views** | Platform-native | No | Usage-based (Snowflake compute) | Cortex Analyst, SQL | 🟡 Working group (leader) |
| **Databricks Metric Views** | Platform-native | No | Included in Databricks compute | Genie, SQL | 🟡 Working group member |
| **Looker (LookML)** | Platform-native | No | ~$5,000/mo starting | Looker API, Modeler | 🔴 Not in public working group |
| **Power BI semantic model** | Platform-native | No | Microsoft 365 / Fabric pricing | Power BI API | 🔴 Not participating |
| **GoodData** | API/BI-native | Partial | Enterprise custom | REST, GoodData Cloud | 🟢 **Converter merged** |
| **ThoughtSpot** | API/BI-native | No | Enterprise custom | ThoughtSpot API | 🟡 Working group; self-described "OSI-compatible" |
| **Sigma** | API/BI-native | No | Enterprise custom | Sigma API | 🟡 Working group member |
| **Lightdash** | API/BI-native | Yes (open-source) | Free (self-hosted); Cloud pricing TBD | SQL, REST | 🟡 Working group member |
| **Preset (Superset)** | API/BI-native | Yes (Apache 2.0) | Free (self-hosted); Cloud from $500/mo | SQL, REST | 🟡 Working group member |
| **Omni** | API/BI-native | No | Enterprise custom | Omni API | 🟡 Working group member |
| **Domo** | API/BI-native | No | Enterprise custom | Domo API | 🟡 Working group member |
| **Dremio** | API/BI-native | Yes (Community Edition, Apache 2.0) | Cloud consumption-based; Community free | AI semantic search, REST | 🟡 Working group; active Apache Ossie promoter |

**OSI Status legend**:
- 🟢 **Converter merged**: Reference OSI converter code merged in <a href="https://github.com/apache/ossie" rel="nofollow noopener">github.com/apache/ossie</a> — the tool has a working (if not product-grade) path to OSI.
- 🟡 **Working group member**: The vendor participates in the OSI initiative but has not shipped a converter or native support. Intent is signaled; delivery is unproven.
- 🔴 **Not participating**: The vendor is not listed in OSI public working-group rosters and has not announced plans. Semantic definitions authored in this tool may remain trapped in its ecosystem.

Reading the grid as a buyer: only **dbt Semantic Layer** and **GoodData** show a merged converter among the fifteen products listed here (Salesforce and Apache Polaris also have converters but are not semantic-layer products in this directory). Most of the market sits in the yellow band — credible intent without a shippable interchange path. Looker and Power BI are the clearest red cells for teams that care about portable definitions. Pricing columns are entry signals, not TCO; enterprise quotes for ThoughtSpot, Sigma, Omni, Domo, and GoodData still dominate mid-market and above. For AI agent access, Cube's surface is the broadest on paper; dbt and AtScale are the other standalone options with explicit MCP or multi-protocol hooks.

## 3. What "OSI support" actually means — and doesn't mean — in 2026

OSI (Open Semantic Interchange, now **Apache Ossie**) is easy to misunderstand. Here is a precise breakdown of what exists and what does not. For the standard itself, see the dedicated [OSI explainer](/blog/open-semantic-interchange-osi/) and how it differs from an execution engine in [OSI vs MetricFlow](/blog/osi-vs-metricflow/).

### Level 1: Reference converters (real, working, on GitHub)

The Apache Ossie repository at <a href="https://github.com/apache/ossie" rel="nofollow noopener">github.com/apache/ossie</a> contains working reference converters — command-line tools that translate between vendor-specific semantic formats and the OSI specification:

| Converter | Direction | Status |
|---|---|---|
| dbt (MetricFlow) → OSI | dbt YAML to OSI format | ✅ Merged |
| GoodData → OSI | GoodData semantic model to OSI format | ✅ Merged |
| Salesforce → OSI | Salesforce semantic definitions to OSI format | ✅ Merged |
| Apache Polaris → OSI | Polaris Iceberg catalog to OSI format | ✅ Merged |
| Spark → OSI | Spark SQL semantics to OSI format | 🔄 In review |

These converters are reference implementations — they demonstrate the mapping and validate the specification. They are not product-grade import/export features in any vendor's UI. Using them today means running a CLI command, not clicking a button.

### Level 2: Working group participation (intent, not delivery)

More than 50 organizations have joined the OSI working group. Cloud platforms in the room include Snowflake (initiative lead), Databricks, and Google BigQuery. Standalone semantic-layer vendors include dbt Labs, Cube, and AtScale. On the BI and analytics side, participants include Qlik, Preset (Superset), Sigma, ThoughtSpot, Omni, Domo, Lightdash, and Hex. Governance and infrastructure vendors — Alation, Atlan, Collibra, Select Star, DataHub (Acryl), Informatica, Starburst, Denodo, and Dremio — sit alongside enterprises such as BlackRock, Blue Yonder, Salesforce, Instacart, Coalesce, and Collate.

Participation is a credible signal — especially when direct competitors sit in the same room — but it is not a guarantee. The standard's long-term viability depends on whether the largest platforms ship native OSI import/export, not just attend meetings.

### Level 3: Native product support (not yet shipped by anyone)

As of July 2026, **no semantic layer product ships a user-facing OSI import or export feature.** The first wave of native support — a BI tool offering "Import OSI semantic model" as a first-class feature — is expected within 2026, based on the velocity of the working group and the dbt/GoodData converter merges. The timing depends on individual vendor roadmaps, not the specification itself.

## 4. How to think about OSI when evaluating a semantic layer today

If you are choosing a semantic layer in mid-2026, OSI compatibility should be a factor — but it should not be the deciding factor. Fit to stack, team skills, and consumption patterns still come first. OSI readiness is how you avoid painting yourself into a format that cannot travel later.

### Four questions to ask a semantic layer vendor about OSI

1. **"Do you participate in the OSI working group?"** If yes, they are at the table. If no, ask why — especially if they compete with Snowflake or dbt.
2. **"Is there a reference converter for your format in the Apache Ossie repository?"** If yes, the mapping is technically understood. If no, the work has not started.
3. **"What is your timeline for native OSI import/export?"** Most vendors will not give a hard date in mid-2026. The ones who can give you a quarter are further along than the ones who cannot.
4. **"If I build my semantic model in your tool today, will I be able to export it to OSI without re-authoring?"** The honest answer for most tools in July 2026 is "not yet." The useful answer from future-facing vendors should include a concrete path.

### The OSI readiness scorecard

Once those answers are on the table, map your primary requirement to a short list. The scorecard below is a starting shortlist, not a ranking of product quality overall.

| If your primary requirement is… | Your best bet today | OSI path |
|---|---|---|
| **Code-first, Git versioned metrics in dbt** | dbt Semantic Layer (MetricFlow) | Converter merged; strongest OSI alignment |
| **API-first, embedded analytics, multi-tool consumption** | Cube | Working group; broadest API surface |
| **Enterprise OLAP, legacy BI tools (Excel, Power BI, Tableau)** | AtScale | Working group; MDX/DAX compatibility |
| **Single platform, zero additional infrastructure** | Snowflake Semantic Views or Databricks Metric Views | Platform lock-in is the trade-off; both in working group |
| **BI-native semantics tightly integrated with your BI tool** | LookML (Looker) or Power BI semantic model | Neither in working group; highest lock-in risk |
| **Open-source, self-hosted, dbt-integrated BI** | Lightdash or Preset (Superset) | Both in working group; community-driven pace |
| **End-to-end platform (BI + data integration + semantics)** | Domo or Omni | Both in working group |

The pattern in the scorecard is consistent with the main grid: dbt is the only shortlist entry with a merged converter today; Cube and AtScale are the portable standalone bets with working-group cover; platform-native and BI-native picks trade speed of adoption for interchange risk, with Looker and Power BI carrying the highest lock-in signal on OSI participation.

## 5. Beyond the list: why OSI matters for AI agents specifically

This article is a tools list. But the reason OSI compatibility will matter by late 2026 is not only BI tool interoperability — it is AI agent reliability.

AI agents — text-to-SQL engines, chat BI interfaces, data copilots, and [data engineering agents](/blog/what-is-data-engineering-agent-2026/) — are the most demanding consumers of semantic metadata. They need machine-readable metric definitions, verified join paths, and governed business terms. Without them, agents generate confident wrong answers by guessing at business meaning from raw column names.

OSI provides the **format** for governed, portable semantic definitions that agents can consume across platforms. What it does not provide — and what no specification can provide — is the **process** for keeping those definitions current. Semantic definitions go stale. Ad-hoc queries surface metrics that never make it into the formal catalog. Feedback loops produce corrections that need to flow back into the semantic model.

That is the distinction between the semantic layer tools in this list — which define metrics, dimensions, and joins — and a data engineering agent, which generates, validates, and evolves those definitions over time. OSI is the interchange format that makes the definitions portable. Agent-driven [context evolution](/blog/contextual-data-engineering/) is the mechanism that keeps them current.

For teams building AI-native data stacks, the durable architecture is: author semantics in one of the tools above → interchange through OSI → keep them current through agent-driven feedback. The list in this article is the "author" layer. OSI is the "interchange" layer. The evolution cycle is the missing piece that most organizations under-invest in — and the one that determines whether a semantic layer becomes load-bearing infrastructure or a snapshot that goes stale between modeling sprints.

## Conclusion

Fifteen semantic layer tools are available in 2026. Four have working OSI converters in the broader Apache Ossie ecosystem. None of the products in this directory ship native OSI import/export yet. That will change — likely before the end of the year — but the advice for teams evaluating semantic layers today stays practical: pick the tool that fits your current stack and team, prioritize working-group participation and merged converters when portability matters, and do not wait for the standard to start governing metrics. The teams that "wait for the standard" will have nothing to standardize. The teams that build governed semantic models today — in MetricFlow, Cube, or the platform that already runs their warehouse — will have something valuable to export when native OSI support arrives.

## Frequently asked questions

### How many semantic layer tools are there in 2026?

At least 15, split across three categories: standalone pure-play semantic layers (dbt Semantic Layer, Cube, AtScale), platform-native layers embedded in warehouses or BI tools (Snowflake Semantic Views, Databricks Metric Views, Looker LookML, Power BI), and API/BI-native tools where semantics are a product feature (GoodData, ThoughtSpot, Sigma, Lightdash, Preset, Omni, Domo, Dremio).

### Which semantic layer tools support OSI (Apache Ossie)?

As of July 2026, no product ships native OSI support. Four products have reference converters merged in the [Apache Ossie](/blog/open-semantic-interchange-osi/) repository: dbt (MetricFlow), GoodData, Salesforce, and Apache Polaris. Over 50 organizations participate in the OSI working group, signaling intent but not shipped features. The first native OSI import/export in a BI tool is expected by the end of 2026.

### What is the difference between a reference converter and native OSI support?

A reference converter (merged in github.com/apache/ossie) is a CLI tool that demonstrates the mapping between a vendor's format and the OSI specification. It proves the mapping is technically understood. Native OSI support means a vendor ships a user-facing feature — e.g., "Export as OSI" in a UI or "Import OSI model" from an API. No vendor ships native OSI support as of July 2026.

### Which semantic layer tool is best for AI agents?

Cube offers the broadest API surface for AI agent consumption (SQL, REST, GraphQL, MCP, and a dedicated AI API endpoint). dbt Semantic Layer serves JDBC and GraphQL APIs with an MCP server for AI agents. AtScale provides MCP access with GenAI-ready context. For AI agents that need to query governed metrics across platforms, Cube's API breadth is the strongest match today; for teams already on dbt, MetricFlow's JDBC/GraphQL plus OSI alignment is the natural choice.

### Is an open-source semantic layer better for avoiding vendor lock-in?

Yes, with nuance. An open-source core (Cube Core, Lightdash, Preset, Dremio Community Edition) means you control deployment and are not forced into a specific cloud or pricing meter. However, open-source tools that do not participate in OSI still produce definitions in their proprietary format — which is lock-in of a different kind. The strongest anti-lock-in position is: open-source core + OSI working-group participation (Cube, Lightdash, Preset) or open format + OSI converter merged (dbt MetricFlow, which is open-source at the MetricFlow layer but requires dbt Cloud for the Semantic Layer API).

## Related articles

- [What Is a Semantic Layer?](/blog/what-is-semantic-layer/) — the definition, and why static models break under AI agents.
- [Open Semantic Interchange (OSI)](/blog/open-semantic-interchange-osi/) — the standard behind the OSI status column, and who is behind it.
- [OSI vs MetricFlow](/blog/osi-vs-metricflow/) — the interchange standard vs the execution engine, and why you need both.
- [dbt Semantic Layer / MetricFlow](/blog/dbt-semantic-layer-metricflow/) — the only tool in this list with a merged converter, in depth.
- [What Is a Data Engineering Agent?](/blog/what-is-data-engineering-agent-2026/) — the layer that keeps portable semantics from going stale.
