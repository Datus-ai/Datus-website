---
title: "Snowflake Business Ontology vs. Databricks Genie Ontology"
description: "Compare Snowflake Business Ontology and Databricks Genie Ontology: release status, approved definitions, metric execution, external agents, and portability."
author: "Evan Paul"
date: 2026-11-12
lastmod: 2026-11-12
heroImage: "/images/snowflake-business-ontology-vs-databricks-genie-ontology/cover.svg"
heroImageAlt: "Two streams of business knowledge connect source documents and queries to reviewed definitions and analytical answers."
heroLayout: stacked
head:
  - - meta
    - name: keywords
      content: "Snowflake Business Ontology, Databricks Genie Ontology, business ontology for AI agents, governed business context, semantic views, metric views"
  - - meta
    - property: og:title
      content: "Snowflake Business Ontology vs. Databricks Genie Ontology"
  - - meta
    - property: og:description
      content: "Compare Snowflake Business Ontology and Databricks Genie Ontology: release status, approved definitions, metric execution, external agents, and portability."
  - - meta
    - property: og:type
      content: article
  - - meta
    - property: og:url
      content: https://datus.ai/blog/snowflake-business-ontology-vs-databricks-genie-ontology/
  - - meta
    - property: og:image
      content: https://datus.ai/images/snowflake-business-ontology-vs-databricks-genie-ontology/cover.svg
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - link
    - rel: canonical
      href: https://datus.ai/blog/snowflake-business-ontology-vs-databricks-genie-ontology/
---

# Snowflake Business Ontology vs. Databricks Genie Ontology

## TL;DR

Snowflake and Databricks are making shared business meaning part of their AI platforms. Their ontology announcements connect learned context with governed definitions and executable metrics. Evaluate how each handles authority, calculation, access, and portability—and distinguish capabilities available today from those still in preview or announced for later.

## Ontology becomes a platform decision

A finance dashboard, a sales notebook, and an AI agent can all answer a revenue question differently. Each may execute valid SQL. The disagreement starts earlier: which revenue definition applies, where that definition came from, and who stands behind it.

Two November announcements put that problem at the center of the data platform. On November 11, Databricks announced **Genie Ontology general availability**, bringing together learned and modeled knowledge. Its external BI knowledge sources remain Beta, while Ontology Manager is coming in Beta. Those component statuses matter even though the broader offering is GA. <a href="https://www.databricks.com/blog/announcing-ga-genie-ontology" rel="nofollow noopener">Databricks' announcement</a> describes the release and its availability boundaries.

On November 3, Snowflake announced **Business Ontology**, with public preview coming soon. The announcement separates approved business meaning, Semantic Views for calculation, and Cortex Sense for inferred context. Its engineering article describes Business Ontology as private preview and also points to the forthcoming public preview. These descriptions should not be read as a generally available release. <a href="https://www.snowflake.com/en/news/press-releases/expedition-2026-business-ontology-ai-gateway/" rel="nofollow noopener">Snowflake's release announcement</a> labels the availability of each capability.

The architectural question is becoming more concrete: how does knowledge found in existing work become a definition that other people and agents can rely on? Buyers need to inspect that transition, along with the engine that computes the number. A product's use of the word ontology does not answer those questions by itself.

## Three jobs behind one business answer

**A business ontology gives business concepts explicit meaning and relationships; a semantic layer provides executable metric definitions.** An AI analytics workflow also needs contextual evidence from documents, queries, and prior work. These roles can live within one platform, but they still need distinct responsibilities. Our [semantic layer versus ontology guide](/blog/semantic-layer-vs-ontology/) explains the underlying distinction.

Take a retailer asking, “Why did net sales fall last week?” Finance may define net sales after refunds. A sales operations report may use order value before refunds. Both can be useful, provided their names and scope are explicit. A frequently used query can supply evidence about current practice; frequency alone does not decide which definition Finance approved.

The Agent then needs to select the intended period, region, and calculation. Even after those choices are correct, a regional breakdown explains where a decline occurred without necessarily proving its cause. The answer should keep the selected definition, query scope, and supporting evidence visible.

| Job | What the retailer needs | What to inspect |
| --- | --- | --- |
| Establish business meaning | Which net-sales definition applies to this question? | Domain, owner, scope, and authority |
| Execute the calculation | How are refunds, exclusions, and grouping handled? | Metric expression, source mappings, and generated SQL |
| Supply supporting context | What existing work helps interpret the result? | Source, date, relevance, and unresolved conflicts |

These are evaluation questions for any implementation. A definition can be approved but linked to an unsuitable calculation. A calculation can match its specification while answering the wrong question. Keeping the checks separate makes disagreements easier to investigate.

## How the two approaches organize business knowledge

Databricks' documentation distinguishes **modeled knowledge** from **learned snippets**. Modeled knowledge includes metric views, Pages, domains, and certified assets. Snippets capture context from existing work. The documentation says modeled knowledge generally takes precedence when sources conflict, and unresolved conflicts may prompt clarification. It also documents how users inspect the snippets and sources behind answers. <a href="https://docs.databricks.com/aws/en/genie/genie-ontology" rel="nofollow noopener">The Genie Ontology documentation</a> is the source for these behaviors.

Snowflake's proposed division assigns inferred context to Cortex Sense, business meaning to Business Ontology, and calculation to Semantic Views. Its product article says owners review proposed definitions, approved meaning takes precedence over inference, and intentional domain differences can remain explicit. <a href="https://www.snowflake.com/en/blog/business-ontology-context/" rel="nofollow noopener">Snowflake's Business Ontology overview</a> describes this separation.

The practical similarity is important: both approaches give explicitly governed meaning a different role from knowledge inferred from existing work. The useful comparison is how that distinction behaves in a real project. Does a conflicting source remain discoverable? Can a reviewer see why one definition was selected? What happens after the underlying calculation changes?

![Simplified architecture comparison: Snowflake combines inferred context, approved Business Ontology concepts, and Semantic View calculation; Databricks combines learned snippets, modeled knowledge, and Metric Views. Both serve agents through their platform controls.](/images/snowflake-business-ontology-vs-databricks-genie-ontology/architecture.svg)

[Open the architecture comparison at full size](/images/snowflake-business-ontology-vs-databricks-genie-ontology/architecture.svg)

The diagram separates responsibilities for comparison. It is not a deployment diagram or a required setup sequence. In particular, an ontology concept linked to a metric is different from the engine executing that metric.

## What data teams should evaluate

The table summarizes the cited materials **as of November 12, 2026**. It describes published behavior and announced plans, rather than the results of a hands-on comparison. Verify availability and configuration in the account being evaluated.

| Question | Snowflake Business Ontology | Databricks Genie Ontology |
| --- | --- | --- |
| What is available? | Business Ontology public preview coming soon; engineering material describes the current private preview. | Genie Ontology GA; external knowledge sources Beta; Ontology Manager coming in Beta. |
| What establishes authority? | Proposed concepts enter steward review; approved concepts supply official meaning. | Modeled knowledge and certified sources take priority over learned context, as documented. |
| Where does calculation live? | Semantic Views implement metric calculations; ontology representations link concepts to assets. | Unity Catalog Metric Views define metrics, dimensions, and queryable business logic. |
| How is access handled? | The engineering description separates domain navigation, reading, proposing, and steward permissions. | Learned context uses Unity Catalog controls; check source-specific visibility and client behavior. |
| Can external agents use the context? | Published materials describe external MCP access to Semantic Views. Verify ontology access separately. | Genie MCP exposes context to external agents under Unity Catalog permissions. |
| What can move between tools? | Published materials describe ontology import/export in open formats and Ossie Semantic View exchange. | The cited GA announcement establishes external access; validate the specific export artifact and destination behavior separately. |

Snowflake's <a href="https://www.snowflake.com/en/blog/engineering/business-ontology-context/" rel="nofollow noopener">engineering explanation</a> supplies the steward workflow and concept-to-asset distinction. Databricks' <a href="https://docs.databricks.com/aws/en/uc-semantics/metric-views/" rel="nofollow noopener">Metric Views documentation</a> describes its executable semantic objects. A blank or unverified comparison point should lead to a product check, rather than an assumption that a capability is absent.

### Ask for the artifact, the query, and the permission boundary

External Agent access and model portability answer different questions. An MCP connection can let another Agent call an existing service. Exporting a definition determines what can be retained or used in another environment. Neither, by itself, proves that a destination engine will produce the same result.

For a migration exercise, ask for the actual definition and its dependencies. Check calculation behavior, time handling, joins, extensions, and source mappings in the destination. Keep access rules and approval records in scope too: exchanging a semantic model does not automatically transfer every governance object around it.

Access deserves its own test. Let an analyst and a restricted business user ask the same question, then inspect which definitions, source context, and rows each can see. Both a definition and its underlying data can carry sensitive information. A successful query from an administrator's account does not establish the end user's boundary.

## Where Datus fits in this architecture

For Snowflake and Databricks users, Datus adds a separately maintained business-context and semantic-model workflow over supported data sources. The warehouse can keep storing data and executing queries, while Datus Agent helps build and use definitions in Datus Studio and DOSI provides their semantic runtime. The main architectural difference is **where the reusable model lives and how it is executed across supported environments**. External Agent access is already part of both vendors' published approaches; it is not a unique Datus capability.

![Datus Agent in Studio turns existing knowledge into a team-reviewed Apache Ossie model. DOSI serves metrics to agents and compiles SQL for Snowflake, Databricks, or another supported backend. Native ontology definitions remain separate and require team reconciliation.](/images/snowflake-business-ontology-vs-databricks-genie-ontology/datus-fit.svg)

[Open the Datus architecture at full size](/images/snowflake-business-ontology-vs-databricks-genie-ontology/datus-fit.svg)

### For Snowflake users: keep Snowflake execution, choose where the model lives

A Snowflake team may already maintain Semantic Views and plan to connect them to Business Ontology's approved concepts. That native approach places business meaning and its implementing assets within Snowflake's governance environment. Datus offers a different placement: the team maintains an Apache Ossie model outside the native Semantic View object, and DOSI compiles supported metric requests into Snowflake SQL for the configured warehouse to execute.

For our retailer, Datus Agent can use an existing net-sales query, table information, and relevant documents to propose a metric definition. The team can inspect its refund and exclusion rules, compare the model query with the original SQL, and reuse the resulting metric from Datus Studio or a supported Agent interface. Our [SQL-to-business-metrics example](/blog/sql-to-business-metrics/) shows this calculation-checking workflow.

That placement can matter when Snowflake is one part of a broader stack, or when the team wants to manage its semantic model separately from a particular warehouse's native objects. It introduces a model that needs an owner and checks against any parallel definition. The current [Datus Snowflake workflow](/databases/snowflake/) does not automatically import, synchronize, or publish Snowflake Semantic Views or Business Ontology approvals. Teams should explicitly reconcile the definitions they intend to keep consistent. The <a href="https://dosi.datus.ai/connectors/snowflake/" rel="nofollow noopener">DOSI Snowflake connector reference</a> documents execution and connection boundaries.

### For Databricks users: a separate semantic runtime alongside lakehouse services

Genie Ontology organizes learned context and modeled knowledge through the Databricks platform, with Unity Catalog Metric Views supplying executable definitions. Datus offers a model-centered workflow that can use Databricks as a query backend. DOSI's documented connector submits SQL to a Databricks SQL warehouse through its Statement Execution API; the lakehouse remains the execution environment.

The distinction becomes useful to evaluate when a team also has data on other supported engines or wants to serve the same modeled business logic through several tools without making a Databricks-native metric object the required execution contract everywhere. In the retail example, the team could maintain the net-sales definition in an Ossie model, query its Databricks-backed dataset, and evaluate that definition against an equivalent dataset on another supported engine. Source mappings, dialect behavior, and results still need checking in each environment.

This workflow does not establish automatic reuse of Genie Ontology snippets, Pages, authority rankings, or approvals. Those remain separate platform artifacts unless an explicit integration demonstrates otherwise. The <a href="https://dosi.datus.ai/connectors/databricks/" rel="nofollow noopener">DOSI Databricks connector reference</a> confirms SQL connectivity, not a Genie Ontology synchronization service. Likewise, Datus model validation and knowledge-base synchronization do not amount to the steward approval process described in the native offerings.

### For other warehouse users: build shared context around the stack you have

Teams using supported engines such as PostgreSQL, ClickHouse, or DuckDB can use the same Datus modeling approach without adopting Snowflake or Databricks as the home for their business definitions. They can start with an important report or existing SQL calculation, build inspectable datasets and metrics, and make those metrics available for analysis. The [Datus semantic layer solution](/solutions/semantic-layer/) describes the overall workflow.

For these teams, the added value is a route from scattered business knowledge to an executable, reusable model on their existing stack. Datus Agent assists with modeling and analysis; DOSI supplies metric execution through supported connections and interfaces. A team can use shared definitions for exploratory questions and report generation, while keeping its warehouse as the query backend. The <a href="https://dosi.datus.ai/agents/" rel="nofollow noopener">DOSI agent guide</a> describes metric discovery, query preview, execution, and model validation.

The same architecture can support a mixed estate, but each request still needs a supported source and an appropriate access configuration. Multiple-source support does not imply arbitrary cross-warehouse federation, equal connector maturity, or automatic propagation of an end user's identity. Those are deployment questions to verify alongside the business calculation.

### Evaluate portability and governance as separate requirements

Datus's vendor-neutral runtime gives teams an alternative to making one warehouse's native semantic object the center of every analytical workflow. It is not the only approach with open-format exchange: Snowflake also describes that capability. Compare the actual models, destination behavior, and ongoing maintenance required by each approach.

DOSI supports Datus-specific semantics carried in Ossie's extension mechanism; other consumers may ignore them. Its <a href="https://dosi.datus.ai/datus-extensions/" rel="nofollow noopener">extension contract</a> explains why an export needs execution checks. Separately, teams need ownership, review, permissions, and a process for changing definitions. Datus Agent is open source, while DOSI uses Elastic License 2.0; the open standard and engine license are distinct facts.

## Evaluate one disputed metric before choosing a platform

A useful proof of concept starts with a question your team already disagrees about. For the retailer, collect Finance's net-sales definition, a competing report, the SQL behind each, and a small dataset that includes refunds, test orders, and a period boundary. Ask the business owner to state the intended result before running the Agent.

Then examine the complete path from question to answer. Did the Agent identify the intended definition or ask for clarification? Did it use the appropriate metric and period? Does the query match the reference result by group? Can another authorized client obtain the same calculation under the same scope? Finally, change a source definition and observe what is actually updated and what still requires review.

Keep the definition, model version, query scope, generated SQL, and returned result with the evaluation. [Metric lineage](/blog/data-lineage-ai-analytics/) helps explain dependencies; [business-rule validation](/blog/validate-business-rules-ai-agents/) addresses whether a proposed rule is ready for reuse. Together, these make the purchase decision about evidence from your business rather than a shared product label.

## Frequently asked questions

### Is Snowflake Business Ontology generally available?

As of November 12, 2026, Snowflake's announcement says public preview is coming soon. Its engineering article describes Business Ontology as private preview. Treat the described capabilities according to those availability statements and confirm access for the account being evaluated.

### Is every Genie Ontology component generally available?

No. The November 11 announcement makes Genie Ontology GA, but labels external knowledge sources Beta and Ontology Manager as coming in Beta. Component-level availability matters when a proof of concept depends on a particular source or curation interface.

### Does a business ontology replace a semantic layer?

They address complementary responsibilities. An ontology can establish concepts, relationships, and meaning, while an executable semantic model defines calculations. Check how the implementation connects those responsibilities and exposes the definition and calculation behind an answer.

### Does MCP support prove that definitions are portable?

MCP provides an interface for calling tools and accessing services. Portability also depends on exportable artifacts, supported semantics, dependencies, permissions, and destination execution. Test a representative definition and its results in the environment where you intend to use it.

## Related articles

- [Semantic Layer vs Ontology: Why AI Agents Need Both](/blog/semantic-layer-vs-ontology/)
- [Ontology for AI Agents: Five Approaches to Business Context](/blog/ontology-for-ai-agents-five-approaches/)
- [From Existing SQL to Reusable Business Metrics](/blog/sql-to-business-metrics/)
