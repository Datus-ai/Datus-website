---
title: "Make Data Agents Usable: Ask, Explore, and Control with Confidence"
description: "See how Ask User, session management, Explore, and action display make Datus data agents easier to trust, control, and use every day."
date: 2026-04-02
lastmod: 2026-04-02
author: Datus Team
head:
  - - meta
    - name: keywords
      content: data agents usability, ask user, session management, data exploration, action display, Datus, agentic data workflows
  - - meta
    - property: og:title
      content: "Make Data Agents Usable: Ask, Explore, and Control with Confidence"
  - - meta
    - property: og:description
      content: "See how Ask User, session management, Explore, and action display make Datus data agents easier to trust, control, and use every day."
  - - meta
    - property: og:type
      content: article
  - - meta
    - property: og:url
      content: https://datus.ai/blog/posts/make-data-agents-truly-usable-ask-explore-and-control-with-confidence
  - - meta
    - property: og:image
      content: https://datus.ai/logo_dark.svg
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - meta
    - name: twitter:title
      content: "Make Data Agents Usable: Ask, Explore, and Control with Confidence"
  - - meta
    - name: twitter:description
      content: "See how Ask User, session management, Explore, and action display make Datus data agents easier to trust, control, and use every day."
  - - meta
    - property: article:published_time
      content: "2026-04-02"
  - - meta
    - property: article:section
      content: Product
  - - link
    - rel: canonical
      href: https://datus.ai/blog/posts/make-data-agents-truly-usable-ask-explore-and-control-with-confidence
---

# Make Data Agents Usable: Ask, Explore, and Control with Confidence

Most data tools optimize for power. Datus optimizes for something harder: making power easy to use.

A data agent that can write SQL, explore schemas, and search a knowledge base is useful. But an agent that can also ask you a clarifying question before it runs the wrong query, let you undo the last two turns when the conversation drifts, show you exactly what it is doing in real time, and scout unfamiliar databases without you writing a single prompt, that is an agent you actually want to work with.

This post introduces four features that define the Datus experience: **Ask User**, **Session Management**, **Explore**, and the **Action Display**. None of them generate SQL directly. All of them make the SQL generation, and everything around it, feel effortless.

## Ask User: The Agent That Pauses Before It Guesses

Every analyst has had this experience: you ask a question, the tool makes an assumption you did not intend, and now you are debugging the tool's interpretation instead of doing your real work. The cost is not only the wrong answer. It is the time spent getting back on track.

The Ask User tool changes this dynamic. When the agent encounters ambiguity, a question that could mean two different things, a column name that matches multiple tables, or an analysis that could go in several directions, it stops and asks.

```text
california_schools ❯ Show me the dropout rate by county.

  ◎ chat                                           [thinking...]
  ❓ The agent needs clarification:

  1. Which definition of "dropout rate" should I use?
     ① Total dropouts / Total enrollment
     ② Grade 9-12 dropouts only
     ③ Adjusted cohort dropout rate (ACDR)

  Your choice (or type a custom answer): _
```

The agent presents the question with predefined options when they exist, but it always accepts free-text input. You pick an option or type your own clarification, and the agent continues with exactly the intent you specified.

This matters most in three situations:

- **Ambiguous metrics.** "Revenue" might mean gross, net, or recognized revenue. "Active users" might mean daily, weekly, or monthly. Instead of silently picking one, the agent asks which definition to use and can check the knowledge base to present the options your team already documents.
- **Multiple approaches.** A question like "analyze SAT performance" could mean a county-level ranking, a year-over-year trend, or a poverty-correlation study. The agent surfaces those options rather than committing to one and hoping it is right.
- **Confirmation before costly actions.** When the agent is about to write a file, run a skill script, or execute a query on a large table, it can ask for your go-ahead first. That is especially valuable in shared environments where a wrong move is visible to others.

The core design choice is simple: the agent batches all of its questions into a single prompt. If it needs to clarify three things, you see all three at once. One pause, one set of answers, and the work continues.

## Session Management: Work That Survives Mistakes, Interruptions, and Long Afternoons

A data investigation is rarely linear. You explore one hypothesis, hit a dead end, backtrack, and try a different angle. A stateless prompt model forces you to re-explain context every time you change direction.

Datus sessions are persistent, branching, and forgiving.

### Resume: pick up where you left off

Every conversation is stored as a named session. Close the terminal, come back tomorrow, and your context is still there:

```text
california_schools ❯ .sessions

┌─────────────┬──────────────────────────────┬──────────┬────────────┐
│ Session ID  │ Last Message                 │ Turns    │ Last Used  │
├─────────────┼──────────────────────────────┼──────────┼────────────┤
│ chat_a1b2c3 │ "Top 10 counties by SAT..."  │ 12 turns │ yesterday  │
│ chat_d4e5f6 │ "FRPM eligibility rate..."   │ 5 turns  │ 3 days ago │
└─────────────┴──────────────────────────────┴──────────┴────────────┘

california_schools ❯ .resume chat_a1b2c3

Resuming session chat_a1b2c3...
Loaded 12 turns. You can now continue the conversation.
```

The agent remembers the conversation history, the schema it explored, the metrics it found, the SQL it generated, and the clarifications you gave. No re-explaining, no re-exploring.

### Rewind: undo without losing anything

Three turns ago, the conversation went in the wrong direction. Instead of starting over, rewind:

```text
california_schools ❯ .rewind 3

Rewinding to turn 9 (of 12)...
New session created from branch point.

california_schools ❯
```

Rewind does not delete history. It creates a new branch from the point you specify. The original session is still there if you need it. This is version control for conversations.

### Compact: sessions that survive long investigations

As a session grows, the context window fills up. In most tools, that means the agent starts forgetting earlier parts of the conversation or you hit a hard limit and have to restart.

Datus handles this automatically. When the context window approaches its limit, the agent compacts the history: it summarizes what happened, what was explored, what was decided, and what SQL was generated, then injects that summary into the next turn.

```text
california_schools ❯ .compact

Compacting session... summary saved.
Context reduced from 12,400 → 850 tokens.
```

In practice, a long investigation stays coherent. The agent does not lose the thread.

### Interrupt: stop cleanly, resume instantly

Start a long-running analysis, realize you want to refine the question, and press `ESC` or `Ctrl+C`:

```text
california_schools ❯ Analyse all 17,000 schools and produce a full report...

  ◎ chat                                           [running...]
    ├─ search_table ...
    ├─ search_metrics ...

[Press ESC]

✗ Interrupted by user.

california_schools ❯
```

The agent stops cleanly. The session is preserved. Your next prompt picks up with the context already gathered. Interrupt is a pause button, not a crash.

## Explore: Understand Before You Query

The hardest part of working with an unfamiliar dataset is usually not writing the SQL. It is knowing what to write. What tables exist? What do the columns actually mean? Are there NULL values you need to handle? Does the knowledge base already contain a reference query you can reuse?

The Explore tool handles all of this automatically, in parallel, and safely.

### Three directions, one prompt

Explore works across three independent directions that can run simultaneously:

- **Schema + Sample.** Lists tables, describes columns and types, and samples real data to show value ranges and quality issues. The agent spots high NULL rates, suspicious distributions, and likely joins before you write a single line of SQL.
- **Knowledge base.** Searches documented metrics, reference SQL patterns, and domain rules. If someone on your team already wrote a query for "free meal eligibility rate by county," Explore finds it.
- **Workspace files.** Scans the workspace for existing SQL files, documentation, and analysis artifacts. If a previous investigation already covered part of your question, Explore surfaces it.

When you ask a complex question, the agent fans out all three directions in parallel:

```text
california_schools ❯ I need to find top counties by SAT score among
high-poverty schools. What do I need to know?

  ◎ explore [schema]                               [running]
    ├─ list_tables                             → 3 tables
    ├─ describe_table  frpm                    → 67 columns
    └─ read_query  (join preview, LIMIT 5)     → 5 rows
  ◎ explore [knowledge]                            [running]
    ├─ search_metrics  "SAT score county"      → 2 metrics found
    ├─ search_reference_sql  "free meal rate"  → 1 match
    └─ list_subject_tree                       → tree loaded
  ◎ explore [files]                                [running]
    ├─ search_files  **/*.sql                  → 2 files found
    └─ read_file  reference_sql/schools_1.sql  → 847 bytes
  ✓ explore [schema]                               [3 tool calls · 3.8s]
  ✓ explore [knowledge]                            [3 tool calls · 2.1s]
  ✓ explore [files]                                [2 tool calls · 1.4s]
```

Three directions, all running at once, all finished in under four seconds. The agent then synthesizes everything into a structured overview: schema findings, data observations, context from the knowledge base, and practical recommendations for how to approach the query.

### Strictly read-only

Explore never writes, modifies, or deletes anything. Write queries are blocked. File writes are blocked. It is safe to run on production databases, shared environments, and datasets you do not yet understand. Exploration should be a zero-risk activity.

### Why it changes daily work

Explore changes the starting point of every data task. Instead of beginning with "I have a question and no context," you begin with "I have a question, and the agent has already gathered the schema, the team's conventions, and existing work." The SQL that follows is better because the input is better.

## Action Display: See Everything, Be Overwhelmed by Nothing

AI agents are often opaque. You type a question, wait, and get an answer. What happened in between? Which tools were called? Did the agent check the knowledge base or skip it? Was the SQL validated? If the answer is wrong, where did the reasoning go off track?

Datus solves this with a real-time action display that shows every step of the agent's work without cluttering the screen.

### The default view: compact and scannable

Every agent turn renders as a tree of actions:

```text
  ◎ chat                                           [thinking...]
    ├─ search_table  "SAT score county"        → satscores, schools
    ├─ search_metrics  "SAT average county"    → 1 metric found
    └─ search_reference_sql  "free meal rate"  → 1 match found
  ◎ gen_sql                                        [running...]
    ├─ describe_table  frpm                    → 67 columns
    └─ execute_sql  (validation run)           → 10 rows ✓
  ✓ gen_sql                                        [2 tool calls · 4.1s]
  ✓ chat                                           [done · 7.3s total]
```

Each line tells you what tool was called, what argument was passed, and what came back. Running actions pulse with a blinking indicator. Completed actions show a checkmark and elapsed time. Subagent delegations such as `gen_sql` appear as nested groups that collapse to a single summary line once they finish.

You always know what the agent is doing. You do not have to wade through logs to find out.

### Verbose mode: the full trace on demand

Press `Ctrl+O` at any time, even mid-execution, to expand the full verbose trace. Every tool call shows its complete arguments, full output data, and timing:

```text
  ⎺ switched to verbose mode (frozen) ⎺

  ⏺ 🔧 search_table - ✅ (0.3s)
      keyword: "SAT score county"

      Found 2 matching tables:
      - satscores: SAT test results per school
      - schools: Master school directory

  ⏺ 🔧 search_metrics - ✅ (0.4s)
      query: "SAT average county"

      1 metric found:
      - avg_sat_math (california_schools/SAT_Score/Average)
```

Verbose mode freezes the display. It is a snapshot of everything that has happened so far, without live animation. Press `Ctrl+O` again to return to the compact view. This is invaluable for debugging because you can inspect the reasoning chain without re-running anything.

### Subagent visibility

When the chat agent delegates to a specialist such as `gen_sql`, `gen_report`, or `explore`, the subagent's actions appear inline in the same display. You see the full chain: chat gathers context, hands off to the specialist, the specialist validates and returns.

### Plan Mode: review before executing

Press `Shift+Tab` to activate Plan Mode. The agent generates a step-by-step plan without taking any action:

```text
[PLAN MODE] Datus> Build a county-level SAT analysis for high-poverty schools.

## Proposed Plan

1. Schema discovery — confirm columns in satscores, schools, frpm
2. Calculate average SAT math score by county
3. Apply poverty filter — Percent Eligible Free > 50%
4. Rank and limit — top 10 counties
5. Save results to CSV

Shall I execute this plan?
```

Review, refine, confirm. Nothing runs until you say so. For regulated environments, expensive queries, or any situation where you want to think before acting, Plan Mode puts you in control.

## What These Features Add Up To

Individually, these are quality-of-life improvements. Together, they define what it feels like to use Datus.

**Ask User** means the agent works with you, not past you. It checks assumptions instead of guessing, which means fewer wrong turns and less time spent correcting course.

**Session Management** means your work accumulates. An investigation that spans an hour, a day, or a week remains one continuous thread: resumable, rewindable, and automatically compacted so context limits do not get in the way.

**Explore** means you start every task with context, not a blank slate. The schema, the knowledge base, and the workspace are all scouted in parallel and synthesized before the first query is written.

**Action Display** means you see everything the agent does in real time, at exactly the level of detail you want. Trust comes from transparency. When you can watch the reasoning chain unfold step by step, you know when the agent is right, and you know where to look when it is not.
