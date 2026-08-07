import { GITHUB_URL, STUDIO_URL } from "../../config/nav";
import type { Locale } from "../../i18n/config";

export interface Tier {
  name: string;
  price: string;
  tagline: string;
  features: string[];
  cta: { label: string; href?: string; external?: boolean; dialog?: boolean };
  featured?: boolean;
}

export interface PricingCopy {
  eyebrow: string;
  heading: string;
  lead: string;
  tiers: Tier[];
  note: string;
  faqLead: string;
  /** Source label sent with the Enterprise inquiry — kept in English for the CRM. */
  inquirySource: string;
}

const EN: PricingCopy = {
  eyebrow: "Pricing",
  heading: "Free for individuals. Custom for enterprises.",
  lead: "Personal productivity is fully open and free. We make money from the enterprise edition — shared context, governance, and support.",
  tiers: [
    {
      name: "Open Source",
      price: "Free",
      tagline: "Apache-2.0 · self-hosted",
      features: [
        "Full Datus CLI + VS Code extension",
        "Context engine & subagents",
        "Bring your own warehouse & model",
        "Community support",
      ],
      cta: { label: "View on GitHub", href: GITHUB_URL, external: true },
    },
    {
      name: "Cloud Personal",
      price: "Free",
      tagline: "Studio · Early access",
      features: [
        "Hosted workspace — no setup",
        "Connect your warehouse in minutes",
        "Chat, subagents & evolving context",
        "Free during early access",
      ],
      cta: { label: "Sign up free", href: STUDIO_URL },
      featured: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      tagline: "For data teams",
      features: [
        "SSO & access control",
        "Org-level context store & versioning",
        "Governance, sandboxing & approvals",
        "Long-running agents",
        "Deployment & support services",
      ],
      cta: { label: "Contact us", dialog: true },
    },
  ],
  note: "Open source is real and stays free. Enterprise pricing is tailored to your deployment.",
  faqLead: "Free tiers, Enterprise quotes, the open-source license, and LLM billing.",
  inquirySource: "datus.ai pricing — Contact us",
};

const ZH: PricingCopy = {
  eyebrow: "定价",
  heading: "对个人免费，对企业按需定制。",
  lead: "个人效率相关的部分完全开源、完全免费。我们的收入来自企业版——共享上下文、治理能力与技术支持。",
  tiers: [
    {
      name: "开源版",
      price: "免费",
      tagline: "Apache-2.0 · 自行部署",
      features: [
        "完整的 Datus CLI + VS Code 插件",
        "上下文引擎与子代理",
        "自带数仓与模型",
        "社区支持",
      ],
      cta: { label: "在 GitHub 上查看", href: GITHUB_URL, external: true },
    },
    {
      name: "云端个人版",
      price: "免费",
      tagline: "Studio · 早期体验",
      features: [
        "托管工作空间——免部署",
        "几分钟接上你的数仓",
        "对话、子代理与可演进的上下文",
        "早期体验期免费",
      ],
      cta: { label: "免费注册", href: STUDIO_URL },
      featured: true,
    },
    {
      name: "企业版",
      price: "按需定制",
      tagline: "面向数据团队",
      features: [
        "SSO 与访问控制",
        "组织级上下文存储与版本管理",
        "治理、沙箱与审批流",
        "长时运行 Agent",
        "部署与支持服务",
      ],
      cta: { label: "联系我们", dialog: true },
    },
  ],
  note: "开源是真开源，并且会一直免费。企业版价格会按你的部署方案定制。",
  faqLead: "免费档位、企业版报价、开源许可，以及大模型计费。",
  inquirySource: "datus.ai pricing — Contact us",
};

export const pricingPage: Record<Locale, PricingCopy> = { en: EN, zh: ZH };
