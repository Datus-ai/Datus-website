import type { FaqItem } from "../../components/FAQ";
import { TRUST_CENTER_URL } from "../../config/nav";
import type { Locale } from "../../i18n/config";

interface ISecurityBlock {
  title: string;
  paragraphs: string[];
}

export interface ISecuritySection {
  id: string;
  title: string;
  paragraphs?: string[];
  flow?: { label: string; title: string; body: string }[];
  blocks?: ISecurityBlock[];
  items?: { title: string; body: string }[];
  note?: { title: string; body: string };
  cards?: ISecurityBlock[];
  status?: string;
  link?: { label: string; href: string };
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
  toc: string;
  contactLabel: string;
  backToTop: string;
  flowLabel: string;
  overview: { title: string; body: string }[];
  sections: ISecuritySection[];
  faq: { id: string; title: string; items: FaqItem[] };
  contact: { title: string; body: string };
}

// Update the date and both locales whenever a public security statement changes.
export const SECURITY_UPDATED_AT = "2026-10-15";

const EN: ISecurityPageCopy = {
  eyebrow: "Datus Security",
  title: "Security & Privacy",
  lead: "How Datus protects connection credentials, manages access, and processes tasks across the model providers and data environments you choose.",
  updated: "Updated",
  date: "October 15, 2026",
  scope: "Applies to Datus Studio · Private deployment differences below",
  trustCenter: "Visit Trust Center",
  contactAction: "Contact the Datus Team",
  toc: "On This Page",
  contactLabel: "Security questions and resources",
  backToTop: "Back to Top",
  flowLabel: "Model calls and data processing",
  overview: [
    {
      title: "Your Choice of Models",
      body: "Configure your model and provider to fit your needs and data policies.",
    },
    {
      title: "Encrypted Credentials",
      body: "Sensitive data source credentials and model API keys are encrypted for storage.",
    },
    {
      title: "Deletable Conversation History",
      body: "Datus Studio saves conversation messages during tasks. You can delete them yourself.",
    },
  ],
  sections: [
    {
      id: "ai-data",
      title: "AI & Data Use",
      paragraphs: [
        "You enter your LLM connection settings and choose your model provider. Configure the model service that fits your business needs, data policies, and deployment environment.",
      ],
      flow: [
        {
          label: "01 / Configure",
          title: "Choose Your Model and Provider",
          body: "Enter the model, service URL, and connection credentials for the model service you want to use.",
        },
        {
          label: "02 / Execute",
          title: "Datus Assembles Task Context",
          body: "Datus sends prompts and relevant task context to the model service you configure.",
        },
        {
          label: "03 / History",
          title: "Manage Conversation Messages",
          body: "Datus Studio saves intermediate conversation messages, which you can delete yourself.",
        },
      ],
      blocks: [
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
      note: {
        title: "You manage your conversation history.",
        body: "You can delete conversation messages saved in Datus. Deleting them in Datus does not delete copies a model provider may retain; those are governed by that provider's policies and agreements.",
      },
    },
    {
      id: "data-protection",
      title: "Data & Credential Protection",
      blocks: [
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
        {
          title: "Managing Different Data Types",
          paragraphs: [
            "Conversation messages, project files, published reports, and audit records serve different purposes and are managed separately. You can delete saved conversation messages. Contact the Datus team about deletion scope or requests involving other data.",
          ],
        },
      ],
    },
    {
      id: "access-control",
      title: "Identity & Access Control",
      paragraphs: [
        "Datus manages access through resources and roles. Administrators can grant users or groups access to workspaces, projects, and related resources, and narrow permissions through custom roles.",
      ],
      blocks: [
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
      note: {
        title: "Configure permissions in layers.",
        body: "SQL Policy coverage depends on the execution path and project configuration. Protect highly sensitive data with database-native access controls as well. SQL Policy currently does not provide column-level permissions or data masking.",
      },
    },
    {
      id: "sharing",
      title: "Sharing & Publication Security",
      paragraphs: [
        "Explicitly configure the audience when publishing or sharing reports, dashboards, and Chatbots. Authorized-user access and anonymous public links have different boundaries. Confirm the intended recipients before sharing.",
      ],
      items: [
        {
          title: "Public links",
          body: "Anyone holding a valid link may be able to access its content without signing in. Managers can turn off sharing or revoke the link.",
        },
        {
          title: "Static reports",
          body: "Report content is fixed when published and is not filtered again for each viewer. Review the data in a report before publishing it.",
        },
        {
          title: "Live queries",
          body: "Dashboard and Chatbot query permissions depend on the viewer's identity, project configuration, and applicable data policies.",
        },
      ],
    },
    {
      id: "infrastructure",
      title: "Infrastructure & Deployment",
      paragraphs: [
        "Datus offers Datus Studio, BYOC, and private deployment options. These differ in their runtime environments, operational responsibilities, and data-processing boundaries.",
      ],
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
      blocks: [
        {
          title: "Shared Security Responsibilities",
          paragraphs: [
            "Datus maintains the product's security capabilities. Customers choose their model providers, manage data source accounts and member permissions, and configure sharing. Private deployment operators also maintain the security configuration of their runtime environment.",
          ],
        },
      ],
    },
    {
      id: "secure-development",
      title: "Secure Development & Operations",
      blocks: [
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
      link: {
        label: "Report a Security Issue",
        href: "mailto:contact@datus.ai?subject=Datus%20Security%20Report",
      },
    },
    {
      id: "compliance",
      title: "Compliance & Security Resources",
      status: "SOC 2 readiness in progress",
      paragraphs: [
        "Datus is working toward a SOC 2 examination with Vanta, strengthening security controls and supporting evidence. This page describes current security practices and does not represent an issued SOC 2 report.",
        "Visit our Trust Center or contact the Datus team for current progress, deployment scope, or help with a vendor security assessment.",
      ],
      link: { label: "Visit the Datus Trust Center", href: TRUST_CENTER_URL },
    },
  ],
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
};

const ZH: ISecurityPageCopy = {
  eyebrow: "Datus 安全",
  title: "安全与隐私",
  lead: "了解 Datus 如何保护连接凭据、管理访问权限，以及在你选择的模型供应商与数据环境之间处理任务。",
  updated: "更新于",
  date: "2026 年 10 月 15 日",
  scope: "适用于 Datus Studio · 私有部署差异见下文",
  trustCenter: "访问信任中心",
  contactAction: "联系 Datus 团队",
  toc: "本页内容",
  contactLabel: "安全问题与资料咨询",
  backToTop: "返回顶部",
  flowLabel: "模型调用与数据处理流程",
  overview: [
    {
      title: "模型由你选择",
      body: "自行配置模型与供应商，按你的需求和数据政策选择服务。",
    },
    {
      title: "连接凭据加密保存",
      body: "对数据源敏感凭据与模型 API Key 进行存储加密。",
    },
    {
      title: "会话记录可自行删除",
      body: "Datus Studio 保存任务中的会话消息记录，你可以自行删除。",
    },
  ],
  sections: [
    {
      id: "ai-data",
      title: "AI 与数据使用",
      flow: [
        {
          label: "01 / 配置",
          title: "你选择模型与供应商",
          body: "输入模型、服务地址与连接凭据，决定使用哪项模型服务。",
        },
        {
          label: "02 / 执行",
          title: "Datus 组织任务上下文",
          body: "根据任务，将提示词与相关上下文交给你配置的模型处理。",
        },
        {
          label: "03 / 记录",
          title: "你管理会话消息",
          body: "Datus Studio 保存中间会话消息记录，支持用户自行删除。",
        },
      ],
      blocks: [
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
      note: {
        title: "会话记录由你管理。",
        body: "你可以自行删除 Datus 中保存的会话消息记录。Datus 中的删除操作不等同于删除模型供应商可能保留的副本；后者由供应商的政策与协议决定。",
      },
      paragraphs: [
        "LLM 模型配置由你自行输入，模型供应商也由你选择。你可以根据业务需求、数据政策和部署环境，配置相应的模型服务。",
      ],
    },
    {
      id: "data-protection",
      title: "数据与凭据保护",
      blocks: [
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
        {
          title: "按数据类别管理",
          paragraphs: [
            "会话消息、项目文件、已发布报告和审计记录承担不同用途，需要分别管理。你可以删除保存的会话消息；涉及其他数据的删除范围或处理请求，请联系 Datus 团队。",
          ],
        },
      ],
    },
    {
      id: "access-control",
      title: "身份与访问控制",
      blocks: [
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
      note: {
        title: "分层配置数据权限。",
        body: "SQL Policy 的覆盖范围取决于执行路径与项目配置。高敏感数据应同时使用数据库自身的权限控制；当前 SQL Policy 不提供列级权限与脱敏。",
      },
      paragraphs: [
        "Datus 按资源与角色管理访问权限。管理员可以为用户或用户组授予工作区、项目及相关资源的权限，并通过自定义角色收窄授权范围。",
      ],
    },
    {
      id: "sharing",
      title: "分享与发布安全",
      items: [
        {
          title: "公开链接",
          body: "持有有效链接的人可能无需登录即可访问内容。管理者可以关闭分享或撤销链接。",
        },
        {
          title: "静态报告",
          body: "报告正文是发布时固化的内容，不会根据访问者身份重新过滤。请在发布前检查其中的数据。",
        },
        {
          title: "实时查询",
          body: "大盘与 Chatbot 的查询权限取决于访问者身份、项目配置与适用的数据策略。",
        },
      ],
      paragraphs: [
        "报告、大盘与 Chatbot 的发布和分享，需要明确配置访问范围。已授权用户访问与匿名公开链接具有不同的边界，请在分享前确认接收对象。",
      ],
    },
    {
      id: "infrastructure",
      title: "基础设施与部署",
      blocks: [
        {
          title: "共同承担安全责任",
          paragraphs: [
            "Datus 维护产品的安全能力；客户负责选择合适的模型供应商、管理数据源账号和成员授权，并配置分享范围。私有部署还需要由部署方维护其运行环境的安全配置。",
          ],
        },
      ],
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
      paragraphs: [
        "Datus 提供 Datus Studio、BYOC 和私有部署方案。不同方案在运行环境、运维职责和数据处理边界上有所区别。",
      ],
    },
    {
      id: "secure-development",
      title: "安全开发与运营",
      blocks: [
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
      link: {
        label: "向 Datus 报告安全问题",
        href: "mailto:contact@datus.ai?subject=Datus%20Security%20Report",
      },
    },
    {
      id: "compliance",
      title: "合规与安全资料",
      status: "SOC 2 合规建设进行中",
      link: {
        label: "访问 Datus 信任中心",
        href: TRUST_CENTER_URL,
      },
      paragraphs: [
        "Datus 正在借助 Vanta 推进 SOC 2 合规准备，完善安全控制及相关证据。本页介绍当前安全实践，不代表已经取得 SOC 2 审计报告。",
        "如需了解最新进展、部署适用范围，或开展供应商安全评估，可访问信任中心或联系 Datus 团队。",
      ],
    },
  ],
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
};

export const securityPage: Record<Locale, ISecurityPageCopy> = {
  en: EN,
  zh: ZH,
};
