---
title: "Building an AI Context Layer from SQL, Docs and Data Models"
description: "Build an AI context layer from SQL, docs and data models. Follow a revenue example to compare sources, resolve definitions and verify reusable metric results."
author: "Evan Paul"
date: "2026-11-26"
lastmod: "2026-11-26"
heroImage: "/images/build-ai-context-layer/cover.jpg"
heroImageAlt: "An analyst reviews SQL, policy documents and a data model as sources of shared business context"
head:
  - - meta
    - name: keywords
      content: "AI context layer, build a context layer, context layer for AI, business context, SQL knowledge extraction, semantic models"
  - - link
    - rel: canonical
      href: https://datus.ai/blog/build-ai-context-layer/
---

# Building an AI Context Layer from SQL, Docs and Data Models

## TL;DR

Building an AI context layer means connecting source evidence, business meaning and executable definitions. Start with one question, compare what SQL, documents and existing models actually say, resolve differences with the responsible owner, and verify the chosen calculation before other agents and tools reuse it.

## Three sources can describe three different kinds of revenue

A business user asks an agent for net sales. The finance document says to deduct refunds. A familiar dashboard query counts completed orders but does not subtract refunds. An existing semantic model exposes a metric called `revenue`, which includes all order amounts regardless of status. The agent can retrieve all three and still have no defensible reason to choose one.

<figure><picture><source media="(max-width: 600px)" srcset="/images/build-ai-context-layer/use-case-mobile.svg"><img src="/images/build-ai-context-layer/use-case.svg" alt="A user asks for net sales, but a finance policy yields 230 dollars, legacy dashboard SQL yields 250 dollars, and an existing model yields 450 dollars because their scopes differ" loading="lazy" decoding="async"></picture><figcaption>One question, three scopes. These fictional values use the same sample records; the intended definition must be clarified before an answer is chosen.</figcaption></figure>

This is a useful starting point for building an AI context layer. The task is not simply to put more text into a prompt. It is to establish what each source means, where it applies, which definition answers the current question and how that definition becomes something the next consumer can use.

The example below uses fictional order records and source artifacts. The sources are deliberately inconsistent in naming, and the reviewed policy is an illustrative choice for the exercise, not a real Finance approval. The resulting calculations were executed through DOSI; the document reading and review narrative is an implementation example, not a captured autonomous agent session.

## What the context layer should leave behind

**An AI context layer makes the knowledge behind an analytical answer available for reuse: relevant source evidence, explicit business definitions, applicable scope and an execution path for supported calculations. It should help a consumer identify the appropriate meaning and inspect the result, rather than treat every retrieved document as equally authoritative.**

For one revenue question, a useful outcome is modest. Keep the original query and policy, record what they disagree about, name the intended metric, preserve the source mapping and save checks that distinguish it from the alternatives. A model definition without that context can be misused; a context note without an executable calculation still leaves each tool to implement its own interpretation.

This does not require moving every kind of knowledge into one file. A reference query, a short business rule and a semantic metric serve different jobs. Keeping their relationships clear is more useful than flattening them into a long narrative that an agent must reinterpret on every request.

That distinction also appears in <a href="https://martinfowler.com/articles/making-data-ready-for-agentic-ai.html" rel="nofollow noopener">Pramod Sadalage and Prem Chandrasekaran's discussion of AI-ready data</a>, which separates business context from the quality and access layers around it. Context can inform an answer; it does not replace checks on the data or the controls governing execution.

## Use SQL, documents and models for different kinds of evidence

Each source contributes evidence, not a universal priority ranking. SQL shows a calculation that someone used. Documents explain intended meaning, ownership and exceptions. Models show the structured definitions that a runtime can currently serve. A conflict between them can reveal an error, a scope difference or simply an ambiguous name.

| Source | What it contributes | What it cannot establish alone |
| --- | --- | --- |
| Existing SQL | Tables, joins, filters and aggregation used for a particular question | That the same calculation is the approved definition for every future request |
| Business documents | Terminology, intended scope, exceptions and policy rationale | That a running model implements those words correctly |
| Data models | Source mappings, relationships and executable metric definitions | That a familiar metric name matches the user's intended meaning |

A widely used report query can still be specific to a region or period. A new policy document can still be a draft. A validated model can still implement an older business rule. Popularity, recency and successful execution are useful signals, but none substitutes for confirming applicability with the responsible person.

The same principle applies when the sources agree. A document and a dashboard may both say “revenue” while depending on different timestamps. Agreement in vocabulary does not prove agreement in execution. The investigation should reach the fields, record population and date convention behind the name.

<figure><picture><source media="(max-width: 600px)" srcset="/images/build-ai-context-layer/source-map-mobile.svg"><img src="/images/build-ai-context-layer/source-map.svg" alt="SQL contributes observed logic, a policy document contributes intended meaning, and an existing model contributes executable definitions; source comparison and human review lead to reusable context and a checked metric" loading="lazy" decoding="async"></picture><figcaption>Sources contribute different evidence. Review determines applicability; the semantic runtime executes a supported definition. This is an implementation pattern, not a claim of automatic policy approval.</figcaption></figure>

## Read the three source artifacts before choosing a formula

For the fictional retailer, the business document defines operational net sales as completed-order amounts less recorded refunds, in USD. Refunds are attributed back to the order's completion date. It is not a statement about accounting revenue recognition or a report organized by refund-posting date.

The legacy dashboard has a narrower technical definition. Its query filters to completed orders and sums their amounts. That can be a useful completed-sales measure, but the file does not support the claim that refunds were deducted. The context record should preserve the query's actual scope rather than improve its name by assumption.

```sql
-- Fictional legacy report: completed sales, before refunds.
SELECT SUM(amount_usd) AS revenue
FROM orders
WHERE status = 'completed';
```

The existing model supplies a third interpretation. Its metric called `revenue` sums all order amounts, including cancelled orders. For a gross order-value question that may be intentional. For the operational net-sales question in the policy document, it is not the same quantity.

The source inventory should retain these differences. Record the artifact location, the definition it appears to implement, relevant dates and scope, and any owner or approval information actually available. Unknown ownership should remain unknown. Do not manufacture an approval date because a file happens to have a modification timestamp.

For this walkthrough, those observations live in a small review record beside the source files. It is a suggested way to keep the evidence inspectable, not a built-in Datus configuration schema or a guarantee of automatic source lineage. A production team can use its existing review system as long as the evidence and decisions remain traceable.

## Resolve the meaning, not just the disagreement in numbers

The first decision is which business question the new definition must answer. In this example, assume the responsible reviewer chooses the policy document's operational net-sales scope. That choice gives the proposed metric a contract: completed orders only, explicit refund amounts, USD, and completion-date attribution.

The other definitions do not have to disappear. Keep the legacy calculation under an accurate completed-sales name, and identify the existing model's calculation as gross order value. Distinct names make the differences easier for another analyst or agent to recognize. Silently changing the meaning of `revenue` could break consumers that relied on the older definition.

This review is not a vote among sources. Three copied queries can repeat the same old assumption, while one policy document describes a later decision. Conversely, a document can describe a desired future rule that has never been approved or implemented. The reviewer needs to establish which source is applicable, not count how often a phrase appears.

The same care applies to effective dates. If a revised definition starts next quarter, the context must distinguish today's operational calculation from the future one. Replaying a historical report with a new definition may be useful, but it is a separate request. A system should not substitute one for the other without making that choice visible.

A conflict can also remain unresolved. If no owner can confirm refund treatment, retain the competing candidates and ask for clarification. Returning “I found two definitions; which applies?” is more useful than generating a polished number under an undocumented assumption. The source disagreement is itself information the team needs.

## How Datus helps organize and reuse that knowledge

Datus provides mechanisms for working with these source types, while the business decision remains explicit. The useful sequence is to preserve the existing logic, extract the reusable facts, propose a model change and check its behavior. These are connected activities, rather than one automatic promotion from document text to approved metric.

### Preserve the query and its purpose

Datus's <a href="https://docs.datus.ai/dev/subagent/gen_sql_summary/" rel="nofollow noopener">SQL Summary workflow</a> captures a query with descriptive context so it can be found and reused. In this example, the summary should say that the legacy report includes completed orders before refunds. Calling it “approved net sales” would add authority and scope the source never established.

That distinction matters during retrieval. A later agent looking for a starting query should find both the useful join or filter pattern and its boundary. The reference is evidence of how a question was answered, not a direction to copy every filter into a shared metric. The existing [SQL-to-business-metrics walkthrough](/blog/sql-to-business-metrics/) focuses on that calculation-reuse path.

### Keep facts separate from the material they came from

The <a href="https://github.com/Datus-ai/Datus-agent/blob/main/datus/resources/skills/extract-knowledge/SKILL.md" rel="nofollow noopener">extract-knowledge implementation</a> derives concise reusable facts from question-and-SQL evidence and checks for duplicates or conflicting facts before persistence. That is a specific extraction workflow, not a general guarantee that every uploaded document becomes a correct business definition.

A useful fact for the reviewed example is that operational net sales deducts refunds from completed-order amounts and attributes them to completion date. The corresponding policy document should stay available for inspection. A short reusable fact helps an agent recall the rule; the source explains its rationale and limits.

Datus also organizes different persistent artifacts rather than treating semantic models, reference SQL and knowledge notes as interchangeable. In the example, the policy explanation remains descriptive context, the old report remains reference logic and the chosen metric becomes a structured calculation. This classification is part of maintaining the context, not just assembling a larger prompt.

### Propose a model change that a person can inspect

The <a href="https://docs.datus.ai/dev/subagent/semantic_modeling/" rel="nofollow noopener">semantic-modeling workflow</a> supports working from source evidence toward a definition and checking supported outputs. For the case here, the proposed metric is `net_sales`, with an expression that explicitly includes completed orders and subtracts recorded refunds.

The person reviewing the proposal should see both the calculation and why it was selected. A green structural check says that supported references and compilation work; it does not establish that the business owner chose the right policy. Keep those decisions separate even when they are presented in the same workspace.

Datus Studio also exposes reviewable semantic-model changes through its Semantic Hub workflows. Those file and revision checks should not be confused with an automatic determination that one business document outranks another. Approval of meaning still needs the relevant owner and the organization's process, rather than an inference from which source looked most formal.

## Test a case that distinguishes the definitions

A useful verification case produces different results for the competing interpretations. The fictional fixture contains completed orders of 120, 80 and 50 USD, with a 20 USD refund on the first. A cancelled order of 200 USD is also present. Every refund amount is explicit; the example does not infer that missing values mean zero.

The three definitions give different, reproducible answers:

| Interpretation | What counts | Result in this fixture |
| --- | --- | ---: |
| Existing model's revenue | All order amounts | $450 |
| Legacy completed sales | Completed-order amounts, before refunds | $250 |
| Reviewed operational net sales | Completed-order amounts, less refunds | $230 |

If no order had a refund, completed sales and net sales would agree even though the formulas differ. Include records that exercise the disputed rule. A matching total on an uninformative sample is weaker evidence than a comparison that would fail when the rule is omitted.

DOSI executed the named comparison metrics and the separate reviewed model against the same local records. The agreement with the chosen policy is evidence about this fixture and these requests. It does not prove that a language model extracted the rule correctly or that the document-reading narrative ran without human involvement.

<figure><picture><source media="(max-width: 600px)" srcset="/images/build-ai-context-layer/review-flow-mobile.svg"><img src="/images/build-ai-context-layer/review-flow.svg" alt="Three revenue interpretations produce 450, 250 and 230 in a fictional dataset; an explicit policy decision selects net sales, followed by model checks and numerical verification before reuse" loading="lazy" decoding="async"></picture><figcaption>Differences make the check informative. The $230 result matches the policy selected for this exercise; the lower value alone is not a reason to call it the correct business answer.</figcaption></figure>

The downloadable verifier checks the totals, the East/West breakdown and equality between the diagnostic model's `net_sales` metric and the separate reviewed definition. It also checks that the fixture has explicit refund values before running the calculations. The historical query is kept as a source artifact; the comparison values are obtained through DOSI rather than silently substituting a rewritten report.

A production test should include cases that challenge the scope: a missing refund, a cancelled order, an order with several refund events and a period boundary. If refunds are separate events, the model needs appropriate aggregation before a join; this small fixture deliberately uses order-level refund totals. Its simple shape should not be mistaken for a universal model of returns and revenue.

## Reuse the reviewed definition without losing the source boundaries

The next agent or report should receive more than a formula. It needs the metric's intended question, relevant scope, source mapping and a way to inspect the evidence. In this example, “operational net sales in USD” is a clearer choice than a generic `revenue` label whose meaning depends on which artifact was retrieved first.

Descriptive context helps select that metric and explain its assumptions. The semantic execution path supplies the calculation. A dashboard and an agent may present the output differently, but each consumer still needs to use the supported definition under the appropriate dates and identity. A shared knowledge note does not ensure that both actually call the same model.

Changes require the same discipline. If the owner later chooses refund-posting date, record a new scope or version, identify the affected consumers and update the checks. Keep the earlier definition available where historical reporting requires it. Remembering a correction is different from establishing which definition a particular answer should use.

For a broader look at what should remain inspectable across agents and tools, see [Data Context Layer: Five Checks Before You Buy](/blog/data-context-layer-evaluation/). For objects and relationship roles, the [retail data ontology example](/blog/data-ontology-example/) shows the related mapping problem. Those complement the source-reconciliation process rather than replace it.

## Start with one metric and a visible evidence trail

Datus's approach is to make business context reusable around data work, with DOSI providing the supported semantic execution path. Start with the existing SQL, documents and models your team already uses, make the differences visible, and produce a definition whose scope and behavior someone can review.

The [Datus semantic layer solution](/solutions/semantic-layer/) explains that overall approach. Datus Agent is open source; DOSI uses Elastic License 2.0, and Apache Ossie is the open standard. Runtime compatibility, access enforcement and the correctness of business decisions remain separate checks.

## Download the worked example

The [source-and-verification package](/examples/build-ai-context-layer/context-layer-example.zip) contains the fictional policy, legacy query, existing model, review record, revised model, CSV data and a verifier. Open the [review record](/examples/build-ai-context-layer/review-decision.json) or [executed results](/examples/build-ai-context-layer/verification.json) to inspect what was assumed and what was actually tested.

The local calculations were checked with DOSI CLI 0.2.2 and a freshly created DuckDB fixture. The package does not implement a document-ingestion service, run an LLM extraction session or provide a production approval system. It demonstrates the concrete artifacts and numerical checks that those surrounding workflows need to preserve.

## Conclusion

Building an AI context layer starts by connecting meaning to evidence, not by declaring every existing artifact trustworthy. SQL, documents and models contribute different parts of the answer. The important decisions are which definition applies, how it becomes executable and what proves the next consumer is using it as intended.

A useful first result is one metric with an inspectable source trail, an explicit scope and checks that distinguish it from plausible alternatives. Expand that pattern after it works. The goal is reusable business knowledge that remains understandable when a new agent, report or analyst asks the next question.

## Frequently asked questions

### What is an AI context layer for data analysis?

It is the reusable business knowledge and source context that helps an agent choose and use the appropriate data definitions. It can include descriptions, reference queries, semantic models and scope information, together with access to a supported execution path.

### Should SQL or business documents take precedence?

Neither should always win. SQL shows implemented logic, while documents may explain intended policy. Confirm the relevant owner, scope and effective meaning, then check whether the executable definition implements that decision.

### Can Datus turn existing SQL into reusable context?

Datus provides SQL-summary, knowledge-extraction and semantic-modeling workflows. Their outputs still need appropriate review: storing a query or extracting a fact does not by itself approve its business meaning for every use.

### Is a searchable document collection enough?

It can help retrieve evidence, but retrieval alone does not decide between conflicting definitions or execute a governed metric. A useful analytical workflow connects relevant context to the selected calculation and verifies its output.

### Does the worked example automatically resolve conflicts?

No. The policy choice and review record are illustrative inputs created for the exercise. The DOSI calculations and verification are executed evidence; they do not establish autonomous document understanding or a business approval workflow.

## Related articles

- [Semantic Layer Requirements](/blog/semantic-layer-requirements/) — definitions, mappings and independent checks in a real running-data case.
- [Validating Business Rules Before Reuse](/blog/validate-business-rules-ai-agents/) — deciding when a candidate rule is ready for a wider scope.
