---
title: "What Is Snowflake OSI? Semantic Views, Cortex Analyst & Ossie"
description: "Snowflake OSI is search shorthand for Snowflake's role in Open Semantic Interchange — now Apache Ossie — plus Semantic View import/export via Ossie YAML."
author: "Evan Paul"
date: 2026-08-04
lastmod: 2026-08-04
head:
  - - meta
    - name: keywords
      content: "Snowflake OSI, Snowflake open semantic, Snowflake semantic layer, Apache Ossie, Ossie YAML, Snowflake Semantic Views, Cortex Analyst, SYSTEM$CREATE_SEMANTIC_VIEW_FROM_OSSIE_YAML"
  - - meta
    - property: og:title
      content: "What Is Snowflake OSI? Semantic Views, Cortex Analyst & Ossie"
  - - meta
    - property: og:description
      content: "Snowflake OSI is search shorthand for Snowflake's role in Open Semantic Interchange — now Apache Ossie — plus Semantic View import/export via Ossie YAML."
  - - meta
    - property: og:type
      content: article
  - - meta
    - property: og:url
      content: https://datus.ai/blog/what-is-snowflake-osi/
  - - meta
    - property: og:image
      content: https://datus.ai/logo_dark.svg
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - link
    - rel: canonical
      href: https://datus.ai/blog/what-is-snowflake-osi/
---

# What Is Snowflake OSI? Semantic Views, Cortex Analyst & Ossie

## TL;DR

- **Snowflake OSI** usually means Snowflake's founding role in **Open Semantic Interchange (OSI)** — now incubating at Apache as **Apache Ossie** — plus Snowflake's native bridge to Semantic Views. It is **not** a separate product SKU.
- Three names get collapsed into one: [Semantic Views](/blog/what-is-semantic-model/) author and govern metrics inside Snowflake; **Cortex Analyst** consumes those views for text-to-SQL; **Ossie** is the interchange format that moves definitions in and out.
- **Current APIs** (mid-2026 docs): `SYSTEM$CREATE_SEMANTIC_VIEW_FROM_OSSIE_YAML` and `SYSTEM$READ_OSSIE_YAML_FROM_SEMANTIC_VIEW`. The older `…_OSI_YAML…` names are deprecated aliases for the same jobs.
- Supported Ossie core version on that path today is **`0.1.1`**. Round-trips preserve core metrics, dimensions, equi-joins, and `ai_context`; Snowflake-only features land in `SNOWFLAKE` custom extensions; non-equi relationships can be dropped.
- For AI agents, portable semantics reduce "same KPI, five definitions" failure — but only if definitions stay current. An interchange format is not continuous context evolution.

**Snowflake OSI** is how searchers shorthand Snowflake's founding role in Open Semantic Interchange — not a separate Snowflake product SKU. As of mid-2026 the project is **Apache Ossie (incubating)**; Snowflake's current product bridge uses **Ossie YAML** import/export against Semantic Views. This guide separates the open standard from Semantic Views and Cortex Analyst, and maps the names you still type in search to what ships today.

## 1. Snowflake OSI: a working definition

Teams type **snowflake osi** or **snowflake open semantic** when they encounter three overlapping names in the same announcement stack: Snowflake as a founding contributor to Open Semantic Interchange, Snowflake Semantic Views as the warehouse-native modeling object, and Cortex Analyst as the NL-to-SQL consumer of those views. Collapsing those into one mental model produces the wrong purchase and architecture decisions.

A useful working definition:

> **Snowflake OSI** is the industry shorthand for Snowflake's participation in **Open Semantic Interchange** — the vendor-neutral YAML/JSON specification for metrics, dimensions, datasets, and relationships, now evolving as **Apache Ossie (incubating)** — together with Snowflake's product bridge that can create [semantic views](/blog/what-is-semantic-model/) from **Ossie YAML** and export existing views back to Ossie. It is **not** a separately billed Snowflake product, and it is **not** synonymous with Cortex Analyst or with "Snowflake owns the standard."

The [Open Semantic Interchange](/blog/open-semantic-interchange-osi/) hub covers the standard itself: what artifacts it encodes, who sits in the working group, and why interchange differs from a semantic-layer product. This spoke stays on the Snowflake-shaped search intent: what searchers mean, what Snowflake actually ships **now**, and where the boundaries break.

### What's new as of mid-2026

Snowflake's product update on Apache Ossie is what most searchers are reacting to:

- The project entered the **Apache Incubator** in **July 2026** under the name **Apache Ossie (incubating)** to avoid colliding with other "OSI" acronyms in open source.
- The **specification and YAML format are unchanged**; "OSI" as a *project name* is historical — the format and mission continue.
- Snowflake remains an **active contributor under ASF governance**, not a sole controlling entity.
- Community snapshots cited in that announcement (treat as as-of dates, not evergreen market share): more than **100 commits and 35 merged PRs** from multiple vendors; growth from **17 launch partners to more than 50 organizations**; working groups including **Metric Language, Catalog, and Ontology**; reference converters including the dbt Semantic Layer (MetricFlow) and Apache Polaris catalog metadata.

On the product side, Snowflake docs now list Ossie YAML alongside native Semantic View YAML in the YAML-vs-DDL guide, and the **canonical SYSTEM$ names use Ossie**, with the older OSI-named procedures/functions marked deprecated.

## 2. Snowflake OSI vs Semantic Views vs Cortex Analyst

Searchers often use "Snowflake OSI," "Snowflake open semantic," and "Snowflake semantic layer" interchangeably. They are related but not identical jobs in the stack.

| Dimension | Snowflake OSI / Apache Ossie | Snowflake Semantic Views | Cortex Analyst |
| --- | --- | --- | --- |
| **What it is** | Open interchange specification (+ Snowflake Ossie YAML bridge) | Schema-level object defining business metrics, dimensions, relationships inside Snowflake | Snowflake's text-to-SQL / NL analytics surface |
| **Where it lives** | Spec + converters under Apache Ossie; SYSTEM$ Ossie procedures/functions in Snowflake | Snowflake catalog (RBAC, sharing, privileges) | Snowflake Cortex product surface |
| **Primary job** | Portable, vendor-neutral semantic metadata | Author, govern, and serve governed semantics in-warehouse | Answer business questions with SQL grounded in a semantic view |
| **Lock-in profile** | Designed to reduce lock-in across tools | Strongest inside a Snowflake estate | Bound to Snowflake + configured semantic views |
| **Ossie relationship** | *Is* the interchange format | Can be created from / exported to **Ossie YAML** | Consumes Semantic Views; does not replace the standard |
| **What it is not** | Not a BI tool or metric store by itself | Not a cross-warehouse interchange standard | Not the definition store; it is a consumer |

Read that grid as a dependency chain, not a bake-off. Semantic Views are the Snowflake authoring and governance object. Cortex Analyst is one high-value consumer of those views. Ossie is the format that lets definitions leave (or enter) that object without a full rewrite — subject to fidelity limits discussed in §5.

If your question is "what is a [semantic layer](/blog/what-is-semantic-layer/) in general?", start with that glossary entry. If your question is "how does Snowflake wire open interchange into its own modeling object?", stay here.

## 3. Why "Snowflake OSI" searches spike — and what they usually want

Three practical reasons drive this query cluster.

**First, Snowflake is the name people remember from launch coverage — and from the 2026 rename.** Open Semantic Interchange was introduced with Snowflake among the founding organizations. Headlines compressed "Snowflake + open semantic interchange" into **snowflake osi**. The Apache Ossie announcement then reopened the same query: did Snowflake launch a product, or rename a standard? Searchers need a clear answer: Snowflake helped start it; incubation is meant to keep governance open; your metrics should not be modeled as "Snowflake-only forever" if portability is a requirement.

**Second, the product surface and the standard share vocabulary.** Snowflake docs describe Semantic Views as the recommended way to define business semantics for Cortex Analyst, and they also document **Ossie YAML** (and deprecated OSI-named aliases) import/export against those views. Without a disambiguation page, "Snowflake open semantic" can mean "open the Semantic View YAML," "use Ossie YAML," or "what is Ossie?" — three different tasks.

**Third, AI agents raised the cost of semantic fragmentation.** When five tools each redefine `net_revenue`, humans notice eventually; agents fail loudly and confidently. Teams evaluating Cortex Analyst, MetricFlow, Cube, or cross-platform agents ask whether Snowflake's Ossie involvement means definitions will travel. The honest answer: the rails exist and Snowflake has a documented bridge; industry-wide native support elsewhere is still uneven; and portable YAML does not by itself keep definitions accurate after schema drift.

## 4. How Snowflake OSI connects to AI agents and data engineering agents

Cortex Analyst is Snowflake's clearest illustration of why semantics matter for agents: generic schema-only [text-to-SQL](/blog/what-is-text-to-sql/) misses business process definitions, metric grain, and synonym handling. Snowflake's own Cortex Analyst documentation positions Semantic Views as the bridge between how business users speak and how tables are stored. When those views can be imported from or exported to Ossie YAML, an agent stack gains a path to reuse governed definitions across tools that speak Ossie — without treating Snowflake as the only possible authoring surface.

That path still leaves an evolution problem. Ossie standardizes **exchange**. It does not continuously regenerate metrics when a fact table gains a new status code, when finance redefines "active customer," or when verified-query examples go stale. Warehouse-native agents (Cortex Analyst on Semantic Views) and open [data engineering agents](/blog/what-is-data-engineering-agent-2026/) that maintain [evolvable context](/blog/contextual-data-engineering/) solve different slices of the same stack: one consumes governed semantics inside a platform; the other focuses on creating, validating, and refreshing the context those consumers need. Portable interchange makes the handoff cheaper. It does not replace the maintenance loop.

A practical failure mode looks like this. A team exports a Semantic View to Ossie YAML, imports it into a second tool, and declares "we are Ossie-native." Six months later, Snowflake-only `custom_instructions` and verified queries still live only in the `SNOWFLAKE` extension; the second tool ignores them; Cortex Analyst and the external agent disagree on edge-case questions. Interoperability of the core model coexists with divergence on AI context unless someone owns the evolution process.

## 5. What Snowflake actually ships: Ossie YAML in and out of Semantic Views

As of mid-2026, Snowflake documents a concrete bridge — this is the engineering content most announcement pages skip. Prefer the **Ossie-named** APIs in new work; treat OSI-named names as deprecated aliases that still appear in older snippets and search results.

**Write path (current).** `SYSTEM$CREATE_SEMANTIC_VIEW_FROM_OSSIE_YAML` accepts an Ossie YAML document, converts it to Snowflake's semantic model representation, and creates (or replaces) a semantic view in a target schema. Required top-level fields include `name` and `version`; optional sections cover `datasets`, `relationships`, `metrics`, `ai_context`, and `custom_extensions`. Docs currently list supported Ossie core version **`0.1.1`** (unsupported versions raise an error listing the supported values). Expression dialect priority is `SNOWFLAKE` when present, otherwise `ANSI_SQL` as a fallback.

**Read path (current).** `SYSTEM$READ_OSSIE_YAML_FROM_SEMANTIC_VIEW` returns an existing semantic view as an Ossie YAML document (a document wrapper with top-level `version` + `semantic_model`). Mapping is explicit: Snowflake `tables` become Ossie `datasets`; dimensions, time dimensions, and facts map to fields with dimension markers; model-level metrics export as Ossie metrics; only equi-join relationships are exported.

**Deprecated aliases.** `SYSTEM$CREATE_SEMANTIC_VIEW_FROM_OSI_YAML` and `SYSTEM$READ_OSI_YAML_FROM_SEMANTIC_VIEW` are the older, OSI-named ancestors of the Ossie-named successors. New scripts and runbooks should standardize on the Ossie names so you are not teaching a historical project acronym as the product API.

**How this sits next to native YAML.** Snowflake's Semantic Views YAML-vs-DDL guide treats four related operations as first-class: create from **native** Semantic View YAML, create from **Ossie** YAML, export to native YAML, and export to Ossie YAML. That is the practical answer to "Snowflake open semantic": open interchange is Ossie; Snowflake-native authoring YAML is a separate path optimized for Snowflake features.

**Fidelity matters more than the happy-path demo.** Snowflake documents what survives a round-trip and what does not. Faithfully preserved items include model name and description, dataset sources (qualified names and subqueries), primary/unique keys, field classifications, equi-join relationships, model-level metrics, `ai_context`, and vendor `custom_extensions`. Lost or relocated items include non-equi relationships (ASOF, RANGE — dropped because the Ossie core spec defines equi-join semantics), field labels on some paths, storage data types (by design Ossie fields carry expressions, not storage types), multi-dialect expressions (only the resolved `SNOWFLAKE` dialect returns), and table-level metrics/filters (moved into dataset-level `SNOWFLAKE` custom extensions).

That fidelity table is the decision artifact. If your portability story depends on complex non-equi joins or on Snowflake-only AI instructions remaining first-class in every consumer, plan for extension-aware tooling or accept that "Ossie export" is a core-model subset, not a bit-perfect clone of the Semantic View.

**Mini walkthrough — export after a Cortex-tuned view.** Finance owns a Semantic View `analytics.public.revenue_model` that Cortex Analyst uses daily. The view includes model-level `custom_instructions` ("exclude test accounts; answer in USD"), synonym-rich dimensions for `region`, and an equi-join from `orders` to `customers`. An analytics engineer runs:

```sql
SELECT SYSTEM$READ_OSSIE_YAML_FROM_SEMANTIC_VIEW(
  'analytics.public.revenue_model'
);
```

They commit the YAML to a shared repo as the portable source of truth. A second team imports the same document into a sandbox schema:

```sql
CALL SYSTEM$CREATE_SEMANTIC_VIEW_FROM_OSSIE_YAML(
  'analytics.sandbox',
  $$ ... Ossie YAML ... $$
);
```

They confirm `total_revenue`, grain, and the equi-join survive. What does not automatically become portable product behavior: the Cortex-oriented instructions and synonyms sit in `SNOWFLAKE` custom extensions — another BI tool that reads Ossie core fields but ignores vendor extensions will answer "revenue by region" with the metric expression intact and the instruction layer missing. The export succeeded; the AI behavior diverged. That is the difference between interchange of definitions and interchange of agent policy.

Official references for verification: Snowflake's <a href="https://docs.snowflake.com/en/sql-reference/functions/system_read_ossie_yaml_from_semantic_view" rel="nofollow noopener">SYSTEM$READ_OSSIE_YAML_FROM_SEMANTIC_VIEW</a> docs, <a href="https://docs.snowflake.com/en/sql-reference/stored-procedures/system_create_semantic_view_from_ossie_yaml" rel="nofollow noopener">SYSTEM$CREATE_SEMANTIC_VIEW_FROM_OSSIE_YAML</a>, the <a href="https://ossie.apache.org/updates/ossie-enters-apache-incubator/" rel="nofollow noopener">Apache Ossie incubator announcement</a>, and the <a href="https://github.com/apache/ossie" rel="nofollow noopener">Apache Ossie repository</a>.

## 6. When the Snowflake-native path is enough — and when portable Ossie matters

Use a Snowflake-centric Semantic View + Cortex Analyst path when your analytics estate is already Snowflake-first, RBAC and sharing inside the warehouse are the governance model you want, and you do not need the same metric definitions to drive a second warehouse or a non-Snowflake BI/agent runtime this quarter. That path is coherent and well-documented; forcing premature multi-tool interchange adds process cost without payoff.

Prioritize Ossie portability when you already run MetricFlow, Cube, or another authoring layer alongside Snowflake; when a second cloud warehouse or embedded analytics API must share KPI definitions; or when procurement explicitly asks whether semantic lock-in is reversible. In those cases, treat Snowflake's SYSTEM$ Ossie bridge as evidence that the Snowflake side can speak the standard — then verify converters and native support on every other tool in the path, because working-group membership elsewhere is not the same as shipped import/export. The [semantic layer tools list with OSI status](/blog/semantic-layer-tools-list-osi/) tracks who has actually merged a converter versus who has only joined the working group.

Open-source data engineering agents that connect to Snowflake (including tools that build evolvable semantic context above the warehouse) are complementary when the bottleneck is keeping definitions current across changing schemas and feedback, not merely moving a YAML file once. Prefer a platform-native Cortex Analyst pilot when the bottleneck is simply "business users cannot get trustworthy answers inside Snowflake today" and one governed Semantic View unlocks that. For a wider view of how warehouse-native agents compare to cross-stack open ones, see [platform-native data agents compared](/blog/platform-native-data-agents-compared/).

## Conclusion

**Snowflake OSI** is a search phrase, not a SKU. It points at Snowflake's founding and ongoing role in Open Semantic Interchange — now **Apache Ossie** — and at a documented Semantic View import/export bridge that today is spelled **Ossie YAML** in the product docs. Semantic Views remain the in-warehouse definition object; Cortex Analyst remains a consumer; Ossie remains the interchange format. Teams that separate those three layers — and that update scripts from deprecated `…_OSI_YAML…` names to `…_OSSIE_YAML…` — make better stack decisions than teams that treat the headline as a product name. Portability moves a definition once; keeping it accurate as schemas drift is the job that never ends.

## Frequently asked questions

### What does "Snowflake OSI" mean?

It usually means Snowflake's role in **Open Semantic Interchange (OSI)** — the open semantic-metadata specification now incubating as **Apache Ossie** — plus Snowflake's ability to create Semantic Views from **Ossie YAML** and export views back to Ossie. It does not refer to a separately marketed Snowflake product called "OSI." The phrase is search shorthand that compresses a standard, a warehouse object, and an AI surface into one term.

### Is Snowflake OSI the same as Snowflake Semantic Views?

No. Semantic Views are Snowflake schema-level objects for governed business semantics. Ossie (formerly called OSI as a project name) is the open interchange format. Snowflake connects them through documented SYSTEM$ import/export procedures and functions. You can have Semantic Views with no Ossie workflow; you can have Ossie YAML that never lands in Snowflake.

### Does Cortex Analyst require OSI / Ossie?

No. Cortex Analyst is designed to use Semantic Views (and still supports legacy stage-based semantic model YAML for compatibility). Ossie matters when you need those definitions to interoperate with tools outside Snowflake's control plane — not as a prerequisite to ask questions in Cortex Analyst.

### Did Snowflake rename OSI to Apache Ossie?

The **project** was accepted into the Apache Incubator under the name **Apache Ossie (incubating)** in 2026 to avoid acronym collisions. The specification and YAML format are unchanged; Snowflake remains an active contributor under ASF governance. Product APIs followed the rename: use `…_OSSIE_YAML…` names going forward. Search phrases like "Snowflake OSI" and "Snowflake open semantic" will remain common while the rename propagates.

### Which SYSTEM$ functions should I use today?

Use **`SYSTEM$CREATE_SEMANTIC_VIEW_FROM_OSSIE_YAML`** and **`SYSTEM$READ_OSSIE_YAML_FROM_SEMANTIC_VIEW`**. The older `…_FROM_OSI_YAML` / `…_OSI_YAML_FROM…` names are deprecated aliases. Currently supported Ossie core version on that path is **`0.1.1`**.

### Can I round-trip a Semantic View through Ossie without losing anything?

Not everything. Core datasets, fields, equi-joins, model-level metrics, and `ai_context` are designed to survive. Non-equi relationships can be dropped; some Snowflake-only features move into `SNOWFLAKE` custom extensions that other tools may ignore. Validate fidelity against Snowflake's Ossie mapping docs before treating export as a full backup of AI instructions and advanced join types.

## Related articles

- [Open Semantic Interchange (OSI)](/blog/open-semantic-interchange-osi/) — the standard itself, now Apache Ossie: what it encodes and who's behind it.
- [What Is a Semantic Model?](/blog/what-is-semantic-model/) — semantic models vs warehouse-native semantic views.
- [What Is a Semantic Layer?](/blog/what-is-semantic-layer/) — the general concept Snowflake's Semantic Views implement in-warehouse.
- [OSI vs MetricFlow](/blog/osi-vs-metricflow/) — interchange standard vs execution engine, and why you need both.
- [Semantic layer tools in 2026 + OSI status](/blog/semantic-layer-tools-list-osi/) — which tools have actually shipped an Ossie converter.
- [Platform-native data agents compared](/blog/platform-native-data-agents-compared/) — Cortex/Genie/BigQuery vs open cross-stack agents.
