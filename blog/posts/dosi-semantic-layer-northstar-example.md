---
title: "DOSI Semantic Layer Example: Who Qualifies for Premier?"
description: "Follow a DOSI semantic layer example as a retailer defines Premier customers, checks the numbers and changes the rules—with a runnable Northstar dataset."
author: "Evan Paul"
date: 2026-11-13
lastmod: 2026-11-13
head:
  - - meta
    - name: keywords
      content: "DOSI semantic layer example, DuckDB semantic layer tutorial, Apache Ossie example, customer eligibility, semantic model verification"
  - - meta
    - property: og:title
      content: "DOSI Semantic Layer Example: Who Qualifies for Premier?"
  - - meta
    - property: og:type
      content: article
  - - meta
    - property: og:url
      content: https://datus.ai/blog/dosi-semantic-layer-northstar-example/
  - - link
    - rel: canonical
      href: https://datus.ai/blog/dosi-semantic-layer-northstar-example/
---

## TL;DR

Northstar wants to launch a Premier membership program. Datus connects the business meaning of “Premier” to shared metrics; DOSI calculates who qualifies. This example follows that decision from the first question to a revised policy, with downloadable data and checked results you can explore yourself.

## A membership program starts with a business question

A retailer is preparing to offer delivery benefits and priority support to its best customers. Before launching the program, the owner has a deceptively simple question:

**Which customers should we treat as Premier?**

That is the starting point of Shao’s Datus announcement demo. The fictional retailer, Northstar, has the records it needs: purchases, deliveries, costs, returns and refunds. What it still needs is an agreed meaning of “Premier”—one that reflects the economics of the program and that an AI agent can use again later.

High spending alone might not be enough. Someone who places large orders and returns many of them may look very different after refunds and costs. A profitable customer who shops only occasionally may not be the audience the owner wants for a recurring membership benefit.

The demo follows how those business considerations become a shared definition. To make the calculation behind the story inspectable, we also ran its Northstar data and models locally through DOSI. The results below come from that execution, verified on November 13, 2026. Northstar’s people and transactions are invented.

## Give the agent the meaning behind the tables

An owner can say “our best customers” because they carry an understanding of the business. An agent needs access to that understanding too.

In Shao’s demo, the agent follows the relationships between purchases, costs and returns to identify three relevant measures: **customer contribution margin, order count and return rate**. Together, they tell a more useful story than sales alone: how much value a customer contributes, how often they buy, and how often those purchases come back.

This is where ontology and a semantic model work together. The ontology describes the business concepts and their relationships: a customer places an order; an order contains lines; returns and refunds relate to those purchases. The semantic model connects that map to source data and the rules for calculating metrics.

For Northstar, contribution margin includes merchandise revenue, refunds, product costs, recovered product costs, outbound shipping, payment fees and return handling. It means contribution after those stated variable costs, rather than corporate net profit. Shipping belongs to an order and must be counted once, even when that order contains several lines.

Those details are part of the definition. The agent should not have to decide afresh whether to subtract shipping twice or whether a refund counts every time someone asks a question. The definitions live in a model that the team can review. Our [semantic model examples](/blog/semantic-model-examples/) explore that idea more broadly.

## Let DOSI calculate, then make the business decision

In the announcement, the agent asks DOSI, Datus’s calculation engine, to calculate the relevant metrics. DOSI applies the agreed semantic definitions to the data; the agent uses the results to propose membership criteria for the owner to review, refine and approve.

The local example uses this baseline, called **Rule A**:

- At least **$3,000 in contribution margin**.
- At least **six distinct delivered orders**.
- An **order return rate of 20% or less**.

These conditions represent a policy choice. The calculation makes their consequences visible; the owner remains responsible for deciding whether they fit the membership program.

Here is what DOSI returned for five of the eight fictional customers in our verified run:

| Customer | Contribution margin | Delivered orders | Order return rate | Qualifies? |
| --- | ---: | ---: | ---: | --- |
| Maya Chen | $7,325.24 | 8 | 12.50% | Yes |
| Daniel Brooks | $3,308.16 | 7 | 0.00% | Yes |
| Priya Shah | $4,359.59 | 5 | 0.00% | No |
| Lucas Martin | $5,415.29 | 9 | 33.33% | No |
| Sofia Rivera | $3,188.49 | 6 | 16.67% | Yes |

Priya contributes more than Daniel but has placed only five eligible orders. Lucas has both strong contribution and frequent purchases, but his return rate exceeds the ceiling. Their exclusion is understandable once the policy is explicit. A list of “top customers by sales” would answer a different question.

Maya, Daniel and Sofia qualify. Together, they account for **$13,821.89 in contribution margin, 21 orders and two returned orders**. The group’s return rate is 2 divided by 21, or 9.52% rounded—not an average of the three customer percentages.

The time window is explicit too. The fixture uses delivered orders from September 20, 2025, inclusive, to September 20, 2026, exclusive, and received returns and posted refunds before October 20, 2026 UTC. Those dates keep the comparison anchored to the same business period.

## Make “Premier” something the next agent can understand

The next part of Shao’s demo moves beyond a single answer. Datus saves Premier Customers as a business concept in the ontology and links its criteria to the relevant metrics.

That changes what the next conversation can start from. Instead of explaining the membership policy again, the owner can ask about Premier customers using the saved definition. The demo illustrates another agent retrieving that definition and requesting the calculation from DOSI. The business meaning and calculation rules stay connected across those conversations.

The roles are worth keeping clear: **the ontology captures what Premier means and how it relates to customers; the semantic model defines the calculations; DOSI makes supported requests executable.** Datus brings that context into the team’s and agents’ workflows.

[Apache Ossie](/apache-ossie/) provides the open specification underlying compatible semantic definitions. The downloadable Northstar fixture pins an older Ossie version and uses DATUS extensions plus a DOSI ontology overlay. Reuse across tools depends on support for those definitions; the complete overlay is not presented as universally portable Ossie core.

The cross-agent interaction is part of the announcement’s product demonstration. Our local verification checks the model and calculations, rather than running an external ChatGPT or MCP session.

## What happens when the owner changes their mind?

Suppose the owner decides the membership needs a higher contribution threshold. They raise the minimum from $3,000 to **$4,000**, keeping the order-count and return-rate requirements unchanged.

This is **Rule B** in the fixture. With the same data and the stricter threshold, only Maya qualifies. Daniel and Sofia fall below the new minimum. Priya still lacks enough orders, and Lucas still exceeds the return-rate ceiling.

| Policy | Qualifying customers | Contribution margin | Orders |
| --- | --- | ---: | ---: |
| Rule A: minimum $3,000 | Maya, Daniel, Sofia | $13,821.89 | 21 |
| Rule B: minimum $4,000 | Maya | $7,325.24 | 8 |

The useful result is more than a smaller list. The owner can see the effect of one policy change without wondering whether the underlying data window or refund treatment also changed.

Shao’s announcement then shows the updated definition saved as another revision, with a record of what changed and why. Reviewers can return to an earlier saved report and inspect the definition and calculations used at that time. An answer produced under Rule A should remain explainable after Rule B becomes the current policy.

Our downloadable fixture contains both classifications and verifies their results. The revision review, saved-report interaction and approval screens belong to the broader demonstrated workflow; the local script does not implement those product interactions or activate memberships.

## You should be able to check the answer

An attractive report is not enough to settle whether the calculation matches the business rule. For this example, we rebuilt the database from the supplied CSV files, executed DOSI’s customer query, and compared the output with independent expectations.

All **nine verification groups passed**. They include customer classifications, source counts and relationships, reconciliation of costs and shipping, and an independent SQL calculation that checks contribution to the cent. The package retains the model, requests, generated SQL and actual results.

One detail matters when reading that evidence: DOSI calculates and selects the customers; a separate DuckDB query summarizes those selected customer results. The pinned DOSI release rejects a direct composed cohort query along an ambiguous refund-to-customer path, so the outer summary is explicitly recorded as DuckDB work. Both SQL statements are available for inspection.

This is a small, local functional example. Its value is that you can follow the decision from source records to customer eligibility and check the answer yourself. It does not establish production performance or cloud-warehouse execution.

## Explore the example yourself

[Download the Northstar example](/examples/dosi-northstar.zip) to inspect the synthetic data, semantic model, ontology overlay and verification files. If you prefer to read before running anything, open the [model](/examples/dosi-northstar/model.yaml), [generated customer SQL](/examples/dosi-northstar/evidence/customers.sql) or [complete results and checks](/examples/dosi-northstar/evidence/verification.json).

The verified setup used **Python 3.12.14, DOSI engine 0.1.13, DuckDB 1.5.6 and PyYAML 6.0.3** on macOS ARM64. The archive’s README contains the full setup notes. With Python 3.12 installed, extract the archive into a new directory and run:

```bash
cd dosi-northstar
python3.12 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
.venv/bin/python setup_demo.py
.venv/bin/python demo.py verify
```

The verifier prints the customer outcomes and A/B totals. Installation needs network access; the verification itself uses local files and requires no cloud credentials or LLM key. See the included README for Windows paths and rerun instructions, or the [DOSI Python API](https://dosi.datus.ai/python/) for the underlying interface.

Northstar’s story starts with a question the business already understands. The goal is to make that understanding available to an agent, connect it to agreed calculations, and preserve enough evidence for someone else to check the result. That is the relationship between business context and execution that the [Datus semantic layer solution](/solutions/semantic-layer/) is designed to support.

## Frequently asked questions

### What does this example demonstrate?

It demonstrates customer-eligibility calculations using a reviewed Northstar semantic model and DOSI ontology overlay, with generated SQL and independently checked local results. Shao’s announcement provides the broader story of defining, reusing and revising that business context.

### Can I run it without a cloud warehouse or an AI model?

Yes. After installing the pinned Python packages, the supplied fixture runs locally against DuckDB. No cloud credentials or LLM key are required.

### Does Apache Ossie perform the calculations?

Apache Ossie (incubating) is the open specification. DOSI is the runtime used to compile and execute supported requests here. The fixture includes version-specific DATUS extensions and an ontology overlay, whose compatibility should be assessed separately.

### Does the script approve Premier memberships?

No. It calculates eligibility under two declared policies. Business approval, membership activation and the revision-review interfaces shown in the announcement are separate from this local verification.

## Related articles

- [Apache Ossie and DOSI quickstart](/blog/apache-ossie-dosi-quickstart/)
- [Semantic model examples](/blog/semantic-model-examples/)
- [Why a semantic standard needs an execution engine](/blog/why-osi-needs-execution-engine/)
