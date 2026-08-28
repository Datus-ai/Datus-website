---
title: "Dosi vs MetricFlow: OSI-Native vs dbt-Centric Runtime"
description: "Compare Dosi and dbt MetricFlow as execution engines: same OSI interchange can feed dbt graph runtime or OSI-native multi-dialect compile — when to use each."
author: "Kostja"
date: 2026-08-25
lastmod: 2026-08-25
head:
  - - meta
    - name: keywords
      content: "Dosi vs MetricFlow, dbt MetricFlow, OSI-native runtime, semantic layer execution engine, Apache Ossie, multi-dialect SQL, benchmarks, dbt Semantic Layer"
  - - meta
    - property: og:title
      content: "Dosi vs MetricFlow: OSI-Native vs dbt-Centric Runtime"
  - - meta
    - property: og:description
      content: "Compare Dosi and dbt MetricFlow as execution engines: same OSI interchange can feed dbt graph runtime or OSI-native multi-dialect compile — when to use each."
  - - meta
    - property: og:type
      content: article
  - - meta
    - property: og:url
      content: https://datus.ai/blog/dosi-vs-metricflow/
  - - meta
    - property: og:image
      content: https://datus.ai/logo_dark.svg
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - link
    - rel: canonical
      href: https://datus.ai/blog/dosi-vs-metricflow/
---

# Dosi vs MetricFlow: OSI-Native vs dbt-Centric Runtime

An analytics team exports MetricFlow YAML to [Apache Ossie (OSI)](/blog/open-semantic-interchange-osi) and declares victory on portability. Then engineering asks the question that actually matters: *who executes the file?* MetricFlow still compiles through the dbt semantic graph; [Dosi](/blog/introducing-dosi) compiles OSI YAML directly to warehouse SQL across fifteen-plus dialects. Same interchange document — two execution paths. This comparison is about **runtime choice**, not whether OSI or MetricFlow "wins." For the format-vs-runtime split, see [OSI vs dbt MetricFlow](/blog/osi-vs-dbt-metricflow); here we compare what each engine does when OSI is the handoff format.

## TL;DR

- **dbt MetricFlow** is the mature, dbt-centric execution engine: semantic models and metrics live in the dbt project graph, compile to warehouse SQL, and scale through dbt Cloud's Semantic Layer API. It excels when dbt is already the governance system of record.
- **Dosi** is an OSI-native execution engine — a Datus Studio component that reads Ossie YAML and emits SQL for 15+ dialects via CLI, REST, MCP, and Python. It is the **first** engine built to compile OSI directly to multi-dialect SQL (as of August 2026); it is not open source and is not a dbt replacement.
- The same OSI export can feed **either** path: MetricFlow after re-import into the dbt graph, or Dosi without returning to MetricFlow YAML. The decision hinges on warehouse count, consumption surface (agents vs BI), and whether interchange — not dbt — is the long-term contract.
- Published benchmarks on the MetricFlow `simple_model` fixture show Dosi 10–22× faster warm compilation and materially lower memory versus MetricFlow in-process — **scenario-specific**, not production-scale proof.
- Neither path invalidates the other. dbt teams should keep MetricFlow for authoring and governance; OSI-first or multi-warehouse teams add Dosi when the YAML file itself must execute without a dbt runtime in the chain.

## 1. Same interchange file, two execution paths

Portability conversations stop at the export button. Execution conversations start immediately after. When a team runs the dbt (MetricFlow) → OSI converter — documented in the <a href="https://github.com/apache/ossie" rel="nofollow noopener">Apache Ossie repository</a> — it produces a vendor-neutral YAML file describing metrics, dimensions, datasets, and relationships. That file is interchange, not runtime. Something must still accept a semantic query (`net_revenue` by `region`, last closed month), plan joins, enforce grain, and emit dialect-correct SQL.

Two execution paths are now realistic for that handoff:

**Path A — dbt-centric runtime.** OSI YAML is converted back into MetricFlow semantic models (or maintained as MetricFlow YAML from the start). At query time, MetricFlow loads the dbt project graph, resolves entities and measures, and generates SQL for the connected warehouse. Governance, CI, and the dbt Cloud Semantic Layer API stay in the dbt orbit. OSI is the export format for downstream tools, not the primary input contract.

**Path B — OSI-native runtime.** OSI YAML is the maintained source. Dosi loads the file directly, plans the semantic graph from Ossie relationships, and compiles SQL per target dialect — Snowflake, BigQuery, Databricks, DuckDB, Spark, Trino, and others — without round-tripping through MetricFlow YAML. Agents call MCP tools; services call REST; engineers validate in CI with the CLI. The file in git is the program the runtime executes.

The fork is architectural, not ideological. MetricFlow remains the reference stack for dbt-native [semantic layer](/blog/what-is-semantic-layer) governance — pull requests, manifest lineage, dbt Cloud serving. Dosi occupies the slot described in [why OSI needs an execution engine](/blog/why-osi-needs-execution-engine): interchange without a mandatory return trip to a single vendor's authoring format. Teams can run both: author in MetricFlow, export OSI for portability, execute through Dosi on warehouses or agent paths where dbt is not deployed.

Consider a concrete split. Finance certifies `net_revenue` in a dbt project. Platform exports OSI for catalog ingestion and agent retrieval. Snowflake production still queries through MetricFlow because dbt Cloud already serves BI tools. A DuckDB sandbox for analysts and an MCP agent in Datus Agent compile the same OSI file through Dosi because no dbt runtime exists on those paths. One definition; two runtimes chosen by consumption context — not by declaring one stack obsolete.

## 2. What dbt MetricFlow executes

MetricFlow is the open-source engine behind dbt's Semantic Layer. Definitions are YAML semantic models and metrics inside a dbt project; the engine builds a semantic graph, validates grain and fan-out, and generates warehouse-specific SQL. The full architecture — semantic models, measures, derived metrics, time spine — is covered in the [dbt Semantic Layer & MetricFlow guide](/blog/dbt-semantic-layer-metricflow) and the <a href="https://docs.getdbt.com/docs/build/about-metricflow" rel="nofollow noopener">dbt MetricFlow documentation</a>; this section compresses what matters for execution comparison.

MetricFlow's input contract is **dbt semantic YAML tied to the project graph**, not raw OSI. Even when OSI is the export target, query-time execution expects MetricFlow's native representation: `semantic_model` blocks, `node_relation` pointers into the dbt manifest, metrics composed from measures across models. The dbt (MetricFlow) → OSI converter proves the mapping is lossless at the semantic level; running queries still requires MetricFlow (or a platform that re-imports OSI into an equivalent native model).

Strengths for execution comparison:

| Strength | Why it matters at runtime |
| --- | --- |
| **Git-native governance** | Metrics change through PRs and CI — the same loop analytics engineers already trust |
| **dbt graph integration** | Lineage, refs, and tests connect semantic models to physical models in one project |
| **Mature metric algebra** | Ratios, cumulative metrics, conversion metrics, and grain rules are battle-tested in production dbt estates |
| **dbt Cloud Semantic Layer API** | JDBC, GraphQL, and MCP serving for BI and agents at scale — when Cloud is in the stack |
| **Multi-engine SQL** | Snowflake, BigQuery, Databricks, Postgres, DuckDB generation from one definition set |

Limitations relative to an OSI-native path:

- **Single authoring format.** OSI is output, not the runtime input. Portable execution on a second warehouse without dbt means another conversion or a second MetricFlow deployment — not "point the same file and swap `--dialect`."
- **Python runtime overhead.** CLI and library invocations pay interpreter startup, imports, and model parse costs on every cold call — relevant for agent loops that compile frequently (see §6).
- **Consumption coupling.** Production serving often flows through dbt Cloud; standalone MetricFlow is real but ops-heavy for teams that only wanted a compile step from OSI.

MetricFlow is the right default when dbt is the system of record, one primary warehouse (or a dbt-managed multi-warehouse project) serves most consumers, and OSI is interchange for catalogs and future migration — not the executable contract for every path.

## 3. What Dosi executes

Dosi is a native Ossie execution engine: Rust-based compilation from OSI YAML to SQL, exposed through CLI, REST with Apache Arrow, MCP, and Python. Product introduction and surfaces are in [Introducing Dosi](/blog/introducing-dosi); native implementation taxonomy is in [First Native Apache Ossie Engine](/blog/first-native-apache-ossie-engine). For this comparison, the execution contract is the differentiator.

Dosi's input is **OSI YAML as the maintained model**. No prior step converts Ossie into MetricFlow semantic models for query time. The engine constructs a join graph from datasets and relationships, applies fan-out protection, resolves metric expressions and filters, and lowers the plan to a target dialect. Changing warehouse means changing a `--dialect` flag or API parameter — not maintaining a forked SQL file per engine.

Strengths for execution comparison:

| Strength | Why it matters at runtime |
| --- | --- |
| **OSI-native ingestion** | The interchange file is the runtime source — aligned with git-versioned portable semantics |
| **15+ dialect lowering** | One model compiles to Snowflake, BigQuery, DuckDB, Spark, Trino, and related variants from one OSS document |
| **Agent-oriented surfaces** | Native MCP with structured error codes; agents retry on grain and filter mistakes instead of inventing SQL |
| **Deterministic compile** | CI can gate merges on "OSI compiles for every production dialect" independent of dbt parse |
| **Low cold-start profile** | Rust binary with small memory footprint — relevant for high-frequency compile in agent tool loops |

Boundaries (confirmed product constraints):

- **Not open source** as of August 2026. Dosi is a Datus Studio component; documentation lives at <a href="https://dosi.datus.ai/" rel="nofollow noopener">dosi.datus.ai</a>. It is not a pricing or packaging announcement.
- **Not a dbt replacement.** Authoring, manifest lineage, and dbt Cloud governance remain MetricFlow's domain. Dosi compiles OSI; it does not subsume dbt project orchestration.
- **Not a catalog or converter matrix.** Dosi does not claim interoperability with Cube or Snowflake semantic-view converters as execution backends — those are separate import paths. This article stays on Dosi vs MetricFlow execution.
- **First, not only.** Dosi is the **first** native multi-dialect OSI execution engine shipped; the Apache Ossie roadmap still names a future reference compiler. Treat "first" as a milestone, not a permanent monopoly claim.

Inside Datus Agent, the **`datus-semantic-dosi`** adapter executes OSI metrics without MetricFlow in the chain — complementary to dbt-centric adapters when the governed object arrives as Ossie YAML. See [Dosi MCP for agents](/blog/dosi-mcp-semantic-layer-for-agents) for the agent consumption story; this page focuses on engine comparison.

## 4. Side-by-side: execution dimensions

The table below compares **runtime behavior** when semantic definitions are available as OSI — not whether OSI or MetricFlow is a better interchange format (that is [OSI vs dbt MetricFlow](/blog/osi-vs-dbt-metricflow)).

| Dimension | dbt MetricFlow | Dosi |
| --- | --- | --- |
| **Primary input** | MetricFlow / dbt semantic YAML in project graph | Apache Ossie (OSI) YAML |
| **OSI role** | Export/interchange target via converter | Native runtime input |
| **SQL generation** | Semantic graph → dbt-aware SQL per warehouse | OSI graph → multi-dialect SQL (15+) |
| **Governance home** | dbt project — PRs, tests, manifest lineage | OSI repository — compile gates per dialect |
| **Typical serving** | dbt Cloud Semantic Layer API, BI integrations | CLI / REST / MCP / Python; Studio adapter in Datus |
| **Agent compile loop** | MCP via dbt Cloud or embedded MetricFlow client | Native MCP with structured error codes |
| **Multi-warehouse without dbt** | Requires MetricFlow deployment per stack or re-conversion | Single OSI file; dialect parameter at compile |
| **Open source** | Engine: Apache 2.0; Cloud API: product | Engine: product (Datus Studio); spec: Apache 2.0 |
| **Best fit signal** | dbt is system of record; Cloud serving in place | Interchange-first; agents; heterogeneous warehouses |

Neither column "wins" universally. MetricFlow carries deeper dbt ecosystem integration today. Dosi carries OSI-native portability at query time without mandating the dbt graph on every consumer path.

## 5. Decision framework: when to stay MetricFlow vs when Dosi fits

Use this as a runtime checklist after definitions exist — in MetricFlow, in OSI, or in both via the converter.

**Stay on MetricFlow (Path A) when:**

- dbt already governs metrics, semantic models, and physical models in one project with CI your team trusts.
- dbt Cloud Semantic Layer API serves production BI, notebooks, and agents — and adding a second runtime would duplicate governance without clear benefit.
- One primary warehouse (or a dbt-managed set) covers nearly all consumption; OSI export satisfies catalog and migration documentation needs only.
- Analytics engineers live in MetricFlow YAML daily; OSI is an occasional export, not the maintained artifact.

**Add or prefer Dosi (Path B) when:**

- The **OSI file is the contract** — maintained in git, authored by generators, or received from partners — and consumers should not depend on MetricFlow YAML at query time.
- **Multiple warehouses** need the same metric SQL without standing up dbt + MetricFlow on each (local DuckDB, embedded Postgres, lakehouse BigQuery, enterprise Snowflake).
- **Agents compile frequently** — MCP tool loops, per-question semantic compile, CI validation across dialects — and cold-start or memory profile of the Python MetricFlow path becomes operational friction.
- **Datus Agent** (or another MCP client) should execute governed OSI metrics via **`datus-semantic-dosi`** while dbt remains the authoring system upstream.

**Run both deliberately when:**

- MetricFlow governs authoring and dbt Cloud serves canonical production dashboards.
- OSI export feeds catalogs, partner interchange, and agent sandboxes compiled by Dosi on paths without dbt.
- Convergence tests compare MetricFlow SQL vs Dosi SQL from the same OSI source until numerical equivalence is proven for your models — not assumed from converter success alone.

The failure mode to avoid is **double conversion without ownership**: export to OSI for optics, import into a second native format for every query, and maintain three representations that drift. Pick a **system of record** (MetricFlow YAML or OSI YAML) and pick **runtimes per consumption surface** — do not treat OSI as a passive archive.

## 6. Benchmarks: shared fixture, unequal cold starts

Performance matters most when agents or CLIs compile metrics on every turn — not when a BI server caches plans for hours. Dosi publishes an apples-to-apples benchmark against MetricFlow using the MetricFlow **`simple_model`** test fixture converted one-to-one to OSI — roughly twenty-five datasets and metrics, **not a production-sized semantic graph**. Full methodology, reproduction scripts, and raw JSON are on <a href="https://dosi.datus.ai/benchmarks/" rel="nofollow noopener">dosi.datus.ai/benchmarks</a> (July 2026 run).

**Fixture caveat (read first).** `simple_model` is a controlled differential-test model. MetricFlow's model parse time scales with graph size; Dosi's ~10 ms cold compile budget includes its parse on this small fixture. Large enterprise semantic graphs may narrow or widen reported ratios. Treat numbers as **compiler behavior on a shared fixture**, not guaranteed production speedup.

**Environment (documented).** AWS EC2, 4 vCPU, 15 GiB RAM; Dosi `cargo build --release`; MetricFlow editable install on CPython 3.12; DuckDB for execution comparisons. Queries validated for result-set equality between engines before timing.

**Warm compilation (most generous to MetricFlow).** MetricFlow measured in-process after warmup; Dosi measured as full fresh process per call (no daemon mode). Median speedups on SQL compile:

| Query pattern | Dosi (full process) | MetricFlow (in-process) | Ratio |
| --- | --- | --- | --- |
| Simple agg by dimension | 10.6 ms | 107.6 ms | ~10× |
| Three metrics, no dimension | 10.1 ms | 218.9 ms | ~22× |
| Ratio metric | 10.4 ms | 105.3 ms | ~10× |
| Expression metric | 10.4 ms | 205.0 ms | ~20× |
| Simple agg by time | 10.5 ms | 111.4 ms | ~11× |

**Cold CLI (process spawn → SQL printed).** MetricFlow cold path pays ~1.9 s fixed overhead (imports + model parse + client init) before compiling; Dosi pays ~2 ms process spawn and ~8 ms model work on this fixture — reported gaps of **~220×** on cold compile for the same queries. Real `mf query` CLI invocations may be slower than the benchmark's in-process cold path (the benchmark notes it omits click/config overhead favorable to MetricFlow).

**End-to-end on DuckDB (compile + execute).** With ~20 ms shared query time, Dosi cold end-to-end remains **~3–7× faster** than MetricFlow warm in-process on the fixture.

**Peak memory (cold process).** Compile: Dosi ~15.5 MB RSS vs MetricFlow ~157 MB; execute: ~26.5 MB vs ~162 MB on the same runs.

**How to use these numbers.** For platform engineers evaluating agent tool loops or per-request compile in serverless workers, warm and cold compile profiles explain operational cost — on a **small** model. For dbt teams with batch dashboards and long-lived MetricFlow processes, warm in-process MetricFlow times (~100–220 ms compile on this fixture) may be acceptable. Re-run benchmarks on **your** OSI export before capacity planning; do not extrapolate from `simple_model` alone.

## 7. Agents, pipelines, and the semantic stack together

Execution choice lands differently depending on who calls the metric.

**BI and analyst tools** historically consume MetricFlow through dbt Cloud — stable API, caching, access control. That path remains appropriate when Cloud is already provisioned and OSI is not the query-time input.

**Data engineering agents** compile often, fail on grain mistakes, and need structured recovery. An OSI-native MCP surface returns error codes an agent can act on — swap dimension, fix filter — instead of hallucinating warehouse SQL from YAML text. That is the design behind Dosi's MCP layer and the [Dosi MCP semantic layer for agents](/blog/dosi-mcp-semantic-layer-for-agents) article. MetricFlow's MCP exposure today flows through dbt Cloud's Semantic Layer for many teams — viable when Cloud is in stack; heavier when agents need compile-only on edge warehouses without Cloud.

**Multi-warehouse pipelines** benefit from OSI-native compile when the same metric must run on DuckDB locally and Snowflake in production without two dbt projects. MetricFlow can target multiple engines from one definition set, but each target still expects the dbt graph; Dosi expects only OSI and a dialect flag — different operational envelope, not a strict superset relationship.

Pulling threads from [first native Apache Ossie engine](/blog/first-native-apache-ossie-engine): converters get definitions onto the hub; MetricFlow and Dosi are two ways to execute from that hub — one through dbt's runtime, one through OSI-native compilation. The [semantic layer category](/blog/what-is-semantic-layer) still needs authoring, governance, and certification regardless of engine. Dosi does not remove that work; it removes the requirement that every execution path re-enter MetricFlow YAML after OSI export.

## Conclusion

**Dosi vs MetricFlow** is a runtime decision, not a standards war. MetricFlow executes dbt semantic models with mature governance and Cloud serving; Dosi executes OSI YAML natively across fifteen-plus dialects with agent-friendly compile surfaces. The same Ossie document can feed either path after export — choose based on where definitions live, how many warehouses compile them, and whether agents need OSI-native MCP without dbt in the loop.

Keep MetricFlow when dbt is the system of record and Cloud already serves production. Add Dosi when the OSI file must run on heterogeneous engines or high-frequency agent compile paths. Compare SQL outputs on your models before trusting converter equivalence. Read [Introducing Dosi](/blog/introducing-dosi) for product surfaces, [OSI vs dbt MetricFlow](/blog/osi-vs-dbt-metricflow) for interchange vs authoring, and <a href="https://dosi.datus.ai/benchmarks/" rel="nofollow noopener">Dosi benchmarks</a> for fixture-specific performance — with the `simple_model` scope caveat front and center.

## Frequently asked questions

### Can the same OSI file run on both MetricFlow and Dosi?

Yes — with different preparation. MetricFlow expects semantic models in its native YAML inside a dbt project graph, so OSI usually flows through the dbt (MetricFlow) → OSI converter in reverse (or parallel maintenance) before MetricFlow executes. Dosi loads the OSI file directly. Many teams **author in MetricFlow**, **export OSI** for portability, and **execute via Dosi** only on paths without dbt — agents, secondary warehouses, CI compile gates — while production BI stays on MetricFlow.

### Does Dosi replace dbt or MetricFlow?

No. Dosi replaces the **need for MetricFlow in the execution chain** only when OSI is the input contract and dbt governance is not required on that path. dbt project orchestration, manifest lineage, and dbt Cloud Semantic Layer serving remain MetricFlow's strengths. Dosi is a compile/runtime layer for OSI — complementary, not a rip-and-replace mandate for existing dbt estates.

### How is this different from OSI vs dbt MetricFlow?

[OSI vs dbt MetricFlow](/blog/osi-vs-dbt-metricflow) explains **interchange vs authoring format** — why OSI is a specification and MetricFlow is a runtime, and how the converter connects them. **This article compares two execution engines** when portable definitions exist: dbt-centric MetricFlow vs OSI-native Dosi. Read the former for the layer cake; read this page for runtime selection.

### Is Dosi faster than MetricFlow in production?

Not proven by published benchmarks alone. Documented runs on the MetricFlow `simple_model` fixture (small model, July 2026) show Dosi **10–22×** faster warm compilation and much lower cold CLI overhead versus MetricFlow — see <a href="https://dosi.datus.ai/benchmarks/" rel="nofollow noopener">dosi.datus.ai/benchmarks</a>. Large semantic graphs, long-lived MetricFlow processes, and dbt Cloud caching change the operational picture. Benchmark before assuming speedup in your environment.

### When should a dbt team adopt Dosi?

When OSI export is already part of the workflow **and** a consumer needs governed compile without MetricFlow on that path — MCP agents in Datus, DuckDB sandboxes, embedded analytics on Postgres, partner handoffs that must not require dbt licenses. Keep MetricFlow as authoring and primary serving; add Dosi as a secondary runtime with equivalence checks between emitted SQL and MetricFlow SQL for critical metrics.

### Is Dosi open source like MetricFlow?

MetricFlow's engine is Apache 2.0 open source; dbt Cloud's API is a product. Dosi's engine is a **Datus Studio component** and is **not open source** as of August 2026. The Ossie specification is Apache-licensed; Dosi is a commercial runtime for that spec — evaluate access and licensing separately from interchange adoption.

## Related articles

- [Introducing Dosi](/blog/introducing-dosi/) — the OSI-native engine, in full.
- [OSI vs dbt MetricFlow](/blog/osi-vs-dbt-metricflow/) — the interchange-vs-authoring layer beneath this comparison.
- [dbt Semantic Layer & MetricFlow](/blog/dbt-semantic-layer-metricflow/) — how MetricFlow works.
- [First Native Apache Ossie Engine](/blog/first-native-apache-ossie-engine/) — why OSI-native execution is a distinct category.
- [Dosi with Cube](/blog/dosi-with-cube/) — the other runtime pairing in the stack.
