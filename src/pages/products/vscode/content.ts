import { Code2, Database, Lock, MessageSquare, Sparkles, Workflow } from "lucide-react";
import type { ProductPageData } from "../../../components/ProductPageTemplate";
import type { Locale } from "../../../i18n/config";

const MARKETPLACE_URL =
  "https://marketplace.visualstudio.com/items?itemName=datus-ai.datus-studio";
const VSCODE_DOCS_URL = "https://docs.datus.ai/0.3/vscode_extension/introduction/";

const EN: ProductPageData = {
  eyebrow: "Datus for VS Code & Cursor",
  positioning: "Your data engineering agent, inside VS Code and Cursor.",
  subhead:
    "The Datus Studio extension runs in VS Code, Cursor, and any VS Code-compatible editor. Your data stays fully local, you configure whatever models you want, and database credentials never leave your machine.",
  heroCtas: [
    { label: "Install from Marketplace", href: MARKETPLACE_URL, external: true, variant: "primary" },
    { label: "Read the docs", href: VSCODE_DOCS_URL, external: true, variant: "ghost" },
  ],
  problem: {
    heading: "Local-first, in the editor you already use.",
    body: "The extension is just a thin UI, it holds no models or credentials. Every capability is served by the Datus-agent web server running on your own machine, so nothing about your data or connections leaves your control.",
    bullets: [
      "Works in VS Code, Cursor, and other VS Code-compatible editors",
      "Your data stays fully local, nothing is sent to a cloud",
      "Bring and configure any model you want",
      "Database credentials live in your local Datus-agent, never in the extension",
    ],
  },
  capabilities: [
    { icon: Code2, title: "Inline SQL", body: "Generate, run, and chart SQL from natural language without leaving your editor." },
    { icon: Database, title: "Catalog & context explorer", body: "Browse the database catalog, context, and subagents in a side tree." },
    { icon: MessageSquare, title: "Studio chat panel", body: "Chat with the same Datus-agent backend, Plan mode confirms high-risk queries before they run." },
    { icon: Lock, title: "Credentials stay local", body: "The extension stores no secrets; your local Datus-agent serves every model and datasource." },
    { icon: Workflow, title: "Same lifecycle", body: "Plan → generate → validate → review, mirrored from the CLI workflow." },
    { icon: Sparkles, title: "Shared context", body: "Reuses the same context engine and knowledge base as the CLI and Studio." },
  ],
  quickstart: {
    heading: "Install and connect",
    steps: [
      {
        label: "Install the extension",
        body: "Install Datus Studio in VS Code or Cursor.",
      },
      {
        label: "Start the Datus web server",
        body: "Run the Datus-agent web server locally as the backend. Plain CLI mode exposes no HTTP port, so the --web flag is required.",
        code: "datus-cli --web   # serves http://localhost:8501",
      },
      {
        label: "Connect the local port",
        body: "Open the Datus Studio panel → gear icon → Settings, and point Endpoint at your local server.",
        code: "Endpoint = http://localhost:8501",
      },
    ],
    note: "Using a custom port? Run datus-cli --web --port 8080 and set the Endpoint to http://localhost:8080 to match.",
  },
  closingCta: {
    heading: "Add Datus to your editor.",
    body: "Free and open source. Runs entirely on your machine.",
    ctas: [
      { label: "Install from Marketplace", href: MARKETPLACE_URL, external: true, variant: "primary" },
      { label: "Read the docs", href: VSCODE_DOCS_URL, external: true, variant: "ghost" },
    ],
  },
};

const ZH: ProductPageData = {
  eyebrow: "Datus for VS Code & Cursor",
  positioning: "把数据工程 Agent 装进 VS Code 和 Cursor。",
  subhead:
    "Datus Studio 插件可以运行在 VS Code、Cursor 以及任何兼容 VS Code 的编辑器里。数据完全留在本地，模型由你自由配置，数据库凭据永远不会离开你的机器。",
  heroCtas: [
    { label: "从插件市场安装", href: MARKETPLACE_URL, external: true, variant: "primary" },
    { label: "阅读文档", href: VSCODE_DOCS_URL, external: true, variant: "ghost" },
  ],
  problem: {
    heading: "本地优先，就在你已经在用的编辑器里。",
    body: "插件只是一层很薄的 UI，本身不含模型也不存凭据。所有能力都由跑在你自己机器上的 Datus-agent web 服务提供，数据和连接信息始终在你掌控之中。",
    bullets: [
      "支持 VS Code、Cursor 以及其他兼容 VS Code 的编辑器",
      "数据完全留在本地，不会上传到任何云端",
      "模型自带、自由配置",
      "数据库凭据只存在本地 Datus-agent 中，插件里没有",
    ],
  },
  capabilities: [
    { icon: Code2, title: "行内 SQL", body: "不离开编辑器，就能用自然语言生成、执行 SQL 并出图。" },
    { icon: Database, title: "数据目录与上下文浏览器", body: "在侧边树里浏览数据库目录、上下文与子代理。" },
    { icon: MessageSquare, title: "Studio 对话面板", body: "与同一个 Datus-agent 后端对话；Plan 模式会在执行高风险查询前先与你确认。" },
    { icon: Lock, title: "凭据只在本地", body: "插件不保存任何密钥；模型与数据源统统由你本地的 Datus-agent 提供。" },
    { icon: Workflow, title: "同一套生命周期", body: "规划 → 生成 → 校验 → 评审，与 CLI 工作流完全一致。" },
    { icon: Sparkles, title: "共享上下文", body: "复用与 CLI、Studio 相同的上下文引擎和知识库。" },
  ],
  quickstart: {
    heading: "安装并连接",
    steps: [
      {
        label: "安装插件",
        body: "在 VS Code 或 Cursor 中安装 Datus Studio。",
      },
      {
        label: "启动 Datus web 服务",
        body: "在本地运行 Datus-agent web 服务作为后端。纯 CLI 模式不会开放 HTTP 端口，因此必须带上 --web 参数。",
        code: "datus-cli --web   # serves http://localhost:8501",
      },
      {
        label: "连接本地端口",
        body: "打开 Datus Studio 面板 → 齿轮图标 → Settings，把 Endpoint 指向你的本地服务。",
        code: "Endpoint = http://localhost:8501",
      },
    ],
    note: "用了自定义端口？执行 datus-cli --web --port 8080，并把 Endpoint 相应改成 http://localhost:8080。",
  },
  closingCta: {
    heading: "把 Datus 加进你的编辑器。",
    body: "免费且开源，全程在你自己的机器上运行。",
    ctas: [
      { label: "从插件市场安装", href: MARKETPLACE_URL, external: true, variant: "primary" },
      { label: "阅读文档", href: VSCODE_DOCS_URL, external: true, variant: "ghost" },
    ],
  },
};

export const vscodePage: Record<Locale, ProductPageData> = { en: EN, zh: ZH };
