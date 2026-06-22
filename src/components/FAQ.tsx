// Single, site-wide FAQ component. Renders an accordion of questions and the
// matching FAQPage JSON-LD from one source so the visible DOM and the structured
// data always stay in parity (see datus-faq-spec.md §二.2). Content is never
// hardcoded here — each page injects its own per-page Q&A list.
//
// Conventions enforced by the architecture, not this component:
//  - 3–8 questions per page, answers 40–80 words, answer-first.
//  - A question lives on exactly one canonical URL (no cross-page duplicates).
//
// Accessibility / SEO: questions are <h3> inside a native <details>/<summary>
// accordion, so answers are present in the first-paint DOM (not AJAX) and
// remain indexable while collapsed.

const SITE = "https://datus.ai";

export type FaqItem = {
  q: string;
  a: string;
};

const toAbsolute = (href: string) =>
  href.startsWith("http") ? href : `${SITE}${href}`;

// Safe JSON-LD <script> body: escape every `<` so an answer containing
// "</script>" can't break out of the script element. Mirrors ldJson() in
// src/components/Breadcrumb.tsx and scripts/build-blog.mjs.
const ldJson = (obj: unknown) => JSON.stringify(obj).replace(/</g, "\\u003c");

export function faqPageJsonLd(items: FaqItem[], currentUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${toAbsolute(currentUrl)}#faq`,
    // mainEntity order matches the on-page display order (spec §三).
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: {
        "@type": "Answer",
        // The visible answer renders inside a single <p>; mirror that here so
        // the schema text is byte-identical to the DOM (parity).
        text: `<p>${it.a}</p>`,
      },
    })),
  };
}

export default function FAQ({
  items,
  currentUrl,
  heading = "Frequently asked questions",
  eyebrow = "FAQ",
  lead,
  maxWidth = 820,
}: {
  items: FaqItem[];
  currentUrl: string;
  heading?: string;
  eyebrow?: string;
  lead?: string;
  maxWidth?: number;
}) {
  if (!items.length) return null;
  const jsonLd = faqPageJsonLd(items, currentUrl);
  return (
    <section className="section faq" aria-labelledby="faq-heading">
      <div className="container" style={{ maxWidth }}>
        <div className="section-head" style={{ marginBottom: 28 }}>
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          <h2 id="faq-heading" className="h2" style={{ fontSize: "clamp(24px,3vw,34px)" }}>
            {heading}
          </h2>
          {lead && <p className="lead" style={{ marginTop: 10 }}>{lead}</p>}
        </div>
        <div className="faq__list">
          {items.map((item, i) => (
            // First item open by default — signals the section has content and
            // lowers the click cost; the rest stay collapsed for scannability.
            <details className="faq__item" key={item.q} open={i === 0}>
              <summary className="faq__summary">
                <h3 className="faq__q">{item.q}</h3>
                <span className="faq__icon" aria-hidden="true" />
              </summary>
              <div className="faq__a">
                <p>{item.a}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: ldJson(jsonLd) }}
      />
    </section>
  );
}
