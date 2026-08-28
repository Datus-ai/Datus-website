---
title: "Introducing Dosi: OSI-Native Semantic Layer for Metrics"
description: "Dosi compiles Apache Ossie (OSI) YAML into SQL across 15+ warehouse dialects — CLI, REST, MCP, and Python — so metrics are defined once and used everywhere."
author: "Kostja"
date: 2026-08-21
lastmod: 2026-08-21
head:
  - - meta
    - name: keywords
      content: "Dosi, OSI-native semantic layer, Apache Ossie, OSI YAML, multi-dialect SQL, metrics engine, semantic layer, MCP, Datus Studio, datus-semantic-dosi"
  - - meta
    - property: og:title
      content: "Introducing Dosi: OSI-Native Semantic Layer for Metrics"
  - - meta
    - property: og:description
      content: "Dosi compiles Apache Ossie (OSI) YAML into SQL across 15+ warehouse dialects — CLI, REST, MCP, and Python — so metrics are defined once and used everywhere."
  - - meta
    - property: og:type
      content: article
  - - meta
    - property: og:url
      content: https://datus.ai/blog/introducing-dosi/
  - - meta
    - property: og:image
      content: https://datus.ai/logo_dark.svg
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - link
    - rel: canonical
      href: https://datus.ai/blog/introducing-dosi/
---

# Introducing Dosi: OSI-Native Semantic Layer for Metrics

Dosi is an OSI-native semantic layer engine for metrics: take Apache Ossie (OSI) YAML in, get warehouse SQL out — in fifteen or more dialects, through a CLI, REST with Arrow, MCP, or Python. Tagline: **Define once. Use everywhere.**

## TL;DR

- **Dosi** is a Datus Studio component that natively compiles [Apache Ossie (OSI)](/blog/open-semantic-interchange-osi) YAML into executable SQL for metrics, dimensions, and filters — without rewriting the model per warehouse.
- It is the **first** engine built to compile OSI YAML to multi-dialect SQL natively (as of August 2026); it is not open source yet and is not a pricing or packaging announcement.
- Outputs cover **15+ warehouse dialects**; surfaces include CLI, REST + Apache Arrow, native MCP, and a Python SDK — with structured error codes agents can use to self-correct.
- In Datus Agent, the **`datus-semantic-dosi`** adapter runs OSI metrics without a MetricFlow dependency; docs live at <a href="https://dosi.datus.ai/" rel="nofollow noopener">dosi.datus.ai</a> and the <a href="https://docs.datus.ai/dev/adapters/semantic_adapters/" rel="nofollow noopener">semantic adapters guide</a>.

## 1. The semantic layer stops at the warehouse door

A [semantic layer](/blog/what-is-semantic-layer) is supposed to end the argument about what "active users" or "net revenue" means. In practice, the argument moves downstream. The YAML lives in a repo tuned for one stack. The Snowflake deployment uses `DATE_TRUNC` and `QUALIFY`; the BigQuery copy hand-rewrites window functions; the Spark job invents a third filter because nobody ported the `WHERE` clause. Each dialect is a fork of the same metric, and each fork drifts.

The drift shows up in places executives do not inspect. Finance certifies `net_revenue` with an exclusion list in the semantic model; the Trino path still sums gross lines because the filter never compiled. Product reads "weekly active users" from a dashboard whose Spark SQL counts sessions at a different grain than the OSI file specifies. A [data engineering agent](/blog/what-is-data-engineering-agent) asked the same question on two warehouses returns two numbers — not because the model is wrong, but because only one path ever received the governed compile output.

That failure mode is familiar to analytics engineers who already model in dbt MetricFlow, Cube, or a warehouse semantic view. The modeling work is real. The portability work is also real — and it is mostly mechanical translation, not new business logic. Teams that adopt [Open Semantic Interchange (OSI)](/blog/open-semantic-interchange-osi) want a single interchange file to describe metrics, entities, and relationships. What they still need is an engine that treats that file as the source of truth and emits SQL the warehouse will actually run.

Dosi exists for that gap. It is not another authoring UI and not a catalog. It is a compile step: OSI YAML in, dialect-correct SQL out, with interfaces humans and agents can call the same way. The accuracy argument for agent-driven analytics depends on that compile step being deterministic and inspectable; this article is the product introduction — what Dosi compiles, how you call it, and what it does not replace.

## 2. OSI-native compilation: one model, many dialects

Most semantic stacks assume one execution backend. MetricFlow targets the dbt graph; Cube targets its own API and pre-aggregations; warehouse semantic views target a single engine. OSI was designed to sit above those choices — a portable description of metrics and dimensions — but portability only matters if something compiles it reliably.

> **Dosi** is an OSI-native semantic layer engine for metrics. It reads Apache Ossie (OSI) YAML and produces SQL for metrics, dimensions, filters, and time grains in fifteen or more warehouse dialects. It does not replace your OSI authoring workflow; it executes the interchange format teams already export or generate.

The compilation path is deliberately narrow. Input is OSI YAML — the same shape the OSS community documents under <a href="https://ossie.ai/" rel="nofollow noopener">Apache Ossie</a>. Output is SQL strings (and structured metadata) suitable for direct execution or wrapping in an agent tool. Dosi does not ask you to maintain a second metric dictionary in a proprietary schema; the OSI file is the contract.

What travels through that contract is the vocabulary agents and analysts fight over in production: **metrics** with certified expressions, **dimensions** and entity relationships that fix join grain, **filters** that encode "exclude test accounts" once, and **time grains** that define whether "last month" means calendar month or fiscal period. Dosi resolves those objects into a single SQL statement per request — metric query, slice by dimension, apply filter set — rather than handing back a fragment your application still has to stitch together.

As of August 2026, Dosi is the **first** engine built to natively compile Apache Ossie YAML to multi-dialect SQL. That is a statement about what shipped, not a claim that no other tool will ever exist — and it is not an assertion that OSI is the only interchange format worth using. It means teams standardizing on OSI can point one compiler at Snowflake, BigQuery, Databricks, PostgreSQL, Spark, Trino, and the rest of the supported list instead of maintaining N hand-translated variants of the same `monthly_recurring_revenue` measure.

A concrete walkthrough: suppose OSI defines `monthly_recurring_revenue` with grain `month`, dimension `plan_tier`, and a filter excluding test accounts. Dosi parses the YAML, resolves entity joins and measure expressions, and emits dialect-specific SQL — `DATE_TRUNC` vs `DATE_TRUNC('month', …)` vs warehouse-specific calendar functions handled in the compiler, not in your pull request. Change the OSI file once; recompile for each target. That is the "define once" half of the tagline.

Validation belongs in the same loop. Because compilation is deterministic, teams can gate merges on "OSI compiles for every dialect we operate" the same way they gate dbt parse. A broken entity join or an ambiguous measure surfaces at compile time with a structured code — not as a wrong number in a Monday dashboard review. The "use everywhere" half of the tagline is the interface surface in the next section.

## 3. Surfaces agents and pipelines can share

Compilation alone does not help if every consumer reimplements the call pattern. Dosi exposes the same logical operations through four entry points, so a notebook, a CI job, a REST service, and an MCP client can request the same metric SQL without copying strings from a wiki page.

| Surface | Role | Typical caller |
|---------|------|----------------|
| **CLI** | Compile, validate, and inspect OSI locally or in CI | Analytics engineers, platform teams |
| **REST + Arrow** | Low-latency compile and result transport for services | Internal metric APIs, Studio backends |
| **MCP** | Tool definitions with structured errors for LLM agents | Datus Agent, Claude Desktop, custom copilots |
| **Python SDK** | Programmatic compile and test in data pipelines | Orchestration code, unit tests on metric SQL |

The MCP surface is worth separating from "yet another REST wrapper." Agents fail semantic tasks in repeatable ways: wrong grain, illegal filter combination, ambiguous dimension. Dosi returns **structured error codes** alongside human-readable messages so an agent can adjust the request — swap the time grain, drop an incompatible dimension, fix a missing entity join — instead of hallucinating a new formula. That pairs naturally with a data engineering agent that should execute governed metrics, not reinvent them from column names.

Consider a failure that looks like intelligence but is not: the model requests `churn_rate` sliced by `region` at `week` grain, but the OSI metric declares `region` incompatible with that measure's entity path. A generic text-to-SQL path invents a join through a table whose name contains "region" and returns a plausible percentage. Dosi returns a compile error with a machine-readable reason; the agent retries with an allowed dimension or asks the user to pick a valid breakdown. The loop is correction, not confabulation — the same design principle behind governed retrieval in [Datus Knowledge](/blog/introducing-datus-knowledge), applied at compile time.

REST responses use **Apache Arrow** where tabular compile metadata or small result previews apply, which keeps service-to-service calls efficient when Studio or an internal gateway fans out compile requests. The CLI remains the honest path for "does this OSI file compile cleanly before I merge?" — the same question teams already ask of dbt parse or SQLFluff, but anchored on the interchange file rather than a single warehouse dialect. Platform teams often wire that CLI into CI on the OSI repository: every pull request compiles against the dialects production actually runs, so portability regressions fail the build instead of the board meeting.

The Python SDK covers the middle ground — programmatic compile in orchestration code, golden-file tests that diff emitted SQL per dialect when OSI changes, and notebooks that prototype a metric before it lands in Studio. One semantic definition; four ways to invoke it; zero copy-paste from a Confluence page titled "Snowflake vs BigQuery churn SQL."

## 4. Dosi inside Datus Studio and Datus Agent

Dosi is a **Datus Studio component**. This article introduces the engine and how it connects to the agent stack; it does not describe Studio packaging, tiers, or pricing. If you are evaluating Datus as a platform, treat Dosi as the compile/runtime layer for OSI metrics inside that environment — not as a standalone SKU narrative on this page.

On the agent side, Datus ships a **`datus-semantic-dosi`** semantic adapter documented in the <a href="https://docs.datus.ai/dev/adapters/semantic_adapters/" rel="nofollow noopener">semantic adapters guide</a>. The adapter lets Datus Agent execute OSI-defined metrics **without requiring MetricFlow** in the path — important for teams that export OSI from generators, converters, or future authoring tools but do not run the full dbt semantic stack on every warehouse. [Datus Knowledge](/blog/introducing-datus-knowledge) still holds schema, reference SQL, and retrieval context; Dosi is the compile-and-execute face when the governed object is an OSI metric rather than ad-hoc SQL.

The division of labor looks like this in one question: an analyst asks for "churn rate by segment for the last closed month." Knowledge retrieval finds the certified OSI metric and entity graph. The semantic adapter calls Dosi to compile SQL for the connected warehouse dialect. The agent runs or explains the query — and if compilation fails, structured errors flow back into the correction loop instead of a one-off rewrite. MetricFlow, Cube, and warehouse semantic views can still own authoring in many estates; Dosi is the OSI execution engine when interchange — not a single vendor runtime — is the handoff format.

That adapter name — **`datus-semantic-dosi`** — is deliberate. Datus already supports semantic execution paths tied to other stacks; the Dosi adapter is the OSI-native branch. Configure it when your governed metrics arrive as Ossie YAML and you do not want MetricFlow in the execution chain. Keep other adapters when the certified object still lives in a backend-specific format. The agent's retrieval policy does not change; only the compile backend does.

For operators, the practical starting point is documentation, not a feature tour. The <a href="https://docs.datus.ai/dev/adapters/semantic_adapters/" rel="nofollow noopener">semantic adapters guide</a> covers wiring; <a href="https://dosi.datus.ai/" rel="nofollow noopener">dosi.datus.ai</a> covers compile APIs, dialect lists, and error code references. This introduction orients you to where Dosi sits — between interchange and execution — before you read those pages for flags, endpoints, and adapter configuration.

## 5. Boundaries: what Dosi is not

Clarity on scope prevents the usual semantic-layer category confusion.

Dosi is **not open source** as of August 2026. Follow <a href="https://dosi.datus.ai/" rel="nofollow noopener">dosi.datus.ai</a> for product docs and availability; do not treat it as an Apache-licensed sibling of Datus-agent in copy or deployment planning.

It is **not a replacement** for your entire semantic stack. OSI describes metrics; catalogs inventory tables; MetricFlow or Cube may still be where formulas are authored and tested. Dosi compiles and serves OSI — it does not magically migrate legacy LookML or proprietary YAML without an OSI export path.

It is **not a catalog or a memory layer**. If the agent needs schema search, proven SQL, and metrics-first retrieval, that remains [Datus Knowledge](/blog/introducing-datus-knowledge). Dosi answers "given this OSI file, what SQL runs here?" — not "which table did finance use last quarter?"

It does **not** subsume every interchange experiment. OSI interoperability work spans converters and test suites across vendors; this introduction stays on Dosi's compile path and agent adapter — not on vendor-specific converter test matrices or interoperability harness details.

For teams without OSI yet, the honest starting point is still a governed semantic layer definition and an export or generation path into OSS YAML. Dosi is the execution engine on the far side of that export — valuable when interchange is already a goal, premature if the organization has not agreed on metric definitions at all.

## Conclusion

Dosi closes the loop between portable metric definitions and warehouse-specific SQL. OSI YAML in; fifteen-plus dialects out; CLI, REST with Arrow, MCP, and Python on the side; structured errors for agents that need to fix grain and filter mistakes instead of guessing. Inside Datus, the `datus-semantic-dosi` adapter runs those metrics without MetricFlow in the path, alongside the retrieval layer Datus Knowledge already provides.

Read the <a href="https://dosi.datus.ai/" rel="nofollow noopener">Dosi documentation</a> when you are ready to compile your first OSI file; read [Dosi vs MetricFlow](/blog/dosi-vs-metricflow) or [Dosi with Cube](/blog/dosi-with-cube) when you are choosing runtime or stack shape; read [what OSI is](/blog/open-semantic-interchange-osi) when you need the interchange story. This page is the product introduction — not a migration guide, not a pricing sheet, and not a promise that every legacy semantic model converts itself overnight.

## Frequently asked questions

### Is Dosi open source?

No — not as of August 2026. Dosi is a Datus Studio component with documentation at <a href="https://dosi.datus.ai/" rel="nofollow noopener">dosi.datus.ai</a>. Datus-agent remains open source under Apache 2.0; Dosi is a separate compile/runtime layer for OSI metrics inside the Studio ecosystem.

### How is Dosi different from MetricFlow or Cube?

MetricFlow compiles dbt semantic models into SQL against the dbt graph; Cube serves metrics through its own semantic layer API and pre-aggregation engine. Dosi takes **Apache Ossie (OSI) YAML** as input and targets **multiple warehouse dialects** from that interchange file. Teams can keep authoring in their existing tool if it exports OSI; Dosi is the OSI-native compiler and runtime, not a drop-in replacement for every MetricFlow or Cube deployment. For execution-path depth, see [Dosi vs MetricFlow](/blog/dosi-vs-metricflow) and [Dosi with Cube](/blog/dosi-with-cube).

### What warehouses and dialects are supported?

Dosi emits SQL for **15+ warehouse dialects** as of August 2026 — covering the major cloud warehouses, Spark, Trino, PostgreSQL, and related variants documented on <a href="https://dosi.datus.ai/" rel="nofollow noopener">dosi.datus.ai</a>. The exact list evolves with releases; treat the product docs as canonical rather than this blog post.

### Can agents call Dosi directly?

Yes. Dosi exposes a **native MCP** interface with **structured error codes** so agents can compile metrics, detect invalid grain or filter combinations, and retry with corrected parameters. In Datus Agent, the **`datus-semantic-dosi`** adapter wraps that path for OSI execution without MetricFlow.

### Does Dosi replace Datus Knowledge?

No. Datus Knowledge is the agent's memory layer — schema, semantic models, reference SQL, templates, and metrics retrieved by meaning. Dosi compiles and executes **OSI metric definitions** into dialect-specific SQL. In practice, Knowledge finds *which* governed metric applies; Dosi produces *how* it runs on the connected warehouse.

### We do not use OSI yet — should we start with Dosi?

Start with governed metric definitions and whether your organization wants a portable interchange format. If you already export or plan to export **Apache Ossie YAML**, Dosi is the execution engine on the other side. If metrics still live only in tribal SQL and undocumented dashboards, fix definition and ownership first — a compiler does not substitute for agreement on what "net revenue" means.

## Related articles

- [Open Semantic Interchange (OSI)](/blog/open-semantic-interchange-osi/) — the interchange standard Dosi compiles.
- [First Native Apache Ossie Engine](/blog/first-native-apache-ossie-engine/) — the native-implementation framing behind Dosi.
- [Dosi vs MetricFlow](/blog/dosi-vs-metricflow/) — OSI-native vs dbt-centric runtime.
- [Dosi with Cube](/blog/dosi-with-cube/) — where Dosi and Cube fit in one stack.
- [Dosi MCP semantic layer for agents](/blog/dosi-mcp-semantic-layer-for-agents/) — how agents consume Dosi.
