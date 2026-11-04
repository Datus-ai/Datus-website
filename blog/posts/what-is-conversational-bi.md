---
title: "What Is Conversational BI? From Questions to Trusted Metrics"
description: "Learn how conversational BI answers business questions, check a multi-turn example, and evaluate how metrics, filters, and context stay consistent across turns."
author: "Evan Paul"
date: 2026-10-12
lastmod: 2026-11-04
head:
  - - meta
    - name: keywords
      content: "conversational BI, conversational business intelligence, natural language BI, conversational analytics, chat with data, conversational BI semantic layer"
  - - meta
    - property: og:title
      content: "What Is Conversational BI? From Questions to Trusted Metrics"
  - - meta
    - property: og:description
      content: "Learn how conversational BI answers business questions, check a multi-turn example, and evaluate how metrics, filters, and context stay consistent across turns."
  - - meta
    - property: og:type
      content: article
  - - meta
    - property: og:url
      content: https://datus.ai/blog/what-is-conversational-bi/
  - - meta
    - property: og:image
      content: https://datus.ai/logo_dark.svg
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - link
    - rel: canonical
      href: https://datus.ai/blog/what-is-conversational-bi/
---

# What Is Conversational BI? From Questions to Trusted Metrics

## TL;DR

- Conversational BI lets you explore business data through questions and follow-ups.
- Reliable answers need shared definitions, clear context, and appropriate access.
- Test a complete conversation: refine a filter, compare periods, and explicitly reset the scope. Check the result at every turn.
- Shared definitions support consistency; the application still manages the conversation and user access.

**Conversational BI is a way to explore business data through natural-language questions and follow-ups.** Instead of building a new report for each question, you ask, review the answer, and keep exploring. A useful system remembers the relevant context and shows enough detail for you to understand what the numbers mean.

Here, **conversational analytics means dialogue with business data**, not analysis of customer calls or support transcripts. The same phrase can describe both markets, so check which task a tool actually serves.

“What was revenue last quarter?” is a starting point. “Only Europe” and “Which channels changed most?” turn that answer into a conversation. The value is being able to follow a question where it leads, without losing the meaning of the original analysis.

## What conversational BI makes easier

Dashboards answer questions someone has already planned for. Conversational BI helps with the next question: the unexpected dip, the unfamiliar segment, or the comparison that needs a different filter.

A sales manager might start with a quarterly total, compare regions, and then look at a particular customer group. An analyst can use the same interaction to explore a result before deciding which report to build. Answers may appear as numbers, tables, charts, or short explanations.

Natural language makes asking easier. It does not automatically make the answer trustworthy. The system still needs to know whether “revenue” includes refunds, which dates to use, and which information the person asking may see.

This connection between conversation and business definitions is not new. An <a href="https://research.ibm.com/publications/conversational-bi-an-ontology-driven-conversation-system-for-business-intelligence-applications" rel="nofollow noopener">IBM research paper on conversational BI</a> describes building dialogue around an underlying business model. Today's language models make the interaction more flexible, but the need for shared meaning remains.

As of November 2026, <a href="https://docs.cloud.google.com/looker/docs/conversational-analytics-looker-data" rel="nofollow noopener">Looker’s documentation</a> describes follow-up questions that refine earlier results within the active conversation, including clarification when a field is ambiguous. This is a useful capability to evaluate if your business definitions already live in Looker. It does not imply that context persists across separate conversations or that other products behave identically.

## How it differs from dashboards and agentic analytics

The distinction is about how you work with the data and who chooses the next step.

| Approach | What it does | Who guides the analysis? |
| --- | --- | --- |
| Dashboard | Shows a prepared view of business performance | The report designer and viewer |
| Text-to-SQL | Turns a question into a database query | The person asking the question |
| Conversational BI | Lets you explore through questions and follow-ups | Usually the user |
| Agentic analytics | Plans and carries out steps toward an analytical goal | The agent, within agreed limits |

With conversational BI, you might say, “Show last quarter, then filter to Europe.” With [agentic analytics](/blog/what-is-agentic-analytics/), you might ask, “Investigate why revenue fell,” and let the agent decide which regions or channels to examine.

These approaches can work together. A dashboard gives you the starting view; conversation helps you explore it; an agent can investigate a larger question. All three benefit from using the same business definitions.

## What a useful conversation looks like

A useful conversation changes the requested scope while preserving the business rules that still apply. Use this small illustrative reference case to check that behavior. These are invented, already-aggregated net-revenue values in USD, not customer results or a product benchmark. Net revenue excludes refunds, periods are complete calendar quarters in 2026, and region means customer region.

| Quarter | Customer region | Organic channel | Paid channel |
| --- | --- | ---: | ---: |
| Q2 | Europe | 300 | 200 |
| Q2 | North America | 250 | 250 |
| Q3 | Europe | 360 | 240 |
| Q3 | North America | 280 | 320 |

For this reference case, Europe and North America are the entire dataset; “global” means both regions. An analyst can calculate each expected answer directly from the table before trying a conversational tool. That independent reference helps reveal a filter or definition change even when the response sounds convincing.

You begin with **“What was net revenue in Q3 2026?”** The expected answer is 1,200 USD across both regions and channels. If you had asked for “last quarter,” the response would first need to resolve that phrase to dates. Here, Q3 means July 1 through September 30, rather than a rolling three-month window.

Next, ask **“Only Europe.”** The total becomes 600 USD, while the metric, currency, and quarter stay the same. The system should use customer region, as agreed above. If its model also contains shipping region, a clarification is appropriate when it cannot determine which one you mean.

Then ask **“Break that down by acquisition channel.”** Europe and Q3 should remain selected. Organic returns 360 USD and paid returns 240 USD; the two values reconcile to the 600 USD total. This is a simple check of whether the follow-up changed the breakdown without silently clearing the region filter.

Finally, **“Compare it with Q2 2026”** adds a period. Europe rises from 500 to 600 USD: organic changes from 300 to 360, and paid from 200 to 240. Those movements describe the difference; they do not explain what caused it. Keep the same metric and regional definition in both periods.

| Follow-up | Expected scope | Expected result |
| --- | --- | --- |
| “Only Europe” | Net revenue, Q3, customer region Europe | 600 USD |
| “By acquisition channel” | Same scope, split by channel | Organic 360; paid 240 USD |
| “Compare it with Q2 2026” | Europe, both quarters, same channels | Q2 500 → Q3 600 USD |
| “Now show the global Q3 total, all channels” | Q3 only, both regions, no channel breakdown | 1,200 USD |

The last request deliberately resets the region, comparison period, and breakdown. Keeping Europe selected would return 600 USD and fail the test, even though earlier turns were correct. If a shorter request such as “global total” leaves the intended period unclear, the application should clarify or state its interpretation. Remembering context includes knowing which parts the user has replaced.

## Why convincing answers can still be wrong

A fluent explanation and an attractive chart are useful, but neither proves that the analysis is correct. Three problems deserve particular attention.

### The meaning changes mid-conversation

The first answer uses net revenue; the next uses gross sales. Or a regional filter disappears when you ask for a channel breakdown. Each answer may look plausible on its own, while the conversation no longer answers your question.

A [semantic layer](/blog/what-is-semantic-layer/) helps by recording shared definitions of metrics, dimensions, and relationships. The conversational application still has to select the right definition and carry your choices into the next question.

### The calculation counts the wrong thing

Suppose one order has several refund records. Combining those records carelessly can count the same order more than once. Similarly, adding customer counts from different channels may overstate the total if customers appear in more than one channel.

These are business calculation problems, even when the database accepts the query. The [text-to-SQL accuracy problem](/blog/why-text-to-sql-fails-without-a-semantic-layer/) is therefore about more than producing valid SQL: the result must measure what the user actually asked for.

### The explanation says more than the data supports

A channel contributing to a revenue decline does not prove what caused it. Weaker demand, missing data, or a reporting change might produce a similar pattern.

A useful answer separates what the data shows from what still needs investigation. It also says when the source is outdated, a list is incomplete, or access restrictions limit the result. Those details help you decide whether the answer is ready to act on.

## What a trustworthy answer should show

You should not need to read SQL to understand a business answer. A response should name the metric, dates, and important filters, then explain any limits that affect interpretation.

For the retail example, “Q3 2026 net revenue in USD, grouped by acquisition channel, filtered to customer region Europe” is much more useful than an unexplained total. Include the resolved dates, a link to the agreed metric, and when the data was last refreshed. A full quarter on the calendar does not prove that every source has finished loading.

This matters when someone copies a chart into a presentation. The context should travel with the result, so another person can see what was measured. If a correction changes the number, the system should explain whether the change came from a new filter, updated data, or a different interpretation.

## Dosi's approach: shared definitions across tools

As of November 2026, DOSI provides semantic execution that a conversational application can use underneath its interface. Teams define metrics and relationships in compatible Apache Ossie models, and DOSI validates those models and compiles supported metric requests into native SQL for the selected source. Its <a href="https://dosi.datus.ai/">official documentation</a> describes the available interfaces and supported connections; check the target engine and feature rather than relying on a headline database count.

For a business team, the important consequence is reuse: the revenue definition can belong to a shared model rather than being buried inside one dashboard or chat interface. Different applications can work from that model. The conversational application remains responsible for understanding follow-ups, asking clarifying questions, and handling the user's access.

![Different applications call Dosi, which uses shared Apache Ossie definitions to query a selected supported database, warehouse, or lakehouse engine.](/images/what-is-conversational-bi/dosi-shared-definitions.svg)

*One shared model can serve different interfaces and supported sources. Each request targets a selected source; the applications manage conversation and user access.*

DOSI’s <a href="https://dosi.datus.ai/agents/">agent tools</a> support discovering metrics, previewing compiled SQL, and executing supported metric queries. They do not establish that a business definition is correct or keep the Europe filter for the application. The [semantic layer in the agent loop](/blog/semantic-layer-in-the-agent-loop/) explains how those tools fit into deeper exploration.

Dosi's distinction is its vendor-neutral approach, built on the open Apache Ossie standard and compatible with open-source agent workflows. It supports multiple data sources without requiring teams to keep their definitions inside one vendor's existing stack. That does not promise automatic joins across separate warehouses; the data mappings and definitions still need to be checked.

Dosi itself is source-available under Elastic License 2.0, while the Datus agent is open-source. Keeping that distinction clear helps teams evaluate the engine, the agent, and the interface on their own terms.

## How to evaluate conversational BI

Start with questions your team already asks and answers an analyst can verify. Test a whole conversation, including follow-ups and corrections, rather than judging a single impressive demo.

Use the reference conversation above as a small acceptance test, then replace its fixture with questions and definitions from your own business. Check each turn rather than scoring only the final answer.

| Test | What should happen |
| --- | --- |
| Add “Only Europe” | Apply customer region; preserve the metric and dates |
| Ask for a channel breakdown | Preserve Europe; channel values reconcile to the total |
| Add Q2 for comparison | Apply the same definition in both periods |
| Explicitly request the global Q3 total | Remove the region filter and Q2 comparison |
| Use an ambiguous region name | Clarify the field or show the interpretation |
| Ask with a restricted identity | Enforce access; explain any limited scope |
| Share or export the answer | Retain metric, dates, filters, units, and freshness information |

Permission checks should come from the configured data platform and tools, not from a promise in the chat. If a user can see only Europe, the application must not reveal North America when asked for a global total. It should make that limitation clear instead of presenting a partial result as company-wide performance.

Also test a question the selected sources cannot answer. A helpful response identifies the missing definition or data and suggests a next step; it does not fill the gap with an unsupported number. If your team mainly needs a stable recurring report, a maintained dashboard may already be the simpler choice.

Begin with one business area and an owner for its metric definitions. Expand when the conversations are reliable, rather than assuming that connecting more tables will automatically produce better answers.

## Conclusion

Conversational BI makes it easier to follow a business question beyond a prepared report. Its value depends on keeping definitions consistent, carrying the right context forward, and making answers easy to check. DOSI supports that foundation with shared definitions; the conversation still needs its own context handling and access controls. For a concrete next step, inspect the [working semantic-model example](/blog/semantic-model-examples/) and compare its expected answers with the definitions your team uses.

## Frequently asked questions

### What is conversational business intelligence?

Conversational business intelligence lets people explore business data through natural-language questions and follow-ups. Answers can include numbers, tables, charts, and explanations. A useful system keeps relevant context so you can refine an analysis without rebuilding a report.

### Is conversational BI the same as text-to-SQL?

No. Text-to-SQL turns a question into a database query. Conversational BI also manages follow-ups, clarifies meaning, and presents the result. It may use text-to-SQL or a semantic engine to answer the question.

### Does conversational BI replace dashboards?

Usually they serve different needs. Dashboards work well for recurring reports, while conversation helps with questions beyond the prepared view. Both should use the same metric definitions so the numbers remain comparable.

### Does conversational BI require a semantic layer?

Not every implementation requires a separate semantic layer, but repeated business reporting needs maintained definitions somewhere. A semantic layer is one way to share those rules across tools. Curated queries or existing BI models can also supply definitions. The application still has to interpret follow-ups correctly, preserve the right filters, and use the configured access controls.

### Can conversational BI work across multiple data sources?

Yes, if the application supports those sources and their definitions are aligned. Supporting several sources does not necessarily mean joining them in one query. Check that dates, calculations, and data freshness are comparable before combining results.

### Is conversational BI the same as conversation analytics?

Check the intended task. Conversational BI explores business data through dialogue. Conversation analytics can mean analyzing recorded calls, chats, or support transcripts. Some vendors also use conversational analytics for BI, so the phrase alone is insufficient: compare the data being analyzed and the result the product is designed to produce.

## Related articles

- [What is agentic analytics?](/blog/what-is-agentic-analytics/) — when an agent chooses the next analytical step
- [What is a semantic layer?](/blog/what-is-semantic-layer/) — shared business definitions
- [Why text-to-SQL fails without a semantic layer](/blog/why-text-to-sql-fails-without-a-semantic-layer/) — why valid queries can give misleading answers
- [The semantic layer in the agent loop](/blog/semantic-layer-in-the-agent-loop/) — how Dosi supports deeper exploration
- [Semantic model examples](/blog/semantic-model-examples/) — inspect definitions alongside checked results
- [Datus glossary](/glossary/#conversational-bi) — the short definition and related concepts
