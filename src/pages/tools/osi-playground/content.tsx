import type { ReactNode } from "react";
import type { Locale } from "../../../i18n/config";

export interface OsiPlaygroundCopy {
  hero: { eyebrow: string; heading: string; lead: string; stats: string[] };
  breadcrumbTools: string;
  overview: { eyebrow: string; title: string; lead: string; prose: ReactNode[] };
  mapping: {
    eyebrow: string;
    title: string;
    lead: string;
    columns: [string, string, string];
    linkBefore: string;
    linkLabel: string;
    linkAfter: string;
  };
  howTo: {
    eyebrow: string;
    title: string;
    lead: string;
    schemaName: string;
    schemaDescription: string;
    steps: { title: string; description: string }[];
  };
  why: { eyebrow: string; title: string; lead: string; items: { title: string; description: string }[] };
  comparison: { eyebrow: string; title: string; lead: string; columns: [string, string, string, string] };
  faqLead: string;
  closing: { heading: string; lead: string; featuresCta: string; mappingCta: string };
}

const EN: OsiPlaygroundCopy = {
  hero: {
    eyebrow: "OSI Playground",
    heading: "The Open-Source OSI Playground for MetricFlow",
    lead: "Validate MetricFlow YAML against the Open Semantic Interchange spec, convert it to OSI in one click, and diff the two formats side-by-side. Runs entirely in your browser — no upload, no signup.",
    stats: ["OSI v0.2.0.dev0", "Browser-only", "Apache 2.0"],
  },
  breadcrumbTools: "Tools",
  overview: {
    eyebrow: "Overview",
    title: "What Is the Open Semantic Interchange?",
    lead: "OSI is a vendor-neutral YAML specification for semantic-layer metadata — a shared way for warehouses, BI tools and AI agents to talk about the same metric without redefining it in every product.",
    prose: [
      <>
        Launched in 2025 by Snowflake, dbt Labs, Salesforce, ThoughtSpot and other members of the
        modern data stack, OSI standardizes how <strong>entities</strong>, <strong>dimensions</strong>,{" "}
        <strong>metrics</strong> and <strong>join keys</strong> are described. Once a metric like{" "}
        <em>revenue</em> is defined in OSI, Cortex, Cube, Looker, AtScale and Datus can all read the
        same source of truth.
      </>,
      <>
        The current draft is <strong>v0.2.0.dev0</strong>. It targets an eventual 1.0 alongside
        production adoption in Snowflake Cortex and dbt semantic-layer exports.
      </>,
    ],
  },
  mapping: {
    eyebrow: "Mapping",
    title: "MetricFlow → OSI Field Mapping",
    lead: "How every MetricFlow construct is translated into the OSI core schema. The Converter above uses exactly this table — nothing hidden. See the full 8-product mapping in the OSI Field Mapping reference.",
    columns: ["MetricFlow", "OSI", "Notes"],
    linkBefore: "Want every product side-by-side? ",
    linkLabel: "Read the OSI Field Mapping reference",
    linkAfter:
      " — MetricFlow, Cube, LookML, AtScale, Snowflake, GoodData, Power BI and Databricks across six layers.",
  },
  howTo: {
    eyebrow: "How to",
    title: "How to Convert MetricFlow to OSI",
    lead: "Three steps, browser only — no CLI to install, no key to paste.",
    schemaName: "Convert MetricFlow YAML to Open Semantic Interchange",
    schemaDescription:
      "Free browser-based workflow to validate, convert and diff a MetricFlow semantic layer into OSI YAML using the Datus Playground.",
    steps: [
      {
        title: "Paste your MetricFlow YAML",
        description:
          "Drop your semantic_models file into the input on the left. The Playground parses locally — nothing leaves your browser.",
      },
      {
        title: "Convert to OSI",
        description:
          "Open the Converter tab, click Download, and you have an OSI-compatible .yml file ready to hand to any OSI-aware tool.",
      },
      {
        title: "Diff and validate",
        description:
          "Use the Diff tab to see exactly what changed, then the Validator to confirm the output matches OSI v0.2 before you commit it.",
      },
    ],
  },
  why: {
    eyebrow: "Why it matters",
    title: "Why an Open Semantic Standard Matters",
    lead: "Four concrete wins your data team gets the day a metric definition stops living inside a single vendor's YAML.",
    items: [
      {
        title: "One definition, every tool",
        description:
          "Define 'weekly active users' once. Snowflake Cortex, Cube, Looker and the Datus agent all read the same OSI file — no more three answers for the same question.",
      },
      {
        title: "AI agents that don't hallucinate metrics",
        description:
          "OSI is the missing grounding layer for LLM copilots. When your agent reads OSI, it stops inventing join keys and starts quoting the semantic layer verbatim.",
      },
      {
        title: "Zero-lock migration path",
        description:
          "Author metrics in dbt MetricFlow today, export to OSI, and consume them from any downstream tool tomorrow. The interchange format decouples authoring from consumption.",
      },
      {
        title: "Governance stays where it belongs",
        description:
          "Reviewed pull requests, lineage and ownership live in the source YAML. OSI carries the same names into every consumer, so downstream tools show the same governance metadata.",
      },
    ],
  },
  comparison: {
    eyebrow: "Comparison",
    title: "OSI vs MetricFlow vs Cube",
    lead: "Interchange formats, engines and platforms solve different problems. Here is where each one fits.",
    columns: ["Dimension", "OSI", "MetricFlow", "Cube"],
  },
  faqLead:
    "What OSI is, how the converter works, whether your YAML stays local, and how Datus uses OSI internally.",
  closing: {
    heading: "Let a data engineering agent read your OSI.",
    lead: "Datus grounds every SQL query, pipeline and dashboard answer in your semantic layer — OSI, MetricFlow, Cube or LookML, take your pick.",
    featuresCta: "See Datus features",
    mappingCta: "OSI field mapping",
  },
};

const ZH: OsiPlaygroundCopy = {
  hero: {
    eyebrow: "OSI Playground",
    heading: "面向 MetricFlow 的开源 OSI Playground",
    lead: "按 Open Semantic Interchange 规范校验 MetricFlow YAML，一键转换成 OSI，并左右对比两种格式的差异。全程在浏览器里运行——不上传，也不用注册。",
    stats: ["OSI v0.2.0.dev0", "纯浏览器运行", "Apache 2.0"],
  },
  breadcrumbTools: "工具",
  overview: {
    eyebrow: "概览",
    title: "什么是 Open Semantic Interchange？",
    lead: "OSI 是一份面向语义层元数据的厂商中立 YAML 规范——让数仓、BI 工具与 AI Agent 用同一种方式谈论同一个指标，不必在每个产品里重新定义一遍。",
    prose: [
      <>
        OSI 由 Snowflake、dbt Labs、Salesforce、ThoughtSpot 以及 modern data stack 的其他成员于 2025 年发起，
        统一了 <strong>实体</strong>、<strong>维度</strong>、<strong>指标</strong>与
        <strong>join key</strong> 的描述方式。一旦像 <em>revenue</em> 这样的指标在 OSI 里定义好，
        Cortex、Cube、Looker、AtScale 与 Datus 就都能读到同一份口径来源。
      </>,
      <>
        当前草案是 <strong>v0.2.0.dev0</strong>。它的目标是随着 Snowflake Cortex 与 dbt 语义层导出的生产落地，
        最终演进到 1.0。
      </>,
    ],
  },
  mapping: {
    eyebrow: "映射",
    title: "MetricFlow → OSI 字段映射",
    lead: "MetricFlow 的每个结构是如何翻译到 OSI 核心 schema 的。上面的转换器用的就是这张表——没有隐藏逻辑。八款产品的完整映射见 OSI 字段映射参考。",
    columns: ["MetricFlow", "OSI", "说明"],
    linkBefore: "想看所有产品的横向对比？",
    linkLabel: "阅读 OSI 字段映射参考",
    linkAfter:
      "——MetricFlow、Cube、LookML、AtScale、Snowflake、GoodData、Power BI 与 Databricks，覆盖六个层次。",
  },
  howTo: {
    eyebrow: "操作步骤",
    title: "如何把 MetricFlow 转成 OSI",
    lead: "三步，纯浏览器——不用装 CLI，也不用贴 Key。",
    schemaName: "把 MetricFlow YAML 转换成 Open Semantic Interchange",
    schemaDescription:
      "用 Datus Playground 在浏览器里免费完成 MetricFlow 语义层的校验、转换与差异对比，输出 OSI YAML。",
    steps: [
      {
        title: "贴进你的 MetricFlow YAML",
        description:
          "把 semantic_models 文件放进左侧输入框。Playground 在本地解析——什么都不会离开你的浏览器。",
      },
      {
        title: "转换成 OSI",
        description:
          "打开 Converter 标签页，点 Download，就能拿到一份兼容 OSI 的 .yml 文件，可直接交给任何支持 OSI 的工具。",
      },
      {
        title: "对比并校验",
        description:
          "用 Diff 标签页看清楚改了什么，再用 Validator 确认输出符合 OSI v0.2，然后再提交。",
      },
    ],
  },
  why: {
    eyebrow: "为什么重要",
    title: "开放语义标准为什么重要",
    lead: "当指标定义不再被关在某一家厂商的 YAML 里，你的数据团队当天就能拿到的四个实打实的好处。",
    items: [
      {
        title: "一份定义，所有工具通用",
        description:
          "「周活跃用户」只定义一次。Snowflake Cortex、Cube、Looker 和 Datus Agent 读的都是同一份 OSI 文件——同一个问题不会再出现三个答案。",
      },
      {
        title: "让 AI Agent 不再编造指标",
        description:
          "OSI 正是大模型 Copilot 缺失的那层 grounding。Agent 读到 OSI 之后，就不会再自己发明 join key，而是照着语义层原样引用。",
      },
      {
        title: "零锁定的迁移路径",
        description:
          "今天在 dbt MetricFlow 里编写指标，导出成 OSI，明天就能被任何下游工具消费。交换格式把编写和消费解耦了。",
      },
      {
        title: "治理仍然留在它该在的地方",
        description:
          "评审过的 PR、血缘与归属仍然存在源头 YAML 里。OSI 把同样的名称带进每个消费方，因此下游工具看到的是同一份治理元数据。",
      },
    ],
  },
  comparison: {
    eyebrow: "对比",
    title: "OSI vs MetricFlow vs Cube",
    lead: "交换格式、引擎和平台解决的是不同的问题。这里说明各自的定位。",
    columns: ["维度", "OSI", "MetricFlow", "Cube"],
  },
  faqLead: "OSI 是什么、转换器怎么工作、你的 YAML 是否留在本地，以及 Datus 内部怎么用 OSI。",
  closing: {
    heading: "让数据工程 Agent 来读你的 OSI。",
    lead: "Datus 会把每一条 SQL 查询、每一条管道、每一个看板答案都锚定在你的语义层上——OSI、MetricFlow、Cube 或 LookML，随你选。",
    featuresCta: "了解 Datus 功能",
    mappingCta: "OSI 字段映射",
  },
};

export const osiPlaygroundPage: Record<Locale, OsiPlaygroundCopy> = { en: EN, zh: ZH };
