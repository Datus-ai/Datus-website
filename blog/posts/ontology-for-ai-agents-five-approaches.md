---
title: "Ontology for AI Agents: Five Approaches to Business Context"
description: "Explore five approaches to ontology for AI agents, from semantic layers and open standards to knowledge graphs and operational models, with a selection guide."
author: "Joanna He"
date: 2026-10-15
lastmod: 2026-10-15
tags: insight
head:
  - - meta
    - name: keywords
      content: "ontology for AI agents, AI agent ontology, semantic layer ontology, knowledge graph for AI agents, data context layer"
  - - meta
    - property: og:title
      content: "Ontology for AI Agents: Five Approaches to Business Context"
  - - meta
    - property: og:description
      content: "Explore five approaches to ontology for AI agents, from semantic layers and open standards to knowledge graphs and operational models, with a selection guide."
  - - meta
    - property: og:type
      content: article
  - - meta
    - property: og:url
      content: https://datus.ai/blog/ontology-for-ai-agents-five-approaches/
  - - meta
    - property: og:image
      content: https://datus.ai/images/ontology-for-ai-agents-five-approaches/cover-business-meaning.svg
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - link
    - rel: canonical
      href: https://datus.ai/blog/ontology-for-ai-agents-five-approaches/
---

# Ontology for AI Agents: Five Approaches to Business Context

## TL;DR

- Ontology gives AI agents explicit business entities and relationships; a semantic layer governs metrics.
- Five approaches place meaning in different systems. Choose by the question your agent gets wrong.

## The money has arrived. The vocabulary hasn’t.

Scroll LinkedIn for twenty minutes and you’ll hit a strange contradiction.

On one side, <a href="https://www.linkedin.com/in/steve-hedden" rel="nofollow noopener">Steve Hedden</a> keeps a running list of knowledge-graph and semantics jobs. In a 2026 roundup he pointed to an <a href="https://www.linkedin.com/jobs/view/ai-ready-context-engineer-ontologist-at-keybank-4453744043" rel="nofollow noopener">AI-Ready Context Engineer / Ontologist at KeyBank</a> with a posted US base-pay range of $96,000–$181,000, a <a href="https://www.linkedin.com/jobs/view/knowledge-graph-software-engineer-clearance-required-at-bti360-4435337014" rel="nofollow noopener">Knowledge Graph Software Engineer at BTI360</a> at $125,900–$247,900, and a <a href="https://www.jofdav.com/jobs/59216958-sr-consultant-knowledge-graph-rag-agentic-ai-expert" rel="nofollow noopener">Dell knowledge-graph / agentic-AI role</a> at $235,450–$304,700. These are advertised ranges for specific roles, not a salary benchmark; listings and availability change.

On the other side, practitioners still have to explain which kind of “meaning” these jobs will build. <a href="https://www.linkedin.com/in/steveschiff" rel="nofollow noopener">Steve Schiff</a> shared <a href="https://dataengine.co.nz/blog/ontology-vs-taxonomy-vs-knowledge-graph-vs-semantic-layer-vs-context-graph-a-field-guide/" rel="nofollow noopener">Sijie Wang’s field guide</a> to ontology, taxonomy, knowledge graph, semantic layer, and context graph—five terms that teams often use as if they describe the same thing.

The money has arrived. The vocabulary hasn’t.

That gap is the tell. Organizations are investing in semantic skills while they are still deciding where business meaning should live. For years, data teams asked whether an agent could *find* the right data. Now they also need to ask whether the agent knows what it found. A table named `suppliers` does not explain whether “Acme Corp” and “Acme Corporation Ltd.” are one supplier. A column named `revenue` does not say whether refunds count. An agent can produce valid SQL and still answer the wrong business question.

This is why **ontology for AI agents** has become a practical architecture question. In data systems, an ontology describes business entities, their properties, and the relationships and rules that connect them. It helps an agent interpret *who or what* a question refers to. A semantic layer gives the agent a governed way to calculate *how much*. Depending on the use case, teams may need both.

The interesting disagreement is not whether meaning matters. It is **where that meaning should live**. The five approaches below are a map of that design choice, adapted from my earlier Medium essay. They are categories of architecture, not a ranking of products.

![A warehouse and an AI agent connect through shared business meaning, represented by a small network of metrics, entities, and relationships.](/images/ontology-for-ai-agents-five-approaches/cover-business-meaning.svg)

## The vocabulary: four related jobs

The words in this space often overlap. I find it helpful to separate the job each one does:

| Layer | Primary question | Example |
| --- | --- | --- |
| **Semantic layer** | How do we calculate a trusted answer? | Define net revenue with agreed filters, grain, and joins. |
| **Ontology** | What entities exist, and how may they relate? | Define `Supplier`, `Contract`, and the relationship between them. |
| **Knowledge graph** | Which specific entities and relationships do we know about? | Link a supplier record to its contracts and subsidiaries. |
| **Runtime context** | Which definitions and data apply to this request now? | Check a user's access, the relevant domain, and the current model version. |

These are working distinctions, not universally accepted product names. A [knowledge graph](/blog/what-is-ontology/) may carry ontology rules; a [semantic layer](/blog/what-is-semantic-layer/) may model entities as well as metrics. The boundaries matter when an agent moves from a label to a query or an action. The model should be able to show which definition and relationship it used.

Consider “addressable spend by supplier.” The ontology helps identify which supplier entities count as the same organization. The semantic layer defines the spend metric and its grain. The context around the request determines which contracts the user may see. Each layer answers a different part of one business question.

## What practitioners are arguing about

The vocabulary matters because different practitioners are pointing to different failures. In <a href="https://procurementtidbits.substack.com/p/the-semantic-layer-the-real-center-of-gravity-in-agentic-ai-ca5dccf8be77" rel="nofollow noopener">his procurement analysis</a>, Bertrand Maltaverne calls the cost of conflicting supplier identities and business definitions **semantic debt**. An agent that sees “Acme Corp” and “Acme Corporation Ltd.” as separate suppliers may make a recommendation that is internally consistent but wrong for the organization. The procurement example in this article follows that concern.

<a href="https://www.linkedin.com/pulse/knowledge-organization-systems-why-formal-ontologies-so-hollmann-dmdwf/" rel="nofollow noopener">Julius Hollmann</a> argues for formal, machine-readable relationships rather than treating a data catalog as an ontology. His distinction is useful even if a team does not adopt RDF or OWL: documenting where a table lives is different from specifying that a `Supplier` can own a `Contract`, or how two supplier identifiers map to one organization.

<a href="https://www.linkedin.com/pulse/semantic-layer-vs-context-pavan-bharadwaj-holenarasipura-harse" rel="nofollow noopener">Pavan Bharadwaj</a> makes a complementary distinction. A semantic layer defines what a metric means; a context layer helps an agent decide whether the definition is current, certified, and appropriate for a particular request. That moves the question from “is this metric defined?” to “should this agent use it now?”

<a href="https://www.linkedin.com/pulse/missing-enterprise-layer-stalling-your-agentic-ai-o-higgins-qtaee" rel="nofollow noopener">Dr. Dennis O’Higgins</a> extends the argument beyond data models. He writes that business architecture should establish who owns and ratifies enterprise definitions, what actions an agent may take, and how those rules change. An ontology can formalize a business decision, but a team still has to make and govern that decision.

I read these as four different questions, not four answers to one product comparison: Do agents agree on identity? Can they follow explicit relationships? Can they trust the definition at runtime? And who has authority to change it? They help explain why the five approaches below often need to work together.

![Quote card: The interesting disagreement is not whether meaning matters. It is where that meaning should live.](/images/ontology-for-ai-agents-five-approaches/quote-where-meaning-lives.svg)

## Five approaches to business meaning

![Five flat cards show where business meaning can live for AI agents: open standard, platform-native model, metrics as code, knowledge graph, and operational object model.](/images/ontology-for-ai-agents-five-approaches/approaches-to-context.svg)

| Approach | Where meaning primarily lives | A useful starting point |
| --- | --- | --- |
| **Open interchange standard** | A portable semantic specification | Multiple tools need to exchange the same model. |
| **Platform-native model** | A warehouse or lakehouse's own semantic objects | The data team already works inside one platform. |
| **Metrics as code** | Versioned measures, dimensions, and joins | Consistent analytical answers are the immediate need. |
| **Knowledge graph and formal ontology** | Typed concepts, relations, and inference rules | Entity identity and multi-hop relationships matter most. |
| **Operational object model** | Objects, links, permissions, and actions | Agents must act on business objects, not only analyze them. |

The categories are not mutually exclusive. A platform can import an open model. A metrics layer can expose its definitions to an agent. A graph can map onto warehouse tables. The table describes the **starting point** for modeling, rather than everything a product can do.

### 1. Open interchange: Apache Ossie

<a href="https://ossie.apache.org/" rel="noopener">Apache Ossie (incubating)</a>, formerly Open Semantic Interchange, defines a vendor-neutral way to exchange semantic metadata. Its core model describes datasets, fields, relationships, dimensions, and metrics. The project also has an <a href="https://ossie.apache.org/community/" rel="noopener">Ontology Representation working group</a> exploring how those concepts map to formal ontology standards.

The appeal is a shared definition that tools can read without every team rewriting it by hand. Interchange still has practical boundaries: consumers may support different portions of a specification, and a portable model does not make query execution identical everywhere. For example, <a href="https://docs.snowflake.com/en/user-guide/views-semantic/yaml-vs-ddl" rel="nofollow noopener">Snowflake documents import and export</a> between Ossie YAML and Semantic Views, while its semantic queries run inside Snowflake. That distinction between **moving a definition** and **running a query** is worth checking in any interoperability claim.

### 2. Platform-native semantics

Snowflake Semantic Views and Databricks Metric Views keep business definitions near their respective data and governance systems. <a href="https://docs.snowflake.com/en/user-guide/views-semantic/semantic-view-yaml-spec" rel="nofollow noopener">Snowflake's documentation</a> describes metrics, dimensions, and logical tables in Semantic Views. <a href="https://docs.databricks.com/aws/en/uc-semantics/metric-views/yaml-reference" rel="nofollow noopener">Databricks documents</a> reusable metric views with sources, measures, and dimensions.

For a team whose data and access policies already live in one platform, this can make semantic definitions easier to operate. A team spanning several engines should also ask how the same definitions will travel, which parts can be exported, and which agent workflows depend on the platform runtime. Those are integration questions, not an assessment of the quality of either platform.

### 3. Metrics as code

dbt Semantic Layer and Cube both let teams define analytical concepts as code, though they use different models and interfaces. <a href="https://docs.getdbt.com/docs/use-dbt-semantic-layer/dbt-sl" rel="nofollow noopener">dbt's Semantic Layer</a> centers on MetricFlow definitions in a dbt project. <a href="https://docs.cube.dev/reference/data-modeling/cube" rel="nofollow noopener">Cube's model</a> describes measures, dimensions, joins, and access policies in cubes; it can serve those definitions to applications and agents through its interfaces.

This path starts with a common business problem: two teams calculate “revenue” differently. A governed model lets them inspect the formula and reuse it. An ontology question may still arise when the issue is *which customer or supplier an answer refers to*, rather than which aggregation to use. Some metric models include entities and relationships, so the right test is a real question from your domain, not a label on a vendor diagram.

### 4. Knowledge graphs and formal ontologies

The <a href="https://www.w3.org/TR/owl-primer/" rel="nofollow noopener">W3C OWL</a> stack gives teams a formal language for classes, properties, and logical constraints. Platforms such as Stardog apply that approach to knowledge graphs; its documentation covers both <a href="https://docs.stardog.com/virtual-graphs/" rel="nofollow noopener">virtual graphs over existing data</a> and <a href="https://docs.stardog.com/inference-engine/" rel="nofollow noopener">reasoning</a> over modeled relationships.

This path is useful when the agent must distinguish entities and follow relationships across systems: a supplier, its legal entity, a contract, and a parent company may be different nodes with different rules. The team still needs to map those concepts to current source records and decide how the agent will calculate any requested metrics. Formal representation is most valuable when those distinctions affect an answer or decision.

### 5. Operational object models

Some teams need an agent to update a case, trigger a process, or record a decision. That brings actions and permissions into the model. <a href="https://www.palantir.com/docs/foundry/ontology" rel="nofollow noopener">Palantir's Foundry Ontology</a>, for example, documents object types, links, functions, and action types within its platform. Its <a href="https://www.palantir.com/docs/foundry/action-types/overview/index.html" rel="nofollow noopener">action model</a> defines changes an authorized user or application can make to objects.

The question here extends beyond “can the agent explain this entity?” to “what may it do with this entity?” Teams evaluating an operational model should trace one permitted action from the object definition through the permission check, write, and audit trail. An analytics-first model may not need those capabilities; an agent that changes business state does.

## One question, five different places to resolve it

Imagine a procurement agent receives this request: “Show addressable spend for Acme this quarter, and identify contracts that need review.” The raw data is scattered across a purchase-order table, a supplier master, contract files, and a reporting model. The supplier master contains both `Acme Corp` and `Acme Corporation Ltd.`; the contracts use a third legal name. The purchase-order table includes taxes and cancelled orders, while the spend dashboard excludes both.

The agent has at least three separate tasks. It must identify **the supplier** despite several names. It must calculate **addressable spend** using the agreed filters and time window. And it must decide **which contracts this user may inspect** before it makes a recommendation. Good SQL generation solves only part of this problem. The differences between the five approaches become clearer when you ask where each one places these decisions.

An **open interchange model** could carry the agreed spend definition, source mapping, and relationships to another tool. An analytics engine still has to interpret that model against the current warehouse. A team should test the model after importing it elsewhere: Does the spend metric keep its filter? Do the joins preserve the grain? Are unsupported annotations identified? The answer depends on the importer and runtime as well as on the standard.

A **platform-native model** could define the metric inside the warehouse's semantic objects and use that platform's permissions. This is a straightforward choice when the required data and agent already operate there. If the contract system sits elsewhere, the team still has to decide how contract identity and access rules reach the agent. The platform can be the natural home for the spend calculation without having to be the only source of context.

A **metrics-as-code layer** could make “addressable spend” reviewable alongside source transformations. The data team can version the formula, test the cancelled-order filter, and expose the same number to BI and an agent. The next design decision is how that agent recognizes that two supplier labels refer to the same legal entity. Sometimes a modeled entity and a maintained mapping are enough. Sometimes the organization needs a broader identity graph.

A **knowledge graph or ontology** could represent the supplier, legal entities, contracts, and ownership relationships explicitly. That helps the agent navigate from a trading name to the relevant contract. It does not, by itself, decide whether taxes belong in the spend metric. The team needs a bridge from those entity relationships back to the trusted analytical definition. The bridge may be a mapping, a query layer, or a shared model, but it must be tested with the actual question.

An **operational object model** becomes relevant if “identify contracts that need review” turns into “open a review task.” Then the model has to include an allowed action and an audit record, not merely a read-only answer. An agent might be permitted to suggest a task while a human approves it; another workflow might authorize the agent to create a draft directly. That permission is part of the business meaning of “review,” not just a UI setting.

None of these choices has to cover the entire question alone. In a real implementation, the spend definition might live in a semantic model, supplier identity in a graph, and the review action in a workflow system. The key is to make the boundaries visible. When the answer is challenged, the team should be able to locate the metric, the entity resolution, the access check, and the action rule that produced it.

## The decisions that cut across all five approaches

**Who owns a definition?** A machine-readable model can make business meaning explicit, but someone still has to decide what “addressable spend” includes. Finance may own the metric, procurement may own supplier identity, and legal may own contract status. If those owners disagree, the agent needs an escalation path. Treating a model as the source of truth works only when the people who own each term can review and change it.

**How does the model stay current?** Schemas change, suppliers merge, definitions get revised, and permissions shift. A diagram that was accurate at launch can become an inaccurate prompt six months later. Each approach needs a maintenance process: versioned model changes, source checks, and examples with expected answers. “Self-improving” is a useful goal, but the practical question is what evidence promotes a proposed change into a trusted definition.

**What is portable?** Portability has several layers. A model file can be portable while the execution engine, access policy, or action workflow remains specific to a platform. Conversely, a platform may export a useful subset of its model even if its runtime is native. If portability matters to your team, list the exact objects you need to move—metrics, dimensions, relationships, synonyms, permissions, or action definitions—and test each one. A general claim about interoperability does not answer that narrower question.

![Quote card: A model file can be portable while the execution engine, access policy, or action workflow remains specific to a platform.](/images/ontology-for-ai-agents-five-approaches/quote-portability.svg)

**What should an agent do when meaning is uncertain?** The right response is often a clarification, not a guess. “Acme” may name several entities; “this quarter” may refer to fiscal or calendar time. A well-scoped agent should show the assumptions it used or ask the user to choose. Ontology and semantic metadata reduce ambiguity, but they do not remove the need to handle unresolved business language deliberately.

**Where does context end and action begin?** Read-only analysis and operational change carry different responsibilities. An agent can read a governed metric while still needing a separate authorization path to create a contract review. An operational ontology can encode actions, but a team must still decide which actions require approval and how to audit them. This is a use-case boundary, not a contest between product categories.

Those questions are useful even if your team never adopts the word “ontology.” They turn a broad terminology debate into a set of design decisions: who defines business meaning, how systems exchange it, how agents use it, and how the organization corrects it.

A small evaluation set can make the decision concrete. Write three versions of the procurement question before choosing a tool: one with the exact legal supplier name, one using the familiar trading name, and one that asks for the parent company's total. Record the expected supplier IDs, spend total, and visible contracts for each. If the first question works and the others fail, the missing piece is likely entity identity or relationship context rather than another metric formula. If all three identify the right supplier but disagree with the approved dashboard total, inspect the measure and its join path.

Then repeat the questions after a controlled change: add a new supplier alias, close a contract, or update the spend definition. The agent should either use the revised context or indicate that it cannot validate the answer. This check tests the maintenance process as well as the modeling approach. It also gives business owners a way to review the outcome without learning the internals of an ontology language.

Finally, ask the agent to explain its answer in plain terms: which supplier it resolved, which definition of spend it applied, which sources it queried, and whether it excluded any contract because of access rules. A system that can answer but cannot show these choices is difficult to correct when the business changes. The explanation does not need to expose every internal query plan; it should expose the decisions that an owner can verify.

## Where Datus fits: start with governed meaning, then keep it current

Datus takes a semantic-layer-first route to agent context. The [Datus agent](/products/cli/) can use schema and SQL history to help build semantic models; [Dosi](https://dosi.datus.ai/) runs Apache Ossie models and serves governed metrics through SQL-oriented interfaces and MCP. Dosi compiles queries for multiple SQL dialects. **Apache Ossie is the open standard; Dosi is <a href="https://dosi.datus.ai/install/" rel="noopener">source-available under the Elastic License 2.0</a>, and the Datus agent is open source.** These are distinct licenses and roles.

For a question about “addressable spend,” the first job is to make the spend calculation inspectable: source, filters, grain, and allowed joins. The next is to attach the right supplier identity and relationship context. The agent can then use both, with the relevant permissions, to answer the question. That is the idea behind a [semantic-layer-based ontology](/blog/semantic-layer-based-ontology/): build concept context on top of governed definitions rather than making each agent infer everything from raw tables.

This does not make the original model automatically correct. A reviewed definition can still become stale as sources and business rules change. The operating question is who owns that review and how updates reach the agents that rely on it. Datus's broader [context approach](/blog/from-semantic-layer-to-ontology/) addresses this as an evolving asset, while the degree of automated ontology support should be judged against the specific capability you need today.

## How to choose a starting point

Start with a question your agent currently gets wrong, then trace the source of the error.

1. **Wrong number?** Inspect metric definitions, filters, grain, and joins. A semantic layer or metrics-as-code model is a natural first step.
2. **Wrong entity?** Write down the entity types, identifiers, and relationships that would prevent the confusion. An ontology or graph model may help.
3. **Right answer, wrong audience?** Check permission enforcement at both the query surface and agent interface.
4. **Right answer today, different answer next month?** Assign an owner for model changes and test whether agents receive updated context.
5. **The agent must take action?** Model the permitted state change, approval path, and audit record alongside the business object.

This exercise usually makes the architecture choice clearer than a broad “ontology versus semantic layer” debate. Most organizations already have pieces of the answer in warehouse models, documents, BI definitions, and operational systems. The useful work is connecting those pieces into a contract an agent can actually use and a team can maintain.

## Conclusion

An ontology for AI agents is valuable when the agent needs explicit business identities and relationships. A semantic layer makes measures and query paths inspectable. A knowledge graph can connect specific entities; an operational model can connect them to authorized actions. The five approaches differ mainly in **where they establish that contract**. Choose the one that matches the failure you can demonstrate, then keep the meaning tied to the data and workflows your team actually runs.

## Frequently asked questions

### Does an AI agent need an ontology or a semantic layer?

It depends on the question. A semantic layer is the direct tool for consistent metrics, grain, filters, and joins. An ontology helps with entity types, identity, and relationships. An agent answering “spend by supplier” may need both: one definition for spend and another for which supplier records belong together. Start by inspecting a wrong answer to see which part is missing.

### Is a knowledge graph the same as an ontology?

No. An ontology defines the types and rules of a domain; a knowledge graph connects specific entities and facts. A graph can use an ontology as its schema. A team can also model ontology-like concepts without moving all data into a graph database. What matters is whether the agent can follow the intended relationship and explain how it reached a conclusion.

### Can an open semantic standard replace a runtime?

An interchange standard lets systems exchange definitions, but an implementation still has to validate a model, enforce access, plan a query, and run it against data. Apache Ossie specifies portable semantic metadata; products decide how to consume and execute it. When evaluating portability, test both import/export of the definition and the behavior of a real query on the target system.

### What should a team test before giving an agent access to business data?

Test a small set of questions with known answers. Include a metric with filters, an ambiguous entity name, a relationship that can multiply rows, and a permission boundary. Record which definitions the agent used and who maintains them. If the agent will take actions, add a test for authorization and an audit trail. These tests show which layer needs work before broad rollout.

## Related articles

- [What is an ontology?](/blog/what-is-ontology/) — the definition and its relationship to taxonomies and graphs.
- [Semantic layer vs ontology](/blog/semantic-layer-vs-ontology/) — a deeper look at how measurement and entity meaning work together.
- [From semantic layer to ontology](/blog/from-semantic-layer-to-ontology/) — how Datus connects governed models to agent context.
- [Apache Ossie and Dosi](/blog/first-native-apache-ossie-engine/) — the open specification and an execution engine.
