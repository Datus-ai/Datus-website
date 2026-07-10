# Covered Topics Ledger

Authoritative list of what's already published, so we never write a duplicate.
**Read this before choosing a direction.** Seeded Jul 2026 from the 60 existing
posts. Append new posts under "New posts (written by this agent)".

---

## Already published (seed — do NOT re-write these topics/angles)

### Glossary / "What is X" (definitional)
- `what-is-semantic-layer` — semantic layer; static models break under AI agents
- `what-is-metric-layer` — metric layer vs semantic layer
- `what-is-semantic-model` — semantic model vs semantic view
- `semantic-layer-vs-ontology` — semantic layer vs ontology for agents
- `what-is-data-catalog` — catalog vs agent context
- `what-is-data-agent` — data agent vs data engineering agent
- `what-is-text-to-sql` — text-to-SQL/NL2SQL; context matters
- `what-is-schema-linking` — schema linking; dual-dimension context (GOLD-STANDARD exemplar)
- `rag-data-engineering` — RAG for data engineering; retrieval grounds agents
- `what-is-data-mesh` — data mesh; domain subagents
- `what-is-data-lake` — data lake vs warehouse
- `what-is-data-warehouse` — data warehouse vs lake
- `what-is-lakehouse` — lakehouse; open table formats
- `what-is-lakehouse-catalog` — lakehouse catalog (Hive/Glue/Unity/Polaris/Horizon)
- `what-is-apache-iceberg` — Iceberg; Iceberg vs Delta
- `what-is-apache-hudi` — Hudi; upserts/CDC; Hudi vs Iceberg vs Delta
- `open-semantic-interchange-osi` — OSI standard for portable semantics
- `what-is-data-engineering-agent-2026` — DE agent definition + 2026 comparison (**canonical** DE-agent definition post)
- `what-is-data-engineering-agent` — older DE agent practical guide (near-dup of the 2026 one)

### Comparison / landscape
- `best-data-engineering-agents` and `best-data-engineering-agents-2026` — best DE agents 2026 (⚠ near-duplicate pair; treat 2026 as canonical)
- `platform-native-data-agents-compared` — Cortex/Genie/BigQuery vs open cross-stack
- `open-source-data-engineering-agents` — Datus/Wren/Altimate; when to self-host
- `data-engineering-agent-vs-claude-code` — DE agent vs Claude Code
- `data-engineering-agent-vs-sql-copilot` — DE agent vs SQL copilot
- `osi-vs-metricflow` — standard vs execution engine
- `dbt-semantic-layer-metricflow` — dbt Semantic Layer / MetricFlow guide
- `cube-agentic-analytics` — Cube.dev → agentic analytics
- `what-is-gooddata` — GoodData BI → AI-native

### Thought-leadership / concept
- `agentic-data-engineering-vs-traditional-data-engineering`
- `agentic-data-stack` — the agentic data stack
- `agentic-etl-what-changes-beyond-traditional-etl`
- `ai-data-pipeline-automation-use-cases-architecture-and-tradeoffs`
- `ai-native-data-platforms` — agents as missing infra layer
- `why-data-engineering-needs-agents-not-just-copilots`
- `why-ai-agents-need-semantic-context-to-work-reliably`
- `why-reliable-data-agents-need-more-than-good-prompts`
- `how-structured-context-improves-ai-agent-output`
- `contextual-data-engineering` — evolvable context, 3-layer (pillar)
- `context-engine-data-engineering-agent-accuracy` — context engine → accuracy
- `semantic-modeling-for-agentic-analytics-workflows`
- `what-autonomous-data-engineering-actually-looks-like-in-practice`
- `the-operating-model-of-an-agentic-data-team`
- `data-engineering-agent-architecture` — production architecture
- `enterprise-data-engineering-agent` — enterprise needs (RBAC/audit/governance)
- `subagents-domain-specific-data-agents` — subagents without training a model
- `one-person-data-team` — DE agent multiplies a solo engineer
- `data-engineering-agent-use-cases` — 7 use cases
- `sql-was-never-the-hard-part` — trusted AI SQL via reconciliation

### MCP / integrations
- `mcp-data-engineering` — MCP connects the stack (NOTE: glossary links to a *different* slug `what-is-mcp-data-engineering` which does not exist)
- `how-mcp-changes-data-workflow-automation`
- `using-mcp-extensions-in-data-engineering-workflows`
- `beyond-sql-how-datus-integrates-with-your-entire-data-toolchain`

### Product / release / feature
- `meet_datus` — flagship manifesto (context + subagents)
- `meet-the-general-chat-agent` — general chat agent
- `datus-storage-layer` — pluggable relational+vector storage
- `datus-0-2-6-release-equipping-the-agent-with-a-brain` — 0.2.6 release
- `make-data-agents-truly-usable-ask-explore-and-control-with-confidence`
- `build-your-first-data-engineering-agent` — 15-min tutorial
- `data-engineering-agent/index` — pillar hub page
- `data-engineering-agent/data-engineering-agent-layered-subagent` — layered subagents

### Utility (not articles)
- `posts/index`, `welcome`

---

## Glossary coverage (src/glossary/glossaryData.ts)
**Covered (term has a working `article`):** Data Warehouse, Data Lake, Lakehouse,
Data Mesh, Semantic Layer, Metric Layer, Apache Iceberg, Apache Hudi, Lakehouse
Catalog, Data Catalog, Text-to-SQL, Schema Linking, RAG, Data Engineering Agent.

**⚠ Broken glossary links (article set but post missing → OPEN, high priority to fill):**
- Data Contract → `/blog/what-is-data-contract/` (no post) — write `what-is-data-contract`.
- MCP → `/blog/what-is-mcp-data-engineering/` (no post; a different `mcp-data-engineering` exists) — write `what-is-mcp-data-engineering` OR repoint the glossary link.

**Open directions (no article):** see `knowledge/glossary-directions.md` (31 terms).

---

## Duplication flags (don't repeat these mistakes)
- Two "best data engineering agents" posts exist — don't add a third.
- Two DE-agent definition posts exist — don't add another; link `what-is-data-engineering-agent-2026`.
- Large overlapping "context" cluster (contextual-data-engineering / context-engine / structured-context / semantic-context) — a new context angle must be clearly distinct.

---

## New posts (written by this agent)
<!-- Append records here per memory/README.md format. Newest first. -->
