import {
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  Github,
  Sparkles,
  Star,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import SiteLayout from "./components/SiteLayout";
import RotatingPrompt from "./components/RotatingPrompt";
import { EnterpriseInquiryDialog } from "./components/EnterpriseInquiryDialog";
import { LifecycleOrbit } from "./components/LifecycleOrbit";
import { SurfaceCarousel, type Surface } from "./components/SurfaceCarousel";
import FAQ, { type FaqItem } from "./components/FAQ";
import {
  CatalogSection,
  FeatureCard,
  Mark,
  panelBg,
  sectionBorder,
  toneAt,
} from "./components/catalog";
import { GITHUB_URL, STUDIO_URL } from "./config/nav";
import { formatStarCount, useGitHubStars } from "./hooks/useGitHubStars";

/* --------------------------- Inline anchor link --------------------------- */
/** Subtle in-copy internal link — used to weave anchor text to related pages. */
function A({ href, external, children }: { href: string; external?: boolean; children: ReactNode }) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      style={{ color: "var(--brand-bright)", textDecoration: "underline", textUnderlineOffset: 2 }}
    >
      {children}
    </a>
  );
}

/* ---------------------------------- Hero ---------------------------------- */
const INSTALL_CMD = "curl -fsSL https://datus.ai/install.sh | sh";

/** The install command, click to copy, with a brief confirmation. */
function CopyCommand() {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      title="Copy install command"
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

function Hero() {
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
              <Sparkles size={13} /> Open source · Apache-2.0
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
              The Open-Source{" "}
              <span className="grad-text">Data Engineering Agent</span>
            </h1>
            <p className="lead" style={{ maxWidth: 560 }}>
              Datus is the open-source data engineering agent for the modern data
              stack — one AI data engineering agent that connects your warehouse,
              catalog, semantic layer and BI, grounded in an evolvable context
              engine your team owns. Apache 2.0 · self-host or free playground.
            </p>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 28 }}>
              <a className="btn btn-primary btn-lg" href={STUDIO_URL}>
                Get started, free <ArrowRight size={17} />
              </a>
              <a
                className="btn btn-ghost btn-lg"
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github size={17} />
                Star on GitHub
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
                  Building for a team? Contact us <ArrowRight size={15} />
                </button>
              </EnterpriseInquiryDialog>
            </div>
          </div>

          <HeroTerminal />
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
          <CopyCommand />
          <span style={{ whiteSpace: "nowrap", display: "inline-flex", alignItems: "center", gap: 6 }}>
            <CheckCircle2 size={13} style={{ color: "var(--term-green)", flexShrink: 0 }} /> Bring your own <A href="/databases/">warehouse</A>
          </span>
          <span style={{ whiteSpace: "nowrap", display: "inline-flex", alignItems: "center", gap: 6 }}>
            <CheckCircle2 size={13} style={{ color: "var(--term-green)", flexShrink: 0 }} /> Bring your own <A href="/models/">model</A>
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

function HeroTerminal() {
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
        <div className="term__line term__dim">
          ↳ connected · indexed schemas · semantic model · context initialized
        </div>
        <div className="term__line term__ok">
          ✓ context engine ready, schemas, metrics, validated SQL
        </div>
        <div className="term__line" style={{ marginTop: 10 }}>
          <RotatingPrompt />
        </div>
        <div className="term__line term__dim" style={{ marginTop: 10, whiteSpace: "nowrap", fontSize: 11.5 }}>
          plan → generate → validate → review → ship
          <span className="term__cy"> · captured to memory</span>
        </div>
        <div className="term__line term__am" style={{ marginTop: 10, whiteSpace: "nowrap", fontSize: 11.5 }}>
          ↻ self-evolve, extract &amp; update knowledge from feedback &amp; benchmark
        </div>
        <div className="term__line term__dim" style={{ fontSize: 11.5 }}>
          · subagent-level memory
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ Social proof ------------------------------ */
function SocialProofBar() {
  const stars = useGitHubStars();
  const items = [
    { value: `${formatStarCount(stars)}+`, label: "GitHub stars" },
    { value: "Apache 2.0", label: "Open source" },
    { value: "Self-host · Cloud", label: "Your infra or ours" },
    { value: "Built by DEs", label: "For data engineering teams" },
  ];
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
const PROBLEM_ROWS: { problem: string; solution: ReactNode }[] = [
  {
    problem: "Copilots answer, they don't execute",
    solution: "One data engineering agent that plans, runs, validates and deploys real work",
  },
  {
    problem: "NL2SQL hallucinates joins and metrics",
    solution: "Grounded in an evolvable context engine — the memory layer every data engineering agent needs",
  },
  {
    problem: "Five glued-together tools still miss the context",
    solution: (
      <>
        <A href="/products/cli/">One client</A>, one memory, one autonomous data engineering
        operator across the stack
      </>
    ),
  },
];

function ProblemSolution() {
  return (
    <CatalogSection>
      <div className="section-head center">
        <span className="eyebrow">Why Datus</span>
        <h2 className="h2" style={{ fontSize: "clamp(24px,3vw,34px)" }}>
          Why Teams Switch to a <Mark tone="var(--term-cyan)">Data Engineering Agent</Mark>
        </h2>
        <p className="lead" style={{ marginTop: 10 }}>
          Copilots and NL2SQL solve one prompt at a time. A data engineering agent owns the
          lifecycle — plan, write, run, validate, deploy, monitor.
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
            The problem
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
            Datus Agent
          </div>
          {PROBLEM_ROWS.map((r, i) => {
            const last = i === PROBLEM_ROWS.length - 1;
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
const LAYERS = [
  {
    name: "Delivery",
    caption: "How teams reach the agent",
    chips: ["CLI", "Studio", "Chatbot", "MCP"],
    width: "78%",
  },
  {
    name: "Intelligence",
    caption: "How the agent thinks",
    chips: ["Subagents", "Planner", "Reviewer", "Skills"],
    width: "90%",
  },
  {
    name: "Data Layer",
    caption: "What the agent stands on",
    chips: ["Context Engine", "Tree + Vector Memory", "Lineage", "Semantic"],
    width: "100%",
  },
];

function LayerStack() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      {LAYERS.map((layer, i) => {
        const tone = toneAt(i);
        return (
          <div
            key={layer.name}
            className="card"
            style={{
              width: layer.width,
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
                L{LAYERS.length - i}
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

function ThreeLayers() {
  return (
    <CatalogSection alt>
      <div className="split-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "center" }}>
        <div>
          <span className="eyebrow">Architecture</span>
          <h2 className="h2" style={{ fontSize: "clamp(24px,3vw,34px)" }}>
            A Data Engineering Agent in <Mark tone="var(--term-amber)">Three Layers</Mark>
          </h2>
          <p className="lead" style={{ marginTop: 10 }}>
            Delivery on top, Intelligence in the middle, a Data Layer underneath. Three stacked
            layers that turn Datus from a chat wrapper into a{" "}
            <A href="/products/enterprise/">production-ready data engineering agent</A>.
          </p>
        </div>
        <LayerStack />
      </div>
    </CatalogSection>
  );
}

/* ------------------------------- Lifecycle -------------------------------- */
function Lifecycle() {
  return (
    <CatalogSection>
      <div className="split-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "center" }}>
        <LifecycleOrbit />
        <div>
          <span className="eyebrow">Lifecycle</span>
          <h2 className="h2" style={{ fontSize: "clamp(24px,3vw,34px)" }}>
            Agentic Data Engineering Across the <Mark tone="var(--term-cyan)">Full Lifecycle</Mark>
          </h2>
          <p className="lead" style={{ marginTop: 10 }}>
            From SQL development to monitoring — eight lifecycle phases orbit one Datus agent,
            giving your team autonomous data engineering in a{" "}
            <A href="/products/studio/">single, always-in-context workflow</A>.
          </p>
        </div>
      </div>
    </CatalogSection>
  );
}

/* ------------------------------- Use cases -------------------------------- */
const USE_CASES: { title: string; body: ReactNode }[] = [
  {
    title: "Ad-Hoc Analytics Without the SQL Bottleneck",
    body: (
      <>
        Analysts ask business questions in natural language. The data engineering agent grounds each
        query in your <A href="/integrations/">catalog</A> and metric definitions, then returns
        validated SQL plus the numbers — no waiting on a data engineer.
      </>
    ),
  },
  {
    title: "Production Pipelines That Stay in Context",
    body: (
      <>
        Engineers draft, review and deploy dbt-style models with an agent that already knows the
        warehouse, lineage and past failures. Reviews shrink from days to a working session.
      </>
    ),
  },
  {
    title: "Self-Serve BI Grounded in the Semantic Layer",
    body: (
      <>
        The Datus agent reads your semantic layer and BI metrics, so answers in Slack, Feishu or
        Studio match what leadership sees in dashboards. One source of truth, many surfaces.
      </>
    ),
  },
  {
    title: "Data Quality and Monitoring on Autopilot",
    body: (
      <>
        The data engineering agent watches freshness, schema drift and metric anomalies across
        pipelines, then explains what broke and proposes a fix in the same thread where the work
        happens.
      </>
    ),
  },
];

function UseCases() {
  return (
    <CatalogSection alt>
      <div className="section-head center">
        <span className="eyebrow">Use cases</span>
        <h2 className="h2" style={{ fontSize: "clamp(24px,3vw,34px)" }}>
          What Teams <Mark tone="var(--term-amber)">Actually Ship</Mark> With Datus
        </h2>
        <p className="lead" style={{ marginTop: 10 }}>
          Four workflows that show up on day one — same data engineering agent, same context,
          different jobs to be done.
        </p>
      </div>
      <div className="grid grid-2" style={{ marginTop: 8 }}>
        {USE_CASES.map((u, i) => (
          <FeatureCard key={u.title} tone={toneAt(i)} title={u.title} body={u.body} />
        ))}
      </div>
    </CatalogSection>
  );
}

/* -------------------------------- Surfaces -------------------------------- */
const SURFACES: Surface[] = [
  {
    id: "studio",
    name: "Studio",
    tagline: (
      <>
        A <A href="/products/studio/">managed cloud workspace</A> where data teams chat with their
        warehouse directly in the browser. Schema-aware suggestions, shared notebooks, and one-click
        result exports mean anyone can explore data without installing a thing.
      </>
    ),
    start: "open studio.datus.ai",
  },
  {
    id: "cli",
    name: "CLI",
    tagline: (
      <>
        An <A href="/products/cli/">interactive terminal REPL</A> built for data engineers who live
        in the shell. Install with pip, authenticate once, and run natural-language queries, SQL
        diffs, and batch jobs straight from your command line or CI pipeline.
      </>
    ),
    start: "pip install datus-agent",
  },
  {
    id: "chatbot",
    name: "Chatbot",
    tagline: (
      <>
        Embed the agent in Slack, Feishu, or Microsoft Teams so every channel becomes a{" "}
        <A href="/integrations/">self-serve data interface</A>. Ask questions in plain language, get
        charts and summaries back, and approve or schedule follow-ups without leaving the
        conversation.
      </>
    ),
    start: "/datus in Slack",
  },
  {
    id: "mcp",
    name: "MCP Server",
    tagline: (
      <>
        Expose your entire Datus context and toolset over the{" "}
        <A href="/integrations/">Model Context Protocol</A>. Plug it into Claude, Cursor, or Windsurf
        so your AI assistant understands your warehouse schema, metrics, and policies without
        constant copy-paste.
      </>
    ),
    start: "datus mcp serve",
  },
];

function Surfaces() {
  return (
    <CatalogSection>
      <div className="section-head center">
        <span className="eyebrow">Get started</span>
        <h2 className="h2" style={{ fontSize: "clamp(24px,3vw,34px)" }}>
          One Agent, Four <Mark tone="var(--term-green)">Surfaces to Pick From</Mark>
        </h2>
        <p className="lead" style={{ marginTop: 10 }}>
          Same data engineering agent, same context — four surfaces (Studio, CLI, Chatbot, MCP) so
          every data engineer can start where they already work.
        </p>
      </div>
      <SurfaceCarousel items={SURFACES} />
    </CatalogSection>
  );
}

/* ------------------------------ Stack logos ------------------------------- */
const MODEL_GROUP = {
  label: "Model",
  items: ["OpenAI", "Anthropic", "Gemini", "DeepSeek", "Qwen", "Ollama", "Bedrock"],
};

const STACK_GROUPS: { label: string; items: string[] }[] = [
  { label: "Warehouse", items: ["Snowflake", "BigQuery", "Redshift", "Postgres", "DuckDB"] },
  { label: "Modeling", items: ["dbt", "SQLMesh"] },
  { label: "Semantic Layer", items: ["Cube", "dbt Semantic Layer", "LookML"] },
  { label: "Catalog", items: ["DataHub", "OpenMetadata", "Unity Catalog"] },
  { label: "BI", items: ["Metabase", "Superset", "Tableau"] },
  { label: "Orchestration", items: ["Airflow", "Dagster", "Prefect"] },
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

function StackLogos() {
  return (
    <CatalogSection alt>
      <div className="section-head center">
        <span className="eyebrow">Integrations</span>
        <h2 className="h2" style={{ fontSize: "clamp(24px,3vw,34px)" }}>
          Works With Your <Mark tone="var(--term-pink)">Modern Data Stack</Mark>
        </h2>
        <p className="lead" style={{ marginTop: 10 }}>
          Point the Datus data engineering agent at what you already run. Governance and dialect
          handling for every warehouse ship in the box.
        </p>
      </div>

      {/* Model gets a full-width card — BYO model is the #1 integration */}
      <div className="card" style={{ marginTop: 8, padding: 20 }}>
        <GroupLabel label={MODEL_GROUP.label} right="BYO" />
        <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 8 }}>
          {MODEL_GROUP.items.map((item) => (
            <StackPill key={item} label={item} />
          ))}
        </div>
      </div>

      <div className="grid grid-3" style={{ marginTop: 20 }}>
        {STACK_GROUPS.map((g) => (
          <div key={g.label} className="card" style={{ padding: 20 }}>
            <GroupLabel label={g.label} />
            <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 8 }}>
              {g.items.map((item) => (
                <StackPill key={item} label={item} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center", marginTop: 28 }}>
        <a className="link-arrow" href="/integrations/">
          See all integrations <ArrowRight size={15} />
        </a>
      </div>
    </CatalogSection>
  );
}

/* ---------------------------------- FAQ ----------------------------------- */
const HOME_FAQS: FaqItem[] = [
  {
    q: "What is a data engineering agent?",
    a: "A data engineering agent is an AI system that owns data work end to end — not just answering questions, but planning, writing SQL, running pipelines, validating results, deploying models and monitoring what it shipped. Unlike a text-to-SQL copilot, a data engineering agent is grounded in your warehouse, catalog and semantic layer, and it keeps that context across every run.",
  },
  {
    q: "What is Datus and how is it different from a text-to-SQL chatbot?",
    a: "Datus is the open-source data engineering agent. A chatbot stops at translating a prompt into SQL. The Datus agent orchestrates Catalog, SQL, Pipeline and BI subagents on a shared context engine to plan, run, validate, deploy and monitor real data work end to end.",
  },
  {
    q: "Why does a data engineering agent need an evolvable context engine?",
    a: "Without grounded context, any data engineering agent will hallucinate joins and metrics. Datus captures historical SQL, table structures, metrics and semantic definitions, stores them in a dual Tree + Vector memory, and incrementally refines that context from real usage — every run makes the next answer more accurate.",
  },
  {
    q: "How do I try the Datus data engineering agent — Studio, CLI, Chatbot or MCP?",
    a: "Studio is the free hosted playground in your browser. Data engineers usually start with the CLI for terminal-native workflows. The Chatbot embeds the data engineering agent in Slack or Feishu, and the MCP server plugs Datus context into Claude, Cursor or Windsurf. All four surfaces share the same agent and context engine.",
  },
  {
    q: "Is the open-source Datus agent really free?",
    a: "Yes. The open-source Datus data engineering agent is Apache 2.0 and free to self-host — you bring the model and the warehouse. Datus Studio hosts the same agent in the browser as a free playground. Enterprise adds SSO, RBAC, SQL Policy and private / VPC deployment.",
  },
  {
    q: "How does Datus compare to Databricks Genie or Snowflake Cortex?",
    a: "Warehouse-native copilots are tied to one platform; open-source NL2SQL projects usually stop at query translation. Datus is a warehouse-agnostic data engineering agent that covers the full lifecycle — SQL, data quality, deployment, monitoring — with a shared context engine, not just a query layer.",
  },
  {
    q: "What can I automate with an agentic data engineering workflow?",
    a: "Anything that today ping-pongs between SQL editor, dbt project, catalog and BI. An agentic data engineering workflow can draft and review models, run and validate queries, catch schema drift, patch broken pipelines and answer stakeholder questions from the semantic layer — all in one thread, with the data engineering agent keeping context across steps.",
  },
];

/* ------------------------------- Closing CTA ------------------------------ */
function ClosingCta() {
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
            Ready to let the <Mark tone="var(--term-amber)">data engineering agent</Mark> run?
          </h2>
          <p className="lead" style={{ marginInline: "auto", maxWidth: 600 }}>
            Open Datus Studio <A href="/pricing/">free in your browser</A>, or self-host the
            open-source agent on your own warehouse in minutes.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginTop: 26 }}>
            <a className="btn btn-primary btn-lg" href={STUDIO_URL}>
              Get started <ArrowRight size={17} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function App() {
  return (
    <SiteLayout>
      <Hero />
      <SocialProofBar />
      <ProblemSolution />
      <ThreeLayers />
      <Lifecycle />
      <UseCases />
      <Surfaces />
      <StackLogos />
      <FAQ
        items={HOME_FAQS}
        currentUrl="/"
        lead="Data engineering agents, the Datus context engine, surfaces, pricing and how Datus compares."
      />
      <div className="container" style={{ textAlign: "center", marginTop: -8 }}>
        <a className="link-arrow" href="/faq/">
          Browse all FAQs <ArrowRight size={15} />
        </a>
      </div>
      <ClosingCta />
    </SiteLayout>
  );
}
