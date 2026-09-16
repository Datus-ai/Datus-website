---
title: "Semantic Layer vs Ontology: Why AI Agents Need Both"
description: "Semantic layer vs ontology is the wrong final question. See why AI data agents need both — governed metrics first, then ontology and agent context on top."
author: "Evan Paul"
date: 2026-09-12
lastmod: 2026-09-12
head:
  - - meta
    - name: keywords
      content: "semantic layer vs ontology, semantic layer ontology, semantic layer to ontology, semantic layer knowledge graph, semantic layer for AI agents, Apache Ossie ontology, Palantir Ontology"
  - - meta
    - property: og:title
      content: "Semantic Layer vs Ontology: Why AI Agents Need Both"
  - - meta
    - property: og:description
      content: "Semantic layer vs ontology is the wrong final question. See why AI data agents need both — governed metrics first, then ontology and agent context on top."
  - - meta
    - property: og:type
      content: article
  - - meta
    - property: og:url
      content: https://datus.ai/blog/semantic-layer-vs-ontology/
  - - meta
    - property: og:image
      content: https://datus.ai/images/semantic-layer-vs-ontology/semantic-layer-to-agent-context.png
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - link
    - rel: canonical
      href: https://datus.ai/blog/semantic-layer-vs-ontology/
---

# Semantic Layer vs Ontology: Why AI Agents Need Both

## TL;DR

- A semantic layer answers: **what does this metric mean, and how is it computed?**
- An ontology answers: **what business entities exist, how are they related, and how should an agent navigate them?**
- They are not substitutes. AI data agents need both governed metrics and entity-level context.
- Palantir Ontology is closer to an operational object layer with actions, functions, storage, permissions, and APIs.
- Apache Ossie ontology is a conceptual layer over semantic models: EntityTypes, ValueTypes, relationships, rules, and mappings.
- Dosi's differentiated path is a **semantic-layer-based ontology**: build entity context, concept paths, and agent-safe query surfaces on top of an open semantic standard.

"Semantic layer vs ontology" sounds like an architecture choice. In practice, it is a sequencing problem.

A [semantic layer](/blog/what-is-semantic-layer/) defines governed business measures: metrics, dimensions, joins, grain, filters, and time semantics. An [ontology](/blog/what-is-ontology/) defines the business objects, relationships, value domains, and concept paths an AI agent can reason over. If the semantic layer is missing, the ontology has names but not trusted calculations. If the ontology is missing, the semantic layer has governed numbers but not enough business context for agents to navigate the world.

The right pattern is not **semantic layer or ontology**. It is:

![Three boxes connected left to right: Semantic Layer (metrics, dimensions, joins, grain) leads to Ontology (entities, value types, roles, concept paths), which leads to Agent Context (safe queries, explanations, actions).](/images/semantic-layer-vs-ontology/semantic-layer-to-agent-context.png)

*Each stage grounds the next: governed calculation first, business meaning second, agent-safe surfaces last.*

For Datus and Dosi, this distinction matters because Dosi does not start from a free-form object graph. It starts from <a href="https://github.com/apache/ossie" rel="nofollow noopener">Apache Ossie</a> semantic definitions and builds ontology semantics on top of that governed layer.

## Semantic layer vs ontology: the short definition

A semantic layer is the governed metric and query contract between raw data and business consumers. It defines reusable metrics, dimensions, relationships, and SQL generation rules so that every dashboard, notebook, API, and AI agent computes the same number the same way.

An ontology is the conceptual map of a domain. It defines entities, value types, relationships, roles, constraints, and sometimes actions. In a data context, ontology turns tables and columns into business objects like `Customer`, `Order`, `Flight`, `Airport`, `Delay`, and `Alert`.

| Dimension | Semantic layer | Ontology |
| --- | --- | --- |
| Primary unit | Metric, dimension, dataset, join | Entity, value type, relationship, role |
| Main job | Govern calculation | Govern meaning and navigation |
| Typical question | "How is revenue computed?" | "What is a customer? What links customer to order?" |
| Agent failure prevented | Wrong aggregation, wrong grain, metric drift | Wrong object, wrong path, wrong literal, ambiguous relationship |
| Datus position | Foundation layer | Built on top of the foundation |

The common mistake is treating ontology as a replacement for the semantic layer. That gives an agent a map of concepts without a reliable calculator. The opposite mistake is treating the semantic layer as enough for AI agents. That gives an agent certified metrics without enough object-level context to answer operational questions.

## Why AI agents expose the gap

Human analysts can tolerate missing semantics. If a BI dashboard has a metric called `delayed_flights`, an analyst can ask a teammate which table it comes from, which airport path to use, or whether `status = 'UNRESOLVED'` is a valid value.

AI agents cannot rely on those hallway corrections. If the context is incomplete, the model fills the gap.

Common failures include:

- choosing the wrong join path when multiple paths lead to the same entity;
- grouping a metric by a dimension that lives on the wrong side of the relationship;
- treating a row-level field as if it were a certified metric;
- using natural-language literals that are not valid domain values;
- summing a detail table and accidentally multiplying counts through fanout;
- answering with SQL that is syntactically valid but semantically wrong.

A semantic layer reduces the metric failures. An ontology reduces the navigation and meaning failures. An [AI data agent](/blog/what-is-data-agent/) needs both.

## The Datus view: semantic layer first, ontology second

Datus's architecture is intentionally ordered:

![One box labelled Apache Ossie semantic model fans out to three columns. Left: datasets, fields, primary keys. Middle: relationships and metrics, feeding the Dosi planner (validate, compile, plan) and then warehouse SQL. Right: the ontology layer, feeding EntityTypes, ValueTypes, roles and concept paths, and then agent tools describe, paths, select and query.](/images/semantic-layer-vs-ontology/datus-architecture-order.png)

*The ontology is not a second truth source above the data — it is grounded in the same semantic model the planner executes.*

The ontology is not a separate truth source floating above the data. It is grounded in the semantic model.

That gives the agent a safer contract:

- metric queries still go through governed metric definitions;
- entity/detail queries use concept paths instead of physical table names;
- value domains can reject invalid literals before SQL is generated;
- relationship roles can disambiguate paths like origin airport vs destination airport;
- derived metrics can carry path meaning, not just SQL text.

In <a href="https://dosi.datus.ai/reference/ontology/" rel="nofollow noopener">Dosi's ontology reference</a> — an experimental surface at the time of writing — an ontology can load alongside a core Ossie model. The ontology is lowered to an ordinary core Ossie model and then goes through the same validate → compile → plan path. A ConceptMap sits beside it, mapping concept paths to datasets, fields, and join paths. That is the core of the semantic-layer-based ontology idea: the ontology names the world, but the semantic planner still owns execution.

## Why "vs" is the wrong final question

The query `semantic layer vs ontology` exists because teams are trying to compare overlapping terms. Searchers want a clean difference. The difference is real, and it is worth stating plainly before moving past it.

The better framing is:

> A semantic layer and an ontology solve adjacent problems. The semantic layer governs calculations; the ontology governs business meaning and traversal. AI agents need the semantic layer as the trusted computation plane and the ontology as the concept/navigation plane.

## How this differs from Palantir Ontology

Palantir Ontology is not just a vocabulary. Based on <a href="https://www.palantir.com/docs/foundry/architecture-center/ontology-system" rel="nofollow noopener">Palantir's public architecture</a>, it is an operational object layer: object types, properties, links, object storage, actions, functions, permissions, SDKs, <a href="https://www.palantir.com/docs/foundry/sql-warehousing/ontology-sql" rel="nofollow noopener">SQL access</a>, and <a href="https://www.palantir.com/docs/foundry/ontology-mcp/overview" rel="nofollow noopener">MCP exposure</a>.

Apache Ossie ontology is narrower and more portable. It defines conceptual entities, value types, relationships, rules, and mappings over semantic data models. It is a specification, not an operational application platform.

| Capability | Palantir Ontology | Apache Ossie + Dosi direction |
| --- | --- | --- |
| Object model | Yes | EntityType / ValueType concepts |
| Operational storage | Yes, via Foundry object storage | Initially virtual over warehouse/lakehouse |
| Write actions | Yes | Not part of Ossie ontology; separate product layer if needed |
| Query functions | Yes | Strong pattern to adopt for Dosi MCP tools |
| Open semantic standard | No, platform-specific | Yes, built around Apache Ossie |
| Metric governance | Exists in platform context | Built from semantic layer and Dosi planner |

This is why Datus should not position itself as "another Palantir ontology." The sharper positioning is:

> Datus builds ontology on top of an open semantic layer, so AI agents reason over business concepts without leaving governed metric and query semantics behind.

## What a semantic-layer-based ontology adds

A semantic-layer-based ontology adds five things that a plain semantic layer usually lacks:

1. **Entity identity**: a concept like `Flight` or `Customer` is identified by business keys, not only by dataset primary keys.
2. **Value domains**: a field like `FlightAlert.status` can declare that only `OPEN` and `RESOLVED` are valid.
3. **Named relationship roles**: a `Flight` can link to `Airport` as origin or destination; both paths may join to the same table, but they do not mean the same thing.
4. **Concept paths**: an agent can ask for `FlightAlert.flight.arrives_at.code` instead of guessing physical joins across `flight_alerts`, `flights`, and `airports`.
5. **Entity and metric planes together**: some questions return rows, some return metrics, and real workflows often need both.

The aviation ontology loop in Dosi's design notes shows this clearly: the agent first uses metadata to understand concepts and paths, then uses query for metrics and select for entity-level detail. The ontology does not replace the metric layer. It helps the agent decide which plane to use.

## Practical rule: when to use each layer

Use the semantic layer when the question is about a certified number:

- revenue by region;
- delayed flights by airport;
- average resolution time by priority;
- retention by cohort;
- open alerts over time.

Use the ontology layer when the question is about entities, relationships, constraints, or navigation:

- which customers belong to this account;
- which flights arrived at JFK and have open alerts;
- which orders are linked to a high-priority support case;
- which airport path is destination, not origin;
- which status values are valid.

Use both when the agent has to move from a metric result to the underlying entities, or from entity filters to governed metrics.

## Recommended architecture for AI data agents

The durable architecture has three surfaces:

![A user question flows into an AI data agent, which branches into three surfaces: query_metrics for governed metrics, query_objects or select for entity detail, and named query functions for curated business logic. All three converge on the Dosi planner, then deterministic SQL, then the warehouse or lakehouse.](/images/semantic-layer-vs-ontology/three-query-surfaces.png)

*The agent chooses a semantic surface. The runtime keeps identity, paths, value domains, permissions and SQL generation.*

This pattern avoids two extremes:

- giving the model unrestricted raw SQL access;
- forcing every entity-level question into a prebuilt function.

The agent gets semantic tools. The runtime owns identity, paths, value domains, permissions, SQL generation, and cost controls.

## Conclusion

The semantic layer vs ontology debate is useful only as an entry point. For AI data agents, the better architecture is semantic layer **to** ontology: start with governed metrics and relationships, then build entity semantics and agent context on top.

That is the Datus and Dosi position. Apache Ossie provides the portable semantic specification. [Dosi provides the runtime](/blog/first-native-apache-ossie-engine/) that can validate, compile, and execute those semantics. The ontology layer makes those semantics navigable for agents without asking the model to invent joins, literals, or metric logic.

The result is not just a more descriptive data catalog. It is a safer execution contract for AI agents over enterprise data.

## Frequently asked questions

### Is a semantic layer the same thing as an ontology?

No. A semantic layer governs calculation — metrics, dimensions, joins, grain, filters and time semantics — so every consumer computes the same number the same way. An ontology governs meaning and navigation — which entities exist, how they relate, which roles a relationship plays, and which literal values are valid. The clearest test is the question each one answers: "how is revenue computed?" is a semantic-layer question; "what is a customer, and what links a customer to an order?" is an ontology question.

### Do I need an ontology if I already have a governed semantic layer?

For certified aggregate questions, no. A semantic layer answers "revenue by region" or "delayed flights by airport" correctly on its own. You need the ontology once agents start asking entity-level and navigational questions — which flights arrived at JFK and have open alerts, which airport path means destination rather than origin, whether `UNRESOLVED` is even a valid status. Those are the failures a metric layer cannot catch, because the SQL it generates is syntactically valid and semantically wrong.

### Should I build the ontology first or the semantic layer first?

The semantic layer first. An ontology built before governed metrics gives an agent a map of concepts without a reliable calculator: it can name `Customer` and `Order` but cannot settle whether revenue excludes refunds, whether ARR comes from contracts or invoices, or what the time grain of a retention metric is. Those are semantic-layer decisions. Building the ontology on top keeps the planner as the single execution path.

### How does this differ from Palantir Ontology?

Palantir Ontology is an operational object layer: object types, properties, links, object storage, actions, functions, permissions, SDKs, SQL access and MCP exposure, all inside one platform. The Apache Ossie ontology specification is narrower and more portable — conceptual entities, value types, relationships, constraints and mappings over a semantic model, with no storage or application runtime of its own. The difference that matters is the starting point: Palantir starts from operational objects, a semantic-layer-based ontology starts from a governed semantic model and stays virtual over your existing warehouse.

## Related articles

- [Ontology vs semantic layer: definitions and when you need each](/blog/semantic-layer-vs-ontology-difference/) — the conceptual comparison, and where a lightweight Subject Tree fits
- [What is a semantic layer?](/blog/what-is-semantic-layer/) — the governed computation plane this architecture starts from
- [What is an ontology?](/blog/what-is-ontology/) — entities, relationships and rules, defined
- [Open Semantic Interchange (OSI)](/blog/open-semantic-interchange-osi/) — the portable specification behind Apache Ossie
- [The first native Apache Ossie engine](/blog/first-native-apache-ossie-engine/) — the runtime that validates, compiles and plans these semantics
- [Dosi MCP: a semantic layer for agents](/blog/dosi-mcp-semantic-layer-for-agents/) — how the query surfaces reach an agent
