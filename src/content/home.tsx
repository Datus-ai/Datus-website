import type { ReactNode } from "react";
import type { Locale } from "../i18n/config";
import { useHref } from "../i18n/LocaleContext";
import type { FaqItem } from "../components/FAQ";
import type { Surface } from "../components/SurfaceCarousel";

/* --------------------------- Inline anchor link --------------------------- */
/**
 * Subtle in-copy internal link — used to weave anchor text to related pages.
 * `href` is written in English form and prefixed for the active locale here, so
 * a reader on `/zh/` stays inside `/zh/`.
 */
export function A({
  href,
  external,
  children,
}: {
  href: string;
  external?: boolean;
  children: ReactNode;
}) {
  const l = useHref();
  return (
    <a
      href={external ? href : l(href)}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      style={{ color: "var(--brand-bright)", textDecoration: "underline", textUnderlineOffset: 2 }}
    >
      {children}
    </a>
  );
}

/**
 * Homepage copy, one branch per locale.
 *
 * The Chinese side is the One Story wording from the positioning doc, with the
 * locked terminology from datus-i18n-spec.md §5: 数据工程 Agent, 上下文引擎,
 * 语义层, 子代理, 一人数据团队, 企业 Agent 团队. Product names, CLI commands and
 * vendor names stay in English.
 */
export type HomeCopy = {
  hero: {
    eyebrow: string;
    titleLead: string;
    titleAccent: string;
    lead: ReactNode;
    ctaPrimary: string;
    ctaGithub: string;
    contact: string;
    byoWarehouse: ReactNode;
    byoModel: ReactNode;
  };
  terminal: {
    connected: string;
    ready: string;
    pipeline: string;
    captured: string;
    selfEvolve: string;
    memory: string;
  };
  prompts: string[];
  proof: { value: string; label: string }[];
  problem: {
    eyebrow: string;
    heading: string;
    lead: string;
    colProblem: string;
    colDatus: string;
    rows: { problem: string; solution: ReactNode }[];
  };
  layers: {
    eyebrow: string;
    heading: string;
    lead: ReactNode;
    items: { name: string; caption: string; chips: string[] }[];
  };
  lifecycle: {
    eyebrow: string;
    heading: string;
    lead: ReactNode;
    phases: string[];
  };
  useCases: {
    eyebrow: string;
    heading: string;
    lead: string;
    items: { title: string; body: ReactNode }[];
  };
  surfaces: {
    eyebrow: string;
    heading: string;
    lead: string;
    items: Surface[];
  };
  stack: {
    eyebrow: string;
    heading: string;
    lead: string;
    model: string;
    byo: string;
    groups: string[];
    seeAll: string;
  };
  faq: { lead: string; browseAll: string; items: FaqItem[] };
  closing: { heading: string; lead: ReactNode; cta: string };
};

const EN: HomeCopy = {
  hero: {
    eyebrow: "Open source · Apache-2.0",
    titleLead: "The Open-Source ",
    titleAccent: "Data Engineering Agent",
    lead: (
      <>
        Datus is the open-source data engineering agent for the modern data stack — one AI data
        engineering agent that connects your warehouse, catalog, semantic layer and BI, grounded in
        an evolvable context engine your team owns. Apache 2.0 · self-host or free playground.
      </>
    ),
    ctaPrimary: "Get started, free",
    ctaGithub: "Star on GitHub",
    contact: "Building for a team? Contact us",
    byoWarehouse: <>Bring your own <A href="/databases/">warehouse</A></>,
    byoModel: <>Bring your own <A href="/models/">model</A></>,
  },
  terminal: {
    connected: "↳ connected · indexed schemas · semantic model · context initialized",
    ready: "✓ context engine ready, schemas, metrics, validated SQL",
    pipeline: "plan → generate → validate → review → ship",
    captured: " · captured to memory",
    selfEvolve: "↻ self-evolve, extract & update knowledge from feedback & benchmark",
    memory: "· subagent-level memory",
  },
  prompts: [
    "Build metrics for revenue",
    "Create a dashboard for churn",
    "Generate SQL for cohort retention",
    "Create an ETL job for events",
    "Create a subagent chatbot for sales",
  ],
  proof: [
    { value: "", label: "GitHub stars" },
    { value: "Apache 2.0", label: "Open source" },
    { value: "Self-host · Cloud", label: "Your infra or ours" },
    { value: "Built by DEs", label: "For data engineering teams" },
  ],
  problem: {
    eyebrow: "Why Datus",
    heading: "Why Teams Switch to a Data Engineering Agent",
    lead: "Copilots and NL2SQL solve one prompt at a time. A data engineering agent owns the lifecycle — plan, write, run, validate, deploy, monitor.",
    colProblem: "The problem",
    colDatus: "Datus Agent",
    rows: [
      {
        problem: "Copilots answer, they don't execute",
        solution: "One data engineering agent that plans, runs, validates and deploys real work",
      },
      {
        problem: "NL2SQL hallucinates joins and metrics",
        solution:
          "Grounded in an evolvable context engine — the memory layer every data engineering agent needs",
      },
      {
        problem: "Five glued-together tools still miss the context",
        solution: (
          <>
            <A href="/products/cli/">One client</A>, one memory, one autonomous data engineering
            operator across the stack
          </>
        ),
      },
    ],
  },
  layers: {
    eyebrow: "Architecture",
    heading: "A Data Engineering Agent in Three Layers",
    lead: (
      <>
        Delivery on top, Intelligence in the middle, a Data Layer underneath. Three stacked layers
        that turn Datus from a chat wrapper into a{" "}
        <A href="/products/enterprise/">production-ready data engineering agent</A>.
      </>
    ),
    items: [
      {
        name: "Delivery",
        caption: "How teams reach the agent",
        chips: ["CLI", "Studio", "Chatbot", "MCP"],
      },
      {
        name: "Intelligence",
        caption: "How the agent thinks",
        chips: ["Subagents", "Planner", "Reviewer", "Skills"],
      },
      {
        name: "Data Layer",
        caption: "What the agent stands on",
        chips: ["Context Engine", "Tree + Vector Memory", "Lineage", "Semantic"],
      },
    ],
  },
  lifecycle: {
    eyebrow: "Lifecycle",
    heading: "Agentic Data Engineering Across the Full Lifecycle",
    lead: (
      <>
        From SQL development to monitoring — eight lifecycle phases orbit one Datus agent, giving
        your team autonomous data engineering in a{" "}
        <A href="/products/studio/">single, always-in-context workflow</A>.
      </>
    ),
    phases: [
      "SQL Dev",
      "Data Quality",
      "Metric Mgmt",
      "Modeling",
      "SQL Review",
      "Deploy",
      "Monitor",
      "Docs",
    ],
  },
  useCases: {
    eyebrow: "Use cases",
    heading: "What Teams Actually Ship With Datus",
    lead: "Four workflows that show up on day one — same data engineering agent, same context, different jobs to be done.",
    items: [
      {
        title: "Ad-Hoc Analytics Without the SQL Bottleneck",
        body: (
          <>
            Analysts ask business questions in natural language. The data engineering agent grounds
            each query in your <A href="/integrations/">catalog</A> and metric definitions, then
            returns validated SQL plus the numbers — no waiting on a data engineer.
          </>
        ),
      },
      {
        title: "Production Pipelines That Stay in Context",
        body: (
          <>
            Engineers draft, review and deploy dbt-style models with an agent that already knows the
            warehouse, lineage and past failures. Reviews shrink from days to a working session.
          </>
        ),
      },
      {
        title: "Self-Serve BI Grounded in the Semantic Layer",
        body: (
          <>
            The Datus agent reads your semantic layer and BI metrics, so answers in Slack, Feishu or
            Studio match what leadership sees in dashboards. One source of truth, many surfaces.
          </>
        ),
      },
      {
        title: "Data Quality and Monitoring on Autopilot",
        body: (
          <>
            The data engineering agent watches freshness, schema drift and metric anomalies across
            pipelines, then explains what broke and proposes a fix in the same thread where the work
            happens.
          </>
        ),
      },
    ],
  },
  surfaces: {
    eyebrow: "Get started",
    heading: "One Agent, Four Surfaces to Pick From",
    lead: "Same data engineering agent, same context — four surfaces (Studio, CLI, Chatbot, MCP) so every data engineer can start where they already work.",
    items: [
      {
        id: "studio",
        name: "Studio",
        tagline: (
          <>
            A <A href="/products/studio/">managed cloud workspace</A> where data teams chat with
            their warehouse directly in the browser. Schema-aware suggestions, shared notebooks, and
            one-click result exports mean anyone can explore data without installing a thing.
          </>
        ),
        start: "open studio.datus.ai",
      },
      {
        id: "cli",
        name: "CLI",
        tagline: (
          <>
            An <A href="/products/cli/">interactive terminal REPL</A> built for data engineers who
            live in the shell. Install with pip, authenticate once, and run natural-language
            queries, SQL diffs, and batch jobs straight from your command line or CI pipeline.
          </>
        ),
        start: "pip install datus-agent",
      },
      {
        id: "chatbot",
        name: "Chatbot",
        tagline: (
          <>
            Embed the agent in Slack, Feishu, or Microsoft Teams so every channel becomes a{" "}
            <A href="/chatbot/">self-serve data interface</A>. Ask questions in plain language, get
            charts and summaries back, and approve or schedule follow-ups without leaving the
            conversation.
          </>
        ),
        start: "/datus in Slack",
      },
      {
        id: "mcp",
        name: "MCP Server",
        tagline: (
          <>
            Expose your entire Datus context and toolset over the{" "}
            <A href="/mcp/">Model Context Protocol</A>. Plug it into Claude, Cursor, or Windsurf so
            your AI assistant understands your warehouse schema, metrics, and policies without
            constant copy-paste.
          </>
        ),
        start: "datus mcp serve",
      },
    ],
  },
  stack: {
    eyebrow: "Integrations",
    heading: "Works With Your Modern Data Stack",
    lead: "Point the Datus data engineering agent at what you already run. Governance and dialect handling for every warehouse ship in the box.",
    model: "Model",
    byo: "BYO",
    groups: ["Warehouse", "Modeling", "Semantic Layer", "Catalog", "BI", "Orchestration"],
    seeAll: "See all integrations",
  },
  faq: {
    lead: "Data engineering agents, the Datus context engine, surfaces, pricing and how Datus compares.",
    browseAll: "Browse all FAQs",
    items: [
      {
        q: "What is a data engineering agent?",
        a: "A data engineering agent is an AI system that owns data work end to end — not just answering questions, but planning, writing SQL, running pipelines, validating results, deploying models and monitoring what it shipped. Unlike a text-to-SQL copilot, a data engineering agent is grounded in your warehouse, catalog and semantic layer, and it keeps that context across every run.",
      },
      {
        q: "What is Datus and how is it different from a text-to-SQL chatbot?",
        a: "Datus is the open-source data engineering agent. A chatbot stops at translating a prompt into SQL. The Datus agent orchestrates Catalog, SQL, Pipeline and BI subagents on a shared context engine to plan, run, validate, deploy and monitor real data work end to end.",
      },
      {
        q: "Why does a data engineering agent need an evolvable context engine?",
        a: "Without grounded context, any data engineering agent will hallucinate joins and metrics. Datus captures historical SQL, table structures, metrics and semantic definitions, stores them in a dual Tree + Vector memory, and incrementally refines that context from real usage — every run makes the next answer more accurate.",
      },
      {
        q: "How do I try the Datus data engineering agent — Studio, CLI, Chatbot or MCP?",
        a: "Studio is the free hosted playground in your browser. Data engineers usually start with the CLI for terminal-native workflows. The Chatbot embeds the data engineering agent in Slack or Feishu, and the MCP server plugs Datus context into Claude, Cursor or Windsurf. All four surfaces share the same agent and context engine.",
      },
      {
        q: "Is the open-source Datus agent really free?",
        a: "Yes. The open-source Datus data engineering agent is Apache 2.0 and free to self-host — you bring the model and the warehouse. Datus Studio hosts the same agent in the browser as a free playground. Enterprise adds SSO, RBAC, SQL Policy and private / VPC deployment.",
      },
      {
        q: "How does Datus compare to Databricks Genie or Snowflake Cortex?",
        a: "Warehouse-native copilots are tied to one platform; open-source NL2SQL projects usually stop at query translation. Datus is a warehouse-agnostic data engineering agent that covers the full lifecycle — SQL, data quality, deployment, monitoring — with a shared context engine, not just a query layer.",
      },
      {
        q: "What can I automate with an agentic data engineering workflow?",
        a: "Anything that today ping-pongs between SQL editor, dbt project, catalog and BI. An agentic data engineering workflow can draft and review models, run and validate queries, catch schema drift, patch broken pipelines and answer stakeholder questions from the semantic layer — all in one thread, with the data engineering agent keeping context across steps.",
      },
    ],
  },
  closing: {
    heading: "Ready to let the data engineering agent run?",
    lead: (
      <>
        Open Datus Studio <A href="/pricing/">free in your browser</A>, or self-host the open-source
        agent on your own warehouse in minutes.
      </>
    ),
    cta: "Get started",
  },
};

const ZH: HomeCopy = {
  hero: {
    eyebrow: "开源 · Apache-2.0",
    titleLead: "开源的",
    titleAccent: "数据工程 Agent",
    lead: (
      <>
        Datus 是面向 modern data stack 的开源数据工程 Agent——一个 Agent 打通数仓、数据目录、语义层与
        BI，底层是一套由你的团队掌控、可演进的上下文引擎。Apache 2.0 · 可私有部署，也有免费在线体验。
      </>
    ),
    ctaPrimary: "免费开始使用",
    ctaGithub: "在 GitHub 上 Star",
    contact: "为团队选型？联系我们",
    byoWarehouse: <>自带<A href="/databases/">数仓</A></>,
    byoModel: <>自带<A href="/models/">模型</A></>,
  },
  terminal: {
    connected: "↳ 已连接 · 表结构已索引 · 语义模型 · 上下文已初始化",
    ready: "✓ 上下文引擎就绪：表结构、指标、经过校验的 SQL",
    pipeline: "规划 → 生成 → 校验 → 评审 → 上线",
    captured: " · 已写入记忆",
    selfEvolve: "↻ 自我演进：从反馈与基准测试中提取并更新知识",
    memory: "· 子代理级记忆",
  },
  prompts: [
    "为营收搭建指标",
    "为流失率做一个看板",
    "生成同期群留存的 SQL",
    "为事件流建一个 ETL 任务",
    "为销售场景建一个子代理聊天机器人",
  ],
  proof: [
    { value: "", label: "GitHub Star" },
    { value: "Apache 2.0", label: "开源" },
    { value: "私有部署 · 云端", label: "你的基础设施，或我们的" },
    { value: "数据工程师出品", label: "为数据工程团队而建" },
  ],
  problem: {
    eyebrow: "为什么选 Datus",
    heading: "团队为什么转向数据工程 Agent",
    lead: "Copilot 和 NL2SQL 一次只解决一个提问。数据工程 Agent 接管的是整条生命周期——规划、编写、执行、校验、部署、监控。",
    colProblem: "问题",
    colDatus: "Datus Agent",
    rows: [
      {
        problem: "Copilot 只会回答，不会执行",
        solution: "一个数据工程 Agent，负责规划、执行、校验并把真实工作部署上线",
      },
      {
        problem: "NL2SQL 会把 join 和指标编造出来",
        solution: "以可演进的上下文引擎为地基——这正是每个数据工程 Agent 都需要的记忆层",
      },
      {
        problem: "五个工具拼在一起，上下文照样丢",
        solution: (
          <>
            <A href="/products/cli/">一个客户端</A>、一份记忆、一个贯穿整个数据栈的自治数据工程执行者
          </>
        ),
      },
    ],
  },
  layers: {
    eyebrow: "架构",
    heading: "数据工程 Agent 的三层结构",
    lead: (
      <>
        上层交付、中层智能、底层数据。三层叠加，让 Datus 从一个聊天外壳变成
        <A href="/products/enterprise/">可上生产的数据工程 Agent</A>。
      </>
    ),
    items: [
      {
        name: "交付层",
        caption: "团队用什么方式找到 Agent",
        chips: ["CLI", "Studio", "Chatbot", "MCP"],
      },
      {
        name: "智能层",
        caption: "Agent 如何思考",
        chips: ["子代理", "规划器", "评审器", "Skills"],
      },
      {
        name: "数据层",
        caption: "Agent 站在什么之上",
        chips: ["上下文引擎", "树 + 向量记忆", "血缘", "语义层"],
      },
    ],
  },
  lifecycle: {
    eyebrow: "生命周期",
    heading: "覆盖完整生命周期的 Agentic 数据工程",
    lead: (
      <>
        从 SQL 开发到监控——八个生命周期阶段围绕同一个 Datus Agent 运转，让团队在
        <A href="/products/studio/">一条始终带着上下文的工作流</A>里完成自治的数据工程。
      </>
    ),
    phases: [
      "SQL 开发",
      "数据质量",
      "指标管理",
      "数据建模",
      "SQL 评审",
      "部署",
      "监控",
      "文档",
    ],
  },
  useCases: {
    eyebrow: "使用场景",
    heading: "团队用 Datus 真正交付了什么",
    lead: "第一天就会用上的四类工作流——同一个数据工程 Agent、同一份上下文，做不同的事。",
    items: [
      {
        title: "临时分析不再卡在 SQL 上",
        body: (
          <>
            分析师用自然语言提业务问题。数据工程 Agent 会把每个查询锚定到你的
            <A href="/integrations/">数据目录</A>和指标定义上，再返回经过校验的 SQL 和结果数字——
            不用排队等数据工程师。
          </>
        ),
      },
      {
        title: "始终带着上下文的生产管道",
        body: (
          <>
            工程师和一个已经了解数仓、血缘与历史故障的 Agent 一起起草、评审并部署 dbt 风格的模型。
            评审周期从几天缩短到一次工作会话。
          </>
        ),
      },
      {
        title: "基于语义层的自助式 BI",
        body: (
          <>
            Datus Agent 会读取你的语义层与 BI 指标，因此 Slack、飞书或 Studio 里给出的答案，
            和管理层在看板上看到的数字一致。一份口径，多个入口。
          </>
        ),
      },
      {
        title: "数据质量与监控自动驾驶",
        body: (
          <>
            数据工程 Agent 会持续盯着各条管道的数据新鲜度、Schema 漂移与指标异常，
            然后在你干活的同一个会话里解释哪里坏了，并给出修复方案。
          </>
        ),
      },
    ],
  },
  surfaces: {
    eyebrow: "开始使用",
    heading: "一个 Agent，四种入口任选",
    lead: "同一个数据工程 Agent、同一份上下文——Studio、CLI、Chatbot、MCP 四种入口，让每位数据工程师都能在自己熟悉的地方开始。",
    items: [
      {
        id: "studio",
        name: "Studio",
        tagline: (
          <>
            一个<A href="/products/studio/">托管的云端工作空间</A>，数据团队直接在浏览器里和数仓对话。
            带表结构感知的建议、可共享的 Notebook、结果一键导出——不装任何东西就能开始探索数据。
          </>
        ),
        start: "open studio.datus.ai",
      },
      {
        id: "cli",
        name: "CLI",
        tagline: (
          <>
            一个为常驻 shell 的数据工程师打造的<A href="/products/cli/">交互式终端 REPL</A>。
            用 pip 安装、认证一次，就能在命令行或 CI 流水线里跑自然语言查询、SQL diff 和批处理作业。
          </>
        ),
        start: "pip install datus-agent",
      },
      {
        id: "chatbot",
        name: "Chatbot",
        tagline: (
          <>
            把 Agent 嵌进 Slack、飞书或 Microsoft Teams，让每个频道都变成
            <A href="/chatbot/">自助数据入口</A>。用大白话提问，拿回图表与摘要，
            后续动作也能在对话里直接审批或排期。
          </>
        ),
        start: "/datus in Slack",
      },
      {
        id: "mcp",
        name: "MCP Server",
        tagline: (
          <>
            通过 <A href="/mcp/">Model Context Protocol</A> 把整套 Datus 上下文与工具暴露出去。
            接进 Claude、Cursor 或 Windsurf，让 AI 助手不靠反复复制粘贴也能理解你的表结构、指标与策略。
          </>
        ),
        start: "datus mcp serve",
      },
    ],
  },
  stack: {
    eyebrow: "集成",
    heading: "适配你现有的 modern data stack",
    lead: "把 Datus 数据工程 Agent 指向你已经在跑的系统即可。每种数仓的治理与方言处理都是开箱自带的。",
    model: "模型",
    byo: "自带",
    groups: ["数仓", "建模", "语义层", "数据目录", "BI", "编排调度"],
    seeAll: "查看全部集成",
  },
  faq: {
    lead: "数据工程 Agent、Datus 上下文引擎、四种入口、定价，以及 Datus 与同类方案的对比。",
    browseAll: "浏览全部常见问题",
    items: [
      {
        q: "什么是数据工程 Agent？",
        a: "数据工程 Agent 是端到端接管数据工作的 AI 系统——不只是回答问题，而是做规划、写 SQL、跑管道、校验结果、部署模型，并监控自己上线的东西。和 text-to-SQL Copilot 不同，数据工程 Agent 锚定在你的数仓、数据目录与语义层上，并且会在每一次运行之间保留这份上下文。",
      },
      {
        q: "Datus 是什么？它和 text-to-SQL 聊天机器人有何不同？",
        a: "Datus 是开源的数据工程 Agent。聊天机器人止步于把一句提问翻译成 SQL；Datus Agent 则在共享的上下文引擎之上编排 Catalog、SQL、Pipeline 与 BI 子代理，端到端地规划、执行、校验、部署并监控真实的数据工作。",
      },
      {
        q: "数据工程 Agent 为什么需要可演进的上下文引擎？",
        a: "没有可靠的上下文，任何数据工程 Agent 都会把 join 和指标编造出来。Datus 会采集历史 SQL、表结构、指标与语义定义，存入树 + 向量的双层记忆，并从真实使用中持续打磨这份上下文——每跑一次，下一次的答案就更准一分。",
      },
      {
        q: "想试用 Datus 数据工程 Agent，该选 Studio、CLI、Chatbot 还是 MCP？",
        a: "Studio 是浏览器里免费的托管体验环境。数据工程师通常从 CLI 开始，因为它更贴近终端工作流。Chatbot 把数据工程 Agent 嵌进 Slack 或飞书，MCP Server 则把 Datus 上下文接进 Claude、Cursor 或 Windsurf。四种入口共享同一个 Agent 与同一套上下文引擎。",
      },
      {
        q: "开源版 Datus Agent 真的免费吗？",
        a: "是的。开源的 Datus 数据工程 Agent 采用 Apache 2.0 许可，可免费私有部署——模型和数仓由你自备。Datus Studio 在浏览器里托管同一个 Agent，作为免费体验环境。企业版额外提供 SSO、RBAC、SQL Policy 以及私有 / VPC 部署。",
      },
      {
        q: "Datus 和 Databricks Genie、Snowflake Cortex 相比如何？",
        a: "数仓原生的 Copilot 绑死在单一平台上；开源 NL2SQL 项目通常止步于查询翻译。Datus 是与数仓无关的数据工程 Agent，覆盖 SQL、数据质量、部署、监控在内的完整生命周期，靠的是一套共享的上下文引擎，而不只是一层查询接口。",
      },
      {
        q: "Agentic 数据工程工作流能自动化哪些事？",
        a: "今天所有在 SQL 编辑器、dbt 项目、数据目录和 BI 之间来回折腾的事情。Agentic 数据工程工作流可以起草并评审模型、执行并校验查询、发现 Schema 漂移、修复坏掉的管道，还能基于语义层回答业务方的问题——全部在同一个会话里完成，由数据工程 Agent 在各步骤之间保留上下文。",
      },
    ],
  },
  closing: {
    heading: "准备好让数据工程 Agent 跑起来了吗？",
    lead: (
      <>
        在浏览器里<A href="/pricing/">免费打开 Datus Studio</A>，
        或者几分钟内把开源版 Agent 私有部署到你自己的数仓上。
      </>
    ),
    cta: "开始使用",
  },
};

export const HOME: Record<Locale, HomeCopy> = { en: EN, zh: ZH };
