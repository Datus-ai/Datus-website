---
title: "First Native Apache Ossie Engine"
description: "What a native Apache Ossie implementation is, how it differs from converters, and why execution engines like Dosi matter for portable semantics."
author: "Kostja"
date: 2026-08-22
lastmod: 2026-08-22
head:
  - - meta
    - name: keywords
      content: "Apache Ossie implementation, native Ossie engine, OSI execution engine, semantic layer runtime, OSI converter, Dosi, reference compiler, semantic interoperability"
  - - meta
    - property: og:title
      content: "First Native Apache Ossie Engine"
  - - meta
    - property: og:description
      content: "What a native Apache Ossie implementation is, how it differs from converters, and why execution engines like Dosi matter for portable semantics."
  - - meta
    - property: og:type
      content: article
  - - meta
    - property: og:url
      content: https://datus.ai/blog/first-native-apache-ossie-engine/
  - - meta
    - property: og:image
      content: https://datus.ai/logo_dark.svg
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - link
    - rel: canonical
      href: https://datus.ai/blog/first-native-apache-ossie-engine/
---

# First Native Apache Ossie Engine

Search for **apache ossie implementation** and you will find the specification, the working group, and a growing folder of reference converters. What you will not find — until very recently — is a runtime that reads Ossie YAML and executes semantic queries without first translating into another vendor's format. That gap is what **native implementation** means, and it is why execution engines are the next chapter in the Ossie story.

## TL;DR

- **Apache Ossie** (incubating) is a vendor-neutral YAML/JSON specification for metrics, dimensions, datasets, and relationships — not a query engine. See the [Open Semantic Interchange overview](/blog/open-semantic-interchange-osi) for the full standard context.
- Today, most **apache ossie implementation** work in the community repository is **converter-level**: translate MetricFlow YAML, LookML, or platform-native definitions *into* or *out of* Ossie format. Converters prove the spec is mappable; they do not execute queries.
- A **native Ossie engine** consumes Ossie YAML directly, plans joins and aggregations from the semantic graph, and lowers the result to warehouse SQL — without requiring an intermediate authoring format like MetricFlow or a platform-specific semantic view.
- The Apache Ossie **roadmap** names a reference compiler and semantic query language as future deliverables; as of August 2026 those pieces are planned, not shipped in the incubating project.
- **Dosi** is the first native Ossie execution engine: a Rust compiler that reads OSI YAML and emits SQL for 15+ dialects, exposed through CLI, MCP, REST, and Python. It is a Datus Studio component and is not open source yet.

## 1. Why "implementation" is ambiguous until you name the layer

Teams evaluating Ossie often ask a reasonable question: *who implements it?* The answer depends on which layer you mean.

At the **interchange layer**, implementation means reading and writing Ossie documents correctly — validating schema, preserving metric expressions, mapping relationships, and carrying business context fields like descriptions and AI metadata. Reference converters in the <a href="https://github.com/apache/ossie" rel="nofollow noopener">Apache Ossie repository</a> do exactly that. They are essential proof that the format is expressive enough to represent real semantic models from production tools.

At the **execution layer**, implementation means something different: take an Ossie model as the *source of truth*, accept a semantic query (metrics, dimensions, filters, time grain), compile a correct join plan, and emit SQL that a warehouse can run. No round-trip through a second authoring format. No "export to Ossie, import into LookML, then query LookML."

That distinction matters because Ossie was designed as **USB-C for semantics**, not as a replacement [semantic layer](/blog/what-is-semantic-layer). The specification separates *what a metric means* from *where it runs*. Converters honor the first half; engines honor the second.

Confusing the two leads to predictable disappointment. A team exports definitions through a converter, loads the YAML into git, and assumes they can query it. They cannot — not until something in the stack treats Ossie as an executable contract, not a serialization target.

Consider a concrete failure mode. Finance certifies `gross_margin` in a MetricFlow project. An analytics engineer runs the MetricFlow → Ossie converter, commits the YAML, and announces that margin is now "standardized." A product squad wires an internal agent to read the file and generate SQL. The agent sees human-readable expressions but has no join planner, no grain checker, and no fan-out rules — so it hallucinates a join path that compiles but double-counts revenue on a many-to-many link. The Ossie file was accurate; the stack was not implementation-complete. Native execution engines exist to close exactly that gap: the file in git is not only portable documentation, it is the program the runtime executes.

## 2. What Apache Ossie standardizes — and what it leaves to engines

Apache Ossie (the project formerly known as Open Semantic Interchange) defines a portable document model for semantic metadata. The canonical explainer lives in [Open Semantic Interchange (OSI)](/blog/open-semantic-interchange-osi); this section summarizes only what execution engines must consume.

An Ossie model typically encodes:

| Artifact | Role for an engine |
| --- | --- |
| **Datasets** | Physical tables or views, column types, primary keys |
| **Dimensions** | Group-by and filter attributes, hierarchies, time fields |
| **Metrics** | Aggregates, ratios, derived expressions, grain constraints |
| **Relationships** | Join keys, cardinality, preferred join paths |
| **Business / AI context** | Descriptions, owners, hints for grounded generation |

The spec deliberately does **not** mandate a single SQL dialect, a join planner algorithm, or a query API. Those are engine responsibilities. Ossie tells you that `net_revenue` is `SUM(order_amount) - SUM(refund_amount)` at daily grain with an equi-join to `customers` on `customer_id`; it does not emit Snowflake SQL, BigQuery SQL, or DuckDB SQL on its own.

That separation is what makes interchange portable. It also creates the implementation gap: the ecosystem has invested heavily in *mapping* definitions between tools, and comparatively little in *running* them from a neutral file.

## 3. Converters vs native engines: two valid implementations, different jobs

When engineers say **apache ossie implementation**, they usually mean one of three things. Only the third qualifies as a native engine in the sense this article uses.

**Schema validators and linters** check that a YAML file conforms to the Ossie schema. They are implementations of the *specification contract*, not of analytics execution.

**Reference converters** translate between Ossie and an authoring or platform format. The dbt (MetricFlow) → Ossie converter in the Apache project is the most cited example: it proves MetricFlow semantics can be losslessly represented in Ossie, and it gives teams a CLI path to produce portable files today. Similar converters exist for GoodData, Salesforce, Apache Polaris, and others. They are **build-time artifacts** — like Protobuf `.proto` files that compile to language-specific stubs. Valuable, but not query paths.

**Native execution engines** read Ossie YAML as the maintained source, plan semantic queries against the model graph, and compile SQL (or another execution plan) for a target warehouse. The model file you edit is the same file the engine loads at query time.

The hub-and-spoke architecture Ossie promotes — each tool speaks Ossie instead of pairwise adapters — reduces integration from *N×M* converters to *N+M*. Converters are the spokes that get definitions *onto* the hub. Engines are what let you *use* the hub without stepping off into a proprietary runtime first.

Converters also have a subtle limitation worth naming explicitly: they preserve *semantic content* at a point in time, not *operational equivalence* across runtimes. Two platforms may import the same Ossie metric yet apply different default filters, timezone handling, or null treatment — behaviors the YAML describes partially but engines enforce differently. Without a shared execution contract or conformance tests, "we converted successfully" does not mean "we get the same number everywhere." Native engines that publish their join and aggregation semantics make that equivalence question answerable.

Most teams in 2026 encounter Ossie through converters and platform import hooks. That is appropriate while the spec is at v0.1.x with a 0.2.0-dev branch in flight. It is not the end state the working group describes.

## 4. What a native Ossie engine must prove

Calling something a native **apache ossie implementation** at the execution layer implies a concrete checklist. Community and vendor engines should be judged on these capabilities, not on logo placement in the working group.

**Direct ingestion.** The engine loads Ossie core YAML (and agreed extensions) without requiring a prior conversion step into MetricFlow, LookML, or a warehouse semantic view object. Custom extensions may exist, but the portable core must drive compilation.

**Semantic graph construction.** Datasets and relationships form a join graph. The engine resolves reachable paths, respects cardinality, and refuses ambiguous fan-out rather than silently double-counting — the failure mode that makes `"two correct numbers that disagree"` a recurring analytics incident.

**Metric algebra.** Aggregates, ratios, cumulative windows, and derived metrics compile with correct grain rules. The engine knows which metrics are additive across dimensions, which require subqueries, and which break when you change time grain.

**Dialect lowering.** The same Ossie model produces correct SQL for more than one warehouse dialect — at minimum through a stable internal intermediate representation. Annotations in the spec may carry dialect-specific expressions; the engine merges portable semantics with those hints.

**Query surface.** Consumers need a stable interface: CLI flags, an HTTP API, MCP tools for agents, or embedded library calls. The [OSI vs MetricFlow](/blog/osi-vs-dbt-metricflow) split is instructive here: MetricFlow ships all of the above against its own YAML; a native Ossie engine ships them against Ossie YAML.

**Conformance signal.** Eventually, shared test fixtures — the Apache roadmap mentions a conformance suite tied to a reference compiler — let implementations prove equivalent results. Until that suite lands, engines should document their fixture coverage and edge-case limits honestly.

**Error semantics for automation.** Agent-facing engines need structured failures: unknown metric names with candidate suggestions, ambiguous grains, non-equi joins the spec allows but the engine rejects, and explicit codes instead of stack traces. That surface is easy to overlook when judging implementations by SQL string output alone, yet it determines whether autonomous consumers can recover without human intervention.

An engine that only re-imports Ossie into a proprietary semantic object and then queries the proprietary object is **import-native**, not **execution-native**. Both have value during migration. Only execution-native implementations break vendor lock-in at query time.

The difference shows up in day-two operations. Import-native paths re-sync when the platform object's API changes. Execution-native paths version like application code: bump the Ossie file, rerun validation, deploy. For teams treating semantics as infrastructure rather than BI configuration, that git-native loop is the payoff of choosing the right implementation layer.

## 5. The Apache Ossie roadmap: reference engine planned, not delivered

The incubating project is explicit about what is shipping today versus what is queued. Validators and converters are real; the **Semantic Query Language & Reference Engine** workstream is on the <a href="https://github.com/apache/ossie/blob/main/ROADMAP.md" rel="nofollow noopener">public roadmap</a> with deliverables that include:

- A standard semantic query interface (Ossie-native or SQL-extended)
- Mapping from semantic queries to execution plans
- A reference compiler from Ossie models to SQL
- Canonical handling of joins, aggregations, and filters
- A test suite for cross-implementation conformance

That list describes exactly the execution layer §4 outlines. It also confirms that, as of August 2026, the Apache project itself does not yet ship that reference engine — community commentary from working-group participants matches the roadmap: first implementations are real at the converter level; **consistent cross-engine execution** remains the ambitious line item.

Snowflake's engineering blog on lakehouse interoperability describes bidirectional stored procedures that create semantic views from Ossie YAML and export views back to YAML — valuable for governed objects inside Snowflake, but a platform-scoped bridge rather than a warehouse-agnostic engine.

The honest posture for most teams in 2026 is **align, experiment, and contribute** at the interchange layer while watching execution mature. When the reference compiler appears, native engines will have a shared yardstick. Until then, independent engines that already consume Ossie YAML fill a vacuum the spec was always meant to address.

Working-group commentary from late 2025 through mid-2026 consistently separates **spec maturity** from **runtime maturity**. Fifty-plus organizations can align on YAML fields while zero reference engines ship — that is normal for incubating standards. What is unusual is how quickly analytics teams need agent-ready semantics: the consumption surface arrived before the execution surface, which is why first-party and vendor engines are appearing ahead of the Apache reference implementation rather than after it.

## 6. Dosi: OSI YAML as input, SQL as output

**Dosi** is a native Ossie execution engine built by Datus: a Rust semantic compiler that reads OSI YAML and lowers queries to SQL across 15+ dialects, including DuckDB, PostgreSQL, Snowflake, BigQuery, Databricks, ClickHouse, StarRocks, Trino, MySQL, Redshift, and others. It is the **first** engine to treat Ossie documents as the primary runtime input — not the only possible approach, and not a substitute for the Apache project's own reference work when that arrives.

Operationally, Dosi sits in the execution layer described throughout this article:

```
  Authoring / migration          Execution (Dosi)              Consumption
  ─────────────────────          ────────────────              ───────────
  OSI YAML in git        ──►      load model → plan query  ──►  CLI / REST / MCP / Python
  (from hand, agent,               compile SQL per dialect       agents & apps query
   or upstream tools)              execute or return SQL           by metric name
```

Teams can maintain one Ossie file per metric domain. At query time, `dosi query --metrics revenue --group-by region --dialect snowflake` compiles portable semantics to dialect-specific SQL; changing `--dialect duckdb` changes the emitted SQL, not the model.

**Surfaces.** The same engine backs a CLI for engineers, an MCP server so agents query through governed metrics instead of inventing SQL, a REST API with optional Arrow IPC streaming for columnar clients, and Python bindings. That multi-surface pattern mirrors what mature semantic layers provide — except the authored artifact remains Ossie YAML throughout.

**Metric safety.** Dosi tracks metric kinds (additive aggregates, ratios, expressions spanning datasets) and applies fan-out protection so joins do not silently duplicate rows — the correctness property enterprise teams expect from a [semantic layer](/blog/what-is-semantic-layer) runtime, expressed against Ossie rather than a vendor-specific model file.

**Relationship to Datus Studio.** Dosi is a component of Datus Studio, the commercial platform layer above the open-source Datus data engineering agent. The agent path can author and validate Ossie through adapters documented for Datus 0.3; Dosi is where those definitions compile and serve at scale. Dosi is **not open source** as of August 2026 — teams evaluating it should treat licensing and access as product questions separate from the Apache-licensed spec.

**Benchmarks, with caveats.** Dosi publishes an apples-to-apples benchmark against MetricFlow using the MetricFlow `simple_model` fixture converted one-to-one to Ossie — a small model (~25 datasets/metrics), not a production-sized graph. On that fixture, <a href="https://dosi.datus.ai/benchmarks/" rel="nofollow noopener">documented runs</a> report roughly 10–22× faster warm compilation and materially lower peak RSS versus MetricFlow in-process, with end-to-end cold CLI comparisons showing larger gaps because MetricFlow pays substantial Python import and parse overhead per invocation. Treat those ratios as **scenario-specific**, not universal speedup claims; large models may narrow or widen the gap. Reproduction scripts and raw JSON live on the benchmarks page.

For a product-oriented introduction to Dosi as Studio infrastructure, see [Introducing Dosi](/blog/introducing-dosi). For where Ossie ends and MetricFlow begins in the stack, keep [OSI vs dbt MetricFlow](/blog/osi-vs-dbt-metricflow) as the companion read.

## 7. Where native execution fits in the semantic stack

Pull the layers together and a stable architecture emerges — one the working group has implied since the first OSI announcements:

1. **Author** semantic definitions in whatever tool your team already trusts, *or* maintain Ossie YAML directly when portability is the goal from day one.
2. **Interchange** through Ossie when definitions must move between tools, agents, or warehouses — the hub the [OSI explainer](/blog/open-semantic-interchange-osi) describes.
3. **Execute** through a native or platform-bound engine that compiles metrics to SQL and serves consumers.
4. **Govern** with validation gates, certification, and agent retrieval so stale YAML does not become stale numbers.

Native Ossie engines change step 3. Instead of "export to Ossie, import into engine X, query engine X," teams can query the same file they version in git — the same promise dbt brought to warehouse SQL, applied to vendor-neutral semantics.

That does not collapse the [semantic layer vs MetricFlow distinction](/blog/osi-vs-dbt-metricflow). MetricFlow remains a mature execution and authoring stack for dbt-centric teams. Ossie remains the interchange contract. Dosi occupies the execution slot **for Ossie-native shops** — multi-warehouse environments, agent-heavy consumption, or teams standardizing on YAML that must outlive any single BI vendor.

Agents amplify the case. Text-to-SQL without a semantic layer invents joins; text-to-SQL against a governed metric catalog resolves `revenue` to a certified definition. When that catalog is stored as Ossie YAML and queried through MCP, the agent inherits portability and governance in one path — provided a native engine exists to answer the call.

Multi-warehouse teams feel the split most acutely. A common 2026 pattern keeps Snowflake as the system of record while prototyping on DuckDB locally, or serves embedded analytics from Postgres while the lakehouse lives on BigQuery. Proprietary semantic objects do not travel across that boundary; Ossie YAML does, but only if something compiles it per dialect without a rewrite. Native engines turn "we standardized the file" into "we standardized the number everywhere we query" — the outcome interchange alone cannot guarantee.

None of this argues for rip-and-replace. Teams with deep MetricFlow investment should keep authoring there until portability requirements justify an Ossie-first path. The implementation taxonomy in §1–§4 is a decision guide: choose converters when migrating definitions; choose native engines when the Ossie file itself must run.

## Conclusion

**Apache ossie implementation** is not a single checkbox. Validators and converters implement the specification's interchange promise; native engines implement its execution promise. The Apache incubating project has delivered the former at scale and documented the latter on its roadmap without shipping a reference compiler yet.

Dosi is the first native Ossie execution engine: Rust-based compilation from OSI YAML to 15+ SQL dialects, with CLI, MCP, REST, and Python surfaces, operating as a Datus Studio component outside the open-source spec repo. That is a milestone for teams who want definitions and runtime aligned on the same open document — not a signal to skip converters, validators, or the working group's conformance work when it lands.

If you are building an Ossie strategy, start from the [Open Semantic Interchange overview](/blog/open-semantic-interchange-osi), clarify whether you need interchange-only or execution-native paths, and map your current [semantic layer](/blog/what-is-semantic-layer) investments before rewriting anything. Align on the hub first; choose engines second.

## Frequently asked questions

### What is the difference between an Ossie converter and a native Ossie engine?

A **converter** translates semantic definitions between Ossie YAML and another format — for example, MetricFlow YAML to Ossie — to prove the mapping or to migrate assets. It runs at build or export time and does not answer queries. A **native engine** loads Ossie YAML as the maintained model, plans semantic queries, and compiles SQL (or serves results) at runtime. Converters get definitions onto the interchange hub; engines let you query from the hub directly.

### Does Apache Ossie ship a reference execution engine?

Not as of August 2026. The <a href="https://github.com/apache/ossie/blob/main/ROADMAP.md" rel="nofollow noopener">Apache Ossie roadmap</a> lists a semantic query language and reference compiler as planned deliverables, including conformance tests. The incubating repository ships validators, spec documents, and reference converters. Independent engines such as Dosi implement execution ahead of that reference code, which is consistent with how other Apache projects have matured — spec and converters first, canonical runtime later.

### Is Dosi the only way to run Ossie models?

No. Platform-specific import paths, dbt MetricFlow, warehouse semantic views, and other semantic layers remain valid execution choices — often with richer governance features today. Dosi is the **first** engine that executes directly from Ossie YAML across many dialects without requiring an intermediate proprietary authoring format. Teams should pick execution based on warehouse, governance, and existing toolchain fit, not on novelty alone.

### Is Dosi open source?

No. Dosi is a Datus Studio component. The Ossie specification itself is Apache 2.0; Dosi's engine source and licensing are product offerings separate from the incubating spec repository. Open-source Datus adapters can author and validate Ossie in agent workflows; running those models through Dosi is a commercial runtime path.

### How should I evaluate benchmark claims about Ossie engines?

Ask which semantic fixture and query matrix were used, whether comparisons include process startup overhead, and whether results were validated for numerical equivalence. Dosi's published benchmarks use the MetricFlow `simple_model` fixture converted to Ossie — a small model — and document cold versus warm methodology on <a href="https://dosi.datus.ai/benchmarks/" rel="nofollow noopener">dosi.datus.ai/benchmarks</a>. Use those numbers to understand compiler behavior on a controlled fixture, not as guaranteed production performance.

### Where does Dosi fit if we already use dbt MetricFlow?

MetricFlow excels when dbt is your authoring and governance system. Ossie enters when you need definitions to outlive that stack or feed non-dbt consumers — agents, second warehouses, embedded analytics. Dosi executes Ossie YAML directly; dbt teams can keep MetricFlow as the authoring path and treat Ossie as interchange when portability matters. The two layers are complementary; see [OSI vs dbt MetricFlow](/blog/osi-vs-dbt-metricflow) for the full split.

## Related articles

- [Open Semantic Interchange (OSI)](/blog/open-semantic-interchange-osi/) — the standard this engine implements.
- [Why OSI needs an execution engine](/blog/why-osi-needs-execution-engine/) — the interchange-vs-runtime gap.
- [Introducing Dosi](/blog/introducing-dosi/) — the product overview of the engine.
- [OSI vs dbt MetricFlow](/blog/osi-vs-dbt-metricflow/) — where Ossie ends and MetricFlow begins.
- [What is a semantic layer?](/blog/what-is-semantic-layer/) — the category context.
