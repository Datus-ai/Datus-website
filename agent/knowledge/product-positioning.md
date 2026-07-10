# Knowledge: Product Positioning & Canonical Vocabulary

Use this so every post frames Datus consistently and uses the house terminology.
(Distilled from the existing corpus.)

## What Datus is
> **Datus is an open-source (Apache-2.0) data engineering agent that builds *evolvable context* for your data systems.**

- GitHub: `https://github.com/Datus-ai/Datus-agent` (installs via pip). Hosted: **Datus Studio** (`studio.datus.ai`, browser, zero-install).
- One-liner thesis across the blog: *SQL generation is cheap; reliable data work needs persistent, evolvable context.* Copilots **assist**; agents **act**.

## Architecture (three layers)
1. **Interface Layer** — one agent, multiple entry points sharing context + eval loop:
   - **Datus-CLI** (engineers: build/version context, create & publish subagents, run regressions)
   - **Datus-Chat / Web Chatbot** (analysts & PMs: scoped self-service Q&A, auto feedback)
   - **Datus-API** (expose subagents as endpoints)
   - **MCP Server** (expose Datus tools/context to Claude Desktop, Cursor, Windsurf, Cline)
   - **Datus Studio** (hosted, free) and a **VS Code** extension.
2. **Engine Layer** — the **Context Engine** + **Subagent system** (preferred) + **Workflow system** (fallback orchestration) + **Shared Tools & MCP**.
3. **External Services Layer** — LLMs (BYO model), warehouses (~10+ DBs: Snowflake, BigQuery, Postgres, DuckDB, StarRocks, ClickHouse, …), catalog/lineage, semantic/metric layers (MetricFlow-compatible ingestion), schedulers, BI.

## Canonical vocabulary (use these terms, defined this way)
- **Data engineering agent** — software that turns natural-language intent into *executable* data work (SQL, transformations, pipelines, quality checks) against a real stack, with enough context to skip re-translating columns. A specialized subclass of "data agent."
- **Context Engine** — the core concept. A **dual-dimension / two-axis** context store: a **physical catalog tree** (catalog → database → schema → table, with semantic annotations) + a **logical subject tree** (domain → topic → subtopic, holding metrics, reference SQL, notes). Uses **two-way recall = Tree + Vector memory**. Treats every validated query as training data for the next one.
- **Evolvable context / contextual data engineering** — context (schemas, metrics, validated SQL, rules, feedback) as a first-class *living* asset that grows via feedback, not one-time docs. Three layers: (1) catalog = what exists, (2) semantic layer = governed metrics, (3) institutional memory = validated ad-hoc SQL + deprecations + feedback.
- **Subagent** — a deployable unit = curated scoped context + a vetted tool set + rules/policies for a specific business scenario (e.g. "Retention Analytics subagent"). Two-layer model: foundational subagents (GenSQL, SQL Summary, Semantic) = reusable skills; domain subagents = foundational abilities + scoped context. No model fine-tuning required.
- **Reference SQL** — validated production queries stored and retrieved as strong priors for schema linking / generation.
- **Feedback loop** — upvote/correction that flows back into the Context Engine and regression sets ("feedback as part of the runtime").
- **Reconciliation** — bidirectional, tolerance-bounded comparison of agent output vs trusted reference data; "the definition of done."
- **Skills / AgentSkills** — versioned, inspectable workflow-as-code phases (`etl-plan`, `sql-review`, `execute-job`, `data-compare`, …).
- **MCP (Model Context Protocol)** — Anthropic's client-server standard for agents to discover/use tools; Datus can be MCP **server** and **client**.
- Also: **NL2SQL / text-to-SQL**, **schema linking**, **semantic layer / metric layer / semantic model**, **human-in-the-loop / governed execution / gates**, **one-person data team**, **AI-native**, **cross-stack / stack-agnostic**, **persistent context**, **grounding / hallucination**.

## Differentiators to lean on
1. Persistent, **evolvable context as the product** (vs ephemeral prompt agents).
2. **Feedback loop** static competitors lack.
3. **Subagents** — scoped domain agents without training a model.
4. **Cross-stack / stack-agnostic**, multi-warehouse (vs platform-locked BigQuery/Snowflake/Databricks/Adobe agents).
5. **Open-source / self-hostable** (data stays local); pluggable storage adapters (relational + vector).
6. Process rigor: planning, review gates, **reconciliation**, skills-as-code.

## Competitors (name fairly, tell readers to verify vendor numbers)
- Platform-embedded: BigQuery Data Engineering Agent, Snowflake Cortex, Databricks Genie, Adobe DEA.
- Prompt-as-agent: Claude Code `data-engineer` subagent.
- Open-source frameworks: Wren AI, Altimate.
- Semantic/BI: dbt Semantic Layer / MetricFlow, Cube.dev, LookML/Looker, GoodData, Snowflake Semantic Views.
- Standard: Open Semantic Interchange (OSI).

## Honesty guardrails specific to the product
- Distinguish **shipped** features from **architectural direction** — say which when unsure (the corpus does this explicitly).
- Frame Datus as **complementary** to semantic layers/catalogs/MCP, not a replacement.
- Always "open-source first."
