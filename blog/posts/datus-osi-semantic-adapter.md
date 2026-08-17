---
title: "The Datus OSI Semantic Adapter: OSI In, MetricFlow Out"
description: "The Datus OSI semantic adapter authors vendor-neutral YAML, validates it, and queries metrics via MetricFlow without leaking backend fields into source models."
author: "Kostja"
date: 2026-08-17
lastmod: 2026-08-17
head:
  - - meta
    - name: keywords
      content: "Datus OSI semantic adapter, Open Semantic Interchange, OSI YAML, MetricFlow, vendor-neutral metrics, semantic layer interoperability, dbt MetricFlow adapter"
  - - meta
    - property: og:title
      content: "The Datus OSI Semantic Adapter: OSI In, MetricFlow Out"
  - - meta
    - property: og:description
      content: "The Datus OSI semantic adapter authors vendor-neutral YAML, validates it, and queries metrics via MetricFlow without leaking backend fields into source models."
  - - meta
    - property: og:type
      content: article
  - - meta
    - property: og:url
      content: https://datus.ai/blog/datus-osi-semantic-adapter/
  - - meta
    - property: og:image
      content: https://datus.ai/logo_dark.svg
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - link
    - rel: canonical
      href: https://datus.ai/blog/datus-osi-semantic-adapter/
---


# The Datus OSI Semantic Adapter: OSI In, MetricFlow Out

The Datus OSI semantic adapter lets the agent author metrics in vendor-neutral [Open Semantic Interchange](/blog/open-semantic-interchange-osi/) YAML, validate them, and query the certified ones through MetricFlow — without writing MetricFlow fields into the source model.

## TL;DR

- **OSI is the authoring format** in this path. MetricFlow is the default **execution backend** that renders SQL. They are not two products competing for the same file.
- `gen_semantic_model` and `gen_metrics` write strict OSI core YAML. Datus-specific hints (time grain, dataset, `offset_window`) live in `custom_extensions`, not as MetricFlow `type_params`.
- Nothing reaches [Datus Knowledge](/blog/introducing-datus-knowledge/) until `validate_semantic` and a `query_metrics` dry-run succeed. Failed drafts stay drafts.
- `ask_metrics` then lists, dimensions, and queries those published metrics. It does not invent a second formula when a certified one exists.
- As of August 2026 this is Datus 0.3: one global semantic layer setting, MetricFlow as the current backend, equality joins only. Configuration lives in the <a href="https://docs.datus.ai/0.3/adapters/osi_semantic_adapter/">OSI Semantic Adapter docs</a>.

## 1. Do not let the agent author the execution format

A semantic model that only exists as MetricFlow YAML is useful until the next tool needs the same KPI. Then someone copies `measure_proxy` and `type_params` into a second file, or the agent "helps" by emitting warehouse SQL that happens to match last quarter's number. The syntax is fine. The contract is not: the source of truth has become an execution artifact.

That is the failure [OSI vs MetricFlow](/blog/osi-vs-dbt-metricflow/) already names. OSI says what a metric means so another tool can read it. MetricFlow computes it so the warehouse returns the right grain. An agent that writes MetricFlow YAML as if it were the interchange format collapses those layers. Six months later you cannot move the definition, and you cannot tell which fields were business meaning and which were compiler hints.

The Datus OSI adapter exists so generation stays on the portable side of that line. The agent authors OSI core. The adapter compiles an internal IR and lowers it to MetricFlow. The YAML you keep in git should still look like OSI after a successful run.

## 2. OSI in, MetricFlow out: the adapter's two jobs

The adapter is a one-way boundary between the document and the compiler: [OSI in](/blog/open-semantic-interchange-osi/), MetricFlow out.

> `datus-semantic-osi` loads strict OSI core YAML, validates the schema, compiles it to Datus Semantic IR, and lowers that IR to an execution backend. In 0.3 the backend is MetricFlow. OSI is what users and generation agents write. MetricFlow YAML is a disposable plan, not the file you maintain.

Two repositories share the work. `datus-agent` generates OSI, dry-runs it, and syncs queryable metrics into Knowledge. `datus-semantic-adapter` ships the `datus-semantic-osi` package that does validate → compile → lower. You do not hand-write `data_source`, `measures`, or `measure_proxy` in OSI mode. If those strings appear in the source document, the adapter is no longer doing its job.

The authoring surface is deliberately narrow. Basic and conditional aggregates, ratios, rolling and cumulative windows, period-over-period via `offset_window`, and equality joins expressed as OSI relationships are in scope. Detail lists, `ROW_NUMBER` rankings, and TopN-per-group queries are not metrics; they stay on a SQL or query-layer path. Every execution construct that looks tempting — a window function, a `QUALIFY`, a hard-coded grain — is a reason to reach for the gate in step 4 instead of editing the source document.

## 3. The four-step loop: generate, validate, publish, ask

The product claim is a four-step loop, not a YAML tour.

**Generate.** Point `gen_semantic_model` at a table and you get one canonical dataset per physical table: fields, a time dimension marked `dimension.is_time`, keys only after they pass a full-table uniqueness check, relationships at the model — not a second dataset for every report. `gen_metrics` appends metrics under that model. The business expression stays in OSI `expression`. Grain, unit, and period offsets sit in `custom_extensions` with `vendor_name: DATUS`.

**Validate.** `validate_semantic` runs on the model, then on the full layer. `query_metrics(..., dry_run=True)` renders SQL without publishing a number. If either step fails, Knowledge does not receive the metric.

**Publish.** `publish_semantic_model` / `publish_metrics` sync the validated objects into Datus Knowledge. The store still does retrieval; the adapter still does execution. You do not get a second metric layer inside the knowledge base.

**Ask.** `ask_metrics` uses the same adapter interface — `list_metrics`, `get_dimensions`, `query_metrics` — and reads Datus metadata (`dataset`, `time_dimension`, `offset_window`, `grain_to_date`) to pick grain and comparison period. A question that names a certified KPI should not fall back to an invented aggregate because the column looked confident.

The loop is easiest to read on a question that would tempt a generalist to reach for raw SQL. Finance asks for month-over-month gross margin. The agent does not paste `LAG(margin) OVER (...)` into an OSI expression — window functions are not the authoring contract. It authors a base `gross_margin` metric, derives the period comparison with `offset_window: 1 month`, dry-runs both, publishes both, then answers from `query_metrics`. The SQL MetricFlow emits is an implementation detail. The file in the repo still says what "previous month" means.

## 4. The gate: drafts stay drafts

Validation is not a formality that runs after generation; it is the adapter's second job and the only reason its first job is safe. Because the source model stays OSI — portable, readable by any tool that speaks the standard — executability cannot come from the file itself. It comes from the gate.

`validate_semantic` first checks the model, then the full layer. `query_metrics` with `dry_run=True` renders the SQL MetricFlow would run and returns without executing or publishing a number. A metric passes only when both succeed. A draft that fails either check never enters [Datus Knowledge](/blog/introducing-datus-knowledge/); it stays in the generation session until it compiles.

Generation can be fast and optimistic precisely because publication is slow and strict; `publish_semantic_model` / `publish_metrics` sync only validated objects, so `ask_metrics` cannot see a file that looks structured but would fail at query time.

## 5. Peers, not migration: when to stay on MetricFlow

The adapter is a global setting, not a per-model migration you must finish this week. Set the semantic layer to `osi` in `agent.yml` and `gen_semantic_model`, `gen_metrics`, and `ask_metrics` all follow that format:

```yaml
agent:
  services:
    semantic_layer:
      osi:
        default: true
```

Node-level leftover fields are ignored. MetricFlow mode remains available when you want to author MetricFlow YAML directly. The two adapters are peers: if you already maintain MetricFlow YAML, stay on the MetricFlow adapter until you want the source files to be OSI. Existing MetricFlow projects keep working until you choose to move them.

That "not yet" is the honest part of the pitch. The adapter is not a replacement for MetricFlow, Cube, or a warehouse semantic view — those tools still execute or certify. It is not Snowflake OSI the product, and it is not a claim that every BI tool now imports OSI; the standard's native import story is still maturing. It is not a license to model every `SELECT` as a metric: ranked lists and row-level extracts need `gen_sql` or a pre-joined dataset, composite equality joins work, and non-equality predicates still need a query layer.

`execution_backend` defaults to MetricFlow. After you flip the switch, generate a model for one table you already trust, dry-run a metric you already know the number for, and only then ask `ask_metrics` a question whose answer you can check. Flags, extras, and join limits belong in the <a href="https://docs.datus.ai/0.3/adapters/osi_semantic_adapter/">0.3 adapter docs</a>, not in a product introduction.

## Conclusion

The Datus OSI semantic adapter is the product connection between a vendor-neutral authoring format and a governed query path: OSI in the repo, validation before Knowledge, MetricFlow at execution time, `ask_metrics` at the question. The work it saves is not typing YAML. It is the second copy of the same KPI that appears the first time someone treats an execution field as a definition — and the draft that would have reached Knowledge if the gate had not stopped it.

The standard itself is [Open Semantic Interchange](/blog/open-semantic-interchange-osi/). The layer split is [OSI vs MetricFlow](/blog/osi-vs-dbt-metricflow/). The store that receives a published metric is [Datus Knowledge](/blog/introducing-datus-knowledge/). When the question is a named KPI, the worker that should answer it is a [Datus subagent](/blog/introducing-datus-subagents/) — not a general chat inventing SQL.

## Frequently asked questions

### Does this replace MetricFlow?

No. MetricFlow is the default execution backend. OSI is what you author. The adapter compiles and lowers. You can still run the MetricFlow adapter and author MetricFlow YAML if that is the file you already govern.

### Is this the same as Snowflake OSI?

No. Snowflake's OSI work is a platform and working-group story. This adapter is Datus 0.3: agent generation, validation, Knowledge sync, and metric query through the configured backend. Do not treat a successful dry-run here as proof that a BI tool will import the same YAML tomorrow.

### What happens if validation fails?

The metric is not published. `ask_metrics` only sees objects that passed `validate_semantic` and a dry-run render. A broken draft stays in the generation session until it compiles.

### Can I write LAG or ROW_NUMBER in an OSI metric?

Not as the expression. Period comparisons use a base metric plus `offset_window` on a derived metric. Rankings and TopN detail queries are out of `gen_metrics` scope; use SQL or a precomputed dataset.

### Do I have to migrate every model to OSI this week?

No. MetricFlow and OSI are peer adapters. Switch the global semantic layer when you want new generation to emit OSI. Existing MetricFlow projects keep working until you choose to move them.

## Related articles

- [Open Semantic Interchange (OSI)](/blog/open-semantic-interchange-osi/) — the standard the adapter authors.
- [OSI vs dbt MetricFlow](/blog/osi-vs-dbt-metricflow/) — the two layers the adapter bridges.
- [Introducing Datus Knowledge](/blog/introducing-datus-knowledge/) — where the authored models live.
- [Introducing Datus Subagents](/blog/introducing-datus-subagents/) — the workers that query these metrics.
