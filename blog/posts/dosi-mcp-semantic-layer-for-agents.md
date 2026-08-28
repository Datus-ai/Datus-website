---
title: "Dosi MCP Semantic Layer for Agents — No SQL Guessing"
description: "How agents query governed OSI metrics via Dosi MCP: structured error codes, Claude Code and Codex patterns, and why semantic MCP beats raw SQL."
author: "Kostja"
date: 2026-08-24
lastmod: 2026-08-24
head:
  - - meta
    - name: keywords
      content: "Dosi MCP, semantic layer for agents, Model Context Protocol, OSI metrics, structured errors, Claude Code, Codex, text-to-SQL, governed metrics, Datus Agent"
  - - meta
    - property: og:title
      content: "Dosi MCP Semantic Layer for Agents — No SQL Guessing"
  - - meta
    - property: og:description
      content: "How agents query governed OSI metrics via Dosi MCP: structured error codes, Claude Code and Codex patterns, and why semantic MCP beats raw SQL."
  - - meta
    - property: og:type
      content: article
  - - meta
    - property: og:url
      content: https://datus.ai/blog/dosi-mcp-semantic-layer-for-agents/
  - - meta
    - property: og:image
      content: https://datus.ai/logo_dark.svg
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - link
    - rel: canonical
      href: https://datus.ai/blog/dosi-mcp-semantic-layer-for-agents/
---

# Dosi MCP Semantic Layer for Agents — No SQL Guessing

An analyst asks Claude Code for "net revenue by region last month." The agent writes SQL, runs it, and returns a number that looks right — until finance notices the filter on cancelled orders never made it into the query. This article explains how a **Dosi MCP semantic layer** routes agent questions through certified OSI metrics instead of improvised SQL, and why **structured errors** matter more than another text-to-SQL shortcut.

## TL;DR

- **Dosi MCP** exposes an OSI-native semantic layer to LLM agents: list metrics, compile SQL for a named metric and grain, and return results — without the agent inventing formulas from raw column names.
- Agents that connect only to a database MCP server guess SQL; agents that connect to Dosi ask for **governed metric names** and receive dialect-correct compilation or **structured error codes** they can use to self-correct.
- Integration is standard [Model Context Protocol](/blog/mcp-data-engineering) wiring: register Dosi as an MCP server in Claude Code, Claude Desktop, OpenAI Codex-style environments, or a custom agent host — same tools, same governed definitions.
- Dosi is a **Datus Studio component**, not open source; it compiles [Apache Ossie (OSI)](/blog/open-semantic-interchange-osi) YAML to 15+ warehouse dialects. See [Introducing Dosi](/blog/introducing-dosi) for the product overview and <a href="https://dosi.datus.ai/" rel="nofollow noopener">dosi.datus.ai</a> for MCP setup guides.
- The durable pattern: **semantic layer as MCP server, coding agent as MCP client** — the general-purpose agent handles code and conversation; Dosi handles metric algebra, fan-out protection, and warehouse-specific SQL.

## 1. Why agents need a semantic MCP — not another text-to-SQL path

Most agent stacks treat the warehouse as the source of truth for *structure* — table names, column types, sample values — and leave *meaning* implicit. A [data agent](/blog/what-is-data-agent) that sees `orders.amount` and `orders.total_amount` has no principled way to know which column finance certified, which grain the board report uses, or which join path avoids double-counting when customers appear in multiple regions. The model fills the gap with plausible SQL. That is not a model failure; it is an architecture failure.

Semantic layers exist precisely because structure is not semantics. A governed metric like `net_revenue` encodes the filter on order status, the currency normalization rule, the time grain, and the additive properties that determine whether you can sum across regions or must re-aggregate at month boundary. Text-to-SQL pipelines that retrieve schema snippets and hope the model infers the rest reproduce the dashboard drift problem at machine speed: every session can produce a slightly different definition of the same English phrase.

MCP does not fix that by itself. MCP is a transport layer — tool discovery, typed inputs, structured outputs — that lets agents call external capabilities without bespoke integration code per tool. What matters is *what* sits behind the MCP server. A database MCP server exposes `run_query(sql)`. An orchestrator MCP server exposes `trigger_dag`. A **semantic layer MCP server** exposes operations grounded in metric definitions: list available metrics, describe dimensions and filters, compile a metric request to SQL, execute or return the plan. The agent's job shifts from "write SQL that might be right" to "select the right governed object and supply valid parameters."

That shift aligns with how production teams already think about BI. Analysts do not re-derive `monthly_recurring_revenue` from base tables in every Looker explore; they pick the certified field. Agents should behave the same way when the organization has invested in a [semantic layer](/blog/what-is-semantic-layer). The open question in 2026 is not whether agents will call tools via MCP — that pattern is already table stakes — but whether those tools enforce governed definitions or merely execute whatever string the model typed.

Dosi enters at that boundary. It is an OSI-native compile and serve engine: OSI YAML in, warehouse SQL out, exposed through CLI, REST with Apache Arrow, Python, and a **native MCP server** documented on <a href="https://dosi.datus.ai/" rel="nofollow noopener">dosi.datus.ai</a>. For agent architects, the relevant claim is narrow and testable — agents call Dosi tools by metric name; Dosi compiles or returns structured errors; the agent does not author the metric formula unless your workflow explicitly allows draft metrics outside the governed catalog.

## 2. What Dosi exposes through MCP

Understanding the MCP surface starts with separating **authoring** from **consumption**. OSI YAML — the Apache Ossie interchange format — describes datasets, relationships, dimensions, and metrics in a vendor-neutral document. Authoring may happen in dbt MetricFlow, a converter pipeline, or an agent-assisted generation loop; that is upstream of Dosi. Dosi's runtime job is to treat an OSI model as the contract and answer compile-and-query requests against it.

Through MCP, an agent typically interacts with a small, stable tool set rather than an open-ended SQL prompt. The exact tool names evolve with releases; the <a href="https://dosi.datus.ai/" rel="nofollow noopener">Dosi documentation</a> and agent integration guides are canonical. Conceptually, the operations fall into four buckets that mirror how analysts already work in a governed BI environment.

**Discovery** — Which metrics exist in the connected model? What dimensions can slice them? What time grains are valid? Discovery tools let an agent map a natural-language question to candidate metric names before it commits to a query. That step alone eliminates a common failure mode where the model constructs `SUM(order_total)` because it never learned that `revenue` is the certified aggregate with the correct filters baked in.

**Compilation** — Given a metric name, dimension selections, filters, and time range, produce dialect-specific SQL. Dosi handles warehouse differences — date truncation, calendar semantics, dialect-specific join syntax — inside the compiler. The agent passes structured parameters; it does not rewrite `DATE_TRUNC` for Snowflake versus BigQuery.

**Execution or plan return** — Depending on configuration, the MCP path may execute against a connected database and return rows, or return the SQL plan for an downstream runner. The separation matters for security reviews: some teams allow compile-only MCP tools in developer agents while routing execution through audited services.

**Validation and introspection** — Inspect whether a metric request is well-formed before burning warehouse credits. This is where Dosi's metric algebra — additive versus semi-additive behavior, fan-out protection, ratio metrics — becomes visible to the agent as machine-readable feedback rather than wrong numbers.

The same logical engine backs the CLI and REST surfaces, so MCP is not a reduced "demo mode." A metric compiled through `dosi query` in a terminal and a metric requested through MCP share one definition. That parity matters when you debug agent behavior: reproduce the agent's last MCP call on the CLI, see the same SQL, and isolate whether the problem was parameter selection or the underlying OSI model.

REST responses that include Apache Arrow payloads are primarily a service-to-service optimization for Studio backends and internal gateways. MCP clients usually consume JSON tool results sized for LLM context windows. The agent integration story is still "call the semantic tools, not the warehouse driver," regardless of which wire format sits behind a given deployment.

## 3. Structured errors: how agents recover without guessing SQL

Raw SQL failure modes are hostile to agent loops. The warehouse returns `SQL compilation error: column not found` or, worse, a successful query with silently doubled totals because an many-to-many join path was wrong. The agent sees an error string or a plausible number; neither tells it *which* part of the business question was invalid — wrong metric, incompatible dimension, illegal filter combination, missing entity join, unsupported time grain.

Dosi's MCP path is designed around a different feedback contract: **structured error codes** paired with short human-readable messages and actionable hints. Product documentation describes stable codes, candidate metric or dimension names when the request was ambiguous, and fix-it guidance so the agent can adjust parameters instead of abandoning governed metrics and drafting new SQL from column names. That design choice reflects how LLM agents actually fail in production — not by refusing to retry, but by retrying *creatively* in ways that drift further from the certified definition.

Consider a concrete failure sequence. An agent requests `avg_order_value` grouped by `customer_segment` at daily grain for a metric whose OSI definition only allows order-level dimensions. A text-to-SQL agent might rewrite the query with a window function over customers. A governed path returns an error that says, in effect: this dimension is not valid for this metric at this grain — here are the dimensions that are. The agent's second attempt uses `order_channel` instead. The SQL still comes from Dosi; the definition of `avg_order_value` never changed.

Another common case is ambiguous naming. OSI models often carry `revenue`, `gross_revenue`, and `net_revenue`. Natural language "revenue last quarter" maps poorly without discovery. Structured errors that surface **candidate metric names** turn a vague user prompt into a disambiguation turn the agent can handle transparently: "Did you mean `net_revenue` or `gross_revenue`?" The user experience resembles a careful analyst confirming the explore field — not a black-box rewrite.

Fan-out and double-counting errors deserve separate mention because they are the hardest for agents to detect from result shape alone. Semantic engines that understand relationship cardinality can reject requests that would explode rows before execution. An agent that only sees SQL errors learns syntax; an agent that sees semantic errors learns **metric safety**. Over a multi-step task — compare regions, then drill into product category — that difference compounds.

This is the sharpest contrast with "connect Claude to Postgres and let it cook." Database MCP servers are essential for ad-hoc exploration; they are the wrong default for recurring KPI questions your organization already defined. Structured errors are what make governed MCP viable as the **default path** for certified metrics, with raw SQL reserved for exploratory or uncatalogued questions.

## 4. Integration patterns for Claude Code, Codex, and custom agents

MCP integration patterns are converging across agent hosts even when product marketing differs. The implementation details live in Dosi's agent guides on <a href="https://dosi.datus.ai/" rel="nofollow noopener">dosi.datus.ai</a> — including walkthroughs for Claude Code and Codex-style setups as of August 2026. This section stays at the architectural level so it remains accurate as host UIs change.

**Pattern A — General coding agent as MCP client, Dosi as semantic server.** Claude Code, Claude Desktop, or an OpenAI Codex environment configured with MCP loads Dosi's tool manifest at session start. The developer points the server config at a running Dosi instance (local binary or team-hosted service) and an OSI model path. When the user asks a data question in the same session as a pipeline refactor, the coding agent can call Dosi tools alongside filesystem and git tools. The agent generates application code grounded in the same metric names the finance team certifies — not a one-off aggregate invented for the prompt.

Registration is conceptually simple: add a server entry to the host's MCP configuration with the command or URL Dosi documents for your platform, ensure the OSI model and warehouse credentials are reachable from that process, and restart the agent host so tools appear in the manifest. No custom prompt engineering is required for tool discovery; MCP handles naming and schemas. Teams already using Claude Code for dbt or Airflow edits can add Dosi without replacing their editor workflow.

**Pattern B — Datus Agent with the `datus-semantic-dosi` adapter.** Datus-agent remains open source; Dosi does not. Inside Datus Studio, the <a href="https://docs.datus.ai/dev/adapters/semantic_adapters/" rel="nofollow noopener">semantic adapters guide</a> documents a **`datus-semantic-dosi`** path that executes OSI metrics through Dosi without requiring MetricFlow in the execution chain. Retrieval — schema, reference SQL, subject context — still flows through Datus Knowledge; compilation and governed execution flow through Dosi when the handoff format is OSI. MCP here is both outward-facing (other agents can call Dosi) and inward-facing (Datus uses the same engine the Studio component ships).

**Pattern C — Complementary two-agent split.** A [data engineering agent](/blog/what-is-data-engineering-agent) maintains and evolves OSI definitions, validates new metrics, and publishes certified objects. A general-purpose coding agent consumes those definitions via Dosi MCP when implementing features, writing tests, or answering stakeholder questions in the IDE. Neither agent duplicates the other's strength; MCP is the bridge described in [MCP and data engineering](/blog/mcp-data-engineering) as "agent as server / agent as client." Dosi is a specialized server for metric governance, not a replacement for repository context or orchestration MCP tools.

**Pattern D — Compile-only MCP for CI and code review.** Some teams expose discovery and compile tools to agents in CI while blocking execution. Pull requests that reference metric names can trigger an agent or script to verify the OSI model compiles for target dialects before merge. This pattern mirrors `dry_run` gates in semantic adapter workflows without giving every bot warehouse write access.

What we deliberately avoid claiming: that any specific host "natively understands" semantics without MCP configuration, or that Codex and Claude Code ship identical MCP config file formats. Hosts differ in config file location, transport (stdio versus SSE), and sandbox networking. The portable part is the protocol and Dosi's tool schemas — not the brand of the editor.

## 5. From OSI definition to governed answer: the request path

Tracing one end-to-end request clarifies where accountability sits. Suppose OSI defines `net_revenue` with a completed-order filter, a USD normalization expression, and monthly default grain; dimensions include `region` and `product_category`; relationships encode orders-to-customers many-to-one with fan-out guards.

The user asks an MCP-enabled agent: "How did net revenue by region trend over the last six closed months?" The agent should not parse `orders` and `refunds` tables. It calls discovery to confirm `net_revenue` exists, reads available dimensions, and constructs a structured metric request — metric `net_revenue`, group by `region`, time range last six complete months, grain month. Dosi compiles Snowflake SQL (or the configured dialect), validates grain and dimension compatibility, and either returns rows or a structured error.

If the user said "by sales rep," the model might guess a join through an unvetted bridge table. Dosi rejects or redirects when `sales_rep` is not a published dimension for that metric, surfacing allowed alternatives. The agent relays the correction to the user or retries with `region` and offers a follow-up path. Accountability remains with the OSI model owners who defined the metric; the agent is a parameterization layer, not an author of business logic.

Execution placement varies by deployment. Developer laptops often run DuckDB or a read replica via Dosi's local tutorial path. Production setups may pair compile MCP with a governed execution service. Arrow-backed REST remains relevant when Studio or an internal API fans out compile jobs; MCP clients in Claude Code typically consume compact JSON. The agent author chooses execution policy; Dosi enforces definition policy.

OSI portability matters at the handoff. The same OSI file compiled for Snowflake in production can compile for DuckDB in CI. Agents that learn metric *names* and *parameter rules* transfer across environments even when warehouse endpoints differ. That is the agent-facing benefit of [open semantic interchange](/blog/open-semantic-interchange-osi): the agent's tool calls stay stable when infrastructure changes underneath.

## 6. Where Dosi sits in the broader MCP data stack

[MCP and data engineering](/blog/mcp-data-engineering) outlines two directions: agents as MCP clients consuming databases, orchestrators, and quality tools; agents as MCP servers exposing context to other agents. Dosi adds a third category worth explicit placement: **semantic MCP servers** that sit between conversational agents and the warehouse.

| MCP role | Example tools | Agent risk if used alone for KPIs |
| --- | --- | --- |
| Database server | Run SQL, list tables | Metric drift, join fan-out, wrong column choice |
| Orchestration server | Trigger DAG, fetch logs | No semantic grounding for answers |
| Catalog server | Search tables, lineage | Structure without certified aggregates |
| **Semantic layer server (Dosi)** | List metrics, compile governed SQL | Requires maintained OSI models upstream |
| DE agent context server | Reference SQL, subject trees | Complements semantics; not a full metric engine |

The practical stack rule from the MCP article still applies: **MCP for the long tail, native or domain-specific servers for the core path.** Semantic questions that hit certified KPIs should hit Dosi (or an equivalent governed layer), not a generic SQL tool. Exploratory questions on new datasets may still use database MCP or a SQL-generating [data engineering agent](/blog/what-is-data-engineering-agent) until definitions graduate into OSI.

Dosi is not a catalog and not a memory layer — those roles remain distinct in [Introducing Dosi](/blog/introducing-dosi) and in Datus Knowledge for the agent stack. It is also not open source as of August 2026; treat it as a Studio-backed runtime you deploy alongside docs and licensing, not as an Apache-licensed sibling of Datus-agent. Competing approaches remain valid: warehouse-native semantic views with platform copilots, Cube's API-first semantic layer with agentic analytics, MetricFlow-backed stacks where dbt owns authoring. Dosi's wedge is **OSI-native compilation and agent-facing MCP with structured errors** — valuable when interchange is already the organizational goal.

For teams evaluating fit, three prerequisites are honest: agreed metric definitions, an OSI (or exportable-to-OSI) model, and an agent host that supports MCP. Without the first, any server — Dosi included — compiles disagreement efficiently. Without the third, you can still use CLI and REST, but you lose the self-correcting agent loop this article focuses on.

## Conclusion

Agents do not need another path to guess SQL; they need a governed path to **request metrics by name** and recover intelligently when parameters are wrong. Dosi's MCP server supplies that path for OSI-defined semantics: discovery and compile tools, multi-dialect SQL generation, and structured error codes that keep the agent inside the certified catalog instead of inventing formulas from column names.

Wire it into Claude Code, Codex-style hosts, or Datus Agent via the documented MCP and `datus-semantic-dosi` adapter paths. Keep database MCP for exploration and orchestration MCP for pipelines; default KPI questions to the semantic server. Read [Introducing Dosi](/blog/introducing-dosi) for product scope, [what a data agent is](/blog/what-is-data-agent) for category context, and <a href="https://dosi.datus.ai/" rel="nofollow noopener">dosi.datus.ai</a> for integration steps — this article is the architecture narrative, not a substitute for the moving target of host-specific config files.

## Frequently asked questions

### How is Dosi MCP different from connecting an agent directly to Snowflake or Postgres?

Database MCP servers expose execution against raw schema. The agent must infer business logic from column names and sample values — the same drift problem semantic layers were built to prevent. Dosi MCP exposes **metric-level operations** tied to OSI definitions: list certified metrics, compile with known grains and dimensions, and return structured errors when a request violates metric rules. Use database MCP for exploration; use semantic MCP for recurring KPIs your organization already defined.

### What structured errors does Dosi return to agents?

As documented on <a href="https://dosi.datus.ai/" rel="nofollow noopener">dosi.datus.ai</a>, Dosi returns **stable error codes** alongside human-readable messages — including hints when a dimension or grain is invalid, when a metric name is ambiguous, or when a filter combination cannot compile. The intent is to let an agent adjust parameters and retry without abandoning governed metrics for ad-hoc SQL. Exact code catalogs evolve by release; treat product docs as canonical.

### Can I use Dosi MCP with Claude Code and OpenAI Codex?

Yes, at the pattern level: both support MCP clients that discover tools from configured servers. Dosi publishes agent integration guides on <a href="https://dosi.datus.ai/" rel="nofollow noopener">dosi.datus.ai</a> for Claude Code and Codex-style setups. Config file format, transport, and sandbox networking differ by host — follow the guide for your environment rather than assuming identical steps.

### Is Dosi MCP open source like Datus-agent?

No. Dosi is a **Datus Studio component** with product documentation at dosi.datus.ai; it is not Apache-licensed as of August 2026. Datus-agent remains open source and can integrate with Dosi through the documented semantic adapter, but the Dosi engine itself is a commercial runtime layer.

### Does Dosi MCP replace Datus Knowledge or text-to-SQL in Datus Agent?

No. Datus Knowledge holds retrieval context — schema, reference SQL, subjects — that helps agents choose *what* to ask. Dosi compiles and executes **OSI metric definitions** when the governed object is an interchange metric. Text-to-SQL and SQL generation still apply for uncatalogued questions or row-level extracts. The three layers complement each other rather than collapsing into one tool.

### We already use MetricFlow or Cube — why add Dosi MCP?

MetricFlow and Cube remain strong authoring and serving stacks in many estates. Dosi targets teams standardized on **OSI YAML** as the portable handoff and want a native multi-dialect compiler with an agent-first MCP surface and structured errors. It is an execution and consumption path for interchange, not a mandatory replacement for existing semantic products — especially if your organization is not yet exporting OSI.

## Related articles

- [Introducing Dosi](/blog/introducing-dosi/) — the engine behind the MCP surface.
- [MCP and data engineering](/blog/mcp-data-engineering/) — agent-as-client and agent-as-server patterns.
- [What is a data agent?](/blog/what-is-data-agent/) — the category context for these agents.
- [Dosi vs MetricFlow](/blog/dosi-vs-metricflow/) — runtime choice for OSI metrics.
- [Open Semantic Interchange (OSI)](/blog/open-semantic-interchange-osi/) — the interchange format agents compile.
