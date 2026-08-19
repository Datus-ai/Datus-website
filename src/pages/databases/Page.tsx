import { ArrowRight, CheckCircle2, ExternalLink } from "lucide-react";
import SiteLayout from "../../components/SiteLayout";
import Breadcrumb from "../../components/Breadcrumb";
import FAQ from "../../components/FAQ";
import { DOCS_URL, GITHUB_URL } from "../../config/nav";
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
import { databasesFaq } from "./faq";
import { DB_ADAPTERS_DOCS, databasesPage, datasourceYaml, migrationExample } from "./content";

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function DatabasesPage() {
  const t = useT(databasesPage);
  const faqItems = useT(databasesFaq);
  const ui = UI[useLocale()];
  const l = useHref();
  const databases = t.databases;
  return (
    <SiteLayout>
      <Breadcrumb
        currentUrl="/databases/"
        items={[
          { label: ui.nav.home, href: "/" },
          { label: ui.nav.integrations, noSchema: true },
          { label: ui.products.databases },
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

      {/* DATABASE GRID */}
      <CatalogSection alt>
        <div className="grid grid-4">
          {databases.map((db, i) => {
            const tone = db.tone ?? toneAt(i);
            return (
              <SpecCard
                key={db.type}
                name={db.name}
                tone={tone}
                badge={
                  db.builtIn ? (
                    <><CheckCircle2 size={12} /> {t.builtIn}</>
                  ) : db.since ? (
                    <span style={{ color: "var(--ink-muted)" }}>{db.since}</span>
                  ) : undefined
                }
                rows={[
                  { label: t.table.columns[1], value: db.type },
                  { label: t.table.columns[2], value: db.pkg },
                  { label: t.table.columns[3], value: db.highlight, mono: false },
                ]}
              />
            );
          })}
        </div>
      </CatalogSection>

      {/* CATEGORY SPLIT */}
      <CatalogSection>
        <SectionHead
          eyebrow={t.categoriesSection.eyebrow}
          title={t.categoriesSection.title}
          lead={t.categoriesSection.lead}
        />
        <div className="grid grid-4">
          {t.categories.map((c, i) => (
            <FeatureCard key={c.title} tone={toneAt(i)} title={c.title} body={c.body} />
          ))}
        </div>
      </CatalogSection>

      {/* TABLE VIEW */}
      <CatalogSection alt>
        <SpecTable
          filename="databases.yml"
          columns={t.table.columns.map((label) => ({ label }))}
          rows={databases.map((db) => ({
            key: db.type,
            cells: [
              <span style={{ fontSize: 14, fontWeight: 650, color: "var(--ink)" }}>{db.name}</span>,
              <InlineCode>{db.type}</InlineCode>,
              db.builtIn ? (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--ink-dim)" }}>
                  <CheckCircle2 size={12} style={{ color: "var(--term-cyan)" }} /> {t.builtIn}
                </span>
              ) : (
                <InlineCode>{db.pkg}</InlineCode>
              ),
              <span style={{ color: "var(--ink-muted)" }}>{db.highlight}</span>,
            ],
          }))}
        />
        <p className="muted" style={{ marginTop: 20, fontSize: 14, display: "inline-flex", alignItems: "center", gap: 8 }}>
          <ExternalLink size={15} />
          <span>
            {t.table.docsPrefix}
            <a href={DB_ADAPTERS_DOCS} target="_blank" rel="noopener noreferrer" style={{ color: "var(--brand-bright)", textDecoration: "underline", textUnderlineOffset: 2 }}>
              {t.table.docsLabel}
            </a>
            {t.table.docsSuffix}
          </span>
        </p>
      </CatalogSection>

      {/* MIGRATION CAPABILITIES */}
      <CatalogSection>
        <div className="card" style={{ padding: "32px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 32, alignItems: "flex-start" }}>
            <div style={{ flex: "1 1 320px", minWidth: 280 }}>
              <span className="eyebrow">{t.migration.eyebrow}</span>
              <h2 className="h2" style={{ fontSize: "clamp(24px,3vw,32px)" }}>
                {t.migration.heading}
              </h2>
              <p className="lead" style={{ marginTop: 10 }}>
                {t.migration.lead}
              </p>
              <div style={{ marginTop: 18 }}>
                <TagRow tags={["get_migration_capabilities()", "suggest_table_layout()", "validate_ddl()"]} />
              </div>
            </div>
            <div style={{ flex: "1 1 360px", minWidth: 300, width: "100%" }}>
              <CodeBlock filename="layout-suggestions.sql" lang="sql" code={migrationExample} />
            </div>
          </div>
        </div>
      </CatalogSection>

      {/* DATASOURCE CONFIG */}
      <CatalogSection alt>
        <SectionHead
          eyebrow={t.config.eyebrow}
          title={t.config.title}
          lead={t.config.lead}
        />
        <CodeBlock filename="agent.yml" lang="yaml" code={datasourceYaml} />
      </CatalogSection>

      {/* FAQ */}
      <FAQ items={faqItems} currentUrl="/databases/" lead={t.faqLead} />

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
              <a className="btn btn-lg btn-primary" href={DB_ADAPTERS_DOCS} target="_blank" rel="noopener noreferrer">
                {t.closing.docsCta} <ArrowRight size={17} />
              </a>
              <a className="btn btn-lg btn-ghost" href={l("/models/")}>
                {t.closing.modelsCta} <ArrowRight size={17} />
              </a>
              <a className="btn btn-lg btn-ghost" href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
                {t.closing.contributeCta}
              </a>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
