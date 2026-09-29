---
title: "Why Text-to-SQL Fails Without a Semantic Layer"
description: "Text-to-SQL breaks on real warehouses because the model guesses what your data means. See why NL2SQL fails and how a semantic layer fixes accuracy."
author: "Evan Paul"
date: 2026-09-25
lastmod: 2026-09-25
head:
  - - meta
    - name: keywords
      content: "text-to-sql, text to sql, nl2sql, natural language to sql, text-to-sql agent, text-to-sql llm"
  - - meta
    - property: og:title
      content: "Why Text-to-SQL Fails Without a Semantic Layer"
  - - meta
    - property: og:description
      content: "Text-to-SQL breaks on real warehouses because the model guesses what your data means. See why NL2SQL fails and how a semantic layer fixes accuracy."
  - - meta
    - property: og:type
      content: article
  - - meta
    - property: og:url
      content: https://datus.ai/blog/why-text-to-sql-fails-without-a-semantic-layer/
  - - meta
    - property: og:image
      content: https://datus.ai/logo_dark.svg
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - link
    - rel: canonical
      href: https://datus.ai/blog/why-text-to-sql-fails-without-a-semantic-layer/
---

# Why Text-to-SQL Fails Without a Semantic Layer

## TL;DR

- **Text-to-SQL** (NL2SQL) fails on production data because the model has to *guess* what your data means — it can read table and column names, but not your definitions of "active user," "revenue," or "churn."
- The failure is silent. Text-to-SQL rarely says "I don't know." It returns a confident, plausible query that is quietly wrong.
- On the BIRD benchmark — large, messy, real-world databases — even the best models cap out around 82% execution accuracy, still well below the 93% human baseline, with **no semantic layer** involved.
- A **semantic layer** removes the guessing by defining metrics, dimensions, and joins once, so the model queries meaning instead of raw schema.
- A 2026 dbt Labs benchmark found the same 11 questions scored 64.5% via raw text-to-SQL versus 72.7% via a semantic layer overall — and inside the semantic layer's defined scope, the gap widens to roughly 51–62% versus 100%.
- A bigger model helps a little, then plateaus. The problem is missing information, not missing intelligence.

**Text-to-SQL** (also written *text to sql*, and often called **NL2SQL** or **natural language to SQL**) is the technique of turning a plain-English question into a SQL query. It works beautifully in demos. It breaks in real warehouses — and the reason is almost never the model. It is missing context. This post explains exactly where [text-to-SQL](/blog/what-is-text-to-sql/) falls down, why bigger models don't fix it, and how a semantic layer closes the gap.

## What text-to-SQL actually does

A text-to-SQL system takes three things: the user's question, some representation of the database, and a language model. It outputs SQL.

The "representation of the database" is the whole ballgame. In most implementations, that representation is the **raw schema** — table names, column names, maybe a data dictionary. The model then infers, from those names alone, how to answer the question.

That inference step is where accuracy goes to die.

## Why text-to-SQL fails on real data

### The model guesses business meaning from column names

A column called `rev_q3_net_usd` tells you almost nothing about *when* revenue is recognized, whether it's gross or net of refunds, or which currency conversion date applies. Your team knows this. The model does not.

So when someone asks "What was revenue last quarter?", the model picks a plausible column and writes plausible SQL. Plausible is not correct. This is the core failure of **NL2SQL** on production data: schema is not semantics.

### Joins and grain are ambiguous

Real warehouses have fact tables, dimension tables, slowly changing dimensions, bridge tables, and multiple valid join paths. A question like "orders per customer by region" requires knowing the correct grain and the correct join — decisions that live in analysts' heads, not in the DDL. Resolving that mapping correctly is what [schema linking](/blog/what-is-schema-linking/) is for, and it's the dominant accuracy bottleneck in production text-to-SQL.

Given two valid join paths, a text-to-SQL model will confidently choose one. It won't tell you it was a coin flip.

### One term, many definitions

"Active user" might mean *logged in within 7 days* to the product team and *had a billable event within 30 days* to finance. Without a governed definition, the model invents one — and different questions get different invented definitions, so numbers stop reconciling.

This is why **natural language to SQL** tools produce "an answer" but not "the answer."

### Silent failure is the real danger

A wrong chart that looks right is worse than an error. Text-to-SQL rarely says "I don't know." It returns a confident query with a confident number, and nothing tells you it was a guess.

The standard academic test for text-to-SQL is **BIRD** — a benchmark built specifically to measure how models handle large, messy, real-world databases, unlike earlier benchmarks such as Spider that used small, clean schemas. BIRD matters here because it isolates the exact problem above: it hands the model the raw schema plus real database values — **no semantic layer** — and scores whether the generated SQL returns the right result ("execution accuracy"). When BIRD was introduced, the best model reached only **40.08%** execution accuracy against **92.96%** for humans (<a href="https://arxiv.org/abs/2305.03111" rel="nofollow noopener">Li et al., 2023</a>). Systems have improved sharply since — the current leaderboard top is **82.39%** (<a href="https://bird-bench.github.io/" rel="nofollow noopener">BIRD leaderboard</a>, accessed September 2026) — but note two things: that ceiling is still reached *without* a semantic layer, and BIRD's databases are still far cleaner and better-documented than a production warehouse with 400 undocumented tables. Benchmark accuracy is not your accuracy.

## The same question, two ways

Abstract failure modes are easy to dismiss, so here are two concrete ones. In each case the question is identical; only the data context changes.

*(The semantic-layer snippets below are illustrative pseudo-SQL — they show the idea of querying a governed metric. In Dosi you define metrics in an open YAML model and Dosi compiles them to native warehouse SQL; you don't hand-write these queries.)*

### Example 1 — "What was revenue last quarter?"

Text-to-SQL on the raw schema has to guess which column means "revenue":

```sql
-- Raw schema: the model guesses a plausible column
SELECT SUM(total_amount) AS revenue
FROM orders
WHERE order_date >= '2026-04-01' AND order_date < '2026-07-01';
```

This silently includes refunded and canceled orders, uses gross order value instead of recognized net revenue, counts internal test accounts, and filters on `order_date` rather than the revenue-recognition date. The number looks fine. It is wrong.

With a semantic layer, `net_revenue` is already defined — recognized revenue, net of refunds, excluding test accounts, on the recognition date:

```sql
-- Semantic layer: the metric definition is fixed and governed
SELECT SUM(net_revenue)
FROM semantic.metrics
WHERE time_grain = 'quarter' AND period = '2026-Q2';
```

Same question, one governed definition, and the number reconciles with finance.

### Example 2 — "Active users by region last month"

On raw schema, there are several valid join paths and the model picks one without telling you:

```sql
-- Raw schema: one of many possible joins, chosen silently
SELECT r.region, COUNT(DISTINCT u.user_id) AS active_users
FROM users u
JOIN orders o ON o.user_id = u.user_id
JOIN region r ON r.id = o.region_id
WHERE o.created_at >= '2026-08-01'
GROUP BY r.region;
```

Here "active" was guessed as *placed an order* (your team may define it as *logged in*), region is taken from the order rather than the user, anyone who didn't order is dropped by the inner join, and a many-to-many path can fan out and double-count. With a semantic layer, `active_users` and the `region` dimension carry a defined entity and grain:

```sql
-- Semantic layer: metric + dimension already model the entity and grain
SELECT region, active_users
FROM semantic.metrics
WHERE time_grain = 'month' AND period = '2026-08';
```

The point is not that the model writes bad SQL syntax. It usually doesn't. The point is that **correct syntax over ambiguous meaning still produces a wrong answer** — and only a semantic layer removes the ambiguity.

## Why a bigger model doesn't fix it

Teams often respond to bad text-to-SQL output by upgrading the LLM. It helps a little, then plateaus.

The reason: the problem is **missing information**, not missing intelligence. No model can know that your `is_active` flag excludes internal test accounts, or that revenue must be joined through the contract table, unless something tells it. Better reasoning about data it can't see still produces wrong SQL.

You don't need a smarter guesser. You need to stop guessing.

## What a semantic layer changes

A [semantic layer](/blog/what-is-semantic-layer/) is a governed definition of your data's meaning: metrics, dimensions, entity relationships, join grain, filters, and time grains — defined once, outside any single dashboard or query tool.

Put a semantic layer between the user and the warehouse, and the text-to-SQL flow changes:

| | Text-to-SQL on raw schema | Text-to-SQL on a semantic layer |
| --- | --- | --- |
| What the model sees | Table and column names | Defined metrics, dimensions, relationships |
| "Revenue" | Guesses a column | Uses the one governed definition |
| Joins / grain | Infers a path | Uses the modeled path |
| Failure mode | Confident wrong number | Constrained, consistent query |
| Consistency | Varies by question | Same definition everywhere |

Instead of *"write SQL against 400 tables,"* the model's job becomes *"map this question to defined metrics and dimensions."* That is a far smaller, far more reliable problem. This is the difference between an agent that **writes SQL from raw schema and can get it wrong**, and one that **calls a semantic layer that already knows what a metric means**.

### The measured difference

This isn't just theory. In a <a href="https://docs.getdbt.com/blog/semantic-layer-vs-text-to-sql-2026" rel="nofollow noopener">2026 benchmark published by dbt Labs</a> — 11 questions, each run 20 times across several LLMs — the same questions scored **64.5% with text-to-SQL on the raw schema versus 72.7% through the semantic layer**. Restricted to questions inside the semantic layer's defined scope, the gap widens: text-to-SQL sat at **51–62%** while the semantic layer reached **100%**. Two findings matter most for production use:

- **The failure mode flips.** With text-to-SQL, failure looks like a plausible but incorrect answer. With a semantic layer, failure looks like an error message — it refuses rather than silently returning a wrong number.
- **Model choice stops mattering.** Once queries go through defined metrics, most models hit near-100% regardless of reasoning effort, so you are no longer betting accuracy on which LLM you picked.

(These are vendor-run benchmarks — dbt sells a semantic layer — so treat the figures as directional, not independent. The direction is consistent with the BIRD results above and with our own experience.)

## How Dosi approaches this

Dosi is a semantic layer engine for metrics. You define your metrics and model once in an open, portable format, and Dosi compiles them into correct warehouse SQL across 16 engines — including Snowflake, BigQuery, Databricks, Trino, ClickHouse, StarRocks, and PostgreSQL. Define once, use everywhere.

For AI and agent workflows, Dosi ships a [native MCP server](/blog/dosi-mcp-semantic-layer-for-agents/), so an LLM agent can discover defined metrics, preview the SQL, and execute it — rather than reverse-engineering your schema and hoping. The result is text-to-SQL that stays inside the guardrails your team already agreed on. See [Introducing Dosi](/blog/introducing-dosi/) for the full product overview.

A note on precision: Dosi is built on the open [Apache Ossie](/blog/open-semantic-interchange-osi/) standard and is vendor-neutral with no lock-in, but it is **not open-source software** — it is licensed under the Elastic License 2.0 as part of Datus Studio. The open-source component is **datus-agent**, the CLI data agent. We keep those distinct because it matters when you evaluate the stack.

## When raw text-to-SQL is fine

Be honest about the trade-off. Direct **text-to-SQL** on raw schema is reasonable when:

- The data is exploratory and disposable (a one-off notebook, a scratch analysis).
- The schema is small, flat, and unambiguous.
- A wrong answer is cheap and easy to catch.

It becomes a liability the moment answers feed a dashboard, a decision, or a customer. That is exactly where a semantic layer earns its place.

## Frequently asked questions

### Is text-to-SQL the same as NL2SQL?

Yes. **Text-to-SQL**, **NL2SQL**, and **natural language to SQL** all mean converting a plain-language question into a SQL query. The terms are used interchangeably; the accuracy challenges are identical regardless of which name a vendor uses.

### Why does text-to-SQL work in demos but fail in production?

Demos use small, clean, well-named schemas where meaning is obvious. Production warehouses have hundreds of tables, ambiguous columns, multiple join paths, and business definitions that live in people's heads. The model guesses — and on complex real data, guessing fails.

### Does a semantic layer replace text-to-SQL?

No — it makes text-to-SQL reliable. The model still translates the question; the semantic layer supplies the governed meaning (metrics, dimensions, joins) so the generated SQL is consistent and correct instead of plausible and wrong.

### Do I need a semantic layer for an AI data agent?

If the agent's answers inform real decisions, yes. An agent writing SQL from raw schema will produce confident but inconsistent numbers. An agent calling a semantic layer queries definitions your team already trusts, which is what makes agentic analytics safe to deploy.

## The takeaway

Text-to-SQL doesn't fail because models are weak. It fails because raw schema carries no business meaning, so the model has to guess — and guesses don't reconcile, don't warn you, and don't scale. A semantic layer replaces guessing with governed definitions, and that is the difference between a party trick and a tool your team can trust.

If you're building **text-to-SQL** or an AI data agent on a real warehouse, start from the meaning, not the schema.

## References

1. Li, J., et al. (2023). <a href="https://arxiv.org/abs/2305.03111" rel="nofollow noopener">Can LLM Already Serve as A Database Interface? A BIg Bench for Large-Scale Database Grounded Text-to-SQLs (BIRD)</a> — best-model execution accuracy 40.08% vs. human 92.96%.
2. <a href="https://bird-bench.github.io/" rel="nofollow noopener">BIRD Benchmark Leaderboard</a> (accessed September 2026) — current top test-set execution accuracy 82.39% (no semantic layer); human baseline 92.96%.
3. dbt Labs (2026). <a href="https://docs.getdbt.com/blog/semantic-layer-vs-text-to-sql-2026" rel="nofollow noopener">Semantic Layer vs. Text-to-SQL: 2026 Benchmark Update</a> — 64.5% text-to-SQL vs. 72.7% semantic layer overall (11 questions × 20 runs); 51–62% vs. 100% for in-scope questions; "failure looks like an error message." Vendor-run.
4. Neo4j (2026). <a href="https://neo4j.com/blog/genai/cut-text2sql-token-costs-up-to-81-and-stop-paying-for-wrong-answers-a-neo4j-semantic-layer/" rel="nofollow noopener">Cut Text2SQL token costs up to 81%, and stop paying for wrong answers: a Neo4j semantic layer</a> — on large real schemas, accuracy and token efficiency improve markedly with a semantic layer. Vendor-run.

*Benchmark figures are directional. BIRD is an academic benchmark; dbt and Neo4j figures are vendor-published and not independently audited.*

## Related articles

- [What is text-to-SQL?](/blog/what-is-text-to-sql/) — the full text-to-SQL pipeline and glossary definition
- [What is a semantic layer?](/blog/what-is-semantic-layer/) — governed metrics and dimensions, defined
- [What is schema linking?](/blog/what-is-schema-linking/) — how agents map questions to the right columns and joins
- [Introducing Dosi](/blog/introducing-dosi/) — the OSI-native execution engine referenced above
- [What is agentic analytics?](/blog/what-is-agentic-analytics/) — the same governed-metrics problem, one multi-step plan at a time
- [Datus glossary](/glossary#ai-agents) — short definitions for text-to-SQL, schema linking, and related terms
