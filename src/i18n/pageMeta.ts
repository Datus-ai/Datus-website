import { MIRRORED_PATHS } from "./config";
import { CONVERTER_PATH, CONVERTER_FLOWS } from "../modules/semantic-converter/routes";
import { flowCopy } from "../pages/tools/semantic-model-converter/flows";

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
  "/databases/snowflake/": {
    title: "面向 Snowflake 与 AI Agent 的语义层 — Datus",
    description: "为 Snowflake 数据增加共享业务上下文。创建可审核的 Apache Ossie 模型，通过 DOSI 生成原生 SQL，为团队与 AI Agent 提供可复用的业务定义。",
    ogTitle: "面向 Snowflake 与 AI Agent 的语义层 — Datus",
    ogDescription: "开放的定义，Snowflake 原生 SQL，团队与 Agent 共享的业务上下文。",
  },
  "/solutions/semantic-layer/": {
    title: "面向团队与 AI Agent 的语义层解决方案 — Datus",
    description: "将业务关系、指标与源数据映射连接为可审核的语义层。Apache Ossie 提供开放规范，DOSI 将兼容的定义转为原生 SQL 执行。",
    ogTitle: "语义层解决方案 — Datus",
    ogDescription: "团队与 AI Agent 共享业务定义，通过 DOSI 执行兼容的 Apache Ossie 模型，并核查 SQL 与结果来源。",
  },
  [CONVERTER_PATH]: {
    title: "Apache Ossie 语义模型转换器 — Datus",
    description: "免费将 Cube、dbt、Omni 等平台模型导入 Apache Ossie，或将 Ossie / Dosi YAML 导出为其他格式。内置样例，支持多文件编辑、诊断与下载。",
    ogTitle: "免费语义模型转换器 — Datus",
    ogDescription: "选择导入或导出 Ossie，加载样例或上传源文件，检查诊断并下载转换结果。",
  },
  ...Object.fromEntries(CONVERTER_FLOWS.map((item) => {
    const copy = flowCopy.zh[item.slug];
    return [`${CONVERTER_PATH}${item.slug}/`, {
      title: `${copy.title} — Datus`, description: copy.description,
      ogTitle: `${copy.title} — Datus`, ogDescription: copy.description,
    }];
  })),
  "/policies/cookies/": {
    title: "Cookie 与本地存储政策 — Datus",
    description: "了解 Datus 官网与 Datus Studio 使用 Cookie 和本地存储的用途、保存时间，以及如何管理使用分析。",
    ogTitle: "Cookie 与本地存储政策 — Datus",
    ogDescription: "必要用途与使用分析：了解 Datus 的 Cookie 和本地存储，以及你的选择。",
  },
  "/support/": {
    title: "支持与帮助 — Datus",
    description: "查找 Datus Studio 的账号登录、数据库连接、模型配置、项目权限、报告与大盘、部署集成帮助，通过反馈、邮件或 Slack 联系 Datus 团队。",
    ogTitle: "支持与帮助 — Datus",
    ogDescription: "使用指南、常见问题与支持渠道：找到答案，继续你的工作。",
  },
  "/security/": {
    title: "安全与隐私 — Datus",
    description: "了解 Datus Studio 的模型与数据使用、凭据加密、访问控制、分享安全、部署边界，以及合规进展与安全联系方式。",
    ogTitle: "安全与隐私 — Datus",
    ogDescription: "模型由你选择，连接凭据加密保存，会话记录可自行删除。了解 Datus Studio 的安全实践。",
    twitterDescription: "模型由你选择，连接凭据加密保存，会话记录可自行删除。了解 Datus Studio 的安全实践。",
  },
  "/": {
    title: "Datus — 面向 AI Agent 的可信企业数据上下文",
    description:
      "Datus 为 AI Agent 提供开放的数据上下文，连接业务本体、受治理的指标与数据来源。团队可以审核语义定义，并检查 DOSI 的执行依据。",
    ogTitle: "Datus — 面向 AI Agent 的可信企业数据上下文",
    ogDescription:
      "面向 AI Agent 的开放数据上下文：关联业务含义，复用语义定义，通过 DOSI 检查执行依据。",
  },
  "/products/cli/": {
    title: "Datus Agent — 开源的数据工程与分析 Agent",
    description: "支持数据工程与分析的开源数据 Agent。使用自己的数仓与模型，处理 SQL、数据管道和可复用的业务上下文；语义建模是其能力之一。",
    ogTitle: "Datus Agent — 开源的数据工程与分析 Agent",
    ogDescription: "将可复用的业务上下文用于数据工程与分析，使用自己的数仓与模型。",
  },
  "/products/vscode/": {
    title: "Datus for VS Code — 编辑器里的数据 Agent 与上下文",
    description:
      "Datus VS Code 插件把数据工程 Agent 及其可演进的上下文引擎带进编辑器——行内生成经过校验的 SQL、感知表结构，并提供 Agent 对话面板。",
    ogTitle: "Datus for VS Code — 编辑器里的数据 Agent",
    ogDescription: "在 VS Code 中行内生成经过校验的 SQL、感知表结构，并带 Agent 对话面板。",
  },
  "/products/studio/": {
    title: "Datus Studio — Agent 驱动的数据工作空间",
    description: "在 Datus Studio 中整合文件、SQL、结果与 Agent 对话。团队协作开展 Agent 驱动的数据工程与分析，并审核共享业务上下文。",
    ogTitle: "Datus Studio — Agent 驱动的数据工作空间",
    ogDescription: "整合文件、SQL、结果与 Agent 对话，让团队协作开展数据工程与分析。",
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
      "Datus 开箱支持 16+ 种数据库，包括 SQLite、DuckDB、PostgreSQL、MySQL、Oracle、TiDB、Snowflake、Amazon Redshift、Google BigQuery、StarRocks、Apache Doris、ClickHouse、ClickZetta、Hive、Spark 与 Trino。",
    ogTitle: "支持的数据库 — Datus",
    ogDescription:
      "把 Datus 接入你的数据栈，从嵌入式 SQLite 到 Snowflake、StarRocks 这样的云数仓。",
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
