import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import SiteLayout from "../../../components/SiteLayout";
import Breadcrumb from "../../../components/Breadcrumb";
import FAQ from "../../../components/FAQ";
import { DOCS_URL } from "../../../config/nav";
import {
  CatalogSection,
  FeatureCard,
  SectionHead,
  SpecTable,
  toneAt,
} from "../../../components/catalog";
import { OsiPlayground } from "../../../components/tools/OsiPlayground";
import { OSI_MAPPING_ROWS, OSI_VS_ROWS } from "./data";
import { useHref, useLocale, useT } from "../../../i18n/LocaleContext";
import { UI } from "../../../i18n/ui";
import { osiPlaygroundFaq } from "./faq";
import { osiPlaygroundPage, type OsiPlaygroundCopy } from "./content";

const ldJson = (obj: unknown) => JSON.stringify(obj).replace(/</g, "\\u003c");

/** HowTo schema built from the localized steps so it matches the visible list. */
function howToJsonLd(t: OsiPlaygroundCopy["howTo"]) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: t.schemaName,
    description: t.schemaDescription,
    step: t.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.title,
      text: s.description,
    })),
  };
}

function Prose({ children }: { children: ReactNode }) {
  return (
    <p style={{ fontSize: 15, lineHeight: 1.75, color: "var(--ink-muted)", margin: 0 }}>{children}</p>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function OsiPlaygroundPage() {
  const t = useT(osiPlaygroundPage);
  const faqItems = useT(osiPlaygroundFaq);
  const ui = UI[useLocale()];
  const l = useHref();
  return (
    <SiteLayout>
      <Breadcrumb
        currentUrl="/tools/osi-playground/"
        items={[
          { label: ui.nav.home, href: "/" },
          { label: t.breadcrumbTools, noSchema: true },
          { label: t.hero.eyebrow },
        ]}
      />

      {/* Hero */}
      <section className="section" style={{ paddingTop: 72, paddingBottom: 32 }}>
        <div className="container" style={{ maxWidth: 900 }}>
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
          <p className="lead" style={{ maxWidth: 720 }}>
            {t.hero.lead}
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px 20px",
              marginTop: 22,
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--ink-faint)",
            }}
          >
            {t.hero.stats.map((stat, i) => (
              <span key={stat} style={{ display: "contents" }}>
                {i > 0 && <span>·</span>}
                <span>{stat}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* TOOL */}
      <section className="section" style={{ paddingTop: 8, paddingBottom: 8 }}>
        <div className="container">
          <OsiPlayground />
        </div>
      </section>

      {/* WHAT IS OSI */}
      <CatalogSection alt>
        <div style={{ maxWidth: 820 }}>
          <SectionHead eyebrow={t.overview.eyebrow} title={t.overview.title} lead={t.overview.lead} />
          <div style={{ display: "grid", gap: 16 }}>
            {t.overview.prose.map((para, i) => (
              <Prose key={i}>{para}</Prose>
            ))}
          </div>
        </div>
      </CatalogSection>

      {/* FIELD MAPPING */}
      <CatalogSection>
        <SectionHead eyebrow={t.mapping.eyebrow} title={t.mapping.title} lead={t.mapping.lead} />
        <SpecTable
          filename="metricflow-to-osi.yaml"
          columns={t.mapping.columns.map((label) => ({ label }))}
          rows={OSI_MAPPING_ROWS}
        />
        <p style={{ marginTop: 16, fontSize: 14, color: "var(--ink-muted)" }}>
          {t.mapping.linkBefore}
          <a
            href={l("/osi-field-mapping/")}
            style={{
              color: "var(--brand-bright)",
              textDecoration: "underline",
              textDecorationStyle: "dotted",
              textUnderlineOffset: 2,
            }}
          >
            {t.mapping.linkLabel}
          </a>
          {t.mapping.linkAfter}
        </p>
      </CatalogSection>

      {/* HOW-TO */}
      <CatalogSection alt>
        <SectionHead eyebrow={t.howTo.eyebrow} title={t.howTo.title} lead={t.howTo.lead} />
        <div className="grid grid-3">
          {t.howTo.steps.map((step, i) => (
            <div key={step.title} className="card" style={{ display: "flex", flexDirection: "column" }}>
              <span
                aria-hidden="true"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 34,
                  fontWeight: 700,
                  lineHeight: 1,
                  color: "var(--ink-faint)",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="card__title" style={{ marginTop: 14 }}>
                {step.title}
              </h3>
              <p className="card__body">{step.description}</p>
            </div>
          ))}
        </div>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldJson(howToJsonLd(t.howTo)) }} />
      </CatalogSection>

      {/* WHY IT MATTERS */}
      <CatalogSection>
        <SectionHead eyebrow={t.why.eyebrow} title={t.why.title} lead={t.why.lead} />
        <div className="grid grid-2">
          {t.why.items.map((w, i) => (
            <FeatureCard key={w.title} tone={toneAt(i)} title={w.title} body={w.description} />
          ))}
        </div>
      </CatalogSection>

      {/* COMPARISON TABLE */}
      <CatalogSection alt>
        <SectionHead
          eyebrow={t.comparison.eyebrow}
          title={t.comparison.title}
          lead={t.comparison.lead}
        />
        <SpecTable
          filename="osi-vs-metricflow-vs-cube.yaml"
          columns={t.comparison.columns.map((label) => ({ label }))}
          rows={OSI_VS_ROWS}
        />
      </CatalogSection>

      {/* FAQ */}
      <FAQ items={faqItems} currentUrl="/tools/osi-playground/" lead={t.faqLead} />

      {/* CTA */}
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
            <p className="lead" style={{ marginInline: "auto", maxWidth: 640 }}>
              {t.closing.lead}
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginTop: 26 }}>
              <a className="btn btn-lg btn-primary" href={DOCS_URL} target="_blank" rel="noopener noreferrer">
                {t.closing.featuresCta} <ArrowRight size={17} />
              </a>
              <a className="btn btn-lg btn-ghost" href={l("/osi-field-mapping/")}>
                {t.closing.mappingCta} <ArrowRight size={17} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
