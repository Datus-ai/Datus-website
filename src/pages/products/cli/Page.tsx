import { ArrowRight, ArrowUpRight, CheckCircle2 } from "lucide-react";
import SiteLayout from "../../../components/SiteLayout";
import Breadcrumb from "../../../components/Breadcrumb";
import FAQ from "../../../components/FAQ";
import { cliFaq } from "./faq";
import {
  claudeCodeNote, cliHero, closing, ecosystem, guardrails, modelNeutral, parity,
  type CliCta, type DocLink, type FeatureCard,
} from "./content";

function Cta({ cta }: { cta: CliCta }) {
  const cls = `btn btn-lg ${cta.variant === "ghost" ? "btn-ghost" : "btn-primary"}`;
  const ext = cta.external ? { target: "_blank", rel: "noopener noreferrer" } : {};
  return (
    <a className={cls} href={cta.href} {...ext}>
      {cta.label}
      {cta.variant !== "ghost" && <ArrowRight size={17} />}
    </a>
  );
}

// Small, unified doc-link style shared across every card on this page.
function DocLinks({ links }: { links?: DocLink[] }) {
  if (!links || links.length === 0) return null;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginTop: 16 }}>
      {links.map((l) => (
        <a
          key={l.href}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            fontSize: 12.5, fontWeight: 600, color: "var(--brand-bright)",
          }}
        >
          {l.label} <ArrowUpRight size={13} />
        </a>
      ))}
    </div>
  );
}

function Cards({ cards, cols = 3 }: { cards: FeatureCard[]; cols?: number }) {
  return (
    <div className={`grid grid-${cols}`} style={{ alignItems: "stretch" }}>
      {cards.map((c) => (
        <div className="card" key={c.title} style={{ display: "flex", flexDirection: "column" }}>
          <span className="card__icon"><c.icon size={20} /></span>
          <h3 className="card__title">{c.title}</h3>
          <p className="card__body">{c.body}</p>
          {c.links && <div style={{ marginTop: "auto" }}><DocLinks links={c.links} /></div>}
        </div>
      ))}
    </div>
  );
}

const TONE: Record<string, string> = {
  ok: "var(--term-green)",
  warn: "var(--term-amber)",
  danger: "var(--term-pink)",
};

const panelBg = "rgba(11,18,48,0.4)";
const sectionBorder = "1px solid var(--line)";

export default function CliPage() {
  return (
    <SiteLayout>
      <Breadcrumb
        currentUrl="/products/cli/"
        items={[
          { label: "Home", href: "/" },
          { label: "Products", noSchema: true },
          { label: "Datus CLI" },
        ]}
      />
      {/* Hero */}
      <section className="section" style={{ paddingTop: 72, paddingBottom: 56 }}>
        <div className="container">
          <span className="eyebrow">{cliHero.eyebrow}</span>
          <h1
            style={{
              fontSize: "clamp(32px, 4.6vw, 54px)",
              lineHeight: 1.06,
              letterSpacing: "-0.03em",
              fontWeight: 750,
              margin: "20px 0 0",
            }}
          >
            {cliHero.title}
          </h1>
          <p className="lead" style={{ maxWidth: 660 }}>{cliHero.subhead}</p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 28 }}>
            {cliHero.ctas.map((c) => <Cta key={c.label} cta={c} />)}
          </div>
        </div>
      </section>

      {/* Section 0, Claude Code parity */}
      <section className="section" style={{ background: panelBg, borderBlock: sectionBorder }}>
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">{parity.eyebrow}</span>
            <h2 className="h2" style={{ fontSize: "clamp(24px,3vw,34px)" }}>{parity.heading}</h2>
            <p className="lead" style={{ marginTop: 10, maxWidth: 720 }}>{parity.body}</p>
          </div>
          <Cards cards={parity.cards} />
        </div>
      </section>

      {/* Differentiator 01, Model neutral */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">{modelNeutral.eyebrow}</span>
            <h2 className="h2" style={{ fontSize: "clamp(24px,3vw,34px)" }}>{modelNeutral.heading}</h2>
            <p className="lead" style={{ marginTop: 10, maxWidth: 720 }}>{modelNeutral.body}</p>
            <a className="link-arrow" href={modelNeutral.docsHref} target="_blank" rel="noopener noreferrer" style={{ marginTop: 14 }}>
              {modelNeutral.docsLabel} <ArrowUpRight size={15} />
            </a>
          </div>

          {/* Per-subagent routing */}
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.3fr 0.8fr 1fr" }}>
              {["Subagent", "Model", "Why"].map((h) => (
                <div key={h} style={{
                  padding: "14px 20px", fontSize: 12, fontWeight: 650, letterSpacing: "0.04em",
                  textTransform: "uppercase", color: "var(--ink-muted)", borderBottom: sectionBorder,
                }}>
                  {h}
                </div>
              ))}
              {modelNeutral.routes.map((r, i) => (
                <div key={r.agent} style={{ display: "contents" }}>
                  <div style={{ padding: "16px 20px", fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--ink)", borderBottom: i < modelNeutral.routes.length - 1 ? sectionBorder : undefined }}>{r.agent}</div>
                  <div style={{ padding: "16px 20px", borderBottom: i < modelNeutral.routes.length - 1 ? sectionBorder : undefined }}>
                    <a href={r.href} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 4, fontWeight: 650, color: "var(--brand-bright)" }}>
                      {r.model} <ArrowUpRight size={13} />
                    </a>
                  </div>
                  <div style={{ padding: "16px 20px", fontSize: 14, color: "var(--ink-muted)", borderBottom: i < modelNeutral.routes.length - 1 ? sectionBorder : undefined }}>{r.strength}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Stat row */}
          <div className="grid grid-3" style={{ marginTop: 20 }}>
            {modelNeutral.stats.map((s) => (
              <div className="card" key={s.label} style={{ textAlign: "center", padding: "26px 20px" }}>
                <div style={{ fontSize: "clamp(30px,4vw,42px)", fontWeight: 750, letterSpacing: "-0.02em", color: "var(--brand-bright)" }}>{s.value}</div>
                <div className="card__body" style={{ marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
          <p className="muted" style={{ marginTop: 16, fontSize: 14 }}>{modelNeutral.note}</p>
        </div>
      </section>

      {/* Differentiator 02, Guardrails */}
      <section className="section" style={{ background: panelBg, borderBlock: sectionBorder }}>
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">{guardrails.eyebrow}</span>
            <h2 className="h2" style={{ fontSize: "clamp(24px,3vw,34px)" }}>{guardrails.heading}</h2>
            <p className="lead" style={{ marginTop: 10, maxWidth: 720 }}>{guardrails.body}</p>
          </div>

          {/* Three parallel guardrail pillars */}
          <div className="grid grid-3" style={{ alignItems: "stretch" }}>
            {guardrails.pillars.map((p) => (
              <div className="card" key={p.title} style={{ display: "flex", flexDirection: "column" }}>
                <span className="card__icon"><p.icon size={20} /></span>
                <h3 className="card__title">{p.title}</h3>
                <p className="card__body" style={{ minHeight: 46 }}>{p.body}</p>
                {p.modes && (
                  <div style={{ display: "grid", gap: 10, marginTop: 16, paddingTop: 16, borderTop: sectionBorder }}>
                    {p.modes.map((m) => (
                      <div key={m.name} style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
                        <code style={{
                          fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 700, color: TONE[m.tone],
                          padding: "2px 8px", borderRadius: 6, background: "rgba(124,137,196,0.1)",
                          border: `1px solid ${TONE[m.tone]}`, flexShrink: 0,
                        }}>{m.name}</code>
                        <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--ink-dim)" }}>{m.scope}</span>
                        <span style={{ fontSize: 12.5, color: "var(--ink-muted)", flexBasis: "100%" }}>{m.body}</span>
                      </div>
                    ))}
                  </div>
                )}
                {p.items && (
                  <div style={{ display: "grid", gap: 10, marginTop: 16, paddingTop: 16, borderTop: sectionBorder }}>
                    {p.items.map((it) => (
                      <div key={it.label} style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
                        <CheckCircle2 size={15} style={{ color: "var(--brand-bright)", flexShrink: 0, marginTop: 2 }} />
                        <div>
                          <span style={{ fontSize: 13, fontWeight: 650, color: "var(--ink-dim)" }}>{it.label}</span>
                          <span style={{ fontSize: 12.5, color: "var(--ink-muted)", display: "block", marginTop: 1 }}>{it.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div style={{ marginTop: "auto" }}><DocLinks links={p.links} /></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Differentiator 03, Ecosystem */}
      <section className="section" style={{ paddingBottom: 64 }}>
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">{ecosystem.eyebrow}</span>
            <h2 className="h2" style={{ fontSize: "clamp(24px,3vw,34px)" }}>{ecosystem.heading}</h2>
            <p className="lead" style={{ marginTop: 10, maxWidth: 720 }}>{ecosystem.body}</p>
          </div>
          <Cards cards={ecosystem.cards} />
          <a className="link-arrow" href={ecosystem.linkHref} style={{ marginTop: 22 }}>
            {ecosystem.linkLabel} <ArrowRight size={15} />
          </a>
        </div>
      </section>

      {/* FAQ */}
      <FAQ
        items={cliFaq}
        currentUrl="/products/cli/"
        lead="Install, models, Subagents, and how the CLI relates to Studio."
      />

      {/* Closing CTA */}
      <section className="section" id="contact" style={{ scrollMarginTop: "var(--nav-h)", paddingTop: 0 }}>
        <div className="container">
          <p className="muted" style={{ marginTop: 0, marginBottom: 64, fontSize: 18, lineHeight: 1.6, textAlign: "center" }}>
            {claudeCodeNote.text}{" "}
            <a
              href={claudeCodeNote.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--brand-bright)", fontWeight: 600, whiteSpace: "nowrap" }}
            >
              {claudeCodeNote.linkLabel}&nbsp;↗
            </a>
          </p>
          <div className="card" style={{
            textAlign: "center",
            padding: "48px 32px",
            background: "radial-gradient(700px 300px at 50% -20%, var(--brand-soft), transparent 70%), var(--panel)",
            borderColor: "var(--line-strong)",
          }}>
            <h2 className="h2" style={{ fontSize: "clamp(24px,3vw,34px)" }}>{closing.heading}</h2>
            <p className="lead" style={{ marginInline: "auto", maxWidth: 600 }}>{closing.body}</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginTop: 26 }}>
              {closing.ctas.map((c) => <Cta key={c.label} cta={c} />)}
            </div>
            <p className="muted" style={{ marginTop: 18, fontSize: 13, display: "inline-flex", alignItems: "center", gap: 6 }}>
              <CheckCircle2 size={14} style={{ color: "var(--term-green)" }} /> Bring your own warehouse & model
            </p>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
