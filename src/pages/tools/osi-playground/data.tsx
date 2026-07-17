import type { SpecTableRow } from "../../../components/catalog";
import { InlineCode } from "../../../components/catalog";

// Tables ported verbatim from the datus-design /tools/osi-playground template
// (osi-mapping.tsx). Rendered with catalog.SpecTable.

export const OSI_MAPPING_ROWS: SpecTableRow[] = [
  {
    key: "semantic_models",
    cells: [
      <InlineCode key="l">semantic_models[]</InlineCode>,
      <InlineCode key="r">entities[]</InlineCode>,
      "One MetricFlow semantic_model becomes one OSI entity — same name, same description.",
    ],
  },
  {
    key: "model_ref",
    cells: [
      <InlineCode key="l">model: ref('fct_orders')</InlineCode>,
      <InlineCode key="r">table: fct_orders</InlineCode>,
      "The dbt ref() wrapper is stripped; the raw table name is used as the OSI table binding.",
    ],
  },
  {
    key: "entities",
    cells: [
      <InlineCode key="l">entities[]</InlineCode>,
      <InlineCode key="r">join_keys[]</InlineCode>,
      "primary / foreign / natural key semantics are preserved verbatim.",
    ],
  },
  {
    key: "dimensions",
    cells: [
      <InlineCode key="l">dimensions[]</InlineCode>,
      <InlineCode key="r">dimensions[]</InlineCode>,
      "type is normalized to categorical / time / numeric; time_granularity moves to granularity.",
    ],
  },
  {
    key: "measures",
    cells: [
      <InlineCode key="l">measures[]</InlineCode>,
      <InlineCode key="r">metrics[] (type = agg)</InlineCode>,
      "MetricFlow measures become OSI metrics; agg becomes the metric type (sum, count, average…).",
    ],
  },
  {
    key: "top_metrics",
    cells: [
      <InlineCode key="l">metrics[] (top-level)</InlineCode>,
      <InlineCode key="r">metrics[] (on entity)</InlineCode>,
      "simple / ratio / cumulative / derived types survive; the referenced measure resolves onto its owning entity.",
    ],
  },
];

export const OSI_VS_ROWS: SpecTableRow[] = [
  {
    key: "scope",
    cells: ["Scope", "Interchange format", "Semantic layer + engine", "Semantic layer + engine + API"],
  },
  {
    key: "runs_queries",
    cells: ["Runs queries", "No — spec only", "Yes (via dbt SQL)", "Yes (via Cube API)"],
  },
  {
    key: "vendor",
    cells: ["Vendor", "Neutral (Snowflake · dbt · Salesforce · …)", "dbt Labs", "Cube Dev"],
  },
  {
    key: "consumers",
    cells: [
      "Primary consumers",
      "BI + AI tools that share a definition",
      "dbt projects + MetricFlow-aware tools",
      "BI dashboards, embedded analytics, LLM apps",
    ],
  },
  {
    key: "license",
    cells: ["License", "Apache 2.0", "Apache 2.0", "Apache 2.0"],
  },
  {
    key: "maturity",
    cells: ["Maturity", "Draft v0.2 (2026)", "GA", "GA"],
  },
];
