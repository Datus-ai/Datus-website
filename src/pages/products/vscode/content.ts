import { Code2, FileCode, GitPullRequest, MessageSquare, Sparkles, Workflow } from "lucide-react";
import type { ProductPageData } from "../../../components/ProductPageTemplate";
import { GITHUB_URL } from "../../../config/nav";

const MARKETPLACE_URL =
  "https://marketplace.visualstudio.com/items?itemName=datus-ai.datus-studio";

export const vscodePage: ProductPageData = {
  eyebrow: "Datus for VS Code",
  positioning: "Bring Datus context and agents into your IDE workflow.",
  subhead:
    "Stay in your editor. Generate validated SQL, explore schemas, and tap the same evolving context engine — right next to the code you're already writing.",
  heroCtas: [
    { label: "Install from Marketplace", href: MARKETPLACE_URL, external: true, variant: "primary" },
    { label: "View on GitHub", href: GITHUB_URL, external: true, variant: "ghost" },
  ],
  problem: {
    heading: "Context where you already work.",
    body: "Switching between a chat window, a SQL client, and your editor breaks flow. The Datus extension puts the agent and its context inside VS Code, so generation and review happen alongside your files.",
    bullets: [
      "Inline SQL generation and validation",
      "Schema and semantic-model awareness in-editor",
      "Shares the same context engine as the CLI and Studio",
    ],
  },
  capabilities: [
    { icon: Code2, title: "Inline generation", body: "Generate and edit SQL from natural language without leaving your file." },
    { icon: FileCode, title: "Schema awareness", body: "Autocomplete and validation grounded in your indexed schemas and metrics." },
    { icon: MessageSquare, title: "Agent chat panel", body: "Ask, explore, and iterate in a side panel that understands your project context." },
    { icon: GitPullRequest, title: "Review-friendly", body: "Generated SQL is validated and explained, so it's ready for code review." },
    { icon: Workflow, title: "Same lifecycle", body: "Plan → generate → validate → review, mirrored from the CLI workflow." },
    { icon: Sparkles, title: "Evolving context", body: "Every accepted query feeds back into shared, portable memory." },
  ],
  quickstart: {
    heading: "Install and connect",
    steps: [
      { label: "Install", body: "Search “Datus” in the VS Code Marketplace and install the extension." },
      { label: "Connect", body: "Sign in or point it at your local Datus CLI configuration." },
      { label: "Generate", body: "Open the Datus panel and start asking — validated SQL appears inline." },
    ],
  },
  closingCta: {
    heading: "Add Datus to your editor.",
    body: "Free and open source.",
    ctas: [
      { label: "Install from Marketplace", href: MARKETPLACE_URL, external: true, variant: "primary" },
    ],
  },
};
