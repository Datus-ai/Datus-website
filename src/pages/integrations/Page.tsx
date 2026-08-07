import { ArrowRight, CheckCircle2, ExternalLink } from "lucide-react";
import SiteLayout from "../../components/SiteLayout";
import Breadcrumb from "../../components/Breadcrumb";
import FAQ from "../../components/FAQ";
import { DOCS_URL, GITHUB_URL, STUDIO_URL } from "../../config/nav";
import {
  CatalogSection,
  CodeBlock,
  FeatureCard,
  InlineCode,
  SectionHead,
  SpecCard,
  SpecTable,
  TagRow,
  sectionBorder,
  toneAt,
} from "../../components/catalog";
import { useHref, useLocale, useT } from "../../i18n/LocaleContext";
import { UI } from "../../i18n/ui";
import { integrationsFaq } from "./faq";
import { biCode, embeddingYaml, integrationsPage, skillsCode } from "./content";

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function IntegrationsPage() {
  const t = useT(integrationsPage);
  const faqItems = useT(integrationsFaq);
  const ui = UI[useLocale()];
  const l = useHref();
  return (
    <SiteLayout>
      <Breadcrumb
        currentUrl="/integrations/"
        items={[{ label: ui.nav.home, href: "/" }, { label: ui.nav.integrations }]}
      />

      {/* Hero */}
      <section className="section" style={{ paddingTop: 72, paddingBottom: 40 }}>
        <div className="container" style={{ maxWidth: 880 }}>
          <span className="eyebrow">{t.hero.eyebrow}</span>
          <h1
            style={{
              fontSize: "clamp(32px,4.6vw,52px)",
              lineHeight: 1.06,
              letterSpacing: "-0.03em",
              fontWeight: 750,
              margin: "20px 0 0",
            }}
          >
            {t.hero.heading}
          </h1>
          <p className="lead" style={{ maxWidth: 660 }}>
            {t.hero.leadBefore}
            <a href={l("/databases/")} style={{ color: "var(--brand-bright)", textDecoration: "underline", textUnderlineOffset: 2 }}>{t.hero.databases}</a>
            {t.hero.leadMiddle}
            <a href={l("/models/")} style={{ color: "var(--brand-bright)", textDecoration: "underline", textUnderlineOffset: 2 }}>{t.hero.models}</a>
            {t.hero.leadAfter}
          </p>
        </div>
      </section>

      {/* SECTION 1 — STORAGE */}
      <CatalogSection alt>
        <SectionHead eyebrow={t.storage.eyebrow} title={t.storage.title} lead={t.storage.lead} />
        <div className="grid grid-3">
          {t.storage.items.map((s, i) => (
            <SpecCard
              key={s.key}
              name={s.name}
              tone={toneAt(i)}
              badge={s.builtIn ? (<><CheckCircle2 size={12} /> {t.labels.builtIn}</>) : undefined}
              rows={[
                { label: t.labels.type, value: s.type },
                { label: t.labels.pkg, value: s.pkg },
                { label: t.labels.notes, value: s.notes, mono: false },
              ]}
            />
          ))}
        </div>
      </CatalogSection>

      {/* SECTION 2 — EMBEDDINGS */}
      <CatalogSection>
        <SectionHead eyebrow={t.embeddings.eyebrow} title={t.embeddings.title} lead={t.embeddings.lead} />
        <div className="grid grid-4">
          {t.embeddings.items.map((ep, i) => (
            <SpecCard
              key={ep.key}
              name={ep.name}
              tone={toneAt(i + 1)}
              badge={ep.badge}
              rows={[
                { label: t.labels.model, value: ep.model, mono: false },
                { label: t.labels.dim, value: ep.dim },
              ]}
            />
          ))}
        </div>
        <div style={{ marginTop: 24 }}>
          <CodeBlock filename="agent.yml" lang="yaml" code={embeddingYaml} />
        </div>
      </CatalogSection>

      {/* SECTION 3 — SEMANTIC LAYER */}
      <CatalogSection alt>
        <SectionHead eyebrow={t.semantic.eyebrow} title={t.semantic.title} lead={t.semantic.lead} />
        <div className="grid grid-2" style={{ alignItems: "stretch" }}>
          <SpecCard
            name="MetricFlow"
            tone={toneAt(2)}
            badge={<><CheckCircle2 size={12} /> {t.labels.ready}</>}
            rows={[
              { label: t.labels.pkg, value: "datus-semantic-metricflow" },
              { label: t.labels.install, value: "pip install datus-semantic-metricflow" },
              { label: t.labels.notes, value: t.semantic.metricFlowNotes, mono: false },
            ]}
          />
          <div className="card" style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10.5,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--ink-faint)",
                marginBottom: 14,
              }}
            >
              {t.semantic.coreInterface}
            </div>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 10 }}>
              {t.semantic.methods.map((m) => (
                <li key={m.method} style={{ fontSize: 13, lineHeight: 1.5 }}>
                  <InlineCode>{m.method}</InlineCode>
                  <span style={{ marginLeft: 8, color: "var(--ink-muted)" }}>— {m.desc}</span>
                </li>
              ))}
            </ul>
            <p style={{ marginTop: 16, marginBottom: 0, fontSize: 12.5, color: "var(--ink-muted)" }}>
              {t.semantic.registerBefore}
              <InlineCode>[project.entry-points."datus.semantic_adapters"]</InlineCode>
              {t.semantic.registerAfter}
            </p>
          </div>
        </div>
      </CatalogSection>

      {/* SECTION 4 — BI PLATFORM COPILOT */}
      <CatalogSection>
        <div className="card" style={{ padding: "32px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 32, alignItems: "flex-start" }}>
            <div style={{ flex: "1 1 320px", minWidth: 280 }}>
              <span className="eyebrow">{t.bi.eyebrow}</span>
              <h2 className="h2" style={{ fontSize: "clamp(24px,3vw,32px)" }}>
                {t.bi.heading}
              </h2>
              <p className="lead" style={{ marginTop: 10 }}>
                {t.bi.lead}
              </p>
              <div style={{ marginTop: 18 }}>
                <TagRow tags={t.bi.tags} />
              </div>
              <p className="muted" style={{ marginTop: 16, fontSize: 13 }}>
                {t.bi.roadmap}
              </p>
            </div>
            <div style={{ flex: "1 1 360px", minWidth: 300, width: "100%" }}>
              <CodeBlock filename="terminal" lang="bash" code={biCode} />
            </div>
          </div>
        </div>
      </CatalogSection>

      {/* SECTION 5 — MCP */}
      <CatalogSection alt>
        <SectionHead eyebrow={t.mcp.eyebrow} title={t.mcp.title} lead={t.mcp.lead} />
        <div className="grid grid-2">
          <FeatureCard
            tone={toneAt(0)}
            title={t.mcp.clientTitle}
            body={
              <>
                <span style={{ display: "block" }}>
                  {t.mcp.clientBody}<InlineCode>.mcp add</InlineCode>{" "}
                  <InlineCode>stdio</InlineCode>, <InlineCode>http</InlineCode>, <InlineCode>sse</InlineCode>
                  {t.mcp.clientBodyTail}
                </span>
                <span style={{ display: "block", marginTop: 8, fontSize: 13, color: "var(--ink-faint)" }}>
                  {t.mcp.clientConfigBefore}<InlineCode>~/.datus/conf/.mcp.json</InlineCode>{t.mcp.clientConfigAfter}
                </span>
              </>
            }
          />
          <FeatureCard
            tone={toneAt(3)}
            title={t.mcp.serverTitle}
            body={
              <>
                <span style={{ display: "block" }}>
                  {t.mcp.serverBodyBefore}<InlineCode>datus-mcp</InlineCode>{t.mcp.serverBodyAfter}
                </span>
                <span style={{ display: "block", marginTop: 8, fontSize: 13, color: "var(--ink-faint)" }}>
                  {t.mcp.serverTools}
                </span>
              </>
            }
          />
        </div>
        <a
          className="link-arrow"
          href={DOCS_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{ marginTop: 22 }}
        >
          <ExternalLink size={15} /> {t.mcp.docsLink} <ArrowRight size={14} />
        </a>
      </CatalogSection>

      {/* SECTION 6 — SKILLS */}
      <CatalogSection>
        <SectionHead eyebrow={t.skills.eyebrow} title={t.skills.title} lead={t.skills.lead} />
        <div className="grid grid-3" style={{ alignItems: "stretch" }}>
          {t.skills.cards.map((s, i) => (
            <FeatureCard key={s.title} tone={toneAt(i)} title={s.title} body={s.body} />
          ))}
        </div>
        <div style={{ marginTop: 24 }}>
          <CodeBlock filename="terminal" lang="bash" code={skillsCode} />
        </div>
      </CatalogSection>

      {/* SECTION 7 — OBSERVABILITY */}
      <CatalogSection alt>
        <SectionHead
          eyebrow={t.observability.eyebrow}
          title={t.observability.title}
          lead={t.observability.lead}
        />
        <SpecTable
          filename="observability.env"
          lang="env"
          columns={t.observability.columns.map((label) => ({ label }))}
          rows={t.observability.items.map((o) => ({
            key: o.key,
            cells: [
              <span style={{ fontSize: 14, fontWeight: 650, color: "var(--ink)", whiteSpace: "nowrap" }}>{o.tool}</span>,
              <span style={{ color: "var(--ink-muted)" }}>{o.purpose}</span>,
              <InlineCode>{o.config}</InlineCode>,
            ],
          }))}
        />
      </CatalogSection>

      {/* FAQ */}
      <FAQ items={faqItems} currentUrl="/integrations/" lead={t.faqLead} />

      {/* Closing CTA */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div
            className="card"
            style={{
              textAlign: "center",
              padding: "48px 32px",
              background:
                "radial-gradient(700px 300px at 50% -20%, var(--brand-soft), transparent 70%), var(--panel)",
              borderColor: "var(--line-strong)",
            }}
          >
            <h2 className="h2" style={{ fontSize: "clamp(24px,3vw,34px)" }}>
              {t.closing.heading}
            </h2>
            <p className="lead" style={{ marginInline: "auto", maxWidth: 600 }}>
              {t.closing.lead}
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginTop: 26 }}>
              <a className="btn btn-lg btn-primary" href={STUDIO_URL} target="_blank" rel="noopener noreferrer">
                {t.closing.startCta} <ArrowRight size={17} />
              </a>
              <a className="btn btn-lg btn-ghost" href={DOCS_URL} target="_blank" rel="noopener noreferrer">
                {t.closing.docsCta} <ArrowRight size={17} />
              </a>
              <a className="btn btn-lg btn-ghost" href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
                {t.closing.githubCta}
              </a>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
