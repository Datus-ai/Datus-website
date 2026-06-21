import {
  BadgeCheck, Boxes, Cloud, GitBranch, GitPullRequest, MessageSquare, Share2, Sparkles, Zap,
} from "lucide-react";
import type { ProductPageData } from "../../../components/ProductPageTemplate";
import { SLACK_URL, STUDIO_URL } from "../../../config/nav";

// STUDIO_URL = the overview page (hosts the demo video).
const REGISTER_URL = "https://studio.datus.ai/";
const ENTERPRISE_CONTACT_URL = "/products/enterprise/#contact";
const ENTERPRISE_URL = "/products/enterprise/";

export const studioPage: ProductPageData = {
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
