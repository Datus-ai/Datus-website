---
title: "From Semantic Layer to Ontology: Architecture for AI Agents"
description: "AI data agents need more than metrics and more than a glossary. Learn how to build an ontology, an entity plane and typed query functions on a semantic layer."
author: "Evan Paul"
date: 2026-09-14
lastmod: 2026-09-14
head:
  - - meta
    - name: keywords
      content: "from semantic layer to ontology, semantic layer ontology, semantic layer for AI agents, semantic layer knowledge graph, AI data agent ontology, entity plane, query functions"
  - - meta
    - property: og:title
      content: "From Semantic Layer to Ontology: Architecture for AI Agents"
  - - meta
    - property: og:description
      content: "AI data agents need more than metrics and more than a glossary. Learn how to build an ontology, an entity plane and typed query functions on a semantic layer."
  - - meta
    - property: og:type
      content: article
  - - meta
    - property: og:url
      content: https://datus.ai/blog/from-semantic-layer-to-ontology/
  - - meta
    - property: og:image
      content: https://datus.ai/images/from-semantic-layer-to-ontology/architecture-progression.png
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - link
    - rel: canonical
      href: https://datus.ai/blog/from-semantic-layer-to-ontology/
---

# From Semantic Layer to Ontology: Architecture for AI Agents

## TL;DR

- A semantic layer governs metrics, dimensions, joins, grain, and SQL generation.
- An ontology adds entities, value types, relationship roles, concept paths, and business rules.
- AI agents need both metric queries and entity/detail queries.
- Palantir shows one version of this pattern through object types, Ontology SQL, and Query Functions.
- Dosi can implement the same pattern virtually: Apache Ossie semantic model → ontology mappings → semantic IR → deterministic SQL.
- The key is to build ontology **on top of** the semantic layer, not beside it.

AI data agents break the old boundary between analytics and operations. They do not only ask "what was revenue by region?" They ask follow-up questions: which customers drove the change, which orders are still open, which alerts are unresolved, which business rule explains the exception, and which action should happen next.

A metric-only [semantic layer](/blog/what-is-semantic-layer/) is not enough for that workflow. A free-form [ontology](/blog/what-is-ontology/) is not enough either. The right architecture is a progression:

![Five boxes connected left to right: semantic layer, ontology, entity plane, query functions, AI agent context.](/images/from-semantic-layer-to-ontology/architecture-progression.png)

*Governed computation, then business concepts, then safe detail retrieval, then packaged business logic.*

The semantic layer gives governed computation. The ontology adds business concepts and paths. The entity plane lets agents retrieve detail rows safely. Query functions package trusted business logic. Together, they give agents a way to operate over enterprise data without inventing SQL or object relationships from scratch.

## Why semantic layers alone are not enough for agents

A traditional semantic layer is designed for governed aggregation. It answers questions like:

- revenue by product line;
- active users by cohort;
- delayed flights by airport;
- average order value by channel;
- open incidents by severity.

That is essential. Agents should not invent metric SQL each time they answer a question. But agents also need to navigate entities.

Consider a user asking:

> Which aircraft accumulated more than 60 minutes of recorded delay, and how many passengers were on those delayed flights?

A semantic layer can compute `total_delay_minutes` and `passengers`. But the question requires more than one metric. It requires knowing that delay lives at one grain, passengers live at another grain, and "those delayed flights" means the passenger metric must be restricted to the set of flights that have delay records.

That workflow needs both planes:

| Plane | What it handles | Example |
| --- | --- | --- |
| Metric plane | Governed aggregation | `SUM(delay_minutes)` by aircraft |
| Entity plane | Detail rows and identity | Which flights have delay records? |
| Ontology/context plane | Meaning of paths and roles | `Flight.operated_by`, `Delay.flight`, `Flight.arrives_at` |

The agent needs to move between them.

## Why ontology alone is not enough

Ontology without a semantic layer gives the agent names and relationships, but not trusted calculations.

An ontology can say that a `Customer` places `Order`, that an `Order` has `amount`, and that a `Region` contains `Country`. But it does not automatically settle metric semantics:

- should revenue exclude refunds?
- is ARR calculated from contracts or invoices?
- does order count use created orders or completed orders?
- what is the time grain of a retention metric?
- how should fanout be handled when joining line items to orders?

Those are semantic-layer questions. For AI agents, the ontology should not bypass that layer. It should sit on top of it.

## The architecture: semantic layer → ontology → agent context

A practical architecture has five layers.

![A layered diagram. Box 1, the core semantic model (datasets, fields, keys, relationships), branches into box 2, governed metrics (measures, grain, filters, time semantics) and box 3, the ontology layer (EntityTypes, ValueTypes, roles, domains). Both converge on box 4, the entity/query plane (query_objects, select, ontology_sql), which leads to box 5, agent functions (typed business tools and workflows).](/images/from-semantic-layer-to-ontology/five-layers.png)

*Metrics and ontology sit side by side on one semantic model; the entity plane and typed functions are what the agent actually calls.*

### 1. Core semantic model

The core semantic model describes logical datasets, fields, primary keys, unique keys, relationships, and sources. This is where the data becomes addressable without exposing every physical table detail to the agent.

In <a href="https://github.com/apache/ossie" rel="nofollow noopener">Apache Ossie</a> terms, this is the core model.

### 2. Governed metrics

Metrics define certified calculations. They are not arbitrary SQL snippets in a prompt. They are named, validated, compiled, and planned by the runtime.

This is where Dosi already has strong footing: validate → compile → plan → SQL.

### 3. Ontology layer

The ontology adds concepts over the semantic model:

- `EntityType`: business objects like Customer, Order, Flight, Airport, Alert;
- `ValueType`: typed values like AirportCode, AlertStatus, PassengerCount;
- relationships: named links with multiplicity and roles;
- constraints: value domains and business rules;
- mappings: how ontology concepts resolve to semantic fields and paths.

<a href="https://dosi.datus.ai/reference/ontology/" rel="nofollow noopener">Dosi's ontology reference</a> — experimental at the time of writing — describes this as loading an ontology alongside or instead of a core model. The ontology is lowered into an ordinary core Ossie model, while a ConceptMap maps concept paths to datasets, fields, and join paths.

### 4. Entity/query plane

This is the missing layer in many metric-centric systems.

Metrics return grouped numbers. Entity queries return rows and objects. AI agents need both.

A safe entity plane might expose:

```json
{
  "from": "FlightAlert",
  "fields": [
    "FlightAlert.id",
    "FlightAlert.priority",
    "FlightAlert.flight.number",
    "FlightAlert.flight.arrives_at.code"
  ],
  "where": "FlightAlert.status = 'OPEN' AND FlightAlert.priority = 'P1'"
}
```

The agent uses concept paths. The runtime resolves joins and compiles SQL.

### 5. Typed query functions

Not every repeated business question should be re-planned by the model. Some should be packaged as named functions with typed parameters.

Examples:

- `find_open_high_priority_alerts(destination_airport, since)`
- `orders_for_customer(customer_id, since)`
- `explain_revenue_drop(region, period)`
- `find_strategic_account_escalation_candidates(as_of_date)`

This mirrors one of the strongest patterns in Palantir's public architecture: agents can use both open entity/detail querying and curated <a href="https://www.palantir.com/docs/foundry/ontologies/query-compute-usage" rel="nofollow noopener">Query Functions</a>.

## Palantir is a useful reference, but not the same architecture

<a href="https://www.palantir.com/docs/foundry/architecture-center/ontology-system" rel="nofollow noopener">Palantir Ontology</a> combines object types, properties, links, object storage, SQL access, functions, actions, and permissions in one operational platform. It is powerful because the object layer is executable.

Dosi does not need to copy that storage architecture first.

A better first version is virtual:

![Five boxes connected left to right: Apache Ossie semantic metadata, Dosi semantic catalog, semantic IR, generated SQL, warehouse or lakehouse.](/images/from-semantic-layer-to-ontology/virtual-execution-path.png)

*The data stays in the warehouse. Materialized entity stores can come later, if low-latency operational search ever requires them.*

That is closer to a virtual semantic object layer. The data stays in the warehouse. Dosi compiles semantic requests into SQL. Materialized entity stores can come later if low-latency operational search becomes necessary.

The important borrowed idea is not storage. It is the separation of query surfaces:

| Surface | Who chooses query shape? | Best use |
| --- | --- | --- |
| `query_metrics` | Agent chooses governed metric request | Certified aggregations |
| `query_objects` / `select` | Agent chooses object fields and filters within a semantic grammar | Detail rows and entity traversal |
| Named Query Function | Human defines logic, agent supplies parameters | Important repeated business workflows |
| `ontology_sql` | Trusted agent writes semantic SQL | Advanced exploration |

## How this improves agent reliability

A semantic-layer-to-ontology architecture removes classes of model guessing.

### 1. It prevents invalid literals

If `FlightAlert.status` has a closed domain of `OPEN` and `RESOLVED`, the runtime can reject `UNRESOLVED` before SQL runs. Without the ontology, the query may silently return zero rows.

### 2. It prevents path ambiguity

If a `Flight` links to `Airport` as both origin and destination, the ontology can name roles and paths. The agent can ask for `Flight.arrives_at.code` instead of guessing which foreign key means destination.

### 3. It exposes grain before the agent computes

If delay minutes live at `Delay` grain but passengers live at `Flight` grain, the agent should see that before it combines metrics. Otherwise it may produce a plausible answer with the wrong population.

### 4. It separates detail and metric questions

Entity/detail questions should not be forced into metric abstractions. Metric questions should not be answered with ad-hoc row SQL. The runtime should expose both surfaces and let the agent choose.

### 5. It creates reusable business tools

Once a query pattern is validated, it should become a typed function. That gives the organization a stable tool, not an ephemeral prompt.

## The core Dosi advantage

The Dosi advantage is not "we have an ontology too." That is too generic.

The stronger claim is:

> Dosi builds ontology from a governed semantic layer, so AI agents can use business entities and relationships without leaving certified metric logic and deterministic SQL generation behind.

That is a different path from a [data catalog](/blog/what-is-data-catalog/) that only documents concepts, and a different path from an operational object platform that owns the entire application layer.

Dosi's path is open, semantic, and execution-oriented:

- Apache Ossie provides the portable semantic contract;
- Dosi validates and compiles that contract;
- the ontology layer gives agents navigable concepts;
- entity and metric planes share the same planner discipline;
- query functions package the most important workflows.

## Example: from metric to entity to function

A user asks:

> Which destination airport received the most delayed flights last week, and list the open P1 alerts on those delayed flights.

A robust agent loop looks like this:

1. Use `query_metrics` to compute delayed flights by destination airport.
2. Identify the top airport.
3. Use `query_objects` to retrieve `FlightAlert` rows linked to flights arriving at that airport.
4. Filter by ontology-backed value domain: `status = 'OPEN'`, `priority = 'P1'`.
5. If this is a repeated workflow, promote it to a named Query Function.

This is exactly the type of workflow a metric-only semantic layer struggles with and a free-form ontology cannot compute safely by itself.

## Implementation checklist

For Dosi, a practical build sequence is:

1. **Expose concept catalog and concept paths.** The agent needs to inspect available entities, properties, links, metrics, and time dimensions.
2. **Support entity/detail selection.** Add a row-returning plane for concept paths, not just metric queries.
3. **Keep metric queries governed.** Do not turn row queries into fake metrics. Metrics and entities are different semantic types.
4. **Add value-domain checks.** Closed domains should fail early with candidate values.
5. **Add typed query functions.** Promote repeated business patterns into stable MCP tools.
6. **Add policy and cost controls.** Entity-level queries can expose PII and large row sets. Permission checks, row limits, join-depth limits, and cost estimation are mandatory.

## Conclusion

The future of AI data agents is not a metric layer alone, and it is not a loose ontology alone. It is a layered system: governed semantic model, certified metrics, ontology concepts, entity-level query, and typed functions.

That is the meaning of "from semantic layer to ontology." The semantic layer gives the agent trusted computation. The ontology gives it business meaning. Dosi's opportunity is to connect the two through deterministic planning and SQL generation, so agents can answer questions about both numbers and the entities behind them.

## Frequently asked questions

### Why isn't a governed semantic layer enough for an AI data agent?

Because a semantic layer is built for governed aggregation, and agents ask follow-up questions that are not aggregations. "Which aircraft accumulated more than 60 minutes of delay, and how many passengers were on those flights?" spans two grains — delay records and flights — and restricts one metric to the population of another. Metric definitions alone do not express that. The agent needs a plane that returns identified rows, and a concept layer that tells it which grain each metric lives at before it combines them.

### What is an entity plane, and how is it different from raw SQL access?

An entity plane returns detail rows addressed by concept paths rather than physical tables — `FlightAlert.flight.arrives_at.code` instead of a hand-written join across `flight_alerts`, `flights` and `airports`. The agent chooses fields and predicates inside a semantic grammar; the runtime resolves the join path, checks value domains, applies permissions and row limits, and generates the SQL. Raw SQL access gives the model the whole surface with none of those guardrails.

### When should a query pattern become a typed query function?

Once it repeats and its logic has been validated. A one-off exploratory question is fine for the open entity plane. A workflow the business runs weekly — "find open P1 alerts for a destination airport since a date" — should become a named function with typed parameters, so the agent supplies arguments instead of re-planning the logic each time. The test is ownership: if a human should own the logic and the agent should only choose the inputs, it is a function.

### Does this architecture require a graph database or an object store?

No. The first version is virtual: Apache Ossie semantic metadata feeds a semantic catalog, which compiles to a semantic IR and then to SQL against the warehouse or lakehouse you already run. That is the difference from an operational object platform, which materializes objects into its own storage. Materialized entity stores are a later option, justified by low-latency operational search rather than by the architecture itself.

## Related articles

- [Semantic layer vs ontology: why AI agents need both](/blog/semantic-layer-vs-ontology/) — the comparison this architecture answers
- [What is a semantic layer?](/blog/what-is-semantic-layer/) — the governed computation plane at the base
- [What is an ontology?](/blog/what-is-ontology/) — entities, relationships and rules, defined
- [Open Semantic Interchange (OSI)](/blog/open-semantic-interchange-osi/) — the portable spec behind Apache Ossie
- [The first native Apache Ossie engine](/blog/first-native-apache-ossie-engine/) — validate, compile and plan in practice
- [Dosi MCP: a semantic layer for agents](/blog/dosi-mcp-semantic-layer-for-agents/) — how these surfaces reach an agent
