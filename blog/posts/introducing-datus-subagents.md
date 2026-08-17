---
title: "Introducing Datus Subagents: Specialized Workers for SQL and KPIs"
description: "Datus 0.3 ships built-in task subagents. AskMetrics answers KPIs from governed metrics; gen_sql and explore handle SQL and schema — not one universal chat."
author: "Kostja"
date: 2026-08-17
lastmod: 2026-08-17
head:
  - - meta
    - name: keywords
      content: "Datus Subagents, task subagents, AskMetrics, gen_sql, data engineering agent, specialized agents, governed metrics"
  - - meta
    - property: og:title
      content: "Introducing Datus Subagents: Specialized Workers for SQL and KPIs"
  - - meta
    - property: og:description
      content: "Datus 0.3 ships built-in task subagents. AskMetrics answers KPIs from governed metrics; gen_sql and explore handle SQL and schema — not one universal chat."
  - - meta
    - property: og:type
      content: article
  - - meta
    - property: og:url
      content: https://datus.ai/blog/introducing-datus-subagents/
  - - meta
    - property: og:image
      content: https://datus.ai/logo_dark.svg
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - link
    - rel: canonical
      href: https://datus.ai/blog/introducing-datus-subagents/
---


# Introducing Datus Subagents: Specialized Workers for SQL and KPIs

Datus subagents are specialized workers with their own prompt, tools, and session: `ask_metrics` answers named KPIs from published metrics, `gen_sql` writes warehouse SQL, `explore` reads schema first — so one chat does not carry every tool.

## TL;DR

- A **task subagent** is not a second product. It is a bounded worker: separate prompt, tool surface, conversation history, and optional scoped context, sharing the same project config as the main chat.
- **AskMetrics** is the KPI worker. It queries existing semantic metrics. If no published metric can answer, it says so. It does not invent SQL to look helpful.
- **Chat can delegate.** A metric-first question can go to `ask_metrics` through `task()`; a multi-table draft goes to `gen_sql`; unknown tables go to `explore` first.
- Domain chatbots — finance vs marketing, scoped tables, a link you hand a team — remain the [domain delivery model](/blog/subagents-domain-specific-data-agents/). This page is the 0.3 built-in roster, not that lifecycle.
- As of August 2026, configuration and the full built-in list live in the <a href="https://docs.datus.ai/0.3/subagent/introduction/">Subagent docs (0.3)</a>. This article is the product introduction.

## 1. The surface-area problem, not a model problem

An agent that holds every database, metric, and artifact tool in one prompt will answer with whichever tool looks fastest. That is the failure mode, not an edge case. A named KPI gets composed from a raw table because the metric tool and the SQL tool sat in the same tray. A schema-discovery pass dumps fifty tables into a report that only needed two. A visual-artifact run is allowed to `CREATE TABLE` because its tool list was copied from chat. One missing boundary, three different answers.

The failure is the surface area a worker is allowed to touch — the same defect that shows up when a [data engineering agent](/blog/what-is-data-engineering-agent/) is handed one prompt for a whole warehouse. A worker that may search metrics, write SQL, and mutate files will pick the path that looks fastest. Named KPIs need a path that cannot "helpfully" fall back to ad-hoc SQL. Unknown tables need a path that cannot write. Reports need a path that cannot wander the whole warehouse. When every tool has the same rights, every answer has the same odds.

Datus subagents exist so the main chat does not start every Monday as a generalist with a full keyring. The memory those workers read is [Datus Knowledge](/blog/introducing-datus-knowledge/). The workers themselves are how a question picks a lane.

## 2. The lane system: who is allowed to do what

The contract, in one paragraph:

> **Datus subagents** (0.3) are task-specific agents: a dedicated system prompt, a trimmed tool list, an independent session, and optional scoped context. Built-ins cover metric QA, SQL, exploration, semantic generation, and artifacts. Custom nodes in `agent.yml` wrap the same idea for a team. They share datasources and Knowledge. They do not share a junk-drawer of tools.

You invoke a built-in with `/ask_metrics` or `/gen_sql`, switch the default with `/agent`, or let chat call `task(type=...)`. Web and API can pin `subagent_id`. The lane is fixed before the question is answered — that is the point.

The roster below is the set that changes how a question is answered. Pipeline, scheduler, and skill-authoring nodes exist in docs; they are not this introduction.

| Subagent | The question it should get | What it refuses |
|----------|----------------------------|-----------------|
| **ask_metrics** | A named KPI in the subject tree, plus a time window and a group-by dimension — trends, attribution on **published** metrics | Raw-table SQL; inventing a metric that was never validated |
| **gen_sql** | Multi-table SQL when no metric exists, or a query that is not a KPI | Owning the certified formula |
| **explore** | "What tables and samples matter before we write anything?" | Writes, DDL, "just run it" |
| **gen_semantic_model** / **gen_metrics** | Draft a model or metric file from a table or from proven SQL | Publishing without validation |
| **gen_visual_report** | A shareable HTML narrative from a question, a metric, or SQL | Live filter-and-requery BI (that is a dashboard path) |

Delegation is shallow on purpose. Chat may hand work to a subagent. That subagent does not get a nested `task()` of its own. Depth stops at two. Most specialized nodes may only call `explore`. Chat is the orchestrator; workers do not become a second orchestrator.

Custom nodes reuse these types. A `sales_metric_qa` with `type: ask_metrics` is still AskMetrics: same metric tools, tighter description, optional tighter allowlist. It is not a new product. AskMetrics' default surface is metric tools for a reason; a custom node that widens that list to raw SQL is how a lane stops being a lane.

## 3. AskMetrics: the worker that cannot leave its lane

AskMetrics is the walkthrough because it is the sharpest lane change in the roster. The Knowledge store already says metrics-first; AskMetrics is the worker that **cannot** leave that lane.

It needs a configured semantic adapter and at least one published metric. MetricFlow and the [Datus OSI semantic adapter](/blog/datus-osi-semantic-adapter/) are both valid backends; OSI-authored metrics still execute through the configured engine. No adapter means no AskMetrics. That is a feature. A KPI chatbot that can silently become a SQL chatbot is how five "net revenue" implementations appear in five threads.

The path is short. Match a subject-tree path when the name is unambiguous. Search metrics only when the tree is missing or fuzzy. Call `get_dimensions` before grouping or attributing. Execute with `query_metrics`. If the question is "what drove the drop?", run attribution across candidate dimensions. Return Markdown: interpreted window, metric names, values, limits. No SQL dump. No invented number.

Now the refusal, which is the actual product. Ask for a number that no published metric can answer — a KPI validated in a spreadsheet and never published, a board definition that exists only as a slide. AskMetrics matches nothing in the subject tree, searches the metric store, finds nothing, and stops. It does not compose the answer from a confident-looking column, because its lane does not include raw-table SQL. It returns one line: not answerable from published metrics.

The handoff belongs to chat, not to AskMetrics. The next worker might be `gen_metrics` (turn signed-off SQL into a definition), `gen_sql` (the long tail), or `explore` (you do not yet know the tables). Chat can make that call. AskMetrics itself cannot — and that incapacity is the boundary holding.

Slash form, once the datasource is the one that owns the metrics:

```text
/ask_metrics What was total revenue last month by customer segment?
```

Turn limits, custom `type: ask_metrics` nodes, and the tool table belong in the <a href="https://docs.datus.ai/0.3/subagent/ask_metrics/">AskMetrics docs</a>.

## 4. Task workers vs domain delivery: two units, one word

One word, two deliverables. The [subagents delivery article](/blog/subagents-domain-specific-data-agents/) ships a *team* an interface: curated tables, a domain description, a feedback loop, eventually an API. The unit there is a business area. The built-ins on this page ship a *job*: ask a certified KPI, draft SQL, read the schema before drafting. The unit here is the task. Both are called "subagents"; they are not the same product.

A finance chatbot with ten tables and twenty metrics is still how you ship an interface to a team. This page does not retell that lifecycle, does not prescribe "start with five tables," and does not export an API. When the job is "give marketing a scoped chat," that is the delivery article. When the job is "this question may only be answered from a published metric," that is `/ask_metrics`. The two coexist: chat delegates to the task worker, and the domain chatbot is the interface the team talks to.

Nor is the word one more synonym for "agent." Chat remains the default conversational node; subagents are the specialists it may call. Publish every built-in as a public chatbot with no description and users end up asking revenue questions of `explore`.

## 5. Feel the fork: a two-question first session

The fastest way to see the product is not to reread the roster. Connect a datasource that already has a published metric and ask the same question you know the answer to twice.

1. **Ask once with `/ask_metrics`.** The worker matches the subject-tree path, confirms the group-by dimension, executes `query_metrics`, and returns Markdown — window, names, values, limits. No SQL dump.
2. **Ask the same question in ordinary chat.** The conversational node decides. If it recognizes a named KPI it delegates; if it does not, it may draft from schema. Inspect which worker ran and whether SQL appeared.
3. **Ask something that is not a KPI** — a row-level extract. AskMetrics refuses: not answerable from published metrics.

That two-question contrast is the whole design: one question, two lanes, one refusal you can verify by hand. The 0.3 introduction lists every built-in; this page only needs you to feel the fork. It is not a CLI reference and not a replacement for a domain rollout plan.

## Conclusion

Datus subagents are the task split we are introducing on top of shared memory: AskMetrics for published KPIs, `gen_sql` for the tail, `explore` before a draft, generation workers behind a validation gate. The work they save is not clicking `/agent`. It is the Monday answer that used a certified metric because the KPI worker was not allowed to write SQL.

The store those workers read is [Datus Knowledge](/blog/introducing-datus-knowledge/). The OSI authoring path that feeds AskMetrics is the [OSI semantic adapter](/blog/datus-osi-semantic-adapter/). The domain chatbot you hand a team is still [subagents as a delivery model](/blog/subagents-domain-specific-data-agents/). Use this page when you need to explain why one chat should not hold every tool.

## Frequently asked questions

### Is this the same as a finance or marketing subagent?

Same word, different job. A domain subagent is a scoped interface you deliver to a team. A task subagent is a built-in worker (`ask_metrics`, `gen_sql`, `explore`) with a fixed tool surface. You can wrap AskMetrics as `sales_metric_qa`. You should not expect `/ask_metrics` to replace a domain rollout.

### What if AskMetrics cannot find a metric?

It says the question is not answerable from published metrics. It does not generate SQL. Use `gen_metrics` to draft a definition from signed-off SQL, or `gen_sql` / `explore` for work that is not a KPI.

### Does chat always delegate?

No. Simple questions on known tables can stay on chat. Metric-first questions can go to AskMetrics; discovery goes to `explore`; heavy SQL goes to `gen_sql`. You can also invoke a worker directly with `/name` or pin it in the web UI.

### Can a subagent call another subagent?

Chat can. Nested workers cannot start a third level. Most specialists may only call `explore`. That cap is how you avoid an agent of agents with no owner.

### Do I need OSI to use AskMetrics?

No. You need a semantic adapter and published metrics. MetricFlow authoring is enough. OSI is the portable authoring format when you want source files that are not MetricFlow YAML. Either way, AskMetrics queries what already passed validation.

## Related articles

- [Subagents: domain-specific data agents](/blog/subagents-domain-specific-data-agents/) — the concept behind the feature.
- [What is a data engineering agent?](/blog/what-is-data-engineering-agent/) — the platform Subagents run on.
- [Introducing Datus Knowledge](/blog/introducing-datus-knowledge/) — the memory Subagents read from.
- [The Datus OSI semantic adapter](/blog/datus-osi-semantic-adapter/) — how AskMetrics resolves governed KPIs.
