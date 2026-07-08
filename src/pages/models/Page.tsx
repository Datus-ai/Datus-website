import { ArrowRight } from "lucide-react";
import SiteLayout from "../../components/SiteLayout";
import Breadcrumb from "../../components/Breadcrumb";
import FAQ from "../../components/FAQ";
import { GITHUB_URL } from "../../config/nav";
import {
  CatalogSection,
  CodeBlock,
  FeatureCard,
  InlineCode,
  Mark,
  SectionHead,
  SpecCard,
  SpecTable,
  TagRow,
  toneAt,
} from "../../components/catalog";
import { modelsFaq } from "./faq";

const PROVIDER_DOCS = "https://docs.datus.ai/models/providers/";

/* -------------------------------------------------------------------------- */
/*  Content — ported from the datus-design /models template.                  */
/* -------------------------------------------------------------------------- */

type Provider = { key: string; name: string; type: string; notes: string };

const providers: Provider[] = [
  { key: "openai", name: "OpenAI", type: "openai", notes: "GPT-4, GPT-5 series" },
  { key: "claude", name: "Anthropic Claude", type: "claude", notes: "Claude 4 Sonnet / Opus" },
  { key: "gemini", name: "Google Gemini", type: "gemini", notes: "Gemini 2.5+ Pro / Flash" },
  { key: "deepseek", name: "DeepSeek", type: "deepseek", notes: "Chat & Reasoning" },
  { key: "qwen", name: "Alibaba Qwen", type: "openai", notes: "OpenAI-compatible" },
  { key: "kimi", name: "Moonshot Kimi", type: "openai", notes: "kimi-k2-turbo-preview" },
  { key: "minimax", name: "MiniMax", type: "minimax", notes: "MiniMax models" },
  { key: "glm", name: "GLM (Zhipu)", type: "glm", notes: "GLM-4 series" },
  { key: "azure", name: "Azure OpenAI", type: "openai", notes: "Enterprise deployments" },
  { key: "codex", name: "OpenAI Codex", type: "codex", notes: "OAuth, no API key" },
  { key: "openrouter", name: "OpenRouter", type: "openrouter", notes: "300+ models, single key" },
];

// Auth matrix keyed by provider.key
const providerAuth: Record<string, { auth: string; azure: string; selfHost: string }> = {
  openai: { auth: "API Key", azure: "✔ via Azure OpenAI", selfHost: "✔ any OpenAI-compatible" },
  claude: { auth: "API Key · Subscription Token", azure: "—", selfHost: "—" },
  gemini: { auth: "API Key", azure: "—", selfHost: "—" },
  deepseek: { auth: "API Key", azure: "—", selfHost: "✔" },
  qwen: { auth: "API Key (OpenAI-compatible)", azure: "—", selfHost: "✔" },
  kimi: { auth: "API Key (OpenAI-compatible)", azure: "—", selfHost: "✔" },
  minimax: { auth: "API Key", azure: "—", selfHost: "—" },
  glm: { auth: "API Key", azure: "—", selfHost: "—" },
  azure: { auth: "Azure Key + endpoint + deployment", azure: "✔ native", selfHost: "—" },
  codex: { auth: "OAuth (local Codex credential)", azure: "—", selfHost: "—" },
  openrouter: { auth: "API Key (single key, 300+ models)", azure: "—", selfHost: "—" },
};

const nodeStrategy = [
  { title: "Schema Linking", body: "Fast / cheap: DeepSeek Chat, gpt-4o-mini. Runs on every turn to pick relevant tables." },
  { title: "SQL Generation", body: "Strong: Claude Sonnet, gpt-4-turbo. Writes the SQL that downstream steps validate." },
  { title: "Reasoning / Output", body: "Strongest: Claude Opus, gpt-4-turbo. Explains results and drives multi-step reasoning." },
];

const embeddingProviders = [
  { name: "OpenAI Embeddings", type: "text-embedding-3-*", notes: "1536 / 3072 dim, hosted" },
  { name: "sentence-transformers", type: "all-MiniLM-L6-v2", notes: "384 dim · ~100MB · default" },
  { name: "Multilingual E5", type: "e5-large-instruct", notes: "1024 dim · ~1.2GB · multilingual" },
  { name: "BGE (zh)", type: "bge-large-zh-v1.5", notes: "1024 dim · Chinese optimized" },
  { name: "BGE (en)", type: "bge-large-en-v1.5", notes: "1024 dim · English optimized" },
];

const observability = [
  { key: "langsmith", name: "LangSmith", purpose: "LLM call tracing & debugging", env: "LANGSMITH_TRACING=true · LANGSMITH_API_KEY" },
  { key: "langfuse", name: "Langfuse", purpose: "Agent + tool full-chain traces (OTel / OpenInference)", env: "LANGFUSE_PUBLIC_KEY · LANGFUSE_SECRET_KEY · LANGFUSE_HOST" },
  { key: "llmtrace", name: "LLM Trace", purpose: "Local YAML dump of prompts & completions", env: "--save_llm_trace" },
];

const pipelineYaml = `pipeline:
  schema_linking:
    provider: openai
    model: gpt-4o-mini
  sql_generation:
    provider: claude
    model: claude-sonnet-4
  validation:
    provider: gemini
    model: gemini-2.5-flash`;

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function ModelsPage() {
  return (
    <SiteLayout>
      <Breadcrumb
        currentUrl="/models/"
        items={[
          { label: "Home", href: "/" },
          { label: "Integrations", noSchema: true },
          { label: "Models" },
        ]}
      />

      {/* Hero */}
      <section className="section" style={{ paddingTop: 72, paddingBottom: 40 }}>
        <div className="container" style={{ maxWidth: 880 }}>
          <span className="eyebrow">Models</span>
          <h1
            style={{
              fontSize: "clamp(32px,4.6vw,52px)",
              lineHeight: 1.06,
              letterSpacing: "-0.03em",
              fontWeight: 750,
              margin: "20px 0 0",
            }}
          >
            Supported <Mark tone="var(--term-cyan)">LLM Providers</Mark>
          </h1>
          <p className="lead" style={{ maxWidth: 680 }}>
            Six first-party LLM providers (OpenAI, Anthropic Claude, Google Gemini, DeepSeek, Qwen,
            Kimi) plus Azure OpenAI, Codex OAuth and OpenRouter — and any OpenAI-compatible endpoint
            you self-host. Mix providers per node to tune speed, cost and quality.
          </p>
        </div>
      </section>

      {/* PROVIDER GRID */}
      <CatalogSection alt>
        <div className="grid grid-4">
          {providers.map((p, i) => {
            const auth = providerAuth[p.key];
            return (
              <SpecCard
                key={p.key}
                name={p.name}
                tone={toneAt(i)}
                rows={[
                  { label: "Type", value: p.type },
                  { label: "Notes", value: p.notes, mono: false },
                  ...(auth ? [{ label: "Auth", value: auth.auth, mono: false }] : []),
                ]}
              />
            );
          })}
        </div>
      </CatalogSection>

      {/* AUTH MATRIX */}
      <CatalogSection>
        <SectionHead
          eyebrow="Authentication"
          title={<><Mark tone="var(--term-amber)">Authentication</Mark> matrix</>}
          lead="How each provider authenticates, and whether it works through Azure or a self-hosted OpenAI-compatible endpoint."
        />
        <SpecTable
          filename="auth-matrix.yml"
          columns={[{ label: "Provider" }, { label: "Authentication" }, { label: "Azure" }, { label: "Self-Hosted" }]}
          rows={providers.map((p) => {
            const auth = providerAuth[p.key] ?? { auth: "—", azure: "—", selfHost: "—" };
            return {
              key: `auth-${p.key}`,
              cells: [
                <span style={{ fontSize: 14, fontWeight: 650, color: "var(--ink)" }}>{p.name}</span>,
                <span style={{ color: "var(--ink-muted)" }}>{auth.auth}</span>,
                <span style={{ color: "var(--ink-muted)" }}>{auth.azure}</span>,
                <span style={{ color: "var(--ink-muted)" }}>{auth.selfHost}</span>,
              ],
            };
          })}
        />
      </CatalogSection>

      {/* PER-NODE STRATEGY */}
      <CatalogSection alt>
        <SectionHead
          eyebrow="Strategy"
          title={<>Per-Node <Mark tone="var(--term-green)">strategy</Mark> guide</>}
          lead="Recommended provider tier for each workflow stage. Combine with the pipeline YAML below to wire the routing."
        />
        <div className="grid grid-3">
          {nodeStrategy.map((s, i) => (
            <FeatureCard key={s.title} tone={toneAt(i)} title={s.title} body={s.body} />
          ))}
        </div>
      </CatalogSection>

      {/* EMBEDDING MODELS */}
      <CatalogSection>
        <SectionHead
          eyebrow="Embeddings"
          title={<>Embedding Models for <Mark tone="var(--term-amber)">Context Recall</Mark></>}
          lead="Vectorize text and queries for semantic search, retrieval, and context matching."
        />
        <div className="grid grid-4">
          {embeddingProviders.map((ep, i) => (
            <FeatureCard
              key={ep.type}
              tone={toneAt(i)}
              title={ep.name}
              body={
                <span style={{ display: "block" }}>
                  <code style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: "var(--ink-faint)" }}>{ep.type}</code>
                  <span style={{ display: "block", marginTop: 4, fontSize: 12.5, color: "var(--ink-muted)" }}>{ep.notes}</span>
                </span>
              }
            />
          ))}
        </div>
      </CatalogSection>

      {/* LLM OBSERVABILITY */}
      <CatalogSection alt>
        <SectionHead
          eyebrow="Observability"
          title={<>LLM <Mark tone="var(--term-pink)">Observability</Mark></>}
          lead="Trace every prompt in production or debug locally as YAML — pick the surface that fits your workflow."
        />
        <div className="grid grid-3">
          {observability.map((o, i) => (
            <SpecCard
              key={o.key}
              name={o.name}
              tone={toneAt(i + 2)}
              rows={[
                { label: "Purpose", value: o.purpose, mono: false },
                { label: "Env", value: o.env },
              ]}
            />
          ))}
        </div>
      </CatalogSection>

      {/* PER-NODE MODEL ASSIGNMENT */}
      <CatalogSection>
        <div className="card" style={{ padding: "32px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 32, alignItems: "flex-start" }}>
            <div style={{ flex: "1 1 320px", minWidth: 280 }}>
              <span className="eyebrow">Per-node routing</span>
              <h2 className="h2" style={{ fontSize: "clamp(24px,3vw,32px)" }}>
                Per-Node <Mark tone="var(--term-cyan)">Model Assignment</Mark>
              </h2>
              <p className="lead" style={{ marginTop: 10 }}>
                Use different providers for different workflow steps. Route schema linking to a
                cheaper model, SQL generation to a stronger one — all within the same pipeline.
              </p>
              <div style={{ marginTop: 18 }}>
                <TagRow tags={["Schema linking → fast/cheap", "SQL generation → strong", "Validation → balanced"]} />
              </div>
            </div>
            <div style={{ flex: "1 1 360px", minWidth: 300, width: "100%" }}>
              <CodeBlock filename="pipeline.yml" lang="yaml" code={pipelineYaml} />
            </div>
          </div>
        </div>
      </CatalogSection>

      {/* FAQ */}
      <FAQ
        items={modelsFaq}
        currentUrl="/models/"
        lead="Supported providers, per-node routing, switching models, embeddings, and tracing."
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
              Route the <Mark tone="var(--term-cyan)">Right Model</Mark> at Every Step
            </h2>
            <p className="lead" style={{ marginInline: "auto", maxWidth: 620 }}>
              Configure planners, coders and rerankers per provider — Anthropic, OpenAI, Gemini, or
              your own self-hosted endpoint, all from one YAML.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginTop: 26 }}>
              <a className="btn btn-lg btn-primary" href={PROVIDER_DOCS} target="_blank" rel="noopener noreferrer">
                Model provider docs <ArrowRight size={17} />
              </a>
              <a className="btn btn-lg btn-ghost" href="/databases/">
                Explore databases <ArrowRight size={17} />
              </a>
              <a className="btn btn-lg btn-ghost" href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
                View on GitHub
              </a>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
