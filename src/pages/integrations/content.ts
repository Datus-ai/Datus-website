import type { Locale } from "../../i18n/config";

/* -------------------------------------------------------------------------- */
/*  Content — ported from the datus-design integrations template.             */
/* -------------------------------------------------------------------------- */

export interface IntegrationsCopy {
  hero: { eyebrow: string; heading: string; leadBefore: string; databases: string; leadMiddle: string; models: string; leadAfter: string };
  labels: { type: string; pkg: string; notes: string; model: string; dim: string; install: string; builtIn: string; ready: string; default: string };
  storage: {
    eyebrow: string;
    title: string;
    lead: string;
    items: { key: string; name: string; type: string; pkg: string; notes: string; builtIn: boolean }[];
  };
  embeddings: {
    eyebrow: string;
    title: string;
    lead: string;
    items: { key: string; name: string; model: string; dim: string; badge?: string }[];
  };
  semantic: {
    eyebrow: string;
    title: string;
    lead: string;
    metricFlowNotes: string;
    coreInterface: string;
    methods: { method: string; desc: string }[];
    registerBefore: string;
    registerAfter: string;
  };
  bi: { eyebrow: string; heading: string; lead: string; tags: string[]; roadmap: string };
  mcp: {
    eyebrow: string;
    title: string;
    lead: string;
    clientTitle: string;
    clientBody: string;
    clientBodyTail: string;
    clientConfigBefore: string;
    clientConfigAfter: string;
    serverTitle: string;
    serverBodyBefore: string;
    serverBodyAfter: string;
    serverTools: string;
    docsLink: string;
  };
  skills: { eyebrow: string; title: string; lead: string; cards: { title: string; body: string }[] };
  observability: {
    eyebrow: string;
    title: string;
    lead: string;
    columns: [string, string, string];
    items: { key: string; tool: string; purpose: string; config: string }[];
  };
  faqLead: string;
  closing: { heading: string; lead: string; startCta: string; docsCta: string; githubCta: string };
}

export const embeddingYaml = `storage:
  # Database metadata embedding (cloud)
  database:
    registry_name: openai
    model_name: text-embedding-3-small
    dim_size: 1536

  # Document embedding (local, multilingual)
  document:
    model_name: intfloat/multilingual-e5-large-instruct
    dim_size: 1024

  # Metric embedding (local, fast)
  metric:
    model_name: all-MiniLM-L6-v2
    dim_size: 384`;

export const biCode = `# Deploy Superset + Postgres
helm upgrade --install superset superset/superset \\
  -f examples-values.yaml

# One-shot: dashboard -> subagents
datus-agent bootstrap-bi --database superset`;

export const skillsCode = `# Authenticate to the marketplace
datus skill login --marketplace http://datus-marketplace:9000

# Discover & install
datus skill search sql
datus skill install sql-optimization

# Publish your own
datus skill publish ./skills/my-skill --owner murphy`;

const EN: IntegrationsCopy = {
  hero: {
    eyebrow: "Integrations",
    heading: "Datus Integrations",
    leadBefore: "Datus is built on a plugin-first architecture. Beyond the dedicated ",
    databases: "databases",
    leadMiddle: " and ",
    models: "models",
    leadAfter:
      " pages, this page catalogues every other layer you can plug in — storage, embeddings, semantic layer, BI copilot, MCP protocol, skills, and observability.",
  },
  labels: {
    type: "Type", pkg: "Package", notes: "Notes", model: "Model", dim: "Dim",
    install: "Install", builtIn: "Built-in", ready: "Ready", default: "Default",
  },
  storage: {
    eyebrow: "Storage",
    title: "Storage Backends — vector + relational",
    lead: "Dual-track storage keeps embeddings and relational metadata side-by-side. Swap the backend as your deployment grows.",
    items: [
      {
        key: "lancedb",
        name: "LanceDB + SQLite",
        type: "default",
        pkg: "Built-in",
        notes: "Zero-config vector + relational store for local dev and single-node deployments.",
        builtIn: true,
      },
      {
        key: "pgvector",
        name: "PostgreSQL (pgvector)",
        type: "postgresql",
        pkg: "datus-storage-postgresql",
        notes: "Production tier with per-namespace schema isolation and connection pooling.",
        builtIn: false,
      },
      {
        key: "milvus",
        name: "Milvus",
        type: "milvus",
        pkg: "Plugin (v0.2.6)",
        notes: "Purpose-built vector store for large-scale semantic retrieval.",
        builtIn: false,
      },
    ],
  },
  embeddings: {
    eyebrow: "Embeddings",
    title: "Embedding Providers for context recall",
    lead: "Vectorize schemas, docs and metrics for semantic search. Mix cloud embeddings with local models to balance quality, cost and privacy.",
    items: [
      { key: "openai", name: "OpenAI Embeddings", model: "text-embedding-3-small / large", dim: "1536 / 3072" },
      { key: "st", name: "sentence-transformers", model: "all-MiniLM-L6-v2 (~100MB)", dim: "384", badge: "Default" },
      { key: "e5", name: "Multilingual E5", model: "intfloat/multilingual-e5-large-instruct", dim: "1024" },
      { key: "bge", name: "BGE (zh / en)", model: "BAAI/bge-large-{zh,en}-v1.5", dim: "1024" },
    ],
  },
  semantic: {
    eyebrow: "Semantic layer",
    title: "Semantic Layer adapters",
    lead: "Bring your metric definitions into the agent's context. MetricFlow ships today; more adapters can be registered through Python entry points.",
    metricFlowNotes: "MetricFlow-compatible YAML; joins into subject trees.",
    coreInterface: "Core interface",
    methods: [
      { method: "list_metrics(path, limit, offset)", desc: "Enumerate metrics available in the semantic project." },
      { method: "get_dimensions(metric_name, path)", desc: "List every dimension a metric can slice by." },
      { method: "query_metrics(metrics, dimensions, ...)", desc: "Run metric queries with filters, time range and where clauses." },
      { method: "validate_semantic()", desc: "Validate the semantic configuration end-to-end." },
    ],
    registerBefore: "Register your own adapter via ",
    registerAfter: ".",
  },
  bi: {
    eyebrow: "BI copilot",
    heading: "BI Platform Copilot",
    lead: "Point Datus at an Apache Superset dashboard and it extracts every chart's SQL, builds a semantic model and emits two ready-to-use subagents — one for query, one for attribution analysis.",
    tags: ["Superset only (today)", "GenSQL subagent", "GenReport + root-cause"],
    roadmap: "Tableau, PowerBI and Looker adapters are on the roadmap.",
  },
  mcp: {
    eyebrow: "MCP protocol",
    title: "MCP Protocol — client & server",
    lead: "Datus speaks Model Context Protocol in both directions. Consume any external MCP server, or expose Datus's own database and context-search tools to Claude, Cursor and other MCP hosts.",
    clientTitle: "MCP Client",
    clientBody: "Wire external MCP tools into the agent from the CLI: ",
    clientBodyTail: " transports.",
    clientConfigBefore: "Config lives in ",
    clientConfigAfter: ".",
    serverTitle: "MCP Server",
    serverBodyBefore: "Run ",
    serverBodyAfter: " in static or dynamic mode. Static serves one namespace, dynamic routes multiple namespaces by URL path.",
    serverTools: "Exposes 8 database + 8 context-search tools out of the box.",
    docsLink: "Full MCP interface details in the docs",
  },
  skills: {
    eyebrow: "Skills",
    title: "Agent Skills & Marketplace",
    lead: "Modular capability packs (v0.2.5) following the agentskills.io spec. Discover, install and publish skills from the built-in marketplace.",
    cards: [
      { title: "Bash Skills", body: "Shell scripts guarded by an allow-list of commands; safe to expose to the agent." },
      { title: "Function Skills", body: "Python callables loaded through load_skill() and invoked as tools." },
      {
        title: "Isolated Subagent Skills",
        body: "Run in a forked subagent context (Explore / Plan / general-purpose) with its own scratchpad.",
      },
    ],
  },
  observability: {
    eyebrow: "Observability",
    title: "Observability & optional tools",
    lead: "Trace every LLM call, augment platform docs with web search, or debug prompts locally as YAML.",
    columns: ["Tool", "Purpose", "Configuration"],
    items: [
      { key: "langsmith", tool: "LangSmith", purpose: "LLM call tracing & debugging", config: "LANGSMITH_TRACING=true · LANGSMITH_API_KEY · LANGSMITH_PROJECT" },
      { key: "langfuse", tool: "Langfuse", purpose: "Agent + tool full-chain tracing (OTel / OpenInference)", config: "LANGFUSE_PUBLIC_KEY · LANGFUSE_SECRET_KEY · LANGFUSE_HOST" },
      { key: "llmtrace", tool: "LLM Trace", purpose: "Local YAML dump of prompts and completions", config: "--save_llm_trace  →  {agent.home}/trajectory/" },
      { key: "tavily", tool: "Tavily", purpose: "Web-search fallback for platform documentation", config: "TAVILY_API_KEY" },
      { key: "github", tool: "GitHub Token", purpose: "Rate-limit-safe pull of platform docs from GitHub", config: "GITHUB_TOKEN" },
    ],
  },
  faqLead: "Storage, embeddings, semantic layers, MCP, BI copilot, and how databases and models fit in.",
  closing: {
    heading: "Bring Your Stack, We Plug In",
    lead: "Databases, models, semantic layers, BI copilots and observability — every layer is a plugin.",
    startCta: "Get started free",
    docsCta: "Read the docs",
    githubCta: "Browse adapters on GitHub",
  },
};

const ZH: IntegrationsCopy = {
  hero: {
    eyebrow: "集成",
    heading: "Datus 集成能力",
    leadBefore: "Datus 采用插件优先的架构。除了单独成页的",
    databases: "数据库",
    leadMiddle: "和",
    models: "模型",
    leadAfter:
      "之外，本页罗列了其余所有可以接入的层——存储、Embedding、语义层、BI Copilot、MCP 协议、Skills 与可观测性。",
  },
  labels: {
    type: "类型", pkg: "安装包", notes: "说明", model: "模型", dim: "维度",
    install: "安装", builtIn: "内置", ready: "已就绪", default: "默认",
  },
  storage: {
    eyebrow: "存储",
    title: "存储后端——向量 + 关系型",
    lead: "双轨存储让 Embedding 与关系型元数据并肩存放。随着部署规模变大，换后端即可。",
    items: [
      {
        key: "lancedb",
        name: "LanceDB + SQLite",
        type: "default",
        pkg: "内置",
        notes: "零配置的向量 + 关系型存储，适合本地开发与单机部署。",
        builtIn: true,
      },
      {
        key: "pgvector",
        name: "PostgreSQL (pgvector)",
        type: "postgresql",
        pkg: "datus-storage-postgresql",
        notes: "生产档位，支持按 namespace 做 schema 隔离与连接池。",
        builtIn: false,
      },
      {
        key: "milvus",
        name: "Milvus",
        type: "milvus",
        pkg: "插件（v0.2.6）",
        notes: "专为大规模语义检索打造的向量库。",
        builtIn: false,
      },
    ],
  },
  embeddings: {
    eyebrow: "Embedding",
    title: "用于上下文召回的 Embedding 厂商",
    lead: "把表结构、文档和指标向量化，用于语义检索。云端 Embedding 与本地模型可以混用，在质量、成本与隐私之间取平衡。",
    items: [
      { key: "openai", name: "OpenAI Embeddings", model: "text-embedding-3-small / large", dim: "1536 / 3072" },
      { key: "st", name: "sentence-transformers", model: "all-MiniLM-L6-v2（约 100MB）", dim: "384", badge: "默认" },
      { key: "e5", name: "Multilingual E5", model: "intfloat/multilingual-e5-large-instruct", dim: "1024" },
      { key: "bge", name: "BGE（中文 / 英文）", model: "BAAI/bge-large-{zh,en}-v1.5", dim: "1024" },
    ],
  },
  semantic: {
    eyebrow: "语义层",
    title: "语义层适配器",
    lead: "把你的指标定义带进 Agent 的上下文。目前随包提供 MetricFlow；更多适配器可以通过 Python entry points 注册。",
    metricFlowNotes: "兼容 MetricFlow 的 YAML；可并入主题树。",
    coreInterface: "核心接口",
    methods: [
      { method: "list_metrics(path, limit, offset)", desc: "列出语义项目中可用的指标。" },
      { method: "get_dimensions(metric_name, path)", desc: "列出某个指标可以按哪些维度切分。" },
      { method: "query_metrics(metrics, dimensions, ...)", desc: "带过滤条件、时间范围和 where 子句执行指标查询。" },
      { method: "validate_semantic()", desc: "端到端校验语义配置。" },
    ],
    registerBefore: "通过 ",
    registerAfter: " 注册你自己的适配器。",
  },
  bi: {
    eyebrow: "BI Copilot",
    heading: "BI 平台 Copilot",
    lead: "把 Datus 指向一个 Apache Superset 看板，它会抽取每张图表的 SQL，构建语义模型，并产出两个开箱可用的子代理——一个负责查询，一个负责归因分析。",
    tags: ["目前仅支持 Superset", "GenSQL 子代理", "GenReport + 根因分析"],
    roadmap: "Tableau、PowerBI 与 Looker 的适配器已在规划中。",
  },
  mcp: {
    eyebrow: "MCP 协议",
    title: "MCP 协议——既是客户端也是服务端",
    lead: "Datus 双向支持 Model Context Protocol。既能消费任意外部 MCP Server，也能把自身的数据库与上下文检索工具暴露给 Claude、Cursor 等 MCP 宿主。",
    clientTitle: "MCP Client",
    clientBody: "在 CLI 里把外部 MCP 工具接进 Agent：",
    clientBodyTail: " 三种传输方式任选。",
    clientConfigBefore: "配置文件位于 ",
    clientConfigAfter: "。",
    serverTitle: "MCP Server",
    serverBodyBefore: "以静态或动态模式运行 ",
    serverBodyAfter: "。静态模式服务单个 namespace，动态模式按 URL 路径路由多个 namespace。",
    serverTools: "开箱暴露 8 个数据库工具 + 8 个上下文检索工具。",
    docsLink: "完整的 MCP 接口细节见文档",
  },
  skills: {
    eyebrow: "Skills",
    title: "Agent Skills 与市场",
    lead: "遵循 agentskills.io 规范的模块化能力包（v0.2.5）。可以在内置市场里发现、安装并发布 Skill。",
    cards: [
      { title: "Bash Skills", body: "由命令白名单守护的 Shell 脚本；可以安全地暴露给 Agent。" },
      { title: "Function Skills", body: "通过 load_skill() 加载的 Python 可调用对象，作为工具被调用。" },
      {
        title: "隔离子代理 Skills",
        body: "在 fork 出来的子代理上下文（Explore / Plan / 通用型）中运行，拥有独立的草稿区。",
      },
    ],
  },
  observability: {
    eyebrow: "可观测性",
    title: "可观测性与可选工具",
    lead: "追踪每一次大模型调用、用网页搜索补充平台文档，或者在本地把 prompt 导出成 YAML 排查。",
    columns: ["工具", "用途", "配置"],
    items: [
      { key: "langsmith", tool: "LangSmith", purpose: "大模型调用链路追踪与调试", config: "LANGSMITH_TRACING=true · LANGSMITH_API_KEY · LANGSMITH_PROJECT" },
      { key: "langfuse", tool: "Langfuse", purpose: "Agent + 工具的全链路追踪（OTel / OpenInference）", config: "LANGFUSE_PUBLIC_KEY · LANGFUSE_SECRET_KEY · LANGFUSE_HOST" },
      { key: "llmtrace", tool: "LLM Trace", purpose: "把 prompt 与 completion 导出成本地 YAML", config: "--save_llm_trace  →  {agent.home}/trajectory/" },
      { key: "tavily", tool: "Tavily", purpose: "平台文档的网页搜索兜底", config: "TAVILY_API_KEY" },
      { key: "github", tool: "GitHub Token", purpose: "拉取 GitHub 上的平台文档且不触发限流", config: "GITHUB_TOKEN" },
    ],
  },
  faqLead: "存储、Embedding、语义层、MCP、BI Copilot，以及数据库和模型在其中的位置。",
  closing: {
    heading: "把你的技术栈带来，我们负责接上",
    lead: "数据库、模型、语义层、BI Copilot 与可观测性——每一层都是插件。",
    startCta: "免费开始使用",
    docsCta: "阅读文档",
    githubCta: "在 GitHub 上浏览适配器",
  },
};

export const integrationsPage: Record<Locale, IntegrationsCopy> = { en: EN, zh: ZH };
