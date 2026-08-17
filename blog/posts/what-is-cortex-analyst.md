---
title: "What Is Cortex Analyst? Snowflake Natural-Language SQL for BI"
description: "What Cortex Analyst is: Snowflake's managed text-to-SQL API grounded in Semantic Views — verified queries, REST integration, and why it is not Cortex Code."
author: "Kostja"
date: 2026-08-21
lastmod: 2026-08-21
head:
  - - meta
    - name: keywords
      content: "Cortex Analyst, Snowflake Cortex Analyst, Snowflake text-to-SQL, Semantic Views, verified query repository, Cortex Analyst vs Genie, Cortex Analyst API"
  - - meta
    - property: og:title
      content: "What Is Cortex Analyst? Snowflake Natural-Language SQL for BI"
  - - meta
    - property: og:description
      content: "What Cortex Analyst is: Snowflake's managed text-to-SQL API grounded in Semantic Views — verified queries, REST integration, and why it is not Cortex Code."
  - - meta
    - property: og:type
      content: article
  - - meta
    - property: og:url
      content: https://datus.ai/blog/what-is-cortex-analyst/
  - - meta
    - property: og:image
      content: https://datus.ai/logo_dark.svg
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - link
    - rel: canonical
      href: https://datus.ai/blog/what-is-cortex-analyst/
---


# What Is Cortex Analyst? Snowflake Natural-Language SQL for BI

Cortex Analyst is Snowflake's fully managed text-to-SQL service: business questions in, SQL against Snowflake tables out. It is a [data agent](/blog/what-is-data-agent/) of the query-agent kind — a consumer of semantic context — delivered as a REST API you embed in Slack, Streamlit, or an internal chat, not as a generic chatbot that lives outside the warehouse.

## TL;DR

- **Cortex Analyst** is a Cortex feature that turns natural-language questions over **structured Snowflake data** into SQL, executed in your warehouse under existing RBAC. Snowflake positions it as a managed agentic system so teams do not have to stand up their own RAG-plus-text-to-SQL stack.
- Grounding is the product. Schema-only NL-to-SQL misses metric grain and business process. Analyst is designed to read a **Semantic View** (recommended) or a legacy semantic-model YAML on a stage. Verified queries pin high-value questions to known-good SQL.
- The commercial shape is **API-first**. You do not "log into Cortex Analyst" the way you log into a BI tool. You call `POST /api/v2/cortex/analyst/message` from an app you control. That is a different buyer motion from Databricks Genie, which ships a curated chat object in the platform UI.
- **Cortex Analyst is not Cortex Code.** Analyst answers questions. Code writes pipelines and dbt. Collapsing both into "Snowflake Cortex" is how engineering pilots get staffed as self-serve BI.
- Analyst is the right default when the system of record is Snowflake and you will maintain Semantic Views. It is the wrong default when the question must span two warehouses, or when you wanted a desktop analyst plugin with no semantic contract.

## 1. The product is an API, not a chat

Nobody logs into Cortex Analyst. There is no Analyst chat window in Snowsight the way there is a worksheet. The product is an endpoint: `POST /api/v2/cortex/analyst/message`, called from an application you control. Streamlit, Slack, Teams, and custom chat are the integration patterns the docs describe; none of them is a canonical UI. Analyst is sold to **builders of applications**, not only to analysts sitting in Snowsight.

That shapes what an evaluation is. A team that clicks around a demo chat and never designs the host application will underuse the product and then over-blame the model. The real purchase decision is an API contract decision: which app hosts the questions, which roles may call the endpoint, and which semantic objects the endpoint may touch.

Two operational facts follow from "API, not chat." First, Analyst does not copy data into a chat index as a precondition. It generates SQL and runs it in your warehouse, so latency and cost are warehouse latency and cost plus Cortex inference; capacity planning stays a Snowflake admin problem. Second, the endpoint's door policy is explicit: callers need `SNOWFLAKE.CORTEX_USER` or the narrower `SNOWFLAKE.CORTEX_ANALYST_USER`, plus usage on the Semantic View's objects (and stage `READ` if you still point at YAML files). `CORTEX_USER` is granted to `PUBLIC` by default; many enterprises revoke that and grant Analyst only to analyst roles. Skipping this step is how "we turned on Cortex" becomes "every employee can probe every semantic model."

Behind the endpoint sits a managed inference runtime. Default generation uses Snowflake-hosted models (documentation cites Mistral and Meta among the mix; Snowflake may change the combination at runtime). In the default configuration, prompts and metadata used for SQL generation are described as staying inside Snowflake's governance boundary, and Snowflake states it does not train models for other customers on your Customer Data. Those are vendor security claims; put them in the review, do not treat them as a substitute for your own DPA reading.

## 2. Semantic Views: the mandatory contract

Worksheet autocomplete can draft SQL. It cannot be the company's self-serve analytics channel. The moment a business user types "revenue," a schema-aware model has to choose a table, a grain, a currency, and a filter for test accounts. Database DDL does not contain those rules. Snowflake's own <a href="https://docs.snowflake.com/en/user-guide/snowflake-cortex/cortex-analyst" rel="nofollow noopener">Cortex Analyst documentation</a> states the problem in engineering language: generic text-to-SQL given only a schema lacks business process definitions and metric handling.

The documentation therefore treats a semantic layer as mandatory infrastructure, not as an optional glossary. **Semantic Views** — schema-level objects with logical tables, dimensions, facts, metrics, and relationships — are the recommended contract. As the <a href="https://docs.snowflake.com/en/user-guide/views-semantic/overview" rel="nofollow noopener">Semantic Views</a> overview spells out, a View carries the decisions a schema cannot: business entities, metrics, joins, synonyms, custom instructions, and access modifiers (public vs private facts and metrics). Legacy YAML semantic models stored on stages still work for compatibility; new implementations should not start on the legacy path.

That contract is what makes Analyst trustworthy rather than merely plausible. Analyst is Snowflake executing SQL that an LLM proposed against a contract you authored. It uses the View's metadata to generate SQL, and the SQL then runs in *your* warehouse, so compute and data access follow warehouse roles: if a role cannot `SELECT` the underlying tables, Analyst cannot magically return the rows. If you skip the contract, you have bought a hosted text-to-SQL endpoint with the same failure mode every vendor warns about.

Two details decide how the contract behaves in production. First, if you register several Semantic Views, Analyst can choose among them rather than requiring the client to pass the right file on every question — convenient, and a reason to keep Views tightly scoped so "revenue" cannot jump from Finance to Growth. Second, Semantic Views support **custom instructions** (how to generate SQL, how to categorize questions). Those instructions are Snowflake-side policy. They do not automatically travel if you export the View through Ossie; that gap is documented in our [Snowflake OSI](/blog/what-is-snowflake-osi/) piece and is why "we exported YAML" is not the same as "every agent behaves the same."

## 3. Verified queries: the audit field no demo can fake

The contract has a second part that no schema can express: the answers that must not improvise. For those questions — a board metric, a renewal figure, a number under compliance review — you store a named, verified SQL statement next to the question in a **Verified Query Repository (VQR)**. Analyst can reuse that statement when a similar question arrives, instead of generating a fresh join.

The REST response can indicate which verified query was used (`confidence.verified_query_used`). That field is the product's audit surface. High-stakes questions should light up VQR, not a novel join — and this is the difference between a demo and a governed system. In production, read the field in QA: a certified-number question that comes back with `verified_query_used: false` is a regression to investigate before the number ships, no matter how plausible the SQL looks. Demos rarely include this step. Systems that survive an audit do.

Verified queries are the part of the contract you author explicitly: a subject-matter expert signs the SQL, you register it, and Analyst's confidence output tells you when it was used. That is a different accountability model from "the LLM wrote something that looks right."

## 4. Cortex the umbrella: Analyst, Code, and Search

"Cortex" is a brand umbrella. The SKUs do different jobs.

| Product | Job | Grounding | Typical user |
| --- | --- | --- | --- |
| **Cortex Analyst** | Natural-language questions → SQL on structured data | Semantic View / semantic YAML + VQR | App builder + business user via your chat |
| **Cortex Code** | Generate and operate pipelines, dbt, engineering tasks | Platform + repo context | Data engineer |
| **Cortex Search** | Retrieval over unstructured/document indexes | Search service you provision | RAG / document Q&A |
| **Claude Data plugin / ChatGPT file analysis** | Generalist analyst in a desktop or chat client | Whatever MCP or file you attach | Individual analyst; **no** Snowflake Semantic View unless you wire it — see [Claude Data plugin](/blog/what-is-claude-data-plugin/) |

The expensive mix-up is Analyst vs Code. A team that wanted "the VP can ask revenue in Slack" and staffed a Cortex Code POC will get pipeline diffs and wonder why there is no Semantic View. A team that wanted "generate Dataform-equivalent models" and bought Analyst will get a chat API.

The other mix-up is Analyst vs a generalist. The Claude Data plugin is a client-side workflow pack on Cowork / Claude Code, plus optional warehouse MCP. It can talk to Snowflake if you connect a server. It does not author Semantic Views, does not run inside Horizon as a Snowflake feature, and does not give you `verified_query_used` in a Snowflake API response. Use it for exploratory analysis. Do not use it as the enterprise certified-number channel unless you have put a semantic contract *behind* the MCP.

Genie is the closest peer SKU: a warehouse-native query agent. The productization differs. Databricks leads with a curated **Genie Agent** object in the UI (and an embed API) — see [what Databricks Genie is](/blog/what-is-databricks-genie/). Snowflake leads with a **REST service** plus Semantic Views you already govern as catalog objects. If your culture is "ship a Space/Agent per domain in the lakehouse UI," Genie will feel native. If your culture is "we already have a portal, give us an API and RBAC," Analyst will feel native. Neither is a portable semantic layer for a second cloud.

Snowflake's role in Open Semantic Interchange / Ossie is relevant only at the handoff. Semantic Views can import and export Ossie YAML with fidelity limits. Analyst still runs on the View inside Snowflake. Interchange does not make Analyst a multi-warehouse agent.

## 5. What Analyst cannot fix

The data does not live in Snowflake, or not only in Snowflake. Analyst will not become your Databricks or BigQuery agent, and no Semantic View export changes that.

You refuse to maintain Semantic Views (or you planned to "let the LLM read INFORMATION_SCHEMA"). You will recreate the schema-only failure the product exists to avoid.

You needed unstructured document Q&A. That is Cortex Search plus a RAG design, or a document agent, not Analyst.

You needed pipeline generation. Cortex Code.

You needed Excel cubes and MDX. That is a BI/semantic-layer problem, not Analyst.

You needed a single portable metric document for every agent in the company. Semantic Views plus Ossie export can *move* a model; they do not *operate* Genie or Power BI Copilot. Plan the consumer per platform.

And there is a limit inside the contract itself. Analyst cannot notice when the world under the View drifts. Register the View today, and a schema change tomorrow — a new marketplace-fee column, a repartitioned events table — leaves the model generating against what the View still says. Keeping the contract true is an engineering job: a data engineering agent or a human modeling sprint will catch the drift, and Analyst will not flag it on its own.

Datus is not a Cortex Analyst replacement. Analyst is the Snowflake-native question runtime. Datus is a producer of evolvable semantic context — `/gen_semantic_model`, `/gen_metrics`, subject-scoped Subagents — including toward Snowflake. Use Analyst when the bottleneck is "business users have no trustworthy NL path inside Snowflake." Use a data engineering agent when the bottleneck is "the View froze the day after the schema changed." Most Snowflake estates eventually have both bottlenecks and try to buy one SKU for both.

## 6. The buying test: read `verified_query_used`

The fastest honest evaluation does not measure the model; it measures the contract. Wire a Streamlit app to a raw schema — `ANALYTICS.PUBLIC`, no Semantic View, "we'll add YAML later." Ask a real question: "How many accounts churned this quarter?" Analyst returns valid SQL that counts cancellation events. The number is plausible. It is also wrong: "churned" means no paid activity for 90 days, reactivations are double-counted, and internal test accounts carry no flag that DDL reveals. The SQL is valid. The class is wrong.

Now register the View: `churned_accounts` as a measure with the 90-day definition, a relationship that keeps usage events from being counted as accounts, and a verified query for the board's churn number that Finance signed. Ask the same question. The response either hits the verified query or generates against the View's metrics — and the payload carries `confidence.verified_query_used`. The Streamlit UI did not change. The contract did.

Run that test across your real question set and keep two numbers: how many responses light up VQR, and how many return the right answer class. Then make your QA harness read `verified_query_used` on every certified question. That is the difference between a demo and a governed system, and it is measurable.

## Conclusion

Cortex Analyst is Snowflake's managed query agent: natural language in, warehouse SQL out, grounded in Semantic Views and optional verified queries, consumed through a REST API you embed where the business already works. It is not Cortex Code, not Cortex Search, and not a desktop data plugin. The closest lakehouse peer is [Databricks Genie](/blog/what-is-databricks-genie/); the closest generalist client is the [Claude Data plugin](/blog/what-is-claude-data-plugin/). When Semantic Views freeze after a schema change, that is a [data engineering agent](/blog/what-is-data-engineering-agent/) problem, not an Analyst prompt problem. Buy Analyst when Snowflake is the system of record and someone will own the View the way they own a certified dashboard. Author the grain. Verify the questions that matter. Read `verified_query_used`.

## Frequently asked questions

### What is Cortex Analyst?

Cortex Analyst is a fully managed Snowflake Cortex feature that converts natural-language questions about structured data into SQL, using a Semantic View or semantic model as grounding, and executes that SQL in your warehouse.

### Is Cortex Analyst the same as Cortex Code?

No. Analyst is conversational/query text-to-SQL for business questions. Cortex Code is a data-engineering agent for pipelines and transformation code. They share a brand, not a runtime.

### Does Cortex Analyst need a semantic model?

Practically, yes, if you want production accuracy. Snowflake recommends **Semantic Views**. Legacy YAML semantic models on stages remain supported. Schema-only use recreates the failure Analyst is meant to fix.

### How do verified queries work?

You store question-plus-SQL pairs (Verified Query Repository). Analyst can reuse them for similar questions. The REST response can name which verified query was used — `confidence.verified_query_used` — and that is the field to assert in QA.

### Can we embed Cortex Analyst in Slack or an internal app?

Yes. The product is API-first (`/api/v2/cortex/analyst/message`). Slack, Teams, Streamlit, and custom chats are documented integration patterns, not separate SKUs.

### When should we not use Cortex Analyst?

When the data is not in Snowflake, when you will not maintain Semantic Views, when the workload is documents or pipelines, or when you need one agent over multiple clouds. Then look at Genie, Cortex Code, Cortex Search, or a cross-stack data engineering agent.

## Related articles

- [What is a data agent?](/blog/what-is-data-agent/) — the category.
- [What is Databricks Genie?](/blog/what-is-databricks-genie/) — the Databricks counterpart.
- [What is the Claude Data plugin?](/blog/what-is-claude-data-plugin/) — Anthropic's approach.
- [What is Snowflake OSI?](/blog/what-is-snowflake-osi/) — the Semantic Views to OSI bridge Cortex Analyst grounds on.
