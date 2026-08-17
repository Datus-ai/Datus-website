---
title: "What Is an Ontology? Definition, Three Productizations & AI Agents"
description: "Ontology in data and AI: classes, relationships, and rules — and the three productizations buyers confuse in 2026: OWL/RDF, Palantir, and SQL ontologies."
author: "Kostja"
date: 2026-08-17
lastmod: 2026-08-17
head:
  - - meta
    - name: keywords
      content: "ontology, ontology in data, ontology vs semantic layer, OWL RDF, Palantir Ontology, SQL ontology, knowledge graph, ontology for AI agents"
  - - meta
    - property: og:title
      content: "What Is an Ontology? Definition, Three Productizations & AI Agents"
  - - meta
    - property: og:description
      content: "Ontology in data and AI: classes, relationships, and rules — and the three productizations buyers confuse in 2026: OWL/RDF, Palantir, and SQL ontologies."
  - - meta
    - property: og:type
      content: article
  - - meta
    - property: og:url
      content: https://datus.ai/blog/what-is-ontology/
  - - meta
    - property: og:image
      content: https://datus.ai/logo_dark.svg
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - link
    - rel: canonical
      href: https://datus.ai/blog/what-is-ontology/
---


# What Is an Ontology? Definition, Three Productizations & AI Agents

An agent reports that 400 machines are overdue for calibration. The number is precise — and the wrong set of machines, because a base class's rule was applied to subtypes that override it. This entry defines ontology in data and AI, and when agents actually need one.

## TL;DR

- An **ontology**, in data and AI work, is a formal, machine-readable model of a domain: the classes of things that exist, the properties they carry, the relationships allowed between them, and the rules that must hold — independent of which warehouse table stores the rows.
- It is **not** a [semantic layer](/blog/what-is-semantic-layer/) (which maps those concepts onto executable metrics and SQL), **not** a taxonomy (which is mostly hierarchy), and **not** automatically a knowledge graph (which is one way to store and traverse the model).
- Three productizations confuse buyers in 2026: **W3C OWL/RDF** ontologies for open-world reasoning; **Palantir Ontology** as an operational object/action/security system; and **SQL ontologies** that virtualize concepts over existing warehouses without a graph database.
- Agents fail ontology problems as **wrong identity**, not wrong arithmetic: the metric is computed exactly, and the rows still come back from the wrong class.
- You need an ontology when questions cross entities, subtypes, and domain boundaries. You need a semantic layer when the question is how to measure. Most production stacks need a light version of both, not a full OWL toolchain. For the dedicated comparison, see [semantic layer vs ontology](/blog/semantic-layer-vs-ontology/).

## 1. Ontology: a working definition

Search results still mix Aristotle, OWL primers, and Palantir screenshots. In analytics the useful sense is narrower: an argument about whether "in service" means owned by the plant, leased, or merely present on site is already an ontology dispute. The formal artifact is that argument written so software can use it.

A useful working definition:

> **An ontology** is a formal, machine-readable specification of a domain: the classes of things that exist (`Customer`, `Contract`, `Shipment`), the properties those classes may have, the relationships that may connect them (`Customer places Order`), and the constraints that must hold (`a Subscription cannot remain active after its Contract end date`). It answers "what is this, and how does it relate?" rather than "how do I calculate this metric in SQL?" It is implementation-independent: moving `orders` from Snowflake to BigQuery does not change whether an `Enterprise Customer` is a kind of `Customer`. It is not a semantic layer, not a catalog of tables, and not automatically a graph database — those are neighboring layers that consume or store the model.

That definition has four pieces that have to travel together. Drop classes and you have a glossary. Drop relationships and you have a taxonomy. Drop constraints and you have a diagram that cannot reject illegal states. Drop machine-readability and you have a Confluence page that an agent cannot query. The reason ontologies keep reappearing in 2026 AI architecture posts is the last piece: large language models are fluent at labels and weak at identity. They will read a `calibration_policy` column as an ordinary attribute and miss that `ProductionTool` overrides it, because subtype identity is not something a column name can carry. An ontology is the place you write that a `ProductionTool` is an `Equipment` whose policy differs, unless the typed hierarchy says so.

What an ontology is **not** follows directly. It does not know that `days_overdue` is computed from `calibration_certificates` filtered by `status = 'valid'`. That mapping is the job of a semantic model and the semantic layer that executes it. An ontology that tries to become the query engine usually collapses into an unmaintainable hybrid: too formal for analysts, too vague for SQL.

## 2. Taxonomy, knowledge graph, semantic layer: the neighbors that get mislabeled

Four terms get used as if they were synonyms. They share a family resemblance and fail different jobs.

| Abstraction | Primary job | Typical artifact | What it cannot do alone |
| --- | --- | --- | --- |
| **Taxonomy** | Arrange concepts in a hierarchy | Industry → Sector → Ticker | Typed non-hierarchical relations (`Customer places Order`); inference beyond parent/child |
| **Ontology** | Define classes, properties, relations, rules | OWL/RDF, SQL ontology, object model | Execute warehouse SQL; certify a KPI formula |
| **Knowledge graph** | Store and traverse instance data as nodes and edges | Neo4j, RDF store, virtual graph | Invent the schema of meaning; a graph without an ontology is just linked rows |
| **Semantic layer** | Map business concepts to executable metrics, dimensions, joins | MetricFlow YAML, Cube model, LookML | Reason about subtype identity ("enterprise customer") independently of a measure |

Read the table as a stack, not a menu. A taxonomy is often the `is-a` slice of an ontology. A knowledge graph becomes ontological only when node and edge types are constrained. A semantic layer is the execution plane that makes `days_overdue` the same number in a dashboard and in an agent. Confusing the last two is the expensive mix-up; the dedicated comparison is in the TL;DR and FAQ.

The practical test is the question you are trying to answer. "Is this row a `TestBench` or a `ProductionTool`?" is ontology. "What is the mean time between calibrations for production tools this quarter?" is semantic layer, *once* the class is defined. Teams that buy a graph database to fix inconsistent metrics usually discover they bought a store for a model they never wrote.

## 3. Three productizations that RFP teams flatten into one SKU

Search "ontology" in 2026 and you will land on three incompatible productizations. Treating them as one SKU is how RFPs go sideways.

**W3C OWL and RDF.** The <a href="https://www.w3.org/TR/owl2-overview/" rel="nofollow noopener">OWL 2 Web Ontology Language</a> is the standards-track way to write classes, properties, and axioms so reasoners can check consistency and infer facts. RDF provides the graph data model underneath. This stack is the right tool when the domain is genuinely open-world, multi-source, and inference-heavy — life sciences, government statistical publishing, some supply-chain graphs. The cost is real: URI management, reasoner behavior, SPARQL, and a toolchain most warehouse teams do not run. OSI's ontology working group exists in part to *map* this world into analytics interchange rather than replace it; see [OSI vs RDF/OWL](/blog/osi-vs-rdf-owl/) for that bridge.

**Palantir Ontology.** Palantir's Foundry Ontology is an operational system: object types, link types, actions, functions, and security bound together so applications and AIP agents can read *and write* against a live object graph. Palantir's own <a href="https://www.palantir.com/docs/foundry/architecture-center/ontology-system/" rel="nofollow noopener">architecture writing</a> states that this fourfold integration of data, logic, action, and security cannot be accomplished with a thin semantic layer. If you need writeback, kinetic actions, and object-level policy in one platform, this is the shape. If you need portable metric definitions for BI, it is the wrong purchase. The trade-off is coupling: you adopt the platform to get the ontology.

**SQL ontologies / virtual knowledge graphs.** A third camp models concepts, relationships, inheritance, and measures in SQL over data that never leaves the warehouse. No SPARQL requirement, no separate graph store, traversals compiled to push-down SQL. This is the pattern [Timbr](/blog/what-is-timbr/) describes as an ontology-based semantic layer — the closest productization to what most data-engineering teams can actually operate. It is cheaper than OWL operations and less operational than Palantir, with less writeback and less formal inference. You still add a modeling layer and a governance process.

The three share a claim — meaning should be explicit — and disagree about where it lives, who can query it, and whether it can act. An honest architecture review names which of the three you are buying before you compare vendors inside one camp.

## 4. Open-world vs closed-world: the design input nobody declares

Underneath the three productizations sits an assumption that almost never makes it into the RFP: what an unanswered question means. W3C-style OWL is typically **open-world** — if the model does not state that a `TestBench` follows the base calibration policy, a reasoner treats that as *unknown*, not as false. Warehouse SQL is **closed-world** — if the join produces no row, the answer is empty. Analytics teams almost always want closed-world execution even when they want open-world documentation. That tension is a design input, not a religious war.

The three productizations map onto this line. OWL is the open-world camp by construction: its reasoners are built to leave facts undecided. SQL ontologies are the closed-world camp: every virtual concept compiles to a join, and a join with no rows returns nothing. Palantir's object graph sits between them but leans closed-world, because an operational system that lets agents act on objects cannot dispatch an action on "unknown".

The default, though, is inherited rather than chosen. The warehouse behaves closed-world before anyone opens an ontology editor, and "no row means no" quietly becomes the behavior of every agent that queries it. When a certificate is absent, the agent answers "not calibrated"; a reasoner might answer "unknown". Both readings are defensible, and only one is usually declared. Teams that flatten the three SKUs into one purchase without deciding this input are buying open-world semantics while running closed-world workloads — the mismatch shows up as confidently wrong answers in the walkthrough below.

## 5. Identity failures in agent pipelines: wrong subject, not wrong arithmetic

A text-to-SQL pipeline has a well-known failure taxonomy: intent, schema linking, synthesis, validation. Ontology failures sit mostly in linking and in the question *behind* intent. The model heard "equipment" and linked it to a table. The table held the wrong class of rows.

That is why "just add a semantic layer" is an incomplete agent strategy. The semantic layer tells the agent how to measure `days_overdue`; it does not tell it whether the subject is a `ProductionTool` or a leased unit. Agents that only consume metrics will be consistently wrong at identity even when they are consistently right at arithmetic. Agents that only consume an ontology will talk fluently about equipment and still emit SQL that ignores grain and certified filters. The architecture that holds in production is layered. The ontology constrains which entities and relationships are legal to mention. The semantic layer binds those entities to metrics and join paths. A data engineering agent *builds and refreshes* both as schemas move; analyst-facing agents *consume* them. Palantir is explicit that its Ontology is not a thin semantic layer; Timbr is explicit that a metric-only layer does not give agents a grammar of reasoning. Both claims can be true because they describe different layers.

The failure shows up the same way in practice. A plant keeps `equipment`, `calibration_certificates`, and `lease_contracts`. A compliance agent is asked: "Which machines are overdue for calibration?" Without an ontology, schema linking binds "calibration" to any row with a certificate, joins by `equipment_id`, and ranks by days since the last `status = 'valid'` record. The ranking is arithmetically exact and wrong by membership. `TestBench` overrides the calibration interval it inherits, so the base-class policy is applied to rows it does not govern. Leased machines are calibrated on the vendor's system, so their certificates are absent; the query reads absence as "never calibrated" and pulls them into the list. The metric was never wrong. The class was.

Two more failures share the same root. **Label collision**: `calibration` means the certificate status in the quality system, the hours booked in the maintenance system, and the lease obligation in the contracts system. Each system is locally consistent; the cross-system question — "which machines are production-ready?" — silently mixes the three readings. A semantic layer can freeze the `days_overdue` formula and still attach it to the wrong reading of machine. **Scope creep in domain agents**: a compliance agent asked to "include everything about equipment" will pull maintenance hours and contractor invoices if the only map it has is schema similarity. Domain boundaries — which classes belong to quality, which to contracts — are ontology, even when stored as a subject tree rather than OWL.

With a minimal ontology the agent is not allowed to treat those rows as interchangeable. `Equipment` is a class; `ProductionTool` and `TestBench` are subtypes that inherit and override `calibration_policy`. `CalibrationCertificate` certifies an `Equipment` through a typed relationship, and `lease_contracts` changes which equipment the plant may report on. The agent queries the typed hierarchy instead of a column, and roll-up to an `EquipmentGroup` happens at a declared grain.

Notice what did *not* need OWL. No open-world inference was required, and no reasoner had to prove that a test bench is equipment. The win was naming the subtype overrides and forbidding the "absence means never calibrated" reading — which is exactly the closed-world decision from the previous section. That is the production-sized ontology most data teams actually need: typed identity, not a dissertation.

The same walkthrough is how you evaluate vendors. If a product can certify the calibration policy and still lets the agent rank at base-class grain, it is a metric layer doing ontology's job badly. If a product can express the class map but cannot bind the policy to the certificates SQL, it is an ontology that still needs a semantic layer.

For data engineering teams the implication is unglamorous: someone has to author and evolve the class map. If you do not, every new agent re-derives it from column names. That re-derivation is cheap in a demo and expensive in a regulated metric.

## 6. A light ontology before a heavy one

Use an ontology-first approach when the painful questions are about **what things are**: identity, subtypes, allowed relationships, domain scope, writeback to objects. Skip a formal ontology — and invest first in a semantic layer and a metric layer — when the painful questions are about **how things are measured**: one certified `days_overdue`, consistent time grain, BI-tool agreement.

A short checklist before you start an ontology program:

1. Write down three questions that currently produce two conflicting "equipment" lists. If you cannot, you do not have an ontology problem yet.
2. Name the classes and the forbidden joins in one page. If that page already matches your semantic model's entities, extend the semantic model; do not stand up a second system.
3. Decide closed-world versus open-world *in writing*. Analytics defaults to closed-world.
4. Decide whether you need actions/writeback (Palantir-shaped), warehouse-native SQL traversal (SQL-ontology-shaped), or interchange with existing OWL (standards-shaped).
5. Assign an owner who will reject illegal states, not only add classes. An ontology without rejection is a second glossary.
6. Bind each class you care about to at least one certified metric or dataset. Unbound classes become philosophy.

Lightweight ontology-like structure is often enough: a subject tree of domains, typed relationships in a semantic model, and agent scope that cannot see out-of-domain tables. Heavier stacks earn their keep in multi-source enterprises where the same `Contract` must be true in CRM, ERP, and the warehouse, or where agents are allowed to *do* things to objects, not only query them.

Datus's Context Engine is built for the producer side of this split. It generates and evolves semantic models and metrics from schema and SQL (`/gen_semantic_model`, `/gen_metrics`), while the Subject Tree organizes domains into a hierarchical map that behaves like a light ontology for scoping Subagents — without requiring OWL. That is a pragmatic posture, not a claim that a Subject Tree replaces Palantir or a W3C reasoner.

If your crisis is that agents cannot tell a `TestBench` from a `ProductionTool`, extra metrics will not help until the class map exists. If the crisis is cube consistency in Excel, a virtual OLAP semantic layer is the more direct fix.

## Conclusion

An ontology is the formal account of what exists in a domain and how those things may relate. In data work it is the identity layer: classes, properties, relationships, constraints — independent of tables, and not a substitute for certified metrics. Taxonomies, knowledge graphs, and semantic layers sit beside it; Palantir, OWL, and SQL ontologies are different ways to ship it. For the measurement side, stay with the semantic layer. For the OWL interchange question, see [OSI vs RDF/OWL](/blog/osi-vs-rdf-owl/). For a SQL-native productization, see [Timbr](/blog/what-is-timbr/); for virtual OLAP, see [AtScale](/blog/what-is-atscale/). Start from the conflicting answers about what things are, not from the standards catalog.

## Frequently asked questions

### What is an ontology in data and AI?

In data and AI, an ontology is a machine-readable model of a domain: classes of things, their properties, legal relationships, and constraints. It defines meaning and identity — what a `Customer` is — rather than how to calculate a KPI. It is independent of any one database schema.

### Is an ontology the same as a semantic layer?

No. A semantic layer maps business concepts onto executable metrics, dimensions, and SQL. An ontology defines the concepts and relationships themselves. They complement each other: measurement versus meaning. See [semantic layer vs ontology](/blog/semantic-layer-vs-ontology/).

### Is an ontology the same as a knowledge graph?

No. A knowledge graph is a way to store and traverse instance data as nodes and edges. An ontology is the schema of types and rules those nodes must obey. You can have a graph without a real ontology (linked rows, weak types) and an ontology without a dedicated graph database (SQL ontologies over a warehouse).

### Do we need OWL or RDF to have an ontology?

No. OWL and RDF are the standards-track languages for formal ontologies and open-world reasoning. Many teams ship ontology-like models as object types, SQL ontologies, or domain trees. Use OWL when you need reasoners, public-data interchange, or an existing RDF estate; do not start there for a warehouse KPI problem.

### What is Palantir Ontology, and is that the same thing?

Palantir Ontology is a productized, operational ontology: objects, links, actions, and security inside Foundry, including writeback. It is one implementation of the idea, optimized for applications and agents that act — not a generic synonym for "semantic layer," and not the same as a W3C OWL file.

### Do AI agents need an ontology or a semantic layer?

They need the layer that matches the failure. If the agent gets the *number* wrong, fix metrics and the semantic layer. If it gets the *subject* wrong — the wrong class, the wrong domain tables — you need an ontology or an ontology-like class map. Production systems that answer cross-entity questions usually need both, at different depths.

## Related articles

- [Semantic layer vs ontology](/blog/semantic-layer-vs-ontology/) — the dedicated comparison — measurement vs meaning.
- [What is a semantic layer?](/blog/what-is-semantic-layer/) — the execution plane that binds concepts to metrics and SQL.
- [OSI vs RDF/OWL](/blog/osi-vs-rdf-owl/) — how the two generations of machine-readable meaning relate.
- [What is Timbr?](/blog/what-is-timbr/) — a SQL-native productization of the ontology idea.
