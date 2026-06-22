import type { FaqItem } from "../../components/FAQ";

// Page-specific FAQ for /integrations/ — supported databases, semantic models,
// MCP, custom adapters, BI tools. Owned by this URL only; see datus-faq-spec.md.
export const integrationsFaq: FaqItem[] = [
  {
    q: "Which databases does Datus support out of the box?",
    a: "Native adapters include ClickZetta, Snowflake, PostgreSQL, and MySQL. MCP-based connectors cover DuckDB, StarRocks, Hive, Spark, ClickHouse, and Trino as of v0.2.6. The adapter layer is plugin-based, so new warehouses can be added without forking core code. See the GitHub repo for the current adapter matrix.",
  },
  {
    q: "Can Datus connect to dbt, MetricFlow, or Cube semantic models?",
    a: "Yes. Datus ingests MetricFlow-compatible YAML and can reinforce semantic definitions from existing models rather than forcing re-modeling. Cube and other semantic layers can feed the Context Engine while Datus adds scoped Subagents, reference SQL, and feedback loops on top for agent consumption.",
  },
  {
    q: "How does MCP fit into Datus integrations?",
    a: "Datus acts as both MCP client and server. As a client, it calls external MCP tools—for example Airflow or quality checkers—via .mcp add. As a server, it exposes database and context search tools to Claude Desktop, Claude Code, or other agents. MCP is an extension layer; core SQL and context paths use native tools.",
  },
  {
    q: "Can I contribute a custom database adapter?",
    a: "Yes. v0.2.3 introduced a plugin architecture for DB adapters. Contributors implement the adapter interface, publish via GitHub PR, and document connection parameters. Enterprise customers sometimes maintain private adapters; the open-source repo documents patterns for JDBC-like and warehouse-specific auth.",
  },
  {
    q: "Does Datus integrate with BI tools like Looker or Tableau?",
    a: "Datus does not replace BI dashboards. It integrates at the semantics and query layer: ingesting models, capturing validated SQL from BI usage, and powering chat or API interfaces that respect the same metrics. Dashboard Copilot can bootstrap Subagents from BI metadata where supported.",
  },
];
