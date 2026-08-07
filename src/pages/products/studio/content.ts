import {
  BadgeCheck, Boxes, Cloud, GitBranch, GitPullRequest, MessageSquare, Share2, Sparkles, Zap,
} from "lucide-react";
import type { ProductPageData } from "../../../components/ProductPageTemplate";
import { SLACK_URL, STUDIO_URL } from "../../../config/nav";
import type { Locale } from "../../../i18n/config";

// STUDIO_URL = the overview page (hosts the demo video).
const REGISTER_URL = "https://studio.datus.ai/";
const ENTERPRISE_CONTACT_URL = "/products/enterprise/#contact";
const ENTERPRISE_URL = "/products/enterprise/";

const EN: ProductPageData = {
  eyebrow: "Datus Studio · Cloud",
  positioning: "The easiest way to start and explore Datus, hosted, free.",
  subhead:
    "No install, no config. Connect your warehouse and watch a data engineering agent build context, write validated SQL, and answer real questions in minutes.",
  heroCtas: [
    { label: "Watch demo video", href: STUDIO_URL, external: true, variant: "primary" },
    { label: "Join Slack for an invite code", href: SLACK_URL, external: true, variant: "ghost" },
    { label: "On-prem deployment", href: ENTERPRISE_CONTACT_URL, variant: "ghost" },
  ],
  problem: {
    heading: "See it work before you install anything.",
    body: "The hardest part of adopting an agent is the setup, and the doubt that it will actually help. Studio removes both: a hosted Datus workspace you can open right now, with sample data or your own.",
    bullets: [
      "Zero local setup, runs in your browser",
      "Bring your own warehouse, or explore with sample data",
      "Free during early access",
    ],
  },
  capabilities: [
    { icon: Cloud, title: "Hosted workspace", body: "A managed Datus environment, no Python, no Docker, no version pinning. Just sign in and go." },
    { icon: Zap, title: "Connect in minutes", body: "Point Studio at your warehouse and it indexes schemas and drafts a semantic model automatically." },
    { icon: MessageSquare, title: "Chat + subagents", body: "Ask questions in natural language, generate validated SQL, and spin up domain-specific subagents." },
    { icon: Sparkles, title: "Evolving context", body: "Every interaction is captured into memory, so accuracy improves the more you use it." },
    { icon: Share2, title: "Share your work", body: "Save and share sessions, metrics, and dashboards with your team." },
  ],
  semanticLayer: {
    eyebrow: "Enterprise Semantic Layer",
    heading: "When you're ready, your metrics become a governed company asset.",
    body: "Most metric platforms fail because they try to unify everything before delivering value. Datus flips it: metrics grow bottom-up from the SQL, dashboards, and reports your team already trusts, then converge into one governed semantic layer across the whole org.",
    lifecycle: ["Unverified", "Verified", "Certified", "Deprecated", "Archived"],
    cards: [
      {
        icon: GitBranch,
        title: "One source of truth",
        body: "Every workspace in your org shares a single metric tree, the one place a metric is defined, searched, and trusted.",
      },
      {
        icon: BadgeCheck,
        title: "Full-lifecycle governance",
        body: "Each metric carries a status from Unverified to Certified to Archived, with version history and global search built in.",
      },
      {
        icon: GitPullRequest,
        title: "Managed like GitHub",
        body: "Push and pull metrics, review and merge by PR, trace lineage from semantic model to dashboard, and scope access with RBAC.",
      },
      {
        icon: Boxes,
        title: "Open, never locked in",
        body: "An OSI-aligned semantic layer that isn't bound to any BI tool or warehouse, with DB / BI adaptors for on-prem deployment.",
      },
    ],
    highlight:
      "Enterprise ontology isn't hand-drawn, it grows from the metrics your business actually queries, dashboards, and validates. The metric is the cornerstone of your data ontology.",
    link: { label: "Explore Datus Enterprise", href: ENTERPRISE_URL },
  },
  closingCta: {
    heading: "Get your invite code and start free.",
    body: "Join our Slack for an invite code and free test tokens, then create your account.",
    ctas: [
      { label: "Join Slack for an invite code", href: SLACK_URL, external: true, variant: "primary" },
      { label: "Create your account", href: REGISTER_URL, external: true, variant: "ghost" },
    ],
  },
};

const ZH: ProductPageData = {
  eyebrow: "Datus Studio · 云端",
  positioning: "上手体验 Datus 最省事的方式：托管、免费。",
  subhead:
    "免安装、免配置。连上你的数仓，几分钟内就能看到一个数据工程 Agent 自己构建上下文、写出经过校验的 SQL，并回答真实的业务问题。",
  heroCtas: [
    { label: "观看演示视频", href: STUDIO_URL, external: true, variant: "primary" },
    { label: "加入 Slack 获取邀请码", href: SLACK_URL, external: true, variant: "ghost" },
    { label: "私有化部署", href: ENTERPRISE_CONTACT_URL, variant: "ghost" },
  ],
  problem: {
    heading: "先看它跑起来，再决定要不要装。",
    body: "引入 Agent 最难的两件事，一是部署配置，二是怀疑它到底有没有用。Studio 把这两点都拿掉了：一个现在就能打开的托管 Datus 工作空间，用示例数据或你自己的数据都行。",
    bullets: [
      "本地零配置，在浏览器里直接跑",
      "可以接自己的数仓，也可以先用示例数据体验",
      "早期体验期免费",
    ],
  },
  capabilities: [
    { icon: Cloud, title: "托管工作空间", body: "一套托管的 Datus 环境，不用装 Python、不用 Docker、不用锁版本。登录即可开始。" },
    { icon: Zap, title: "几分钟接入", body: "把 Studio 指向你的数仓，它会自动索引表结构并起草一份语义模型。" },
    { icon: MessageSquare, title: "对话 + 子代理", body: "用自然语言提问、生成经过校验的 SQL，并拉起面向特定业务域的子代理。" },
    { icon: Sparkles, title: "可演进的上下文", body: "每一次交互都会写入记忆，用得越多，准确率越高。" },
    { icon: Share2, title: "把成果共享出去", body: "把会话、指标和看板保存下来分享给团队。" },
  ],
  semanticLayer: {
    eyebrow: "企业级语义层",
    heading: "当你准备好时，指标就会变成受治理的公司资产。",
    body: "大多数指标平台失败，是因为它们想先统一一切再产生价值。Datus 反过来：指标从团队已经在用、也已经信任的 SQL、看板和报表里自下而上长出来，再逐步收敛成全组织统一、受治理的语义层。",
    lifecycle: ["未验证", "已验证", "已认证", "已废弃", "已归档"],
    cards: [
      {
        icon: GitBranch,
        title: "唯一口径来源",
        body: "组织内的每个工作空间共享同一棵指标树——指标只在这里定义、检索，也只在这里被信任。",
      },
      {
        icon: BadgeCheck,
        title: "全生命周期治理",
        body: "每个指标都带着从「未验证」到「已认证」再到「已归档」的状态，内置版本历史与全局检索。",
      },
      {
        icon: GitPullRequest,
        title: "像 GitHub 一样管理",
        body: "指标可以 push / pull，用 PR 评审与合并，从语义模型到看板追踪血缘，并用 RBAC 控制权限范围。",
      },
      {
        icon: Boxes,
        title: "开放，不锁定",
        body: "对齐 OSI 的语义层，不绑定任何 BI 工具或数仓，并为私有化部署提供 DB / BI 适配器。",
      },
    ],
    highlight:
      "企业本体不是画出来的，它从业务真正查询、真正上看板、真正验证过的指标里长出来。指标，就是数据本体的基石。",
    link: { label: "了解 Datus 企业版", href: ENTERPRISE_URL },
  },
  closingCta: {
    heading: "领取邀请码，免费开始。",
    body: "加入我们的 Slack 获取邀请码和免费测试额度，然后注册账号。",
    ctas: [
      { label: "加入 Slack 获取邀请码", href: SLACK_URL, external: true, variant: "primary" },
      { label: "注册账号", href: REGISTER_URL, external: true, variant: "ghost" },
    ],
  },
};

export const studioPage: Record<Locale, ProductPageData> = { en: EN, zh: ZH };
