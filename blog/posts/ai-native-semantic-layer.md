---
title: "What Makes a Semantic Layer AI-Native? 6 Requirements"
description: "An AI-native semantic layer is an open spec plus a deterministic runtime plus agent-native tools. Six requirements, from compile latency to bounded attribution."
author: "Harrison Zhao"
date: 2026-09-07
lastmod: 2026-09-07
head:
  - - meta
    - name: keywords
      content: "AI-native semantic layer, semantic layer for AI agents, Apache Ossie, OSI spec, semantic layer runtime, parameterized metrics, metric attribution, structured errors, MetricFlow, Dosi"
  - - meta
    - property: og:title
      content: "What Makes a Semantic Layer AI-Native? 6 Requirements"
  - - meta
    - property: og:description
      content: "An AI-native semantic layer is an open spec plus a deterministic runtime plus agent-native tools. Six requirements, from compile latency to bounded attribution."
  - - meta
    - property: og:type
      content: article
  - - meta
    - property: og:url
      content: https://datus.ai/blog/ai-native-semantic-layer/
  - - meta
    - property: og:image
      content: https://datus.ai/images/ai-native-semantic-layer/osi-model-compile-and-serve.png
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - link
    - rel: canonical
      href: https://datus.ai/blog/ai-native-semantic-layer/
---

# What Makes a Semantic Layer AI-Native? 6 Requirements

## TL;DR

- An **AI-native semantic layer** is three things at once: an **open semantic spec**, a **deterministic planner/compiler/runtime**, and an **agent-native tool interface**. A spec alone is portable but inert.
- When the consumer changes from a dashboard to an agent, the semantic layer moves from the query path into the **reasoning loop** — it gets called tens of times per answer, so compile latency stops being a rounding error.
- A metric catalog with thousands of entries is usually a symptom, not an asset. **Parameterized, composable metrics** beat materializing every window and slice as its own definition.
- **Retrieval does not belong inside the semantic layer.** `list metrics` → inspect dimensions → `query metrics` is progressive disclosure that agents already handle well; how to organize context is the agent layer's job.
- Two tool-design details decide whether an agent can actually use the layer: **structured errors** instead of stack traces, and **attribution with a bounded contract** instead of an open-ended "why" answer.
- Valid YAML is not a good metric system. Which metrics matter, and how the model is shaped, still needs **human taste**.

![One semantic model, compiled down to many SQL dialects and served through one contract to CLIs, APIs, and agents](/images/ai-native-semantic-layer/osi-model-compile-and-serve.png)

*One Apache Ossie model, compiled for different databases and exposed to applications and agents through a single contract. (The diagram's dialect count is a snapshot from when it was drawn; the current connector list is larger.)*

**An AI-native semantic layer** is a semantic layer designed for a consumer that queries it programmatically, repeatedly, and unsupervised — an agent — rather than for a human reading a dashboard. That change of consumer is not cosmetic. It changes which properties are load-bearing: latency, determinism, composability, and error shape all move from "nice to have" to "the reason it works or doesn't."

This article defines the term, then walks the six requirements a semantic layer has to satisfy before an agent can rely on it. It is written from the experience of shipping a [semantic layer](/blog/what-is-semantic-layer) inside a [data engineering agent](/blog/what-is-data-engineering-agent-2026) — first on <a href="https://github.com/dbt-labs/metricflow" rel="nofollow noopener">MetricFlow</a>, then on a purpose-built engine — so the failure modes below are the ones that actually showed up in customer environments, not a feature wish list.

> A version of this article was first published on <a href="https://medium.com/@linux.hust/what-makes-a-semantic-layer-truly-ai-native-cc3a8939305e" rel="nofollow noopener">Medium</a>. This edition is expanded, and the figures have been re-checked against the current documentation.

## 1. The spec is not the runtime

First, a definition that avoids a common conflation. By **semantic layer** we mean a system like MetricFlow or <a href="https://cube.dev/product/ai-context-layer" rel="nofollow noopener">Cube</a>: it starts with a spec that defines metrics, and a planner or compiler that turns those definitions into SQL. It can be completely headless, exposed through a CLI or an API — and in the AI era, through <a href="https://modelcontextprotocol.io/" rel="nofollow noopener">MCP</a> tools.

A **metrics platform** is a different product: a web application for configuring, managing, querying, and visualizing metrics, with its metric specification hidden inside the product. The distinction matters because the hidden-spec model is exactly what agents cannot work with.

The need for an open spec became obvious in 2025. <a href="https://docs.snowflake.com/en/user-guide/views-semantic/overview" rel="nofollow noopener">Snowflake Semantic Views</a> and <a href="https://docs.databricks.com/aws/en/uc-semantics/metric-views" rel="nofollow noopener">Databricks metric views</a> brought semantics directly into their platforms, while <a href="https://www.tableau.com/products/tableau-next" rel="nofollow noopener">Tableau Next</a> rebuilt Tableau's semantic capabilities. Everyone agreed semantics mattered, and metric definitions were becoming isolated again. In September 2025, Snowflake, dbt, and Salesforce proposed **Open Semantic Interchange (OSI)** as a common specification; the project was later donated to the Apache Software Foundation and became <a href="https://github.com/apache/ossie" rel="nofollow noopener">Apache Ossie</a>.

An open standard is necessary. It is not sufficient. Today the Ossie project is mainly a YAML specification with Python conversion scripts. If you move a metric definition into another YAML file and drop that file into an LLM prompt, the fundamental problem is untouched: **the definition is portable, but it is not executable.**

A useful semantic layer needs both halves:

| | Spec (interchange) | Runtime (execution) |
|---|---|---|
| **Answers** | What does `net_revenue` mean? | What SQL computes it on *this* warehouse? |
| **Artifact** | A YAML file | A planner, compiler, and executor |
| **Fails by** | Being ignored | Being wrong, slow, or non-deterministic |
| **Portability** | Across vendors | Across dialects and engines |
| **Who consumes it** | Humans, converters, catalogs | Applications, BI, agents |

The spec defines business semantics. The runtime validates the model, plans the query, compiles the DSL into the correct SQL dialect, and keeps results consistent across engines. It also needs a clean interface that different agents can call repeatedly and reliably. We have argued this split at length in [Why OSI needs an execution engine](/blog/why-osi-needs-execution-engine); this is the same boundary seen from the requirements side.

> **AI-native semantic layer = open semantic spec + deterministic planner/compiler/runtime + agent-native tool interface**

## 2. Performance matters once the layer is inside the reasoning loop

For a traditional semantic-layer service, the difference between two seconds and 20 milliseconds may not matter much. A conversational BI user asks a question, the service compiles one query, and most of the waiting time is elsewhere.

An agent works differently. Once the semantic layer enters the reasoning loop, a single answer may involve listing metrics, inspecting dimensions, compiling several queries, drilling down, running attribution, and checking intermediate results.

![From the BI era to the agent era: a one-time query against a fixed metric definition versus a semantic layer called repeatedly inside an agent's reasoning loop](/images/ai-native-semantic-layer/bi-era-vs-agent-era-semantic-layer.png)

Ontology use cases make this sharper. A metric system may have ten core metrics, each with dozens of related dimensions. When an [ontology](/blog/what-is-ontology)-driven agent uses that system for deeper exploration, query frequency is much higher than in a normal conversational BI session, and the translation cost becomes part of every reasoning step.

Meanwhile databases have moved into the sub-second era. Snowflake, Databricks, StarRocks, ClickHouse, and Trino keep pushing their limits, and plenty of teams analyze directly on PostgreSQL or Oracle. If the database returns in 50 ms but the Python planner spends two seconds compiling the query, the semantic layer *is* the bottleneck.

That is why we rewrote the engine in <a href="https://rust-lang.org/" rel="nofollow noopener">Rust</a> as **Dosi**. Against MetricFlow on the same seeded DuckDB database, the <a href="https://dosi.datus.ai/benchmarks/" rel="nofollow noopener">published benchmark</a> reports:

| Path | Dosi vs MetricFlow | Note |
|---|---|---|
| CLI cold start (spawn → SQL compiled) | **220–237x** | 10.6 ms vs 2,321.9 ms on one case |
| Warm / in-process compile | **10–22x** | MetricFlow's interpreter and model already resident |
| End-to-end (compile + run + print) | **66–73x** cold vs cold | Dosi cold is still 3–7x faster than MetricFlow warm |
| Peak RSS on compile | ~15.5 MB vs ~157 MB | |

Read those as ratios, not absolute times, and read the caveats: the fixture is MetricFlow's `simple_model` (~25 datasets/metrics), the measured MetricFlow path skips the real `mf` CLI's startup, and the numbers come from a single shared EC2 box. Most of the cold-start gap is Python process cost — roughly 1.9 s of fixed overhead per CLI invocation, about 1,004 ms of it imports.

Performance is no longer optional. It is also not the main reason to build a new engine — the next four requirements are.

## 3. Fewer metrics, composed better

Here is an unpopular opinion: if a company says it has thousands or tens of thousands of metrics, its metric system probably needs a refactor.

Large metric counts are usually a symptom that dimensions, time windows, and other parameters have been **materialized as separate metrics**. Seven-day retention becomes one metric, 14-day another, 30-day a third. Revenue for the last seven days and the last 30 days become two more. Multiply by country, channel, and product line, and the catalog is in the thousands.

That was reasonable in the BI era. Dashboards were static or only partly configurable, so each report needed a fixed definition every BI tool could reuse. But each fixed definition also bounds what an agent can explore. A Cube user once told us they had defined 7-day and 30-day retention, and when someone asked for retention *in March*, the metric system could not express it. They fell back to letting the model write raw SQL — which is exactly the grounding you were trying to avoid.

![A good metric system is a compact DAG, not a giant list: retention_7d/14d/30d as separate entries versus one parameterized retention(N) metric composed from active_users and cohort_users](/images/ai-native-semantic-layer/compact-metric-dag-vs-metric-list.png)

A business should organize its metric system around a small number of North Star metrics and the supporting metrics that explain them. N-day retention should be one <a href="https://dosi.datus.ai/parameterized-metrics/" rel="nofollow noopener">parameterized metric</a>, not three definitions named `retention_7d`, `retention_14d`, and `retention_30d`. A good metric system is a **compact DAG** — derived metrics, composed metrics, parameterized metrics — not a long list.

The practical test: can an agent answer a question nobody pre-registered? If the only way to get "retention in March" is a hand-written query, the metric layer has stopped being the source of truth for that question.

### No RAG inside the semantic layer

A well-designed metric system on a good semantic layer already gives you progressive disclosure. If a company can reduce thousands of metrics to dozens, an agent can call `list metrics`, then inspect the relevant dimensions, then call `query metrics`. That is a more natural structure for an LLM than tuning a [RAG](/blog/rag-data-engineering) pipeline to search across thousands of tables and metric definitions.

This is not an argument that retrieval has no value. The agent layer can still organize semantic models as a tree or a graph, or use hybrid search when the catalog is genuinely large. But **retrieval should not be hard-coded into the semantic layer**. Different agents need different ways to organize context; the semantic layer should focus on definitions, planning, execution, and correctness.

## 4. Structured errors, not stack traces

As models get stronger, the question stops being whether they *can* call a semantic layer. It becomes whether the semantic layer gives them a good tool.

With MetricFlow, a failed tool call would often return a large Python stack trace. Strip the stack trace and very little actionable information was left. That pollutes the function-call output and burns context for nothing.

Across validation, planning, compilation, and querying, a semantic layer should return a **stable error code, a short explanation, and a useful next step**. That is why <a href="https://dosi.datus.ai/errors/" rel="nofollow noopener">structured errors</a> are a base rule in Dosi rather than a later refinement. It sounds simple; plenty of mature products still do it badly. Having worked on databases, I can say it is harder than it looks — and the agent interaction becomes dramatically cleaner once it is done properly. The same property is what lets an agent self-correct instead of retrying blindly, which we cover in [Dosi MCP semantic layer for agents](/blog/dosi-mcp-semantic-layer-for-agents).

## 5. Attribution needs a bounded contract

Ask a model *why* a metric changed and two runs may explore different directions and produce opposite explanations. The fix is not a better prompt; it is a tool with a clear boundary.

For dimension attribution — the `term_wise` strategy in Dosi — the tool checks only the dimensions that support drill-down and finds the dimension values contributing most to the delta. It does not blindly scan every dimension. For a ratio metric, the decomposition splits the change into a **mix effect** and a **rate effect** (`mix_shift`), so "average order value fell" separates into "the mix of segments shifted" versus "the rate within segments fell." Every decomposition <a href="https://dosi.datus.ai/attribution/" rel="nofollow noopener">reconciles against the totals</a>, which is what makes the answer checkable rather than improvised.

Window-derived metrics and other arithmetic expressions need their own deterministic methods. Causal inference, A/B testing, feature extraction from an ontology graph, and regression modeling are different problems — they belong *above* the attribution tool, not inside it.

So: **attribution means contribution analysis, not a universal answer to every "why" question.** Deterministic calculation goes to tools; uncertain exploration stays with the model. The model may still find something unexpected, and that is fine — the exploration should just start from a stable metric DAG and trusted numbers.

## 6. Good metrics still need human taste

This is the lesson from customer deployments that no engine solves. With a good semantic layer, an agent can help write valid, consistent, executable Ossie YAML. The old workflow — open a web page, fill in ten fields, configure one metric — already feels outdated.

But valid YAML does not make a good metric system. Which metrics actually guide the business? Should the semantic model use a star schema or a snowflake schema? How many tables belong in one model? An agent and a semantic layer can remove most of the SQL and YAML labor, and they cannot yet replace human judgment on those questions. That is especially true for BI systems that have grown inside a company for years and carry a lot of historical context.

## 7. The requirements as a checklist

![Core capabilities of an AI-native semantic layer: high-performance engine, open standard, composable metrics, agent-native interfaces, attribution tools, structured errors, multi-dialect support, progressive disclosure](/images/ai-native-semantic-layer/ai-native-semantic-layer-capabilities.png)

Evaluating a semantic layer for agent use? Work through these:

1. **Open spec.** Are the definitions in a portable, inspectable format you can move between vendors — or hidden inside a product?
2. **Real runtime.** Does something validate the model and compile it to correct SQL per dialect, or is the YAML just prompt context? Dosi currently compiles to <a href="https://dosi.datus.ai/connectors/" rel="nofollow noopener">16 warehouse dialects</a> with executors (Redshift compiles but has no executor yet).
3. **Compile latency.** Time one compile, then multiply by the number of tool calls a single agent answer makes. Is the total acceptable inside a reasoning loop?
4. **Composability.** Can you express "retention over N days" once, or does every N need its own metric? Count your metrics — and ask whether the count reflects the business or the tooling.
5. **Tool ergonomics.** Do failures come back as structured codes with a next step, or as stack traces? Does the layer expose `list` / `describe` / `compile` / `run` so an agent can discover before it queries?
6. **Bounded determinism.** Is attribution a documented decomposition that reconciles to the total, or a model improvising from a few query results?
7. **Human ownership.** Who decides which metrics matter, and is the model shaped for the business rather than for whatever the generator emitted?

## Conclusion

The semantic layer used to be one service in the query path. In the agent era it is part of the reasoning loop, and that single change is what makes "AI-native" a real engineering requirement instead of a label. An open spec makes definitions portable; a deterministic runtime makes them executable; an agent-native tool interface makes them usable — and a compact, composable metric DAG is what keeps the whole thing explorable.

Apache Ossie has recently added an <a href="https://github.com/apache/ossie/blob/main/ontology/ontology.md" rel="nofollow noopener">ontology specification draft</a> at version `0.2.0.dev0`, introducing business concepts, relationships, rules, and mappings from logical models into an ontology. That is an important direction, because an [ontology](/blog/semantic-layer-vs-ontology) needs the semantic layer as trusted infrastructure — not just as extra context for the model. We are following the draft closely and have started applying it in customer scenarios, and will release related Dosi capabilities as both the specification and our implementation mature.

For teams working through this problem, POCs for <a href="https://studio.datus.ai/overview" rel="nofollow noopener">Datus Studio</a> — an AI-native data development platform built on Datus Agent and Dosi — are open.

## Frequently asked questions

### What does "AI-native semantic layer" actually mean?

It means the layer is designed for an agent as its primary consumer rather than a dashboard. Concretely: definitions live in an open spec; a deterministic runtime compiles them to dialect-correct SQL; the interface is agent-native (MCP or an API with discovery calls); errors are structured; metrics are composable rather than pre-materialized; and deterministic analyses like attribution are engine features with a bounded contract. A layer that only exports YAML for a prompt is not AI-native, however good the YAML is.

### Isn't Apache Ossie enough on its own?

Ossie solves interchange, which is the harder political problem and a real prerequisite. It does not solve execution. As of this writing the project is mainly a YAML specification plus Python conversion scripts, so a definition can travel between vendors but nothing in the spec guarantees a correct `DATE_TRUNC` on your warehouse. You still need a runtime that validates, plans, compiles, and executes — see [Why OSI needs an execution engine](/blog/why-osi-needs-execution-engine).

### Do I really need a fast semantic layer, or is that a micro-optimization?

It depends entirely on the consumer. For a human-driven dashboard, a two-second compile disappears into page load. For an agent that makes ten or more tool calls to answer one question, and for ontology-style exploration where call frequency is higher still, compile cost multiplies through every reasoning step. Time one compile, multiply by your observed tool-call count, and decide from that number rather than from a general principle.

### How can having fewer metrics be better?

Because most large catalogs got large by materializing parameters. `retention_7d`, `retention_14d`, and `retention_30d` are one metric with one parameter, stored as three. The cost is not storage; it is expressiveness — nobody registered "retention in March", so the agent cannot ask for it and falls back to raw SQL. A compact DAG of parameterized, derived, and composed metrics covers more questions with fewer definitions, and it stays reviewable by humans.

### Should the semantic layer do retrieval over metric definitions?

No. Progressive disclosure through `list metrics` → inspect dimensions → `query metrics` handles a well-sized catalog without embeddings, and it keeps the layer deterministic. Retrieval, trees, graphs, and hybrid search are legitimate — they just belong in the agent layer, which knows how that particular agent organizes context. Hard-coding one retrieval strategy into the semantic layer forces every consumer to accept it.

### Is Dosi open source?

No. Apache Ossie, the spec Dosi implements, is Apache-2.0 and open. Dosi itself is source-available under the Elastic License 2.0, and [Datus Agent](/blog/what-is-data-engineering-agent-2026) is Apache-2.0. Worth being precise about, because "open standard" and "open source engine" are different claims.

## Related articles

- [Why OSI Needs an Execution Engine — Interchange vs Runtime](/blog/why-osi-needs-execution-engine/) — the spec/runtime split argued in full
- [Introducing Dosi: OSI-Native Semantic Layer for Metrics](/blog/introducing-dosi/) — what the engine compiles and how you call it
- [Apache Ossie + Dosi: 10-Minute Semantic Layer Quickstart](/blog/apache-ossie-dosi-quickstart/) — the runnable version of this article
- [Dosi vs MetricFlow: OSI-Native vs dbt-Centric Runtime](/blog/dosi-vs-metricflow/) — choosing a runtime for the same OSI model
- [What Is a Semantic Layer?](/blog/what-is-semantic-layer/) — the foundational definition
- [Why AI Agents Need Semantic Context to Work Reliably](/blog/why-ai-agents-need-semantic-context-to-work-reliably/) — the grounding argument
