// Locale model for the marketing site.
//
// URL contract (see datus-i18n-spec.md §2):
//   /{path}      ↔  /zh/{path}      — every non-blog marketing path
//   /blog/...    →  English only, never mirrored under /zh
//
// English is the default locale and carries no prefix, so every existing URL
// keeps its equity. Chinese lives under the `/zh` directory prefix. Slugs are
// never translated — only the prefix changes — so the two trees stay in 1:1
// parity and hreflang pairs are derivable from the path alone.

export const LOCALES = ["en", "zh"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export const SITE = "https://datus.ai";

/** `<html lang>` value per locale. */
export const HTML_LANG: Record<Locale, string> = { en: "en-US", zh: "zh-CN" };

/** hreflang code per locale. Simplified Chinese uses the ISO 15924 script tag. */
export const HREFLANG: Record<Locale, string> = { en: "en", zh: "zh-Hans" };

/** Open Graph `og:locale` per locale. */
export const OG_LOCALE: Record<Locale, string> = { en: "en_US", zh: "zh_CN" };

/** URL prefix per locale — the default locale is unprefixed (`as-needed`). */
export const LOCALE_PREFIX: Record<Locale, string> = { en: "", zh: "/zh" };

/** Human label used by the language switcher. */
export const LOCALE_LABEL: Record<Locale, string> = { en: "English", zh: "中文" };

/**
 * Every marketing path mirrored into `/zh`, in sitemap order.
 *
 * This is the single source of truth shared by the router-ish helpers below,
 * the prerenderer, the `/zh` shell generator and the sitemap. `/blog/**` is
 * deliberately absent: the blog ships English only, so it must never appear in
 * a `/zh` URL or claim a `zh-Hans` alternate. `/datafun/` is absent too — it is
 * a `noindex` Chinese-only event landing page, so a mirror would be a duplicate.
 */
export const MIRRORED_PATHS = [
  "/",
  "/products/cli/",
  "/products/vscode/",
  "/products/studio/",
  "/products/enterprise/",
  "/integrations/",
  "/databases/",
  "/models/",
  "/mcp/",
  "/chatbot/",
  "/pricing/",
  "/faq/",
  "/glossary/",
  "/osi-field-mapping/",
  "/tools/osi-playground/",
] as const;

const MIRRORED = new Set<string>(MIRRORED_PATHS);

/** True when `path` (an unprefixed, English-form path) has a `/zh` mirror. */
export function isMirrored(path: string): boolean {
  return MIRRORED.has(normalizePath(path));
}

/** Drop query/hash and force a single leading slash. */
function normalizePath(path: string): string {
  const bare = path.split("#")[0].split("?")[0];
  return bare.startsWith("/") ? bare : `/${bare}`;
}

/** Read the locale out of a pathname. `/zh`, `/zh/`, `/zh/pricing/` → "zh". */
export function localeFromPathname(pathname: string): Locale {
  return /^\/zh(\/|$)/.test(pathname) ? "zh" : "en";
}

/** Strip the locale prefix: `/zh/pricing/` → `/pricing/`, `/zh` → `/`. */
export function stripLocale(pathname: string): string {
  const stripped = pathname.replace(/^\/zh(?=\/|$)/, "");
  return stripped === "" ? "/" : stripped;
}

/**
 * Rewrite an internal href for `locale`.
 *
 * Left untouched: absolute URLs, mailto/tel, bare fragments, and any path
 * without a `/zh` mirror (the blog, most notably). Query and hash survive.
 */
export function localizePath(href: string, locale: Locale): string {
  if (locale === DEFAULT_LOCALE) return href;
  if (!href.startsWith("/")) return href;

  const hashAt = href.indexOf("#");
  const hash = hashAt >= 0 ? href.slice(hashAt) : "";
  const withoutHash = hashAt >= 0 ? href.slice(0, hashAt) : href;
  const queryAt = withoutHash.indexOf("?");
  const query = queryAt >= 0 ? withoutHash.slice(queryAt) : "";
  const path = queryAt >= 0 ? withoutHash.slice(0, queryAt) : withoutHash;

  if (!isMirrored(path)) return href;
  const prefixed = path === "/" ? `${LOCALE_PREFIX[locale]}/` : `${LOCALE_PREFIX[locale]}${path}`;
  return `${prefixed}${query}${hash}`;
}

/** Absolute, locale-correct URL for an English-form path. */
export function absoluteUrl(path: string, locale: Locale = DEFAULT_LOCALE): string {
  return `${SITE}${localizePath(path, locale)}`;
}

/**
 * The full hreflang cluster for a mirrored path: every locale plus
 * `x-default` → English. Returns `null` for English-only paths so callers
 * never emit a fabricated Chinese alternate (Google treats those as errors).
 */
export function alternateLinks(path: string): Record<string, string> | null {
  if (!isMirrored(path)) return null;
  const links: Record<string, string> = {};
  for (const locale of LOCALES) links[HREFLANG[locale]] = absoluteUrl(path, locale);
  links["x-default"] = absoluteUrl(path, DEFAULT_LOCALE);
  return links;
}

/** The other locale — the language switcher only ever has one destination. */
export function otherLocale(locale: Locale): Locale {
  return locale === "en" ? "zh" : "en";
}
