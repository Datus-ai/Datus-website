import type { ReactNode } from "react";
import { InlineCode } from "../../components/catalog";

// Field-by-field mapping content ported verbatim from the datus-design
// /osi-field-mapping template (osi-mapping-full.tsx). One column for the OSI
// field + eight products. Rendered as vertical field cards (see Page.tsx) to
// avoid a 9-wide horizontal-scroll table.

export type MappingColumn = { label: string };
export type MappingRow = { key: string; cells: ReactNode[] };

export const OSI_MAPPING_COLUMNS: MappingColumn[] = [
  { label: "OSI Field" },
  { label: "MetricFlow" },
  { label: "Cube" },
  { label: "AtScale (SML)" },
  { label: "LookML" },
  { label: "Snowflake Sem. View" },
  { label: "GoodData" },
  { label: "Power BI (TMDL)" },
  { label: "Databricks Metric View" },
];

const row = (key: string, cells: ReactNode[]): MappingRow => ({ key, cells });
const c = (s: string) => <InlineCode>{s}</InlineCode>;
const na = <span style={{ color: "var(--ink-faint)" }}>—</span>;

// ─── 1. Dataset layer ───
export const OSI_DATASET_ROWS: MappingRow[] = [
  row("dataset.name", [
    c("dataset.name"),
    c("semantic_model.name"),
    c("cubes[].name"),
    "dimension / dataset file name",
    c("view: view_name"),
    c("TABLES (alias AS …)"),
    c("dataset.id"),
    c("table 'Name'"),
    c("CREATE METRIC VIEW name"),
  ]),
  row("dataset.source", [
    c("dataset.source"),
    <>model's <InlineCode>ref()</InlineCode> or source YAML</>,
    c("cubes[].sql_table"),
    c("dataset.source"),
    <><InlineCode>sql_table_name</InlineCode> / <InlineCode>derived_table</InlineCode></>,
    c("TABLES (alias AS db.schema.table)"),
    <>connection + <InlineCode>dataset</InlineCode> mapping</>,
    <><InlineCode>partition.source</InlineCode> (M / SQL)</>,
    <><InlineCode>source: catalog.schema.table</InlineCode></>,
  ]),
  row("dataset.primary_key", [
    c("dataset.primary_key"),
    <><InlineCode>entities[]</InlineCode> with <InlineCode>type: primary</InlineCode></>,
    <><InlineCode>dimensions[]</InlineCode> with <InlineCode>primary_key: true</InlineCode></>,
    c("level_attributes[].key_columns"),
    <><InlineCode>dimension:</InlineCode> + <InlineCode>primary_key: yes</InlineCode></>,
    c("PRIMARY KEY (col)"),
    <>implicit via <InlineCode>attribute</InlineCode> labels</>,
    <><InlineCode>column.isKey: true</InlineCode></>,
    "declared on source table (not in metric view)",
  ]),
  row("dataset.description", [
    c("dataset.description"),
    c("semantic_model.description"),
    "in-code comment (no standard field)",
    "dataset description",
    "view-level comment",
    c("COMMENT = '…'"),
    c("dataset.description"),
    c("table.description"),
    c("COMMENT '…'"),
  ]),
];

// ─── 2. Dimensions layer ───
export const OSI_DIMENSIONS_ROWS: MappingRow[] = [
  row("fields[].name", [
    c("fields[].name"),
    c("dimensions[].name"),
    c("dimensions[].name"),
    c("dimension.unique_name"),
    c("dimension: field_name"),
    c("DIMENSIONS (table.dim AS …)"),
    <><InlineCode>attribute.id</InlineCode> + <InlineCode>label.id</InlineCode></>,
    c("column.name"),
    c("dimensions[].name"),
  ]),
  row("fields[].expression", [
    c("fields[].expression.dialects[]"),
    <><InlineCode>dimensions[].expr</InlineCode> (single dialect)</>,
    <><InlineCode>dimensions[].sql</InlineCode> (single dialect)</>,
    c("level_attribute.column"),
    c("dimension: { sql: ${TABLE}.col }"),
    c("DIMENSIONS (… AS sql_expr)"),
    c("label.source_column"),
    <><InlineCode>column.sourceColumn</InlineCode> or DAX calc column</>,
    <><InlineCode>dimensions[].expr</InlineCode> (SQL)</>,
  ]),
  row("fields[].dimension.is_time", [
    c("fields[].dimension.is_time"),
    <><InlineCode>type: time</InlineCode> + <InlineCode>time_granularity</InlineCode></>,
    c("type: time"),
    c("type: TIME"),
    <><InlineCode>dimension_group</InlineCode> + timeframes</>,
    "no flag — SQL expression only",
    <>no flag — <InlineCode>attribute</InlineCode> only</>,
    <><InlineCode>dataType: dateTime</InlineCode> + mark-as-date-table</>,
    "no flag — inferred from column type",
  ]),
  row("fields[].label", [
    c("fields[].label"),
    c("dimensions[].label"),
    c("dimensions[].title"),
    c("level_attribute.label"),
    c("dimension.label"),
    "no dedicated field (use COMMENT)",
    c("label.title"),
    "column name doubles as label",
    c("dimensions[].label"),
  ]),
  row("fields[].description", [
    c("fields[].description"),
    c("dimensions[].description"),
    c("dimensions[].description"),
    c("level_attribute.description"),
    c("dimension.description"),
    c("COMMENT = '…'"),
    c("attribute.description"),
    c("column.description"),
    c("dimensions[].comment"),
  ]),
  row("fields[].ai_context", [
    c("fields[].ai_context"),
    na, na, na, na,
    c("WITH SYNONYMS = ('…')"),
    na,
    <><InlineCode>column.synonyms</InlineCode> (Q&amp;A)</>,
    "Genie-space instructions (external)",
  ]),
  row("fields[].custom_extensions", [
    c("fields[].custom_extensions"),
    c("dimensions[].type_params"),
    c("dimensions[].meta"),
    <><InlineCode>dimension.type</InlineCode> / <InlineCode>format</InlineCode></>,
    <><InlineCode>tags</InlineCode> / <InlineCode>group_label</InlineCode></>,
    c("WITH TAG (…)"),
    c("label.value_type"),
    c("annotations[]"),
    "column tags on source table",
  ]),
];

// ─── 3. Metrics layer ───
export const OSI_METRICS_ROWS: MappingRow[] = [
  row("metrics[].name", [
    c("metrics[].name"),
    c("measures[].name"),
    c("measures[].name"),
    c("metric.unique_name"),
    c("measure: field_name"),
    c("METRICS (table.metric AS …)"),
    c("metric.id"),
    c("measure.name"),
    c("measures[].name"),
  ]),
  row("metrics[].aggregation", [
    c("metrics[].aggregation"),
    <><InlineCode>measures[].agg</InlineCode> (sum, count_distinct…)</>,
    <><InlineCode>measures[].type</InlineCode> (sum, avg…)</>,
    c("metric.aggregation_type"),
    c("measure: { type: sum }"),
    <>inline in SQL (<InlineCode>SUM(...)</InlineCode>)</>,
    "inline in MAQL",
    <>inline in DAX (<InlineCode>SUM(...)</InlineCode>)</>,
    <>inline in SQL (<InlineCode>SUM(...)</InlineCode>)</>,
  ]),
  row("metrics[].expression", [
    c("metrics[].expression"),
    c("measures[].expr"),
    c("measures[].sql"),
    c("metric.expression"),
    c("measure: { sql: ${TABLE}.col }"),
    c("METRICS (… AS sql_expr)"),
    c("metric.maql"),
    <><InlineCode>measure.expression</InlineCode> (DAX)</>,
    <><InlineCode>measures[].expr</InlineCode> (SQL)</>,
  ]),
  row("metrics[].description", [
    c("metrics[].description"),
    c("measures[].description"),
    c("measures[].description"),
    c("metric.description"),
    c("measure.description"),
    c("COMMENT = '…'"),
    c("metric.description"),
    c("measure.description"),
    c("measures[].comment"),
  ]),
  row("metrics[].filter", [
    c("metrics[].filter"),
    c("measures[].filter"),
    c("measures[].filters[]"),
    c("metric.filter"),
    c("measure: { filters: [...] }"),
    "inline in SQL WHERE",
    "MAQL WHERE clause",
    <>DAX <InlineCode>CALCULATE(..., filter)</InlineCode></>,
    <>inline SQL <InlineCode>WHERE</InlineCode> in measure expr</>,
  ]),
  row("metrics[].label", [
    c("metrics[].label"),
    c("measures[].label"),
    c("measures[].title"),
    c("metric.label"),
    c("measure.label"),
    na,
    c("metric.title"),
    "measure name doubles as label",
    c("measures[].label"),
  ]),
  row("derived-metrics", [
    "composite / derived",
    <><InlineCode>metrics:</InlineCode> block (ratio, derived)</>,
    <><InlineCode>measures[].sql</InlineCode> referencing other measures</>,
    "metric referencing metric",
    c("type: number, sql: ${m1}/${m2}"),
    "nested SQL only",
    <><InlineCode>metric.maql</InlineCode> referencing other metrics</>,
    "DAX measure referencing other measures",
    <><InlineCode>MEASURE(name)</InlineCode> reference in metric view</>,
  ]),
  row("metrics[].ai_context", [
    c("metrics[].ai_context"),
    na, na, na, na,
    c("WITH SYNONYMS = ('…')"),
    na,
    <><InlineCode>measure.synonyms</InlineCode> (Q&amp;A)</>,
    "Genie certified instructions (external)",
  ]),
];

// ─── 4. Relationships layer ───
export const OSI_RELATIONSHIPS_ROWS: MappingRow[] = [
  row("relationships[].name", [
    c("relationships[].name"),
    <>derived from <InlineCode>entity.name</InlineCode></>,
    c("joins[].name"),
    "dimension-to-fact binding (implicit)",
    "join's view name",
    c("RELATIONSHIPS (name AS …)"),
    <>dataset <InlineCode>reference</InlineCode> declaration</>,
    c("relationship.name"),
    c("joins[].name"),
  ]),
  row("from-to-dataset", [
    <><InlineCode>from_dataset</InlineCode> / <InlineCode>to_dataset</InlineCode></>,
    <>model + <InlineCode>entity.type: foreign</InlineCode></>,
    <>cube + <InlineCode>joins[].name</InlineCode></>,
    "fact → dimension binding",
    "current view + joined view",
    c("table_a (col) REFERENCES table_b"),
    "current + referenced dataset",
    <><InlineCode>fromTable</InlineCode> / <InlineCode>toTable</InlineCode></>,
    <>metric view + <InlineCode>joins[].source</InlineCode></>,
  ]),
  row("relationships[].foreign_key", [
    c("relationships[].foreign_key"),
    c("entities[].expr"),
    c("joins[].sql"),
    "FK column on fact dataset",
    c("join: { sql_on: ${a}.fk = ${b}.pk }"),
    "FK column in REFERENCES",
    "reference key in dataset fields",
    <><InlineCode>fromColumn</InlineCode> / <InlineCode>toColumn</InlineCode></>,
    c("joins[].on (SQL predicate)"),
  ]),
  row("relationships[].cardinality", [
    c("relationships[].cardinality"),
    "inferred from entity type",
    <><InlineCode>joins[].relationship</InlineCode></>,
    "not declared",
    c("relationship: many_to_one"),
    "not declared",
    "not declared",
    <><InlineCode>cardinality: manyToOne</InlineCode></>,
    "not declared",
  ]),
];

// ─── 5. Time semantics layer ───
export const OSI_TIME_ROWS: MappingRow[] = [
  row("is_time flag", [
    c("fields[].dimension.is_time"),
    c("type: time"),
    c("type: time"),
    c("type: TIME"),
    c("dimension_group: { type: time }"),
    "no flag",
    "no flag",
    <><InlineCode>dataType: dateTime</InlineCode> + date table</>,
    "no flag (TIMESTAMP column type)",
  ]),
  row("granularity", [
    c("fields[].dimension.granularity"),
    c("time_granularity: day"),
    c("dimensions[].granularity"),
    "hierarchy levels[]",
    c("timeframes: [date, week, month]"),
    <>SQL only (<InlineCode>DATE_TRUNC(...)</InlineCode>)</>,
    "MAQL date semantics only",
    "date-table hierarchy (Year / Qtr / Month / Day)",
    <>SQL only (<InlineCode>DATE_TRUNC(...)</InlineCode>)</>,
  ]),
];

// ─── 6. AI Context layer ───
export const OSI_AI_CONTEXT_ROWS: MappingRow[] = [
  row("field-synonyms", [
    c("fields[].ai_context"),
    na, na, na, na,
    c("WITH SYNONYMS = ('…')"),
    na,
    c("column.synonyms (Q&A)"),
    na,
  ]),
  row("metric-synonyms", [
    c("metrics[].ai_context"),
    na, na, na, na,
    c("WITH SYNONYMS = ('…')"),
    na,
    c("measure.synonyms (Q&A)"),
    na,
  ]),
  row("ai-instructions", [
    "AI instruction block",
    na,
    "external Cube AI API",
    na,
    na,
    c("AI_SQL_GENERATION '<instr>'"),
    na,
    "linguistic schema (.lsdl)",
    "Genie-space instructions",
  ]),
  row("verified-queries", [
    "verified sample block",
    na, na, na, na,
    c("AI_VERIFIED_QUERIES (…)"),
    na,
    "Q&A featured questions",
    "Genie certified example queries",
  ]),
];
