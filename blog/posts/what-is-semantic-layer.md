---
title: "What Is a Semantic Layer? Definition, Architecture & Example"
description: "What is a semantic layer? Follow a net revenue example from source tables to shared metrics, learn its architecture, and see how BI tools and AI agents use it."
author: "Evan Paul"
date: 2026-05-31
lastmod: 2026-11-26
head:
  - - meta
    - name: keywords
      content: "semantic layer, what is a semantic layer, semantic layer definition, semantic layer data engineering, semantic layer vs metric layer, headless BI semantic layer, metric layer"
  - - meta
    - property: og:title
      content: "What Is a Semantic Layer? Definition, Architecture & Example"
  - - meta
    - property: og:description
      content: "What is a semantic layer? Follow a net revenue example from source tables to shared metrics, learn its architecture, and see how BI tools and AI agents use it."
  - - meta
    - property: og:type
      content: article
  - - meta
    - property: og:url
      content: https://datus.ai/blog/what-is-semantic-layer/
  - - meta
    - property: og:image
      content: https://datus.ai/logo_dark.svg
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - link
    - rel: canonical
      href: https://datus.ai/blog/what-is-semantic-layer/
---

# What Is a Semantic Layer? Definition, Architecture & Example

## TL;DR

A semantic layer turns source tables into shared business definitions for metrics, dimensions and relationships. It lets dashboards, reports and AI agents request the same metric without each rebuilding its calculation; the definition and the returned result still need checking.

## What is a semantic layer?

**A semantic layer is a business-facing representation of data that maps tables and columns to named metrics, dimensions and relationships. It sits between stored data and the tools that consume it, giving people and software a consistent way to ask for quantities such as net revenue by region.**

Suppose Finance asks for net revenue while a store manager wants the same number in a dashboard. An analyst knows that cancelled orders should not count and refunds must be deducted. An AI agent looking only at column names may not know either rule. The semantic layer gives that calculation a name, connects it to the right records, and makes the definition available to each consumer.

<figure><picture><source media="(max-width: 600px)" srcset="/images/what-is-semantic-layer/shared-revenue-scenario-mobile.svg"><img src="/images/what-is-semantic-layer/shared-revenue-scenario.svg" alt="Finance, a store manager and an AI agent use a shared net revenue definition: completed sales of 250 minus refunds of 20 equals 230, with cancelled orders excluded" loading="lazy" decoding="async"></picture><figcaption>Different users and interfaces, one explicit calculation. The fictional numbers are worked through below; comparable results require the same period and authorized data scope.</figcaption></figure>

The distinction is practical: knowing that an `amount_usd` column exists is different from knowing which amounts belong in revenue. A useful semantic layer captures that second part. It should also make the definition inspectable, so a business owner can challenge a filter or explain why a result differs from a familiar report.

## A semantic layer example: net revenue by region

Consider this fictional order dataset. Each row represents one order, all amounts are in USD, and refunds are already aggregated to that order. This deliberately small example is for explanation, not a report of customer results.

| Order | Region | Status | Gross amount | Refunded amount |
| --- | --- | --- | ---: | ---: |
| A | West | Completed | 120 | 20 |
| B | East | Completed | 80 | 0 |
| C | East | Completed | 50 | 0 |
| D | West | Cancelled | 200 | 0 |

For this example, the business definition is: **net revenue equals gross amount minus refunded amount for completed orders**. The reporting date is the order completion date; refunds are attributed back to that order. The definition does not describe accounting revenue recognition or a report grouped by refund-processing date. Those would require different rules.

The calculation is `120 − 20 + 80 + 50 = 230`. Grouping by region gives West 100 and East 130. Adding every gross amount would produce 450; that query could run successfully while answering a different question. The semantic layer's job is to expose the intended calculation rather than leave each consumer to reconstruct it.

The model needs more than a formula. It identifies `net_revenue` as the metric, `region` as a dimension, and completed orders as the eligible records. It also needs to define how missing refund values are handled. In this table every refund value is explicit, so zero means no refund; a missing value should not silently acquire that meaning without a reviewed rule.

When a dashboard or an agent requests net revenue by region for a period, the runtime uses those definitions to plan a query against the underlying data. The request still supplies the date range and, where relevant, the user's identity. Reusing the metric does not make an incorrect time window or an inappropriate access context correct.

This separation makes disagreement easier to investigate. If a second report returns 250, first compare its metric and refund treatment. If it returns 430, inspect whether it included the cancelled order. If only regional totals differ, investigate the region mapping and relationships. A named definition gives people a shared starting point for that discussion.

For a downloadable model with its own sample records and expected answers, use the [semantic model examples](/blog/semantic-model-examples/). For a real personal-data case covering metric contracts and independent checks, see [semantic layer requirements: a running-data example](/blog/semantic-layer-requirements/).

## Semantic layer architecture: from data to an answer

The basic architecture connects three parts: source data, a model with an execution path, and consumers. The model describes meaning; the runtime turns a supported request into work the data system can execute. A document listing KPI names alone does not supply that execution path.

<figure><picture><source media="(max-width: 600px)" srcset="/images/what-is-semantic-layer/architecture-mobile.svg"><img src="/images/what-is-semantic-layer/architecture.svg" alt="Fictional orders feed a semantic definition for completed-order net revenue, which dashboards, reports and agents query to obtain West 100 and East 130" loading="lazy" decoding="async"></picture><figcaption>One definition, several consumers. Results shown are from the fictional orders above; access controls and the requested period remain part of the execution context.</figcaption></figure>

**Source data** may live in a warehouse, lakehouse or database. Transformations prepare records with suitable keys, units and quality checks. The semantic layer does not eliminate that preparation: an ambiguous source field or an incomplete refund feed remains a problem even when the metric has a clear name.

**The semantic model** maps those records to business objects, metrics and dimensions. Relationships tell the runtime which paths are valid, and time definitions clarify which date applies. The implementation may live inside a BI platform, near the warehouse, or in a separate service. Those choices affect how other tools can use it.

**The execution path** resolves a requested metric and grouping into a query. Some products generate SQL for the source warehouse; implementations differ in caching, supported calculations and interfaces. Ask where calculation actually happens and how a user can inspect the query or its inputs. A shared model file does not by itself prove that every connected tool executes equivalent logic.

**Consumers** include dashboards, applications, notebooks, reports and agents. They may use different interfaces, yet request the same definition. In a headless setup, the model and query interface are separate from a particular presentation tool. A dashboard then supplies charts and layout while the semantic layer supplies the calculation.

The important test is the whole path. Can a report, a dashboard and an agent request the same metric under the same scope and obtain equivalent results? If one consumer bypasses the model and rewrites its formula, that is a separate implementation which needs reconciliation. A common label on three screens is not enough.

## What belongs in a semantic model?

A useful model makes decisions explicit that would otherwise stay in an analyst's head. The exact syntax varies by implementation, but the following concerns apply to the revenue example.

| Component | Question it answers | Example |
| --- | --- | --- |
| Entities | What business objects are represented? | Order and Customer |
| Metrics | What quantity is calculated? | Completed-order net revenue |
| Dimensions | How can the result be grouped or filtered? | Region and product category |
| Relationships and grain | How do records connect without changing their weight? | Each order joins to one customer |
| Time rules | Which date defines the reporting period? | Order completion date |
| Scope and ownership | Which records qualify, and who maintains the meaning? | Cancelled orders excluded; Finance reviews the definition |

Grain describes what one row represents. It matters when orders join to refunds, line items or customer records. Joining one order to several line items can repeat its amount; subtracting multiple refund rows can introduce another multiplication. Declare the relationship and check the resulting calculation instead of assuming that a valid join is a correct one.

Aggregation also needs review. Revenue may be additive across regions, while a rate often needs a ratio of totals. Averaging the percentages shown on several dashboard cards can produce a different answer from computing the period rate. The model should express the intended behavior for the groupings it supports.

Ownership belongs in the operating process even when the model format does not store every approval detail. Someone must decide whether a new refund category changes the meaning of the metric, when the change takes effect, and what historical results should mean afterward. The software can expose the definition; it cannot settle a business disagreement by naming a field.

For the distinction between the model itself and the surrounding service, read [what a semantic model is](/blog/what-is-semantic-model/). This article focuses on what the layer does across the complete data-to-answer path.

## Semantic layer, metric layer and data catalog

A metric layer focuses on defining and serving quantities such as revenue, retention or conversion rate. A semantic layer is generally broader: it also describes the entities, dimensions and relationships used to interpret those quantities. Product terminology overlaps, so evaluate the definitions and interfaces rather than choosing by label alone.

A data catalog helps people discover assets, owners and metadata. A business glossary records agreed terminology. Both can inform a semantic model, but neither automatically produces an executable revenue calculation. A team can have well-documented tables while its dashboards still implement different filters for the same KPI.

The differences do not require three separate products. One platform may provide several of these functions, and a small team may begin with curated views plus reviewed definitions. The question is whether its users can find the intended meaning and execute it consistently. Adding another product is useful only if it closes a concrete gap in that workflow.

## Where teams implement a semantic layer

Some teams build semantics into their BI environment. For example, <a href="https://cloud.google.com/looker/docs/lookml-terms-and-concepts" rel="nofollow noopener">LookML describes dimensions, measures and relationships for Looker</a>. This can suit users already exploring data within that environment. Teams adding other interfaces should verify the supported access path rather than assume definitions travel unchanged.

Other teams keep definitions with their transformation project. <a href="https://docs.getdbt.com/docs/build/about-metricflow" rel="nofollow noopener">MetricFlow translates metric requests into SQL using semantic definitions</a>. That is a useful architecture to understand if the team already maintains its analytics logic with dbt. The surrounding service, access controls and consumption interfaces still need to fit the intended workflow.

Warehouse-native semantics and independent semantic runtimes provide other deployment choices. The relevant distinction is where definitions live, where they execute and which clients can consume them. A team using one warehouse may choose differently from a team serving applications and agents across several supported sources.

For product-by-product evaluation, use the existing [semantic layer tools comparison](/blog/semantic-layer-tools-list-osi/). This definition article does not need to duplicate that catalogue. Start with the business task, then compare the candidates against the actual calculations, permissions and interfaces it requires.

## Why AI agents need more than table names

An agent has two related jobs: understand the request and obtain the right result. A semantic layer helps with the second by making reviewed metrics and relationships available. It also gives the agent more useful vocabulary than raw column names. Neither benefit guarantees that the agent chooses the appropriate definition for an ambiguous question.

“Why did sales fall?” might refer to gross orders, net sales or recognized revenue. The agent may need to clarify the metric, region and period before requesting data. It also needs evidence before interpreting a change: the right calculation alone does not establish why customers bought less or why refunds increased.

Documents, reference queries and business rules can provide context for that choice. They should remain distinguishable from approved definitions. A useful correction found in one investigation might apply to a specific region or a temporary policy; silently turning it into a global rule could make other answers wrong.

A practical review loop therefore separates finding a candidate rule, checking its source and scope, reviewing a proposed model change, and verifying the affected outputs. This can coexist with version-controlled models. Fast discovery and deliberate approval solve different parts of the problem; a useful system supports both without pretending that a remembered correction is automatically authoritative.

Access is another boundary. The semantic layer may participate in row or column restrictions, or rely on the source database and the surrounding service. An agent-generated HTML report must use the appropriate authorized execution path; changing the presentation does not remove the need to test what each identity can query and what a shared artifact exposes.

## Where Datus and DOSI fit

Datus helps teams turn business knowledge from documents, existing SQL and data structures into context and semantic models they can review. DOSI provides an execution path for Apache Ossie semantic definitions, so supported agents and tools can request metrics without separately rebuilding their formulas.

The idea is to make business meaning reusable across the data stack and agent interfaces a team chooses. That requires checking the model, its execution path and each consumer's access context. A portable definition does not imply that every product-specific feature works identically in another runtime.

Explore the [Datus semantic layer solution](/solutions/semantic-layer/) for the overall approach. The <a href="https://docs.datus.ai/dev/subagent/semantic_modeling/" rel="nofollow noopener">semantic-modeling documentation</a> explains the modeling workflow, and the <a href="https://dosi.datus.ai/" rel="nofollow noopener">DOSI documentation</a> covers the engine. Datus Agent is open source; DOSI uses Elastic License 2.0. Apache Ossie is the open standard, a separate licensing question from the products implementing it.

## Conclusion

A semantic layer makes the meaning behind a business number explicit and gives consumers a way to use that meaning consistently. Its value is visible when a person can ask for a metric, understand which records count and inspect how the answer was calculated.

Start with one disputed or frequently reused metric. Agree on its scope, map its sources, check a small example and confirm that the intended tools use the same definition. Expand after that path works. The goal is a shared, reviewable calculation that survives a change of dashboard or agent, not simply a larger collection of model files.

## Frequently asked questions

### What is a semantic layer in simple terms?

A semantic layer connects stored data to business language. It defines metrics, dimensions and relationships so people and software can request quantities such as net revenue by region without independently recreating the calculation each time.

### What is an example of a semantic layer?

A model that defines net revenue as completed-order amounts minus refunds, connects orders to regions, and lets dashboards and agents request that metric is one example. The formula, eligible records, reporting date and valid relationships all form part of the definition.

### How is a semantic layer different from a metric layer?

A metric layer focuses on standardized quantities and their calculations. A semantic layer generally also describes entities, dimensions and relationships. The terms overlap in product descriptions, so inspect what the implementation defines and how consumers query it.

### Is a semantic layer a database or a data catalog?

It is a different role. A database stores and queries records; a catalog documents and helps discover assets. A semantic layer maps those records to business definitions and provides a way for consumers to use them. A platform can combine these capabilities.

### Does a semantic layer make AI answers correct?

It can make calculations and relationships reusable, but the agent must still select the right metric, time window and scope. Source quality, access controls and the evidence behind an explanation require separate checks. A correctly executed query can still answer the wrong question.

## Related articles

- [Business glossary vs semantic layer](/blog/business-glossary-vs-semantic-layer/) — agreed terminology and executable definitions.
- [What is headless BI?](/blog/what-is-headless-bi/) — serving shared metrics across interfaces.
- [Apache Ossie guide](/apache-ossie/) — the open semantic standard and its scope.
- [What is a metric layer?](/blog/what-is-metric-layer/) — the metrics-focused part of the architecture.
