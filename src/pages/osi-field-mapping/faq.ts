import type { FaqItem } from "../../components/FAQ";
import type { Locale } from "../../i18n/config";

// Page-specific FAQ for /osi-field-mapping/. Content ported verbatim from the
// datus-design template (osi-mapping-full.tsx OSI_MAPPING_FAQS). Owned by this
// URL only; see datus-faq-spec.md.
const EN: FaqItem[] = [
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

const ZH: FaqItem[] = [
  {
    q: "LookML 的指标能用 OSI 表达吗？",
    a: "可以。每个 LookML measure 都能翻译成一个 OSI metric：type 对应 aggregation，sql 对应 expression，filters 对应 filter。LookML 的派生 measure（type: number 且引用其他字段）映射为 OSI 的派生指标，引用同一文件中其他指标的名称。",
  },
  {
    q: "OSI 支持 Snowflake Semantic Views 的 WITH SYNONYMS 和 AI_SQL_GENERATION 吗？",
    a: "支持——而且这正是 OSI 标准化力度最大的一层。维度或指标上的 WITH SYNONYMS 直接映射到 OSI 的 ai_context.synonyms；AI_SQL_GENERATION 与 AI_VERIFIED_QUERIES 都有一等公民的位置，任何厂商的 Agent 都能读到同一份 grounding 提示。",
  },
  {
    q: "OSI 怎么表示 Cube 的 joins[] 块？",
    a: "Cube 的 joins[] 条目对应 OSI 的 relationships[] 条目：joins[].sql 对应 foreign_key，joins[].relationship（many_to_one / one_to_many）对应 cardinality，目标 cube 对应 to_dataset。不需要推断，是 1:1 映射。",
  },
  {
    q: "MetricFlow 里有哪些东西是 OSI 目前表达不了的？",
    a: "OSI v0.2 覆盖了 MetricFlow 的全部核心结构——semantic_models、measures、dimensions、entities 以及顶层 metrics——但少数高级能力（saved queries、带 grain-to-date 的累计指标、部分转化指标选项）仍在演进中。Datus Playground 会把所有被丢弃的字段显式列出来，不会悄悄丢失。",
  },
  {
    q: "OSI 有对应 LookML dimension_group timeframes 的东西吗？",
    a: "OSI 把 LookML 的 dimension_group 收敛成单个时间字段，用 is_time: true 加上一个 granularity 值来表达。下游工具如果需要全部时间粒度（date、week、month、quarter、year），可以基于这个基础字段和粒度元数据自行生成——既保持了 OSI 的厂商中立，也没有丢信息。",
  },
  {
    q: "能做双向转换吗：MetricFlow → OSI → LookML？",
    a: "OSI 目前主要是交换与消费格式。从 MetricFlow 或 Cube 正向转成 OSI 支持得很好（见 Datus Playground）；反向转回 LookML 或 MetricFlow 原生 YAML 还在社区路线图上。实际做法是：大多数团队把 OSI 当作共享的读取层，编写仍留在各自的源头工具里。",
  },
  {
    q: "OSI 会支持 GoodData 的 MAQL 表达式吗？",
    a: "MAQL 通过 metrics[].expression.dialects[] 得以保留：原始 MAQL 字符串存放在自己的方言下，认得 GoodData 的消费方仍可执行它，不认得的消费方则回退到 SQL 方言。OSI 处理任何厂商专有表达式语言用的都是这套机制。",
  },
  {
    q: "Datus Playground 什么时候支持 MetricFlow 之外的转换？",
    a: "先做 MetricFlow → OSI，是因为 dbt 语义层 YAML 是最常见的起点。Cube 和 LookML 转换器是路线图上的下一步；也欢迎贡献——Playground 是 Apache 2.0 的，每个转换器都是纯浏览器端的函数。",
  },
];

export const osiFieldMappingFaq: Record<Locale, FaqItem[]> = { en: EN, zh: ZH };
