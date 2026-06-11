---
title: "SQL Was Never the Hard Part: How Datus Turns AI-Generated SQL into Data You Can Trust"
description: "Why reliable AI data engineering needs knowledge, planning, review, controlled execution, and reconciliation, not just SQL generation."
date: 2026-06-11
lastmod: 2026-06-11
author: Datus Team
tags:
  - data engineering agent
  - agentic data engineering
  - SQL
  - reconciliation
head:
  - - meta
    - name: keywords
      content: "AI-generated SQL, data engineering agent, agentic data engineering, SQL reconciliation, data quality, Datus workflow"
  - - meta
    - property: og:title
      content: "SQL Was Never the Hard Part: How Datus Turns AI-Generated SQL into Data You Can Trust"
  - - meta
    - property: og:description
      content: "Why reliable AI data engineering needs knowledge, planning, review, controlled execution, and reconciliation, not just SQL generation."
  - - meta
    - property: og:type
      content: article
  - - meta
    - property: og:image
      content: https://datus.ai/blog/images/sql-was-never-the-hard-part/datus-workflow.svg
  - - meta
    - property: og:url
      content: https://datus.ai/blog/posts/sql-was-never-the-hard-part
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - meta
    - name: twitter:image
      content: https://datus.ai/blog/images/sql-was-never-the-hard-part/datus-workflow.svg
  - - link
    - rel: canonical
      href: https://datus.ai/blog/posts/sql-was-never-the-hard-part
---

# SQL Was Never the Hard Part: How Datus Turns AI-Generated SQL into Data You Can Trust

*Why we built data development around knowledge, plans, reviews, and reconciliation, not just generation.*

Any LLM can write SQL today. Paste in a schema, describe a metric, and you get something that runs. That was never the hard part.

The hard part is what data teams actually get paid for: understanding the business definition behind a metric, respecting the conventions buried in years of historical SQL, adapting logic across database dialects, handling NULLs the way the business expects, and then **proving the output reconciles with a trusted reference, row by row, column by column**.

This is the gap between a text-to-SQL demo and a data engineer. Datus is built to close it. This post explains how, using a real development task as the running example: building a product adoption mart from Pendo-style usage events, then reconciling it against a reference table of 24,995 rows at sub-1e-9 numeric tolerance.

The core idea is a workflow, not a model trick:

![Datus data development workflow: knowledge, plan, review, execute, reconcile](/images/sql-was-never-the-hard-part/datus-workflow.svg)

Five phases: initialize knowledge, plan and approve, review, execute, and reconcile. Each phase is enforced by a skill that constrains what the agent is allowed to do. The premise behind all five is simple: **"the SQL ran" is not done; "the SQL reconciles" is done.**

## A Task Where the Details Bite

To make the discussion concrete, consider the task we use throughout: build `marts.pendo__product_adoption_summary`, a table that tells Product and Customer Success teams which accounts have adopted which features, and how deeply. One row per **feature x account x application**, 13 output fields.

Most of the columns are aggregations any model can write. The trouble is concentrated in two derived fields that no model can guess without reading the requirement.

**Adoption level** classifies each row into five segments, evaluated in strict order:

| Segment | Rule |
|---|---|
| Power Users | `active_days >= 20 AND total_events >= 100` |
| Regular Users | `active_days >= 10 AND total_events >= 50` |
| Casual Users | `active_days >= 5 AND total_events >= 20` |
| Trial Users | `active_days >= 1 AND total_events >= 5` |
| Minimal Users | everything else, including rows where `total_events` is NULL |

**Feature health score** is a weighted composite, capped at 100, explicitly not rounded, and NULL when there are no non-null event counts:

```text
feature_health_score = total_users * 2 + avg_events_per_session * 5 + active_days * 3
```

Rule ordering. The cap. The no-rounding rule. NULL propagating through averages instead of collapsing to zero. These are exactly the details that silently diverge when SQL is generated from plausibility instead of from a requirement. A table that is 98% right is, for the business, simply wrong. Every phase of the workflow below exists to keep details like these from slipping through.

## Phase 1: Knowledge Before Generation

The first thing Datus does in a project is not write SQL. It reads the project's historical SQL: staging models, intermediate transforms, existing marts, and reference queries. Then it distills that work into a persistent, human-readable knowledge base: a project overview and asset index (`AGENTS.md`), extracted business rules and metric definitions, technical standards, and table- and field-level lineage.

This step is what most AI-SQL demos skip, and it is why most of them do not survive contact with a real warehouse. A warehouse is not a blank schema; it is an accumulation of decisions. How feature history gets deduplicated. What a "session" means in this company. Which filters are always applied and never written down anywhere except in the SQL itself.

After initialization, when Datus decides how to name a staging table or how to deduplicate a slowly changing source, it cites this knowledge base rather than its own habits. The knowledge base is also auditable: a human can read it and verify that the extraction was faithful before any of it influences generated code.

## Phase 2: No SQL Before an Approved Plan

The second rule is blunt: until a written plan is explicitly approved by a human, Datus will not write business SQL, create database objects, or modify ETL code.

For our adoption mart, a plan worth approving has to state the requirement boundary, the full object chain from raw sources through staging to the target mart, the grain and all 13 fields, the segment rules and score logic, the job files to be created, and the validation approach.

The point of the gate is economic. A misunderstanding caught at the plan stage costs one round of conversation. The same misunderstanding caught after execution costs a rerun; caught in production, it costs trust. The plan moves human judgment to where it is cheapest and forces ambiguity to surface as a question to the user rather than a guess inside a CTE.

Datus's planning rules encode this directly: explore project knowledge and metadata first, ask only about what remains genuinely unknown, and never guess a business definition.

## Phase 3: Review Before Execution

Generated SQL is reviewed against the plan and the requirement before anything runs. Not a vague "looks good" pass, but a targeted check where each axis maps to a real failure mode we see in practice:

| Review axis | The trap it catches |
|---|---|
| Requirement coverage | Segment rules evaluated in the wrong order, the 100-point cap forgotten, or a missing output field |
| Dialect compatibility | Reference SQL written for one engine, such as DuckDB, carried verbatim into another, such as PostgreSQL |
| NULL handling | Averages and scores returning 0 where the business definition says NULL |
| Type consistency | A score that should be DOUBLE silently cast to integer, passing row-count checks but failing reconciliation |

That last row is worth dwelling on. An integer-cast health score produces a table with the right shape, the right row count, and wrong numbers. Nothing about "the query succeeded" tells you this. Only review or reconciliation does.

## Phase 4: Execution as a Controlled Step

Execution is deliberately the most boring phase. Jobs live in version-controlled files, run through a consistent path, and are rerunnable. Historical reference SQL is read-only and never executed directly.

Boring is the point. When reconciliation later demands a fix-and-rerun loop, rerunning must be safe and cheap.

## Phase 5: Reconciliation Is the Definition of Done

The final phase compares the generated mart against a trusted reference, and it is where the workflow shows its character. The comparison is strict: row counts, column-by-column equality, numeric tolerance, and bidirectional `EXCEPT` checks, both rows in the result but not the reference and rows in the reference but not the result.

For the adoption mart, done means: 24,995 rows match, all 13 columns match, numerics agree within 1e-9, and both difference checks return zero rows.

When differences appear, and on a first pass they usually do, Datus enters a loop: compare, diagnose, fix the job SQL, rerun, and compare again. The rules governing this loop encode real data-engineering discipline:

- **Reference data is evidence, not an oracle.** It calibrates business logic, but even reference data gets its grain, filters, and extraction time questioned.
- **No cheating for a match.** Hard-coding keys, writing expected values into SQL, or excluding difference rows to force agreement are explicitly forbidden.
- **Every fix names its logic.** Each iteration must state which business rule changed and on what evidence: difference statistics, samples, source fields, or user confirmation.
- **Uncertainty gets escalated.** When a difference cannot be resolved from evidence, the agent asks instead of deciding.

A matching result is the success signal, not the goal. The goal is correct, rerunnable, explainable SQL. What reconciliation actually produces is an **evidence chain**: requirement -> knowledge base -> approved plan -> reviewed SQL -> reconciled output. That chain is what lets a human sign off on AI-built data without re-deriving every number by hand.

## Skills: Workflow as Code

Each phase is enforced by a Datus skill: `project-set-up`, `etl-plan`, `sql-review`, `execute-job`, and `data-compare`. A skill is a versioned, readable definition of what the agent may and may not do in that phase.

The constraints described above are not prompt-engineering folklore. They are written down in skill files, shipped with the project, and adjustable per team.

This is the part we think matters most for the next few years of AI data engineering. Model capability will keep rising on its own. What teams control is the process their agents follow. Encoding that process as explicit, inspectable skills is how "the agent did it" becomes an acceptable answer in a data-quality review.

## The Takeaway

Three principles matter more than which model you run:

1. **Knowledge before generation.** Mine the project's historical SQL first, so generated code inherits the team's actual conventions and lineage rather than the model's habits.
2. **Gates before execution.** Plan approval and SQL review place human judgment where it is cheap, before anything runs.
3. **Reconciliation as the definition of done.** A bidirectional, tolerance-bounded comparison against trusted reference data is the difference between SQL that runs and SQL you would ship.

Any LLM can write SQL. The question that decides whether AI belongs in your data platform is what happens between the prompt and the moment you trust the table. That middle part is what Datus is built for.

## Start with Datus

- Studio: [Datus Studio Overview](https://studio.datus.ai/overview)
- GitHub: [Datus Agent](https://github.com/Datus-ai/Datus-agent)
- Docs: [Datus Docs](https://docs.datus.ai)
- Main site: [Datus.ai](https://datus.ai)
