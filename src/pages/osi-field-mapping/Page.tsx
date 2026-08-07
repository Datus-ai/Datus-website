import { ArrowRight } from "lucide-react";
import SiteLayout from "../../components/SiteLayout";
import Breadcrumb from "../../components/Breadcrumb";
import FAQ from "../../components/FAQ";
import { CatalogSection, SectionHead, toneAt } from "../../components/catalog";
import { OSI_MAPPING_COLUMNS, type MappingRow } from "./data";
import { useHref, useLocale, useT } from "../../i18n/LocaleContext";
import { UI } from "../../i18n/ui";
import { osiFieldMappingFaq } from "./faq";
import { osiMappingPage } from "./content";

/* -------------------------------------------------------------------------- */
/*  Presentation helpers                                                       */
/* -------------------------------------------------------------------------- */

const [OSI_COL, ...PRODUCT_COLS] = OSI_MAPPING_COLUMNS;

/**
 * Vertical field-card variant of the spec table. Each row renders as a card:
 * an OSI-field header + a grid of the eight per-product mappings. Avoids a
 * 9-wide horizontal-scroll table (ports datus-design SpecFieldCards).
 */
function LayerFieldCards({ filename, rows }: { filename: string; rows: MappingRow[] }) {
  return (
    <div className="term">
      <div className="term__bar">
        <span className="term__dot term__dot--r" />
        <span className="term__dot term__dot--y" />
        <span className="term__dot term__dot--g" />
        <span className="term__title">{filename}</span>
        <span className="term__title" style={{ marginLeft: "auto" }}>yaml</span>
      </div>
      <div className="osi-fields">
        {rows.map((r) => {
          const [osiCell, ...productCells] = r.cells;
          return (
            <div key={r.key} className="osi-field-row">
              <div style={labelStyle}>{OSI_COL.label}</div>
              <div style={{ marginTop: 4, fontSize: 14, color: "var(--ink)", lineHeight: 1.55 }}>
                {osiCell}
              </div>
              <div className="osi-field-products">
                {PRODUCT_COLS.map((col, i) => (
                  <div key={col.label} style={{ minWidth: 0 }}>
                    <div style={labelStyle}>{col.label}</div>
                    <div
                      style={{
                        marginTop: 4,
                        fontSize: 13,
                        color: "var(--ink-muted)",
                        lineHeight: 1.55,
                        overflowWrap: "anywhere",
                      }}
                    >
                      {productCells[i]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 10.5,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "var(--ink-faint)",
};

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function OsiFieldMappingPage() {
  const t = useT(osiMappingPage);
  const faqItems = useT(osiFieldMappingFaq);
  const ui = UI[useLocale()];
  const l = useHref();
  return (
    <SiteLayout>
      <Breadcrumb
        currentUrl="/osi-field-mapping/"
        items={[
          { label: ui.nav.home, href: "/" },
          { label: t.hero.eyebrow },
        ]}
      />

      {/* Hero */}
      <section className="section" style={{ paddingTop: 72, paddingBottom: 40 }}>
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

      {/* Layer sections */}
      {t.layers.map((layer, i) => (
        <CatalogSection key={layer.id} alt={i % 2 === 0}>
          <div id={layer.id} style={{ scrollMarginTop: 90 }}>
            <SectionHead eyebrow={t.layerLabel(i)} title={layer.title} lead={layer.description} />
            <LayerFieldCards filename={layer.filename} rows={layer.rows} />
            <p
              style={{
                marginTop: 20,
                maxWidth: 760,
                fontSize: 14,
                lineHeight: 1.7,
                color: "var(--ink-muted)",
              }}
            >
              {layer.commentary}
            </p>
          </div>
        </CatalogSection>
      ))}

      {/* Use cases */}
      <CatalogSection alt={t.layers.length % 2 === 0}>
        <SectionHead
          eyebrow={t.useCasesSection.eyebrow}
          title={t.useCasesSection.title}
          lead={t.useCasesSection.lead}
        />
        <div className="grid grid-2">
          {t.useCases.map((u, i) => (
            <div key={u.id} id={u.id} className="card" style={{ display: "flex", flexDirection: "column", scrollMarginTop: 90 }}>
              <div style={{ height: 6, width: 40, borderRadius: 3, background: toneAt(i), marginBottom: 16 }} />
              <h3 className="card__title">{u.title}</h3>
              <div className="card__body">{u.description}</div>
            </div>
          ))}
        </div>
      </CatalogSection>

      {/* FAQ */}
      <FAQ items={faqItems} currentUrl="/osi-field-mapping/" lead={t.faqLead} />

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
              <a className="btn btn-lg btn-primary" href={l("/tools/osi-playground/")}>
                {t.closing.cta} <ArrowRight size={17} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
