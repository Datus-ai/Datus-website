---
title: "What Is the Claude Data Plugin? SQL, Charts & Warehouse MCP"
description: "What Anthropic's Data plugin is: Cowork and Claude Code workflows for SQL, charts, and dashboards — plus how it differs from Genie and Cortex Analyst."
author: "Kostja"
date: 2026-08-22
lastmod: 2026-08-22
head:
  - - meta
    - name: keywords
      content: "Claude Data plugin, Anthropic Data plugin, Claude Code data, Cowork, warehouse MCP, Claude SQL charts, Claude vs Genie vs Cortex Analyst"
  - - meta
    - property: og:title
      content: "What Is the Claude Data Plugin? SQL, Charts & Warehouse MCP"
  - - meta
    - property: og:description
      content: "What Anthropic's Data plugin is: Cowork and Claude Code workflows for SQL, charts, and dashboards — plus how it differs from Genie and Cortex Analyst."
  - - meta
    - property: og:type
      content: article
  - - meta
    - property: og:url
      content: https://datus.ai/blog/what-is-claude-data-plugin/
  - - meta
    - property: og:image
      content: https://datus.ai/logo_dark.svg
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - link
    - rel: canonical
      href: https://datus.ai/blog/what-is-claude-data-plugin/
---


# What Is the Claude Data Plugin? SQL, Charts & Warehouse MCP

Anthropic's **Data plugin** is not a warehouse product named "Claude Data Agent." It is an official plugin that turns Claude — primarily in <a href="https://claude.com/product/cowork" rel="nofollow noopener">Cowork</a>, also in Claude Code — into a data-analyst collaborator: SQL, profiling, charts, HTML dashboards, and a pre-share QA pass. It becomes a [data agent](/blog/what-is-data-agent/) only to the extent you connect tools (especially a warehouse MCP server) or feed it files. The decision that matters is not the category but **where the contract lives**: the file, the query, or a governed endpoint.

## TL;DR

- The Data plugin is a **workflow pack**: skills plus slash commands (`/analyze`, `/explore-data`, `/write-query`, `/create-viz`, `/build-dashboard`, `/validate`). Anthropic ships it as a verified plugin; install is `claude plugins add knowledge-work-plugins/data`.
- **Two modes.** With a warehouse MCP (Snowflake, Databricks, BigQuery, or any SQL database), Claude can explore schemas and run queries. Without one, you upload CSV/Excel or paste SQL results; Claude still writes dialect-aware SQL for you to run elsewhere.
- It is a **client**, not a catalog object. It does not create Unity Catalog Genie Agents, Snowflake Semantic Views, or verified-query records. Those live in Databricks Genie and Cortex Analyst.
- It is also not **Claude Code's data-engineer subagent** (a persona prompt for pipelines). That comparison lives with platform-native DE agents and Claude Code vs a data engineering agent. This plugin is analyst work: questions, viz, QA.
- Use it for exploration, dialect-specific SQL, and file-based analysis. Its answers inherit their definition from the file or the query you pointed it at — only a governed endpoint makes a number certified.

## 1. A workflow pack, not a warehouse SKU

An analyst who works across files and warehouses has a fixed routine: profile a table, write Snowflake-flavored SQL, chart the result, wrap a dashboard for a stakeholder, and check whether the churn denominator silently dropped trials. A general Claude chat can do pieces of that if you prompt well. It will not remember the house style for SQL, Chart.js dashboards, or survivorship-bias checks unless you paste a novel every session.

The Data plugin is Anthropic's answer to that repetition: bake analyst practice into **skills** (`sql-queries`, `data-exploration`, `data-visualization`, `statistical-analysis`, `data-validation`, `interactive-dashboard-builder`) and expose them as commands. The <a href="https://github.com/anthropics/knowledge-work-plugins/blob/main/data/README.md" rel="nofollow noopener">plugin README</a> is explicit that it is designed first for **Cowork** — Anthropic's agentic desktop/web product for knowledge work — and also runs in Claude Code.

That origin explains the shape. Cowork is "hand Claude a goal across files and connectors." The Data plugin is how that goal becomes *analyst-shaped* instead of *generic-assistant-shaped*. It is closer to Type 2 in our taxonomy (analysis agent) than to a warehouse SKU. When MCP is connected it also behaves like a Type 1 query agent. The type is not the interesting part. **Where the contract lives** is.

ChatGPT's file analysis (Code Interpreter / Advanced Data Analysis) is the sibling pattern: a generalist runtime plus a sandbox, excellent on a CSV, silent on your Semantic View. The Data plugin adds structured commands and MCP. Neither is Genie. Neither is Analyst.

## 2. What you install: commands, skills, connectors

The public directory page is <a href="https://claude.com/plugins/data" rel="nofollow noopener">claude.com/plugins/data</a>. Anthropic marks it verified. The pack is open in the knowledge-work-plugins repo; you are not buying a separate Snowflake-style SKU.

**Commands** (from the README, paraphrased):

| Command | Job |
| --- | --- |
| `/analyze` | Ad-hoc questions through full analyses |
| `/explore-data` | Profile shape, quality, odd values |
| `/write-query` | Dialect-aware SQL with comments and performance notes |
| `/create-viz` | Publication-oriented Python charts |
| `/build-dashboard` | Self-contained HTML (Chart.js, filters) |
| `/validate` | Methodology and bias QA before you send the deck |

**Warehouse path.** Point MCP at Snowflake, Databricks, BigQuery, or another SQL engine. Claude can then query, read metadata, and iterate without copy-paste. The README also lists optional MCP categories: Amplitude/Looker/Tableau, Jupyter/Hex, Sheets/Excel, Airflow/dbt/Dagster/Prefect, Fivetran/Airbyte/Stitch. Treat that list as a **capability map**, not a promise that every connector is equally mature in your tenant.

**File path.** No MCP: upload or paste. Claude still writes SQL for the dialect you name ("we use Snowflake") for *you* to run. That path is how shadow analytics happens — and why platform vendors built Genie and Analyst. The plugin is honest about it. Buyers should be too.

**Cowork vs Claude Code.** Cowork is the non-coding agent surface (research, files, scheduled tasks). Claude Code is the engineering agent. The same Data plugin can ride on both. If your team only has Claude Code, they can still `/write-query`. They should not confuse that with a data engineering agent that persists semantic models for the whole company, or with the [Claude Code vs data engineering agent](/blog/data-engineering-agent-vs-claude-code/) comparison.

## 3. Where the contract lives: files, MCP, or a governed endpoint

Every number Claude produces is defined somewhere. The question that separates the Data plugin from Genie and Analyst is not "what kind of agent is this" but **where the contract lives** — the definition that decides whether two people get the same answer.

| Contract lives in | What that means | Certified number? |
| --- | --- | --- |
| The uploaded file | The export job decided the definition | No |
| The SQL in a raw-MCP session | The analyst decided it, this session | No |
| A Genie Agent's curated dataset + Metric Views | Databricks object, UC ACLs on every answer | Yes |
| A Semantic View + verified queries | Analyst's authored View / YAML, Snowflake RBAC on generated SQL | Yes |
| ChatGPT file analysis | The uploaded file, inside the OpenAI client | No |

**File.** Upload a CSV; the definition of "converted" is whatever the export job decided. Re-export next week and it can silently change. Claude will profile it, chart it, and validate it — all of it honest, none of it certified.

**Raw MCP.** Point Claude at raw warehouse tables; the definition is the SQL written this session. Dialect-correct, commented, gone tomorrow. If you connect Claude to raw Snowflake tables with no View, you have recreated schema-only text-to-SQL inside a nicer IDE.

**Governed endpoint.** [Databricks Genie](/blog/what-is-databricks-genie/) is a domain-scoped lakehouse chat object (ex-Space): curated datasets, example SQL, Metric Views, and instructions, with Unity Catalog ACLs on every answer. [Cortex Analyst](/blog/what-is-cortex-analyst/) is a managed NL-to-SQL API built on a Semantic View, whose verified queries carry Snowflake RBAC and can leave an audit field like `verified_query_used` when you embed it in an app you own. The plugin is not the author here — but if you point Claude's MCP at that governed endpoint, Claude becomes a *client* of the contract, not a competitor to it.

The plugin's own governance is real but local: the folder and tool permissions you grant Claude. That is not a grant on a specific warehouse table. Genie serves Databricks estates and business teams, not pipeline authoring (that's Genie Code) or other warehouses; Analyst is for governed, app-embedded NL-to-SQL, not documents or pipelines (Cortex Code). The type label — query agent vs analysis agent — matters far less than which of these three homes your number lives in.

## 4. The same question, three runtimes

Same question, three runtimes: "what fraction of June trials converted to a paid subscription?" The SQL is nearly identical each time. The answer's authority is not.

**A. Data plugin, CSV only.** Growth exports `trial_events.csv` and `/analyze`s it in Cowork. Claude counts a trial as converted when `paid_at` is non-null and charts conversion by cohort into an HTML dashboard. The definition — what counts as converted — was applied by the export job, not by the analyst. `/validate` may catch a suspicious spike (internal test rows, trials that never started); it cannot consult a semantic layer it was never connected to. The dashboard looks executive-ready. The contract lives in the CSV.

**B. Data plugin + Snowflake MCP, no View.** Claude `/write-query`s against `trials` and `subscriptions`: join on trial id, first payment inside the trial window, comments and performance notes. Idiomatic, readable — and the property of whoever wrote the join this afternoon. A different analyst can `/write-query` a different window tomorrow and no object in the warehouse will object. The plugin did its job: dialect, comments, maybe a chart. The contract was missing.

**C. A Genie Agent or Analyst behind a Semantic View.** The metric `trial_conversion` is authored — the rule about what counts as converted is stored with verified SQL, not retyped. The same question returns the company definition every time. The plugin is not in the path — unless you point Claude's MCP at that governed endpoint, in which case Claude is a client of the SKU, not a competitor.

The three runtimes are the buying rule. If your incident is analysts drowning in notebooks, the plugin is a fit. If your incident is the same metric quoted three different ways in one afternoon, buy the governed endpoint (or a semantic layer) and optionally let Claude sit in front of it.

## 5. When the client is enough — and the shadow analytics risk

The plugin is enough when the contract does not need to be governed: a small team that lives in Claude, questions that are exploratory, files that are the source of truth *this week*, or work that spans tools — a warehouse plus a CSV plus a Looker MCP. It wins on the exploratory, cross-tool jobs and on "write me the Snowflake SQL and a Chart.js page this afternoon."

The shadow analytics risk is the other side. File and raw-MCP answers are computed outside the governed contract and then pasted into decks. The CSV counts `paid_at` non-null as converted; the governed metric says otherwise; two numbers for one question ship in the same slide. Nothing about the plugin stops that — it will produce the confident dashboard either way, because it cannot see a contract it was never connected to.

Skip it as the *enterprise* channel when you need Unity Catalog or Horizon to be the permission system of record for every answer. Cowork permissions are real (folders, connectors, admin toggles); they are not UC grants on `finance.fct_invoices`. Skip it when you need verified queries, Metric Views, or a Conversation API branded as your company portal — those are Genie/Analyst features. Skip it when you need a producer that evolves models as schemas drift — that is a data engineering agent, not a Cowork skill pack. Datus can expose tools to Claude Desktop over MCP; that still does not make the Data plugin a Context Engine.

And if you assumed "Claude Data plugin" was Anthropic's answer to Genie One, it is not a coworker SKU with Slack/mobile lakehouse chat. Cowork is the coworker; this plugin is the analyst specialty inside it.

Most data teams will run **both**: Genie or Analyst for certified self-serve, the Data plugin for the messy analysis that never deserved a Space.

## Conclusion

The Claude Data plugin is Anthropic's analyst workflow layer on Cowork and Claude Code: commands and skills for SQL, exploration, charts, dashboards, and validation, with optional warehouse MCP. It is a strong generalist **client**. It is not [Databricks Genie](/blog/what-is-databricks-genie/), not [Cortex Analyst](/blog/what-is-cortex-analyst/), not ChatGPT-as-a-warehouse, and not a [data engineering agent](/blog/what-is-data-engineering-agent/). Connect it to a contract if the number must be the company's number. Leave it on files if the number is a prototype. Do not staff it as the only certified channel and then blame the model.

## Frequently asked questions

### What is the Claude Data plugin?

An Anthropic-verified plugin that turns Claude into a data-analyst collaborator — SQL, profiling, visualization, HTML dashboards, and pre-share QA — mainly in Cowork, also in Claude Code.

### Is it a Claude "data agent" product?

No SKU by that name. It is a plugin. It behaves like a data agent when you attach warehouse MCP or data files. The agent runtime is Cowork or Claude Code.

### Does it connect to Snowflake or Databricks?

Yes, if you configure a warehouse MCP server. Without MCP it still writes SQL and analyzes uploads. Connecting to a warehouse is not the same as using Genie Agents or Cortex Analyst's Semantic Views.

### How is this different from Claude Code?

Claude Code is an engineering agent. The Data plugin is analyst workflows that can run *on* Claude Code or Cowork. A community "data-engineer" persona for pipelines is a different artifact — see §2.

### How is this different from Databricks Genie or Cortex Analyst?

Genie and Analyst are **platform-native query agents** with catalog objects and warehouse governance. The plugin is a **client** with skills and commands. See §3.

### When should we not standardize on the Data plugin?

When answers must match certified metrics for the whole company, when auditors need warehouse-native verification fields, or when you need an agent that authors and evolves semantic context rather than consuming whatever MCP you pointed at today.

## Related articles

- [What is a data agent?](/blog/what-is-data-agent/) — the category.
- [What is Cortex Analyst?](/blog/what-is-cortex-analyst/) — Snowflake's managed text-to-SQL.
- [What is Databricks Genie?](/blog/what-is-databricks-genie/) — Databricks' conversational analytics.
- [Data engineering agent vs Claude Code](/blog/data-engineering-agent-vs-claude-code/) — where a general coding agent stops.
