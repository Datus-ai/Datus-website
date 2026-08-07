import type { Locale } from "../../i18n/config";

export const PROVIDER_DOCS = "https://docs.datus.ai/models/providers/";

/* -------------------------------------------------------------------------- */
/*  Content — ported from the datus-design /models template.                  */
/* -------------------------------------------------------------------------- */

export type Provider = { key: string; name: string; type: string; notes: string };

export interface ModelsCopy {
  hero: { eyebrow: string; heading: string; lead: string };
  providers: Provider[];
  providerTable: { provider: string; type: string; notes: string };
  auth: {
    eyebrow: string;
    title: string;
    lead: string;
    columns: [string, string, string, string];
    /** Auth / Azure / self-host cell text, keyed by provider. */
    matrix: Record<string, { auth: string; azure: string; selfHost: string }>;
    cardLabel: string;
  };
  strategy: { eyebrow: string; title: string; lead: string; items: { title: string; body: string }[] };
  embeddings: {
    eyebrow: string;
    title: string;
    lead: string;
    items: { name: string; type: string; notes: string }[];
  };
  observability: {
    eyebrow: string;
    title: string;
    lead: string;
    purposeLabel: string;
    envLabel: string;
    items: { key: string; name: string; purpose: string; env: string }[];
  };
  routing: { eyebrow: string; heading: string; lead: string; tags: string[] };
  faqLead: string;
  closing: { heading: string; lead: string; docsCta: string; databasesCta: string; githubCta: string };
}

export const pipelineYaml = `pipeline:
  schema_linking:
    provider: openai
    model: gpt-4o-mini
  sql_generation:
    provider: claude
    model: claude-sonnet-4
  validation:
    provider: gemini
    model: gemini-2.5-flash`;

const EN: ModelsCopy = {
  hero: {
    eyebrow: "Models",
    heading: "Supported LLM Providers",
    lead: "Six first-party LLM providers (OpenAI, Anthropic Claude, Google Gemini, DeepSeek, Qwen, Kimi) plus Azure OpenAI, Codex OAuth and OpenRouter — and any OpenAI-compatible endpoint you self-host. Mix providers per node to tune speed, cost and quality.",
  },
  providers: [
    { key: "openai", name: "OpenAI", type: "openai", notes: "GPT-4, GPT-5 series" },
    { key: "claude", name: "Anthropic Claude", type: "claude", notes: "Claude 4 Sonnet / Opus" },
    { key: "gemini", name: "Google Gemini", type: "gemini", notes: "Gemini 2.5+ Pro / Flash" },
    { key: "deepseek", name: "DeepSeek", type: "deepseek", notes: "Chat & Reasoning" },
    { key: "qwen", name: "Alibaba Qwen", type: "openai", notes: "OpenAI-compatible" },
    { key: "kimi", name: "Moonshot Kimi", type: "openai", notes: "kimi-k2-turbo-preview" },
    { key: "minimax", name: "MiniMax", type: "minimax", notes: "MiniMax models" },
    { key: "glm", name: "GLM (Zhipu)", type: "glm", notes: "GLM-4 series" },
    { key: "azure", name: "Azure OpenAI", type: "openai", notes: "Enterprise deployments" },
    { key: "codex", name: "OpenAI Codex", type: "codex", notes: "OAuth, no API key" },
    { key: "openrouter", name: "OpenRouter", type: "openrouter", notes: "300+ models, single key" },
  ],
  providerTable: { provider: "Provider", type: "Type", notes: "Notes" },
  auth: {
    eyebrow: "Authentication",
    title: "Authentication matrix",
    lead: "How each provider authenticates, and whether it works through Azure or a self-hosted OpenAI-compatible endpoint.",
    columns: ["Provider", "Authentication", "Azure", "Self-Hosted"],
    matrix: {
      openai: { auth: "API Key", azure: "✔ via Azure OpenAI", selfHost: "✔ any OpenAI-compatible" },
      claude: { auth: "API Key · Subscription Token", azure: "—", selfHost: "—" },
      gemini: { auth: "API Key", azure: "—", selfHost: "—" },
      deepseek: { auth: "API Key", azure: "—", selfHost: "✔" },
      qwen: { auth: "API Key (OpenAI-compatible)", azure: "—", selfHost: "✔" },
      kimi: { auth: "API Key (OpenAI-compatible)", azure: "—", selfHost: "✔" },
      minimax: { auth: "API Key", azure: "—", selfHost: "—" },
      glm: { auth: "API Key", azure: "—", selfHost: "—" },
      azure: { auth: "Azure Key + endpoint + deployment", azure: "✔ native", selfHost: "—" },
      codex: { auth: "OAuth (local Codex credential)", azure: "—", selfHost: "—" },
      openrouter: { auth: "API Key (single key, 300+ models)", azure: "—", selfHost: "—" },
    },
    cardLabel: "Auth",
  },
  strategy: {
    eyebrow: "Strategy",
    title: "Per-Node strategy guide",
    lead: "Recommended provider tier for each workflow stage. Combine with the pipeline YAML below to wire the routing.",
    items: [
      { title: "Schema Linking", body: "Fast / cheap: DeepSeek Chat, gpt-4o-mini. Runs on every turn to pick relevant tables." },
      { title: "SQL Generation", body: "Strong: Claude Sonnet, gpt-4-turbo. Writes the SQL that downstream steps validate." },
      { title: "Reasoning / Output", body: "Strongest: Claude Opus, gpt-4-turbo. Explains results and drives multi-step reasoning." },
    ],
  },
  embeddings: {
    eyebrow: "Embeddings",
    title: "Embedding Models for Context Recall",
    lead: "Vectorize text and queries for semantic search, retrieval, and context matching.",
    items: [
      { name: "OpenAI Embeddings", type: "text-embedding-3-*", notes: "1536 / 3072 dim, hosted" },
      { name: "sentence-transformers", type: "all-MiniLM-L6-v2", notes: "384 dim · ~100MB · default" },
      { name: "Multilingual E5", type: "e5-large-instruct", notes: "1024 dim · ~1.2GB · multilingual" },
      { name: "BGE (zh)", type: "bge-large-zh-v1.5", notes: "1024 dim · Chinese optimized" },
      { name: "BGE (en)", type: "bge-large-en-v1.5", notes: "1024 dim · English optimized" },
    ],
  },
  observability: {
    eyebrow: "Observability",
    title: "LLM Observability",
    lead: "Trace every prompt in production or debug locally as YAML — pick the surface that fits your workflow.",
    purposeLabel: "Purpose",
    envLabel: "Env",
    items: [
      { key: "langsmith", name: "LangSmith", purpose: "LLM call tracing & debugging", env: "LANGSMITH_TRACING=true · LANGSMITH_API_KEY" },
      { key: "langfuse", name: "Langfuse", purpose: "Agent + tool full-chain traces (OTel / OpenInference)", env: "LANGFUSE_PUBLIC_KEY · LANGFUSE_SECRET_KEY · LANGFUSE_HOST" },
      { key: "llmtrace", name: "LLM Trace", purpose: "Local YAML dump of prompts & completions", env: "--save_llm_trace" },
    ],
  },
  routing: {
    eyebrow: "Per-node routing",
    heading: "Per-Node Model Assignment",
    lead: "Use different providers for different workflow steps. Route schema linking to a cheaper model, SQL generation to a stronger one — all within the same pipeline.",
    tags: ["Schema linking → fast/cheap", "SQL generation → strong", "Validation → balanced"],
  },
  faqLead: "Supported providers, per-node routing, switching models, embeddings, and tracing.",
  closing: {
    heading: "Route the Right Model at Every Step",
    lead: "Configure planners, coders and rerankers per provider — Anthropic, OpenAI, Gemini, or your own self-hosted endpoint, all from one YAML.",
    docsCta: "Model provider docs",
    databasesCta: "Explore databases",
    githubCta: "View on GitHub",
  },
};

const ZH: ModelsCopy = {
  hero: {
    eyebrow: "模型",
    heading: "支持的大模型厂商",
    lead: "六家一方大模型厂商（OpenAI、Anthropic Claude、Google Gemini、DeepSeek、Qwen、Kimi），外加 Azure OpenAI、Codex OAuth 与 OpenRouter——以及任何你自己部署的 OpenAI 兼容端点。可以按节点混用不同厂商，在速度、成本与质量之间调优。",
  },
  providers: [
    { key: "openai", name: "OpenAI", type: "openai", notes: "GPT-4、GPT-5 系列" },
    { key: "claude", name: "Anthropic Claude", type: "claude", notes: "Claude 4 Sonnet / Opus" },
    { key: "gemini", name: "Google Gemini", type: "gemini", notes: "Gemini 2.5+ Pro / Flash" },
    { key: "deepseek", name: "DeepSeek", type: "deepseek", notes: "对话与推理模型" },
    { key: "qwen", name: "阿里 Qwen", type: "openai", notes: "OpenAI 兼容" },
    { key: "kimi", name: "月之暗面 Kimi", type: "openai", notes: "kimi-k2-turbo-preview" },
    { key: "minimax", name: "MiniMax", type: "minimax", notes: "MiniMax 系列模型" },
    { key: "glm", name: "智谱 GLM", type: "glm", notes: "GLM-4 系列" },
    { key: "azure", name: "Azure OpenAI", type: "openai", notes: "企业部署" },
    { key: "codex", name: "OpenAI Codex", type: "codex", notes: "OAuth 认证，无需 API Key" },
    { key: "openrouter", name: "OpenRouter", type: "openrouter", notes: "300+ 模型，一个 Key 通用" },
  ],
  providerTable: { provider: "厂商", type: "类型", notes: "说明" },
  auth: {
    eyebrow: "认证方式",
    title: "认证方式对照表",
    lead: "每家厂商如何认证，以及它是否支持走 Azure 或自部署的 OpenAI 兼容端点。",
    columns: ["厂商", "认证方式", "Azure", "自部署"],
    matrix: {
      openai: { auth: "API Key", azure: "✔ 通过 Azure OpenAI", selfHost: "✔ 任意 OpenAI 兼容端点" },
      claude: { auth: "API Key · 订阅 Token", azure: "—", selfHost: "—" },
      gemini: { auth: "API Key", azure: "—", selfHost: "—" },
      deepseek: { auth: "API Key", azure: "—", selfHost: "✔" },
      qwen: { auth: "API Key（OpenAI 兼容）", azure: "—", selfHost: "✔" },
      kimi: { auth: "API Key（OpenAI 兼容）", azure: "—", selfHost: "✔" },
      minimax: { auth: "API Key", azure: "—", selfHost: "—" },
      glm: { auth: "API Key", azure: "—", selfHost: "—" },
      azure: { auth: "Azure Key + endpoint + deployment", azure: "✔ 原生支持", selfHost: "—" },
      codex: { auth: "OAuth（本地 Codex 凭据）", azure: "—", selfHost: "—" },
      openrouter: { auth: "API Key（一个 Key，300+ 模型）", azure: "—", selfHost: "—" },
    },
    cardLabel: "认证",
  },
  strategy: {
    eyebrow: "策略",
    title: "按节点选型指南",
    lead: "各个工作流阶段推荐的模型档位。配合下面的 pipeline YAML 就能把路由接起来。",
    items: [
      { title: "Schema Linking", body: "快且便宜：DeepSeek Chat、gpt-4o-mini。每一轮都会跑，用来挑出相关的表。" },
      { title: "SQL 生成", body: "能力要强：Claude Sonnet、gpt-4-turbo。它写出的 SQL 会交给下游步骤校验。" },
      { title: "推理 / 输出", body: "能力最强：Claude Opus、gpt-4-turbo。负责解释结果并驱动多步推理。" },
    ],
  },
  embeddings: {
    eyebrow: "Embedding",
    title: "用于上下文召回的 Embedding 模型",
    lead: "把文本和查询向量化，用于语义检索、召回与上下文匹配。",
    items: [
      { name: "OpenAI Embeddings", type: "text-embedding-3-*", notes: "1536 / 3072 维，托管服务" },
      { name: "sentence-transformers", type: "all-MiniLM-L6-v2", notes: "384 维 · 约 100MB · 默认选项" },
      { name: "Multilingual E5", type: "e5-large-instruct", notes: "1024 维 · 约 1.2GB · 多语言" },
      { name: "BGE（中文）", type: "bge-large-zh-v1.5", notes: "1024 维 · 针对中文优化" },
      { name: "BGE（英文）", type: "bge-large-en-v1.5", notes: "1024 维 · 针对英文优化" },
    ],
  },
  observability: {
    eyebrow: "可观测性",
    title: "大模型可观测性",
    lead: "既能在生产环境追踪每一次 prompt，也能在本地导出 YAML 排查——挑适合你工作流的那种。",
    purposeLabel: "用途",
    envLabel: "环境变量",
    items: [
      { key: "langsmith", name: "LangSmith", purpose: "大模型调用链路追踪与调试", env: "LANGSMITH_TRACING=true · LANGSMITH_API_KEY" },
      { key: "langfuse", name: "Langfuse", purpose: "Agent + 工具的全链路追踪（OTel / OpenInference）", env: "LANGFUSE_PUBLIC_KEY · LANGFUSE_SECRET_KEY · LANGFUSE_HOST" },
      { key: "llmtrace", name: "LLM Trace", purpose: "把 prompt 与 completion 导出成本地 YAML", env: "--save_llm_trace" },
    ],
  },
  routing: {
    eyebrow: "按节点路由",
    heading: "按节点分配模型",
    lead: "不同的工作流步骤用不同的厂商。Schema Linking 路由到便宜的模型，SQL 生成路由到更强的模型——都在同一条流水线里完成。",
    tags: ["Schema linking → 快且便宜", "SQL 生成 → 能力强", "校验 → 折中"],
  },
  faqLead: "支持的厂商、按节点路由、切换模型、Embedding 与链路追踪。",
  closing: {
    heading: "每一步都用对模型",
    lead: "按厂商配置 planner、coder 与 reranker——Anthropic、OpenAI、Gemini，或者你自己部署的端点，全部由一份 YAML 管理。",
    docsCta: "模型厂商文档",
    databasesCta: "了解支持的数据库",
    githubCta: "在 GitHub 上查看",
  },
};

export const modelsPage: Record<Locale, ModelsCopy> = { en: EN, zh: ZH };
