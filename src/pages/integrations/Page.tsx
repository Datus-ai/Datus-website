import type { ReactNode } from "react";
import { ArrowRight, CheckCircle2, ExternalLink } from "lucide-react";
import SiteLayout from "../../components/SiteLayout";
import Breadcrumb from "../../components/Breadcrumb";
import FAQ from "../../components/FAQ";
import { DOCS_URL, GITHUB_URL, STUDIO_URL } from "../../config/nav";
import { integrationsFaq } from "./faq";

/* -------------------------------------------------------------------------- */
/*  Local presentation helpers — styled with the site design tokens so this   */
/*  page reuses the existing dark/navy aesthetic instead of introducing new    */
/*  component libraries. Layout & content are ported from the datus-design     */
/*  integrations template.                                                     */
/* -------------------------------------------------------------------------- */

// Section accent tones, cycled the same way the design template cycles markers.
const TONES = ["var(--term-cyan)", "var(--term-amber)", "var(--term-green)", "var(--term-pink)"];
const toneAt = (i: number) => TONES[i % TONES.length];

const panelBg = "rgba(11,18,48,0.4)";
const sectionBorder = "1px solid var(--line)";

function Mark({ tone, children }: { tone: string; children: ReactNode }) {
  return <span style={{ color: tone }}>{children}</span>;
}

function InlineCode({ children }: { children: ReactNode }) {
  return (
    <code
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "0.85em",
        padding: "2px 6px",
        borderRadius: 6,
        background: "rgba(124,137,196,0.12)",
        border: "1px solid var(--line)",
        color: "var(--ink-dim)",
        overflowWrap: "anywhere",
      }}
    >
      {children}
    </code>
  );
}

function CodeBlock({ filename, lang, code }: { filename?: string; lang?: string; code: string }) {
  return (
    <div className="term">
      <div className="term__bar">
        <span className="term__dot term__dot--r" />
        <span className="term__dot term__dot--y" />
        <span className="term__dot term__dot--g" />
        {filename && <span className="term__title">{filename}</span>}
        {lang && (
          <span className="term__title" style={{ marginLeft: "auto" }}>
            {lang}
          </span>
        )}
      </div>
      <div className="term__body" style={{ paddingBlock: 16 }}>
        <pre
          style={{
            margin: 0,
            whiteSpace: "pre",
            overflowX: "auto",
            fontFamily: "var(--font-mono)",
            fontSize: 13,
            lineHeight: 1.7,
            color: "var(--ink-dim)",
          }}
        >
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}

type SpecRow = { label: string; value: ReactNode; mono?: boolean };

function SpecCard({
  name,
  tone,
  badge,
  rows,
}: {
  name: ReactNode;
  tone: string;
  badge?: ReactNode;
  rows: SpecRow[];
}) {
  return (
    <div className="card" style={{ display: "flex", flexDirection: "column", padding: 22 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ height: 6, width: 40, borderRadius: 3, background: tone }} />
        {badge && (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              fontFamily: "var(--font-mono)",
              fontSize: 10.5,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: tone,
            }}
          >
            {badge}
          </span>
        )}
      </div>
      <h3 style={{ margin: "16px 0 0", fontSize: 16.5, fontWeight: 650, letterSpacing: "-0.01em" }}>
        {name}
      </h3>
      <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
        {rows.map((r) => (
          <div key={r.label} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10.5,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--ink-faint)",
                width: 62,
                flexShrink: 0,
                paddingTop: 3,
              }}
            >
              {r.label}
            </span>
            {r.mono !== false && typeof r.value === "string" ? (
              <InlineCode>{r.value}</InlineCode>
            ) : (
              <span style={{ fontSize: 13, color: "var(--ink-muted)", lineHeight: 1.5 }}>{r.value}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function FeatureCard({ tone, title, body }: { tone: string; title: string; body: ReactNode }) {
  return (
    <div className="card" style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ height: 6, width: 40, borderRadius: 3, background: tone, marginBottom: 16 }} />
      <h3 className="card__title">{title}</h3>
      <div className="card__body">{body}</div>
    </div>
  );
}

function SectionHead({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: ReactNode;
  lead: string;
}) {
  return (
    <div className="section-head" style={{ marginBottom: 28 }}>
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="h2" style={{ fontSize: "clamp(24px,3vw,34px)" }}>
        {title}
      </h2>
      <p className="lead" style={{ marginTop: 10, maxWidth: 720 }}>
        {lead}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Content — ported from the datus-design integrations template.             */
/* -------------------------------------------------------------------------- */

const storageBackends = [
  {
    key: "lancedb",
    name: "LanceDB + SQLite",
    type: "default",
    pkg: "Built-in",
    notes: "Zero-config vector + relational store for local dev and single-node deployments.",
    builtIn: true,
  },
  {
    key: "pgvector",
    name: "PostgreSQL (pgvector)",
    type: "postgresql",
    pkg: "datus-storage-postgresql",
    notes: "Production tier with per-namespace schema isolation and connection pooling.",
    builtIn: false,
  },
  {
    key: "milvus",
    name: "Milvus",
    type: "milvus",
    pkg: "Plugin (v0.2.6)",
    notes: "Purpose-built vector store for large-scale semantic retrieval.",
    builtIn: false,
  },
];

const embeddingProviders = [
  { key: "openai", name: "OpenAI Embeddings", model: "text-embedding-3-small / large", dim: "1536 / 3072" },
  { key: "st", name: "sentence-transformers", model: "all-MiniLM-L6-v2 (~100MB)", dim: "384", badge: "Default" },
  { key: "e5", name: "Multilingual E5", model: "intfloat/multilingual-e5-large-instruct", dim: "1024" },
  { key: "bge", name: "BGE (zh / en)", model: "BAAI/bge-large-{zh,en}-v1.5", dim: "1024" },
];

const embeddingYaml = `storage:
  # Database metadata embedding (cloud)
  database:
    registry_name: openai
    model_name: text-embedding-3-small
    dim_size: 1536

  # Document embedding (local, multilingual)
  document:
    model_name: intfloat/multilingual-e5-large-instruct
    dim_size: 1024

  # Metric embedding (local, fast)
  metric:
    model_name: all-MiniLM-L6-v2
    dim_size: 384`;

const semanticMethods = [
  { method: "list_metrics(path, limit, offset)", desc: "Enumerate metrics available in the semantic project." },
  { method: "get_dimensions(metric_name, path)", desc: "List every dimension a metric can slice by." },
  { method: "query_metrics(metrics, dimensions, ...)", desc: "Run metric queries with filters, time range and where clauses." },
  { method: "validate_semantic()", desc: "Validate the semantic configuration end-to-end." },
];

const biCode = `# Deploy Superset + Postgres
helm upgrade --install superset superset/superset \\
  -f examples-values.yaml

# One-shot: dashboard -> subagents
datus-agent bootstrap-bi --database superset`;

const skillCards = [
  { title: "Bash Skills", body: "Shell scripts guarded by an allow-list of commands; safe to expose to the agent." },
  { title: "Function Skills", body: "Python callables loaded through load_skill() and invoked as tools." },
  {
    title: "Isolated Subagent Skills",
    body: "Run in a forked subagent context (Explore / Plan / general-purpose) with its own scratchpad.",
  },
];

const skillsCode = `# Authenticate to the marketplace
datus skill login --marketplace http://datus-marketplace:9000

# Discover & install
datus skill search sql
datus skill install sql-optimization

# Publish your own
datus skill publish ./skills/my-skill --owner murphy`;

const observability = [
  { key: "langsmith", tool: "LangSmith", purpose: "LLM call tracing & debugging", config: "LANGSMITH_TRACING=true · LANGSMITH_API_KEY · LANGSMITH_PROJECT" },
  { key: "langfuse", tool: "Langfuse", purpose: "Agent + tool full-chain tracing (OTel / OpenInference)", config: "LANGFUSE_PUBLIC_KEY · LANGFUSE_SECRET_KEY · LANGFUSE_HOST" },
  { key: "llmtrace", tool: "LLM Trace", purpose: "Local YAML dump of prompts and completions", config: "--save_llm_trace  →  {agent.home}/trajectory/" },
  { key: "tavily", tool: "Tavily", purpose: "Web-search fallback for platform documentation", config: "TAVILY_API_KEY" },
  { key: "github", tool: "GitHub Token", purpose: "Rate-limit-safe pull of platform docs from GitHub", config: "GITHUB_TOKEN" },
];

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function IntegrationsPage() {
  return (
    <SiteLayout>
      <Breadcrumb
        currentUrl="/integrations/"
        items={[{ label: "Home", href: "/" }, { label: "Integrations" }]}
      />

      {/* Hero */}
      <section className="section" style={{ paddingTop: 72, paddingBottom: 40 }}>
        <div className="container" style={{ maxWidth: 880 }}>
          <span className="eyebrow">Integrations</span>
          <h1
            style={{
              fontSize: "clamp(32px,4.6vw,52px)",
              lineHeight: 1.06,
              letterSpacing: "-0.03em",
              fontWeight: 750,
              margin: "20px 0 0",
            }}
          >
            Datus <Mark tone="var(--term-cyan)">Integrations</Mark>
          </h1>
          <p className="lead" style={{ maxWidth: 660 }}>
            Datus is built on a plugin-first architecture. Beyond the databases and models it
            connects to natively, this page catalogues every other layer you can plug in — storage,
            embeddings, semantic layer, BI copilot, MCP protocol, skills, and observability.
          </p>
        </div>
      </section>

      {/* SECTION 1 — STORAGE */}
      <section className="section" style={{ background: panelBg, borderBlock: sectionBorder, paddingBlock: "clamp(48px,6vw,84px)" }}>
        <div className="container">
          <SectionHead
            eyebrow="Storage"
            title={<><Mark tone="var(--term-cyan)">Storage backends</Mark> — vector + relational</>}
            lead="Dual-track storage keeps embeddings and relational metadata side-by-side. Swap the backend as your deployment grows."
          />
          <div className="grid grid-3">
            {storageBackends.map((s, i) => (
              <SpecCard
                key={s.key}
                name={s.name}
                tone={toneAt(i)}
                badge={s.builtIn ? (<><CheckCircle2 size={12} /> Built-in</>) : undefined}
                rows={[
                  { label: "Type", value: s.type },
                  { label: "Package", value: s.pkg },
                  { label: "Notes", value: s.notes, mono: false },
                ]}
              />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2 — EMBEDDINGS */}
      <section className="section" style={{ paddingBlock: "clamp(48px,6vw,84px)" }}>
        <div className="container">
          <SectionHead
            eyebrow="Embeddings"
            title={<><Mark tone="var(--term-amber)">Embedding providers</Mark> for context recall</>}
            lead="Vectorize schemas, docs and metrics for semantic search. Mix cloud embeddings with local models to balance quality, cost and privacy."
          />
          <div className="grid grid-4">
            {embeddingProviders.map((ep, i) => (
              <SpecCard
                key={ep.key}
                name={ep.name}
                tone={toneAt(i + 1)}
                badge={ep.badge}
                rows={[
                  { label: "Model", value: ep.model, mono: false },
                  { label: "Dim", value: ep.dim },
                ]}
              />
            ))}
          </div>
          <div style={{ marginTop: 24 }}>
            <CodeBlock filename="agent.yml" lang="yaml" code={embeddingYaml} />
          </div>
        </div>
      </section>

      {/* SECTION 3 — SEMANTIC LAYER */}
      <section className="section" style={{ background: panelBg, borderBlock: sectionBorder, paddingBlock: "clamp(48px,6vw,84px)" }}>
        <div className="container">
          <SectionHead
            eyebrow="Semantic layer"
            title={<><Mark tone="var(--term-green)">Semantic layer</Mark> adapters</>}
            lead="Bring your metric definitions into the agent's context. MetricFlow ships today; more adapters can be registered through Python entry points."
          />
          <div className="grid grid-2" style={{ alignItems: "stretch" }}>
            <SpecCard
              name="MetricFlow"
              tone={toneAt(2)}
              badge={<><CheckCircle2 size={12} /> Ready</>}
              rows={[
                { label: "Package", value: "datus-semantic-metricflow" },
                { label: "Install", value: "pip install datus-semantic-metricflow" },
                { label: "Notes", value: "MetricFlow-compatible YAML; joins into subject trees.", mono: false },
              ]}
            />
            <div className="card" style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10.5,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--ink-faint)",
                  marginBottom: 14,
                }}
              >
                Core interface
              </div>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 10 }}>
                {semanticMethods.map((m) => (
                  <li key={m.method} style={{ fontSize: 13, lineHeight: 1.5 }}>
                    <InlineCode>{m.method}</InlineCode>
                    <span style={{ marginLeft: 8, color: "var(--ink-muted)" }}>— {m.desc}</span>
                  </li>
                ))}
              </ul>
              <p style={{ marginTop: 16, marginBottom: 0, fontSize: 12.5, color: "var(--ink-muted)" }}>
                Register your own adapter via{" "}
                <InlineCode>[project.entry-points."datus.semantic_adapters"]</InlineCode>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 — BI PLATFORM COPILOT */}
      <section className="section" style={{ paddingBlock: "clamp(48px,6vw,84px)" }}>
        <div className="container">
          <div className="card" style={{ padding: "32px" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 32, alignItems: "flex-start" }}>
              <div style={{ flex: "1 1 320px", minWidth: 280 }}>
                <span className="eyebrow">BI copilot</span>
                <h2 className="h2" style={{ fontSize: "clamp(24px,3vw,32px)" }}>
                  <Mark tone="var(--term-pink)">BI platform</Mark> copilot
                </h2>
                <p className="lead" style={{ marginTop: 10 }}>
                  Point Datus at an Apache Superset dashboard and it extracts every chart's SQL,
                  builds a semantic model and emits two ready-to-use subagents — one for query, one
                  for attribution analysis.
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 18 }}>
                  {["Superset only (today)", "GenSQL subagent", "GenReport + root-cause"].map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 11,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        padding: "5px 10px",
                        borderRadius: 999,
                        border: sectionBorder,
                        color: "var(--ink-dim)",
                        background: "rgba(124,137,196,0.08)",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="muted" style={{ marginTop: 16, fontSize: 13 }}>
                  Tableau, PowerBI and Looker adapters are on the roadmap.
                </p>
              </div>
              <div style={{ flex: "1 1 360px", minWidth: 300, width: "100%" }}>
                <CodeBlock filename="terminal" lang="bash" code={biCode} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 — MCP */}
      <section className="section" style={{ background: panelBg, borderBlock: sectionBorder, paddingBlock: "clamp(48px,6vw,84px)" }}>
        <div className="container">
          <SectionHead
            eyebrow="MCP protocol"
            title={<><Mark tone="var(--term-cyan)">MCP protocol</Mark> — client & server</>}
            lead="Datus speaks Model Context Protocol in both directions. Consume any external MCP server, or expose Datus's own database and context-search tools to Claude, Cursor and other MCP hosts."
          />
          <div className="grid grid-2">
            <FeatureCard
              tone={toneAt(0)}
              title="MCP Client"
              body={
                <>
                  <span style={{ display: "block" }}>
                    Wire external MCP tools into the agent from the CLI: <InlineCode>.mcp add</InlineCode> with{" "}
                    <InlineCode>stdio</InlineCode>, <InlineCode>http</InlineCode> or <InlineCode>sse</InlineCode> transports.
                  </span>
                  <span style={{ display: "block", marginTop: 8, fontSize: 13, color: "var(--ink-faint)" }}>
                    Config lives in <InlineCode>~/.datus/conf/.mcp.json</InlineCode>.
                  </span>
                </>
              }
            />
            <FeatureCard
              tone={toneAt(3)}
              title="MCP Server"
              body={
                <>
                  <span style={{ display: "block" }}>
                    Run <InlineCode>datus-mcp</InlineCode> in static or dynamic mode. Static serves one namespace,
                    dynamic routes multiple namespaces by URL path.
                  </span>
                  <span style={{ display: "block", marginTop: 8, fontSize: 13, color: "var(--ink-faint)" }}>
                    Exposes 8 database + 8 context-search tools out of the box.
                  </span>
                </>
              }
            />
          </div>
          <a
            className="link-arrow"
            href={DOCS_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{ marginTop: 22 }}
          >
            <ExternalLink size={15} /> Full MCP interface details in the docs <ArrowRight size={14} />
          </a>
        </div>
      </section>

      {/* SECTION 6 — SKILLS */}
      <section className="section" style={{ paddingBlock: "clamp(48px,6vw,84px)" }}>
        <div className="container">
          <SectionHead
            eyebrow="Skills"
            title={<>Agent <Mark tone="var(--term-amber)">skills</Mark> & marketplace</>}
            lead="Modular capability packs (v0.2.5) following the agentskills.io spec. Discover, install and publish skills from the built-in marketplace."
          />
          <div className="grid grid-3" style={{ alignItems: "stretch" }}>
            {skillCards.map((s, i) => (
              <FeatureCard key={s.title} tone={toneAt(i)} title={s.title} body={s.body} />
            ))}
          </div>
          <div style={{ marginTop: 24 }}>
            <CodeBlock filename="terminal" lang="bash" code={skillsCode} />
          </div>
        </div>
      </section>

      {/* SECTION 7 — OBSERVABILITY */}
      <section className="section" style={{ background: panelBg, borderBlock: sectionBorder, paddingBlock: "clamp(48px,6vw,84px)" }}>
        <div className="container">
          <SectionHead
            eyebrow="Observability"
            title={<><Mark tone="var(--term-green)">Observability</Mark> & optional tools</>}
            lead="Trace every LLM call, augment platform docs with web search, or debug prompts locally as YAML."
          />
          <div className="term">
            <div className="term__bar">
              <span className="term__dot term__dot--r" />
              <span className="term__dot term__dot--y" />
              <span className="term__dot term__dot--g" />
              <span className="term__title">observability.env</span>
              <span className="term__title" style={{ marginLeft: "auto" }}>env</span>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", minWidth: 640 }}>
                <thead>
                  <tr style={{ borderBottom: sectionBorder }}>
                    {["Tool", "Purpose", "Configuration"].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: "14px 20px",
                          fontFamily: "var(--font-mono)",
                          fontSize: 10.5,
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          color: "var(--ink-faint)",
                          fontWeight: 500,
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {observability.map((o, i) => (
                    <tr key={o.key} style={{ borderBottom: i < observability.length - 1 ? sectionBorder : undefined }}>
                      <td style={{ padding: "14px 20px", fontSize: 14, fontWeight: 650, color: "var(--ink)", whiteSpace: "nowrap" }}>
                        {o.tool}
                      </td>
                      <td style={{ padding: "14px 20px", fontSize: 13, color: "var(--ink-muted)" }}>{o.purpose}</td>
                      <td style={{ padding: "14px 20px" }}>
                        <InlineCode>{o.config}</InlineCode>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQ
        items={integrationsFaq}
        currentUrl="/integrations/"
        lead="Storage, embeddings, semantic layers, MCP, BI copilot, and how databases and models fit in."
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
              Bring your <Mark tone="var(--term-cyan)">stack</Mark>, we plug in
            </h2>
            <p className="lead" style={{ marginInline: "auto", maxWidth: 600 }}>
              Databases, models, semantic layers, BI copilots and observability — every layer is a plugin.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginTop: 26 }}>
              <a className="btn btn-lg btn-primary" href={STUDIO_URL} target="_blank" rel="noopener noreferrer">
                Get started free <ArrowRight size={17} />
              </a>
              <a className="btn btn-lg btn-ghost" href={DOCS_URL} target="_blank" rel="noopener noreferrer">
                Read the docs <ArrowRight size={17} />
              </a>
              <a className="btn btn-lg btn-ghost" href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
                Browse adapters on GitHub
              </a>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
