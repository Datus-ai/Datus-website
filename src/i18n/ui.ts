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
    language: string;
  };
  footer: {
    semanticConverter: string;
    cookiePolicy: string;
    cookieSettings: string;
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
    trustCenter: string;
    security: string;
    rights: string;
  };
  products: {
    cli: string;
    cliDesc: string;
    dosi: string;
    dosiDesc: string;
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
      switchAria: "Change language",
      language: "Language",
    },
    footer: {
      semanticConverter: "Semantic Model Converter",
      cookiePolicy: "Cookie Policy",
      cookieSettings: "Cookie Settings",
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
      trustCenter: "Trust Center",
      security: "Security & Privacy",
      rights: "DatusAI, Inc.",
    },
    products: {
      cli: "Datus agent",
      cliDesc: "Open source — generates OSI models and runs the work.",
      dosi: "Dosi engine",
      dosiDesc: "Compiles OSI to native SQL for 16 dialects. Free to download.",
      vscode: "VS Code Extension",
      vscodeDesc: "Bring context and agents into your editor.",
      studio: "Datus Studio",
      studioDesc: "The commercial context-aware co-pilot.",
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
      switchAria: "切换语言",
      language: "语言",
    },
    footer: {
      semanticConverter: "语义模型转换器",
      cookiePolicy: "Cookie 政策",
      cookieSettings: "Cookie 设置",
      tagline:
        "开源的数据工程 Agent，内置可演进的上下文引擎，用自然语言完成可治理、可上生产的数据工作。",
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
      trustCenter: "信任中心",
      security: "安全与隐私",
      rights: "DatusAI, Inc.",
    },
    products: {
      cli: "Datus agent",
      cliDesc: "开源，生成 OSI 模型、执行任务。",
      dosi: "Dosi 引擎",
      dosiDesc: "把 OSI 编译成 16 种方言的原生 SQL，可免费下载。",
      vscode: "VS Code 插件",
      vscodeDesc: "把上下文和 Agent 带进你的编辑器。",
      studio: "Datus Studio",
      studioDesc: "商业化的上下文感知 co-pilot。",
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

/** Local website implementation of the Semantic Model Conversion Workbench. */
export const SEMANTIC_CONVERTER_UI = {
  "en": {
    "automatic": "Automatic",
    "base_hint": "Leave empty to infer the root dataset from relationships.",
    "blocked_hint": "Export is blocked. Resolve the diagnostics and convert again.",
    "catalog_failed": "Unable to load conversion targets.",
    "configuration": "Conversion Settings",
    "conversion_failed": "Conversion failed. Check the backend connection and retry.",
    "convert": "Convert",
    "converting": "Converting the current file…",
    "diagnostics_total": "Diagnostics ({{total}})",
    "dialect_hint": "Selects an existing SQL expression; does not translate warehouse SQL.",
    "discard": "Discard",
    "discard_hint": "Unsaved conversion files and their edits will be discarded.",
    "discard_title": "Discard Temporary Results?",
    "download": "Download Locally",
    "download_failed": "Unable to prepare the download. Please retry.",
    "empty": "Choose a target and convert to preview temporary files.",
    "files": "Files",
    "files_total": "Files: {{total}}",
    "no_files": "No output files. Open Diagnostics for details.",
    "options": {
      "base_dataset": "Base Dataset",
      "data_source_id": "Data Source ID",
      "data_source_name": "Connection Name",
      "database": "Database",
      "model_name": "Model",
      "powerbi_item_id": "Fabric Item ID",
      "powerbi_workspace_id": "Fabric Workspace ID",
      "sql_dialect": "Preferred SQL Dialect"
    },
    "result_details": "About These Files",
    "retry": "Retry",
    "review_hint": "Files were generated with warnings. Review the diagnostics before using them.",
    "select_model": "Select a model",
    "snapshot_hint": "Conversion uses the file content at the moment you click Convert, including unsaved source edits.",
    "source_too_large": "Source exceeds the 1 MiB UTF-8 limit.",
    "status": {
      "blocked": "Blocked",
      "partial": "Needs Review",
      "success": "Success"
    },
    "target": "Target Platform",
    "target_notes": "Target Format Notes",
    "title": "Conversion Workbench",
    "validation_hint": "Target import and execution still need verification.",
    "source": "Source YAML",
    "source_placeholder": "Paste an Ossie or Dosi semantic model YAML, or load an example above.",
    "source_empty": "Enter a semantic model or load an example before converting.",
    "examples": "Try an Apache Ossie Example",
    "choose_example": "Choose an example…",
    "upload": "Upload YAML",
    "replace_title": "Replace the Source YAML?",
    "replace_hint": "Your current input will be replaced. Existing conversion results remain available until you convert again.",
    "replace": "Replace",
    "cancel": "Cancel",
    "cancel_conversion": "Cancel Conversion",
    "temporary": "Temporary · In Memory",
    "temporary_hint": "Generated files and edits stay in this page until discarded or closed. Download them to keep a local copy.",
    "privacy_hint": "Conversion sends the current YAML to Datus servers. No data source connection or SQL execution is performed.",
    "snapshot_changed": "The source or settings have changed. These files belong to the previous conversion snapshot.",
    "rate_limited": "Too many requests. Wait a minute and retry.",
    "unavailable": "The conversion service is unavailable. Please retry shortly.",
    "file_type": "Choose a .yml or .yaml text file.",
    "upload_failed": "Unable to read this file. Try pasting the YAML instead.",
    "source_link": "View Original Example",
    "source_link_hint": "Apache-2.0 test fixtures; target import and execution are not verified.",
    "retail_hint": "The retail example intentionally produces warnings for its suggested Snowflake target.",
    "editor_loading": "Loading editor…",
    "editor_failed": "The editor could not load. You can still view and edit the file as text.",
    "input_status": "Input",
    "results_status": "Results",
    "export_blocked": "This result cannot be downloaded until its diagnostics are resolved."
  },
  "zh": {
    "automatic": "自动",
    "base_hint": "留空时根据关联关系自动推断主数据集。",
    "blocked_hint": "转换结果不可用，请处理诊断问题后重新转换。",
    "catalog_failed": "无法加载转换目标列表。",
    "configuration": "转换配置",
    "conversion_failed": "转换请求失败，请检查后端连接后重试。",
    "convert": "转换",
    "converting": "正在转换当前文件…",
    "diagnostics_total": "诊断（{{total}}）",
    "dialect_hint": "优先选择已有方言表达式，不改写数据库 SQL。",
    "discard": "丢弃",
    "discard_hint": "尚未保存的转换文件及其编辑将被丢弃。",
    "discard_title": "丢弃临时结果？",
    "download": "下载到本地",
    "download_failed": "准备下载失败，请重试。",
    "empty": "选择目标平台并转换，在此预览临时文件。",
    "files": "文件",
    "files_total": "文件数：{{total}}",
    "no_files": "未生成文件，请打开诊断查看原因。",
    "options": {
      "base_dataset": "主数据集",
      "data_source_id": "数据源 ID",
      "data_source_name": "连接名称",
      "database": "数据库",
      "model_name": "模型",
      "powerbi_item_id": "Fabric 项目 ID",
      "powerbi_workspace_id": "Fabric 工作区 ID",
      "sql_dialect": "优先 SQL 方言"
    },
    "result_details": "文件说明",
    "retry": "重试",
    "review_hint": "已生成文件，使用前请检查转换诊断。",
    "select_model": "选择一个模型",
    "snapshot_hint": "转换使用点击按钮时的文件内容快照，包括源文件尚未保存的编辑。",
    "source_too_large": "源文件超过 1 MiB UTF-8 大小限制。",
    "status": {
      "blocked": "已阻断",
      "partial": "需检查",
      "success": "成功"
    },
    "target": "目标平台",
    "target_notes": "目标格式说明",
    "title": "转换工作台",
    "validation_hint": "仍需在目标平台验证文件导入和实际执行。",
    "source": "原始 YAML",
    "source_placeholder": "粘贴 Ossie 或 Dosi 语义模型 YAML，或从上方加载样例。",
    "source_empty": "请输入语义模型或加载样例后再转换。",
    "examples": "试用 Apache Ossie 样例",
    "choose_example": "选择样例…",
    "upload": "上传 YAML",
    "replace_title": "替换原始 YAML？",
    "replace_hint": "当前输入内容将被替换。已有转换结果会保留，直到你再次转换。",
    "replace": "替换",
    "cancel": "取消",
    "cancel_conversion": "取消转换",
    "temporary": "临时文件 · 内存中",
    "temporary_hint": "生成的文件及编辑内容仅保留在当前页面，丢弃或关闭后清除。请下载到本地以保留副本。",
    "privacy_hint": "转换会将当前 YAML 发送至 Datus 服务器；不会连接数据源或执行 SQL。",
    "snapshot_changed": "输入或配置已更改。当前文件来自上一次转换时的内容快照。",
    "rate_limited": "请求过于频繁，请稍后重试。",
    "unavailable": "转换服务暂时不可用，请稍后重试。",
    "file_type": "请选择 .yml 或 .yaml 文本文件。",
    "upload_failed": "无法读取文件，请尝试直接粘贴 YAML。",
    "source_link": "查看原始样例",
    "source_link_hint": "Apache-2.0 测试样例；目标平台导入与执行仍需验证。",
    "retail_hint": "零售样例转换至建议的 Snowflake 目标时会产生预期的警告。",
    "editor_loading": "正在加载编辑器…",
    "editor_failed": "编辑器加载失败，仍可通过文本框查看和编辑文件。",
    "input_status": "输入",
    "results_status": "结果",
    "export_blocked": "请先解决诊断问题，再下载当前结果。"
  }
};
