import type { FaqItem } from "../../components/FAQ";
import type { Locale } from "../../i18n/config";

// Page-specific FAQ for /integrations/ — storage, embeddings, semantic layer,
// MCP, BI copilot, and how databases/models fit in. Content is adapted from the
// datus-design integrations template. Owned by this URL only; see datus-faq-spec.md.
const EN: FaqItem[] = [
  {
    q: "Where do databases and models fit in?",
    a: "Datus ships native database adapters covering the full range from SQLite to Snowflake, plus first-party LLM providers and any OpenAI-compatible endpoint. This page covers everything else you can plug in — storage backends, embeddings, semantic layer, BI copilot, MCP, skills, and observability.",
  },
  {
    q: "Can I run Datus entirely on my laptop?",
    a: "Yes. The default storage backend is LanceDB (vector) plus SQLite (relational), with zero configuration required. Data is written to data/datus_db_<namespace>/. Swap to PostgreSQL (pgvector) or Milvus as your deployment grows, without changing application code.",
  },
  {
    q: "Is MetricFlow the only supported semantic layer?",
    a: "MetricFlow is the only shipped adapter today, but the semantic layer is plugin-architected via Python entry points. You can register your own adapter alongside datus-semantic-metricflow through [project.entry-points.\"datus.semantic_adapters\"] and expose it to the agent's context.",
  },
  {
    q: "Which BI platforms are supported for Dashboard Copilot?",
    a: "Apache Superset is supported today. Datus reads a dashboard, extracts every chart's SQL, builds a semantic model and emits two subagents — GenSQL for querying and GenReport for attribution and root-cause. Tableau, PowerBI and Looker adapters are on the roadmap.",
  },
  {
    q: "What's the difference between MCP Client and MCP Server?",
    a: "MCP Client lets Datus consume external MCP tools over stdio, http or sse transports. MCP Server exposes Datus's own database and context-search tools to any MCP-compatible host — Claude Desktop, Cursor, or another agent — with 8 database plus 8 context-search tools available out of the box.",
  },
];

const ZH: FaqItem[] = [
  {
    q: "数据库和模型在这里处于什么位置？",
    a: "Datus 自带覆盖 SQLite 到 Snowflake 全谱系的原生数据库适配器，以及各家一方大模型厂商和任意 OpenAI 兼容端点。本页讲的是这两者之外还能接什么——存储后端、Embedding、语义层、BI Copilot、MCP、Skills 与可观测性。",
  },
  {
    q: "Datus 能完全跑在我的笔记本上吗？",
    a: "可以。默认存储后端是 LanceDB（向量）加 SQLite（关系型），零配置即可运行，数据写入 data/datus_db_<namespace>/。随着部署规模变大，可以换成 PostgreSQL（pgvector）或 Milvus，应用代码不用改。",
  },
  {
    q: "语义层只支持 MetricFlow 吗？",
    a: "目前随包发布的适配器只有 MetricFlow，但语义层本身是通过 Python entry points 做成插件架构的。你可以用 [project.entry-points.\"datus.semantic_adapters\"] 注册自己的适配器，与 datus-semantic-metricflow 并存，并把它暴露给 Agent 的上下文。",
  },
  {
    q: "Dashboard Copilot 支持哪些 BI 平台？",
    a: "目前支持 Apache Superset。Datus 会读取一个看板，抽取每张图表的 SQL，构建语义模型，并产出两个子代理——GenSQL 负责查询，GenReport 负责归因与根因分析。Tableau、PowerBI 和 Looker 的适配器已在规划中。",
  },
  {
    q: "MCP Client 和 MCP Server 有什么区别？",
    a: "MCP Client 让 Datus 通过 stdio、http 或 sse 传输去调用外部 MCP 工具。MCP Server 则把 Datus 自身的数据库与上下文检索工具暴露给任意兼容 MCP 的宿主——Claude Desktop、Cursor 或另一个 Agent——开箱提供 8 个数据库工具加 8 个上下文检索工具。",
  },
];

export const integrationsFaq: Record<Locale, FaqItem[]> = { en: EN, zh: ZH };
