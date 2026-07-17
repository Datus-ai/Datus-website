---
title: "What Is a Data Contract? Definition, Schema Enforcement & Examples"
description: "Data contract definition: a machine-checked producer–consumer agreement on schema, semantics, quality, and SLAs. Tools, enforcement, and the agent angle."
author: "Evan Paul"
date: 2026-06-29
lastmod: 2026-07-10
head:
  - - meta
    - name: keywords
      content: "data contract, what is a data contract, data contract example, schema enforcement, ODCS, dbt contracts, data contract vs data quality test"
  - - meta
    - property: og:title
      content: "What Is a Data Contract? Definition, Schema Enforcement & Examples"
  - - meta
    - property: og:description
      content: "Data contract definition: a machine-checked producer–consumer agreement on schema, semantics, quality, and SLAs. Tools, enforcement, and the agent angle."
  - - meta
    - property: og:type
      content: article
  - - meta
    - property: og:url
      content: https://datus.ai/blog/what-is-data-contract/
  - - meta
    - property: og:image
      content: https://datus.ai/logo_dark.svg
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - link
    - rel: canonical
      href: https://datus.ai/blog/what-is-data-contract/
---

# What Is a Data Contract? Definition, Schema Enforcement & Examples

**A data contract** is a machine-checkable agreement between the producer of a dataset and its consumers that specifies the dataset's **schema, semantics, quality rules, freshness SLAs, and ownership** — and fails a build or a pipeline when reality drifts from what was promised. When an upstream team renames a column or quietly changes what "active" means, a data contract turns a silent downstream breakage into a loud, early error. This guide defines data contracts, shows a concrete example, compares the tooling, and explains how they fit an agentic data stack.

*Disclosure: Datus is a data engineering agent platform. This article explains data contracts as a general concept, referencing Datus alongside other tools and approaches in the category. See the end for more detail.*

## TL;DR

- A **data contract** is an explicit, versioned, machine-enforced interface for a dataset — schema plus semantics, quality, SLAs, and ownership — not just a schema definition.
- It **shifts data-quality responsibility left** to the producer, so consumers stop absorbing surprise breakages downstream.
- Enforcement happens **before bad data lands**: schema checks in CI/CD, a schema registry on a stream, or a `dbt` build that fails when the output shape drifts.
- The dominant standard is the **Open Data Contract Standard (ODCS)** — a YAML spec now under the Linux Foundation's Bitol project — with `dbt` model contracts and the `datacontract.com` specification as common companions.
- A contract describes **the "what" of an interface**; it does not capture the ad-hoc, evolving knowledge (validated queries, deprecations, tribal join rules) that agents also need. The two are complementary.

## 1. Data contract: a working definition

The phrase gets used loosely — sometimes for a JSON Schema file, sometimes for a Confluence page of good intentions. A production-oriented definition is stricter:

> A **data contract** is a versioned, machine-readable specification that defines a dataset's **structure** (fields and types), **semantics** (what each field means), **quality expectations** (nullability, ranges, uniqueness), **service levels** (freshness, availability, completeness), and **ownership** (who produces it and who to page) — and that is **automatically checked** so violations are caught before consumers are affected.

Two words carry the weight: *machine-checkable* and *interface*. A document that describes a table but cannot fail a build is documentation, not a contract. And a contract governs the **boundary** between a producer and its consumers — it deliberately separates the internal implementation (how the table is built) from the external promise (what it guarantees), the same way an API contract separates a service's internals from its endpoints.

| Data contract *is* | Data contract is *not* |
| --- | --- |
| A machine-checked interface that can fail a build | A wiki page or a Slack agreement |
| Owned and published by the **producer** | A cleanup rule the consumer maintains |
| Schema **plus** semantics, quality, SLAs, ownership | A bare `CREATE TABLE` DDL |
| Versioned, with a deprecation policy | A one-time snapshot of "current columns" |

## 2. Why data contracts exist: the breaking-change problem

The canonical failure mode: an upstream service team renames `user_status` to `account_state`, or changes its values from strings (`active`, `churned`) to integer codes (`1`, `7`), to support a feature they own. They have no idea that three dashboards, a churn model, and a finance reconciliation job read that column. The pipeline does not error — it happily loads the new shape — and the breakage surfaces days later as a board-deck number that does not reconcile.

Data contracts emerged to make that boundary explicit and enforced. The term was popularized around 2021–2022: <a href="https://andrew-jones.com/blog/data-contracts/" rel="nofollow noopener">Andrew Jones</a> wrote about GoCardless's implementation in December 2021 and later published *Driving Data Quality with Data Contracts* (June 2023), while <a href="https://medium.com/paypal-tech" rel="nofollow noopener">PayPal</a> described contracts inside its data-mesh program (2022) and open-sourced its Data Contract Template in May 2023 — the seed that became ODCS. In the <a href="https://www.gartner.com/en/documents/hype-cycle-for-data-management" rel="nofollow noopener">Gartner Hype Cycle for Data Management 2025</a>, data contracts appear as an emerging mechanism for building trust and enforcing governance as platforms decentralize.

The underlying shift is **producer accountability**. In the old model, data teams cleaned up messes downstream — reactive, endless, and blame-prone. A contract moves the guarantee to the source: the producer promises a shape and a quality bar, and the platform enforces it at production time.

## 3. What is inside a data contract (with an example)

A well-formed contract has a stable set of sections. Here is a trimmed example in the style of the **Open Data Contract Standard (ODCS)** — YAML, versioned, and checkable:

```yaml
apiVersion: v3.1.0
kind: DataContract
id: orders-fact-v2
info:
  title: fact_orders
  version: 2.1.0
  owner: revenue-platform-team
  contact:
    channel: "#revenue-data"
schema:
  - name: fact_orders
    physicalName: fact_orders
    properties:
      - name: order_id
        logicalType: string
        required: true
        unique: true
      - name: net_revenue_usd
        logicalType: number
        description: "Order revenue after refunds, excluding tax and test accounts."
        required: true
      - name: order_status
        logicalType: string
        description: "One of: placed, shipped, refunded, cancelled."
quality:
  - property: net_revenue_usd
    rule: "value >= 0"
  - property: order_id
    rule: duplicateCount
    mustBe: 0
slaProperties:
  - property: freshness
    value: 24
    unit: hours
  - property: availability
    value: 99.5
    unit: percent
```

The sections generalize across standards:

- **Schema / structure** — field names, types, required flags, keys.
- **Semantics** — what each field *means* (`net_revenue_usd` = after refunds, excluding tax and test accounts). This is the part a bare DDL always omits and the part that causes the most expensive misreads.
- **Quality rules** — nullability, ranges, uniqueness, referential integrity.
- **SLAs / service levels** — freshness (updated within 24h), availability, completeness. ODCS v3.1.0 added *executable* SLAs that can be scheduled and monitored.
- **Ownership & support** — the producing team, a contact channel, and a deprecation/versioning policy.

## 4. How schema enforcement actually works

A contract only matters if it can *fail something*. There are three common enforcement points, from earliest to latest:

### At build time (transformation layer)

`dbt` **model contracts** are the most widely used example. You set `contract: enforced: true` on a model and declare its columns and `data_type`s in YAML. On build, dbt runs a **preflight check** — it confirms the model's query returns exactly the declared column names and types (order-agnostic) — then embeds the names, types, and constraints in the DDL it submits to the warehouse. If the transformation would produce a different shape, the build fails before the table is written.

```yaml
models:
  - name: fact_orders
    config:
      contract:
        enforced: true
    columns:
      - name: order_id
        data_type: string
        constraints:
          - type: not_null
      - name: net_revenue_usd
        data_type: numeric
```

Constraint enforcement is **platform-dependent**, and this trips people up. Across Snowflake, Redshift, BigQuery, and Databricks, `not_null` is definable and enforced, but `primary_key`, `foreign_key`, and `unique` are *definable but not enforced* — dbt records them as metadata, the warehouse does not police them. Postgres enforces all of them; `check` constraints are enforced only on Postgres and Databricks. Model contracts also do not apply to Python models, `ephemeral`, or `materialized view` materializations. Read the matrix before you assume a `unique` constraint is protecting you.

### At ingestion time (streaming / schema registry)

For event streams, a **schema registry** (Avro/Protobuf/JSON Schema with compatibility rules) rejects a producer's message the moment its shape violates the registered schema — the invalid payload never reaches the topic, so no consumer ever sees it. This is the strongest form of "shift left": enforcement happens at the point of production.

### In CI/CD and monitoring (proactive vs reactive)

Contract tooling such as the <a href="https://datacontract.com/" rel="nofollow noopener">Data Contract Specification and CLI</a> (an MIT-licensed spec by INNOQ) lets you `lint`, `test`, and `export` contracts, and wire the tests into CI so a pull request that would break the contract fails review — **proactive** enforcement. Complementary tools like <a href="https://www.soda.io/" rel="nofollow noopener">Soda</a> or <a href="https://greatexpectations.io/" rel="nofollow noopener">Great Expectations</a> monitor already-landed data against contract thresholds — **reactive** enforcement that catches what slipped through. Mature setups use both.

## 5. Data contract vs the things it is confused with

| Concept | What it governs | Timing | Who owns it |
| --- | --- | --- | --- |
| **Data contract** | The full producer→consumer interface (schema + semantics + quality + SLA) | Before bad data lands | Producer |
| **Data quality test** | A single assertion on data that already exists | After write | Consumer / platform |
| **Schema registry** | Wire-format compatibility of stream messages | At produce time | Platform |
| **Data catalog** | Discovery — what exists and where | After the fact | Central / crowd |
| **Semantic layer** | How business metrics are computed | Query time | Analytics eng |

The most useful distinction is **contract vs test**. A [data-quality test](/blog/what-is-data-catalog/) checks data that is already in the table — reactive by nature. A contract checks the *schema and rules before* the data is written, and governs an interface rather than a single column. Tests are necessary but downstream; contracts push the guarantee upstream.

Contracts are also not a [semantic layer](/blog/what-is-semantic-layer/). A contract says `net_revenue_usd` exists, is non-negative, and means "after refunds." A semantic layer says *how to compute* net revenue across queries and enforces that definition at read time. They overlap on semantics but operate at different boundaries — the contract at the table's edge, the semantic layer at the query. And a contract is not a [data catalog](/blog/what-is-data-catalog/): the catalog helps humans *discover* a table; the contract *governs* what that table promises.

## 6. The tooling landscape (2026)

| Tool / standard | What it is | Enforcement | Notes |
| --- | --- | --- | --- |
| **ODCS (Bitol)** | Open Data Contract Standard, YAML spec | Via engines that read it | Linux Foundation AI & Data project; from PayPal's template; v3.1.0 (Dec 2025) |
| **dbt model contracts** | Contract config on dbt models | Build-time preflight + DDL | Constraint enforcement is platform-dependent |
| **datacontract.com** | Data Contract Specification + CLI | `lint` / `test` in CI | MIT-licensed, by INNOQ; exports to dbt, JSON Schema, Avro |
| **Schema registry** | Confluent/Apicurio for streams | At produce time | Strongest shift-left for events |
| **Soda / Great Expectations** | Data quality frameworks | Post-write monitoring | Reactive; pair with a contract for full coverage |

The **Open Data Contract Standard** is the center of gravity. It began as PayPal's Data Contract Template, was open-sourced in May 2023, and became the first ODCS release under **Bitol** (a Linux Foundation AI & Data project, Apache-2.0) in November 2023. ODCS v3.0.0 (October 2024) added richer data-quality support, and v3.1.0 (December 2025) added property relationships, stricter JSON Schema validation, and executable SLAs. Because it is plain YAML, a contract can be versioned in Git and governed like code — which is exactly what makes it consumable by automated systems, including agents.

## 7. Data contracts and data engineering agents

Data contracts and [data engineering agents](/blog/what-is-data-engineering-agent-2026/) meet at a specific seam: a contract is **machine-readable, authoritative context** about a dataset, and an agent that generates SQL or builds pipelines needs exactly that context to be reliable.

An agent doing [schema linking](/blog/what-is-schema-linking/) — mapping "revenue last quarter" to real columns — benefits directly when a contract states that `net_revenue_usd` is the revenue field, that it excludes test accounts, and that `order_status = 'refunded'` is a valid filter. That is grounding the agent would otherwise have to guess. In an agentic [data mesh](/blog/what-is-data-mesh/), domain [Subagents](/blog/subagents-domain-specific-data-agents/) can consume the contracts of the datasets in their scope as first-class context: a Revenue Subagent that reads the `fact_orders` contract knows not only the shape but the semantics and the freshness guarantee behind every number it returns.

But it is important to be honest about the limits. A contract captures the **stable, formalized** part of an interface. It does not capture the fast-moving, ad-hoc knowledge that actually drives correctness in production: the validated reference SQL for "power users who churned after the price change," the note that `legacy_id` should never be used for joins after March, the tribal preference for one join path over another. That knowledge lives outside any contract — and it is precisely what an **evolvable context engine** is built to hold. This is the [contextual data engineering](/blog/contextual-data-engineering/) argument: contracts are the governed floor; institutional memory (validated queries, deprecations, feedback) is the living layer above it. A reliable agent needs both — it reads the contract to know the promise, and it reads accumulated context to know what the organization actually trusts today.

The relationship is complementary, not competitive. Contracts make the producer boundary explicit and enforced; context engines make the accumulated, evolving knowledge retrievable. Data contracts do not replace evolvable context, and evolvable context does not remove the need for contracts.

## 8. Adopting data contracts: a practical checklist

1. **Start at the boundary that breaks most.** Put your first contract on the one upstream dataset whose changes have burned you — not on all 4,000 tables.
2. **Contract the interface, not the internals.** Govern what consumers depend on; leave the producer free to refactor behind it.
3. **Put semantics in, not just types.** The `data_type` catches structural breaks; the description catches the expensive misreads. Write what each field means.
4. **Enforce as early as you can.** Prefer produce-time (schema registry) or build-time (dbt contract) enforcement over post-hoc monitoring — but keep monitoring as the safety net.
5. **Version and deprecate explicitly.** A contract without a deprecation policy just relocates the breaking change; state a backward-compatibility window.
6. **Make contracts machine-readable from day one.** YAML in Git (ODCS or the Data Contract Specification) so both CI and downstream agents can consume them.

## Conclusion

A **data contract** turns the invisible handshake between data producers and consumers into an explicit, versioned, machine-enforced interface — schema, semantics, quality, SLAs, and ownership — checked before bad data can spread. It shifts responsibility left, and it gives automated systems something they badly need: authoritative, machine-readable context. But a contract governs only the formalized floor of an interface. The ad-hoc, evolving knowledge that separates a plausible answer from a correct one still has to live somewhere — which is why, in an agentic stack, data contracts and evolvable context are two halves of the same reliability story.

## Frequently asked questions

### What is the difference between a data contract and a data quality test?

A **data quality test** asserts something about data that already exists — "no nulls in `email`," "revenue is non-negative" — and runs *after* the data is written, so it is reactive. A **data contract** is broader and earlier: it defines the whole producer→consumer interface (schema, types, semantics, SLAs, ownership) and is enforced *before* bad data lands — a failed `dbt` build, a rejected stream message, a blocked pull request. Tests catch bad values; contracts prevent bad shapes and unannounced changes. Most teams use both, with tests operating inside the quality section of a contract.

### Is a data contract just a schema definition?

No. A schema (a `CREATE TABLE` or JSON Schema) describes structure — field names and types. A data contract includes structure *plus* semantics (what each field means), quality rules, freshness and availability SLAs, ownership, and a versioning/deprecation policy — and, critically, it is enforced automatically. A schema tells you `order_status` is a string; a contract tells you which values are valid, that the producer guarantees daily freshness, and who to page when it breaks. The schema is one section of the contract.

### What is ODCS and who maintains it?

**ODCS** is the Open Data Contract Standard, a YAML specification for writing data contracts. It originated as PayPal's Data Contract Template, was open-sourced in May 2023, and is now maintained by **Bitol**, an Apache-2.0 project under the Linux Foundation AI & Data. Bitol released the first ODCS in November 2023, v3.0.0 in October 2024, and v3.1.0 in December 2025 (adding property relationships, stricter validation, and executable SLAs). Because ODCS is plain, versionable YAML, contracts written in it can be governed like code and consumed by CI pipelines and agents alike.

### Do data contracts replace a semantic layer or a data catalog?

No — they operate at different boundaries. A **data contract** governs the interface at a dataset's edge (what the producer promises). A **semantic layer** governs how business metrics are computed at query time. A **data catalog** helps humans discover what data exists. They overlap slightly on semantics but solve different problems, and a mature platform typically runs all three: catalog for discovery, contracts for producer guarantees, semantic layer for metric consistency.

### How do data contracts help AI agents and text-to-SQL?

A contract is machine-readable, authoritative context. An agent doing text-to-SQL or schema linking can read a contract to know that `net_revenue_usd` is the revenue field, that it excludes test accounts, and which status values are valid — grounding it would otherwise guess. In practice, contracts cover the *stable* part of that context; the ad-hoc, fast-moving knowledge (validated reference SQL, deprecations, join preferences) lives in an evolvable context engine. Reliable agents consume both: the contract for the promise, the context engine for what the organization currently trusts.

## Related articles

- [What is data mesh?](/blog/what-is-data-mesh/) — where contracts implement "data as a product"
- [What is a data catalog?](/blog/what-is-data-catalog/) — discovery vs governed interface
- [What is a semantic layer?](/blog/what-is-semantic-layer/) — governed metrics vs contracted interfaces
- [What is schema linking?](/blog/what-is-schema-linking/) — how contracts ground agent column mapping
- [What is change data capture (CDC)?](/blog/what-is-cdc/) — where schema drift enters, and why contracts guard the boundary
- [Contextual data engineering](/blog/contextual-data-engineering/) — the evolvable layer above the contract floor

---

*Disclosure: Datus is a data engineering agent platform. This glossary entry explains data contracts as a general concept and how Datus complements them — consuming contracts as machine-readable context while adding the evolvable, institutional knowledge (validated reference SQL, deprecations, feedback) that contracts do not capture, through dual-dimension context and domain-scoped Subagents.*
