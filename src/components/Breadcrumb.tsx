// Single, site-wide breadcrumb component. Renders the visible breadcrumb nav and
// the matching BreadcrumbList JSON-LD from one source so the two always stay in
// parity (see datus-breadcrumb-spec.md). The homepage has no breadcrumb.
//
// Item rules:
//  - `href` omitted  -> rendered as the current/terminal page (aria-current).
//  - `noSchema: true` -> shown in the UI but skipped in the JSON-LD. Used for the
//    intermediate "Products" node, which has no canonical URL yet.

import { DEFAULT_LOCALE, SITE, localizePath, type Locale } from "../i18n/config";
import { useHref, useLocale } from "../i18n/LocaleContext";

export type Crumb = {
  label: string;
  href?: string;
  noSchema?: boolean;
};

// Callers pass English-form paths; the locale prefix is applied here so a
// /zh page's visible crumbs and its BreadcrumbList JSON-LD both point at /zh
// (spec §6.4 — structured-data URLs must carry the right locale).
const toAbsolute = (href: string, locale: Locale) =>
  href.startsWith("http") ? href : `${SITE}${localizePath(href, locale)}`;

// Safe JSON-LD <script> body: escape every `<` so a label containing
// "</script>" (or "<!--") can't break out of the script element. The output is
// still valid JSON. Mirrors ldJson() in scripts/build-blog.mjs.
const ldJson = (obj: unknown) => JSON.stringify(obj).replace(/</g, "\\u003c");

export function breadcrumbJsonLd(
  items: Crumb[],
  currentUrl: string,
  locale: Locale = DEFAULT_LOCALE,
) {
  const schemaItems = items.filter((it) => !it.noSchema);
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${toAbsolute(currentUrl, locale)}#breadcrumb`,
    itemListElement: schemaItems.map((it, i) => {
      const node: Record<string, unknown> = {
        "@type": "ListItem",
        position: i + 1,
        name: it.label,
      };
      // Every node except the terminal one carries an absolute URL.
      if (it.href) node.item = toAbsolute(it.href, locale);
      return node;
    }),
  };
}

export default function Breadcrumb({
  items,
  currentUrl,
}: {
  items: Crumb[];
  currentUrl: string;
}) {
  const locale = useLocale();
  const l = useHref();
  const jsonLd = breadcrumbJsonLd(items, currentUrl, locale);
  return (
    <nav aria-label="Breadcrumb" className="breadcrumb">
      <div className="container">
        <ol className="breadcrumb__list">
          {items.map((it, i) => {
            const isLast = i === items.length - 1;
            const linkable = it.href && !isLast;
            return (
              <li className="breadcrumb__item" key={`${it.label}-${i}`}>
                {linkable ? (
                  <a className="breadcrumb__link" href={l(it.href!)}>
                    {it.label}
                  </a>
                ) : (
                  <span
                    className="breadcrumb__current"
                    {...(isLast ? { "aria-current": "page" as const } : {})}
                  >
                    {it.label}
                  </span>
                )}
                {!isLast && (
                  <span className="breadcrumb__sep" aria-hidden="true">
                    /
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: ldJson(jsonLd) }}
      />
    </nav>
  );
}
