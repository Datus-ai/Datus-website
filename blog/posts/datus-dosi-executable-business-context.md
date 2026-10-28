---
title: "Introducing DOSI: Executable Business Context for AI Agents"
description: "Meet DOSI, the semantic execution engine that turns reviewed Apache Ossie models into inspectable calculations for Datus teams, developers, and AI agents."
author: "Joanna He"
date: 2026-10-28
lastmod: 2026-10-28
tags: insight, release
heroImage: /images/datus-dosi-executable-business-context/cover-video.jpg
heroImageAlt: "Introducing Datus video featuring co-founder Shao Xie"
head:
  - - meta
    - name: keywords
      content: "DOSI, Datus semantic execution engine, executable business context, Apache Ossie, semantic models for AI agents, AI data agents"
  - - meta
    - property: og:title
      content: "Introducing DOSI: Executable Business Context for AI Agents"
  - - meta
    - property: og:description
      content: "Meet DOSI, the semantic execution engine that turns reviewed Apache Ossie models into inspectable calculations for Datus teams, developers, and AI agents."
  - - meta
    - property: og:type
      content: article
  - - meta
    - property: og:url
      content: https://datus.ai/blog/datus-dosi-executable-business-context/
  - - meta
    - property: og:image
      content: https://datus.ai/images/datus-dosi-executable-business-context/cover-video.jpg
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - link
    - rel: canonical
      href: https://datus.ai/blog/datus-dosi-executable-business-context/
---

# Introducing DOSI: Executable Business Context for AI Agents

## TL;DR

DOSI turns reviewed Apache Ossie semantic models into executable calculations. Datus Agent helps teams build the context; DOSI validates and runs compatible definitions so people and agents can inspect the SQL and lineage behind an answer.

Today, we’re introducing DOSI, Datus’s semantic execution engine. DOSI turns Apache Ossie (incubating) models into executable intelligence: business definitions agents can discover and reuse, with calculations teams can inspect and verify.

Datus’s vision is to provide The Trusted Enterprise Data Context for AI agents. Datus brings together business ontology, governed metric definitions and data provenance so agents can understand enterprise data in its business context. Datus Agent helps build that context from existing documents, warehouses and ETL scripts; DOSI makes compatible semantic models executable.

Use DOSI in Datus Studio, or run it locally as a standalone developer tool.

## Watch: Introducing Datus

Hear Datus co-founder Shao Xie explain the role of trusted semantic layers and business context for AI agents.

<div class="post-video">
  <iframe src="https://www.youtube.com/embed/5chnuwRGDT4" title="Introducing Datus: Trusted Semantic Layers and Business Context for AI Agents" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

<a href="https://www.youtube.com/watch?v=5chnuwRGDT4" rel="nofollow noopener" target="_blank">Watch the introduction on YouTube</a>.

## Why we built DOSI

Ask an agent, “Which customers are most valuable to our business?” Access to tables is only a starting point. The agent must understand what “valuable” means, how customers relate to purchases, costs and returns, and which measures are relevant to the decision. Column names alone cannot supply that understanding.

That knowledge is scattered across business documents, warehouse schemas, ETL logic and people. Without a shared model, each agent has to reconstruct the meaning for itself. One may equate value with spending; another may consider margin and purchase frequency. Even a perfectly calculated answer can address the wrong interpretation of the question.

Agreement also needs to survive beyond a single conversation. Once a team approves a business definition, other agents and applications should be able to reuse it. Its calculations must stay consistent too: the same cost exclusions, return rules and relationships should apply wherever the definition is used. That shared baseline makes answers easier to compare across workflows.

Business definitions also change over time. When reviewing an earlier recommendation, teams need to know which definition and data informed it. Keeping that context available is part of making agent-generated answers trustworthy.

That is the need behind DOSI: shared business knowledge that agents can act on, with calculations and evidence that give teams a clear basis for trusting the answers.

## Datus and DOSI at a glance

Datus brings these capabilities together through a workspace for teams, a data agent, and semantic execution grounded in an open specification. In Datus Studio, teams work with Datus Agent to build and use business context from documents, SQL, ETL scripts and warehouses. DOSI then turns Apache Ossie models into native SQL, making shared definitions usable by teams, AI agents and applications.

<div data-blog-home-architecture></div>

## What you can do with Datus and DOSI

### Build shared business understanding

For an agent to be business-aware, it needs to understand how business concepts relate to the question being asked. Datus connects the concepts and relationships to governed metrics and underlying data, helping agents select the relevant definitions and relationship paths.

Once that meaning is explicit, teams can reuse compatible definitions and map business concepts across supported sources. Agents then have a shared vocabulary to work from as questions move between teams and tools, while each DOSI query executes against its selected source.

### Create semantic models with agents

Building that shared understanding can take substantial manual effort, especially when the relevant knowledge is spread across existing systems. Datus Agent helps bring context from documents, warehouses and ETL scripts into semantic models your team can review and refine. You can start with one business domain and the questions people already ask, then build on existing SQL and modeling work rather than assemble every definition from scratch.

The models follow [Apache Ossie](https://dosi.datus.ai/concepts/what-is-osi/), an open, vendor-neutral specification for datasets, relationships, dimensions and metrics. Teams can reuse the models across compatible tools and agent workflows.

As your team checks the definitions and compares results with trusted queries, Datus Agent assists with modeling and DOSI validates and executes the compatible model. This connects an agent-native authoring workflow to an open semantic foundation that your team can continue to review and reuse.

### Inspect the calculation behind the answer

Once a model is ready to use, teams need to understand how its definitions become an answer. DOSI makes that path inspectable: a reviewer can follow a result through the generated SQL, metric definition and lineage to the source tables. Along the way, the engine applies explicit rules for supported joins and aggregation grain, checks for fan-out risks, and returns an actionable error when a request cannot be resolved safely within the model.

This is what makes the workflow audit-ready: teams have evidence they can examine when checking a calculation or explaining a result. They remain responsible for approving business definitions, validating source data, and meeting their compliance requirements.

![The path from a reviewed definition through DOSI planning and native SQL to an inspectable result and source lineage.](/images/datus-dosi-executable-business-context/inspectable-calculation-workflow.png)

### From a business question to a result your team can check

Consider a customer-success team asking which customers are most valuable. One team might mean total purchases, while another means revenue after returns. Before an agent can answer, people need to settle that definition and decide which customer and order records belong in the calculation. Datus Agent can help gather candidate context from existing documents, warehouse schemas and SQL. The team then reviews the proposed model, confirms the business rule and tests it against queries they already trust. That review step matters: an agent can help assemble context, but it cannot decide what “valuable” should mean for the business.

With an approved definition in place, the agent can ask DOSI for the named metric and the dimensions needed for the question. DOSI uses the model to plan the joins and aggregation, produces SQL for the selected source, and can run the query there. If the requested relationship is ambiguous or a safe calculation cannot be established, the engine reports the issue instead of quietly returning a plausible number. When it does return a result, a reviewer can examine the generated SQL and lineage and check which definition and source data produced it.

This is the practical split between the products: Datus Agent helps people build and maintain business context; DOSI makes compatible definitions executable and inspectable. The same reviewed model can support another question or agent workflow without requiring every agent to infer the metric again from table names.

## Key features at launch

DOSI provides the execution capabilities behind this workflow. At launch, the module includes:

- **Lightweight, with one consistent experience.** DOSI is a single Rust binary with no runtime dependencies. It installs with one command and runs entirely locally. Build, validate and query metrics through the CLI, REST/Arrow, MCP or Python—all four interfaces share the same compiler and error contract.

- **An interface built for agents.** DOSI’s MCP server exposes semantic tools, so agents request metrics instead of writing aggregate SQL. Errors return stable codes, valid candidates and a suggested_retry, giving agents the information they need to correct a query rather than retry blindly.

- **Fast compilation and result delivery.** Agents may call the semantic layer repeatedly during an analysis, so compilation overhead matters. DOSI generates SQL quickly and supports [end-to-end Arrow streaming](https://dosi.datus.ai/arrow/) for efficient result delivery. The [published benchmark](https://dosi.datus.ai/benchmarks/) reports measurements on a small shared test model; performance will depend on the model and workload.

- **Deterministic calculation rules.** DOSI refuses to generate an aggregate query unless it can establish that the calculation is safe from join fan-out. If a join path is ambiguous, it returns an error listing the candidates. Whether a metric can be summed, rolled up or attributed is determined by the model, giving agents explicit rules to follow.

- **An open specification, multiple SQL dialects and broad agent access.** DOSI loads Apache Ossie YAML natively, without a sidecar format or a duplicate set of semantic definitions. It can also check models against the upstream reference validator. A single definition compiles to 16 SQL dialects and is accessible to agents through MCP or HTTP. See the [supported data sources](https://dosi.datus.ai/connectors/) for the current list.

- **More expressive metrics, fewer definitions to maintain.** Nested, derived and parameterized metrics, together with period-over-period comparisons and rolling and cumulative windows, let a small set of stable definitions cover core business questions. Level-of-detail controls let a metric fix, extend or adjust its calculation grain independently of the query’s group-by—for example, calculating first-order revenue per customer and then rolling it up by region. The named metric defines the contract; dimension filters supply the parameters.

- **Aggregates and detail rows with shared semantics.** The query operation returns aggregates, while select retrieves detail rows using the same filters and join paths. Teams can drill into results without writing separate SQL that may quietly omit part of the metric’s definition.

- **Built-in metric attribution.** For supported metric types, a single call breaks down a metric’s change using a method suited to its type: term-wise decomposition for additive metrics, mix-shift analysis for ratios, or Shapley attribution for products. For supported, attributable metrics, the contributions reconcile to the total change, making the explanation verifiable. See [metric attribution](https://dosi.datus.ai/attribution/) for supported methods and limits.

- **Business ontology grounded in your metrics.** An [Apache Ossie ontology](https://dosi.datus.ai/lineage/) adds explicit business concepts, rules and relationships to the semantic model, which DOSI compiles into SQL. This gives agents a foundation for following company definitions and standard operating procedures when reasoning through a decision, connecting business context to the calculations that support it.

## Get started in Datus Studio or locally

To put these capabilities to work, start with the experience that fits your team. Datus Studio brings shared business context and DOSI’s semantic execution together in one workspace.

[Try Datus Studio](https://studio.datus.ai/)

For developers who want to build their own workflow, run DOSI locally and connect it to your agents or applications.

[Quickstart DOSI](https://dosi.datus.ai/)

Start with one domain, review its definitions and put a trusted calculation to work.

## Helpful resources

- [DOSI quickstart](https://dosi.datus.ai/tutorials/first-metric-query/) — Run your first metric query.

- [Supported data sources](https://dosi.datus.ai/connectors/) — Connector setup and execution support.

- [Agent integration guides](https://dosi.datus.ai/agents/) — Connect Claude Code, Codex, or OpenCode.

- [Metric lineage](https://dosi.datus.ai/lineage/) — Inspect where a metric comes from.

- [Apache Ossie explained](https://dosi.datus.ai/concepts/what-is-osi/) — Understand the semantic specification behind DOSI.

## Frequently asked questions

### What is the difference between Datus Agent and DOSI?

Datus Agent helps teams gather business context and develop semantic models from existing knowledge. People review and approve the definitions. DOSI takes compatible Apache Ossie models, validates them, and turns metric requests into native SQL for a selected data source. Together, they connect model creation with calculations that teams can inspect.

### Can Datus help build a semantic model from existing documents and SQL?

Yes. Datus Agent can help gather candidate definitions from business documents, warehouse schemas, ETL scripts, and existing SQL. Start with one business domain, then review the proposed model and compare its results with queries your team already trusts. The team still decides what each business term and metric should mean.

### How can a team check an answer produced with Datus and DOSI?

The team can inspect the approved metric definition, generated SQL, and lineage behind a DOSI result, then compare it with a trusted query. DOSI reports an issue when a requested relationship is ambiguous or a safe calculation cannot be established within the model. Reviewers remain responsible for validating the definition and source data.

### Can I use DOSI without Datus Studio?

Yes. DOSI can run locally as a standalone developer tool. Datus Studio provides a shared workspace, while developers can use DOSI through its CLI, REST/Arrow, MCP, or Python interfaces. Start with the [DOSI quickstart](https://dosi.datus.ai/tutorials/first-metric-query/) and connect an appropriate data source.

### How does DOSI relate to Apache Ossie?

Apache Ossie is the open semantic modeling specification. DOSI reads compatible Ossie models and turns supported definitions into SQL for a selected source. Interoperability depends on the features each tool and converter supports; teams should validate the model and compare results with trusted queries.

## Related articles

- [Introducing Dosi: OSI-Native Semantic Layer for Metrics](/blog/introducing-dosi/) — a technical look at the engine and its interfaces.

- [Semantic Layer in the Agent Loop](/blog/semantic-layer-in-the-agent-loop/) — why agents need governed calculations during analysis.

- [Ontology for AI Agents](/blog/ontology-for-ai-agents-five-approaches/) — approaches to grounding business context.

Apache Ossie (incubating) is a project in the Apache Incubator. Apache and Apache Ossie are trademarks of the Apache Software Foundation (ASF). Datus and DOSI are independent products and are not endorsed by the ASF.

