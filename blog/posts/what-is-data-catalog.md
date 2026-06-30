---
title: "What Is a Data Catalog? Definition, Tools & How It Differs From Agent Context"
description: "Data catalog definition, popular tools, and why data engineering agents need context engines beyond discovery metadata."
author: "Evan Paul"
date: 2026-06-07
lastmod: 2026-06-10
head:
  - - meta
    - name: keywords
      content: "data catalog, what is a data catalog, data catalog definition, data catalog vs data dictionary, data catalog data engineering"
  - - meta
    - property: og:title
      content: "What Is a Data Catalog? Definition, Tools & How It Differs From Agent Context"
  - - meta
    - property: og:description
      content: "Data catalog definition, popular tools, and why data engineering agents need context engines beyond discovery metadata."
  - - meta
    - property: og:type
      content: article
  - - meta
    - property: og:url
      content: https://datus.ai/blog/posts/what-is-data-catalog
  - - meta
    - property: og:image
      content: https://datus.ai/logo_dark.svg
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - link
    - rel: canonical
      href: https://datus.ai/blog/posts/what-is-data-catalog
---

# What Is a Data Catalog? Definition, Tools & How It Differs From Agent Context

A **data catalog** inventories and describes data assets — tables, columns, owners, tags, and often **lineage** — so people can **find and trust** data across the organization. It is the phone book of the warehouse; it is not, by itself, a system that turns questions into correct SQL. This glossary entry defines data catalogs, compares them to dictionaries and semantic layers, and explains why data engineering agents need executable context on top of catalog metadata.

*Disclosure: Datus is a data engineering agent platform. This article explains data catalogs as general infrastructure, referencing Datus's Context Engine as one example of a layer that consumes catalog metadata. See the end for more detail.*

## TL;DR

- A **data catalog** answers **what exists, who owns it, and where it came from** — optimized for human discovery.
- Popular platforms include <a href="https://datahubproject.io/" rel="nofollow noopener">DataHub</a>, <a href="https://atlan.com/" rel="nofollow noopener">Atlan</a>, and <a href="https://www.selectstar.com/" rel="nofollow noopener">Select Star</a> — plus native features in cloud warehouses.
- **Data dictionary** = column-level definitions; **catalog** = searchable asset graph with governance metadata.
- A **[semantic layer](/blog/what-is-semantic-layer/)** adds executable metric logic; catalogs rarely encode "net revenue" computation completely.
- A catalog alone is not an AI grounding layer — agents need **executable context** (reference SQL, [semantic models](/blog/what-is-semantic-model/), feedback) layered on top of catalog metadata to generate correct queries reliably.

## 1. Data catalog: a working definition

> A **data catalog** is a metadata system that **indexes data assets**, surfaces **documentation and lineage**, and supports **search, governance, and collaboration** for data consumers and stewards.

Catalogs emerged because warehouses grew faster than tribal knowledge. When three teams each create a `customers` table, someone needs a map.

Core capabilities users expect:

| Capability | User question answered |
| --- | --- |
| **Search** | "Is there a table with subscription churn?" |
| **Documentation** | "What does `status_code = 7` mean?" |
| **Lineage** | "What pipeline feeds this dashboard?" |
| **Ownership** | "Who do I ping when this breaks?" |
| **Classification** | "Is this column PII?" |
| **Popularity / usage** | "Do people still query this?" |

Each of these capabilities answers a human question — not a machine question. A catalog tells an analyst that `dim_customer.status` exists, that the Data Engineering team owns it, and that 340 dashboards depend on it. But it does not tell a text-to-SQL system that when a VP asks "how many active customers do we have," the answer lives in `dim_customer.status = 'active'` joined to `fact_subscription` via `customer_id` with a filter on `subscription_end_date > CURRENT_DATE`. The catalog provides the ingredients list. A context engine provides the recipe.

## 2. Data catalog vs data dictionary vs semantic layer

| Concept | Primary audience | Core content | Agent usefulness |
| --- | --- | --- | --- |
| **Data dictionary** | Engineers, stewards | Column descriptions, types | Low–medium — descriptive, not executable |
| **Data catalog** | Whole organization | Assets + lineage + ownership | Medium — find tables, not metric logic |
| **Semantic layer** | Analytics + apps | Metrics, dimensions, joins | High for governed KPIs |
| **Context engine** | Agents + engineers | Catalog + semantics + reference SQL + feedback | High for generation and evolution |

A catalog tells you **`fact_orders` exists**. A semantic layer tells you **how to compute net revenue from it**. A context engine tells you **which join path last week's validated query used** and **that test accounts must be excluded** — knowledge that may never appear in either catalog or YAML yet.

The progression from catalog to context engine is a progression from descriptive metadata to executable knowledge. A catalog entry for `fact_orders.net_amount` says "Net order amount in USD." A semantic layer definition says "Net revenue = SUM(net_amount) WHERE order_status IN ('completed', 'shipped')." A context engine, retrieving from reference SQL, adds "last quarter, the CFO's revenue query used `dim_fiscal_calendar.fiscal_quarter` rather than `DATE_TRUNC('quarter', order_date)` because the company's fiscal calendar offsets by two weeks — and if you use calendar quarters, the numbers will not match the board deck." That third piece of knowledge — the join authority on the time dimension — lives in neither the catalog nor the semantic layer but is the difference between a correct answer and a plausible-looking wrong answer.

[Contextual data engineering](/blog/contextual-data-engineering/) walks through those layers for agents.

## 3. Why organizations buy data catalogs

Common drivers:

- **Self-serve friction** — analysts cannot find trusted tables. The symptom is Slack messages to the data team that start with "where do I find..." — a catalog eliminates those messages by making table discovery self-service.
- **Governance programs** — GDPR, SOX, internal [data contracts](/blog/what-is-data-contract/) need ownership tags. A catalog assignment of "PII: yes" on `dim_customer.email` enables automated policy enforcement at the metadata layer before any query touches the data.
- **Cloud migration** — new warehouse, lost oral history. A team migrating from Redshift to Snowflake discovers that 60% of their tables have no description and 40% have no known owner. The catalog becomes an archaeology tool before it becomes a governance tool.
- **Cost control** — identify unused tables and duplicate pipelines. A catalog's popularity metrics reveal that `fact_orders_v1`, `fact_orders_v2`, and `fact_orders_v3` are all still queried weekly — by different teams, using different definitions, producing revenue numbers that differ by up to 5%.
- **AI initiatives** — leadership assumes catalogs automatically fix NL2SQL (they do not, without more context). This is the fastest-growing driver in 2026 and also the most commonly misunderstood. A catalog populated with table descriptions does not upgrade to a text-to-SQL grounding layer by adding a chatbot on top. It needs executable context — reference SQL, join authority, grain definitions — that catalogs were not designed to store.

Catalogs excel at **organizational memory for humans**. They struggle when treated as the sole grounding for **autonomous SQL generation** because generation needs **executable priors**, not browse cards.

## 4. How catalogs connect to AI and text-to-SQL

Many 2025–2026 products advertise "AI on the catalog." Typical pattern:

1. Index descriptions and lineage into embeddings
2. Chat UI retrieves snippets
3. Model suggests tables or generates SQL

That is [RAG for data engineering](/blog/rag-data-engineering/) with catalog documents as the corpus. Quality limits:

- Descriptions are **empty or stale** on half of columns
- **Metric logic** lives in dbt repos, not catalog fields
- **Join authority** is not in lineage graphs
- **Feedback** from wrong queries rarely flows back into catalog entries

Consider a real scenario: a 500-person SaaS company deploys Atlan, populates it with dbt-generated descriptions, and adds an AI chat feature on top. An analyst asks "monthly churn rate by product line" and the AI retrieves `dim_product_line.name` and `fact_subscription.churn_flag` from the catalog. It generates SQL that divides churned subscriptions by total subscriptions — a reasonable formula but wrong for this company, which defines churn rate as "subscriptions cancelled divided by subscriptions at risk of churn (active at month start)," meaning the denominator excludes new subscriptions added mid-month. The catalog had the right tables. It did not have the metric's business logic — which lived in a dbt model file 17 directories deep, unindexed by the catalog's AI feature. The AI produced a confident wrong answer because retrieval found tables but missed the metric definition that would have produced the correct denominator.

Improving AI query success requires **reference SQL**, **semantic models**, and **feedback loops** — the context engine pattern in [how a context engine improves accuracy](/blog/context-engine-data-engineering-agent-accuracy/).

## 5. Data catalog vs context engine

Catalog services are inputs; context engines are what agents run on. A catalog's primary UX is search and browse — optimized for a person asking "where is customer data?" A context engine's primary UX is generation, validation, and evolution — optimized for a machine asking "what tables, joins, and filters produce the correct answer to this question?"

| Dimension | Data catalog | Context engine |
| --- | --- | --- |
| **Primary UX** | Search & browse | Generate, validate, evolve |
| **Metadata type** | Descriptive | Descriptive + executable + historical |
| **Update cadence** | Stewardship sprints | Continuous feedback from runs |
| **Consumer** | Humans first | Agents and humans |
| **Scope unit** | Asset pages | Domain-scoped bundles (~10 tables, ~20 metrics) |

The coexistence model is not either-or. Many enterprises run a catalog for organizational discovery and a context engine for agent-facing generation. The catalog ingests metadata from pipelines and surfaces it for human stewardship. The context engine consumes that metadata via API and layers semantic models, reference SQL, and feedback on top — creating a retrieval surface for text-to-SQL agents. The catalog owns inventory. The context engine owns executable knowledge. They feed each other: when a query is corrected in the agent, the correction updates the context index; when a description is updated in the catalog, the updated metadata flows into the retrieval index overnight.

## 6. Data catalog vs data lineage

**Data lineage** tracks how data moves and transforms — pipeline A feeds table B feeds dashboard C. Catalogs usually **display** lineage; lineage tools sometimes stand alone.

Agents need lineage to assess **blast radius** ("if I change this column, what breaks?") and to choose **trusted paths**. Context engines build implicit lineage relationships through catalog structure and reference SQL co-occurrence patterns — full enterprise lineage visualization remains a common roadmap item across the category.

For agents, the bar is often lower than a perfect enterprise graph: **knowing which tables co-occur in validated queries** already improves [schema linking](/blog/what-is-schema-linking/). If every validated query involving "revenue" co-occurs with `fact_orders` and `dim_fiscal_calendar`, those co-occurrence patterns function as lightweight lineage — the agent learns that revenue questions should not touch `fact_payments` even without a formal lineage graph saying "revenue does not flow through payments."

## 7. Evaluation checklist: catalog maturity for AI readiness

Ask before betting NL2SQL on catalog metadata alone:

1. **Coverage** — What % of production tables have non-empty descriptions? If the answer is below 60%, your text-to-SQL system will be blind to nearly half the warehouse. Descriptions drive retrieval — empty descriptions mean those tables are invisible to the RAG index regardless of their actual importance.
2. **Freshness** — How quickly do new columns appear after deploy? A column deployed today that takes two weeks to appear in the catalog is invisible to the text-to-SQL system for 14 days — during which any question that should route to that column gets routed elsewhere.
3. **Metric linkage** — Are certified metrics linked to tables, or only documented in dbt? A metric documented only in a dbt YAML file 12 directories deep is invisible to catalog-based retrieval. The metric definition must be indexed and linked to its source tables for the retrieval to surface it.
4. **ACL mirroring** — Does retrieval respect the same permissions as SQL execution? A retrieval that returns HR salary data to a text-to-SQL query from a Marketing analyst creates a compliance incident before any SQL executes. ACLs must be applied at retrieval time, not just at execution time.
5. **Feedback channel** — Can a wrong agent answer update metadata without a quarter-long project? If a correction requires a stewardship committee meeting and a Jira ticket, the feedback loop is too slow to matter. The correction must flow into the index within hours or days, not weeks or months.

Scores on 1–2 alone predict text-to-SQL pain more than which LLM you pick.

## 8. When a catalog isn't enough: a churn rate case study

A 500-person SaaS company deploys a leading data catalog, populates it with dbt-generated table and column descriptions, and adds an AI chat feature on top. The catalog has excellent coverage: 92% of production tables have non-empty descriptions, lineage graphs connect 85% of pipelines to dashboards, and the ownership matrix is current. The company's leadership expects the AI chat to deliver self-serve analytics to 200+ business users.

An analyst asks the AI chat: "monthly churn rate by product line for 2025."

The AI retrieves `dim_product_line.name` and `fact_subscription.churn_flag` from the catalog. It generates SQL that divides churned subscriptions (`churn_flag = TRUE`) by total subscriptions. The formula is `COUNT(CASE WHEN churn_flag THEN 1 END) / COUNT(*)`. The query runs, returns 4.2% average monthly churn, and the analyst includes the number in a quarterly business review deck.

The number is wrong. The company's actual churn rate is 5.8%. The discrepancy traces to the metric definition: the company defines churn rate as "subscriptions cancelled divided by subscriptions at risk of churn (active at month start)," meaning the denominator excludes new subscriptions added mid-month. The AI's formula used all subscriptions as the denominator, including those added mid-month that were never at risk of churning. The catalog had the right tables — `dim_product_line` and `fact_subscription` were correctly indexed and retrieved. But the metric's business logic — the denominator rule — lived in a dbt model file 17 directories deep in a private GitHub repository, unindexed by the catalog's AI feature. The catalog answered "what exists?" correctly. It could not answer "what does this metric mean?" because metric definitions were not cataloged as retrievable assets.

Three months later, after adding semantic layer integration and indexing dbt metric definitions alongside table metadata, the same question retrieves the correct denominator rule and produces churn rates within 0.3 percentage points of the validated dashboard. The catalog coverage didn't change. What changed was the addition of executable context — the metric formula — to the retrieval index. This is the difference between a catalog that serves human discovery well and a retrieval layer that serves machine generation well. Both are necessary. Neither substitutes for the other.

## Conclusion

A **data catalog** is essential infrastructure for **finding and governing** data assets. It is not a complete grounding layer for **data engineering agents** that must generate correct SQL weekly. Treat catalogs as **upstream metadata suppliers** to semantic layers and **context engines** that add executable logic, reference SQL, and feedback. Datus sits in that second layer — helping teams turn catalog facts into evolvable agent context.

## Frequently asked questions

### Will buying a catalog fix our AI text-to-SQL accuracy?

Rarely by itself. Accuracy improves when retrieval includes **semantic definitions, reference SQL, and feedback** — not just table descriptions. Think of it this way: a catalog gives the model a map of the warehouse. But to drive from a question to a correct query, the model also needs to know the traffic rules (join authority), the shortcuts (reference SQL), and the road closures (deprecations). The map is necessary but insufficient.

### What is the difference between a data catalog and a data dictionary?

A **data dictionary** focuses on technical definitions of tables and columns — "`status`: order status code (1=pending, 2=shipped)." A **data catalog** adds search, lineage, ownership, tags, and collaboration across the full asset graph — "`fact_orders.status` is owned by the Orders team, feeds 12 dashboards, is classified as non-PII, and was last updated 3 days ago." The dictionary is a glossary. The catalog is a library system.

### Can a catalog and a context engine coexist in the same organization?

Yes — and this is the most common architecture in enterprises running both. The catalog serves the 500 people who need to find and understand data (discovery, governance, stewardship). The context engine serves the agents that need to generate correct queries (retrieval, validation, evolution). Different consumers, different metadata requirements, complementary systems. The catalog's API feeds table and column metadata into the context engine; the context engine's feedback loop can surface usage annotations back into the catalog.

### How does a data catalog relate to a semantic layer?

Catalogs document **what exists** — the inventory of tables, columns, and pipelines. Semantic layers define **how to compute business metrics** — the formula for "net revenue" or "monthly active users." Agents need both: the catalog to find tables, the semantic layer to compute correctly, and institutional knowledge (reference SQL, feedback) to handle everything neither catalog nor semantic layer encodes. See [what is a semantic layer](/blog/what-is-semantic-layer/).

### What's the most common mistake when betting AI on a catalog?

Assuming that catalog coverage equals AI readiness. A catalog with 100% table coverage but empty descriptions on 60% of columns will produce confident wrong SQL because the retrieval system cannot distinguish between "the right column has no description" and "no right column exists." The model fills the information gap by guessing — and in production environments, confident guesses dressed as answers erode trust faster than any downtime event.

## Related articles

- [What is a semantic layer?](/blog/what-is-semantic-layer/) — executable business logic above catalog metadata
- [How a context engine improves agent accuracy](/blog/context-engine-data-engineering-agent-accuracy/) — beyond catalog browsing
- [What is a data engineering agent?](/blog/what-is-data-engineering-agent/) — operationalizes context, not just inventory

---

*Disclosure: Datus is a data engineering agent platform. This glossary entry explains data catalogs as general infrastructure and how Datus positions its Context Engine as a complementary layer — consuming catalog metadata and adding executable, evolvable agent context on top.*
