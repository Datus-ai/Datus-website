import {
  ArrowRight,
  Boxes,
  Building2,
  Check,
  CheckCircle2,
  Copy,
  Database,
  GitBranch,
  Github,
  Layers,
  RefreshCw,
  Rocket,
  ShieldCheck,
  Sparkles,
  Star,
  Terminal,
  Workflow,
} from "lucide-react";
import { useEffect, useState } from "react";
import SiteLayout from "./components/SiteLayout";
import RotatingPrompt from "./components/RotatingPrompt";
import { EnterpriseInquiryDialog } from "./components/EnterpriseInquiryDialog";
import { CONTACT_EMAIL, GITHUB_URL, STUDIO_URL } from "./config/nav";
import { formatStarCount, useGitHubStars } from "./hooks/useGitHubStars";

/* ---------------------------------- Hero ---------------------------------- */
const INSTALL_CMD = "curl -fsSL https://datus.ai/install.sh | sh";

/** The install command — click to copy, with a brief confirmation. */
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
              The open-source{" "}
              <span className="grad-text">data engineering agent</span> for
              building evolvable context.
            </h1>
            <p className="lead" style={{ maxWidth: 540 }}>
              From one-man data teams to enterprise agent teams, Datus turns data
              work into reliable, reusable agent systems — semantic-centric and
              end-to-end.
            </p>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 28 }}>
              <a className="btn btn-primary btn-lg" href={STUDIO_URL}>
                Get started — free <ArrowRight size={17} />
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
                  Building for a team? Talk to a human <ArrowRight size={15} />
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
            <CheckCircle2 size={13} style={{ color: "var(--term-green)", flexShrink: 0 }} /> Bring your own warehouse
          </span>
          <span style={{ whiteSpace: "nowrap", display: "inline-flex", alignItems: "center", gap: 6 }}>
            <CheckCircle2 size={13} style={{ color: "var(--term-green)", flexShrink: 0 }} /> Bring your own model
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
        <span className="term__title">datus-agent</span>
      </div>
      <div className="term__body">
        <div className="term__line">
          <span className="term__prompt">$ </span>
          <span className="term__cmd">datus init --warehouse </span>
          <RotatingWarehouse />
        </div>
        <div className="term__line term__dim">
          ↳ connected · indexed schemas · semantic model · context initialized
        </div>
        <div className="term__line term__ok">
          ✓ context engine ready — schemas, metrics, validated SQL
        </div>
        <div className="term__line" style={{ marginTop: 10 }}>
          <RotatingPrompt />
        </div>
        <div className="term__line term__dim" style={{ marginTop: 10, whiteSpace: "nowrap", fontSize: 11.5 }}>
          plan → generate → validate → review → ship
          <span className="term__cy"> · captured to memory</span>
        </div>
        <div className="term__line term__am" style={{ marginTop: 10, whiteSpace: "nowrap", fontSize: 11.5 }}>
          ↻ self-evolve — extract &amp; update knowledge from feedback &amp; benchmark
        </div>
        <div className="term__line term__dim" style={{ fontSize: 11.5 }}>
          · subagent-level memory
        </div>
      </div>
    </div>
  );
}

/* --------------------------------- Pillars -------------------------------- */
const PILLARS = [
  {
    icon: Rocket,
    title: "Run the modern data stack with 10× productivity",
    body: "One engineer operates the full data system across the full lifecycle, with validation loops that keep output trustworthy.",
    points: ["Full data system", "Full lifecycle", "Validation loops"],
  },
  {
    icon: RefreshCw,
    title: "Build evolvable context, for better accuracy",
    body: "Semantics become durable context. Chatbots evolve from usage, and skills improve every time the agent runs.",
    points: ["Semantics → context", "Chatbots that evolve", "Skills improve with usage"],
  },
  {
    icon: Building2,
    title: "Scale from personal productivity to enterprise agent teams",
    body: "Long-running agents with control, safety, and versioning, sharing one context knowledge graph across the team.",
    points: ["Long-running agents", "Control, safety, versioning", "Shared context graph"],
  },
];

function Pillars() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow"><Layers size={13} /> Why Datus</span>
          <h2 className="h2">Ship more data work, trust every result, scale to a team.</h2>
          <p className="lead">
            Whether you are a solo engineer or an enterprise data org, Datus is
            the same system — it just scales with you.
          </p>
        </div>
        <div className="grid grid-3">
          {PILLARS.map((p) => (
            <div className="card" key={p.title}>
              <span className="card__icon"><p.icon size={20} /></span>
              <h3 className="card__title">{p.title}</h3>
              <p className="card__body">{p.body}</p>
              <ul style={{ listStyle: "none", margin: "16px 0 0", padding: 0, display: "grid", gap: 8 }}>
                {p.points.map((pt) => (
                  <li key={pt} style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13.5, color: "var(--ink-dim)" }}>
                    <CheckCircle2 size={14} style={{ color: "var(--brand-bright)", flexShrink: 0 }} /> {pt}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- Product forms ------------------------------ */
function ProductForms() {
  return (
    <section className="section" style={{ background: "rgba(11,18,48,0.4)", borderBlock: "1px solid var(--line)" }}>
      <div className="container">
        <div className="section-head center">
          <span className="eyebrow"><Boxes size={13} /> Three ways to run Datus</span>
          <h2 className="h2">Start free. Scale when you are ready.</h2>
        </div>
        <div className="grid grid-3">
          <div className="card">
            <span className="card__icon"><Github size={20} /></span>
            <h3 className="card__title">Open Source</h3>
            <p className="card__body">
              The full Datus CLI and VS Code extension. Self-host, bring your own
              warehouse and model. Apache-2.0.
            </p>
            <a className="link-arrow" href={GITHUB_URL} target="_blank" rel="noopener noreferrer" style={{ marginTop: 18 }}>
              View on GitHub <ArrowRight size={15} />
            </a>
          </div>
          <div className="card" style={{ borderColor: "var(--brand)", boxShadow: "var(--shadow-brand)" }}>
            <span className="card__icon" style={{ background: "linear-gradient(180deg,var(--brand-bright),var(--brand))", color: "#fff" }}><Sparkles size={20} /></span>
            <h3 className="card__title">Cloud Personal — Studio</h3>
            <p className="card__body">
              The easiest way to start and explore. No install, no setup — a
              hosted Datus workspace, free during early access.
            </p>
            <a className="link-arrow" href={STUDIO_URL} style={{ marginTop: 18 }}>
              Try Studio free <ArrowRight size={15} />
            </a>
          </div>
          <div className="card">
            <span className="card__icon"><ShieldCheck size={20} /></span>
            <h3 className="card__title">Enterprise</h3>
            <p className="card__body">
              Shared context, governance, SSO, and long-running agent teams —
              deployed in your environment.
            </p>
            <EnterpriseInquiryDialog>
              <button
                className="link-arrow"
                style={{ background: "transparent", border: 0, padding: 0, marginTop: 18, cursor: "pointer", fontFamily: "inherit" }}
              >
                Contact us <ArrowRight size={15} />
              </button>
            </EnterpriseInquiryDialog>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ Integrations ------------------------------ */
const INTEGRATIONS = [
  "Snowflake", "Databricks", "PostgreSQL", "StarRocks", "ClickHouse",
  "Doris", "Greenplum", "OpenAI", "Anthropic", "DeepSeek", "Qwen",
  "MetricFlow", "Airflow", "Superset", "Grafana",
];

function Integrations() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-head center">
          <span className="eyebrow"><Database size={13} /> Works with your stack</span>
          <h2 className="h2">Plugs into the tools you already run.</h2>
          <p className="lead">
            Warehouses, models, semantic layers, schedulers and BI — connected,
            not replaced.
          </p>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
          {INTEGRATIONS.map((name) => (
            <span
              key={name}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 13.5,
                color: "var(--ink-dim)",
                padding: "9px 16px",
                borderRadius: 999,
                border: "1px solid var(--line)",
                background: "var(--panel)",
              }}
            >
              {name}
            </span>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 28 }}>
          <a className="link-arrow" href="/integrations/">
            See all integrations <ArrowRight size={15} />
          </a>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- Context --------------------------------- */
const LOOP = [
  { icon: Terminal, title: "Capture", body: "Every query, schema, metric and review becomes structured context as the agent works." },
  { icon: Database, title: "Memory", body: "Context is stored as an evolving knowledge graph — semantics, validated SQL, and skills." },
  { icon: RefreshCw, title: "Evolve", body: "The agent reuses and refines that memory, getting more accurate with every run." },
];

function Context() {
  return (
    <section className="section" style={{ background: "rgba(11,18,48,0.4)", borderBlock: "1px solid var(--line)" }}>
      <div className="container">
        <div className="section-head center">
          <span className="eyebrow"><RefreshCw size={13} /> Context that builds itself</span>
          <h2 className="h2">Capture → Memory → Evolve</h2>
          <p className="lead">
            Datus doesn't just answer once. It accumulates the context your data
            systems need to become reliable.
          </p>
        </div>
        <div className="grid grid-3">
          {LOOP.map((s, i) => (
            <div className="card" key={s.title}>
              <span className="card__icon"><s.icon size={20} /></span>
              <h3 className="card__title">
                <span style={{ fontFamily: "var(--font-mono)", color: "var(--brand-bright)", marginRight: 8 }}>0{i + 1}</span>
                {s.title}
              </h3>
              <p className="card__body">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- Differentiation ---------------------------- */
const COMPARE = [
  { vs: "vs Claude Code", line: "Coding agents write code. Datus builds and evolves the data context they need to be reliable on your warehouse." },
  { vs: "vs Cortex & Genie", line: "Platform-native agents lock you to one warehouse. Datus is open and cross-stack, with portable context." },
  { vs: "vs ChatBI", line: "ChatBI answers a question and forgets. Datus captures semantics and validation into durable, reusable memory." },
  { vs: "vs Semantic Layer", line: "A semantic layer is static config. Datus supports your existing one and builds new semantics when it's missing." },
];

function Differentiation() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow"><GitBranch size={13} /> Where Datus fits</span>
          <h2 className="h2">
            The open-source system that builds and evolves the data context those
            tools need to become reliable.
          </h2>
        </div>
        <div className="grid grid-2">
          {COMPARE.map((c) => (
            <div className="card" key={c.vs}>
              <h3 className="card__title" style={{ fontFamily: "var(--font-mono)", color: "var(--brand-bright)", fontSize: 15 }}>{c.vs}</h3>
              <p className="card__body">{c.line}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ Enterprise CTA ---------------------------- */
function EnterpriseCta() {
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
          <span className="eyebrow"><Workflow size={13} /> For data teams</span>
          <h2 className="h2" style={{ marginTop: 14 }}>
            Reliable, auditable, collaborative agent teams.
          </h2>
          <p className="lead" style={{ marginInline: "auto", maxWidth: 600 }}>
            Give your org a shared context engine, governed access, and
            long-running agents. Scale data output without scaling headcount.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginTop: 26 }}>
            <EnterpriseInquiryDialog>
              <button className="btn btn-primary btn-lg">
                Talk to us <ArrowRight size={17} />
              </button>
            </EnterpriseInquiryDialog>
            <a className="btn btn-ghost btn-lg" href={`mailto:${CONTACT_EMAIL}`}>
              {CONTACT_EMAIL}
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
      <Pillars />
      <ProductForms />
      <Integrations />
      <Context />
      <Differentiation />
      <EnterpriseCta />
    </SiteLayout>
  );
}
