import type { FaqItem } from "../../components/FAQ";

// Page-specific FAQ for /osi-field-mapping/. Content ported verbatim from the
// datus-design template (osi-mapping-full.tsx OSI_MAPPING_FAQS). Owned by this
// URL only; see datus-faq-spec.md.
export const osiFieldMappingFaq: FaqItem[] = [
  {
    q: "Can LookML metrics be represented in OSI?",
    a: "Yes. Every LookML measure translates to an OSI metric: the type becomes aggregation, sql becomes expression, filters becomes filter. LookML's derived measures (type: number with references) map to OSI derived metrics that reference other metric names in the same file.",
  },
  {
    q: "Does OSI support Snowflake Semantic Views' WITH SYNONYMS and AI_SQL_GENERATION?",
    a: "Yes — this is the layer OSI standardizes most aggressively. WITH SYNONYMS on a dimension or metric maps directly to OSI's ai_context.synonyms; AI_SQL_GENERATION and AI_VERIFIED_QUERIES have first-class slots so agents from any vendor can read the same grounding hints.",
  },
  {
    q: "How does OSI represent Cube's joins[] block?",
    a: "Cube's joins[] entries become OSI relationships[] entries. joins[].sql becomes foreign_key, joins[].relationship (many_to_one / one_to_many) becomes cardinality, and the target cube becomes to_dataset. No inference required — the mapping is 1:1.",
  },
  {
    q: "Is there anything in MetricFlow that OSI can't express today?",
    a: "OSI v0.2 covers all core MetricFlow constructs — semantic_models, measures, dimensions, entities, top-level metrics — but a few advanced surfaces (saved queries, cumulative metrics with grain-to-date, some conversion metric options) are still evolving. The Datus Playground surfaces any dropped fields explicitly so nothing is lost silently.",
  },
  {
    q: "Does OSI have an equivalent to LookML's dimension_group timeframes?",
    a: "OSI collapses the LookML dimension_group into a single time field with is_time: true and a granularity value. Downstream tools that want all timeframes (date, week, month, quarter, year) generate them from the base field plus the granularity metadata, which keeps OSI vendor-neutral without losing information.",
  },
  {
    q: "Can I round-trip: MetricFlow → OSI → LookML?",
    a: "OSI is primarily an interchange and consumption format today. Forward conversion from MetricFlow or Cube into OSI is well supported (see the Datus Playground); back-conversion into LookML or MetricFlow-native YAML is on the community roadmap. In practice most teams treat OSI as the shared read layer and keep authoring in their source-of-truth tool.",
  },
  {
    q: "Will OSI ever support GoodData MAQL expressions?",
    a: "MAQL survives via metrics[].expression.dialects[]: the raw MAQL string is preserved under its own dialect, so a GoodData-aware consumer can still execute it while non-GoodData consumers fall back to the SQL dialect. This is the same mechanism OSI uses for any vendor-specific expression language.",
  },
  {
    q: "When will the Datus Playground support conversion beyond MetricFlow?",
    a: "MetricFlow → OSI shipped first because dbt semantic-layer YAML is the most common starting point. Cube and LookML converters are next on the roadmap; contributions are welcome — the Playground is Apache 2.0 and every converter is a pure browser-side function.",
  },
];
