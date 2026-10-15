import { ArrowRight, ArrowUpRight, Check, Copy, Github, Layers3, Workflow, Terminal, MessageSquare, Plug } from "lucide-react";
import { useState, type ReactNode } from "react";
import SiteLayout from "./components/SiteLayout";
import FAQ from "./components/FAQ";
import HomeResources from "./components/HomeResources";
import { EnterpriseInquiryDialog } from "./components/EnterpriseInquiryDialog";
import { GITHUB_URL, STUDIO_URL } from "./config/nav";
import { formatStarCount, useGitHubStars } from "./hooks/useGitHubStars";
import { useHref, useT } from "./i18n/LocaleContext";
import { HOME, type HomeCopy } from "./content/home";
import { UI } from "./i18n/ui";
import "./styles/home-nordic.css";

const INSTALL_CMD = "curl -fsSL https://datus.ai/install.sh | sh";
const MODELS = ["OpenAI", "Anthropic", "Gemini", "DeepSeek", "Qwen", "Ollama", "Bedrock"];
const STACK = [
  ["Snowflake", "BigQuery", "Redshift", "Postgres", "DuckDB"],
  ["dbt", "SQLMesh"], ["Cube", "dbt Semantic Layer", "LookML"],
  ["DataHub", "OpenMetadata", "Unity Catalog"], ["Metabase", "Superset", "Tableau"],
  ["Airflow", "Dagster", "Prefect"],
];

function SectionTitle({ eyebrow, heading, lead }: { eyebrow: string; heading: string; lead: ReactNode }) {
  return <div className="nordic-section-head"><span className="nordic-label">{eyebrow}</span><h2>{heading}</h2><div className="nordic-lead">{lead}</div></div>;
}

function Watermark({ variant }: { variant: 'orbit' | 'arches' | 'weave' }) {
  const artwork = { orbit: 'context-layers', arches: 'evolving-context', weave: 'relationship-map' }[variant];
  return <div className={`nordic-watermark nordic-watermark--${variant}`} aria-hidden="true"><img src={`/brand/${artwork}-transparent.svg`} alt="" /></div>;
}

function InstallCommand({ children }: { children?: ReactNode }) {
  const t = useT(UI).install;
  const [status, setStatus] = useState<'ready' | 'copied' | 'failed'>('ready');
  async function copy() {
    try { await navigator.clipboard.writeText(INSTALL_CMD); setStatus('copied'); setTimeout(() => setStatus('ready'), 1600); } catch { setStatus('failed'); }
  }
  return <div className="nordic-install-window">
    <div className="nordic-install-window__bar"><span className="nordic-terminal-dots" aria-hidden="true"><i/><i/><i/></span><span>{t.terminal}</span><span className="nordic-install-window__hint" aria-live="polite">{status==='copied' ? t.copied : status==='failed' ? t.failed : t.quickInstall}</span></div>
    <button type="button" className="nordic-install" title={t.copy} aria-label={t.copy} onClick={copy}><span aria-hidden="true">$</span><code>{INSTALL_CMD}</code>{status==='copied' ? <Check size={16} /> : <Copy size={16} />}</button>
    {children}
  </div>;
}

function Hero({ t }: { t: HomeCopy }) {
  return <section className="nordic-hero nordic-wrap">
    <div className="nordic-hero__grid">
      <div className="nordic-hero__copy">
        <span className="nordic-label"><span className="nordic-dot" />{t.hero.eyebrow}</span>
        <h1>{t.hero.titleLead}<span>{t.hero.titleAccent}</span>{t.hero.titleTail}</h1>
        <div className="nordic-lead">{t.hero.lead}</div>
        <div className="nordic-actions"><a className="btn btn-primary btn-lg" href={STUDIO_URL}>{t.hero.ctaPrimary}<ArrowUpRight size={18}/></a><a className="nordic-text-link" href={GITHUB_URL} target="_blank" rel="noopener noreferrer"><Github size={17}/>{t.hero.ctaGithub}<ArrowUpRight size={16}/></a></div>
        <EnterpriseInquiryDialog><button className="nordic-enterprise">{t.hero.contact}<ArrowRight size={15}/></button></EnterpriseInquiryDialog>
      </div>
      <HeroTerminal t={t}/>
    </div>
    <div className="nordic-hero__foot"><div className="nordic-byos"><span>{t.hero.byoWarehouse}</span><span>{t.hero.byoModel}</span></div></div>
  </section>;
}

function HeroTerminal({ t }: { t: HomeCopy }) {
  const ui = useT(UI).install;
  return <InstallCommand><div className="nordic-terminal-session">
    <div className="nordic-terminal-session__label">{ui.example}</div>
    <div className="nordic-terminal-line"><span className="nordic-terminal-prompt">$</span><code>datus init --datasource snowflake</code></div>
    <div className="nordic-terminal-output">{t.terminal.connected}</div>
    <div className="nordic-terminal-success">{t.terminal.ready}</div>
    <div className="nordic-terminal-line nordic-terminal-question"><span className="nordic-terminal-prompt">datus&gt;</span><span>{t.prompts[0]}</span></div>
    <div className="nordic-terminal-output">{t.terminal.pipeline}<span>{t.terminal.captured}</span></div>
    <div className="nordic-terminal-evolve">{t.terminal.selfEvolve}</div>
    <div className="nordic-terminal-output">{t.terminal.memory}</div>
    <span className="nordic-terminal-cursor" aria-hidden="true"/>
  </div></InstallCommand>;
}

function Surfaces({ t }: { t: HomeCopy }) {
  const [active, setActive] = useState(0);
  const icons = [Layers3, Terminal, MessageSquare, Plug];
  return <section className="nordic-section nordic-wrap">
    <SectionTitle {...t.surfaces}/>
    <div className="nordic-surfaces">
      <div className="nordic-tabs" role="tablist" aria-label={t.surfaces.eyebrow}>
        {t.surfaces.items.map((s, i) => <button key={s.id} id={`surface-tab-${s.id}`} type="button" role="tab" tabIndex={i===active ? 0 : -1} aria-selected={i===active} aria-controls={`surface-panel-${s.id}`} onClick={()=>setActive(i)} onKeyDown={e=>{
          const count=t.surfaces.items.length;
          const next=e.key==='ArrowDown'||e.key==='ArrowRight' ? (i+1)%count : e.key==='ArrowUp'||e.key==='ArrowLeft' ? (i+count-1)%count : e.key==='Home' ? 0 : e.key==='End' ? count-1 : null;
          if(next===null)return;
          e.preventDefault();setActive(next);
          (e.currentTarget.parentElement?.children[next] as HTMLButtonElement)?.focus();
        }}>{s.name}<ArrowUpRight size={17}/></button>)}
      </div>
      {/* Every surface's copy stays available in the initial HTML. */}
      {t.surfaces.items.map((item,i)=>{
        const Icon=icons[i];
        return <div key={item.id} className="nordic-surface" role="tabpanel" hidden={active!==i} id={`surface-panel-${item.id}`} aria-labelledby={`surface-tab-${item.id}`} tabIndex={0}>
          <div className="nordic-surface__icon"><Icon size={34} strokeWidth={1.25}/></div><h3>{item.name}</h3><div className="nordic-lead">{item.tagline}</div><code>{item.start}</code>
        </div>;
      })}
    </div>
  </section>;
}

export default function App() {
  const t = useT(HOME);
  const l = useHref();
  const stars = useGitHubStars();
  return <SiteLayout className="nordic-home">
    <Hero t={t}/>
    <section className="nordic-proof nordic-wrap" aria-label={t.hero.eyebrow}>{t.proof.map((p,i)=><div key={p.label}><strong>{i===0 ? `${formatStarCount(stars)}+` : p.value}</strong><span>{p.label}</span></div>)}</section>
    <section className="nordic-section nordic-wrap nordic-problem">
      <SectionTitle {...t.problem}/>
      <div className="nordic-comparison"><div className="nordic-comparison__head"><span>{t.problem.colProblem}</span><span>{t.problem.colDatus}</span></div>{t.problem.rows.map((r,i)=><div className="nordic-comparison__row" key={i}><p>{r.problem}</p><p>{r.solution}</p></div>)}</div>
    </section>
    <section className="nordic-band nordic-watermark-section"><Watermark variant="orbit"/><div className="nordic-wrap nordic-section">
      <SectionTitle {...t.layers}/>
      <div className="nordic-layers">{t.layers.items.map((layer,i)=><div key={layer.name}><span className="nordic-index">0{i+1}</span><h3>{layer.name}</h3><p>{layer.caption}</p><div className="nordic-tags">{layer.chips.map(c=><span key={c}>{c}</span>)}</div></div>)}</div>
    </div></section>
    <section className="nordic-section nordic-wrap nordic-watermark-section">
      <Watermark variant="arches"/>
      <SectionTitle {...t.lifecycle}/>
      <figure className="nordic-knowledge-flow" role="img" aria-label={t.lifecycle.visualAlt}>
        <img className="nordic-knowledge-flow__light" src="/brand/knowledge-to-model-light.svg" alt="" aria-hidden="true"/>
        <img className="nordic-knowledge-flow__dark" src="/brand/knowledge-to-model-dark.svg" alt="" aria-hidden="true"/>
        <figcaption>{t.lifecycle.visualCaption}</figcaption>
      </figure>
      <ol className="nordic-process">{t.lifecycle.phases.map((phase,i)=><li key={phase}><span>0{i+1}</span><div>{phase}</div></li>)}</ol>
    </section>
    <section className="nordic-section nordic-wrap nordic-use-cases">
      <SectionTitle {...t.useCases}/>
      <div className="nordic-features">{t.useCases.items.map((u,i)=><article key={u.title}><Workflow size={24} strokeWidth={1.3}/><span className="nordic-index">0{i+1}</span><h3>{u.title}</h3><div>{u.body}</div></article>)}</div>
    </section>
    <Surfaces t={t}/>
    <section className="nordic-band"><div className="nordic-section nordic-wrap">
      <SectionTitle {...t.stack}/>
      <div className="nordic-integrations"><div className="nordic-integration-row"><h3>{t.stack.model}</h3><div>{MODELS.map(m=><span key={m}>{m}</span>)}</div><span className="nordic-label">{t.stack.byo}</span></div>{t.stack.groups.map((g,i)=><div className="nordic-integration-row" key={g}><h3>{g}</h3><div>{STACK[i].map(m=><span key={m}>{m}</span>)}</div></div>)}</div>
      <a className="nordic-text-link" href={l('/integrations/')}>{t.stack.seeAll}<ArrowUpRight size={17}/></a>
    </div></section>
    <HomeResources/>
    <FAQ items={t.faq.items} currentUrl="/" lead={t.faq.lead} maxWidth={1180}/>
    <div className="nordic-wrap nordic-faq-link"><a className="nordic-text-link" href={l('/faq/')}>{t.faq.browseAll}<ArrowRight size={16}/></a></div>
    <section className="nordic-closing nordic-wrap nordic-watermark-section"><Watermark variant="weave"/><span className="nordic-dot"/><h2>{t.closing.heading}</h2><div className="nordic-lead">{t.closing.lead}</div><a className="btn btn-primary btn-lg" href={STUDIO_URL}>{t.closing.cta}<ArrowUpRight size={18}/></a></section>
  </SiteLayout>;
}
