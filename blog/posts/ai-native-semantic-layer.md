---
title: "What Makes a Semantic Layer Truly AI-Native?"
description: "Why we built Dosi: an AI-native semantic layer is an open spec plus a deterministic planner, compiler and runtime, plus an agent-native tool interface."
author: "Harrison Zhao"
date: 2026-09-07
tags: insight
lastmod: 2026-09-07
head:
  - - meta
    - name: keywords
      content: "AI-native semantic layer, semantic layer for AI agents, Apache Ossie, OSI spec, semantic layer runtime, parameterized metrics, TermWise attribution, structured errors, MetricFlow, Dosi"
  - - meta
    - property: og:title
      content: "What Makes a Semantic Layer Truly AI-Native?"
  - - meta
    - property: og:description
      content: "Why we built Dosi: an AI-native semantic layer is an open spec plus a deterministic planner, compiler and runtime, plus an agent-native tool interface."
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

# What Makes a Semantic Layer Truly AI-Native?

*— Why we built Dosi*

## TL;DR

This is what we believe an AI-first semantic layer should provide:

- It is a **SQL planner for business semantics**, not just YAML used as prompt context.
- When the consumer changes from BI to Agents, the semantic layer **enters the reasoning loop**, so compilation performance matters.
- The **open spec** defines semantics, while the **runtime** validates models and produces correct SQL across databases.
- **Deterministic** metric computation and attribution belong in tools. Open-ended exploration belongs in the model.
- A metric system should have **fewer, more composable metrics** instead of more fixed definitions.

![One Apache Ossie model compiled and pushed down to many SQL dialects on one side, and served through CLI, REST API, Arrow IPC and an MCP server on the other](/images/ai-native-semantic-layer/osi-model-compile-and-serve.png)

*One Apache Ossie model, compiled for different databases and exposed to applications and agents through a single contract.*

> A version of this article was first published on <a href="https://medium.com/@linux.hust/what-makes-a-semantic-layer-truly-ai-native-cc3a8939305e" rel="nofollow noopener">Medium</a>.

## The Semantic Layer Needs a Runtime, Not Just a Spec

From day one of building <a href="https://github.com/Datus-ai/Datus-agent" rel="nofollow noopener">Datus agent</a>, we have treated the [semantic layer](/blog/what-is-semantic-layer/) as one of the most important sources of context for a [Data agent](/blog/what-is-data-agent/). Last year, we chose <a href="https://github.com/dbt-labs/metricflow" rel="nofollow noopener">MetricFlow</a> as the default semantic layer for Datus agent. After a year of using it and optimizing it in real customer environments, we have a much clearer view of what an AI-native semantic layer should be.

One clarification first. By semantic layer, I mean a system such as MetricFlow or <a href="https://cube.dev/product/ai-context-layer" rel="nofollow noopener">Cube</a>. A metrics platform is usually a web application for configuring, managing, querying, and visualizing metrics, with its metric specification hidden inside the product. A semantic layer can be completely headless. It starts with a spec that defines metrics and a planner or compiler that translates those definitions into SQL. It can be exposed through a CLI or API, and in the AI era, it should also provide <a href="https://modelcontextprotocol.io/" rel="nofollow noopener">MCP</a> tools.

The need for an open spec became obvious in 2025. <a href="https://docs.snowflake.com/en/user-guide/views-semantic/overview" rel="nofollow noopener">Snowflake Semantic Views</a> and <a href="https://docs.databricks.com/aws/en/uc-semantics/metric-views" rel="nofollow noopener">Databricks metric views</a> brought semantics directly into their platforms, while <a href="https://www.tableau.com/products/tableau-next" rel="nofollow noopener">Tableau Next</a> rebuilt Tableau's semantic capabilities. Everyone agreed that semantics mattered, but metric definitions were becoming isolated again. In September 2025, Snowflake, dbt, and Salesforce proposed [Open Semantic Interchange (OSI)](/blog/open-semantic-interchange-osi/) as a common specification. The project was later donated to Apache and became <a href="https://github.com/apache/ossie" rel="nofollow noopener">Apache Ossie</a>.

Apache Ossie is an important step because a semantic layer needs an open standard. But today the project is still mainly a YAML specification with Python conversion scripts. If we only move a metric definition into another YAML file and put that file into an LLM prompt, the fundamental problem is not solved. The definition is portable, but it is not yet executable.

A useful semantic layer needs both parts. The spec defines business semantics, while the runtime validates the model, plans the query, compiles the DSL into the correct SQL dialect, and keeps the result consistent across engines. It also needs a clean interface that different Data agents can call repeatedly and reliably.

This is where <a href="https://dosi.datus.ai/" rel="nofollow noopener">Dosi</a> fits. [Dosi](/blog/introducing-dosi/) is an execution engine for Apache Ossie. It handles the detailed differences between SQL dialects and compiles the same Ossie model into database-specific SQL. It currently supports <a href="https://dosi.datus.ai/connectors/" rel="nofollow noopener">16 SQL dialects</a>, an <a href="https://dosi.datus.ai/arrow/" rel="nofollow noopener">Arrow-native API</a>, and a general <a href="https://dosi.datus.ai/mcp/" rel="nofollow noopener">MCP service</a> for different agent ecosystems.

**AI-native semantic layer = open semantic spec + deterministic planner/compiler/runtime + agent-native tool interface**

## Why Performance Matters

We made many changes to MetricFlow over the past year. We removed its tight dependency on dbt, added more complex joins, and expanded its metric expressions. This year, however, we ran into a clear performance limit.

For a traditional semantic-layer service, the difference between two seconds and 20 milliseconds may not matter much. A conversational BI user asks a question, the service compiles one query, and most of the waiting time is elsewhere. An agent works differently. Once the semantic layer enters the reasoning loop, the agent may list metrics, inspect dimensions, compile several queries, drill down, run attribution, and check intermediate results before it gives one answer.

Ontology use cases make this even more obvious. A metric system may have ten core metrics, each with dozens of related dimensions. When an [ontology](/blog/what-is-ontology/) agent uses that system for deeper exploration, the query frequency is much higher than in a normal conversational BI session. MetricFlow's translation cost then becomes part of every reasoning step.

At the same time, databases are already moving into the sub-second era. Snowflake, Databricks, StarRocks, ClickHouse, and Trino continue to push their performance limits, while many customers analyze directly on PostgreSQL or Oracle. If the database returns quickly but the Python planner spends two seconds compiling the query, the semantic layer becomes the bottleneck.

So we rewrote the engine in <a href="https://rust-lang.org/" rel="nofollow noopener">Rust</a>. In our <a href="https://dosi.datus.ai/benchmarks/" rel="nofollow noopener">latest benchmark</a>, the CLI cold start is close to 200 times faster, largely because Python import time is expensive. Even when both engines run as long-lived services, Dosi is still around 10 to 20 times faster.

In the BI era, the semantic layer was one service in the query path. In the agent era, it is part of the reasoning loop. Performance is no longer optional, although performance is not the main reason we built Dosi.

![From the BI and ChatBI era — a one-time query against a fixed metric definition — to the agent era, where the semantic layer is called repeatedly inside a six-step reasoning loop](/images/ai-native-semantic-layer/bi-era-vs-agent-era-semantic-layer.png)

## We Don't Need Thousands of Metrics

Here is one opinion that may not be popular: if a company says it has thousands or tens of thousands of metrics, its metric system probably needs a refactor.

Thousands of metric definitions are often a symptom that dimensions, time windows, and other parameters have been materialized as separate metrics. Seven-day retention becomes one metric, 14-day retention another, and 30-day retention a third. Revenue for the last seven days and the last 30 days become two more. Multiply these definitions by country, channel, and product line, and the metric catalog quickly grows into the thousands.

This was a common practice in the traditional BI era. Dashboards were static or only partly configurable, so each report needed a fixed definition that every BI tool could reuse. But every fixed definition also limits what an agent can explore. A Cube user once told us that they had defined 7-day and 30-day retention, but when someone asked for retention in March, the metric system could not express it. They had to fall back to letting the model write raw SQL.

A business should organize its metric system around a small number of North Star metrics and the supporting metrics that explain them. In the AI era, N-day retention should be one <a href="https://dosi.datus.ai/parameterized-metrics/" rel="nofollow noopener">parameterized metric</a>, not three separate definitions named `retention_7d`, `retention_14d`, and `retention_30d`. A good metric system should be a compact DAG (with derived metrics, compose metrics, parameterized metrics), not a long list.

![A good metric system is a compact DAG, not a giant list: retention_7d, retention_14d and retention_30d as separate entries versus one parameterized retention(N) composed from active_users and cohort_users](/images/ai-native-semantic-layer/compact-metric-dag-vs-metric-list.png)

### No RAG inside the Semantic Layer

A better semantic layer and a well-designed metric system already provide progressive disclosure. If a company can reduce thousands of metrics to dozens, an agent can first call `list metrics`, then inspect the relevant dimensions, and finally call `query metrics`. This is a more natural structure for AI than tuning a [RAG](/blog/rag-data-engineering/) system to search across thousands of tables and metric definitions.

This does not mean RAG has no value. The agent layer can still organize semantic models as a tree or graph, or use hybrid search when the catalog is large. But retrieval should not be hard-coded into the semantic layer. Different Agents need different ways to organize context, while the semantic layer should focus on definitions, planning, execution, and correctness.

This is the second goal of Dosi: increase the expressive power of the semantic layer so the metric system itself can stay small, composable, and trustworthy, then give the ontology and agent layers stable data to work with.

### Structured Errors and Clear Attribution Boundaries

As models become stronger, the question is no longer only whether they can call a semantic layer. The question is whether the semantic layer gives them a good tool.

With MetricFlow, we often saw a failed tool call return a huge Python stack trace. If we removed the stack trace, very little useful information remained. This polluted the function-call output and wasted context. During validation, planning, compilation, and querying, a semantic layer should return a stable error code, a short explanation, and a useful next step. We therefore made <a href="https://dosi.datus.ai/errors/" rel="nofollow noopener">structured errors</a> a basic rule in Dosi. It sounds simple, but many mature products still do it badly. Having worked on databases extensively, I know it is harder than it looks, but the agent interaction becomes much cleaner once it is done properly.

**Attribution** needs the same discipline. If you ask a model why a metric changed, two runs may explore different directions and produce opposite explanations. The boundary of the attribution tool must be clear. For dimension attribution, which we call <a href="https://dosi.datus.ai/attribution/" rel="nofollow noopener">TermWise Attribution</a>, the tool checks only the dimensions that support drill-down and finds the dimension values with the largest contribution to the delta. It does not blindly scan every dimension.

For a ratio metric, LMDI can decompose how changes in the numerator and denominator contributed to the final result. Other arithmetic expressions and window-derived metrics need their own deterministic methods. Causal inference, A/B testing, feature extraction from an ontology graph, and regression modeling are different problems. They belong above the attribution tool.

Attribution here means contribution analysis, not a universal answer to every why question. Deterministic calculations should go to tools, while uncertain exploration should stay with the model. The model may still find something unexpected, but the exploration should start from a stable metric DAG and trusted results.

## Beyond Correctness, Good Metrics Still Need Human Taste

This is another lesson from customer deployments. With a good semantic layer, an agent can help write valid, consistent, and executable Ossie YAML. The old workflow of opening a web page and filling in ten fields to configure one metric already feels outdated. But valid YAML does not automatically create a good metric system.

Which metrics actually guide the business? Should the semantic model use a star schema or a snowflake schema? How many tables should be included in one model? The agent and semantic layer can reduce the work of writing SQL and YAML, but they cannot yet replace human taste in these decisions. This is especially true for BI systems that have grown inside a company for many years and carry a lot of historical context.

For teams working through this problem, we are opening POCs for <a href="https://studio.datus.ai/overview" rel="nofollow noopener">Datus Studio</a>, an AI-native data development platform built on Datus Agent and Dosi.

## Summary and the future

This is what we believe an AI-first semantic layer should provide:

- It is a SQL planner for business semantics, not just YAML used as prompt context.
- When the consumer changes from BI to Agents, the semantic layer enters the reasoning loop, so compilation performance matters.
- The open spec defines semantics, while the runtime validates models and produces correct SQL across databases.
- Deterministic metric computation and attribution belong in tools. Open-ended exploration belongs in the model.
- A metric system should have fewer, more composable metrics instead of more fixed definitions.

![Core capabilities of an AI-native semantic layer: high-performance Rust engine, open standard, composable metrics, agent-native interfaces, attribution tools, structured errors, multi-dialect support and progressive disclosure](/images/ai-native-semantic-layer/ai-native-semantic-layer-capabilities.png)

That is why we built Dosi.

Apache Ossie has also recently added an <a href="https://github.com/apache/ossie/blob/main/ontology/ontology.md" rel="nofollow noopener">ontology specification draft</a> in version `0.2.0.dev0`. It introduces business concepts, relationships, rules, and mappings from logical models into an ontology. This is an important direction because [ontology](/blog/semantic-layer-vs-ontology/) needs the semantic layer as trusted infrastructure, not just as extra context for the model.

We are following this draft closely and have already started applying it in customer scenarios. We will release the related Dosi capabilities step by step as the specification and our implementation mature.

## Frequently asked questions

### What makes a semantic layer AI-native?

Three things together: an open semantic spec, a deterministic planner/compiler/runtime, and an agent-native tool interface. A spec on its own makes definitions portable but not executable, and YAML dropped into a prompt is context, not computation. The runtime is what validates the model, plans the query, compiles it into the correct SQL dialect, and keeps results consistent across engines.

### Isn't Apache Ossie enough on its own?

Ossie is an important step, because a semantic layer needs an open standard. But today the project is still mainly a YAML specification with Python conversion scripts. Moving a metric definition into another YAML file does not solve the fundamental problem — the definition is portable, but it is not yet executable. See [Why OSI needs an execution engine](/blog/why-osi-needs-execution-engine/).

### Why does compilation performance matter for a semantic layer?

Because the consumer changed. A conversational BI user asks one question and the service compiles one query, so two seconds versus 20 milliseconds is mostly invisible. An agent may list metrics, inspect dimensions, compile several queries, drill down, run attribution, and check intermediate results before giving one answer — and ontology-driven exploration queries even more often. Once the layer is inside the reasoning loop, its translation cost is paid at every step.

### How can having fewer metrics be better?

Because large catalogs usually got large by materializing parameters: 7-day, 14-day and 30-day retention as three definitions instead of one parameterized metric. That was reasonable when dashboards were static, but every fixed definition also limits what an agent can explore. One Cube user had defined 7-day and 30-day retention, and when someone asked for retention in March the metric system could not express it — they fell back to raw SQL. A compact DAG of derived, composed and parameterized metrics covers more questions with fewer definitions.

### Should the semantic layer do retrieval over metric definitions?

No. A well-designed metric system already provides progressive disclosure: `list metrics`, then inspect the relevant dimensions, then `query metrics`. That is a more natural structure for AI than tuning a RAG system across thousands of tables and definitions. Retrieval, trees, graphs and hybrid search still have value — they belong in the agent layer, because different agents need different ways to organize context.

### What can an agent not do for me here?

Decide which metrics actually guide the business, whether the semantic model should use a star or snowflake schema, and how many tables belong in one model. An agent plus a good semantic layer removes most of the SQL and YAML labor and produces valid, consistent, executable Ossie YAML — but valid YAML does not automatically make a good metric system, especially in BI systems that have grown inside a company for years.

## Related articles

- [Why OSI Needs an Execution Engine — Interchange vs Runtime](/blog/why-osi-needs-execution-engine/) — the spec/runtime split argued in full
- [Introducing Dosi: OSI-Native Semantic Layer for Metrics](/blog/introducing-dosi/) — what the engine compiles and how you call it
- [Apache Ossie + Dosi: A 10-Minute Semantic Layer for Your AI Agent](/blog/apache-ossie-dosi-quickstart/) — the runnable version of this article
- [Dosi vs MetricFlow: OSI-Native vs dbt-Centric Runtime](/blog/dosi-vs-metricflow/) — choosing a runtime for the same OSI model
- [What Is a Semantic Layer?](/blog/what-is-semantic-layer/) — the foundational definition
- [Why AI Agents Need Semantic Context to Work Reliably](/blog/why-ai-agents-need-semantic-context-to-work-reliably/) — the grounding argument
