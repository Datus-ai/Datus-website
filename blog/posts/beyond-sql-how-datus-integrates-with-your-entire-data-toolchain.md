---
title: "Beyond SQL: How Datus Integrates With Your Entire Data Toolchain"
description: "Learn how MCP and Skills connect Datus to your data catalog, metric layer, scripts, and quality workflows across the full data toolchain."
date: 2026-04-02
lastmod: 2026-04-02
author: Datus Team
head:
  - - meta
    - name: keywords
      content: datus integrations, MCP, skills, data engineering tools, data toolchain, metricflow, data catalog, data profiling, data quality workflows
  - - meta
    - property: og:title
      content: "Beyond SQL: How Datus Integrates With Your Entire Data Toolchain"
  - - meta
    - property: og:description
      content: "Learn how MCP and Skills connect Datus to your data catalog, metric layer, scripts, and quality workflows across the full data toolchain."
  - - meta
    - property: og:type
      content: article
  - - meta
    - property: og:url
      content: https://datus.ai/blog/posts/beyond-sql-how-datus-integrates-with-your-entire-data-toolchain
  - - meta
    - property: og:image
      content: https://datus.ai/logo_dark.svg
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - meta
    - name: twitter:title
      content: "Beyond SQL: How Datus Integrates With Your Entire Data Toolchain"
  - - meta
    - name: twitter:description
      content: "Learn how MCP and Skills connect Datus to your data catalog, metric layer, scripts, and quality workflows across the full data toolchain."
  - - meta
    - property: article:published_time
      content: "2026-04-02"
  - - meta
    - property: article:section
      content: Tooling
  - - link
    - rel: canonical
      href: https://datus.ai/blog/posts/beyond-sql-how-datus-integrates-with-your-entire-data-toolchain
---

# Beyond SQL: How Datus Integrates With Your Entire Data Toolchain

A data engineering agent that can only query a database is only as useful as the database. Real data engineering work crosses boundaries: you write SQL, but you also profile datasets, validate pipeline outputs, generate formatted reports, call data catalog APIs, and run quality checks against external systems. If the agent can only reach inward, to the schema and the knowledge base, it misses most of the job.

Datus addresses this with two complementary extension mechanisms: **MCP** and **Skills**. MCP connects Datus to the broader ecosystem of tools that already exist in your organization. Skills package the workflows and scripts your team has already built and make them available to the agent on demand. Together, they turn Datus from a SQL generator into an integrated data engineering co-pilot.

## MCP: Connecting to the Ecosystem

The Model Context Protocol, or MCP, is an open standard for exposing tools to AI agents. Any system that can speak MCP, a metric catalog, a data quality service, a governance API, or a BI platform, can be made available to Datus without writing custom agent code.

### What it enables

For data engineering teams, MCP opens two complementary directions.

**Outward: Datus as an MCP server.** Datus can expose its own capabilities, including schema exploration, semantic search, and query execution, as an MCP service. That means Claude Desktop, Claude Code, and other MCP clients can connect to Datus and use its database tools directly. A developer working in an IDE can ask about the data model or run a query without switching contexts.

**Inward: external tools inside Datus.** A Datus agent can connect to any external MCP server and use its tools alongside built-in ones. A MetricFlow server can provide metric query capabilities. A data catalog can provide lineage and certification status. A governance tool can provide policy lookups. From the agent's perspective, these are simply more tools in the toolkit.

### Connecting to an external MCP server

Configuration is declarative. Add a server to the MCP config file, give it a name, and reference that name in the agent configuration:

```yaml
agentic_nodes:
  chat:
    tools: db_tools.*, context_search_tools.*
    mcp: metricflow_mcp, data_catalog_mcp
```

The agent now has access to both native tools and the tools exposed by those servers.

### Transport and filtering

MCP servers can run locally via stdio for developer workstations and CLI integrations, over SSE for web-based clients, or over HTTP for traditional API-style integration. The same Datus instance can serve all three simultaneously.

Tool filtering lets you control exactly which tools from each external server the agent can see. A governance server might expose admin operations you do not want the agent touching. An allowlist or blocklist in the config handles that cleanly without requiring changes to the server.

## Skills: Packaging What Your Team Already Knows

Skills solve a different problem. Where MCP connects Datus to external systems, Skills connect it to your team's existing work: the Python profiling scripts your data engineers wrote, the validation routines from your pipeline toolkit, and the report generation utilities that already live in your repository.

A Skill is a Markdown file with YAML frontmatter. It contains a description that helps the agent decide when the skill is relevant, plus instructions that guide the workflow once the agent decides to use it. Optionally, it can declare which scripts from a `scripts/` directory the agent is allowed to execute.

### What it enables

The value of Skills is that they let your team encode domain expertise once and have the agent apply it consistently without repeated prompting.

- A `data-profiler` skill can describe how to run a null-rate and distribution analysis.
- A `report-generator` skill can format output in the structure your stakeholders expect.
- A `pipeline-validator` skill can run the exact checks your team already uses before deployment.

Skills are also how you expose **team-specific workflows** that no generic agent could know about. The quality check your team runs before every production deployment. The anomaly detection script tuned to your data distributions. The export format your downstream consumers expect.

### The permission model

Script execution is controlled by an explicit permission layer. Every skill declares which commands it is allowed to run, and the agent cannot execute anything outside that list. At the node level, skills can be set to `allow`, `ask`, or `deny`.

That matters in practice:

- A read-only schema exploration skill can be set to `allow`.
- A report generation skill that writes files to the workspace can be set to `ask`.
- An administrative skill that modifies production tables can be set to `deny` except in a dedicated admin node.

The agent sees only what it is supposed to see.

### Installing and sharing skills

Skills are designed to be portable. The same directory structure that works locally can be published to the Datus Marketplace, installed with a single command, and shared across teams or open-sourced. That makes it possible for teams to build on each other's work rather than rewriting the same profiling and validation routines from scratch.

## A Real-World Demo: Onboarding to a New Dataset

The clearest way to see MCP and Skills working together is through a concrete scenario.

A data engineer joins a team that owns the California Schools dataset. It is their first day. They know nothing about the schema, the data quality, or the team's conventions. They have one session to get oriented and produce a handoff document.

### First: understand what exists

```text
california_schools ❯ Walk me through this dataset. What tables do we have,
what do the key columns mean, and are there any known data quality issues?
```

The agent explores the schema, searches the knowledge base for documented conventions, and checks the workspace for any existing analysis files. It returns a structured overview of tables, join keys, column semantics, and quality notes. No manual exploration required.

### Then: investigate a quality concern

The engineer notices SAT score columns have a high NULL rate in the sample. They ask:

```text
california_schools ❯ Why are there so many NULL values in the SAT score columns?
Is this a data defect or expected behaviour?
```

The agent runs targeted queries, forms a hypothesis, such as privacy suppression for schools with fewer than 11 test takers, and validates it. It answers like something that understands the workflow, not like a tool that executes one query per prompt.

### Then: run a systematic quality profile

The team has a `data-profiler` skill that runs its standard null-rate and distribution analysis:

```text
california_schools ❯ Run a full data quality profile on the satscores table.
```

The agent loads the skill, sees that it requires script execution, and prompts for confirmation:

```text
  ◎ chat                                           [thinking...]
    └─ load_skill  data-profiler                 → loaded ✓
  ⚠ skill_execute_command
    skill: data-profiler
    command: python scripts/profile_data.py --table satscores

  Allow this command? [y/N]
```

The engineer confirms. The script runs and returns a structured quality report.

### Then: query a certified metric

The engineer wants county-level free meal eligibility rate, but they want to use the team's official metric definition rather than write an ad hoc query. The MetricFlow MCP server is configured:

```text
california_schools ❯ What is the FRPM eligibility rate by county, using the
certified metric definition?
```

The agent uses the `query_metrics` tool from the MetricFlow MCP server, the same tool the BI platform uses, rather than approximating the metric in SQL. The result reflects the official business definition.

### Finally: write the handoff document

```markdown
Datus> Write an onboarding document to reports/dataset_overview.md. Include the schema overview, the SAT NULL rate explanation, the profiling results, and the FRPM metric definition.
────────────────────────────────────────
⏺ 💬 I'll create a comprehensive onboarding document for the California Schools dataset. Let me gather the necessary information about the
schema, SAT NULL rates, profiling results, and FRPM metrics.
⏴ explore(Comprehensive schema exploration)
  ⎿  Done ✗ (25 tool uses · 41.5s)
⏺ 💬 Let me gather the information in a more targeted way by exploring specific aspects:
⏺ 🔧 list_tables - ✓ (0.0s)
    ✓ 3 tables
⏺ 🔧 describe_table - ✓ (0.0s)
⏺ 🔧 describe_table - ✓ (0.0s)
⏺ 🔧 describe_table - ✓ (0.0s)
⏺ 💬 Now let me check for SAT NULL rates and profiling information:
⏺ 🔧 read_query - ✓ (0.0s)
    ✓ 1 rows
⏺ 🔧 read_query - ✓ (0.0s)
    ✓ 1 rows
⏺ 💬 Now let me create the comprehensive onboarding document:
⏺ 🔧 write_file - ✓ (0.0s)
    ✓ File written

I've created a comprehensive onboarding document for the California Schools dataset at `reports/dataset_overview.md`.
```

The agent authors the document using everything discovered in the session and saves it to the workspace. The next engineer who joins the team can find it later.

## What This Combination Makes Possible

MCP and Skills solve different problems, but they reinforce each other.

MCP ensures the agent can reach authoritative sources: the metric catalog that defines what numbers mean, the governance API that says what is certified, and the data quality service that tracks historical anomalies. Without that, the agent is isolated inside the database.

Skills ensure the agent can act using the team's own tools and conventions: the profiling scripts tuned to your data, the report templates your stakeholders expect, and the validation routines your pipelines already depend on. Without that, every specialized operation requires the engineer to step outside the agent and back into a terminal.

Together, they close the gap between what a general-purpose AI agent can do and what a data engineering team actually needs. The data lives in the database. The knowledge lives in the knowledge base. The tools live in Skills and MCP servers. The agent knows how to reach all of it.

That is what a data engineering co-pilot looks like in practice.

## Getting Started

To enable Skills, point Datus at one or more directories containing skill packages. The defaults are `~/.datus/skills` for user-level skills and `./skills` for project-level skills:

```yaml
skills:
  directories:
    - ~/.datus/skills
    - ./skills
```

To connect an MCP server, add it to your MCP configuration and reference it by name in the relevant agentic node:

```yaml
agentic_nodes:
  chat:
    mcp: metricflow_mcp
    skills: "profiler-*, report-*"
```

Browse and install community skills from the Datus Marketplace:

```bash
datus skill search data-profiler
datus skill install data-profiler
```

Start the Datus MCP server for Claude Desktop or Claude Code:

```bash
datus-mcp --namespace your_namespace
```

Both capabilities are available from the first session. No architecture changes, no restarts, and no configuration beyond what is shown above.
