---
title: "How to Build Your First Data Engineering Agent in 15 Minutes"
description: "Build a first data engineering agent with Datus: install, ask questions, generate context, and create a subagent."
author: "John Smith"
date: 2026-06-03
lastmod: 2026-06-03
head:
  - - meta
    - name: keywords
      content: "how to build a data engineering agent, build your first data engineering agent, data engineering agent tutorial, data engineering agent quickstart, data engineering agent setup, data engineering agent CLI, data engineering workflow"
  - - meta
    - property: og:title
      content: "How to Build Your First Data Engineering Agent in 15 Minutes"
  - - meta
    - property: og:description
      content: "Build a first data engineering agent with Datus: install, ask questions, generate context, and create a subagent."
  - - meta
    - property: og:type
      content: article
  - - meta
    - property: og:url
      content: https://datus.ai/blog/posts/build-your-first-data-engineering-agent
  - - meta
    - property: og:image
      content: https://datus.ai/logo_dark.svg
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - link
    - rel: canonical
      href: https://datus.ai/blog/posts/build-your-first-data-engineering-agent
---
# How to Build Your First Data Engineering Agent in 15 Minutes

You do not need a procurement approval. You do not need a cloud budget. You do not need to know how LLMs work. You need a terminal, Python 3.12 or later, and roughly 15 minutes if your environment is ready. By the end of this guide, you will have a working <a href="https://datus.ai/glossary">data engineering agent</a> connected to a real database, a generated semantic model, and a scoped chatbot you can share with a teammate.

We will use Datus for this tutorial because it is free (Apache 2.0), installs with a single pip command, and ships with a built-in tutorial dataset so you do not need to connect a production warehouse to try it. If you want to understand what a data engineering agent is before building one, start with [what is a data engineering agent](/blog/what-is-data-engineering-agent-2026/).

## TL;DR

You will do seven things in this tutorial:
1. Install Datus (`pip install datus-agent`)
2. Start a session and load the built-in California Schools dataset
3. Ask your first natural-language question
4. Browse the context the agent automatically builds
5. Generate a semantic model from your database schema
6. Create a subagent—a scoped chatbot for a specific domain
7. Share the subagent link with a teammate

## Step 1: Install Datus

Open your terminal and run:

```bash
pip install datus-agent
```

Requirements: Python 3.12 or later, macOS or Linux. Windows may work but is not officially tested. The install takes under a minute on a typical connection.

Verify the installation:

```bash
datus-agent --version
```

You should see a version number (v0.2.6 or later). If you see a command-not-found error, make sure your Python bin directory is on your PATH.

## Step 2: Start a session and load the tutorial dataset

Datus ships with a built-in California Schools dataset—a small PostgreSQL-compatible database with school performance metrics. This lets you try the agent without connecting to a real warehouse.

Start a new Datus session:

```bash
datus-agent
```

You will enter the Datus CLI. Load the tutorial dataset:

```
.load california_schools
```

The agent will initialize the database, inspect its schema, and begin building context. You will see output indicating it has discovered tables, columns, and relationships. This takes about 30 seconds on first load.

## Step 3: Ask your first question

With the dataset loaded, ask a natural-language question:

```
Show me schools with above-average math scores, grouped by county
```

The agent will:

1. **Retrieve context** — it looks up the California Schools schema in its context store, finds relevant tables (`schools`, `scores`), and identifies which columns represent math scores and counties.
2. **Generate SQL** — it composes a query that calculates the average math score, filters schools above that average, and groups by county.
3. **Execute the query** — it runs the SQL against the local database.
4. **Return results** — you see a table of counties and their above-average schools.

Try a follow-up:

```
Now add the percentage of economically disadvantaged students for each
```

The agent extends the previous query—adding a join to the demographic data table and including the new column—without you needing to specify table names or join keys. That is the Context Engine at work: it already knows the schema from the first question, so the second question is cheaper.

## Step 4: Browse the context the agent is building

Behind the scenes, every query you ask is building context. You can inspect it. Try these commands:

**Browse the physical catalog:**

```
@catalog
```

This shows you the database structure the agent has learned: databases → schemas → tables → columns. It is a tree view of your data's physical layout, annotated with any semantic models the agent has generated.

**Browse the logical subject tree:**

```
@subject
```

This shows you the business-domain view: topics the agent has inferred, metrics it has identified, and reference SQL it has captured from your queries. This is the [contextual data engineering](/blog/contextual-data-engineering/) layer—the institutional memory that makes the next query more accurate than the first.

**Explore a specific table:**

```
@table schools
```

This shows you the columns, types, and any annotations for the `schools` table—including generated semantic information about which columns are likely dimensions vs. measures.

Each of these commands is not just a viewer—it is a navigation interface into the context the agent is accumulating. The more you use it, the richer the context becomes.

## Step 5: Generate a semantic model

The agent can automatically generate a semantic model from your schema—identifying which columns are measures (quantities you aggregate), which are dimensions (attributes you group by), and how tables relate to each other.

Run:

```
/gen_semantic_model
```

The agent will scan the California Schools schema and produce a semantic model in MetricFlow-compatible YAML format. It identifies, for example, that `math_score` in the `scores` table is a measure, that `county_name` in the `schools` table is a dimension, and that the two tables join on `school_id`.

You can edit this model—add business definitions, correct wrong inferences, mark deprecated columns—and the corrections will feed back into the context engine, making future queries more accurate.

For a deeper understanding of semantic models and how they relate to agent accuracy, see [what is a semantic layer](/blog/what-is-semantic-layer/).

## Step 6: Create a subagent

A subagent is a scoped chatbot that packages a subset of context for a specific domain. Instead of giving a teammate access to the entire California Schools database, you give them a subagent that only knows about the schools domain—roughly 10 tables, 20 metrics, and 30 validated SQL references.

Create one:

```
.subagent add
```

You will be prompted for:
- **Name:** Give it a descriptive name like "California Schools Analyst"
- **Scope:** Select which tables and metrics to include. For this tutorial, include the `schools`, `scores`, and `demographics` tables.
- **Description:** Write a short description so users know what the subagent can do: "Answers questions about California school performance, test scores, and student demographics."

The agent packages the scoped context and generates a shareable link. Anyone with the link can open the subagent in Datus Chat and ask natural-language questions—limited to the scope you defined. They cannot access tables outside the scope, and their queries are grounded in the same context the agent has built.

```bash
.subagent list
```

This shows all your subagents and their status. You will see your newly created "California Schools Analyst" listed with its scope summary and share link.

## Step 7: Share with a teammate

Copy the subagent link and send it to a teammate. They open it, type a question—"Compare average SAT scores across counties with more than 5 schools"—and the subagent generates and executes the query, grounded in the context you curated.

This is the delivery model that separates a <a href="https://datus.ai/glossary">data engineering agent</a> from a personal SQL copilot. You are not just writing queries faster. You are packaging your team's data knowledge into a reusable, shareable, evolvable system. Next week, when someone asks a slightly different question, the subagent already knows the schema, the metrics, and the business rules. It does not start from zero.

## What you just built

In 15 minutes, you:

- Installed a data engineering agent
- Connected it to a real database
- Asked natural-language questions and got correct SQL results
- Browsed the context the agent automatically built from your schema and queries
- Generated a semantic model that maps physical tables to business concepts
- Created a scoped, shareable subagent for a specific domain
- Shared it with a teammate—turning your data knowledge into a reusable system

This is not only a demo workflow. It is the daily loop of a data engineer using Datus: explore, generate context, scope a domain, deliver a subagent, collect feedback, and improve the context. The first cycle is intentionally small; later cycles get faster because the context has been compounding the whole time.

## What your daily workflow looks like

Once you are past the tutorial, here is what a typical morning with Datus looks like—using a production warehouse instead of the California Schools dataset.

### 9:00 AM: Start the session

```bash
datus-agent
```

The agent loads, connects to your configured databases (Snowflake for production, Postgres for staging, DuckDB for local analysis), and surfaces the accumulated context: schemas it has inspected, semantic models it has generated, and subagents it has deployed.

### 9:05 AM: Review overnight changes

```
@catalog
```

The catalog tree shows schemas the agent has been tracking. A new table appeared in staging overnight—the product team added an `experiment_assignments` table for A/B test tracking. The agent discovered it during its scheduled schema refresh and flagged it for review.

### 9:10 AM: Inspect the new table

```
@table experiment_assignments
```

The agent displays column types, row counts, sample values, and inferred semantics—`experiment_id` looks like a foreign key to `experiments`, `user_id` is a dimension, `variant` is a categorical column with three distinct values.

### 9:15 AM: Generate a semantic model

```
/gen_semantic_model experiment_assignments
```

The agent produces a MetricFlow-compatible YAML model, defining dimensions, measures, and suggested joins. The engineer reviews, corrects one column type, and accepts.

### 9:20 AM: Extract metrics from historical SQL

```
/gen_metrics --domain experiments
```

The agent scans accumulated historical SQL and surfaces candidate metrics: `experiment_assignment_count`, `unique_users_per_experiment`, `variant_distribution`. The engineer selects the relevant ones and promotes them to the context store.

### 9:30 AM: Create a subagent

```
.subagent add
```

A subagent called "Product Experiments" is created—scoped to `experiments`, `experiment_assignments`, and `users`. The engineer adds a standing rule: "Experiment results are preliminary until `status = 'concluded'`." The subagent link goes to the product team on Slack.

### 9:35 AM: Morning routine complete

In one compact workflow: a new table discovered, a semantic model generated, metrics extracted from historical patterns, a scoped subagent delivered. The context generated this morning is available tomorrow—and the day after.

### Key commands at a glance

| Command | What it does | When you use it |
|---|---|---|
| `@catalog` | Browse the physical schema tree | Exploring new data, verifying schema changes |
| `@subject` | Browse the logical subject tree | Navigating by business domain |
| `@table <name>` | Inspect a table with types, samples, and inferred semantics | Triaging a data request |
| `@metrics` | View generated and curated metrics | Validating definitions before sharing |
| `@sql_history` | Search accumulated validated SQL | Finding proven query patterns to adapt |
| `/gen_semantic_model` | Generate a MetricFlow-compatible model from schema | Bootstrapping context for a new data source |
| `/gen_metrics` | Extract candidate metrics from historical SQL | Surfacing metrics the team already uses |
| `.subagent add` | Create a scoped, shareable chatbot | Delivering self-service to a business team |
| `.subagent list` | List deployed subagents | Managing your subagent portfolio |

### CLI vs. GUI: when each makes sense

The CLI is where engineers build and maintain the system. The chat interface is where analysts and business users consume it. A principled division:

**CLI** for schema exploration, metric generation, context curation, subagent configuration, scripts, and automation. **GUI** (chat, dashboard, web) for analyst self-service, business user exploration, and collaborative metric review.

The same context engine powers both. The CLI is your cockpit; the subagent chat is what you hand to the business.

## Next steps

- **Connect your real warehouse:** Run `datus-agent configure` and add your Snowflake, BigQuery, or Postgres credentials. The agent will inspect your actual schemas and begin building context from your real data environment.
- **Bootstrap from historical SQL:** Run `datus-agent bootstrap-kb /path/to/sql/files` to seed the Context Engine with your team's existing query patterns. The agent will learn which tables, joins, and metrics your team actually uses—not just what the schema says.
- **Set up feedback collection:** Share your subagent link with analysts and encourage them to upvote correct answers and report issues. Every feedback signal makes the context stronger.
- **Read the deep dives:** [Contextual data engineering](/blog/contextual-data-engineering/) for the theory behind the Context Engine, [best data engineering agents 2026](/blog/best-data-engineering-agents-2026/) for the full landscape, and [open source data engineering agents](/blog/open-source-data-engineering-agents/) for the case for self-hosting.

Try <a href="https://studio.datus.ai/overview" rel="nofollow noopener">Datus Studio</a> for a zero-install version of everything in this tutorial—connect a warehouse, ask questions, and watch context build in your browser.

## Frequently asked questions

### Do I need to know SQL to use a data engineering agent?

No. You need to know what question you want to answer. The agent translates your natural-language question into SQL, executes it, and returns results. That said, being able to read SQL helps you verify the agent's output and understand edge cases. Most teams have at least one SQL-literate person reviewing agent-generated queries before they go into production.

### Is the built-in dataset enough to evaluate whether an agent will work for my team?

The California Schools dataset is representative—it has multiple tables, joins, numeric measures, and categorical dimensions, similar to a real business database. It is enough to evaluate the agent's core capabilities: schema understanding, query generation, context accumulation, and subagent creation. To evaluate whether the agent works with your specific warehouse and data scale, you will need to connect it to a non-production copy of your actual database.

### How does the agent handle corrections when it generates wrong SQL?

When you receive an incorrect result in Datus Chat, you can file an issue report describing what was wrong. The correction flows back into the Context Engine: the agent notes which join path, filter condition, or metric definition produced the error, and it adjusts future queries to avoid the same mistake. Over time, the agent's accuracy improves—not because the underlying LLM changed, but because the context it operates on accumulated corrections. This is the feedback loop central to [contextual data engineering](/blog/contextual-data-engineering/).

### Can I run this on my company's data without sending anything to a third party?

Yes. Datus is self-hosted (Apache 2.0). When you run `datus-agent` locally, all data—your queries, your schemas, the agent's context—stays on your machine. When you use Datus Studio (the browser version), your queries are sent to Datus's cloud for processing. For teams with strict data residency requirements, self-hosting the open-source version is the recommended path. See [open source data engineering agents](/blog/open-source-data-engineering-agents/) for more on the self-hosting tradeoff.

## Related articles

- [What is a data engineering agent?](/blog/what-is-data-engineering-agent-2026/) — the category definition and how agents differ from copilots
- [Contextual data engineering](/blog/contextual-data-engineering/) — the three-layer context model behind the agent you just built
- [Open source data engineering agents](/blog/open-source-data-engineering-agents/) — why self-hosting matters for data infrastructure
