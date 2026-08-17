---
title: "What Is Timbr? Ontology-Based Semantic Layer Built on SQL"
description: "What Timbr.ai is: a SQL-native ontology over your warehouse — how it differs from Cube and AtScale, and when the extra layer is worth it."
author: "Kostja"
date: 2026-08-18
lastmod: 2026-08-18
head:
  - - meta
    - name: keywords
      content: "Timbr, Timbr.ai, ontology-based semantic layer, SQL ontology, virtual knowledge graph, semantic layer vs Cube, semantic layer vs AtScale"
  - - meta
    - property: og:title
      content: "What Is Timbr? Ontology-Based Semantic Layer Built on SQL"
  - - meta
    - property: og:description
      content: "What Timbr.ai is: a SQL-native ontology over your warehouse — how it differs from Cube and AtScale, and when the extra layer is worth it."
  - - meta
    - property: og:type
      content: article
  - - meta
    - property: og:url
      content: https://datus.ai/blog/what-is-timbr/
  - - meta
    - property: og:image
      content: https://datus.ai/logo_dark.svg
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - link
    - rel: canonical
      href: https://datus.ai/blog/what-is-timbr/
---


# What Is Timbr? Ontology-Based Semantic Layer Built on SQL

Timbr is an ontology-based semantic layer: it models business concepts, relationships, inheritance, and measures as a virtual SQL knowledge graph on top of data you already have. Its central claim is that filters are not inheritance — and that one distinction is the difference between buying a metric layer and buying a type system. The claim decides the architecture, the maintenance surface, and the buying decision, in that order.

## TL;DR

- **Timbr** (timbr.ai) sits virtually above warehouses and lakes. It does not copy data into a graph database and does not ask analysts to write SPARQL. Concepts and relationships are modeled in SQL; traversals compile to push-down queries on Snowflake, Databricks, BigQuery, PostgreSQL, and other sources.
- The bet is that AI agents need a **grammar of reasoning** — what a High-Value Customer *is*, how Accounts relate to Transactions — not only a catalog of certified metrics. Cube, AtScale, and dbt MetricFlow occupy the metric-governance camp; Timbr occupies the ontology camp. Both camps are real; they are not the same product.
- Measures and OLAP-style cubes can live *inside* the ontology, with inheritance, rather than in a separate metrics YAML. That is the overlap with a [semantic layer](/blog/what-is-semantic-layer/), not a reason to pretend the modeling paradigm is identical.
- The honest cost: you are deploying and governing another layer. Teams with a single warehouse and a stable dimensional model often get further, faster, with Cube or dbt. Timbr starts to win when identity, subtypes, and multi-source joins are the thing agents get wrong.
- Datus does not replace Timbr. Datus is a data engineering agent that *produces and evolves* context. Timbr is a place that context can *live* as an explicit class map. Complementary if you want both; competing only if you expected one tool to be the entire meaning stack.

## 1. Filters are not inheritance: the claim that separates Timbr from metric-only layers

Most of the 2025–2026 "semantic layer for AI" wave is a metric-governance wave. Define `net_revenue` once. Expose it through JDBC, SQL, GraphQL, or MCP. Stop two dashboards from disagreeing. That work is necessary. It is also incomplete for any question whose hard part is not the formula.

An agent that asks "which high-value customers expanded after we changed packaging?" has to know that High-Value Customer is a *kind of* Customer, that Customers have Accounts, that Accounts have Transactions, and that "expanded" is not a column on the customer dimension. A Cube model or a MetricFlow YAML can encode a `high_value` segment as a filter. Filters are not inheritance. When the next question uses a different subtype — "strategic accounts," "resellers," "internal tenants" — the metric layer grows another boolean, and the agent still does not have a type system.

Timbr's public framing splits the market into camps and puts itself in the third: ontology as the grammar, not only the vocabulary. The first camp is metric governance (dbt, Cube, AtScale, warehouse-native semantic views). The second is catalog-and-glossary context. The third starts from classes and relationships and treats metrics as objects in that model. You do not have to accept the marketing taxonomy to accept the engineering claim underneath it: **agents misfire on identity at least as often as they misfire on arithmetic.** An [ontology](/blog/what-is-ontology/) is the artifact that makes identity explicit. A metric platform is the artifact that makes measurement explicit. Buying only the second and hoping the first appears from column names is how demos look smart and production tickets pile up.

## 2. A SQL ontology at query time: push-down, no graph store, no SPARQL

None of this is a claim that Timbr invented ontologies. OWL has existed for decades; Palantir productized an operational object graph; knowledge-graph vendors have sold traversal for years. Timbr's specific move is to put a **SQL-native, virtual** ontology on the modern data stack so warehouse teams do not have to stand up SPARQL or ship data into Neo4j in order to get typed relationships.

Timbr Intelligent Semantic Layer is a virtual modeling plane, documented as an <a href="https://timbr.ai/timbr-core/ontology-based-semantic-layer" rel="nofollow noopener">ontology-based semantic layer</a>. Concepts map to underlying tables. Relationships replace a class of JOINs at query time. Hierarchies and `is-a` inheritance let a subtype carry properties of its parent. Business rules attach to the model. SQL measures and cubes can be defined as reusable objects in the same ontology rather than in a parallel metrics project.

Two implementation details matter more than the adjectives. First, **data does not move**. Timbr's <a href="https://docs.timbr.ai/doc/docs/platform/" rel="nofollow noopener">platform documentation</a> describes a virtual layer over existing databases: no mandatory ETL into a graph store. Second, **the query language stays SQL**. Graph-style navigation is compiled into source SQL and pushed down, which is why the company argues LLMs should talk to this layer in SQL rather than Cypher or SPARQL. That is a bet on what models are already good at generating, not a claim that SQL can express every graph pattern.

Timbr is therefore not a database, not a BI tool, and not Palantir Foundry. Palantir Ontology integrates objects, actions, writeback, and security into an application platform; Timbr leaves systems of record where they are and puts meaning on top. Graph databases copy or stream data into a store optimized for traversal; Timbr treats the warehouse as the store. Semantic layers in the Cube/AtScale sense start from facts, dimensions, and measures; Timbr starts from concepts and treats measures as part of the ontology. If a vendor comparison flattens all four into "semantic layer," the RFP will select on logo familiarity and miss the architecture.

Consumption is deliberately broad in the pitch: SQL, BI, REST/OpenAPI, agents, and LLMs against one governed model. Treat that list as a capability map, not a promise that every connector is equally mature. The architectural point is single-model, many consumers — the same point Cube makes from the API side and AtScale makes from the MDX/DAX side. Timbr's differentiator is what the model *contains* (classes, relations, inheritance, rules, measures) rather than how many dialects it speaks.

## 3. The maintenance surface: cloned KPIs vs subtype tickets

Start from a familiar warehouse: `customers`, `accounts`, `orders`, `order_lines`, `products`. A dimensional semantic layer maps these to a sales cube. A SQL ontology names `Customer`, `Account`, `Order`, `Product` as concepts, maps them to those tables, and declares that `Customer` has `Account`, `Account` places `Order`, `Order` contains `Product`. A `StrategicAccount` *is a* `Account` with extra properties. A measure such as `net_revenue` can hang on `Order` and inherit filters from parent concepts instead of being rewritten per subtype.

When an analyst or agent asks for net revenue of strategic accounts in EMEA, the engine is not hoping the LLM remembers the join path. The relationship is in the model. The subtype is in the model. The measure is in the model. The generated SQL is still warehouse SQL — Timbr is not introducing a new execution engine in the SPARQL sense — but the *choice* of joins and grain is constrained before generation, which is the same safety idea Cube uses when it insists agents query the semantic layer rather than raw tables. The constraint language is different: types and inheritance versus cubes and measures.

That difference shows up in maintenance. Adding `Reseller` as a kind of `Customer` is an ontology change. In a metric-only layer it is often a new dimension value plus a new filtered metric, copied from the last filtered metric, drifting the week someone edits only one of them. Inheritance is not magic — someone still has to model `Reseller` correctly — but it is a different failure surface. You get fewer cloned KPIs and more "the subtype was wrong" tickets. Teams should pick the failure surface they would rather debug.

The asymmetry is easiest to see in a POC. A happy-path NL question makes every layer look fine; the differentiator appears when the schema changes — `dim_account` grows a reseller flag, or one "customer" class splits into two subtypes. In the metric layer that means cloning and re-filtering every dependent KPI and hoping the copies stay in sync. In the ontology it means declaring the new subtype and letting inheritance carry the old definitions — which is when you discover who is actually allowed to edit the model. If the ontology cannot be updated without a specialist week, you have bought a beautiful constraint system you will work around.

## 4. Timbr vs Cube vs AtScale: three answers to three questions

A head-to-head only helps if each product is allowed to win its home game.

| Dimension | Timbr | Cube | AtScale |
| --- | --- | --- | --- |
| **Home game** | Typed concepts, relationships, inheritance over live warehouse data | Headless metrics APIs, pre-aggregation, embedded/agentic analytics | Virtual OLAP for Excel, Power BI, Tableau; MDX/DAX |
| **Modeling unit** | SQL ontology concepts and relations | Cube data models (YAML/JS/Python) | Multidimensional models / SML |
| **Data movement** | Virtual; push-down SQL | Queries sources; CubeStore caches aggregates | Virtual; query pushdown / aggregate awareness |
| **Graph store required?** | No | No | No |
| **Primary consumer historically** | SQL, BI, APIs, agents | Apps, embedded analytics, BI, agents | Spreadsheet and enterprise BI users |
| **AI hook** | LLM-agnostic agents + SQL/GraphRAG on the ontology | D3 agents + MCP/SQL/REST on the semantic layer | MCP + governed metrics/context |
| **Open source core** | Commercial platform (SQL-ontology approach is the IP) | Cube Core Apache 2.0 | Platform closed; SML language Apache 2.0 |
| **When it is the wrong tool** | Simple single-star-schema metric consistency | Excel-native OLAP / MDX estates | Teams that need an explicit class/inference model |

Cube remains the better default when the job is **serve the same metric to many applications with caching and a broad API surface**. That is a real advantage: Cube Core is open source, the consumption story is mature, and D3 is an agent product on top of a semantic layer rather than a graph pitch. AtScale remains the better default when the job is **leave analysts in Excel and Power BI without extracting a new warehouse mart**. Timbr is the better default when the job is **stop agents from treating three customer tables as one class**, especially across more than one platform.

None of the three is "the semantic layer." They are three answers to three questions. Pretending otherwise produces spreadsheet scorecards where Timbr loses on CubeStore latency and Cube loses on OWL-style inference — categories neither product was designed to win.

The same honesty runs the other way, so write this down before a POC. Timbr is dead weight when:

- The metric problem is the *only* problem. If Finance and Growth disagree about `net_revenue` and agree about what a customer is, buy a metric layer. Ontology modeling will feel like ceremony.
- The estate is one warehouse, one star schema, and one BI tool. Cube or dbt Semantic Layer plus discipline will ship faster. Timbr's own writing admits the extra layer is not free and that native warehouse agents are a reasonable start for simple, single-platform needs. Believe them.
- The team cannot staff model ownership. An ungoverned ontology is a second undocumented schema. Inheritance amplifies mistakes: a wrong parent poisons every subtype.
- You need operational writeback, actions, and object-level applications. That is Palantir's shape, not a virtual SQL layer's.
- You need a public OWL reasoner and RDF interchange as the system of record. Timbr can <a href="https://timbr.ai/solutions/owl-to-sql-ontologies-upgrade/" rel="nofollow noopener">import OWL and map it into SQL ontologies</a>; that is a migration path, not a replacement for a Semantic Web stack, and it should not be sold as one.

If those bullets describe you, Timbr is not "worse Cube." It is a different layer you do not need yet. Decide the layer first — the [ontology definition](/blog/what-is-ontology/) and the [semantic layer vs ontology](/blog/semantic-layer-vs-ontology/) comparison — then pick a vendor inside it.

## 5. GraphRAG: a retrieval prior for wrong joins, not a document index

Timbr also talks about GraphRAG: retrieval that can walk relationships because the ontology is explicit, while the actual fetch is still SQL against the warehouse. Evaluate that as a pattern, not as a benchmark score. If your RAG corpus is documents, a SQL ontology will not magically become a document index. If your RAG corpus is structured enterprise data and the misses are wrong joins, walking typed relationships is a better retrieval prior than embedding table names.

That is a narrow but real use. The failure being fixed is not "the model could not find the text" — it is "the model picked a join path that does not exist in the business." An ontology changes the space the retriever searches: instead of nearest text over embedded table names, the search runs over relationships the organization has already declared. A document corpus will not benefit, and a vector store will not get faster. What improves is the prior — the agent stops guessing which tables connect and starts walking the ones that are modeled.

## 6. The producer problem: who keeps the class map true

Timbr's agents, in the company's telling, generate governed SQL against the ontology. Cube's D3 agents generate Semantic SQL against cubes. Warehouse-native agents generate SQL against tables, sometimes with a semantic view in the middle. The pattern is identical: **do not let the model see raw schema as the only map.** The disagreement is which map is sufficient.

A [data engineering agent](/blog/what-is-data-engineering-agent/) is still doing a different job from all three. It is supposed to *create and refresh* the map as schemas drift, metrics get redefined, and yesterday's "customer" splits into two classes. A virtual ontology that nobody updates is a more elegant way to be stale. The producer question — who notices that `dim_account` grew a reseller flag and that `Reseller` should become a class — is not answered by Timbr's existence any more than Cube's API answers who authors the YAML.

That is the Datus-shaped hole, described without pretending Timbr is deficient at being Timbr. Datus generates semantic models and metrics from schema and SQL and keeps a subject-tree map of domains so Subagents do not wander. If an organization runs Timbr, the engineering agent should be feeding and validating the ontology, not bypassing it. If an organization runs Cube, the same agent should be feeding cubes. The consumer product does not erase the producer problem.

## Conclusion

Timbr is a SQL-native, virtual ontology sitting on the warehouse: concepts, relationships, inheritance, rules, and measures, queried in SQL, without a mandatory graph database. It is the most direct commercial answer to the complaint that metric-only semantic layers do not give agents a type system. It is not a drop-in Cube alternative, not an AtScale alternative for Excel cubes, and not Palantir. Buy it when identity and multi-source meaning are the incident class you cannot close with another certified KPI. Skip it when measurement consistency on a single star schema is the whole job. And whatever you buy, budget the unfashionable work of keeping the model true after the first demo.

Next reading: [what an ontology is](/blog/what-is-ontology/), [semantic layer vs ontology](/blog/semantic-layer-vs-ontology/), and [what a semantic layer is](/blog/what-is-semantic-layer/).

## Frequently asked questions

### What is Timbr.ai?

Timbr is an ontology-based semantic layer. It models business concepts, relationships, hierarchies, and measures as a virtual SQL knowledge graph over existing warehouses and lakes, without moving data into a separate graph store.

### How is Timbr different from Cube?

Cube is a headless semantic layer and agentic analytics platform: metrics, dimensions, APIs, caching. Timbr is a SQL ontology: classes, relationships, inheritance, with measures inside that model. Cube wins distribution and open-source core. Timbr wins typed identity. See [Cube.dev's trajectory](/blog/cube-agentic-analytics/).

### How is Timbr different from a graph database?

Timbr is not a database. Graph databases store nodes and edges, usually by ingesting data. Timbr maps an ontology onto tables that stay where they are and compiles traversals to source SQL.

### Does Timbr replace a semantic layer?

It *is* a semantic layer of a particular kind — ontology-based — and it can host SQL measures and cubes. It does not replace a Cube or AtScale deployment if your requirement is their consumption surface (embedded APIs, MDX/DAX). It can replace a metric-only layer if your requirement is an explicit class map.

### Is Timbr open source?

The product is a commercial platform. The approach (SQL ontologies over warehouses) is documented publicly; do not confuse that with Cube Core's Apache-2.0 engine or AtScale's open-sourced SML language spec.

### When should a data team skip Timbr?

When the disagreement is only KPI formulas; when one warehouse and one BI tool already agree on entities; when nobody will own the ontology; or when you need Palantir-style writeback. Start with [what is an ontology](/blog/what-is-ontology/), then choose a productization.

## Related articles

- [What is a semantic layer?](/blog/what-is-semantic-layer/) — the category Timbr sits in.
- [What is an ontology?](/blog/what-is-ontology/) — the identity layer Timbr productizes in SQL.
- [Semantic layer vs ontology](/blog/semantic-layer-vs-ontology/) — measurement vs meaning, side by side.
- [Cube for agentic analytics](/blog/cube-agentic-analytics/) — a headless alternative modeling approach.
