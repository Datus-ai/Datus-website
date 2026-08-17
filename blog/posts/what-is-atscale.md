---
title: "What Is AtScale? Enterprise Semantic Layer for BI, Excel & AI"
description: "Virtual OLAP for Excel, Power BI, and agents — AtScale's SML, DSO pricing, MDX/DAX, and MCP, and when the cube is the wrong unit."
author: "Kostja"
date: 2026-08-19
lastmod: 2026-08-19
head:
  - - meta
    - name: keywords
      content: "AtScale, AtScale semantic layer, virtual OLAP, semantic modeling language SML, MDX DAX, AtScale MCP, Excel Power BI semantic layer"
  - - meta
    - property: og:title
      content: "What Is AtScale? Enterprise Semantic Layer for BI, Excel & AI"
  - - meta
    - property: og:description
      content: "Virtual OLAP for Excel, Power BI, and agents — AtScale's SML, DSO pricing, MDX/DAX, and MCP, and when the cube is the wrong unit."
  - - meta
    - property: og:type
      content: article
  - - meta
    - property: og:url
      content: https://datus.ai/blog/what-is-atscale/
  - - meta
    - property: og:image
      content: https://datus.ai/logo_dark.svg
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - link
    - rel: canonical
      href: https://datus.ai/blog/what-is-atscale/
---


# What Is AtScale? Enterprise Semantic Layer for BI, Excel & AI

AtScale is a universal semantic layer aimed at enterprises that still live in Excel, Power BI, and Tableau. It virtualizes multidimensional models over cloud warehouses, speaks MDX and DAX as well as SQL, and now exposes the same governed definitions to agents over MCP.

## TL;DR

- **AtScale** sits between Snowflake, Databricks, BigQuery (and similar platforms) and the tools executives actually open. Models stay virtual: queries push down, data is not copied into a new mart as a precondition for consistent metrics.
- The historical wedge is **OLAP for the modern warehouse**: hierarchies, semi-additive measures, aggregate awareness, and the dialects spreadsheet users already speak (MDX, DAX), plus SQL, REST, Python, and MCP.
- The modeling language **SML** (Semantic Modeling Language) is open source under Apache 2.0 in the <a href="https://github.com/semanticdatalayer/SML" rel="nofollow noopener">semanticdatalayer/SML</a> repository. The AtScale *platform* is not open source. Opening the language is not the same as opening the engine — a distinction buyers should keep sharp.
- Pricing, per AtScale's public pricing page, is **Deployed Semantic Objects (DSOs)**: you pay for governed metrics, dimensions, and models published to production, not for seats, queries, dashboards, or agent calls. That is a genuine design choice with a genuine failure mode (object sprawl).
- AtScale is the wrong default when the job is a headless API for embedded apps (Cube's home) or a SQL ontology for typed identity (Timbr's home). It is the right default when the crisis is "the CFO's Excel cube does not match Looker" and you are not willing to exile Excel.

## 1. The deal AtScale closes: cube without the extract

Most enterprise analytics still ends in a pivot table. Cloud warehouses did not retire that fact; they moved the extract. Teams built marts so Power BI and Excel could feel fast, then watched the marts diverge from the warehouse, then watched AI pilots query whichever copy was easiest to connect.

Here is the failure in one close. A consumer-goods finance team certifies `net_revenue` as invoice amount minus returns. The "official" cube is a weekly extract into a Power Pivot model. In March the warehouse starts booking marketplace fees as a separate column that should reduce net revenue. The extract job is not updated. Tableau connected to Snowflake is right. The CFO workbook is wrong by the fee. An agent pointed at the warehouse agrees with Tableau and "contradicts" Finance. They have two cubes.

AtScale's bargain is older than the agent wave and still the reason it wins deals Cube does not: **keep the multidimensional experience, lose the extract**, so Excel, Tableau, and the agent hit one virtual model. The semantic layer defines metrics, hierarchies, and relationships once. Excel and Tableau issue the dialects they already know. AtScale translates those queries into warehouse SQL with aggregate awareness so the cube is a view of live cloud data rather than a weekly dump. When that works, Finance stops maintaining a shadow warehouse in a workbook. For the category definition, see [what a semantic layer is](/blog/what-is-semantic-layer/).

That is a different pain from the pain Cube optimized for (developers embedding analytics behind REST/GraphQL) and a different pain from Timbr's (agents confusing classes). Scorecards that ask "does it have MCP?" will make the three look interchangeable. CFOs who live in Excel will not.

The 2026 pitch adds AI without changing the wedge. AtScale's MCP story is that agents should consume the *same* governed objects the pivot table consumes — metrics, relationships, policies — rather than generating freelance SQL against `fact_orders`. If you have already paid the political cost of getting Finance onto a certified cube, reusing that cube as agent context is rational. If you never had a cube, starting with AtScale because "MCP" appeared on a slide is how you buy an OLAP platform you will not operate.

## 2. Virtual OLAP on the warehouse: MDX/DAX to SQL pushdown

Call it a **virtual OLAP semantic layer**, which is how <a href="https://www.atscale.com/" rel="nofollow noopener">AtScale</a> now brands the platform for both BI and agents. Models are multidimensional: facts, dimensions, hierarchies, calculated measures, many-to-many where the language allows it. Query dialects include MDX, DAX, SQL, REST, and Python, with MCP for agents. Every dialect is a compilation problem: the engine turns a cell request from Excel or a DAX query from Power BI into efficient SQL against the warehouse, using aggregates when they exist and the base tables when they do not. The cube is recomputed on demand; the SQL is where the work happens.

"Virtual" here means the semantic objects are not a mandatory physical copy of the warehouse. You still need engineering: aggregate tables, warehouse compute, model design. What you are supposed to stop doing is maintaining a second, drifting dimensional database as the price of spreadsheet access. Compare that to the classic SSAS cube, which *was* a physical store. AtScale is betting that the warehouse plus a planning layer of aggregates can replace that store for a useful class of enterprise workloads.

SML is the YAML-facing way to write those models so they are Git-friendly rather than trapped in a click-ops UI. AtScale announced the open-source release in September 2024. The GitHub organization `semanticdatalayer` hosts the language spec, sample models (TPC-DS, AdventureWorks, and similar), an SDK, a CLI, and converters. As of August 2026 the SML repository is a small but active Apache-2.0 project — **170 GitHub stars**, not Cube Core's tens of thousands. That star count is information about community gravity, not about whether SML is a serious language. It is a serious language with a thin public ecosystem. Converters exist so other dialects can move toward SML; they do not make AtScale's runtime open.

Deployment is Kubernetes in public cloud, private cloud, or hybrid, with marketplace listings on Snowflake and GCP in AtScale's current product writing. That matters for enterprises that will not send cube queries through a multi-tenant SaaS they do not control. It also means you are operating a platform, not dropping a YAML file into dbt Cloud.

## 3. DSO pricing: the meter is the product

AtScale's <a href="https://www.atscale.com/pricing/" rel="nofollow noopener">pricing page</a> is unusually explicit. Consumption is **deployed semantic objects**: metrics, dimensions, hierarchies, calculated measures, and models that are published and visible to end users in production tools. Objects in development do not count. Users, queries, dashboard counts, agent calls, and data volume do not count. Standard versus Enterprise is about capability and governance breadth, not seats.

The incentive is the point. Per-seat BI pricing punishes putting the cube in front of the whole company. Per-query pricing punishes exploration and punishes agents, which are chatty. DSO pricing says: pay for the *certified surface area* you are willing to govern. That is aligned with a semantic layer's actual job.

The failure mode is also the point. If every analyst publishes another calculated measure to production, the bill tracks sprawl rather than value. The monthly invoice turns into a map of it: forty DSOs billing for three measures that matter, because nobody has the authority to unpublish. DSO pricing only works if someone does — organizations that cannot retire semantic objects will experience AtScale as an unexpectedly expensive glossary. Ask, in the POC, who can delete a DSO and whether they have done it.

Public list prices move and AtScale's own pricing page does not currently print a dollar-per-DSO table. Industry roundups as of mid-2026 commonly cited Growth-class floors around $2,500 per month and Standard-class floors around $7,000, with per-object rates in a roughly $10–28 per DSO per month band. Treat those figures as **directional, as-of, and quote-verified** — not as a contract. The architectural fact you can take to a design review without a quote is the meter: objects deployed, not people who touch them.

## 4. Agents drink from the same well: MCP as context supply, not a new analyst UX

AtScale's AI narrative is conservative in a way that is easy to underestimate. The company does not need to win "best text-to-SQL." It needs agents to stop inventing metrics that Finance already certified in the Excel cube. MCP is the pipe: the model receives approved metrics, relationships, and policies from the semantic layer instead of a raw schema dump.

That is the same "LLMs should not query databases directly" thesis Cube argues, implemented for a different buyer. Cube's D3 productizes an analyst agent and an engineer agent on top of Cube models. AtScale's MCP server, in the company's own demo writing, can also *author* SML — generating hierarchies and semi-additive measures from warehouse metadata, then validating before deploy. Treat that as modeling acceleration on the same control plane, not as a Cube D3-style end-user analyst app. The durable product is still context supply: Copilot, a vendor agent, or an internal bot drinking the same objects the CFO pivot table uses. If your AI program is "we have Copilot / a vendor agent / an internal bot, and it must not disagree with the CFO workbook," AtScale's shape fits. If your AI program is "we want Cube's workbook agent and embedded analytics in our app," you are shopping in Cube's aisle.

OSI status should stay honest. AtScale is in the Open Semantic Interchange working group. As of the July 2026 snapshot in our [semantic layer tools directory](/blog/semantic-layer-tools-list-osi/), it did **not** have a merged reference converter in Apache Ossie. Participation is intent. Intent is not import/export. Teams that need an exit from AtScale models into a portable format should test SML converters and OSI paths as a project, not assume them as a feature.

## 5. The cube is the wrong unit for three jobs

AtScale wins when the consuming population is **Excel, Power BI, and Tableau**, the grain is multidimensional (hierarchies, semi-additives, allocation), and IT will not bless another extract. It wins when identity management has to follow the user into the warehouse (impersonation, native audit). It wins when the AI requirement is "same definitions as the cube" rather than "new agent UX." But the cube is the wrong unit of work for three adjacent jobs.

Cube wins when the consuming population is **applications and developers**: Postgres-compatible SQL, REST, GraphQL, embedding, pre-aggregation as a product (CubeStore), and an open-source core you can run without AtScale's control plane. See [Cube's three-era trajectory](/blog/cube-agentic-analytics/). dbt Semantic Layer wins when the consuming population is **analytics engineers already living in YAML next to transformations**, and you want MetricFlow as the metric brain with OSI converter work already merged. [Timbr](/blog/what-is-timbr/) wins a different RFP: typed ontology over SQL, inheritance, multi-source concept maps. If your incident queue is "the agent joined the wrong customer table," AtScale's cube will not forgive you for skipping classes. If your incident queue is "the Power BI dataset disagrees with SAP extracts in a workbook," Timbr will feel like a philosophy seminar.

A compact chooser:

- Spreadsheet-native OLAP, MDX/DAX, warehouse virtualization → AtScale
- Headless APIs, embedding, open-source engine → Cube
- Metrics as code beside dbt models → dbt Semantic Layer
- Classes, relationships, inheritance as the product → Timbr
- Producing and evolving the models those tools serve → a data engineering agent, which is a different layer than all four

Datus belongs on that last line. It does not speak MDX. It does not replace AtScale in a Fortune 500 Excel estate. It is a candidate for *authoring and refreshing* semantic artifacts — including, in principle, feeding definitions toward SML or other layers — so the cube does not freeze the day after the warehouse schema changes. Use AtScale when distribution to BI is the bottleneck. Use an engineering agent when freshness of the *definitions* is the bottleneck. Enterprises usually have both bottlenecks and try to buy one tool for both.

## 6. Budget the limits: closed platform, OSI yellow, DSO sprawl

The platform is closed. SML's Apache license is real and useful; it is not AtScale-the-product on GitHub. Switching costs live in the runtime, the aggregate strategy, and the operational skill of the team, not only in YAML.

Modeling skill is scarce. Virtual OLAP still demands grain discipline. Semi-additive measures, many-to-many, and hierarchy design are how these projects slip a quarter.

OSI is yellow. Plan a portability test if lock-in is a board topic.

DSO sprawl is a financial risk as well as a governance risk. Pair the purchase with a publishing policy — the meter only bills what you refuse to retire.

Agents will not save a bad cube. MCP will faithfully serve whatever you certified, including a wrong hierarchy.

If those limits are acceptable — and for a large class of enterprises they are — AtScale is one of the few semantic layers that takes Excel seriously without pretending the rest of the company should learn a new BI product. That seriousness is the product.

## Conclusion

AtScale is the enterprise semantic layer you buy when the cube is the unit of work: virtual OLAP over a cloud warehouse, MDX/DAX for the tools that already run the business, SML for Git-shaped modeling, DSO pricing for a certified surface rather than a headcount tax, MCP so agents drink from the same well. It is not Cube, not dbt, not Timbr, and not an open-source engine with a language spec taped on. Choose it for Excel-grade multidimensional access to live warehouse data. Choose something else for headless embedding, metrics-as-code, or an explicit ontology. Then fund the unglamorous owner who unpublishes objects and updates models when the schema moves — because no dialect, including DAX, will do that job for you.

Next reading: [what a semantic layer is](/blog/what-is-semantic-layer/), [what Timbr is](/blog/what-is-timbr/), and the [semantic layer tools list](/blog/semantic-layer-tools-list-osi/).

## Frequently asked questions

### What is AtScale?

AtScale is a universal semantic layer platform. It defines metrics, dimensions, and hierarchies once and serves them to BI tools (Excel, Power BI, Tableau), applications, and AI agents, translating those requests into warehouse SQL without requiring a separate extracted cube as the system of record.

### Is AtScale open source?

The **Semantic Modeling Language (SML)** is open source (Apache 2.0). The AtScale query engine, control plane, and product are commercial. You can write SML without buying AtScale; you cannot assume the runtime is free.

### How does AtScale pricing work?

AtScale meters **deployed semantic objects (DSOs)** — production-published metrics, dimensions, and models visible to end users. It does not charge per user, per query, per dashboard, or per agent call. Dollar rates are quote-specific; confirm current list or contract pricing rather than relying on roundups.

### How is AtScale different from Cube?

Cube is API-first and developer-centric (SQL/REST/GraphQL, CubeStore, open-source core, D3 agents). AtScale is BI-and-spreadsheet-centric (MDX/DAX, virtual OLAP, enterprise deployment). Both now talk MCP. They optimize different consumers.

### Does AtScale support AI agents?

Yes, by exposing governed semantic context — including via MCP — so agents use certified metrics and policies. It is a context provider for agents, not primarily a consumer-facing "chat with your data" app in the Cube D3 sense.

### When should we not buy AtScale?

When you need an open-source headless engine, when your consumers are embedded apps rather than Excel/Power BI, when your problem is entity identity rather than cubes, or when nobody will govern published objects. In those cases look at Cube, dbt, Timbr, or a data engineering agent respectively.

## Related articles

- [What is a semantic layer?](/blog/what-is-semantic-layer/) — the category AtScale competes in.
- [What is Timbr?](/blog/what-is-timbr/) — a SQL-native, ontology-based alternative.
- [Semantic layer tools, mapped to OSI](/blog/semantic-layer-tools-list-osi/) — where AtScale fits the landscape.
- [Cube for agentic analytics](/blog/cube-agentic-analytics/) — headless semantics for agents.
