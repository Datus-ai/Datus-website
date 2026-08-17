---
title: "Introducing Datus Knowledge: The Memory Layer for Data Engineering Agents"
description: "Datus Knowledge stores schema, semantic models, metrics, reference SQL, templates, and platform docs so a data engineering agent retrieves meaning — not a schema dump."
author: "Kostja"
date: 2026-08-17
lastmod: 2026-08-17
head:
  - - meta
    - name: keywords
      content: "Datus Knowledge, data engineering agent memory, semantic model store, reference SQL, context engine, schema retrieval, agent memory layer"
  - - meta
    - property: og:title
      content: "Introducing Datus Knowledge: The Memory Layer for Data Engineering Agents"
  - - meta
    - property: og:description
      content: "Datus Knowledge stores schema, semantic models, metrics, reference SQL, templates, and platform docs so a data engineering agent retrieves meaning — not a schema dump."
  - - meta
    - property: og:type
      content: article
  - - meta
    - property: og:url
      content: https://datus.ai/blog/introducing-datus-knowledge/
  - - meta
    - property: og:image
      content: https://datus.ai/logo_dark.svg
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - link
    - rel: canonical
      href: https://datus.ai/blog/introducing-datus-knowledge/
---


# Introducing Datus Knowledge: The Memory Layer for Data Engineering Agents

Datus Knowledge is the memory layer of the Datus agent: a searchable store of schema, semantics, metrics, proven SQL, templates, and platform docs, retrieved by meaning instead of dumped into the prompt.

## TL;DR

- **Datus Knowledge** is six components in one repository: schema metadata, semantic models, business metrics, reference SQL, reference templates, and platform documentation.
- Storage is dual-track — vectors for semantic search, a relational store for tasks, feedback, and success stories — isolated per datasource.
- When a question names a KPI, the agent looks up a governed metric first and generates ad-hoc SQL only when no metric exists.
- It is not a human data catalog, not a replacement for MetricFlow or Cube, and not "paste the DDL into ChatGPT."
- Configuration and commands live in the <a href="https://docs.datus.ai/0.3/knowledge_base/introduction/">Knowledge Base docs (0.3)</a>; this article is the product introduction.

## 1. Agents fail on memory, not on SQL

A [data engineering agent](/blog/what-is-data-engineering-agent/) that only sees `CREATE TABLE` statements will write SQL that runs. Running is the least interesting property of that SQL. The failures that show up in production are failures of meaning, and each one maps to something your team already knows but never stored. A model reads a column named `amount` in a line-item table and sums it into a headline number without checking whether the grain is order-level or line-level. It recomputes a KPI finance certified last quarter and lands a decimal off the board number. It drafts the schedule against last year's fiscal calendar because the query finance actually signed off on was never saved anywhere the agent could reach.

Each of those failures names a store in the next section: a semantic model for the grain, a business metric for the certified formula, reference SQL for the signed-off calendar. Column names do not encode "exclude test accounts," "this join duplicates rows," or "the fiscal quarter closes on `order_completed_at`, not `order_date`." A prompt that stuffs a thousand-table schema into context does not fix that. It dilutes the signal and still omits the tribal rules that never made it into DDL.

Datus Knowledge exists so the agent does not start from a stranger's view of your warehouse every Monday. It is the storage face of the context engine: inspect what exists, retrieve what this question needs, and keep what the team already proved. The accuracy argument for that loop is a different article; this one is the product — what gets stored, how the six parts cooperate on one question, and what you should not expect it to replace.

## 2. The six stores, one retrieval path

The six parts are easier to remember as a single path than as six products. Schema says what exists. Semantic models say how tables relate in business language. Metrics say how to compute the KPIs you already certified. Reference SQL says what worked last time. Templates say which parameterized queries are safe to rerun. Platform docs say whether this warehouse's SQL dialect will accept the draft. A question walks the path front to back; it does not open six apps.

> **Datus Knowledge** is a multi-modal repository that turns scattered data assets — tables, semantic models, KPIs, historical SQL, parameterized templates, and vendor docs — into one searchable memory for the Datus agent. It finds objects by business meaning, not by exact table names.

The name in the product docs is **Knowledge Base**. We introduce it here as **Datus Knowledge** because that is the job it does in the stack: hold what the agent is allowed to know, keep datasources from contaminating each other, and improve as feedback and new SQL land. Subagents — finance, growth, a metrics generator — read the same store with different scopes. They do not each maintain a private copy of a certified number.

| Component | Stores | The agent uses it to |
|-----------|--------|----------------------|
| **Schema metadata** | Table and column definitions, sample rows, statistics | Pick the right tables and see shape before writing SQL |
| **Semantic models** | Dimensions, measures, entity relationships | Join correctly and treat columns as grain, not as string labels |
| **Business metrics** | KPI definitions, subject-tree paths | Answer named metrics without reinventing the formula |
| **Reference SQL** | Historical queries, summaries, patterns | Reuse a proven shape instead of generating from zero |
| **Reference templates** | Jinja2 SQL with typed parameters | Produce stable, repeatable SQL for production questions |
| **Platform documentation** | Official docs chunked by platform and version | Check dialect and features before the query hits the engine |

Here is the same table as a walkthrough. An analyst asks: "What was gross margin by product family for the last closed quarter, using the board pack definition?" Schema metadata narrows the candidates to `fct_invoices` and `dim_products`, not `fct_sessions`. A [semantic model](/blog/what-is-semantic-model/) on those tables marks `gross_margin_usd` as a measure, `product_family` as a dimension, and `product_id` as the join key — so the agent does not invent a second path through a name that merely looks like a key. If `gross_margin` exists as a business metric, the agent queries that metric (grain, filter, time window included) instead of re-deriving the formula by hand. If the team has a validated board-pack query in reference SQL, that pattern is retrieved as a prior, not as a rumor. If this report runs every week, a reference template supplies the parameters (`start_date`, `product_family`) without letting the model rewrite the join. Platform documentation confirms the date function and the `QUALIFY` qualifier the warehouse actually supports.

That walkthrough is the product claim in one paragraph: six stores, one question, one retrieval, no schema dump. Think of it as Google for your data estate, with the extra requirement that the results have to be executable — a search that returns the right table but the wrong metric grain is a failed retrieval; one that returns validated SQL, the metric definition finance owns, and the dialect note that `QUALIFY` is legal here is a successful one.

The path runs on a dual-track backend. The **vector** track holds embeddings, which is what makes "gross margin by product family" retrieve `margin_by_family` even when the strings do not match. The **relational** track holds structured records — tasks, feedback, success stories — the proof that a retrieval was accepted or corrected. Semantic search without those records is a similarity toy; records without vectors cannot find the table whose name is `amt_usd_net_v2`. As of August 2026 the 0.3 docs describe exactly these six components and this dual-track backend. Unified search and incremental updates are how the store stays current; they are not a seventh component. Domain rules that never became YAML still show up as success stories and feedback in the relational track — they are not a separate "external knowledge" product in the 0.3 introduction.

## 3. Metrics first: the ordering rule that stops five "net revenue"s

A named KPI is where the retrieval path stops being search and starts being governance. The rule: when the question is a named KPI, Datus Knowledge is **metrics-first**. The agent searches semantic objects for a matching metric and executes it — typically through a MetricFlow-compatible path, documented in the <a href="https://docs.getdbt.com/docs/build/about-metricflow" rel="nofollow noopener">MetricFlow docs</a> for the YAML shape. Only if no metric exists does it fall back to composing SQL from models, reference queries, and templates.

Order is the feature, not the ranking. Without metrics-first, every KPI question is a fresh negotiation: the agent infers a formula, the analyst diffs it against the board number, the correction dies in a Slack thread, and the next chat starts over. One metric asked five ways becomes five implementations, each defensible, none authoritative. Metrics-first removes the negotiation by checking the registry before a single line of SQL is composed. The fifth `net_revenue` is never born because the first one was never forgotten.

That is also why Datus Knowledge does not pretend to be the authoring tool. MetricFlow, Cube, or a warehouse semantic view can still own the certified formula. Datus stores it, retrieves it, and keeps the ad-hoc tail those tools never modeled — the weekly query that became a template, the fix that never made it back to the semantic file.

## 4. The boundaries: catalog, semantic layer, and RAG slogans

Datus Knowledge sits next to three products it does not replace, and the boundary is a division of labor rather than a feature list. A [data catalog](/blog/what-is-data-catalog/) inventories assets so people can find tables; Datus Knowledge retrieves the subset an agent should use *this question*, including filters and SQL that catalogs usually do not execute. A semantic layer (or metric layer) is the governed dictionary; Datus Knowledge includes semantic models and metrics as two of six stores, then adds reference SQL, templates, and feedback that move faster than a modeling sprint. Retrieval-augmented generation is an access pattern; Datus Knowledge is the corpus and the update loop — embeddings plus records plus incremental rebuilds after schema and SQL change. Dumping DDL into a chat window has no such loop.

Two labels from the definition are worth retiring: it is not a generic wiki, and it is not a synonym for "vector database." A wiki is written for people to browse; a vector database is plumbing. Datus Knowledge is a product with an opinion about what gets stored and in what order it gets retrieved.

The division applies even when you already run one of these. You do not throw the catalog or the metric layer away. Datus Knowledge consumes what they already know and adds the layers they rarely store: reference SQL, templates, and the corrections that never became a pull request. Complementary, not a rip-and-replace.

## 5. Start small: bootstrap and inspect

To try it, connect a datasource and bootstrap the store. The smallest command is:

```bash
datus-agent bootstrap-kb --database <your_datasource>
```

Flags for check / overwrite / incremental, SQL directories, and subject trees belong in the docs, not in a feature introduction. After bootstrap, ask a question you already know the answer to and inspect what was retrieved — tables, a metric, a reference query — before you trust a number you have not seen. Cloud Personal on studio.datus.ai is the zero-install path if you do not want a local backend yet.

What you run on a laptop is intentionally boring: <a href="https://lancedb.com/" rel="nofollow noopener">LanceDB</a> for vectors and SQLite for records, with files under `data/datus_db_<datasource>/`. That path is enough for development and a single warehouse. Production teams that already operate Postgres can switch to <a href="https://github.com/pgvector/pgvector" rel="nofollow noopener">pgvector</a> plus native PostgreSQL, still through the same product interface. Isolation is per **datasource**: one LanceDB directory or one Postgres schema each, so a staging replica cannot leak tables into the production agent. You do not configure a "namespace" as a separate product concept in 0.3; you connect a datasource and the knowledge for that connection stays there.

This page is the product introduction, not the operator handbook — the docs hold flags, schemas, and templates. What should stick here is the ordering rule from the previous section and the bootstrap command above. It is not a migration guide and not a replacement pitch for your catalog or dbt project. If those systems exist, Datus Knowledge is the layer that reads them and remembers what they forget between sprints.

## Conclusion

Datus Knowledge is the memory layer for the Datus agent: six stores that behave as one retrieval path, metrics-first when a KPI already exists, generated SQL when it does not. The work it saves is not typing. It is the Monday cold start — the hunt for the board definition, the join that duplicates, the dialect note someone left in Slack.

The operating model behind that store is [contextual data engineering](/blog/contextual-data-engineering/). For the modeling object the agent retrieves most often, see [what a semantic model is](/blog/what-is-semantic-model/). For the category this memory serves, see [what a data engineering agent is](/blog/what-is-data-engineering-agent/). When a named KPI should hit a worker that cannot invent SQL, see [Datus subagents](/blog/introducing-datus-subagents/). When generation should emit portable OSI instead of backend YAML, see the [OSI semantic adapter](/blog/datus-osi-semantic-adapter/). Read the 0.3 docs when you are ready to wire storage; use this page when you need to explain to a teammate what actually sits under the chat.

## Frequently asked questions

### Is Datus Knowledge a data catalog?

No. A catalog answers "what exists?" for humans. Datus Knowledge answers "what should the agent use for this question?" — including metric logic, reference SQL, and templates. Many teams feed catalog metadata *into* the knowledge base. That does not make the knowledge base a catalog UI.

### Does it replace MetricFlow, Cube, or a warehouse semantic view?

No. Those tools author and serve certified metrics. Datus Knowledge retrieves them (metrics-first) and covers the long tail they never modeled. If you have no metric layer yet, generated semantic models are drafts for review, not an auto-committed certified layer.

### Should we run LanceDB or PostgreSQL?

LanceDB plus SQLite is the default: zero extra infrastructure, one directory per datasource, fine for development and single-machine use. PostgreSQL with pgvector is the production-shaped backend when you already operate Postgres and want native relational storage plus vector search. The product interface does not change; the backend does.

### How is this different from pasting DDL into the prompt?

A schema dump has no retrieval ranking, no metric execution path, no reference SQL, and no place for a correction to live until next week. Datus Knowledge stores those objects, searches them by meaning, and updates them incrementally. The prompt still has a context window; the knowledge base is how you stop filling that window with the wrong thousand columns.

### Where does "external knowledge" fit?

The 0.3 introduction centers six components. Business rules that are not metrics still enter as success stories, feedback, and subagent-scoped notes on the relational track. Treat that as part of the memory loop, not as a seventh product to buy separately.

## Related articles

- [What is a data engineering agent?](/blog/what-is-data-engineering-agent/) — the product Knowledge grounds.
- [Contextual data engineering](/blog/contextual-data-engineering/) — why durable context beats bigger prompts.
- [What is a semantic model?](/blog/what-is-semantic-model/) — one artifact Knowledge stores and retrieves.
- [The Datus OSI semantic adapter](/blog/datus-osi-semantic-adapter/) — how Knowledge feeds vendor-neutral metrics.
- [Introducing Datus Subagents](/blog/introducing-datus-subagents/) — the workers that consume Knowledge.
