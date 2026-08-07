import { GITHUB_URL } from "../hooks/useGitHubStars";
import type { Locale } from "../i18n/config";
import { UI } from "../i18n/ui";

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

// Hrefs are written in their English (unprefixed) form throughout. The nav
// components run them through `useHref()` so a `/zh` page links inside `/zh`;
// `/blog/` has no Chinese mirror and is left alone by that helper.

export function productsNav(locale: Locale): NavLink[] {
  const t = UI[locale].products;
  return [
    { label: t.cli, href: "/products/cli/", description: t.cliDesc },
    { label: t.vscode, href: "/products/vscode/", description: t.vscodeDesc },
    { label: t.studio, href: "/products/studio/", description: t.studioDesc },
    { label: t.enterprise, href: "/products/enterprise/", description: t.enterpriseDesc },
  ];
}

export function integrationsNav(locale: Locale): NavLink[] {
  const t = UI[locale].products;
  return [
    { label: t.allIntegrations, href: "/integrations/", description: t.allIntegrationsDesc },
    { label: t.databases, href: "/databases/", description: t.databasesDesc },
    { label: t.models, href: "/models/", description: t.modelsDesc },
  ];
}

export function siteNav(locale: Locale): NavItem[] {
  const t = UI[locale].nav;
  return [
    { label: t.products, children: productsNav(locale) },
    { label: t.integrations, children: integrationsNav(locale) },
    { label: t.pricing, href: "/pricing/" },
    { label: t.blog, href: "/blog/", external: true },
    {
      label: t.community,
      children: [
        { label: t.github, href: GITHUB_URL, external: true },
        { label: t.slack, href: SLACK_URL, external: true },
        { label: t.docs, href: DOCS_URL, external: true },
      ],
    },
  ];
}
