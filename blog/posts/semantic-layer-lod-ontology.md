---
title: "Datus October Update: Teaching the Semantic Layer the Business"
description: "Datus's October 2026 update: LOD metrics across grains, Ontology Mapping in Apache Ossie, Derived Subtypes, plus Datus Agent 0.4.4 and Dosi 0.2.0 release notes."
author: "Harrison Zhao"
date: 2026-10-31
tags: insight
lastmod: 2026-10-31
head:
  - - meta
    - name: keywords
      content: "semantic layer, level of detail, LOD metrics, ontology mapping, Apache Ossie, derived subtype, business rules, OntologyAnalyst, Datus Agent 0.4.4, Dosi 0.2.0"
  - - meta
    - property: og:title
      content: "Datus October Update: Teaching the Semantic Layer the Business"
  - - meta
    - property: og:description
      content: "Datus's October 2026 update: LOD metrics across grains, Ontology Mapping in Apache Ossie, Derived Subtypes, plus Datus Agent 0.4.4 and Dosi 0.2.0 release notes."
  - - meta
    - property: og:type
      content: article
  - - meta
    - property: og:url
      content: https://datus.ai/blog/semantic-layer-lod-ontology/
  - - meta
    - property: og:image
      content: https://datus.ai/images/semantic-layer-lod-ontology/semantic-ladder-metric-lod-ontology-rules.png
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - link
    - rel: canonical
      href: https://datus.ai/blog/semantic-layer-lod-ontology/
---

# Datus October Update: Teaching the Semantic Layer the Business

## TL;DR

- **Computing a metric correctly is only the first step of business analysis.** This month we taught the semantic layer which business objects its metrics describe, and how those objects relate.
- **LOD (Level of Detail)** lets a metric be computed at one grain and used at another. Since Dosi 0.1.14 that also works across fact tables and on top of composed metrics.
- **Ontology Mapping** ([PR #458](https://github.com/apache/ossie/pull/458), merged into Apache Ossie) splits Ontology, Semantic Model, and Mapping into separate documents. One ontology can now span many semantic models.
- **Derived Subtypes** in Dosi 0.2.0 turn business rules like "Premier Customer" into executable, versioned semantics.
- The releases: **Datus Agent 0.4.3 and 0.4.4** (a built-in OntologyAnalyst subagent, better lineage and context extraction) and **Dosi 0.1.13 → 0.2.0** (native Athena, Redshift and SAP HANA execution, MCP hot reloading).

![Metric, LOD, Ontology, and Rules: each step adds business meaning on top of the last](/images/semantic-layer-lod-ontology/semantic-ladder-metric-lod-ontology-rules.png)

*Each step adds meaning on top of the last one, and Dosi compiles all of it into SQL.*

In [September](/blog/semantic-layer-in-the-agent-loop/) we talked about why the [semantic layer](/blog/what-is-semantic-layer/) needs to live inside the agent loop, and how [Dosi](/blog/introducing-dosi/) gives data agents more deterministic computation through executable metric definitions, lineage, and attribution. In October we shipped Datus Agent 0.4.3 and 0.4.4, and Dosi moved from 0.1.13 to 0.2.0. Most of that work went into two things: **LOD (Level of Detail) and Ontology.**

The more time we spend with customers and on the product, the more convinced we are that **computing a metric correctly is only the first step of business analysis.** We want the semantic layer to know not just how a metric is calculated, but which business object it describes, and how that object relates to the others.

That is what this month's work is about. LOD, Ontology, and Derived Subtypes first; then the releases.

## 1. LOD: Metrics That Work Across Grains

A traditional semantic layer is mostly about defining and computing [metrics](/blog/what-is-metric-layer/). Real business questions, though, keep crossing grains. Take a common one: compute each customer's lifetime spend, use that number to put customers into segments, then compare order performance across those segments.

In SQL this usually means nested CTEs, subqueries, and layers of aggregation. A traditional metric definition, on the other hand, can only aggregate at whatever `GROUP BY` the final query uses.

Dosi 0.1.13 introduces [LOD (Level of Detail)](/blog/dosi-datus-agent-level-of-detail/). Borrowing from Tableau's LOD expressions, it adds three ways to compute a metric — `include`, `exclude`, and `fixed` — so a metric can be calculated at a grain different from the one in the final result.

For example, we can fix a customer's lifetime spend and order count at the Customer grain, then use them as customer attributes inside other metrics. You no longer need to pre-build a separate metric for every grain you might analyze at; the metric itself becomes far more composable.

![LOD: order rows are fixed at the Customer grain, grouped into segments, then used to count orders by segment](/images/semantic-layer-lod-ontology/lod-customer-grain-segments.png)

*Compute at one grain, use at another — no nested CTEs, no one-off metric per grain.*

In 0.1.14 we went further: LOD now works across fact tables, and on top of composed metrics. Metrics that live on different fact tables — orders, payments, site visits — can be combined under an explicit grain and explicit relationships, without the fan-out that a wrong join quietly introduces.

LOD matters to us for another reason too. **It lets a metric describe a trait of a business object — and those traits can become the foundation for business rules in the Ontology.**

## 2. Ontology: From Data Models to Business Objects

We've written before about [Ontology](/blog/what-is-ontology/) in Apache Ossie. It lets you define Entities, Properties, and Relationships on top of existing [semantic models](/blog/what-is-semantic-model/), so the data carries clear business meaning.

Picture a retail business. Customer, Store, Order, and Product are all business objects, connected by relationships like *buys*, *belongs to*, and *sold at*. The data team may already have built three separate semantic models — Sales, Membership, and Supply Chain. But business users don't think along the boundaries of data models when they ask questions.

That is where Ontology Mapping comes in. In October we contributed and merged [PR #458](https://github.com/apache/ossie/pull/458) upstream into Apache Ossie. It splits Ontology, Semantic Model, and Mapping into separate documents, so one ontology can span multiple semantic models, and one semantic model can be reused by different ontologies.

![Ontology, Mapping, and Semantic Model as three separate files: one ontology maps to many models, one model serves many ontologies](/images/semantic-layer-lod-ontology/ontology-mapping-semantic-models.png)

*Three separate files: business words on top, data models below, and a mapping in between.*

It sounds like a spec-level change, but I think it matters a lot. A data engineer usually knows their own domain well and has little visibility into every model and every piece of business logic across the company. With an ontology linking business concepts across semantic models, plus an agent that can explore, **we have a real chance to go beyond what any one person knows** and gradually surface hidden relationships between business domains.

To be clear, this doesn't mean every cross-source query now runs automatically. But we finally have an open way to describe and manage these relationships — without cramming the entire company's business model into one giant YAML file.

## 3. Derived Subtype: Business Rules as Executable Semantics

Another feature in Dosi 0.2.0 that I find especially interesting is **Derived Subtype**. It lets you define a new type of business object from an existing one, using a rule.

E-commerce and retail teams constantly need a definition like *Premier Customer*. We can write it as a rule: a customer whose lifetime margin is at least $5,000 and who has placed at least 6 orders is a Premier Customer.

Margin and order count here are exactly the kind of thing LOD computes at the Customer grain. The ontology's `derived_by` rule then defines `PremierCustomer` as a subtype of Customer.

From there, an agent can ask which customers are Premier Customers, look at their revenue and order performance, or raise the margin threshold from $5,000 to $7,000 and see how the segment — and overall performance — shifts.

The metric computation, the customer classification, and the filter conditions are all compiled into SQL by Dosi. The business rule can be versioned, validated, and reused; the agent's job is to understand the question, adjust the parameters, and explore the results.

To me, this is one of the most important ways an ontology goes beyond a traditional metrics platform. Every company is full of rules like this — high-risk orders, active members, underperforming stores — scattered across SQL, documents, and people's heads. Once those rules are made explicit, **an agent can finally do complex analysis inside a semantic environment it can trust.**

## October Releases

In October, Datus Agent shipped 0.4.3 and 0.4.4, and Dosi moved from 0.1.13 to 0.2.0. LOD, Ontology Mapping, and Derived Subtypes are covered above; here is how the rest of the release takes the semantic layer into the [data agent](/blog/what-is-data-agent/).

### Datus Agent 0.4.3 → 0.4.4

Datus Agent 0.4.4 adds a built-in **OntologyAnalyst subagent**. It uses the ontology's concepts, relationships, and mappings to query metrics and explore detail-level data.

Meanwhile, 0.4.3 strengthens automatic extraction of lineage and business context from historical SQL, project code, and metadata, and integrates Dosi more deeply into the agent. The idea is that you start from the data systems and business logic you already have, and build up semantic models and an ontology step by step — not kick off yet another massive data governance project.

### Dosi 0.2.0 and Datus Studio

Dosi 0.2.0 adds native execution on **Athena, Redshift, and SAP HANA**, and improves hot reloading of models over MCP, making it easier to plug the semantic layer into Claude Code, Codex, and other agents.

On the product side, we keep building out Datus Studio, bringing metric modeling, lineage, ontology, and agent-driven exploration into one place. For existing data teams, we want it to be a single workspace for managing and consuming business semantics.

![Datus Agent, Claude Code, Codex, and Datus Studio sit on top of Dosi 0.2.0, which compiles LOD, Ontology, and Derived Subtypes to SQL for Athena, Redshift, and SAP HANA](/images/semantic-layer-lod-ontology/dosi-0-2-0-agent-stack.png)

*Agents and Studio on top, Dosi in the middle, native engines below.*

## Wrapping Up

Looking back, both LOD and Ontology extend the metric system we already had. LOD lets metrics compose across grains; Ontology goes further and defines business objects, the relationships between them, and the rules around them.

In other words, **the value of a semantic layer can grow from delivering accurate metrics to helping agents understand the business.**

In real companies, the questions people want answered are rarely as simple as "what's this metric?" When a store's sales drop, is it foot traffic, conversion, supply chain, or store operations? How does the business define "abnormal"? Which rules need to change, and what should happen next?

Questions like these require exploration across metrics and across data domains, and they require a lot of business knowledge. With the open Apache Ossie standard and Dosi's deterministic computation, we want agents to reason on a more controllable, more trustworthy foundation — moving from answering data questions to finding problems, exploring rules, and improving workflows, and ultimately creating real business value.

That, more or less, is why we keep investing in the semantic layer and in ontology.

[Datus Agent](https://github.com/Datus-ai/Datus-agent) 0.4.4 and <a href="https://dosi.datus.ai/" rel="nofollow noopener">Dosi</a> 0.2.0 are out now, along with [Datus Studio](https://studio.datus.ai/) and the ontology work in [Apache Ossie](https://github.com/apache/ossie). Give them a try.

## Related articles

- [Datus September Update: The Semantic Layer in the Agent Loop](/blog/semantic-layer-in-the-agent-loop/) — last month's update, and the loop this month's work builds on.
- [DOSI 0.1.13 + Datus Agent 0.4.3: Getting the Level of Detail Right](/blog/dosi-datus-agent-level-of-detail/) — a deeper look at LOD expressions.
- [What Is an Ontology? Definition, Three Productizations & AI Agents](/blog/what-is-ontology/) — the business objects, relationships, and rules behind Ontology Mapping.
- [Semantic Layer vs Ontology: Why AI Agents Need Both](/blog/semantic-layer-vs-ontology/) — how the metric plane and the entity plane fit together.
- [Introducing Dosi: OSI-Native Semantic Layer for Metrics](/blog/introducing-dosi/) — the engine that compiles Apache Ossie models to native SQL.
