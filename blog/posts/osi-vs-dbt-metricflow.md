---
title: "OSI vs dbt MetricFlow: Key Differences & Why It Matters for AI Agents"
description: "How OSI (Apache Ossie) and dbt MetricFlow differ — definition vs execution, governance, portability — and why both matter for AI agents."
author: "Evan Paul"
date: 2026-08-05
lastmod: 2026-08-05
head:
  - - meta
    - name: keywords
      content: "OSI vs dbt MetricFlow, OSI vs MetricFlow, Apache Ossie, dbt MetricFlow, dbt semantic layer, MetricFlow to OSI converter, semantic layer standard, AI agents"
  - - meta
    - property: og:title
      content: "OSI vs dbt MetricFlow: Key Differences & Why It Matters for AI Agents"
  - - meta
    - property: og:description
      content: "How OSI (Apache Ossie) and dbt MetricFlow differ — definition vs execution, governance, portability — and why both matter for AI agents."
  - - meta
    - property: og:type
      content: article
  - - meta
    - property: og:url
      content: https://datus.ai/blog/osi-vs-dbt-metricflow/
  - - meta
    - property: og:image
      content: https://datus.ai/logo_dark.svg
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - link
    - rel: canonical
      href: https://datus.ai/blog/osi-vs-dbt-metricflow/
---

# OSI vs dbt MetricFlow: Key Differences & Why It Matters for AI Agents

OSI (Apache Ossie) and dbt MetricFlow solve different problems but are often confused. This article defines each, compares them across six dimensions, walks through the dbt (MetricFlow) to OSI converter flow, and explains why the distinction matters for AI agents.

## TL;DR

- **OSI (Apache Ossie) is a vendor-neutral interchange format for semantic definitions; dbt MetricFlow is the open-source execution engine behind dbt's Semantic Layer** — complementary layers, not competitors: author in MetricFlow, interchange via OSI, consume anywhere.
- OSI is a specification, not a product: it standardizes metrics, dimensions, datasets, and relationships in YAML/JSON, but it plans no joins and generates no SQL. It entered the Apache Incubator in June 2026 as Apache Ossie, and the spec (v0.1.1 / 0.2.0-dev) is still evolving with possible breaking changes.
- MetricFlow is a runtime. It consumes semantic definitions, builds a semantic graph, and emits warehouse-specific SQL, with definitions governed as Git-versioned YAML through pull requests and served at scale through the dbt Cloud Semantic Layer API.
- The two connect through reference converters: the dbt (MetricFlow) → OSI converter is one of four merged in the Apache Ossie repository, alongside GoodData, Salesforce, and Apache Polaris, with a Spark converter in review.
- For AI agents the distinction decides accuracy: OSI makes governed definitions machine-readable across tools, MetricFlow makes them executable, and agents that consume both get grounded context instead of guessed semantics.

## 1. OSI and dbt MetricFlow: two working definitions

The confusion between these two names is not an accident. Both projects were announced within months of each other in 2025, both are licensed under Apache 2.0, and both live in the semantic layer space. dbt Labs played a founding role in the OSI working group, and MetricFlow was open-sourced at almost the same moment — a coincidence that made it easy to conclude they were the same initiative. They are not: they are two different layers of one architecture.

A useful working definition:

> OSI (Open Semantic Interchange, now Apache Ossie) and dbt MetricFlow occupy different layers of the semantic stack. OSI is a vendor-neutral interchange specification: an Apache 2.0 document format, written in YAML or JSON, that defines metrics, dimensions, datasets, and relationships so any tool can read them. It does not execute queries, plan joins, or generate SQL. MetricFlow is an execution engine: an open-source metric layer that consumes semantic definitions, builds a semantic graph, plans a query through a dataflow, and emits warehouse-specific SQL for Snowflake, BigQuery, Databricks, Postgres, and DuckDB. In dbt products, MetricFlow is the runtime behind the dbt Semantic Layer, and definitions are authored as Git-versioned YAML governed through pull requests. OSI is not a metric layer product, and MetricFlow is not an interchange format. The two connect through the dbt (MetricFlow) to OSI converter, one of the four reference converters merged in the Apache Ossie repository, which exports MetricFlow YAML into OSI documents so a metric authored once under dbt governance can be consumed by any OSI-compatible tool. Author in MetricFlow, interchange via OSI, consume anywhere.

That division of labor is the whole argument of this article. OSI is a portable contract: it says what a metric means and how it relates to other entities, in a format any tool can parse. MetricFlow is a runtime: it takes a definition and turns it into correct, engine-specific SQL. Neither does the other's job, and neither is redundant when the other exists. Neither one, on its own, is the whole of a [semantic layer](/blog/what-is-semantic-layer) — together they are the format and the runtime inside it.

Two boundaries are worth stating up front. OSI is not a semantic layer product: you cannot query it, it stores nothing, and it has no UI. MetricFlow is not an interchange format: a MetricFlow YAML file is only directly consumable by MetricFlow and the dbt ecosystem, which is precisely the gap OSI was created to close. Keeping those two negatives in mind prevents most of the confusion this article exists to clean up.

For the higher-level standard-versus-engine framing without the converter and agent detail, see our [OSI vs MetricFlow](/blog/osi-vs-metricflow) explainer; this article goes deeper on the six dimensions, the converter flow, and what the split means for AI agents.

The rest of the article works from these definitions: a short recap of each layer, the key-differences table, the converter flow that joins them, a decision framework, the AI-agent angle, and the misconceptions that keep circulating.

## 2. OSI in one paragraph: the interchange specification

OSI is covered in depth in our [Open Semantic Interchange (OSI) explainer](/blog/open-semantic-interchange-osi); the compressed version is enough here. OSI is an Apache 2.0 specification that standardizes the semantic artifacts every analytics stack defines — metrics, dimensions, datasets, relationships, and the business context that interprets them — in YAML or JSON. What OSI deliberately does not define is execution: no query plans, no SQL dialects, no runtime.

For this comparison, the details that matter are state and direction. OSI launched in September 2025 with 17 organizations and has grown past 50 participants across five working groups, with Snowflake leading and dbt Labs, Databricks, Salesforce, Oracle, Mistral AI, and BlackRock among the signatories. In June 2026 the project entered the Apache Incubator and was renamed Apache Ossie, and the specification sits at v0.1.1 with a 0.2.0-dev branch — which is a polite way of saying the format can still change in breaking ways. The project site is <a href="https://ossie.apache.org" rel="nofollow noopener">ossie.apache.org</a>.

None of that makes OSI executable, and that is deliberate. The specification separates definition from implementation so the same OSI document can drive a query in whichever engine consumes it. That separation is what makes the format portable — and it is also what makes OSI useless on its own. Portability without execution is a contract; execution without portability is a silo; OSI and MetricFlow are each half of the fix.

## 3. dbt MetricFlow in one paragraph: the metric runtime

MetricFlow's architecture is covered in full in our [dbt Semantic Layer & MetricFlow guide](/blog/dbt-semantic-layer-metricflow); here is the compressed version. MetricFlow is the open-source engine, licensed Apache 2.0 and open-sourced in late 2025, behind dbt's Semantic Layer. Teams author semantic models and metrics as YAML in the dbt project, govern them through pull requests and CI, and query them at runtime; MetricFlow resolves the request into a semantic graph, validates grain, plans joins, and generates engine-specific SQL. The authoritative documentation is the <a href="https://docs.getdbt.com/docs/build/about-metricflow" rel="nofollow noopener">dbt MetricFlow documentation</a>.

Two facts matter for the comparison. First, MetricFlow is a [metric layer](/blog/what-is-metric-layer) in the strict sense: it is about defining and executing metrics, not about a portable format for them. Second, although the engine is open source and runs standalone, the production serving surface — the dbt Cloud Semantic Layer API that exposes metrics over JDBC, GraphQL, and an MCP server for AI agents — still requires dbt Cloud. Open engine, hosted API: that split shapes how teams actually consume MetricFlow, and it is the split OSI's converter is designed to soften.

## 4. The key differences

The comparison that matters is not "which one is better" — they are different layers, so "better" is meaningless without a job in mind. The question is which layer does which job. The table below maps the two across the dimensions that drive real architecture decisions.

| Dimension | dbt MetricFlow | OSI / Apache Ossie |
| --- | --- | --- |
| **Primary job** | Define and execute governed metrics | Define a portable format for semantic definitions |
| **Governance model** | Git-centric YAML; PR review and CI validation | Spec-level governance; definitions are governed by the tool that authors them |
| **Portability** | Ports across SQL dialects via its query engine | Ports across tools, platforms, and vendors |
| **Execution vs. definition** | Executes: builds a semantic graph, plans joins, generates SQL | Defines: documents semantics; performs no execution |
| **AI agent access** | dbt Cloud API: JDBC, GraphQL, MCP server | Machine-readable YAML/JSON any tool or agent can parse |
| **Maturity** | Most-adopted open-source metric layer; SL API still requires dbt Cloud | Apache Incubator (June 2026); spec v0.1.1 / 0.2.0-dev; no native product support yet |

The pattern to internalize is that each is strong exactly where the other is weak. MetricFlow is mature, executable, and governed, but its definitions travel only where the dbt ecosystem can read them. OSI is young, non-executable, and deliberately ungoverned, but its definitions can travel anywhere a spec-conformant tool exists. The governance row is the least obvious: MetricFlow governance is a feature of its Git model, while OSI has no governance model at all — it defers to the authoring tool by design. That is not a defect; it is scope. It also means the common claim that "OSI gives you governance" is backwards: OSI gives you portability, and you bring the governance with you.

## 5. How they work together: the dbt (MetricFlow) to OSI converter flow

The relationship is easiest to see as a pipeline: author, convert, interchange, consume.

The authoring step stays in MetricFlow. A team defines a `net_revenue` metric as YAML in its dbt project — a semantic model pointing at `fact_orders`, a measure computed as `revenue_usd - refund_usd`, a filter for completed orders, a daily grain. That definition is reviewed in a pull request, validated in CI, and at query time MetricFlow generates the correct SQL for the warehouse. So far, everything is inside the dbt world.

The conversion step is where OSI enters. The dbt (MetricFlow) to OSI converter — one of four reference converters merged in the <a href="https://github.com/apache/ossie" rel="nofollow noopener">Apache Ossie repository</a> — takes that MetricFlow YAML and emits an OSI document describing the same metric, dimensions, relationships, and business context in the vendor-neutral format. The mapping preserves the semantic content that matters: the calculation, the grain, the filter, and the relationship to the underlying dataset.

The interchange step is where portability becomes real. That OSI document can be handed to any tool that implements the specification — a BI tool, a catalog, another semantic layer, or an AI agent — without re-authoring the definition. The consume step closes the loop: the downstream tool reads the document, understands what `net_revenue` means, and executes it with its own engine. Author once, consume anywhere is the pattern the standard was built for.

Two honesty notes. The converter is a reference implementation: a CLI tool that proves the mapping and validates the spec, not a product-grade "Export as OSI" button in dbt Cloud. And no product ships native OSI import or export yet — as of August 2026 the converter path is the only working route, a status we track in the [semantic layer tools list](/blog/semantic-layer-tools-list-osi). The gap is closing, but teams should plan for the current reality.

Viewed this way, MetricFlow and OSI never compete; the converter is the joint, and the joint is why the ecosystem treats them as one stack. For the equivalent comparison against other authoring tools, see our [OSI vs Cube](/blog/osi-vs-cube) and [OSI vs LookML](/blog/osi-vs-lookml) analyses.

## 6. When to use which — and when to use both

The decision framework is simpler than the vocabulary. Ask one question: where does your semantic definition need to travel? The answer selects the layer.

Choose MetricFlow first when the definition does not need to leave the dbt world — when you are a dbt shop, the metrics are certified KPIs, and the consumers are BI tools and agents that can speak the Semantic Layer API. MetricFlow is the most widely adopted open-source metric layer available, and Git-based governance is the strongest control mechanism the industry has built for metrics. If portability never comes up, this is the default choice.

Choose OSI when portability is the requirement rather than the nice-to-have: definitions authored in one tool must be consumed by a second tool, or by an agent running outside your stack, or by a partner who does not share your platform. OSI is the interchange layer that makes that hand-off possible today through converters, and it will get cheaper as native support ships.

Choose both when you want execution and portability, which is the position the standard's own design points to. Author and govern in MetricFlow, export through the converter for any consumer that needs a portable copy, and let each consumer use its own engine. This is the direction the whole working group is pushing, because no vendor-neutral standard has ever succeeded by replacing the tools that already work.

The common mistake is treating the choice as exclusive. They are not alternatives; they are layers that compose, and teams that pick one at the expense of the other tend to discover the missing layer six months later — when a definition needs to travel and cannot, or when a portable definition needs to execute and nothing will run it.

## 7. Why the distinction matters for AI agents

AI agents are the reason this comparison stopped being academic. Text-to-SQL systems, chat BI interfaces, and data copilots are being deployed against production warehouses, and the benchmark evidence says the hard part is not generating SQL — it is knowing what the SQL should mean. On the <a href="https://spider2-sql.github.io/" rel="nofollow noopener">Spider 2.0 benchmark</a>, built from real enterprise workflows on BigQuery and Snowflake, GPT-4o solves 10.1% of tasks and o1-preview 17.1%, versus 86.6% on the academic Spider 1.0 set — a collapse that tracks the ambiguity of real schemas, not the quality of the model.

MetricFlow and OSI attack that ambiguity from two sides, and this is where the layers finally feel different in practice. MetricFlow gives an agent an execution surface: it can call the Semantic Layer API, ask for `net_revenue by region`, and receive results computed from a governed definition. OSI gives an agent a definition surface: a machine-readable document that states what `net_revenue` means, which datasets it comes from, and what context interprets it — parseable by any agent in any environment, not only agents wired into dbt.

Together they cover the two dominant text-to-SQL failure modes. MetricFlow prevents mis-execution: wrong joins and wrong grain get caught at plan time. OSI prevents mis-recognition: if a definition is portable, an agent can load it instead of guessing from column names. In both cases the accuracy gain comes from the structure around the model — the same reason [data engineering agents](/blog/what-is-data-engineering-agent) treat semantic context as their primary input.

Neither layer, on its own, keeps semantics current — which is the gap data engineering agents fill. A data engineering agent such as Datus generates MetricFlow-compatible semantic models and metric candidates from live schema and validated query history (`/gen_semantic_model`, `/gen_metrics`), and maintains provisional context — deprecation notes, edge-case filters, validated ad-hoc SQL — that has not been promoted to formal definitions. When a candidate accumulates enough validation, it can be promoted to a governed MetricFlow definition and, from there, exported through the converter into the OSI ecosystem. It is the same create-validate-promote pattern any review-gated system needs, applied to semantics.

The distinction in this article is therefore not glossary trivia. It determines where accuracy infrastructure lives: OSI decides whether a definition can reach an agent at all; MetricFlow decides whether, once reached, it executes correctly. Teams that can name which layer does which job are the ones whose agents end up both portable and correct.

## 8. Common misconceptions

Five misconceptions come up so often they deserve their own section. Each mistakes one layer for the whole stack.

- **"OSI is a semantic layer product."** It is a format. You cannot query it, it executes nothing, and you still need a semantic layer such as MetricFlow to author and serve definitions.
- **"MetricFlow and OSI are competitors."** They are layers of the same stack, joined by a merged converter; dbt Labs participates in the OSI working group precisely because interoperability strengthens MetricFlow's position.
- **"Open-sourcing MetricFlow means dbt owns OSI."** OSI is vendor-neutral — led by Snowflake with more than 50 participating organizations. dbt Labs is an influential participant, not the owner.
- **"A merged converter means native support."** A reference converter is a CLI proof of the mapping; native import/export is a product feature no vendor has shipped yet as of August 2026.
- **"OSI will make authoring languages obsolete."** The spec is an interchange format, not an authoring language; MetricFlow YAML and other semantic model formats remain the tools people write semantics in.

The pattern behind all five is the same: each misconception collapses two layers into one. OSI and MetricFlow were designed to be consumed together, and the vocabulary is more dangerous than the technology. Teams that keep the layers separate in their heads make better architecture decisions than teams that merge them.

## Conclusion

The semantic layer industry spent 2025 proving that metrics are infrastructure, and it is spending 2026 proving that infrastructure should be portable. dbt MetricFlow and OSI (Apache Ossie) are the two halves of that argument: one is the most widely adopted open-source engine for defining and executing metrics; the other is a vendor-neutral format for moving those definitions anywhere. They are not competitors. The converter that joins them — author in MetricFlow, interchange via OSI, consume anywhere — is already merged, and native support is the direction every working group signatory is moving. For AI agents the stakes are concrete: portable definitions determine whether an agent can see a metric at all, and governed execution determines whether it computes the right number. Teams that adopt the two-layer model now are not betting on a specific vendor; they are betting that definitions should be infrastructure, which is the safest bet in the stack. Start by auditing which of your metrics are governed, which are portable, and which are neither — the gaps will name themselves.

## Frequently asked questions

### What is the difference between OSI and dbt MetricFlow?

OSI (Apache Ossie) is a vendor-neutral interchange format for semantic definitions — metrics, dimensions, datasets, and relationships — expressed in YAML/JSON. dbt MetricFlow is an open-source metric layer that executes definitions: it consumes semantic models, builds a semantic graph, and generates warehouse-specific SQL. In short, OSI defines what a metric means so any tool can read it; MetricFlow computes it so any consumer gets the right number. See §4 for the dimension-by-dimension comparison.

### Does OSI replace dbt MetricFlow or the dbt Semantic Layer?

No. OSI is an interchange format, not an authoring or execution tool. You still need a semantic layer to author, govern, and serve metrics — MetricFlow, Cube, or LookML. OSI makes the output of those tools portable, so definitions authored in MetricFlow can be consumed by tools that do not read MetricFlow YAML. The dbt (MetricFlow) to OSI converter in the Apache Ossie repository is exactly that bridge.

### Is the dbt MetricFlow to OSI converter production-ready?

Not yet, in the strict sense. The converter is a reference implementation — a CLI tool merged in the Apache Ossie repository that proves the mapping and validates the specification. It is not a user-facing "Export as OSI" feature in dbt Cloud, and no vendor ships native OSI import or export as of August 2026. The converter is the working path today; product-grade support is expected to follow as the standard matures.

### Can I use OSI without dbt?

Yes. OSI is vendor-neutral and does not require dbt anywhere in the stack. The spec is developed in the open under the Apache Incubator, and reference converters exist for GoodData, Salesforce, and Apache Polaris alongside the dbt converter. What OSI cannot do on its own is execute — you pair it with whatever semantic layer or engine you already use.

### Why does the OSI vs MetricFlow distinction matter for AI agents?

Because the two layers prevent different classes of agent error. MetricFlow prevents mis-execution: it validates joins and grain at plan time, so a queried metric is computed correctly. OSI prevents mis-recognition: a portable, machine-readable definition lets an agent understand a metric it has never seen instead of guessing from column names. On Spider 2.0, frontier models fall to roughly 10–17% accuracy on real enterprise SQL workflows; grounding agents in governed semantic context is the primary known lever for closing that gap.
