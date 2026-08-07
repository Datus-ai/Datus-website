import {
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  Github,
  Sparkles,
  Star,
} from "lucide-react";
import { useEffect, useState } from "react";
import SiteLayout from "./components/SiteLayout";
import RotatingPrompt from "./components/RotatingPrompt";
import { EnterpriseInquiryDialog } from "./components/EnterpriseInquiryDialog";
import { LifecycleOrbit } from "./components/LifecycleOrbit";
import { SurfaceCarousel } from "./components/SurfaceCarousel";
import FAQ from "./components/FAQ";
import {
  CatalogSection,
  FeatureCard,
  panelBg,
  sectionBorder,
  toneAt,
} from "./components/catalog";
import { GITHUB_URL, STUDIO_URL } from "./config/nav";
import { formatStarCount, useGitHubStars } from "./hooks/useGitHubStars";
import { useHref, useT } from "./i18n/LocaleContext";
import { HOME, type HomeCopy } from "./content/home";

/* ---------------------------------- Hero ---------------------------------- */
const INSTALL_CMD = "curl -fsSL https://datus.ai/install.sh | sh";

/** The install command, click to copy, with a brief confirmation. */
function CopyCommand({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      title={title}
      onClick={() => {
        navigator.clipboard
          ?.writeText(INSTALL_CMD)
          .then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          })
          .catch(() => {});
      }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        whiteSpace: "nowrap",
        background: "transparent",
        border: 0,
        padding: 0,
        cursor: "pointer",
        color: "inherit",
        fontFamily: "inherit",
        fontSize: "inherit",
      }}
    >
      <CheckCircle2 size={13} style={{ color: "var(--term-green)", flexShrink: 0 }} />
      {INSTALL_CMD}
      {copied ? (
        <Check size={13} style={{ color: "var(--term-green)", flexShrink: 0 }} />
      ) : (
        <Copy size={13} style={{ color: "var(--ink-faint)", flexShrink: 0 }} />
      )}
    </button>
  );
}

function Hero({ t }: { t: HomeCopy }) {
  const stars = useGitHubStars();
  return (
    <section className="section" style={{ paddingTop: 72, paddingBottom: 64 }}>
      <div className="container">
        <div
          className="hero-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1.05fr 0.95fr",
            gap: 48,
            alignItems: "center",
          }}
        >
          <div>
            <span className="eyebrow">
              <Sparkles size={13} /> {t.hero.eyebrow}
            </span>
            <h1
              style={{
                fontSize: "clamp(34px, 5vw, 60px)",
                lineHeight: 1.04,
                letterSpacing: "-0.03em",
                fontWeight: 750,
                margin: "20px 0 0",
              }}
            >
              {/* The separator lives in the copy: English needs a space before
                  the accent phrase, Chinese runs the two together. */}
              {t.hero.titleLead}
              <span className="grad-text">{t.hero.titleAccent}</span>
            </h1>
            <p className="lead" style={{ maxWidth: 560 }}>
              {t.hero.lead}
            </p>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 28 }}>
              <a className="btn btn-primary btn-lg" href={STUDIO_URL}>
                {t.hero.ctaPrimary} <ArrowRight size={17} />
              </a>
              <a
                className="btn btn-ghost btn-lg"
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github size={17} />
                {t.hero.ctaGithub}
                <span style={{ color: "var(--term-amber)", display: "inline-flex", alignItems: "center", gap: 4 }}>
                  <Star size={13} fill="currentColor" /> {formatStarCount(stars)}
                </span>
              </a>
            </div>

            <div style={{ marginTop: 16 }}>
              <EnterpriseInquiryDialog>
                <button
                  className="link-arrow"
                  style={{ background: "transparent", border: 0, padding: 0, cursor: "pointer", fontFamily: "inherit" }}
                >
                  {t.hero.contact} <ArrowRight size={15} />
                </button>
              </EnterpriseInquiryDialog>
            </div>
          </div>

          <HeroTerminal t={t} />
        </div>

        <div
          style={{
            display: "flex",
            gap: 18,
            flexWrap: "wrap",
            alignItems: "center",
            marginTop: 32,
            color: "var(--ink-muted)",
            fontSize: 13.5,
            fontFamily: "var(--font-mono)",
          }}
        >
          <CopyCommand title={INSTALL_CMD} />
          <span style={{ whiteSpace: "nowrap", display: "inline-flex", alignItems: "center", gap: 6 }}>
            <CheckCircle2 size={13} style={{ color: "var(--term-green)", flexShrink: 0 }} /> {t.hero.byoWarehouse}
          </span>
          <span style={{ whiteSpace: "nowrap", display: "inline-flex", alignItems: "center", gap: 6 }}>
            <CheckCircle2 size={13} style={{ color: "var(--term-green)", flexShrink: 0 }} /> {t.hero.byoModel}
          </span>
        </div>
      </div>
    </section>
  );
}

const WAREHOUSES = [
  "snowflake", "bigquery", "redshift", "starrocks",
  "clickhouse", "trino", "postgresql", "mysql",
];

/** Slowly cross-fades the warehouse name in the init command. */
function RotatingWarehouse() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const hold = setTimeout(() => setVisible(false), 2200);
    return () => clearTimeout(hold);
  }, [index]);

  useEffect(() => {
    if (visible) return;
    const swap = setTimeout(() => {
      setIndex((i) => (i + 1) % WAREHOUSES.length);
      setVisible(true);
    }, 320);
    return () => clearTimeout(swap);
  }, [visible]);

  return (
    <span
      className="term__cmd"
      style={{ transition: "opacity 0.32s ease", opacity: visible ? 1 : 0 }}
    >
      {WAREHOUSES[index]}
    </span>
  );
}

function HeroTerminal({ t }: { t: HomeCopy }) {
  return (
    <div className="term">
      <div className="term__bar">
        <span className="term__dot term__dot--r" />
        <span className="term__dot term__dot--y" />
        <span className="term__dot term__dot--g" />
        <span className="term__title">agent.run</span>
      </div>
      <div className="term__body">
        <div className="term__line">
          <span className="term__prompt">$ </span>
          <span className="term__cmd">datus init --datasource </span>
          <RotatingWarehouse />
        </div>
        <div className="term__line term__dim">{t.terminal.connected}</div>
        <div className="term__line term__ok">{t.terminal.ready}</div>
        <div className="term__line" style={{ marginTop: 10 }}>
          <RotatingPrompt phrases={t.prompts} />
        </div>
        <div className="term__line term__dim" style={{ marginTop: 10, whiteSpace: "nowrap", fontSize: 11.5 }}>
          {t.terminal.pipeline}
          <span className="term__cy">{t.terminal.captured}</span>
        </div>
        <div className="term__line term__am" style={{ marginTop: 10, whiteSpace: "nowrap", fontSize: 11.5 }}>
          {t.terminal.selfEvolve}
        </div>
        <div className="term__line term__dim" style={{ fontSize: 11.5 }}>
          {t.terminal.memory}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ Social proof ------------------------------ */
function SocialProofBar({ t }: { t: HomeCopy }) {
  const stars = useGitHubStars();
  // The first tile shows the live star count; the rest are static claims.
  const items = t.proof.map((it, i) =>
    i === 0 ? { ...it, value: `${formatStarCount(stars)}+` } : it,
  );
  return (
    <section className="section" style={{ paddingBlock: 0 }}>
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            border: sectionBorder,
            borderRadius: 14,
            background: panelBg,
            overflow: "hidden",
          }}
          className="proof-grid"
        >
          {items.map((it, i) => (
            <div
              key={it.label}
              style={{
                padding: "20px 18px",
                textAlign: "center",
                borderLeft: i > 0 ? sectionBorder : undefined,
              }}
            >
              <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.01em" }}>{it.value}</div>
              <div
                style={{
                  marginTop: 6,
                  fontFamily: "var(--font-mono)",
                  fontSize: 10.5,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "var(--ink-faint)",
                }}
              >
                {it.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------- Problem → Solution --------------------------- */
function ProblemSolution({ t }: { t: HomeCopy }) {
  const rows = t.problem.rows;
  return (
    <CatalogSection>
      <div className="section-head center">
        <span className="eyebrow">{t.problem.eyebrow}</span>
        <h2 className="h2" style={{ fontSize: "clamp(24px,3vw,34px)" }}>
          {t.problem.heading}
        </h2>
        <p className="lead" style={{ marginTop: 10 }}>
          {t.problem.lead}
        </p>
      </div>

      <div
        style={{
          marginTop: 36,
          border: sectionBorder,
          borderRadius: 16,
          overflow: "hidden",
        }}
      >
        <div className="ps-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
          <div
            style={{
              padding: "12px 24px",
              background: "rgba(11,18,48,0.4)",
              borderBottom: sectionBorder,
              fontFamily: "var(--font-mono)",
              fontSize: 10.5,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "var(--ink-faint)",
            }}
          >
            {t.problem.colProblem}
          </div>
          <div
            style={{
              padding: "12px 24px",
              background: "var(--panel)",
              borderBottom: sectionBorder,
              borderLeft: sectionBorder,
              fontFamily: "var(--font-mono)",
              fontSize: 10.5,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "var(--ink-faint)",
            }}
          >
            {t.problem.colDatus}
          </div>
          {rows.map((r, i) => {
            const last = i === rows.length - 1;
            return (
              <div key={i} style={{ display: "contents" }}>
                <div
                  style={{
                    padding: "22px 24px",
                    background: "rgba(11,18,48,0.25)",
                    color: "var(--ink-muted)",
                    lineHeight: 1.6,
                    borderBottom: last ? undefined : sectionBorder,
                  }}
                >
                  {r.problem}
                </div>
                <div
                  style={{
                    padding: "22px 24px",
                    background: "var(--panel)",
                    color: "var(--ink)",
                    lineHeight: 1.6,
                    borderLeft: sectionBorder,
                    borderBottom: last ? undefined : sectionBorder,
                  }}
                >
                  {r.solution}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </CatalogSection>
  );
}

/* ----------------------------- Three layers ------------------------------- */
const LAYER_WIDTHS = ["78%", "90%", "100%"];

function LayerStack({ t }: { t: HomeCopy }) {
  const layers = t.layers.items;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      {layers.map((layer, i) => {
        const tone = toneAt(i);
        return (
          <div
            key={layer.name}
            className="card"
            style={{
              width: LAYER_WIDTHS[i],
              padding: "16px 20px",
              borderColor: tone,
              background: `color-mix(in oklab, ${tone} 12%, var(--panel))`,
            }}
          >
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
              <h3 style={{ margin: 0, fontSize: 16.5, fontWeight: 700, letterSpacing: "-0.01em" }}>{layer.name}</h3>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "var(--ink-faint)",
                }}
              >
                L{layers.length - i}
              </span>
            </div>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: "var(--ink-muted)" }}>{layer.caption}</p>
            <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 6 }}>
              {layer.chips.map((c) => (
                <span
                  key={c}
                  style={{
                    padding: "4px 8px",
                    borderRadius: 6,
                    border: sectionBorder,
                    background: "rgba(11,18,48,0.45)",
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--ink-dim)",
                  }}
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ThreeLayers({ t }: { t: HomeCopy }) {
  return (
    <CatalogSection alt>
      <div className="split-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "center" }}>
        <div>
          <span className="eyebrow">{t.layers.eyebrow}</span>
          <h2 className="h2" style={{ fontSize: "clamp(24px,3vw,34px)" }}>
            {t.layers.heading}
          </h2>
          <p className="lead" style={{ marginTop: 10 }}>
            {t.layers.lead}
          </p>
        </div>
        <LayerStack t={t} />
      </div>
    </CatalogSection>
  );
}

/* ------------------------------- Lifecycle -------------------------------- */
function Lifecycle({ t }: { t: HomeCopy }) {
  return (
    <CatalogSection>
      <div className="split-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "center" }}>
        <LifecycleOrbit phases={t.lifecycle.phases} />
        <div>
          <span className="eyebrow">{t.lifecycle.eyebrow}</span>
          <h2 className="h2" style={{ fontSize: "clamp(24px,3vw,34px)" }}>
            {t.lifecycle.heading}
          </h2>
          <p className="lead" style={{ marginTop: 10 }}>
            {t.lifecycle.lead}
          </p>
        </div>
      </div>
    </CatalogSection>
  );
}

/* ------------------------------- Use cases -------------------------------- */
function UseCases({ t }: { t: HomeCopy }) {
  return (
    <CatalogSection alt>
      <div className="section-head center">
        <span className="eyebrow">{t.useCases.eyebrow}</span>
        <h2 className="h2" style={{ fontSize: "clamp(24px,3vw,34px)" }}>
          {t.useCases.heading}
        </h2>
        <p className="lead" style={{ marginTop: 10 }}>
          {t.useCases.lead}
        </p>
      </div>
      <div className="grid grid-2" style={{ marginTop: 8 }}>
        {t.useCases.items.map((u, i) => (
          <FeatureCard key={u.title} tone={toneAt(i)} title={u.title} body={u.body} />
        ))}
      </div>
    </CatalogSection>
  );
}

/* -------------------------------- Surfaces -------------------------------- */
function Surfaces({ t }: { t: HomeCopy }) {
  return (
    <CatalogSection>
      <div className="section-head center">
        <span className="eyebrow">{t.surfaces.eyebrow}</span>
        <h2 className="h2" style={{ fontSize: "clamp(24px,3vw,34px)" }}>
          {t.surfaces.heading}
        </h2>
        <p className="lead" style={{ marginTop: 10 }}>
          {t.surfaces.lead}
        </p>
      </div>
      <SurfaceCarousel items={t.surfaces.items} />
    </CatalogSection>
  );
}

/* ------------------------------ Stack logos ------------------------------- */
// Vendor names are proper nouns — only the group labels are translated.
const MODEL_ITEMS = ["OpenAI", "Anthropic", "Gemini", "DeepSeek", "Qwen", "Ollama", "Bedrock"];

const STACK_ITEMS: string[][] = [
  ["Snowflake", "BigQuery", "Redshift", "Postgres", "DuckDB"],
  ["dbt", "SQLMesh"],
  ["Cube", "dbt Semantic Layer", "LookML"],
  ["DataHub", "OpenMetadata", "Unity Catalog"],
  ["Metabase", "Superset", "Tableau"],
  ["Airflow", "Dagster", "Prefect"],
];

function StackPill({ label }: { label: string }) {
  return (
    <span
      style={{
        padding: "5px 11px",
        borderRadius: 8,
        border: sectionBorder,
        background: "rgba(11,18,48,0.45)",
        fontFamily: "var(--font-mono)",
        fontSize: 11.5,
        color: "var(--ink-dim)",
      }}
    >
      {label}
    </span>
  );
}

function GroupLabel({ label, right }: { label: string; right?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10.5,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: "var(--ink-faint)",
        }}
      >
        {label}
      </span>
      {right && (
        <>
          <span style={{ flex: 1, height: 1, background: "var(--line)" }} />
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10.5,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "var(--ink-faint)",
            }}
          >
            {right}
          </span>
        </>
      )}
    </div>
  );
}

function StackLogos({ t }: { t: HomeCopy }) {
  const l = useHref();
  return (
    <CatalogSection alt>
      <div className="section-head center">
        <span className="eyebrow">{t.stack.eyebrow}</span>
        <h2 className="h2" style={{ fontSize: "clamp(24px,3vw,34px)" }}>
          {t.stack.heading}
        </h2>
        <p className="lead" style={{ marginTop: 10 }}>
          {t.stack.lead}
        </p>
      </div>

      {/* Model gets a full-width card — BYO model is the #1 integration */}
      <div className="card" style={{ marginTop: 8, padding: 20 }}>
        <GroupLabel label={t.stack.model} right={t.stack.byo} />
        <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 8 }}>
          {MODEL_ITEMS.map((item) => (
            <StackPill key={item} label={item} />
          ))}
        </div>
      </div>

      <div className="grid grid-3" style={{ marginTop: 20 }}>
        {t.stack.groups.map((label, i) => (
          <div key={label} className="card" style={{ padding: 20 }}>
            <GroupLabel label={label} />
            <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 8 }}>
              {STACK_ITEMS[i].map((item) => (
                <StackPill key={item} label={item} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center", marginTop: 28 }}>
        <a className="link-arrow" href={l("/integrations/")}>
          {t.stack.seeAll} <ArrowRight size={15} />
        </a>
      </div>
    </CatalogSection>
  );
}

/* ------------------------------- Closing CTA ------------------------------ */
function ClosingCta({ t }: { t: HomeCopy }) {
  return (
    <section className="section">
      <div className="container">
        <div
          className="card"
          style={{
            textAlign: "center",
            padding: "56px 32px",
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
            <a className="btn btn-primary btn-lg" href={STUDIO_URL}>
              {t.closing.cta} <ArrowRight size={17} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function App() {
  const t = useT(HOME);
  const l = useHref();
  return (
    <SiteLayout>
      <Hero t={t} />
      <SocialProofBar t={t} />
      <ProblemSolution t={t} />
      <ThreeLayers t={t} />
      <Lifecycle t={t} />
      <UseCases t={t} />
      <Surfaces t={t} />
      <StackLogos t={t} />
      <FAQ items={t.faq.items} currentUrl="/" lead={t.faq.lead} />
      <div className="container" style={{ textAlign: "center", marginTop: -8 }}>
        <a className="link-arrow" href={l("/faq/")}>
          {t.faq.browseAll} <ArrowRight size={15} />
        </a>
      </div>
      <ClosingCta t={t} />
    </SiteLayout>
  );
}
