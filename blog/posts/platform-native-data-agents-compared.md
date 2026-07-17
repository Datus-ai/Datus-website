---
title: "Platform-Native Data Engineering Agents Compared: Cortex Code, Genie Code, and BigQuery DE Agent"
description: "A detailed comparison of Snowflake Cortex Code, Databricks Genie Code, and Google BigQuery Data Engineering Agent — and the case for open, cross-stack alternatives."
author: "John Smith"
date: 2026-06-10
lastmod: 2026-06-10
head:
  - - meta
    - name: keywords
      content: "Snowflake Cortex Code, Databricks Genie Code, BigQuery Data Engineering Agent, platform-native data engineering agent, Cortex Code vs Genie Code, open data engineering agent, cross-stack data agent"
  - - meta
    - property: og:title
      content: "Platform-Native Data Engineering Agents Compared: Cortex Code, Genie Code, and BigQuery DE Agent"
  - - meta
    - property: og:description
      content: "A detailed comparison of Snowflake Cortex Code, Databricks Genie Code, and Google BigQuery Data Engineering Agent — and the case for open, cross-stack alternatives."
  - - meta
    - property: og:type
      content: article
  - - meta
    - property: og:url
      content: https://datus.ai/blog/posts/platform-native-data-agents-compared
  - - meta
    - property: og:image
      content: https://datus.ai/logo_dark.svg
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - link
    - rel: canonical
      href: https://datus.ai/blog/posts/platform-native-data-agents-compared
---

# Platform-Native Data Engineering Agents Compared: Cortex Code, Genie Code, and BigQuery DE Agent

## TL;DR

- **Three major platform-native data engineering agents** have launched in the past 12 months: Snowflake Cortex Code (Nov 2025, expanded Feb 2026), Databricks Genie Code (Mar 2026 GA), and Google BigQuery DE Agent (Nov 2025 Preview, Apr 2026 GA).
- All three are **free or usage-priced** — competing on platform adoption, not agent revenue. All three offer **autonomous pipeline management**, **multi-model support**, **MCP integration**, and **deep platform-native capabilities** (Unity Catalog for Genie Code, Knowledge Catalog for BigQuery DEA, Horizon for Cortex Code).
- Cortex Code is now available as a **standalone subscription** (no Snowflake account required) — partially breaking the platform-lock-in framing.
- Genie Code reports 77.1% task completion vs 32.1% for general agents in internal testing — the strongest published accuracy claim among the three.
- BigQuery DEA reports 90% ETL migration time reduction (Vodafone case) and ships a **Data Agent Kit** (MCP + VS Code + Claude Code + Gemini CLI integration) — the most open integration surface.
- The case for an open, cross-stack agent (like Datus): platform-native agents are best-in-class within their ecosystem and blind outside it. Teams running Snowflake + BigQuery + a lakehouse need an agent that operates across all three, not three agents with three different context models.

Your team runs Snowflake for warehousing, BigQuery for ML feature stores, and a Databricks lakehouse for data science. Each platform now ships a data engineering agent: Snowflake Cortex Code generates dbt models and Airflow DAGs. Databricks Genie Code builds Spark pipelines and monitors them 24/7. BigQuery DE Agent ingests, transforms, and orchestrates — and ships a Data Agent Kit so you can work from VS Code or Claude Code. Each agent is excellent within its own ecosystem. Each is blind outside it. The question is not which agent is best — it is whether your architecture can afford to run three agents with three context models that do not share learning, or whether a cross-stack agent with unified context is worth trading platform-native depth for multi-platform coverage. This article compares the three, lays out a five-factor evaluation framework, and makes the case for both approaches — because the right answer depends on your stack, not on the agent spec sheet.

## 1. The three platform agents: capability comparison

### Snowflake Cortex Code

**Launched:** November 2025, major expansion February 2026.

**Key capabilities:**
- Autonomous pipeline development — generates, tests, and deploys dbt models and Airflow DAGs within the Snowflake ecosystem.
- Multi-model support: Claude Opus 4.6, GPT-5.2, Gemini 3 — user-selectable by task type.
- dbt + Airflow integration: understands dbt project structure, model dependencies, and can generate complete dbt transformation pipelines with Airflow orchestration.
- Data Science / ML Skill (Preview): extends agent capabilities into ML model development within Snowflake.
- Horizon governance integration: access control, data masking, and audit logging inherited from the Snowflake platform.

**Pricing:** Standalone subscription available (no Snowflake account required) — a significant shift from the original platform-bundled model. Also available included with Snowflake accounts.

**Distinctive strength:** dbt depth. Cortex Code has the deepest dbt integration of any platform agent — it understands dbt project conventions, can refactor across models, and can generate complete dbt transformation pipelines with correct `ref()` dependencies.

**Distinctive limitation:** Snowflake-optimized SQL generation. Cortex Code generates queries optimized for Snowflake's query engine, which may not be optimal (or even valid) on other platforms. The standalone subscription makes the agent accessible without a Snowflake account, but the generated code still targets Snowflake.

**4,400+ users** as of early 2026.

### Databricks Genie Code

**Launched:** March 2026 GA.

**Key capabilities:**
- Autonomous pipeline development: Spark Declarative Pipelines — generates, tests, and deploys Spark-based data pipelines within the Databricks environment.
- 24/7 proactive monitoring: actively monitors pipeline health, detects anomalies, and can autonomously remediate common failure patterns.
- Unity Catalog deep integration: semantic context from Unity Catalog — table metadata, column descriptions, lineage, tags — is automatically injected into agent context.
- Agent Plan + Memory + Agent Skills: supports multi-step planning with persistent memory across sessions and extensible skill definitions.
- MCP integration: can call external MCP servers and be called as an MCP server.

**Performance:** Internal testing reports **77.1% task completion rate** vs 32.1% for general-purpose agents on equivalent data engineering tasks — the strongest published performance claim among the three.

**Pricing:** Free — included with Databricks platform access (compute costs apply).

**Distinctive strength:** Unity Catalog integration. Genie Code inherits the richest metadata context of any platform agent — table descriptions, column-level lineage, ownership tags, and governance policies — without users needing to configure context separately.

**Distinctive limitation:** Spark/Databricks-native. Genie Code's pipeline generation targets the Databricks runtime (Spark, Delta Lake). Teams running non-Databricks compute cannot use Genie Code for pipeline work.

### Google BigQuery Data Engineering Agent

**Launched:** November 2025 Preview, April 2026 GA.

**Key capabilities:**
- Natural-language pipeline creation: describe a pipeline in natural language; the agent generates and deploys BigQuery SQL transformations.
- Knowledge Catalog integration: semantic context from BigQuery's data catalog — table schemas, column descriptions, data quality scores, lineage.
- Advanced data modeling: supports Data Vault, Star Schema, and OBT pattern generation — understanding the modeling paradigm and generating appropriate SQL.
- **Data Agent Kit**: MCP tools + VS Code extension + Claude Code integration + Gemini CLI integration — the most open development surface of the three. Developers can use the BigQuery DE Agent from their preferred IDE and agent environment.
- BigQuery remote MCP Server: exposes BigQuery capabilities as MCP tools for external agents.

**Case study:** Vodafone reported **90% reduction in ETL migration time** using the BigQuery DE Agent.

**Pricing:** Included with BigQuery usage — no separate agent pricing.

**Distinctive strength:** Developer tooling openness. The Data Agent Kit is the most IDE-agnostic, agent-ecosystem-friendly integration of the three. Teams using VS Code + Claude Code + Gemini CLI can interact with the BigQuery DE Agent without leaving their development environment.

**Distinctive limitation:** BigQuery-only. The agent generates BigQuery SQL. Teams running multi-warehouse or lakehouse architectures cannot use it for non-BigQuery workloads.

## 2. The platform-native advantage: depth

The platform-native agents share structural advantages that open, cross-stack agents must contend with:

**1. Metadata context is automatically rich.** Genie Code inherits Unity Catalog metadata without configuration. Cortex Code inherits Horizon governance policies. BigQuery DEA inherits Knowledge Catalog semantics. An open agent must build its own context from schema inspection and user input — which is more work upfront but produces portable context.

**2. Governance is inherited.** Access control, data masking, audit logging — all inherited from the platform's governance layer. An open agent must implement its own governance or integrate with platform-native governance through APIs.

**3. Query optimization is platform-aware.** Cortex Code generates Snowflake-optimized SQL. Genie Code generates Spark-optimized code. BigQuery DEA generates BigQuery-optimized SQL. An open agent must either generate dialect-agnostic SQL (leaving performance on the table) or implement dialect-specific optimization for each target (more engineering investment).

**4. Pricing is free or negligible.** All three are priced to drive platform adoption, not agent revenue. An open agent must compete on capability when the platform-native alternative is effectively free for existing platform users.

## 3. The platform-native limitation: breadth

The structural limitation of every platform-native agent is the same: they are **best-in-class within their ecosystem and blind outside it.**

A team running Snowflake for warehousing, BigQuery for ML feature stores, and a Databricks lakehouse for data science has three options:

- **Option A: Run three agents.** Cortex Code for Snowflake workloads, BigQuery DEA for BigQuery workloads, Genie Code for Databricks workloads. Three context models to maintain. Three agent interfaces to learn. Three feedback loops that do not share learning.
- **Option B: Pick one platform and one agent.** Migrate all workloads to that platform. Accept the migration cost and the single-vendor dependency.
- **Option C: Run one cross-stack agent.** Accept that it will not have the platform-native depth of any single-platform agent. Gain a unified context model, one interface, and cross-platform portability.

Most large enterprises run heterogeneous stacks — Snowflake + BigQuery + a lakehouse is not unusual. For these teams, Option C is not a compromise; it is the only viable architecture. Three agents with three context models produce three versions of "what is our revenue number?" — exactly the fragmentation problem the semantic layer was supposed to solve.

## 4. Cortex Code's standalone subscription: the lock-in framing weakens

Snowflake's decision to offer Cortex Code as a standalone subscription — no Snowflake account required — is strategically significant. It partially invalidates the "platform-native agents lock you in" argument: you can use Cortex Code without being a Snowflake customer.

But the framing shift is more nuanced:

- You can **access** Cortex Code without Snowflake, but the agent's code is still **Snowflake-optimized.** Generated SQL targets Snowflake's dialect. Pipeline generation assumes Snowflake's execution environment. The agent is not locked behind a Snowflake account, but its output is locked to Snowflake infrastructure.
- This is better than full lock-in — teams can evaluate Cortex Code without committing to Snowflake — but it does not make Cortex Code a cross-stack agent. It makes it a Snowflake agent with an open front door.

The architectural question remains: do you want an agent that targets one platform deeply, or one that operates across platforms with reasonable competence on each? Both approaches are valid — but they serve different team structures.

## 5. How to evaluate: a 5-factor framework

**1. Stack homogeneity.** Single-platform team (all Snowflake, all Databricks, all BigQuery) → platform-native agent is the obvious choice. Multi-platform team → cross-stack agent or accept the overhead of multiple agents.

**2. Context portability.** If your semantic definitions need to travel across platforms — the same `net_revenue` metric consumed by Snowflake dashboards and BigQuery ML pipelines — a cross-stack agent with a unified context model has an architectural advantage. If all consumption happens within one platform, the advantage disappears.

**3. Governance integration.** Platform-native agents inherit platform governance automatically — the simplest path if your governance model is already platform-native. Cross-stack agents must implement governance across platforms — more work, but governance that follows the data rather than the platform.

**4. Development tooling preference.** BigQuery DEA's Data Agent Kit (MCP + VS Code + Claude Code) offers the most open development experience. Cortex Code is more Snowsight-centric. Genie Code is Databricks workspace-centric. Choose based on where your engineers already work.

**5. The agent's accuracy claim.** Genie Code's 77.1% vs 32.1% is the most concrete published benchmark — but it compares against general-purpose agents, not against other data engineering agents. Cross-stack agents do not have direct comparative benchmarks yet. Evaluate through POC, not spec sheets.

## 6. The open, cross-stack case

Datus belongs to the open, cross-stack category alongside Altimate.ai (dbt-focused) and other emerging open-source agents. The architectural argument for this approach:

- **Context is platform-agnostic.** A `net_revenue` metric means the same thing whether the underlying table is in Snowflake, BigQuery, or a Postgres instance. A context engine that builds and maintains metric definitions independently of the execution platform is a portable asset.
- **Agent output is multi-dialect.** Generating SQL for Snowflake, BigQuery, and DuckDB from the same context model is an engineering challenge, but it is a solved problem at the query generation layer (MetricFlow does it; Datus's multi-DB adapter architecture does it).
- **Subagent scope is platform-aware but platform-flexible.** A Subagent scoped to a marketing analytics domain can generate queries against Snowflake today and BigQuery next quarter — the context model stays consistent; the execution layer adapts.
- **Feedback is unified.** One feedback loop — upvotes, issue reports, corrections — improves context across all platforms, rather than fragmenting learning across three agents with three context models.

The tradeoff: depth. A cross-stack agent will not have the Unity Catalog-level metadata richness of Genie Code, the Horizon governance integration of Cortex Code, or the Knowledge Catalog semantics of BigQuery DEA — not on day one, at least. The path to depth is through integrations and adapters, not through platform-native inheritance. For some teams, that tradeoff is worth making for portability, unified context, and multi-platform coverage.

## Conclusion

Cortex Code, Genie Code, and BigQuery DE Agent are each impressive pieces of engineering — and each represents a serious bet by its parent platform that data engineering workflows will be agent-mediated within the next three years. The platforms are not charging for these agents because they are competing on agent revenue. They are competing on platform stickiness: an agent that deeply understands your Snowflake environment, generates Snowflake-optimized SQL, and inherits your Snowflake governance policies makes it materially harder to migrate workloads elsewhere. That is not sinister — it is good product design. But it means the decision about which agent to adopt is also a decision about which platform you are committing to for the next phase of your data infrastructure. For single-platform teams, this is not a problem — adopt the platform-native agent and benefit from depth that a cross-stack agent will take years to match. For multi-platform teams, the calculus is harder: three agents, three context models, three interfaces, three feedback loops that do not share learning — versus one cross-stack agent, one context model, one interface, and the acceptance that it will not match any single platform agent on depth within that platform. There is no universal right answer. But there is a universal wrong answer: deploying consumer agents — chatbots, BI agents, analysis agents — against raw schema without any producer tier at all. Whether you choose platform-native or cross-stack, invest in the context layer first.

## Frequently asked questions

### What is the difference between Cortex Code, Genie Code, and BigQuery DE Agent?

All three are platform-native data engineering agents: Cortex Code targets Snowflake (with dbt/Airflow depth), Genie Code targets Databricks (with Unity Catalog integration and Spark pipelines), BigQuery DE Agent targets Google BigQuery (with the most open developer tooling via Data Agent Kit). Capabilities are broadly comparable; the difference is which platform ecosystem the agent is optimized for.

### Is Cortex Code really standalone now?

Yes — since February 2026, Cortex Code is available as a standalone subscription that does not require a Snowflake account. However, the agent's generated code still targets Snowflake infrastructure, so you need Snowflake to execute the output even if you do not need a Snowflake account to access the agent.

### Are platform-native agents free?

Effectively yes. Genie Code and BigQuery DE Agent are included with platform access (compute costs apply). Cortex Code is available as a standalone subscription (pricing not publicly detailed) or included with Snowflake accounts. The agents are priced to drive platform adoption, not to generate direct agent revenue.

### Should I use a platform-native agent or an open cross-stack agent?

Single-platform team (all Snowflake, all Databricks, all BigQuery) → platform-native agent is the obvious choice — deeper integration, automatic governance inheritance, platform-optimized output. Multi-platform team → cross-stack agent provides a unified context model, consistent interface, and output portability across platforms. The key insight: in either case, invest in a producer-tier agent before deploying consumer agents.

## Related articles

- [Best Data Engineering Agents](/blog/best-data-engineering-agents/) — full category comparison
- [Open Source Data Engineering Agents](/blog/open-source-data-engineering-agents/) — the open alternative
- [What is a data engineering agent?](/blog/what-is-data-engineering-agent/) — the category definition
