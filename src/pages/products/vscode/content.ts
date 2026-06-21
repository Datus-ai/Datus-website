import { Code2, Database, Lock, MessageSquare, Sparkles, Workflow } from "lucide-react";
import type { ProductPageData } from "../../../components/ProductPageTemplate";

const MARKETPLACE_URL =
  "https://marketplace.visualstudio.com/items?itemName=datus-ai.datus-studio";
const VSCODE_DOCS_URL = "https://docs.datus.ai/0.3/vscode_extension/introduction/";

export const vscodePage: ProductPageData = {
  eyebrow: "Datus for VS Code & Cursor",
  positioning: "Your data engineering agent, inside VS Code and Cursor.",
  subhead:
    "The Datus Studio extension runs in VS Code, Cursor, and any VS Code-compatible editor. Your data stays fully local, you configure whatever models you want, and database credentials never leave your machine.",
  heroCtas: [
    { label: "Install from Marketplace", href: MARKETPLACE_URL, external: true, variant: "primary" },
    { label: "Read the docs", href: VSCODE_DOCS_URL, external: true, variant: "ghost" },
  ],
  problem: {
    heading: "Local-first, in the editor you already use.",
    body: "The extension is just a thin UI, it holds no models or credentials. Every capability is served by the Datus-agent web server running on your own machine, so nothing about your data or connections leaves your control.",
    bullets: [
      "Works in VS Code, Cursor, and other VS Code-compatible editors",
      "Your data stays fully local, nothing is sent to a cloud",
      "Bring and configure any model you want",
      "Database credentials live in your local Datus-agent, never in the extension",
    ],
  },
  capabilities: [
    { icon: Code2, title: "Inline SQL", body: "Generate, run, and chart SQL from natural language without leaving your editor." },
    { icon: Database, title: "Catalog & context explorer", body: "Browse the database catalog, context, and subagents in a side tree." },
    { icon: MessageSquare, title: "Studio chat panel", body: "Chat with the same Datus-agent backend, Plan mode confirms high-risk queries before they run." },
    { icon: Lock, title: "Credentials stay local", body: "The extension stores no secrets; your local Datus-agent serves every model and datasource." },
    { icon: Workflow, title: "Same lifecycle", body: "Plan → generate → validate → review, mirrored from the CLI workflow." },
    { icon: Sparkles, title: "Shared context", body: "Reuses the same context engine and knowledge base as the CLI and Studio." },
  ],
  quickstart: {
    heading: "Install and connect",
    steps: [
      {
        label: "Install the extension",
        body: "Install Datus Studio in VS Code or Cursor.",
      },
      {
        label: "Start the Datus web server",
        body: "Run the Datus-agent web server locally as the backend. Plain CLI mode exposes no HTTP port, so the --web flag is required.",
        code: "datus-cli --web   # serves http://localhost:8501",
      },
      {
        label: "Connect the local port",
        body: "Open the Datus Studio panel → gear icon → Settings, and point Endpoint at your local server.",
        code: "Endpoint = http://localhost:8501",
      },
    ],
    note: "Using a custom port? Run datus-cli --web --port 8080 and set the Endpoint to http://localhost:8080 to match.",
  },
  closingCta: {
    heading: "Add Datus to your editor.",
    body: "Free and open source. Runs entirely on your machine.",
    ctas: [
      { label: "Install from Marketplace", href: MARKETPLACE_URL, external: true, variant: "primary" },
      { label: "Read the docs", href: VSCODE_DOCS_URL, external: true, variant: "ghost" },
    ],
  },
};
