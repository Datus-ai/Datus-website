---
title: "13 Months from ChatBI to DataAgent: A Field Report"
description: "Thirteen months inside a restaurant chain's move from ChatBI to a DataAgent: the paradigm shift, layering by determinism, security hooks, and the pits we hit."
author: "Harrison Zhao"
date: 2026-09-09
lastmod: 2026-09-09
head:
  - - meta
    - name: keywords
      content: "ChatBI to data agent, data agent case study, enterprise data agent deployment, reference template, reference SQL, scoped context, SQL permission hook, row access control, semantic layer attribution"
  - - meta
    - property: og:title
      content: "13 Months from ChatBI to DataAgent: A Field Report"
  - - meta
    - property: og:description
      content: "Thirteen months inside a restaurant chain's move from ChatBI to a DataAgent: the paradigm shift, layering by determinism, security hooks, and the pits we hit."
  - - meta
    - property: og:type
      content: article
  - - meta
    - property: og:url
      content: https://datus.ai/blog/chatbi-to-data-agent-13-months/
  - - meta
    - property: og:image
      content: https://datus.ai/logo_dark.svg
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - link
    - rel: canonical
      href: https://datus.ai/blog/chatbi-to-data-agent-13-months/
---

# 13 Months from ChatBI to DataAgent: A Field Report

## TL;DR

- An 80% accuracy bar sounds reasonable and is not: **one confidently wrong answer and the user never asks a second question.** Trust, not accuracy, is what killed the first ChatBI tool.
- Stronger models did not solve business context. No model knows what "3% negative reviews" means in this company, or how franchise and direct-operated stores differ in definition.
- The fix was **layering by determinism**: reference templates where the question is fixed, reference SQL plus a knowledge base for self-service, and the metric semantic layer plus skills for attribution and reporting.
- **Security never goes through the model.** Database account, tool permission mode, scoped context and a SQL hook that parses and rewrites before execution — four gates the model cannot reach.
- The pits: wrapping an LLM around BI, putting every request in one free-text box, IT writing the prompts while the business watched, and leaving security and evaluation until after launch.

> **A note on this article.** The customer gave us an outline. Fable 5 read 27 AI meeting transcripts and wrote a first draft, and the customer removed some hallucinations and numeric errors. I did not change a word of the body, so all I can add is this note.
>
> In May 2025 I was still demoing to them with a raw CLI product whose code I had mostly hand-written. Watching the product get polished step by step and the models get stronger step by step, thirteen months later — in an era of violent change in AI products — the best product decision I made was taking the "Claude Code for data engineers" path and never missing a single model iteration. In the first half of 2025 people thought Claude Code was a product a small circle liked, and I still had to explain to customers why Claude Code was the best product form. I think that is consensus now.
>
> Whether the world needs a Claude Code for data engineers is an argument with no answer. Plenty of people feel they can vibe anything now, that they can do everything with Claude Code. I still believe permissions, long-horizon tasks, metric systems and multi-model selection are worth their own product line. Continuous accumulation, continuous evolution has been the Datus positioning since day one, which is why the first line of our docs homepage is one I still would not change: **Building evolvable context for data systems.** — Harrison Zhao

One afternoon in May 2025, we visited this restaurant chain's data team for the first time. It has tens of thousands of stores across the country. The product conversation was scheduled for an hour and ran from 3:30 in the afternoon to past eight in the evening. We went to dinner together in the middle, came back, and kept going.

What everyone talked about most that day was not the product. It was the problems left over from the previous two months. A ChatBI tool they had already bought, which the business never accepted. One senior data engineer, trying to get the AI to answer questions about a single table correctly, had tuned it on and off for two weeks: renaming every column into Chinese, stripping out the codes, then standing in the user's shoes and guessing, sentence by sentence, how the business would ask. In the end the most effective method was still editing the prompt directly. Four person-days, one table tuned. And this company has tens of thousands of tables.

Thirteen months later, DataAgent is embedded in their business app. The management scenario for their core brand runs anomaly detection, attribution analysis and action recommendations end to end, and the data development team has started using the agent for day-to-day metric development. We want to record the path as it actually happened: which problems came from the model, which came from the pattern itself, and which solutions the two sides worked out together.

![A thirteen-month timeline from the first conversation in May 2025 to DataAgent in production: semantic layer demo in July 2025, first scenario deployed and a test set built in August–September, the three-year DataAgent plan started in November, sub-agent architecture and metric interface alignment in December, attribution report generation in April 2026, VS Code plugin plus reports, dashboards and Q&A live in May, and data-development rollout and ontology integration in June](/images/chatbi-to-data-agent-13-months/thirteen-month-timeline.png)

*Figure 1 — thirteen months, from the first conversation to DataAgent in production (selected milestones).*

## 1. From GPT-4o to a hybrid multi-model architecture: the paradigm shift

### Why ChatBI "demos but cannot be used"

In the first half of 2025, most ChatBI products on the market used the same approach: the business asks in natural language, the system retrieves column descriptions and SQL fragments from a knowledge base, splices them into a very long prompt, and has the model generate SQL in one shot. In the GPT-4o era this was a fairly realistic design given model capability, because what models were most stable at was one question, one answer.

Demos usually went smoothly. Connect it to a real business and the problems multiplied. Knowledge and features depended on manual configuration; every new requirement meant preparing views, knowledge and SQL fragments again, which made it very hard to widen usage. Even asking the model to consistently use a particular alias produced results that were good sometimes and not others. However carefully you wrote the column descriptions, the model would not necessarily use them; editing the prompt by hand was what actually worked. What the system could do depended largely on how much time the person tuning the prompt still had to invest.

What really made the business give up was trust. The go-live bar was set at 80% accuracy, which does not sound low, but a user who hits one confidently worded wrong answer usually does not ask a second question.

### What changed in the models this year

Over this year we and the customer used GPT-4o, Claude, Kimi, DeepSeek and MiniMax in turn. What we settled on was a hybrid multi-model architecture. Kimi Coding Plan, MiniMax, DeepSeek-V4 and GPT-5.5 each handle the tasks that suit them, and sub-agents pick different models for question answering, attribution and code generation. Compared with GPT-4o, the new generation of models can already complete multi-step tasks fairly stably: check the metric, then spot the anomaly, then drill down by dimension, compare rankings, and finally assemble the conclusion. One complete market attribution analysis consumes roughly 190,000 tokens, which at the prices of domestic models at the time works out to well under a yuan.

The role the model plays changed with it. ChatBI mainly translates one sentence of natural language into one SQL statement. A DataAgent is given tools, business context and behavioural boundaries, and works through the task step by step like an analyst on their first week. That is the difference between the two approaches.

![ChatBI in the GPT-4o era versus DataAgent in the multi-model era: the left column goes user question, knowledge-base and SQL-fragment retrieval, one large prompt, one-shot SQL generation, return the result and hope; the right column goes user task, plan into multiple analysis steps, call tools for metrics, templates and SQL, hook validation and permission injection, then drill down, compare, attribute and write up](/images/chatbi-to-data-agent-13-months/chatbi-vs-dataagent.png)

*Figure 2 — two paradigms: one-shot question answering versus multi-step execution with domain context, tools, boundaries and feedback.*

Stronger models did not solve business context. However strong a model gets, it still does not know what "3% negative reviews" means in this company, does not know how the rule is calculated, and cannot tell franchise and direct-operated stores apart by definition. After model capability improved, the project was still stuck on these specific problems. Everything that follows starts here.

## 2. Choosing the right scenario: three capabilities, three uses

### Pick the scenario before the technology

This company was not short of AI tools internally — question answering, reporting and customer service all had their own systems. What was genuinely missing was one complete chain that goes from the question to the data, and from the analysis to the action. After repeated discussion with the IT lead, we decided not to pile on features but to make one main line work end to end. The first phase picked "anomaly management" inside franchise management, because the boss looks at it personally, the business pain is real, the metrics are relatively clear, and the effect can be measured in numbers.

While discussing it, we also found that different roles need very different levels of strictness. Among the ten-thousand-plus frontline users, a store manager will not usually go and ask "why" — they need the system to point out the anomaly directly and tell them what to do next. A regional manager will keep chasing the cause and making comparisons, while an analyst in the office needs flexible ad-hoc querying. The previous generation of ChatBI stuffed all three needs into one free-text box, and that is where it went wrong.

### Three scenarios, three capabilities

The first layer is the **reference template**, used in the strictest scenarios. For the fixed questions a store manager looks at every day, the SQL is turned into a parameterized template first; the model only understands the question and fills in the parameters, and is not responsible for generating SQL. Because there are few variable steps, accuracy can approach 100%.

The second layer is **reference SQL plus a knowledge base**, supporting self-service querying. Office colleagues have more flexible needs, but there is usually a historical pattern to follow. The system indexes past SQL by topic, retrieves a similar case and then rewrites it to generate the query. Combined with continuous tuning of knowledge recall, this layer strikes a fairly practical balance between flexibility and stability.

The third layer is the **metric semantic layer plus skills**, used for attribution and reporting, and it is also where the customer's own metrics platform delivers the most value. Before this, that platform had never really been used at either end: development did not treat it as the single outlet, and the business rarely used it directly. Once the agent was connected, analysis has to start from the metrics platform and complete attribution along derived metrics, atomic metrics and dimensions, without bypassing the metric layer and inventing its own definitions. How the analysis is actually done is left to a skill that plugs in the business team's own method.

![Choosing the right scenario: store managers and frontline staff with standard daily questions map to reference templates where the model only fills parameters; office self-service querying maps to reference SQL plus a knowledge base, retrieving historical cases and rewriting; regional managers and management doing attribution, reports and open questions map to the metric semantic layer plus skills; every scenario has its own benchmark test set and feedback loop](/images/chatbi-to-data-agent-13-months/determinism-layers.png)

*Figure 3 — layering by determinism: the more deterministic the scenario, the less freedom the model gets.*

The third layer has one detail worth calling out on its own. When attribution analysis first started running, the results were not stable — run the same task a few times and the conclusion would change, and the model would occasionally invent a metric. We did not keep tuning the model. We asked a business analyst to write down their own analysis steps in natural language: which metric to look at first, which dimensions to compare by, what counts as an anomaly. That document was then turned into a skill for the agent. The model follows the business person's line of thinking step by step, and every step can be explained and replayed.

The first report generated this way analyzed how membership cards were performing across a few dozen stores in one city market. The agent first checked the values, found the stores that had been abnormal for several days running, then did a peer ranking and a market roll-up, and finally gave a store classification and action recommendations. On the day we demoed it to the business lead we prepared two plans: show the report we had run in advance, then run the whole thing live. The live run completed fine too.

One sentence from that meeting has followed the project ever since:

> We are not trying to replace the analyst. We are trying to precipitate the analyst's thinking into a capability that can be called over and over again.

### Making "more accurate" a number you can check

What the business fears most is hearing "we will keep optimizing", because with no number there is no way to judge whether anything actually got better. From the first scenario onwards we built a test set together with the data team. It started with only twenty or thirty real questions, each scenario with a standard answer. After that, every version update and every knowledge adjustment has to run the regression. A user leaving an emoji reaction in Feishu also triggers the downstream knowledge-precipitation flow. With a benchmark in place, "more accurate" stops being a vague promise.

## 3. From usable to trustworthy: context and security

The most awkward thing about ChatBI is that the business cannot tell which part of an answer came from computation and which part came from guessing. To make users genuinely willing to rely on it, we had to solve two things at once: the AI has to know what it is saying, and the enterprise has to be able to see what the AI has done.

### Context: stuff less into the prompt, manage it in layers

At a scale of tens of thousands of tables, there is no possibility of putting every schema into the prompt. Datus splits context into several layers: metric and dimension definitions live in the semantic layer; business rules and analysis methods are written into local knowledge files and skills; historical SQL is grouped by person and by topic and then initialized as project-level knowledge. When a conversation happens, the system only recalls what is relevant to the current question.

This approach most directly reduced the cost of initializing a new scenario. The engineer at the start of this article spent four person-days tuning one table; the flow now is to hand a business line's historical SQL to the system, generate the semantic model and knowledge files automatically, and then have a human confirm and correct them. In an early semantic-layer demo we generated a semantic model from 7 SQL statements, averaging about two minutes each. A real project still needs people to confirm and tune, but the work has moved from hand-writing prompts to reviewing what the system produced, and those are completely different kinds of investment.

The VS Code plugin that went live in May 2026 pushed the flow one step further. Developers started managing local SQL and jobs the way they manage code — versioned, reviewable, reusable. Context quality rose with it, and scenario-specific sub-agents, reports and dashboards became easier to generate. After the plugin was rolled out internally, the feedback was clearly better than for the previous tools.

### Security: do not hand the boundary to the model

Data permissions are not negotiable. A regional manager for the Shanghai market must not see other regions' data, and a store manager sees only their own store. While discussing the design, a colleague suggested writing the filter conditions into the prompt and letting the model splice the permission filter itself. We rejected that on the spot. The model is the easiest link in the whole chain to get around; it cannot be the thing that decides who may see what.

In the end we put security controls in several places the model cannot touch. The first gate is database account permissions: the agent connects with a controlled account, so the range of data it can reach is locked at the source. The second is the tool permission mode at the execution layer, opening up read-only, writable and table-creating step by step, with sensitive operations requiring user confirmation. Fully automatic execution also depends on a sandbox and database snapshots; most on-premise environments in China do not yet have a mature answer there, so execution-layer permissions need to be tighter still. The third is on the question-answering side: scoped context only exposes the authorized tables and metrics to the model, anything outside that range never enters the context, and PII is handled by dedicated skills. Finally there is hook validation. Every user is bound to a role, an organization and a store scope, and after the SQL is generated but before it is executed it must be parsed: is the table on the authorization list, is the permission filter complete? If either is missing, the system refuses to execute; once validation passes, the hook injects the user's corresponding filter conditions. Both the original SQL and the injected version are retained for audit. The store access control shipped recently works exactly this way: through row access control and column masking, the chatbot lets a store manager see only their own store's data, with sensitive columns masked.

![The SQL permission hook and audit chain: the model generates SQL, a hook parses and validates it, permission filters are injected, the query executes, and the audit trail is retained; below, four rules — user identity bound at three levels of role, organization and store scope; reject on failed validation when the table is not on the authorization list or the filter is missing; filters spliced by the hook because the model is the easiest link to bypass; and full SQL retention with tiered permissions and confirmation for sensitive operations](/images/chatbi-to-data-agent-13-months/sql-permission-hook.png)

*Figure 4 — capability can go to the model; the boundary has to stay with the system.*

This mechanism had an unexpected side benefit. Hooks and audit do not depend on any particular model, so they can be reused across other AI projects. Other AI tools inside the company have now started adopting the same approach.

In practice, the model is responsible for analysis and execution, and the system is responsible for permissions, validation and audit. That way the security boundary does not need the model to judge or maintain it.

## 4. Next: bringing the agent into data development

So far, DataAgent has mainly solved problems on the data consumption side. But between the business raising a requirement and data development creating tables, building ETL, defining metrics and assembling reports — and then AI using those metrics — there are still weeks of manual process in the middle. The next step is to push the agent onto the data development side and connect that chain. From June 2026 onwards the team has focused on integrating data context with ontology, with three main pieces of work.

First, make the data development process agentic. Developers use the agent inside the IDE plugin to write SQL, create tables and build ETL, and then precipitate table-creation standards and SQL review standards into skills. Every table and every metric the agent generates enters a validation flow automatically. Once development is done, the tables, metrics and semantic models can become tools for the downstream question-answering agent directly, with no second round of configuration.

Second, turn existing assets into context the agent can use. The enterprise has accumulated thousands of SQL statements, reports and definition documents; they are valuable and hard to manage. We are turning the "historical SQL → project knowledge → semantic model" initialization flow into a standard capability, so old assets can enter the new system at low cost instead of being torn down and rebuilt.

Third, put the internal tool in front of frontline business users. Datus is moving from a tool used by the IT team to a service aimed directly at stores. The team has started selecting a first batch of a few dozen stores to pilot, letting franchisees and store managers use it inside their own app. At that point the requirements on stability, compliance and operational experience all go up, and plenty of problems that were invisible in an internal demo will surface for real.

![From R&D to agent: the past, where manual steps sat in between — business raises a requirement, manual table creation and ETL, manual metric definition, manual tool configuration, business use, measured in weeks; and what is happening now — business raises a requirement, development agent creates tables and ETL, metrics and semantic models are generated automatically, skills validate them against the spec, and question answering, attribution and reports are immediately usable, measured in days; with existing assets of historical SQL, reports and definition documents initialized into project knowledge rather than rebuilt from scratch](/images/chatbi-to-data-agent-13-months/end-to-end-flow.png)

*Figure 5 — one set of context across the whole chain, from data development to the agent.*

We have also observed one change: the division of labour between data engineering and data analysis is being redrawn. When the agent puts table creation, ETL, metrics, question answering and reporting into the same context, one person doing the work of several former roles at least starts to be technically feasible. The focus of a data engineer's work is shifting too. Compared with simply writing code, defining and maintaining semantics is becoming more important, because the agent has to understand the business before it knows what to do.

When we did the planning in autumn 2025, we set a goal: form an "operating brain" that can keep evolving. Having got this far, our understanding of it has actually become more concrete. Whether the system can evolve depends on whether business feedback can become new knowledge at low cost. If that chain breaks, no model, however strong, can keep the system improving.

## The pits we stepped in

If you are also evaluating a move from ChatBI to a DataAgent, here are the ones we fell into, or nearly fell into, over these thirteen months.

**Pit one: wrapping a layer of LLM around BI.** We tried this route. Four person-days to tune one table, and the business still did not trust it. Metrics, dimensions and rules have to be sorted out first; that step cannot be skipped.

**Pit two: stuffing every requirement into one free-text box.** We overestimated the model and underestimated the patience of business users. Only after layering by determinism did the system slowly stabilize: standard questions use templates, self-service querying references historical cases, attribution analysis uses unified metrics and the business's own analysis method.

**Pit three: IT does everything, the business watches.** Prompts IT wrote themselves, the business stopped using very quickly. What actually worked was asking an analyst to write down, in plain words, "when I hit this kind of problem, here is how I would check it", and then turning that into a skill.

**Pit four: leaving security and evaluation until after launch.** We nearly fell squarely into this one. Retrofitting permission hooks, audit logs and a regression test set afterwards costs far more than designing them up front.

The last one is not a pit. It is a line from an internal discussion at the customer: "the boss does not care whether the tool is advanced, only whether it saves time and whether it is useful." We later pinned it to the front page of the project workspace.

This road is not finished. We are writing down the process and the mistakes in the hope that whoever comes next takes a few fewer detours.

## Frequently asked questions

### Why did an 80% accuracy target fail in production?

Because accuracy and trust are not the same quantity. A user who receives one confidently worded wrong answer usually does not ask a second question, so the 20% does not average out — it ends adoption. What changed the outcome was not pushing the number higher in general but reducing how much the model was allowed to decide in the scenarios that mattered most: parameterized templates for fixed daily questions, retrieved and rewritten reference SQL for self-service, and a governed metric layer for attribution.

### What does "layering by determinism" mean in practice?

It means matching the delivery form to how fixed the question is. A store manager's daily questions are fixed, so the SQL becomes a parameterized reference template and the model only fills in parameters. Office self-service is flexible but usually has a historical precedent, so the system indexes past SQL by topic, retrieves a similar case and rewrites it. Attribution and reporting are open-ended, so they are constrained to start from the [semantic layer](/blog/what-is-semantic-layer/) and follow a business-written skill rather than inventing definitions.

### How do you stop an agent from bypassing row-level data permissions?

By never letting the model hold the boundary. Four gates sit outside it: a controlled database account that limits reachable data at the source; a tool permission mode that opens read-only, writable and table-creating step by step with confirmation for sensitive operations; scoped context that only exposes authorized tables and metrics; and a hook that parses generated SQL before execution, refuses anything whose table is not on the authorization list or whose permission filter is incomplete, then injects the user's filters. Both the original and injected SQL are retained for audit.

### How long did it take to get from first conversation to production?

Thirteen months, and the milestones were not evenly spaced: a semantic layer demo about two months in, the first scenario deployed with a test set at three to four months, sub-agent architecture and metric interface alignment at seven months, attribution report generation at eleven, and reports, dashboards and question answering live in the business app at twelve. The long middle was spent on business context and evaluation, not on model selection.

### Does a stronger model remove the need for this work?

No. Over the thirteen months the models changed several times and got substantially better at multi-step tasks, which is what made a DataAgent possible at all. But no model knows what "3% negative reviews" means in a specific company, how a rule is calculated, or how franchise and direct-operated stores differ by definition. Model capability raised the ceiling; business context, validation and permissions decided whether anything shipped.

## Related articles

- [What is a data agent?](/blog/what-is-data-agent/) — the category, and how it differs from a data engineering agent
- [What an enterprise data engineering agent actually needs](/blog/enterprise-data-engineering-agent/) — the governance requirements this project ran into
- [Subagents: domain-specific data agents](/blog/subagents-domain-specific-data-agents/) — scoped context as the unit of delivery
- [Contextual data engineering](/blog/contextual-data-engineering/) — why context has to be built from existing assets rather than rebuilt
