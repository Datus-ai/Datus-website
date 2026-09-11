---
title: "From ChatBI to Data Agent: What Changes and What Doesn't"
description: "A year of building Datus: models, frameworks and interfaces change fast, but building and maintaining good context is still the hardest part of a data agent."
author: "Harrison Zhao"
date: 2026-08-08
lastmod: 2026-09-10
head:
  - - meta
    - name: keywords
      content: "ChatBI vs data agent, context building, project context, scoped subagent, long-horizon agent, semantic layer OSI, bottom-up metrics, dashboard copilot, data engineering agent"
  - - meta
    - property: og:title
      content: "From ChatBI to Data Agent: What Changes and What Doesn't"
  - - meta
    - property: og:description
      content: "A year of building Datus: models, frameworks and interfaces change fast, but building and maintaining good context is still the hardest part of a data agent."
  - - meta
    - property: og:type
      content: article
  - - meta
    - property: og:url
      content: https://datus.ai/blog/from-chatbi-to-data-agent-what-changes/
  - - meta
    - property: og:image
      content: https://datus.ai/logo_dark.svg
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - link
    - rel: canonical
      href: https://datus.ai/blog/from-chatbi-to-data-agent-what-changes/
---

# From ChatBI to Data Agent: What Changes and What Doesn't

## TL;DR

- Models, frameworks and interaction patterns change fast. **The hardest part of a data agent has always been building and maintaining good context**, and that has not changed across three generations of ChatBI.
- Data teams are converging the way software teams did: from **Measurer to Builder**, with semantic ownership as the job that does not go away.
- A single giant context DB is the wrong shape. **Project-level context** is the natural unit — sales, retention, risk each maintaining their own semantic model, metrics, reference SQL, rules and knowledge — and a subagent's ceiling is that project's context maturity.
- Long-horizon agents look beautiful and are hard: the bottleneck in data is **clarifying the requirement**, not writing SQL, and there is no Git reset for a broken table.
- The semantic layer came back because natural language is ambiguous. Metric governance should be **bottom-up** — extract metrics from existing SQL, dashboards and pipelines, let them be used, then merge company-wide like a pull request.

This started as a talk — *From ChatBI to Data Agent: what changes and what doesn't* — and it is also a summary of how my own thinking changed over a year of building Datus: from asking questions of data in ChatBI, to context building, to what is now a complete [data engineering agent](/blog/what-is-data-engineering-agent-2026/). We have fallen into plenty of holes around workflow, MCP and long-horizon agents, but one thing keeps getting more certain: models, frameworks and interaction forms change quickly, and the hardest part of a data agent is still how to build and maintain good context.

The talk came in five parts: how roles on a data team are changing in the age of AI, then context building, long-horizon agents, the recently re-heated semantic layer, and finally a short account of how Datus evolved. The Q&A actually went deeper than the talk, and what people asked most were the old questions: why multi-table question answering is so hard to get right, how to stop context becoming a junkyard once there is a lot of it, and where a company with a mountain of existing BI, historical SQL and metric assets should even start.

## From Measurer to Builder

Spending more time in the Bay Area, one feeling keeps getting stronger: data teams are going through a role convergence similar to the one software engineering went through.

Software development used to have frontend, backend, QA and product. Now coding agents let one Builder string much more of the chain together directly. The same thing is happening on the data side. The boundaries between data engineer, analytics engineer and analyst are starting to blur, and one person carrying a group of agents across a longer stretch of the chain is going to become more and more common.

I borrowed Drucker's categories for this: Builder, Seller, Measurer. Data teams have long sat closer to Measurer — responsible for measuring, analyzing and supporting. But the age of AI gives data teams a good opportunity to move closer to Builder, turning analysis results directly into reusable context, agents and data products.

At a Bay Area event I heard OpenAI's head of data engineering answer a question: *what's the most important thing in data engineering right now?* His answer was **semantic ownership and responsibility**. I think that judgement is about right. Engineering teams used to build tables and pipelines while analysts were responsible for explaining the business definitions; now those two things are getting harder and harder to separate, because an agent that only has tables and no semantics still does not know how the table should be used.

Airbnb's writing on the full-stack data engineer points the same way. From Minerva's unified metric system to putting semantic layer ownership, data modeling, analytical insight and the agentic platform together, the essence is reducing handoffs between roles.

I am increasingly convinced the biggest efficiency bottleneck on a data team was never writing SQL. Writing five SQL queries a day is not hard. What is hard is that all five requests need the definitions re-discussed, the context re-understood, the results re-verified, and then two more rounds with the business. Where AI is genuinely valuable is in slowly precipitating that tacit knowledge and repeated communication.

## Context building is the foundation of a data agent

ChatBI has been through roughly three rounds of change over the past two years: first everyone competed on prompts, then it was MCP plus workflow, and now it is skills, subagents and more agentic execution. Every round changes the framework, and yet the dependence on context only grows.

When OpenAI built their own data agent, they split context into many layers: table usage metadata, human annotation, code enrichment, institutional knowledge, memory, runtime context. The architecture does not look magical. What is genuinely troublesome is how these things get built and how they stay up to date. Their own line covers it: *the context, you'll have to build yourself.*

Our own thinking moved from an early "big knowledge base" towards project-level context. A company has tens of thousands of tables and tens of thousands of metrics; in theory you could stuff them all into one context DB and run GraphRAG over it, but the engineering complexity is high, and a bigger context does not naturally produce better results.

The more natural approach is to manage data context the way you manage code. Sales is a project, retention is a project, risk control is a project. Each project maintains its own semantic model, metrics, reference SQL, rules and knowledge, and then generates a domain-specific [subagent](/blog/subagents-domain-specific-data-agents/) from that project.

One thing became very obvious in practice: **a subagent's capability boundary is basically the maturity of its project context.**

So I am not that interested in the "query everything" super data agent any more. Most genuinely usable chatbots are, in essence, a scoped subagent: it knows which tables, which metrics and which historical SQL it can reach, and it has clear tool boundaries. A dashboard copilot is a very typical form — the dashboard has already fenced off a few metrics and a range of analysis, and the user drills down, rolls up and attributes on top of that, which makes both accuracy and experience much easier to control.

For context to be genuinely valuable it also has to be reusable, evolvable and governable. Precipitate it once during development and it can then serve dashboards, chatbots, APIs and even other agents together; when user feedback comes back, you keep amending the metric, the reference SQL or the rules. That is when [context starts turning from documentation into an asset](/blog/contextual-data-engineering/).

## Long-horizon agents: they look beautiful

Long-horizon agents are hot — OpenClaw, Hermes, OpenHarness, Symphony, Claude managed agents, one after another. We started trying this early too.

In early 2026 I ran a fairly extreme experiment: one person, letting an agent migrate a set of Ethereum data from BigQuery to Iceberg, then hook up StarRocks, Airflow and Superset, writing as little code myself as possible. It somehow worked in the end, but the process was painful, and it gave me a much more practical understanding of where long-horizon data agents are hard.

The first is the sandbox. When a coding agent writes bad code you can `git reset`. When a data agent writes bad data it is much more trouble. It needs an independent warehouse for resource isolation, it needs versioning capability of the [Iceberg](/blog/what-is-apache-iceberg/) or Paimon kind for checkpoints, and it needs time travel, permission isolation and mandatory validation. Without those underlying capabilities, letting an agent run autonomously for a few hours inside a production database is genuinely frightening.

The second is requirement clarification. The input to data engineering is very often inherently vague: "have a look at why retention dropped recently", "make me an operations dashboard", "analyze this campaign". If the first step misunderstands, it does not matter how automatically everything after it runs. So we came to understand the orchestrator more as a manager's avatar: clarify first, fix the success criteria, then split the tasks, and finally validate the artifacts — SQL, metrics, dashboards. The line I wrote for this part of the talk: **the bottleneck on the data side is clarifying the requirement, not writing SQL.**

So my attitude to harnesses is a bit more conservative than it was. Mission board, daily report, skill optimizer — none of these is hard to implement. The real precondition is that the project context has already been genuinely used many times and is basically under control. An ordinary agent that is unstable over ten consecutive runs, asked to run by itself for three days, is usually just amplifying the problem. (You are welcome to try our new mission board task management in <a href="https://studio.datus.ai/overview" rel="nofollow noopener">Datus Studio</a>.)

## The semantic layer is back

Metrics platforms have been through many rounds already.

The first generation was Cube, Kyligence and MDX, where the core was pre-aggregation and OLAP acceleration. The second went from Airbnb's Minerva to [MetricFlow](/blog/dbt-semantic-layer-metricflow/), emphasizing single source of truth and solving company-wide metric consistency. In this round Snowflake, Databricks, Looker, Tableau, Dremio and Superset have all started building a [semantic layer](/blog/what-is-semantic-layer/) again, and the biggest new variable is AI.

Natural language has far too much ambiguity. "Revenue", "active user", "this month", "new" all feel natural in a human head, but by the time they reach an agent, without an explicit metric and relationship they are easily understood as different things. So in the age of AI the semantic layer starts to carry a new responsibility: being the relatively stable semantic contract between the LLM and the underlying data.

That is also why I pay attention to [OSI](/blog/open-semantic-interchange-osi/). Snowflake, dbt Labs and Salesforce/Tableau, among others, are jointly pushing Open Semantic Interchange, hoping to describe dataset, metric, dimension and relationship in one vendor-neutral declarative format. It is still a very early spec, but I think the direction matters: models will get more and more general, and a company's business semantics will not.

The other change is that I believe less and less in the traditional top-down model of metric governance. Hold meetings for six months, design and unify every metric in the company, then require the business to migrate — the organizational cost of that is too high.

AI suits bottom-up better: first extract metrics from existing SQL, dashboards and pipelines, take them straight into a project to generate dashboards, reports and chatbots, and let them actually be used; once several teams each have a stable set of metrics, do the review, merge and company-wide unification through something like a GitHub pull request. **An enterprise [ontology](/blog/what-is-ontology/) should grow out of metrics that have been used over and over.**

Whether ontology ends up as the core of the next generation of data architecture is still worth watching, but metrics are certainly a realistic starting point.

## Datus: an open-source data engineering agent

The version history of Datus itself maps fairly directly onto all of the above.

0.1 was mainly about the accuracy of asking questions of data, using an agent loop, metrics and reference SQL to wrap an unstable model into as stable a chatbot as possible. In 0.2 we found the core problem was context, so a lot of the work went into extracting knowledge, semantic models and metrics from historical SQL and dashboards. By 0.3 we went further: we want context to be produced directly in the data development process, so we started stringing database, BI, semantic layer and scheduler together, and adding subagents, skills, memory and validation.

There is one more thing we have been investing in heavily: **Dosi** (Datus OSI engine).

As mentioned above, OSI is first of all an open semantic layer spec — essentially a YAML format. But a format alone is not enough. A genuinely usable semantic layer also needs an execution engine: something that understands semantic models, metrics, dimensions and relationships, automatically generates the right joins, aggregations, filters and per-database SQL dialects for a request, and then exposes that stably to BI, an API or an agent.

So we implemented [Dosi](/blog/introducing-dosi/) as a complete implementation of an OSI semantic layer. Datus can generate OSI-conformant semantic models and metrics from existing SQL and data models, and Dosi is responsible for actually executing those definitions, generating SQL, and further exposing them as MCP or an API for agents to use. We used MetricFlow for close to a year and made plenty of modifications for different databases; later, as OSI gradually took shape, we decided to pull this layer out and rebuild it. The new implementation has since moved to Rust, the goal being a genuinely independent, lightweight OSI engine that is agnostic to both database and BI.

I think there is an important distinction here: OSI solves "how everyone describes semantics", and Dosi solves "how those semantics actually run".  If Snowflake, Databricks, StarRocks, BI tools and everything else gradually get their own semantic layers, we do not want Datus bound to any one of them — we would rather use OSI as the intermediate standard and exchange up and down through adaptors.

That also explains why our investment in the semantic layer keeps growing. It is no longer just an auxiliary module for ChatBI but the most structured part of the context engine: above, it serves chatbots and agents; below, it generates deterministic SQL; and in between, it supports versioning and governance.

## Frequently asked questions

These are the questions the audience asked, lightly edited.

### Why is question answering accurate over one big wide table but much less accurate across many tables?

*The question, as asked:* we are building internal question answering and have two approaches. One is to build a wide table manually and have the AI answer from it, where accuracy is acceptable. The other is to tell the model a dozen or several dozen base tables, their relationships, column semantics and code values, and let it analyze and generate SQL itself — accuracy drops a lot. Because our data is sensitive we mainly use privately deployed models like Qwen and DeepSeek. How do we improve that?

First, it depends on what tools you give the agent. If in the end you still hand the model an `execute_sql`, then how dozens of tables get joined, which columns to pick and how to aggregate are all decided by the model on the spot — a very high bar for model capability, and the more tables there are the larger the action space.

A semantic layer can take that complexity off the table in advance. Once relationships, metrics and dimensions are defined, the model only needs to understand which metric the user is asking about, which dimensions and which filters — something like filling in parameters for `query_metrics` — while the complex joins and SQL are generated by the semantic engine. The reason a wide table is accurate is essentially the same: it eliminated a lot of join choices in advance. The semantic layer just achieves a similar effect while keeping the multi-table model. This matters especially for smaller models: let them do understanding and parameter selection, and have them write complex SQL on the spot as little as possible. Of course, this also requires the semantic layer itself to be expressive enough.

### The SQL and the query results are already correct — why does the final answer still hallucinate?

*The question, as asked:* we have a case where the model generates correct SQL and the database returns correct data, but the final answer to the user based on those results can still hallucinate. How do we deal with that?

If the SQL, the data and the context are all confirmed correct and the summary is still wrong, you are genuinely hitting the ceiling of the model itself, and there is no particularly magical engineering method for that part.

But in real projects a fair number of problems come from semantic ambiguity instead. A user says "recent", "user", "revenue" — natural enough to a person, while the system may hold several different definitions of each. That class of problem can be improved with a feedback loop: put the failed tool calls and questions into a benchmark, see which metric was recalled incorrectly, and adjust the description and tool spec. Another part is the user's own way of phrasing things, which can live in a subagent or in user-level memory. At minimum this gradually peels the engineering-solvable problems away from "model hallucination".

### If all context goes into one DB, won't it get bigger and staler?

*The question, as asked:* there are context DB approaches that put project, repo, business knowledge and other context into one centralized store. But as the data grows, a large context makes the model dumber, and the knowledge itself expires and can even conflict. How do you handle that?

I am not in favour of building one especially large unified context DB from the start. A company has tens of thousands of tables; in theory you can put them all in and run GraphRAG, but the engineering complexity is high and it is not necessarily worth it. We prefer organizing context by project or business domain — sales, retention and risk control each maintaining their own scope — and what a subagent gets in the end is scoped context.

The second key point is that context has to be combined with the development process. When an engineer writes new SQL, metrics and dashboards, they update the knowledge inside the same project. If data development is one system and AI question answering maintains a separate RAG, then after development has been changing things for six months while the question-answering side still uses the old knowledge, that kind of context rot is basically inevitable. So we lean bottom-up, letting the engineer responsible for that business gradually keep the context accurate through real development and use.

### We already have a lot of BI, SQL and legacy metrics — where do we start with a data agent?

*The question, as asked:* we do not have a unified metrics platform, and historical metrics are scattered. Some are in BI datasets, some in wide tables and historical SQL, and there are a lot of ETL jobs. Doing data governance, we used to think good data quality would be enough, but once we actually built question answering we found high-quality data does not necessarily equal high-quality AI context. Where should an enterprise with this much baggage begin?

I would suggest not rebuilding the metric system from zero. A dashboard that has been in use for a few years already contains a lot of useful information: which datasets it uses, what SQL sits behind it, which metrics and dimensions it cares about. ETL and scheduled jobs likewise already contain joins, lineage and business processing logic. All of this is ready-made context; it simply was never made explicit.

That is why we did a lot of this work in Datus 0.2 — connecting to BI dashboards directly, pulling down the datasets and SQL, and generating semantic models, metrics and reference SQL from a set of genuinely used queries; you can also extract knowledge backwards from the scheduler and from historical SQL. Standardizing the assets you already have and then gradually supplementing and governing them is usually more realistic than asking the business and data teams to write a semantic layer from scratch. For most enterprises, the SQL and dashboards accumulated in the past are themselves good cold-start data.

## Related articles

- [What is a data agent?](/blog/what-is-data-agent/) — the category, and how it differs from a data engineering agent
- [Contextual data engineering](/blog/contextual-data-engineering/) — context as a living asset rather than one-time docs
- [Subagents: domain-specific data agents](/blog/subagents-domain-specific-data-agents/) — why a subagent's ceiling is its project context
- [Introducing Dosi](/blog/introducing-dosi/) — the OSI execution engine described above
- [Semantic layer vs ontology](/blog/semantic-layer-vs-ontology/) — where metrics stop and an ontology starts
