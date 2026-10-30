---
title: "Open Semantic Interchange: From OSI to Apache Ossie"
description: "Trace Open Semantic Interchange from its 2025 launch to Apache Ossie, understand open governance, and plan adoption around verified tools and model versions."
author: "Evan Paul"
date: 2026-06-09
lastmod: 2026-10-30
head:
  - - meta
    - name: keywords
      content: "Apache Ossie, Apache Ossie incubating, Open Semantic Interchange, OSI, Ossie semantic layer, Ossie semantic model specification, OSI semantic layer, OSI specification, semantic layer standard, portable semantics, Snowflake OSI, semantic interoperability"
  - - meta
    - property: og:title
      content: "Open Semantic Interchange: From OSI to Apache Ossie"
  - - meta
    - property: og:description
      content: "Trace Open Semantic Interchange from its 2025 launch to Apache Ossie, understand open governance, and plan adoption around verified tools and model versions."
  - - meta
    - property: og:type
      content: article
  - - meta
    - property: og:url
      content: https://datus.ai/blog/open-semantic-interchange-osi/
  - - meta
    - property: og:image
      content: https://datus.ai/logo_dark.svg
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - link
    - rel: canonical
      href: https://datus.ai/blog/open-semantic-interchange-osi/
---

# Open Semantic Interchange: From OSI to Apache Ossie

## TL;DR

Open Semantic Interchange (OSI) began as a cross-industry initiative in September 2025. It is now developed as Apache Ossie (incubating), with public community governance. This article explains that history and what it changes for adoption; the [Apache Ossie guide](/apache-ossie/) covers the current specification and model examples.

**Open Semantic Interchange (OSI) is the former name of the initiative now known as Apache Ossie.** Its history matters because portability requires more than a document format: teams need a shared place to discuss changes, maintain mappings, and decide what compatibility means. The rename connects an industry initiative to an Apache community; it does not make every existing model or product integration interchangeable overnight.

For current model fields, YAML and JSON, ontology, and execution, use the guide above. Here the focus is the project's origins, the move to Apache, and the adoption decisions that remain with your team.

## Why an interchange initiative emerged

A business definition often begins in a working query, a report, or a transformation project. As new tools consume that definition, teams may recreate its calculation and assumptions in several formats. Even when two tools use YAML, they may disagree about what a field, relationship, filter, or metric means.

This makes exchanging models a different problem from executing queries. A query engine needs to calculate a result on a particular system. An interchange initiative needs to describe the intended business meaning in a form that compatible systems can exchange. The two responsibilities meet at the model, but they require different implementations.

OSI formed around that exchange problem. Its goal was to let business meaning travel across analytics, BI, and AI systems without requiring each pair of products to invent an unrelated mapping. That is a direction for interoperability, not evidence that every source expression already has an equivalent in every destination.

## The timeline: OSI to Apache Ossie

| Milestone | What happened | What it means for adopters |
| --- | --- | --- |
| September 23, 2025 | Snowflake and partners including Salesforce, dbt Labs, and RelationalAI announced Open Semantic Interchange. | A shared response to fragmented semantic definitions, rather than a new warehouse or BI application. |
| November 2025 | The public repository opened, according to the later Apache project update. | Models, tooling, and proposals could be reviewed through public development. |
| July 10, 2026 announcement | The project announced its Apache Incubator home and the name Apache Ossie. | The new name and community governance became the reference points for ongoing work. |

The first milestone comes from the <a href="https://www.snowflake.com/en/news/press-releases/snowflake-salesforce-dbt-labs-and-more-revolutionize-data-readiness-for-ai-with-open-semantic-interchange-initiative/" rel="nofollow noopener">original launch announcement</a>. The repository history and renaming are described in the [Apache project update](https://ossie.apache.org/updates/ossie-enters-apache-incubator/). July 10 is the publication date of that announcement; this article does not treat it as proof of the formal acceptance date.

Ossie replaced the OSI project name to avoid confusion with other uses of the acronym. Historical article URLs, integrations, and commands may still say OSI. Keep those names recognizable when finding older material, but check the version of the document you actually intend to use.

## What Apache governance changes

Apache Ossie is an incubating project at the Apache Software Foundation, not a graduated Apache top-level project. The specification, documentation, and code are developed under Apache-2.0. Incubation concerns the project's establishment as a sustainable Apache community; it should not be read as certification of a particular product implementation.

The practical difference is how shared decisions become visible. Development discussions and consensus are recorded on the public dev mailing list. Working groups discuss metrics and querying, catalog integration, and ontology representation. A proposal discussed in a meeting still needs the project's public decision process. Readers can follow that process through the [official community page](https://ossie.apache.org/community/) and contribution guide.

Governance of the project is also different from governance of your business definitions. The community can agree on the specification; your team still owns who reviews a revenue definition, how changes are approved, and which version a consumer runs. Adopting an open format does not automatically establish those responsibilities inside your organization.

## Who participates, and what support means

The [official ecosystem directory](https://ossie.apache.org/ecosystem/) includes organizations such as Snowflake, Databricks, Salesforce, dbt Labs, Microsoft, Cube, GoodData, RelationalAI, and Datus. The directory links detailed implementations where supplied. It is a better starting point than carrying an undated organization count across articles.

Participation and usable integration are different questions. A contributor may help develop the specification; a converter may exchange selected definitions; a product may read a model directly; a runtime may plan queries from it. Check each capability separately, including its direction, version, diagnostics, and limitations.

The claim that no products support model import or export is no longer a useful description of the ecosystem. The directory documents specific implementations, while converters are maintained in the separate [Apache Ossie converters repository](https://github.com/apache/ossie-converters). For practical routes and their limits, see the [import guide](/blog/convert-semantic-models-to-ossie/) and [export guide](/blog/apache-ossie-converters/).

## What existing OSI work can carry forward

A project rename and a schema revision are different changes. Earlier documents can use a `semantic_model` wrapper, while the current core draft describes one model at the document root. A file does not become compatible merely because it declares the same project name or uses a familiar version string. Read the migration guidance and validate against the schema your intended consumer supports.

For an existing model, inventory the calculation expressions, source mappings, relationships, and business context that must survive. Then check what the selected converter can preserve in the shared core or vendor extensions. A retained extension is useful metadata, but another runtime may not interpret it. Keep the original artifact and review conversion diagnostics before replacing a working model.

The [current Apache Ossie guide](/apache-ossie/#compatibility) separates the core specification, runtime support, extensions, and conversion coverage. The [field-mapping reference](/osi-field-mapping/) helps compare constructs, but a conceptual mapping is not a guarantee that a live converter implements every row.

## Adopting without waiting for universal support

Start with one maintained definition and one intended consumer. Choose a business question whose source data and expected result your team can inspect. Record the definition, convert only through a supported path, and compare the destination behavior with the original assumptions. Expand once the differences have an owner and an explicit decision.

This keeps adoption tied to evidence rather than ecosystem membership. A definition that serializes successfully can still need work on expressions, filters, types, or supported relationships. A query that runs can still use a different business interpretation. Keep model validation, conversion review, and result verification as separate checks.

Datus Agent can help build and maintain semantic context from supported sources, while DOSI provides execution for compatible definitions and supported requests. These are product capabilities alongside the open specification. DOSI uses Elastic License 2.0; Datus Agent is Apache-2.0. For a concrete execution path, follow the [Ossie and DOSI quickstart](/blog/apache-ossie-dosi-quickstart/).

## How to participate in the open project

You can contribute without building a new runtime. Report an unclear definition, share a model that exposes a mapping problem, improve documentation, test a converter, or review a proposed change. Concrete examples make the compatibility discussion more useful than a general request for interoperability.

Read the [contribution guide](https://github.com/apache/ossie/blob/main/CONTRIBUTING.md), browse issues, and use the dev mailing list to discuss substantial work before implementing it. The community page links meeting schedules and communication channels. Converter work has its own repository and should be coordinated through the project's public channels.

## Frequently asked questions

### Are Open Semantic Interchange and Apache Ossie different standards?

They are names from the same project's history. Open Semantic Interchange is the earlier name; Apache Ossie (incubating) is the current project name. That continuity does not freeze the schema. When reusing an old example, check its structure, declared version, validator, and consumer rather than assuming a rename makes it compatible.

### Why did OSI become Apache Ossie?

The community adopted the Ossie name to avoid acronym confusion as the project moved into the Apache Incubator. The change also made the Apache governance home explicit. The July 10, 2026 announcement explains the naming and transition; its publication date should not be confused with a separately verified formal admission date.

### Does the Apache ecosystem listing mean every participant supports the same features?

No. The directory identifies organizations and documented work around the specification. Import, export, native model reading, and query execution are separate capabilities. Check the implementation links and supported versions for the route you need; inclusion is not product certification or a guarantee of equivalent behavior.

### Where should I read the current Apache Ossie specification and examples?

Start with the [Apache Ossie guide](/apache-ossie/) for an overview, interactive model examples, history, and implementation paths. Use the linked upstream specification and schema for authoritative field definitions. This article keeps the historical and adoption context; it does not replace the current reference.

## Related articles

- [Apache Ossie guide](/apache-ossie/) — current standard, model examples, and implementation paths.
- [Native Apache Ossie execution](/blog/first-native-apache-ossie-engine/) — where a compatible runtime fits.
- [Ossie and DOSI quickstart](/blog/apache-ossie-dosi-quickstart/) — a practical model-to-query tutorial.
- [Semantic layer tools and Ossie support](/blog/semantic-layer-tools-list-osi/) — evaluate documented integration capabilities.
