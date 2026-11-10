---
title: "How Should AI Agents Validate Business Rules Before Reusing Them?"
description: "How should AI agents validate business rules before reuse? See how Datus builds a metric, checks reference SQL, and prepares findings for owner review."
author: "Evan Paul"
date: 2026-11-09
lastmod: 2026-11-10
heroImage: "/images/validate-business-rules-ai-agents/cover.svg"
heroImageAlt: "A Datus workflow moves from a reviewed metric through reference SQL comparison and investigation to an owner-approved rule."
head:
  - - meta
    - name: keywords
      content: "AI agent business rule validation, validate business rules for AI agents, agent-discovered rules, semantic layer governance, business rule approval, AI analytics feedback loop"
  - - meta
    - property: og:title
      content: "How Should AI Agents Validate Business Rules Before Reusing Them?"
  - - meta
    - property: og:description
      content: "How should AI agents validate business rules before reuse? See how Datus builds a metric, checks reference SQL, and prepares findings for owner review."
  - - meta
    - property: og:type
      content: article
  - - meta
    - property: og:url
      content: https://datus.ai/blog/validate-business-rules-ai-agents/
  - - meta
    - property: og:image
      content: https://datus.ai/images/validate-business-rules-ai-agents/cover.svg
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - link
    - rel: canonical
      href: https://datus.ai/blog/validate-business-rules-ai-agents/
---

# How Should AI Agents Validate Business Rules Before Reusing Them?

## TL;DR

An agent-discovered pattern is a candidate, not an approved business rule. Check what was measured, test the finding on separate data, and have an owner decide where it may be used. Datus can help teams carry out those checks and make approved definitions reusable.

## An agent found a pattern. Is it a business rule?

Imagine Northstar, a fictional retailer. An AI agent notices that customers whose first delivery was late appear less likely to buy again. Another agent could soon repeat that finding in a report—or act on it as if it were a company rule. But the first agent may have counted repeat purchases differently from the finance team, missed customers whose deliveries were never recorded, or found a pattern that only held during one sales period. What has to happen before the finding becomes knowledge that other agents can trust?

## What practitioners questioned about agent-discovered rules

This is the tension in a <a href="https://www.linkedin.com/feed/update/urn:li:activity:7523175743628075008/" rel="nofollow noopener">LinkedIn discussion</a> about agents discovering business knowledge. Datus co-founder Harrison Zhao described a feedback loop in which agents help identify candidate relationships around a north-star metric and useful findings become part of the context for later work. The responses asked what would keep an interesting historical pattern from being promoted too quickly: could it survive an independent check, who would sign off, and how would a team version or withdraw it?

Those questions reflect three different kinds of knowledge. A **metric definition** says how to calculate repeat purchase rate. An **observed pattern** says late deliveries coincided with a lower rate in some data. An **action rule** might tell an agent to offer a discount to affected customers. Confirming the metric does not confirm the pattern; confirming the pattern does not prove the discount will help. The more an agent can do with a rule, the stronger the evidence and authorization need to be.

## A practical way to validate a rule before reuse

**First, establish what the numbers mean.** Northstar needs an agreed definition of a first order, an eligible customer, a completed repeat order, and the follow-up window. Compare the calculation with a trusted query or another approved reference. If the two disagree, an agent has found a definition problem to resolve—not evidence for a new business rule.

**Next, test the finding on data the agent did not use to discover it.** Keep the cohort and delay threshold fixed, then check another period or population. Save all the segments and thresholds explored, not just the most striking result. A held-back dataset is often called a *holdout*. This matters because testing many slices makes chance patterns easier to find; Microsoft researchers describe this <a href="https://www.microsoft.com/en-us/research/publication/a-dirty-dozen-twelve-common-metric-interpretation-pitfalls-in-online-controlled-experiments/" rel="nofollow noopener">multiple-comparison pitfall</a>. If the proposed rule calls for an action, such as sending a discount, evaluate that action separately; an association alone does not show that the intervention works.

**Finally, approve a precise claim for a precise use.** A metric owner can approve a calculation, or approve a descriptive finding for analyst investigations, without authorizing automatic customer outreach. Record the owner, data period, scope, evidence, version, and a way to retire the rule. That is the general solution: **verify the calculation → reproduce the finding → approve its use**. The remainder of the article shows how to put those steps into practice with Datus.

## How Datus supports that process

Datus Agent can bring together a team's documents, SQL, and data to help build and investigate a metric. DOSI holds the resulting semantic definition so later questions use the same calculation. For Northstar, that means agreeing on repeat purchase rate, checking it against a trusted calculation, investigating the delivery pattern, and asking an owner what can be reused. **Northstar and the chat example are fictional.** Datus supports this process; it does not approve a newly discovered business rule on its own.

![A practical Northstar workflow in Datus, from model authoring through validation, exploration, and human review.](/images/validate-business-rules-ai-agents/rule-validation-path.svg)

[Open the workflow diagram at full size](/images/validate-business-rules-ai-agents/rule-validation-path.svg)

The flow separates three things: a metric definition, an observed pattern, and permission to act on that pattern. The [semantic layer and ontology guide](/blog/semantic-layer-vs-ontology/) explains where reusable definitions and business relationships fit.

### Start with a known calculation

Northstar's metric owner supplies a written definition and a trusted SQL query. Repeat purchase rate is the share of eligible first-order customers who place another completed order within the follow-up window. The owner decides how cancellations, returns, and customers without a complete follow-up window count. Those choices should come from the business, not from an agent's guess about column names.

Datus Agent can use that definition, the reference SQL, and the source schema to draft a semantic model. The owner reviews the result, including which customers enter the denominator and what qualifies as a second purchase. The [semantic model examples](/blog/semantic-model-examples/) article shows how these definitions can be inspected. For the illustration below, Northstar also defines eligible-customer and repeat-customer counts alongside the rate; an agent should not invent those counts from a rate alone.

### Check the metric against trusted results

Datus can check whether the model is valid and whether the saved metric runs. Northstar then compares its result with the owner's trusted SQL for the **same customers, period, and grouping**. A difference may reveal a missing cohort, a join that duplicates customers, or a date boundary that excludes the wrong orders. The team resolves the definition before using the metric to investigate a pattern.

A matching result gives the team a stronger baseline, but it does not prove that the reference SQL expresses the right business policy. The owner still has to confirm what “completed order” and “eligible customer” mean. If the comparison cannot be completed, the calculation remains unverified; a successful query alone is not enough. Datus's <a href="https://docs.datus.ai/0.4/subagent/semantic_modeling/" rel="nofollow noopener">semantic modeling workflow</a> supports these checks while leaving the policy decision with the team.

### Investigate the delivery pattern

With the calculation checked, an analyst asks Datus Agent how repeat purchase rate differs between customers whose first delivery was on time and those whose first delivery was late. <a href="https://docs.datus.ai/0.4/subagent/ask_metrics/" rel="nofollow noopener">AskMetrics</a> can answer from existing semantic metrics when the delivery grouping is also defined. If it is not, Datus can help explore the question with SQL, but that exploratory result should not quietly become a shared metric.

The simulated conversation shows what a reader could examine: the question, the metric used, each group's customer count, and the resulting rates. **The Northstar figures and interface content are illustrative, not product output or customer data.**

![Illustrative Datus Studio conversation: an analyst asks about Northstar's repeat purchase rate by first-delivery delay group; Datus Agent returns an example grouped result and flags the pattern as a candidate.](/images/validate-business-rules-ai-agents/studio-ask-metrics-demo.svg)

[Open the simulated conversation at full size](/images/validate-business-rules-ai-agents/studio-ask-metrics-demo.svg)

Suppose the sample shows 32% for on-time deliveries and 22% for late deliveries. That is a candidate finding, not a causal explanation. Northstar tests the **same cohort and late-delivery definition** on another period, retaining the group counts and the full search history. Changing the threshold after seeing the result would create a new candidate rather than confirm the old one. Datus helps produce the analysis; the team decides whether the evidence is strong enough to share.

### Decide what other agents may reuse

The owner makes a decision about a specific claim. Northstar might approve the repeat purchase calculation for general use, but allow the late-delivery finding only in analyst investigations, labeled as historically observed. That does **not** authorize an agent to send discounts. Whether a discount improves repeat purchase is a separate question that needs an intervention test and its own approval.

Keep candidate definitions in a review context until they are accepted. Datus makes a saved metric available to agents within its project, but it does **not** automatically promote a discovered rule into an approved company policy. Once the owner accepts a definition, the team can share it with its intended users and retain the evidence, scope, and version. If source data or the definition changes, the comparison and the finding need another review.

The related [row-level security guide](/blog/row-level-security-ai-analytics/) covers a separate boundary: which records an agent may read. A validated rule does not override a user's data permissions.

[Data lineage for AI analytics](/blog/data-lineage-ai-analytics/) explains how to follow an answer back to its metric definition and source dependencies, alongside the context of the query that produced it.

## Conclusion

An agent can discover a candidate rule, but reuse has to be earned. Northstar first agrees on the repeat-purchase calculation, checks the delivery pattern on separate data, and asks an owner to approve a limited use. Datus makes the calculation and investigation more repeatable through semantic models, reference comparisons, and inspectable queries. The team remains responsible for the decision that turns a finding into shared business context.

## Frequently asked questions

### When can another AI agent reuse a discovered business rule?

Only after the calculation and supporting evidence have been checked and an owner has approved the rule's intended use and scope. A metric definition, a descriptive finding, and an instruction to take action require different levels of review. Keep the approved version and its limits visible to every agent that may use it.

### What should I give Datus before it builds a metric?

Provide the datasource, relevant tables, a plain-language definition, and the trusted SQL or source document. Specify cohort rules, filters, time window, and expected grouping. Review the generated Apache Ossie model before other agents use it.

### Does a passed Datus comparison prove the business rule is correct?

No. It shows that the metric matched the supplied reference query for the checked results. The owner must confirm that the reference expresses the right policy. A discovered pattern also needs a separate holdout or other evidence before it is reused as a claim.

### Can AskMetrics discover and approve new rules?

AskMetrics answers from existing semantic metrics. Datus can also help investigate questions beyond those definitions, but the results remain exploratory until a person reviews the evidence and approves a specific use. AskMetrics does not promote findings automatically.

### When is a historical backtest insufficient?

When the rule proposes an action, such as sending a discount or changing inventory policy. A historical association can prioritize what to test, but it does not establish the effect of the action. Use an experiment or an appropriate causal evaluation and have the responsible owner approve the use.

## Related articles

- [Row-Level Security for AI Analytics](/blog/row-level-security-ai-analytics/)
- [What Is Agentic Analytics?](/blog/what-is-agentic-analytics/)
- [Semantic Model Examples](/blog/semantic-model-examples/)
- [Semantic Layer vs Ontology: Why AI Agents Need Both](/blog/semantic-layer-vs-ontology/)
