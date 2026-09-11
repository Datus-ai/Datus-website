---
title: "The Full-Stack Data Engineer: Three Skills and a Harness"
description: "Why the one-person data team is coming, the three skills a full-stack data engineer needs, and why validation — not SQL generation — is now the real bottleneck."
author: "Harrison Zhao"
date: 2026-04-30
insight: true
lastmod: 2026-09-08
head:
  - - meta
    - name: keywords
      content: "full stack data engineer, one-person data team, data engineering harness, agentic data stack, semantic ownership, validation loop, ChatBI last mile, data engineering agent"
  - - meta
    - property: og:title
      content: "The Full-Stack Data Engineer: Three Skills and a Harness"
  - - meta
    - property: og:description
      content: "Why the one-person data team is coming, the three skills a full-stack data engineer needs, and why validation — not SQL generation — is now the real bottleneck."
  - - meta
    - property: og:type
      content: article
  - - meta
    - property: og:url
      content: https://datus.ai/blog/full-stack-data-engineer-harness/
  - - meta
    - property: og:image
      content: https://datus.ai/logo_dark.svg
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - link
    - rel: canonical
      href: https://datus.ai/blog/full-stack-data-engineer-harness/
---

# The Full-Stack Data Engineer: Three Skills and a Harness

## TL;DR

- In the age of people, splitting data work across engineers, analysts, BI and governance teams was called division of labour. **In the age of agents, it is latency** — every handoff is one more place context gets cut up and intent gets re-translated.
- The scarce skill is no longer single-shot output. It is **defining semantics, organizing systems, and accumulating context**: the three abilities that make up a full-stack data engineer.
- ChatBI without data engineering context underneath it is water with no source. The realistic delivery today is not a standalone chatbot but **subagents that augment existing dashboards and reports**, built on reference SQL, reference templates and metrics.
- The efficiency bottleneck has moved from "generate the SQL" to "**validate that the table, the metrics and the dashboard actually meet the spec**" — and that is what a data engineering harness is for.
- Datus 0.3 is our attempt to ship that: subagent coverage of the whole chain, per-subagent spec validation, scheduler and BI adaptors, subagent-level memory, and three permission modes.

At the <a href="https://www.dataengineeringopenforum.com/" rel="nofollow noopener">Data Engineering Open Forum</a> in San Francisco in April 2026 — an in-person community conference run by <a href="https://www.dataengineerthings.org/" rel="nofollow noopener">Data Engineer Things</a>, with talks from Airbnb, Netflix, Databricks and OpenAI on the agenda — the most interesting part of the event was not any one keynote. It was the anxiety outside the hall: the anxiety of every data engineer against the backdrop of the Silicon Valley layoffs.

Between sessions I joined a small roundtable of about a dozen people — data engineers from Figma, Microsoft, Apple and a few startups, sitting together talking through their projects, their frustrations and their experience. The consensus was subtle: AI really does make you more efficient, but your manager does not therefore give you less work. They conclude you should be able to absorb more requests and ship more results, faster. Unlike the keynotes — where data infra vendors and big-company recruiters talk about what makes a powerful data agent, a new data infra, a full-stack data engineer — the conversation on the floor was about how I stay valuable in the age of agents, and how I hold up against this wave of AI hype.

So this article is about five things:

1. Why we need a one-person data team
2. What the core abilities of a full-stack data engineer really are
3. The last mile of ChatBI, and the several hundred miles before it
4. How to build data engineering's own harness
5. How to get started

## Why a one-person data team?

Software engineering went through a huge role convergence over the past year. It used to be that a team had frontend, backend, QA, ops and product, and everyone coordinated through Jira, PRDs, meetings and endless alignment. As coding agents spread, those boundaries keep disappearing.

Data engineering is going through the same thing.

A traditional data team has data engineers, data analysts, BI engineers, a metrics-platform team, a governance team, a data quality team. Every role has its own tools, and every handoff point loses context. The business files a request with an analyst, the analyst goes to a data engineer, the data engineer finds the tables, writes the SQL, changes the pipeline, delivers a table, the BI engineer builds a dashboard, and the business comes back to say the metric is wrong.

In the age of people, this is called division of labour.

In the age of agents, this is latency.

Because in an agent-driven delivery chain, every extra hop between two humans is one more efficiency loss. Every additional human-to-human conversation is a chance for context to be cut into pieces, for the original intent to be re-translated, for the boundary of responsibility to blur. We have all seen too many legacy problems: tables whose origin nobody knows, SQL nobody dares to touch, columns whose meaning is ambiguous. Some of it comes from the complicated semantics of upstream logs and transactional systems; some of it is long-term baggage left behind by outsourcing.

The efficiency gain of this new era is not one individual horizontally swallowing all SQL development or all report development. It is that they need an agent (team) to complete the task end to end. One person who understands business semantics, data engineering, validation mechanisms and agent harnesses can use AI to manage a virtual data team.

## The core abilities of a full-stack data engineer

Asked what the most important thing in data engineering is right now, Paul Ellwood, OpenAI's Head of Data Engineering, answers: **semantic ownership and responsibility.**

Here "semantic" is not the narrow sense of a metrics platform. It is the broad power and responsibility of defining metrics. This used to be split: the data analyst (the business) owned the definition, and data engineering was responsible for maintaining it. But models are slowly degrading tables, metrics and pipelines into individual skills and agentic loops, and what the business receives is more and more often a chatbot. Given the ambiguity of natural language and a model's next-token-prediction mechanism, somewhere in the middle there has to be a human guaranteeing stability — or, for the foreseeable future, a human to carry the can.

Either engineers start understanding the business well enough to respond to it, or analysts learn enough of the underlying system to maintain metrics and build pipelines.

That also means the new full-stack data engineer needs three core abilities.

### 1. The ability to define semantics

This is sitting down with the business and getting the business logic and the data goal clear — turning vague business language into precise data definitions.

What counts as an active user? Does GMV include refunds? Is a new customer counted at registration or at first order? Is store revenue attributed to the ordering store or the fulfilling store? None of these are SQL questions. They are semantic questions. Whoever can define these rules clearly is defining the organization's data language.

The form of the dashboard and the report keeps changing in this new era, but what has to be delivered is still a way of understanding, decomposing, analyzing, monitoring and forecasting the business through metrics.

### 2. The ability to build an agentic data stack

The data stack of the future is not a pile of tools but a set of continuously working agents. Every data infra vendor is starting to claim they have moved from serving humans to serving agents, and understanding where those components sit and how they are organized becomes one of the keys.

![The agentic data stack: a layer of data agents and a context store sitting on top of the modern data stack, with agent infra — memory, inference, sandbox, observability — alongside it](/images/full-stack-data-engineer-harness/agentic-data-stack.png)

*The agentic data stack: data agents and a context store above the modern data stack, with agent infra beside it.*

Modern data stacks were designed for humans. The [agentic data stack](/blog/agentic-data-stack/) is designed for agents. Then, in the role of data architect, choosing the right lakehouse architecture, streaming and batch pipelines, quality-control framework and scheduler — and wiring them into a single agent infrastructure — becomes the foundation.

An agentic data stack is essentially an environment in which a data engineering agent can run long-horizon tasks continuously. Compared to a code container sandbox, or a browser for a general agent, or a cloud E2B-style sandbox, data needs a sandbox made of external services — because data only becomes safe once databases, ETL pipelines and BI tools have re-enterable, roll-back-able versions. Unfortunately most big data services today still lack good enough versioning and rollback, so for now we have to patch this ecosystem quite heavily.

### 3. The ability to build agent-native context from historical data

The most valuable data knowledge in an enterprise is rarely in the product manual. It hides in the SQL, reports, documents, column comments, group chats and personal experience left behind over the past few years.

Which tables are trustworthy, which metric has a trap in it, how a similar question was analyzed before, why a given table cannot be joined directly — this tacit knowledge decides whether an agent is genuinely usable. Whoever can precipitate these historical assets into structured [context](/blog/contextual-data-engineering/) can get an agent into production quickly, and keep it evolving as it gets used.

Just as with writing code, most people will not out-write AI. In the future the same will increasingly be true of writing SQL, building pipelines and making dashboards. The genuinely scarce ability is no longer single-shot output. It is defining semantics, organizing systems, and accumulating context.

## Is the future of data engineering delivery ChatBI?

AI changes not just the production side of data engineering but the consumption side too. There is a running debate over whether ChatBI is a fake requirement: if AI can only give an answer that is 80%, 90%, even 99% accurate, is the thing worth anything? Having run a fair number of [text-to-SQL](/blog/what-is-text-to-sql/) benchmarks, my strongest impression is that the problem is usually not SQL generation itself but the ambiguity that is inherent in natural language. Handing a chatbot directly to a user who does not understand the data definitions is still high risk.

A ChatBI with no data engineering context underneath it is usually water with no source. Final accuracy still comes back to the definition of the wide table, the definition of the metric, the construction of reference SQL and templates. In the cases and experience we have accumulated so far, only a subagent constrained by scoped context has been able to guarantee accuracy — and for the moment that still cannot be done without human design.

![ChatBI's last mile: five delivery forms — ad-hoc SQL for discovery, reference SQL for recurring questions, reference templates for repeated pivots, metrics for self-serve BI, and gen_report / gen_dashboard for deeper analysis](/images/full-stack-data-engineer-harness/chatbi-last-mile.png)

*ChatBI's last mile: different users need different answers, and each form trades freedom for determinism.*

So the realistic way to deliver ChatBI today is not a standalone chatbot, and not a full replacement for dashboards and reports, but an augmentation of them.

First use dashboards and reports to explain the key business structure and the core metrics to the user, then let the user ask follow-up questions freely through the subagent for that scenario. That path is more stable and much easier for people to accept. The common self-service detail-pull on the business side is also better built on top of reference SQL, reference templates and metrics than on raw generated SQL. Build a topic-centred copilot on the dashboards you already have, turn your previous analysis approaches into reusable skills, and generate daily and weekly reports from them. Then, once these self-reinforcing subagents have been polished enough, expose them as data service APIs or MCP endpoints for other downstream agents to reuse.

Having a full-stack data engineer initialize [subagents](/blog/subagents-domain-specific-data-agents/) by building context, and having a feedback loop automatically improve memory and context, is a more effective and more durable form of delivery than a predefined workflow.

## Harness data engineering

"Harness" has become a buzzword.

But skills have already spread quickly through data engineering, and subagents for isolating context and plan mode for handling long-horizon tasks are gradually becoming an accepted way of working.

If the core difficulty on the delivery side is accuracy and context, then the real key on the efficiency side is not "getting the model to write a bit more SQL". It is how to use effective validation to turn more operations from hand-holding into hands-off.

I have talked to a lot of data engineers and the felt experience is consistent: SQL development itself is not as complex as coding. What actually slows down the whole agentic loop is the small but fatal errors — one wrong column definition, one missing join condition, one metric filter that was not inherited, one misconfigured dashboard — each of which makes every downstream result wrong. As models get stronger and context gets more complete, this bottleneck has already moved from "generating SQL" to "validating whether the table, the metrics and the dashboard really meet the requirement".

And that is precisely where every company is different. Every company has its own table-creation standards, job standards, metric definitions and data quality requirements. Only by combining the model's ability with SQL review, [data quality](/blog/what-is-data-contract/), lineage and the experience embedded in historical jobs can you actually automate away this dirty work.

When I really did pick up Claude Code and build an end-to-end data engineering task, delivering a long-horizon, stable data engineering chain was still full of obstacles. After burning through a few billion Opus tokens, I built a proof of concept called AgenticDataTown: under a new harness framework, a human only has to care about publishing long-horizon tasks, building the spec standards, and reviewing the AI's daily report — and from zero it stood up a complete data architecture that syncs data from BigQuery into Iceberg and processes it through a layered warehouse on DuckDB + StarRocks + Airflow + Superset.

![Six screens from the AgenticDataTown proof of concept: a generated daily chronicle, a skill marketplace, a city-hall conversation reviewing yesterday's DAG runs, a StarRocks console, a task board with per-task cost, and a town dashboard of storage, compute and metric counts](/images/full-stack-data-engineer-harness/agentic-data-town.png)

*AgenticDataTown: the human publishes long-horizon tasks, sets the spec, and reviews the daily report.*

The way I understand a data engineering harness, the core is not wrapping one more layer of workflow around things. It is building a continuously improving validation loop: accumulate context from historical SQL and jobs, extract lineage and implicit rules, precipitate them into a validation spec that keeps getting better — and then, at the key moments of `gen_sql`, `gen_metrics` and `gen_dashboard`, do the checking, the reflection and the correction through standardized tool calls.

![The harness workflow: a human creates a goal, the orchestrator decomposes it and confirms the plan, each task runs through a validation loop of validation script, worktree diff and review, and only a passing run reaches update-docs, confirm and commit](/images/full-stack-data-engineer-harness/harness-workflow.png)

*The harness workflow: every task passes through a validation loop before a human confirms the commit.*

That is also the goal and the motivation behind the way we keep improving the Datus agent.

## Datus 0.3 and the playground

We have been productizing these judgements and experiments, and Datus 0.3 is the current instalment.

Datus is an open-source [data engineering agent](/blog/what-is-data-engineering-agent-2026/) whose goal is to help a single super-individual complete end-to-end data development and metric construction, and to deliver the API, chatbot and semantic layer that this age of agents calls for. It connects to the whole data engineering ecosystem, completes full data engineering development, generates data context from historical SQL, dashboards and documents, defines and develops metrics, and delivers reusable chatbots, dashboards and reports.

In 0.3 we added a lot, and we also released a free, publicly available Datus Studio playground. Core 0.3 features:

- **Scenario coverage:** complete subagents for `gen_table` / `gen_semantic_model` / `gen_metrics` / `gen_sql` / `gen_job` / `gen_report` / `gen_dashboard`, covering the whole data engineering chain. Each subagent supports custom spec validation, making the validation loop stable enough to meet data engineering requirements and closing the loop on development, testing and delivery for both data engineering and the metric layer.
- **Service integration:** more complete service support, with a new scheduler adaptor for Airflow and a new BI adaptor for Superset and Grafana.
- **Model support:** added support for Codex OAuth, Claude subscription, coding plans, OpenRouter, MiniMax and GLM.
- **Datus-Chat improvements:** a complete streaming API; a cleaner new web page that embeds into third-party sites with one line of JS; new Slack and Feishu channels.
- **Subagent-level memory:** feedback in Datus-Chat flows back through the feedback channel into the corresponding subagent, forming a long-term learning loop.
- **Reference templates:** filling in the fourth form of ChatBI, stabilizing the results of repetitive pivot-style questions.
- **Permission modes:** the same agent switches across normal / auto / dangerous, and combined with fine-grained tool permissions this covers different scenarios.

Try the open source: <a href="https://github.com/Datus-ai/Datus-agent" rel="nofollow noopener">GitHub repo</a>, <a href="https://docs.datus.ai/getting_started/Quickstart/" rel="nofollow noopener">Quickstart</a>, <a href="https://docs.datus.ai/dev/getting_started/data_engineering_quickstart/" rel="nofollow noopener">end-to-end data engineering pipeline</a>, <a href="https://docs.datus.ai/dev/getting_started/dashboard_copilot/" rel="nofollow noopener">dashboard copilot</a>.

Try the <a href="https://studio.datus.ai/overview" rel="nofollow noopener">Datus Studio playground</a>: it ships eight preset demos to work from, covering self-service querying, metric construction, data quality, layered warehouse processing, an iterable chatbot and metric attribution. They are a fast way to understand how a full-stack data engineer works.

If you want a purely local, IDE-based environment, the <a href="https://datus.ai/products/vscode/" rel="nofollow noopener">Datus VS Code extension</a> shipped in May 2026 for VS Code and Cursor; your data and database credentials stay on your machine.

## Frequently asked questions

### What is a one-person data team, and is it realistic?

It is one engineer covering the chain that used to run across data engineers, analysts, BI engineers and governance — not by personally writing every SQL query and report, but by directing an agent team that does. It is realistic in the sense that the handoffs, not the typing, were always the expensive part: every hop between two humans re-translates intent and loses context. It is not realistic as a way to avoid hiring: someone still has to define semantics, choose the architecture and sign off the validation.

### What does "semantic ownership" mean for a data engineer?

It means owning both the definition of a metric and the responsibility for maintaining it, rather than splitting those between the analyst and the engineer. Once models turn tables, metrics and pipelines into skills inside an agentic loop, an ambiguous definition does not stay ambiguous — it becomes a confidently wrong answer. Somebody has to guarantee that "active user", "GMV" or "new customer" means exactly one thing, and in an agent-driven stack that person is increasingly the engineer building the context.

### Why is validation, not SQL generation, the bottleneck?

Because SQL development was never as complex as application coding, and models have got good at it. What breaks a long agentic loop is the small, fatal error: one wrong column definition, a missing join condition, a metric filter that was not inherited, a misconfigured dashboard. Any of those makes every downstream result wrong while looking perfectly plausible. And validation is exactly the part that differs company by company — your table standards, your job standards, your metric definitions — so it has to be built from your own historical SQL and jobs rather than shipped inside a model.

### Should we deliver a ChatBI chatbot or stick with dashboards?

In practice, both — layered by how deterministic the question is. Use dashboards and reports to explain the business structure and core metrics, then let users ask follow-ups through a subagent scoped to that scenario. Self-service detail pulls are better served by reference SQL, reference templates and metrics than by raw generated SQL. A standalone free-text chatbot handed to users who do not know the data definitions is where accuracy claims tend to fall apart.

## Related articles

- [One-person data team](/blog/one-person-data-team/) — the day-to-day version of the same argument, from the solo engineer's calendar
- [Contextual data engineering](/blog/contextual-data-engineering/) — how context becomes a living asset instead of one-time docs
- [From human-first data systems to the agentic data stack](/blog/agentic-data-stack/) — what changes when the stack is designed for agents
- [Subagents: domain-specific data agents](/blog/subagents-domain-specific-data-agents/) — scoped context as the unit of delivery
