---
title: "Apache Ossie + Dosi: 10-Minute Semantic Layer Quickstart"
description: "Install Dosi, query a 191K-row DuckDB dataset from the CLI, wire it into Claude Code over MCP, and let attribution explain a revenue drop — in ten minutes."
author: "Harrison Zhao"
date: 2026-09-07
lastmod: 2026-09-07
head:
  - - meta
    - name: keywords
      content: "Apache Ossie tutorial, Dosi quickstart, semantic layer for AI agents, OSI YAML to SQL, MCP server semantic layer, Claude Code MCP, metric attribution, DuckDB semantic layer, text-to-SQL alternative"
  - - meta
    - property: og:title
      content: "Apache Ossie + Dosi: 10-Minute Semantic Layer Quickstart"
  - - meta
    - property: og:description
      content: "Install Dosi, query a 191K-row DuckDB dataset from the CLI, wire it into Claude Code over MCP, and let attribution explain a revenue drop — in ten minutes."
  - - meta
    - property: og:type
      content: article
  - - meta
    - property: og:url
      content: https://datus.ai/blog/apache-ossie-dosi-quickstart/
  - - meta
    - property: og:image
      content: https://datus.ai/images/apache-ossie-dosi-quickstart/dosi-ossie-yaml-to-sql.png
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - link
    - rel: canonical
      href: https://datus.ai/blog/apache-ossie-dosi-quickstart/
---

# Apache Ossie + Dosi: 10-Minute Semantic Layer Quickstart

## TL;DR

- **Dosi** compiles <a href="https://ossie.apache.org/" rel="nofollow noopener">Apache Ossie</a> (OSI) YAML semantic models into SQL for 16 warehouse dialects, and exposes the same semantic layer through a CLI, an MCP server, and REST/Python.
- This walkthrough runs end to end on **local DuckDB** — no production connection: install → download a 191K-row dataset → query from the CLI → compile the same query for other dialects → register the MCP server in Claude Code → ask why revenue dropped.
- Every command is copy-pasteable. Tested against **Dosi 0.1.9** with OSI spec `0.2.0.dev0`.
- The point of the exercise: the agent answers through **your metric definitions** instead of guessing SQL, and the same numbers come back from the CLI and from the agent because there is one engine underneath.
- The last step is the interesting one. `attribute_metric` turns "why did it drop?" into a **single deterministic call** whose decomposition reconciles back to the total change.

![Dosi as a semantic compiler: one Apache Ossie YAML model in, SQL for DuckDB, Postgres, MySQL, Snowflake, ClickHouse, Trino and StarRocks out, plus metrics Q&A and attribution in Claude Code](/images/apache-ossie-dosi-quickstart/dosi-ossie-yaml-to-sql.png)

*One semantic model, many SQL dialects — and the same definitions served to an agent.*

Compared with letting an agent generate SQL on every question, a [semantic layer](/blog/what-is-semantic-layer) gives you a stable, consistent place for metric definitions, joins, and calculation logic. This guide is the shortest path to seeing that difference on your own machine.

> A version of this article was first published on <a href="https://medium.com/@linux.hust/apache-ossie-dosi-a-10-minute-semantic-layer-for-your-ai-agent-0a92fa1859e5" rel="nofollow noopener">Medium</a>. Versions and counts here have been re-checked against the current documentation.

## What you need

- Linux (x86_64 / arm64) or a Mac with Apple Silicon.
- `claude --version` 2.1 or newer for the Claude Code section (the CLI-only sections need nothing else).
- Roughly ten minutes, plus a small amount of model quota for the agent steps.

Dosi needs no toolchain, database, or client libraries — every warehouse connector is compiled into the published binary. The default build runs DuckDB **in your process**; it needs `libstdc++` on the machine because DuckDB is C++. There is a lean build that is pure Rust and shells out to a `duckdb` CLI for local queries instead, which is the right choice for distroless or older images.

## 1. Install Dosi

```bash
curl -fsSL https://dosi.datus.ai/install.sh | sh
```

The installer detects your CPU architecture, verifies the SHA-256 checksum, installs `dosi` and `dosi-server` into `~/.local/bin`, and puts the example Apache Ossie YAML models under `~/.local/share/dosi/examples`.

Verify it:

```bash
export PATH="$HOME/.local/bin:$PATH"
dosi info
```

```text
dosi       0.1.9
osi spec   0.2.0.dev0
datus-ext  1.5 (accepts 1.0 and up)
mode       datus
build      engine (DuckDB in process)
examples   /home/you/.local/share/dosi/examples
```

`dosi info` needs no model, so it doubles as a version probe. `build` tells you which of the two published builds you have — `engine` runs DuckDB in process, `lean` shells out to a `duckdb` CLI.

## 2. Get a dataset worth exploring

The built-in example has six rows of orders. That is enough to verify the plumbing and not enough to make attribution interesting, so download a bigger one:

```bash
export DOSI_EXAMPLES=~/.local/share/dosi/examples
export DOSI_DB=$PWD/orders.duckdb

curl -fsSL https://dosi.datus.ai/orders-200k.duckdb -o "$DOSI_DB"
```

The file is about 2 MB and contains 191K orders, 5,000 customers, and 500 products. Its tables and columns match the bundled `orders` model, so there is no semantic model to modify.

Two things about this dataset are deliberate. It is generated with `hash()` rather than `random()`, so **your numbers will match the ones below**. And it contains two intentionally planted signals — we will let attribution find them in step 6 rather than describing them now.

## 3. Look at the model before querying it

```bash
dosi list metrics --model $DOSI_EXAMPLES/orders/model.yaml
```

```text
NAME               KIND        DATASETS           DESCRIPTION
revenue            aggregate   orders             Total order amount
order_count        aggregate   orders             Number of orders
unique_customers   aggregate   orders             Distinct purchasing customers
avg_order_value    ratio       orders             Revenue per order (ratio)
total_margin       expression  orders, products   Revenue minus cost (expression over two aggregates)
```

Pay attention to `KIND`. Dosi does not store a metric as a SQL string; it knows each metric's algebraic type. Ratios cannot simply be added together, and cross-table expressions cannot always be computed by joining everything first. The kind also determines how attribution decomposes the metric later — which is why this column exists at all.

`dosi list datasets` and `dosi list dimensions` are the other two discovery calls, and they are what an agent uses before it queries anything.

## 4. Run a metric query

```bash
dosi query --model $DOSI_EXAMPLES/orders/model.yaml \
  --metrics revenue,order_count,avg_order_value \
  --group-by customers.region --order -revenue \
  --execute --db "$DOSI_DB"
```

```text
region   revenue      order_count   avg_order_value
north    5390777.27   52610         102.47
east     5141251.25   50324         102.16
south    4866115.57   47831         101.74
west     4190772.79   40634         103.13
```

Note what you did *not* write: `region` lives in the `customers` table while the metrics come from `orders`, and the join is defined in the model, not in the query. That is the whole point of a metric query — you name business objects, and the compiler resolves grain and joins.

### The same query, other dialects

Drop `--execute` and Dosi compiles without running. Change `--dialect` and the same semantic query becomes SQL for a different database:

```bash
dosi query --model $DOSI_EXAMPLES/orders/model.yaml \
  --metrics revenue,order_count \
  --group-by orders.order_date:month --dialect mysql
```

"Group by month" is one concept with several implementations:

```sql
-- duckdb
SELECT DATE_TRUNC('MONTH', orders.order_date) AS order_date__month, ...

-- mysql
SELECT STR_TO_DATE(DATE_FORMAT(orders.order_date, '%Y-%m-01'), '%Y-%m-%d') AS order_date__month, ...

-- oracle
SELECT TRUNC(orders.order_date, 'MM') AS order_date__month, ...
```

Dosi ships executors for <a href="https://dosi.datus.ai/connectors/" rel="nofollow noopener">16 dialects</a> — DuckDB, SQLite, MySQL, TiDB, StarRocks, Doris, PostgreSQL, Hologres, Huawei Cloud DWS, GaussDB/openGauss, Oracle, ClickHouse, Trino, Snowflake, BigQuery, Databricks (Redshift compiles today but has no executor yet). These differences live in the compiler instead of in N hand-maintained SQL templates.

## 5. Wire it into Claude Code over MCP

Dosi ships its own MCP server, so there is no adapter to install. Start it in the background so you keep the terminal and the exported variables:

```bash
dosi-server \
  --model $DOSI_EXAMPLES/orders/model.yaml \
  --db "$DOSI_DB" >/dev/null 2>&1 &
```

> **Don't skip `--db`.** Without it the server's local DuckDB is in-memory and unseeded: `compile_sql` works, `run_query` fails with a missing-table error. It is the most common first-run confusion.

Register it:

```bash
claude mcp add --transport http dosi http://127.0.0.1:8081/mcp
claude mcp list
```

```text
dosi: http://127.0.0.1:8081/mcp (HTTP) - ✔ Connected
```

`claude mcp list` actually connects, so it works as a health check. MCP is mounted at `POST /mcp` — at the top level, not under `/v1`. If the server requires a token (`--auth-token`, env `DOSI_SERVER_TOKEN`), pass it at registration with `--header "Authorization: Bearer $DOSI_SERVER_TOKEN"`.

The tools the server exposes fall into four groups — discovery (`list_datasets`, `list_metrics`, `list_dimensions`, `describe_metric`, `get_capabilities`), compilation (`compile_sql`, `explain_query`), execution (`run_query`, `select`), and analysis (`attribute_metric`), plus `validate_model`. The <a href="https://dosi.datus.ai/mcp/" rel="nofollow noopener">MCP reference</a> lists the current set; a given server reports its own via `tools/list`, so check there rather than assuming a fixed count.

Now start Claude Code and ask:

```text
What are revenue and average order value by region?
```

The answer comes back with the same numbers as step 4 — same engine, same definitions — typically with the observation that the revenue spread is driven by order volume rather than by average order value (AOV lands within roughly 1.4% across the four regions, while order volume ranges from 40.6K in west to 52.6K in north, a difference of around 29%).

Two details are worth noticing in the response. Claude Code only had to map "revenue," "average order value," and "region" to metrics and dimensions — SQL compilation and execution were Dosi's job. And when it explains what a metric means (`avg_order_value` is revenue ÷ order count, *not* value per customer; `region` comes from `customers.region` joined through `orders.customer_id`), that explanation comes from the semantic model rather than being reinvented.

So far we have solved the easy problem: getting the number right.

## 6. Ask the hard question: why did it drop?

The more common question behind a dashboard is not *what* but *why*. Without leaving Claude Code:

```text
Revenue dropped significantly in Q2 2024 compared with Q1. Help me understand why.
```

This time the agent calls Dosi's attribution tool and then drills down from the attribution result. In one recorded run the agent made 11 tool calls in 98 seconds and found both planted signals, separated and quantified:

**The epicenter.** Revenue fell $1.57M (−14.8%) Q1→Q2 2024 ($10.58M → $9.01M), and it was not broad-based: the West region alone accounted for $1.02M — 65% — of the entire decline, collapsing roughly 39% while the other three regions each dipped 6–8%. Inside West, two problems compounded:

| West | Q1 2024 | Q2 2024 | Change |
|---|---|---|---|
| Completed revenue | $2.39M | $1.14M | −52% |
| Completed orders | 22,503 | 11,617 | −48% |
| Cancelled orders | 2,019 | 4,495 | +123% |
| Cancellation rate | 8.2% | 27.9% | ~3.4x |

**The secondary signal.** Electronics fell across every region (−$892K, the largest category drop), but worst in the West (−51%, versus 27–28% elsewhere). So there are two distinct stories: a broad electronics softening, plus a West-specific operational breakdown that dominates the total.

The agent also noticed something a careless analysis would miss — the `revenue` metric includes cancelled orders, which is why completed revenue (−$1.75M) and rising cancelled revenue (+$174K) partly offset each other in the totals.

### What the tool actually returns

The `attribute_metric` call the agent used corresponds exactly to this CLI command:

```bash
dosi attribute --model $DOSI_EXAMPLES/orders/model.yaml \
  --metric revenue --dimensions customers.region,products.category \
  --baseline 2024-01-01..2024-04-01 --current 2024-04-01..2024-07-01 \
  --db "$DOSI_DB"
```

```json
{
  "metric": "revenue",
  "strategy": "term_wise",
  "total_change": {
    "baseline_value": 10579943.81,
    "current_value": 9008973.07,
    "delta": -1570970.74,
    "pct_change": -14.85
  },
  "dimension_ranking": [
    { "dimension": "customers.region", "score": 0.650 },
    { "dimension": "products.category", "score": 0.568 }
  ],
  "top_dimension_values": [
    {
      "dimension": "customers.region",
      "value": "west",
      "delta": -1020887,
      "contribution_pct": 65.0,
      "drill_down": { "where_sql": "customers.region = 'west'" }
    },
    {
      "dimension": "products.category",
      "value": "electronics",
      "delta": -891722,
      "contribution_pct": 56.8
    }
  ]
}
```

One call, and you already know revenue dropped 1.57M (−14.8%), that `west` is the most important regional change, and that `electronics` is the most important category change. Each segment can return `drill_down.where_sql`, so the agent reuses the filter to keep exploring instead of reconstructing a `WHERE` clause. The response also carries a `reconciliation` block that checks whether the decomposition adds back up to the total change.

Ratio metrics get a different method. Average order value fell from 105.97 to 98.40 (−7.1%), and Dosi decomposes that into `mix_effect` and `rate_effect` — here `mix_effect` is only −0.02 while `rate_effect` is −7.54, i.e. this was not a shift in segment mix. Electronics AOV fell from 97.08 to 70.30 while its share barely moved, 0.277 → 0.278.

Contrast that with the alternative. An agent *can* write the exploratory SQL itself: totals for both periods, then dimension after dimension, aligning segments that appear or disappear between periods, then computing each segment's contribution. But the more queries it improvises, the easier it is for definitions to drift and for contributions to stop reconciling with the total. Dosi turns that loop into a semantic-layer primitive — which is the argument for [keeping attribution in the engine rather than in a prompt](/blog/dosi-mcp-semantic-layer-for-agents).

## 7. What ten minutes bought you

One design point holds the whole walkthrough together: **the CLI, the API, and MCP are not separate implementations.** The `attribute_metric` tool the agent called and the `dosi attribute` command you ran go through the same semantic engine, and the same is true for `compile_sql` and `run_query`. The CLI is convenient for humans, debugging, and CI; MCP is convenient for agents; REST suits BI and services. Underneath there is one set of metric definitions, one SQL compiler, and one attribution engine.

| What you get | Why it matters |
|---|---|
| **Define metrics once** | CLI, MCP, REST, and Python use the same definitions. Switching agents does not mean re-teaching the metric layer. |
| **Change databases without touching definitions** | One Ossie YAML model compiles to 16 SQL dialects. |
| **Every answer has a source** | You can inspect the generated SQL and the metric definition, so when a number looks wrong you know where to look. |
| **"Why" is computed, not guessed** | Attribution is a deterministic decomposition that reconciles back to the total, not an agent's summary of a few queries. |

## Where to go next

- Official docs: <a href="https://dosi.datus.ai/" rel="nofollow noopener">dosi.datus.ai</a>, the <a href="https://dosi.datus.ai/agents/claude-code/" rel="nofollow noopener">Claude Code walkthrough</a> (also covers Codex and OpenCode), and the <a href="https://dosi.datus.ai/attribution/" rel="nofollow noopener">attribution guide</a>.
- Building semantic models with an agent instead of by hand: <a href="https://datus.ai/" rel="nofollow noopener">datus.ai</a>, and <a href="https://studio.datus.ai/overview" rel="nofollow noopener">Datus Studio</a> for data teams.

## Frequently asked questions

### Do I need a warehouse to try this?

No. Everything above runs against a local DuckDB file, which is why the walkthrough is safe to do on a laptop during a meeting. The default Dosi build embeds DuckDB in-process, so `--execute --db orders.duckdb` needs nothing installed. When you point it at a real warehouse later, only the connection profile changes — the model and the queries stay as they are.

### How is this different from letting Claude write SQL against my database over MCP?

A database MCP server gives the agent tables and lets it guess the rest: which column is revenue, whether to exclude cancelled orders, how to join to `customers`. A semantic MCP server gives it governed metric names and returns SQL compiled from those definitions. The practical difference shows up in consistency — the CLI and the agent produced identical numbers here — and in failure mode: a wrong metric name is a structured error with candidates, not a plausible-looking wrong number.

### Will my attribution numbers match the ones in this article?

The CLI numbers will, because the dataset is generated with `hash()` rather than `random()` and ships as a fixed file. The *agent* narrative will not match word for word — tool-call counts and phrasing vary between runs, which is exactly why the deterministic parts belong in the engine. The `attribute_metric` output for the same windows is stable; the prose around it is not.

### Why does the walkthrough say 16 dialects when the diagram says 13?

Because the connector list grew after the diagram was drawn. The current <a href="https://dosi.datus.ai/connectors/" rel="nofollow noopener">connectors page</a> is the source of truth: 16 dialects with executors, plus Redshift, which compiles to SQL but has no executor yet. Treat any count in a diagram — including ours — as a snapshot.

### Is Dosi open source?

Apache Ossie, the specification, is Apache-2.0 and lives at the ASF. Dosi is source-available under the Elastic License 2.0, not an OSI-approved open-source licence. [Datus Agent](/blog/what-is-data-engineering-agent-2026), the data engineering agent Dosi was built for, is Apache-2.0.

### What is the smallest useful next step after this tutorial?

Point `dosi validate` at a semantic model you already have — a MetricFlow or Cube model converted to Ossie YAML, or one you generated — and fix what it reports before wiring any agent to it. Model errors surface as structured codes at compile time, which is a much cheaper place to find them than in a Monday dashboard review.

## Related articles

- [What Makes a Semantic Layer AI-Native? 6 Requirements](/blog/ai-native-semantic-layer/) — the reasoning behind this tooling
- [Dosi MCP Semantic Layer for Agents — No SQL Guessing](/blog/dosi-mcp-semantic-layer-for-agents/) — semantic MCP versus database MCP
- [Introducing Dosi: OSI-Native Semantic Layer for Metrics](/blog/introducing-dosi/) — surfaces, dialects, and structured errors
- [What Is Open Semantic Interchange (OSI)?](/blog/open-semantic-interchange-osi/) — the spec Dosi compiles
- [MCP for Data Engineering](/blog/mcp-data-engineering/) — how MCP fits the wider data stack
