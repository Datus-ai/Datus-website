import { Boxes, Database, GitBranch, Layers, Server, TerminalSquare } from "lucide-react";
import type { ProductPageData } from "../../../components/ProductPageTemplate";
import { DOCS_URL, GITHUB_URL } from "../../../config/nav";

export const cliPage: ProductPageData = {
  eyebrow: "Datus CLI · Open source",
  positioning: "Run the modern data stack like a one-man data team, from your terminal.",
  subhead:
    "The open-source core of Datus. Install it, point it at your warehouse, and get a data engineering agent with an evolving context engine — your data, your model, your machine.",
  heroCtas: [
    { label: "View on GitHub", href: GITHUB_URL, external: true, variant: "primary" },
    { label: "Read the docs", href: DOCS_URL, external: true, variant: "ghost" },
  ],
  problem: {
    heading: "Built for engineers who live in the terminal.",
    body: "No black box, no lock-in. The CLI runs locally, connects to the warehouse and model you choose, and stores context you own — so the agent gets more accurate the more you use it.",
    bullets: [
      "Self-hosted and Apache-2.0 licensed",
      "Bring your own warehouse and your own LLM",
      "Portable context — the same engine powers Studio",
    ],
  },
  capabilities: [
    { icon: TerminalSquare, title: "Agent in your shell", body: "Plan, generate, validate, and review SQL through a conversational CLI that understands your schemas." },
    { icon: Database, title: "Context engine", body: "Indexes schemas, drafts a semantic model, and captures validated SQL into evolving memory." },
    { icon: Layers, title: "Full lifecycle", body: "From exploration to metrics to ETL jobs — one agent across the whole data lifecycle." },
    { icon: Boxes, title: "Subagents & skills", body: "Build domain-specific subagents and reusable skills that improve every run." },
    { icon: Server, title: "Pluggable storage", body: "Adapters for local and enterprise storage backends — portable knowledge bases." },
    { icon: GitBranch, title: "MCP & integrations", body: "Connect catalogs, schedulers, BI, and quality tools through MCP extensions." },
  ],
  quickstart: {
    heading: "Up and running in 5 minutes",
    steps: [
      { label: "Install", body: "Python 3.10+ required.", code: "pip install datus-agent" },
      { label: "Initialize", body: "Connect a warehouse and index your schemas.", code: "datus init --warehouse snowflake" },
      { label: "Chat", body: "Ask a question and let the agent plan, generate, and validate.", code: "datus chat" },
    ],
    note: "Want sample data? The docs include a demo dataset to try the full workflow end-to-end.",
  },
  closingCta: {
    heading: "Start with the open-source CLI.",
    body: "Free, Apache-2.0. Star the repo to follow along.",
    ctas: [
      { label: "View on GitHub", href: GITHUB_URL, external: true, variant: "primary" },
      { label: "Read the docs", href: DOCS_URL, external: true, variant: "ghost" },
    ],
  },
};
