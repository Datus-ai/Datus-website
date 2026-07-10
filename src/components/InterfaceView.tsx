import type { ReactNode } from "react";
import { ArrowRight, BookOpen, ExternalLink } from "lucide-react";
import SiteLayout from "./SiteLayout";
import Breadcrumb from "./Breadcrumb";
import FAQ, { type FaqItem } from "./FAQ";
import {
  CatalogSection,
  CodeBlock,
  FeatureCard,
  sectionBorder,
  toneAt,
} from "./catalog";
import { GITHUB_URL } from "../config/nav";

/* -------------------------------------------------------------------------- */
/*  Types — mirror the datus-design `interfaces` payload (the SEO source).     */
/* -------------------------------------------------------------------------- */

type CtaButton = {
  href: string;
  label: string;
  external?: boolean;
  icon?: "arrow-right" | "book-open" | "external-link";
};

type Section = Record<string, any> & { kind: string };

export type InterfaceData = {
  slug: string;
  name: string;
  breadcrumb: string;
  matrix_slot: "cli" | "chatbot" | "api" | "mcp" | null;
  seo: { title: string; description: string };
  hero: { title: string; description?: string; actions?: CtaButton[] };
  sections: Section[];
  faqs: Array<{ question: string; answer: string }>;
  cta: { title: string; description?: string; buttons: CtaButton[] } | null;
};

/* -------------------------------------------------------------------------- */
/*  Rich-text helpers — port marker spans, inline <code>, and [[path|text]]   */
/*  link tokens onto the site.css design system.                              */
/* -------------------------------------------------------------------------- */

/** Rewrite datus-design marker classes + inline code to site.css styling. */
function styleHtml(html: string): string {
  return html
    .replace(/class="marker-cyan"/g, 'style="color:var(--term-cyan)"')
    .replace(/class="marker-amber"/g, 'style="color:var(--term-amber)"')
    .replace(/class="marker-sage"/g, 'style="color:var(--term-green)"')
    .replace(/class="marker-pink"/g, 'style="color:var(--term-pink)"')
    .replace(/<code[^>]*>/g, '<code class="rich-code">');
}

/** Trusted HTML string (title / lede / body) with marker + code styling. */
function Marked({
  html,
  as: As = "span",
  className,
  style,
}: {
  html: string;
  as?: any;
  className?: string;
  style?: React.CSSProperties;
}) {
  return <As className={className} style={style} dangerouslySetInnerHTML={{ __html: styleHtml(html) }} />;
}

/**
 * Map a datus-design internal path to the equivalent Datus-website route.
 * Only routes that actually exist here get linked; the rest (persona / api /
 * open-source pages that don't exist yet) render as plain text — no 404s.
 */
function mapHref(path: string): string | null {
  const p = path.split("#")[0];
  if (p.startsWith("/cli")) return "/products/cli/";
  if (p.startsWith("/studio")) return "/products/studio/";
  if (p === "/mcp") return "/mcp/";
  if (p === "/chatbot") return "/chatbot/";
  return null;
}

/** Parse `[[path|anchor]]` tokens; link known routes, keep the rest as text. */
function RichText({ text }: { text: string }): ReactNode {
  const parts: ReactNode[] = [];
  const re = /\[\[([^|\]]+)\|([^\]]+)\]\]/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) {
      parts.push(<Marked key={`t${i}`} html={text.slice(last, m.index)} />);
    }
    const [, href, label] = m;
    const external = /^https?:\/\//i.test(href);
    const mapped = external ? href : mapHref(href);
    if (mapped) {
      parts.push(
        <a
          key={`l${i}`}
          href={mapped}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          style={{ color: "var(--brand-bright)", textDecoration: "underline", textUnderlineOffset: 2 }}
        >
          {label}
        </a>,
      );
    } else {
      parts.push(<Marked key={`l${i}`} html={label} />);
    }
    last = re.lastIndex;
    i += 1;
  }
  if (last < text.length) parts.push(<Marked key={`t${i}`} html={text.slice(last)} />);
  return <>{parts}</>;
}

function mapTone(tone?: string): string {
  if (!tone) return "var(--term-cyan)";
  return tone
    .replace("--hl-cyan", "--term-cyan")
    .replace("--hl-amber", "--term-amber")
    .replace("--hl-sage", "--term-green")
    .replace("--hl-pink", "--term-pink")
    .replace("--hl-orange", "--term-amber");
}

function iconFor(name?: string) {
  if (name === "book-open") return BookOpen;
  if (name === "external-link") return ExternalLink;
  return ArrowRight;
}

/* -------------------------------------------------------------------------- */
/*  Section heading + individual section renderers                            */
/* -------------------------------------------------------------------------- */

function Heading({ title, description, center = true }: { title?: string; description?: string; center?: boolean }) {
  if (!title) return null;
  return (
    <div className={center ? "section-head center" : "section-head"} style={{ marginBottom: 28 }}>
      <Marked as="h2" className="h2" html={title} style={{ fontSize: "clamp(24px,3vw,34px)" }} />
      {description && <Marked as="p" className="lead" html={description} style={{ marginTop: 10 }} />}
    </div>
  );
}

function SectionRenderer({ section, matrixSlot }: { section: Section; matrixSlot: string | null }) {
  switch (section.kind) {
    /* “Why …” — design renders a text/image carousel; here a clean card grid. */
    case "why_carousel":
      return (
        <>
          <Heading title={section.title} description={section.description} />
          <div className="grid grid-3">
            {section.items?.map((it: any, i: number) => (
              <FeatureCard key={i} tone={toneAt(i)} title={it.title} body={<Marked as="span" html={it.body} />} />
            ))}
          </div>
        </>
      );

    case "use_cases":
      return (
        <>
          <Heading title={section.title} description={section.description} />
          <div className={`grid grid-${section.columns ?? 2}`}>
            {section.items?.map((it: any, i: number) => (
              <div key={it.id ?? i} id={it.id} className="card" style={{ display: "flex", flexDirection: "column", scrollMarginTop: 96 }}>
                <div style={{ height: 6, width: 40, borderRadius: 3, background: toneAt(i), marginBottom: 16 }} />
                <Marked as="h3" className="card__title" html={it.title} />
                <p className="card__body" style={{ marginTop: 8 }}>
                  <RichText text={it.description} />
                </p>
              </div>
            ))}
          </div>
        </>
      );

    case "showcase_split":
      return (
        <div className="split-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "center" }}>
          <CodeBlock filename={section.yaml.filename} lang={section.yaml.lang ?? "yaml"} code={section.yaml.code} />
          <div>
            <Marked as="h2" className="h2" html={section.title} style={{ fontSize: "clamp(24px,3vw,32px)" }} />
            {section.description && <Marked as="p" className="lead" html={section.description} style={{ marginTop: 10 }} />}
          </div>
        </div>
      );

    case "endpoint_grid":
      return (
        <>
          <Heading title={section.title} description={section.description} />
          <div className="grid grid-3">
            {section.items?.map((it: any) => {
              const tone = mapTone(it.tone);
              return (
                <div key={it.title} className="card" style={{ display: "flex", flexDirection: "column" }}>
                  <span
                    style={{
                      alignSelf: "flex-start",
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      fontWeight: 650,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "var(--bg, #0b1230)",
                      background: tone,
                      borderRadius: 8,
                      padding: "6px 10px",
                    }}
                  >
                    {it.sym}
                  </span>
                  <h3 className="card__title" style={{ marginTop: 16, fontFamily: "var(--font-mono)", fontSize: 15 }}>{it.title}</h3>
                  <p className="card__body" style={{ marginTop: 8 }}><Marked as="span" html={it.body} /></p>
                </div>
              );
            })}
          </div>
        </>
      );

    case "feature_grid": {
      const cols = section.columns ?? 4;
      return (
        <>
          <Heading title={section.title} description={section.description} />
          <div className={`grid grid-${cols}`}>
            {section.items?.map((it: any, i: number) => (
              <FeatureCard key={i} tone={toneAt(i)} title={it.title} body={<Marked as="span" html={it.body} />} />
            ))}
          </div>
        </>
      );
    }

    case "how_to": {
      const steps: any[] = section.steps ?? [];
      const schema = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: section.schemaName,
        ...(section.schemaDescription ? { description: section.schemaDescription } : {}),
        step: steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.title, text: s.description })),
      };
      const cols = Math.min(Math.max(steps.length, 2), 4);
      return (
        <>
          <Heading title={section.title} description={section.description} />
          <ol className={`grid grid-${cols}`} style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {steps.map((s, i) => (
              <li key={i} className="card" style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 34, fontWeight: 700, lineHeight: 1, color: "var(--line-strong)" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="card__title" style={{ marginTop: 12 }}>{s.title}</h3>
                <p className="card__body" style={{ marginTop: 8 }}>{s.description}</p>
              </li>
            ))}
          </ol>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
        </>
      );
    }

    case "interface_matrix":
      return <InterfaceMatrix current={matrixSlot} title={section.title} description={section.description} />;

    default:
      return null;
  }
}

/* -------------------------------------------------------------------------- */
/*  Cross-interface matrix (CLI / Chatbot / API / MCP)                        */
/* -------------------------------------------------------------------------- */

const MATRIX_ITEMS: Array<{ key: string; label: string; href: string | null; blurb: string }> = [
  { key: "cli", label: "CLI", href: "/products/cli/", blurb: "Explore data, build context, and ship SQL from the terminal." },
  { key: "chatbot", label: "Web Chatbot", href: "/chatbot/", blurb: "Chat with subagents from a browser — zero install." },
  { key: "api", label: "API Server", href: null, blurb: "Consume data services via REST — language agnostic." },
  { key: "mcp", label: "MCP Server", href: "/mcp/", blurb: "Plug into Claude Desktop, Cursor, and any MCP client." },
];

function InterfaceMatrix({ current, title, description }: { current: string | null; title?: string; description?: string }) {
  return (
    <section id="matrix" className="section" style={{ paddingBlock: "clamp(48px,6vw,84px)", scrollMarginTop: 80 }}>
      <div className="container">
        <div className="section-head center" style={{ marginBottom: 28 }}>
          {title ? (
            <Marked as="h2" className="h2" html={title} style={{ fontSize: "clamp(24px,3vw,34px)" }} />
          ) : (
            <h2 className="h2" style={{ fontSize: "clamp(24px,3vw,34px)" }}>
              Pick the <span style={{ color: "var(--term-cyan)" }}>Interface</span> That Fits Your Team
            </h2>
          )}
          <p className="lead" style={{ marginTop: 10 }}>
            {description ?? "Four surfaces. One agent. Pick the one that fits your team."}
          </p>
        </div>
        <div className="grid grid-4">
          {MATRIX_ITEMS.map((it) => {
            const isCurrent = current === it.key;
            const inner = (
              <div className="card" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                {isCurrent && (
                  <span
                    style={{
                      alignSelf: "flex-start",
                      fontFamily: "var(--font-mono)",
                      fontSize: 10,
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      border: sectionBorder,
                      borderRadius: 6,
                      padding: "3px 8px",
                      color: "var(--ink-dim)",
                      marginBottom: 12,
                    }}
                  >
                    You are here
                  </span>
                )}
                <h3 className="card__title">{it.label}</h3>
                <p className="card__body" style={{ marginTop: 8 }}>{it.blurb}</p>
              </div>
            );
            if (isCurrent || !it.href) return <div key={it.key}>{inner}</div>;
            return (
              <a key={it.key} href={it.href} style={{ textDecoration: "none", color: "inherit" }}>
                {inner}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function InterfaceView({ data }: { data: InterfaceData }) {
  const currentUrl = `/${data.slug}/`;
  const faqItems: FaqItem[] = data.faqs.map((f) => ({ q: f.question, a: f.answer }));
  const heroActions = data.hero.actions ?? [];

  return (
    <SiteLayout>
      <Breadcrumb
        currentUrl={currentUrl}
        items={[{ label: "Home", href: "/" }, { label: data.breadcrumb }]}
      />

      {/* Hero */}
      <section className="section" style={{ paddingTop: 72, paddingBottom: 40 }}>
        <div className="container" style={{ maxWidth: 880 }}>
          <span className="eyebrow">{data.name}</span>
          <Marked
            as="h1"
            html={data.hero.title}
            style={{
              fontSize: "clamp(32px,4.6vw,52px)",
              lineHeight: 1.06,
              letterSpacing: "-0.03em",
              fontWeight: 750,
              margin: "20px 0 0",
              display: "block",
            }}
          />
          {data.hero.description && (
            <Marked as="p" className="lead" html={data.hero.description} style={{ maxWidth: 680 }} />
          )}
          {heroActions.length > 0 && (
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 28 }}>
              {heroActions.map((a, i) => {
                const Icon = iconFor(a.icon);
                return (
                  <a
                    key={a.href + a.label}
                    className={`btn btn-lg ${i === 0 ? "btn-primary" : "btn-ghost"}`}
                    href={a.href}
                    target={a.external ? "_blank" : undefined}
                    rel={a.external ? "noopener noreferrer" : undefined}
                  >
                    {a.label} <Icon size={17} />
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Body sections — alternate panel backgrounds for rhythm. */}
      {data.sections.map((section, i) =>
        section.kind === "interface_matrix" ? (
          <SectionRenderer key={i} section={section} matrixSlot={data.matrix_slot} />
        ) : (
          <CatalogSection key={i} alt={i % 2 === 0}>
            <SectionRenderer section={section} matrixSlot={data.matrix_slot} />
          </CatalogSection>
        ),
      )}

      {/* FAQ */}
      {faqItems.length > 0 && <FAQ items={faqItems} currentUrl={currentUrl} />}

      {/* Closing CTA */}
      {data.cta && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <div
              className="card"
              style={{
                textAlign: "center",
                padding: "48px 32px",
                background: "radial-gradient(700px 300px at 50% -20%, var(--brand-soft), transparent 70%), var(--panel)",
                borderColor: "var(--line-strong)",
              }}
            >
              <Marked as="h2" className="h2" html={data.cta.title} style={{ fontSize: "clamp(24px,3vw,34px)" }} />
              {data.cta.description && (
                <Marked as="p" className="lead" html={data.cta.description} style={{ marginInline: "auto", maxWidth: 600 }} />
              )}
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginTop: 26 }}>
                {data.cta.buttons.map((b) => {
                  const Icon = iconFor(b.icon);
                  return (
                    <a
                      key={b.href + b.label}
                      className="btn btn-lg btn-primary"
                      href={b.href}
                      target={b.external ? "_blank" : undefined}
                      rel={b.external ? "noopener noreferrer" : undefined}
                    >
                      {b.label} <Icon size={17} />
                    </a>
                  );
                })}
                <a className="btn btn-lg btn-ghost" href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
                  Star on GitHub
                </a>
              </div>
            </div>
          </div>
        </section>
      )}
    </SiteLayout>
  );
}
