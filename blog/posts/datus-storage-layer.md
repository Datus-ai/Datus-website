---
title: "Datus Storage Layer: A Foundation Built for Every Environment"
description: "Pluggable storage adapters that separate relational and vector storage from the agent core for enterprise flexibility."
date: 2026-03-25
lastmod: 2026-03-25
author: Datus Team
head:
  - - meta
    - name: keywords
      content: datus storage layer, pluggable storage, data agent storage, vector database adapter, knowledge base portability, enterprise data agent, SQLite LanceDB, agent memory, semantic search storage, datus-storage-base
  - - meta
    - property: og:title
      content: "Datus Storage Layer: A Foundation Built for Every Environment"
  - - meta
    - property: og:description
      content: "A pluggable storage adapter layer that enables enterprise deployments, portable knowledge bases, and backend flexibility — without forking."
  - - meta
    - property: og:type
      content: article
  - - meta
    - property: og:url
      content: https://datus.ai/blog/posts/datus-storage-layer
  - - meta
    - property: og:image
      content: https://datus.ai/logo_dark.svg
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - meta
    - name: twitter:title
      content: "Datus Storage Layer: A Foundation Built for Every Environment"
  - - meta
    - name: twitter:description
      content: "A pluggable storage adapter layer that enables enterprise deployments, portable knowledge bases, and backend flexibility."
  - - meta
    - property: article:published_time
      content: "2026-03-25"
  - - meta
    - property: article:section
      content: Architecture
  - - link
    - rel: canonical
      href: https://datus.ai/blog/posts/datus-storage-layer
---

# Datus Storage Layer: A Foundation Built for Every Environment

A data agent is only as reliable as its storage. Session memory, the knowledge base, schema metadata, semantic search indexes — these are not peripheral features. They are what make an agent useful over time: the place where it learns your team's SQL conventions, remembers what it discovered last week, and finds the right metric definition without being told where to look.

For most early users of Datus, the defaults worked fine. SQLite stored relational state. LanceDB handled vector search. Both were embedded, zero-configuration, and fast. But as Datus moved into more serious production environments, the same question kept coming up: *what if we can't run those here?*

The new storage adapter layer is the answer.

## The problem with hard-coded storage

Data teams don't get to choose their infrastructure. A shared Postgres instance might be mandatory for compliance. An enterprise vector store might already be deployed and licensed. Running SQLite in a containerised production environment might be blocked by policy. An on-premises deployment might have no outbound network access at all.

When storage is hard-coded into the agent, none of these constraints can be accommodated without patching core code — which means forking, maintaining divergence, and absorbing every upstream change by hand.

More subtly: hard-coded storage makes every team's deployment identical in a domain where deployments are anything but. The knowledge base a fintech team builds looks nothing like the one a logistics company builds. The scale, the query patterns, and the infrastructure expectations are different. A storage layer that can't adapt to these realities is a ceiling, not a foundation.

## What the adapter layer changes

The new architecture separates *what Datus does with storage* from *which storage technology it uses to do it*.

Datus needs two fundamentally different kinds of storage. **Relational storage** holds structured operational state: conversation history, schema cache, subject taxonomies, session metadata. **Vector storage** holds the semantic knowledge base: KPI definitions, reference SQL patterns, domain rules, everything the agent uses to give context-aware answers rather than generic ones.

Both are now fully pluggable. Datus defines a clean contract for each — what operations it expects, what data flows in and out — and any backend that satisfies that contract can be used in its place. The defaults (SQLite and LanceDB) remain exactly as they were for teams that don't need to change them. For teams that do, it's a single configuration line.

## Why this matters for data engineering teams

### The knowledge base travels with your infrastructure

The knowledge base is the most valuable artifact a team builds while using Datus. It accumulates SQL patterns, metric definitions, business rules, and the institutional knowledge that normally lives in someone's head or an unread Confluence page. Making that knowledge base portable — able to run against whatever vector store your organization already operates — means it can live in production infrastructure, benefit from existing backup and replication policies, and scale with your data platform rather than alongside it.

### Session memory works across your deployment model

Multi-turn agent sessions are only useful if the memory persists reliably. In single-developer use, SQLite is ideal. In a shared deployment where multiple analysts use the same Datus instance, a shared relational backend means sessions, schema metadata, and taxonomy state are consistent for everyone. Switching the relational backend requires no changes to the agent, no migration scripts, and no interruption to running sessions.

### Enterprise deployments become first-class citizens

Many data platforms have strict controls on what software can be installed, what can reach the network, and what storage engines can hold sensitive metadata. An adapter-based model means that an organization running an approved enterprise vector database and a managed PostgreSQL service can run Datus entirely within that stack — without a carve-out for embedded storage engines that haven't gone through security review.

### Third parties can extend without forking

The adapter contract is published as a standalone package (`datus-storage-base`). Any team — or any storage vendor — can implement the contract and publish it as an installable adapter. Installing the adapter is sufficient; no changes to Datus configuration files, no restarts, no core modifications. This means the ecosystem of supported backends can grow independently of Datus's release cycle.

## Continuity for existing users

The adapter layer is purely additive. Teams running on the defaults see no change at all — SQLite and LanceDB are still registered and active out of the box. The knowledge bases, session histories, and schema caches built on previous versions continue to work exactly as before.

Switching backends is a deliberate choice, not a forced migration. When a team is ready — when they want the knowledge base in their enterprise vector store, or session history in their managed database — the transition is a one-line change in `agent.yml` and an adapter package install. The agent's behavior is unchanged. The data it has accumulated remains accessible.

## The bigger picture

Datus is built around a core idea: that data work benefits from an agent that learns, remembers, and reasons about your specific data environment rather than treating every query as a blank slate. That capability depends entirely on storage that is reliable, scalable, and appropriate for the environment the agent lives in.

The storage adapter layer makes that environment a variable, not a constraint. Whether Datus runs on a developer's laptop with embedded defaults, inside a cloud data platform with managed services, or in an on-premises deployment with strict infrastructure controls — the agent's reasoning capabilities, its knowledge base, and its memory are fully available.

The thinking is the product. The storage is just where it lives. Now teams can choose where that is.
