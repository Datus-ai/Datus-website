import type { FaqItem } from "../../../components/FAQ";
import type { Locale } from "../../../i18n/config";

// Page-specific FAQ for /tools/osi-playground/. Content ported verbatim from the
// datus-design template (osi-faqs.ts OSI_FAQS). Owned by this URL only; see
// datus-faq-spec.md.
const EN: FaqItem[] = [
  {
    q: "What is the Open Semantic Interchange (OSI)?",
    a: "The Open Semantic Interchange is a vendor-neutral YAML specification for describing metrics, dimensions, and entities in a semantic layer. Backed by Snowflake, dbt Labs, Salesforce and others, OSI lets you define a metric once and query it from Snowflake Cortex, Cube, Looker, AtScale, ThoughtSpot and more without redefining 'Revenue' in every tool.",
  },
  {
    q: "How do I convert MetricFlow YAML to OSI?",
    a: "Paste your MetricFlow YAML into the Converter tab above. The Datus OSI Playground runs entirely in your browser: it parses your semantic_models, measures and dimensions, maps them to OSI entities, metrics and dimensions, and gives you a downloadable .yaml file plus a list of any fields that were dropped in translation.",
  },
  {
    q: "Is my YAML sent to a server?",
    a: "No. The Validator, Converter and Diff all run 100% in your browser using js-yaml. Your semantic definitions never leave your machine — there is no upload, no sign-up, and no logging. You can verify this in your browser's DevTools Network tab.",
  },
  {
    q: "Which OSI version does the Playground validate against?",
    a: "The Playground currently validates against OSI v0.2.0.dev0, the working draft of the core metadata specification. The OSI spec is still evolving toward a stable 1.0, so we track the upstream schema and re-publish the Playground when the spec moves. The active version is stamped at the top of every Validator result.",
  },
  {
    q: "What is the difference between OSI and MetricFlow?",
    a: "MetricFlow is dbt Labs' semantic layer YAML format — it's tightly integrated with the dbt project and generates SQL through the MetricFlow engine. OSI is a vendor-neutral interchange format: it doesn't run queries itself, it standardizes how metric and dimension definitions are shared across tools. In practice, teams author metrics in MetricFlow or Cube and export to OSI so downstream BI and AI tools can consume them without vendor lock-in.",
  },
  {
    q: "Does the Converter support every MetricFlow feature?",
    a: "The MVP covers the most common surface: semantic_models to entities, measures to metrics, dimensions to dimensions, entities to join_keys, and top-level metrics whose type_params.measure lives on a converted model. Advanced features (saved queries, cumulative metrics with grain-to-date, complex ratio metrics) are on the roadmap; any fields dropped in conversion are surfaced explicitly in the result panel so you never lose them silently.",
  },
  {
    q: "How does Datus use OSI internally?",
    a: "Datus is a data engineering agent that grounds every SQL query, pipeline and dashboard answer in your semantic layer. We treat OSI as the neutral wire format between Datus and whichever semantic layer you already run — dbt MetricFlow, Cube, Looker LookML or a home-grown YAML store — so the agent stays accurate as your stack changes. See our Features page for how the context engine reads OSI.",
  },
  {
    q: "Is the OSI Playground open source?",
    a: "The upstream OSI specification is Apache 2.0 (github.com/open-semantic-interchange/OSI). The Datus Playground is a free hosted tool built by the Datus team — the Datus data engineering agent itself is also Apache 2.0 and you can self-host the whole stack, semantic-layer support included.",
  },
];

const ZH: FaqItem[] = [
  {
    q: "什么是 Open Semantic Interchange（OSI）？",
    a: "Open Semantic Interchange 是一份厂商中立的 YAML 规范，用来描述语义层里的指标、维度与实体。它由 Snowflake、dbt Labs、Salesforce 等共同推动，让你只定义一次指标，就能在 Snowflake Cortex、Cube、Looker、AtScale、ThoughtSpot 等工具中查询，不必在每个工具里重新定义一遍「Revenue」。",
  },
  {
    q: "怎么把 MetricFlow YAML 转成 OSI？",
    a: "把你的 MetricFlow YAML 贴进上方的 Converter 标签页。Datus OSI Playground 完全在浏览器里运行：它会解析 semantic_models、measures 和 dimensions，映射成 OSI 的 entities、metrics 和 dimensions，然后给你一个可下载的 .yaml 文件，外加一份转换过程中被丢弃字段的清单。",
  },
  {
    q: "我的 YAML 会被上传到服务器吗？",
    a: "不会。Validator、Converter 和 Diff 都用 js-yaml 100% 在你的浏览器里运行。语义定义永远不会离开你的机器——没有上传、不用注册、也不记录日志。你可以在浏览器 DevTools 的 Network 面板里自行验证。",
  },
  {
    q: "Playground 校验的是哪个 OSI 版本？",
    a: "目前校验的是 OSI v0.2.0.dev0，也就是核心元数据规范的工作草案。OSI 规范仍在向稳定的 1.0 演进，我们会跟进上游 schema，并在规范变动时重新发布 Playground。当前生效的版本会标注在每次校验结果的顶部。",
  },
  {
    q: "OSI 和 MetricFlow 有什么区别？",
    a: "MetricFlow 是 dbt Labs 的语义层 YAML 格式——它与 dbt 项目深度耦合，并通过 MetricFlow 引擎生成 SQL。OSI 则是厂商中立的交换格式：它本身不执行查询，只负责标准化指标与维度定义在不同工具之间的共享方式。实践中，团队在 MetricFlow 或 Cube 里编写指标，再导出成 OSI，让下游 BI 与 AI 工具无需绑定厂商即可消费。",
  },
  {
    q: "Converter 支持 MetricFlow 的全部特性吗？",
    a: "MVP 覆盖了最常用的部分：semantic_models 转 entities、measures 转 metrics、dimensions 转 dimensions、entities 转 join_keys，以及 type_params.measure 落在已转换模型上的顶层 metrics。高级特性（saved queries、带 grain-to-date 的累计指标、复杂比率指标）还在路线图上；转换中被丢弃的字段都会在结果面板里显式列出，绝不会悄悄丢掉。",
  },
  {
    q: "Datus 内部怎么用 OSI？",
    a: "Datus 是一个数据工程 Agent，它会把每一条 SQL 查询、每一条管道、每一个看板答案都锚定在你的语义层上。我们把 OSI 当作 Datus 与你现有语义层之间的中立传输格式——不管是 dbt MetricFlow、Cube、Looker LookML 还是自研的 YAML 存储——这样技术栈变化时 Agent 依然准确。上下文引擎如何读取 OSI，可以看我们的 Features 页面。",
  },
  {
    q: "OSI Playground 是开源的吗？",
    a: "上游的 OSI 规范采用 Apache 2.0（github.com/open-semantic-interchange/OSI）。Datus Playground 是 Datus 团队做的免费托管工具——Datus 数据工程 Agent 本身同样是 Apache 2.0，整套系统（含语义层支持）都可以自行部署。",
  },
];

export const osiPlaygroundFaq: Record<Locale, FaqItem[]> = { en: EN, zh: ZH };
