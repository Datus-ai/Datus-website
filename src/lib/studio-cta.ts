import type { Locale } from "../i18n/config";

import { studioUrl } from "./studio-url.mjs";

/** Identify the website CTA; hydration replaces the fallback with arrival evidence. */
export function studioCtaUrl(href: string, content: string, locale: Locale): string {
  const url = new URL(href);
  url.searchParams.set("utm_content", locale === "zh" ? `zh_${content}` : content);
  return studioUrl(url.href);
}

/** English-form route, shared by prerendering and hydration. */
export function studioNavTag(path: string, placement: "header" | "mobile_menu"): string {
  const page = path.replace(/^\/+|\/+$/g, "").replace(/[/-]+/g, "_") || "home";
  return `${page}_${placement}`;
}
