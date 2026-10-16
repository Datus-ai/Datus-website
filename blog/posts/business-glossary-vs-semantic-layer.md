---
title: "Business Glossary vs Semantic Layer: From Terms to SQL"
description: "Business glossary vs semantic layer: see how approved terms become tested metrics. Follow one active-customer example from wording to SQL and agent answers."
author: "Evan Paul"
date: 2026-10-16
lastmod: 2026-10-16
head:
  - - meta
    - name: keywords
      content: "business glossary vs semantic layer, business glossary, semantic layer, business glossary and semantic model, metric definition, glossary to SQL"
  - - meta
    - property: og:title
      content: "Business Glossary vs Semantic Layer: From Terms to SQL"
  - - meta
    - property: og:description
      content: "Business glossary vs semantic layer: see how approved terms become tested metrics. Follow one active-customer example from wording to SQL and agent answers."
  - - meta
    - property: og:type
      content: article
  - - meta
    - property: og:url
      content: https://datus.ai/blog/business-glossary-vs-semantic-layer/
  - - meta
    - property: og:image
      content: https://datus.ai/images/business-glossary-vs-semantic-layer/cover.svg
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - link
    - rel: canonical
      href: https://datus.ai/blog/business-glossary-vs-semantic-layer/
---

# Business Glossary vs Semantic Layer: From Terms to SQL

## TL;DR

- A **business glossary** records what a term means, who approved it, and when to use it. A **semantic layer** binds that meaning to data, calculation rules, relationships, and a query interface. You need the glossary to settle intent and the layer when multiple consumers must compute the same answer.
- The handoff is a testable contract: term → source fields → metric logic → expected result. Neither a polished definition nor valid SQL proves the contract is correct on its own.
- An AI agent can use the shared metric instead of guessing from column names, but a metric still needs a human owner and checks against source data.

**A business glossary and a semantic layer solve different parts of the same problem.** The glossary gives people an approved meaning for a term such as “active paying customer.” The semantic layer connects that meaning to specific tables, filters, time rules, and joins so a dashboard or agent can calculate it. The useful question is not which one replaces the other. It is whether the calculation still matches the approved definition.

![An approved business term passes through a governed metric definition before dashboards and agents receive the same answer.](/images/business-glossary-vs-semantic-layer/cover.svg)

*The glossary is the decision about meaning; the model is the executable contract for a particular analytical use.*

## 1. What each layer owns

A **business glossary** is a maintained set of business terms and definitions. A term can have an owner, synonyms, exclusions, approval status, and links to related terms or data assets. It helps Finance, Product, and Data agree on what they are discussing before anybody writes a query. You can see a short [business glossary definition](/glossary/#business-glossary) in the site's glossary. A <a href="https://www.collibra.com/blog/what-is-a-business-glossary" rel="nofollow noopener">business glossary guide from Collibra</a> describes that role as a common language and distinguishes it from a data dictionary, which describes physical elements. Glossary tooling varies: some products also attach policies, lineage, and technical mappings. The boundary here is about the job the artifact performs, not a claim that every vendor ships the same feature set.

A [semantic layer](/blog/what-is-semantic-layer/) takes the approved meaning closer to execution. It names the datasets, fields, relationships, dimensions, and metrics that a query can use. A glossary entry for “active paying customer” might say that a paying account counts if it placed a completed order in the selected 30-day period. A semantic model has to say which table records accounts, which table records orders, what `completed` means in the source, which timestamp defines the period, and how to count a customer only once. Without those choices, the entry is understandable to a person but still ambiguous to a query engine.

| Question | Business glossary | Semantic layer |
| --- | --- | --- |
| Primary job | Agree on business meaning | Make an analytical meaning queryable |
| Typical reader | Business owner, steward, analyst | Analyst, BI tool, application, or agent |
| Key artifact | Term, definition, owner, approval, usage notes | Dataset, field, relationship, metric, dimension |
| Treatment of “active customer” | Who qualifies and why | Which rows qualify and how they are counted |
| Physical tables | May link to them as governed assets | Must map the relevant sources and fields |
| Calculation | States the rule in business language | Encodes and executes or compiles the rule |
| Change control | Owner approves a new meaning | Model author updates logic and tests the result |
| What it cannot establish alone | The result of a particular query | Whether the business approved the intended meaning |

This division is useful even when one platform contains both features. A glossary can hold the policy while a semantic model expresses it; the fact that both appear in one interface does not remove the review step between them. The remaining practical question is how to test the translation from policy to result.

## 2. A worked example: “active paying customer”

Suppose a subscription team asks, “How many active paying customers did we have in the last 30 days?” The following tiny dataset is **illustrative**, not a Datus customer dataset or a product benchmark. It is small enough to audit by eye. It also makes several otherwise invisible decisions explicit: whether trial accounts count, whether cancelled orders count, which date sets the window, and whether two orders from one customer count once or twice.

The business owner approves this glossary entry: **An active paying customer is a paying account with at least one completed order whose completion date falls within the selected 30-day interval. Count each customer once.** Trial accounts and cancelled orders are excluded. The reporting interval is half-open: the start is included, the end is excluded. For the example, use September 16 through October 15, 2026, represented as `[2026-09-16, 2026-10-16)`.

| Customer | Account status | Order | Order status | Completion date | Count? |
| --- | --- | --- | --- | --- | --- |
| 101 | trial | A | completed | October 9 | No: trial account |
| 102 | paying | B | completed | October 5 | Yes |
| 102 | paying | C | completed | October 12 | Still one customer |
| 103 | paying | D | cancelled | October 8 | No: cancelled order |
| 104 | paying | E | completed | September 12 | No: outside the interval |

The expected answer is **one customer: 102**. This is a check on the *example data*, not a performance or accuracy claim. If a query returns two because it counts orders B and C separately, the grain is wrong. If it returns three because it includes trial or cancelled activity, the eligibility rule is wrong. If it returns two by admitting September 12, the time boundary is wrong. Each failure suggests a different change to the model.

That glossary entry also needs a named owner. The data team can propose that “paying” means `accounts.status = 'paying'`, but a customer-success or finance owner must confirm whether an account with an expired subscription still qualifies. The sample uses account status as its approved test; another business could define payment from invoices instead. The point of the glossary is to expose that choice before it hardens into SQL.

## 3. Turn the definition into a query contract

The semantic model records the agreed path from the term to physical data. In this example, `accounts.customer_id` identifies a customer, `orders.customer_id` links each order to its account, `orders.status` identifies completed orders, and `orders.completed_at` supplies business time. The `accounts` table must be unique on `customer_id`; otherwise a join could multiply orders before counting. A [semantic model](/blog/what-is-semantic-model/) gives those fields names and descriptions, then defines a metric using the agreed eligibility rule.

| Contract field | Agreed value in the example | Check before release |
| --- | --- | --- |
| Population | Accounts with `status = 'paying'` | Review status values with the owner |
| Activity | At least one order with `status = 'completed'` | Confirm cancellation and refund policy |
| Time | `orders.completed_at` in `[start, end)` | Check timezone and late-arriving updates |
| Grain | Distinct `customer_id` | Check the account key and join cardinality |
| Output | Count of eligible customers | Reconcile against hand-checked rows |

Here is the **illustrative SQL equivalent**, using bind parameters for the selected interval. It is not a claim that any particular semantic engine emits this exact SQL:

```sql
SELECT COUNT(DISTINCT a.customer_id) AS active_paying_customers
FROM accounts AS a
JOIN orders AS o ON o.customer_id = a.customer_id
WHERE a.status = 'paying'
  AND o.status = 'completed'
  AND o.completed_at >= :start_date
  AND o.completed_at < :end_date;
```

The SQL returns one on the five rows above when the parameters are September 16 and October 16. `COUNT(DISTINCT)` expresses customer grain, while the half-open range avoids a fragile “23:59:59” cutoff. A production implementation also needs to decide what happens if an order is completed late, reversed later, or recorded in a different timezone. Those are business questions before they are query questions; write them in the glossary, then reflect the decisions in the model and its tests.

This is why a glossary-to-model handoff should contain more than a term name and a column mapping. It needs the approved population, event, time axis, aggregation grain, allowed breakdowns, and at least one fixture with an expected answer. The worked [Apache Ossie semantic model example](/blog/semantic-model-examples/) shows the next step for readers who want to inspect a model and its checked SQL. This article stays with the governance-to-execution boundary rather than duplicating that full YAML tutorial.

## 4. What breaks when the two drift apart

The most common mismatch is a glossary change that never reaches the model. Suppose the owner revises “active paying customer” to require an order that was not later refunded. The glossary now says one thing, while a metric that filters only `orders.status = 'completed'` still says another. The model can be perfectly valid and still answer the *old* question. A semantic compiler cannot infer a policy change from a sentence in a document that no one has connected to the metric.

The reverse mismatch is also possible. An engineer changes the SQL to use `orders.created_at` because that field is easier to query. The displayed metric name and glossary definition stay the same, but a customer who created an order in September and completed it in October now moves between periods. The code change looks small; the meaning change is large. Versioning and review should therefore cover the business term and the implementation together, with a result-level regression check on a known fixture.

A third failure hides inside an apparently correct join. One account has two completed orders, or a customer dimension accidentally contains duplicate rows. If the metric counts order rows rather than distinct customers, the result rises even though the glossary wording has not changed. Query reviewers need to inspect the **unit being counted** and the join cardinality, not only the filter labels. This discipline applies regardless of which engine executes the metric.

The owner, data steward, and model author can prevent these mismatches with a short handoff record: term ID and approved text; mapped metric name; source datasets; known exclusions; a business-time rule; and a test question with its expected result. It does not need a large approval ceremony for every edit. It needs an explicit path from a changed sentence to a changed test and model. If a term is only descriptive and never queried, a glossary entry may be enough. If a metric is consumed by multiple tools, that path matters much more.

Identity is another handoff decision. If the account system and order system use different customer identifiers, a shared term cannot make them equivalent by naming them both “customer.” The team must verify the mapping or state that the metric covers only one source. Document the limitation in the glossary and model description so a later agent does not treat an incomplete population as the whole business.

## 5. Where an AI agent fits

An agent asked for “active customers” sees only a phrase until it finds the approved definition and the corresponding metric. Column names such as `customer_status`, `last_seen_at`, and `order_date` are clues, not business policy. A retrieved glossary entry can help the agent interpret the request, but it still needs a queryable metric or a reviewed plan to produce a number. This is the distinction behind [why text-to-SQL fails without a semantic layer](/blog/why-text-to-sql-fails-without-a-semantic-layer/): syntactically valid SQL can answer the wrong version of a business question.

The safe flow is to resolve the term, choose the matching metric, inspect its available dimensions and time range, and execute against the governed model. If the request says only “active customers” but the glossary has both “active paying customers” and “monthly active product users,” the agent should clarify or present the two interpretations. Guessing one silently is a product decision disguised as a query. A semantic layer helps constrain query generation; it does not remove ambiguous language or the need to approve definitions.

Nor should the agent treat a metric name as proof of correctness. The model may be stale, a join key may be dirty, or a source table may have changed. Ask for a known test case before allowing an agent to reuse a metric widely. If the test returns the expected customer 102 for the illustrative fixture, you have checked one important path from phrase to answer. You have not proved every future window and segment correct.

## 6. How Datus applies the handoff

As of October 2026, <a href="https://docs.datus.ai/dev/knowledge_base/semantic_model/">Datus's semantic-model documentation</a> says the agent authors semantic models as Apache Ossie YAML through Dosi. A model names datasets, fields, relationships, and metrics; the YAML is the source of truth, while the Knowledge Base carries a searchable projection for agents and interfaces. Its <a href="https://docs.datus.ai/dev/knowledge_base/metrics/">metrics documentation</a> separates definition, discovery, and execution: the model defines the metric, the Knowledge Base helps find it, and a semantic adapter compiles the query. That separation is useful for the glossary handoff because an approved term can point to one reviewed metric instead of each consumer inventing a formula.

The product does not decide which business definition an organization should approve. In the active-customer example, a team would still supply the policy, review the generated or edited model, verify the account-to-order relationship, and test the result against known rows. Datus can help create and use the model, but a document containing the phrase “active customer” is not automatically an executable or correct metric. <a href="https://dosi.datus.ai/">Dosi</a> is a source-available semantic engine under Elastic License 2.0; the Datus agent is open source. Apache Ossie is the open, vendor-neutral specification for exchanging model definitions, while any Datus-specific extension behavior should be checked when another consumer reads the file.

For a reader evaluating a stack, the practical question is whether the approved definition can travel from a human review into a model that an agent and the team's other consumers can inspect. The answer depends on the integration and the metric, not on a vendor label. A governance platform may be the better place to own term approval and stewardship; a semantic execution layer is useful when several tools need to compute the approved term. They can work together.

## 7. Choose what to build first

Start with the glossary when people disagree about the word itself. “Active customer” might mean a paying account to Finance and a weekly app visitor to Product. No semantic model can reconcile those meanings until the owner decides whether they are two separate terms. Record both if necessary, with distinct names and scopes. A single ambiguous term does more harm than two clear definitions.

Start with a semantic model when the definition is already settled but each dashboard repeats the same join and filter logic. In that case, a long documentation project may postpone a simpler fix: turn the agreed rule into one reviewed metric, test it, and link it back to a short glossary entry. If only one report uses a calculation, a well-tested query may be sufficient for now. A shared layer earns its maintenance cost when another consumer needs the same business rule.

Build both together for terms that drive important numbers across several tools or teams. Select a small group of metrics, assign owners, write expected outputs for representative rows, and make the mapping visible. Avoid treating the glossary as a one-time copywriting exercise or the semantic layer as a place where engineers quietly invent policy. The <a href="https://ossie.apache.org/">Apache Ossie project</a> describes portable model components such as datasets, fields, relationships, and metrics; portability makes the technical definition easier to exchange, while approval and testing remain organizational work.

## Conclusion

A business glossary answers **“What did we agree this term means?”** A semantic layer answers **“How does our data produce that meaning for a query?”** The strongest handoff includes an owner, a precise population and time rule, a named metric, and a fixture with an expected result. Start there. Add more terms and models only after the first answer stays consistent from business review to dashboard or agent response.

## Frequently asked questions

### Is a business glossary the same as a semantic layer?

No. A business glossary records approved meanings and their owners; a semantic layer maps relevant meanings to datasets, relationships, calculations, and a query path. Some products contain both functions, but a glossary definition does not execute itself and a queryable metric does not establish who approved its business meaning. Link the two for metrics that people rely on across tools.

### Can a semantic layer replace a business glossary?

It can carry descriptions and business-facing names, but that is not automatically a full term-governance process. If the organization needs stewards, approval status, policy context, and competing departmental definitions, preserve those decisions somewhere explicit. A semantic model should reference the approved term or record its scope so someone can trace why a metric has its particular formula.

### What is the difference between a business glossary and a data dictionary?

The glossary defines a business concept such as “active paying customer.” A data dictionary describes physical fields such as `orders.completed_at`, including their types and source tables. The semantic layer uses both: it relates the business concept to the fields and makes the relevant calculation available to consumers. A data catalog may help people discover and connect these assets, but discovery alone does not guarantee one executable metric.

### Does an AI agent need both a glossary and a semantic model?

An agent needs the right business meaning and a reliable way to apply it. A glossary can help it resolve the user's language; a semantic model can constrain the datasets, joins, filters, and metric calculation. If the question is ambiguous, the agent should clarify. If the metric is missing or untested, it should not present a guessed SQL result as an approved KPI.

### Who should approve a metric definition?

The business owner should approve the intent, population, exclusions, and reporting time. The data team should confirm that source fields and joins implement those choices and check the result on representative rows. One person may hold both roles in a small team, but the two checks remain different: agreement about meaning and evidence that the calculation follows it.

## Related articles

- [What Is a Semantic Layer?](/blog/what-is-semantic-layer/) — the shared model behind consistent metrics.
- [What Is a Semantic Model?](/blog/what-is-semantic-model/) — the model components behind a queryable definition.
- [Semantic Model Examples](/blog/semantic-model-examples/) — a complete Apache Ossie model with checked answers.
- [What Is a Data Catalog?](/blog/what-is-data-catalog/) — how people discover governed data assets.
