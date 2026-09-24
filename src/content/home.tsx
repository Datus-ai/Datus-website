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
 * Positioning: Datus is an enterprise **data context layer** — an Apache Ossie
 * (OSI) semantic layer and ontology, live in days, that data agents can trust.
 * Locked terminology from datus-i18n-spec.md §5: 数据上下文层, 语义层, 本体,
 * 上下文层, Apache Ossie / OSI, Dosi. Product names, CLI commands and vendor
 * names stay in English.
 */
export type HomeCopy = {
  hero: {
    eyebrow: string;
    titleLead: string;
    titleAccent: string;
    titleTail?: string;
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
    eyebrow: "Enterprise data context layer · Apache Ossie",
    titleLead: "A working ",
    titleAccent: "data context layer",
    titleTail: " in days.",
    lead: (
      <>
        Every enterprise has a data agent mandate; very few can ship one. Datus turns the{" "}
        <A href="/databases/">warehouse you already own</A> into a governed data context layer — an{" "}
        <strong>Apache Ossie</strong> semantic layer and ontology, not a general-purpose memory. The
        context your data agents can trust, live in days and evolving with every query.
      </>
    ),
    ctaPrimary: "Get started, free",
    ctaGithub: "Star on GitHub",
    contact: "Bringing it to your enterprise? Contact us",
    byoWarehouse: <>Bring your own <A href="/databases/">warehouse</A></>,
    byoModel: <>Bring your own <A href="/models/">model</A></>,
  },
  terminal: {
    connected: "↳ read schema · SQL history · lineage → OSI semantic models generated",
    ready: "✓ Apache Ossie context layer ready — ontology, metrics, governed SQL",
    pipeline: "compile → validate → govern → serve",
    captured: " · via Dosi engine, 16 dialects",
    selfEvolve: "↻ evolve: refine the ontology & metrics from every query",
    memory: "· one governed definition, many surfaces",
  },
  prompts: [
    "Map our revenue ontology",
    "Define the churn metric once",
    "Answer: Q3 net revenue by region",
    "Expose the semantic layer over MCP",
    "Ship the stalled agent pilot to production",
  ],
  proof: [
    { value: "", label: "GitHub stars" },
    { value: "Apache Ossie", label: "Open semantic + ontology standard" },
    { value: "16 dialects", label: "One OSI spec, native SQL" },
    { value: "Days, not quarters", label: "Connect to a working context layer" },
  ],
  problem: {
    eyebrow: "The mandate",
    heading: "Every enterprise has a data agent mandate. Very few can ship one.",
    lead: "The blocker is not the model. It is decades of messy, siloed data no agent can safely navigate on its own — so the pilot stalls and the bill arrives anyway. Datus gives agents a governed path through it.",
    colProblem: "Without a context layer",
    colDatus: "With Datus",
    rows: [
      {
        problem: "Agents guess at joins and definitions, then answer confidently wrong.",
        solution:
          "Agents query through a governed Apache Ossie semantic layer and ontology — no room to hallucinate.",
      },
      {
        problem: "A full data overhaul takes quarters, so the pilot dies on real data.",
        solution: (
          <>
            Fast start, zero overhaul — connect the <A href="/databases/">warehouse you own</A> and get
            a working data context layer in days.
          </>
        ),
      },
      {
        problem: "Every team defines the same metric differently; the numbers never agree.",
        solution: (
          <>
            One shared, governed definition for <A href="/integrations/">producers, consumers and
            agents</A> alike — one source of truth, many surfaces.
          </>
        ),
      },
    ],
  },
  layers: {
    eyebrow: "The stack",
    heading: "Open core, commercial studio",
    lead: (
      <>
        One standards-based stack: a commercial <A href="/products/studio/">Studio</A> on top, an
        open-source agent in the middle, the Apache Ossie standard and the Dosi engine underneath.
      </>
    ),
    items: [
      {
        name: "Datus Studio",
        caption: "Commercial · where humans, BI and agents interact",
        chips: ["Co-pilot", "BI", "AI agents", "REST · MCP"],
      },
      {
        name: "Datus agent",
        caption: "Open source · generates the models, runs the work",
        chips: ["OSI models", "text-to-SQL", "CLI · SDK", "Apache 2.0"],
      },
      {
        name: "Apache Ossie + Dosi engine",
        caption: "The standard · defines and compiles the semantics",
        chips: ["Ontology", "OSI → SQL", "16 dialects", "Open standard"],
      },
    ],
  },
  lifecycle: {
    eyebrow: "How it builds",
    heading: "From a raw warehouse to a context layer agents trust",
    lead: (
      <>
        Datus reads what you already have and compiles it into a governed{" "}
        <A href="/tools/osi-playground/">Apache Ossie context layer</A> — then keeps refining it from
        real usage.
      </>
    ),
    phases: [
      "Connect",
      "Read schema & SQL",
      "Generate OSI models",
      "Map ontology",
      "Define metrics",
      "Govern access",
      "Agents query",
      "Evolve",
    ],
  },
  useCases: {
    eyebrow: "The wedge",
    heading: "Where the data context layer pays for itself",
    lead: "Start with one governed domain, prove it in an afternoon, then expand domain by domain.",
    items: [
      {
        title: "Turn a stalled agent pilot into production",
        body: (
          <>
            The demo worked on sample data and died on the real thing. Datus gives that pilot a
            governed context layer over the real warehouse, so it finally ships.
          </>
        ),
      },
      {
        title: "One definition across a fragmented BI estate",
        body: (
          <>
            Same metric, three definitions, two platforms. Datus compiles one{" "}
            <A href="/osi-field-mapping/">Apache Ossie semantic layer</A> that BI, humans and agents
            all read.
          </>
        ),
      },
      {
        title: "Agents that reason over an ontology, not raw tables",
        body: (
          <>
            Ontology teaches agents what things mean and how they connect, so they navigate the
            business instead of guessing at joins.
          </>
        ),
      },
      {
        title: "A semantic layer your agents call over MCP",
        body: (
          <>
            Expose the governed context over <A href="/mcp/">native MCP</A>, so Claude, Cursor or your
            own agents query through definitions, not raw SQL.
          </>
        ),
      },
    ],
  },
  surfaces: {
    eyebrow: "Interfaces",
    heading: "Same engine, same answers — everywhere your team works",
    lead: "CLI, REST with Apache Arrow, native MCP and a Python SDK. One data context layer, every surface — humans, BI and agents get the same governed answer.",
    items: [
      {
        id: "studio",
        name: "Studio",
        tagline: (
          <>
            The commercial <A href="/products/studio/">context-aware co-pilot</A> where teams drive the
            whole stack in natural language — map entities, define metrics and answer questions,
            grounded in your governed context layer.
          </>
        ),
        start: "open studio.datus.ai",
      },
      {
        id: "cli",
        name: "Datus agent",
        tagline: (
          <>
            The open-source <A href="/products/cli/">Datus agent</A> reads your schema and SQL history,
            generates OSI semantic models with no hand-written YAML, then handles datasets, text-to-SQL
            and scheduling — all under Apache 2.0.
          </>
        ),
        start: "pip install datus-agent",
      },
      {
        id: "chatbot",
        name: "Chatbot",
        tagline: (
          <>
            Embed the context layer in Slack, Feishu or Microsoft Teams so every channel becomes a{" "}
            <A href="/chatbot/">self-serve data interface</A> — answers that match the governed
            definitions, not one-off SQL.
          </>
        ),
        start: "/datus in Slack",
      },
      {
        id: "mcp",
        name: "MCP Server",
        tagline: (
          <>
            Expose your entire governed context over the{" "}
            <A href="/mcp/">Model Context Protocol</A>. Plug it into Claude, Cursor or Windsurf so any
            agent reasons over your ontology and metrics — same engine, same answers.
          </>
        ),
        start: "datus mcp serve",
      },
    ],
  },
  stack: {
    eyebrow: "Integrations",
    heading: "On the modern data stack you already run",
    lead: "Point Datus at your warehouse, catalog, semantic layer and BI. The Dosi engine compiles OSI to native SQL for 16 warehouse dialects, so nothing has to migrate.",
    model: "Model",
    byo: "BYO",
    groups: ["Warehouse", "Modeling", "Semantic Layer", "Catalog", "BI", "Orchestration"],
    seeAll: "See all integrations",
  },
  faq: {
    lead: "The data context layer, Apache Ossie, the Dosi engine, open core and how Datus compares.",
    browseAll: "Browse all FAQs",
    items: [
      {
        q: "What is a data context layer?",
        a: "A data context layer is a governed semantic layer and ontology built directly on your warehouse: it teaches AI what your entities, metrics and relationships mean, and gives it clean, governed paths to measure them. Unlike a general-purpose memory store, it is grounded in the data itself — the context an enterprise data agent needs to answer correctly instead of guessing at joins and definitions.",
      },
      {
        q: "Why does an enterprise agent mandate stall without one?",
        a: "The blocker is rarely the model. It is decades of messy, siloed data no LLM can safely navigate on its own, so the demo works on sample data and dies on the real thing. Datus connects to the warehouse you already own and compiles a governed context layer in days — agents get clear, governed paths through the business, so the pilot reaches production.",
      },
      {
        q: "What is Apache Ossie (OSI) and why does Datus build on it?",
        a: "OSI (Open Semantic Interchange), now Apache Ossie, is an open standard for defining ontology and semantic models — backed by 50+ organizations including Snowflake, Databricks, Salesforce and dbt Labs. Datus defines your models in OSI specs rather than a proprietary format, so your context layer is portable and vendor-neutral. The spec is open to everyone; our engine and our position in it are the product.",
      },
      {
        q: "What is the Dosi engine?",
        a: "Dosi is a Rust engine that compiles OSI YAML to native SQL for 16 warehouse dialects, with zero-copy Arrow streaming. It is on its way to open source and already free to download and use — the same engine and the same answers behind the CLI, REST, MCP and the SDK.",
      },
      {
        q: "How does the open core relate to Datus Studio?",
        a: "The open-source Datus agent, the Dosi engine and the Apache Ossie models are the core, free to run on your own warehouse. Datus Studio is the commercial layer on top: a context-aware co-pilot where humans, BI and agents drive the whole stack in natural language, with SSO, RBAC and private / VPC deployment for enterprises.",
      },
      {
        q: "How does Datus compare to Snowflake Cortex, Databricks Genie or Cube?",
        a: "Snowflake Semantic Views feed Cortex Analyst and Databricks Metric Views feed Genie, but neither reads the other — context inside one vendor stops there. Datus sits on neutral ground: an Apache Ossie semantic layer and ontology on the warehouse you already own, compiled to native SQL across 16 dialects, that agents call over MCP.",
      },
    ],
  },
  closing: {
    heading: "Give your data agents a context layer they can trust.",
    lead: (
      <>
        Open Datus Studio <A href="/pricing/">free in your browser</A>, or self-host the open-source
        agent and Dosi engine on the warehouse you already own.
      </>
    ),
    cta: "Get started",
  },
};

const ZH: HomeCopy = {
  hero: {
    eyebrow: "企业数据上下文层 · Apache Ossie",
    titleLead: "",
    titleAccent: "数据上下文层",
    titleTail: "，几天就能用。",
    lead: (
      <>
        几乎每家企业都被要求落地数据 Agent，能真正交付的却寥寥无几。Datus 直接在你
        <A href="/databases/">已有的数仓</A>上，建起一层受治理的数据上下文层。它是一套{" "}
        <strong>Apache Ossie</strong> 语义层与本体，而不是通用记忆。这份上下文，你的数据 Agent
        才真正信得过：几天就能上线，还会随每一次查询不断演进。
      </>
    ),
    ctaPrimary: "免费开始使用",
    ctaGithub: "在 GitHub 上 Star",
    contact: "想在企业里落地？联系我们",
    byoWarehouse: <>自带<A href="/databases/">数仓</A></>,
    byoModel: <>自带<A href="/models/">模型</A></>,
  },
  terminal: {
    connected: "↳ 读取表结构 · SQL 历史 · 血缘 → 生成 OSI 语义模型",
    ready: "✓ Apache Ossie 上下文层就绪：本体、指标、受治理的 SQL",
    pipeline: "编译 → 校验 → 治理 → 服务",
    captured: " · 由 Dosi 引擎编译，覆盖 16 种方言",
    selfEvolve: "↻ 持续演进：从每一次查询中打磨本体与指标",
    memory: "· 一份口径，多个入口",
  },
  prompts: [
    "梳理我们的营收本体",
    "流失率指标只定义一次",
    "回答：Q3 各地区净营收",
    "把语义层暴露到 MCP",
    "把停滞的 agent pilot 推上生产",
  ],
  proof: [
    { value: "", label: "GitHub Star" },
    { value: "Apache Ossie", label: "开放的语义 + 本体标准" },
    { value: "16 种方言", label: "一份 OSI 规范，原生 SQL" },
    { value: "几天，而非几个季度", label: "接上就有可用的上下文层" },
  ],
  problem: {
    eyebrow: "落地难题",
    heading: "每家企业都被要求落地数据 Agent，真正能交付的却很少。",
    lead: "真正的卡点不是模型，而是几十年沉淀下来的杂乱、割裂的数据。没有哪个 Agent 能独自在里面安全穿行，于是 pilot 迟迟推不动，账单却照样寄来。Datus 为 Agent 铺出一条受治理的通路。",
    colProblem: "没有上下文层",
    colDatus: "有了 Datus",
    rows: [
      {
        problem: "Agent 全靠猜来拼 join、凑口径，然后一本正经地答错。",
        solution:
          "Agent 只能通过受治理的 Apache Ossie 语义层与本体查询，没有胡编的余地。",
      },
      {
        problem: "把数据彻底重构一遍要好几个季度，pilot 撑不到真实数据就先夭折了。",
        solution: (
          <>
            起步快、零重构。接上你<A href="/databases/">已有的数仓</A>，几天就能拥有可用的数据上下文层。
          </>
        ),
      },
      {
        problem: "同一个指标，每个团队各有各的算法，数字永远对不齐。",
        solution: (
          <>
            让<A href="/integrations/">数据的生产者、消费者和 Agent</A>共用同一份受治理的口径。一处定义，处处一致。
          </>
        ),
      },
    ],
  },
  layers: {
    eyebrow: "产品结构",
    heading: "开放内核，商业 Studio",
    lead: (
      <>
        一套基于开放标准的技术栈：上层是商业化的 <A href="/products/studio/">Studio</A>，中层是开源 Agent，
        底层是 Apache Ossie 标准和 Dosi 引擎。
      </>
    ),
    items: [
      {
        name: "Datus Studio",
        caption: "商业 · 人、BI 与 Agent 的交互入口",
        chips: ["Co-pilot", "BI", "AI Agent", "REST · MCP"],
      },
      {
        name: "Datus agent",
        caption: "开源 · 生成模型、执行任务",
        chips: ["OSI 模型", "text-to-SQL", "CLI · SDK", "Apache 2.0"],
      },
      {
        name: "Apache Ossie + Dosi 引擎",
        caption: "标准 · 定义并编译语义",
        chips: ["本体", "OSI → SQL", "16 种方言", "开放标准"],
      },
    ],
  },
  lifecycle: {
    eyebrow: "如何构建",
    heading: "从原始数仓，到 Agent 可信任的上下文层",
    lead: (
      <>
        Datus 读取你手上已有的一切，编译成一层受治理的{" "}
        <A href="/tools/osi-playground/">Apache Ossie 上下文层</A>，再从真实使用中不断打磨。
      </>
    ),
    phases: [
      "连接",
      "读取表结构与 SQL",
      "生成 OSI 模型",
      "映射本体",
      "定义指标",
      "治理访问",
      "Agent 查询",
      "持续演进",
    ],
  },
  useCases: {
    eyebrow: "切入点",
    heading: "数据上下文层从哪里开始回本",
    lead: "先从一个治理好的业务域入手，一个下午就能验证，再一个域一个域地铺开。",
    items: [
      {
        title: "把停滞的 agent pilot 推上生产",
        body: (
          <>
            Demo 在样本数据上好好的，一碰真实数据就崩。Datus 在真实数仓之上给这个 pilot
            铺一层受治理的上下文层，它才终于能上线。
          </>
        ),
      },
      {
        title: "在四分五裂的 BI 版图里统一口径",
        body: (
          <>
            同一个指标，三种定义，散在两个平台。Datus 编译出一套
            <A href="/osi-field-mapping/">Apache Ossie 语义层</A>，BI、人和 Agent 读的都是同一份。
          </>
        ),
      },
      {
        title: "让 Agent 在本体上推理，而不是在裸表上猜",
        body: (
          <>
            本体告诉 Agent 每个概念是什么、彼此如何关联，于是它能在业务里找路，而不是靠猜去拼 join。
          </>
        ),
      },
      {
        title: "让 Agent 通过 MCP 调用你的语义层",
        body: (
          <>
            用<A href="/mcp/">原生 MCP</A> 把受治理的上下文开放出去，Claude、Cursor
            或你自己的 Agent 都按口径查询，而不是直接写裸 SQL。
          </>
        ),
      },
    ],
  },
  surfaces: {
    eyebrow: "接口",
    heading: "同一个引擎，同一份答案，覆盖团队工作的每一处",
    lead: "CLI、基于 Apache Arrow 的 REST、原生 MCP，还有 Python SDK。一层数据上下文层接通所有入口，人、BI 和 Agent 拿到的都是同一份受治理的答案。",
    items: [
      {
        id: "studio",
        name: "Studio",
        tagline: (
          <>
            商业版的<A href="/products/studio/">上下文感知 co-pilot</A>。团队用自然语言驱动整套技术栈，
            映射实体、定义指标、回答问题，全都落在你受治理的上下文层之上。
          </>
        ),
        start: "open studio.datus.ai",
      },
      {
        id: "cli",
        name: "Datus agent",
        tagline: (
          <>
            开源的 <A href="/products/cli/">Datus agent</A> 读取你的表结构和 SQL 历史，
            不用手写 YAML 就能生成 OSI 语义模型，再一手包办数据集、text-to-SQL 和调度，全部基于 Apache 2.0。
          </>
        ),
        start: "pip install datus-agent",
      },
      {
        id: "chatbot",
        name: "Chatbot",
        tagline: (
          <>
            把上下文层嵌进 Slack、飞书或 Microsoft Teams，每个群都变成
            <A href="/chatbot/">自助取数入口</A>，答案对齐统一治理的口径，而不是临时拼的 SQL。
          </>
        ),
        start: "/datus in Slack",
      },
      {
        id: "mcp",
        name: "MCP Server",
        tagline: (
          <>
            通过 <A href="/mcp/">Model Context Protocol</A> 把整套受治理的上下文开放出去。
            接进 Claude、Cursor 或 Windsurf，任何 Agent 都能基于你的本体和指标推理，同一个引擎，同一份答案。
          </>
        ),
        start: "datus mcp serve",
      },
    ],
  },
  stack: {
    eyebrow: "集成",
    heading: "适配你已经在跑的 modern data stack",
    lead: "让 Datus 对接你的数仓、数据目录、语义层和 BI。Dosi 引擎把 OSI 编译成 16 种数仓方言的原生 SQL，什么都不用迁移。",
    model: "模型",
    byo: "自带",
    groups: ["数仓", "建模", "语义层", "数据目录", "BI", "编排调度"],
    seeAll: "查看全部集成",
  },
  faq: {
    lead: "数据上下文层、Apache Ossie、Dosi 引擎、开放内核，以及 Datus 与同类方案的对比。",
    browseAll: "浏览全部常见问题",
    items: [
      {
        q: "什么是数据上下文层？",
        a: "数据上下文层直接建在你的数仓之上，是一套受治理的语义层与本体。它告诉 AI 你的实体、指标和关系分别代表什么，并给出干净、受治理的度量路径。和通用记忆存储不同，它扎根于数据本身，这正是企业数据 Agent 想答对、而不是靠猜 join 和口径时，真正需要的上下文。",
      },
      {
        q: "为什么没有它，企业的 Agent 落地任务就会停滞？",
        a: "卡点很少出在模型，而在于几十年攒下的杂乱、割裂的数据。没有 LLM 能独自在里面安全穿行，于是 Demo 在样本数据上跑得好好的，一到真实数据就崩。Datus 接上你已有的数仓，几天就编译出一层受治理的上下文层，Agent 拿到一条贯穿业务的清晰通路，pilot 才走得到生产。",
      },
      {
        q: "什么是 Apache Ossie（OSI），Datus 为什么建在它之上？",
        a: "OSI（Open Semantic Interchange）现在叫 Apache Ossie，是定义本体与语义模型的开放标准，已有 Snowflake、Databricks、Salesforce、dbt Labs 等 50 多家组织参与。Datus 用 OSI 规范定义你的模型，而不是专有格式，因此你的上下文层可以自由迁移、不被厂商绑定。规范对所有人开放；真正的产品，是我们的引擎，以及我们在这套标准里的位置。",
      },
      {
        q: "什么是 Dosi 引擎？",
        a: "Dosi 是一个 Rust 引擎，把 OSI YAML 编译成 16 种数仓方言的原生 SQL，还带零拷贝 Arrow 流式传输。它正在走向开源，目前已经可以免费下载使用。CLI、REST、MCP 和 SDK 背后，都是同一个引擎、同一份答案。",
      },
      {
        q: "开放内核和 Datus Studio 是什么关系？",
        a: "开源的 Datus agent、Dosi 引擎和 Apache Ossie 模型构成内核，可以免费跑在你自己的数仓上。Datus Studio 是架在上面的商业层：一个上下文感知的 co-pilot，人、BI 和 Agent 都用自然语言驱动整套技术栈，还为企业提供 SSO、RBAC 以及私有 / VPC 部署。",
      },
      {
        q: "Datus 和 Snowflake Cortex、Databricks Genie 或 Cube 相比如何？",
        a: "Snowflake Semantic Views 喂给 Cortex Analyst，Databricks Metric Views 喂给 Genie，可两边互不读取，上下文困在单一厂商内部就到此为止。Datus 站在中立地带：在你已有的数仓之上建起一套 Apache Ossie 语义层与本体，编译成 16 种方言的原生 SQL，让 Agent 通过 MCP 直接调用。",
      },
    ],
  },
  closing: {
    heading: "给你的数据 Agent 一层可以信任的上下文层。",
    lead: (
      <>
        在浏览器里<A href="/pricing/">免费打开 Datus Studio</A>，
        或者把开源 Agent 和 Dosi 引擎私有部署到你已有的数仓上。
      </>
    ),
    cta: "开始使用",
  },
};

export const HOME: Record<Locale, HomeCopy> = { en: EN, zh: ZH };
