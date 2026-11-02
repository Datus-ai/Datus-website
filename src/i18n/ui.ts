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
  theme: { toDark: string; toLight: string };
  install: { terminal: string; quickInstall: string; copy: string; copied: string; failed: string; example: string };
  nav: {
    home: string;
    support: string;
    products: string;
    solutions: string;
    semanticLayer: string;
    semanticLayerDesc: string;
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
    apacheDisclaimer: { project: string; afterProject: string; foundation: string; afterFoundation: string };
    semanticConverter: string;
    cookiePolicy: string;
    privacyPolicy: string;
    termsOfService: string;
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
    support: string;
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
    tryStudio: string;
    capabilities: string;
    whatYouGet: string;
    quickstart: string;
    pauseAnimation: string;
    playAnimation: string;
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
    theme: { toDark: "Switch to dark mode", toLight: "Switch to light mode" },
    install: { terminal: "Terminal", quickInstall: "Quick install", copy: "Copy install command", copied: "Copied", failed: "Could not copy — select the command", example: "Example session" },
    nav: {
      home: "Home",
      support: "Support",
      products: "Products",
      solutions: "Solutions",
      semanticLayer: "Semantic Layer",
      semanticLayerDesc: "Shared business definitions for teams and AI agents.",
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
      apacheDisclaimer: {
        project: "Apache Ossie (incubating)",
        afterProject: " is a project in the Apache Incubator at the ",
        foundation: "Apache Software Foundation (ASF)",
        afterFoundation: ". Incubation involves reviewing community and governance practices; it is not an assessment of code maturity or stability, and the project has not yet received full ASF endorsement. Apache and Apache Ossie are trademarks of the ASF. Datus is an independent product and is not endorsed by the ASF.",
      },
      semanticConverter: "Semantic Model Converter",
      cookiePolicy: "Cookie Policy",
      privacyPolicy: "Privacy Statement",
      termsOfService: "Terms of Service",
      cookieSettings: "Cookie Settings",
      tagline:
        "Trusted enterprise data context for AI agents. Business-aware. Agent-native. Audit-ready.",
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
      linkedin: "LinkedIn",
      x: "X",
      youtube: "YouTube",
      community: "Community",
      trustCenter: "Trust Center",
      support: "Support & Help",
      security: "Security & Privacy",
      rights: "DatusAI, Inc.",
    },
    products: {
      cli: "Datus Agent",
      cliDesc: "Open source — helps build reviewable semantic models.",
      dosi: "DOSI",
      dosiDesc: "Executes compatible Apache Ossie models.",
      vscode: "VS Code Extension",
      vscodeDesc: "Bring context and agents into your editor.",
      studio: "Datus Studio",
      studioDesc: "Explore shared business context with your team.",
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
      tryStudio: "Get Started Free",
      capabilities: "Capabilities",
      whatYouGet: "What you get",
      quickstart: "Quickstart",
      pauseAnimation: "Pause animation",
      playAnimation: "Play animation",
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
    theme: { toDark: "切换到深色模式", toLight: "切换到浅色模式" },
    install: { terminal: "终端", quickInstall: "快速安装", copy: "复制安装命令", copied: "已复制", failed: "复制失败，请选择命令复制", example: "示例会话" },
    nav: {
      home: "首页",
      support: "支持与帮助",
      products: "产品",
      solutions: "解决方案",
      semanticLayer: "语义层",
      semanticLayerDesc: "让团队与 AI Agent 共享业务定义。",
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
      apacheDisclaimer: {
        project: "Apache Ossie（孵化中）",
        afterProject: "是 ",
        foundation: "Apache 软件基金会（ASF）",
        afterFoundation: "旗下 Apache Incubator 中的项目。孵化过程涉及对社区和治理机制的审核，不代表对代码成熟度或稳定性的评价，也不表示该项目已获得 ASF 的全面认可。Apache 和 Apache Ossie 是 ASF 的商标。Datus 是独立产品，不代表 ASF 的认可或背书。",
      },
      semanticConverter: "语义模型转换器",
      cookiePolicy: "Cookie 政策",
      privacyPolicy: "隐私声明",
      termsOfService: "服务条款",
      cookieSettings: "Cookie 设置",
      tagline:
        "为 AI Agent 提供可信的企业数据上下文。理解业务、面向 Agent、可供审查。",
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
      linkedin: "LinkedIn",
      x: "X",
      youtube: "YouTube",
      community: "社区",
      trustCenter: "信任中心",
      support: "支持与帮助",
      security: "安全与隐私",
      rights: "DatusAI, Inc.",
    },
    products: {
      cli: "Datus Agent",
      cliDesc: "开源，辅助构建可供团队审核的语义模型。",
      dosi: "DOSI",
      dosiDesc: "执行兼容 Apache Ossie 的语义模型。",
      vscode: "VS Code 插件",
      vscodeDesc: "把上下文和 Agent 带进你的编辑器。",
      studio: "Datus Studio",
      studioDesc: "与团队一起探索共享的业务上下文。",
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
      tryStudio: "免费开始使用",
      capabilities: "核心能力",
      whatYouGet: "你能得到什么",
      quickstart: "快速开始",
      pauseAnimation: "暂停动态",
      playAnimation: "播放动态",
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
    "invalid_link": "Some selections in this link are unavailable or incompatible. Supported defaults have been selected.",
    "configuration": "Conversion Settings",
    "conversion_failed": "Conversion failed. Check the backend connection and retry.",
    "convert": "Convert",
    "converting": "Converting the current snapshot…",
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
    "replace_title": "Replace the Source and Results?",
    "replace_files_title": "Replace Source Files?",
    "replace_files_hint": "The affected input files will be replaced. Existing conversion results remain available until you convert again.",
    "replace_hint": "This replaces the current source or format and discards temporary results in this direction. Download anything you want to keep first.",
    "replace": "Replace",
    "cancel": "Cancel",
    "cancel_conversion": "Cancel Conversion",
    "temporary": "Temporary",
    "temporary_hint": "Generated files and edits stay in this page until discarded or closed. Download them to keep a local copy.",
    "privacy_hint": "Clicking Convert sends the current source files to Datus servers. No warehouse connection or SQL execution is performed.",
    "snapshot_changed": "The source or settings have changed. These files belong to the previous conversion snapshot.",
    "rate_limited": "Too many requests. Wait a minute and retry.",
    "unavailable": "The conversion service is unavailable. Please retry shortly.",
    "file_type": "Choose a .yml or .yaml text file.",
    "upload_failed": "Unable to read this file. Try pasting the YAML instead.",
    "source_link": "View Original Example",
    "source_link_hint": "Upstream Apache fixtures for export; authored vendor examples for import. Target execution is not verified.",
    "retail_hint": "The retail example intentionally produces warnings for its suggested Snowflake target.",
    "editor_loading": "Loading editor…",
    "editor_failed": "The editor could not load. You can still view and edit the file as text.",
    "input_status": "Input",
    "results_status": "Results",
    "export_blocked": "This result cannot be downloaded until its diagnostics are resolved.",
    "import_direction": "Import to Ossie",
    "export_direction": "Export from Ossie",
    "source_platform": "Source Platform",
    "source_files": "Source Files",
    "choose_source_file": "Choose Source File",
    "add_files": "Add Files",
    "choose_files": "Choose Files",
    "choose_folder": "Choose Folder",
    "paste_code": "Paste Code",
    "paste_title": "Add a Source File",
    "relative_path": "Relative File Path",
    "source_code": "YAML / JSON",
    "add_file": "Add File",
    "remove_source": "Remove Selected Source File",
    "add_source_hint": "Upload files, paste code, or select an example to begin.",
    "source_notes": "Source Format Notes",
    "import_unavailable": "This service does not expose model import yet. Retry after the service has been upgraded.",
    "import_catalog_failed": "Unable to load import formats. Check the connection or try again shortly.",
    "export_only": "Export Only",
    "import_empty": "Choose a source platform and convert to preview Ossie YAML.",
    "invalid_bundle": "Use at most 50 files and 1 MiB total UTF-8 content including paths. Paths must be unique, safe and relative.",
    "reading": "Reading source files…",
    "bundle_hint": "Source files stay in memory. Upload all referenced files together.",
    "import_snapshot_hint": "Conversion uses all source files and current settings at the moment you click Convert, including unsaved edits.",
    "import_validation_hint": "Validate SQL expressions, relationships and metric results in an Ossie-compatible runtime before production use.",
    "optional": "Optional",
    "fixed_target": "Apache Ossie",
    "import_examples": "Try a Vendor Model Example",
    "example": "Example",
    "import_labels": {
      "cube": "Cube · Commerce (3 files)",
      "omni": "Omni · Sales (4 files)",
      "dbt": "dbt · Compiled Semantic Manifest",
      "microsoft": "Power BI · Offline BIM (Needs Review)"
    },
    "import_options": {
      "model_name": "Model Name",
      "view": "View",
      "topic": "Topic",
      "sql_dialect": "Source SQL Dialect"
    },
    "import_option_hints": {
      "view": "Select a Cube view when the input contains more than one.",
      "topic": "Select an Omni topic when the input contains more than one.",
      "sql_dialect": "Describes the input expressions; does not translate SQL."
    }
  },
  "zh": {
    "automatic": "自动",
    "base_hint": "留空时根据关联关系自动推断主数据集。",
    "blocked_hint": "转换结果不可用，请处理诊断问题后重新转换。",
    "catalog_failed": "无法加载转换目标列表。",
    "invalid_link": "链接中的部分选项不可用或不匹配，已改用支持的默认选项。",
    "configuration": "转换配置",
    "conversion_failed": "转换请求失败，请检查后端连接后重试。",
    "convert": "转换",
    "converting": "正在转换当前内容快照…",
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
    "replace_title": "替换源文件与结果？",
    "replace_files_title": "替换源文件？",
    "replace_files_hint": "对应的输入文件将被替换。已有转换结果会保留，直到你再次转换。",
    "replace_hint": "这会替换当前方向的输入或格式，并丢弃临时转换结果。请先下载需要保留的内容。",
    "replace": "替换",
    "cancel": "取消",
    "cancel_conversion": "取消转换",
    "temporary": "临时文件",
    "temporary_hint": "生成的文件及编辑内容仅保留在当前页面，丢弃或关闭后清除。请下载到本地以保留副本。",
    "privacy_hint": "点击转换时，当前源文件将发送至 Datus 服务器；不会连接数据仓库或执行 SQL。",
    "snapshot_changed": "输入或配置已更改。当前文件来自上一次转换时的内容快照。",
    "rate_limited": "请求过于频繁，请稍后重试。",
    "unavailable": "转换服务暂时不可用，请稍后重试。",
    "file_type": "请选择 .yml 或 .yaml 文本文件。",
    "upload_failed": "无法读取文件，请尝试直接粘贴 YAML。",
    "source_link": "查看原始样例",
    "source_link_hint": "导出样例来自 Apache 测试文件，导入样例为编写的测试定义；未验证目标运行效果。",
    "retail_hint": "零售样例转换至建议的 Snowflake 目标时会产生预期的警告。",
    "editor_loading": "正在加载编辑器…",
    "editor_failed": "编辑器加载失败，仍可通过文本框查看和编辑文件。",
    "input_status": "输入",
    "results_status": "结果",
    "export_blocked": "请先解决诊断问题，再下载当前结果。",
    "import_direction": "导入 Ossie",
    "export_direction": "从 Ossie 导出",
    "source_platform": "来源平台",
    "source_files": "源文件",
    "choose_source_file": "选择源文件",
    "add_files": "添加文件",
    "choose_files": "选择文件",
    "choose_folder": "选择文件夹",
    "paste_code": "粘贴代码",
    "paste_title": "添加源文件",
    "relative_path": "相对文件路径",
    "source_code": "YAML / JSON",
    "add_file": "添加文件",
    "remove_source": "移除当前源文件",
    "add_source_hint": "上传文件、粘贴代码或选择样例即可开始。",
    "source_notes": "来源格式说明",
    "import_unavailable": "当前服务尚未开放模型导入接口，请在服务升级后重试。",
    "import_catalog_failed": "无法加载导入格式，请检查网络连接或稍后重试。",
    "export_only": "仅支持导出",
    "import_empty": "选择来源平台并转换，在此预览 Ossie YAML。",
    "invalid_bundle": "最多支持 50 个文件，UTF-8 内容与路径合计不超过 1 MiB。路径须为安全且不重复的相对路径。",
    "reading": "正在读取源文件…",
    "bundle_hint": "源文件仅保留在内存中，请一并上传所有被引用的文件。",
    "import_snapshot_hint": "转换使用点击按钮时所有源文件与配置的内容快照，包括尚未保存的编辑。",
    "import_validation_hint": "用于生产前，请在兼容 Ossie 的运行时核验 SQL 表达式、关系与指标结果。",
    "optional": "可选",
    "fixed_target": "Apache Ossie",
    "import_examples": "试用其他平台模型样例",
    "example": "样例",
    "import_labels": {
      "cube": "Cube · 电商（3 个文件）",
      "omni": "Omni · 销售（4 个文件）",
      "dbt": "dbt · 已编译语义 Manifest",
      "microsoft": "Power BI · 离线 BIM（需检查）"
    },
    "import_options": {
      "model_name": "模型名称",
      "view": "视图",
      "topic": "主题",
      "sql_dialect": "源 SQL 方言"
    },
    "import_option_hints": {
      "view": "输入包含多个 Cube 视图时，选择要使用的视图。",
      "topic": "输入包含多个 Omni 主题时，选择要使用的主题。",
      "sql_dialect": "说明输入表达式所用方言，不进行 SQL 翻译。"
    }
  }
};

/** Shared interaction labels for homepage product and evidence walkthroughs. */
export const HOME_WALKTHROUGH_UI:Record<Locale,{pause:string;play:string;selectLayer:string;inspect:string;close:string;next:string}>={
 en:{pause:'Pause automatic steps',play:'Play automatic steps',selectLayer:'Explore the connected layers',inspect:'Explore the product walkthrough',close:'Close product walkthrough',next:'Next step'},
 zh:{pause:'暂停自动切换',play:'播放自动步骤',selectLayer:'查看相连的业务上下文',inspect:'查看产品流程演示',close:'关闭产品流程演示',next:'下一步'},
};
