import {
  Database, KeyRound, Layers, MessagesSquare, Plug, RefreshCw, ScanEye, ShieldCheck, Workflow,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { DOCS_URL, GITHUB_URL } from "../../../config/nav";
import type { Locale } from "../../../i18n/config";

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

export interface CliCopy {
  hero: { eyebrow: string; title: string; subhead: string; ctas: CliCta[] };
  parity: { eyebrow: string; heading: string; body: string; cards: FeatureCard[] };
  modelNeutral: {
    eyebrow: string;
    heading: string;
    body: string;
    docsLabel: string;
    docsHref: string;
    /** Column headings of the per-subagent routing table. */
    columns: [string, string, string];
    routes: ModelRoute[];
    stats: { value: string; label: string }[];
    note: string;
  };
  guardrails: { eyebrow: string; heading: string; body: string; pillars: GuardrailPillar[] };
  ecosystem: {
    eyebrow: string;
    heading: string;
    body: string;
    cards: FeatureCard[];
    linkLabel: string;
    linkHref: string;
  };
  faqLead: string;
  closing: { heading: string; body: string; ctas: CliCta[]; byo: string };
  claudeCodeNote: { text: string; linkLabel: string; href: string };
}

const DOCS_03 = `${DOCS_URL}/0.3`;
const CLAUDE_CODE_MCP_HREF = `${DOCS_03}/integration/mcp/#claude-code`;

const EN: CliCopy = {
  hero: {
    eyebrow: "Open source · Apache-2.0",
    title: "Better Claude Code for data engineers.",
    subhead:
      "Everything you love about Claude Code, skills, MCP, self-evolving memory, rebuilt for the data stack. Model-neutral, governed, and wired into your warehouse from the first command.",
    ctas: [
      { label: "Quickstart", href: QUICKSTART_URL, external: true, variant: "primary" },
      { label: "View on GitHub", href: GITHUB_URL, external: true, variant: "ghost" },
      { label: "Read the docs", href: DOCS_URL, external: true, variant: "ghost" },
    ],
  },
  // Section 0, parity with Claude Code's general agent capabilities.
  parity: {
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
    ],
  },
  // Differentiator 1, model neutrality.
  modelNeutral: {
    eyebrow: "Where Datus goes further · 01",
    heading: "Model-neutral by design.",
    body: "Not locked to one vendor. Route each subagent to the model that fits its job, or run an all-Claude lineup. See the full supported-models list in the docs.",
    docsLabel: "Supported models",
    docsHref: MODELS_DOCS_URL,
    columns: ["Subagent", "Model", "Why"],
    routes: [
      { agent: "extract_knowledge · feedback", model: "DeepSeek", href: "https://www.deepseek.com/", strength: "Long context, low cost" },
      { agent: "complex ETL tasks", model: "GPT-5.5", href: "https://openai.com/", strength: "Strongest coding" },
      { agent: "ask_metrics subagents", model: "Gemini 3 Flash", href: "https://deepmind.google/models/gemini/", strength: "Blazing fast, cheap" },
    ],
    stats: [
      { value: "30%", label: "of the cost" },
      { value: "90%", label: "of the quality" },
      { value: "50%", label: "faster" },
    ],
    note: "Prefer one family? Mix Claude Haiku, Sonnet, Opus, and Fable across the same agents, your call.",
  },
  // Differentiator 2, permissions & guardrails.
  guardrails: {
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
        ],
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
    ],
  },
  // Differentiator 3, big-data ecosystem.
  ecosystem: {
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
    ],
    linkLabel: "Browse all integrations",
    linkHref: INTEGRATIONS_URL,
  },
  faqLead: "Install, models, Subagents, and how the CLI relates to Studio.",
  closing: {
    heading: "Start with the open-source CLI.",
    body: "Free, Apache-2.0, your data and model. Five minutes from install to your first validated query.",
    ctas: [
      { label: "Quickstart", href: QUICKSTART_URL, external: true, variant: "primary" },
      { label: "View on GitHub", href: GITHUB_URL, external: true, variant: "ghost" },
    ],
    byo: "Bring your own warehouse & model",
  },
  claudeCodeNote: {
    text: "Fine, we know you still love Claude Code, you can use datus-mcp right inside it.",
    linkLabel: "Learn how",
    href: CLAUDE_CODE_MCP_HREF,
  },
};

const ZH: CliCopy = {
  hero: {
    eyebrow: "开源 · Apache-2.0",
    title: "为数据工程师打造的更好的 Claude Code。",
    subhead:
      "你喜欢 Claude Code 的一切——Skills、MCP、自我演进的记忆——统统为数据栈重做了一遍。模型中立、可治理，从第一条命令起就接进你的数仓。",
    ctas: [
      { label: "快速开始", href: QUICKSTART_URL, external: true, variant: "primary" },
      { label: "在 GitHub 上查看", href: GITHUB_URL, external: true, variant: "ghost" },
      { label: "阅读文档", href: DOCS_URL, external: true, variant: "ghost" },
    ],
  },
  parity: {
    eyebrow: "对齐 Claude Code",
    heading: "Claude Code 的全部能力，都在你的数据终端里。",
    body: "Datus CLI 保留了你已经依赖的通用 Agent 能力，不需要你重新学任何东西。",
    cards: [
      {
        icon: RefreshCw,
        title: "会自我演进的 Agent",
        body: "Skills、知识与记忆都会自行迭代，每跑一次，下一次就更准。",
        links: [{ label: "知识库", href: `${DOCS_03}/cli/build_kb_command/` }],
      },
      {
        icon: Plug,
        title: "完整支持 MCP 与 Skills",
        body: "完整支持 MCP 生态与 Skill 体系。任何工具都能接，任何 Skill 都能上。",
        links: [
          { label: "MCP", href: `${DOCS_03}/cli/mcp_extensions/` },
          { label: "Skills", href: `${DOCS_03}/integration/skills/` },
        ],
      },
      {
        icon: MessagesSquare,
        title: "IM 网关",
        body: "在团队已经在用的地方驱动 Agent，内置 Slack 与飞书频道集成。",
        links: [{ label: "IM 网关", href: `${DOCS_03}/gateway/introduction/` }],
      },
    ],
  },
  modelNeutral: {
    eyebrow: "Datus 更进一步的地方 · 01",
    heading: "设计上就模型中立。",
    body: "不绑定任何一家厂商。可以给每个子代理挑最合适的模型，也可以全线跑 Claude。完整的支持模型清单见文档。",
    docsLabel: "支持的模型",
    docsHref: MODELS_DOCS_URL,
    columns: ["子代理", "模型", "为什么"],
    routes: [
      { agent: "extract_knowledge · feedback", model: "DeepSeek", href: "https://www.deepseek.com/", strength: "长上下文，成本低" },
      { agent: "complex ETL tasks", model: "GPT-5.5", href: "https://openai.com/", strength: "编码能力最强" },
      { agent: "ask_metrics subagents", model: "Gemini 3 Flash", href: "https://deepmind.google/models/gemini/", strength: "极快且便宜" },
    ],
    stats: [
      { value: "30%", label: "的成本" },
      { value: "90%", label: "的质量" },
      { value: "50%", label: "更快" },
    ],
    note: "更喜欢用同一家？Claude Haiku、Sonnet、Opus、Fable 也可以在同一批 Agent 里混搭，你说了算。",
  },
  guardrails: {
    eyebrow: "Datus 更进一步的地方 · 02",
    heading: "数据栈真正需要的安全护栏。",
    body: "Agent 会碰到生产数据。Datus 在模型与你的数仓之间放了三层真正起作用的控制。",
    pillars: [
      {
        icon: KeyRound,
        title: "工具权限模式",
        body: "Agent 能拿到多大权限，可以按会话或按子代理设置：",
        modes: [
          { name: "normal", scope: "只读", body: "只做探索、查询与规划，不写入任何东西。", tone: "ok" },
          { name: "auto", scope: "可编辑", body: "在自己的范围内修改并交付，不用逐步确认。", tone: "warn" },
          { name: "dangerous", scope: "数据沙箱", body: "全权限操作，但被限制在沙箱之内。", tone: "danger" },
        ],
        links: [{ label: "参考文档", href: `${DOCS_03}/cli/reference/#system` }],
      },
      {
        icon: ScanEye,
        title: "查询期范围收敛",
        body: "子代理运行时能看到什么，可以精确收敛到：",
        items: [
          { label: "指标", desc: "只暴露本次相关的指标定义" },
          { label: "Reference SQL", desc: "经过筛选、可供学习的示例查询" },
          { label: "参考模板", desc: "可复用、已审核的查询模板" },
          { label: "数据表", desc: "明确允许它读取的那几张表" },
        ],
        links: [{ label: "自定义子代理", href: `${DOCS_03}/subagent/customized_subagent/` }],
      },
      {
        icon: ShieldCheck,
        title: "数据访问策略",
        body: "在模型之外强制执行，作用于 Agent 跑的每一条查询：",
        items: [
          { label: "行级访问策略", desc: "按角色、团队或租户过滤数据行" },
          { label: "列脱敏策略", desc: "敏感列在进入模型之前先脱敏" },
          { label: "SQL 注入检测与拦截", desc: "不安全的 SQL 会被识别并拦下" },
          { label: "审计留痕", desc: "每条查询都有日志，可随时复核" },
        ],
        links: [{ label: "SQL 策略", href: `${DOCS_03}/configuration/sql_policy/` }],
      },
    ],
  },
  ecosystem: {
    eyebrow: "Datus 更进一步的地方 · 03",
    heading: "为大数据生态而建。",
    body: "数仓、语义层、调度、BI——Datus 接得进你已经在跑的技术栈，内置的 Skills 与子代理覆盖整个开发生命周期。",
    cards: [
      {
        icon: Database,
        title: "接入你的技术栈",
        body: "Snowflake、Databricks、StarRocks、ClickHouse、MetricFlow、Airflow、Superset、Grafana 等等。",
      },
      {
        icon: Workflow,
        title: "覆盖全生命周期的 Skills",
        body: "内置的 Skills 与子代理，带你从探索到指标再到生产 ETL，端到端跑完。",
      },
      {
        icon: Layers,
        title: "一份可演进的上下文",
        body: "表结构、语义与经过校验的 SQL 都会沉淀成可迁移的记忆，为每一个集成供能。",
      },
    ],
    linkLabel: "浏览全部集成",
    linkHref: INTEGRATIONS_URL,
  },
  faqLead: "安装、模型、子代理，以及 CLI 与 Studio 之间的关系。",
  closing: {
    heading: "从开源 CLI 开始。",
    body: "免费、Apache-2.0，数据和模型都是你自己的。从安装到第一条经过校验的查询，五分钟搞定。",
    ctas: [
      { label: "快速开始", href: QUICKSTART_URL, external: true, variant: "primary" },
      { label: "在 GitHub 上查看", href: GITHUB_URL, external: true, variant: "ghost" },
    ],
    byo: "自带数仓与模型",
  },
  claudeCodeNote: {
    text: "好吧，我们知道你还是爱 Claude Code——你完全可以在它里面直接用 datus-mcp。",
    linkLabel: "了解怎么做",
    href: CLAUDE_CODE_MCP_HREF,
  },
};

export const cliPage: Record<Locale, CliCopy> = { en: EN, zh: ZH };
