import type { Locale } from "../i18n/config";

/** Identify the website CTA without inventing a new acquisition source. */
export function studioCtaUrl(href: string, content: string, locale: Locale): string {
  const url = new URL(href);
  url.searchParams.set("utm_content", locale === "zh" ? `zh_${content}` : content);
  return url.toString();
}

/** English-form route, shared by prerendering and hydration. */
export function studioNavTag(path: string, placement: "header" | "mobile_menu"): string {
  const page = path.replace(/^\/+|\/+$/g, "").replace(/[/-]+/g, "_") || "home";
  return `${page}_${placement}`;
}
