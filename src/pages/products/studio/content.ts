import { Cloud, MessageSquare, Share2, Sparkles, Zap } from "lucide-react";
import type { ProductPageData } from "../../../components/ProductPageTemplate";
import { GITHUB_URL, STUDIO_URL } from "../../../config/nav";

export const studioPage: ProductPageData = {
  eyebrow: "Datus Studio · Cloud",
  positioning: "The easiest way to start and explore Datus — hosted, free.",
  subhead:
    "No install, no config. Connect your warehouse and watch a data engineering agent build context, write validated SQL, and answer real questions in minutes.",
  heroCtas: [
    { label: "Try Studio free", href: STUDIO_URL, variant: "primary" },
    { label: "Star on GitHub", href: GITHUB_URL, external: true, variant: "ghost" },
  ],
  problem: {
    heading: "See it work before you install anything.",
    body: "The hardest part of adopting an agent is the setup — and the doubt that it will actually help. Studio removes both: a hosted Datus workspace you can open right now, with sample data or your own.",
    bullets: [
      "Zero local setup — runs in your browser",
      "Bring your own warehouse, or explore with sample data",
      "Free during early access",
    ],
  },
  capabilities: [
    { icon: Cloud, title: "Hosted workspace", body: "A managed Datus environment — no Python, no Docker, no version pinning. Just sign in and go." },
    { icon: Zap, title: "Connect in minutes", body: "Point Studio at your warehouse and it indexes schemas and drafts a semantic model automatically." },
    { icon: MessageSquare, title: "Chat + subagents", body: "Ask questions in natural language, generate validated SQL, and spin up domain-specific subagents." },
    { icon: Sparkles, title: "Evolving context", body: "Every interaction is captured into memory, so accuracy improves the more you use it." },
    { icon: Share2, title: "Share your work", body: "Save and share sessions, metrics, and dashboards with your team." },
  ],
  quickstart: {
    heading: "Three steps to your first answer",
    steps: [
      { label: "Sign up", body: "Create a free Studio account — no credit card." },
      { label: "Connect", body: "Add a warehouse connection, or start from the sample dataset." },
      { label: "Ask", body: "Type a question. Datus plans, generates SQL, validates, and explains." },
    ],
    note: "Studio runs the same context engine as the open-source CLI — your context is portable.",
  },
  closingCta: {
    heading: "Start exploring in your browser.",
    body: "Free during early access. No install required.",
    ctas: [{ label: "Try Studio free", href: STUDIO_URL, variant: "primary" }],
  },
};
