import { MIRRORED_PATHS } from "./config";

/**
 * Chinese `<head>` metadata for every mirrored marketing page.
 *
 * The English metadata already lives in each route's hand-written
 * `<route>/index.html`; this file supplies only the Chinese overrides. The
 * `/zh` shell generator (scripts/lib/i18n-shells.mjs) reads it at build time
 * and rewrites the copied English shell, so there is exactly one place to edit
 * a Chinese title or description.
 *
 * OG images are shared with English on purpose — they are brand cards, not
 * localized copy.
 */
export type PageMeta = {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  twitterTitle?: string;
  twitterDescription?: string;
};

export const ZH_PAGE_META: Record<string, PageMeta> = {
  "/": {
    title: "Datus — 开源的数据工程 Agent",
    description:
      "Datus 是开源的数据工程 Agent：做规划、写 SQL、上线数据管道，并持续监控你的数仓、数据目录与 BI。",
    ogTitle: "Datus — 开源的数据工程 Agent",
    ogDescription:
      "Datus 是开源的数据工程 Agent：做规划、写 SQL、上线数据管道，并持续监控你的数仓、数据目录与 BI。",
  },
  "/products/cli/": {
    title: "Datus CLI — 终端里的开源数据工程 Agent",
    description:
      "开源的 Datus CLI 把数据工程 Agent 装进终端——自带数仓与模型，构建可演进的上下文引擎，生成经过校验的 SQL。Apache-2.0 许可。",
    ogTitle: "Datus CLI — 开源的数据工程 Agent",
    ogDescription:
      "在终端里运行数据工程 Agent——你的数仓、你的模型、你的上下文。Apache-2.0 许可。",
    twitterDescription: "在终端里运行数据工程 Agent——你的数仓、你的模型、你的上下文。",
  },
  "/products/vscode/": {
    title: "Datus for VS Code — 编辑器里的数据 Agent 与上下文",
    description:
      "Datus VS Code 插件把数据工程 Agent 及其可演进的上下文引擎带进编辑器——行内生成经过校验的 SQL、感知表结构，并提供 Agent 对话面板。",
    ogTitle: "Datus for VS Code — 编辑器里的数据 Agent",
    ogDescription: "在 VS Code 中行内生成经过校验的 SQL、感知表结构，并带 Agent 对话面板。",
  },
  "/products/studio/": {
    title: "Datus Studio — 托管版数据工程 Agent",
    description:
      "Datus Studio 是最省事的上手方式：托管的数据工程 Agent，连上数仓、构建上下文、写出经过校验的 SQL——免安装，早期体验期免费。",
    ogTitle: "Datus Studio — 托管版数据工程 Agent",
    ogDescription:
      "托管的 Datus 工作空间——连上数仓，几分钟拿到可信答案。早期体验期免费。",
    twitterDescription: "托管的 Datus 工作空间——连上数仓，几分钟拿到可信答案。",
  },
  "/products/enterprise/": {
    title: "Datus 企业版 — 可治理的企业 Agent 团队",
    description:
      "Datus 企业版为数据组织提供共享上下文引擎、治理能力、SSO 与长时运行 Agent，并部署在你自己的环境中。不靠堆人也能扩大数据产出。",
    ogTitle: "Datus 企业版 — 可治理的企业 Agent 团队",
    ogDescription: "面向数据团队的共享上下文、治理、SSO 与长时运行 Agent——部署在你自己的环境中。",
    twitterDescription: "面向数据团队的共享上下文、治理、SSO 与长时运行 Agent。",
  },
  "/integrations/": {
    title: "集成 — Datus 接入你现有的数据栈",
    description:
      "Datus 可对接存储后端、Embedding 模型、语义层、BI 平台、MCP Server、Skill 市场与 LLM 链路追踪工具。每一层都是插件。",
    ogTitle: "集成 — Datus 接入你现有的数据栈",
    ogDescription:
      "存储、Embedding、语义层、BI Copilot、MCP、Skills 与可观测性——数据库和模型之外，Datus 还能接入这些。",
  },
  "/databases/": {
    title: "支持的数据库 — Datus",
    description:
      "Datus 开箱支持 12+ 种数据库，包括 SQLite、DuckDB、PostgreSQL、MySQL、Snowflake、StarRocks、Apache Doris、ClickHouse、ClickZetta、Hive、Spark 与 Trino。",
    ogTitle: "支持的数据库 — Datus",
    ogDescription:
      "把 Datus 接入你的数据栈——从嵌入式 SQLite 到 Snowflake、StarRocks 这样的云数仓。",
  },
  "/models/": {
    title: "支持的大模型厂商 — Datus",
    description:
      "Datus 支持 11+ 家大模型厂商，包括 OpenAI、Anthropic Claude、Google Gemini、DeepSeek、Qwen、Kimi、MiniMax、GLM、Azure OpenAI、OpenAI Codex 与 OpenRouter。",
    ogTitle: "支持的大模型厂商 — Datus",
    ogDescription:
      "Datus 可搭配任意主流大模型厂商。按节点分配模型，让不同工作流步骤用不同厂商，按命令切换模型，同时只维护一份 agent.yml。",
    twitterDescription:
      "Datus 可搭配任意主流大模型厂商。按工作流步骤混用不同厂商，全部由一份 agent.yml 管理。",
  },
  "/mcp/": {
    title: "Datus MCP Server — 把数据栈接入 Claude、Cursor 等客户端",
    description:
      "Datus MCP Server 通过 Model Context Protocol 暴露 Datus 数据工程 Agent——让 Claude Desktop、Cursor、Cline 以及任意 MCP 客户端连上你的数仓，共享可演进的上下文。",
    ogTitle: "Datus MCP Server — 面向 Claude、Cursor 及 MCP 客户端的数据 Agent",
    ogDescription:
      "把数仓接进 Claude Desktop、Cursor 及任意兼容 MCP 的客户端。工具、资源与提示词均由 Datus 上下文引擎驱动。",
  },
  "/chatbot/": {
    title: "Datus Web Chatbot — 浏览器里的 AI 数据分析师",
    description:
      "Datus Web Chatbot 是浏览器里的 AI 数据分析师——和数仓对话、把子代理共享给团队，免安装。底层由可演进的上下文引擎驱动。",
    ogTitle: "Datus Web Chatbot — 浏览器里的 AI 数据分析师",
    ogDescription:
      "面向分析师与产品经理的浏览器数据聊天助手。和数仓对话、共享会话、直接交付答案——全部由 Datus 上下文引擎支撑。",
  },
  "/pricing/": {
    title: "定价 — Datus 对个人免费，对企业按需定制",
    description:
      "Datus 定价：开源的 CLI 与 VS Code 插件基于 Apache-2.0 免费，Datus Studio 在早期体验期免费，企业版按需定制，含 SSO、治理与技术支持。",
    ogTitle: "定价 — 个人免费，企业定制",
    ogDescription: "开源免费，Studio 早期体验期免费，企业版按需定制。",
  },
  "/faq/": {
    title: "Datus 常见问题 — 开源的数据工程 Agent",
    description:
      "关于 Datus 的常见问题：CLI、VS Code 插件、Studio 与企业版分别做什么，支持哪些数仓与大模型，以及 Datus 与 SQL Copilot 有何不同。",
    ogTitle: "Datus 常见问题 — 开源的数据工程 Agent",
    ogDescription:
      "Datus 是什么、各产品做什么、支持哪些数仓与模型，以及它与 SQL Copilot 有何不同。",
  },
  "/glossary/": {
    title: "数据工程术语表 | Datus",
    description:
      "用大白话解释 47 个数据工程概念——语义层、湖仓、Schema Linking、MCP、RAG 等等，都是 Datus Agent 每天打交道的东西。",
    ogTitle: "数据工程术语表 | Datus",
    ogDescription:
      "用大白话解释 47 个数据工程概念——语义层、湖仓、Schema Linking、MCP、RAG 等等。",
    twitterDescription: "用大白话解释 47 个 Datus Agent 每天打交道的数据工程概念。",
  },
  "/osi-field-mapping/": {
    title: "OSI 字段映射 — 8 个语义层对照 Open Semantic Interchange",
    description:
      "看看 MetricFlow、Cube、LookML、AtScale、Snowflake Semantic Views、GoodData、Power BI 与 Databricks Metric Views 如何映射到 OSI 规范——逐字段覆盖数据集、维度、指标、关系、时间与 AI 上下文。",
    ogTitle: "OSI 字段映射 — 8 个语义层对照 Open Semantic Interchange",
    ogDescription:
      "看看 MetricFlow、Cube、LookML、AtScale、Snowflake Semantic Views、GoodData、Power BI 与 Databricks Metric Views 如何逐字段映射到 OSI 规范。",
    twitterDescription:
      "MetricFlow、Cube、LookML、AtScale、Snowflake、GoodData、Power BI 与 Databricks 到 Open Semantic Interchange 的逐字段映射。",
  },
  "/tools/osi-playground/": {
    title: "MetricFlow 转 OSI 转换器、校验器与 Diff — Datus Playground",
    description:
      "免费的浏览器端 OSI Playground：校验 MetricFlow YAML、转换成 Open Semantic Interchange，并左右对比两种格式的差异。无需注册，不上传数据。",
    ogTitle: "MetricFlow 转 OSI 转换器、校验器与 Diff — Datus Playground",
    ogDescription:
      "免费的浏览器端 OSI Playground：校验 MetricFlow YAML、转换成 Open Semantic Interchange，并左右对比两种格式的差异。无需注册，不上传数据。",
    twitterDescription:
      "在浏览器里校验 MetricFlow YAML、转换成 Open Semantic Interchange，并左右对比差异。",
  },
};

/** Fail the build early if a mirrored path is missing its Chinese metadata. */
export function missingZhMeta(): string[] {
  return MIRRORED_PATHS.filter((path) => !ZH_PAGE_META[path]);
}
