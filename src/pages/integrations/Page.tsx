import { ArrowRight, BarChart3, Boxes, BrainCircuit, CalendarClock, Database, Github } from "lucide-react";
import SiteLayout from "../../components/SiteLayout";
import Breadcrumb from "../../components/Breadcrumb";
import { GITHUB_URL } from "../../config/nav";

interface Category {
  id: string;
  icon: typeof Database;
  label: string;
  blurb: string;
  items: string[];
  /** Adapter repo for this category, used for the browse + open-an-issue links. */
  repo?: string;
}

const CATEGORIES: Category[] = [
  {
    id: "data-sources",
    icon: Database,
    label: "Data sources",
    blurb: "Connect the warehouses and databases you already run.",
    items: [
      "Snowflake", "Databricks", "Redshift", "StarRocks", "ClickHouse", "Doris", "Greenplum",
      "PostgreSQL", "MySQL", "Hive", "Spark", "Trino", "SQLAlchemy",
    ],
    repo: "https://github.com/Datus-ai/datus-db-adapters",
  },
  {
    id: "llms",
    icon: BrainCircuit,
    label: "LLMs",
    blurb: "Bring your own model, hosted or local.",
    items: ["OpenAI", "Anthropic", "DeepSeek", "Qwen", "Local models"],
  },
  {
    id: "semantic-layer",
    icon: Boxes,
    label: "Semantic layer",
    blurb: "Support your existing semantics, and build new ones when they're missing.",
    items: ["MetricFlow (built-in)", "Open Semantic Interchange (OSI)"],
    repo: "https://github.com/Datus-ai/datus-semantic-adapter",
  },
  {
    id: "schedulers",
    icon: CalendarClock,
    label: "Schedulers",
    blurb: "Ship agent-built jobs into your orchestration.",
    items: ["Airflow"],
    repo: "https://github.com/Datus-ai/datus-scheduler-adapters",
  },
  {
    id: "bi",
    icon: BarChart3,
    label: "BI",
    blurb: "Push metrics and dashboards to your BI tools.",
    items: ["Superset", "Grafana"],
    repo: "https://github.com/Datus-ai/datus-bi-adapters",
  },
];

export default function IntegrationsPage() {
  return (
    <SiteLayout>
      <Breadcrumb
        currentUrl="/integrations/"
        items={[{ label: "Home", href: "/" }, { label: "Integrations" }]}
      />
      <section className="section" style={{ paddingTop: 72, paddingBottom: 40 }}>
        <div className="container" style={{ maxWidth: 880 }}>
          <span className="eyebrow"><Database size={13} /> Integrations</span>
          <h1 style={{ fontSize: "clamp(32px,4.6vw,52px)", lineHeight: 1.06, letterSpacing: "-0.03em", fontWeight: 750, margin: "20px 0 0" }}>
            Connected to your stack, not a replacement for it.
          </h1>
          <p className="lead" style={{ maxWidth: 640 }}>
            Datus works with the warehouses, models, semantic layers, schedulers,
            and BI tools you already use. We list only what's really supported.
            If something's missing, open an issue.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 24 }}>
            {CATEGORIES.map((c) => (
              <a key={c.id} href={`#${c.id}`} className="nav-ghost-btn" style={{ fontFamily: "var(--font-sans)" }}>
                {c.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {CATEGORIES.map((cat, idx) => (
        <section
          key={cat.id}
          id={cat.id}
          className="section"
          style={{
            paddingBlock: "clamp(40px,5vw,68px)",
            background: idx % 2 === 0 ? "rgba(11,18,48,0.4)" : undefined,
            borderTop: "1px solid var(--line)",
            scrollMarginTop: "var(--nav-h)",
          }}
        >
          <div className="container">
            <div className="section-head" style={{ marginBottom: 28 }}>
              <span className="eyebrow"><cat.icon size={13} /> {cat.label}</span>
              <h2 className="h2" style={{ fontSize: "clamp(22px,2.6vw,30px)" }}>{cat.label}</h2>
              <p className="lead" style={{ marginTop: 10 }}>{cat.blurb}</p>
            </div>
            <div className="grid grid-4">
              {cat.items.map((item) => (
                <div className="card" key={item} style={{ padding: 20, display: "flex", alignItems: "center", minHeight: 64 }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 15, color: "var(--ink)" }}>{item}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 24, marginTop: 22 }}>
              {cat.repo && (
                <a className="link-arrow" href={cat.repo} target="_blank" rel="noopener noreferrer">
                  <Github size={15} /> Browse {cat.label} adapters <ArrowRight size={14} />
                </a>
              )}
              <a className="link-arrow" href={`${cat.repo ?? GITHUB_URL}/issues/new`} target="_blank" rel="noopener noreferrer">
                <Github size={15} /> Don't see yours? Open an issue <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </section>
      ))}
    </SiteLayout>
  );
}
