---
title: "OSI vs Warehouse-Native Semantics: Snowflake and Databricks Compared"
description: "Snowflake Semantic Views vs Databricks Metric Views vs OSI (Apache Ossie): portability, lock-in, AI grounding, and when warehouse-native semantics win."
author: "Evan Paul"
date: 2026-08-07
lastmod: 2026-08-07
head:
  - - meta
    - name: keywords
      content: "OSI vs warehouse-native semantics, Snowflake Semantic Views, Databricks Metric Views, Apache Ossie, Cortex Analyst, Genie, semantic layer portability, AI agents"
  - - meta
    - property: og:title
      content: "OSI vs Warehouse-Native Semantics: Snowflake and Databricks Compared"
  - - meta
    - property: og:description
      content: "Snowflake Semantic Views vs Databricks Metric Views vs OSI (Apache Ossie): portability, lock-in, AI grounding, and when warehouse-native semantics win."
  - - meta
    - property: og:type
      content: article
  - - meta
    - property: og:url
      content: https://datus.ai/blog/osi-vs-warehouse-native-semantics/
  - - meta
    - property: og:image
      content: https://datus.ai/logo_dark.svg
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - link
    - rel: canonical
      href: https://datus.ai/blog/osi-vs-warehouse-native-semantics/
---

# OSI vs Warehouse-Native Semantics: Snowflake and Databricks Compared

Warehouse-native semantics — Snowflake Semantic Views and Databricks Metric Views — keep governed metrics inside one platform; OSI (Apache Ossie) is the interchange format that lets them leave. This article compares both across portability, lock-in, and AI grounding, and shows when each approach wins.

## TL;DR

- **Warehouse-native semantics** (Snowflake Semantic Views, Databricks Metric Views) author, govern, and serve metrics inside one platform's control plane; **OSI / Apache Ossie** is the vendor-neutral interchange format that lets those definitions travel.
- Snowflake ships a documented **Ossie YAML bridge** — `SYSTEM$CREATE_SEMANTIC_VIEW_FROM_OSSIE_YAML` and `SYSTEM$READ_OSSIE_YAML_FROM_SEMANTIC_VIEW` — while Databricks is a **working-group member** with no shipped converter as of August 2026.
- Round-trips preserve the core model (metrics, dimensions, equi-joins, `ai_context`); **non-equi relationships are silently dropped**, and Snowflake-only features move into `SNOWFLAKE` custom extensions that other tools may ignore.
- The real trade-off is **portability vs operational depth**: native wins when you live inside one platform; OSI wins the moment a second warehouse or BI/agent runtime must share the same definitions.
- For AI agents, the distinction decides **what grounds NL-to-SQL**: Cortex Analyst reads Semantic Views, Genie reads Metric Views, and portable definitions reduce the "same KPI, five definitions" failure that drives confident wrong answers.

## 1. Warehouse-native semantics: a working definition

When Snowflake and Databricks both announced first-party semantic objects, they were responding to the same pressure from two directions: text-to-SQL needed governed business definitions, and platform vendors wanted those definitions to live where the data already lives. A warehouse-native semantic layer is exactly what the name suggests — semantic definitions stored, governed, and executed inside the platform's own catalog, rather than in a separate semantic-layer product. Snowflake calls its object **Semantic Views**; Databricks calls the equivalent **Metric Views**; both are consumed by the platform's own natural-language assistant.

A useful working definition:

> **Warehouse-native semantics** are business-meaningful definitions — metrics, dimensions, datasets, and the relationships between them — authored and governed as first-class objects inside a data platform's own catalog, where they inherit the platform's RBAC, sharing, and lineage. In Snowflake, the object is a **Semantic View** (defined in native YAML or DDL and consumable by Cortex Analyst); in Databricks, the equivalent is a **Metric View**, consumable by Genie. What makes them "warehouse-native" is that there is no separate authoring product and no separate runtime: the definition sits next to the tables it describes, and the query engine resolves it directly. What they are **not** is a portable interchange format. A Semantic View is a Snowflake asset; a Metric View is a Databricks asset. If a second warehouse, a BI tool, or an AI agent outside the platform needs the same definition, you either re-author it there or move it through an interchange layer such as OSI / Apache Ossie.

That final clause is the whole trade in miniature. Teams that already run everything on one platform get real value from native semantics: definitions version in the catalog, permissions inherit from the warehouse, and the NL assistant reads them directly with no separate semantic-layer infrastructure to operate. The cost shows up when the estate grows a second platform or a second consumer surface, because the definitions that were friction-free inside the first platform become the very thing you are trying to move. For the anatomy of the modeling object itself, [what is a semantic model](/blog/what-is-semantic-model) is the deeper read; [what is a semantic layer](/blog/what-is-semantic-layer) covers the broader category these objects belong to.

## 2. OSI / Apache Ossie: a quick recap

OSI (Open Semantic Interchange) is the vendor-neutral, Apache-2.0 specification — expressed in YAML/JSON — that defines metrics, dimensions, datasets, and relationships, and it is now incubating at the Apache Software Foundation under the name **Apache Ossie**, per the <a href="https://www.snowflake.com/en/blog/apache-ossie-open-semantic-interchange-incubator/" rel="nofollow noopener">incubator announcement</a>. It does not replace authoring tools; it gives them a common format so definitions authored in one tool can be consumed elsewhere without re-authoring. The [full OSI explainer](/blog/open-semantic-interchange-osi) covers the standard, its working group, and its adoption status; this article only needs the part that differentiates it from warehouse-native objects.

That differentiation is structural rather than cosmetic. A warehouse-native object is an *implementation*: it lives in a catalog, resolves against a specific query engine, and inherits a specific platform's permissions model. Ossie is an *interchange format*: it describes the definition in a way any conforming tool can read, and it deliberately stays silent about where or how the definition executes. That separation of definition from implementation is precisely what lets a Semantic View round-trip through Ossie YAML and land, in principle, in a different tool. The practical consequences of this design — what survives a round-trip, what is dropped, and what vendors actually ship — are the subject of the rest of this article.

## 3. The key differences: side-by-side

Both approaches answer the same business question — "where should governed metric definitions live?" — with opposite answers, and the differences are best seen in one grid. The table below compares them across the six dimensions that decide real-world outcomes, from how you author a definition to how it grounds an AI assistant.

| Dimension | Warehouse-native (Snowflake Semantic Views / Databricks Metric Views) | OSI / Apache Ossie |
|---|---|---|
| **Authoring object** | Schema-level objects in the platform catalog — native YAML/DDL in Snowflake, Metric Views in Databricks | Spec artifacts: YAML/JSON documents for metrics, dimensions, datasets, relationships |
| **Consumer surface** | The platform's own stack: Cortex Analyst (Snowflake), Genie (Databricks), SQL on the same engine | Any conforming tool: converters, BI tools, catalogs, and agent runtimes that read Ossie |
| **AI grounding path** | NL-to-SQL grounded directly in the in-platform object | Machine-readable definitions any agent or tool can consume across platforms |
| **Lock-in profile** | Strongest inside one platform; weakest as a second platform joins | Designed to reduce lock-in; value grows with the number of tools that support it |
| **Governance** | Inherits platform RBAC, sharing, lineage, and audit | Format-level; governance depends on whoever hosts and validates the documents |
| **Fidelity / round-trip limits** | Bit-perfect inside the platform | Core model survives; non-equi joins dropped, vendor extensions may be ignored |

Read the lock-in row as the summary of everything else. If your team, warehouse, BI, and agents all run on Snowflake, the Semantic View path is coherent and well-documented — author once, govern with warehouse RBAC, ground Cortex Analyst — and adding Ossie would be process cost without payoff. The minute a second platform appears, whether a Databricks workspace for ML workloads, a BigQuery zone for another subsidiary, or an external BI tool, the row that was a strength becomes the problem you are routing around. That is also why the working-group status of the two vendors deserves precise reading: Snowflake is a founding and leading contributor with a shipped bridge, while Databricks participates in the working group without a shipped converter as of August 2026. The gap between participation and delivery is the single most common source of procurement confusion in this space.

## 4. The Snowflake Ossie bridge: a concrete round-trip walkthrough

The most concrete artifact in this comparison is the one Snowflake actually ships: a documented import/export path between Semantic Views and Ossie YAML. Two entry points matter. <a href="https://docs.snowflake.com/en/sql-reference/stored-procedures/system_create_semantic_view_from_ossie_yaml" rel="nofollow noopener">`SYSTEM$CREATE_SEMANTIC_VIEW_FROM_OSSIE_YAML`</a> takes an Ossie document and creates or replaces a Semantic View; <a href="https://docs.snowflake.com/en/sql-reference/functions/system_read_ossie_yaml_from_semantic_view" rel="nofollow noopener">`SYSTEM$READ_OSSIE_YAML_FROM_SEMANTIC_VIEW`</a> serializes an existing view back to Ossie, with the older `…_OSI_YAML…` names documented as deprecated aliases for the same jobs. As of August 2026 the bridge supports Ossie core **0.1.1**, and expression dialects resolve in the order `SNOWFLAKE`, then `ANSI_SQL`.

The read path is where fidelity limits become visible, and they are the part most announcements skip. Snowflake's docs map `tables` to `datasets`, fields to dimensions and measures, model-level metrics to Ossie metrics, and export **equi-join relationships only**; non-equi joins such as ASOF and RANGE are silently dropped because the Ossie core spec defines equi-join semantics. Snowflake-specific behavior — the `custom_instructions` and synonyms Cortex Analyst relies on, table-level filters — lands in `SNOWFLAKE` custom extensions. A round-trip therefore preserves the core model and is not a bit-perfect clone of the view. For a fuller treatment of the write path, read path, and deprecated aliases, [what is Snowflake OSI](/blog/what-is-snowflake-osi) has the detail; this section focuses on what the round-trip means for a portability decision.

A concrete example makes the boundary tangible. Finance owns Semantic View `analytics.public.revenue_model`, tuned daily through Cortex Analyst with custom instructions ("exclude test accounts; answer in USD") and an equi-join from `orders` to `customers`. An analytics engineer exports it:

```sql
SELECT SYSTEM$READ_OSSIE_YAML_FROM_SEMANTIC_VIEW('analytics.public.revenue_model');
```

They commit the YAML to a shared repository as the portable source of truth, and a second team imports it into a sandbox schema:

```sql
CALL SYSTEM$CREATE_SEMANTIC_VIEW_FROM_OSSIE_YAML('analytics.sandbox', $$ ... Ossie YAML ... $$);
```

`total_revenue`, the grain, and the equi-join survive. The Cortex-oriented instructions sit in the `SNOWFLAKE` extension and do not transfer, so a consumer that reads Ossie core fields but ignores vendor extensions answers "revenue by region" with the metric expression intact and the instruction layer missing. The export succeeded; the AI behavior diverged. That gap — interchange of definitions versus interchange of agent policy — is the boundary teams discover six months after declaring themselves "Ossie-native."

On the Databricks side, the comparison is about absence rather than difference. Databricks is a working-group member, and its Metric Views are the closest warehouse-native analog to Semantic Views, consumed by Genie for natural-language querying. As of August 2026, however, there is no shipped Metric View ↔ Ossie converter; the only Databricks-adjacent path through the spec is the ecosystem's reference converters in the <a href="https://github.com/apache/ossie" rel="nofollow noopener">Apache Ossie repository</a>. The [semantic layer tools list](/blog/semantic-layer-tools-list-osi) tracks this status per tool, and the honest summary is that participation signals intent, not delivery.

## 5. When warehouse-native wins — and when OSI wins

Choose the warehouse-native path when your analytics estate is single-platform by design. That covers most Snowflake-first and Databricks-first teams: warehouse RBAC is the governance model, the NL assistant runs on the same engine as the data, and you do not need the same definitions to drive a second warehouse or a non-platform BI runtime this quarter. In that world, native semantics are the lowest-friction option that exists — no separate authoring tool, no format translation, no second system to secure. Adding an interchange format preemptively costs process without adding portability you are not using.

Choose OSI when the estate is genuinely multi-tool, and the trigger is usually one of three things: a second cloud warehouse that must share KPI definitions, an embedded analytics API that cannot see inside your warehouse, or procurement explicitly asking whether semantic lock-in is reversible. In those cases the warehouse-native object becomes the thing you are trying to export, and the Ossie bridge is the practical answer — with the caveat that you verify converters on *every* tool in the path, not just the warehouse side. That verification habit is also where the sibling comparisons in this series come in: if your second tool is dbt and MetricFlow, the [MetricFlow vs OSI comparison](/blog/osi-vs-dbt-metricflow) is the relevant read; if it is Looker, the [LookML vs OSI comparison](/blog/osi-vs-lookml) applies.

A useful rule of thumb: a single platform with a single consumer surface points to native; multiple platforms or consumer surfaces — or a procurement question about reversibility — points to OSI. The two are not mutually exclusive in a live stack, and many teams will author natively and use the Ossie bridge as a release valve. The distinction matters because it tells you which cost you are optimizing: native optimizes depth of integration, while Ossie optimizes the cost of leaving.

## 6. Why this matters for AI agents

For AI agents — text-to-SQL engines, chat BI, data copilots — the choice between native and interchange semantics decides what grounds the answer. Cortex Analyst grounds NL-to-SQL directly in Semantic Views; <a href="https://docs.databricks.com/aws/en/genie/index.html" rel="nofollow noopener">Genie</a> grounds it in Metric Views; both are an explicit acknowledgment that schema-only text-to-SQL misses business process definitions, metric grain, and synonym handling. The industry's own benchmark numbers explain the pressure: on the Spider 2.0 production dataset, GPT-4o scored 10.1% and o1-preview 17.1%, against roughly 86% and above on the academic variant — and the gap sits exactly where production schemas, business context, and governed semantics matter. [Text-to-SQL](/blog/what-is-text-to-sql) covers the grounding pipeline in depth.

The OSI route adds a benefit that native grounding alone cannot provide: the same definitions can ground *multiple* agents in *different* platforms. If your governed `net_revenue` lives in one Semantic View, Cortex Analyst inside Snowflake is grounded; a second agent on Databricks, or an embedded analytics agent on top of the warehouse, still needs its own copy or a portable document. Interchange makes that handoff cheap, which is why [data engineering agents](/blog/what-is-data-engineering-agent) that keep context current treat Ossie as the distribution rails and the evolution loop as their own job.

That last clause carries the real boundary between the two approaches. Portable semantics reduce the "same KPI, five definitions" failure, but they do not keep definitions accurate after schema drift, after finance redefines "active customer," or after verified queries go stale. Interchange standardizes exchange; it does not standardize evolution. A contextual approach — open-source data engineering agents such as Datus that generate semantic models from schema, capture validated SQL, and feed corrections back into the context — complements both paths: native objects give agents governed definitions inside the platform, Ossie gives those definitions rails to other platforms, and an evolution loop keeps either one from going stale. The distinction between the three is the difference between a portable file, a grounded assistant, and a maintained source of truth. For the accuracy evidence behind agent-driven context, see the [context engine and agent accuracy](/blog/context-engine-data-engineering-agent-accuracy) breakdown.

## 7. Common misconceptions

Several recurring misconceptions follow from conflating three different layers: the native object, the interchange format, and working-group participation. Each one below has cost real teams have paid, so it is worth separating them.

**"OSI support means my tool can import and export Ossie."** Participation is not delivery. More than 50 organizations sit in the working group; four reference converters are merged (dbt/MetricFlow, GoodData, Salesforce, Apache Polaris); and no product ships native OSI support as of August 2026. Snowflake's SYSTEM$ bridge is the nearest thing to native, and even it is a documented API path rather than a user-facing feature. The distinction matters because "Databricks is in the working group" and "Databricks can consume Ossie" are different claims — and only the first is currently true.

**"An Ossie round-trip is a full backup of my semantic view."** It is a core-model subset. Metrics, dimensions, equi-joins, and `ai_context` are designed to survive; non-equi relationships are silently dropped; and Snowflake-specific AI instructions and filters relocate to `SNOWFLAKE` custom extensions that external consumers may ignore. Treat export as portable core definitions rather than a bit-perfect clone, especially when agent behavior depends on the extension layer that does not transfer.

**"Warehouse-native semantics mean I can never leave."** Not exactly. The definitions are platform assets, but the Ossie bridge exists precisely to make departure cheaper, subject to the fidelity limits above. What native semantics actually mean is that *leaving requires an interchange step*, and the cost of that step scales with how much of your semantics is extension-specific rather than core. Teams that keep AI context in core Ossie fields migrate more cheaply than teams that tune everything into `SNOWFLAKE` extensions.

**"OSI is another semantic layer product."** It is not; it is the interchange format, and the [OSI explainer](/blog/open-semantic-interchange-osi) makes that boundary explicit. If you have no governed definitions yet, start by authoring them — natively or in a semantic-layer tool — and treat Ossie as the portability layer you export into, not as a replacement for the authoring step.

## Conclusion

Warehouse-native semantics and OSI / Apache Ossie answer different questions. Native objects — Semantic Views and Metric Views — optimize for depth inside one platform: governed definitions in the catalog, warehouse RBAC, and NL assistants that read them directly. Ossie optimizes for mobility: a vendor-neutral format that lets definitions leave, with Snowflake's shipped bridge making the trade visible — core model round-trips cleanly, extension-specific behavior does not — and Databricks' working-group seat keeping the option open without shipping a converter yet. The practical frame for teams is simple: single platform points to native; a second platform or a portability requirement points to planning the interchange path and verifying every tool on it, not just the warehouse side. And because AI agents inherit whatever grounding you give them, treat the definition layer and the evolution loop as two separate investments — interchange rails move semantics, but only maintained, validated context keeps them true. Explore the [data engineering glossary](/glossary/) for related definitions.

Next reading: the [OSI / Apache Ossie overview](/blog/open-semantic-interchange-osi), [what is Snowflake OSI](/blog/what-is-snowflake-osi), and the [semantic layer tools list with OSI status](/blog/semantic-layer-tools-list-osi). For the agent view, see [what is a data engineering agent](/blog/what-is-data-engineering-agent).

## Frequently asked questions

### What is the difference between OSI and a warehouse-native semantic layer?

Warehouse-native semantics — Snowflake Semantic Views and Databricks Metric Views — are modeling objects that author and govern metrics inside a single platform's catalog, inheriting its RBAC and serving its own NL-to-SQL assistants. OSI / Apache Ossie is a vendor-neutral interchange format, expressed in YAML/JSON, that lets those definitions be read by any conforming tool. Native maximizes integration depth inside one platform; OSI maximizes portability across platforms.

### Does Snowflake support OSI today?

Yes, and it is the most concrete example shipped as of August 2026. Snowflake is a founding and leading contributor to the standard and offers a documented bridge: `SYSTEM$CREATE_SEMANTIC_VIEW_FROM_OSSIE_YAML` creates or replaces a Semantic View from Ossie YAML, while `SYSTEM$READ_OSSIE_YAML_FROM_SEMANTIC_VIEW` exports one back, supporting Ossie core 0.1.1 as of August 2026. This is an API path rather than a user-facing product feature, and round-trips preserve the core model with documented fidelity limits.

### Does Databricks support OSI?

Databricks participates in the OSI working group and offers Metric Views as its warehouse-native semantic object, consumed by Genie for natural-language querying. As of August 2026, however, there is no shipped Metric View ↔ Ossie converter. Participation signals intent; it does not equal shipped import/export — a distinction that applies to most working-group members, not just Databricks.

### Does OSI replace Snowflake Semantic Views or Databricks Metric Views?

No. OSI is an interchange format, not an authoring or serving object. You still author and govern semantics in a tool — natively, or in MetricFlow, Cube, LookML, and similar products — and export through Ossie when definitions need to travel. Warehouse-native objects and Ossie are complementary layers rather than competitors, which is the point of the interchange design.

### Is warehouse-native semantics the same as vendor lock-in?

Not by itself — but it is where lock-in concentrates. Definitions that live only inside one platform's catalog are assets of that platform, so leaving requires an interchange step, and the cost scales with how much of your semantics is platform-specific. The Ossie bridge reduces that cost for the core model, while extension-specific behavior, such as Snowflake `custom_instructions`, does not transfer automatically.

### What does OSI mean for AI agents?

It means the definitions that ground NL-to-SQL can move between platforms. Cortex Analyst grounds in Semantic Views; Genie grounds in Metric Views; and an Ossie document can, in principle, ground both plus a third agent on a different stack. Portability still leaves the evolution problem, because interchange does not keep definitions current after schema drift — which is why maintained, validated context remains the deciding factor for agent accuracy.
