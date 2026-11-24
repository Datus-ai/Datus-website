---
title: "Semantic Layer Requirements: A Real Running Data Example"
description: "Semantic layer requirements explained through a real running-data project: metric definitions, architecture, SQL checks, and a practical validation checklist."
author: "Joanna He"
date: "2026-11-24"
lastmod: "2026-11-24"
heroImage: "/images/semantic-layer-requirements/cover-generated.jpg"
heroImageAlt: "A runner on a lavender track connects wearable observations to a semantic model and checked analytics"
head:
  - - meta
    - name: keywords
      content: "semantic layer requirements, semantic layer architecture, how to build a semantic layer, semantic layer validation, metric contract"
  - - link
    - rel: canonical
      href: https://datus.ai/blog/semantic-layer-requirements/
---

# Semantic Layer Requirements: A Real Running Data Example

## TL;DR

A semantic layer needs explicit metric definitions, source mappings and repeatable validation. This running-data example shows how to define pace, trace its inputs and check the result independently.

## A running question worth answering

I wanted an AI running coach. First, I needed to trust its numbers.

After running a 10K in Wuxi in 1:00:51, I started thinking about a half marathon the following spring. My watch already held plenty of data: distance, pace, heart rate, training load, sleep, and recovery estimates. What I wanted was an answer to a more useful question:

“How has my running been going—and how should I train next week?”

An agent could produce a convincing answer almost immediately. But before using that answer to shape my training, I wanted to understand the calculations underneath it. Which activities counted as running? Was average pace calculated consistently? Did a week with no sleep readings mean poor sleep, or simply missing data?

Building the [semantic layer](/blog/what-is-semantic-layer/) for my <a href="https://github.com/joannahe/AI-Runner-Tracker" rel="nofollow noopener">AI Runner Tracker project</a> made those questions concrete. This article follows that process: deciding what the metrics mean, mapping them to watch records, making them queryable, and checking whether the results are right.

## What are the requirements for a semantic layer?

**A usable semantic layer needs agreed metric definitions, explicit mappings to source data, declared grains and relationships, correct aggregation and time handling, a query interface that consumers use, and repeatable validation.** Ownership, versioning, and access controls keep those definitions useful beyond the first successful query.

In my project, the test was practical: could I ask about a different week and get the same calculation applied to the right records? Could I inspect why the result changed? Could the agent use that result without confusing a device estimate with an observed measurement?

The running example is personal, but the requirements transfer directly to business analytics:

<div class="table-wrap"><table><thead><tr><th>Running question</th><th>Business equivalent</th><th>Shared requirement</th></tr></thead><tbody><tr><td>How should weekly pace be calculated?</td><td>How should a period conversion rate be calculated?</td><td>Use the appropriate totals, rather than averaging ratios blindly.</td></tr><tr><td>Are sessions the same as running days?</td><td>Are orders the same as distinct customers?</td><td>Declare the counting grain.</td></tr><tr><td>Does missing sleep mean zero sleep?</td><td>Does missing observation mean zero activity?</td><td>Keep missing evidence distinct from an observed zero.</td></tr><tr><td>Which training-plan version applies?</td><td>Which pricing or policy version applies?</td><td>Keep definitions and effective scope identifiable.</td></tr></tbody></table></div>

## Start with the questions the runner actually asks

I did not start by trying to model every field on my watch. I started with questions I wanted answered:

- How much have I been running, and how consistently?
- Is my pace improving?
- How has my recovery been recently?
- Does next week’s training plan still make sense?

Each question introduces decisions that need to be made before writing a formula.

For weekly distance, do I mean independent runs only, or also the running portions of HYROX? If the same workout appears in multiple sources, how do I avoid counting it twice? Are running sessions and running days separate measures?

For pace, am I looking at official race pace, watch-recorded pace, or a weighted average across eligible running observations? Those numbers describe different things.

For recovery, a watch’s recovery estimate, nightly sleep duration, resting heart rate, and training-load ratio are separate observations. Combining them into one unnamed “recovery score” would hide the distinctions I wanted the agent to understand.

I organized these decisions in a metric dictionary and running-knowledge documents before building the model. That gave the agent context for the definitions it proposed—and gave me something against which to review them.

### The first deliverable is a metric contract

For every metric, write down its meaning, unit, eligible records, date convention, aggregation, and missing-value behavior. Assign someone to own that definition, even if that person is you.

In this project, measured pace has a particularly useful contract: seconds per kilometer, calculated from corresponding measured distance and timing, with a null result for a zero denominator. It is not the arithmetic mean of individual run paces.

A definition like this is specific enough to test. “Average pace shows how fast I run” is not.

<figure><a href="/images/semantic-layer-requirements/metric-contract-preview-en.png" target="_blank" rel="noopener"><img src="/images/semantic-layer-requirements/metric-contract-preview-en.png" alt="Actual running model inspector showing measured pace definition, DuckDB expression, dataset and source columns" loading="lazy" decoding="async" style="max-width:558px;margin-inline:auto"></a><figcaption>The actual AI Runner Tracker model inspector: measured pace has a named definition, an executable expression and identifiable source columns. Eligibility and time-window rules still need their own checks.</figcaption></figure>

## Map each metric to records at the right grain

Watch data does not arrive as one tidy table containing every answer. An activity, a lap, a daily sleep observation, and a versioned training plan have different grains.

The local project separates source activities, workout events, running observations, daily health and load records, and planning records. That separation matters because the same date can contain several activities but only one relevant daily resting-heart-rate observation.

If I join daily resting heart rate directly to every run and then average the joined rows, days with more runs can receive more weight. The query may execute perfectly while answering the wrong question.

For every dataset, identify what one row represents, its key, how duplicates are handled, and which relationships are valid. Test the underlying records rather than assuming a declared key guarantees uniqueness.

<div class="table-wrap"><table><tr><th>Question</th><th>Relevant model or records</th><th>Mapping decision to verify</th></tr><tr><td>How far did I run?</td><td>Running observations; v_running_observation</td><td>Eligible running records, distance units, and duplicate handling</td></tr><tr><td>How fast did I run?</td><td>measured_pace_s_per_km</td><td>Corresponding timing and measured-distance fields</td></tr><tr><td>How many times did I run?</td><td>Sessions and activity dates</td><td>Sessions and distinct training days must remain separate</td></tr><tr><td>How did I sleep?</td><td>Daily sleep observations</td><td>Main sleep versus naps; minutes in storage versus hours in display</td></tr><tr><td>How was recovery?</td><td>Daily resting HR, HRV, training load, and recovery observations</td><td>Keep each observation’s grain, source, and coverage explicit</td></tr><tr><td>What was planned?</td><td>action_plan and planned_action</td><td>Athlete, plan, and version must identify the intended schedule</td></tr></table></div>

<figure><a href="/images/semantic-layer-requirements/running-semantic-model-overview.svg" target="_blank" rel="noopener"><img src="/images/semantic-layer-requirements/running-semantic-model-overview.svg" alt="Running semantic model overview showing running observations and daily health records mapped to reusable metrics" loading="lazy" decoding="async"></a><figcaption>Selected paths in the real running model. Sessions, distinct days, pace and daily health observations have different meanings and grains.</figcaption></figure>

A model should make these decisions inspectable. Otherwise, the same business question can quietly acquire a different meaning when another consumer chooses a different join.

## Put the calculation in the model, not just the explanation

Datus Studio was the workspace where the agent and I built and inspected the semantic model. The visual view helped me understand the relationships, but the definitions also existed as YAML that I could read, edit, and version.



Here is an excerpt from the local running model. It is a metric fragment, not a complete standalone model:

```yaml
- name: measured_pace_s_per_km
  description: 'Measured pace: 1000 × total pace time / total measured pace distance.'
  ai_context:
    instructions: Include positive measured distances with consistent timing;
      never average segment paces directly. Return null for a zero denominator.
  expression:
    dialects:
    - dialect: DUCKDB
      expression: 1000.0 * SUM(running_observation.pace_time_s) /
        NULLIF(SUM(running_observation.pace_distance_m), 0)
```

The expression sums the eligible timing and distance, then calculates their ratio. Multiplying by 1,000 converts seconds per meter into seconds per kilometer.

That distinction becomes important when runs have different lengths. A short run and a long run should not receive equal weight merely because each is one record. The same ratio-of-sums principle applies when the question changes from one week to a month.

The `ai_context` explains intended usage to the agent. It does not replace executable filtering. The dataset and query conditions still need to select valid, corresponding observations. An acceptance test should verify that they do.

This is one of the most useful semantic layer requirements: the definition must be precise enough to execute, while its accompanying context explains how to use the result correctly.

### A small example you can check by hand

Suppose one run covers 2 km in 10 minutes and another covers 8 km in 48 minutes. Their individual paces are 5:00 and 6:00 per kilometer. Averaging those two paces gives 5:30/km; dividing the combined 58 minutes by 10 km gives **5:48/km**. These are illustrative records, not my personal workout history.

```sql
-- Synthetic example: these are not my recorded runs.
WITH observations(pace_time_s, pace_distance_m) AS (
  VALUES (600.0, 2000.0), (2880.0, 8000.0), (NULL, 1000.0)
), eligible AS (
  SELECT * FROM observations
  WHERE pace_time_s IS NOT NULL AND pace_time_s > 0
    AND pace_distance_m IS NOT NULL AND pace_distance_m > 0
)
SELECT
  AVG(1000.0 * pace_time_s / pace_distance_m) AS mean_of_run_paces,
  1000.0 * SUM(pace_time_s)
    / NULLIF(SUM(pace_distance_m), 0) AS period_pace_s_per_km
FROM eligible;
```

The expected outputs are `330` and `348` seconds/km. The latter is the period pace defined here. The incomplete record is excluded from both totals, so its distance cannot lower the result without matching time. [Download the self-contained SQL example](/images/semantic-layer-requirements/pace-check.sql).

This small check explains the formula; it does not validate the entire running model. In the real model, inspect the source view and query conditions as well. DuckDB documents how <a href="https://duckdb.org/docs/stable/sql/functions/aggregates.html" rel="nofollow noopener">aggregate functions handle null values</a>.

## Make the time window and data coverage part of the request

“Recently” is convenient language for a runner. It is not a complete query specification.

When reviewing a result, I want to know which dates it covers, which athlete it describes, what source supplied the records, and whether the period is complete.

Weekly questions also need a timezone and a first day of the week. Keep those conventions the same in the semantic request and the reference query.

A partial current week should not silently be compared with a complete previous week. Missing sleep days should not become zero minutes. A single device recovery estimate should not appear as a daily historical trend.

Rolling baselines need particular care. If a rule compares today’s resting heart rate with the preceding seven days, today must not be included in its own baseline. The query also needs the number of valid observations; a baseline from one available day is different from one based on seven.

A daily training-load threshold should use the relevant daily value. A monthly average can hide individual days that crossed it. In the running model, the COROS load ratio also needs to retain its identity as a provider-supplied measure rather than being silently replaced by a different homemade ratio.

These are query requirements as much as interpretation requirements. Date boundaries, observation counts, and coverage belong in the evidence behind an answer.

## Make sure the agent, dashboard, and report use the definition

A saved model becomes useful when something actually queries it.

The semantic layer architecture separates three jobs: the warehouse stores observations, the model defines calculations, and DOSI turns metric requests into database queries.

<figure><a href="/images/semantic-layer-requirements/running-semantic-architecture.svg" target="_blank" rel="noopener"><img src="/images/semantic-layer-requirements/running-semantic-architecture.svg" alt="Running-data architecture: watch records enter a warehouse, reviewed definitions inform DOSI, and agents or reports request results" loading="lazy" decoding="async"></a><figcaption>Conceptual architecture of this project. Knowledge informs definitions; it does not replace recorded measurements. Each consumer still needs its actual query path checked.</figcaption></figure>

Running knowledge informs model construction and interpretation. Datus Studio provides the workspace for building and inspecting the model and working with the agent. DOSI provides the semantic query path between model definitions and executable database queries.

My personal warehouse used StarRocks; the project materials also include a local DuckDB version. The measured-pace excerpt above comes from the local DuckDB model. Those are separate execution contexts, so their results should only be compared after aligning data and query conditions.

A practical requirement for any consumer is that it should reuse the governed definition or have its equivalent implementation explicitly tested. Do not assume a dashboard uses the semantic layer just because it appears beside the model in a product interface. Inspect its actual query or calculation path.

For a weekly running review, record the metric, athlete filter, date window, grouping, model version, and generated query. A report and an agent should not produce different definitions of “weekly pace” simply because they present the result differently.

## Validate the model in layers

There are several different meanings of “it works.” I found it helpful to keep them separate.

### Structural validation

Can the model be parsed? Do its references resolve? Can the relevant queries compile?

The local DOSI plugin’s validate-on-edit hook invokes validation and checks both reported issues and compile errors. This is useful feedback while editing. It does not establish whether the metric matches the training question I intended to ask.

A syntactically valid formula can still average the wrong records. The <a href="https://docs.datus.ai/dev/subagent/semantic_modeling/" rel="nofollow noopener">Datus semantic-modeling documentation</a> makes the same distinction: structural validation and compilation do not execute a business query. Numerical checks need a separate execution and comparison.

### Record and relationship validation

Check duplicate source activities, unique identifiers, orphan relationships, and unintended multiplication of rows. Verify that a plan revision points to the intended goal version and that daily observations keep their intended weight when analyzed alongside activities.

The project’s DuckDB verification script contains explicit expected values for synthetic records, duplicate handling, goal-version relationships, and missing-evidence cases. It also includes a path that obtains DOSI-generated SQL and executes it in DuckDB. I inspected this code for the article; the existence of a test is distinct from a fresh successful run.

### Calculation validation

Use small cases that make mistakes obvious. A good acceptance suite for this running model would include the following cases:

<div class="table-wrap"><table><tr><th>Case</th><th>Expected behavior</th></tr><tr><td>The same workout appears twice in source records</td><td>The running total does not double</td></tr><tr><td>A short run and a long run have different paces</td><td>Period pace uses corresponding total time and distance</td></tr><tr><td>A pace denominator is zero</td><td>The metric returns null</td></tr><tr><td>A day has no resting-heart-rate observation</td><td>It does not become zero bpm</td></tr><tr><td>A day contains several runs</td><td>Its daily health observation is not unintentionally overweighted</td></tr><tr><td>The current week is incomplete</td><td>The comparison makes that difference explicit</td></tr><tr><td>A prior-seven-day baseline is requested</td><td>Today is excluded; valid observation count is retained</td></tr><tr><td>The athlete filter changes</td><td>Another athlete’s records do not leak into the result</td></tr><tr><td>A training plan has a new revision</td><td>The requested version is identifiable and reproducible</td></tr></table></div>

These are acceptance expectations, not a claim that every case was executed during the historical reconciliation below.

### Independent reconciliation

<figure><a href="/images/semantic-layer-requirements/validation-two-paths.svg" target="_blank" rel="noopener"><img src="/images/semantic-layer-requirements/validation-two-paths.svg" alt="Validation flow comparing a semantic query and independently written SQL under the same athlete and date filters" loading="lazy" decoding="async"></a><figcaption>Two paths, one scope. Re-running the generated SQL alone is not an independent calculation check.</figcaption></figure>

The strongest check I performed during the project was to ask the agent to take two paths: query StarRocks directly with SQL and query the already-defined semantic metrics. Then compare the results for the same user, dates, and filters.

The reference needs to be independent. Copying generated SQL and running it again only demonstrates repeatability; it can preserve the same modeling error on both sides.

Compare daily values as well as period aggregates. Two incorrect days can cancel out in an average. Also specify units, rounding, and any numerical tolerance before declaring agreement.

## A real check from the running project

The saved reconciliation covered November 10–17, 2026: eight days of nightly main sleep, HRV, HRV baseline, and resting heart rate. The recorded response reported agreement across all eight daily results and these period averages:

<div class="table-wrap"><table><tr><th>Metric</th><th>Semantic layer</th><th>Direct StarRocks</th></tr><tr><td>Nightly main sleep duration</td><td>436 minutes</td><td>436.0 minutes</td></tr><tr><td>Average HRV</td><td>48.5 ms</td><td>48.5 ms</td></tr><tr><td>HRV baseline</td><td>49.5 ms</td><td>49.5 ms</td></tr><tr><td>Resting heart rate</td><td>53.5 bpm</td><td>53.5 bpm</td></tr></table></div>

This is a historical result captured during the project, not a new warehouse query run for this article. It verifies a specific scope: those metrics, that athlete, and that window. It does not certify every metric in the model.

What made the exercise useful was that I could follow a number back to its definition and records. If the two paths disagreed, I had a concrete debugging route: check filters, source grain, timing conventions, duplicates, and missing values.

Keep that evidence with the model: the revision, request conditions, generated SQL, independent reference, source snapshot or extraction time, and comparison result. Then a future change to a definition can be checked against something more reliable than memory.

## Separate trustworthy metrics from coaching decisions

The semantic layer can calculate how much I ran and retrieve observations about my recovery. Deciding whether next week’s schedule should change requires additional context and rules.

That is where I introduced an [ontology alongside the semantic layer](/blog/semantic-layer-vs-ontology/). It connects concepts such as the athlete, capability, recovery, goals, and planned training. Review rules identify which observations and thresholds matter for particular questions.

These views are generated from the project’s actual ontology, rather than inferred from the presentation layout. Together they preserve all 48 concept-to-concept relationships and inheritance links across 33 concepts; primitive value fields are omitted for readability. Arrow direction follows the source concept and its named target.

<figure><a href="/images/semantic-layer-requirements/ontology-records.svg" target="_blank" rel="noopener"><img src="/images/semantic-layer-requirements/ontology-records.svg" alt="Running ontology record relationships: SourceActivity records TrainingSession, RunningObservation is part_of TrainingSession, and TrainingSession is performed_by Athlete." loading="lazy" decoding="async"></a><figcaption>Recorded activities, observations and athlete identity. Arrow labels are the relationship names declared in the model; dashed arrows denote inheritance.</figcaption></figure>

<figure><a href="/images/semantic-layer-requirements/ontology-recovery.svg" target="_blank" rel="noopener"><img src="/images/semantic-layer-requirements/ontology-recovery.svg" alt="Running ontology recovery and capability relationships, including considers_sleep, considers_hrv, considers_load, supported evidence and evaluation rules." loading="lazy" decoding="async"></a><figcaption>RecoveryState considers observations; RecoveryEvidence belongs_to that state and is evaluated_with a RecoveryRule. These are model relationships, not proof of automatic rule execution.</figcaption></figure>

<figure><a href="/images/semantic-layer-requirements/ontology-goals.svg" target="_blank" rel="noopener"><img src="/images/semantic-layer-requirements/ontology-goals.svg" alt="Running ontology goal relationships linking ActionPlan, PlannedAction, GoalCriterion and GoalProgressAssessment." loading="lazy" decoding="async"></a><figcaption>Goals, versioned plans and progress evidence remain distinct concepts. Both directions of the declared progress-evidence relationship are retained.</figcaption></figure>

<figure><a href="/images/semantic-layer-requirements/ontology-advice.svg" target="_blank" rel="noopener"><img src="/images/semantic-layer-requirements/ontology-advice.svg" alt="Recommendation triggered_by InferredState, for_goal Goal and adjusts PlannedAction; InferredState supported_by MetricEvidence." loading="lazy" decoding="async"></a><figcaption>A recommendation points to the inferred state, goal and proposed action. This graph describes those links; a person still reviews a training change.</figcaption></figure>

[Open the complete ontology graph](/images/semantic-layer-requirements/ontology-complete.svg) or [inspect the extracted relationship list](/images/semantic-layer-requirements/ontology-relationships.json).


The distinction helped me avoid asking a metric to do too much. Resting heart rate is an observation. “Review the next hard workout because recovery needs attention” is a decision supported by several observations and a defined rule.

### What the coach shows, and where the advice comes from

The project’s <a href="https://github.com/joannahe/AI-Runner-Tracker/blob/main/fitness_ontology.yaml" rel="nofollow noopener">ontology file</a> records concepts and review bindings, including `PolarizedHighIntensityReview`. The runner application evaluates its checks against the available records. This project-specific coaching extension is not automatically executed by DOSI.

The current English dashboard makes that context visible in two places: a weekly coach summary, and an expandable explanation of a particular finding. These captures come from the project’s existing English offline dashboard, whose data is labeled through November 23, 2026.

<figure><a href="/images/semantic-layer-requirements/runner-coach-advice-en.png" target="_blank" rel="noopener"><img src="/images/semantic-layer-requirements/runner-coach-advice-en.png" alt="English AI Runner Tracker coach summary connecting recent running records, recovery observations and a future training goal" loading="lazy" decoding="async"></a><figcaption>Actual AI Runner Tracker interface, rendered from its saved owner-authorized snapshot. The summary also identifies limits in activity-import coverage; upcoming sessions remain planned work.</figcaption></figure>

For example, one finding counts two high-intensity-focus runs among four recorded runs in the previous completed week. Its explanation shows the 50% share and says the classification comes from each run’s main training-focus label. That is a share of recorded sessions, not a claim about time spent in physiological intensity zones.

<figure><a href="/images/semantic-layer-requirements/runner-coach-training-rule-en.png" target="_blank" rel="noopener"><img src="/images/semantic-layer-requirements/runner-coach-training-rule-en.png" alt="Expanded English coach finding showing two of four recorded runs classified as high intensity, its evidence and the proposed next review" loading="lazy" decoding="async"></a><figcaption>Actual expanded finding. Reviewing the next interval would ask an Agent for a new draft; the current plan is not changed by viewing this result.</figcaption></figure>

This gives me a more useful review trail than advice alone: which records were counted, what interpretation rule was used, and which planned action needs a decision. The repo keeps the <a href="https://github.com/joannahe/AI-Runner-Tracker/blob/main/fitness_analysis.yaml" rel="nofollow noopener">semantic model</a> and ontology inspectable. Its default local dashboard reads DuckDB and evaluates checks in the application; optional DOSI queries use the semantic execution path. Those equivalent calculation paths still need testing.

For the coach, both layers are useful. For someone who simply wants consistent running analysis, starting with the semantic model and validated metrics is enough. There is no need to model every training concept before getting weekly distance right.

## Treat access and change management as acceptance requirements

The project uses my own running data, but a reusable application may serve several runners. An athlete filter is not automatically an authorization boundary.

Test whether an identity can retrieve only permitted records, including through agents, exports, direct-query routes, and cached results. These are requirements to verify in the application and database; a semantic-model file alone should not be assumed to enforce them.

Version changes to definitions too. If the scope of “running distance” expands to include additional activities, a higher weekly total may reflect a definition change rather than more training. Keep enough information to distinguish the two.

The same principle applies when moving between StarRocks and DuckDB. A compatible query is only part of the job. Data coverage, units, date handling, and calculation results also need checking.

## A checklist you can take back to your team

<div class="table-wrap"><table><tr><th>Requirement</th><th>Evidence to keep</th><th>Acceptance condition</th></tr><tr><td>Business meaning</td><td>Metric contract with an owner</td><td>Scope, units, exclusions, and missing-value behavior are clear</td></tr><tr><td>Source mapping</td><td>Dataset and field mappings</td><td>Each metric input has an identifiable source</td></tr><tr><td>Grain and relationships</td><td>Key, duplicate, and join tests</td><td>Records are neither multiplied nor silently dropped</td></tr><tr><td>Aggregation</td><td>Formula and hand-checkable cases</td><td>The metric remains correct across supported groupings</td></tr><tr><td>Time handling</td><td>Window and baseline tests</td><td>Boundaries, complete periods, and valid-day counts are explicit</td></tr><tr><td>Structural validity</td><td>Validation and compilation output</td><td>Supported queries have no unresolved model errors</td></tr><tr><td>Numeric correctness</td><td>Independent SQL or trusted reference</td><td>Daily results and aggregates meet an agreed tolerance</td></tr><tr><td>Coverage</td><td>Missing-data and freshness checks</td><td>Missing observations are not presented as real zeros</td></tr><tr><td>Consumer reuse</td><td>Actual agent, report, and dashboard requests</td><td>Definitions are reused or equivalent paths are tested</td></tr><tr><td>Access</td><td>Tests under different identities</td><td>Each consumer returns only authorized records</td></tr><tr><td>Versioning</td><td>Model revision and regression evidence</td><td>Definition changes are reviewable and results explainable</td></tr><tr><td>Operations</td><td>Query latency and availability checks</td><td>The model supports the intended review workflow</td></tr></table></div>

## Conclusion

I initially wanted the agent to tell me how to run faster. Its first useful recommendation was less exciting: stabilize my weekly running frequency and volume. Looking at my sessions rising and falling around races, I could see why.

The semantic layer did not supply that training judgment by itself. It made the supporting numbers more consistent and easier to inspect. The running knowledge and ontology then helped connect those numbers to my goal and plan.

That is the standard I would use for another project too: can a person ask an ordinary question, receive a consistently calculated result, and trace it back to a definition, a query, and evidence? When the answer changes, can we explain whether the data, the scope, or the definition changed?

Those are more useful milestones than finishing a diagram. They are also how I started turning a collection of watch records into a coach I could actually work with.

To apply the same approach to your data, start with one question and one metric. [Datus and DOSI provide a workspace and execution path for semantic models](/solutions/semantic-layer/); the important check is still whether the definition matches your intended question. You can also inspect a [working semantic model example](/blog/semantic-model-examples/).

## Explore the model, or build your own

<a href="https://github.com/joannahe/AI-Runner-Tracker" rel="nofollow noopener">Explore AI Runner Tracker on GitHub</a> for the running model, ontology, local dashboard and setup instructions. The README distinguishes the owner-authorized running snapshot from the separate fictional test case.

<a href="https://studio.datus.ai/?utm_content=blog_semantic_layer_requirements_body" rel="nofollow noopener">Try Datus Studio</a> to work with your own semantic definitions, or explore the <a href="https://github.com/Datus-ai/Datus-agent" rel="nofollow noopener">open-source Datus Agent</a>. For the engine and query interfaces, see the <a href="https://dosi.datus.ai/" rel="nofollow noopener">DOSI documentation</a>.

## Frequently asked questions

### What are the minimum requirements for a semantic layer?

Start with explicit metric definitions, source mappings, row grain, relationships, aggregation and time rules, a usable query interface, and repeatable checks. For shared use, add ownership, model versions and access tests. The model should make each calculation inspectable, not merely describe it in prose.

### How do you validate a semantic layer?

Check structure and compilation first, then test source records, relationships and calculations. Reconcile selected metrics against an independent reference under the same filters. Compare daily results as well as period totals, and record the model version and data scope.

### Is a semantic layer the same as an ontology?

No. The semantic model defines how observations become metrics. An ontology can connect business concepts and rules that help interpret those results. In this project, pace is a calculation; deciding which training question deserves attention involves goals, observations and rules beyond that calculation.

### Can one model serve an agent, a dashboard and a report?

Yes, when those consumers actually query the model or use implementations that have been checked for equivalence. A shared screen or product name does not establish that reuse. Verify the request, calculation, identity, time window and model version for each consumer.

## Related articles

- [Data Context Layer: Five Checks Before You Buy](/blog/data-context-layer-evaluation/) — procurement questions rather than implementation checks.
