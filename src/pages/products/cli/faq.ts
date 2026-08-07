import type { FaqItem } from "../../../components/FAQ";
import type { Locale } from "../../../i18n/config";

// Page-specific FAQ for /products/cli/ — install, models, Subagents, vs Studio,
// BYOK. Owned by this URL only (no cross-page duplicates); see datus-faq-spec.md.
// The Chinese branch answers the same questions on /zh/products/cli/, whose
// FAQPage JSON-LD is keyed to that URL — so there are still no duplicates.
const EN: FaqItem[] = [
  {
    q: "What do I need to install Datus CLI?",
    a: "You need Python 3.12 or newer and pip. Install with pip install datus-agent, then run datus-agent to start the interactive CLI. Configure your LLM API key and database connection in agent.yml. Datus CLI works on macOS and Linux today; Windows is supported via Python but not officially certified. Full setup steps are in docs.datus.ai Quickstart.",
  },
  {
    q: "Does Datus CLI work with my existing warehouse?",
    a: "Yes. Every database is a native Datus adapter: SQLite and DuckDB are built in, and Snowflake, PostgreSQL, MySQL, ClickZetta, StarRocks, ClickHouse, Hive, Spark and Trino ship as installable adapter packages (datus-snowflake, datus-trino, and so on). You point the CLI at your catalog or JDBC connection—no need to migrate data. Custom DB adapters can be added via the plugin architecture described in the GitHub repo.",
  },
  {
    q: "How is Datus CLI different from Datus Studio?",
    a: "Datus CLI is the full open-source agent for engineers: context building, Subagent creation, MCP tools, and local control. Datus Studio is the hosted web experience for faster trial and chat-style exploration. Both share the same Context Engine concepts; many teams prototype in Studio and run production workflows in CLI or Enterprise.",
  },
  {
    q: "Can I use my own LLM API keys with the CLI?",
    a: "Yes. Datus CLI is bring-your-own-key. You configure OpenAI, Claude, Qwen, DeepSeek, Kimi, Gemini, or others in agent.yml, including per-Subagent model overrides. Usage and cost stay on your provider account. Cloud Personal may offer managed keys; the open-source CLI never requires a Datus-hosted model.",
  },
  {
    q: "What can I build with Subagents in the CLI?",
    a: "A Subagent is a scoped chatbot backed by roughly ten tables, twenty metrics, and thirty reference SQL patterns for one business domain. You create them with .subagent add, refine context through feedback loops, and export mature Subagents as HTTP APIs or MCP servers for other agents to call.",
  },
];

const ZH: FaqItem[] = [
  {
    q: "安装 Datus CLI 需要什么？",
    a: "需要 Python 3.12 或更高版本以及 pip。执行 pip install datus-agent 安装，然后运行 datus-agent 启动交互式 CLI。在 agent.yml 中配置你的大模型 API Key 和数据库连接。Datus CLI 目前支持 macOS 与 Linux；Windows 可以通过 Python 运行，但尚未正式认证。完整步骤见 docs.datus.ai 的 Quickstart。",
  },
  {
    q: "Datus CLI 能接我现有的数仓吗？",
    a: "可以。所有数据库都通过 Datus 原生适配器接入：SQLite 与 DuckDB 是内置的，Snowflake、PostgreSQL、MySQL、ClickZetta、StarRocks、ClickHouse、Hive、Spark 与 Trino 则以可安装的适配器包形式提供（datus-snowflake、datus-trino 等）。你只需把 CLI 指向自己的数据目录或 JDBC 连接，不需要迁移数据。自定义数据库适配器可以按 GitHub 仓库中的插件架构自行扩展。",
  },
  {
    q: "Datus CLI 和 Datus Studio 有什么区别？",
    a: "Datus CLI 是面向工程师的完整开源 Agent：构建上下文、创建子代理、使用 MCP 工具，一切都在本地掌控。Datus Studio 则是托管的 Web 体验，适合快速试用和对话式探索。两者共享同一套上下文引擎概念；很多团队在 Studio 里做原型，在 CLI 或企业版里跑生产工作流。",
  },
  {
    q: "CLI 可以用我自己的大模型 API Key 吗？",
    a: "可以。Datus CLI 就是自带 Key 的模式。你可以在 agent.yml 中配置 OpenAI、Claude、Qwen、DeepSeek、Kimi、Gemini 等，还能给每个子代理单独指定模型。用量和费用都记在你自己的厂商账号上。云端个人版可能提供托管 Key；开源 CLI 从不强制使用 Datus 托管的模型。",
  },
  {
    q: "用 CLI 的子代理能做出什么？",
    a: "一个子代理就是围绕某个业务域收敛的聊天机器人，背后大约挂着十张表、二十个指标和三十条参考 SQL。用 .subagent add 创建，通过反馈循环打磨上下文，成熟之后还能导出成 HTTP API 或 MCP Server，供其他 Agent 调用。",
  },
];

export const cliFaq: Record<Locale, FaqItem[]> = { en: EN, zh: ZH };
