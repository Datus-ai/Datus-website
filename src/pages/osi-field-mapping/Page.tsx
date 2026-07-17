import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import SiteLayout from "../../components/SiteLayout";
import Breadcrumb from "../../components/Breadcrumb";
import FAQ from "../../components/FAQ";
import { DOCS_URL } from "../../config/nav";
import {
  CatalogSection,
  InlineCode,
  SectionHead,
  toneAt,
} from "../../components/catalog";
import {
  OSI_MAPPING_COLUMNS,
  OSI_DATASET_ROWS,
  OSI_DIMENSIONS_ROWS,
  OSI_METRICS_ROWS,
  OSI_RELATIONSHIPS_ROWS,
  OSI_TIME_ROWS,
  OSI_AI_CONTEXT_ROWS,
  type MappingRow,
} from "./data";
import { osiFieldMappingFaq } from "./faq";

/* -------------------------------------------------------------------------- */
/*  Presentation helpers                                                       */
/* -------------------------------------------------------------------------- */

const [OSI_COL, ...PRODUCT_COLS] = OSI_MAPPING_COLUMNS;

/** Dotted-underline internal link (design's use-case link style). */
function L({ href, children, external }: { href: string; children: ReactNode; external?: boolean }) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      style={{
        color: "var(--brand-bright)",
        textDecoration: "underline",
        textDecorationStyle: "dotted",
        textUnderlineOffset: 2,
      }}
    >
      {children}
    </a>
  );
}

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
/*  Layer sections                                                             */
/* -------------------------------------------------------------------------- */

type Layer = {
  id: string;
  filename: string;
  title: string;
  description: string;
  rows: MappingRow[];
  commentary: ReactNode;
};

const LAYERS: Layer[] = [
  {
    id: "dataset",
    filename: "osi-dataset-mapping.yaml",
    title: "1 · Dataset Layer (tables & sources)",
    description:
      "How each product names the physical table that backs a semantic object, and how OSI unifies those names under dataset.name + dataset.source.",
    rows: OSI_DATASET_ROWS,
    commentary: (
      <>
        The name of a semantic object varies wildly across tools — <strong>cube</strong>,{" "}
        <strong>view</strong>, <strong>semantic_model</strong>, a raw SQL alias — but every product
        ultimately points at one physical table. OSI collapses that into two fields:{" "}
        <strong>dataset.name</strong> for the logical identifier your metrics reference, and{" "}
        <strong>dataset.source</strong> for the exact table binding downstream consumers hit.
      </>
    ),
  },
  {
    id: "dimensions",
    filename: "osi-dimensions-mapping.yaml",
    title: "2 · Dimensions Layer (fields & attributes)",
    description:
      "Field-level metadata: names, expressions, labels, descriptions, and the two pieces most products lack — a time flag and an AI-context slot.",
    rows: OSI_DIMENSIONS_ROWS,
    commentary: (
      <>
        OSI's <strong>fields[].expression.dialects[]</strong> is the one place multi-dialect SQL can
        live natively — MetricFlow, Cube and LookML each assume a single dialect. And{" "}
        <strong>fields[].dimension.is_time</strong> is the only cross-product flag any consumer can
        rely on for time dimensions: no more sniffing LookML's <em>dimension_group</em>,
        MetricFlow's <em>type: time</em>, and Snowflake's raw SQL to guess the same thing three
        different ways.
      </>
    ),
  },
  {
    id: "metrics",
    filename: "osi-metrics-mapping.yaml",
    title: "3 · Metrics Layer (measures & aggregations)",
    description:
      "How each product describes aggregations, filters, and derived metrics — and how OSI pulls the aggregation out of the SQL string into a first-class field.",
    rows: OSI_METRICS_ROWS,
    commentary: (
      <>
        Snowflake Semantic Views and GoodData embed the aggregation inside the expression string (
        <InlineCode>AS SUM(...)</InlineCode>, <InlineCode>SELECT SUM({"{fact}"})</InlineCode>). OSI
        moves it out to <strong>metrics[].aggregation</strong> so agents and BI tools can reason
        about the operation without parsing SQL. Derived metrics that reference other metrics are
        preserved verbatim through <strong>metrics[].expression</strong>.
      </>
    ),
  },
  {
    id: "relationships",
    filename: "osi-relationships-mapping.yaml",
    title: "4 · Relationships Layer (joins)",
    description:
      "Where joins are declared and where they must be inferred. OSI hoists them into a first-class relationships[] block.",
    rows: OSI_RELATIONSHIPS_ROWS,
    commentary: (
      <>
        This is the most inconsistent layer across the six products. MetricFlow and AtScale derive
        joins from <em>entities</em> / <em>level bindings</em>; Cube and LookML declare them inline;
        Snowflake and GoodData sit in between. OSI's <strong>relationships[]</strong> block gives
        every consumer the same four fields — name, from_dataset, to_dataset, foreign_key — plus
        explicit <strong>cardinality</strong>, which only Cube and LookML currently declare.
      </>
    ),
  },
  {
    id: "time",
    filename: "osi-time-mapping.yaml",
    title: "5 · Time Semantics Layer (granularity)",
    description:
      "How each product marks a time dimension and expresses granularity. OSI's is_time + granularity is the smallest common denominator.",
    rows: OSI_TIME_ROWS,
    commentary: (
      <>
        LookML's <strong>dimension_group</strong> with <em>timeframes</em> is the most complete;
        Snowflake leaves time entirely to SQL. OSI collapses this into a single time field with{" "}
        <strong>is_time: true</strong> and a <strong>granularity</strong> value — downstream tools
        that want day / week / month / quarter / year can generate them from the base field plus
        granularity metadata, so nothing is lost and every consumer can test one flag.
      </>
    ),
  },
  {
    id: "ai-context",
    filename: "osi-ai-context-mapping.yaml",
    title: "6 · AI Context Layer (OSI's differentiator)",
    description:
      "The one layer where OSI leads the ecosystem. Only Snowflake Semantic Views has native equivalents today.",
    rows: OSI_AI_CONTEXT_ROWS,
    commentary: (
      <>
        This is the layer OSI was built for. Snowflake shipped <strong>WITH SYNONYMS</strong>,{" "}
        <strong>AI_SQL_GENERATION</strong> and <strong>AI_VERIFIED_QUERIES</strong> in 2026 — and no
        other mainstream semantic layer has an equivalent yet. OSI standardizes those hints into{" "}
        <strong>ai_context</strong> on every field and metric, so an agent reading OSI can find
        synonyms, natural-language names and verified sample queries the same way whether the source
        stack is Snowflake, Cube or a home-grown YAML store. When downstream tools adopt OSI, the
        AI-grounding metadata travels with the metric — instead of being locked inside one vendor's
        SQL dialect.
      </>
    ),
  },
];

const USE_CASES: { id: string; title: string; description: ReactNode }[] = [
  {
    id: "one-metric-every-tool",
    title: "One metric definition across every BI tool",
    description: (
      <>
        OSI turns <InlineCode>metrics[].aggregation</InlineCode>, <InlineCode>fields[]</InlineCode>{" "}
        and <InlineCode>relationships[]</InlineCode> into a vendor-neutral contract. The same revenue
        or retention definition ships to Cube, Looker, Metabase and a Python notebook without silent
        drift. Validate conversions in the <L href="/tools/osi-playground/">OSI Playground</L>.
      </>
    ),
  },
  {
    id: "ground-ai-agents",
    title: "Ground AI agents in business semantics",
    description: (
      <>
        Synonyms, natural-language labels and verified sample queries live in{" "}
        <InlineCode>ai_context</InlineCode> on every field and metric.{" "}
        <L href="/chatbot/">Datus-Chat</L> and the <L href="/models/">model layer</L> read the same
        grounding, so "ARR" resolves to annual recurring revenue — not an airport code.
      </>
    ),
  },
  {
    id: "move-between-layers",
    title: "Move between semantic layers without rewriting",
    description: (
      <>
        Author in MetricFlow, Cube or LookML, then export to OSI as the shared interchange.{" "}
        <L href={DOCS_URL} external>Data engineers</L> keep their source-of-truth tool while
        downstream consumers read one consistent schema — generated and reviewed from the{" "}
        <L href="/products/cli/">CLI</L>.
      </>
    ),
  },
  {
    id: "catch-drift-early",
    title: "Catch schema drift before dashboards break",
    description: (
      <>
        Diff two OSI files to see exactly which <InlineCode>dataset.source</InlineCode>,{" "}
        <InlineCode>relationships[]</InlineCode> or <InlineCode>metrics[].filter</InlineCode> changed.
        Governance checks run against the spec from the <L href="/products/cli/">CLI</L>, not against
        vendor-specific YAML. See how this fits into <L href={DOCS_URL} external>Datus features</L>.
      </>
    ),
  },
];

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function OsiFieldMappingPage() {
  return (
    <SiteLayout>
      <Breadcrumb
        currentUrl="/osi-field-mapping/"
        items={[
          { label: "Home", href: "/" },
          { label: "OSI Field Mapping" },
        ]}
      />

      {/* Hero */}
      <section className="section" style={{ paddingTop: 72, paddingBottom: 40 }}>
        <div className="container" style={{ maxWidth: 900 }}>
          <span className="eyebrow">OSI Field Mapping</span>
          <h1
            style={{
              fontSize: "clamp(32px,4.6vw,52px)",
              lineHeight: 1.06,
              letterSpacing: "-0.03em",
              fontWeight: 750,
              margin: "20px 0 0",
            }}
          >
            OSI Field Mapping: every semantic layer, one spec
          </h1>
          <p className="lead" style={{ maxWidth: 720 }}>
            A field-by-field reference of how MetricFlow, Cube, LookML, AtScale, Snowflake Semantic
            Views, GoodData, Power BI and Databricks Metric Views translate onto the Open Semantic
            Interchange schema — the vendor-neutral wire format for the modern semantic layer.
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
            <span>OSI v0.2.0.dev0</span>
            <span>·</span>
            <span>8 products</span>
            <span>·</span>
            <span>Apache 2.0</span>
          </div>
        </div>
      </section>

      {/* Layer sections */}
      {LAYERS.map((layer, i) => (
        <CatalogSection key={layer.id} alt={i % 2 === 0}>
          <div id={layer.id} style={{ scrollMarginTop: 90 }}>
            <SectionHead eyebrow={`Layer ${i + 1}`} title={layer.title} lead={layer.description} />
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
      <CatalogSection alt={LAYERS.length % 2 === 0}>
        <SectionHead
          eyebrow="Use cases"
          title="What OSI enables for data teams"
          lead="Four patterns teams unlock once their semantic layer speaks one vendor-neutral format — from the terminal to the chat interface."
        />
        <div className="grid grid-2">
          {USE_CASES.map((u, i) => (
            <div key={u.id} id={u.id} className="card" style={{ display: "flex", flexDirection: "column", scrollMarginTop: 90 }}>
              <div style={{ height: 6, width: 40, borderRadius: 3, background: toneAt(i), marginBottom: 16 }} />
              <h3 className="card__title">{u.title}</h3>
              <div className="card__body">{u.description}</div>
            </div>
          ))}
        </div>
      </CatalogSection>

      {/* FAQ */}
      <FAQ
        items={osiFieldMappingFaq}
        currentUrl="/osi-field-mapping/"
        lead="LookML, Snowflake AI context, Cube joins, dimension_group timeframes, round-tripping and MAQL — how OSI handles each."
      />

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
              Try the OSI Playground.
            </h2>
            <p className="lead" style={{ marginInline: "auto", maxWidth: 620 }}>
              Paste your MetricFlow YAML, get OSI back — validation, conversion and diff all run in
              your browser.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginTop: 26 }}>
              <a className="btn btn-lg btn-primary" href="/tools/osi-playground/">
                Open OSI Playground <ArrowRight size={17} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
