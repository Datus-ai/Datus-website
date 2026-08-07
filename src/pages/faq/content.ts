import type { FaqItem } from "../../components/FAQ";
import type { Locale } from "../../i18n/config";

export interface FaqProduct {
  name: string;
  href: string;
  body: string;
}

export type { FaqItem };

export interface FaqPageCopy {
  hero: { eyebrow: string; heading: string; lead: string };
  productsSection: { eyebrow: string; heading: string; lead: string; learnMore: string };
  products: FaqProduct[];
  questions: { eyebrow: string; heading: string };
  faqs: FaqItem[];
  closing: {
    heading: string;
    lead: string;
    docs: string;
    github: string;
    slack: string;
  };
}

// What each Datus product is, in one paragraph.
const EN: FaqPageCopy = {
  hero: {
    eyebrow: "FAQ",
    heading: "Frequently asked questions about Datus.",
    lead: "What Datus is, what each product does, and the questions teams ask most often when adopting an open-source data engineering agent.",
  },
  productsSection: {
    eyebrow: "Products",
    heading: "What are the Datus products?",
    lead: "One context engine, four ways to use it, from a local terminal to a governed enterprise platform.",
    learnMore: "Learn more",
  },
  products: [
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
  ],
  questions: { eyebrow: "Common questions", heading: "Datus, answered." },
  // Brand-level questions only. Page-specific FAQs (install, pricing tiers,
  // supported databases, etc.) live on their owning pages — /products/cli/,
  // /pricing/, /integrations/ — so no question is duplicated across URLs
  // (see datus-faq-spec.md §二.2 / §六.3).
  faqs: [
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
  ],
  closing: {
    heading: "Still have a question?",
    lead: "Read the docs, browse the open-source repo, or ask the team in our community Slack.",
    docs: "Read the docs",
    github: "View on GitHub",
    slack: "Ask in Slack",
  },
};

const ZH: FaqPageCopy = {
  hero: {
    eyebrow: "常见问题",
    heading: "关于 Datus 的常见问题。",
    lead: "Datus 是什么、每个产品做什么，以及团队在引入开源数据工程 Agent 时问得最多的那些问题。",
  },
  productsSection: {
    eyebrow: "产品",
    heading: "Datus 有哪些产品？",
    lead: "一套上下文引擎，四种使用方式——从本地终端一路到受治理的企业平台。",
    learnMore: "了解更多",
  },
  products: [
    {
      name: "Datus CLI",
      href: "/products/cli/",
      body: "开源内核：装在终端里的数据工程 Agent。把它指向你的数仓和你自己的模型，构建可演进的上下文引擎，并生成经过校验的 SQL。采用 Apache-2.0 许可。",
    },
    {
      name: "VS Code & Cursor 插件",
      href: "/products/vscode/",
      body: "把 Datus Studio 装进编辑器。这是一个本地优先的插件，只与跑在你自己机器上的 Datus-agent web 服务通信，数据和凭据都不会离开本机。支持 VS Code、Cursor 及其他兼容 VS Code 的编辑器。",
    },
    {
      name: "Datus Studio",
      href: "/products/studio/",
      body: "托管的云端工作空间，也是最省事的上手方式。免安装：接上数仓和模型，直接在浏览器里提问。早期体验期免费。",
    },
    {
      name: "Datus 企业版",
      href: "/products/enterprise/",
      body: "面向团队的共享上下文、治理能力与长时运行 Agent，部署在你自己的环境中（BYOC）。额外提供全组织受治理的语义层、RBAC、审计与 SSO。",
    },
  ],
  questions: { eyebrow: "常见疑问", heading: "关于 Datus，一次说清。" },
  faqs: [
    {
      q: "Datus 是什么？",
      a: "Datus 是一个开源的数据工程 Agent。它连接你的数据仓库和你选定的大模型，把表结构、语义与经过校验的 SQL 沉淀成一套可演进的上下文引擎，并用它在整条数据生命周期上做规划、生成、校验与解释 SQL——从探索到指标，再到生产 ETL。",
    },
    {
      q: "什么是数据工程 Agent？",
      a: "数据工程 Agent 是端到端规划并执行数据工作的 AI 系统：表结构发现、SQL 生成、校验、指标与管道任务，全部锚定在关于你自己这套技术栈的持久上下文之上。和 SQL Copilot 不同，它远不只是补全一条查询。",
    },
    {
      q: "Datus 是开源且免费的吗？",
      a: "是的。Datus CLI 与 VS Code 插件基于 Apache-2.0 开源，可免费自行部署。Datus Studio（云端）在早期体验期免费，Datus 企业版则按需定价，包含治理、SSO 与技术支持。",
    },
    {
      q: "Datus 和 SQL Copilot 或 text-to-SQL 工具有什么不同？",
      a: "Copilot 只补全一条查询。Datus 带着一套持久且不断演进的上下文引擎，会拿生成的 SQL 到你的数仓上做校验，会治理 Agent 能访问什么，并覆盖指标、ETL 与监控的完整生命周期，而不只是单条查询的生成。",
    },
    {
      q: "Datus 会保护我的数据和凭据吗？",
      a: "会。Datus 是本地优先的：CLI 与 VS Code 插件都跑在你自己的机器上，连接你选定的数仓与模型，沉淀的上下文归你所有。数据库凭据只保存在本地的 Datus-agent 中，绝不会进到你无法掌控的云上。",
    },
    {
      q: "怎么快速开始使用 Datus？",
      a: "用 pip install datus-agent 安装开源 CLI，把它指向一个数据源，然后执行 datus chat。或者干脆免安装，直接在浏览器里试 Datus Studio。详见文档中的 Quickstart。",
    },
  ],
  closing: {
    heading: "还有问题？",
    lead: "看看文档、逛逛开源仓库，或者到我们的社区 Slack 里直接问团队。",
    docs: "阅读文档",
    github: "在 GitHub 上查看",
    slack: "去 Slack 提问",
  },
};

export const faqPage: Record<Locale, FaqPageCopy> = { en: EN, zh: ZH };
