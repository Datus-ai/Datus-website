---
title: "OSI vs LookML: Can Open Standards Replace Looker's Modeling Language?"
description: "OSI (Apache Ossie) vs LookML: lock-in trade-offs, migration paths, and how both affect metric portability for AI agents in practice."
author: "Evan Paul"
date: 2026-08-06
lastmod: 2026-08-06
head:
  - - meta
    - name: keywords
      content: "OSI vs LookML, LookML vs OSI, Apache Ossie, LookML, Looker modeling language, semantic layer portability, migrate LookML to OSI, AI agents"
  - - meta
    - property: og:title
      content: "OSI vs LookML: Can Open Standards Replace Looker's Modeling Language?"
  - - meta
    - property: og:description
      content: "OSI (Apache Ossie) vs LookML: lock-in trade-offs, migration paths, and how both affect metric portability for AI agents in practice."
  - - meta
    - property: og:type
      content: article
  - - meta
    - property: og:url
      content: https://datus.ai/blog/osi-vs-lookml/
  - - meta
    - property: og:image
      content: https://datus.ai/logo_dark.svg
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - link
    - rel: canonical
      href: https://datus.ai/blog/osi-vs-lookml/
---

# OSI vs LookML: Can Open Standards Replace Looker's Modeling Language?

LookML vs OSI (Apache Ossie): one is Looker's proprietary modeling language, the other a vendor-neutral interchange standard. This article compares both fairly, weighs what portability would unlock, and maps migration and coexistence paths for teams on Looker today.

## TL;DR

- **OSI vs LookML:** LookML is Looker's proprietary modeling language, tightly coupled to its exploration engine; OSI (Apache Ossie) is a vendor-neutral interchange standard — a portability path, not necessarily a replacement.
- LookML's real strength is the model-to-UI loop: Explores, dashboards, and governed metrics compile straight to SQL in the Google Cloud-hosted Looker, with broad dialect coverage and Gemini-assisted modeling.
- OSI is an Apache-2.0 specification (v0.1.1) defining metrics, dimensions, datasets, and relationships in YAML/JSON; it entered the Apache Incubator in June 2026 as Apache Ossie.
- As of the mid-2026 tools landscape, Looker sits outside the public OSI working-group roster — the clearest red cell for teams that care about portable definitions.
- No product ships native OSI import or export yet, so a realistic "migrate LookML to OSI" today means reference converters, targeted re-authoring, and coexistence — not a single button.

## 1. LookML: a working definition

LookML is the first half of this comparison, and it deserves a precise definition, because most of the tension in the OSI story is about what LookML is — and is not. If you work in Looker daily, much of this will feel familiar; the goal is to make the boundary with OSI visible — the <a href="https://docs.cloud.google.com/looker/docs/what-is-lookml" rel="nofollow noopener">official LookML documentation</a> covers the syntax.

> **LookML** — short for Looker Modeling Language — is the declarative, dependency-based language Looker uses to define its semantic models. Instead of writing SQL, modelers write files that describe dimensions, measures, aggregates, and the joins that connect tables; Looker's SQL generator compiles those definitions into queries against the underlying database. A LookML project typically contains model files (which declare database connections and Explores) and view files (which describe how a table or group of tables can be measured and filtered), all version-controlled in Git. Because LookML is a dependency language in the spirit of `make`, changing one definition re-evaluates everything that depends on it. What LookML is not matters just as much for this comparison: it is not an open standard, it is not a standalone semantic layer that other tools can read, and its definitions are deeply integrated with Looker's exploration engine — the Explore UI, dashboards, and permissions all treat LookML as their source of truth. LookML produces semantics that are powerful inside Looker and largely trapped there.

Two implications follow. First, LookML is a form of [semantic model](/blog/what-is-semantic-model): it encodes measures, dimensions, and joins in machine-readable form, which is why teams describe Looker as having a [semantic layer](/blog/what-is-semantic-layer) rather than just a BI tool. Second — the crux of this comparison — the encoding is proprietary and runtime-coupled. The SQL generator, Explore UI, dashboard state, and permissions all treat LookML as their source of truth, so the definition is not a standalone artifact another tool can pick up. That coupling is deliberate: it makes the model-to-UI loop tight, and it is exactly what OSI, by design, refuses to reproduce.

This reframes the common question. The interesting one is not "can OSI replace LookML syntax" but "what would portability unlock, and what would you give up by pursuing it." The next section defines the other side, and §4 takes up that trade-off.

## 2. OSI (Apache Ossie): a working definition

OSI — Open Semantic Interchange, renamed **Apache Ossie** when it entered the Apache Incubator in June 2026 (<a href="https://ossie.apache.org/" rel="nofollow noopener">ossie.apache.org</a>) — is the other side. It is an Apache-2.0 specification defining a vendor-neutral format for semantic metadata — metrics, dimensions, datasets, and relationships — in YAML or JSON. We have a full [OSI explainer](/blog/open-semantic-interchange-osi); the relevant summary: OSI is an interchange format, not a product, a query engine, or a BI tool. It says nothing about where a query runs or which SQL dialect to emit; it says what a metric means and how it relates to the rest of the model.

Three facts frame the comparison against LookML. The spec is young: v0.1.1 is current, v0.2.0 is in development, and the schema may still break earlier documents. The ecosystem is real but thin: more than 50 organizations are in the working group, and the <a href="https://github.com/apache/ossie" rel="nofollow noopener">Apache Ossie repository</a> holds four merged reference converters — dbt/MetricFlow, GoodData, Salesforce, and Apache Polaris — while no product ships native OSI support. Most relevant here: Looker is not listed among the public working-group participants. Some 2025–2026 coverage described Looker Modeler as an OSI launch partner — announced intent, not shipped support, since no OSI converter or native import/export exists for LookML as of the mid-2026 tools landscape.

OSI is also not a solution to every semantic problem: it standardizes the exchange format, not how definitions get created, validated, or kept current — and it does not reproduce the runtime that makes a BI tool feel fast. For a full landscape of where each semantic-layer tool — Looker included — stands on OSI today, our [semantic layer tools list](/blog/semantic-layer-tools-list-osi) is the reference grid.

## 3. The key differences

The table below is the practical core of this article: where LookML and OSI genuinely differ and why those differences produce the trade-offs teams feel. The analysis after it explains which rows should drive a decision.

| Dimension | LookML | OSI (Apache Ossie) |
| --- | --- | --- |
| What it is | Proprietary modeling language owned by Looker / Google Cloud | Vendor-neutral interchange specification under the Apache Software Foundation |
| Definition format | `.model.lkml` and `.view.lkml` files in a Git project | YAML/JSON semantic model documents |
| Execution coupling | Compiled to SQL by Looker's generator; drives Explore UI, dashboards, permissions | Pure definition — no engine; any conforming consumer generates queries |
| What it describes | Explores, views, dimensions, measures, joins, dashboard configuration | Metrics, dimensions, datasets, relationships (plus optional `ai_context`) |
| Portability | Definitions stay inside the Looker stack | Designed to be exchanged between tools without loss of meaning |
| SQL dialect coverage | Broad, handled by Looker's generator | Multi-dialect expressions in the spec; each consumer resolves its own dialect |
| OSI status today | 🔴 Not in the public working-group roster; no converter merged | The standard itself; 4 merged reference converters; no native product support yet |
| Maturity | Production-grade; years of enterprise adoption | v0.1.1 / 0.2.0-dev; schema may still change; breaking changes possible |

The rows that matter most are execution coupling, portability, and maturity. Execution coupling is the structural difference: LookML is a specification plus a runtime that are inseparable in practice, while OSI deliberately draws the line between definition and execution. Portability is the payoff — but only if the ecosystem matures, which is what the maturity row captures. That row is the honest answer to the "replace" question: LookML is the mature, production-proven system; OSI is a young standard whose first wave of native support has not shipped.

The maturity gap is also about compatibility promises. LookML has years of backward-compatible behavior across thousands of deployments, and Looker treats that stability as a product. OSI, by contrast, is explicit that the in-development schema may change. For a team betting a metric catalog on either format, that difference in commitment is as real as the syntax — and it is the main reason the verdict here is "release valve," not "replacement."

## 4. The lock-in question: what portability would unlock

This is where the comparison gets practical. LookML-authored definitions are largely trapped in the Looker stack. A view file that encodes `net_revenue` as `SUM(amount_usd) - SUM(refund_usd)` with a filter for completed orders can be consumed by Looker — and by anything that goes through the Looker API. It cannot be read by dbt, Cube, a warehouse-native semantic view, or a text-to-SQL agent directly, because none of them parse LookML and none of them share Looker's runtime. If your team also reports in Power BI, serves metrics through a headless API, or wants an AI agent to ground queries in the same definitions, the LookML logic must be re-expressed per tool — exactly how metric drift gets worse.

What would portability actually unlock? Four outcomes. First, governed metrics defined once in Looker could be consumed by every other surface — BI, APIs, notebooks, agents — without re-authoring, which collapses the most common source of inconsistent KPIs. Second, it gives teams an escape hatch: if Looker's pricing, roadmap, or Google Cloud coupling becomes a problem, the definitions are no longer hostage to that decision. Third, agents could read semantics directly from a standard format instead of a vendor API, lowering the integration cost of grounding AI on governed definitions. Fourth — least obvious — it changes how teams evaluate tooling: "does it support OSI" gradually replaces "how many metrics will I have to re-define."

The honest counterpoint: portability is not free, and for LookML it does not yet exist in any supported form. No converter maps LookML to OSI; the four merged converters cover other formats, and Looker's absence from the working-group roster makes a Google-built converter a less certain bet than the 2025–2026 launch-partner announcements implied. So "migrate LookML to OSI" in August 2026 means export through an experimental path, re-author in an OSI-compatible tool, or run both in parallel — the next two sections cover those options.

## 5. What LookML does that interchange doesn't

A fair comparison gives LookML its due, because "proprietary vs open" misses what makes teams pick Looker. LookML is not just a syntax; it is the front end of a tightly integrated product. When you change a measure in a view file, the Explore UI, dashboards, drill paths, and permission rules reflect it immediately. That model-to-UI loop is the strongest in BI, and no interchange format competes with it — because interchange formats deliberately exclude presentation behavior.

The second strength is breadth: Looker's SQL generator has historically covered a wide range of SQL dialects, which matters for organizations running multiple warehouses. The third is tooling: Git-backed projects, an integrated IDE, data tests, and a marketplace of Looker Blocks mean the daily modeling workflow is mature in ways a spec cannot replicate. And Gemini-assisted modeling gives Looker's authoring process an AI assist that no format provides on its own.

Keep the distinction between the modeling language and the platform around it. OSI could in principle absorb the interchange role of LookML — the definition layer — while Looker keeps the platform role: exploration, visualization, governance, and AI-assisted authoring. That division of labor is the coexistence story in the next section, and it is more realistic than replacement.

## 6. Migration and coexistence scenarios

For most teams the decision is not binary, and the scenarios below are ordered by how much change they involve. Each assumes the goal is either to protect Looker's workflow or to make definitions portable without abandoning it.

**Scenario A — Looker stays the only consumer.** If one BI tool, one team, and one warehouse is your reality, there is no pressing reason to export LookML today. The pragmatic move is to monitor whether a LookML converter appears in the Apache Ossie repository, whether Looker joins the working-group roster, or whether Google ships anything in Looker Modeler — none are true as of August 2026.

**Scenario B — Looker first, OSI for downstream.** This is the coexistence path for teams with Looker plus other consumers. Keep LookML as the canonical source for anything Looker renders, and export a small, governed subset of definitions — the twenty KPIs that drive reporting — into an OSI-compatible format for agents and secondary tools. Expect to re-author presentation-independent pieces (metrics, dimensions, joins) and leave Explores and dashboard logic in LookML, since OSI does not model them. Budget some ongoing synchronization effort — a metric in both places drifts if nobody owns the bridge.

**Scenario C — authoring leaves Looker.** If the team is moving metric authoring to dbt MetricFlow, a warehouse-native semantic layer, or another OSI-aligned tool, Looker can become a consumption surface: the SQL it generates is still valid, and LookML describes what Looker renders rather than being the source of truth. Here OSI is genuinely useful — it is the bridge format. If you are weighing this against [MetricFlow specifically](/blog/osi-vs-dbt-metricflow) or against [warehouse-native semantics](/blog/osi-vs-warehouse-native-semantics), those comparisons cover the adjacent decision.

Whichever scenario fits, the sequence is the same: inventory the metrics that matter, define them in one place, and treat export as a contract you can validate — a document that fails schema validation is a signal, not a failure. Teams that wait for the standard to finish before modeling anything will have nothing to export when it does.

## 7. Why this matters for AI agents

Semantic interoperability stops being an architecture debate when AI agents enter the picture: agents are the most demanding consumers of semantics. Text-to-SQL models that score above 85% on academic benchmarks like Spider 1.0 collapse to around 10% for GPT-4o and 17% for o1-preview on <a href="https://spider2-sql.github.io/" rel="nofollow noopener">Spider 2.0</a>, a benchmark built from real enterprise workflows where schemas exceed a thousand columns. Most of that collapse is semantic ambiguity: the model writes syntactically correct SQL against the wrong definition. Governed, machine-readable metric definitions — exactly what OSI standardizes — are the highest-leverage fix, which is why the [text-to-SQL accuracy](/blog/what-is-text-to-sql) story and the OSI story are the same story.

The LookML side is subtler. Looker exposes a public API, so an agent can read definitions through the Looker surface — but that path is Looker-coupled, and it does not help a model running against Snowflake or a notebook that never touches Looker. OSI's bet is that a neutral format any agent can parse, validated against a public schema, is a stronger grounding foundation than a vendor API. The cost: the standard is young and unshipped. The payoff: when native support arrives, agents inherit definitions that were already governed.

There is a second half neither format solves alone: an interchange standard makes definitions portable but does not keep them current. Six months after a schema change, a static semantic model — in LookML or OSI — is stale unless re-validated. That evolution cycle is where [data engineering agents](/blog/what-is-data-engineering-agent) come in: tools that generate semantic models from schema and historical SQL, then refine them through feedback. They complement OSI for the same reason they complement LookML — the format provides the rails, the agent provides the process.

Some agents already work this way. Datus, for instance, is an open-source data engineering agent that generates semantic models from live schema and validated query history, stores them in a portable YAML format, and updates them as users upvote or correct results. None of that depends on Looker or OSI shipping — the interchange standard and the agent-driven evolution cycle are independent bets, and teams can adopt either first.

## 8. Common misconceptions

Most misconceptions come from treating a format and a product as the same thing. The five below recur in practice, and each collapses once you separate the interchange layer from the runtime layer.

**"OSI is another semantic layer product."** It is not. OSI is an interchange format — the agreed-upon syntax for exchanging definitions — and it has no runtime, no query engine, and no UI. LookML is one product's modeling language; OSI is a standard that multiple products could speak. The product comparison that makes sense is LookML versus Cube or MetricFlow, not LookML versus OSI.

**"Looker is replacing LookML with OSI."** There is no public evidence for this. Looker is not in the OSI working-group roster as of the mid-2026 tools landscape, no LookML converter exists in the Apache Ossie repository, and Looker Modeler's launch-partner coverage is an intent signal, not a shipped feature. OSI could plausibly become an output format Looker supports — but "could" and "is replacing" are different claims.

**"Migrating LookML to OSI is a converter click."** The four merged converters in the Apache Ossie repository cover dbt/MetricFlow, GoodData, Salesforce, and Apache Polaris — not LookML. Beyond the missing converter, an export would drop presentation-layer content — Explores, drill paths, dashboard filters — because OSI does not model them. A realistic migration re-authors metrics and joins and leaves Looker-specific UI in LookML.

**"An open standard means no lock-in anywhere."** OSI removes format lock-in — definitions can travel. It does not remove operational lock-in: the exploration engine, dashboard product, and modeling UX that make Looker valuable are Looker's, and no format changes that. If portability is the goal, OSI helps; if the goal is a vendor-neutral modeling experience, that is a different problem.

**"If we stay on Looker, OSI is irrelevant."** That is true only while Looker is the sole consumer. The moment a second tool, a warehouse-native semantic layer, or an AI agent needs the same definitions, portability becomes a real cost. Semantic and syntactic [interoperability](/blog/semantic-vs-syntactic-interoperability) is where OSI earns its keep, and it is worth a look even for committed Looker shops.

## Conclusion

LookML and OSI are not rivals in the way the "vs" in the title suggests; they operate at different layers. LookML is the tightest model-to-UI loop in BI, deeply integrated with Looker's exploration engine and Google Cloud's ecosystem, and it is the right choice for teams whose primary consumer is Looker itself. OSI is a portability path — an interchange standard that could release LookML-authored definitions from the Looker stack, with the sharp caveat that, as of August 2026, Looker is not in the public working group and no native support exists anywhere. The honest framing is that OSI is not a replacement but a release valve: it becomes valuable exactly when definitions need to travel. For teams on Looker, the practical sequence is to define and govern the metrics that matter, treat portability as a design assumption rather than a feature, and watch the ecosystem signals — a LookML converter, a roster change, a shipped import — before committing to migration. If the standard delivers, you will have definitions ready to travel. If it does not, you will still have a governed semantic layer, which is the part that is never wasted. Explore the [data engineering glossary](/glossary/) for more definitions.

## Frequently asked questions

### What is the difference between LookML and OSI?

**LookML** is Looker's proprietary modeling language: teams write view and model files that Looker compiles into SQL, coupled to Looker's exploration engine. **OSI (Apache Ossie)** is a vendor-neutral interchange specification defining metrics, dimensions, datasets, and relationships in YAML/JSON so definitions can be exchanged between tools. The practical difference is portability: LookML lives inside the Looker stack; OSI is designed to travel (see §3).

### Can I migrate LookML to OSI (Apache Ossie)?

Not yet, and not automatically. As of August 2026 there is no merged LookML-to-OSI converter — the four reference converters in the Apache Ossie repository cover dbt/MetricFlow, GoodData, Salesforce, and Apache Polaris — and no product ships native OSI support. A practical migration re-authors the presentation-independent parts (metrics, dimensions, joins) into an OSI-compatible format, leaves Explores and dashboard logic in LookML, and runs both in parallel while the ecosystem matures.

### Is Looker abandoning LookML for OSI?

There is no public evidence of that. Looker is not listed in the public OSI working-group roster as of the mid-2026 tools landscape, and no LookML converter or native OSI support ships in Looker. Some 2025–2026 coverage described Looker Modeler as an OSI launch partner — announced intent, not shipped support. Watch for a roster change, a merged converter, or a shipped import before treating any migration claim as fact.

### Does Looker support OSI (Apache Ossie)?

Not as of August 2026. Looker does not appear in the public OSI working-group participants, no LookML converter exists in the Apache Ossie repository, and no OSI import/export feature ships in the product. Looker remains a "not participating" cell in the [semantic-layer tools landscape](/blog/semantic-layer-tools-list-osi). That could change — participation announcements existed around Looker Modeler — but intent and delivery are different facts.

### Is LookML an open standard?

No. LookML is proprietary to Looker (now under Google Cloud). It is well documented and has a large community, but the language, its schema, and the runtime that interprets it are controlled by one vendor. By contrast, OSI (Apache Ossie) is an Apache-2.0 specification governed by the Apache Software Foundation, which is the standard answer to "will my definitions be readable by other tools — and by me — in ten years."
