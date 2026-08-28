---
title: "Dosi with Cube: OSI Execution and Agentic Analytics in One Stack"
description: "How Dosi with Cube stacks API-first semantic serving with OSI-native multi-dialect SQL execution — complementary layers for agents and warehouses."
author: "Kostja"
date: 2026-08-26
lastmod: 2026-08-26
head:
  - - meta
    - name: keywords
      content: "Dosi with Cube, Cube.dev, OSI execution, agentic analytics, semantic layer, Apache Ossie, CubeStore, MCP, multi-dialect SQL, headless semantic layer"
  - - meta
    - property: og:title
      content: "Dosi with Cube: OSI Execution and Agentic Analytics in One Stack"
  - - meta
    - property: og:description
      content: "How Dosi with Cube stacks API-first semantic serving with OSI-native multi-dialect SQL execution — complementary layers for agents and warehouses."
  - - meta
    - property: og:type
      content: article
  - - meta
    - property: og:url
      content: https://datus.ai/blog/dosi-with-cube/
  - - meta
    - property: og:image
      content: https://datus.ai/logo_dark.svg
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - link
    - rel: canonical
      href: https://datus.ai/blog/dosi-with-cube/
---

# Dosi with Cube: OSI Execution and Agentic Analytics in One Stack

A team standardizes metrics in Cube, ships sub-50ms dashboards through CubeStore, and routes D3 agents through Cube's semantic API — then opens a second warehouse in BigQuery and discovers the Snowflake SQL Cube generated does not compile there without a rewrite. Another team exports portable [Open Semantic Interchange (OSI)](/blog/open-semantic-interchange-osi) YAML from their authoring toolchain but has no engine that treats that file as the execution contract across every warehouse they operate. **Dosi with Cube** is not a merger of two products; it is a stack architecture where Cube excels at governed consumption and agentic analytics, OSI carries definitions between tools, and [Dosi](/blog/introducing-dosi) compiles OSI natively to warehouse SQL when interchange — not a single vendor runtime — is the handoff format.

## TL;DR

- **Dosi with Cube** describes a complementary stack: Cube as the API-first [semantic layer](/blog/what-is-semantic-layer) for pre-aggregations, multi-protocol serving, and [agentic analytics](/blog/cube-agentic-analytics); OSI (Apache Ossie) as the portable interchange between authoring tools; Dosi as the OSI-native execution engine that compiles YAML to 15+ warehouse dialects via CLI, REST, MCP, and Python.
- Cube and Dosi solve different boundaries — Cube **runs** governed semantics through its own data models and CubeStore cache; Dosi **executes** OSI YAML as the input contract without requiring a Cube or MetricFlow runtime in the compile path. See [OSI vs Cube](/blog/osi-vs-cube) for the standard-vs-product distinction.
- **Agent patterns diverge by design:** Cube routes [data agents](/blog/what-is-data-agent) through SQL, REST, GraphQL, MCP, and AI API endpoints grounded in cube data models; Dosi MCP exposes metric-level compile tools with structured error codes when the governed object is OSI. Teams can use both — Cube for cached consumption at scale, Dosi when the same OSI file must compile for Snowflake, BigQuery, and Spark without re-authoring.
- As of August 2026, Cube participates in the OSI working group but has **no merged Cube-to-OSI converter** in the Apache Ossie repository — interoperability is intent, not a shipped import path. Dosi is among the **first** engines built to compile OSI YAML to multi-dialect SQL natively; it is a **Datus Studio component**, not open source, and this article does not cover pricing or packaging.
- The durable architecture: **author where your team already models** (often Cube), **interchange via OSI** when definitions must travel, **execute with Dosi** when multi-dialect OSI-native compilation and agent MCP with structured errors are the requirement — complementary layers, not a replacement narrative.

## 1. Why "Dosi with Cube" is a stack question — not a product fight

Teams evaluating semantic infrastructure in 2026 face a category error repeated in vendor slides: treating every YAML file as if it were the same kind of artifact. Cube data models and OSI documents both use YAML. Cube resolves measures into optimized SQL, caches hot paths in CubeStore, and serves answers through a broad API surface documented in our [Cube agentic analytics analysis](/blog/cube-agentic-analytics). OSI standardizes meaning — metrics, dimensions, datasets, relationships — without prescribing where queries run or which dialect applies. Those are different layers, and conflating them produces either "we exported OSI so we are portable" without an execution path, or "we run Cube everywhere" without a plan when the second warehouse arrives.

The question **dosi with cube** captures is architectural: how do you combine Cube's strengths as a headless semantic layer and agent consumption platform with OSI-native execution when definitions must compile outside Cube's runtime? The answer is not "pick one winner." Cube remains one of the strongest choices when governed metrics must be served fast to many consumers through SQL, REST, GraphQL, MCP, and dedicated AI APIs — especially when pre-aggregation latency dominates the SLA. Dosi enters when OSI YAML is the organizational contract and something must turn that contract into dialect-correct SQL across a heterogeneous warehouse estate, with agent-facing MCP that returns structured errors instead of improvised formulas.

That complementarity mirrors how mature data platforms already stack interchangeable parts. Parquet does not replace Spark; Iceberg metadata does not replace Trino. OSI does not replace Cube, and Cube does not replace an OSI execution engine — a point [why OSI needs an execution engine](/blog/why-osi-needs-execution-engine) develops in detail. The interchange-vs-runtime split is the lens for reading **Dosi with Cube** as one coherent design rather than a feature comparison chart with a forced recommendation.

## 2. Hub-and-spoke: authoring, interchange, and execution

The cleanest mental model is hub-and-spoke semantics with three explicit stations. **Authoring** is where definitions are created, tested, and governed in a native format — Cube data models for teams standardized on Cube, dbt MetricFlow for dbt estates, warehouse semantic views for platform-native shops, or generator pipelines that emit OSI directly. **Interchange** is OSI: the Apache Ossie document that carries certified meaning between tools without assuming a single runtime. **Execution** is whichever engine consumes the handoff format and produces runnable plans — Cube when the consumer is Cube's API and cache layer; Dosi when the consumer is OSI YAML and the output must be multi-dialect SQL callable from CLI, REST, MCP, or Python.

Authoring may live in Cube for years while interchange becomes a goal. A team defines `net_revenue` with order-status filters and fiscal calendar rules in cube data models, serves embedded analytics through CubeSQL, and routes D3 agents through Cube's semantic proxy so LLMs never touch raw tables. That is a complete consumption story on one runtime. The portability story begins when the same organization adds a Trino cluster for federated queries, acquires a company on BigQuery, or mandates that certified metrics exist as an interchange file auditors can read without learning Cube's schema dialect. OSI is the spoke hub — not a replacement for Cube's modeling UX, but the agreement about meaning when definitions leave Cube's API perimeter.

Execution spokes multiply in heterogeneous estates. Cube executes cube data models through its query planner and CubeStore. MetricFlow executes dbt semantic models against the dbt graph. Dosi executes OSI YAML to SQL in fifteen or more warehouse dialects as the [first native Apache Ossie engine](/blog/first-native-apache-ossie-engine) among shipping products as of August 2026 — a statement about what exists today, not a claim that no other engine will appear. **Dosi with Cube** names the pattern where Cube remains the authoring and high-speed consumption layer for teams that want it, while Dosi sits on the OSI execution spoke for warehouses, CI gates, and agents that need interchange-native compilation.

Nothing in this model requires Cube to "become OSI" or Dosi to "become Cube." It requires clarity about which station owns which job — and honesty about what is shipped versus roadmap.

## 3. Architecture in prose: four layers from model to agent

Picture the stack top to bottom as four bands, each with a distinct accountability boundary.

**Consumption and agents (top).** Analysts, embedded apps, BI tools, and LLM agents ask business questions in natural language or structured API calls. Cube's D3 agents and AI API endpoints sit here for teams invested in Cube's agentic analytics path — queries grounded in cube data models, not raw schema. Separately, MCP-enabled coding agents and Datus Agent can call Dosi's semantic MCP tools when the governed object is an OSI metric — list metrics, compile with grain and dimension parameters, recover from structured errors documented in [Dosi MCP for agents](/blog/dosi-mcp-semantic-layer-for-agents). The top band is plural by design; different agents can call different servers for different governed objects.

**Semantic serving (Cube's home band).** Cube's semantic API layer — CubeSQL, REST, GraphQL, MCP — resolves cube data models into SQL, applies access control, and hits CubeStore pre-aggregations for sub-50ms hot paths. This is where Cube's maturity shows: one API for many metrics, many tools, many agents, with caching as a first-class product feature. Teams that need governed metrics served at scale to diverse consumers often standardize here even when OSI interchange is a parallel track.

**Interchange (OSI / Apache Ossie).** Portable YAML or JSON carries metrics, dimensions, relationships, and business context between authoring tools and execution engines. OSI stores nothing and executes nothing — it is the contract document. As of August 2026, reference converters exist for dbt/MetricFlow, GoodData, Salesforce, and Apache Polaris in the <a href="https://github.com/apache/ossie" rel="nofollow noopener">Apache Ossie repository</a>; Cube is a working-group member with stated intent to contribute adapters, but no merged Cube converter ships in that repository yet. Interchange is real; automatic Cube round-trips are not — plan accordingly.

**OSI-native execution (Dosi's home band).** Dosi reads OSI YAML and emits dialect-specific SQL — date functions, join planning, grain validation, filter compilation — for Snowflake, BigQuery, Databricks, Spark, Trino, PostgreSQL, and the rest of the supported dialect list on <a href="https://dosi.datus.ai/" rel="nofollow noopener">dosi.datus.ai</a>. Outputs include CLI validation for CI, REST with Apache Arrow for services, Python for pipelines, and MCP for agents. Inside Datus Studio, the **`datus-semantic-dosi`** adapter executes OSI metrics without MetricFlow in the path when interchange is the handoff format.

Data flows down on query paths and sideways on portability paths. A Cube-served dashboard pulls from the serving band. An OSI export intended for multi-warehouse CI compiles through Dosi without entering Cube's cache layer. An agent stack might call Cube for exploratory slices cached in CubeStore and Dosi MCP for the same metric name when the certified definition lives in an OSI file the platform team maintains independently — if naming and governance align upstream.

## 4. When Cube agentic analytics is enough — and when to add Dosi

Not every estate needs both layers on day one. The decision framework is bottleneck-shaped, not ideology-shaped.

**Cube alone fits** when one runtime owns execution end to end: cube data models are authoritative, connectors cover the warehouses that matter, CubeStore latency meets SLAs, and agents consume metrics exclusively through Cube's API surface — including D3 AI Data Analyst and the MCP tools Cube documents. If the organization's portability problem is "many frontends, one semantic backend," Cube is purpose-built for that shape. Our [Cube agentic analytics](/blog/cube-agentic-analytics) article covers that trajectory; this page does not repeat Cube's glossary.

**Add OSI interchange thinking** when definitions must survive vendor changes — new warehouse, acquired stack, catalog plus engine plus BI tool each re-implementing the same KPI, or auditor demand for a format independent of Cube's native schema. OSI is the document layer for that problem. It does not, by itself, execute on BigQuery and Spark simultaneously.

**Add Dosi execution** when OSI YAML is — or will become — the certified handoff and teams need native multi-dialect compilation without maintaining N hand-translated SQL variants. Typical triggers include: a platform team publishing OSI from generators or converters and wanting "compiles on every production dialect" as a CI gate; agents that must call metric compile tools against OSI with structured errors rather than parsing YAML in prompts; Datus Agent deployments configured for the **`datus-semantic-dosi`** adapter; or a second and third warehouse where Cube's single-runtime SQL is not the portability mechanism you want to rely on.

**Keep both without merging runtimes** when Cube continues to serve low-latency consumption while Dosi compiles the same business definitions from OSI for engines Cube does not target. That requires governance discipline — one source of truth for metric meaning, explicit ownership of which file is canonical, and no silent drift between cube measures and OSI metrics. Technology complements; organizational alignment is the hard part.

Fair counterweight: if your entire analytics estate lives in Cube Cloud with one warehouse connector and no OSI export path on the roadmap, Dosi adds little until interchange exists. Conversely, if you have OSI files but no governed serving layer, Dosi compiles efficiently while you still need a consumption strategy — Cube, a BI semantic layer, or internal APIs — for cached serving at scale.

## 5. Agent patterns: Cube API vs Dosi MCP

Agents amplify whichever boundary you give them. Connect an LLM to a database MCP server and it improvises SQL from column names. Connect it to a semantic MCP server and it parameterizes governed objects. Cube and Dosi both offer semantic agent paths; they differ in input contract, latency profile, and error semantics.

**Cube's agent pattern** routes every question through the semantic API. D3's AI Data Analyst generates Semantic SQL constrained by cube data models; pre-aggregations absorb repeated query shapes; MCP and AI API endpoints expose the same governed objects external agents use. The agent never authors `SUM(amount)` from scratch — it requests measures Cube recognizes. Latency benefits from CubeStore when queries hit materialized aggregates. The contract is Cube-native: agents succeed when cube data models are complete and the deployment exposes the right API keys and roles.

**Dosi's agent pattern** treats OSI as the contract. Through MCP, agents discover metric names, request compilation with explicit grain and dimension parameters, and receive either dialect SQL or structured error codes — invalid dimension for metric, ambiguous metric name, unsupported filter combination — that enable correction loops without abandoning governed definitions. That behavior is the subject of [Dosi MCP semantic layer for agents](/blog/dosi-mcp-semantic-layer-for-agents); the headline difference for this stack article is interchange-native input rather than cube data model input.

| Agent concern | Cube path | Dosi path |
| --- | --- | --- |
| **Input contract** | Cube data models (YAML/JS) | OSI YAML (Apache Ossie) |
| **Primary agent surfaces** | SQL, REST, GraphQL, MCP, AI API | MCP, REST, CLI, Python SDK |
| **Latency profile** | CubeStore pre-aggregations; sub-50ms hot paths | Compile-focused; execution placement varies by deployment |
| **Error feedback** | API and semantic validation errors | Structured error codes for metric algebra and grain |
| **Best when** | Agents consume metrics Cube already serves | Agents compile OSI metrics across dialects and estates |

These patterns are **complementary, not competitive.** A platform team might default KPI questions to Cube for cached dashboard agents while developer copilots in CI call Dosi compile-only MCP to verify OSI changes against Snowflake and Spark dialects before merge. A Datus Agent deployment might retrieve context from Datus Knowledge, compile through Dosi when the certified object is OSI, and still leave Cube APIs available for embedded analytics the product team owns. The anti-pattern is wiring two semantic servers without governance and expecting consistent `net_revenue` — agents will compile faithfully; humans must align definitions.

## 6. OSI status, Dosi boundaries, and honest limits

Stack narratives fail when they skip adoption truth. As of August 2026, **no semantic layer product ships native OSI import that replaces its native runtime** — including Cube, despite working-group participation and public intent to contribute open adapters described in <a href="https://cube.dev/blog/cube-joins-snowflakes-open-semantic-interchange-launch-initiative" rel="nofollow noopener">Cube's OSI launch initiative post</a>. Planning **Dosi with Cube** therefore assumes explicit interchange work — exports from authoring tools, generator pipelines, or future converters — not automatic synchronization today.

Dosi's boundaries deserve the same clarity [Introducing Dosi](/blog/introducing-dosi) establishes. Dosi is **not open source** as of August 2026; it is a **Datus Studio component** with documentation at <a href="https://dosi.datus.ai/" rel="nofollow noopener">dosi.datus.ai</a>. It is **not** a catalog, not a replacement for Cube's pre-aggregation engine, and not a pricing or packaging announcement. It **is** an OSI-native compiler and runtime surface — among the first shipping engines that consume Apache Ossie YAML directly for multi-dialect SQL — valuable when interchange is already the organizational bet.

This article deliberately avoids converter recipes, Snowflake-to-Cube test matrices, and step-by-step interoperability harness instructions. Those are engineering projects for the Ossie community and vendor roadmaps, not prerequisites for understanding how Cube and Dosi occupy different layers. When Cube ships OSI adapters, the stack diagram gains a clearer authoring-to-interchange arrow; until then, treat OSI files as a deliberate publish artifact.

Cube's advantages remain real for teams choosing a semantic consumption platform: mature open-source core, broad connector list, Dresner-category leadership, and agentic analytics GA. Dosi's wedge is OSI-native execution with agent MCP and multi-dialect compilation inside the Datus ecosystem. Neutral evaluation asks which bottleneck you have — serving latency and API breadth versus interchange execution across warehouses — not which logo should appear on a single slide.

## Conclusion

**Dosi with Cube** names a stack architecture, not a SKU bundle. Cube governs and serves metrics through API-first semantic layers and agentic analytics; OSI carries portable meaning between tools; Dosi compiles OSI YAML to warehouse SQL across dialects with CLI, REST, MCP, and Python surfaces for pipelines and agents. Use Cube when cached, multi-protocol consumption is the core problem. Add Dosi when OSI is the handoff format and native multi-dialect execution — with structured agent errors — closes the loop interchange opens.

Read [Introducing Dosi](/blog/introducing-dosi) for product scope, [OSI vs Cube](/blog/osi-vs-cube) for standard-versus-product depth, and [Cube agentic analytics](/blog/cube-agentic-analytics) for Cube's agent layer — this page is the complementarity map. For MCP wiring details, see [Dosi MCP semantic layer for agents](/blog/dosi-mcp-semantic-layer-for-agents) and <a href="https://dosi.datus.ai/" rel="nofollow noopener">dosi.datus.ai</a>. Align definitions before you align servers; the stack only works when metric meaning has an owner.

## Frequently asked questions

### Does Cube natively import or export OSI today?

As of August 2026, **no merged Cube-to-OSI converter** exists in the Apache Ossie repository, and Cube does not ship user-facing OSI import or export as a product feature. Cube participates in the OSI working group and has publicly stated intent to contribute adapters. Treat OSI interoperability from Cube as roadmap signal until a shipped path exists — see [OSI vs Cube](/blog/osi-vs-cube) for the full adoption picture.

### Can I use Cube and Dosi together without duplicating metric logic?

Yes, **if governance keeps one canonical definition** and you treat OSI as the interchange artifact that tracks it — or accept that Cube data models and OSI files are separate sources until an export path exists. Technology allows Cube to serve consumption while Dosi compiles OSI for other dialects; organizational process prevents silent drift between `net_revenue` in Cube and `net_revenue` in OSI. Without that discipline, agents on both paths will faithfully return different numbers.

### How is Dosi MCP different from Cube's MCP server?

Cube MCP exposes governed objects defined in **cube data models**, typically routed through Cube's semantic API and cache layer. Dosi MCP exposes **OSI metric operations** — discovery, multi-dialect compile, structured semantic errors — when the input contract is Apache Ossie YAML. Choose Cube MCP when agents should query metrics Cube already serves; choose Dosi MCP when agents must compile OSI natively across warehouses or integrate with Datus Agent's **`datus-semantic-dosi`** adapter.

### Is Dosi a replacement for Cube?

No. Cube is a headless semantic layer product with pre-aggregations, multi-protocol APIs, and agentic analytics. Dosi is an **OSI-native execution engine** — a compile-and-serve layer for interchange format, not a drop-in substitute for CubeStore or Cube's modeling UX. Many estates will use Cube alone; some will add Dosi when OSI execution across dialects is the requirement.

### Is Dosi open source like Cube's core?

No. Cube's open-source core is Apache 2.0 licensed. **Dosi is a Datus Studio component** as of August 2026 — documented at <a href="https://dosi.datus.ai/" rel="nofollow noopener">dosi.datus.ai</a>, not Apache-licensed. Datus-agent remains open source and can integrate with Dosi through documented semantic adapters; the Dosi engine itself is a commercial runtime layer.

### When should we adopt OSI and Dosi if we already run Cube agentic analytics?

Adopt OSI thinking when definitions must **travel** — second warehouse, tool migration, audit-friendly interchange, or multi-vendor consumption. Add **Dosi** when OSI YAML exists or will exist soon and you need **native multi-dialect compilation** and agent MCP with structured errors without hand-maintaining SQL per engine. If Cube covers all warehouses and consumers with no interchange requirement, prioritize Cube's serving strengths first; revisit Dosi when portability becomes a production bottleneck, not a slide deck aspiration.

## Related articles

- [Introducing Dosi](/blog/introducing-dosi/) — the OSI-native execution engine.
- [OSI vs Cube](/blog/osi-vs-cube/) — the standard-versus-product distinction.
- [Cube agentic analytics](/blog/cube-agentic-analytics/) — Cube's agent layer in depth.
- [Dosi MCP semantic layer for agents](/blog/dosi-mcp-semantic-layer-for-agents/) — the MCP wiring for OSI metrics.
- [Why OSI needs an execution engine](/blog/why-osi-needs-execution-engine/) — the interchange-vs-runtime gap.
