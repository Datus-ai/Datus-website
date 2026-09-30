---
title: "What Is Agentic Analytics? Why It Needs a Semantic Layer"
description: "Agentic analytics uses AI agents to plan and act on data, not just answer questions. See how it differs from conversational BI and needs governed metrics."
author: "Evan Paul"
date: 2026-09-29
lastmod: 2026-09-29
head:
  - - meta
    - name: keywords
      content: "agentic analytics, what is agentic analytics, agentic analytics platform, agentic bi, agentic analytics vs conversational analytics, ai agents analytics"
  - - meta
    - property: og:title
      content: "What Is Agentic Analytics? Why It Needs a Semantic Layer"
  - - meta
    - property: og:description
      content: "Agentic analytics uses AI agents to plan and act on data, not just answer questions. See how it differs from conversational BI and needs governed metrics."
  - - meta
    - property: og:type
      content: article
  - - meta
    - property: og:url
      content: https://datus.ai/blog/what-is-agentic-analytics/
  - - meta
    - property: og:image
      content: https://datus.ai/logo_dark.svg
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - link
    - rel: canonical
      href: https://datus.ai/blog/what-is-agentic-analytics/
---

# What Is Agentic Analytics? Why It Needs a Semantic Layer

## TL;DR

- **Agentic analytics** uses AI agents that plan and run a multi-step investigation on their own — not just answer one question and stop.
- It goes beyond **conversational analytics** (natural-language Q&A) and **autonomous analytics** (rules-driven automation): agentic systems decide for themselves what to check next.
- Most "agentic" features on the market today are still conversational copilots wearing the label.
- **An agent is only as trustworthy as the metric definitions it reasons over** — without a governed semantic layer, it produces confident, inconsistent, hard-to-audit answers.

**Agentic analytics** is the use of AI agents to autonomously plan, execute, and act on multi-step analytical work — rather than answer a single natural-language question and hand back a chart. This guide defines the term, separates it from the conversational-BI features most vendors actually ship, and explains why the agents that hold up in production are the ones reasoning over a [semantic layer](/blog/what-is-semantic-layer/), not raw schema. The distinction matters because the two architectures fail differently: a conversational copilot that misreads a column produces one wrong answer to one question, while an agent running an unsupervised multi-step plan on the same bad assumption can carry that error through an entire investigation before anyone notices.

## Agentic analytics: a working definition

A useful, vendor-neutral definition:

> **Agentic analytics** is an architecture in which one or more AI agents interpret a business goal, plan a sequence of analytical steps, execute those steps against live data and tools, evaluate the results, and either act on them or hand back a governed answer — with limited human direction between steps.

That's a meaningfully different job than most "AI-powered BI" features perform today. The distinction worth being precise about is **autonomous vs. agentic**: autonomous analytics is rules-driven — a scheduled report, an anomaly alert with a fixed threshold, a pipeline that runs on a cron. Agentic analytics is goal-driven — the agent decides what to check next, cross-referencing a revenue anomaly against seasonal patterns because it was trained to reason that way, not because a rule told it to.

The practical stakes are asymmetric, too. A wrong generative answer is embarrassing — a chatbot describes a trend incorrectly, someone notices, no harm done. A wrong agentic answer that triggers a downstream action — reordering inventory, rerouting a budget — is costly, because the agent doesn't just describe a mistake. It acts on it.

## Agentic analytics vs. conversational analytics vs. dashboards

These terms get used interchangeably in vendor marketing, but they describe different amounts of autonomy:

| Layer | What it does | Who decides the next step | Example |
| --- | --- | --- | --- |
| Traditional BI / dashboards | Presents pre-built views for a fixed question set | A human, in advance (the dashboard designer) | A weekly revenue dashboard |
| Augmented analytics | Speeds up a human's workflow (anomaly flags, auto-suggested charts, NL query) | A human, per question | "Show me revenue by region" typed into a search box |
| Conversational analytics | Answers an open-ended natural-language question against governed data, in a back-and-forth | A human, per turn | "Why did revenue drop in EMEA?" → agent explains, human asks a follow-up |
| **Agentic analytics** | Plans and runs a multi-step investigation, decides what to check next, can act | **The agent**, within governance boundaries | Agent notices the EMEA drop, checks it against seasonality and a pricing change, and flags the root cause unprompted |

Conversational analytics doesn't replace the BI layer underneath it — it extends it with a natural-language front end. Agentic analytics is the step where the system starts choosing which questions to ask, not just answering the one it was given.

This framing isn't universally accepted, and it's worth saying so honestly: some practitioners argue "agentic" layers on top of a semantic layer aren't a new architectural tier at all — just the same metrics, joins, and grain, wrapped in a more autonomous interface. That's a fair objection. The distinction that holds up is behavioral, not architectural: whether the system decides on its own what to check next, or waits for a human to ask.

## Why agentic analytics breaks without a semantic layer

This is the part vendor marketing tends to skip, and it's where the term connects directly to [text-to-SQL's own accuracy problem](/blog/why-text-to-sql-fails-without-a-semantic-layer/): an agent that reasons over raw tables has to guess what "active user" or "net revenue" means, the same way a text-to-SQL model does — except now that guess can trigger a multi-step plan instead of one query. A single bad guess in a one-shot query returns one wrong number; the same bad guess inside a multi-step plan gets carried into every subsequent step that depends on it, so the final answer can be wrong in a way that's much harder to trace back to its source.

An agentic analytics system is no more reliable than the data definitions it reasons over. When an agent works from inconsistent, uncontrolled, or ungoverned metrics, the result is a confident-sounding answer that quietly undermines the decision it's meant to support — and because the agent is running multiple steps instead of one query, a single ungoverned definition doesn't just produce one wrong number, it propagates through every step downstream of it.

A typical agentic analytics stack has an LLM reasoning layer, an orchestration/planning layer, tool integration, warehouse access, and retrieval for context. All of that can be built correctly and the stack still isn't trustworthy, because none of those layers answer the one question that actually determines whether the output is right: what does this metric mean, and is this step even a valid way to compute it? That's the semantic layer's job, and it's the piece most agentic analytics architectures underinvest in relative to the reasoning and orchestration layers that get the attention.

This isn't hypothetical. One team's account of piloting an agentic analytics rollout for ad-hoc SQL queries reported that fewer than 10% of their pilot queries made it into production without hallucinating a join condition, and connecting an LLM directly to their warehouse produced four conflicting definitions of "active churn" depending on which question surfaced it. Moving the metric logic into a governed semantic layer stabilized the results — though multi-step agent reasoning still tripled their token cost, a trade-off worth planning for rather than discovering in production (<a href="https://www.reddit.com/r/analytics/comments/1vsfleq/is_agentic_analytics_failing_in_production_or_are/" rel="nofollow noopener">source</a>).

The specific ways this goes wrong are mundane, which is part of why they're easy to miss in review: a join runs in the wrong direction and silently fans out the row count, a tenant or account scope gets dropped between two steps of a plan, a timestamp comparison assumes UTC when the source table stores local time. None of these produce an error message. They produce a plausible number that is simply wrong — and inside a multi-step plan, that wrong number becomes the input to the next step.

Gartner has started putting figures on this gap. In a May 2026 press briefing, Gartner VP Analyst Rita Sallam said AI agents without semantic context "are far more likely to hallucinate, introduce bias and produce unreliable results," and Gartner projects that organizations that prioritize semantics in their AI-ready data will increase agentic AI accuracy by up to 80% and cut costs by up to 60% by 2027 (<a href="https://www.gartner.com/en/newsroom/press-releases/2026-05-11-gartner-says-lack-of-semantics-causes-inaccurate-artificial-intelligence-agents-and-wasted-spending" rel="nofollow noopener">Gartner</a>).

The fix isn't a bigger model or another dashboard. It's defining "active customer" or "net revenue" once, in a governed semantic layer, so every agent-generated answer — and every step of a longer investigation — inherits the same definition instead of re-guessing it.

## The agentic analytics vendor landscape (2026)

"Agentic" is applied loosely across the BI market, so it's worth being concrete about who ships what, and verifying vendor claims yourself before betting an architecture on them:

| Vendor | Agentic feature | What it actually does |
| --- | --- | --- |
| ThoughtSpot | Spotter, plus SpotterViz / SpotterModel / SpotterCode | Natural-language query and dashboard building; SpotterModel builds semantic models without code; agents reached general availability in early 2026 (<a href="https://www.techtarget.com/data-technologies/news/366636078/ThoughtSpot-automates-full-platform-with-new-Spotter-agents" rel="nofollow noopener">TechTarget</a>) |
| Tableau (Salesforce) | Tableau Next, integrated with Salesforce Agentforce | Agents for data prep, natural-language query, and observability, launched April 2025; positioned to equip Salesforce's Agentforce agents with analytics skills |
| Qlik | NLQ and insight-generation agents | Conversational query and automated insight surfacing on top of Qlik's existing BI platform |
| Databricks | AI/BI Genie (business Q&A) and Genie Code (engineering agent) | Genie answers governed business questions against defined datasets; Genie Code, launched March 11, 2026, is a separate coding agent that builds pipelines, dashboards, and debugs against Unity Catalog (<a href="https://www.databricks.com/company/newsroom/press-releases/databricks-launches-genie-code-bringing-agentic-engineering-data" rel="nofollow noopener">Databricks</a>) |
| Snowflake | Cortex Analyst | Managed text-to-SQL grounded in Snowflake Semantic Views — see [What Is Cortex Analyst?](/blog/what-is-cortex-analyst/) for the detail |

Verify current capability and GA status directly with each vendor before evaluating — this category is moving fast, and roadmap slides tend to outrun what's shipped.

The more fundamental difference to watch for, though, is coupling. Each of these ships an agent tied to that vendor's own stack — ThoughtSpot's own semantic models, Databricks' Unity Catalog, Snowflake's Semantic Views — so the definitions only work inside the platform you bought them from. Dosi (below) takes a different bet: a semantic layer built on an open standard and compiled to native SQL across many warehouse dialects, not locked into a single vendor's stack and able to sit across whichever sources an organization actually runs.

## What has to be true underneath, for the autonomy to be safe

Distilled from how the vendors above actually architect this (not their marketing copy):

1. **A governed semantic layer** — one definition per metric, shared across every agent and every dashboard, so two people (or two agents) asking the same question get the same number.
2. **Scoped data access** — agents get the tables and columns relevant to their domain, not unrestricted warehouse access. Unbounded access to a cloud warehouse is a reliability problem, not a feature.
3. **Role-based governance and audit logging** — every agent action is traceable to who (or what) triggered it and which definition it used. Identity has to propagate with the request rather than live only in a prompt: an agent is untrusted the same way a user session is, and row-level access can't be enforced by asking the model nicely to respect it.
4. **Structured, typed errors and a repair loop instead of silent failure** — an agent that can't answer within its governed scope should get back a specific, actionable reason a step is invalid, so it can revise its plan instead of either falling back to guessing against raw schema or retrying the same invalid step.
5. **Reference SQL / validated prior queries** — the same institutional-memory problem that affects text-to-SQL affects agentic analytics: a validated, reused query path beats a fresh guess every time.

## How Dosi's approach differs: the semantic layer as a deterministic checker inside the loop

Most "semantic layer for agents" pitches stop at query time: define a metric once, let the agent call it instead of guessing at raw schema. That's necessary, and it's the whole story for a single text-to-SQL call — see [Why Text-to-SQL Fails Without a Semantic Layer](/blog/why-text-to-sql-fails-without-a-semantic-layer/). But agentic analytics is a harder problem than one query. A multi-step investigation can run a dozen syntactically valid SQL steps in a row and still end in a wrong number, because grain quietly drifted between two of them, a join fanned out and inflated the count, or "Region" silently switched from the customer's region to the store's region halfway through the chain. Every individual step ran fine; the meaning drifted.

Dosi's answer, detailed in [Datus's September 2026 update](/blog/semantic-layer-in-the-agent-loop/), is to move the semantic layer from "defines metrics" to **living inside the agent's analysis loop as a deterministic checker.** At each step the agent proposes — split this metric by that dimension, join these two datasets, drill into detail rows — Dosi decides whether the step is actually valid: whether the metric supports that dimension, whether two metrics share a grain, whether a join will fan out. The agent still chooses what to investigate next; the question of whether that next step is legal gets handed to the semantic layer instead of left to the model's judgment.

Concretely, this shows up as four query paths over one shared model — internally called **Dosi Select**: Metric (how much?), Dimension (split by what?), Attribution (why did it change?), and Detail (which exact rows?). An agent investigating "why did revenue drop this month?" can query the trend, discover which dimensions the Revenue metric actually supports, expand along Region or Channel, run attribution methods like term-wise, mix-shift, and factor Shapley, and drill into the specific orders behind the drop — all against the same governed definitions, without dropping out of the semantic layer to hand-write a new SQL query at every depth of the investigation.

That's the practical difference between a semantic layer that gets one question right and one built for the kind of multi-step, goal-driven investigation agentic analytics is supposed to run: the check happens at every step of the plan, not just the first one.

Underneath that, Dosi is a semantic layer engine built on the open [Apache Ossie](/blog/open-semantic-interchange-osi/) standard: you define metrics and relationships once in an open, portable format, and Dosi compiles them into governed SQL across 16 warehouse dialects. It ships a [native MCP server](/blog/dosi-mcp-semantic-layer-for-agents/), so a planning/orchestration agent (built with [datus-agent](/blog/what-is-data-engineering-agent-2026/), Claude, or another framework) can discover defined metrics, preview generated SQL, and execute against them mid-plan. Dosi is vendor-neutral and has no warehouse lock-in, but it is **not open-source software** — it is licensed under the Elastic License 2.0 as part of Datus Studio; the open-source component is **datus-agent**, the CLI data agent.

## Practical checklist before adopting agentic analytics

1. **Ask which layer is actually agentic.** A chatbot answering one question in natural language is conversational analytics, not agentic analytics — confirm the product plans and executes multi-step investigations, not just single-turn NLQ.
2. **Ask what happens when the agent is wrong.** Does it say "I don't know within my governed scope," or does it fall back to guessing against raw tables?
3. **Check where metric definitions live.** If "net revenue" is defined once per dashboard rather than once per organization, agents built on top of it will disagree with each other.
4. **Check audit and rollback.** If an agent can trigger an action (reorder, reprice, re-route), there needs to be a log of what it did and why, and a way to reverse it.
5. **Verify vendor GA dates yourself.** Agentic features in this market are shipping and changing fast — confirm what's actually generally available versus roadmap.

## Conclusion

Agentic analytics is a real architectural shift — agents that plan and run a multi-step investigation instead of answering one question and stopping — but the label gets applied to almost anything with a chat box attached to it. The dividing line isn't autonomy for its own sake; it's whether the system can be trusted to decide what to check next, and that trust comes entirely from what's governing its steps underneath. An agent reasoning over raw tables is guessing fresh at every step of a longer chain. An agent reasoning over a governed semantic layer carries the same definitions through every step, which is what actually makes multi-step autonomy safe to run in production.

## Frequently asked questions

### Is agentic analytics the same as conversational analytics?

No. Conversational analytics answers a natural-language question, one turn at a time, against existing BI or governed data — the human still drives what gets asked next. Agentic analytics adds autonomy: the agent plans a multi-step investigation and decides what to check next, within governance boundaries it doesn't get to redefine.

### Is "agentic analytics" the same as "agentic AI"?

Agentic AI is the broader software paradigm — agents that perceive, reason, and act toward a goal with limited human handoff. Agentic analytics is that paradigm applied specifically to analytical workflows: querying data, checking results, and producing a governed answer or action instead of a single response.

### Do I need a semantic layer to do agentic analytics?

If the agent's output informs a real decision or triggers an action, yes. An ungoverned agent produces confident, inconsistent answers, because nothing stops it from picking a different plausible column or join path on every run. The semantic layer is what lets an agent's multi-step plan stay grounded in one set of definitions instead of re-guessing at every step.

### Can one semantic layer really unify all the metric definitions my organization already has?

Be honest about this one: most organizations aren't living with a single semantic layer, they're living with several — a transformation layer, a BI tool's own metric store, warehouse-native semantic views, a data catalog with its own business glossary, and an ML feature store where "customer" quietly means something else again. No single rollout collapses all of that into one layer overnight, and some of the gap is organizational, not technical — different teams own different systems and have reasons not to converge. A governed semantic layer for agentic analytics has to start somewhere concrete (one domain, one set of metrics) and expand deliberately, not promise to unify everything on day one.

### How do I tell whether a platform is actually agentic, or just conversational BI relabeled?

Ask what happens between questions. If a human has to type every follow-up, it's conversational analytics with a natural-language front end. If the system decides on its own what to check next — cross-referencing an anomaly against a related metric without being asked — it's agentic. Then check what's underneath: an agent that can't say "this metric doesn't support that dimension" and instead guesses is not production-ready, regardless of how the vendor markets it.

## Related articles

- [Why Text-to-SQL Fails Without a Semantic Layer](/blog/why-text-to-sql-fails-without-a-semantic-layer/) — the same governed-metrics problem, one query at a time
- [Datus September Update: The Semantic Layer in the Agent Loop](/blog/semantic-layer-in-the-agent-loop/) — how Dosi checks grain, fanout, and dimension validity at every step of a multi-step plan
- [What is a semantic layer?](/blog/what-is-semantic-layer/) — governed metrics and dimensions, defined
- [Dosi with Cube: OSI Execution and Agentic Analytics in One Stack](/blog/dosi-with-cube/) — a specific agentic-analytics stack architecture
- [Semantic modeling for agentic analytics workflows](/blog/semantic-modeling-for-agentic-analytics-workflows/) — the modeling side of this same shift
- [Datus glossary](/glossary#ai-agents) — short definitions for text-to-SQL, agentic analytics, and related terms
