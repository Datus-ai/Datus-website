export interface FaqProduct {
  name: string;
  href: string;
  body: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

// What each Datus product is, in one paragraph.
export const faqProducts: FaqProduct[] = [
  {
    name: "Datus CLI",
    href: "/products/cli/",
    body: "The open-source core: a data engineering agent in your terminal. Point it at your warehouse and your own model, build an evolving context engine, and generate validated SQL. Apache-2.0 licensed.",
  },
  {
    name: "VS Code & Cursor extension",
    href: "/products/vscode/",
    body: "Datus Studio inside your editor. A local-first extension that talks to a Datus-agent web server on your own machine, so data and credentials never leave it. Works in VS Code, Cursor, and other VS Code-compatible editors.",
  },
  {
    name: "Datus Studio",
    href: "/products/studio/",
    body: "The hosted cloud workspace and the easiest way to start. No install: connect a warehouse and a model, then ask questions right in the browser. Free during early access.",
  },
  {
    name: "Datus Enterprise",
    href: "/products/enterprise/",
    body: "Shared context, governance, and long-running agents for teams, deployed in your own environment (BYOC). Adds an org-wide governed semantic layer, RBAC, audit, and SSO.",
  },
];

// GEO-friendly questions: the things people (and AI search engines) actually ask.
export const faqs: FaqItem[] = [
  {
    q: "What is Datus?",
    a: "Datus is an open-source data engineering agent. It connects to your data warehouse and the LLM of your choice, builds an evolving context engine of your schemas, semantics, and validated SQL, and uses it to plan, generate, validate, and explain SQL across the whole data lifecycle, from exploration to metrics to production ETL.",
  },
  {
    q: "What is a data engineering agent?",
    a: "A data engineering agent is an AI system that plans and executes data work end to end: schema discovery, SQL generation, validation, metrics, and pipeline tasks, grounded in persistent context about your specific stack. Unlike a SQL copilot, it does far more than autocomplete a single query.",
  },
  {
    q: "Is Datus open source and free?",
    a: "Yes. The Datus CLI and VS Code extension are open source under Apache-2.0 and free to self-host. Datus Studio (cloud) is free during early access, and Datus Enterprise is custom-priced with governance, SSO, and support.",
  },
  {
    q: "Which data warehouses and databases does Datus support?",
    a: "Datus connects to Snowflake, Databricks, Redshift, StarRocks, ClickHouse, Doris, Greenplum, PostgreSQL, MySQL, Hive, Spark, Trino, and any SQLAlchemy-compatible database through open DB adapters.",
  },
  {
    q: "Which LLMs and models does Datus support?",
    a: "Datus is model-neutral. Use OpenAI, Anthropic Claude, DeepSeek, Google Gemini, Qwen, or local models, and route different subagents to different models to balance cost, speed, and quality.",
  },
  {
    q: "How is Datus different from a SQL copilot or text-to-SQL tool?",
    a: "A copilot autocompletes one query. Datus carries a persistent, evolving context engine, validates generated SQL against your warehouse, governs what the agent can access, and covers the full lifecycle of metrics, ETL, and monitoring, not just single-query generation.",
  },
  {
    q: "Does Datus keep my data and credentials private?",
    a: "Yes. Datus is local-first: the CLI and VS Code extension run on your machine, connect to the warehouse and model you choose, and store context you own. Database credentials live in your local Datus-agent, never in a cloud you do not control.",
  },
  {
    q: "How do I get started with Datus?",
    a: "Install the open-source CLI with pip install datus-agent, point it at a data source, and run datus chat. Or try Datus Studio in the browser with no install. See the Quickstart in the docs.",
  },
  {
    q: "What is the Datus semantic layer (Semantic Hub)?",
    a: "Datus Enterprise turns metrics into a governed, org-wide semantic layer. Every workspace shares one metric tree with a full lifecycle (Unverified, Verified, Certified, Deprecated, Archived), GitHub-style PR review, lineage, and RBAC. It is OSI-aligned and not locked to any BI tool or warehouse.",
  },
  {
    q: "Does Datus work in VS Code and Cursor?",
    a: "Yes. The Datus Studio extension runs in VS Code, Cursor, and other VS Code-compatible editors. It connects to a local Datus-agent web server, so models and credentials stay on your machine.",
  },
  {
    q: "What can I build with Datus?",
    a: "Explore schemas, generate and validate SQL, define and govern metrics, build dashboards and reports, and ship agent-built jobs into schedulers like Airflow, across Snowflake, Databricks, ClickHouse, and more.",
  },
];
