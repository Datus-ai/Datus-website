import { ArrowRight, CheckCircle2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Fragment, type ReactNode } from "react";
import SiteLayout from "./SiteLayout";

export interface ProductCTA {
  label: string;
  href?: string;
  external?: boolean;
  variant?: "primary" | "ghost";
}

export interface Capability {
  icon?: LucideIcon;
  title: string;
  body: string;
}

export interface QuickstartStep {
  label?: string;
  code?: string;
  body?: string;
}

export interface ProductPageData {
  eyebrow?: string;
  positioning: string;
  subhead?: string;
  heroCtas?: ProductCTA[];
  problem: { heading: string; body: string; bullets?: string[] };
  capabilities: Capability[];
  quickstart?: { heading: string; steps: QuickstartStep[]; note?: string };
  /** Optional enterprise semantic-layer value section, rendered before the closing CTA. */
  semanticLayer?: {
    eyebrow: string;
    heading: string;
    body: string;
    lifecycle?: string[];
    cards: Capability[];
    highlight?: string;
    link?: ProductCTA;
  };
  closingCta: { heading: string; body?: string; ctas?: ProductCTA[] };
  /** Enterprise injects its inline form here instead of CTA buttons. */
  formSlot?: ReactNode;
}

// Lifecycle stage colors, in order: draft → trusted → certified → sunset → archived.
const LIFECYCLE_TONES = [
  "var(--ink-faint)", "var(--term-green)", "var(--brand-bright)", "var(--term-amber)", "var(--ink-muted)",
];

function CtaButton({ cta }: { cta: ProductCTA }) {
  const cls = `btn btn-lg ${cta.variant === "ghost" ? "btn-ghost" : "btn-primary"}`;
  const ext = cta.external ? { target: "_blank", rel: "noopener noreferrer" } : {};
  return (
    <a className={cls} href={cta.href} {...ext}>
      {cta.label}
      {cta.variant !== "ghost" && <ArrowRight size={17} />}
    </a>
  );
}

export default function ProductPageTemplate({ data }: { data: ProductPageData }) {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="section" style={{ paddingTop: 72, paddingBottom: 56 }}>
        <div className="container" style={{ maxWidth: 880 }}>
          {data.eyebrow && <span className="eyebrow">{data.eyebrow}</span>}
          <h1
            style={{
              fontSize: "clamp(32px, 4.6vw, 54px)",
              lineHeight: 1.06,
              letterSpacing: "-0.03em",
              fontWeight: 750,
              margin: "20px 0 0",
            }}
          >
            {data.positioning}
          </h1>
          {data.subhead && <p className="lead" style={{ maxWidth: 640 }}>{data.subhead}</p>}
          {data.heroCtas && data.heroCtas.length > 0 && (
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 28 }}>
              {data.heroCtas.map((c) => <CtaButton key={c.label} cta={c} />)}
            </div>
          )}
        </div>
      </section>

      {/* Problem */}
      <section className="section" style={{ background: "rgba(11,18,48,0.4)", borderBlock: "1px solid var(--line)", paddingBlock: "clamp(48px,6vw,80px)" }}>
        <div className="container" style={{ maxWidth: 880 }}>
          <h2 className="h2" style={{ fontSize: "clamp(24px,3vw,34px)" }}>{data.problem.heading}</h2>
          <p className="lead">{data.problem.body}</p>
          {data.problem.bullets && (
            <ul style={{ listStyle: "none", margin: "20px 0 0", padding: 0, display: "grid", gap: 12 }}>
              {data.problem.bullets.map((b) => (
                <li key={b} style={{ display: "flex", gap: 10, alignItems: "flex-start", color: "var(--ink-dim)", fontSize: 15 }}>
                  <CheckCircle2 size={17} style={{ color: "var(--brand-bright)", flexShrink: 0, marginTop: 2 }} /> {b}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Capabilities */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Capabilities</span>
            <h2 className="h2">What you get</h2>
          </div>
          <div className="grid grid-3">
            {data.capabilities.map((c) => (
              <div className="card" key={c.title}>
                {c.icon && <span className="card__icon"><c.icon size={20} /></span>}
                <h3 className="card__title">{c.title}</h3>
                <p className="card__body">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quickstart */}
      {data.quickstart && (
        <section className="section" style={{ background: "rgba(11,18,48,0.4)", borderBlock: "1px solid var(--line)" }}>
          <div className="container" style={{ maxWidth: 880 }}>
            <div className="section-head">
              <span className="eyebrow">Quickstart</span>
              <h2 className="h2">{data.quickstart.heading}</h2>
            </div>
            <div style={{ display: "grid", gap: 16 }}>
              {data.quickstart.steps.map((s, i) => (
                <div className="card" key={i} style={{ padding: 20 }}>
                  {s.label && (
                    <div style={{ fontWeight: 650, marginBottom: s.code || s.body ? 10 : 0 }}>
                      <span style={{ fontFamily: "var(--font-mono)", color: "var(--brand-bright)", marginRight: 8 }}>0{i + 1}</span>
                      {s.label}
                    </div>
                  )}
                  {s.body && <p className="card__body" style={{ marginBottom: s.code ? 12 : 0 }}>{s.body}</p>}
                  {s.code && (
                    <pre style={{
                      margin: 0, padding: "12px 14px", borderRadius: 8,
                      background: "#070d22", border: "1px solid var(--line)",
                      fontFamily: "var(--font-mono)", fontSize: 13.5,
                      color: "var(--term-green)", overflowX: "auto",
                    }}>
                      <code>{s.code}</code>
                    </pre>
                  )}
                </div>
              ))}
            </div>
            {data.quickstart.note && <p className="muted" style={{ marginTop: 16, fontSize: 14 }}>{data.quickstart.note}</p>}
          </div>
        </section>
      )}

      {/* Enterprise semantic-layer value */}
      {data.semanticLayer && (
        <section
          className="section"
          style={{
            background: "radial-gradient(900px 420px at 50% 0%, var(--brand-soft), transparent 70%), rgba(11,18,48,0.4)",
            borderBlock: "1px solid var(--line)",
          }}
        >
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">{data.semanticLayer.eyebrow}</span>
              <h2 className="h2" style={{ fontSize: "clamp(24px,3vw,34px)" }}>{data.semanticLayer.heading}</h2>
              <p className="lead" style={{ maxWidth: 760 }}>{data.semanticLayer.body}</p>
            </div>

            {data.semanticLayer.lifecycle && (
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, marginBottom: 32 }}>
                {data.semanticLayer.lifecycle.map((stage, i, arr) => {
                  const tone = LIFECYCLE_TONES[i] ?? "var(--ink-muted)";
                  return (
                    <Fragment key={stage}>
                      <span style={{
                        padding: "5px 13px", borderRadius: 999, fontSize: 12.5, fontWeight: 650,
                        color: tone, border: `1px solid ${tone}`, background: "rgba(124,137,196,0.08)",
                      }}>
                        {stage}
                      </span>
                      {i < arr.length - 1 && <ArrowRight size={14} style={{ color: "var(--ink-faint)" }} />}
                    </Fragment>
                  );
                })}
              </div>
            )}

            <div className="grid grid-2">
              {data.semanticLayer.cards.map((c) => (
                <div className="card" key={c.title}>
                  {c.icon && <span className="card__icon"><c.icon size={20} /></span>}
                  <h3 className="card__title">{c.title}</h3>
                  <p className="card__body">{c.body}</p>
                </div>
              ))}
            </div>

            {data.semanticLayer.highlight && (
              <div style={{
                marginTop: 24, padding: "22px 26px", borderRadius: "var(--r-lg)",
                background: "var(--panel-solid)", border: "1px solid var(--line-strong)",
              }}>
                <p style={{ margin: 0, fontSize: 16, lineHeight: 1.65, color: "var(--ink-dim)" }}>
                  {data.semanticLayer.highlight}
                </p>
              </div>
            )}

            {data.semanticLayer.link && (
              <a
                className="link-arrow"
                href={data.semanticLayer.link.href}
                {...(data.semanticLayer.link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                style={{ marginTop: 24 }}
              >
                {data.semanticLayer.link.label} <ArrowRight size={15} />
              </a>
            )}
          </div>
        </section>
      )}

      {/* Closing CTA / form */}
      <section className="section" id="contact" style={{ scrollMarginTop: "var(--nav-h)" }}>
        <div className="container">
          <div className="card" style={{
            textAlign: data.formSlot ? "left" : "center",
            padding: "48px 32px",
            background: "radial-gradient(700px 300px at 50% -20%, var(--brand-soft), transparent 70%), var(--panel)",
            borderColor: "var(--line-strong)",
          }}>
            <h2 className="h2" style={{ fontSize: "clamp(24px,3vw,34px)" }}>{data.closingCta.heading}</h2>
            {data.closingCta.body && (
              <p className="lead" style={{ marginInline: data.formSlot ? 0 : "auto", maxWidth: 600 }}>
                {data.closingCta.body}
              </p>
            )}
            {data.formSlot}
            {data.closingCta.ctas && data.closingCta.ctas.length > 0 && (
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginTop: 26 }}>
                {data.closingCta.ctas.map((c) => <CtaButton key={c.label} cta={c} />)}
              </div>
            )}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
