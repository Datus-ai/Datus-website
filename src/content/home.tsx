import { UI } from "../i18n/ui";
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
 * Positioning: Datus gives AI agents shared enterprise business context.
 * Datus Agent assists model creation; DOSI executes compatible Apache Ossie
 * models. Keep the three pillars aligned with the launch messaging document.
 */
export type HomeCopy = {
  hero: {
    eyebrow: string;
    titleLead: string;
    titleAccent: string;
    titleTail?: string;
    stackTitle?: boolean;
    lead: ReactNode;
    ctaPrimary: string;
    ctaDeveloper: string;
    contact: string;
    byoWarehouse: ReactNode;
    byoModel: ReactNode;
    ownWarehouse: ReactNode;
    ownModel: ReactNode;
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
    visual: {
      question: string;
      beforeTitle: string;
      beforeHint: string;
      silos: { team: string; metric: string; definition: string; tool: string; result: string; warehouse: "snowflake" | "bigquery" | "postgresql" }[];
      afterTitle: string;
      afterHint: string;
      sharedResult: string;
      knowledge: string[];
      ontology: string;
      ontologyDetail: string;
      model: string;
      reviewed: string;
      audit: string;
      metrics: string;
      metricNames: string[];
      relationships: string;
      relationshipExample: string;
      consumers: string[];
      trace: string[];
      selectedSource: string;
    };
    dragHint: string;
    detailsLabel: string;
  };
  pillars: {
    eyebrow: string;
    heading: string;
    lead: ReactNode;
    rotation: { nextIn: string; pause: string; play: string };
    items: { name: string; caption: string; chips: string[]; visual: { alt: string; labels: string[] } }[];
  };
  lifecycle: {
    eyebrow: string;
    heading: string;
    lead: ReactNode;
    visualAlt: string;
    visualCaption: string;
    phases: string[];
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
    byoTitle: string;
    groups: string[];
    seeAll: string;
  };
  faq: { lead: string; browseAll: string; items: FaqItem[] };
  closing: { heading: string; lead: ReactNode; cta: string };
};

const EN: HomeCopy = {
  hero: {
    eyebrow: "Open data context for AI agents",
    titleLead: "The trusted ",
    titleAccent: "enterprise data context",
    titleTail: " for AI agents.",
    stackTitle: true,
    lead: <>Connect business ontology, governed metrics, and data provenance in one shared context layer. Give agents business meaning they can use—and teams the evidence to inspect their work.</>,
    ctaPrimary: UI.en.common.tryStudio,
    ctaDeveloper: "Quickstart DOSI",
    contact: "Talk to us about your enterprise data stack",
    byoWarehouse: <>Business-aware · Agent-native · Audit-ready</>,
    byoModel: <>Built on <A href="/tools/osi-playground/">Apache Ossie</A> (incubating)</>,
    ownWarehouse: <>Bring your own <A href="/databases/">warehouse</A></>,
    ownModel: <>Bring your own <A href="/models/">model</A></>,
  },
  terminal: {
    connected: "↳ gather schema · SQL history · business knowledge",
    ready: "✓ semantic model drafted — ready for team review",
    pipeline: "review model → DOSI validates → plan metric query",
    captured: " · compile warehouse-native SQL",
    selfEvolve: "↻ inspect definitions, SQL & lineage",
    memory: "· teams approve meaning and validate source data",
  },
  prompts: [
    "Show net revenue by region",
    "Define the churn metric once",
    "Answer: Q3 net revenue by region",
    "Expose the semantic layer over MCP",
  ],
  proof: [
    { value: "", label: "GitHub stars" },
    { value: "Apache Ossie → DOSI", label: "From open spec to execution" },
    { value: "16 dialects", label: "One OSI spec, native SQL" },
    { value: "CLI · MCP", label: "Also available through REST and Python" },
  ],
  problem: {
    eyebrow: "Why shared context matters",
    heading: "One business question should not produce three different answers.",
    lead: "Metrics drift when dashboards, notebooks, and agents each reconstruct the same calculation. Datus helps teams review business definitions once and make them available to the tools that need them.",
    colProblem: "When meaning is scattered",
    colDatus: "With Datus",
    dragHint: "Drag to compare",
    detailsLabel: "Read the comparison",
    visual: {
      question: "What is net revenue?",
      beforeTitle: "Three teams. Three metric stacks.",
      beforeHint: "Illustrative example: each workflow uses a different definition",
      silos: [
        { team: "Sales", metric: "Net revenue", definition: "Booked sales", tool: "Dashboard", result: "$1.24M", warehouse: "snowflake" },
        { team: "Finance", metric: "Net revenue", definition: "After refunds", tool: "Notebook", result: "$1.08M", warehouse: "bigquery" },
        { team: "Operations", metric: "Net revenue", definition: "Open orders included", tool: "Agent", result: "$1.31M", warehouse: "postgresql" },
      ],
      afterTitle: "One shared business context",
      afterHint: "Illustrative example: one reviewed definition",
      sharedResult: "$1.08M",
      knowledge: ["Documents", "ETL scripts", "Warehouse schemas"],
      ontology: "Ontology-grade context",
      ontologyDetail: "Concepts and relationships agents can use",
      model: "Datus semantic model",
      reviewed: "Team reviewed",
      audit: "Inspectable path",
      metrics: "Metrics inside the model",
      metricNames: ["Net revenue", "Customer churn"],
      relationships: "Business relationships",
      relationshipExample: "Customer → Order",
      consumers: ["Dashboards", "Notebooks", "Agents"],
      trace: ["Definitions", "Generated SQL", "Lineage"],
      selectedSource: "Native SQL for a selected source",
    },
    rows: [
      {
        problem: "Teams define the same metric differently across reports and tools.",
        solution: "Reviewed metric definitions and business relationships give teams and agents a shared vocabulary.",
      },
      {
        problem: "Useful business knowledge sits across documents, warehouses, and ETL scripts.",
        solution: (
          <>
            Datus Agent helps gather that knowledge into <A href="/tools/osi-playground/">semantic
            models</A> your team can review and refine.
          </>
        ),
      },
      {
        problem: "An agent's answer is hard to verify when its calculations stay hidden.",
        solution: (
          <>
            DOSI exposes inspectable definitions, generated SQL, and lineage so teams can examine
            how a supported result was produced.
          </>
        ),
      },
    ],
  },
  pillars: {
    eyebrow: "Three pillars",
    heading: "From business meaning to answers you can inspect.",
    rotation: { nextIn: "Next in {seconds}s", pause: "Pause slideshow", play: "Play slideshow" },
    lead: (
      <>
        Datus connects business meaning to agent workflows and gives teams the evidence to review
        analytical results. <A href="/products/studio/">Studio</A> is the team experience; Datus
        Agent assists modeling, while DOSI executes compatible semantic models.
      </>
    ),
    items: [
      {
        name: "Business-aware",
        caption: "Connect business concepts, relationships, and governed metrics so agents work from a shared vocabulary.",
        chips: ["Business concepts", "Reviewed metrics", "Source mappings"],
        visual: { alt: "Customer and order concepts connect to a reviewed net revenue metric in a semantic model, mapped to warehouse data.", labels: ["Business meaning", "Customer", "Order", "Net revenue", "Reviewed semantic model", "Warehouse data", "Source mappings"] },
      },
      {
        name: "Agent-native",
        caption: "Datus Agent helps build reviewable models from existing knowledge; DOSI makes compatible definitions available to agents.",
        chips: ["Assisted modeling", "Team review", "MCP access"],
        visual: { alt: "Datus Agent drafts a semantic model from existing knowledge. A team reviews it, then DOSI executes compatible definitions for AI agents through MCP.", labels: ["Existing knowledge", "Datus Agent", "Team review", "Apache Ossie model", "DOSI", "MCP", "AI agents"] },
      },
      {
        name: "Audit-ready",
        caption: "Inspect the ontology’s business relationships and trace results through metric definitions, generated SQL, and source lineage.",
        chips: ["Ontology context", "SQL & definitions", "Source lineage"],
        visual: { alt: "Trace an analytical result through ontology relationships, its metric definition, and generated SQL to the warehouse source.", labels: ["Analytical result", "Net revenue", "Metric definition", "Generated SQL", "Warehouse source", "Reviewable lineage", "Inspect each step", "Ontology relationships"] },
      },
    ],
  },
  lifecycle: {
    eyebrow: "How it works",
    heading: "From scattered knowledge to executable business context",
    lead: (
      <>
        Datus Agent helps draft a model from what your team already knows. Your team reviews the
        business meaning; DOSI validates compatible <A href="/tools/osi-playground/">Apache Ossie
        models</A> and compiles supported requests to native SQL.
      </>
    ),
    visualAlt: "Documents, a warehouse, and ETL scripts converge through Datus into a semantic model ready for team review",
    visualCaption: "Datus gathers business knowledge from existing documents, warehouses, and ETL scripts into a semantic model your team can review.",
    phases: ["Connect sources", "Gather knowledge", "Draft a model", "Team review",
      "DOSI validates", "Request a metric", "Inspect SQL & lineage", "Refine definitions"],
  },
  surfaces: {
    eyebrow: "Interfaces",
    heading: "One context, available to teams and agents",
    lead: "Explore business context in DOSI, work together in Studio, build with Datus Agent, or connect through MCP, API, and CLI.",
    items: [
      { id: "dosi", name: "DOSI", tagline: <><strong className="pi-positioning-headline">Business meaning, ready to execute.</strong>DOSI turns compatible Apache Ossie models into native SQL across 16 dialects. Bring semantic models and ontology together, give teams and agents consistent business definitions, and inspect how every answer is built—without tying your business logic to one vendor’s stack.</>, start: "dosi --model commerce.yaml lineage dump", preview: "dosi" },
      { id: "studio", name: "Studio", tagline: <>Bring files, SQL, results, and Agent conversations together in <A href="/products/studio/">Datus Studio</A>, a shared workspace for your team.</>, start: "open studio.datus.ai", preview: "studio" },
      { id: "agent", name: "Datus Agent", tagline: <>Configure a main Agent and specialized subagents to explore data, build semantic models, and generate SQL with shared context.</>, start: "pip install datus-agent", preview: "agent" },
      { id: "mcp-cli", name: "MCP / API / CLI", tagline: <>Connect your own agents through <A href="/mcp/">MCP</A>, embed Subagent conversations through the API, or work from your own terminal with CLI tools.</>, start: "dosi-server --model commerce.yaml --mcp-stdio", preview: "connect" },
    ],
  },
  stack: {
    eyebrow: "Integrations",
    heading: "Build on the stack you already run",
    lead: "Keep your tools. See what Datus reads, where work runs, and what comes back into your workflow. Each logo shows the connection method.",
    model: "Model",
    byo: "BYO",
    byoTitle: "Bring your own model",
    groups: ["Warehouse", "Modeling", "Semantic Layer", "Catalog", "BI", "Orchestration"],
    seeAll: "See all integrations",
  },
  faq: {
    lead: "How Datus Agent, DOSI, and Apache Ossie work together.",
    browseAll: "Browse all FAQs",
    items: [
      {
        q: "What does Datus give AI agents?",
        a: "Datus connects business concepts, governed metric definitions, and data provenance so agents can use shared business meaning. Teams review the definitions and remain responsible for validating the source data and results.",
      },
      {
        q: "How do Datus Agent and DOSI work together?",
        a: "Datus Agent helps draft and refine semantic models from existing knowledge. After your team reviews business meaning, DOSI validates compatible Apache Ossie models, plans supported metric queries, and compiles native SQL for the selected data source.",
      },
      {
        q: "What is Apache Ossie?",
        a: "Apache Ossie is the open semantic model standard used for compatible definitions. DOSI makes those definitions executable. Supported converters and extensions determine what can be exchanged; portability does not mean every engine supports every feature.",
      },
      {
        q: "Is DOSI open source?",
        a: "Datus Agent is open source. DOSI is a Datus semantic execution module and a standalone developer tool built on the open Apache Ossie standard. You can explore it in Studio or follow the DOSI developer quickstart.",
      },
      {
        q: "What does audit-ready mean?",
        a: "Definitions, generated SQL, and lineage give reviewers a basis for examining supported calculations. Audit-ready describes traceability and reviewability; it does not mean automatic certification. Teams still approve business definitions and validate source data.",
      },
      {
        q: "Does DOSI join data across warehouses?",
        a: "Datus can share business definitions across supported sources. A DOSI query executes against the selected source; this does not imply live cross-warehouse federation.",
      },
    ],
  },
  closing: {
    heading: "Give AI agents context your team can review.",
    lead: (
      <>
        <A href="/products/studio/">Try Datus in Studio</A> to explore shared business context,
        or follow the DOSI quickstart to make compatible semantic models executable.
      </>
    ),
    cta: "Get started",
  },
};

const ZH: HomeCopy = {
  hero: {
    eyebrow: "面向 AI Agent 的开放数据上下文",
    titleLead: "让 AI Agent 拥有",
    titleAccent: "可信的企业数据上下文",
    titleTail: "。",
    lead: <>在共享的上下文层中，连接业务本体、受治理的指标与数据来源。让 Agent 使用明确的业务含义，让团队有据可依地核查工作。</>,
    ctaPrimary: UI.zh.common.tryStudio,
    ctaDeveloper: "查看 DOSI 快速开始",
    contact: "想在企业数据栈中使用？联系我们",
    byoWarehouse: <>理解业务 · 面向 Agent · 可供审查</>,
    byoModel: <>基于 <A href="/tools/osi-playground/">Apache Ossie</A>（孵化中）</>,
    ownWarehouse: <>使用你自己的<A href="/databases/">数仓</A></>,
    ownModel: <>使用你自己的<A href="/models/">模型</A></>,
  },
  terminal: {
    connected: "↳ 汇集表结构 · SQL 历史 · 业务知识",
    ready: "✓ 语义模型草稿已生成，等待团队审核",
    pipeline: "审核模型 → DOSI 校验 → 规划指标查询",
    captured: " · 编译为数仓原生 SQL",
    selfEvolve: "↻ 查看定义、SQL 与血缘",
    memory: "· 业务口径由团队批准，源数据由团队验证",
  },
  prompts: [
    "按地区查看净营收",
    "流失率指标只定义一次",
    "回答：Q3 各地区净营收",
    "把语义层暴露到 MCP",
  ],
  proof: [
    { value: "", label: "GitHub Star" },
    { value: "Apache Ossie → DOSI", label: "从开放规范到执行" },
    { value: "16 种方言", label: "一份 OSI 规范，生成原生 SQL" },
    { value: "CLI · MCP", label: "也支持 REST 与 Python 接口" },
  ],
  problem: {
    eyebrow: "为什么需要共享上下文",
    heading: "同一个业务问题，不该得到三种不同的答案。",
    lead: "当大盘、笔记本和 Agent 各自重写同一个指标的算法，口径就会逐渐分叉。Datus 帮助团队审核业务定义，再让需要它们的工具共同使用。",
    colProblem: "业务口径分散时",
    colDatus: "有了 Datus",
    dragHint: "拖动查看前后变化",
    detailsLabel: "查看文字说明",
    visual: {
      question: "净营收是多少？",
      beforeTitle: "三个团队，三套指标烟囱",
      beforeHint: "示意数据：每个工作流使用不同的指标口径",
      silos: [
        { team: "销售", metric: "净营收", definition: "按已下单金额", tool: "大盘", result: "$124 万", warehouse: "snowflake" },
        { team: "财务", metric: "净营收", definition: "扣除退款后", tool: "笔记本", result: "$108 万", warehouse: "bigquery" },
        { team: "运营", metric: "净营收", definition: "含未结订单", tool: "Agent", result: "$131 万", warehouse: "postgresql" },
      ],
      afterTitle: "统一的业务上下文",
      afterHint: "示意数据：团队审核一套统一口径",
      sharedResult: "$108 万",
      knowledge: ["文档", "ETL 脚本", "数仓 Schema"],
      ontology: "本体级业务上下文",
      ontologyDetail: "让 Agent 理解业务概念与关系",
      model: "Datus 语义模型",
      reviewed: "团队已审核",
      audit: "可审查路径",
      metrics: "模型内的指标",
      metricNames: ["净营收", "客户流失率"],
      relationships: "业务关系",
      relationshipExample: "客户 → 订单",
      consumers: ["大盘", "笔记本", "Agent"],
      trace: ["业务定义", "生成的 SQL", "血缘"],
      selectedSource: "为选定的数据源生成原生 SQL",
    },
    rows: [
      {
        problem: "各团队在不同报表和工具里重复定义同一指标。",
        solution: "经过审核的指标定义与业务关系，让团队和 Agent 共用一套业务语言。",
      },
      {
        problem: "有用的业务知识散落在文档、数仓和 ETL 脚本中。",
        solution: (
          <>
            Datus Agent 帮助团队将这些知识整理成可审核、可完善的
            <A href="/tools/osi-playground/">语义模型</A>。
          </>
        ),
      },
      {
        problem: "看不到计算过程，就难以核查 Agent 给出的答案。",
        solution: (
          <>
            DOSI 提供可检查的定义、生成的 SQL 和血缘，帮助团队核查支持范围内的计算结果。
          </>
        ),
      },
    ],
  },
  pillars: {
    eyebrow: "三大支柱",
    heading: "从业务含义，到可核查的分析结果。",
    rotation: { nextIn: "{seconds} 秒后切换", pause: "暂停轮播", play: "播放轮播" },
    lead: (
      <>
        Datus 将业务含义带入 Agent 工作流，也让团队有依据核查分析结果。
        <A href="/products/studio/">Studio</A> 是团队使用 Datus 的入口；Datus Agent 辅助建模，DOSI 执行兼容的语义模型。
      </>
    ),
    items: [
      {
        name: "理解业务",
        caption: "连接业务概念、关系与受治理的指标，让 Agent 使用团队共享的业务语言。",
        chips: ["业务概念", "审核过的指标", "数据源映射"],
        visual: { alt: "客户与订单等业务概念关联到语义模型中的净营收指标，再映射到数仓数据。", labels: ["业务含义", "客户", "订单", "净营收", "团队审核的语义模型", "数仓数据", "数据源映射"] },
      },
      {
        name: "面向 Agent",
        caption: "Datus Agent 帮助团队从现有知识构建可审核的模型，DOSI 让兼容的定义可供 Agent 使用。",
        chips: ["辅助建模", "团队审核", "MCP 接入"],
        visual: { alt: "Datus Agent 根据已有知识起草语义模型，团队审核后，DOSI 通过 MCP 为 AI Agent 执行兼容的定义。", labels: ["已有知识", "Datus Agent", "团队审核", "Apache Ossie 模型", "DOSI", "MCP", "AI Agent"] },
      },
      {
        name: "可供审查",
        caption: "核查本体中的业务关系，沿着指标定义、生成的 SQL 和数据源血缘追溯结果。",
        chips: ["本体关系", "SQL 与业务定义", "数据源血缘"],
        visual: { alt: "沿着本体关系、指标定义、生成的 SQL 和数仓数据源追溯分析结果，逐步核查计算依据。", labels: ["分析结果", "净营收", "指标定义", "生成的 SQL", "数仓数据源", "可审核的血缘", "逐步核查计算依据", "本体关系"] },
      },
    ],
  },
  lifecycle: {
    eyebrow: "工作方式",
    heading: "将分散的业务知识转化为可执行的上下文",
    lead: (
      <>
        Datus Agent 根据团队已有的知识辅助构建模型；团队审核业务口径；
        DOSI 校验兼容的 <A href="/tools/osi-playground/">Apache Ossie 模型</A>，
        将支持范围内的请求编译为原生 SQL。
      </>
    ),
    visualAlt: "文档、数仓与 ETL 脚本中的业务知识经 Datus 汇集，形成可供团队审核的语义模型",
    visualCaption: "Datus 从现有文档、数仓和 ETL 脚本中汇集业务知识，生成可供团队审核的语义模型。",
    phases: ["连接数据源", "汇集知识", "起草语义模型", "团队审核",
      "DOSI 校验", "请求指标", "查看 SQL 与血缘", "完善定义"],
  },
  surfaces: {
    eyebrow: "接口",
    heading: "一份业务上下文，供团队和 Agent 使用",
    lead: "在 DOSI 中探索业务上下文，在 Studio 中协作，使用 Datus Agent 构建，或通过 MCP、API 和 CLI 连接。",
    items: [
      { id: "dosi", name: "DOSI", tagline: <><strong className="pi-positioning-headline">让业务含义成为可执行的上下文。</strong>DOSI 将兼容的 Apache Ossie 模型编译为原生 SQL，支持 16 种 SQL 方言。将语义模型与本体结合，让团队和 Agent 使用一致的业务定义，追溯答案的生成过程，让业务逻辑独立于单一厂商的技术栈。</>, start: "dosi --model commerce.yaml lineage dump", preview: "dosi" },
      { id: "studio", name: "Studio", tagline: <>在 <A href="/products/studio/">Datus Studio</A> 中，将文件、SQL、查询结果与 Agent 对话汇集到团队的共享工作区。</>, start: "open studio.datus.ai", preview: "studio" },
      { id: "agent", name: "Datus Agent", tagline: <>配置主 Agent 和专门的子代理，基于共享上下文探索数据、构建语义模型并生成 SQL。</>, start: "pip install datus-agent", preview: "agent" },
      { id: "mcp-cli", name: "MCP / API / CLI", tagline: <>通过 <A href="/mcp/">MCP</A> 连接你自己的 Agent，通过 API 将子代理对话嵌入应用，或在自己的终端中使用 CLI 工具。</>, start: "dosi-server --model commerce.yaml --mcp-stdio", preview: "connect" },
    ],
  },
  stack: {
    eyebrow: "集成",
    heading: "基于你现有的技术栈构建",
    lead: "沿用现有工具，看清 Datus 读取什么、在哪里执行，以及向工作流程输出什么。每个 logo 下方标明接入方式。",
    model: "模型",
    byo: "自带",
    byoTitle: "使用你自己的模型",
    groups: ["数仓", "建模", "语义层", "数据目录", "BI", "编排调度"],
    seeAll: "查看全部集成",
  },
  faq: {
    lead: "了解 Datus Agent、DOSI 与 Apache Ossie 如何协同工作。",
    browseAll: "浏览全部常见问题",
    items: [
      {
        q: "Datus 为 AI Agent 提供什么？",
        a: "Datus 连接业务概念、受治理的指标定义与数据血缘，让 Agent 使用共享的业务含义。团队审核这些定义，并继续负责验证源数据与结果。",
      },
      {
        q: "Datus Agent 和 DOSI 如何协同？",
        a: "Datus Agent 帮助团队从现有知识起草和完善语义模型。团队审核业务口径后，DOSI 校验兼容的 Apache Ossie 模型，规划支持范围内的指标查询，并为选定的数据源编译原生 SQL。",
      },
      {
        q: "Apache Ossie 是什么？",
        a: "Apache Ossie 是用于兼容定义的开放语义模型标准，DOSI 让这些定义可执行。模型能交换到什么程度取决于受支持的转换器和扩展；可迁移不代表每个引擎都支持同样的功能。",
      },
      {
        q: "DOSI 是开源的吗？",
        a: "Datus Agent 是开源项目。DOSI 是 Datus 的语义执行模块，也可作为独立开发者工具使用；它基于开放的 Apache Ossie 标准。你可以在 Studio 中体验，也可以查看 DOSI 的开发者快速开始。",
      },
      {
        q: "“可供审查”具体指什么？",
        a: "定义、生成的 SQL 和血缘为审核者提供核查计算的依据。它强调可追溯、可审核，并不代表自动取得认证。团队仍需批准业务口径并验证源数据。",
      },
      {
        q: "DOSI 会实时跨数仓关联数据吗？",
        a: "Datus 可以在受支持的数据源之间共享业务定义。一次 DOSI 查询在选定的数据源执行；这不代表它会实时联邦查询多个数仓。",
      },
    ],
  },
  closing: {
    heading: "让 AI Agent 使用团队能够审核的上下文。",
    lead: (
      <>
        <A href="/products/studio/">在 Studio 中体验 Datus</A>，
        或查看 DOSI 快速开始，让兼容的语义模型可执行。
      </>
    ),
    cta: "开始使用",
  },
};

export const HOME: Record<Locale, HomeCopy> = { en: EN, zh: ZH };
