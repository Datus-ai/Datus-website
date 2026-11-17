---
title: "Data Context Layer: Five Checks Before You Buy"
description: "Evaluate a data context layer with five practical checks for definitions, calculations, access, changes and portability, using a reproducible customer example."
author: "Evan Paul"
date: 2026-11-16
lastmod: 2026-11-16
heroImage: /images/data-context-layer-evaluation/cover.png
heroImageAlt: "The same six customers produce two different active-customer groups: three purchasing customers and four engaged customers."
heroLayout: stacked
head:
  - - meta
    - name: keywords
      content: "data context layer, context layer evaluation, context layer for AI, data context platform, semantic layer evaluation"
  - - meta
    - property: og:title
      content: "Data Context Layer: Five Checks Before You Buy"
  - - meta
    - property: og:description
      content: "Evaluate a data context layer with five practical checks for definitions, calculations, access, changes and portability, using a reproducible customer example."
  - - meta
    - property: og:type
      content: article
  - - meta
    - property: og:url
      content: https://datus.ai/blog/data-context-layer-evaluation/
  - - meta
    - property: og:image
      content: https://datus.ai/images/data-context-layer-evaluation/cover.png
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - link
    - rel: canonical
      href: https://datus.ai/blog/data-context-layer-evaluation/
---

# Data Context Layer: Five Checks Before You Buy

## TL;DR

Evaluate a data context layer by following one business question through five checks: meaning, calculation, access, change and portability. Ask to inspect the artifacts behind each result. A useful demo leaves your team with definitions, evidence and an understood maintenance process—not only an answer on a screen.

## What should a context layer demo leave behind?

**A data context layer makes business definitions, relationships and supporting knowledge available to the systems using your data.** When evaluating one for analytics, ask the supplier to show how that knowledge affects a real calculation and how your team will maintain it. The deliverable should remain inspectable after the demo ends.

Consider a familiar question: “How many active customers did we have last month?” Marketing may mean people who logged in. Sales may mean people who bought something. Both definitions can be useful. A convincing answer needs to identify which one applies, show how it was calculated, and respect the questioner's access. A confident sentence or attractive graph cannot establish those things on its own.

Semantic engineer Jessica Talisman makes the inspectability question central in <a href="https://jessicatalisman.substack.com/p/context-layers-from-first-principles" rel="nofollow noopener">Context Layers From First Principles</a>. She asks readers to look at declared concepts, relationships, provenance, constraints and exportability. Her article also assesses a particular commercial platform; we use its architectural question here, rather than treating that assessment as an independent benchmark.

The following evaluation applies that question to one small customer dataset. It is a proposed buyer's exercise, not a claim that every product must implement the same architecture. Bring the business owner, an analyst and someone responsible for access controls. Their questions expose different parts of the system, and the evidence should be understandable to all three.

| Check | Ask the supplier to demonstrate | Keep after the session |
| --- | --- | --- |
| Meaning | Separate two legitimate definitions of active customer | Definition, scope, source and accountable owner |
| Calculation | Reconcile a result to the customers who qualify | Model, query and expected membership |
| Access | Repeat the request through the intended user identities and interfaces | Allowed and denied cases for each actual query path |
| Change | Modify one rule while holding source data constant | Reviewed difference, changed membership and consumer checks |
| Portability | Reproduce a supported calculation outside the authoring interface | Files, runtime requirements and an observed result |

## Start with a question whose answer you can check

Use a small, deliberately awkward dataset before moving to production scale. The accompanying Northstar fixture is synthetic: six customers, seven orders and five sessions. It covers October 2026, from October 1 inclusive to November 1 exclusive. Dates already represent UTC calendar days. The purpose is to expose differences in meaning, not to benchmark a warehouse or simulate every retail edge case.

There are two definitions. A **purchasing customer** has at least one completed order during the month. An **engaged customer** has at least one session during the month. Refunded and cancelled orders do not qualify for the first definition. Each person has a stable customer ID and one region, making it possible to compare both totals and membership.

| Customer | Relevant purchase | Relevant session | Purchasing? | Engaged? |
| --- | --- | --- | --- | --- |
| C001, North | Two completed October orders | October session | Yes, counted once | Yes |
| C002, North | Completed September order | October session | No | Yes |
| C003, South | Refunded October order | October session | No | Yes |
| C004, South | Completed October order | No session | Yes | No |
| C005, North | Completed October order, $40 | November 1 session | Yes | No |
| C006, South | Cancelled October order | October session | No | Yes |

The reference results are **three purchasing customers** and **four engaged customers**. These counts were checked with the included SQLite queries. They do not come from a live Datus session. You can [download the example and demo worksheet](/examples/data-context-layer-evaluation/customer-evaluation.zip), reproduce the membership checks, and use the same input when evaluating a system.

Ask for membership as well as totals. A total can match while counting the wrong people; membership reveals why a customer entered or left the group. It also gives the business owner a manageable way to review the definition. C001 should count once despite having two orders, while C005's November session should not enter October engagement.

## Show which meaning the answer uses

A context layer should preserve legitimate differences in meaning and help the user choose the one that answers their question. Ask the vague “active customer” question first. Then specify a sales follow-up and an engagement follow-up. Watch whether the system requests clarification, applies a documented default, or silently treats the definitions as interchangeable.

For Northstar, give the measures distinct names such as purchasing customers and engaged customers. Keep the business descriptions close to their calculations, with the intended use and the owner responsible for resolving ambiguity. The owner may decide which definition is the default for a particular team. That decision should be visible; a popular query or frequently retrieved document is evidence of use, not automatic business approval.

This is also where source coverage becomes concrete. Supply a short business note, an existing sales query and the table structure. Ask which parts the platform can ingest, which it can propose, and which require a person to resolve. An imported document can explain a rule without becoming executable logic. A generated metric can calculate consistently while still encoding the wrong business decision. Our [guide to validating business rules](/blog/validate-business-rules-ai-agents/) explores that distinction in more detail.

Keep the resolved definition and its supporting references after the session. An owner name and a sentence in a slide are not enough if the next agent cannot retrieve the same scoped meaning. Conversely, you do not need a complete enterprise ontology to settle this first question. The useful result is a small set of explicit concepts and rules that both the business and the system can use.

## Reconcile the answer with the underlying records

The calculation check should establish why each customer qualifies. Ask the supplier to show the mapping from customer identity to orders or sessions, the time window, the order-status filter and the distinct-customer calculation. Then compare the resulting IDs with the reference list. This makes the evaluation about observable behavior instead of whether the explanation sounds plausible.

The purchasing result should include C001, C004 and C005. If it returns four, inspect whether C001's two orders were counted twice. If C002 appears, inspect the time boundary. If C003 appears, inspect the refunded-order condition. These are different failures with different fixes. Asking for a single total hides that diagnostic information.

Next, group the purchasing result by region. North should contain two customers and South one. Since the fixture assigns each customer to exactly one region, those groups reconcile to the total. That assumption is part of the example: a real customer who belongs to several regions may require a different allocation rule. Ask where such relationship assumptions are declared before trusting an apparently familiar breakdown.

A lineage diagram can help locate the relevant tables and model dependencies, but it does not by itself prove that the data was complete at query time. Keep the source snapshot and the calculation evidence together. For a real deployment, ask who supplies freshness information and how unavailable or partial inputs appear to the user. This exercise holds the data fixed precisely so a changing feed cannot explain away a changed result.

The evidence to retain is a short chain: definition, model revision, request, calculation and membership. Sensitive production records need not be copied into a sales presentation. Use approved sample data, redacted records or another review method consistent with your security rules. The goal is enough evidence to reproduce the finding within the authorized environment.

## Test the users and interfaces that will actually consume it

Access control belongs in the execution path. Repeat the purchasing question as an authorized North-region user and as an authorized South-region user. Then try the interfaces you plan to deploy, such as a business-facing agent and a live dashboard. Ask where the caller's identity becomes a data policy, rather than accepting a prompt that tells the model to hide certain rows.

Under the proposed regional policy, the North user would see two purchasing customers and the South user one. Those are expected outcomes for the evaluation, not a security test already performed by the downloadable package. The package groups rows by region; it does not authenticate users or enforce permissions. A proper access test must use separate credentials against the real protected query service.

Include a denied case, such as a user with no assigned region. Also request a field outside the intended access scope, using a separate synthetic sensitive field if column restrictions are part of the rollout. Record the actual behavior: refusal, a permitted masked value, or unexpected exposure. A column hidden in the page layout is not evidence that it was withheld from the response sent to the browser.

Check who the system acts as in each setting. An interactive request, a scheduled job and a shared link may carry different identities. A copied HTML report may contain results calculated earlier and have no live connection at all. In that case, the distribution of the snapshot needs its own controls. The [HTML dashboard permissions guide](/blog/html-dashboard-data-permissions/) explains why generated presentation and governed live access are separate responsibilities.

Keep a small interface-by-identity record, including failures and untested cases. A successful check in one chat window does not establish coverage for a different agent, embedded page or background task. The practical buying question is whether the supplier can identify the boundary and help you test it for the workflow you will use.

## Change one business rule and inspect the consequences

A maintenance demo should show a controlled change, with enough evidence to explain its effect. Keep October's source data unchanged and propose a new purchasing rule: a customer must have at least one completed order worth $50 or more. This is a per-order threshold, not a threshold on total monthly spending. Ask the owner to confirm that distinction before changing the calculation.

On the fixture, the candidate rule removes C005, whose completed order is worth $40. The count falls from three to two, leaving C001 and C004. North falls from two to one; South stays at one. The reference package retains both versions so the change can be reproduced. This is a counterfactual comparison on a fixed snapshot, not an assertion that a system automatically handles historical effective dates.

<picture>
  <source media="(max-width: 640px)" srcset="/images/data-context-layer-evaluation/rule-change-mobile.svg" />
  <img src="/images/data-context-layer-evaluation/rule-change.svg" alt="With the same October data, the original purchasing rule includes C001, C004 and C005. A candidate minimum order amount of 50 dollars removes C005 and leaves two customers." loading="lazy" />
</picture>

Ask the supplier to distinguish a proposed edit, a saved definition and the version actually used by the next query. Inspect the change before accepting it, then run the question again through the intended consumers. If one interface still returns three, find out whether it uses an older model, a cached result or a saved snapshot. “The file was saved” does not answer that question.

Historical reporting needs a separate decision. Does the new rule apply only to future reporting, or should earlier periods be restated? Who records that policy, and how can someone reproduce an old result? A useful demonstration identifies these responsibilities even when part of the solution uses your existing version control and release process. Do not assume that an edit history also provides complete historical query replay.

The acceptance evidence is a reviewed change and an explained difference. It should also identify anything outside the model that needs attention, such as a report containing a copied formula or an external agent with a local definition. This makes maintenance effort visible before purchase rather than discovering it during the first business-policy change.

## Take the artifacts out and reproduce a supported result

Portability needs a concrete destination. Ask to export the relevant definition, model, source mappings and reference checks, then reproduce one supported calculation outside the authoring interface. Name the target runtime and data source before the demo. Being able to read a file is useful; being able to execute its meaning is a separate requirement.

For this exercise, the export inventory should explain where the purchasing rule lives and which files reproduce the three-customer result. It should also identify dependencies that do not travel with the model, including credentials, authorization configuration, schedules and report snapshots. There is no reason to include secrets in an exported demonstration bundle. The important question is how the destination obtains its own authorized connection.

Treat format compatibility and behavioral compatibility separately. A receiving tool may accept an open-format document while ignoring extensions that affect the calculation. Test representative features, including a relationship and a filter, and compare the membership as well as the total. If part of the model needs a particular engine, record that requirement rather than describing the entire package as universally portable.

Ask who performs this work when your stack changes. A documented export that your team can run is different from a custom migration service; either may be acceptable, but they create different costs and dependencies. Likewise, an API integration and a file export serve different purposes. Establish which artifacts you own, which interfaces you can operate, and what remains tied to the service.

## How Datus supports these checks

Datus brings together an Agent, a working environment in Studio, and DOSI's semantic execution. For an analytics evaluation, the relevant path is to turn existing business logic into a reviewable model, inspect its calculation, and reuse the saved definition. The [Datus semantic-layer solution](/solutions/semantic-layer/) explains that overall fit. It complements the team's responsibility for deciding what the business terms mean.

### From existing logic to an inspectable definition

Datus Agent's <a href="https://docs.datus.ai/0.4/subagent/semantic_modeling/">semantic-modeling workflow</a> can use database structures and supplied business logic to create or update datasets, relationships and metrics. The model file is the source of truth; searchable knowledge is derived from it. For Northstar, the owner would supply the purchasing rule and reference query, then review the generated result. Datus does not become the business owner by extracting the calculation.

Studio's Semantic Explorer connects physical sources, datasets and metrics, while the Metrics Editor lets a team review a model difference before saving. Applied drafts, saved files and knowledge synchronization are distinct states. A saved file with incomplete synchronization can leave the Agent using older knowledge. That distinction makes the rule-change exercise useful: verify the next query's behavior, rather than treating a successful edit as the end of the test.

### Reuse the calculation through a controlled query path

DOSI exposes metric discovery, query compilation and execution to compatible agents through its <a href="https://dosi.datus.ai/agents/">agent interfaces</a>. This provides a way to reuse the calculation across clients while checking how each client interprets the question. It does not establish that every client will choose the right metric or automatically inherit a Studio user's permissions. Each deployment still needs an explicit identity and access configuration.

In Studio, SQL Policy provides row filters based on caller attributes and column masking for protected reads. These controls run in the query path rather than depending on the model to add a permission clause. Policy dry runs compile a protected query without executing it; live access still needs testing. Interactive dashboards and precomputed report snapshots also have different sharing behavior. The [row-level security guide](/blog/row-level-security-ai-analytics/) describes the deployment questions in more depth.

### Separate portable definitions from runtime requirements

DOSI uses Apache Ossie models, with Datus-specific semantics carried in <a href="https://dosi.datus.ai/datus-extensions/">documented extensions</a>. A buyer should inspect those extensions and test the target runtime's support, rather than assuming another Ossie reader executes every feature. Datus Agent is Apache-2.0 open source; DOSI uses the Elastic License 2.0, and Studio is the commercial service. Open artifacts and product licensing are different selection questions.

These are capabilities to inspect, not a claim that this article has certified an entire deployment. The downloadable exercise verifies its reference SQL and expected customer groups. Your pilot must establish the model, permissions, synchronization and consumer behavior in the environment you plan to use.

## Make the buying decision from the evidence

Choose the workflow you need to operate and judge the evidence against it. If an existing BI platform already gives the intended audience the right definitions and access, extending that setup may be enough. A separate context layer becomes more relevant when the same business logic needs to serve additional agents or tools without each maintaining an independent copy.

Keep commercial requirements beside these functional checks. Confirm where the service runs, how it connects to the warehouse, what an additional consumer costs, and who helps when a query fails. Ask which connector capabilities are available for your specific source, rather than relying on a logo in an integration list. A working metric on a local sample does not establish acceptable performance, isolation or support for a production workload.

After the small exercise, repeat representative questions on approved production-scale data with realistic concurrency. Record query cost and response time alongside correctness, and agree how the team will handle an unavailable source or a failed synchronization. Keep these operational results separate from the six-customer fixture: each answers a different part of the buying decision.

Use the demo worksheet to record what was observed, what required manual intervention and what remains untested. Then assign an owner to the remaining work. The strongest outcome is a clear operating agreement: who decides meaning, who maintains the executable definition, who controls access, and how changes reach each consumer. A small model your team can explain and maintain is a sounder starting point than a broad demonstration whose dependencies remain unclear.

## Frequently asked questions

### What should I ask a data context layer vendor to demonstrate?

Ask for one question to be traced through its definition, calculation, access policy, rule change and export path. Keep the actual artifacts and observed results. A feature list helps describe scope, but it cannot establish whether your intended workflow works.

### Is a context layer the same as a semantic layer?

A semantic layer describes reusable calculations and their data relationships. A context layer can also organize supporting documents, business concepts and other knowledge that helps a consumer choose and interpret those calculations. Evaluate the capabilities you need rather than relying on the label alone.

### Does MCP support prove that business context is reusable?

No. MCP can provide access to tools and context, but you still need to check which definitions are exposed, which identity the service uses, and whether different clients select the intended metric. Test the query path you plan to deploy.

### Do we need a complete ontology before starting?

No. Start with the concepts and relationships needed for one decision. In this example, customer identity, purchases, sessions, time boundaries and regional scope are enough to reveal useful gaps. Expand the model when another question requires additional meaning.

### Does exporting an open-format model remove every dependency?

No. A model may depend on engine-specific semantics, connections, policies or application behavior. Record those dependencies and reproduce representative results in the intended destination. Exportability and equivalent execution need separate checks.

## Related articles

- [How Should AI Agents Validate Business Rules Before Reusing Them?](/blog/validate-business-rules-ai-agents/)
- [HTML Dashboards: Who Owns the Data and Permissions?](/blog/html-dashboard-data-permissions/)
- [Row-Level Security for AI Analytics: A Practical Guide](/blog/row-level-security-ai-analytics/)
- [DOSI Semantic Layer Example: Who Qualifies for Premier?](/blog/dosi-semantic-layer-northstar-example/)
