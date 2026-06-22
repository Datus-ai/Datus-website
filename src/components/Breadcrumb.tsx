// Single, site-wide breadcrumb component. Renders the visible breadcrumb nav and
// the matching BreadcrumbList JSON-LD from one source so the two always stay in
// parity (see datus-breadcrumb-spec.md). The homepage has no breadcrumb.
//
// Item rules:
//  - `href` omitted  -> rendered as the current/terminal page (aria-current).
//  - `noSchema: true` -> shown in the UI but skipped in the JSON-LD. Used for the
//    intermediate "Products" node, which has no canonical URL yet.

const SITE = "https://datus.ai";

export type Crumb = {
  label: string;
  href?: string;
  noSchema?: boolean;
};

const toAbsolute = (href: string) =>
  href.startsWith("http") ? href : `${SITE}${href}`;

// Safe JSON-LD <script> body: escape every `<` so a label containing
// "</script>" (or "<!--") can't break out of the script element. The output is
// still valid JSON. Mirrors ldJson() in scripts/build-blog.mjs.
const ldJson = (obj: unknown) => JSON.stringify(obj).replace(/</g, "\\u003c");

export function breadcrumbJsonLd(items: Crumb[], currentUrl: string) {
  const schemaItems = items.filter((it) => !it.noSchema);
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${toAbsolute(currentUrl)}#breadcrumb`,
    itemListElement: schemaItems.map((it, i) => {
      const node: Record<string, unknown> = {
        "@type": "ListItem",
        position: i + 1,
        name: it.label,
      };
      // Every node except the terminal one carries an absolute URL.
      if (it.href) node.item = toAbsolute(it.href);
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
  const jsonLd = breadcrumbJsonLd(items, currentUrl);
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
                  <a className="breadcrumb__link" href={it.href}>
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
