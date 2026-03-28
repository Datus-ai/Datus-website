---
title: "Meet the General Chat Agent: Your Data Co-Pilot That Actually Thinks"
description: "The General Chat Agent goes beyond SQL generation to support exploration, investigation, and knowledge-building."
date: 2026-03-25
lastmod: 2026-03-25
author: Datus Team
head:
  - - meta
    - name: keywords
      content: general chat agent, data co-pilot, AI data assistant, data engineering agent, SQL generation, data exploration, Datus agent, conversational AI for data, agentic data workflows, semantic search data
  - - meta
    - property: og:title
      content: "Meet the General Chat Agent: Your Data Co-Pilot That Actually Thinks"
  - - meta
    - property: og:description
      content: "Datus introduces the General Chat Agent — a conversational data co-pilot that supports exploration, investigation, documentation, and knowledge-building beyond SQL generation."
  - - meta
    - property: og:type
      content: article
  - - meta
    - property: og:url
      content: https://datus.ai/blog/posts/meet-the-general-chat-agent
  - - meta
    - property: og:image
      content: https://datus.ai/logo_dark.svg
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - meta
    - name: twitter:title
      content: "Meet the General Chat Agent: Your Data Co-Pilot That Actually Thinks"
  - - meta
    - name: twitter:description
      content: "A conversational data co-pilot that supports exploration, investigation, documentation, and knowledge-building — not just SQL generation."
  - - meta
    - property: article:published_time
      content: "2026-03-25"
  - - meta
    - property: article:section
      content: Product
  - - link
    - rel: canonical
      href: https://datus.ai/blog/posts/meet-the-general-chat-agent
---

# Meet the General Chat Agent: Your Data Co-Pilot That Actually Thinks

Data work is a thinking job. Long before anyone writes SQL, there is a more human process: figuring out what data exists, what columns actually mean, whether the numbers can be trusted, and how a metric was defined back when it was owned by someone who is no longer on the team.

For the past, Datus has handled the SQL part well. You ask a question, it produces a query. But everything around the query — exploration, investigation, documentation, and knowledge-building — still happens in scattered browser tabs, old Slack threads, and notebooks nobody reads.

The General Chat Agent is built for that "everything around the query." It is not a slightly better SQL generator. It is a conversational data co-pilot that supports the full arc of data work, from "I do not even know what is in this database" to "here is a validated query and a clean write-up for the ticket."

## The problem with SQL-first chat

The previous chat interface was, in practice, a SQL generator wearing a conversational costume. Every response was forced into a JSON schema:

```json
{"sql": "...", "output": "..."}
```

That structure shaped the agent's behavior in ways that were easy to miss at first.

- Ask what FRPM stands for, and it would try to query the database, fail to find anything, and still return `"sql": null` alongside an answer.
- Ask for a description of the data model, and it would attempt to "solve" the request by generating a query.

The result was friction. The agent was genuinely useful when you already knew what you needed and just wanted the SQL. It was brittle for the earlier stages of work, like orienting, exploring, and documenting.

Real analysts do not start with queries. They start by getting their bearings. They explore before they formalize. They leave behind notes so the next person does not have to rediscover the same context.

The General Chat Agent is designed around that reality.

## A first-class agent, not a wrapper

The most significant change is also the least visible: the General Chat Agent is no longer a subclass of the SQL generation node. It is its own `AgenticNode`, with its own system prompt, its own tool ecosystem, and a simple output format: plain Markdown.

That matters because it removes the constraint that made the old interface feel "SQL-shaped." The General Chat Agent is oriented toward answering a question in the way the question actually requires.

Sometimes that means writing SQL. Sometimes it means answering from general knowledge. Sometimes it means exploring schema, checking data quality, running a script, writing a file, or delegating to a specialist. Just as importantly, it is often good at knowing when *not* to touch the database.

```bash
Datus> What does FRPM stand for and why is it used as a poverty proxy?
────────────────────────────────────────
⏺ 💬 I'll help you understand what FRPM stands for and why it's used as a poverty proxy. Let me explore the database to find relevant
information about FRPM data.
⏴ explore(Explore FRPM tables and documentation)
  ⎿  Done ✓ (20 tool uses · 47.3s)
```

## The tool ecosystem

When the agent does need to act, it uses a unified toolkit that covers the whole workflow.

### Schema exploration

- `list_tables`
- `describe_table`
- `search_table`

Ask "what do we have here?" and it can explore tables, inspect column types, and return a structured overview without being hand-held.

### Semantic search

- `search_metrics`
- `search_reference_sql`
- `search_knowledge`
- `list_subject_tree`

Before generating SQL, the agent can pull in your team's metric definitions, reference patterns, and domain rules. The SQL it produces is shaped by how your organization actually works.

### Filesystem

- `read_file`
- `write_file`
- `list_directory`
- `search_files`

This turns the agent into something more like a working analyst: it can read existing scripts, write incident reports, save results to CSV, and manage artifacts across a session.

### Skills

- `skill_execute_command`

Any Python script, Bash utility, or CLI tool packaged as a Datus skill is available. By default, the agent requests confirmation before executing. Nothing runs silently.

### Task delegation

When a question is deep enough to justify a specialist, the agent delegates via `task()`.

| Specialist | What it does |
| --- | --- |
| `explore` | Read-only discovery across schema, knowledge base, and workspace files. Can run in parallel for fast orientation. |
| `gen_sql` | Generates SQL and **validates it against the real database** before returning. |
| `gen_report` | Explains trends, attributes metric movement, and supports root-cause analysis using the semantic layer and reference SQL. |
| `gen_semantic_model` | Produces MetricFlow YAML semantic models. |
| `gen_metrics` | Extracts and formalizes metric definitions. |
| `gen_sql_summary` | Summarizes SQL patterns into knowledge base entries. |
| `gen_ext_knowledge` | Registers domain knowledge derived from analysis outputs. |
| custom agents | Anything you define in `agent.yml`. |

Custom specialists are declared once in configuration. After that, they are accessible through `task()` delegation, `.subagent` session switching, and `/name` one-line dispatch.

## How SQL generation works now

This delegation model changes something concrete: **you no longer see broken SQL.**

In the old system, SQL was generated inline. If it referenced the wrong column or had a syntax error, you found out when you ran it.

In the new system, the chat agent gathers context first, often by delegating to `explore` in parallel across schema, knowledge base, and workspace files. Then it composes a focused prompt and delegates to the `gen_sql` specialist.

The specialist runs the query against the real database as a validation step. If execution fails, it fixes the query and retries. What comes back is SQL that has already proven to run.

For longer queries, `gen_sql` can return a file path rather than printing the SQL inline, and the agent can pass it directly to `read_query()` without an extra round trip.

The whole chain is visible:

```
Datus ❯ Which top 10 counties have the highest average SAT
math score among schools where more than 50% of students qualify for
free meals?
────────────────────────────────────────
⏺ 💬 I'll help you find the top 10 counties with the highest average SAT math scores among schools where more than 50% of students qualify
for free meals. Let me explore the relevant tables and then generate the SQL query.
⏴ explore(Explore SAT and FRPM tables for county analysis)
  ⎿  Done ✓ (22 tool uses · 56.8s)
⏺ 💬 Now let me generate the specific SQL query to find the top 10 counties with the highest average SAT math scores among schools where more
than 50% of students qualify for free meals.
⏴ gen_sql(Generate SQL for top counties by SAT math scores)
  ⎿  Done ✓ (9 tool uses · 27.4s)
⏺ 💬 Let me execute the SQL query to get the actual results:
⏺ 🔧 read_query - ✓ (0.0s)
    ✓ 10 rows
```

Previously, subagent activity was mostly hidden. The ActionBus now merges primary and specialist streams, so you can watch the reasoning chain unfold step by step. Press `Ctrl+O` to expand the full verbose trace.

## A session that looks like real work

The easiest way to understand the scope of the change is to watch the agent handle a scenario that is not primarily about SQL generation.

A data engineer joins a new team. No prior knowledge of the codebase. One session. Seven prompts.

1. **Orientation**
    - Prompt: "Walk me through the data platform: tables, SQL files, knowledge base."
    - Behavior: The agent fans out across all three sources and returns a structured overview.
2. **Investigation**
    - A ticket reports suspicious NULL rates in SAT score columns.
    - The agent runs sequential checks, forms a hypothesis (privacy suppression, not a data defect), and tests it.
3. **Profiling**
    - The engineer asks for a null-rate profile using the team's `data-profiler` skill.
    - The agent proposes an exact command, requests approval, and returns a formatted quality report.
4. **Documentation**
    - Prompt: "Write an incident report to `reports/null_sat_investigation.md`."
    - Output: A saved artifact with root cause, evidence, and recommended fix.
5. **Semantic layer**
    - The engineer switches to `gen_semantic_model` with `.subagent gen_semantic_model`.
    - A MetricFlow YAML model is generated and the session returns to general chat with `.subagent`.
6. **Knowledge registration**
    - Prompt: `/gen_ext_knowledge Register the avg_sat_math metric...`
    - The agent reads the semantic model from the previous step and registers a knowledge base entry.
7. **Handoff**
    - Prompt: "Summarize the key SQL patterns from today into the knowledge base."
    - The agent delegates to `gen_sql_summary` and registers reusable reference SQL entries.

By the end of the session: multiple workspace artifacts, a stronger knowledge base, and a resolved ticket. The next engineer benefits immediately.

## Quick reference

| Shortcut | What it does |
| --- | --- |
| `/gen_sql <question>` | Dispatch directly to the SQL specialist. |
| `/gen_report <question>` | Dispatch directly to the report and attribution specialist. |
| `/gen_semantic_model <task>` | Dispatch directly to the semantic model specialist. |
| `/gen_metrics <task>` | Dispatch directly to the metrics specialist. |
| `/gen_sql_summary <task>` | Dispatch directly to the SQL summarization specialist. |
| `/gen_ext_knowledge <task>` | Dispatch directly to the knowledge extraction specialist. |
| `/custom_agent <message>` | Dispatch to any subagent defined in `agentic_nodes`. |
| `.subagent <name>` | Switch the full session to a specialist. |
| `.subagent` | Return to general chat. |
| `Shift+Tab` | Toggle Plan Mode. |
| `ESC` / `Ctrl+C` | Interrupt the agent cleanly. |
| `Ctrl+O` | Expand the full verbose action trace. |

## Getting started

```bash
datus-cli --namespace <your_namespace>
```

The General Chat Agent is the default interface, so you can start using it without configuration changes.

- Add `skills.directories` to `agent.yml` to enable team skills.
- Define custom subagents under `agentic_nodes` to make them available through `task()`, `.subagent`, and `/name`.

## What it is really for

SQL generation is largely solved. The harder, more expensive part of analytics work is everything around the query: understanding the data, validating assumptions, documenting findings, and building shared knowledge so the same exploration does not happen again next quarter.

That is the problem the General Chat Agent is designed to solve. Not by generating better SQL, but by acting as a thinking partner across the full arc of data work.
