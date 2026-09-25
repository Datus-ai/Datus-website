---
title: "Cube.dev Alternatives: Open Semantic Models for AI Agents"
description: "Cube.dev alternatives compared for 2026: dbt MetricFlow, AtScale, LookML, Snowflake, Databricks, Malloy and Apache Ossie — and when staying on Cube is right."
author: "Evan Paul"
date: 2026-09-25
lastmod: 2026-09-25
head:
  - - meta
    - name: keywords
      content: "cube.dev alternatives, cube alternatives, cube semantic layer alternatives, cube.dev competitors, open source semantic layer, semantic layer for AI agents, Apache Ossie, dbt Semantic Layer vs Cube, Cube Cloud pricing"
  - - meta
    - property: og:title
      content: "Cube.dev Alternatives: Open Semantic Models for AI Agents"
  - - meta
    - property: og:description
      content: "Cube.dev alternatives compared for 2026: dbt MetricFlow, AtScale, LookML, Snowflake, Databricks, Malloy and Apache Ossie — and when staying on Cube is right."
  - - meta
    - property: og:type
      content: article
  - - meta
    - property: og:url
      content: https://datus.ai/blog/cube-semantic-layer-alternatives/
  - - meta
    - property: og:image
      content: https://datus.ai/logo_dark.svg
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - link
    - rel: canonical
      href: https://datus.ai/blog/cube-semantic-layer-alternatives/
---

# Cube.dev Alternatives: Open Semantic Models for AI Agents

## TL;DR

- **Stay on Cube** if your pain is latency, embedded multi-tenant analytics or serving one model to many APIs — Cube's pre-aggregations, Cube Store and SQL / REST / GraphQL / MCP surface are hard to beat. If the pain is only the Cube Cloud bill, Cube Core and Cube Store are Apache 2.0 and self-hostable: you may be replacing a hosting plan, not a semantic layer.
- **dbt Semantic Layer (MetricFlow)** fits teams whose metrics already live next to dbt models; MetricFlow has been Apache 2.0 since October 2025 and dbt is one of four formats with a merged Apache Ossie converter.
- **AtScale** fits Excel- and Power BI-heavy enterprises; **LookML** fits Looker shops; **Snowflake Semantic Views** or **Databricks Metric Views** fit single-platform estates; **Malloy** fits teams that want an MIT-licensed modeling language.
- **Apache Ossie (OSI) + Dosi** fits teams that need one set of definitions to compile for several warehouses and to be read by agents over MCP — and it can run alongside Cube rather than replace it.
- The question most comparisons skip: **can your definitions leave the tool you pick?** As of September 2026 there is no merged Cube-to-Ossie converter, so every move off Cube starts with re-expressing cube data models.

"Cube alternatives" is an ambiguous search. Half the results are about Cube the FP&A planning suite, and a few about a video game; this page is about **Cube (cube.dev)**, the open-source semantic layer and agentic analytics platform. If you run Cube today, or have it on a shortlist, the useful question is not "what else is there" but "which part of Cube am I trying to replace, and what happens to my metric definitions when I do". This guide answers that for seven realistic options, including the one most lists leave out: not leaving.

## 1. What you'd actually be replacing

Cube is three products that people discuss as one, and most alternatives only replace one of them. Getting this wrong is how teams migrate for a year to solve a problem they could have fixed with a configuration change.

The first layer is **Cube Core**, the semantic layer itself: cube data models written in YAML or JavaScript that define measures, dimensions and joins, compiled to SQL against your warehouse and served over SQL, REST and GraphQL. The <a href="https://github.com/cube-js/cube" rel="nofollow noopener">Cube repository</a> licenses the backend under Apache 2.0 and the client libraries under MIT, and as of September 2026 it shows roughly 20.9K GitHub stars. The second layer is **Cube Store**, the Rust pre-aggregation store that turns repeated analytical queries into sub-second lookups; it lives in the same repository and ships as its own Docker image. The third layer is **Cube Cloud**, the commercial platform: hosting, high availability, the semantic model and analytics agents that grew out of Cube's D3 launch, embedded dashboards, SSO and support.

That split changes the conversation. A team that is unhappy with <a href="https://cube.dev/pricing" rel="nofollow noopener">Cube Cloud pricing</a> — Starter at $40 per developer per month and Premium at $80 per developer per month as of September 2026, with Enterprise quoted — has a self-hosted path that keeps every model it wrote. A team that is unhappy with the *modeling approach* — definitions in a Cube-specific format that other tools cannot read — has a different problem that self-hosting does not fix. Our [Cube architecture deep dive](/blog/cube-agentic-analytics/) covers how the three layers fit together; the rest of this guide is about the second kind of problem.

## 2. Why teams look for Cube alternatives

Four drivers come up repeatedly, and each points to a different alternative. Naming yours first saves you from evaluating tools that solve someone else's problem.

**Definitions that can't travel.** Cube data models are Cube's format. Cube joined the Open Semantic Interchange launch initiative and sits in the working group, but the <a href="https://github.com/apache/ossie">Apache Ossie repository</a> lists reference converters for dbt, GoodData, Apache Polaris and Salesforce — none for Cube. For a team that wants the same revenue definition in a BI tool, a notebook, an agent and a second warehouse, that is the gap that matters, and it is covered in depth in [Apache Ossie (OSI) vs Cube](/blog/osi-vs-cube/).

**Metrics already live in dbt.** Many teams adopted Cube before dbt had a semantic layer of its own. When the transformation code and the metric code are maintained by the same people in the same repository, a second modeling layer starts to look like duplicated work.

**BI tools that expect OLAP.** Finance and operations teams that live in Excel pivot tables and Power BI often need MDX or DAX connectivity rather than a SQL or REST API. Cube's surface is developer-first; some enterprises need the opposite.

**Everything is in one warehouse.** If the whole estate is Snowflake or Databricks, the platform's native semantic objects remove an entire service from the stack, and platform governance applies to metrics without a separate permission model.

## 3. How to evaluate a Cube alternative

The criteria below follow from those drivers. They are deliberately the same dimensions used in the at-a-glance table in section 6, so you can score each option against the reason you are looking.

1. **Definition portability** — can the models be exported to an open format, today, through a merged converter rather than a roadmap slide?
2. **Execution** — does the tool compile and run queries itself, or hand SQL to the warehouse and rely on its caching?
3. **Caching** — is there a pre-aggregation or result cache, and on which plan?
4. **Consumer interfaces** — SQL / JDBC, REST, GraphQL, MDX / DAX, MCP for agents.
5. **Warehouse reach** — one platform, or many dialects from one definition?
6. **Who authors the semantics** — analytics engineers in code, BI developers in a proprietary language, or platform admins in the warehouse.
7. **Pricing model** — per developer, per seat, per deployed object, platform compute, or free.

Portability and warehouse reach matter more than they did two years ago because AI agents are now a consumer. An agent that answers "what was net revenue last quarter" needs the governed definition, not a guess at the join, and it needs the same definition the dashboard uses.

## 4. The alternatives

Each option below uses the same five fields. The order follows fit for the most common driver we see — definitions that need to live closer to dbt or travel between tools — not a ranking.

### dbt Semantic Layer (MetricFlow) — best for teams whose metrics belong next to dbt models

**Best for:** analytics engineering teams that already run dbt and want one repository for models and metrics.

**Where it wins:** Metrics are YAML in the dbt project, reviewed and versioned with the models they depend on. MetricFlow, the engine underneath, was <a href="https://www.getdbt.com/blog/open-source-metricflow-governed-metrics" rel="nofollow noopener">open-sourced under Apache 2.0 on October 14, 2025</a>, and dbt is one of the four formats with a merged Apache Ossie converter — the clearest portability story of any option here. Caching exists: result caching and declarative caching from saved queries, a detail several comparisons miss.

**Where it gets harder:** The hosted Semantic Layer APIs require a paid dbt plan — Starter at $100 per seat per month with 5,000 queried metrics per month as of September 2026 — and the <a href="https://docs.getdbt.com/docs/use-dbt-semantic-layer/sl-cache" rel="nofollow noopener">caching features are Enterprise-only</a>. There is no dedicated pre-aggregation store comparable to Cube Store, so latency depends on your warehouse. Embedded, multi-tenant analytics is not what it was built for.

**Pricing:** Starter $100 per seat per month; Enterprise and Enterprise+ quoted (as of September 2026). MetricFlow itself is free.

**Moving from Cube:** Measures and dimensions map closely to MetricFlow's semantic models and metrics, but the translation is manual. Join logic that Cube expresses in cube `joins` becomes MetricFlow entities, which is usually the slowest part to get right. Our [dbt Semantic Layer and MetricFlow guide](/blog/dbt-semantic-layer-metricflow/) covers the modeling differences.

### AtScale — best for Excel and Power BI-heavy enterprises

**Best for:** large organisations whose metric consumers are spreadsheets and BI tools rather than applications.

**Where it wins:** AtScale is built around multidimensional models and aggregate awareness, with native connectivity for Excel, Power BI and Tableau — the OLAP-style experience finance teams expect. Its pricing counts deployed semantic objects rather than users, so broad read access does not multiply the bill. AtScale is also an Apache Ossie participant.

**Where it gets harder:** It is proprietary and enterprise-oriented; the developer experience is heavier than a code-first YAML workflow, and it is rarely the right tool for embedding analytics inside a product.

**Pricing:** Quote only, based on deployed semantic objects with unlimited users (<a href="https://www.atscale.com/pricing/" rel="nofollow noopener">AtScale pricing</a>, as of September 2026).

**Moving from Cube:** Expect a remodel rather than a translation — AtScale's dimensional model is a different shape from cube data models.

### Looker (LookML) — best if you are standardising on Looker

**Best for:** organisations where Looker is already the BI standard.

**Where it wins:** LookML is a mature modeling language with Git workflows, and the governed model sits right under the dashboards people use. Google's Open SQL Interface exposes LookML models over JDBC to tools such as Tableau and Power BI.

**Where it gets harder:** LookML is Looker's format and is consumed mostly inside Looker. The <a href="https://docs.cloud.google.com/looker/docs/sql-interface" rel="nofollow noopener">Open SQL Interface</a> is in preview and supports only LookML projects on BigQuery connections, so "LookML as a universal semantic layer" is narrower than it sounds on a multi-warehouse estate.

**Pricing:** Annual platform editions through Google Cloud sales; published price points are not listed (as of September 2026).

**Moving from Cube:** A rewrite into LookML views and explores. This makes sense only if Looker is also replacing your BI layer.

### Snowflake Semantic Views and Databricks Metric Views — best for single-platform estates

**Best for:** teams whose data lives entirely in Snowflake or entirely in Databricks.

**Where it wins:** Definitions become warehouse objects governed by the platform's own access control. <a href="https://docs.snowflake.com/en/user-guide/views-semantic/overview" rel="nofollow noopener">Snowflake Semantic Views</a> are queried in ordinary `SELECT` statements and power Cortex Analyst and Cortex Agents. <a href="https://learn.microsoft.com/en-us/azure/databricks/uc-semantics/metric-views/" rel="nofollow noopener">Databricks Metric Views</a> are defined in YAML inside Unity Catalog, queried from SQL, dashboards and Genie, and can be materialised for speed. Neither adds a service to run.

**Where it gets harder:** Each is bounded by its platform. A second warehouse means a second set of definitions, and neither is a headless API for embedded analytics the way Cube is. See [Apache Ossie vs warehouse-native semantics](/blog/osi-vs-warehouse-native-semantics/) for how each platform's semantic objects compare.

**Pricing:** No separate licence; you pay platform compute.

**Moving from Cube:** Straightforward for a single-platform estate — both platforms accept YAML definitions, and Snowflake can also import some BI tool files — but you trade Cube's cross-warehouse reach for platform lock-in.

### Malloy — best for teams that want an open modeling language

**Best for:** engineering-led teams comfortable adopting a new language for semantic modeling and query.

**Where it wins:** <a href="https://github.com/malloydata/malloy" rel="nofollow noopener">Malloy</a> is MIT-licensed, compiles to SQL on BigQuery, Snowflake, DuckDB, MotherDuck, PostgreSQL, MySQL, Trino, Presto and Databricks, and its open-source Publisher server exposes models over REST and MCP. The model and query language are one, which makes nested and composable analysis unusually concise.

**Where it gets harder:** It is a much smaller ecosystem (roughly 2.6K GitHub stars as of September 2026), has no pre-aggregation layer comparable to Cube Store, and asks analysts to learn a language that is not SQL.

**Pricing:** Free and open source.

**Moving from Cube:** A rewrite into Malloy sources; the payoff is an open format, not a fast migration.

### Apache Ossie + Dosi — best when one definition must compile everywhere

**Best for:** teams that need the same metric definitions compiled for several warehouses and read by AI agents, and that want those definitions in an open standard rather than any one vendor's format.

**Where it wins:** Apache Ossie (incubating, formerly Open Semantic Interchange) is an Apache 2.0 specification for semantic models; it defines and moves semantics but executes nothing. **Dosi** is an execution engine for that format: it compiles Ossie YAML into native SQL for 16 warehouse dialects — DuckDB, Postgres, Snowflake, ClickHouse and StarRocks among them — and serves it over a CLI, REST with Apache Arrow, MCP and Python. Agents get metric-level tools over MCP with structured error codes instead of generating raw SQL; the [10-minute Apache Ossie + Dosi quick start](/blog/apache-ossie-dosi-quickstart/) walks through a first metric query from the CLI and from Claude Code.

**Where it gets harder:** Dosi is newer than every other option here, is not open source (it is a component of the commercial Datus Studio), and does not document a pre-aggregation cache comparable to Cube Store — for sub-second dashboards at high concurrency, Cube is the stronger tool. Moving from Cube also means re-expressing cube data models as Ossie YAML, because no Cube converter exists yet.

**Pricing:** Not published (as of September 2026); see <a href="https://dosi.datus.ai/">dosi.datus.ai</a>.

**Moving from Cube:** You don't have to. The pattern in [Dosi with Cube](/blog/dosi-with-cube/) keeps Cube serving dashboards and embedded analytics while Ossie carries the definitions that must travel and Dosi compiles them for the other warehouses and for agents.

## 5. When Cube is still the right choice

For many teams, staying is the correct answer, and it deserves more than a footnote. Cube is the strongest option here when latency and concurrency dominate — pre-aggregations in Cube Store were built for exactly the dashboard traffic that makes warehouses slow and expensive. It is also the most complete choice for **embedded, multi-tenant analytics**, where the semantic layer has to enforce per-customer security and serve an application over REST or GraphQL rather than a BI tool.

Cube also fits when the model is already large and trusted. Rewriting hundreds of cubes to gain portability is a real cost with a deferred benefit, and Cube's own agents and MCP server already let AI assistants query the governed model. If the complaint is Cube Cloud's price rather than Cube's design, self-hosting Cube Core and Cube Store keeps every definition and removes the per-developer plan.

What changes that answer is usually a **second consumer that can't read Cube's format**: a second warehouse whose team won't adopt Cube, a BI tool that needs MDX, or an agent platform that expects an open model. Even then, the first step is often to add a portable layer beside Cube rather than to remove it.

## 6. Cube alternatives at a glance

| | Cube | dbt SL / MetricFlow | AtScale | LookML | Snowflake / Databricks native | Malloy | Apache Ossie + Dosi |
|---|---|---|---|---|---|---|---|
| **Open format / converter** | Cube models; no merged Ossie converter | Merged dbt converter in Ossie | Ossie participant | LookML only | Platform YAML | Malloy language | Ossie is the format |
| **Licence** | Core Apache 2.0; Cloud commercial | MetricFlow Apache 2.0; APIs paid | Proprietary | Proprietary | Platform feature | MIT | Ossie Apache 2.0; Dosi commercial |
| **Caching** | Pre-aggregations + Cube Store | Result / declarative (Enterprise) | Aggregate awareness | Looker caching | Platform (Databricks materialisation) | None built in | Not documented |
| **Interfaces** | SQL, REST, GraphQL, MCP | Semantic Layer APIs | Excel, Power BI, Tableau | Looker; JDBC (preview, BigQuery) | SQL; platform agents | REST, MCP (Publisher) | CLI, REST + Arrow, MCP, Python |
| **Warehouse reach** | Many | Many | Many | Many (JDBC: BigQuery) | One platform | Nine engines | 16 dialects |
| **Entry price (Sept 2026)** | Free tier; $40/dev/mo | $100/seat/mo | Quote | Quote | Compute | Free | Not published |
| **Main trade-off** | Format lock-in | dbt plan required | Heavier, enterprise | Looker-bound | Platform-bound | Small ecosystem | Newer; no cache |

Read the first row before the others. Every option can serve a dashboard; far fewer let a definition leave the tool that owns it, and that is the property AI agents and multi-warehouse estates stress first.

## 7. How to choose

Start from the driver you named in section 2, then take the path that matches it:

1. **Latency, embedded analytics or a large existing model** → stay on Cube; self-host Cube Core and Cube Store if the issue is the Cloud bill.
2. **Metrics belong with dbt models** → dbt Semantic Layer with MetricFlow, and budget for the dbt plan the APIs require.
3. **Excel, Power BI and OLAP-style consumers** → AtScale.
4. **Looker is the BI standard** → LookML, knowing the JDBC path is BigQuery-only today.
5. **One warehouse, platform-first governance** → Snowflake Semantic Views or Databricks Metric Views.
6. **One definition for several warehouses and for agents** → author in Apache Ossie and compile with Dosi, beside Cube if Cube still serves your dashboards.

If two paths apply, the tie-breaker is portability: pick the option whose definitions you can still use if you change your mind.

## 8. Moving off Cube

Whatever you pick, plan for the definitions to be re-expressed rather than converted. With no Apache Ossie converter for cube data models, a migration is a translation project: list the measures and dimensions consumers actually use (usually far fewer than the model contains), translate those first, and leave the long tail until something asks for it.

Run both systems in parallel and reconcile metric by metric — same filters, same time grain, same result — before switching any consumer. Move one consumer at a time. Agents and notebooks are often the easiest first movers because they have no saved dashboards to rebuild; embedded applications are usually last. What carries over cleanly is the warehouse itself and any dbt models Cube was reading; what does not is Cube-specific security context, pre-aggregation definitions and embedded front-end integrations. If you are moving towards Apache Ossie, the Datus agent can draft Ossie semantic models from your schema and SQL history, which shortens the first pass without removing the need to review every definition.

## 9. How this comparison was checked

Facts in this article were checked on September 25, 2026 against each vendor's own pricing pages, product documentation and GitHub repositories, and against the Apache Ossie repository for converter status. Pricing and feature status change often in this market — confirm against current vendor documentation before you decide, particularly anything marked as preview.

## Conclusion

Most Cube alternatives replace Cube with another place your definitions can get stuck. That is fine when the new place is where your team already works — dbt, Looker, Snowflake or Databricks — and it is the right call when Cube's strengths in caching and embedding don't matter to you. When they do matter, stay; when the pain is portability, add an open layer beside Cube before you rip anything out. The durable decision is the one where your metric definitions outlive the tool you picked this year.

## Frequently asked questions

### Is Cube.dev open source?

Yes, Cube Core is open source: the backend is Apache 2.0 and the client libraries are MIT, and Cube Store lives in the same repository. Cube Cloud — hosting, agents, embedded dashboards and enterprise features — is the commercial product, with a free tier and paid plans from $40 per developer per month as of September 2026.

### What is the best open-source alternative to Cube?

It depends on the layer you want to replace. For code-first metrics next to dbt, MetricFlow is Apache 2.0, though dbt's hosted Semantic Layer APIs need a paid plan. For an open modeling language, Malloy is MIT-licensed with an open-source REST and MCP server. For an open interchange format, Apache Ossie is an Apache 2.0 specification — but it needs an engine to execute it.

### Does Cube support Apache Ossie (OSI)?

Not yet as a shipped feature. Cube joined the Open Semantic Interchange launch initiative, but as of September 2026 the Apache Ossie repository has reference converters for dbt, GoodData, Apache Polaris and Salesforce and none for Cube. Treat Cube's Ossie support as a roadmap item to track.

### Can I use Cube and an alternative together?

Yes, and it is often the lowest-risk path. A common split keeps Cube serving dashboards and embedded analytics while metric definitions that must reach another warehouse or an agent are authored in an open format and compiled elsewhere. The cost is keeping the shared definitions reconciled, so limit the overlap to the metrics both sides really need.

### Which Cube alternative is best for AI agents?

The one that serves agents the same governed definitions your dashboards use, over an interface agents speak. Cube itself offers an MCP server; Malloy's Publisher and Dosi expose models over MCP; Snowflake and Databricks feed their own platform agents. For agents working across several warehouses, portability of the definitions matters more than the protocol.

### How long does it take to migrate off Cube?

It depends on how many measures consumers actually use, not on the size of the model. Because no converter exists, every definition is translated by hand and reconciled against Cube's results, so teams that start with the handful of metrics behind their key dashboards and agents move far faster than teams that try to port the whole model at once.

## Related articles

- [Apache Ossie (OSI) vs Cube](/blog/osi-vs-cube/) — the open standard versus the headless semantic layer, layer by layer
- [Cube.dev: from semantic layer pioneer to agentic analytics](/blog/cube-agentic-analytics/) — how Cube Core, Cube Store and Cube's agents fit together
- [Dosi with Cube](/blog/dosi-with-cube/) — running Ossie-native execution beside Cube instead of replacing it
- [dbt Semantic Layer and MetricFlow: architecture and limits](/blog/dbt-semantic-layer-metricflow/) — the closest code-first alternative in depth
- [Semantic layer tools in 2026](/blog/semantic-layer-tools-list-osi/) — the full category, with each tool's Apache Ossie status
- [Open Semantic Interchange, now Apache Ossie](/blog/open-semantic-interchange-osi/) — what the standard defines and what it leaves to engines
