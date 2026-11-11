---
title: "From Existing SQL to Reusable Business Metrics"
description: "Turn existing SQL into reusable business metrics with Datus. Preserve calculation rules, compare results with the original query, and reuse shared definitions."
author: "Evan Paul"
date: 2026-11-10
lastmod: 2026-11-10
heroImage: "/images/sql-to-business-metrics/cover.svg"
heroImageAlt: "SQL fragments converge into a shared revenue metric, then branch into a conversation, chart, and report."
heroLayout: stacked
head:
  - - meta
    - name: keywords
      content: "SQL to semantic model, reusable business metrics, SQL metrics, business metric definitions, semantic modeling"
  - - meta
    - property: og:title
      content: "From Existing SQL to Reusable Business Metrics"
  - - meta
    - property: og:description
      content: "Turn existing SQL into reusable business metrics with Datus. Preserve calculation rules, compare results with the original query, and reuse shared definitions."
  - - meta
    - property: og:type
      content: article
  - - meta
    - property: og:url
      content: https://datus.ai/blog/sql-to-business-metrics/
  - - meta
    - property: og:image
      content: https://datus.ai/images/sql-to-business-metrics/cover.svg
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - link
    - rel: canonical
      href: https://datus.ai/blog/sql-to-business-metrics/
---

# From Existing SQL to Reusable Business Metrics

## TL;DR

Existing SQL often contains business knowledge worth reusing. Datus can use that SQL and live table information to build semantic definitions, compare model results with a reference query, and make saved metrics available for later questions. The team still needs to review what the calculation means.

## Your useful metric may already exist in a query

The finance team has a monthly revenue query. It excludes test orders, counts only completed orders, and subtracts refunds. An analyst copies it into a regional report. Another person adapts it for next month. An AI agent receives a similar question and writes a fresh calculation.

Now several places contain a definition of revenue. They may agree today, but the next edit can change one version while leaving the others untouched. Even a small detail, such as how to handle a missing refund amount, can change the answer.

**A reusable business metric is a named calculation with explicit rules and source mappings that different queries can use.** Turning an existing SQL query into that definition means separating the calculation's lasting meaning from the particular report that first used it. The goal is to preserve useful business knowledge while making it easier to inspect and reuse.

A trusted query is a starting point, rather than proof that its definition suits every future question. Before adopting it, establish who owns the calculation, which business situation it covers, and whether its current rules are still intended. Our guide to [validating business rules before reuse](/blog/validate-business-rules-ai-agents/) covers that decision.

## Separate the definition from the question

Consider a fictional retailer whose chosen measure is **completed non-test order amounts, less recorded refunds, in USD**. This is a specific operational measure called `net_order_revenue`; it is not a universal accounting definition of revenue.

Its October report uses this SQL:

```sql
SELECT region,
  SUM(CASE WHEN status = 'completed' AND is_test = 0
      THEN amount - COALESCE(refund_amount, 0)
      ELSE 0 END) AS net_order_revenue
FROM orders
WHERE order_date >= '2026-10-01'
  AND order_date < '2026-11-01'
GROUP BY region;
```

The completed-order condition, test-order exclusion, and refund treatment define this metric. October and the regional breakdown describe this particular question. A November report can change the period while keeping the same calculation.

That distinction requires judgment. A fixed eligibility window or a denominator population can be part of a metric's meaning. Removing it because it looks like a filter would change the definition. Likewise, a join may determine which customers remain in the result, including customers with zero activity.

| Keep in this metric's definition | Vary with this example's question |
| --- | --- |
| Only completed, non-test orders contribute | October or November |
| Subtract recorded refunds | Company-wide or regional breakdown |
| Treat a missing refund as zero | Display ordering |

The table applies to this example. A cohort metric, rolling window, or ranked population can require a different boundary between definition and query scope.

## How Datus turns the calculation into a reusable model

Datus is a data engineering Agent that works with project context and connected data. Within Datus Studio, semantic modeling can start from a description, supplied SQL, and relevant documents. DOSI provides the semantic engine behind the resulting datasets and metrics. The [Datus semantic layer solution](/solutions/semantic-layer/) explains how those definitions support later analysis.

### Read the SQL alongside the actual tables

Datus's semantic modeling workflow can inspect table structure, read relevant files, and use read-only queries to investigate the supplied calculation. This connects the SQL to available fields and sources, rather than treating it as an isolated formula.

For our retailer, that means identifying the orders source and checking the fields used for status, test flags, refunds, dates, and regions. An ambiguous status definition still needs clarification. A field called `amount` does not tell the Agent whether it represents tax-inclusive sales, booked revenue, or something else.

The workflow also considers existing semantic models. A suitable retail model can receive the new metric; each pasted report does not need a separate model. Intermediate expressions should become reusable assets only when they serve the requested outputs. These behaviors are described in the <a href="https://docs.datus.ai/0.4/subagent/semantic_modeling/" rel="nofollow noopener">semantic modeling documentation</a> and the current Agent implementation.

### Preserve the calculation in a named definition

The resulting model connects a dataset to its physical source and gives the calculation a stable identity, such as `net_order_revenue`. Its expression retains the completed-order, test-order, and refund rules. The period and grouping can then be supplied when querying this metric.

Datus's modeling instructions require preserving calculation details such as filters, grouping, window populations, and zero or NULL behavior. They also distinguish reusable model assets from a durable reproduction of a particular report. Complex SQL may require a query-backed dataset or may contain an output that the supported model cannot faithfully represent. Those cases need to be surfaced, rather than silently simplified.

A reviewer should be able to read the proposed definition and understand its scope. In Studio, the semantic model and metric definitions provide that inspection surface. The [working semantic model examples](/blog/semantic-model-examples/) show what the underlying datasets, relationships, and expressions look like.

### Compare against the original question

A structurally valid model can still calculate the wrong thing. Datus separates model validation from business-output comparison. Its verification tool can execute a metric query and supplied reference SQL, map their grouping columns, and compare the full result keys and values.

For October, the reference and model queries must use the same period and regional grouping. A successful comparison should establish that North and South both exist and have matching values. Comparing only the combined total can hide a missing group or an incorrect allocation.

The comparison reports **passed, failed, or unverified**. An empty result, for example, cannot establish business equivalence. A model edit also calls for a new comparison. The Agent's <a href="https://github.com/Datus-ai/Datus-agent/blob/46ca6abef989e667368e6b9a4146c0e9f39d23f5/datus/tools/func_tool/semantic_verification_tools.py" rel="nofollow noopener">verification implementation</a> makes those distinctions explicit.

![Existing SQL and live schema feed Datus semantic modeling; the proposed metric is compared with the reference query, reviewed by the team, and reused for new questions.](/images/sql-to-business-metrics/workflow.svg)

[Open the workflow diagram at full size](/images/sql-to-business-metrics/workflow.svg)

Model validation checks whether the model can be used. A result comparison checks agreement for a specified question. Neither determines whether the business wants that definition. Teams should review the comparison status and the rule itself before treating a generated metric as their agreed definition; saving or synchronizing a model does not supply that approval.

## Check a small example before reusing the definition

Our downloadable example contains eight fictional orders across October and November. October includes completed orders, a cancelled order, a test order, refunds, and one missing refund value. That makes the important rules visible in a small result.

| Period | North | South | Total |
| --- | ---: | ---: | ---: |
| October | 210 | 90 | 300 |
| November | 60 | 35 | 95 |

October's North result is `(120 − 20) + 80 + 30 = 210`. South contributes `100 − 10 = 90`; its cancelled and test orders contribute zero. November changes the period and returns 95 across both regions, using the same definition.

We validated this illustrative model with DOSI 0.1.11, compiled its metric queries, and executed the generated SQL against the sample data alongside the reference queries. Both periods matched by region. This is a local calculation check, not a recording of an Agent generating a model or a live Studio session.

The fixtures are available as [sample orders](/examples/sql-to-business-metrics/seed.sql), a [reference query](/examples/sql-to-business-metrics/reference.sql), and a [semantic model](/examples/sql-to-business-metrics/model.yaml). They show calculation preservation on a deliberately small dataset. Larger models need checks that cover their joins, populations, time rules, and edge cases.

## Let later questions use the saved metric

Once the model is available in the project, later analysis can refer to its named metrics. Datus's Ask Metrics workflow retrieves metric definitions and dataset context before querying the semantic engine. It can use the saved calculation rather than reconstructing it from raw schema for each question. The <a href="https://docs.datus.ai/0.4/subagent/ask_metrics/" rel="nofollow noopener">Ask Metrics documentation</a> describes this definition-first workflow.

A user can ask for November's net order revenue by region, or ask for the company-wide figure for the same period. The result changes because the question changes; the completed-order and refund rules remain shared. Available dimensions and supported query behavior still come from the model. A saved metric does not make every possible breakdown valid.

This also creates a clearer review path. When a number looks unexpected, inspect the named definition, source mappings, and actual query scope. [Metric lineage](/blog/data-lineage-ai-analytics/) helps connect the definition to its dependencies. It complements the original-query comparison by making the model's structure available for investigation.

## Keep the calculation useful beyond its first report

The useful outcome is a calculation that the team can explain and query again. Start with one important SQL statement, make its meaning explicit, check representative results, and reuse the definition where it fits.

## Frequently asked questions

### Can Datus create a semantic model from existing SQL?

Datus's semantic modeling workflow accepts SQL as calculation evidence and can inspect live table information while authoring datasets and metrics. The team should review ambiguities and any outputs that cannot be faithfully represented. A supplied SQL query is evidence for the definition, not automatic business approval.

### How does Datus check that a metric matches the original SQL?

Its business-output verification tool can execute a metric query and reference SQL, align declared grouping columns, and compare their full keys and values. The queries need matching populations, periods, and grouping. Results can be passed, failed, or unverified; model compilation alone is a separate check.

### Should every SQL filter become part of the metric?

It depends on its role. In this example, completed-order and test-order conditions define the metric, while the report's month can vary. A cohort window, ranking population, or eligibility condition may belong to the definition. Removing those conditions can change the calculation's meaning.

### Does a matching result prove that the definition is correct?

It demonstrates agreement for the checked data and query scope. It does not establish that the reference query expresses the intended business policy or covers every future case. Review the definition with its owner and test relevant boundaries before wider reuse.

## Related articles

- [Semantic Model Examples: A Working Apache Ossie Model](/blog/semantic-model-examples/)
- [How Should AI Agents Validate Business Rules Before Reusing Them?](/blog/validate-business-rules-ai-agents/)
- [Data Lineage for AI Analytics: From Answers to Sources](/blog/data-lineage-ai-analytics/)
