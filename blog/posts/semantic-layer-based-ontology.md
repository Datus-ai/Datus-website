---
title: "Semantic-Layer-Based Ontology: Agent Context on Apache Ossie"
description: "A semantic-layer-based ontology starts from governed metrics and relationships, then builds entity context and concept paths for AI agents on Apache Ossie."
author: "Evan Paul"
date: 2026-09-16
lastmod: 2026-09-16
head:
  - - meta
    - name: keywords
      content: "semantic layer based ontology, semantic layer ontology, Apache Ossie ontology, semantic layer for AI agents, ontology for AI data agents, concept paths, value domains"
  - - meta
    - property: og:title
      content: "Semantic-Layer-Based Ontology: Agent Context on Apache Ossie"
  - - meta
    - property: og:description
      content: "A semantic-layer-based ontology starts from governed metrics and relationships, then builds entity context and concept paths for AI agents on Apache Ossie."
  - - meta
    - property: og:type
      content: article
  - - meta
    - property: og:url
      content: https://datus.ai/blog/semantic-layer-based-ontology/
  - - meta
    - property: og:image
      content: https://datus.ai/images/semantic-layer-based-ontology/semantic-layer-based-ontology-stack.png
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - link
    - rel: canonical
      href: https://datus.ai/blog/semantic-layer-based-ontology/
---

# Semantic-Layer-Based Ontology: Agent Context on Apache Ossie

## TL;DR

- A semantic-layer-based ontology starts from governed semantic definitions, not from a free-form graph.
- Apache Ossie provides the portable semantic model: datasets, fields, keys, relationships, and metrics.
- Ossie ontology adds EntityTypes, ValueTypes, relationship roles, value domains, and mappings.
- Dosi can lower ontology concepts into ordinary semantic model paths, then reuse its existing validate → compile → plan flow.
- This gives AI agents concept paths and entity context without letting them bypass metric governance.
- The result is a safer agent context layer: entity-aware, metric-aware, and executable.

Most ontology discussions start from objects. Datus starts from the [semantic layer](/blog/what-is-semantic-layer/).

That difference matters. An AI data agent does not only need to know that `Customer` links to `Order`, or that `Flight` links to `Airport`. It also needs to know how metrics are computed, which grain they live at, which dimensions are valid, which paths are ambiguous, and which values are allowed.

That is why the right term for the Dosi architecture is **semantic-layer-based ontology**.

A semantic-layer-based ontology is an [ontology](/blog/what-is-ontology/) built on top of a governed semantic layer. The semantic layer defines datasets, fields, relationships, metrics, grain, and query semantics. The ontology adds entities, value types, roles, constraints, concept paths, and agent-facing meaning.

![A vertical stack of five boxes. Governed semantic layer (Apache Ossie core model) leads to ontology concepts (EntityTypes, ValueTypes, relationships), then to a ConceptMap that resolves concept paths to semantic paths, then to the Dosi planner (validate, compile, plan), then to agent tools for querying metrics, selecting entities and calling query functions.](/images/semantic-layer-based-ontology/semantic-layer-based-ontology-stack.png)

*The ontology names the world. The semantic layer still executes it.*

The ontology is not a replacement for the semantic layer. It is the agent-facing concept layer built from it.

## What semantic-layer-based ontology means

Semantic-layer-based ontology means the semantic layer remains the source of execution truth.

The ontology does not invent a second data model that competes with the semantic layer. Instead, it maps business concepts onto the semantic model and lets the runtime resolve those concepts into deterministic query plans.

| Layer | Responsibility | Example |
| --- | --- | --- |
| Core semantic model | Logical datasets, fields, primary keys, relationships | `flights`, `delays`, `airports`, `flight_alerts` |
| Metric layer | Certified measures and aggregations | `delayed_flights`, `total_delay_minutes`, `passengers` |
| Ontology layer | Entities, value types, relationship roles, domains | `Flight`, `Delay`, `Airport`, `AlertStatus` |
| Concept map | Resolve concept paths to semantic fields and joins | `FlightAlert.flight.arrives_at.code` |
| Agent tools | Safe query surfaces over concepts and metrics | `describe`, `paths`, `select`, `query` |

The sequence matters. If you reverse it, the agent may get a beautiful ontology that cannot compute trusted metrics. If you keep only the semantic layer, the agent may get certified numbers but no safe way to traverse business objects.

## Why this is different from ontology-based semantic layers

"Ontology-based semantic layer" implies the ontology is the starting point and the semantic layer is derived from it.

That is not the Datus position.

Datus starts with the semantic layer because metrics and query semantics need governance. Business users do not only ask about objects. They ask about numbers: revenue, delay minutes, active users, conversion rate, open alerts, risk exposure, and many other quantities that depend on grain, filters, joins, and aggregation rules.

A semantic-layer-based ontology says:

1. First, define the governed data contract.
2. Then, map business concepts onto that contract.
3. Then, expose agent tools that can use both metrics and concepts.

This gives the agent a safer mental model:

- When it needs a number, it calls the metric plane.
- When it needs entities, it calls the entity plane.
- When it needs repeated business logic, it calls a typed function.
- When it needs paths, it asks the ontology instead of guessing joins.

## How Apache Ossie enables the pattern

<a href="https://github.com/apache/ossie" rel="nofollow noopener">Apache Ossie</a> is useful because it separates portable semantic definitions from runtime implementation.

The core model can represent datasets, fields, keys, relationships, and metrics. The <a href="https://github.com/apache/ossie/blob/main/ontology/ontology.md" rel="nofollow noopener">ontology specification</a> — at `0.2.0.dev0` as of this writing — can represent EntityTypes, ValueTypes, relationships, constraints, and mappings.

In <a href="https://dosi.datus.ai/reference/ontology/" rel="nofollow noopener">Dosi's ontology reference</a> — an experimental surface, deliberately unlinked from the main docs — an ontology can be loaded model-first or ontology-first:

- **model-first**: use an existing core model, then add ontology concepts, roles, and value domains;
- **ontology-first**: use the ontology's embedded semantic model;
- in both cases, the ontology is lowered to an ordinary core Ossie model and goes through the same validation and planning path.

That means Dosi does not need a separate ontology execution engine for the first version. It can reuse its planner.

The ontology adds names and constraints. The semantic layer still executes.

## What the ontology adds to the semantic layer

A semantic-layer-based ontology adds practical semantics that matter for agents.

### 1. Entity identity

An entity like `Flight` can be identified by a business identity, not only by a dataset primary key. This lets the agent reason in terms of business objects instead of table rows.

### 2. Value types and domains

`AlertStatus` can be declared as a value type whose allowed values are `OPEN` and `RESOLVED`. If an agent asks for `UNRESOLVED`, Dosi can return a structured error with valid candidates instead of returning an empty result.

### 3. Relationship roles

A `Flight` can have two links to `Airport`: `departs_from` and `arrives_at`. Both may join to the same table, but they mean different things. A semantic-layer-based ontology gives the agent role-aware paths.

### 4. Concept paths

Instead of asking the model to infer physical joins, the agent can use concept paths:

```text
FlightAlert.flight.arrives_at.code
Delay.flight.operated_by.tail_number
Airport.average_departure_delay
```

These paths resolve to datasets, fields, and relationship chains the planner already understands.

### 5. Derived metrics with path meaning

Two metrics can compile to similar SQL but mean different things because they walk different concept paths. For example, average delay by departure airport and average delay by arrival airport may both aggregate delay minutes, but their semantic path is different.

That path meaning is exactly the kind of context AI agents need.

## Example: why concept paths matter

Suppose an agent is asked:

> Which open P1 alerts are on flights arriving at JFK?

Without ontology, the agent may need to infer:

- which table stores alerts;
- which column links alert to flight;
- which airport column means arrival rather than departure;
- which alert status values are valid;
- whether `UNRESOLVED` is an allowed literal.

With a semantic-layer-based ontology, the request becomes:

```text
from: FlightAlert
fields:
  FlightAlert.id
  FlightAlert.priority
  FlightAlert.flight.number
  FlightAlert.flight.arrives_at.name
where:
  FlightAlert.status = 'OPEN'
  FlightAlert.priority = 'P1'
  FlightAlert.flight.arrives_at.code = 'JFK'
```

The agent works in business concepts. The runtime resolves the path and generates SQL.

This is not merely nicer syntax. It prevents wrong answers.

If the agent uses `FlightAlert.status = 'UNRESOLVED'`, the value domain can reject it. If the agent asks for `Airport.code` without specifying whether it means departure or arrival, the relationship roles can force disambiguation. If the query crosses a one-to-many edge from the wrong root, the runtime can refuse detail fanout and suggest the correct root.

## Metric plane and entity plane should stay separate

The biggest design mistake would be trying to make metrics do everything.

Metrics answer aggregate questions:

- delayed flights by airport;
- revenue by region;
- average handling time by support team;
- open alerts by priority.

Entities answer detail questions:

- which flights arrived at JFK;
- which alerts are still open;
- which customers belong to an account;
- which orders are linked to an escalation.

They are different semantic types. A good agent architecture exposes both:

![A user question flows into an agent, which branches into a metric plane (query_metrics) and an entity plane (query_objects / select). Both converge on the Dosi planner, which produces generated SQL.](/images/semantic-layer-based-ontology/metric-and-entity-planes.png)

*The ontology is the bridge: it tells the agent which plane to use, and how to move between them.*

The ontology is the bridge. It lets the agent know which plane to use and how to move between them.

## Query functions: the next layer

Once a query pattern becomes repeated, it should not remain a prompt pattern. It should become a typed function.

A query function might look like:

```text
find_open_p1_alerts(destination_airport, since) -> FlightAlert[]
```

or:

```text
explain_delayed_flights_by_aircraft(period) -> MetricResult + FlightSet
```

This matters because it shows Dosi is not just a semantic catalog. It is an execution layer for agent tools.

A mature semantic-layer-based ontology therefore has three query surfaces:

| Surface | Best for | Agent control |
| --- | --- | --- |
| `query_metrics` | Certified aggregate numbers | Choose metric, dimensions, filters |
| `query_objects` / `select` | Entity/detail retrieval | Choose concepts, fields, predicates |
| Query Functions | Repeated business workflows | Supply typed parameters only |

This structure follows a strong pattern from Palantir's public architecture, but uses Apache Ossie and Dosi's virtual execution model rather than a proprietary object storage layer.

## Why the name matters

Naming an architecture precisely matters more than it used to: generative engines answer questions by quoting crisp architecture claims, and a vague one gets paraphrased into someone else's category.

"Semantic-layer-based ontology" is precise in a way that "we have an ontology" is not:

> Datus builds a semantic-layer-based ontology: Apache Ossie defines governed metrics and relationships, Dosi executes them, and the ontology layer adds entity context and concept paths for AI agents.

That sentence names five things at once:

- open semantic standard;
- governed metric computation;
- ontology concepts built on top;
- deterministic runtime;
- agent-safe query tools.

## Comparison with Palantir Ontology

<a href="https://www.palantir.com/docs/foundry/architecture-center/ontology-system" rel="nofollow noopener">Palantir Ontology</a> is an operational object layer. It includes objects, properties, links, object storage, actions, functions, permissions, SDKs, and query APIs.

A semantic-layer-based ontology is narrower but more portable. It does not try to own the whole application runtime first. It starts with the data and metric contract, then adds concept navigation and execution surfaces.

| Question | Palantir-style ontology | Semantic-layer-based ontology |
| --- | --- | --- |
| Starting point | Operational objects | Governed semantic model |
| Runtime | Platform object storage and APIs | Virtual execution over warehouse/lakehouse first |
| Metrics | Part of broader platform semantics | First-class governed layer |
| Agent surface | Ontology SQL, Query Functions, Actions | `query_metrics`, `query_objects`, typed functions |
| Standard | Platform-specific | Apache Ossie-based |
| Best positioning | Operational AI platform | Open semantic runtime for data agents |

This contrast should be handled carefully. Palantir is the strongest proof that ontology matters for agents. Datus's distinction is the starting point: open semantic layer first.

## Conclusion

Semantic-layer-based ontology is the cleanest way to describe Datus's difference.

It says the important thing in the right order: start with the governed semantic layer, then build ontology on top, then expose safe agent tools. That architecture gives AI data agents both certified computation and business context.

A free-form ontology can name the business. A metric layer can compute the numbers. A semantic-layer-based ontology lets an agent do both without guessing.

## Frequently asked questions

### Is semantic-layer-based ontology the same as a knowledge graph?

No. A knowledge graph emphasizes graph-shaped relationships and traversal. A semantic-layer-based ontology emphasizes executable business semantics grounded in datasets, relationships, metrics, and deterministic planning. It may expose graph-like concept paths, but it does not require a graph database.

### Does the ontology replace metrics?

No. Metrics remain in the semantic layer. The ontology gives agents entity context, paths, roles, and constraints so they can use those metrics safely.

### Why not start with the ontology?

Because AI data agents need trusted computation. If the metric definitions are not governed first, the ontology can help the agent navigate but not guarantee correct numbers.

### Is Apache Ossie enough by itself?

Apache Ossie provides the portable specification. Dosi provides the runtime needed to validate, compile, plan, and execute semantic queries.

## Related articles

- [From semantic layer to ontology: architecture for AI agents](/blog/from-semantic-layer-to-ontology/) — the five layers, end to end
- [Semantic layer vs ontology: why AI agents need both](/blog/semantic-layer-vs-ontology/) — the comparison this architecture answers
- [Open Semantic Interchange (OSI)](/blog/open-semantic-interchange-osi/) — the portable spec behind Apache Ossie
- [The first native Apache Ossie engine](/blog/first-native-apache-ossie-engine/) — validate, compile and plan in practice
- [Dosi MCP: a semantic layer for agents](/blog/dosi-mcp-semantic-layer-for-agents/) — how these surfaces reach an agent
- [What makes a semantic layer AI-native?](/blog/ai-native-semantic-layer/) — the requirements this architecture is built against
