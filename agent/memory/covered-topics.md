# Covered Topics Ledger

Authoritative list of what's already published, so we never write a duplicate.
**Read this before choosing a direction.** Seeded Jul 2026 from every post that
existed then — the `blog/posts/*.md` articles plus the two
`blog/data-engineering-agent/` pillar pages. The `index.md` listing pages are
excluded; the non-article utility entries are still listed below under "Utility
(not articles)" for completeness. Append new posts under "New posts (written by
this agent)".

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
Catalog, Data Catalog, Text-to-SQL, Schema Linking, RAG, Data Engineering Agent,
Data Contract, Medallion Architecture, Change Data Capture.

**⚠ Broken glossary links (article set but post missing → OPEN, high priority to fill):**
- ~~Data Contract → `/blog/what-is-data-contract/`~~ — FILLED (PR #55, 2026-07-10).
- MCP → `/blog/what-is-mcp-data-engineering/` (no post; a different `mcp-data-engineering` exists) — write `what-is-mcp-data-engineering` OR repoint the glossary link.

**Open directions (no article):** see `knowledge/glossary-directions.md` (31 terms).

---

## Duplication flags (don't repeat these mistakes)
- Two "best data engineering agents" posts exist — don't add a third.
- Two DE-agent definition posts exist — don't add another; link `what-is-data-engineering-agent-2026`.
- Large overlapping "context" cluster (contextual-data-engineering / context-engine / structured-context / semantic-context) — a new context angle must be clearly distinct.

---

## New posts (written by this agent)
<!-- Append records here (chronological order) per memory/README.md format. -->

### what-is-data-contract
- Title: What Is a Data Contract? Definition, Schema Enforcement & Examples
- Target keyword: data contract (what is a data contract, schema enforcement, ODCS, dbt contracts, data contract vs data quality test)
- Angle: strict machine-checkable definition + ODCS/dbt examples + breaking-change walkthrough + honest contract-vs-test/registry/catalog/semantic-layer table + dbt platform constraint matrix; agent angle = contracts are the governed floor, evolvable context is the living layer above
- Source direction: broken glossary link `data-contract` (article was set, post missing; linked 3× from what-is-data-catalog / what-is-data-mesh / index)
- Key sources: bitol.io ODCS v3.1.0; docs.getdbt.com/docs/mesh/govern/model-contracts; datacontract.com; en.wikipedia.org/wiki/Data_contract; Gartner Hype Cycle for Data Management 2025
- Internal links added: what-is-data-mesh, what-is-data-catalog, what-is-semantic-layer, what-is-schema-linking, contextual-data-engineering, subagents-domain-specific-data-agents, what-is-data-engineering-agent-2026 (reciprocal links from catalog/mesh already existed)
- Glossary updated: yes (article already set to /blog/what-is-data-contract/ — now resolves)
- PR: https://github.com/Datus-ai/Datus-website/pull/55   Status: open
- Date: 2026-07-10

### what-is-medallion-architecture
- Title: What Is Medallion Architecture? Bronze, Silver & Gold Layers
- Target keyword: medallion architecture (what is medallion architecture, bronze silver gold, medallion lakehouse architecture, multi-hop architecture, gold layer vs semantic layer)
- Angle: crisp Bronze/Silver/Gold definition + what actually belongs in each layer (real objects, MV example) + honest anti-patterns section (3-layers-for-everything, gold sprawl/metric drift, propagated quality debt, producer-centric) + Gold-vs-semantic-layer contrast + the whitespace: a "which layer should an AI agent query?" decision table (Gold=KPI, Silver=causal diagnosis, Bronze=reconcile); agent angle = medallion organizes data quality, evolvable context organizes meaning on top (which table is authoritative)
- Source direction: referenced-but-unwritten glossary term `medallion-architecture` — link already advertised in blog index (Jun 30, 2026) + linked from what-is-apache-hudi; glossary term had no article
- Key sources: learn.microsoft.com/azure/databricks/lakehouse/medallion (updated 2026-05-07); databricks.com/glossary/medallion-architecture; lakshmanok.medium.com (bronze/silver/gold + Platinum layer + "keep Gold small"); moderndata101/matterbeam criticism (producer-centric, tech-homogeneity)
- Internal links added: what-is-lakehouse, what-is-data-lake, what-is-data-warehouse, what-is-apache-iceberg, what-is-apache-hudi, what-is-semantic-layer, what-is-schema-linking, contextual-data-engineering, what-is-data-engineering-agent-2026, what-is-data-contract (reciprocal links added from what-is-lakehouse + what-is-data-lake; what-is-apache-hudi already linked)
- Glossary updated: yes (set article: /blog/what-is-medallion-architecture/ on Medallion Architecture term)
- PR: https://github.com/Datus-ai/Datus-website/pull/56   Status: open
- Date: 2026-07-10

### what-is-cdc
- Title: What Is Change Data Capture (CDC)? Methods & Use Cases
- Target keyword: change data capture (what is CDC, CDC methods, log-based CDC, Debezium, CDC to lakehouse, CDC pipeline)
- Angle: crisp definition + the three CDC methods in one tradeoff table (delete-capture + source-load columns the SERP glosses) + real use cases + honest "where CDC breaks" (initial snapshot handoff, ordering, exactly-once/idempotent sinks, deletes, schema drift) + CDC-to-lakehouse (Iceberg/Hudi/Fivetran 2025–2026); differentiated agent angle = CDC makes "freshness" a checkable fact not an assumption, plus reconcile CDC copy vs source
- Source direction: open glossary term `change-data-capture` (no article; Processing category) — complements published Apache Hudi (upserts/change streams)
- Key sources: confluent.io/learn/change-data-capture; debezium.io features docs + 2025 blog (ms-range latency MySQL/Postgres); striim.com CDC methods; rivery.io CDC; fivetran.com press (Iceberg + Snowflake)
- Internal links added: what-is-apache-hudi, what-is-apache-iceberg, what-is-lakehouse, what-is-medallion-architecture, what-is-data-warehouse, what-is-data-contract, what-is-data-engineering-agent-2026, contextual-data-engineering (reciprocal links added from what-is-apache-hudi + what-is-data-contract)
- Glossary updated: yes (set article: /blog/what-is-cdc/ on Change Data Capture term)
- PR: https://github.com/Datus-ai/Datus-website/pull/58   Status: open
- Date: 2026-07-17

### semantic-layer-tools-list-osi
- Title: Semantic Layer Tools in 2026: Complete List + OSI (Apache Ossie) Status
- Target keyword: semantic layer tools (semantic layer tools list, semantic layer comparison 2026, OSI support, Apache Ossie support status)
- Angle: vendor-neutral DIRECTORY/LIST post (distinct from the existing OSI *standard* explainer and osi-vs-metricflow) — 15 tools across 3 architecture buckets (standalone / platform-native / API-BI-native) in one master grid with Open Source / entry pricing / AI-agent access / OSI status (🟢 converter merged / 🟡 working group / 🔴 not participating); + 3-level "what OSI support actually means" (reference converters vs working-group intent vs native support — none shipped) + 4 buyer questions + OSI readiness scorecard; agent angle = tools author semantics, OSI makes them portable, agent-driven context evolution keeps them current
- Source direction: operator-supplied material (~/Documents/31-semantic-layer-tools-list-osi.md); reformatted to house style. NOT a glossary term (list article) → no glossary `article` set
- Key sources (verified 2026-07-21): ossie.apache.org (enters Apache Incubator June 2026, formerly OSI); snowflake.com/dremio.com/getdbt.com blogs "OSI is now Apache Ossie"; github.com/apache/ossie converters dir (dbt/GoodData/Salesforce/Polaris merged, Spark in review; 35+ PRs, 50+ orgs, 3 WGs: Metric Language/Catalog/Ontology)
- Same PR also REFRESHED `open-semantic-interchange-osi.md` to the Apache Ossie framing (was stale: "Sept 2025 launch", old open-semantic-interchange/OSI repo, no Ossie mention). Added: Apache Incubator June 2026 / ASF donation, apache/ossie repo (replaced old repo URL everywhere), merged converters, new FAQ "Is OSI the same as Apache Ossie?", lastmod→2026-07-21. Canonical/slug unchanged
- Internal links added: what-is-semantic-layer, open-semantic-interchange-osi, osi-vs-metricflow, dbt-semantic-layer-metricflow, cube-agentic-analytics, what-is-gooddata, contextual-data-engineering, what-is-data-engineering-agent-2026 (reciprocal link added FROM open-semantic-interchange-osi)
- Glossary updated: no (list article, no matching term)
- PR: https://github.com/Datus-ai/Datus-website/pull/63   Status: open
- Date: 2026-07-21
