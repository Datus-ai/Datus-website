---
title: "Convert Semantic Models to Ossie: Cube, dbt and More"
description: "Convert semantic models to Ossie from Cube, dbt, Omni and Power BI. Try ready-made examples, prepare complete source files, and validate the resulting YAML."
author: "Evan Paul"
date: 2026-10-19
lastmod: 2026-10-30
head:
  - - meta
    - name: keywords
      content: "convert semantic models to Ossie, Apache Ossie import, Cube to Ossie, dbt to Ossie, Omni to Ossie, Power BI to Ossie"
  - - meta
    - property: og:title
      content: "Convert Semantic Models to Ossie: Cube, dbt and More"
  - - meta
    - property: og:description
      content: "Convert semantic models to Ossie from Cube, dbt, Omni and Power BI. Try ready-made examples, prepare complete source files, and validate the resulting YAML."
  - - meta
    - property: og:type
      content: article
  - - meta
    - property: og:url
      content: https://datus.ai/blog/convert-semantic-models-to-ossie/
  - - meta
    - property: og:image
      content: https://datus.ai/logo_dark.svg
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - link
    - rel: canonical
      href: https://datus.ai/blog/convert-semantic-models-to-ossie/
---

For the standard and what happens after conversion, see the [Apache Ossie guide](/apache-ossie/).

# Convert Semantic Models to Ossie: Cube, dbt and More

## TL;DR

- To **convert semantic models to Apache Ossie**, choose the original platform, supply its complete model files or compiled semantic artifact, run the matching import converter, and review diagnostics. The result is a vendor-neutral YAML definition. Validate relationships, SQL expressions and metric results in a compatible runtime before production use.
- Start with a prefilled Cube, Omni, dbt or Power BI example in the conversion workbench. Each example supplies the files its importer expects; your own model may need additional dependencies.
- A Cube view needs its referenced cubes. Omni needs its project definitions. The dbt path consumes compiled `semantic_manifest.json`; the Power BI path consumes offline `model.bim` JSON.
- Import support and export support are separate capabilities. A platform appearing in an export menu does not establish a reverse conversion path.
- Keep the source snapshot, configuration, generated YAML and diagnostics together. Conversion prepares an interchange document; it does not move warehouse data or reproduce every platform's runtime behavior.

**Apache Ossie**, formerly Open Semantic Interchange (OSI), is an open specification for exchanging semantic metadata. It is the destination format in this tutorial, rather than a hosted platform you must migrate your warehouse into. The [Apache Ossie guide](/apache-ossie/) covers the standard itself; here the starting point is a model that already lives in another system.

The practical question is which files express the model you intend to exchange. An export button can produce a report, a workbook, a logical model or a compiled semantic artifact, and those objects are not interchangeable. This tutorial follows the import workflow, then shows how to decide whether the resulting definition is ready for a second consumer. If you already have Ossie YAML and need another platform's representation, use the companion [Ossie export conversion guide](/blog/apache-ossie-converters/).

## 1. Identify the input artifact before choosing a converter

An importer needs the semantic definition and its dependencies. It does not infer your business model from a dataset extract or a screenshot of a dashboard. Start by recording where dimensions and metrics are defined, which files reference other definitions, and whether the source product compiles its authoring language into a separate artifact. That inventory determines what you upload and what you must generate beforehand.

The following boundaries describe the October 2026 workflow in the [semantic model conversion workbench](/apache-ossie-converter/?direction=import). Its deployed source catalog is authoritative; if that service has not yet enabled import, the workbench shows an unavailable message and a retry action. The examples below describe the reviewed import implementation, not a promise that every deployed backend has already been upgraded.

| Source | Input for this import path | Preparation that matters |
|---|---|---|
| Cube | YAML files containing cubes and views | Include every referenced cube; JavaScript model code is not executed |
| Omni | View YAML, topic YAML and relationship definitions | Preserve relative paths and include the topic's referenced views |
| dbt MetricFlow | Compiled `semantic_manifest.json` | Generate the semantic artifact from your project; ordinary model YAML is a different input |
| Microsoft Power BI / Fabric | Offline `model.bim` JSON | Extract the tabular model definition; a report file is not a BIM definition |
| Holistics | Compiled AML JSON | Compile the authoring project and supply the source SQL dialect |
| Honeydew | Workspace YAML and its schema files | Upload the workspace bundle with its directory structure |
| ThoughtSpot | Model TML and referenced Table or SQL View TML | Include the complete dependency set for the chosen model |
| GoodData | Logical data model JSON | This path imports the LDM; it does not import MAQL metric definitions |

The tool also exposes source-specific paths for Sigma, WisdomAI, NVIDIA Auto Ontology and OrionBelt when supported by the running service. Read the source format notes before supplying a file that happens to have a supported extension. A JSON object named `export.json` gives no evidence about its schema, and an unsupported representation should be corrected at the source rather than repeatedly reformatted until it parses.

Scope matters as much as syntax. If a project has several business views or topics, choose the one whose definitions you want to exchange and include its dependencies. A model called `sales` can mean booked revenue in one topic and collected cash in another. Record the selected scope beside the generated YAML so a reviewer can explain which business surface the conversion represents.

## 2. Try the complete Cube example first

The prefilled Cube example makes the dependency boundary visible. In **Import to Ossie**, choose the Cube commerce example and inspect its source-file selector. As of October 19, 2026, the authored test bundle contains an orders cube, a customers cube and a commerce view. These are synthetic modeling definitions included with the tool, not exports from a customer's system, and no running Cube deployment is required to inspect them.

```text
model/cubes/orders.yml
model/cubes/customers.yml
model/views/commerce.yml
```

The orders definition contains a join to customers. Its revenue measure is attached to orders, while customer dimensions provide the grouping attributes exposed by the commerce view. The following excerpt illustrates that relationship; use the complete prefilled bundle when converting, since this excerpt intentionally omits dimensions and other declarations:

```yaml
cubes:
  - name: orders
    sql_table: ANALYTICS.PUBLIC.ORDERS
    joins:
      - name: customers
        sql: "{CUBE}.customer_id = {customers}.id"
        relationship: many_to_one
    measures:
      - name: revenue
        sql: "{CUBE}.amount"
        type: sum
```

Click **Convert**, then compare the source and generated Ossie document side by side. Check that the orders and customers datasets are present and that the relationship refers to the intended key fields. Inspect the revenue expression instead of judging the conversion only by a green status badge. You are checking whether a specific model definition survived the mapping, not whether the YAML has a familiar appearance.

Now remove the customers cube and convert the incomplete bundle. The orders join still refers to customers, so a usable interchange model cannot be produced from that dependency set. The resulting diagnostic should lead you back to the missing definition rather than invite you to delete the join merely to silence an error. Reloading the complete example supplies the dependency again and provides a useful negative test for your own migration procedure.

The <a href="https://github.com/apache/ossie/blob/main/converters/cube/README.md">Cube converter documentation</a> explains the file-bundle contract and the mapping between Cube constructs and Ossie constructs. Use it when deciding whether to exchange an entire model or a selected view. Keep the distinction between a view's public members and the underlying definitions they require: a smaller visible surface does not necessarily imply a self-contained source file.

## 3. Replace the example with your model and preserve its paths

Use **Add Files** for a set of related definitions or **Choose Folder** when relative paths carry project structure. The source-file selector lets you inspect each uploaded file and edit the conversion copy. Add Files appends definitions to the current bundle; remove the demonstration files when switching to your own project so that sample entities do not become part of your conversion. Paste Code is useful for a small missing definition, provided you give it a safe relative path.

Review the complete source list before submitting it. Two files with the same basename can belong to different directories, while two paths that differ only by letter case can create an ambiguous bundle. Preserve meaningful directories and resolve collisions deliberately. Do not flatten an entire repository into a single directory or paste all its YAML documents into one editor and assume the importer will reconstruct the original project boundaries.

The October 2026 public implementation limits an import to 50 source files and 1 MiB of combined UTF-8 content and paths, with server-side frequency limits. These are tool limits, not limits of the Ossie standard. Choose a coherent business scope if your repository is larger, then check that all definitions referenced by that scope are included. If the necessary scope exceeds the limit, use a suitable local upstream converter rather than splitting a model into arbitrary chunks that no longer resolve.

Clicking Convert captures the current source files and settings. Edits made afterward belong to a new input state, and the displayed result remains associated with the earlier snapshot until you convert again. Keep that distinction visible during review: changing `revenue` to exclude refunds in the source does not update an already generated expression. Reconvert and compare the new output before downloading it as the approved artifact.

Both conversion directions keep their own in-memory session. You can inspect an Ossie export and return to the import without replacing one direction's source with the other's result. This is a review convenience rather than automatic vendor-to-vendor migration: passing through Ossie still involves two separate transformations and two sets of diagnostics. Download the first result explicitly before deciding to use it as the next conversion's input.

## 4. Use the compiled semantic artifact for dbt

For the dbt importer, the expected starting point is `semantic_manifest.json`. A dbt project's transformation models, semantic-model source declarations and compiled semantic manifest play different roles. Uploading a source YAML file to a manifest importer is an artifact mismatch even if both files describe the same business concept. Locate the artifact produced by the dbt version and semantic configuration you actually run, then inspect its semantic models and metrics before conversion.

The <a href="https://docs.getdbt.com/reference/artifacts/sl-manifest" rel="nofollow noopener">dbt semantic manifest documentation</a> describes the artifact and its version-dependent generation. The <a href="https://github.com/apache/ossie/blob/main/converters/dbt/README.md">Apache dbt converter</a> documents the corresponding MSI-to-Ossie path. Where your supported dbt environment produces the semantic manifest during parsing, the preparation step is:

```sh
dbt parse
# Locate the generated target/semantic_manifest.json for your project.
```

The workbench includes a small compiled-manifest example so you can test this input contract before using your project. Converting that example does not run dbt, build warehouse tables or connect to the dbt Semantic Layer. It demonstrates the translation from an already prepared semantic artifact to an Ossie definition. If your local project produces a different artifact shape, check the supported versions instead of assuming a filename proves compatibility.

Pay particular attention to metrics with cumulative, conversion or visibility semantics. A base aggregate can survive conversion while an important evaluation rule does not have an equivalent representation. Read the diagnostic and compare the original definition with the generated expression. For example, a running balance evaluated over a time window is not validated by observing that its underlying sum appears in the output. Reject the migration if the required behavior cannot be represented or verified in the intended consumer.

## 5. Check Omni scope and Power BI expression languages

Omni and Power BI illustrate why the same upload workflow needs different acceptance checks. The Omni example is a project bundle with views, relationships and a topic. The Power BI example is a single offline BIM document. Their file counts are different, but neither count tells you whether all relevant business behavior is portable; the decisive question is what each definition means in its original runtime.

For Omni, inspect the topic and the relationships along with the view files. The <a href="https://github.com/apache/ossie/blob/main/converters/omni/README.md">Omni converter guide</a> describes that project representation. A field can exist in a view without being the intended business dimension for the selected topic. Review the selected topic, the fields exposed through it and the join route used by each metric so that an apparently complete collection of views does not become an accidentally broader analytical model.

For Power BI, choose the offline BIM example to see a review-required result. The <a href="https://github.com/apache/ossie/blob/main/converters/microsoft/README.md">Microsoft converter documentation</a> covers the tabular model path. The browser tool does not log in to a Fabric workspace or unpack an arbitrary report file. Supply the model definition it expects and distinguish structural mapping from the interpretation of native measures, partitions and expressions.

DAX and Power Query are not warehouse SQL. Preserving a native definition in vendor metadata is useful for inspection or a return trip, but it does not mean another Ossie consumer executes that definition. Treat the native-expression diagnostic as work that still needs an owner. Review which measures require a SQL equivalent, which can remain source-specific, and which should be excluded from a portable model until their semantics have been resolved.

A source-native route can be the better choice when you intend to keep all execution in the original platform. As of October 2026, <a href="https://cube.dev/blog/introducing-apache-ossie-integration" rel="nofollow noopener">Cube documents its own Ossie CLI and Platform API workflow</a>. Use that path when it fits your existing deployment and review process. The browser workbench is useful for inspecting files across several formats; it does not replace the original platform's deployment controls or query engine.

## 6. Read diagnostics as an acceptance decision

A conversion status describes the available checks, not a guarantee of business equivalence. Success means those offline checks passed. Needs Review means output exists alongside warnings. Blocked means the result should not be exported until the reported issue is resolved. Use the diagnostic's location and remedy to connect a message to a particular metric, field or dependency instead of treating every warning as interchangeable noise.

Classify each diagnostic by the decision it requires. Missing source files need a corrected bundle; unsupported metric semantics need a design decision or a blocked rollout. Metadata that the new consumer does not need may be an acceptable loss, but record why it is acceptable. A long list of similar messages should become one reviewed policy with an explicit scope, not a blanket instruction to ignore warnings across future imports.

Retained vendor metadata needs a separate review from portable core definitions. A `custom_extensions` entry can carry information that another consumer does not understand. Inspecting that entry confirms preservation, while testing the new consumer establishes behavior. Keeping those checks separate prevents a misleading conclusion that a policy or formula was enforced simply because its original text remains somewhere in the interchange document.

## 7. Reconcile the generated model before adoption

Begin reconciliation with the source model's grain and keys. For the commerce example, identify what one orders row represents and whether the customer key is unique in customers. Check that the converted relationship connects those same fields. A syntactically valid relationship can still create repeated rows in a consuming query, so a schema check and a metric check answer different questions about whether the model is safe to use.

Next, choose a small set of reviewed business queries. Compare revenue without grouping, revenue by customer segment and a count of orders over the same time period. Include empty groups, null amounts and any refund or cancellation rule that affects the source metric. Record the exact source scope and time boundary with each expected answer. This makes a discrepancy actionable instead of leaving reviewers to argue over two totals calculated from different populations.

Keep execution outside the converter's acceptance claims. Importing the document into a compatible runtime, binding it to physical tables and executing queries are later steps. The [Apache Ossie and Dosi quickstart](/blog/apache-ossie-dosi-quickstart/) illustrates one execution path after you have a suitable model. The choice of runtime determines which expressions and extensions can be evaluated; the file format alone cannot supply that behavior.

The result of this review should be a small acceptance record that travels with the YAML. Include the source files, selected scope, options, generated document, diagnostics and the reconciliation queries with expected results. Keep original source definitions unchanged so a reviewer can reproduce the comparison. When the converter changes, rerun this record and inspect semantic differences before replacing a model already used by another consumer.

## 8. Choose the next consumer deliberately

An approved Ossie document can be versioned, reviewed or used as input to a separate export converter. That gives a team an additional interchange surface without requiring an immediate move away from its current platform. Start with one business scope and one consumer whose requirements are understood. Expand only after you can explain which definitions are portable and which remain coupled to the source runtime.

Avoid assuming that a successful import implies a supported export to every platform. In this workbench, Snowflake Cortex Analyst and Hex remain export-only in the reviewed source catalog; that statement describes this tool, not every integration in those ecosystems. Similarly, source support in the upstream project can exceed what one hosted deployment exposes. Check direction, artifact shape and running service version together before promising a migration path to another team.

Converter implementations also evolve independently of your business definitions. The upstream code is documented in the <a href="https://github.com/apache/ossie/blob/main/converters/README.md">Apache Ossie converters directory</a>, with work moving toward <a href="https://github.com/apache/ossie-converters">apache/ossie-converters</a>. Record the implementation revision used for an accepted conversion and rerun your acceptance record after upgrades. A repository move is a dependency-maintenance event, not evidence that an existing model's meaning has been preserved.

## Conclusion

Start with the complete semantic artifact, then approve the meaning of its converted output. The useful deliverable is the Ossie document together with enough source and validation evidence to reproduce it. Try a prefilled example first, use a missing-dependency case to understand failure behavior, and reconcile a narrow business scope before making the model available to a new consumer.

## Frequently asked questions

### Can I convert a Cube model to Apache Ossie without Cube Cloud?

A compatible offline converter can consume a complete YAML model bundle without querying a running Cube deployment. The workbench's Cube example follows that file-based workflow. Include the cubes referenced by views and joins, and inspect the source notes for unsupported authoring constructs. If your model depends on generated JavaScript definitions or deployment-specific behavior, produce a supported representation or use an appropriate native workflow rather than assuming the browser executes that project code.

### Can I upload ordinary dbt model YAML?

The dbt import path described here expects compiled `semantic_manifest.json`, not arbitrary dbt model or schema YAML. Prepare the semantic artifact using a supported dbt environment and inspect it before uploading. The prefilled example lets you test the required representation without running your own project first. Generation and artifact behavior vary by dbt version, so use your version's documentation when locating the file.

### Does converting Power BI BIM translate DAX into SQL?

No. The offline BIM import maps supported model structures and reports native expressions that require review. DAX and Power Query definitions may remain in vendor-specific metadata, but this does not turn them into executable warehouse SQL. Decide how each required measure will be evaluated in the intended Ossie-compatible runtime, then validate its results. Do not remove a native-expression warning simply because a file was generated successfully.

### Is every export target also an import source?

No. Importers and exporters are independent implementations with different input contracts. Check the source-platform menu and its format notes for the direction you need. This tool's Snowflake and Hex entries are export-only; other platforms can have their own Ossie integration outside this workbench. A broader ecosystem announcement is not proof that a particular hosted converter accepts your source file.

### Are source files kept entirely in my browser?

Editing takes place in browser memory, while conversion sends the current files and settings to Datus servers. The public tool does not persist source models or generated results; download anything you need before leaving. Size and frequency limits apply. If your modeling definitions must remain inside your environment, choose a suitable upstream converter to run locally and review its dependencies and data handling before use.

## Related articles

- [Apache Ossie converters: YAML to dbt, Cube and more](/blog/apache-ossie-converters/) — the companion export workflow
- [Apache Ossie guide](/apache-ossie/) — the interchange standard
- [dbt Semantic Layer and MetricFlow](/blog/dbt-semantic-layer-metricflow/) — authoring and executing dbt semantics
- [Apache Ossie and Dosi quickstart](/blog/apache-ossie-dosi-quickstart/) — an execution walkthrough after conversion
- [Semantic model examples](/blog/semantic-model-examples/) — inspect model definitions and expected query results
