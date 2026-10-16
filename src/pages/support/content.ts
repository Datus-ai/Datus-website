import type { Locale } from "../../i18n/config";
import type { FaqItem } from "../../components/FAQ";

export interface ISupportGuide {
  id: string;
  category: string;
  title: string;
  intro: string;
  steps: string[];
  note: string;
}
export interface ISupportTopic {
  id: string;
  title: string;
  body: string;
  guides: string[];
}
interface ISupportPage {
  title: string;
  eyebrow: string;
  heading: string;
  lead: string[];
  searchLabel: string;
  searchPlaceholder: string;
  searchAction: string;
  quickLabel: string;
  quick: { label: string; query: string }[];
  channelsLabel: string;
  channels: { title: string; body: string; action: string }[];
  topicsTitle: string;
  topicsLead: string;
  docs: string;
  dotiTitle: string;
  dotiBody: string;
  openStudio: string;
  faqTitle: string;
  faqCategory: string;
  requestTitle: string;
  requestLead: string;
  requestItems: { title: string; body: string }[];
  submit: string;
  copyTemplate: string;
  requestNote: string;
  resourcesTitle: string;
  resourcesBody: string;
  resourcesLabel: string;
  deployment: string;
  security: string;
  contact: string;
  closeGuide: string;
  guideHelp: string;
  emailHelp: string;
  searchResults: string;
  clearSearch: string;
  searchCount: string;
  empty: string;
  emptyContact: string;
  copied: string;
  copyFailed: string;
  template: string[];
  topics: ISupportTopic[];
  guides: ISupportGuide[];
  faqs: FaqItem[];
}

export const supportPage: Record<Locale, ISupportPage> = {
  zh: {
    title: "支持与帮助",
    eyebrow: "DATUS 支持中心",
    heading: "找到答案，继续你的工作。",
    lead: [
      "从第一次连接数据，到团队协作与部署。",
      "查找使用指南、解决常见问题，或直接联系 Datus 团队。",
    ],
    searchLabel: "搜索帮助指南",
    searchPlaceholder: "搜索帮助，例如：连接失败、模型配置、访问权限",
    searchAction: "搜索",
    quickLabel: "常见搜索",
    quick: [
      {
        label: "数据库连接",
        query: "数据库连接",
      },
      {
        label: "模型报错",
        query: "模型",
      },
      {
        label: "访问权限",
        query: "权限",
      },
    ],
    channelsLabel: "获取支持的方式",
    channels: [
      {
        title: "提交产品问题",
        body: "遇到异常或有改进建议？通过 Studio 反馈入口告诉我们。",
        action: "提交反馈",
      },
      {
        title: "联系 Datus 团队",
        body: "无法进入 Studio，或需要沟通账号、部署和企业支持问题。",
        action: "contact@datus.ai",
      },
      {
        title: "和社区一起交流",
        body: "在 Slack 分享使用经验、讨论配置，也可以参与开源项目交流。",
        action: "加入 Slack 社区",
      },
    ],
    topicsTitle: "你需要哪方面的帮助？",
    topicsLead: "选择一个主题，从常见问题开始排查。",
    docs: "CLI 与开源文档",
    dotiTitle: "已经在使用 Datus Studio？",
    dotiBody: "点击右上角 Doti 头像，获取产品使用与配置方面的帮助。",
    openStudio: "打开 Studio",
    faqTitle: "常见问题，先看这里",
    faqCategory: "常见问题",
    requestTitle: "让我们更快了解你的问题",
    requestLead: "提交反馈或发送邮件时，带上这些信息，能减少来回确认。",
    requestItems: [
      {
        title: "发生了什么",
        body: "你想完成什么操作？实际结果和预期有什么不同？",
      },
      {
        title: "如何复现",
        body: "操作步骤、发生时间与时区，以及使用的浏览器或部署版本。",
      },
      {
        title: "错误线索",
        body: "错误提示、Trace ID 和脱敏后的截图；如涉及模型，请附供应商及模型名称。",
      },
      {
        title: "如何联系你",
        body: "留下可回复的邮箱，方便团队与你确认细节。",
      },
    ],
    submit: "提交反馈",
    copyTemplate: "复制问题模板",
    requestNote:
      "请勿发送密码、API Key、登录 Cookie 或完整生产数据。截图和日志请先脱敏。涉及敏感问题时，请使用邮件联系。",
    resourcesTitle: "部署、安全或企业支持",
    resourcesBody: "了解部署方式与安全实践，或通过团队约定的渠道联系我们。",
    resourcesLabel: "部署与企业支持资源",
    deployment: "部署文档",
    security: "安全与隐私",
    contact: "联系团队",
    closeGuide: "关闭指南",
    guideHelp: "仍需帮助？提交反馈",
    emailHelp: "通过邮件联系",
    searchResults: "搜索结果",
    clearSearch: "清除搜索",
    searchCount: "关于「{query}」的帮助 · {count} 项",
    empty: "暂时没有找到相关内容。你可以换个关键词，或",
    emptyContact: "联系 Datus 团队",
    copied: "问题模板已复制，可粘贴到反馈或邮件中。",
    copyFailed: "复制未完成，请允许浏览器访问剪贴板后重试。",
    template: [
      "【Datus 支持请求】",
      "",
      "使用产品／部署版本：",
      "浏览器与操作系统：",
      "发生时间与时区：",
      "问题描述：",
      "预期结果：",
      "实际结果：",
      "复现步骤：",
      "错误提示／Trace ID：",
      "模型供应商与模型名称（如适用）：",
      "脱敏截图或日志：",
      "联系邮箱：",
      "",
      "请勿填写密码、API Key、登录 Cookie 或敏感生产数据。",
    ],
    topics: [
      {
        id: "account",
        title: "账号与登录",
        body: "登录方式、账号身份与工作区。",
        guides: ["login", "workspace"],
      },
      {
        id: "database",
        title: "数据库连接",
        body: "连接配置、网络连通与访问权限。",
        guides: ["database-failed", "database-prepare"],
      },
      {
        id: "model",
        title: "模型配置",
        body: "供应商、模型连接与调用排查。",
        guides: ["model-failed", "model-config"],
      },
      {
        id: "permissions",
        title: "项目与权限",
        body: "找回资源入口，确认团队授权。",
        guides: ["project-access", "access-request"],
      },
      {
        id: "reports",
        title: "报告与大盘",
        body: "查看、发布与分享你的数据成果。",
        guides: ["report-open", "share"],
      },
      {
        id: "deployment",
        title: "部署与集成",
        body: "私有部署、CLI 与编辑器扩展。",
        guides: ["deploy", "cli-docs"],
      },
    ],
    guides: [
      {
        id: "login",
        category: "账号与登录",
        title: "无法登录怎么办？",
        intro: "先确认你使用的登录方式，再根据页面提示排查。",
        steps: [
          "确认访问的是正确的 Datus Studio 地址。私有部署请使用团队提供的站点地址。",
          "使用注册或团队分配账号时采用的登录方式。企业 SSO 账号请通过对应的组织身份提供方登录。",
          "检查账号信息与页面错误提示。请勿将密码、验证码或登录 Cookie 发到社区。",
          "如果仍无法进入，发送邮件至 contact@datus.ai，说明登录方式、发生时间和脱敏错误截图。",
        ],
        note: "无法登录时仍可通过邮箱联系团队，无需先进入产品反馈页。",
      },
      {
        id: "workspace",
        category: "账号与登录",
        title: "账号、工作区和项目有什么区别？",
        intro: "先区分你的个人身份和团队资源，能更快找到正确的入口。",
        steps: [
          "账号代表你的登录身份；工作区用于组织团队成员、项目和数据服务。",
          "项目包含具体的数据开发工作、上下文、对话和产物，并绑定所需的数据源与模型。",
          "确认已经进入正确的工作区。同一账号可能参与多个工作区。",
          "找不到工作区或项目时，请先向资源负责人确认是否已授权到当前账号。",
        ],
        note: "拥有账号不代表自动拥有团队所有项目的访问权限。",
      },
      {
        id: "database-failed",
        category: "数据库连接",
        title: "如何排查数据库连接失败？",
        intro: "数据库连接问题通常需要从地址、网络、凭据和权限几个方面确认。",
        steps: [
          "检查数据库类型、主机、端口、数据库名称与所选适配器是否匹配。",
          "确认 Datus 所在部署环境能够访问数据库。私有网络、IP 白名单、TLS 和防火墙规则需由管理员核对。",
          "确认连接账号及凭据有效，并具备任务所需的最小访问权限。",
          "记录失败时间和错误提示。联系团队时附数据库类型及脱敏后的连接信息，不要发送密码。",
        ],
        note: "本地电脑能连接数据库，并不一定代表 Datus 的运行环境也可以连接。",
      },
      {
        id: "database-prepare",
        category: "数据库连接",
        title: "连接数据前需要准备什么？",
        intro: "提前准备连接信息和访问范围，能减少配置过程中的反复确认。",
        steps: [
          "确认数据库类型与需要连接的实例、数据库、Schema 或数据集。",
          "准备供 Datus 使用的连接账号，并按实际任务限制可访问的资源与操作。",
          "确认网络访问路径、TLS 要求和需要放行的来源地址。",
          "在产品配置界面输入凭据，完成连接验证后再关联到所需的项目。",
        ],
        note: "请在产品配置界面填写凭据，避免在邮件、截图或公共社区中传递。",
      },
      {
        id: "model-failed",
        category: "模型配置",
        title: "如何排查模型调用失败？",
        intro:
          "Datus Studio 的模型供应商与配置由用户选择。排查时需要同时检查项目配置和供应商侧状态。",
        steps: [
          "确认项目已绑定模型连接，并且当前选择的模型与任务一致。",
          "检查供应商、模型名称、API 地址以及凭据配置是否匹配。",
          "按供应商错误信息核对 Key 权限、账号额度、请求限制或服务可用性。",
          "仍无法定位时，提供供应商名称、模型名称、失败时间和脱敏错误提示，或记录 Trace ID。",
        ],
        note: "请勿发送 API Key。供应商的服务与账号限制，需要结合对应供应商的提示处理。",
      },
      {
        id: "model-config",
        category: "模型配置",
        title: "如何选择和配置模型？",
        intro: "先选择你计划使用的模型供应商，再把对应连接关联到项目。",
        steps: [
          "在 Studio 的模型管理页面创建或选择模型连接。",
          "按供应商要求填写模型、API 地址和凭据；兼容接口需确认模型名称的具体写法。",
          "确认供应商账号已具备使用该模型的权限和所需额度。",
          "将模型连接关联到目标项目，并在工作台选择所需模型。",
        ],
        note: "每个项目的模型连接可能不同；请在发生问题的项目中核对当前配置。",
      },
      {
        id: "project-access",
        category: "项目与权限",
        title: "项目打不开，或看不到某个资源？",
        intro: "先检查账号与工作区，再确认目标资源的授权。",
        steps: [
          "核对当前登录账号，以及所处的工作区是否正确。",
          "区分工作区成员权限、项目权限和具体产物的访问范围。",
          "请项目或资源负责人确认授权是否仍然有效，以及该资源是否已删除或调整。",
          "联系团队时附目标页面地址、发生时间和错误提示；不要附带登录凭据。",
        ],
        note: "权限由资源授权决定。产品内助手与支持排查不能替代资源负责人的授权。",
      },
      {
        id: "access-request",
        category: "项目与权限",
        title: "怎样申请团队资源访问权限？",
        intro: "资源访问应由对应的工作区、项目或产物负责人确认。",
        steps: [
          "说明你需要访问的工作区、项目或产物名称。",
          "向负责人提供你实际用于登录 Datus 的账号标识。",
          "描述需要完成的任务，让负责人分配与任务相符的访问范围。",
          "授权后重新进入目标页面；仍有问题时记录页面地址和错误提示。",
        ],
        note: "无需为了获取项目权限而共享其他成员的账号或登录会话。",
      },
      {
        id: "report-open",
        category: "报告与大盘",
        title: "报告或大盘为什么打不开？",
        intro: "链接有效性与产物访问范围是首先需要检查的两项。",
        steps: [
          "确认链接完整，且指向的是需要查看的报告或大盘。",
          "如果页面要求登录，请使用已被授权的账号登录。",
          "向产物负责人确认是否已发布、是否仍然可用，以及当前访问范围是否包含你。",
          "若有权限但内容加载失败，提供发生时间、页面地址与脱敏错误截图。",
        ],
        note: "报告或大盘是否能被外部访问，取决于发布与分享时的授权设置。",
      },
      {
        id: "share",
        category: "报告与大盘",
        title: "分享产物前需要检查哪些内容？",
        intro: "先确认发布版本和接收者权限，再发送链接。",
        steps: [
          "核对报告、大盘或 Chatbot 的内容与准备分享的版本。",
          "确认产物已完成所需的发布步骤。",
          "检查接收者账号或公开访问设置，避免分享超出预期的数据范围。",
          "请接收者使用自己的身份验证访问结果，避免使用分享者的登录状态代替验证。",
        ],
        note: "更新源内容不一定代表已发布版本同步变化，请确认实际发布的版本。",
      },
      {
        id: "deploy",
        category: "部署与集成",
        title: "私有部署从哪里开始？",
        intro: "部署前先明确基础设施、访问域名和所需的外部服务。",
        steps: [
          "从公开部署文档开始，选择适合团队基础设施的部署方式。",
          "根据文档准备数据库、存储、网络及所需配置，敏感凭据由部署管理员管理。",
          "验证登录、数据库连接及模型调用等关键路径。",
          "需要团队协助时，提供部署版本、故障时间和脱敏日志；企业支持通过团队约定渠道沟通。",
        ],
        note: "公开部署文档：https://studio.datus.ai/deployment。生产环境操作应由对应的部署管理员执行。",
      },
      {
        id: "cli-docs",
        category: "部署与集成",
        title: "CLI 与 VS Code 的帮助在哪里？",
        intro: "CLI 与编辑器扩展有独立的安装、配置和集成文档。",
        steps: [
          "访问 docs.datus.ai，查看与你使用版本对应的快速开始与配置说明。",
          "CLI 问题请记录安装版本、运行命令和脱敏后的错误输出。",
          "编辑器扩展问题请同时记录编辑器及扩展版本。",
          "开源问题可以到对应 GitHub 仓库检索已有 Issue；涉及私密环境的信息请通过邮件沟通。",
        ],
        note: "Studio、CLI 和编辑器扩展的操作入口不同，请在反馈时注明你使用的产品。",
      },
    ],
    faqs: [
      {
        q: "无法登录，也可以联系支持吗？",
        a: "可以。直接发送邮件至 contact@datus.ai，说明登录方式、发生时间和页面提示。不要附带密码、验证码或登录 Cookie。",
      },
      {
        q: "模型报错，应该联系 Datus 还是供应商？",
        a: "先核对项目模型配置。Key 权限、供应商账号额度或服务限制等问题，需要结合供应商提示处理；如果问题涉及 Studio 配置或错误信息不清楚，可以将供应商、模型名称及脱敏提示发给 Datus 团队。",
      },
      {
        q: "反馈、邮件和 Slack，该用哪一个？",
        a: "产品异常和改进建议可通过 Studio 提交反馈；无法登录、私有环境信息及企业支持适合邮件或团队约定渠道；Slack 适合使用交流。公共社区请勿发布敏感数据。",
      },
      {
        q: "是否有固定的响应时间？",
        a: "具体响应安排以你与 Datus 约定的支持条款为准。有企业支持协议时，请使用协议约定的联系与升级渠道。",
      },
      {
        q: "Doti 能帮我解决哪些问题？",
        a: "Doti 可以回答产品使用问题，并在当前账号的权限范围内协助排查配置。可用入口以产品内显示为准；需要人工跟进或无法进入 Studio 时，请通过反馈或邮件联系团队。",
      },
      {
        q: "发现安全问题，应该在哪里报告？",
        a: "请通过邮件私下联系 Datus 团队，注明安全问题及必要的复现信息。更多说明见 安全与隐私。不要在公共社区发布漏洞细节或敏感凭据。",
      },
    ],
  },
  en: {
    title: "Support & Help",
    eyebrow: "DATUS SUPPORT",
    heading: "Find answers. Keep moving.",
    lead: [
      "From your first data connection to team collaboration and deployment.",
      "Explore guides, troubleshoot common issues, or contact the Datus team.",
    ],
    searchLabel: "Search help guides",
    searchPlaceholder:
      "Search help: connections, model configuration, access permissions",
    searchAction: "Search",
    quickLabel: "Popular searches",
    quick: [
      {
        label: "Database connections",
        query: "database",
      },
      {
        label: "Model errors",
        query: "model",
      },
      {
        label: "Access permissions",
        query: "permissions",
      },
    ],
    channelsLabel: "Ways to get support",
    channels: [
      {
        title: "Report a product issue",
        body: "Found a problem or have a suggestion? Tell us through the Studio feedback page.",
        action: "Submit feedback",
      },
      {
        title: "Contact the Datus team",
        body: "Cannot enter Studio, or need help with accounts, deployment, or enterprise support?",
        action: "contact@datus.ai",
      },
      {
        title: "Connect with the community",
        body: "Share experience, discuss configuration in Slack, and join open-source conversations.",
        action: "Join the Slack community",
      },
    ],
    topicsTitle: "What do you need help with?",
    topicsLead: "Choose a topic and start with the common checks.",
    docs: "CLI & open-source docs",
    dotiTitle: "Already using Datus Studio?",
    dotiBody:
      "Select the Doti avatar at the top right for help with product usage and configuration.",
    openStudio: "Open Studio",
    faqTitle: "Common questions, answered",
    faqCategory: "Common questions",
    requestTitle: "Help us understand the issue",
    requestLead:
      "Include these details in feedback or email to reduce back-and-forth.",
    requestItems: [
      {
        title: "What happened",
        body: "What were you trying to do, and how did the actual result differ from your expectation?",
      },
      {
        title: "How to reproduce it",
        body: "Include steps, the time and time zone, and your browser or deployment version.",
      },
      {
        title: "Error details",
        body: "Add the message, Trace ID, and redacted screenshots. For model issues, name the provider and model.",
      },
      {
        title: "How to reach you",
        body: "Leave a reply email so the team can confirm details with you.",
      },
    ],
    submit: "Submit feedback",
    copyTemplate: "Copy issue template",
    requestNote:
      "Do not send passwords, API keys, session cookies, or full production data. Redact screenshots and logs. Use email for sensitive issues.",
    resourcesTitle: "Deployment, security, or enterprise support",
    resourcesBody:
      "Read about deployment and security practices, or contact us through your agreed support channel.",
    resourcesLabel: "Deployment and enterprise support resources",
    deployment: "Deployment docs",
    security: "Security & privacy",
    contact: "Contact the team",
    closeGuide: "Close guide",
    guideHelp: "Still need help? Submit feedback",
    emailHelp: "Contact by email",
    searchResults: "Search results",
    clearSearch: "Clear search",
    searchCount: "Help for “{query}” · {count} results",
    empty: "No matching help yet. Try another keyword, or",
    emptyContact: "contact the Datus team",
    copied: "Issue template copied. Paste it into feedback or an email.",
    copyFailed:
      "Could not copy. Allow clipboard access in your browser and try again.",
    template: [
      "[Datus support request]",
      "",
      "Product / deployment version:",
      "Browser and operating system:",
      "Time and time zone:",
      "Issue description:",
      "Expected result:",
      "Actual result:",
      "Steps to reproduce:",
      "Error message / Trace ID:",
      "Model provider and model name (if relevant):",
      "Redacted screenshots or logs:",
      "Reply email:",
      "",
      "Do not include passwords, API keys, session cookies, or sensitive production data.",
    ],
    topics: [
      {
        id: "account",
        title: "Account & sign-in",
        body: "Sign-in methods, identity, and workspaces.",
        guides: ["login", "workspace"],
      },
      {
        id: "database",
        title: "Database connections",
        body: "Connection setup, network access, and permissions.",
        guides: ["database-failed", "database-prepare"],
      },
      {
        id: "model",
        title: "Model configuration",
        body: "Providers, model connections, and failed calls.",
        guides: ["model-failed", "model-config"],
      },
      {
        id: "permissions",
        title: "Projects & permissions",
        body: "Find resources and confirm team access.",
        guides: ["project-access", "access-request"],
      },
      {
        id: "reports",
        title: "Reports & dashboards",
        body: "View, publish, and share your data work.",
        guides: ["report-open", "share"],
      },
      {
        id: "deployment",
        title: "Deployment & integrations",
        body: "Private deployments, CLI, and editor extensions.",
        guides: ["deploy", "cli-docs"],
      },
    ],
    guides: [
      {
        id: "login",
        category: "Account & sign-in",
        title: "How can I troubleshoot sign-in problems?",
        intro:
          "Start by confirming your sign-in method, then follow the message shown on the page.",
        steps: [
          "Make sure you are using the correct Datus Studio address. For private deployments, use the address provided by your team.",
          "Use the sign-in method you registered with or your team assigned. For enterprise SSO, sign in through the appropriate identity provider.",
          "Check your account details and the error message. Do not share passwords, verification codes, or session cookies in the community.",
          "If you still cannot sign in, email contact@datus.ai with your sign-in method, the time of the problem, and a redacted screenshot.",
        ],
        note: "You can email the team without signing in or opening the product feedback page.",
      },
      {
        id: "workspace",
        category: "Account & sign-in",
        title: "How do accounts, workspaces, and projects differ?",
        intro:
          "Distinguish your personal identity from team resources to find the right place to work.",
        steps: [
          "Your account is your sign-in identity. A workspace organizes team members, projects, and data services.",
          "A project contains data development work, context, conversations, and artifacts, and connects to the data sources and models it needs.",
          "Check that you are in the correct workspace. One account can participate in several workspaces.",
          "If a workspace or project is missing, ask its owner to confirm that your current account has access.",
        ],
        note: "Having an account does not automatically give you access to every team project.",
      },
      {
        id: "database-failed",
        category: "Database connections",
        title: "How do I troubleshoot a failed database connection?",
        intro:
          "Check the address, network, credentials, and permissions before trying again.",
        steps: [
          "Check that the database type, host, port, database name, and selected adapter match.",
          "Confirm that the environment running Datus can reach the database. Ask an administrator to check private networking, IP allowlists, TLS, and firewall rules.",
          "Confirm that the connection account and credentials are valid and have the minimum permissions required for the task.",
          "Record the failure time and message. Share the database type and redacted connection details with the team, without passwords.",
        ],
        note: "A connection working on your computer does not necessarily mean that the Datus runtime can reach the same database.",
      },
      {
        id: "database-prepare",
        category: "Database connections",
        title: "What should I prepare before connecting data?",
        intro:
          "Prepare connection details and an access scope to reduce back-and-forth during setup.",
        steps: [
          "Identify the database type, instance, database, and schemas or datasets you need to connect.",
          "Prepare a connection account for Datus and restrict its resources and operations to the actual task.",
          "Confirm the network path, TLS requirements, and source addresses that need to be allowed.",
          "Enter credentials in the product configuration interface, verify the connection, and associate it with the project that needs it.",
        ],
        note: "Enter credentials in the product interface. Avoid sending them in email, screenshots, or public community channels.",
      },
      {
        id: "model-failed",
        category: "Model configuration",
        title: "How do I troubleshoot failed model calls?",
        intro:
          "Users choose their model provider and configuration in Datus Studio. Check both the project setup and the provider-side response.",
        steps: [
          "Confirm that the project is associated with a model connection and that the selected model matches the task.",
          "Check that the provider, model name, API endpoint, and credential configuration match.",
          "Use the provider error message to check API key permissions, account balance, request limits, or service availability.",
          "If the cause is still unclear, share the provider, model name, failure time, and redacted error message, or record the Trace ID.",
        ],
        note: "Do not send API keys. Provider service or account restrictions need to be handled using the corresponding provider guidance.",
      },
      {
        id: "model-config",
        category: "Model configuration",
        title: "How do I choose and configure a model?",
        intro:
          "Choose the provider you intend to use, then associate the corresponding connection with your project.",
        steps: [
          "Create or select a model connection in the model management page in Studio.",
          "Enter the model name, API endpoint, and credentials required by the provider. For compatible APIs, confirm the exact model identifier.",
          "Confirm that the provider account has permission and sufficient balance to use that model.",
          "Associate the model connection with the target project and select the model in the workbench.",
        ],
        note: "Model connections can differ between projects. Check the configuration in the project where the problem occurred.",
      },
      {
        id: "project-access",
        category: "Projects & permissions",
        title: "Why can’t I open a project or see a resource?",
        intro:
          "Check your account and workspace first, then confirm access to the target resource.",
        steps: [
          "Confirm the account you are signed in with and the workspace you are using.",
          "Distinguish workspace membership, project permissions, and access to individual artifacts.",
          "Ask the project or resource owner to confirm that access is still valid and the resource has not been removed or changed.",
          "When contacting the team, include the target page URL, the time of the problem, and the error message, without sign-in credentials.",
        ],
        note: "Access depends on resource permissions. Product assistance and support troubleshooting do not replace authorization by the resource owner.",
      },
      {
        id: "access-request",
        category: "Projects & permissions",
        title: "How do I request access to team resources?",
        intro:
          "The owner of the workspace, project, or artifact should confirm resource access.",
        steps: [
          "Identify the workspace, project, or artifact you need to access.",
          "Provide the owner with the account identifier you actually use to sign in to Datus.",
          "Describe the task so the owner can assign the appropriate access scope.",
          "After access is granted, reopen the target page. If the problem remains, record the URL and error message.",
        ],
        note: "You do not need to share another team member’s account or session to obtain project access.",
      },
      {
        id: "report-open",
        category: "Reports & dashboards",
        title: "Why can’t I open a report or dashboard?",
        intro: "Start by checking the link and the artifact’s access scope.",
        steps: [
          "Confirm that the link is complete and points to the report or dashboard you want to view.",
          "If sign-in is required, use an account that has been granted access.",
          "Ask the artifact owner to confirm that it is published, remains available, and allows access for your account.",
          "If you have access but content does not load, provide the time, page URL, and a redacted screenshot of the error.",
        ],
        note: "External access to a report or dashboard depends on its publication and sharing permissions.",
      },
      {
        id: "share",
        category: "Reports & dashboards",
        title: "What should I check before sharing an artifact?",
        intro:
          "Confirm the published version and recipient permissions before sending the link.",
        steps: [
          "Check the report, dashboard, or Chatbot content and the version you intend to share.",
          "Confirm that the artifact has completed the required publication steps.",
          "Check recipient accounts or public access settings to avoid sharing data beyond the intended scope.",
          "Ask recipients to verify access with their own identity rather than the sender’s signed-in session.",
        ],
        note: "Updating source content does not necessarily update the published version. Confirm the version that was actually published.",
      },
      {
        id: "deploy",
        category: "Deployment & integrations",
        title: "Where should I start with a private deployment?",
        intro:
          "Identify your infrastructure, access domain, and required external services before deploying.",
        steps: [
          "Start with the public deployment documentation and select a deployment approach suited to your infrastructure.",
          "Prepare the database, storage, networking, and configuration required by the guide. Deployment administrators should manage sensitive credentials.",
          "Validate essential paths, including sign-in, database connectivity, and model calls.",
          "When asking for help, include the deployment version, failure time, and redacted logs. Use your team’s agreed channel for enterprise support.",
        ],
        note: "Public deployment documentation: https://studio.datus.ai/deployment. Production operations should be performed by the responsible deployment administrator.",
      },
      {
        id: "cli-docs",
        category: "Deployment & integrations",
        title: "Where can I find help for CLI and VS Code?",
        intro:
          "The CLI and editor extension have separate installation, configuration, and integration documentation.",
        steps: [
          "Visit docs.datus.ai and use the quickstart and configuration guide for your installed version.",
          "For CLI issues, record the installed version, command, and redacted error output.",
          "For editor extension issues, also record the editor and extension versions.",
          "For open-source issues, search the corresponding GitHub repository. Discuss private environment details by email instead of in public issues.",
        ],
        note: "Studio, CLI, and editor extensions have different entry points. Specify which product you are using in your request.",
      },
    ],
    faqs: [
      {
        q: "Can I contact support if I cannot sign in?",
        a: "Yes. Email contact@datus.ai with your sign-in method, the time of the problem, and the message shown on the page. You do not need to open the Studio feedback page first. Include a redacted screenshot if it helps explain the issue, but do not send passwords, verification codes, or session cookies.",
      },
      {
        q: "Should I contact Datus or my model provider about a model error?",
        a: "Check the project’s model configuration first. API key permissions, provider account balance, and service limits need to be addressed using the provider’s response. If the issue concerns Studio configuration or the error is unclear, contact Datus with the provider, model name, and redacted error message. Do not include the API key.",
      },
      {
        q: "When should I use feedback, email, or Slack?",
        a: "Use Studio feedback for product errors and improvement suggestions. Email is suitable when you cannot sign in or need to discuss private environment details; use your agreed channel for enterprise support. Slack is for usage discussions and community exchange. Do not post credentials, sensitive logs, or production data in public channels.",
      },
      {
        q: "Is there a guaranteed response time?",
        a: "Response arrangements depend on the support terms agreed with Datus. If you have an enterprise support agreement, use its specified contact and escalation channels and refer to its response commitments. This public support page does not establish a separate response-time guarantee. Include a clear description and contact details so the team can follow up.",
      },
      {
        q: "What can Doti help me with?",
        a: "Doti answers product usage questions and can help investigate configuration within the permissions of your current account. Availability follows the entry points shown in the product. It does not grant additional access to resources. For human follow-up, or if you cannot enter Studio, contact the team through feedback or email.",
      },
      {
        q: "Where should I report a security issue?",
        a: "Contact the Datus team privately by email and identify the security concern, including the information needed to reproduce it. Consult the Security & Privacy page for more detail. Avoid posting vulnerability details or sensitive credentials in public community channels. Redact personal and production data from any screenshots or logs you share.",
      },
    ],
  },
};
