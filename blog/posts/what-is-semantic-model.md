---
title: "What Is a Semantic Model? Definition, Components & Example"
description: "See what a semantic model defines in an orders-and-customers example: metrics, dimensions, relationships, and its role in a semantic layer for BI and AI agents."
author: "Evan Paul"
date: 2026-06-08
lastmod: 2026-11-26
head:
  - - meta
    - name: keywords
      content: "semantic model, what is a semantic model, semantic model definition, semantic model vs semantic layer, semantic view, semantic model data engineering, semantic model example"
  - - meta
    - property: og:title
      content: "What Is a Semantic Model? Definition, Components & Example"
  - - meta
    - property: og:description
      content: "See what a semantic model defines in an orders-and-customers example: metrics, dimensions, relationships, and its role in a semantic layer for BI and AI agents."
  - - meta
    - property: og:type
      content: article
  - - meta
    - property: og:url
      content: https://datus.ai/blog/what-is-semantic-model/
  - - meta
    - property: og:image
      content: https://datus.ai/logo_dark.svg
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - link
    - rel: canonical
      href: https://datus.ai/blog/what-is-semantic-model/
---

# What Is a Semantic Model? Definition, Components & Example

## TL;DR

A semantic model describes what data means and how to use it: business entities, metrics, dimensions, relationships and rules. It can span several related datasets; the surrounding semantic layer makes those definitions available to supported reports, applications and agents.

## What is a semantic model?

**A semantic model is a structured representation of business meaning over data. It connects source fields to named entities, metrics, dimensions and relationships, so people and software can identify the intended calculation and grouping without reconstructing the logic from column names.**

Imagine a business user asking, “How much revenue came from customers in each region?” The database has order amounts and customer addresses. It does not necessarily tell the user which order statuses count as revenue, how an order connects to a customer, or which region definition the business uses. The semantic model records those choices.

A model is not inherently limited to one table or source. A revenue model may include orders, customers, refunds and a calendar, while a platform may split those concepts into smaller model files. File boundaries and product terminology vary. What matters is whether the definitions form a coherent, inspectable representation of the question the team wants to answer.

The model also cannot settle a business disagreement just by providing an expression. Finance might recognize revenue when payment clears, while an operations report tracks completed orders. Those are different definitions. Naming and describing them clearly lets a person choose the right one before a runtime executes the request.

## A concrete example: orders, customers and completed revenue

Use two datasets: `orders`, with one row per order, and `customers`, with one row per customer. Orders contain an amount, status, date and customer identifier. Customers contain the identifier and a region. The semantic model adds the meaning that turns those fields into an answerable business question.

For this teaching example, `completed_revenue` means the sum of order amounts where status is `completed`. It does not mean accounting revenue or net revenue after refunds. Giving the metric a specific name helps users understand that boundary instead of treating every column called revenue as interchangeable.

The model makes `customers.region` available as a grouping dimension and declares the relationship from `orders.customer_id` to `customers.customer_id`. A query can then request `completed_revenue` by region. The engine has both the calculation and the path needed to reach the grouping field; neither a formula catalogue nor a list of joins supplies both on its own.

<figure><picture><source media="(max-width: 600px)" srcset="/images/what-is-semantic-model/model-map-mobile.svg"><img src="/images/what-is-semantic-model/model-map.svg" alt="An orders-and-customers semantic model connects orders to customers by customer_id, defines completed_revenue, and exposes customer region as a grouping dimension" loading="lazy" decoding="async"></picture><figcaption>One model can connect several datasets. The metric rule and relationship together make “completed revenue by customer region” an explicit request.</figcaption></figure>

Here is the metric fragment from our downloadable Apache Ossie example:

```yaml
metrics:
  - name: completed_revenue
    description: Order amount from completed orders only
    expression:
      dialects:
        - dialect: ANSI_SQL
          expression: "SUM(CASE WHEN orders.status = 'completed' THEN orders.amount ELSE 0 END)"
```

This is an excerpt from the [complete model](/examples/semantic-model-examples/model.yaml), not a standalone model file. The `orders` dataset and the fields it references are declared elsewhere in that file. The fragment shows where the status rule lives; it does not establish that the underlying records are complete, unique or appropriate for a particular business report.

The model's relationship declaration supplies a separate piece:

```yaml
relationships:
  - name: orders_to_customers
    from: orders
    to: customers
    from_columns: [customer_id]
    to_columns: [customer_id]
```

The direction describes how the datasets connect. It does not repair duplicate customer identifiers in the database. If a customer has multiple rows, joining its orders to all of them can multiply revenue. A reviewed relationship therefore needs a source-data check as well as a valid declaration.

In the linked example's fictional records, completed revenue totals 330: East 250 and West 80. Those values belong to that sample, not a customer benchmark. The [semantic model examples walkthrough](/blog/semantic-model-examples/) provides the source records, generated query shape and expected results, so readers can follow the calculation rather than accepting a diagram as proof.

## The components of a semantic model

The exact names vary across implementations. Some use measures as intermediate calculations and metrics as public definitions; others use a different vocabulary. Evaluate what is represented and how it is executed, rather than assuming that matching labels mean identical behavior.

| Component | Meaning in the example | What to review |
| --- | --- | --- |
| Datasets | Orders and customers mapped to source records | Source, row grain and coverage |
| Entities and keys | Order and customer identities | Uniqueness and missing identifiers |
| Metrics | Completed-order revenue | Eligible records, units and aggregation |
| Dimensions | Customer region and order date | Valid grouping fields and time meaning |
| Relationships | Order to customer through customer_id | Cardinality, unmatched rows and join behavior |
| Descriptions and context | What completed revenue includes | Owner-approved meaning and exceptions |

**Metrics define calculations.** A number being stored in a numeric column does not make it a useful business metric. The model author still needs to choose the aggregation and population. Revenue may be additive, while average order value needs total revenue divided by the appropriate order count. Averages and percentages should be checked at the requested grain.

**Dimensions define perspectives.** Region, product category and month change how a quantity is grouped or filtered. A date field also has a meaning: creation, completion and payment are different events. Marking a field as a time dimension does not decide which event the business intended to report.

**Relationships define paths.** The question determines which path is meaningful. A customer's current region might differ from the region recorded when an order was placed. Both fields can be technically reachable and still answer different questions. Descriptions and model structure should help a consumer recognize that distinction.

**Context explains boundaries.** A description can state that a metric excludes test accounts or applies only to a particular business unit. An executable rule must actually implement the required scope, and the returned result must be checked. An instruction written next to a formula is not automatically a filter enforced by every runtime.

## Semantic model vs data model vs semantic layer

These terms describe related roles, not a universal hierarchy of products. A conceptual data model may already describe business concepts; a physical data model describes structures used to store them. A semantic model makes the meaning needed for analysis explicit, including calculations and supported relationships over those structures.

| Term | Main role | Example |
| --- | --- | --- |
| Physical data model | Organize stored records | Orders table, customer key, amount column |
| Semantic model | Describe analytical meaning | Completed revenue, customer region, valid relationship |
| Semantic layer | Expose and operationalize definitions | A service that resolves supported metric requests |
| Metric layer | Standardize metric calculations and access | Named KPIs served through an interface |

A model file describes definitions, but a file alone does not answer a live query. A runtime must interpret it, plan the supported calculation, obtain authorized data and return a result. The wider system also needs a way to maintain the definition and understand which version consumers use.

For the complete architecture and the distinction between source data and execution, read [what a semantic layer is](/blog/what-is-semantic-layer/). This article focuses on the contents of the model rather than repeating a platform comparison or a deployment guide.

## What about Power BI models and warehouse semantic views?

Product documentation uses “semantic model” for several implementation choices. In <a href="https://learn.microsoft.com/en-us/power-bi/connect-data/service-datasets-understand" rel="nofollow noopener">Power BI, a semantic model is the data model available for reporting</a>. Depending on its mode, it can contain imported data, query underlying sources, or combine approaches. The term therefore does not always mean a standalone YAML file.

A semantic view is another way to represent business meaning. <a href="https://docs.snowflake.com/en/user-guide/views-semantic/overview" rel="nofollow noopener">Snowflake semantic views can define metrics, entities and relationships</a> as database objects, and they can support analytical and agent use. It would be misleading to say that semantic views cannot express relationships or are only for human SQL users.

The useful comparison is architectural. Where is the definition stored, which engine interprets it, which interfaces can consume it, and how are changes reviewed? Versioning can be implemented around database definitions as well as file-based models. The existence of a database object does not by itself rule out a Git review process.

Portability also needs a concrete test. An export may preserve a metric expression while leaving access policies, unsupported calculations or a dashboard-specific behavior behind. Inspect the supported mapping and execute representative requests in the target runtime. A shared format is a useful contract, not a promise that every product capability transfers unchanged.

## How to build and validate the first model

Start with a business question rather than a target number of tables. Identify the intended result, the person responsible for its meaning and the records needed to calculate it. For the completed-revenue question, that means agreeing on status treatment, units, date scope and the region mapping before creating more definitions.

Next, inspect the sources and declare the datasets, dimensions and relationships. Write the calculation in a form that the chosen runtime understands. A reviewer should be able to trace a metric name to its expression and then to its inputs. If that path is opaque, adding more descriptions will not make the execution easier to verify.

Test model structure and numerical behavior separately. Structural validation can identify missing references or compilation errors. It cannot show that the approved business policy is correct or that a source join preserves the intended grain. Compare a small set of outputs with an independent reference under the same dates, filters and identity.

Use edge cases that make errors visible: a cancelled order, a missing customer, a duplicate key and a period with no records. Decide how null and zero should differ. Record the model revision and the expected result, so a later definition change can be checked against something more useful than whether a chart still renders.

An agent can help inspect source evidence and propose definitions. The reviewer still decides whether a candidate rule should become authoritative. There is no general percentage of correctness that makes an unreviewed financial or operational metric safe to reuse. Review depth should follow the consequence of a wrong answer and the evidence available.

## How Datus helps turn evidence into a reviewable model

Datus helps teams work from existing documents, SQL and data structures toward semantic definitions they can inspect and refine. The aim is to preserve business knowledge in a form that people and agents can reuse, rather than leave each new analysis to reconstruct it from raw tables.

DOSI provides an execution path for supported Apache Ossie models. Together, the model and runtime can make a named calculation available to different consumers, while keeping the definition open to inspection. Model approval, query scope, data access and numerical checks remain explicit responsibilities; generation does not eliminate them.

Explore the [Datus semantic layer solution](/solutions/semantic-layer/) for the overall approach and the <a href="https://docs.datus.ai/dev/subagent/semantic_modeling/" rel="nofollow noopener">semantic-modeling documentation</a> for the workflow. For the execution engine, see the <a href="https://dosi.datus.ai/" rel="nofollow noopener">DOSI documentation</a>. Datus Agent is open source; DOSI is distributed under Elastic License 2.0, separately from the Apache Ossie open standard.

## Conclusion

A semantic model makes the choices behind an analytical answer inspectable: what is measured, which records count, how the result is grouped and how datasets connect. Its usefulness comes from those decisions being clear and executable, not from the number of fields annotated.

Begin with one question, a small model and results a person can verify. Check the model under the actual runtime and consumer paths before expanding it. That gives analysts, business owners and agents a shared definition they can question, maintain and reuse.

## Frequently asked questions

### What is a semantic model in simple terms?

A semantic model explains the business meaning of data in a structured form. It names the metrics, dimensions and relationships needed to answer questions such as completed revenue by customer region.

### Can a semantic model include more than one table?

Yes. A model can connect multiple related datasets, such as orders and customers. The model format and platform determine how definitions are organized; a model is not universally one table or one source.

### How is a semantic model different from a semantic layer?

The model describes the definitions and relationships. The semantic layer is the surrounding system that makes those definitions available for use, including the relevant query and execution interfaces. Product terminology can overlap.

### What is a semantic model in Power BI?

It is a data model made available for reporting and analysis. Power BI models can use imported data or supported connections to underlying sources. Their storage and query modes differ from a standalone semantic-model file interpreted by another runtime.

### Can an AI agent generate a semantic model?

An agent can propose definitions using schema information, SQL and business context. Someone must still review the business meaning and verify representative results. Neither successful generation nor valid syntax proves that the model answers the intended question correctly.

## Related articles

- [Semantic layer requirements](/blog/semantic-layer-requirements/) — metric contracts and validation in a real running project.
- [What is a metric layer?](/blog/what-is-metric-layer/) — the metrics-focused role in an analytical system.
- [Business glossary vs semantic layer](/blog/business-glossary-vs-semantic-layer/) — where agreed terminology meets executable meaning.
