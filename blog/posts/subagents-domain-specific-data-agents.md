---
title: "Subagents: How to Ship Domain-Specific Data Agents Without Training a Model"
description: "Subagents explained: domain-specific data agents built from scoped context, feedback, and governed access."
author: "John Smith"
date: 2026-06-04
lastmod: 2026-06-04
head:
  - - meta
    - name: keywords
      content: "subagent data engineering, domain specific data agent, data engineering subagent, scoped context agent, data chatbot subagent"
  - - meta
    - property: og:title
      content: "Subagents: How to Ship Domain-Specific Data Agents Without Training a Model"
  - - meta
    - property: og:description
      content: "Subagents explained: domain-specific data agents built from scoped context, feedback, and governed access."
  - - meta
    - property: og:type
      content: article
  - - meta
    - property: og:url
      content: https://datus.ai/blog/posts/subagents-domain-specific-data-agents
  - - meta
    - property: og:image
      content: https://datus.ai/logo_dark.svg
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - link
    - rel: canonical
      href: https://datus.ai/blog/posts/subagents-domain-specific-data-agents
---
# Subagents: How to Ship Domain-Specific Data Agents Without Training a Model

A [data engineering agent](/posts/what-is-data-engineering-agent-2026) that can answer any question about your entire warehouse sounds powerful. In practice, it is a liability. Give an agent unrestricted access to every table, every metric, and every schema, and it will produce answers that are technically correct and organizationally wrong—using the operations team's definition of revenue when finance asked the question, or joining through a deprecated path because nobody told the agent not to.

A subagent solves this by scoping the problem. Instead of one agent that knows everything, you create many subagents, each knowing exactly what one domain needs: roughly 10 tables, 20 metrics, 30 validated SQL references, and a set of standing business rules. Each subagent is a self-contained, shareable chatbot that delivers accurate answers within its domain—and stays silent outside it.

This article explains what subagents are, how they work, and why they are the delivery unit that separates a <a href="https://datus.ai/glossary">data engineering agent</a> from a smart SQL writer. For the philosophy behind scoped context, see [contextual data engineering](/posts/contextual-data-engineering).

## TL;DR

- A **subagent** is a domain-specific chatbot built from scoped context: a curated subset of tables, metrics, validated SQL, and business rules relevant to one business domain.
- Subagents solve three problems: **accuracy** (less irrelevant context = fewer wrong answers), **access control** (finance subagent cannot query HR tables), and **delivery** (analysts get a purpose-built chatbot instead of a general-purpose agent they do not know how to use).
- The subagent lifecycle: ad-hoc exploration → generate metrics and reference SQL → configure scope → deploy chatbot → collect feedback → refine context → mature enough to export as an API.
- Subagents are not a feature. They are the delivery model.

## 1. The problem subagents solve

General-purpose agents fail at domain-specific data work for three reasons:

**Too much context.** A warehouse with 5,000 tables and 30,000 columns contains far more information than any agent can usefully process for a single query. If the agent loads the entire schema into its context window, it drowns in irrelevant information. If it selectively retrieves, it needs to know what is relevant. Subagents pre-define what is relevant for each domain.

**Wrong definitions.** The finance team's definition of "net revenue" (gross minus refunds, locked FX rates) is not the operations team's definition (gross minus chargebacks, spot rates). A general-purpose agent with access to both will pick one arbitrarily—or produce a confused average. Subagents constrain the agent to the definitions that matter for its domain.

**No guardrails.** A general-purpose agent with warehouse access can query any table, join any path, and reference any metric. It can expose PII to the wrong user. It can use deprecated tables that produce silently wrong results. It can join through paths that create duplicate rows. Subagents scope access to approved tables, join paths, and metrics—and exclude everything else.

## 2. What a subagent contains

A subagent is defined by its scope. A typical scope for a domain-specific subagent:

| Component | Typical size | Purpose |
|---|---|---|
| **Tables** | ~10 | The physical tables relevant to the domain. Marketing subagent: `campaigns`, `ad_spend`, `attribution`, `channels`, `customer_segments`. |
| **Metrics** | ~20 | Curated metric definitions drawn from the context engine. Marketing: `cac`, `roas`, `ctr`, `conversion_rate`, `ltv`. Each with its formal definition (calculation, filters, grain). |
| **Validated SQL** | ~30 | Proven query patterns the domain's team has upvoted or the engineer has manually promoted. The subagent adapts these patterns rather than generating from scratch. |
| **Business rules** | 5-10 | Standing constraints the subagent must follow. "Always filter `is_test = false`." "Join to `dim_customer` through `customer_id`, not `account_key`." "Never query `employee_salaries` table." |
| **Domain description** | 1 paragraph | Natural-language description of what the subagent can answer—so users know its scope before typing a question. |

This scope is not static. As the domain evolves—new tables, updated metric definitions, changing business rules—the engineer updates the scope. As users provide feedback—upvoting correct queries, reporting issues—the context engine updates the validated SQL and business rules automatically.

## 3. The subagent lifecycle: from exploration to API

A subagent is not created in a single step. It evolves through a lifecycle:

### Stage 1: Ad-hoc exploration

An engineer notices a recurring pattern of data requests from one team—marketing keeps asking for campaign performance numbers, each time with slightly different parameters. The engineer explores the relevant tables (`@catalog`), inspects their schemas (`@table campaigns`), and runs a few ad-hoc queries to understand the data landscape.

### Stage 2: Generate context

The engineer runs `/gen_semantic_model` on the relevant tables to generate business semantics—which columns are metrics vs. dimensions, how tables relate. Runs `/gen_metrics` to extract candidate metrics from historical SQL. Reviews and curates the output: accepts some, corrects others, rejects the rest.

### Stage 3: Configure scope

The engineer runs `.subagent add`, selects ~10 tables, ~20 metrics, and adds 5-10 business rules. Writes a domain description: "Answers questions about campaign performance, channel attribution, and marketing spend across paid and organic channels." The subagent is now a scoped, queryable chatbot.

### Stage 4: Deploy and collect feedback

The engineer shares the subagent link with the marketing team. Marketing asks questions. Correct answers get upvoted—the context engine strengthens the patterns. Wrong answers get reported—the engine updates the rules. Corrections compound: the tenth query is more accurate than the first.

### Stage 5: Refine and mature

After a period of active use, the engineer reviews feedback patterns, promotes validated rules into the formal context store, and expands the scope to cover edge cases that emerged from usage. Accuracy should be measured against the team's own recurring query patterns rather than assumed from a generic benchmark.

### Stage 6: Export as API

When the subagent is mature—high accuracy, stable scope, low rate of corrections—it can be exported as an HTTP API. Other systems (dashboards, internal tools, downstream agents) query the API to get grounded, accurate answers. The subagent has graduated from a chatbot to an infrastructure service.

This lifecycle reflects a broader philosophy about how data work should scale: an engineer builds context, an agent delivers it, users refine it, and the system gets more valuable the longer it runs. For more on this philosophy, see [one-person data team](/posts/one-person-data-team).

## 4. Why subagents are the right delivery unit

The industry has converged on several candidate delivery models for data engineering agents:

**The universal agent.** One agent with full warehouse access. Users ask anything. Problem: accuracy degrades as scope grows; access control is binary (all or nothing); metric drift is inevitable.

**The per-query prompt.** Users write a natural-language prompt for each query. The agent generates SQL, executes it, returns results. Problem: no shared context; every query starts from zero; corrections do not survive sessions.

**The dashboard copilot.** An agent embedded in a BI tool, answering questions about the data behind a specific dashboard. Problem: limited to one dashboard's scope; cannot answer cross-domain questions; tied to a specific BI vendor.

**The subagent.** A scoped, shareable chatbot for one domain. Users ask domain-specific questions. The subagent retrieves from curated context. Corrections feed back into the shared context engine. Other subagents for other domains draw from the same engine but are constrained to their scope.

Subagents win on three dimensions that matter for sustained, team-scale data work:

- **Accuracy**: curated scope → less noise → more accurate answers.
- **Access control**: scope defines the boundary → finance subagent cannot access HR data.
- **Delivery**: non-engineers get a purpose-built chatbot with a clear domain description, not a general-purpose agent they do not know how to prompt.

## 5. The subagent portfolio pattern

Mature organizations do not run one subagent. They run a portfolio: finance, marketing, operations, product, each with its own scope, each drawing from the same context engine, each maintained by the engineer closest to that domain.

The portfolio pattern creates organizational leverage. The context engine accumulates institutional knowledge across all domains—a validated join path discovered by the finance subagent benefits the operations subagent if they share the same table. The feedback loop operates at the engine level: corrections in one subagent improve accuracy across all subagents that reference the same context. The engineer's role shifts from answering individual questions to maintaining the portfolio—reviewing feedback, curating metrics, expanding scope as domains evolve.

This is the scaling model that separates a data engineering agent from a SQL copilot. A copilot helps one person write one query. A subagent portfolio helps an organization turn data knowledge into a shared, governed, continuously improving asset.

## 6. Getting started with subagents

The fastest path from zero to a working subagent:

1. **Pick one domain** that generates the most repetitive data requests. Finance, marketing, or operations.
2. **Bootstrap context** from what already exists: historical SQL files, documented metric definitions, existing dbt models or semantic layers.
3. **Create the subagent** with a tight initial scope—start with 5 tables and 10 metrics, not 50 tables. Accuracy is usually easier to evaluate and improve with a narrow scope.
4. **Share it** with one trusted user in that domain. Collect their feedback. Refine the scope. Expand only after the subagent is handling common queries reliably.
5. **Add the next domain** when the first subagent is mature.

The pattern compounds: each subagent makes the context engine stronger, which makes the next subagent easier to create. The tenth subagent takes a fraction of the time the first one took.

Try <a href="https://studio.datus.ai/overview" rel="nofollow noopener">Datus Studio</a> to see the subagent lifecycle in action—connect a warehouse, create a scoped subagent, and share it with a teammate. Or follow the [15-minute tutorial](/posts/build-your-first-data-engineering-agent) to build one from the CLI.

## Frequently asked questions

### How is a subagent different from a ChatGPT custom GPT?

A custom GPT is a prompt with instructions for a general-purpose LLM. It has no persistent data context, no connection to your warehouse, and no feedback loop that improves accuracy over time. A subagent is a scoped interface to a context engine that has accumulated validated SQL, business rules, and usage patterns from your actual warehouse. Custom GPTs help with general tasks; subagents deliver grounded, domain-specific answers backed by your team's institutional knowledge.

### How many subagents should a team have?

Start with one. Add a second when the first is handling common queries reliably. Most mid-size organizations stabilize at 5-10 subagents covering the core business domains (finance, marketing, operations, product, sales). The limit is not technical—it is maintenance. Each subagent requires periodic review of feedback, scope updates, and metric curation. A single engineer can maintain 5-10 subagents as part of their normal workflow.

### Can subagents from different domains share context?

Yes—that is the point of the shared context engine. A validated join path between `customers` and `orders`, discovered and upvoted by the finance subagent's users, becomes available to the marketing subagent the next time it generates a query involving those tables. The context engine is the shared source of truth. Subagents are scoped views into it. The feedback loop operates at the engine level, so corrections in one domain improve accuracy across all domains that share the same underlying tables and metrics.

### What if a user asks a subagent a question outside its domain?

A well-scoped subagent should recognize out-of-scope questions and respond with its domain description rather than attempting to answer. "I am scoped to marketing analytics—campaign performance, channel attribution, and marketing spend. For questions about revenue forecasting, please use the Finance subagent." This is better than a wrong answer and better than silence—it redirects the user to the right tool.

## Related articles

- [What is a data engineering agent?](/posts/what-is-data-engineering-agent-2026) — the category definition
- [Contextual data engineering](/posts/contextual-data-engineering) — the context model that powers subagents
- [One-person data team](/posts/one-person-data-team) — how subagents scale a solo engineer's output
