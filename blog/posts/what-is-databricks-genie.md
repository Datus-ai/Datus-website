---
title: "What Is Databricks Genie? Agents for Conversational Analytics"
description: "What Databricks Genie is: domain-scoped agents (formerly Spaces) that answer with SQL and charts under Unity Catalog — and how they differ from Genie Code."
author: "Kostja"
date: 2026-08-20
lastmod: 2026-08-20
head:
  - - meta
    - name: keywords
      content: "Databricks Genie, Genie Spaces, conversational analytics, Unity Catalog, text-to-SQL Databricks, Genie vs Genie Code, AI/BI Genie"
  - - meta
    - property: og:title
      content: "What Is Databricks Genie? Agents for Conversational Analytics"
  - - meta
    - property: og:description
      content: "What Databricks Genie is: domain-scoped agents (formerly Spaces) that answer with SQL and charts under Unity Catalog — and how they differ from Genie Code."
  - - meta
    - property: og:type
      content: article
  - - meta
    - property: og:url
      content: https://datus.ai/blog/what-is-databricks-genie/
  - - meta
    - property: og:image
      content: https://datus.ai/logo_dark.svg
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - link
    - rel: canonical
      href: https://datus.ai/blog/what-is-databricks-genie/
---


# What Is Databricks Genie? Agents for Conversational Analytics

Databricks Genie is the platform's conversational [data agent](/blog/what-is-data-agent/) for business questions on lakehouse data. The object teams actually curate is now called a **Genie Agent** (formerly a Genie Space): a domain-scoped chat that returns SQL, tables, and charts, governed by Unity Catalog.

## TL;DR

- A **Genie Agent** is a domain-specific natural-language interface on Databricks. Users ask questions; the agent returns SQL, result tables, and visualizations. Analysts curate each agent with Unity Catalog datasets, example SQL, SQL expressions for business semantics, and written instructions in the company's language.
- **Genie Agents were formerly Genie Spaces.** The rename matters for search, not for the core bargain: *scope the agent to a topic*, do not dump the entire lakehouse into one chatbot.
- Genie is a **family**, not a single SKU. **Genie One** is the business-user coworker (chat across data, dashboards, apps, Slack/Teams). **Genie Agents** are the shareable, domain-scoped agents this article defines. **Genie Code** is the data engineering assistant for pipelines and Spark. **Genie Ontology** is Databricks's automatic context graph behind the answers.
- Accuracy is a curation problem. Unscoped Genie on raw tables behaves like any schema-only text-to-SQL bot. A finance-scoped agent with verified SQL and Metric Views behaves like a governed query agent.
- Genie is the right default when the estate already lives in Databricks and the buyer is a business team that must not write Spark. It is the wrong default when you need a portable agent across warehouses, or when the job is building pipelines rather than answering questions.

## 1. The rename that matters: Spaces are now Agents

Search "Genie Space" and you land on decks that say Databricks customers created more than a million of them. Search "Genie Agent" and you land on the July 2026 documentation for the same object. The name you type decides which docs, which product pages, and which demos you find. The rename is a search problem before it is a branding problem.

The name you should search for is **Genie Agent**. The <a href="https://docs.databricks.com/aws/en/genie-agents/" rel="nofollow noopener">Genie Agents documentation</a> is explicit: each agent is domain-specific; authors attach Unity Catalog datasets, example queries, semantic SQL expressions, and instructions; consumers get SQL plus charts. The former name, Genie Space, remains in older decks and in Databricks's own claim that customers created more than a million Spaces. Treat "Space" and "Agent" as the same object unless a vendor diagram splits them.

Why does one object need two names? Because the scoped object exists to answer a question the lakehouse cannot. A lakehouse does not automatically produce a trustworthy answer to "what was net revenue last quarter?" Unity Catalog can tell you which tables exist. It cannot tell a general-purpose model that Finance's `net_revenue` excludes marketplace fees, that Marketing's `revenue` is checkout events, and that the CEO's slide uses the Finance number. Without a scoped agent, two failure modes show up in the first week. The first is **global chat**: one assistant over every catalog, schema, and sandbox; the model picks the table whose column names look like "revenue," and the number is reproducible and wrong. The second is **shadow extracts**: analysts paste CSVs into ChatGPT or a Claude session because the official chat is untrusted. Governance did not fail at the table ACL. It failed at *which question is allowed to see which grain*.

Genie's original product, AI/BI Genie, attacked that gap as conversational analytics: a chat experience sitting on curated datasets, not on the entire metastore. The rename changes the label, not the core bargain: *scope the agent to a topic*, do not dump the entire lakehouse into one chatbot. Whatever you call it, this remains a query agent in the taxonomy of data agents — a consumer of context — not a producer that authors the semantic layer for every other tool in the company.

## 2. A family, not a SKU: Genie Agent, Genie One, Genie Code, Genie Ontology

Search "Databricks Genie" and you will land on four names. Treating them as synonyms is how RFPs ask whether Genie "does pipelines and Slack and ontology."

| Name | Buyer | Job | Not the same as |
| --- | --- | --- | --- |
| **Genie Agent** (ex-Space) | Domain owner + business users | Scoped Q&A with SQL/charts on curated data | A company-wide ChatGPT |
| **Genie One** | Business users | Coworker surface: chat, dashboards, apps, Slack/Teams, mobile, MCP into other assistants | The authoring object itself |
| **Genie Code** | Data engineers | Pipelines, Spark, notebooks — a [platform-native data engineering agent](/blog/platform-native-data-agents-compared/) | Conversational analytics |
| **Genie Ontology** | Platform / AI owners | Automatic context graph (tables, queries, dashboards, apps) that ranks which definition to trust | A W3C ontology or a portable semantic layer |

Databricks's June 2026 product blog presents Genie One, Genie Agents, and Genie Ontology as one announcement stack. Read it as packaging. Genie One is "put the coworker where work happens." Genie Agents are "turn a scoped prompt into a shareable agent that can also take actions (MCP, schedules, artifacts)." Genie Ontology is "stop hand-building all the context." The last claim is the one to test in a POC. Automatic extraction of metric meaning from dashboards and query history is valuable *and* it can encode a popular wrong definition. Authority ranking (Databricks analogizes PageRank) is a design, not a substitute for a certified `net_revenue`.

Databricks published an **internal** June 2026 suite: 28 real-world analysis questions, Genie at 84.5% correct on the first attempt versus 52.4% for the strongest general-purpose coding agent in that test. Treat that as a vendor benchmark with a disclosed size, not as an industry score. It supports a directional claim you can believe without the number: a platform agent with catalog context beats a generic coding agent on warehouse questions. It does not prove Genie beats [Cortex Analyst](/blog/what-is-cortex-analyst/) on Snowflake, or that Ontology extraction replaces Metric Views.

Genie Code remains a different article. If your RFP is "write and babysit Lakeflow/Spark pipelines," you are shopping Genie Code. If your RFP is "the VP of Sales asks questions in Slack," you are shopping Genie One plus a set of Genie Agents. Mixing the two produces a pilot that is good at neither.

## 3. Authoring is curation, not configuration

Call it a **governed, domain-scoped conversational analytics agent**. Databricks's <a href="https://www.databricks.com/product/genie/agents" rel="nofollow noopener">Genie Agents product page</a> frames it for business teams who should not open a notebook.

**The authoring surface is the agent, not the prompt.** Someone with data privileges chooses which tables and views the agent may see, adds example SQL that encodes joins and filters, writes instructions ("net revenue is invoice collections minus refunds; never use `fact_web_events.amount`"), and can attach Metric Views or equivalent semantic expressions so the model is not inventing KPI math. Quality work — Databricks's own docs call it tuning, testing, and monitoring — is a job. An empty agent pointed at `main.prod.*` is a demo.

**The runtime stays inside Databricks governance.** Queries run with the consumer's Unity Catalog permissions. That is the point of a platform-native agent: you do not build a second entitlement system for the chatbot. It is also the lock-in: the agent is only as portable as the catalog, the compute, and the semantic objects you authored there.

**The output is inspectable SQL, not a vibe.** A serious Genie deployment shows the generated statement. If your stakeholders will not read SQL, you still need an owner who will, because "the agent said so" is not an audit trail.

**Unstructured and files are add-ons, not the original wedge.** Docs now cover attaching Unity Catalog Volumes and uploading CSV/Excel alongside tables. Useful for "explain this deck against the warehouse." It does not turn Genie into a document RAG product; the center of gravity is still structured data plus instructions.

**There is an API.** The Conversation API lets you embed a Genie Agent in an internal app or a bot. That is how Genie shows up in a custom portal without forcing every executive into the Databricks UI. Embed does not change the architecture: the agent is still a Databricks object with a Databricks permission boundary.

Authoring is an operations loop, not a launch checkbox. Databricks documents quality tuning (metrics, business rules, verified answers), testing and monitoring, and an explicit "curate an effective agent" guide: pick a tight data slice, write instructions in the vocabulary the business actually uses, and manage agents as you would manage a certified dashboard. If your POC is a single agent over `main` with no verified answers, you have tested the model, not the product.

## 4. The refusal is the product

A retailer has `finance.fct_invoices` and `growth.fct_checkout_events` in the same Unity Catalog. Both have an `amount` column. The CFO asks a workspace-wide assistant: "Which category drove revenue last quarter?" The model joins checkout events to the product catalog because `category` lives on the growth tables and the question came from a retail Slack channel that also talks about conversion. The ranking is a list of merchandising categories by GMV. Finance's number — collections minus returns, excluding gift-card breakage — is never computed. Nobody violated an ACL. The agent saw both tables.

A Genie Agent named `finance-revenue` is attached only to the invoice mart, a Metric View for `net_revenue`, three example SQLs that encode the return filter, and an instruction that checkout GMV is out of scope. The same question now either answers on the Finance grain or refuses and tells the user to open the growth agent. Domain-scoped agents are how you encode *which questions are legal* — and the refusal is the product working.

## 5. Where the family cannot reach

Every member of the family assumes the same two things: the system of record is Databricks, and someone will curate. Skip Genie Agents as the *company-wide* data agent when:

The warehouse is not Databricks. Cortex Analyst, BigQuery conversational analytics, or a stack-agnostic query agent will spend the decade you would spend federating everything into Unity Catalog "so Genie can see it."

The painful job is pipeline authoring and on-call. That is Genie Code, or a data engineering agent if you span more than one platform.

Nobody will own curation. An uncared-for Genie Agent is a schema dump with a chat box. Unity Catalog descriptions help; they are not a semantic model.

You need the same certified metric in Snowflake, a BI tool, and an external agent runtime. Genie Ontology and Metric Views are Databricks-native context. Portable interchange is a different layer — OSI / Apache Ossie — and it does not replace Databricks's agent.

You wanted a generalist analyst in Claude or ChatGPT. The [Claude Data plugin](/blog/what-is-claude-data-plugin/) (Cowork / Claude Code) plus warehouse MCP is a **client**: SQL, charts, and QA against whatever you connect. It does not ship Unity Catalog, Metric Views, or curated Genie Agents. Genie is the opposite shape: the agent lives in the platform, and MCP is how *other* clients come to it.

Datus does not replace Genie for a Databricks-only business user. It sits on the producer side: generating and evolving semantic models and metrics as schemas drift, so whatever consumer you run — Genie, Cortex Analyst, or an MCP client — is not guessing joins from column names. If the bottleneck is "Finance will not open Databricks," buy Genie (and staff the authors). If the bottleneck is "every agent in the company is drifting off last quarter's definitions," you have a context-evolution problem, which is a different SKU.

## 6. Score a POC with one overlapping noun

The refusal case doubles as the scoring rubric. Do not demo "ask anything about the lakehouse." Demo two agents — `finance-revenue` and `growth-checkout` — one overlapping business noun, and a question that must not cross the grain. The overlapping noun is `amount`. The question is the CFO's "Which category drove revenue last quarter?" A pass is the finance agent answering on the Finance grain or refusing and pointing at the growth agent. A fail is the GMV ranking coming back anyway.

If the platform cannot keep those two agents from sharing a wrong table, you have bought a nicer text-to-SQL box.

## Conclusion

Databricks Genie, in the sense buyers mean, is a family of lakehouse-native data agents. The object to understand first is the **Genie Agent** — the domain-scoped conversational analytics surface formerly known as a Genie Space. Search for the object by its new name, curate it the way you curate a certified dashboard, and treat its refusal to answer across grains as the product working. Genie One is how business users meet that family in Slack and mobile. Genie Code is the engineering twin. Genie Ontology is the automatic context bet. The closest warehouse peer is [Cortex Analyst](/blog/what-is-cortex-analyst/); the closest generalist client is the [Claude Data plugin](/blog/what-is-claude-data-plugin/). When the job is evolving context across stacks rather than answering questions in Databricks, that is a [data engineering agent](/blog/what-is-data-engineering-agent/). Buy Genie when the question's home is Databricks and you are willing to curate agents the way you curate dashboards. Scope the agent. Name the grain. Read the SQL.

## Frequently asked questions

### What is Databricks Genie?

Genie is Databricks's conversational analytics and data-agent family. In current docs, a **Genie Agent** is a domain-specific chat over Unity Catalog data that returns SQL, tables, and visualizations. It is the evolution of **Genie Spaces**.

### What is a Genie Agent vs a Genie Space?

The same product object, renamed. Older materials say Space; Databricks documentation as of July 2026 says Genie Agent. If a slide still says Space, map it to Agent unless the vendor has split the SKU in your contract.

### How is Genie different from Genie Code?

Genie (Agents / One) answers business questions. Genie Code writes and operates data-engineering artifacts (pipelines, Spark) on Databricks. See [platform-native data engineering agents](/blog/platform-native-data-agents-compared/) for the Code-side comparison with Cortex Code and BigQuery's DE agent.

### Does Genie replace a semantic layer?

No. Genie *consumes* semantic context — Metric Views, instructions, example SQL, and optionally Genie Ontology's extracted graph. Someone still has to certify `net_revenue`. Automatic ontology extraction can help and can also promote a popular wrong metric.

### Can I embed Genie in my own app?

Yes. Databricks documents a Conversation API and a Genie MCP app so other assistants can call Genie. Embedding does not move governance off Unity Catalog.

### When should we not use Databricks Genie?

When the system of record is not Databricks, when you need a pipeline agent rather than a question agent, when no one will curate domain agents, or when you need the same metric definitions outside the lakehouse. In those cases look at Cortex Analyst, a portable semantic layer, or a data engineering agent that feeds whatever consumer you already run.

## Related articles

- [What is a data agent?](/blog/what-is-data-agent/) — the category Genie belongs to.
- [What is Cortex Analyst?](/blog/what-is-cortex-analyst/) — Snowflake's counterpart.
- [What is the Claude Data plugin?](/blog/what-is-claude-data-plugin/) — Anthropic's take on the same job.
- [Platform-native data agents compared](/blog/platform-native-data-agents-compared/) — Genie, Cortex Analyst, and the trade-offs.
