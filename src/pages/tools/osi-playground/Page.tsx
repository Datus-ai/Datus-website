import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import SiteLayout from "../../../components/SiteLayout";
import Breadcrumb from "../../../components/Breadcrumb";
import FAQ from "../../../components/FAQ";
import { DOCS_URL } from "../../../config/nav";
import {
  CatalogSection,
  FeatureCard,
  InlineCode,
  SectionHead,
  SpecTable,
  toneAt,
} from "../../../components/catalog";
import { OsiPlayground } from "../../../components/tools/OsiPlayground";
import { OSI_MAPPING_ROWS, OSI_VS_ROWS } from "./data";
import { osiPlaygroundFaq } from "./faq";

/* -------------------------------------------------------------------------- */
/*  Content                                                                    */
/* -------------------------------------------------------------------------- */

const HOW_TO_STEPS = [
  {
    title: "Paste your MetricFlow YAML",
    description:
      "Drop your semantic_models file into the input on the left. The Playground parses locally — nothing leaves your browser.",
  },
  {
    title: "Convert to OSI",
    description:
      "Open the Converter tab, click Download, and you have an OSI-compatible .yml file ready to hand to any OSI-aware tool.",
  },
  {
    title: "Diff and validate",
    description:
      "Use the Diff tab to see exactly what changed, then the Validator to confirm the output matches OSI v0.2 before you commit it.",
  },
];

const WHY_MATTERS: { title: string; description: string }[] = [
  {
    title: "One definition, every tool",
    description:
      "Define 'weekly active users' once. Snowflake Cortex, Cube, Looker and the Datus agent all read the same OSI file — no more three answers for the same question.",
  },
  {
    title: "AI agents that don't hallucinate metrics",
    description:
      "OSI is the missing grounding layer for LLM copilots. When your agent reads OSI, it stops inventing join keys and starts quoting the semantic layer verbatim.",
  },
  {
    title: "Zero-lock migration path",
    description:
      "Author metrics in dbt MetricFlow today, export to OSI, and consume them from any downstream tool tomorrow. The interchange format decouples authoring from consumption.",
  },
  {
    title: "Governance stays where it belongs",
    description:
      "Reviewed pull requests, lineage and ownership live in the source YAML. OSI carries the same names into every consumer, so downstream tools show the same governance metadata.",
  },
];

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Convert MetricFlow YAML to Open Semantic Interchange",
  description:
    "Free browser-based workflow to validate, convert and diff a MetricFlow semantic layer into OSI YAML using the Datus Playground.",
  step: HOW_TO_STEPS.map((s, i) => ({
    "@type": "HowToStep",
    position: i + 1,
    name: s.title,
    text: s.description,
  })),
};

const ldJson = (obj: unknown) => JSON.stringify(obj).replace(/</g, "\\u003c");

function Prose({ children }: { children: ReactNode }) {
  return (
    <p style={{ fontSize: 15, lineHeight: 1.75, color: "var(--ink-muted)", margin: 0 }}>{children}</p>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function OsiPlaygroundPage() {
  return (
    <SiteLayout>
      <Breadcrumb
        currentUrl="/tools/osi-playground/"
        items={[
          { label: "Home", href: "/" },
          { label: "Tools", noSchema: true },
          { label: "OSI Playground" },
        ]}
      />

      {/* Hero */}
      <section className="section" style={{ paddingTop: 72, paddingBottom: 32 }}>
        <div className="container" style={{ maxWidth: 900 }}>
          <span className="eyebrow">OSI Playground</span>
          <h1
            style={{
              fontSize: "clamp(32px,4.6vw,52px)",
              lineHeight: 1.06,
              letterSpacing: "-0.03em",
              fontWeight: 750,
              margin: "20px 0 0",
            }}
          >
            The Open-Source OSI Playground for MetricFlow
          </h1>
          <p className="lead" style={{ maxWidth: 720 }}>
            Validate MetricFlow YAML against the Open Semantic Interchange spec, convert it to OSI in
            one click, and diff the two formats side-by-side. Runs entirely in your browser — no
            upload, no signup.
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
            <span>Browser-only</span>
            <span>·</span>
            <span>Apache 2.0</span>
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
          <SectionHead
            eyebrow="Overview"
            title="What Is the Open Semantic Interchange?"
            lead="OSI is a vendor-neutral YAML specification for semantic-layer metadata — a shared way for warehouses, BI tools and AI agents to talk about the same metric without redefining it in every product."
          />
          <div style={{ display: "grid", gap: 16 }}>
            <Prose>
              Launched in 2025 by Snowflake, dbt Labs, Salesforce, ThoughtSpot and other members of
              the modern data stack, OSI standardizes how <strong>entities</strong>,{" "}
              <strong>dimensions</strong>, <strong>metrics</strong> and <strong>join keys</strong>{" "}
              are described. Once a metric like <em>revenue</em> is defined in OSI, Cortex, Cube,
              Looker, AtScale and Datus can all read the same source of truth.
            </Prose>
            <Prose>
              The current draft is <strong>v0.2.0.dev0</strong>. It targets an eventual 1.0 alongside
              production adoption in Snowflake Cortex and dbt semantic-layer exports.
            </Prose>
          </div>
        </div>
      </CatalogSection>

      {/* FIELD MAPPING */}
      <CatalogSection>
        <SectionHead
          eyebrow="Mapping"
          title="MetricFlow → OSI Field Mapping"
          lead="How every MetricFlow construct is translated into the OSI core schema. The Converter above uses exactly this table — nothing hidden. See the full 8-product mapping in the OSI Field Mapping reference."
        />
        <SpecTable
          filename="metricflow-to-osi.yaml"
          columns={[{ label: "MetricFlow" }, { label: "OSI" }, { label: "Notes" }]}
          rows={OSI_MAPPING_ROWS}
        />
        <p style={{ marginTop: 16, fontSize: 14, color: "var(--ink-muted)" }}>
          Want every product side-by-side?{" "}
          <a
            href="/osi-field-mapping/"
            style={{
              color: "var(--brand-bright)",
              textDecoration: "underline",
              textDecorationStyle: "dotted",
              textUnderlineOffset: 2,
            }}
          >
            Read the OSI Field Mapping reference
          </a>{" "}
          — MetricFlow, Cube, LookML, AtScale, Snowflake, GoodData, Power BI and Databricks across
          six layers.
        </p>
      </CatalogSection>

      {/* HOW-TO */}
      <CatalogSection alt>
        <SectionHead
          eyebrow="How to"
          title="How to Convert MetricFlow to OSI"
          lead="Three steps, browser only — no CLI to install, no key to paste."
        />
        <div className="grid grid-3">
          {HOW_TO_STEPS.map((step, i) => (
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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldJson(howToJsonLd) }} />
      </CatalogSection>

      {/* WHY IT MATTERS */}
      <CatalogSection>
        <SectionHead
          eyebrow="Why it matters"
          title="Why an Open Semantic Standard Matters"
          lead="Four concrete wins your data team gets the day a metric definition stops living inside a single vendor's YAML."
        />
        <div className="grid grid-2">
          {WHY_MATTERS.map((w, i) => (
            <FeatureCard key={w.title} tone={toneAt(i)} title={w.title} body={w.description} />
          ))}
        </div>
      </CatalogSection>

      {/* COMPARISON TABLE */}
      <CatalogSection alt>
        <SectionHead
          eyebrow="Comparison"
          title="OSI vs MetricFlow vs Cube"
          lead="Interchange formats, engines and platforms solve different problems. Here is where each one fits."
        />
        <SpecTable
          filename="osi-vs-metricflow-vs-cube.yaml"
          columns={[{ label: "Dimension" }, { label: "OSI" }, { label: "MetricFlow" }, { label: "Cube" }]}
          rows={OSI_VS_ROWS}
        />
      </CatalogSection>

      {/* FAQ */}
      <FAQ
        items={osiPlaygroundFaq}
        currentUrl="/tools/osi-playground/"
        lead="What OSI is, how the converter works, whether your YAML stays local, and how Datus uses OSI internally."
      />

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
              Let a data engineering agent read your OSI.
            </h2>
            <p className="lead" style={{ marginInline: "auto", maxWidth: 640 }}>
              Datus grounds every SQL query, pipeline and dashboard answer in your semantic layer —
              OSI, MetricFlow, Cube or LookML, take your pick.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginTop: 26 }}>
              <a className="btn btn-lg btn-primary" href={DOCS_URL} target="_blank" rel="noopener noreferrer">
                See Datus features <ArrowRight size={17} />
              </a>
              <a className="btn btn-lg btn-ghost" href="/osi-field-mapping/">
                OSI field mapping <ArrowRight size={17} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
