import { GITHUB_URL } from "../hooks/useGitHubStars";

export { GITHUB_URL };

/** Studio entry — primary conversion target. UTM so studio.datus.ai can attribute. */
export const STUDIO_URL =
  "https://studio.datus.ai/overview?utm_source=datus.ai&utm_medium=nav&utm_campaign=get_started";

export const DOCS_URL = "https://docs.datus.ai";
export const SLACK_URL =
  "https://join.slack.com/t/datus-ai/shared_invite/zt-3g6h4fsdg-iOl5uNoz6A4GOc4xKKWUYg";
export const CONTACT_EMAIL = "contact@datus.ai";

export interface NavLink {
  label: string;
  href: string;
  external?: boolean;
  description?: string;
}

export interface NavItem {
  label: string;
  href?: string;
  external?: boolean;
  children?: NavLink[];
}

export const PRODUCTS: NavLink[] = [
  {
    label: "Datus CLI",
    href: "/products/cli/",
    description: "Run the modern data stack from your terminal.",
  },
  {
    label: "VS Code Extension",
    href: "/products/vscode/",
    description: "Bring context and agents into your editor.",
  },
  {
    label: "Datus Studio",
    href: "/products/studio/",
    description: "The easiest way to start — free, no setup.",
  },
  {
    label: "Enterprise",
    href: "/products/enterprise/",
    description: "Shared context, governance, long-running agents.",
  },
];

export const INTEGRATIONS: NavLink[] = [
  {
    label: "All Integrations",
    href: "/integrations/",
    description: "Storage, semantic, BI, MCP, skills, tracing.",
  },
  {
    label: "Databases",
    href: "/databases/",
    description: "SQLite, Postgres, Snowflake, Spark…",
  },
  {
    label: "Models",
    href: "/models/",
    description: "OpenAI, Claude, Gemini, DeepSeek…",
  },
];

export const NAV: NavItem[] = [
  { label: "Products", children: PRODUCTS },
  { label: "Integrations", children: INTEGRATIONS },
  { label: "Pricing", href: "/pricing/" },
  { label: "Blog", href: "/blog/", external: true },
  {
    label: "Community",
    children: [
      { label: "GitHub", href: GITHUB_URL, external: true },
      { label: "Slack", href: SLACK_URL, external: true },
      { label: "Docs", href: DOCS_URL, external: true },
    ],
  },
];
