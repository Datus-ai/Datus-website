import type { FaqItem } from "../../../components/FAQ";

// Page-specific FAQ for /products/cli/ — install, models, Subagents, vs Studio,
// BYOK. Owned by this URL only (no cross-page duplicates); see datus-faq-spec.md.
export const cliFaq: FaqItem[] = [
  {
    q: "What do I need to install Datus CLI?",
    a: "You need Python 3.12 or newer and pip. Install with pip install datus-agent, then run datus-agent to start the interactive CLI. Configure your LLM API key and database connection in agent.yml. Datus CLI works on macOS and Linux today; Windows is supported via Python but not officially certified. Full setup steps are in docs.datus.ai Quickstart.",
  },
  {
    q: "Does Datus CLI work with my existing warehouse?",
    a: "Yes. Datus ships native adapters for Snowflake, PostgreSQL, MySQL, ClickZetta, and others, plus MCP-based connectors for DuckDB, StarRocks, Hive, Spark, ClickHouse, and Trino. You point the CLI at your catalog or JDBC connection—no need to migrate data. Custom DB adapters can be added via the plugin architecture described in the GitHub repo.",
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
