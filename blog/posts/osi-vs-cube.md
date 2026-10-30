---
title: "Apache Ossie (OSI) vs Cube: Headless Semantic Layer Meets Open Standard"
description: "Apache Ossie (formerly Open Semantic Interchange, OSI) vs Cube: open standard meets headless semantic layer — format, execution, governance, AI access."
author: "Evan Paul"
date: 2026-08-10
lastmod: 2026-10-30
head:
  - - meta
    - name: keywords
      content: "Apache Ossie, Apache Ossie incubating, Ossie semantic model specification, OSI vs Cube, Cube.dev, headless semantic layer, Open Semantic Interchange, CubeStore, semantic layer API, AI agents"
  - - meta
    - property: og:title
      content: "Apache Ossie (OSI) vs Cube: Headless Semantic Layer Meets Open Standard"
  - - meta
    - property: og:description
      content: "Apache Ossie (formerly Open Semantic Interchange, OSI) vs Cube: open standard meets headless semantic layer — format, execution, governance, AI access."
  - - meta
    - property: og:type
      content: article
  - - meta
    - property: og:url
      content: https://datus.ai/blog/osi-vs-cube/
  - - meta
    - property: og:image
      content: https://datus.ai/logo_dark.svg
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - link
    - rel: canonical
      href: https://datus.ai/blog/osi-vs-cube/
---

For the specification and its role across tools, see the [Apache Ossie guide](/apache-ossie/). This comparison focuses on its relationship with Cube.

# Apache Ossie (OSI) vs Cube: Headless Semantic Layer Meets Open Standard

> **OSI is now Apache Ossie.** In July 2026, **Open Semantic Interchange (OSI)** was renamed **Apache Ossie** and entered the [Apache Incubator](https://incubator.apache.org/clutch/ossie.html) — the spec, community, and mission are unchanged. Read the [OSI project history](/blog/open-semantic-interchange-osi/) for the naming and governance transition. This comparison uses **Apache Ossie / OSI** interchangeably.

**Apache Ossie** (formerly **Open Semantic Interchange**, OSI) and **Cube** are often grouped together, but they operate at different layers of the semantic stack: OSI is an open interchange standard for portable metric definitions, while Cube is a headless semantic layer product that defines, executes, and serves those definitions. This article defines each, compares them across format, execution, governance, and AI agent access, and explains why the product-vs-standard distinction matters in practice.

## TL;DR

- **OSI vs Cube** is a comparison between an open standard and a semantic layer product: OSI (Open Semantic Interchange, now Apache Ossie) defines a portable YAML/JSON format for semantic metadata, while Cube is an API-first headless semantic layer that defines, executes, and serves semantics — one moves definitions between tools, the other runs them.
- Apache Ossie is an Apache-2.0 specification; implementations and converters have different support boundaries.
- Cube is an product with an open-source core with cube data models in YAML or JavaScript, CubeStore pre-aggregation caching, and SQL, REST, GraphQL, MCP, and AI APIs.
- The official converters repository now includes an offline Cube YAML ↔ Ossie path. A converter is distinct from an in-product import or export feature.
- The two are complementary layers: author semantics in Cube, interchange them via OSI, and consume them in a consumer that supports the definitions involved — an architecture that matters even more for AI agents.

## 1. OSI vs Cube: a working definition

Most of the confusion in this space comes from mistaking a specification for a product. Before comparing features, it helps to pin down what each of these actually is — and what it is not. A useful working definition:

> **Apache Ossie and Cube operate at different layers.** Ossie defines a shared semantic model format; Cube provides modeling and query-serving capabilities. The official converters repository includes offline Cube YAML import and export. Successful conversion still requires checking expressions, diagnostics, and behavior in the destination.

That definition distinguishes the specification from a runtime. OSI is a contract about representation; Cube is a runtime that happens to author its data models in YAML and JavaScript files. Neither replaces the other: OSI is useless without a runtime to execute the definitions it carries, and Cube — like any authoring tool — needs an interchange path if its definitions are to travel beyond its own API surface. The sections below expand each side in turn, then compare them row by row.

## 2. What OSI is: an open interchange standard, not a runtime

Apache Ossie, formerly Open Semantic Interchange (OSI), is a vendor-neutral format for semantic metadata. The [Apache Ossie guide](/apache-ossie/) introduces the current standard and examples. The specification at [github.com/apache/ossie](https://github.com/apache/ossie) defines how metrics, dimensions, datasets, relationships, and business context are represented in YAML or JSON — and, critically, it separates definition from implementation. An OSI metric says what the metric is and how it relates to other entities; it does not say where the query runs or which SQL dialect to use.

Portability depends on the consumer and the definitions involved. The current core document is a 0.2.0.dev0 development draft. For Cube models, the [upstream converter](https://github.com/apache/ossie-converters/tree/main/cube) provides offline YAML import and export; this is not evidence of an identical in-product feature in every deployment.

## 3. What Cube is: a headless semantic layer product

Cube is the opposite kind of artifact: a product you install, configure, and query. As detailed in our [Cube.dev agentic analytics analysis](/blog/cube-agentic-analytics/), Cube evolved from an open-source dashboard framework into an API-first headless semantic layer. Teams define measures, dimensions, joins, segments, and pre-aggregations in cube data models — written in YAML or JavaScript — and those definitions are what every downstream consumer sees: not raw tables, but governed business objects.

The distinguishing trait is execution. Cube resolves a data model into optimized SQL, runs it against any of its 25+ connectors, caches hot queries in CubeStore pre-aggregations for sub-50ms response times, and serves the results through a broad API surface — CubeSQL (Postgres-compatible), REST, GraphQL, MCP, and a dedicated AI API. The open-source core is Apache-2.0 licensed with roughly 20K GitHub stars, and the D3 platform (June 2025) added AI Data Analyst and AI Data Engineer agents that operate on top of the semantic layer, as described in the <a href="https://cube.dev/docs" rel="nofollow noopener">Cube documentation</a>. Where OSI standardizes how definitions are written down, Cube standardizes how they are turned into answers.

## 4. Key differences: product vs standard

The table below answers a single question: what does each technology actually deliver, and where does each sit in a query path? The rows track type, primary job, format, execution, governance, AI agent access, and OSI status as of August 2026.

| Dimension | OSI (Apache Ossie) | Cube |
|---|---|---|
| **Type** | Open interchange standard (Apache 2.0 spec) | Product — open-source core + commercial cloud |
| **Primary job** | Define a portable format for semantic metadata | Define, execute, and serve semantic definitions |
| **Format** | OSI YAML/JSON (spec v0.1.1 / 0.2.0-dev) | Cube data models (YAML or JavaScript) |
| **Execution** | The specification is not a runtime | Resolves supported models to SQL; caching and pre-aggregations depend on configuration |
| **Governance** | Standards body + 50+ org working group | Vendor governance; access control enforced at query time |
| **AI agent access** | Machine-readable definitions for agent context | SQL, REST, GraphQL, MCP, and dedicated AI API endpoints |
| **Ossie support (checked October 30, 2026)** | Open specification; consumer support varies | Offline Cube YAML converter available upstream; verify target behavior |

Read the execution row first, because it is where the two diverge most. OSI has no runtime by design — it cannot answer a query, apply a filter, or enforce row-level security; it only describes semantics in a standard shape. Cube does all of those things, but only for definitions it understands natively. That division of labor is the entire relationship: OSI is the interchange contract between tools, and Cube is one of the tools that can honor it. The format row is also worth a second look, because both sides use YAML — a coincidence that generates more confusion than any other detail.

## 5. The layer relationship: define, export, consume

The cleanest way to think about OSI and Cube is as three steps in one pipeline. First, you define semantics — in Cube, for teams that choose it, which is why Cube's modeling experience matters. Second, you export those definitions in OSI format, so they are no longer locked to Cube's API surface. Third, any OSI-compatible consumer — a BI tool, a catalog, an AI agent, another semantic layer — reads the same definitions and turns them into whatever it runs natively.

A concrete sketch: a team maintains `net_revenue` as a Cube measure with a defined filter on `order_status = 'completed'`. Through an OSI path, that same definition is exported as a portable OSI document carrying the metric formula, its grain, and its business context, and a downstream tool imports it without the team re-authoring the logic. This is the pattern the [semantic layer](/blog/what-is-semantic-layer/) movement has been circling for a decade: one governed [semantic model](/blog/what-is-semantic-model/), many consumption surfaces. What makes it real today is not the standard itself — it is that the first two steps already exist for some tools in the ecosystem.

## 6. Adoption status: working-group member, not a merged converter

Cube appears in the official Ossie ecosystem. Participation alone does not establish feature support; the current [Cube converter documentation](https://github.com/apache/ossie-converters/tree/main/cube) separately documents offline model conversion.

The Cube converter accepts supported YAML model files and writes Ossie definitions, or exports Ossie to Cube model files. Inspect its requirements and structured issues. A file conversion does not deploy a model or verify a result in a running Cube instance.

The fair reading for Cube is nuanced. Its breadth of API surface, its caching, and its agentic analytics layer are real strengths today; OSI compatibility is a roadmap signal. Teams evaluating Cube for portability should ask for a concrete timeline — and treat any answer that stops at "we are in the working group" as an intent statement rather than a commitment.

## 7. When to use Cube vs when to use OSI

Choosing between them is a category error, because they do not compete — but there are still clear answers about what to adopt first, depending on where a team is.

- Choose **Cube** when you need governed metrics served to many consumers today: embedded analytics, multi-tool distribution, caching and pre-aggregations, and an API surface that AI agents can query directly. If the bottleneck is "we have definitions but no way to serve them," that is a Cube-shaped problem.
- Adopt **OSI thinking** when definitions must travel — across multiple warehouses, multiple BI tools, or a new AI stack next quarter — or when you want to stop re-authoring the same metric in five places. If the bottleneck is "we re-author `net_revenue` in every tool," that is an OSI-shaped problem.
- Do **not** wait for the standard to start governing metrics. Teams that "wait for OSI" end up with nothing to standardize; teams that define their twenty most important KPIs in Cube, MetricFlow, or any decent authoring tool today will can evaluate supported export paths against real definitions.

The same product-vs-standard lens applies to the rest of the OSI comparison series: the [dbt MetricFlow](/blog/osi-vs-dbt-metricflow/) comparison shows how the leading code-first metric layer differs from Cube's API-first posture, and the [LookML](/blog/osi-vs-lookml/) comparison shows the platform-native contrast. In every case the dividing line is the same — authoring tool versus interchange standard.

## 8. Why the distinction matters for AI agents

For AI agents, the product-vs-standard distinction is not academic; it determines whether the agent has context or an execution path. The production numbers make the stakes concrete: on the Spider 2.0 benchmark, which measures SQL agents against real enterprise workflows, GPT-4o scored about 10.1% and o1-preview about 17.1% in production settings — versus roughly 86% on academic tasks per the <a href="https://spider2-sql.github.io" rel="nofollow noopener">Spider 2.0 leaderboard</a>. The gap is not model capability; it is context. Agents that cannot resolve what a column or metric means, in a governed form, default to guessing.

OSI and Cube attack opposite halves of that problem. OSI gives an agent portable, machine-readable business definitions — the context it can read before writing a single line of SQL, so it knows `amount_usd` means net revenue after refunds rather than gross transaction value. Cube gives the agent a governed surface to query: a semantic API that resolves definitions, enforces access control, and applies caching, so the model never touches raw tables. In practice both are needed — OSI is what you feed the agent, and Cube is where the agent sends the query. The growing support for MCP across the ecosystem is an early sign of this converging: tools standardizing how agents connect to semantics, with OSI standardizing the shape of what they read.

The complementary piece is who keeps those definitions current. Standards describe a format, not a maintenance cycle; [data engineering agents](/blog/what-is-data-engineering-agent/) that generate, validate, and refine semantic definitions — rather than only consuming them — are the natural fit for the creation side of the loop. Datus, an open-source data engineering agent, treats this as its core: it builds evolvable context from schema, metrics, and validated SQL, so the definitions that get exported through OSI were not authored once and forgotten. The durable architecture is the one this article has been describing — define, export, consume — with an agent-driven loop keeping the definitions accurate between exports.

## 9. Common misconceptions

Four misconceptions dominate this topic, and each one collapses once the product-vs-standard line is held firmly.

- **"OSI is a semantic layer like Cube."** It is not. OSI is a specification; it stores nothing, queries nothing, and serves no API. A semantic layer is a runtime — Cube, MetricFlow, LookML — that does all three. For the related boundary with formal semantic standards, see the [Apache Ossie / OSI vs RDF/OWL](/blog/osi-vs-rdf-owl/) comparison.
- **"Cube supports OSI because it is in the working group."** Participation signals intent, not delivery. The official offline Cube converter is separate evidence of a conversion path; it does not guarantee all Cube features map or run identically elsewhere.
- **"Cube data model YAML and OSI YAML are the same thing."** The syntax family is shared, but the contract differs: cube data model YAML is tool configuration executed by Cube; OSI YAML is an interchange document that any conforming tool can consume. Same file extension, different promise.
- **"Adopting OSI means replacing Cube."** The opposite. OSI needs a runtime to be useful, and Cube needs an interchange path for its definitions to travel. The standard extends Cube's reach; it does not remove it.

The pattern behind all four is the same: a standard and a product can look identical on paper — both describe metrics, both use YAML — until you ask who executes. That is the question that separates them.

## Conclusion

Ossie and Cube can serve complementary roles: shared definitions and a particular modeling/querying system. Evaluate the available converter against your actual model, then validate and test the output in the destination. Choose the runtime for the behavior you need; use the open format where definitions must move.

Explore the [data engineering glossary](/glossary/) for more definitions.

## Frequently asked questions

### Is this about OSI or Apache Ossie?

They are the same standard. **Open Semantic Interchange (OSI)** was renamed **Apache Ossie** when it entered the Apache Incubator in July 2026 — the spec, community, and mission did not change. This comparison applies whether you know it as OSI or Apache Ossie. See [Open Semantic Interchange, now Apache Ossie](/blog/open-semantic-interchange-osi/).

### Is OSI a semantic layer like Cube?

No. OSI (Open Semantic Interchange, now Apache Ossie) is a specification that defines a portable YAML/JSON format for semantic metadata — metrics, dimensions, datasets, and relationships. It does not store, execute, or serve definitions. Cube is a semantic layer product that does all three: it defines semantics in cube data models, executes queries, caches them, and serves them through SQL, REST, GraphQL, MCP, and AI APIs. OSI is the format; Cube is one of the runtimes that honor it.

### Does Cube support OSI?

The official converters repository includes a Cube YAML ↔ Ossie converter as checked on October 30, 2026. That provides a documented offline conversion path. It should be evaluated separately from Cube product features, deployment requirements, and runtime support.

### Can I export a Cube data model in OSI format today?

You can use the [official offline Cube converter](https://github.com/apache/ossie-converters/tree/main/cube) for supported YAML model files, or inspect the Cube example in the [website conversion workbench](/apache-ossie-converter/). Review diagnostics and validate the intended destination. This does not establish a native export button in a running Cube deployment.

### Should I adopt Cube, OSI, or both?

Both, in sequence. Choose Cube (or another authoring tool) when you need governed semantics served to many consumers today; adopt OSI thinking — portable, tool-neutral definitions — as the architectural target. Do not wait for the standard to start governing metrics: define your KPIs now, keep them maintained, and treat OSI as the interchange path that will let them travel later.
