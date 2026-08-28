---
title: "Why OSI Needs an Execution Engine — Interchange vs Runtime"
description: "OSI (Apache Ossie) defines portable semantic metadata, not query execution. Learn the interchange-vs-runtime gap and why native OSI engines matter."
author: "Kostja"
date: 2026-08-23
lastmod: 2026-08-23
head:
  - - meta
    - name: keywords
      content: "OSI execution engine, Apache Ossie, interchange vs runtime, semantic layer runtime, OSI YAML, MetricFlow, semantic interoperability, Dosi"
  - - meta
    - property: og:title
      content: "Why OSI Needs an Execution Engine — Interchange vs Runtime"
  - - meta
    - property: og:description
      content: "OSI (Apache Ossie) defines portable semantic metadata, not query execution. Learn the interchange-vs-runtime gap and why native OSI engines matter."
  - - meta
    - property: og:type
      content: article
  - - meta
    - property: og:url
      content: https://datus.ai/blog/why-osi-needs-execution-engine/
  - - meta
    - property: og:image
      content: https://datus.ai/logo_dark.svg
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - link
    - rel: canonical
      href: https://datus.ai/blog/why-osi-needs-execution-engine/
---

# Why OSI Needs an Execution Engine

"OSI is just a format" is technically correct — and that is exactly the problem. A portable YAML file that defines `net_revenue` does not run a query, plan a join, or stop an agent from double-counting rows when the grain shifts. The [Open Semantic Interchange](/blog/open-semantic-interchange-osi) specification (now incubating as Apache Ossie) solves semantic fragmentation at the document layer. Something else must solve execution: compiling definitions to warehouse SQL, enforcing grain, and serving answers through APIs agents can call. This article explains the interchange-vs-runtime split, what breaks when teams treat OSI as a finished product, and why the ecosystem is now building native OSI runtimes — not just more converters.

## TL;DR

- **OSI (Apache Ossie) is an interchange format** for semantic metadata — metrics, dimensions, datasets, and relationships — not a query engine, semantic layer product, or runtime. The [OSI overview](/blog/open-semantic-interchange-osi) covers what the spec standardizes; this article covers what it does not.
- **Interchange and runtime are different layers.** [Syntactic vs semantic interoperability](/blog/semantic-vs-syntactic-interoperability) explains why shared meaning still requires an engine that turns meaning into correct SQL for a specific warehouse and consumer.
- **Reference converters translate formats; they do not execute.** The Apache Ossie repository ships import/export tools (dbt/MetricFlow, GoodData, Salesforce, Apache Polaris). They prove the mapping — they do not replace MetricFlow, Cube, or warehouse semantic views as execution backends.
- **Without a runtime, OSI files are inert documents.** Teams can export portable definitions and still have no path to query them unless a downstream engine compiles and runs them — often after another format conversion.
- **Native OSI execution engines are emerging** to close that gap. Dosi is among the first engines that consume OSI YAML directly and compile to warehouse SQL; the Apache Ossie roadmap also names a future semantic query specification and reference engines. Format standardization and runtime implementation are complementary, not redundant.

## 1. What OSI standardizes — and what it deliberately does not

The most common misunderstanding about OSI is treating the specification as if it were a product you install. It is not. OSI — the Open Semantic Interchange, now incubating at the Apache Software Foundation as **Apache Ossie** — is a vendor-neutral document format expressed in YAML or JSON. It defines how to write down metrics, dimensions, datasets, relationships, and business context so that independent tools can exchange definitions without re-authoring them in every platform's native syntax.

That separation is intentional and mirrors other successful infrastructure standards. Parquet standardizes how columnar bytes are laid out; it does not run queries. Apache Iceberg standardizes table metadata; it does not replace Spark or Trino. OSI standardizes semantic meaning; it does not plan joins, generate dialect-specific SQL, or serve metrics over an API. The <a href="https://github.com/apache/ossie" rel="nofollow noopener">Apache Ossie repository</a> reflects this scope: a core specification, JSON Schema validation, reference converters, and example models — not a production query planner.

The working group's hub-and-spoke architecture makes the boundary explicit. Each vendor tool connects to OSI as a central interchange format; converters translate between a native authoring format and OSI. Export from MetricFlow yields OSI YAML. Import into another tool yields that tool's native format. The specification sits in the middle as the agreement about meaning. Execution remains on the spokes: MetricFlow still generates Snowflake SQL when MetricFlow is the consumer; a BI tool still renders its own query plan when the BI tool is the consumer.

Critically, OSI also separates **definition from implementation**. A metric in OSI states what `net_revenue` means — the calculation, filters, grain, and relationships — while leaving the SQL dialect to whichever engine consumes the definition. That design choice is what makes OSI portable. It is also why OSI alone cannot answer a business question. Portable meaning is necessary for [semantic interoperability](/blog/semantic-vs-syntactic-interoperability); an execution engine is what makes that meaning computable.

## 2. Why "OSI is just a format" misses the point — and proves one

Skeptics who dismiss OSI as "just a format" are describing the specification accurately. They are misreading the implication. Formats are infrastructure. USB-C is "just a connector standard," yet nobody ships a laptop with ports but no controller firmware to negotiate power delivery. OSI is the connector for semantics. The controller — the runtime that reads OSI and produces correct, pushed-down SQL — is a separate engineering problem the standard does not attempt to solve today.

The objection usually arrives in one of three forms, each pointing at a real gap:

**"We already exported to OSI — why can't the agent query it?"** Because export proves interchange, not executability. An OSI file on disk is a governed document. Querying it requires an engine that parses the schema, resolves relationships, plans aggregation grain, selects a dialect, and emits SQL — then optionally exposes the result through CLI, REST, or MCP for agents.

**"The converter exists, so we're OSI-compatible."** Reference converters in the Ossie repository validate that a mapping is technically feasible. They are command-line proofs, not product features. As of August 2026, no major semantic layer or BI product ships native OSI import that compiles and serves metrics without an intermediate native format — a point the [OSI vs dbt MetricFlow comparison](/blog/osi-vs-dbt-metricflow) documents in detail.

**"Agents can read YAML — they'll figure out the SQL."** Agents read text reliably; they do not reliably compute enterprise metrics from unstructured context. The failure mode is semantic, not syntactic: valid SQL against the wrong join path, the wrong grain, or a plausible but uncertified aggregate. A format gives agents structured meaning; a runtime gives them a governed execution path that does not depend on the model inventing warehouse logic at query time.

Acknowledging that OSI is a format is the starting point for a useful architecture conversation, not the end of one. The industry still needs runtimes that treat OSI as the **input contract**, not an intermediate artifact you immediately convert back into a vendor-specific model.

## 3. Interchange vs runtime: two layers of the semantic stack

Teams collapse interchange and runtime because both touch "the semantic layer." They solve different problems at different boundaries. Confusing them produces stacks that look portable on paper and behave like silos in production.

A useful working definition:

> **Interchange** is the agreement about how meaning is written down — a portable document any tool can parse without loss of semantic intent. **Runtime** is the system that turns that document into executable plans — SQL, API responses, cached aggregates — for a specific warehouse and consumer. Interchange answers "what does this metric mean?" Runtime answers "what SQL computes that meaning correctly on Snowflake today, and how do I call it from an agent?"

The distinction parallels the [semantic vs syntactic interoperability](/blog/semantic-vs-syntactic-interoperability) split at a higher layer of the stack. Syntactic interoperability gets bytes across the wire; semantic interoperability gets meaning aligned; runtime interoperability gets **correct computation** aligned. You can have the first two without the third — and that is exactly what happens when an OSI export lands in a catalog but no engine serves queries from it.

| Dimension | Interchange (OSI / Apache Ossie) | Runtime (execution engine) |
| --- | --- | --- |
| **Primary artifact** | YAML/JSON semantic model | Query plan, SQL, API response |
| **Question answered** | "What is the certified definition?" | "What is the number, at this grain, on this warehouse?" |
| **Failure mode** | Schema validation errors; mapping loss in conversion | Wrong joins, double-counting, dialect bugs — often silent |
| **Typical consumer** | Catalogs, CI pipelines, converter CLIs | BI tools, notebooks, agents via MCP/REST |
| **Evolution cadence** | Spec versioning (v0.1.1; 0.2.0-dev in progress) | Engine releases, dialect coverage, performance |
| **Standardization status** | Apache Incubator spec + schema | Product implementations; Ossie roadmap names future reference engines |

Three rows deserve emphasis for data engineering teams. First, failure modes differ: interchange problems are loud (invalid YAML); runtime problems are quiet (two dashboards, one number). Second, consumers differ: catalogs and Git repos ingest interchange well; agents and analysts need runtime interfaces. Third, standardization is asymmetric: the format is converging under Apache governance; runtimes are still a marketplace of engines — MetricFlow, warehouse-native semantic views, headless semantic APIs — with OSI-native engines now appearing as a new category.

The two layers compose rather than compete. Author once, interchange via OSI, execute through a runtime chosen for your warehouse and consumption surface. The mistake is stopping after the middle step.

## 4. What breaks when execution is an afterthought

Teams that treat OSI export as the finish line encounter predictable failure modes. None invalidate the standard; they illustrate why runtimes are not optional in a working stack.

**The inert catalog problem.** Semantic metadata lands in a data catalog or Git repository as OSI YAML. Discovery improves — analysts can see that `net_revenue` excludes refunds. Queryability does not. Without a runtime wired to that source, the catalog becomes documentation with schema validation, not a queryable semantic layer. The metric exists as a portable file; no API serves it.

**The double-conversion tax.** A common interim pattern: export MetricFlow YAML to OSI for portability, then import OSI into another native format for execution because the target engine does not consume OSI directly. Each conversion introduces mapping risk — subtle grain shifts, lost filter context, relationship cardinality approximations. The team gains interchange in theory and pays integration tax in practice. The [OSI vs MetricFlow article](/blog/osi-vs-dbt-metricflow) describes this as complementary layers; in production it feels like friction until a consumer reads OSI natively.

**The agent grounding gap.** An agent given OSI YAML as context can describe a metric accurately and still generate SQL that violates join rules the YAML encodes. Structured definitions reduce ambiguity; they do not replace a compiler. Production agent stacks need either (a) a runtime the agent calls (`query_metrics("net_revenue", group_by=["region"])`) or (b) an engine-trusted SQL path — not a prompt that asks the model to interpret YAML and write warehouse SQL in one step.

**Dialect and pushdown drift.** OSI deliberately omits dialect-specific SQL. That portability breaks if the runtime is weak: an engine that emits generic SQL may push inefficient plans to Snowflake, omit warehouse-specific optimizations, or fail on dialect features the physical dataset requires. Execution quality — not format fidelity — determines whether the portable definition returns the same number the authoring tool would have produced.

**Governance without enforcement.** Interchange makes it possible to publish a certified metric definition. Runtime enforcement makes it possible to ensure consumers **use** that definition. A BI tool that ignores the OSI source and recomputes from raw tables bypasses governance; an agent that hallucinates SQL bypasses it faster. Runtimes with explicit metric APIs shrink the surface area where ungoverned SQL can sneak in.

These patterns explain why the Apache Ossie community's public roadmap names a **semantic query specification** and **reference engine implementations** as forward work — not because the format failed, but because the ecosystem recognized that interchange without execution leaves the hardest operational problems unsolved.

## 5. How semantic definitions become queries today

Until native OSI runtimes mature, every OSI document follows a three-hop mental model: **author → interchange → execute**. Execution always happens in a non-OSI engine today, usually after conversion back to a native format.

**dbt MetricFlow** remains the most widely adopted open-source execution path for metric definitions. MetricFlow consumes dbt semantic model YAML, builds a semantic graph, plans queries through a dataflow, and emits warehouse-specific SQL. The dbt-to-OSI reference converter proves MetricFlow definitions can be expressed in OSI; MetricFlow itself still executes its native YAML, not OSI files directly. For teams already on dbt, the practical loop is author in MetricFlow, export to OSI for portability, and execute through MetricFlow or the dbt Semantic Layer — OSI is the suitcase, MetricFlow is still the vehicle.

**Warehouse-native semantic layers** — Snowflake Semantic Views, Databricks Metric Views, BigQuery semantic features — embed execution inside the warehouse. Definitions compile to platform SQL with deep dialect integration. OSI is the bridge that could make those definitions portable across platforms; the warehouse engine remains the runtime. Nothing in that pattern eliminates the need for execution — it colocates execution with storage.

**Headless semantic APIs** (Cube, Looker/LookML-backed services, AtScale, and similar) expose governed metrics over REST or SQL interfaces. They are runtimes with their own authoring formats. OSI interchange lets their definitions travel; each product still executes in its native engine unless it adds OSI-native import.

**Agent-side adapters** follow the same split from another angle. The Datus OSI semantic adapter, documented as a Features release, authors strict OSI YAML but lowers execution to MetricFlow as the backend — OSI in, MetricFlow out. That path preserves portable source files while relying on an established engine for SQL generation. It is a valid composition: interchange as the document contract, MetricFlow as the runtime. It also highlights the gap this article names: the adapter exists because OSI alone does not execute.

What is **not** present at scale yet — as of August 2026 — is a production ecosystem where arbitrary tools hand OSI YAML to any engine and receive identical SQL without an intermediate native model. Converters prove semantic mappings; they are not substitutes for runtimes. The <a href="https://ossie.apache.org" rel="nofollow noopener">Apache Ossie project site</a> lists deepening expressiveness, additional converters, catalog integration, and future query specifications as parallel workstreams. Execution engines are the missing spoke for teams that want OSI to be more than a file format they store next to the metrics nobody can query.

## 6. What an OSI-native execution engine must deliver

If interchange defines the contract, a native OSI runtime implements the obligations that contract implies. Whether the engine is open source, commercial, or embedded in a platform, the engineering checklist is similar.

**Schema-valid ingestion.** Parse OSI YAML against the published JSON Schema, reject invalid models at compile time, and surface errors with enough context for CI and agents to fix them — not silent partial accepts.

**Semantic graph construction.** Resolve datasets, dimensions, metrics, and relationships into an internal representation that understands grain, additive vs non-additive metrics, and valid join paths — the same class of problems MetricFlow solves for its native YAML, applied to OSI constructs.

**Dialect-aware SQL generation.** Push aggregations and filters to the warehouse with correct dialect syntax for the target platform. Portable definitions should not imply portable SQL strings; the runtime owns dialect selection.

**Grain and fan-out safety.** Prevent double-counting when metrics span multiple datasets or when joins change row multiplicity. Silent inflation is the cardinal sin of semantic layers; an OSI runtime inherits that responsibility the moment it executes rather than merely describes.

**Stable query interfaces.** Expose metrics through interfaces agents and applications can integrate without re-parsing YAML: CLI for engineers, REST with structured responses, MCP for agent tool calls, Python bindings for notebooks. The interface is part of the runtime value — not an optional wrapper.

**Operational parity with interchange velocity.** Spec versions evolve (v0.1.1 released; 0.2.0-dev in active development). Runtimes must track schema changes without forcing teams to freeze definitions. Validation tooling in the Ossie repository helps; engines must implement migrations and compatibility boundaries explicitly.

An OSI-native engine does not replace catalogs, authoring tools, or governance workflows. It replaces the assumption that every OSI file must round-trip through someone else's native format before it runs. That is the execution gap in one sentence.

## 7. Closing the gap: native runtimes and the ecosystem path forward

The Apache Ossie community has been transparent that today's deliverable is the specification and converter hub, while **semantic query language** and **reference engines** sit on the roadmap. That sequencing is rational: agree on meaning before standardizing how engines compile queries. It also means teams adopting OSI now should plan for runtimes explicitly — not assume converters alone complete the stack.

Native OSI execution engines are beginning to appear as that next layer. **Dosi** — documented at <a href="https://dosi.datus.ai/" rel="nofollow noopener">dosi.datus.ai</a> — is among the first engines built to consume OSI YAML directly, compile to pushed-down SQL across more than a dozen warehouse dialects, and serve metrics through CLI, REST with Arrow IPC, MCP, and Python bindings. It compiles OSI semantic models without requiring MetricFlow as an intermediate lowering step. Dosi is a Datus product and a component of Datus Studio; it is not open source, which matters for teams separating Apache-licensed spec tooling from commercial runtime choices. See [Introducing Dosi](/blog/introducing-dosi) for the product overview and [First Native Apache Ossie Engine](/blog/first-native-apache-ossie-engine) for the native-implementation framing.

Stating that Dosi is **among the first** native OSI runtimes is accurate; claiming it is the **only** path is not. MetricFlow-backed execution — including adapter paths that keep OSI as the authoring format — remains appropriate for dbt-centric teams. Warehouse-native semantic layers remain appropriate when portability is secondary to deep platform integration. OSI interchange adds value to all of these; native OSI runtimes add value when teams want the document format and the execution contract to be the same artifact end to end.

The ecosystem likely evolves toward multiple runtimes with OSI as the shared input, similar to how Iceberg supports multiple query engines over one table format. Converters continue to onboard legacy authoring tools. Runtimes compete on dialect coverage, compile latency, agent ergonomics, and operational fit. Catalogs link to OSI sources that engines actually query. Agents call metric APIs instead of reinterpret YAML on every question.

For data engineering leaders, the actionable split is clear: **invest in OSI interchange for portable definitions**, and **select or build a runtime that makes those definitions executable** in your warehouse and consumption surfaces. Treating the format as the whole solution reproduces the fragmentation OSI was meant to solve — same metric, new silo, nicer YAML.

## Conclusion

OSI is just a format — and formats matter. Apache Ossie gives the industry a vendor-neutral way to write down what metrics mean, which is the prerequisite for ending semantic fragmentation across BI tools, warehouses, catalogs, and agents. But meaning on paper is not a number in a dashboard. Interchange standardizes the document; runtime standardizes the computation. Reference converters validate mappings between native authoring tools and OSI; they do not execute queries. Until engines consume OSI directly, teams pay a conversion tax or leave exported definitions inert.

The execution gap is not a critique of the standard — it is the natural second act. The Ossie roadmap acknowledges it with proposals for semantic query specifications and reference engines. Commercial and open-source runtimes are already implementing OSI-native compilation today. Teams should architect for both layers: portable definitions through [OSI](/blog/open-semantic-interchange-osi), governed execution through an engine matched to their warehouse and agents — whether that is MetricFlow, a warehouse-native layer, or a native OSI runtime such as Dosi inside Datus Studio. The winning pattern is not "format **or** engine." It is interchange **plus** runtime, with a clear boundary between them.

## Frequently asked questions

### Does OSI include a built-in query engine or runtime?

No. OSI (Apache Ossie) is a specification for semantic metadata — metrics, dimensions, datasets, and relationships — expressed in YAML or JSON. The <a href="https://github.com/apache/ossie" rel="nofollow noopener">Apache Ossie repository</a> ships the core spec, schema validation, reference converters, and examples. Query planning, SQL generation, and metric serving are out of scope for the spec itself. The project's public roadmap names a future semantic query standard and reference engines; those are not the current GA deliverable.

### What is the difference between an OSI converter and an OSI execution engine?

A **converter** translates between OSI and a vendor-native semantic format — for example, MetricFlow YAML to OSI YAML, or the reverse. It proves the mapping and helps teams exchange definitions. An **execution engine** consumes semantic definitions (OSI or native), plans queries, generates dialect-specific SQL, and returns results through APIs or CLI. Converters move documents; engines run metrics. You need both layers in a complete stack, but they are not interchangeable.

### Can I query metrics directly from an OSI YAML file without converting to another format?

Not with the specification alone. Something must parse the YAML, validate it against the schema, resolve relationships and grain, compile SQL for your warehouse, and execute or expose a query interface. Today most teams convert OSI to a native format their existing engine understands, or use an adapter that authors OSI but lowers to an established runtime such as MetricFlow. Native OSI engines — including Dosi — are designed to skip that intermediate conversion for execution while keeping OSI as the source file.

### Why does this matter for AI agents and MCP integrations?

Agents fail more often on semantic mistakes than syntax errors: wrong joins, wrong grain, plausible but uncertified aggregates. Giving an agent OSI YAML as context improves understanding of what a metric **means**, but it does not guarantee correct SQL generation. Runtimes that expose metrics through structured interfaces — for example, MCP tools that accept metric names and dimensions — let agents request governed answers instead of re-deriving warehouse logic from text. Interchange grounds meaning; runtime grounds execution.

### Is Dosi open source, and how does it relate to Datus Studio?

Dosi is a commercial Datus product documented at dosi.datus.ai — an OSI-native semantic layer engine with CLI, REST, MCP, and Python interfaces. It is not open source. Dosi operates as a component within Datus Studio, Datus's commercial platform, while the Apache Ossie specification itself remains open under Apache governance. Teams can mix open interchange tooling with commercial runtimes; the choice depends on dialect coverage, agent integration, and operational requirements rather than on spec licensing alone.

### Will native OSI runtimes replace dbt MetricFlow or warehouse semantic layers?

Unlikely as a universal outcome — and that is healthy. MetricFlow remains the right runtime for dbt-centric stacks. Warehouse-native semantic layers remain the right choice when deep platform integration outweighs cross-vendor portability. Native OSI runtimes fit when teams want OSI YAML to be both the interchange format **and** the execution input without lowering to another authoring language. OSI makes definitions portable across these options; runtimes compete on where and how those definitions execute.

## Related articles

- [Open Semantic Interchange (OSI)](/blog/open-semantic-interchange-osi/) — what the standard defines.
- [First Native Apache Ossie Engine](/blog/first-native-apache-ossie-engine/) — the native-implementation taxonomy.
- [Semantic vs syntactic interoperability](/blog/semantic-vs-syntactic-interoperability/) — the interoperability layers behind runtime.
- [OSI vs dbt MetricFlow](/blog/osi-vs-dbt-metricflow/) — format vs runtime, in depth.
- [Introducing Dosi](/blog/introducing-dosi/) — a native OSI runtime in practice.
