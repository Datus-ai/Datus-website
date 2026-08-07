import { GitBranch, History, Lock, Network, ShieldCheck, Users } from "lucide-react";
import type { ProductPageData } from "../../../components/ProductPageTemplate";
import type { Locale } from "../../../i18n/config";

const EN: ProductPageData = {
  eyebrow: "Datus Enterprise",
  positioning: "Shared context, governance, and long-running agents for teams.",
  subhead:
    "Give your data org one evolving context engine, governed access, and reliable long-running agents, deployed in your environment. Scale data output without scaling headcount.",
  heroCtas: [
    { label: "Contact us", href: "#contact", variant: "primary" },
    { label: "Try cloud version first", href: "/products/studio/", variant: "ghost" },
  ],
  problem: {
    heading: "Reusable systems, not repeated manual effort.",
    body: "Individual productivity is the start. The enterprise value is turning every solved problem into shared, versioned context your whole team, and its agents, can reuse, safely and auditably.",
    bullets: [
      "An org-level data context engine with versioning",
      "Governance: access control, sandboxing, and approvals",
      "Long-running agents that operate reliably over time",
    ],
  },
  capabilities: [
    { icon: Network, title: "Data context engine", body: "An org-level, versioned knowledge graph of semantics, metrics, and validated SQL, shared across every agent and engineer." },
    { icon: ShieldCheck, title: "Governance & safety", body: "Role-based access control, sandboxed execution, and human approval gates for sensitive actions." },
    { icon: History, title: "Versioning & audit", body: "Every change to context and every agent action is versioned and auditable." },
    { icon: Lock, title: "SSO & deployment", body: "SSO, BYOC, and deployment inside your own cloud and network boundary." },
    { icon: Users, title: "Agent teams", body: "Domain-specific subagents that collaborate on a shared context graph across the org." },
    { icon: GitBranch, title: "Long-running agents", body: "Agents that run continuously, monitoring, maintaining, and improving data systems over time." },
  ],
  closingCta: {
    heading: "Contact us about Enterprise & BYOC",
    body: "Tell us about your stack and what you're trying to do. We'll get back within one business day.",
  },
};

const ZH: ProductPageData = {
  eyebrow: "Datus 企业版",
  positioning: "面向团队的共享上下文、治理能力与长时运行 Agent。",
  subhead:
    "为你的数据组织提供一套可演进的上下文引擎、受治理的访问控制，以及稳定可靠的长时运行 Agent，并部署在你自己的环境中。不靠堆人也能扩大数据产出。",
  heroCtas: [
    { label: "联系我们", href: "#contact", variant: "primary" },
    { label: "先试试云端版本", href: "/products/studio/", variant: "ghost" },
  ],
  problem: {
    heading: "沉淀成可复用的系统，而不是重复的人力投入。",
    body: "个人效率只是起点。企业级的价值，在于把每一个已解决的问题都变成共享、带版本的上下文，让整个团队及其 Agent 都能安全、可审计地复用。",
    bullets: [
      "组织级、带版本管理的数据上下文引擎",
      "治理能力：访问控制、沙箱执行与审批流",
      "能长期稳定运行的长时 Agent",
    ],
  },
  capabilities: [
    { icon: Network, title: "数据上下文引擎", body: "一张组织级、带版本的知识图谱，涵盖语义、指标与经过校验的 SQL，供每个 Agent 和工程师共享。" },
    { icon: ShieldCheck, title: "治理与安全", body: "基于角色的访问控制、沙箱执行，以及敏感操作的人工审批卡点。" },
    { icon: History, title: "版本与审计", body: "上下文的每一次变更、Agent 的每一个动作，都有版本记录、都可审计。" },
    { icon: Lock, title: "SSO 与部署", body: "支持 SSO、BYOC，以及在你自己的云和网络边界内部署。" },
    { icon: Users, title: "Agent 团队", body: "面向不同业务域的子代理，在一张共享的上下文图谱上跨组织协作。" },
    { icon: GitBranch, title: "长时运行 Agent", body: "持续在线的 Agent，长期监控、维护并改进你的数据系统。" },
  ],
  closingCta: {
    heading: "咨询企业版与 BYOC",
    body: "告诉我们你的技术栈和想解决的问题，我们会在一个工作日内回复。",
  },
};

export const enterprisePage: Record<Locale, ProductPageData> = { en: EN, zh: ZH };
