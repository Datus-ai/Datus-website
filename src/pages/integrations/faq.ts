import type { FaqItem } from "../../components/FAQ";

// Page-specific FAQ for /integrations/ — storage, embeddings, semantic layer,
// MCP, BI copilot, and how databases/models fit in. Content is adapted from the
// datus-design integrations template. Owned by this URL only; see datus-faq-spec.md.
export const integrationsFaq: FaqItem[] = [
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
