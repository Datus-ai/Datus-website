import {
  Database, KeyRound, Layers, MessagesSquare, Plug, RefreshCw, ScanEye, ShieldCheck, Workflow,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { DOCS_URL, GITHUB_URL } from "../../../config/nav";

export const QUICKSTART_URL = "https://docs.datus.ai/getting_started/Quickstart/";
export const MODELS_DOCS_URL = `${DOCS_URL}/configuration/agent/`;
export const INTEGRATIONS_URL = "/integrations/";

export interface CliCta {
  label: string;
  href: string;
  external?: boolean;
  variant: "primary" | "ghost";
}

export interface DocLink {
  label: string;
  href: string;
}

export interface FeatureCard {
  icon: LucideIcon;
  title: string;
  body: string;
  links?: DocLink[];
}

export interface ModelRoute {
  agent: string;
  model: string;
  href: string;
  strength: string;
}

export interface PermissionMode {
  name: string;
  scope: string;
  body: string;
  tone: "ok" | "warn" | "danger";
}

export interface GuardrailPillar {
  icon: LucideIcon;
  title: string;
  body: string;
  modes?: PermissionMode[];
  items?: { label: string; desc: string }[];
  links?: DocLink[];
}

const DOCS_03 = `${DOCS_URL}/0.3`;

export const cliHero = {
  eyebrow: "Open source · Apache-2.0",
  title: "Better Claude Code for data engineers.",
  subhead:
    "Everything you love about Claude Code, skills, MCP, self-evolving memory, rebuilt for the data stack. Model-neutral, governed, and wired into your warehouse from the first command.",
  ctas: [
    { label: "Quickstart", href: QUICKSTART_URL, external: true, variant: "primary" },
    { label: "View on GitHub", href: GITHUB_URL, external: true, variant: "ghost" },
    { label: "Read the docs", href: DOCS_URL, external: true, variant: "ghost" },
  ] as CliCta[],
};

// Section 0, parity with Claude Code's general agent capabilities.
export const parity = {
  eyebrow: "Claude Code parity",
  heading: "All of Claude Code's power, in your data terminal.",
  body: "Datus CLI keeps the general agent capabilities you already rely on, and adds nothing you have to relearn.",
  cards: [
    {
      icon: RefreshCw,
      title: "Self-evolving agent",
      body: "Skills, knowledge, and memory that iterate on their own, every run sharpens the next.",
      links: [{ label: "Knowledge base", href: `${DOCS_03}/cli/build_kb_command/` }],
    },
    {
      icon: Plug,
      title: "MCP & Skills, in full",
      body: "Complete support for the MCP ecosystem and the Skill system. Bring any tool, ship any skill.",
      links: [
        { label: "MCP", href: `${DOCS_03}/cli/mcp_extensions/` },
        { label: "Skills", href: `${DOCS_03}/integration/skills/` },
      ],
    },
    {
      icon: MessagesSquare,
      title: "IM Gateway",
      body: "Drive the agent from where your team already works, Slack and Lark channel integration built in.",
      links: [{ label: "IM Gateway", href: `${DOCS_03}/gateway/introduction/` }],
    },
  ] as FeatureCard[],
};

// Differentiator 1, model neutrality.
export const modelNeutral = {
  eyebrow: "Where Datus goes further · 01",
  heading: "Model-neutral by design.",
  body: "Not locked to one vendor. Route each subagent to the model that fits its job, or run an all-Claude lineup. See the full supported-models list in the docs.",
  docsLabel: "Supported models",
  docsHref: MODELS_DOCS_URL,
  routes: [
    { agent: "extract_knowledge · feedback", model: "DeepSeek", href: "https://www.deepseek.com/", strength: "Long context, low cost" },
    { agent: "complex ETL tasks", model: "GPT-5.5", href: "https://openai.com/", strength: "Strongest coding" },
    { agent: "ask_metrics subagents", model: "Gemini 3 Flash", href: "https://deepmind.google/models/gemini/", strength: "Blazing fast, cheap" },
  ] as ModelRoute[],
  stats: [
    { value: "30%", label: "of the cost" },
    { value: "90%", label: "of the quality" },
    { value: "50%", label: "faster" },
  ],
  note: "Prefer one family? Mix Claude Haiku, Sonnet, Opus, and Fable across the same agents, your call.",
};

// Differentiator 2, permissions & guardrails.
export const guardrails = {
  eyebrow: "Where Datus goes further · 02",
  heading: "Guardrails the data stack actually needs.",
  body: "Agents touch production data. Datus puts three layers of real control between the model and your warehouse.",
  pillars: [
    {
      icon: KeyRound,
      title: "Tool permission modes",
      body: "How much power the agent gets, set per session or per subagent:",
      modes: [
        { name: "normal", scope: "Read-only", body: "Explore, query, and plan. Nothing gets written.", tone: "ok" },
        { name: "auto", scope: "Editing", body: "Edits and ships within its lane, no prompt per step.", tone: "warn" },
        { name: "dangerous", scope: "Data sandbox", body: "Full-power operations, contained to a sandbox.", tone: "danger" },
      ] as PermissionMode[],
      links: [{ label: "Reference", href: `${DOCS_03}/cli/reference/#system` }],
    },
    {
      icon: ScanEye,
      title: "Query-time scoping",
      body: "What a subagent can see at run time, scope it down to just:",
      items: [
        { label: "Metrics", desc: "Only the metric definitions in play" },
        { label: "Reference SQL", desc: "Curated example queries to learn from" },
        { label: "Reference templates", desc: "Reusable, vetted query templates" },
        { label: "Tables", desc: "The exact tables it's allowed to read" },
      ],
      links: [{ label: "Customized subagents", href: `${DOCS_03}/subagent/customized_subagent/` }],
    },
    {
      icon: ShieldCheck,
      title: "Data access policy",
      body: "Enforced outside the model, on every query the agent runs:",
      items: [
        { label: "Row access policy", desc: "Filter rows by role, team, or tenant" },
        { label: "Column masking policy", desc: "Mask sensitive columns before they reach the model" },
        { label: "SQL-injection detection & block", desc: "Unsafe SQL is caught and stopped" },
        { label: "Audit trail", desc: "Every query logged and reviewable" },
      ],
      links: [{ label: "SQL policy", href: `${DOCS_03}/configuration/sql_policy/` }],
    },
  ] as GuardrailPillar[],
};

// Differentiator 3, big-data ecosystem.
export const ecosystem = {
  eyebrow: "Where Datus goes further · 03",
  heading: "Built for the big-data ecosystem.",
  body: "Warehouses, semantic layers, schedulers, BI, Datus plugs into the stack you already run, and its built-in skills and subagents cover the whole development lifecycle.",
  cards: [
    {
      icon: Database,
      title: "Connect your stack",
      body: "Snowflake, Databricks, StarRocks, ClickHouse, MetricFlow, Airflow, Superset, Grafana, and more.",
    },
    {
      icon: Workflow,
      title: "Full-lifecycle skills",
      body: "Built-in skills and subagents take you from exploration to metrics to production ETL, end to end.",
    },
    {
      icon: Layers,
      title: "One evolving context",
      body: "Schemas, semantics, and validated SQL captured into portable memory that powers every integration.",
    },
  ] as FeatureCard[],
  linkLabel: "Browse all integrations",
  linkHref: INTEGRATIONS_URL,
};

export const closing = {
  heading: "Start with the open-source CLI.",
  body: "Free, Apache-2.0, your data and model. Five minutes from install to your first validated query.",
  ctas: [
    { label: "Quickstart", href: QUICKSTART_URL, external: true, variant: "primary" },
    { label: "View on GitHub", href: GITHUB_URL, external: true, variant: "ghost" },
  ] as CliCta[],
};

export const claudeCodeNote = {
  text: "Fine, we know you still love Claude Code, you can use datus-mcp right inside it.",
  linkLabel: "Learn how",
  href: `${DOCS_03}/integration/mcp/#claude-code`,
};
