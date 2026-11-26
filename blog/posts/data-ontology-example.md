---
title: "Data Ontology Example: A Retail Model for AI Agents"
description: "Explore a data ontology example for retail: connect customers, orders, refunds and memberships, map them to data, and verify the answers an AI agent receives."
author: "Evan Paul"
date: "2026-11-26"
lastmod: "2026-11-26"
heroImage: "/images/data-ontology-example/cover.jpg"
heroImageAlt: "Illustrated retail customer, purchases, returns and membership connected as business concepts"
head:
  - - meta
    - name: keywords
      content: "data ontology example, ontology model, ontology graph diagram, retail ontology, ontology for AI agents, Apache Ossie ontology mapping"
  - - link
    - rel: canonical
      href: https://datus.ai/blog/data-ontology-example/
---

# Data Ontology Example: A Retail Model for AI Agents

## TL;DR

A useful data ontology example connects named business concepts to actual data and testable questions. This retail model separates customer eligibility from approved membership, maps the relationships to warehouse records, and lets DOSI answer requests whose paths and results can be inspected.

## Start with the business distinction an agent must understand

A retailer asks an agent, “Who qualifies for Premier, and which benefits can we offer them?” That sounds like one question. It contains several: what qualifies a customer, whether the business has approved their membership, and which benefits belong to that membership version. The answers may come from related records, but they are not interchangeable.

Northstar Living, the fictional furniture retailer used here, provides a concrete data ontology example. Customers place orders; orders contain product lines; deliveries, returns and refunds affect their commercial history. Membership records describe a separate business decision. All customer names and transactions in the downloadable fixture are invented.

**The ontology model names those objects, their identifiers and relationships. A mapping binds the concepts to a semantic model, and the runtime executes supported requests against the data. The useful artifact is therefore more than a diagram: it is a relationship graph with a checkable route to records and calculations.**

For the general definition, read [what an ontology is](/blog/what-is-ontology/). This walkthrough concentrates on constructing and checking a small model. It reuses the Northstar dataset from our [Premier customer calculation example](/blog/dosi-semantic-layer-northstar-example/), while adding the complete relationship model and separate mapping files rather than repeating the margin tutorial.

## Define concepts before drawing the ontology graph

Start with the concepts needed for the business question, not every table in the warehouse. In this example, a customer and an approved membership must have separate identities. Otherwise, changing a qualification threshold could accidentally be interpreted as changing a business agreement that already exists.

The model contains Customer, Order, OrderLine, Product, Delivery, LineCost, Return, Refund, Membership, Benefit and BenefitEntitlement. Some represent business objects, some represent events, and one represents the link between an approved membership and a benefit. Their identities keep two transactions, two membership terms or two refund events from being mistaken for the same thing.

A qualification flag is a property on Customer in this fixture; there is no separate `PremierCustomer` entity type. The flag answers whether the customer satisfies a particular rule. Membership instead has its own identifier, validity dates, rule version and benefit version. This design keeps “eligible under a calculation” distinct from “holds this approved membership term.”

BenefitEntitlement makes another distinction visible. It connects a membership to a particular benefit, instead of placing every benefit directly on Customer. In this demo it is a read-only interpretation of approved membership records and an illustrative benefit catalogue. It is not evidence of redemption activity or an automated activation workflow.

That boundary is worth deciding before model generation. An agent can propose an object called Member because the business uses that word. The reviewer needs to establish whether it means a customer category, an application awaiting approval, or an approved term. Choosing the wrong concept would produce a misleading graph even if every join compiled.

## The ontology graph diagram: keep relationship names and direction

The graph below comes directly from the downloadable ontology. Its 11 arrows preserve the declared concept-to-concept relationship names and directions; scalar attributes such as a customer name or refund date are omitted to keep the picture readable. A relationship label describes a role, not simply the fact that two tables happen to share a key.

<figure><a href="/images/data-ontology-example/ontology.svg" target="_blank" rel="noopener"><picture><source media="(max-width: 600px)" srcset="/images/data-ontology-example/ontology-mobile.svg"><img src="/images/data-ontology-example/ontology.svg" alt="Northstar ontology graph with 11 concepts and 11 named relationships, including Order placed_by Customer, OrderLine part_of Order, Refund credits OrderLine and Membership held_by Customer" loading="lazy" decoding="async"></picture></a><figcaption>Generated from the actual ontology. Arrows follow the child-to-parent roles used by the mapping; click to open the complete graph. Eligibility is a Customer property, not a membership-approval action.</figcaption></figure>

Consider three useful paths. `Order.placed_by` identifies the customer who placed an order. `OrderLine.part_of.placed_by` reaches that customer from a line. `Refund.credits.part_of.placed_by` traces a refund to the line it credits, then the order and customer. Each names what the connection means, not just which columns can be joined.

Direction matters when reading the graph. A business description might say “a customer places orders,” while the executable model declares `Order → placed_by → Customer`. These are compatible descriptions viewed from opposite directions, but they do not imply that every query API exposes a reverse collection automatically. Use the relationships and query roots the runtime actually provides.

Refunds show why that precision helps. A refund can credit an order line without a related return event, as with a goodwill refund. A returned item can also have several associated events. Treating “return” and “refund” as synonyms could drop legitimate refunds or count a single order several times. Separate concepts let the model preserve those differences.

The graph should also reveal limits. A Benefit node describes a benefit; it does not prove that anyone redeemed it. A Membership link represents a recorded term; it does not prove that a proposed qualification rule was approved. The reviewer should be able to point at the entity that supplies each claim before asking an agent to explain it.

## Bind the business model to datasets and fields

An ontology becomes queryable only when its concepts and relationships have a supported mapping. Here the implementation uses three separate files: the ontology describes meaning, the semantic model defines datasets and calculations, and the mapping connects them. Keeping the roles separate makes it easier to inspect whether a business concept resolves to the intended source. The <a href="https://dosi.datus.ai/reference/ontology/" rel="nofollow noopener">DOSI ontology reference</a> describes the supported ontology and mapping interface.

The following excerpt declares the `placed_by` relationship. It comes from the supplied ontology file; it is a fragment, not a complete standalone document.

```yaml
- concept: Order
  type: EntityType
  identify_by: [id]
  relationships:
    - name: placed_by
      roles:
        - concept: Customer
      multiplicity: ManyToOne
```

The mapping binds Order identity to `orders.order_id` and the related Customer identity to `orders.customer_id`. Customer itself maps to `customers.customer_id`. The runtime can then resolve a request expressed in business concept paths using the datasets and relationships in the semantic model.

```yaml
ontology_ref:
  name: NorthstarBusinessOntology
  iri: ./northstar.ontology.yaml
semantic_model_ref:
  name: northstar_complete
  iri: ./model.yaml
```

These references are the opening of the supplied mapping document; its `concept_mappings` section contains the actual identity and relationship bindings. A reference to a model is not a substitute for that mapping. Inspect both when a concept can be described but cannot be queried as expected.

The source model distinguishes physical sources from semantic datasets. This fixture has nine warehouse tables and eleven semantic datasets. The benefits catalogue is inline, and entitlement rows interpret the approved membership records; they are not additional warehouse transaction tables. Counting nodes alone would hide that difference.

The same inspection applies to cardinality. The ontology declares an order as placed by one customer, while that customer can have multiple orders. The source must still contain reliable keys. An annotation cannot repair duplicate identifiers, reconstruct a missing customer, or decide which identity represents the same person across systems.

## Connect business rules to the right calculations

Customer eligibility is a testable rule over reviewed measurements. In this example, rule A requires contribution margin of at least $3,000, at least six distinct delivered orders and an order return rate no greater than 20%. These are Northstar's fictional policy choices, not suggested universal thresholds for a loyalty program.

The model supplies customer-grain fields for margin, order count, return rate and the resulting eligibility flags. Contribution margin combines booked merchandise revenue, refunds, product costs and the stated variable costs. It is not corporate net profit. Its inputs live at several grains, so joining every source event into one wide table and summing would risk counting the same amount repeatedly.

DOSI composes the measurements from their separate source grains and attaches the relevant values to Customer. The ontology then exposes those fields as concepts such as `Customer.margin` and `Customer.return_rate`. The relationship model helps identify the subject; the semantic calculation supplies the number used to evaluate the rule.

Time is part of that meaning. The sample uses delivered orders in the half-open interval from September 20, 2025 to September 20, 2026, with received returns and posted refunds before October 20, 2026 UTC. A late received return can therefore affect the frozen cohort. Replacing those boundaries with “last year” would describe a different calculation.

This is also why source units belong in the review. Amounts are stored as USD cents in the transaction sources, while the displayed customer margin is in dollars. A threshold of 3,000 must be compared to the correct unit. Neither a familiar metric name nor a plausible-looking result establishes that this conversion happened correctly.

## What an agent can ask of this model

An agent can use the model to identify a subject, inspect available fields and follow named relationships before requesting records. The conversation below is illustrative; the DOSI field requests and returned data were actually executed. It is not a screenshot or transcript of a live language-model session.

> **Business user:** Which customers qualify for Premier under rule A? Show their margin, delivered orders and return rate.
> **Agent's request:** Start from Customer, select the customer fields and filter `Customer.premier = true`.
> **Answer to inspect:** Maya Chen, Daniel Brooks and Sofia Rivera qualify in the fictional snapshot.

The request uses these concept paths:

```json
{
  "from": "Customer",
  "fields": [
    "Customer.id", "Customer.name", "Customer.margin",
    "Customer.order_count", "Customer.return_rate", "Customer.premier"
  ],
  "where_sql": "Customer.premier = true"
}
```

The fixture's executed output includes:

| Customer | Contribution margin | Delivered orders | Order return rate | Rule A |
| --- | ---: | ---: | ---: | --- |
| Maya Chen | $7,325.24 | 8 | 12.50% | Qualifies |
| Daniel Brooks | $3,308.16 | 7 | 0.00% | Qualifies |
| Sofia Rivera | $3,188.49 | 6 | 16.67% | Qualifies |

Other customers explain the boundary. Lucas Martin has $5,415.29 margin but a 33.33% return rate, so high margin alone does not qualify him. Priya Shah has $4,359.59 margin but only five eligible orders. Noah Kim has no eligible orders; margin and return rate remain null rather than becoming reassuring zero values.

A follow-up can investigate a particular object path. For example, starting at OrderLine, request its identifier, the parent order, the customer who placed that order and the purchased product. The demonstrated paths are `OrderLine.part_of.id`, `OrderLine.part_of.placed_by.name` and `OrderLine.purchases.name`.

This is a different task from computing a customer total. The row-level request retains order-line grain, while the qualification request is rooted at Customer. The agent needs to choose the root that matches the question; moving between the two without considering grain could multiply a customer-level value across every line.

The returned SQL and rows are available in the downloadable evidence. That provides something more useful than an answer alone: a reviewer can see which concept paths were requested and which sources and calculation the runtime resolved. It still does not mean the agent chose the right policy for an ambiguous business question.

## Change the qualification rule without rewriting membership history

A rule change should change the classification it defines, not silently rewrite every related business fact. The example includes rule B, which raises the margin requirement to $4,000 while leaving the order-count and return-rate conditions unchanged. Both flags are exposed so a reviewer can compare the two definitions against the same data snapshot.

Under rule B, Maya Chen remains eligible; Daniel Brooks and Sofia Rivera no longer meet the margin threshold. The existing membership records still name their approved rule-A terms and benefit version. A different current qualification result does not itself revoke those recorded terms or authorize the agent to modify them.

This is the practical value of separating Customer from Membership. “Who qualifies now?” is a calculation under a rule. “Who has an approved term?” is a query about recorded state and validity dates. “Should a benefit be changed?” is an operational decision requiring the organization's process and authority.

The demo reads membership and entitlement information but performs no approval, activation, redemption or revocation. A production application could implement those actions around reviewed data, but they should not be inferred from the presence of an ontology relationship. The graph identifies the business objects; it does not grant permission to change them.

## Check the model with questions that can fail

A useful acceptance check should distinguish two plausible answers, not just show that a query runs. For the relationship model, ask for an order line together with its customer and product. The result should preserve one row per line and use the declared roles. If a customer appears under the wrong order, the problem is the mapping or identity evidence, even if the monetary totals look reasonable.

For the policy boundary, compare current qualification with the recorded membership term. Rule B changes Daniel and Sofia's eligibility flags in this snapshot, while the membership query continues to return their recorded rule-A terms. A system that reports those terms as revoked has inferred an action that the data and demo do not contain. This check tests business meaning rather than arithmetic alone.

For missing evidence, inspect Noah's result. The absence of eligible orders leaves margin and return rate null. A zero return rate would suggest observed orders with no returns, which is a different claim. The eligibility result can be false without inventing an observation that the source does not provide.

Finally, separate a valid concept path from permission to use it. The local fixture is a single-user demonstration; it does not test row-level or column-level access for several employees. Production use needs queries under the actual application identities and checks on what a shared report exposes. Correct relationships do not, by themselves, establish an access-control policy.

## How Datus supports the workflow

Datus helps teams turn business knowledge, existing SQL and data structures into context and models they can inspect. The aim is to expose definitions and relationships that an agent can reuse, while keeping the source evidence and the business owner's review visible.

DOSI provides the supported execution path for the supplied semantic definitions and concept queries. The <a href="https://docs.datus.ai/dev/subagent/ontology_analyst/" rel="nofollow noopener">OntologyAnalyst documentation</a> describes how Datus uses ontology concepts and relationships when answering questions. This article's local fixture demonstrates the underlying queries; it does not claim to be an end-to-end Studio approval workflow.

Explore the [Datus ontology solution](/solutions/ontology/) for the overall approach. Datus Agent is open source, DOSI uses Elastic License 2.0, and Apache Ossie is the open standard. Sharing that standard does not guarantee another runtime supports every calculation or extension used in this example.

## Run the example and inspect the artifacts

The [downloadable Northstar ontology example](/examples/data-ontology-example/northstar-ontology-example.zip) includes the synthetic CSV records, schema, model, separate ontology and mapping documents, expected results and a verification script. It rebuilds a local database rather than requiring a cloud warehouse or an AI account.

The package was checked with DOSI CLI 0.2.2. The verifier compares all eight customer records with the saved expectations, checks the rule-A and rule-B classifications, exercises a multi-hop line query and queries the recorded memberships. It preserves the executed SQL and outputs; structural validation and numerical comparisons are separate checks.

For a quick inspection, open the [ontology](/examples/data-ontology-example/northstar.ontology.yaml), [mapping](/examples/data-ontology-example/northstar.mapping.yaml) or [verification results](/examples/data-ontology-example/verification.json). The README explains how to rebuild and run the fixture, including the required local tools. The article stays focused on the modeling choices rather than turning into a sequence of UI instructions.

## Conclusion

A data ontology becomes useful when its concepts, identities and relationship roles make a business question more precise, and a mapping connects that meaning to records a runtime can query. The Northstar example makes one distinction especially visible: qualification, approved membership and benefit entitlement belong to related but separate parts of the model.

Start with a decision that exposes a real ambiguity. Name the objects, bind the relationships, check representative requests and preserve the evidence. Expand the ontology after that path works; a larger graph is not a substitute for a correct, reviewable answer.

## Frequently asked questions

### What is a simple data ontology example?

A retail model connecting Customer, Order, OrderLine, Product, Refund and Membership is one example. Named relationships explain who placed an order, which product a line purchases and which customer holds an approved membership.

### How is an ontology graph different from a database diagram?

A database diagram shows structures and key relationships. An ontology graph names business concepts and roles, which may map to those structures. The mapping is essential: drawing Customer connected to Order does not itself define an executable join or a qualification rule.

### Does this example need a graph database?

No. This fixture uses a local DuckDB database and DOSI's supported ontology mapping and semantic execution. That demonstrates this implementation, not a claim that every ontology system uses the same storage or query architecture.

### Can the agent approve Premier customers automatically?

No approval action is implemented in this example. It calculates eligibility and reads existing memberships. Approval, benefit activation and revocation are separate business operations that would require an authorized application workflow.

### Can I reuse these definitions in another runtime?

Check the target runtime's support for the model, mapping and extensions, then execute representative requests. A shared specification helps describe the contract but does not prove equivalent behavior across implementations.

## Related articles

- [Semantic-Layer-Based Ontology](/blog/semantic-layer-based-ontology/) — the relationship between business concepts and semantic calculations.
- [Ontology for AI Agents: Five Approaches](/blog/ontology-for-ai-agents-five-approaches/) — different architectural choices.
- [Data Context Layer: Five Checks Before You Buy](/blog/data-context-layer-evaluation/) — evidence to request during evaluation.
