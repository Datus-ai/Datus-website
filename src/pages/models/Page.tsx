import { ArrowRight } from "lucide-react";
import SiteLayout from "../../components/SiteLayout";
import Breadcrumb from "../../components/Breadcrumb";
import FAQ from "../../components/FAQ";
import { GITHUB_URL } from "../../config/nav";
import {
  CatalogSection,
  CodeBlock,
  FeatureCard,
  InlineCode,
  SectionHead,
  SpecCard,
  SpecTable,
  TagRow,
  toneAt,
} from "../../components/catalog";
import { useHref, useLocale, useT } from "../../i18n/LocaleContext";
import { UI } from "../../i18n/ui";
import { modelsFaq } from "./faq";
import { PROVIDER_DOCS, modelsPage, pipelineYaml } from "./content";

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function ModelsPage() {
  const t = useT(modelsPage);
  const faqItems = useT(modelsFaq);
  const ui = UI[useLocale()];
  const l = useHref();
  const providers = t.providers;
  const providerAuth = t.auth.matrix;
  return (
    <SiteLayout>
      <Breadcrumb
        currentUrl="/models/"
        items={[
          { label: ui.nav.home, href: "/" },
          { label: ui.nav.integrations, noSchema: true },
          { label: ui.products.models },
        ]}
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
          <p className="lead" style={{ maxWidth: 680 }}>
            {t.hero.lead}
          </p>
        </div>
      </section>

      {/* PROVIDER GRID */}
      <CatalogSection alt>
        <div className="grid grid-4">
          {providers.map((p, i) => {
            const auth = providerAuth[p.key];
            return (
              <SpecCard
                key={p.key}
                name={p.name}
                tone={toneAt(i)}
                rows={[
                  { label: t.providerTable.type, value: p.type },
                  { label: t.providerTable.notes, value: p.notes, mono: false },
                  ...(auth ? [{ label: t.auth.cardLabel, value: auth.auth, mono: false }] : []),
                ]}
              />
            );
          })}
        </div>
      </CatalogSection>

      {/* TABLE VIEW */}
      <CatalogSection>
        <SpecTable
          filename="agent.yml"
          columns={[
            { label: t.providerTable.provider },
            { label: t.providerTable.type },
            { label: t.providerTable.notes },
          ]}
          rows={providers.map((p) => ({
            key: p.key,
            cells: [
              <span style={{ fontSize: 14, fontWeight: 650, color: "var(--ink)" }}>{p.name}</span>,
              <InlineCode>{p.type}</InlineCode>,
              <span style={{ color: "var(--ink-muted)" }}>{p.notes}</span>,
            ],
          }))}
        />
      </CatalogSection>

      {/* AUTH MATRIX */}
      <CatalogSection alt>
        <SectionHead eyebrow={t.auth.eyebrow} title={t.auth.title} lead={t.auth.lead} />
        <SpecTable
          filename="auth-matrix.yml"
          columns={t.auth.columns.map((label) => ({ label }))}
          rows={providers.map((p) => {
            const auth = providerAuth[p.key] ?? { auth: "—", azure: "—", selfHost: "—" };
            return {
              key: `auth-${p.key}`,
              cells: [
                <span style={{ fontSize: 14, fontWeight: 650, color: "var(--ink)" }}>{p.name}</span>,
                <span style={{ color: "var(--ink-muted)" }}>{auth.auth}</span>,
                <span style={{ color: "var(--ink-muted)" }}>{auth.azure}</span>,
                <span style={{ color: "var(--ink-muted)" }}>{auth.selfHost}</span>,
              ],
            };
          })}
        />
      </CatalogSection>

      {/* PER-NODE STRATEGY */}
      <CatalogSection>
        <SectionHead eyebrow={t.strategy.eyebrow} title={t.strategy.title} lead={t.strategy.lead} />
        <div className="grid grid-3">
          {t.strategy.items.map((s, i) => (
            <FeatureCard key={s.title} tone={toneAt(i)} title={s.title} body={s.body} />
          ))}
        </div>
      </CatalogSection>

      {/* EMBEDDING MODELS */}
      <CatalogSection alt>
        <SectionHead eyebrow={t.embeddings.eyebrow} title={t.embeddings.title} lead={t.embeddings.lead} />
        <div className="grid grid-4">
          {t.embeddings.items.map((ep, i) => (
            <FeatureCard
              key={ep.type}
              tone={toneAt(i)}
              title={ep.name}
              body={
                <span style={{ display: "block" }}>
                  <code style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: "var(--ink-faint)" }}>{ep.type}</code>
                  <span style={{ display: "block", marginTop: 4, fontSize: 12.5, color: "var(--ink-muted)" }}>{ep.notes}</span>
                </span>
              }
            />
          ))}
        </div>
      </CatalogSection>

      {/* LLM OBSERVABILITY */}
      <CatalogSection>
        <SectionHead
          eyebrow={t.observability.eyebrow}
          title={t.observability.title}
          lead={t.observability.lead}
        />
        <div className="grid grid-3">
          {t.observability.items.map((o, i) => (
            <SpecCard
              key={o.key}
              name={o.name}
              tone={toneAt(i + 2)}
              rows={[
                { label: t.observability.purposeLabel, value: o.purpose, mono: false },
                { label: t.observability.envLabel, value: o.env },
              ]}
            />
          ))}
        </div>
      </CatalogSection>

      {/* PER-NODE MODEL ASSIGNMENT */}
      <CatalogSection alt>
        <div className="card" style={{ padding: "32px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 32, alignItems: "flex-start" }}>
            <div style={{ flex: "1 1 320px", minWidth: 280 }}>
              <span className="eyebrow">{t.routing.eyebrow}</span>
              <h2 className="h2" style={{ fontSize: "clamp(24px,3vw,32px)" }}>
                {t.routing.heading}
              </h2>
              <p className="lead" style={{ marginTop: 10 }}>
                {t.routing.lead}
              </p>
              <div style={{ marginTop: 18 }}>
                <TagRow tags={t.routing.tags} />
              </div>
            </div>
            <div style={{ flex: "1 1 360px", minWidth: 300, width: "100%" }}>
              <CodeBlock filename="pipeline.yml" lang="yaml" code={pipelineYaml} />
            </div>
          </div>
        </div>
      </CatalogSection>

      {/* FAQ */}
      <FAQ items={faqItems} currentUrl="/models/" lead={t.faqLead} />

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
            <p className="lead" style={{ marginInline: "auto", maxWidth: 620 }}>
              {t.closing.lead}
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginTop: 26 }}>
              <a className="btn btn-lg btn-primary" href={PROVIDER_DOCS} target="_blank" rel="noopener noreferrer">
                {t.closing.docsCta} <ArrowRight size={17} />
              </a>
              <a className="btn btn-lg btn-ghost" href={l("/databases/")}>
                {t.closing.databasesCta} <ArrowRight size={17} />
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
