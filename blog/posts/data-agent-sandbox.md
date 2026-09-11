---
title: "Data Agents Need a Better Sandbox Than a Container"
description: "Read-only data agents answer questions; write agents deliver work. That needs plugins, permission modes, and a sandbox with checkpoint, branch and merge."
author: "Harrison Zhao"
date: 2026-08-22
lastmod: 2026-09-11
head:
  - - meta
    - name: keywords
      content: "data agent sandbox, agentic lakehouse, write agent, permission mode, plugin system, Paimon branch, Iceberg branching, checkpoint validate merge, Flink Kubernetes agent, data engineering agent"
  - - meta
    - property: og:title
      content: "Data Agents Need a Better Sandbox Than a Container"
  - - meta
    - property: og:description
      content: "Read-only data agents answer questions; write agents deliver work. That needs plugins, permission modes, and a sandbox with checkpoint, branch and merge."
  - - meta
    - property: og:type
      content: article
  - - meta
    - property: og:url
      content: https://datus.ai/blog/data-agent-sandbox/
  - - meta
    - property: og:image
      content: https://datus.ai/logo_dark.svg
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - link
    - rel: canonical
      href: https://datus.ai/blog/data-agent-sandbox/
---

# Data Agents Need a Better Sandbox Than a Container

## TL;DR

- **A read-only data agent's ceiling is answering questions. A write agent's ceiling is actually delivering work** — and what is missing in between is no longer just a stronger model.
- Once an agent creates tables, writes jobs and touches Kubernetes, object storage and the warehouse, the artifact stops being an answer and becomes a running system. Most of the failures are cross-system and only show up at runtime.
- **Plugins, not more tools.** A plugin gives the agent a capability with clear inputs and outputs, a permission boundary, a namespace and a structured return — which is what turns a demo script into a reusable engineering asset.
- **A data sandbox is not an E2B container.** A code sandbox isolates processes; a data sandbox has to isolate data state: checkpoint, branch, validate, then merge.
- Lakehouses have branches and fast-forward but essentially no three-way merge. **Branch without merge is the biggest gap between a data sandbox and a code sandbox today**, and it is what will cap how many agents can work in parallel.

In a talk on the agentic lakehouse — originally titled *Driving an Agentic Lakehouse with an Open-Source Data Engineering Agent* — we ran a complete real-time data pipeline with Datus + Flink + Paimon + StarRocks. Having finished it, the thing I find most worth discussing is a more basic question: as data agents move from read-only to write, do we actually dare let them touch data for real?

For the past two years, the most common form of data agent has been ChatBI and NL2SQL. The agent finds the tables, writes the SQL, executes the query, and returns an answer. That scenario still has plenty of accuracy problems, but the engineering risk is relatively contained — most of the time an error is just one wrong answer.

Once an agent starts creating tables, writing jobs, publishing tasks, and operating Kubernetes, object storage and the warehouse, the artifact has gone from being an answer to being a running system. Our judgement has got clearer and clearer: **a read-only agent's ceiling is answering questions; a write agent's ceiling is actually delivering work.**

What is missing between read and write is no longer just a stronger model.

## From one sentence to a running data pipeline

The demo reads real-time US equity candles from the Alpaca WebSocket, writes them through Flink into Paimon, and then queries them from StarRocks. The whole environment runs on Alibaba Cloud, using OSS and ACK underneath.

The input to Datus was basically a paragraph of natural-language requirement. The agent first clarifies the feed, the candle granularity, the version and how to inject the key, then explores the current project, finds there is no Maven project, no connector and no deployment, and builds the project from scratch.

The rest of the flow includes writing a FLIP-27 source, generating a Flink SQL runner, testing locally, building a shaded JAR, uploading it to object storage, deploying the Flink job through the Kubernetes operator, creating the Paimon table, and finally querying from a StarRocks external catalog to verify the data.

If you only look at the generated code, there is nothing magical here. What this task ran into was a lot of problems that only surface at runtime: directory permissions on the init container; a pod showing Running while the Flink job was actually FAILED; Paimon FileIO not finding the Hadoop classes; inconsistent row nullability; dependency conflicts at checkpoint time. And one very typical problem: after rebuilding the JAR and re-uploading it, because it still overwrote the same S3 URI, the manifest did not change and the job was never actually updated — in the end we had to make the artifact URI an immutable version.

Almost all of these problems are cross-system. The agent has to read state all the way through Kubernetes, the Flink operator, the Flink runtime, Paimon and object storage, then locate the fault from the logs, modify, and redeploy. That is exactly where a data engineering agent is genuinely difficult: **code is only part of the context; there is also data, runtime state, and a pile of external systems.**

## Plugins: why the agent could finish the chain

This is also an important part of the demo: the Datus agent has a <a href="https://docs.datus.ai/0.3/plugin/introduction/" rel="nofollow noopener">plugin system</a>.

A data engineering agent faces far too many systems. On one side we use adaptors for native integration with different databases and with the OSI metric system, but outside the database there is Flink, Kubernetes, object storage, the scheduler, BI, the catalog, and every cloud vendor's API. If you only give the agent a shell, then in theory it can do anything, but the tool boundary, the permissions and the outputs are all uncontrollable, and it is very hard to end up with a stable engineering system.

So Datus puts these capabilities into plugins. This demo loaded the Flink, Kubernetes/ACK and S3 plugins. A plugin can wrap basic database operations, and it can equally turn a remote API or a cloud service interface into a local tool the agent can call stably, while making the context, namespace, bucket, permission level and structured return explicit.

![The Plugins page under Integrations in a Datus StarRocks workspace, listing installable plugins — adls, airflow-plugin, aks, aliyun-ack, datus-plugin-demo, eks, emr, emr-serverless, flink — with airflow-plugin, aliyun-ack and flink checked, each showing a version selector and a Configure button](/images/data-agent-sandbox/plugin-selection.png)

*Plugins are installed into a project's agent runtime, and can be changed later.*

When the agent calls Kubernetes, for example, it knows which ACK context and which namespace it should be in, and whether it should be reading pod status or FlinkDeployment status; when it operates object storage, permissions can be restricted to a specified bucket and artifact path. Different subagents can also load different prompts, skills and tool sets per task.

The value here is not just "one more set of MCP". We have used <a href="https://docs.datus.ai/" rel="nofollow noopener">MCP</a> heavily, and it is very good for quickly plugging in external capability; but once you get into a stable data engineering workflow, we would rather converge the commonly used capabilities into plugins with clear inputs and outputs, a permission boundary, and the ability to be tested and reused. Customers can also extend new plugins themselves, wiring in internal scheduling, lineage, catalog or private APIs.

Plugins do one other important thing: they separate "what can be done" from "how it should be done". Underneath, you can still call native CLIs, APIs and database drivers, but what the agent sees is a tidied-up capability: what the input is, what the output is, which environment it is allowed to execute in, and what state to read after a failure. That is what turns a script written on the fly during a demo into an engineering asset a team can reuse for a long time.

That is why I think plugins matter more to a data agent than simply increasing the number of tools. The key to end-to-end work was never whether one particular step can be called. It is whether those calls can work continuously inside the same context, and keep diagnosing and recovering after an error.

Datus does not need to reimplement Flink, Kubernetes or S3. What the agent does is connect these mature systems into a chain that can be executed, diagnosed and accepted.

## Sooner or later we will all press dangerous mode

The more tools there are, the more obvious the permission problem becomes.

Datus has always had several permission modes: `normal` is read-only, `auto` can modify within an authorized scope, and `dangerous` gets higher privileges but is required to stay strictly inside a sandbox.

![The Datus chat interface with the permission mode selector open, offering plan mode plus normal — confirm before every write tool call, auto — writes inside the workspace run automatically while database and MCP tools still confirm, and dangerous — almost all writes execute automatically, with dangerous currently selected](/images/data-agent-sandbox/permission-modes.png)

*Three permission modes, switchable per session or per subagent.*

This design also comes from how my own use of coding agents changed. When I first used Claude Code I did not dare turn on auto edit — it changed a section and I reviewed a section. Later I slowly started using auto edit, and later still I would just turn on `--dangerously-skip-permissions` (now auto mode).

The reason is simple. People do not have enough attention to spend all of it clicking confirm. If the agent has to ask every time it runs a `mkdir`, changes a file or runs a command, the time you save may well be less than the time you lose being interrupted.

So the safety boundary for future agents cannot be built on "the human will carefully confirm every step". Which environments can be operated on, which namespaces can be entered, which tables can be read, which actions must be confirmed, which results must pass validation — all of that should be written into the profile, the skills and the permission policy up front.

Human attention should be concentrated on the plan at the start of a task, and on acceptance and merge at the end.

At the beginning, get the goal, the constraints and the acceptance criteria clear; in the middle, the agent explores, develops, deploys and diagnoses by itself; at the end, the human looks at the result, the diff and the validation, and decides whether to merge into production. For genuinely long-horizon tasks I think this fits how people work far better than popping confirmations continuously.

![A Datus mission board thread on a demo board: the agent shows the SQL it ran against jeff_shop_live.raw_orders, then the orchestrator reports that re-checking against the live source confirmed the earlier finding rather than changing it — same 640 orders and GMV, same store distribution — and notes nothing is finalized until the human accepts the answer, while the mission state moves from Clarifying to Todo to Running](/images/data-agent-sandbox/mission-board-sandbox.png)

*The agent re-checks its own finding and states what it did; the mission advances on its own, but nothing is final until a human accepts it.*

For tasks running ten minutes or longer, we now also keep the plan/todo and the execution state of every step. A human can interrupt partway through and add constraints, but does not have to watch the screen the whole time. What really needs reviewing at the end is which changes the agent made, what the validation results were, and whether this change should go into the trunk.

But that immediately runs into the next question: what does "rollbackable" actually mean?

## A data sandbox is not an E2B container

When agent products talk about a sandbox today, the first thing people think of is an isolated container, for instance E2B. That is reasonable for a coding agent: a code sandbox isolates processes and the filesystem, you can destroy the environment if you break it, the code is still in Git, and a failed experiment is one `checkout` away.

A data agent is dealing with data state.

Data a Flink job has already written does not disappear because the agent's container was deleted. A committed Paimon snapshot, an overwritten partition, a metric definition that has already affected a downstream dashboard — none of those belongs to the container's lifecycle.

A code sandbox cares about not breaking the host. A data sandbox also has to guarantee you do not break the data and the definitions. **Giving an agent a Linux container only provides a safe place to execute shell; it has not yet given it a data environment where it can safely make mistakes.**

This is also where I think the lakehouse gets interesting in the age of agents. We used to talk about snapshot, time travel, checkpoint and branch mainly to solve recovery, audit and concurrent writes. Once large numbers of agents are modifying data automatically, those capabilities turn directly into the agent's execution primitives.

## Checkpoint → Branch → Validate → Merge

If you compare the ideal data sandbox to Git, I think it needs at least four steps: **checkpoint → branch → validate → merge.**

Checkpoint fixes a data state you can return to — for a streaming job that might be a savepoint, for a lake table a snapshot. Branch lets the agent change schemas, rerun jobs and change processing logic in an independent space without affecting the trunk. Validate then has to check row counts, primary key uniqueness, data quality, metric definitions and end-to-end latency — a job being RUNNING does not by itself mean the task is done. Finally, once everything passes acceptance, merge; if it fails, throw the whole branch away.

That already looks a lot like how a coding agent works on Git: open a branch, modify, run the tests, open a pull request.

The problem is that the data world is nowhere near as mature as Git. Plenty of lakehouses today (<a href="https://iceberg.apache.org/docs/latest/branching/" rel="nofollow noopener">Iceberg</a> / <a href="https://paimon.apache.org/docs/master/maintenance/manage-branches/" rel="nofollow noopener">Paimon</a>) have snapshot, tag and branch, but the most critical piece — three-way merge — is still very weak. Which is to say you can fast-forward when there is no conflict, but in a real scenario a conflict is not easy to resolve automatically.

Most systems hitting that problem today still end up choosing at whole-table or whole-partition granularity; anything more complex has to be executed serially or adjudicated by a human. In the Datus mission board we can only use a project-level optimistic lock to reduce the chance of a conflict for now.

So one thing we feel at the moment is: **having branch but not merge is one of the biggest gaps between today's data sandbox and a code sandbox.**

If a one-person-plus-agent-team future really does arrive, with one engineer having several agents develop different pipelines at once, the ceiling on agents working in parallel will ultimately be set by the concurrent-modification and merge capability of the underlying data system.

## Lakehouses need to start designing primitives for agents

Lakehouse competition used to be mostly about real-time writes, query performance, open formats, compaction, CDC and multi-engine interoperability. Agents bring a new set of requirements.

Future systems may hold large numbers of temporary jobs, experimental tables and parallel modifications at any moment. In that world snapshot is only the first step: branch, clone, time travel, materialized views, validation and merge all gradually become basic capabilities.

Ideally, once an agent picks up a task it automatically creates an independent data branch, generates and executes jobs on it, materializes new tables or views, runs validation, and finally hands the diff and an acceptance report to a human. Human attention only goes on confirming the plan at the very start and confirming the merge at the very end.

If a [lakehouse](/blog/what-is-lakehouse/) can provide that environment, then people really might leave dangerous mode on permanently. Because what we are relying on is no longer the model never making a mistake, but the mistake being isolatable, discoverable and reversible once it happens.

## The last layer is still semantic context

Even if all of the sandbox problems above were solved: if Flink has one definition of revenue, StarRocks another, and the BI dashboard a third hand-written copy, then the agent will only produce new silos faster.

We are building **Dosi**, a native execution engine for OSI, in the hope that the same semantic model and metric definitions can compile to different data engines. For the user, or for an agent above, the only thing that should matter is "what revenue is" — not whether the metric comes from the real-time or the batch pipeline.

I have always thought there are two especially important kinds of openness in AI-era data infrastructure: an open data and execution environment underneath, and an open [semantic context](/blog/why-ai-agents-need-semantic-context-to-work-reliably/) on top. Otherwise, however clever the agent is, it is only making the system complicated more efficiently.

## Conclusion

If you only look at the demo, it is a real-time lakehouse pipeline from Alpaca WebSocket → Flink → Paimon → StarRocks. But the thing genuinely worth taking away is something else.

Data agents are moving from read-only to write.

Once you get to write, the focus shifts quickly from "can the model generate correct code" to plugins, permissions, validation, runtime context and the sandbox.

And a data sandbox cannot stop at an E2B container. A code sandbox isolates processes; a real data sandbox has to isolate data state, needs checkpoint, branch and validate, and ultimately needs a good enough merge.

Models will certainly keep getting stronger. I am no longer particularly worried about whether an agent can write Flink, SQL or Kubernetes YAML. What I care about more is, once they really do start doing the work for us:

**Can we give them a world where they are allowed to make mistakes?**

That may be the most important piece of infrastructure in an agentic lakehouse.

## Frequently asked questions

### Why isn't an E2B-style container enough for a data agent?

Because a container isolates processes and the filesystem, not data state. Data a Flink job already wrote does not disappear when the agent's container is deleted; a committed Paimon snapshot, an overwritten partition, and a metric definition that has already changed a downstream dashboard all outlive the container. A code sandbox's job is not breaking the host. A data sandbox's job is not breaking the data and the definitions — which needs a checkpoint you can return to, an isolated branch to work on, validation that actually checks the output, and a merge.

### What does a data sandbox need beyond snapshots?

Four primitives, in order. **Checkpoint** fixes a state you can return to — a savepoint for a streaming job, a snapshot for a lake table. **Branch** gives the agent an independent space to change schemas, rerun jobs and alter logic without touching the trunk. **Validate** checks row counts, primary key uniqueness, data quality, metric definitions and end-to-end latency, because a job being RUNNING does not mean the task is done. **Merge** promotes the branch once it passes, and throws it away if it does not.

### Why is merge the hard part for lakehouse branching?

Because branching exists and merging essentially does not. Iceberg and Paimon both offer snapshots, tags and branches, and both can fast-forward a branch when there is no conflict — Paimon's documented operation set is create, delete, read/write on a branch, fast-forward and fallback-branch reads, with no merge. Once there is a real conflict, most systems fall back to whole-table or whole-partition choices, serial execution, or a human adjudicating. That ceiling is what will limit how many agents can safely develop pipelines in parallel.

### How should permissions work if nobody wants to confirm every step?

By writing the boundary down in advance instead of relying on attention. Datus uses three modes — `normal` read-only, `auto` modifying within an authorized scope, and `dangerous` with higher privileges but required to stay inside a sandbox — combined with a profile, skills and a permission policy that state which environments, namespaces and tables are in scope, which actions need confirmation, and which results must pass validation. The human then spends attention on the plan at the start and the diff, validation and merge at the end.

### Do plugins replace MCP?

No — they solve a different problem. MCP is very good for quickly plugging in external capability, and we have used it heavily. A plugin is what you converge a commonly used capability into once it belongs in a stable workflow: explicit inputs and outputs, a permission level, a namespace and bucket, a structured return, and something that can be tested and reused. The point is separating "what can be done" from "how it should be done", so a script written during a demo becomes an asset a team keeps.

## Related articles

- [What is a lakehouse?](/blog/what-is-lakehouse/) — the table formats that would have to provide these primitives
- [What is Apache Iceberg?](/blog/what-is-apache-iceberg/) — snapshots, branching and time travel in the format itself
- [MCP and data engineering](/blog/mcp-data-engineering/) — where a protocol ends and a plugin boundary starts
- [Make data agents usable: ask, explore, and control with confidence](/blog/make-data-agents-truly-usable-ask-explore-and-control-with-confidence/) — the control side of the same argument
- [What an enterprise data engineering agent actually needs](/blog/enterprise-data-engineering-agent/) — permissions, validation and audit in production
