import type { FaqItem } from "../../components/FAQ";
import { TRUST_CENTER_URL } from "../../config/nav";
import type { Locale } from "../../i18n/config";

export interface ISecurityDetail {
  title: string;
  paragraphs: string[];
}

interface ISecurityFeature {
  title: string;
  body: string;
  detailsLabel: string;
  details: ISecurityDetail[];
}

interface ISecurityPageCopy {
  eyebrow: string;
  title: string;
  lead: string;
  updated: string;
  date: string;
  scope: string;
  trustCenter: string;
  contactAction: string;
  backToTop: string;
  models: ISecurityFeature;
  conversations: ISecurityFeature;
  features: { eyebrow: string; title: string; lead: string; note: string };
  visuals: Record<
    | "modelConnection"
    | "configuredByYou"
    | "model"
    | "modelValue"
    | "endpoint"
    | "endpointValue"
    | "credential"
    | "provider"
    | "conversation"
    | "prompt"
    | "context"
    | "response"
    | "delete"
    | "workspace"
    | "runtime"
    | "access"
    | "yourInfrastructure"
    | "storage"
    | "keys",
    string
  >;
  controls: {
    eyebrow: string;
    title: string;
    lead: string;
    detailsLabel: string;
    note: string;
    cards: {
      id: string;
      title: string;
      body: string;
      details: ISecurityDetail[];
    }[];
  };
  deployment: {
    eyebrow: string;
    title: string;
    lead: string;
    cards: ISecurityDetail[];
    responsibility: string;
  };
  compliance: {
    eyebrow: string;
    title: string;
    body: string;
    status: string;
    link: { label: string; href: string };
  };
  resources: {
    title: string;
    cards: { title: string; body: string; action: string; href: string }[];
  };
  faq: { id: string; title: string; items: FaqItem[] };
  contact: { title: string; body: string };
}

// Update both locales and this date whenever a public security statement changes.
export const SECURITY_UPDATED_AT = "2026-10-15";

const EN: ISecurityPageCopy = {
  eyebrow: "Datus Security",
  title: "Security & Privacy",
  updated: "Updated",
  date: "October 15, 2026",
  scope: "Applies to Datus Studio · Private deployment differences below",
  trustCenter: "Visit Trust Center",
  contactAction: "Contact the Datus Team",
  backToTop: "Back to Top",
  faq: {
    id: "questions",
    title: "Frequently Asked Questions",
    items: [
      {
        q: "Who chooses the model provider?",
        a: "You do. Users enter their own LLM connection settings, including the model, service URL, and credentials. Before connecting, confirm that the provider's data use, training, retention, and processing-region policies meet your organization's requirements.",
      },
      {
        q: "What conversation history does Datus save, and can I delete it?",
        a: "Datus Studio saves intermediate conversation messages during task execution. You can delete these messages yourself. Any inputs and outputs retained by your model provider are governed by its own policies and agreements; deleting history in Datus does not automatically delete the provider's copies.",
      },
      {
        q: "Can a private deployment use an internal model service?",
        a: "You can configure a compatible model service or internal gateway for your deployment environment. Whether data processing stays entirely internal also depends on model service URLs, external integrations, and network configuration. Review actual data flows against your deployment plan.",
      },
    ],
  },
  contact: {
    title: "Discuss Your Security Requirements",
    body: "Contact the Datus team for a vendor security assessment, clarification of deployment boundaries, or to report a potential security issue.",
  },
  lead: "Protecting credentials, managing conversation history, and keeping the boundaries of data access clear.",
  features: {
    eyebrow: "AI & Data Use",
    title: "Your Models. Your Conversations.",
    lead: "Choose your model service and manage the conversation messages you save.",
    note: "Model context may include questions, schemas, SQL, code, and query results. Review your chosen provider's data use and retention policies.",
  },
  models: {
    title: "Your Model. Your Provider.",
    body: "Configure your own LLM connection. Choose the model service that fits your business needs and data policies.",
    detailsLabel: "About Models and Data Use",
    details: [
      {
        title: "What a Model May Receive",
        paragraphs: [
          "Depending on the task you initiate, context may include natural-language questions, schemas and metadata, SQL, code, and query results returned by tools. Review your provider's terms to decide which content is appropriate for model inference.",
        ],
      },
      {
        title: "Provider Data Policies",
        paragraphs: [
          "Whether a provider retains inputs and outputs, uses them for training, or processes them in a particular region depends on the service, account settings, and agreements you choose. Check that these policies meet your organization's requirements when configuring a model.",
        ],
      },
    ],
  },
  conversations: {
    title: "Manage Your Conversation History.",
    body: "Datus Studio saves intermediate conversation messages during tasks. You can delete the saved messages yourself.",
    detailsLabel: "About Conversation History",
    details: [
      {
        title: "You manage your conversation history.",
        paragraphs: [
          "You can delete conversation messages saved in Datus. Deleting them in Datus does not delete copies a model provider may retain; those are governed by that provider's policies and agreements.",
        ],
      },
      {
        title: "Managing Different Data Types",
        paragraphs: [
          "Conversation messages, project files, published reports, and audit records serve different purposes and are managed separately. You can delete saved conversation messages. Contact the Datus team about deletion scope or requests involving other data.",
        ],
      },
    ],
  },
  visuals: {
    modelConnection: "Model Connection",
    configuredByYou: "Configured by You",
    model: "Model",
    modelValue: "Your chosen model",
    endpoint: "Service URL",
    endpointValue: "Your service endpoint",
    credential: "Credentials",
    provider: "Your chosen provider",
    conversation: "Conversation Messages",
    prompt: "Your question",
    context: "Task context",
    response: "Model response",
    delete: "Delete History",
    workspace: "Workspace",
    runtime: "Agent Runtime",
    access: "Identity & Resource Permissions",
    yourInfrastructure: "Your Infrastructure",
    storage: "Storage",
    keys: "Keys",
  },
  controls: {
    eyebrow: "Security Controls",
    title: "Protecting Each Step of Data Access",
    lead: "Security measures across your connections, task execution, and shared work.",
    detailsLabel: "View Controls",
    note: "SQL Policy requires project and plugin prerequisites, covers supported execution paths, and currently does not provide column-level permissions or data masking.",
    cards: [
      {
        title: "Credential & Transport Protection",
        body: "Sensitive data source credentials and model API keys are encrypted for storage. Public access uses HTTPS.",
        id: "data-protection",
        details: [
          {
            title: "Protection in Transit",
            paragraphs: [
              "Datus Studio uses HTTPS to protect public-network traffic between your browser and the service. Use secure connections to your data sources and model services, and keep certificate verification enabled.",
            ],
          },
          {
            title: "Credential Encryption",
            paragraphs: [
              "Sensitive data source credentials and model API keys are encrypted before storage. The encryption service supports AWS KMS; private deployments can also use a local key configured by the operator. Key configuration and access management are responsibilities of the corresponding deployment environment.",
            ],
          },
        ],
      },
      {
        title: "Identity & Resource Permissions",
        body: "Manage resource access with users, groups, and roles. Connect OIDC SSO where configured for your deployment.",
        id: "access-control",
        details: [
          {
            title: "Authentication and Enterprise Identity",
            paragraphs: [
              "Datus supports OIDC SSO when configured for the deployment. With SSO, your identity provider can apply its MFA and other authentication policies. Manage API keys for their intended purpose and revoke them when they are no longer needed.",
            ],
          },
          {
            title: "Data Access and Least Privilege",
            paragraphs: [
              "Use data source accounts with only the permissions required for a task. Where project and plugin prerequisites are met, SQL row-filter policies can restrict data in supported read paths according to the caller's attributes.",
            ],
          },
        ],
      },
      {
        title: "Sharing & Publication Controls",
        body: "Manage authorized access and anonymous links separately. Static reports show the content fixed at publication.",
        id: "sharing",
        details: [
          {
            title: "Public links",
            paragraphs: [
              "Anyone holding a valid link may be able to access its content without signing in. Managers can turn off sharing or revoke the link.",
            ],
          },
          {
            title: "Static reports",
            paragraphs: [
              "Report content is fixed when published and is not filtered again for each viewer. Review the data in a report before publishing it.",
            ],
          },
          {
            title: "Live queries",
            paragraphs: [
              "Dashboard and Chatbot query permissions depend on the viewer's identity, project configuration, and applicable data policies.",
            ],
          },
        ],
      },
      {
        title: "Audits & Vulnerability Management",
        body: "Code, dependency, and image scans identify risks. Audit events track key platform actions.",
        id: "secure-development",
        details: [
          {
            title: "Finding and Addressing Vulnerabilities",
            paragraphs: [
              "Datus uses static code analysis, dependency checks, and container image scanning to identify potential risks. Scans cover code changes and scheduled checks. Findings are assessed, tracked, and addressed according to their severity.",
              "We have conducted third-party penetration testing. The initial assessment in September 2026 covered Datus Studio's external, unauthenticated attack surface. Contact the Datus team for details about subsequent testing scope and available materials.",
            ],
          },
          {
            title: "Audit Logging",
            paragraphs: [
              "The platform records audit events for actions such as permission changes, connection configuration, and sharing management, tracking the actor, resource, time, and outcome. Enterprise deployments can configure audit event forwarding to their own OpenTelemetry logging infrastructure.",
            ],
          },
          {
            title: "Reporting Security Issues",
            paragraphs: [
              "If you discover a suspected vulnerability, exposed credential, or unusual access, contact us below with the impact, reproduction steps, and relevant environment details. Avoid sending passwords, API keys, or complete customer datasets by email.",
            ],
          },
        ],
      },
    ],
  },
  deployment: {
    eyebrow: "Deployment Options",
    title: "The Right Boundary for Your Data",
    lead: "Choose Datus Studio, BYOC, or private deployment to fit your data environment.",
    cards: [
      {
        title: "Datus Studio",
        paragraphs: [
          "Runs on AWS infrastructure. Agent runtime sandboxes are allocated per workspace, with access controlled through identity and resource permissions.",
          "Runtime isolation and data-storage isolation are separate controls. This does not mean each customer has a dedicated database or an entirely dedicated infrastructure stack.",
        ],
      },
      {
        title: "BYOC and Private Deployment",
        paragraphs: [
          "Deploy in your own cloud or infrastructure. Network boundaries, storage, keys, backups, and operational settings depend on the deployment plan and agreed responsibilities.",
          "For private deployments, review the configured model services and external integrations to confirm that their data flows meet your organization's policies.",
        ],
      },
    ],
    responsibility:
      "Datus maintains the product's security capabilities. Customers choose their model providers, manage data source accounts and member permissions, and configure sharing. Private deployment operators also maintain the security configuration of their runtime environment.",
  },
  compliance: {
    eyebrow: "Continuous Improvement",
    title: "Transparency as We Progress",
    body: "Datus is working toward a SOC 2 examination with Vanta, strengthening security controls and supporting evidence. This page describes current practices and does not represent an issued SOC 2 report.",
    status: "SOC 2 readiness in progress",
    link: {
      label: "Visit the Datus Trust Center",
      href: TRUST_CENTER_URL,
    },
  },
  resources: {
    title: "Security Resources",
    cards: [
      {
        title: "Datus Trust Center",
        body: "Explore compliance progress and available security resources.",
        action: "Visit Trust Center",
        href: TRUST_CENTER_URL,
      },
      {
        title: "Deployment & Security Boundaries",
        body: "Discuss BYOC, private deployment, and your team's security requirements.",
        action: "Explore Enterprise Deployment",
        href: "/products/enterprise/",
      },
      {
        title: "Report a Security Issue",
        body: "Tell us about suspected vulnerabilities, credential exposure, or unusual access.",
        action: "Contact the Datus Team",
        href: "mailto:contact@datus.ai?subject=Datus%20Security%20Report",
      },
    ],
  },
};

const ZH: ISecurityPageCopy = {
  eyebrow: "Datus 安全",
  title: "安全与隐私",
  updated: "更新于",
  date: "2026 年 10 月 15 日",
  scope: "适用于 Datus Studio · 私有部署差异见下文",
  trustCenter: "访问信任中心",
  contactAction: "联系 Datus 团队",
  backToTop: "返回顶部",
  faq: {
    id: "questions",
    title: "常见问题",
    items: [
      {
        q: "模型供应商由谁选择？",
        a: "由你选择。LLM 模型的连接配置由用户自行输入，包括模型、服务地址与连接凭据。配置前，请确认供应商的数据使用、训练、留存与处理地域政策符合你的组织要求。",
      },
      {
        q: "Datus 保存哪些会话记录？我能删除吗？",
        a: "Datus Studio 保存任务执行中的中间会话消息记录，你可以自行删除。模型供应商可能保留的输入和输出由其自身的政策与协议管理，不会因你删除 Datus 中的记录而自动同步删除。",
      },
      {
        q: "私有部署能否使用内部模型服务？",
        a: "可以根据部署环境配置兼容的模型服务或内部网关。是否完全在内部处理数据，还取决于模型服务地址、外部集成与网络配置。请结合具体部署方案核对实际数据流向。",
      },
    ],
  },
  contact: {
    title: "与我们讨论你的安全要求",
    body: "无论是供应商安全评估、部署边界确认，还是报告潜在安全问题，都可以联系 Datus 团队。",
  },
  lead: "保护连接凭据，管理会话记录，让每一次数据访问都有清楚的边界。",
  features: {
    eyebrow: "AI 与数据使用",
    title: "模型与会话，由你管理",
    lead: "选择适合你的模型服务，自主管理保存的会话消息。",
    note: "模型上下文可能包含提问、表结构、SQL、代码与查询结果。请核对所选供应商的数据使用与留存政策。",
  },
  models: {
    title: "你选择模型，也选择供应商。",
    body: "LLM 连接由你自行配置。根据业务需求与数据政策，选择合适的模型服务。",
    detailsLabel: "了解模型与数据使用",
    details: [
      {
        title: "模型可能接收哪些内容",
        paragraphs: [
          "根据你发起的任务，上下文可能包含自然语言提问、表结构与元数据、SQL、代码，以及工具返回的查询结果。请根据所选供应商的条款，决定哪些内容适合用于模型推理。",
        ],
      },
      {
        title: "供应商的数据政策",
        paragraphs: [
          "模型供应商是否保留输入和输出、是否将其用于训练，以及数据处理地域，取决于你所选的服务、账户配置与协议。配置模型时，请核对这些政策是否符合你所在组织的要求。",
        ],
      },
    ],
  },
  conversations: {
    title: "会话记录，由你管理与删除。",
    body: "Datus Studio 保存任务中的中间会话消息，你可以自行删除保存的记录。",
    detailsLabel: "了解会话记录管理",
    details: [
      {
        title: "会话记录由你管理。",
        paragraphs: [
          "你可以自行删除 Datus 中保存的会话消息记录。Datus 中的删除操作不等同于删除模型供应商可能保留的副本；后者由供应商的政策与协议决定。",
        ],
      },
      {
        title: "按数据类别管理",
        paragraphs: [
          "会话消息、项目文件、已发布报告和审计记录承担不同用途，需要分别管理。你可以删除保存的会话消息；涉及其他数据的删除范围或处理请求，请联系 Datus 团队。",
        ],
      },
    ],
  },
  visuals: {
    modelConnection: "模型连接",
    configuredByYou: "由你配置",
    model: "模型",
    modelValue: "你选择的模型",
    endpoint: "服务地址",
    endpointValue: "你提供的服务地址",
    credential: "连接凭据",
    provider: "你选择的供应商",
    conversation: "会话消息",
    prompt: "你的提问",
    context: "任务上下文",
    response: "模型回复",
    delete: "可自行删除",
    workspace: "工作区",
    runtime: "Agent 运行环境",
    access: "身份与资源权限",
    yourInfrastructure: "你的基础设施",
    storage: "存储",
    keys: "密钥",
  },
  controls: {
    eyebrow: "安全保障",
    title: "保护每一次数据访问",
    lead: "从连接到执行，再到分享，把安全措施落实到具体环节。",
    detailsLabel: "查看措施",
    note: "SQL Policy 需满足项目与插件条件，仅覆盖支持的执行路径，当前不提供列级权限或脱敏。",
    cards: [
      {
        title: "凭据与传输保护",
        body: "数据源敏感凭据与模型 API Key 加密保存，公网访问通过 HTTPS 传输。",
        id: "data-protection",
        details: [
          {
            title: "传输保护",
            paragraphs: [
              "Datus Studio 使用 HTTPS 保护浏览器与服务之间的公网传输。连接数据源与模型服务时，请使用安全的连接方式，并保留证书校验。",
            ],
          },
          {
            title: "连接凭据加密",
            paragraphs: [
              "数据源敏感凭据与模型 API Key 在存储前进行加密。加密服务支持 AWS KMS；私有部署也可使用部署方配置的本地密钥。密钥的配置与访问管理属于对应部署环境的安全职责。",
            ],
          },
        ],
      },
      {
        title: "身份与资源权限",
        body: "通过用户、用户组与角色管理资源访问，并支持按部署配置接入 OIDC SSO。",
        id: "access-control",
        details: [
          {
            title: "认证与企业身份",
            paragraphs: [
              "Datus 支持按部署配置接入 OIDC SSO。采用 SSO 时，身份提供方可以执行其 MFA 等认证策略。API Key 应按使用目的管理，并在不再需要时撤销。",
            ],
          },
          {
            title: "数据访问与最小权限",
            paragraphs: [
              "建议为 Datus 配置仅具备任务所需权限的数据源账号。在满足项目与插件条件时，可配置 SQL 行级过滤策略，按调用者属性限制受支持读取路径中的数据范围。",
            ],
          },
        ],
      },
      {
        title: "分享与发布控制",
        body: "分别管理授权访问与匿名链接。静态报告按发布时的内容展示。",
        id: "sharing",
        details: [
          {
            title: "公开链接",
            paragraphs: [
              "持有有效链接的人可能无需登录即可访问内容。管理者可以关闭分享或撤销链接。",
            ],
          },
          {
            title: "静态报告",
            paragraphs: [
              "报告正文是发布时固化的内容，不会根据访问者身份重新过滤。请在发布前检查其中的数据。",
            ],
          },
          {
            title: "实时查询",
            paragraphs: [
              "大盘与 Chatbot 的查询权限取决于访问者身份、项目配置与适用的数据策略。",
            ],
          },
        ],
      },
      {
        title: "审计与漏洞管理",
        body: "通过代码、依赖与镜像扫描发现风险，记录关键操作的审计事件。",
        id: "secure-development",
        details: [
          {
            title: "漏洞发现与修复",
            paragraphs: [
              "Datus 使用静态代码分析、依赖检查与容器镜像扫描发现潜在风险。扫描覆盖代码变更与定期检查，发现的问题按严重程度评估、跟踪和处理。",
              "我们已开展第三方渗透测试。2026 年 9 月的首次测试覆盖 Datus Studio 的外部未认证访问面；后续测试范围与可提供的资料，请联系 Datus 团队了解。",
            ],
          },
          {
            title: "操作审计",
            paragraphs: [
              "平台记录权限变更、连接配置、分享管理等操作的审计事件，用于追踪操作者、资源、时间与执行结果。企业部署可按配置将审计事件同步到自己的 OpenTelemetry 日志体系。",
            ],
          },
          {
            title: "报告安全问题",
            paragraphs: [
              "发现疑似漏洞、凭据泄露或异常访问时，请通过下方联系方式告知我们，提供问题影响、复现步骤与必要的环境信息。请避免在邮件中发送密码、API Key 或完整的客户数据。",
            ],
          },
        ],
      },
    ],
  },
  deployment: {
    eyebrow: "部署方式",
    title: "在适合你的边界内运行",
    lead: "Datus Studio、BYOC 与私有部署，为不同的数据环境提供选择。",
    cards: [
      {
        title: "Datus Studio",
        paragraphs: [
          "运行于 AWS 基础设施。Agent 运行环境按工作区分配沙箱，平台通过身份与资源权限控制访问。",
          "运行环境隔离与数据存储隔离是不同层面的措施，不能理解为每个客户独享一套数据库或全部基础设施。",
        ],
      },
      {
        title: "BYOC 与私有部署",
        paragraphs: [
          "可部署在客户自己的云或基础设施中。具体网络边界、存储、密钥、备份和运维配置，由部署方案与双方约定决定。",
          "使用私有部署时，仍需核对配置的模型服务与外部集成，确认其数据流向符合组织政策。",
        ],
      },
    ],
    responsibility:
      "Datus 维护产品的安全能力；客户负责选择合适的模型供应商、管理数据源账号和成员授权，并配置分享范围。私有部署还需要由部署方维护其运行环境的安全配置。",
  },
  compliance: {
    eyebrow: "持续完善",
    title: "合规进展，保持透明",
    body: "Datus 正在借助 Vanta 推进 SOC 2 合规准备，完善安全控制与相关证据。本页介绍当前安全实践，不代表已经取得 SOC 2 审计报告。",
    status: "SOC 2 合规建设进行中",
    link: {
      label: "访问 Datus 信任中心",
      href: TRUST_CENTER_URL,
    },
  },
  resources: {
    title: "安全资源",
    cards: [
      {
        title: "Datus 信任中心",
        body: "了解合规进展与可提供的安全资料。",
        action: "访问信任中心",
        href: TRUST_CENTER_URL,
      },
      {
        title: "部署与安全边界",
        body: "讨论 BYOC、私有部署与团队的安全要求。",
        action: "了解企业部署",
        href: "/products/enterprise/",
      },
      {
        title: "报告安全问题",
        body: "告知我们疑似漏洞、凭据泄露或异常访问。",
        action: "联系 Datus 团队",
        href: "mailto:contact@datus.ai?subject=Datus%20Security%20Report",
      },
    ],
  },
};

export const securityPage: Record<Locale, ISecurityPageCopy> = {
  en: EN,
  zh: ZH,
};
