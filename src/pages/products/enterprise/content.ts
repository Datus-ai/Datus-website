import { GitBranch, History, Lock, Network, ShieldCheck, Users } from "lucide-react";
import type { ProductPageData } from "../../../components/ProductPageTemplate";

export const enterprisePage: ProductPageData = {
  eyebrow: "Datus Enterprise",
  positioning: "Shared context, governance, and long-running agents for teams.",
  subhead:
    "Give your data org one evolving context engine, governed access, and reliable long-running agents — deployed in your environment. Scale data output without scaling headcount.",
  problem: {
    heading: "Reusable systems, not repeated manual effort.",
    body: "Individual productivity is the start. The enterprise value is turning every solved problem into shared, versioned context your whole team — and its agents — can reuse, safely and auditably.",
    bullets: [
      "An org-level data context engine with versioning",
      "Governance: access control, sandboxing, and approvals",
      "Long-running agents that operate reliably over time",
    ],
  },
  capabilities: [
    { icon: Network, title: "Data context engine", body: "An org-level, versioned knowledge graph of semantics, metrics, and validated SQL — shared across every agent and engineer." },
    { icon: ShieldCheck, title: "Governance & safety", body: "Role-based access control, sandboxed execution, and human approval gates for sensitive actions." },
    { icon: History, title: "Versioning & audit", body: "Every change to context and every agent action is versioned and auditable." },
    { icon: Lock, title: "SSO & deployment", body: "SSO, BYOC, and deployment inside your own cloud and network boundary." },
    { icon: Users, title: "Agent teams", body: "Domain-specific subagents that collaborate on a shared context graph across the org." },
    { icon: GitBranch, title: "Long-running agents", body: "Agents that run continuously — monitoring, maintaining, and improving data systems over time." },
  ],
  closingCta: {
    heading: "Talk to us about Enterprise & BYOC",
    body: "Tell us about your stack and what you're trying to do. We'll get back within one business day.",
  },
};
