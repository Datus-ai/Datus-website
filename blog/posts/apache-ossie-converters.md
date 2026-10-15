---
title: "Apache Ossie Converters: YAML to dbt, Cube and More"
description: "Use Apache Ossie converters to export semantic model YAML to dbt, Cube, Snowflake and more. Try examples, inspect output files, and check conversion limits."
author: "Evan Paul"
date: 2026-10-15
lastmod: 2026-10-15
head:
  - - meta
    - name: keywords
      content: "Apache Ossie converters, Ossie YAML converter, semantic model converter, Ossie to dbt, Ossie to Cube, Ossie to Snowflake"
  - - meta
    - property: og:title
      content: "Apache Ossie Converters: YAML to dbt, Cube and More"
  - - meta
    - property: og:description
      content: "Use Apache Ossie converters to export semantic model YAML to dbt, Cube, Snowflake and more. Try examples, inspect output files, and check conversion limits."
  - - meta
    - property: og:type
      content: article
  - - meta
    - property: og:url
      content: https://datus.ai/blog/apache-ossie-converters/
  - - meta
    - property: og:image
      content: https://datus.ai/logo_dark.svg
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - link
    - rel: canonical
      href: https://datus.ai/blog/apache-ossie-converters/
---

# Apache Ossie Converters: YAML to dbt, Cube and More

## TL;DR

- **Apache Ossie converters** translate a vendor-neutral semantic model into a platform-specific representation, or import a platform model into Ossie. For YAML exports, choose the target, supply its required options, inspect the generated files and diagnostics, then verify import and metric results in the destination platform.
- Match the export to the artifact you need. The dbt target produces `semantic_manifest.json`; Omni produces a set of project YAML files; the Microsoft target in the web tool produces offline BIM JSON.
- Start with the included Apache examples. They demonstrate a single-file export, a multi-file export, and a result that needs review.
- A successful conversion passes the available offline checks. Target import, warehouse execution, and business-definition checks remain separate acceptance steps.

**Apache Ossie** is the open specification formerly known as Open Semantic Interchange, or OSI, for exchanging semantic metadata across analytics, AI, and BI systems. Our [Apache Ossie / OSI overview](/blog/open-semantic-interchange-osi/) explains the standard; this guide follows the practical export path from YAML to the files another platform consumes.

The useful starting question is what you want to hand to the destination: a manifest, a model document, or a directory of related definitions. That choice determines the converter, its options, and the checks you should run afterward. The walkthrough below uses real Apache fixtures and the browser workbench, with the expected artifacts recorded as of October 15, 2026.

## 1. Identify the source model and conversion direction

An Ossie export starts with a semantic model, while an import starts with another platform's model. The [upstream converter guide](https://github.com/apache/ossie/blob/main/converters/README.md) describes both directions around a shared Ossie representation. A path from platform A through Ossie to platform B therefore depends on both the relevant import and export implementations. Check those implementations before planning a migration between two vendor formats.

The source also needs a compatible document shape. As checked on October 15, 2026, the [development core specification](https://github.com/apache/ossie/blob/main/core-spec/spec.md) is marked draft `0.2.0.dev0` and places a single model's properties at the document root. Earlier snapshots and some runtime-produced files use a `semantic_model` wrapper. Keep the originating runtime and schema revision with the file; the version string alone may not distinguish development snapshots.

For a visual reference, this is the opening of the included [NVIDIA Sales fixture](https://github.com/apache/ossie/blob/eabe562128c4fe2ca4ec30780fa743317ca8a81e/converters/nvidia/tests/fixtures/sales.ossie.yaml). It is an excerpt, with fields, relationships, and metrics omitted here; load the complete example in the tool when converting:

```yaml
version: 0.2.0.dev0
name: sales
description: Sales model
ai_context:
  instructions: Use approved metrics
datasets:
- name: orders
  source: analytics.public.orders
  primary_key:
  - order_id
  description: Orders
```

Read `source` separately from `name`: `orders` is the logical dataset, while `analytics.public.orders` identifies the physical relation in this example. Changing the export platform does not copy that relation or create its connection. For an introduction to fields, metrics, and relationships, the [worked semantic model examples](/blog/semantic-model-examples/) provide the business-modeling background without requiring you to learn a second platform first.

Before uploading your own YAML, establish which model you intend to export and who owns its definitions. A catalog containing several models needs an explicit selection; silently exporting whichever appears first can produce a plausible file for the wrong business domain. Keep ontology documents distinct from core semantic-model documents as well. This walkthrough covers semantic-model conversion and makes no claim that an ontology's entire structure will survive a vendor export.

## 2. Choose the target by its output contract

Choose a converter by the file format your next step accepts. A vendor's name is too broad to establish that contract: a platform can expose several modeling surfaces, and one converter may cover a specific surface. As of October 2026, the [Datus Semantic Model Converter](/tools/semantic-model-converter/) exposes the following 14 export targets through its deployed catalog. This is the web tool's scope, rather than a claim that it contains every upstream converter or every upstream option.

| Target | Export artifact | What to establish before import |
|---|---|---|
| Snowflake Cortex Analyst | YAML model | Table qualification and compatible expressions |
| dbt MetricFlow Manifest | `semantic_manifest.json` | A consumer of the manifest; this is not dbt project source YAML |
| Cube | YAML files | Dataset selection and the warehouse expressions |
| Omni | YAML project files | Views, relationships, and topic structure |
| Microsoft Power BI / Fabric | BIM JSON | Offline model import and target-side validation |
| Sigma | JSON | Destination model configuration |
| WisdomAI | JSON | Destination model configuration |
| Hex | YAML files | Project structure and expression dialect |
| Holistics AML | AML files | SQL dialect and connection name |
| Honeydew | YAML files | Dataset and relationship mapping |
| ThoughtSpot TML | TML files | Connections configured in the destination |
| GoodData LDM | JSON logical data model | Data source ID; this target does not export metrics |
| NVIDIA Auto Ontology | YAML | Physical table sources rather than query sources |
| OrionBelt OBML | YAML | Target model structure and bindings |

The distinction is especially consequential for dbt. The [dbt converter's own README](https://github.com/apache/ossie/blob/main/converters/dbt/README.md) documents an Ossie-to-MSI path that emits `semantic_manifest.json`. A manifest is different from the source YAML that authors maintain inside a dbt project. Downloading the manifest therefore does not generate the surrounding models, transformations, credentials, or deployment workflow. Check the consuming interface before deciding that this is the right export for your task.

The same discipline applies to Microsoft and GoodData. The hosted Microsoft path is an offline BIM export, with no live DAX execution or deployment step. The GoodData path covers its logical data model and does not support exporting metrics. If metric portability is essential to your evaluation, establish that boundary before using a successful structural export as evidence for the whole migration.

Treat the catalog as a set of starting points for inspection. The table does not certify identical modeling capabilities across these platforms, and a file extension cannot tell you whether a particular formula or relationship is representable. Read the target notes in the workbench, then select a source case that exercises the features you actually need. A small model with the relevant ratio metric is a better first test than a large file full of unrelated fields.

## 3. Load an example and configure the export

Start with an included example to separate tool setup from problems in your own model. The workbench opens with **Omni Sales · ANSI_SQL** already loaded in the source editor and Omni selected as the target. You can inspect or change the YAML before converting. As of October 2026, the same input area also accepts pasted text and uploaded `.yml` or `.yaml` files, with a maximum source size of 1 MiB in UTF-8.

The first required choice is **Target Platform**. Additional controls depend on that target, and a red asterisk identifies required fields. Holistics requires SQL Dialect and Connection Name; GoodData requires Data Source ID. A Database field, where offered, is optional. Use the existing destination connection or data source identifier rather than treating those fields as instructions to provision infrastructure.

**Base Dataset** identifies the fact or grain dataset when a converter needs that choice. A model containing orders, customers, and order lines presents different possible starting points for a topic or view. Select the dataset whose row meaning matches the analysis you intend to support. This choice cannot repair an incorrect relationship or make a customer-grain metric additive across order lines, so inspect the resulting joins afterward.

**SQL Dialect** selects from expressions already present in the source. It does not translate arbitrary SQL into a different warehouse language. If your model contains only a StarRocks-specific expression, selecting a Snowflake export does not establish a Snowflake equivalent. Supply a suitable expression in the source or investigate a diagnostic rather than relabeling the existing expression as another dialect.

Keep source and destination decisions separate while filling these controls. For example, an Omni model may still query a Snowflake warehouse, so “Omni” describes the exported modeling format while “Snowflake” describes the SQL expressions it will use. That separation helps explain why a destination platform and a dialect can appear in the same form. Once the target and required options are set, review them together before submitting the conversion.

## 4. Convert a snapshot, then inspect the files

Clicking **Convert** submits a snapshot of the current source and settings. As implemented in October 2026, YAML is sent to the Datus conversion service at that point; the public workbench performs server-side conversion rather than an entirely local browser operation. No warehouse connection is part of this workflow. Use a local upstream converter instead when your model must remain inside your own environment.

Snapshot behavior matters when you iterate. If you change the source after an export, the displayed result still belongs to the earlier input until you convert again. Compare a result with the source that produced it, especially when changing targets or dataset selection. Otherwise, an apparently missing field may simply reflect an older conversion rather than a mapping problem.

For a multi-file result, inspect the directory tree and each related document. The Omni Sales example produces the following artifact set in the checked conversion:

```text
views/
  customer.view.yaml
  orders.view.yaml
relationships.yaml
topics/
  sales.topic.yaml
```

A topic depends on its surrounding model definitions, so reviewing only `sales.topic.yaml` would miss the view and relationship mappings. Start with the physical source references in the views, inspect the join keys in the relationships, and then review what the topic exposes. Preserve the relative paths when moving the result into a target project. The directory structure is part of the exported artifact set, rather than decoration around a single file.

The workbench lets you edit generated files before downloading them. A single artifact downloads directly; multiple artifacts download as a ZIP that retains their relative directories. Downloads contain the current edited output. The conversion status, however, describes the converter's output at conversion time; editing a formula afterward is not a fresh conversion or a target-side test. Review and validate those manual edits before treating the downloaded version as accepted.

Keep a downloaded copy before leaving the page. As of October 2026, this public tool does not persist input models or generated files, and discarding a result removes the temporary workbench output. That makes it useful for an inspection session, while durable review belongs in your own repository or modeling project. Save the source and the final artifact set together so another reviewer can reproduce what you evaluated.

## 5. Reproduce the three included conversion cases

Use the three fixtures to learn different result shapes before exporting a private model. They are unchanged Apache-2.0 test files pinned to upstream revision `eabe562128c4fe2ca4ec30780fa743317ca8a81e`. The following observations come from workbench checks on October 15, 2026; they describe conversion results, with no deployment or warehouse execution implied. The examples remain selectable in the source input, so you can repeat the same sequence without writing a model first.

| Source example | Suggested target | Observed output | Workbench status |
|---|---|---|---|
| Omni Sales | Omni | Four YAML files: views, relationships, and a topic | Success |
| NVIDIA Sales | dbt MetricFlow Manifest | One `semantic_manifest.json` | Success |
| TPC-DS Retail | Snowflake Cortex Analyst | One `semantic-model.yaml` with metadata warnings | Needs Review |

The Omni case is the directory test. Load the example, convert to its suggested target, and open both views before inspecting the topic. Download the ZIP and check that the files remain under `views/` and `topics/`. If you edit a description before downloading, check that the downloaded file contains that edit. This verifies the inspection and packaging workflow without suggesting that the model has been imported into Omni.

The NVIDIA case is the artifact-contract test. Its source has ANSI_SQL and Snowflake expressions and includes `revenue_per_customer`, a ratio expression. Select the suggested dbt target and inspect the JSON output rather than looking for a `models/` directory. The filename should make the intended interface clear. A successful manifest conversion is useful evidence for that export path, while the metric's behavior in its eventual consumer still needs checking.

The TPC-DS case is the diagnostic test. With Snowflake as the suggested target, the checked result includes warnings about extension semantics and relationship `ai_context` that has no Snowflake counterpart in this conversion. Those warnings identify information to review even though an output file exists. Read them alongside the source annotation and decide whether the destination needs an equivalent setting. Removing annotations simply to obtain a green status would conceal the decision instead of resolving it.

Run each case with its suggested target before experimenting with other combinations. A fixture that succeeds for one converter is not a universal compatibility certificate. Switching targets may introduce different requirements for metrics, identifiers, or physical sources. Record the target and options with any outcome you share; the source filename alone is insufficient to reproduce a conversion.

## 6. Judge compatibility beyond the status badge

Accept a conversion only after checking structure, target import, and representative results. In the October 2026 workbench, **Success** means the available offline checks passed, **Needs Review** includes diagnostics, and **Blocked** does not provide an exportable result. None of these statuses confirms that a destination account can import the files or that a warehouse returns the intended business answer. Keep those acceptance steps visible in your review.

Start with dataset grain and keys. For an orders model, establish that a row means one order and that `order_id` identifies it in the actual data. Inspect how the generated relationship connects orders to customers, including every column of a composite key. A readable join expression is insufficient if the customer-side key repeats. Test totals before and after adding a customer dimension so an accidental multiplication of rows becomes observable.

Then test metrics at the levels users will request. For `revenue_per_customer`, compare the numerator and distinct-customer denominator independently before checking the final ratio. Evaluate the whole population and a filtered slice, such as a month or a region. Decide what should happen when the denominator is zero or a source value is null. These are proposed acceptance cases, not claims about results from the bundled fixtures.

Review time and units with the same care. A field classified as a time dimension does not settle whether a business metric uses booking time, settlement time, or another date. A description saying “revenue” does not determine currency conversion or refund treatment. If the source expresses those rules through extensions, verify where they appear in the target and whether the destination enforces them. Metadata can preserve useful context without implementing the corresponding runtime behavior.

Use a compact acceptance record in the destination project:

| Check | Evidence to retain |
|---|---|
| File structure | All generated artifacts and relative paths |
| Target import | Import or validation output from the destination |
| Data binding | Resolved tables, connection, and relevant permissions |
| Metric behavior | Reference calculation, filters, actual result, and agreed tolerance |
| Information loss | Diagnostic, affected construct, and reviewer decision |

The value of this record is the link between a warning and a decision. For example, losing a synonym may be acceptable for a backend-only model, while losing a business instruction can matter for an AI-facing interface. Neither decision follows automatically from the file being valid YAML. Have the model owner approve the impact, and keep the unresolved cases visible rather than treating every diagnostic as equally severe.

## 7. Diagnose failures before changing the business model

Classify a failed attempt before editing source definitions. A malformed document, an unsupported construct, and an unavailable service require different remedies. Start with the reported location or target requirement and make the smallest relevant change. Afterward, compare the output with the original business definition so a technical workaround does not quietly change what the model means.

For a version or document-shape error, check the producing runtime and the schema revision the converter accepts. Do not remove a `semantic_model` wrapper blindly when it contains multiple models. Select or split the intended models while preserving their contents and extensions, then validate the resulting documents. The [Ossie and MetricFlow comparison](/blog/osi-vs-metricflow/) provides background on why a portable model and a specific execution system can carry different information.

For an expression error, inspect the dialect entries on the affected field or metric. A missing compatible expression needs a reviewed expression, rather than a different label on the same SQL. For a missing option, supply the destination's real identifier and retry with the same source. For an unsupported metric export, choose another supported path or explicitly handle the limitation; deleting the metric changes the scope of the result.

For a network error or rate limit, preserve the source and retry when the service is available. The anonymous tool has server-side request limits, so repeated submissions are not a useful syntax-debugging method. Likewise, if a conversion fails while an older result remains visible, inspect the status of the current attempt before downloading that older output. Matching source, settings, and result is part of troubleshooting.

Local upstream tooling is the better choice for batch conversion, an isolated environment, or automated regression tests. Read the individual converter's installation instructions and pin the packages or source revisions you test; the converters are separate implementations with their own dependencies. The browser tool is convenient for comparing artifacts interactively. Choose the execution environment according to your data-handling and automation requirements rather than assuming the hosted workflow is necessary.

## 8. Keep the source authoritative as converters evolve

Keep the reviewed Ossie model as the source of business meaning and make exported files reproducible from it. If a target-side edit changes a formula or relationship, decide whether that change belongs in the source before regenerating. Otherwise the next export can overwrite a correction that exists only in the destination. A description-only adjustment and a changed aggregation deserve different review attention even if both are small text diffs.

Record the converter release, upstream revision, target, options, diagnostics, and acceptance results with a meaningful export. Keep at least a single-file case, a multi-file case, and a diagnostic-producing case in your regression set. After an upgrade, compare their structures and important expressions before importing into a shared project. A byte diff is useful, but reviewers should distinguish harmless ordering changes from a changed join key or metric denominator.

Upstream organization is changing too. As checked in October 2026, the existing converter guide directs new contributions to separate repositories or [apache/ossie-converters](https://github.com/apache/ossie-converters). Keep both that repository and the existing guide in your dependency notes. This guidance does not mean every existing converter has already migrated, or that changing a repository URL is sufficient to upgrade an integration.

Treat an upstream move as a compatibility review: identify the maintained implementation, pin a tested revision, and rerun the acceptance cases. The same principle applies when a draft schema changes while retaining a development version string. For an interactive starting point, the web workbench provides the source editor, target options, and temporary output inspection in one place. For execution through an Ossie-native engine, follow the separate [Apache Ossie and Dosi quickstart](/blog/apache-ossie-dosi-quickstart/); exporting a vendor model and executing the source model are distinct workflows.

## Conclusion

Choose an Apache Ossie converter by its output contract, then accept the result against your destination's import and metric behavior. Keep the source, target settings, generated files, and review decisions together so the next conversion remains explainable. Start with the three bundled cases in the [Semantic Model Converter](/tools/semantic-model-converter/), then replace them with a small model that exercises your own critical definitions.

## Frequently asked questions

### What is Apache Ossie, and is it the same as OSI?

Apache Ossie is the project formerly known as Open Semantic Interchange, or OSI, for standardizing semantic metadata exchange. Its models describe datasets, fields, relationships, metrics, and associated context. A converter maps that representation to or from a specific platform format. Keep the specification revision separate from the converter release and the destination platform's supported input; the shared name does not establish compatibility among every version.

### Can I convert Ossie YAML into dbt semantic model YAML?

The web tool's dbt target exports `semantic_manifest.json`, not dbt project source YAML. That artifact is intended for a MetricFlow Semantic Interface consumer. If your requirement is editable source definitions inside a dbt project, check the workflow your project supports and whether it can consume the exported manifest. The export does not create transformations, credentials, or a complete runnable project, so establish the desired artifact before starting.

### Does changing SQL Dialect translate the SQL?

No. The control selects an expression dialect already present in the source model for converters that offer this option. A platform export and a warehouse dialect are separate choices: the destination model may still query a particular warehouse. If the source lacks a suitable expression, add and review one or investigate the resulting diagnostic. Changing a dialect label does not verify equivalent function behavior, casting, or date handling.

### Does Success mean the model is ready for production?

No. Success reports the outcome of the available offline conversion checks. Import the artifacts into the intended platform, resolve data bindings, and compare representative metric results with an approved reference. Include joins, filtered ratios, null handling, and date boundaries relevant to your model. Manual edits made after conversion also need review, because the original status does not certify the edited output.

### Is the online converter free, and does my YAML stay in the browser?

The October 2026 public workbench is anonymous and free, with input-size and server-side request limits. YAML is sent to Datus servers when you click Convert, so this is a hosted conversion workflow. The tool does not persist input models or generated files; download the output you need before leaving. If a model must stay inside your environment, use a suitable upstream converter locally and inspect its own dependencies and data-handling behavior.

## Related articles

- [Apache Ossie / Open Semantic Interchange overview](/blog/open-semantic-interchange-osi/) — the standard and its place in the semantic stack
- [Semantic model examples](/blog/semantic-model-examples/) — fields, relationships, and reviewed business definitions
- [Apache Ossie / OSI vs MetricFlow](/blog/osi-vs-metricflow/) — portable metadata and execution interfaces
- [Apache Ossie and Dosi quickstart](/blog/apache-ossie-dosi-quickstart/) — execute a model through an Ossie-native engine
