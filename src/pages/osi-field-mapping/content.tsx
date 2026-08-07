import type { ReactNode } from "react";
import { InlineCode } from "../../components/catalog";
import { DOCS_URL } from "../../config/nav";
import { useHref } from "../../i18n/LocaleContext";
import type { Locale } from "../../i18n/config";
import {
  OSI_AI_CONTEXT_ROWS,
  OSI_DATASET_ROWS,
  OSI_DIMENSIONS_ROWS,
  OSI_METRICS_ROWS,
  OSI_RELATIONSHIPS_ROWS,
  OSI_TIME_ROWS,
  type MappingRow,
} from "./data";

/** Dotted-underline internal link (design's use-case link style). */
export function L({ href, children, external }: { href: string; children: ReactNode; external?: boolean }) {
  const l = useHref();
  return (
    <a
      href={external ? href : l(href)}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      style={{
        color: "var(--brand-bright)",
        textDecoration: "underline",
        textDecorationStyle: "dotted",
        textUnderlineOffset: 2,
      }}
    >
      {children}
    </a>
  );
}

export type Layer = {
  id: string;
  filename: string;
  title: string;
  description: string;
  rows: MappingRow[];
  commentary: ReactNode;
};

export interface OsiMappingCopy {
  hero: { eyebrow: string; heading: string; lead: string; stats: string[] };
  layerLabel: (i: number) => string;
  layers: Layer[];
  useCasesSection: { eyebrow: string; title: string; lead: string };
  useCases: { id: string; title: string; description: ReactNode }[];
  faqLead: string;
  closing: { heading: string; lead: string; cta: string };
}

const EN: OsiMappingCopy = {
  hero: {
    eyebrow: "OSI Field Mapping",
    heading: "OSI Field Mapping: every semantic layer, one spec",
    lead: "A field-by-field reference of how MetricFlow, Cube, LookML, AtScale, Snowflake Semantic Views, GoodData, Power BI and Databricks Metric Views translate onto the Open Semantic Interchange schema — the vendor-neutral wire format for the modern semantic layer.",
    stats: ["OSI v0.2.0.dev0", "8 products", "Apache 2.0"],
  },
  layerLabel: (i) => `Layer ${i + 1}`,
  layers: [
    {
      id: "dataset",
      filename: "osi-dataset-mapping.yaml",
      title: "1 · Dataset Layer (tables & sources)",
      description:
        "How each product names the physical table that backs a semantic object, and how OSI unifies those names under dataset.name + dataset.source.",
      rows: OSI_DATASET_ROWS,
      commentary: (
        <>
          The name of a semantic object varies wildly across tools — <strong>cube</strong>,{" "}
          <strong>view</strong>, <strong>semantic_model</strong>, a raw SQL alias — but every product
          ultimately points at one physical table. OSI collapses that into two fields:{" "}
          <strong>dataset.name</strong> for the logical identifier your metrics reference, and{" "}
          <strong>dataset.source</strong> for the exact table binding downstream consumers hit.
        </>
      ),
    },
    {
      id: "dimensions",
      filename: "osi-dimensions-mapping.yaml",
      title: "2 · Dimensions Layer (fields & attributes)",
      description:
        "Field-level metadata: names, expressions, labels, descriptions, and the two pieces most products lack — a time flag and an AI-context slot.",
      rows: OSI_DIMENSIONS_ROWS,
      commentary: (
        <>
          OSI's <strong>fields[].expression.dialects[]</strong> is the one place multi-dialect SQL can
          live natively — MetricFlow, Cube and LookML each assume a single dialect. And{" "}
          <strong>fields[].dimension.is_time</strong> is the only cross-product flag any consumer can
          rely on for time dimensions: no more sniffing LookML's <em>dimension_group</em>,
          MetricFlow's <em>type: time</em>, and Snowflake's raw SQL to guess the same thing three
          different ways.
        </>
      ),
    },
    {
      id: "metrics",
      filename: "osi-metrics-mapping.yaml",
      title: "3 · Metrics Layer (measures & aggregations)",
      description:
        "How each product describes aggregations, filters, and derived metrics — and how OSI pulls the aggregation out of the SQL string into a first-class field.",
      rows: OSI_METRICS_ROWS,
      commentary: (
        <>
          Snowflake Semantic Views and GoodData embed the aggregation inside the expression string (
          <InlineCode>AS SUM(...)</InlineCode>, <InlineCode>SELECT SUM({"{fact}"})</InlineCode>). OSI
          moves it out to <strong>metrics[].aggregation</strong> so agents and BI tools can reason
          about the operation without parsing SQL. Derived metrics that reference other metrics are
          preserved verbatim through <strong>metrics[].expression</strong>.
        </>
      ),
    },
    {
      id: "relationships",
      filename: "osi-relationships-mapping.yaml",
      title: "4 · Relationships Layer (joins)",
      description:
        "Where joins are declared and where they must be inferred. OSI hoists them into a first-class relationships[] block.",
      rows: OSI_RELATIONSHIPS_ROWS,
      commentary: (
        <>
          This is the most inconsistent layer across the six products. MetricFlow and AtScale derive
          joins from <em>entities</em> / <em>level bindings</em>; Cube and LookML declare them inline;
          Snowflake and GoodData sit in between. OSI's <strong>relationships[]</strong> block gives
          every consumer the same four fields — name, from_dataset, to_dataset, foreign_key — plus
          explicit <strong>cardinality</strong>, which only Cube and LookML currently declare.
        </>
      ),
    },
    {
      id: "time",
      filename: "osi-time-mapping.yaml",
      title: "5 · Time Semantics Layer (granularity)",
      description:
        "How each product marks a time dimension and expresses granularity. OSI's is_time + granularity is the smallest common denominator.",
      rows: OSI_TIME_ROWS,
      commentary: (
        <>
          LookML's <strong>dimension_group</strong> with <em>timeframes</em> is the most complete;
          Snowflake leaves time entirely to SQL. OSI collapses this into a single time field with{" "}
          <strong>is_time: true</strong> and a <strong>granularity</strong> value — downstream tools
          that want day / week / month / quarter / year can generate them from the base field plus
          granularity metadata, so nothing is lost and every consumer can test one flag.
        </>
      ),
    },
    {
      id: "ai-context",
      filename: "osi-ai-context-mapping.yaml",
      title: "6 · AI Context Layer (OSI's differentiator)",
      description:
        "The one layer where OSI leads the ecosystem. Only Snowflake Semantic Views has native equivalents today.",
      rows: OSI_AI_CONTEXT_ROWS,
      commentary: (
        <>
          This is the layer OSI was built for. Snowflake shipped <strong>WITH SYNONYMS</strong>,{" "}
          <strong>AI_SQL_GENERATION</strong> and <strong>AI_VERIFIED_QUERIES</strong> in 2026 — and no
          other mainstream semantic layer has an equivalent yet. OSI standardizes those hints into{" "}
          <strong>ai_context</strong> on every field and metric, so an agent reading OSI can find
          synonyms, natural-language names and verified sample queries the same way whether the source
          stack is Snowflake, Cube or a home-grown YAML store. When downstream tools adopt OSI, the
          AI-grounding metadata travels with the metric — instead of being locked inside one vendor's
          SQL dialect.
        </>
      ),
    },
  ],
  useCasesSection: {
    eyebrow: "Use cases",
    title: "What OSI enables for data teams",
    lead: "Four patterns teams unlock once their semantic layer speaks one vendor-neutral format — from the terminal to the chat interface.",
  },
  useCases: [
    {
      id: "one-metric-every-tool",
      title: "One metric definition across every BI tool",
      description: (
        <>
          OSI turns <InlineCode>metrics[].aggregation</InlineCode>, <InlineCode>fields[]</InlineCode>{" "}
          and <InlineCode>relationships[]</InlineCode> into a vendor-neutral contract. The same revenue
          or retention definition ships to Cube, Looker, Metabase and a Python notebook without silent
          drift. Validate conversions in the <L href="/tools/osi-playground/">OSI Playground</L>.
        </>
      ),
    },
    {
      id: "ground-ai-agents",
      title: "Ground AI agents in business semantics",
      description: (
        <>
          Synonyms, natural-language labels and verified sample queries live in{" "}
          <InlineCode>ai_context</InlineCode> on every field and metric.{" "}
          <L href="/chatbot/">Datus-Chat</L> and the <L href="/models/">model layer</L> read the same
          grounding, so "ARR" resolves to annual recurring revenue — not an airport code.
        </>
      ),
    },
    {
      id: "move-between-layers",
      title: "Move between semantic layers without rewriting",
      description: (
        <>
          Author in MetricFlow, Cube or LookML, then export to OSI as the shared interchange.{" "}
          <L href={DOCS_URL} external>Data engineers</L> keep their source-of-truth tool while
          downstream consumers read one consistent schema — generated and reviewed from the{" "}
          <L href="/products/cli/">CLI</L>.
        </>
      ),
    },
    {
      id: "catch-drift-early",
      title: "Catch schema drift before dashboards break",
      description: (
        <>
          Diff two OSI files to see exactly which <InlineCode>dataset.source</InlineCode>,{" "}
          <InlineCode>relationships[]</InlineCode> or <InlineCode>metrics[].filter</InlineCode> changed.
          Governance checks run against the spec from the <L href="/products/cli/">CLI</L>, not against
          vendor-specific YAML. See how this fits into <L href={DOCS_URL} external>Datus features</L>.
        </>
      ),
    },
  ],
  faqLead:
    "LookML, Snowflake AI context, Cube joins, dimension_group timeframes, round-tripping and MAQL — how OSI handles each.",
  closing: {
    heading: "Try the OSI Playground.",
    lead: "Paste your MetricFlow YAML, get OSI back — validation, conversion and diff all run in your browser.",
    cta: "Open OSI Playground",
  },
};

const ZH: OsiMappingCopy = {
  hero: {
    eyebrow: "OSI 字段映射",
    heading: "OSI 字段映射：所有语义层，同一份规范",
    lead: "一份逐字段的对照参考：MetricFlow、Cube、LookML、AtScale、Snowflake Semantic Views、GoodData、Power BI 与 Databricks Metric Views 如何翻译到 Open Semantic Interchange schema——现代语义层的厂商中立传输格式。",
    stats: ["OSI v0.2.0.dev0", "8 款产品", "Apache 2.0"],
  },
  layerLabel: (i) => `第 ${i + 1} 层`,
  layers: [
    {
      id: "dataset",
      filename: "osi-dataset-mapping.yaml",
      title: "1 · 数据集层（表与数据源）",
      description:
        "各家产品如何命名支撑某个语义对象的物理表，以及 OSI 如何把这些名字统一到 dataset.name + dataset.source 之下。",
      rows: OSI_DATASET_ROWS,
      commentary: (
        <>
          语义对象的叫法在各家工具里差别极大——<strong>cube</strong>、<strong>view</strong>、
          <strong>semantic_model</strong>，或者一个裸 SQL 别名——但最终每家都指向同一张物理表。
          OSI 把它收敛成两个字段：<strong>dataset.name</strong> 是指标引用的逻辑标识，
          <strong>dataset.source</strong> 则是下游消费方真正打到的那张表。
        </>
      ),
    },
    {
      id: "dimensions",
      filename: "osi-dimensions-mapping.yaml",
      title: "2 · 维度层（字段与属性）",
      description:
        "字段级元数据：名称、表达式、标签、描述，以及大多数产品缺失的两样东西——时间标记与 AI 上下文槽位。",
      rows: OSI_DIMENSIONS_ROWS,
      commentary: (
        <>
          OSI 的 <strong>fields[].expression.dialects[]</strong> 是唯一能原生容纳多方言 SQL 的地方——
          MetricFlow、Cube 和 LookML 都默认只有一种方言。而
          <strong>fields[].dimension.is_time</strong> 是消费方唯一能依赖的跨产品时间维度标记：
          不必再分别去嗅 LookML 的 <em>dimension_group</em>、MetricFlow 的 <em>type: time</em> 和
          Snowflake 的裸 SQL，用三种方式去猜同一件事。
        </>
      ),
    },
    {
      id: "metrics",
      filename: "osi-metrics-mapping.yaml",
      title: "3 · 指标层（度量与聚合）",
      description:
        "各家产品如何描述聚合、过滤条件与派生指标——以及 OSI 如何把聚合从 SQL 字符串里拎出来，变成一等字段。",
      rows: OSI_METRICS_ROWS,
      commentary: (
        <>
          Snowflake Semantic Views 和 GoodData 把聚合埋在表达式字符串里（
          <InlineCode>AS SUM(...)</InlineCode>、<InlineCode>SELECT SUM({"{fact}"})</InlineCode>）。OSI
          把它提到 <strong>metrics[].aggregation</strong>，这样 Agent 和 BI 工具不解析 SQL 也能理解这个运算。
          引用其他指标的派生指标，则通过 <strong>metrics[].expression</strong> 原样保留。
        </>
      ),
    },
    {
      id: "relationships",
      filename: "osi-relationships-mapping.yaml",
      title: "4 · 关系层（Join）",
      description:
        "Join 在哪里声明、在哪里只能靠推断。OSI 把它们提升成一等的 relationships[] 块。",
      rows: OSI_RELATIONSHIPS_ROWS,
      commentary: (
        <>
          这是六款产品里最不一致的一层。MetricFlow 和 AtScale 从 <em>entities</em> /
          <em>level bindings</em> 推导 join；Cube 和 LookML 直接内联声明；Snowflake 和 GoodData 介于两者之间。
          OSI 的 <strong>relationships[]</strong> 块给所有消费方同样的四个字段——name、from_dataset、
          to_dataset、foreign_key——外加显式的 <strong>cardinality</strong>，目前只有 Cube 和 LookML 会声明它。
        </>
      ),
    },
    {
      id: "time",
      filename: "osi-time-mapping.yaml",
      title: "5 · 时间语义层（粒度）",
      description:
        "各家产品如何标记时间维度、如何表达粒度。OSI 的 is_time + granularity 是最小公约数。",
      rows: OSI_TIME_ROWS,
      commentary: (
        <>
          LookML 带 <em>timeframes</em> 的 <strong>dimension_group</strong> 最完整；Snowflake 则把时间完全丢给 SQL。
          OSI 把这一层收敛成单个时间字段，带 <strong>is_time: true</strong> 和一个
          <strong>granularity</strong> 值——下游若需要日 / 周 / 月 / 季 / 年，可以基于基础字段加粒度元数据自行生成，
          信息不丢，而每个消费方只需判断一个标记。
        </>
      ),
    },
    {
      id: "ai-context",
      filename: "osi-ai-context-mapping.yaml",
      title: "6 · AI 上下文层（OSI 的差异点）",
      description:
        "OSI 在整个生态里领先的一层。目前只有 Snowflake Semantic Views 有原生对应能力。",
      rows: OSI_AI_CONTEXT_ROWS,
      commentary: (
        <>
          这正是 OSI 被造出来要解决的一层。Snowflake 在 2026 年发布了 <strong>WITH SYNONYMS</strong>、
          <strong>AI_SQL_GENERATION</strong> 与 <strong>AI_VERIFIED_QUERIES</strong>——至今还没有第二家主流语义层有对应能力。
          OSI 把这些提示标准化到每个字段和指标的 <strong>ai_context</strong> 里，于是读取 OSI 的 Agent
          无论源头是 Snowflake、Cube 还是自研 YAML 存储，都能用同一种方式找到同义词、自然语言名称和已验证的示例查询。
          当下游工具采纳 OSI 后，这些 AI grounding 元数据会跟着指标一起走——而不是被锁死在某一家厂商的 SQL 方言里。
        </>
      ),
    },
  ],
  useCasesSection: {
    eyebrow: "使用场景",
    title: "OSI 为数据团队带来了什么",
    lead: "语义层一旦讲同一种厂商中立的格式，团队就能解锁四类模式——从终端一路到对话界面。",
  },
  useCases: [
    {
      id: "one-metric-every-tool",
      title: "一份指标定义，通吃所有 BI 工具",
      description: (
        <>
          OSI 把 <InlineCode>metrics[].aggregation</InlineCode>、<InlineCode>fields[]</InlineCode> 和{" "}
          <InlineCode>relationships[]</InlineCode> 变成厂商中立的契约。同一份营收或留存定义可以同时下发到
          Cube、Looker、Metabase 和 Python Notebook，不会悄悄跑偏。转换结果可以在
          <L href="/tools/osi-playground/">OSI Playground</L> 里校验。
        </>
      ),
    },
    {
      id: "ground-ai-agents",
      title: "把 AI Agent 锚定在业务语义上",
      description: (
        <>
          同义词、自然语言标签和已验证的示例查询，都存放在每个字段与指标的{" "}
          <InlineCode>ai_context</InlineCode> 里。<L href="/chatbot/">Datus-Chat</L> 和
          <L href="/models/">模型层</L>读的是同一份 grounding，所以「ARR」会被解析成年度经常性收入，
          而不是某个机场代码。
        </>
      ),
    },
    {
      id: "move-between-layers",
      title: "在语义层之间迁移，不用重写",
      description: (
        <>
          在 MetricFlow、Cube 或 LookML 里编写，再导出成 OSI 作为共享交换格式。
          <L href={DOCS_URL} external>数据工程师</L>继续用自己的源头工具，而下游消费方读到的是一份一致的 schema——
          生成与评审都可以从 <L href="/products/cli/">CLI</L> 完成。
        </>
      ),
    },
    {
      id: "catch-drift-early",
      title: "在看板坏掉之前发现 Schema 漂移",
      description: (
        <>
          对比两份 OSI 文件，就能精确看到哪些 <InlineCode>dataset.source</InlineCode>、
          <InlineCode>relationships[]</InlineCode> 或 <InlineCode>metrics[].filter</InlineCode> 变了。
          治理检查是从 <L href="/products/cli/">CLI</L> 针对这份规范跑的，而不是针对某家厂商的 YAML。
          它在整体中的位置见 <L href={DOCS_URL} external>Datus 功能介绍</L>。
        </>
      ),
    },
  ],
  faqLead:
    "LookML、Snowflake AI 上下文、Cube 的 join、dimension_group timeframes、双向转换与 MAQL——OSI 各是怎么处理的。",
  closing: {
    heading: "去试试 OSI Playground。",
    lead: "贴进你的 MetricFlow YAML，拿回 OSI——校验、转换与 diff 全部在浏览器里完成。",
    cta: "打开 OSI Playground",
  },
};

export const osiMappingPage: Record<Locale, OsiMappingCopy> = { en: EN, zh: ZH };
