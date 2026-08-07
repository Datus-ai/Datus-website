import type { Locale } from "./config";

/**
 * Site-wide UI copy — chrome, buttons, labels and other strings that are not
 * tied to a single page. Page bodies keep their copy next to the page (see
 * each `content.ts` / `Page.tsx`), which keeps this file small enough to audit.
 *
 * Terminology is locked by datus-i18n-spec.md §5: 数据工程 Agent, 上下文引擎,
 * 语义层, 开始使用, 定价, 集成, 文档, 社区, 企业版, 云端个人版, 联系我们.
 * Product names, CLI commands and package names stay in English.
 */
export type UiMessages = {
  nav: {
    home: string;
    products: string;
    integrations: string;
    pricing: string;
    blog: string;
    community: string;
    docs: string;
    github: string;
    slack: string;
    menu: string;
    getStarted: string;
    getStartedFree: string;
    switchTo: string;
    switchAria: string;
  };
  footer: {
    tagline: string;
    products: string;
    resources: string;
    company: string;
    integrations: string;
    pricing: string;
    blog: string;
    glossary: string;
    faq: string;
    docs: string;
    contact: string;
    github: string;
    community: string;
    rights: string;
  };
  products: {
    cli: string;
    cliDesc: string;
    vscode: string;
    vscodeDesc: string;
    studio: string;
    studioDesc: string;
    enterprise: string;
    enterpriseDesc: string;
    allIntegrations: string;
    allIntegrationsDesc: string;
    databases: string;
    databasesDesc: string;
    models: string;
    modelsDesc: string;
  };
  faq: {
    eyebrow: string;
    heading: string;
  };
  common: {
    capabilities: string;
    whatYouGet: string;
    quickstart: string;
  };
  /** Enterprise contact form + dialog (shared by several pages). */
  form: {
    fullName: string;
    company: string;
    workEmail: string;
    dataStack: string;
    problem: string;
    submit: string;
    submitting: string;
    thanks: string;
    thanksBody: string;
    thanksBodyEmailSuffix: string;
    genericError: string;
    other: string;
    close: string;
    dialogTitle: string;
    dialogLead: string;
    dialogThanksBody: string;
    role: string;
    message: string;
    messagePlaceholder: string;
  };
  /** In-browser OSI Playground widget (labels only — YAML is never translated). */
  osiTool: {
    loadExample: string;
    loadInvalid: string;
    clear: string;
    placeholder: string;
    inputAria: string;
    oversize: string;
    toolsAria: string;
    validator: string;
    converter: string;
    diff: string;
    copy: string;
    copied: string;
    download: string;
    mapped: string;
    renamed: string;
    diffLines: string;
    yamlError: string;
    invalidRoot: string;
    validOsi: string;
    conforms: string;
    issue: string;
    issues: string;
    conversionFailed: string;
    droppedFields: string;
    diffEmpty: string;
  };
  /** Chrome of the shared CLI / Chatbot / API / MCP comparison grid. */
  interfaceMatrix: {
    heading: string;
    lead: string;
    youAreHere: string;
    starOnGitHub: string;
    cli: string;
    cliBlurb: string;
    chatbot: string;
    chatbotBlurb: string;
    api: string;
    apiBlurb: string;
    mcp: string;
    mcpBlurb: string;
  };
};

export const UI: Record<Locale, UiMessages> = {
  en: {
    nav: {
      home: "Home",
      products: "Products",
      integrations: "Integrations",
      pricing: "Pricing",
      blog: "Blog",
      community: "Community",
      docs: "Docs",
      github: "GitHub",
      slack: "Slack",
      menu: "Menu",
      getStarted: "Get started",
      getStartedFree: "Get started — free",
      switchTo: "中文",
      switchAria: "Switch to Chinese",
    },
    footer: {
      tagline:
        "The open-source data engineering agent with an evolvable Context Engine — natural language to governed, production-ready data work.",
      products: "Products",
      resources: "Resources",
      company: "Company",
      integrations: "Integrations",
      pricing: "Pricing",
      blog: "Blog",
      glossary: "Glossary",
      faq: "FAQ",
      docs: "Docs",
      contact: "Contact",
      github: "GitHub",
      community: "Community",
      rights: "DatusAI, Inc.",
    },
    products: {
      cli: "Datus CLI",
      cliDesc: "Run the modern data stack from your terminal.",
      vscode: "VS Code Extension",
      vscodeDesc: "Bring context and agents into your editor.",
      studio: "Datus Studio",
      studioDesc: "The easiest way to start — free, no setup.",
      enterprise: "Enterprise",
      enterpriseDesc: "Shared context, governance, long-running agents.",
      allIntegrations: "All Integrations",
      allIntegrationsDesc: "Storage, semantic, BI, MCP, skills, tracing.",
      databases: "Databases",
      databasesDesc: "SQLite, Postgres, Snowflake, Spark…",
      models: "Models",
      modelsDesc: "OpenAI, Claude, Gemini, DeepSeek…",
    },
    faq: {
      eyebrow: "FAQ",
      heading: "Frequently asked questions",
    },
    common: {
      capabilities: "Capabilities",
      whatYouGet: "What you get",
      quickstart: "Quickstart",
    },
    form: {
      fullName: "Full name *",
      company: "Company *",
      workEmail: "Work email *",
      dataStack: "Data stack",
      problem: "What are you trying to solve? (optional)",
      submit: "Request a meeting",
      submitting: "Sending…",
      thanks: "Thanks — we'll be in touch",
      thanksBody: "We typically respond within one business day. Or email ",
      thanksBodyEmailSuffix: ".",
      genericError: "Something went wrong. Try again.",
      other: "Other",
      close: "Close",
      dialogTitle: "Contact us about Enterprise & BYOC",
      dialogLead:
        "Tell us a little about your team and what you're trying to do. We'll get back within one business day.",
      dialogThanksBody:
        "We typically respond within one business day. In the meantime, feel free to email ",
      role: "Role / title",
      message: "What are you trying to do?",
      messagePlaceholder: "Stack, scale, timeline, anything we should know…",
    },
    osiTool: {
      loadExample: "Load example",
      loadInvalid: "Load invalid",
      clear: "Clear",
      placeholder: "Paste your MetricFlow YAML here…",
      inputAria: "MetricFlow YAML input",
      oversize: "Input is over 200 KB — trimmed for browser-side processing.",
      toolsAria: "OSI Playground tools",
      validator: "Validator",
      converter: "Converter",
      diff: "Diff",
      copy: "Copy",
      copied: "Copied",
      download: "Download",
      mapped: "mapped",
      renamed: "renamed",
      diffLines: "lines",
      yamlError: "✗ YAML error",
      invalidRoot: "✗ Invalid root",
      validOsi: "✓ Valid OSI",
      conforms: "This document conforms to the OSI v{version} core schema (subset).",
      issue: "issue",
      issues: "issues",
      conversionFailed: "✗ Conversion failed",
      droppedFields: "Dropped fields:",
      diffEmpty: "Paste a MetricFlow YAML on the left to see the line-by-line diff.",
    },
    interfaceMatrix: {
      heading: "Pick the Interface That Fits Your Team",
      lead: "Four surfaces. One agent. Pick the one that fits your team.",
      youAreHere: "You are here",
      starOnGitHub: "Star on GitHub",
      cli: "CLI",
      cliBlurb: "Explore data, build context, and ship SQL from the terminal.",
      chatbot: "Web Chatbot",
      chatbotBlurb: "Chat with subagents from a browser — zero install.",
      api: "API Server",
      apiBlurb: "Consume data services via REST — language agnostic.",
      mcp: "MCP Server",
      mcpBlurb: "Plug into Claude Desktop, Cursor, and any MCP client.",
    },
  },
  zh: {
    nav: {
      home: "首页",
      products: "产品",
      integrations: "集成",
      pricing: "定价",
      blog: "博客",
      community: "社区",
      docs: "文档",
      github: "GitHub",
      slack: "Slack",
      menu: "菜单",
      getStarted: "开始使用",
      getStartedFree: "免费开始使用",
      switchTo: "English",
      switchAria: "切换到英文",
    },
    footer: {
      tagline:
        "开源的数据工程 Agent，内置可演进的上下文引擎——用自然语言完成可治理、可上生产的数据工作。",
      products: "产品",
      resources: "资源",
      company: "公司",
      integrations: "集成",
      pricing: "定价",
      blog: "博客",
      glossary: "术语表",
      faq: "常见问题",
      docs: "文档",
      contact: "联系我们",
      github: "GitHub",
      community: "社区",
      rights: "DatusAI, Inc.",
    },
    products: {
      cli: "Datus CLI",
      cliDesc: "在终端里跑通整个 modern data stack。",
      vscode: "VS Code 插件",
      vscodeDesc: "把上下文和 Agent 带进你的编辑器。",
      studio: "Datus Studio",
      studioDesc: "最省事的上手方式——免费、免部署。",
      enterprise: "企业版",
      enterpriseDesc: "共享上下文、治理能力、长时运行 Agent。",
      allIntegrations: "全部集成",
      allIntegrationsDesc: "存储、语义层、BI、MCP、Skills、链路追踪。",
      databases: "数据库",
      databasesDesc: "SQLite、Postgres、Snowflake、Spark…",
      models: "模型",
      modelsDesc: "OpenAI、Claude、Gemini、DeepSeek…",
    },
    faq: {
      eyebrow: "常见问题",
      heading: "常见问题",
    },
    common: {
      capabilities: "核心能力",
      whatYouGet: "你能得到什么",
      quickstart: "快速开始",
    },
    form: {
      fullName: "姓名 *",
      company: "公司 *",
      workEmail: "工作邮箱 *",
      dataStack: "数据技术栈",
      problem: "你想解决什么问题？（选填）",
      submit: "预约沟通",
      submitting: "提交中…",
      thanks: "感谢——我们会尽快联系你",
      thanksBody: "我们通常在一个工作日内回复。也可以直接发邮件到 ",
      thanksBodyEmailSuffix: "。",
      genericError: "出了点问题，请重试。",
      other: "其他",
      close: "关闭",
      dialogTitle: "咨询企业版与 BYOC",
      dialogLead: "简单说说你的团队和想解决的问题，我们会在一个工作日内回复。",
      dialogThanksBody: "我们通常在一个工作日内回复。在此期间，也欢迎直接发邮件到 ",
      role: "职位 / 头衔",
      message: "你想做什么？",
      messagePlaceholder: "技术栈、规模、时间节点，任何你觉得我们该知道的…",
    },
    osiTool: {
      loadExample: "载入示例",
      loadInvalid: "载入错误示例",
      clear: "清空",
      placeholder: "把你的 MetricFlow YAML 贴到这里…",
      inputAria: "MetricFlow YAML 输入框",
      oversize: "输入超过 200 KB——已截断以便在浏览器端处理。",
      toolsAria: "OSI Playground 工具",
      validator: "校验器",
      converter: "转换器",
      diff: "差异对比",
      copy: "复制",
      copied: "已复制",
      download: "下载",
      mapped: "个字段已映射",
      renamed: "个字段已重命名",
      diffLines: "行",
      yamlError: "✗ YAML 解析出错",
      invalidRoot: "✗ 根节点不合法",
      validOsi: "✓ OSI 校验通过",
      conforms: "该文档符合 OSI v{version} 核心 schema（子集）。",
      issue: "个问题",
      issues: "个问题",
      conversionFailed: "✗ 转换失败",
      droppedFields: "被丢弃的字段：",
      diffEmpty: "在左侧贴入 MetricFlow YAML，即可看到逐行差异。",
    },
    interfaceMatrix: {
      heading: "挑一个适合你团队的入口",
      lead: "四种入口，同一个 Agent。挑最适合你团队的那个。",
      youAreHere: "当前页面",
      starOnGitHub: "在 GitHub 上 Star",
      cli: "CLI",
      cliBlurb: "在终端里探索数据、构建上下文并交付 SQL。",
      chatbot: "Web Chatbot",
      chatbotBlurb: "在浏览器里和子代理对话——零安装。",
      api: "API Server",
      apiBlurb: "通过 REST 调用数据服务——与语言无关。",
      mcp: "MCP Server",
      mcpBlurb: "接入 Claude Desktop、Cursor 及任意 MCP 客户端。",
    },
  },
};
