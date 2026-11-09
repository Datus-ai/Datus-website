---
title: "What Is a Data Agent? Types, How It Works, and Examples"
description: "Learn what a data agent does, follow a checked revenue example, and evaluate business context, query evidence, permissions, and limits before choosing a tool."
author: "Evan Paul"
date: 2026-06-08
lastmod: 2026-11-04
head:
  - - meta
    - name: keywords
      content: "data agent, AI data agent, what is a data agent, types of data agents, how data agents work, data agent vs data engineering agent"
  - - meta
    - property: og:title
      content: "What Is a Data Agent? Types, How It Works, and Examples"
  - - meta
    - property: og:description
      content: "Learn what a data agent does, follow a checked revenue example, and evaluate business context, query evidence, permissions, and limits before choosing a tool."
  - - meta
    - property: og:type
      content: article
  - - meta
    - property: og:url
      content: https://datus.ai/blog/what-is-data-agent/
  - - meta
    - property: og:image
      content: https://datus.ai/logo_dark.svg
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - link
    - rel: canonical
      href: https://datus.ai/blog/what-is-data-agent/
---

# What Is a Data Agent? Types, How It Works, and Examples

## TL;DR

- A **data agent** is an AI system that carries out data tasks by choosing steps, using tools, and checking results against a user's goal. It combines access to data with metadata and business definitions, and can query, analyze, discover, or maintain data within the permissions and review process its operators configure.
- Querying, analysis, pipeline maintenance, discovery, reporting, and data engineering are useful ways to group its work. A single product can cover several roles.
- A useful answer exposes the metric definition, query, source, and checks behind the result. Fluent explanations alone do not establish correctness.
- A data engineering agent specializes in building and maintaining data systems and their context. Querying and context authoring can coexist in the same system.

## 1. What does a data agent do?

**A data agent uses AI and connected tools to complete work involving data.** A person might ask it to investigate falling revenue, locate a customer table, or inspect a failed pipeline. The system selects relevant information, takes permitted steps, examines what those steps return, and either continues or asks for help. This article uses the term for AI-driven data work, rather than a particular vendor's product or a background data-transfer service.

The word *agent* describes how the system works toward the goal. For an analytical question, that might involve finding an approved metric, querying a warehouse, noticing an empty result, and checking whether the date filter was wrong. A fixed report can provide an equally useful answer when the question and calculation are already known. An agent becomes useful when the route to the answer needs to adapt to the request or intermediate results.

There is no single agreed taxonomy of data agents. The research survey <a href="https://arxiv.org/abs/2510.23587" rel="nofollow noopener">A Survey of Data Agents: Emerging Paradigm or Overstated Hype?</a> highlights inconsistent use of the term and distinguishes systems by autonomy. For a buyer, that makes the workflow a better starting point than the label: what can the system read, decide, execute, and change?

### Data agent, chatbot, and SQL assistant

A chat interface can front any of these systems. A chatbot connected to tools may perform data-agent work, while a tool marketed as an agent may only draft a query for a person to run. Compare the actual workflow rather than assuming that one name implies memory, execution, or greater autonomy.

| Workflow | Typical starting task | What to check |
| --- | --- | --- |
| Chat without connected data tools | Explain a concept or discuss an uploaded extract | Which information is available, and whether it is current |
| SQL drafting assistant | Suggest or explain a query | Who executes it and checks the business logic |
| Data agent | Work toward a data goal using connected tools | Tool access, intermediate checks, and stopping conditions |
| Scheduled report | Repeat a known calculation | Definition ownership, refresh status, and exception handling |

None of these labels guarantees a correct answer. An agent does not necessarily learn from every conversation, retain memory between sessions, or have permission to modify data. Those are implementation choices to verify separately. A well-maintained report may be preferable when a team needs the same approved metric every morning.

## 2. Common types of data-agent work

Data agents can be grouped by the work they perform. The six roles below are this article's practical grouping, not an industry standard or a list of mutually exclusive product categories. They help you describe the job you need done before comparing implementations.

| Role | Example request | Useful output | Important boundary |
| --- | --- | --- | --- |
| Querying | "Show net revenue by region" | Query and result with a definition | Read access does not settle what revenue means |
| Analysis | "Investigate the regional decline" | A sequence of comparisons and findings | A contribution to a change does not prove its cause |
| Pipeline maintenance | "Inspect this failed daily load" | Diagnosis, proposed fix, or approved repair | Investigation and production writes need different permissions |
| Data discovery | "Which table contains approved customer regions?" | Relevant assets, owners, and metadata | Finding a table does not establish that it is suitable |
| BI and reporting | "Turn this result into a recurring report" | Chart, report, or dashboard | Presentation must preserve the calculation and filters |
| Data engineering | "Build a reviewed model for revenue" | Models, transformations, tests, or reusable context | Generated artifacts still need validation and ownership |

A revenue investigation may cross several of these roles. The agent first discovers the relevant dataset, then queries it, analyzes the change, and presents a chart. If it discovers that the metric is missing, authoring that metric becomes a separate task with a different review requirement. You should be able to tell where each handoff happens and which parts the same tool actually supports.

## 3. How a data agent works: a checked revenue example

A data agent connects a question to context, tool use, result checks, and an explanation. To see why each step matters, use a small illustrative dataset rather than an impressive-looking dashboard. The example below is invented for inspection; it is not customer data, a product benchmark, or a claim that every agent follows this exact process.

> Which region had the largest decline in net revenue in September 2026 compared with August 2026?

### Step 1: Settle the question and business definition

Before querying, the agent needs a definition of net revenue and a comparison period. In this example, the agreed rule is completed-order revenue minus refunds attributed to those orders, grouped by order month and customer region. Amounts are all in USD, and cancelled orders are excluded. In a real deployment, the metric owner must decide whether refunds belong to the original order month or the refund month; the column names cannot make that decision.

The period also needs to be explicit. "Last month" depends on when the question is asked and the reporting calendar in use. Naming August and September avoids that ambiguity in the fixture, but a production answer should expose the resolved dates and timezone. If two approved revenue definitions fit the request, asking which one to use is a useful result of the first step.

### Step 2: Inspect the sources and their grain

The fixture has one row per order and one row per refund event. Order 3 has two refund events, so joining the raw refund rows to orders would repeat its gross amount. The query must aggregate refunds to one row per order before combining them with order amounts. This is a correctness check an evaluator can inspect without trusting the final narrative.

| Order | Month | Region | Status | Gross amount | Refund events |
| --- | --- | --- | --- | ---: | --- |
| 1 | August | East | Completed | 1,000 | None |
| 2 | August | West | Completed | 800 | None |
| 3 | September | East | Completed | 1,000 | 100 and 200 |
| 4 | September | West | Completed | 900 | None |
| 5 | September | East | Cancelled | 500 | None |

The permitted source matters as much as the join. A catalog may expose a convenient table that contains only a subset of the business or has not finished loading. The agent should inspect available metadata and freshness evidence before treating it as the source for a company-wide comparison. If its credentials reveal only East-region data, it cannot conclude which region declined most across the whole company.

### Step 3: Generate or compile a query you can inspect

The calculation can come from generated SQL or a semantic engine that compiles a reviewed metric. [Text-to-SQL](/blog/what-is-text-to-sql/) describes the former path; either path still needs to match the approved business definition. Here is a standalone SQLite example with the fixture embedded, so you can reproduce the calculation without connecting to a warehouse.

```sql
WITH
orders(order_id, order_date, region, status, gross_usd) AS (
  VALUES
    (1, '2026-08-15', 'East', 'completed', 1000),
    (2, '2026-08-15', 'West', 'completed', 800),
    (3, '2026-09-15', 'East', 'completed', 1000),
    (4, '2026-09-15', 'West', 'completed', 900),
    (5, '2026-09-15', 'East', 'cancelled', 500)
),
refunds(order_id, refund_usd) AS (
  VALUES (3, 100), (3, 200)
),
refunds_by_order AS (
  SELECT order_id, SUM(refund_usd) AS refund_usd
  FROM refunds
  GROUP BY order_id
),
monthly AS (
  SELECT o.region, SUBSTR(o.order_date, 1, 7) AS month,
         SUM(o.gross_usd - COALESCE(r.refund_usd, 0)) AS net_usd
  FROM orders AS o
  LEFT JOIN refunds_by_order AS r ON o.order_id = r.order_id
  WHERE o.status = 'completed'
    AND o.order_date >= '2026-08-01'
    AND o.order_date < '2026-10-01'
  GROUP BY o.region, SUBSTR(o.order_date, 1, 7)
)
SELECT current.region, previous.net_usd AS august_net_usd,
       current.net_usd AS september_net_usd,
       current.net_usd - previous.net_usd AS change_usd
FROM monthly AS current
JOIN monthly AS previous ON current.region = previous.region
WHERE current.month = '2026-09' AND previous.month = '2026-08'
ORDER BY change_usd;
```

This query has deliberate limits. Its inner join compares regions present in both months, so it would omit a newly opened region or one missing from a period. A real reporting design may need a complete region list and a calendar to distinguish missing data from zero revenue. The fixture is small enough that those assumptions are visible instead of hidden in a complex query.

### Step 4: Check the result against independent expectations

The expected result follows directly from the input rows. East changes from 1,000 to 700 USD because its September order has 300 USD of refunds. West changes from 800 to 900 USD. The cancelled 500 USD order does not contribute, and the two refund rows do not duplicate gross revenue.

| Region | August net revenue | September net revenue | Change |
| --- | ---: | ---: | ---: |
| East | 1,000 USD | 700 USD | −300 USD |
| West | 800 USD | 900 USD | +100 USD |

Use these expectations to check the query rather than accepting its output as the reference answer. Then deliberately change a relevant input: remove a refund, change an order's status, or give a region no rows in one month. The point is to see whether the result changes for the right reason and whether the answer acknowledges cases the query does not cover. A successful query execution establishes syntax and access, not business correctness.

### Step 5: Explain the finding and its limits

A supported answer is: "In this fixture, East had the largest decline: net revenue fell by 300 USD, from 1,000 in August to 700 in September. The calculation excludes cancelled orders and attributes refunds to the original order month." It should accompany that answer with the query and definition. Saying that East declined because customers became less satisfied would exceed the available data; the fixture records refunds, not their causes.

This sequence is consistent with documented product workflows without being tied to one product. As of November 2026, <a href="https://learn.microsoft.com/en-us/fabric/data-science/concept-data-agent" rel="nofollow noopener">Microsoft's Fabric data-agent documentation</a> describes selecting data sources, generating and validating queries, and returning results under the requesting user's permissions. Its platform-specific approach is useful to evaluate when your governed data already lives in Fabric. It does not establish that an unrelated agent inherits the same controls.

## 4. Where data-agent answers go wrong

Data-agent errors can come from the definition, the query, the available data, or the explanation. In the example, all four can produce a plausible-looking answer. Recording which part failed gives the team a concrete correction to make instead of repeatedly changing the prompt.

### The definition changes between steps

An agent might calculate net revenue in one turn and gross revenue in the next, or switch from order date to refund date. Each query can be valid while the comparison becomes meaningless. Save the selected metric, dates, and filters with the task, then inspect whether follow-up requests preserve or deliberately change them. A [semantic model](/blog/what-is-semantic-model/) can make those definitions reusable, but the application still has to select the appropriate one.

### Valid SQL uses the wrong population

A query may double-count orders, omit missing regions, or use an incomplete table. These errors survive a syntax check and may survive a quick visual inspection. Test representative edge cases against expected answers, including duplicate keys, absent periods, refunds, and records excluded by policy. The revenue fixture demonstrates why the table grain belongs in that review.

### An explanation outruns the evidence

Finding a regional decline is descriptive analysis. Explaining why customers requested refunds requires additional evidence, and a proposed operational action may need approval. An agent should identify that gap rather than turn correlation into a causal story. <a href="https://www.snowflake.com/en/artificial-intelligence/agents/" rel="nofollow noopener">Snowflake's agent guide</a> also emphasizes controlled tool access, evaluation, and inspectable traces; those are useful design questions beyond any one platform.

## 5. Data agent vs data engineering agent

A **data engineering agent** specializes in building and maintaining data systems and the reusable context around them. A data agent is the broader category. The distinction is about the primary task and deliverable, rather than an absolute split between systems that consume context and systems that produce it. The [data engineering agent guide](/blog/what-is-data-engineering-agent-2026/) covers that specialized work in more detail.

| Question | Analytical data-agent task | Data engineering-agent task |
| --- | --- | --- |
| Goal | Answer which region declined | Make the approved calculation reusable |
| Main artifact | Query, checked result, explanation | Model, transformation, test, or reference query |
| Review | Does this answer match the question and data? | Will this artifact behave correctly when reused? |
| Failure to watch | Wrong dates, grain, scope, or explanation | Incorrect definitions or changes propagated downstream |

The same system may perform both tasks. It might answer the revenue question, propose a missing metric, and help prepare the model that future questions use. That does not mean the proposed definition should immediately become authoritative. Keep the one-off investigation and the shared model change separately reviewable, with an owner for the business rule and tests for the calculation.

Human maintenance is also a valid choice. A team with a small, stable model and established review practices may not need another agent to keep definitions current. An agent is useful when its supported workflow reduces repeated work enough to justify the operational cost of permissions, evaluation, and maintenance. Compare that benefit with the tools and processes you already have.

## 6. How to evaluate a data agent

Evaluate a data agent with a question whose answer your team can check. Use the same business definition and permitted data for each candidate, then inspect the path to the result. A polished demo of an unfamiliar dataset makes it difficult to distinguish genuine correctness from a convincing narrative.

| Ask the evaluator | Evidence to request |
| --- | --- |
| Where did the metric definition come from? | Named definition, owner, formula, and relevant exclusions |
| Can I inspect how the answer was computed? | SQL or tool calls, source mappings, and result rows |
| Whose data can the agent access? | Actual credential scope and a test with a restricted identity |
| What happens when a definition is ambiguous? | A clarification or an explicit, reviewable assumption |
| How does it handle a wrong or empty result? | Checks, retries, stopping conditions, and a visible error |
| Which operations require approval? | A boundary between reading, drafting, and production changes |
| Can we retest after a change? | Saved questions, expected answers, and regression results |

Run the revenue case with an identity restricted to East, then ask for a company-wide comparison. A responsible response should acknowledge the limited scope; a correct East total alone is insufficient. Repeat the test after altering a definition or source mapping. This reveals whether the workflow can detect a relevant change and explain its consequences.

Also ask what happens when the agent cannot finish. A missing permission, unsupported calculation, or unavailable source should produce an actionable explanation with a clear stopping point. Letting the system continue guessing can turn a recoverable failure into an incorrect report. Tool-call limits and human escalation are practical parts of the workflow, not evidence that the system has failed to be an agent.

## 7. How Datus and DOSI fit this workflow

As of November 2026, [Datus Agent](/products/cli/) supports data engineering and analysis, including working with schemas, SQL, and semantic models. The broader Datus platform provides shared enterprise data context for AI agents. In the example, the relevant distinction is between helping a team draft a revenue definition and treating that definition as approved. Review of business meaning and source data remains the team's responsibility.

For execution through reviewed definitions, the [DOSI agent guide](https://dosi.datus.ai/agents/) documents tools to discover metrics, preview compiled SQL, and execute supported metric queries. DOSI validates compatible Apache Ossie models and compiles supported requests into warehouse SQL; a structurally valid model can still encode the wrong business rule. Datus Agent is open source, while DOSI is licensed under Elastic License 2.0. These are distinct components and should be evaluated for the work each performs.

## Conclusion

A useful data agent makes the path from question to result inspectable: what definition it used, which data it reached, what it executed, and what it checked. Start with a narrow task and a known answer before expanding its scope. For a next step, use the existing [working semantic-model example](/blog/semantic-model-examples/) to inspect how data, definitions, and expected results fit together.

## Frequently asked questions

### What is a data agent in simple terms?

A data agent is AI software that uses tools to carry out data work toward a goal. It might find a dataset, query it, inspect results, and explain an answer. The important questions are what data and tools it can use, how it checks its work, and when a person must review or approve the next step.

### How is a data agent different from a chatbot?

A chatbot describes an interface; a data agent describes a workflow that can use tools and act on data. The same product can be both. A chat system with connected data tools may perform agentic work, while a chat-only explanation may involve no query execution. Check the actual capabilities instead of inferring them from the product name.

### Does a data agent learn automatically from every question?

Not necessarily. Session context, persistent memory, reviewed changes to a knowledge base, and model training are different mechanisms. Ask what is saved, who can change it, and how corrections are tested before reuse. A system can complete useful data tasks without changing its model or remembering conversations between sessions.

### Does a data agent need a semantic layer?

A semantic layer is one way to provide reusable business definitions, not a requirement for every data task. An agent can inspect a file or investigate a schema using other tools. Repeated business reporting benefits from approved definitions that stay consistent across questions, whether those definitions come from a semantic layer, curated queries, or another maintained source.

### Can a data agent change production data?

Only if the implementation and its permissions allow that operation. Some agents have read-only access; others can propose or execute changes. Verify the configured credential scope, enforcement mechanism, approval process, and audit trail. A natural-language instruction to avoid writes is not a substitute for a permission boundary enforced by the tools and data platform.

## Related articles

- [What is a data engineering agent?](/blog/what-is-data-engineering-agent-2026/) — specialized work on data systems and reusable context
- [What is text-to-SQL?](/blog/what-is-text-to-sql/) — turning questions into database queries
- [What is a semantic model?](/blog/what-is-semantic-model/) — the business definitions behind a calculation
- [Semantic model examples](/blog/semantic-model-examples/) — downloadable data, definitions, and checked answers
