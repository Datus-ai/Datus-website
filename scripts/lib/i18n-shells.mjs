// Build the `/zh` HTML shells and wire hreflang into the English ones.
//
// Vite only builds the English MPA entries (one hand-written index.html per
// route). Rather than duplicating all 15 of those files in the repo — where the
// two copies would immediately drift on every asset-hash change — each Chinese
// shell is derived from its freshly built English sibling: same script/style
// tags, head rewritten from src/i18n/pageMeta.ts.
//
// Runs before the prerender pass, which then injects rendered markup into the
// `<div id="root">` of both trees.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

// `<lastmod>` for the marketing pages — the date this copy last changed, which
// is deliberately independent of the blog's own BUILD_DATE in build-blog.mjs.
// Bump it when marketing copy changes materially.
const BUILD_DATE = "2026-08-07";

const escapeAttr = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** `/products/cli/` → `products/cli/index.html` (relative to dist/). */
function shellFile(path) {
  return `${path.replace(/^\//, "")}index.html`;
}

/**
 * Replace the `content="…"` of the single `<meta>` carrying `attr="name"`.
 * Left alone when the tag is absent, so a page that never had a twitter:card
 * does not grow one.
 */
function setMetaContent(html, attr, name, value) {
  const tag = new RegExp(`<meta\\s[^>]*${attr}="${escapeRe(name)}"[^>]*>`, "i");
  return html.replace(tag, (m) => m.replace(/content="[^"]*"/i, `content="${escapeAttr(value)}"`));
}

function setTitle(html, value) {
  return html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeAttr(value)}</title>`);
}

function setCanonical(html, url) {
  return html.replace(/<link\s[^>]*rel="canonical"[^>]*>/i, `<link rel="canonical" href="${url}" />`);
}

/**
 * Emit the full hreflang cluster: every locale plus `x-default` → English,
 * absolute URLs, and each page pointing at itself as well as its sibling
 * (Google drops one-way declarations). Existing alternates are cleared first so
 * re-running the build is idempotent.
 */
function setAlternates(html, links) {
  const cleared = html.replace(/\s*<link\s[^>]*rel="alternate"\s[^>]*hreflang="[^"]*"[^>]*>/gi, "");
  const tags = Object.entries(links)
    .map(([code, url]) => `    <link rel="alternate" hreflang="${code}" href="${url}" />`)
    .join("\n");
  return cleared.replace(
    /(<link\s[^>]*rel="canonical"[^>]*>)/i,
    (m) => `${m}\n${tags}`,
  );
}

/** `og:locale` for this page + `og:locale:alternate` for the other one. */
function setOgLocale(html, ogLocale, altOgLocale) {
  let out = html.replace(/\s*<meta\s[^>]*property="og:locale:alternate"[^>]*>/gi, "");
  out = setMetaContent(out, "property", "og:locale", ogLocale);
  return out.replace(
    /(<meta\s[^>]*property="og:locale"[^>]*>)/i,
    (m) => `${m}\n    <meta property="og:locale:alternate" content="${altOgLocale}" />`,
  );
}

/**
 * Point the page's own URL inside every JSON-LD block at the Chinese copy.
 * Matched with the surrounding quotes so `https://datus.ai/` in the homepage's
 * Organization node is rewritten while `https://datus.ai/logo_dark.svg` is not.
 */
function retargetJsonLd(html, enUrl, zhUrl) {
  return html.replace(
    /<script type="application\/ld\+json">[\s\S]*?<\/script>/gi,
    (block) => block.split(`"${enUrl}"`).join(`"${zhUrl}"`),
  );
}

/** A `noindex` meta-refresh stub, mirroring the redirect stubs in build-blog.mjs. */
function redirectStub(target) {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="robots" content="noindex, follow" />
    <link rel="canonical" href="${target}" />
    <meta http-equiv="refresh" content="0; url=${target}" />
    <title>Redirecting…</title>
    <script>location.replace(${JSON.stringify(target)});</script>
  </head>
  <body><p>Redirecting to <a href="${target}">${target}</a>.</p></body>
</html>
`;
}

function write(file, content) {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content);
}

/**
 * Marketing sitemap: every mirrored path in both locales, each entry carrying
 * the full `xhtml:link` cluster. This is the one hreflang channel Google reads
 * for these URLs besides the `<head>` tags written above — the two agree by
 * construction, since both come from `alternateLinks()`.
 *
 * The blog keeps its own sitemap (scripts/build-blog.mjs) and never appears
 * here, so no blog URL can pick up a fabricated Chinese alternate.
 */
export function buildPagesSitemap(i18n, lastmod) {
  const { MIRRORED_PATHS, LOCALES, absoluteUrl, alternateLinks } = i18n;
  const entries = [];
  for (const path of MIRRORED_PATHS) {
    const links = Object.entries(alternateLinks(path))
      .map(([code, url]) => `    <xhtml:link rel="alternate" hreflang="${code}" href="${url}" />`)
      .join("\n");
    for (const locale of LOCALES) {
      entries.push(
        `  <url>\n    <loc>${absoluteUrl(path, locale)}</loc>\n    <lastmod>${lastmod}</lastmod>\n${links}\n  </url>`,
      );
    }
  }
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join("\n")}
</urlset>
`;
}

/**
 * @param {string} dist            absolute path to dist/
 * @param {object} i18n            the module loaded from src/i18n/build.ts
 * @returns {{ built: number, skipped: string[] }}
 */
export function buildLocaleShells(dist, i18n) {
  const {
    MIRRORED_PATHS, ZH_PAGE_META, missingZhMeta,
    HTML_LANG, OG_LOCALE, SITE,
    absoluteUrl, alternateLinks, localizePath,
  } = i18n;

  const missing = missingZhMeta();
  if (missing.length) {
    throw new Error(
      `[i18n] mirrored paths without Chinese metadata: ${missing.join(", ")} — add them to src/i18n/pageMeta.ts`,
    );
  }

  const skipped = [];
  let built = 0;

  for (const path of MIRRORED_PATHS) {
    const enFile = join(dist, shellFile(path));
    if (!existsSync(enFile)) {
      skipped.push(path);
      continue;
    }

    const enHtml = readFileSync(enFile, "utf8");
    const links = alternateLinks(path);
    const enUrl = absoluteUrl(path, "en");
    const zhUrl = absoluteUrl(path, "zh");

    // English shell: same document, now declaring both alternates + itself.
    write(enFile, setOgLocale(setAlternates(enHtml, links), OG_LOCALE.en, OG_LOCALE.zh));

    // Chinese shell: the English document with a translated head.
    const meta = ZH_PAGE_META[path];
    let zh = enHtml.replace(/<html\s+lang="[^"]*"/i, `<html lang="${HTML_LANG.zh}"`);
    zh = setTitle(zh, meta.title);
    zh = setMetaContent(zh, "name", "description", meta.description);
    zh = setMetaContent(zh, "property", "og:title", meta.ogTitle);
    zh = setMetaContent(zh, "property", "og:description", meta.ogDescription);
    zh = setMetaContent(zh, "name", "twitter:title", meta.twitterTitle ?? meta.ogTitle);
    zh = setMetaContent(zh, "name", "twitter:description", meta.twitterDescription ?? meta.ogDescription);
    zh = setMetaContent(zh, "property", "og:url", zhUrl);
    zh = setCanonical(zh, zhUrl);
    zh = setAlternates(zh, links);
    zh = setOgLocale(zh, OG_LOCALE.zh, OG_LOCALE.en);
    zh = retargetJsonLd(zh, enUrl, zhUrl);

    write(join(dist, shellFile(localizePath(path, "zh"))), zh);
    built += 1;

    // `/en/*` was never a public URL; the stubs exist so that if anything ever
    // links there it lands on the canonical unprefixed page instead of a 404.
    write(join(dist, shellFile(`/en${path === "/" ? "/" : path}`)), redirectStub(`${SITE}${path}`));
  }

  write(join(dist, "sitemap-pages.xml"), buildPagesSitemap(i18n, BUILD_DATE));

  return { built, skipped };
}
