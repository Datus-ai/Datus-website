import { ArrowRight, ArrowUpRight, BarChart3, Bot, Check, CircleCheck, Copy, Database, FileText, GitBranch, LayoutDashboard, Layers3, MessageSquare, NotebookTabs, Plug, ShieldCheck, Terminal, Workflow } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import SiteLayout from "./components/SiteLayout";
import FAQ from "./components/FAQ";
import IndustryUseCases from "./components/IndustryUseCases";
import HomeResources from "./components/HomeResources";
import ProductInterfacePreview from "./components/ProductInterfacePreview";
import KnowledgeJourney from "./components/KnowledgeJourney";
import HomePillars from "./components/HomePillars";
import StackIntegrations from "./components/StackIntegrations";
import { EnterpriseInquiryDialog } from "./components/EnterpriseInquiryDialog";
import { DOSI_URL, STUDIO_LOGIN_URL } from "./config/nav";
import { formatStarCount, useGitHubStars } from "./hooks/useGitHubStars";
import { useHref, useT } from "./i18n/LocaleContext";
import { HOME, type HomeCopy } from "./content/home";
import { UI } from "./i18n/ui";
import "./styles/home-nordic.css";
import "./styles/tab-countdown.css";

const INSTALL_CMD = "curl -fsSL https://datus.ai/install.sh | sh";

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
        <h1 className={t.hero.stackTitle ? "nordic-hero__title--stacked" : undefined}>
          {t.hero.stackTitle ? <>
            <span className="nordic-hero__title-line">{t.hero.titleLead.trim()}</span>
            <span className="nordic-hero__title-line nordic-hero__title-line--accent">{t.hero.titleAccent}</span>
            <span className="nordic-hero__title-line">{t.hero.titleTail?.trim()}</span>
          </> : <>{t.hero.titleLead}<span>{t.hero.titleAccent}</span>{t.hero.titleTail}</>}
        </h1>
        <div className="nordic-lead">{t.hero.lead}</div>
        <div className="nordic-actions"><a className="btn btn-primary btn-lg" href={STUDIO_LOGIN_URL}>{t.hero.ctaPrimary}<ArrowUpRight size={18}/></a><a className="nordic-text-link" href={DOSI_URL} target="_blank" rel="noopener noreferrer">{t.hero.ctaDeveloper}<ArrowUpRight size={16}/></a></div>
        <EnterpriseInquiryDialog><button className="nordic-enterprise">{t.hero.contact}<ArrowRight size={15}/></button></EnterpriseInquiryDialog>
      </div>
      <HeroTerminal t={t}/>
    </div>
    <div className="nordic-hero__foot"><div className="nordic-byos"><span>{t.hero.byoWarehouse}</span><span>{t.hero.byoModel}</span><span className="nordic-byo-option"><CircleCheck size={13} aria-hidden="true"/>{t.hero.ownWarehouse}</span><span className="nordic-byo-option"><CircleCheck size={13} aria-hidden="true"/>{t.hero.ownModel}</span></div></div>
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
  return <section id="interfaces" className="nordic-section nordic-wrap">
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
        return <div key={item.id} className="nordic-surface" role="tabpanel" hidden={active!==i} id={`surface-panel-${item.id}`} aria-labelledby={`surface-tab-${item.id}`} tabIndex={0}>
          <div className="nordic-surface__copy"><div className="nordic-lead">{item.tagline}</div></div>
          {item.preview && <ProductInterfacePreview kind={item.preview}/>}
          {item.screenshot&&<figure className="nordic-surface__screenshot"><a href={item.screenshot.src} target="_blank" rel="noopener noreferrer"><img src={item.screenshot.src} alt={item.screenshot.alt} loading="lazy" width="1600" height="1000"/></a><figcaption>{item.screenshot.caption}</figcaption></figure>}
        </div>;
      })}
    </div>
  </section>;
}

function LineageFlow({ kind }: { kind: "fan" | "spine" | "merge" }) {
  const paths = kind === "fan"
    ? ["M300 30 C300 14 105 16 105 2", "M300 30 V2", "M300 30 C300 14 495 16 495 2"]
    : kind === "merge"
      ? ["M105 30 C105 14 300 16 300 2", "M300 30 V2", "M495 30 C495 14 300 16 300 2"]
      : ["M300 30 V2"];
  return <svg className={`nordic-lineage-flow nordic-lineage-flow--${kind}`} viewBox="0 0 600 32" preserveAspectRatio="none" aria-hidden="true">
    {paths.map(path=><path key={path} d={path}/>) }
    <circle cx="300" cy="2" r="2.5"/>
  </svg>;
}

function ContextComparison({ t }: { t: HomeCopy["problem"] }) {
  const [split, setSplit] = useState(50);
  const [playing, setPlaying] = useState(false);
  const [run, setRun] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(([entry]) => setPlaying(entry.isIntersecting), { threshold: 0.25 });
    observer.observe(stage);
    return () => observer.disconnect();
  }, [run]);
  function selectSide(value: number) { setSplit(value); setRun(current => current + 1); }
  const style = { "--comparison-split": `${split}%` } as CSSProperties;
  const warehouseNames = { snowflake: "Snowflake", bigquery: "BigQuery", postgresql: "PostgreSQL" };
  const consumerIcons = [LayoutDashboard, NotebookTabs, Bot];
  return <div className="nordic-context-comparison">
    <div className="nordic-context-comparison__labels"><button type="button" onClick={()=>selectSide(100)} aria-pressed={split===100}>{t.colProblem}</button><button type="button" onClick={()=>selectSide(0)} aria-pressed={split===0}>{t.colDatus}</button></div>
    <div key={run} ref={stageRef} className={`nordic-context-comparison__stage${playing ? " is-playing" : ""}`} style={style}>
      <div className="nordic-context-comparison__side nordic-context-comparison__side--before" aria-hidden="true">
        <div className="nordic-context-diagram">
          <div className="nordic-context-diagram__heading"><h3>{t.visual.beforeTitle}</h3><p>{t.visual.beforeHint}</p></div>
          <div className="nordic-context-diagram__question"><MessageSquare size={16}/><span style={{ "--question-characters": t.visual.question.length } as CSSProperties}>{t.visual.question}</span></div>
          <div className="nordic-context-silos">{t.visual.silos.map((silo, i) => <div className={`nordic-context-silo nordic-context-silo--${i+1}`} key={silo.team}>
            <div className="nordic-context-silo__top"><strong>{silo.team}</strong></div>
            <div className="nordic-context-silo__output"><span>{silo.tool}</span><strong className="nordic-context-silo__result">{silo.result}</strong></div>
            <div className="nordic-context-silo__shaft"><BarChart3 size={23} strokeWidth={1.5}/><small>{silo.metric}</small><strong>{silo.definition}</strong></div>
            <div className="nordic-context-silo__warehouse"><img src={`/semantic-converter/icons/${silo.warehouse}.png`} alt=""/><span>{warehouseNames[silo.warehouse]}</span></div>
          </div>)}</div>
        </div>
      </div>
      <div className="nordic-context-comparison__side nordic-context-comparison__side--after" aria-hidden="true">
        <div className="nordic-context-diagram">
          <div className="nordic-context-diagram__heading"><h3>{t.visual.afterTitle}</h3><p>{t.visual.afterHint}</p></div>
          <div className="nordic-context-diagram__question"><MessageSquare size={16}/><span style={{ "--question-characters": t.visual.question.length } as CSSProperties}>{t.visual.question}</span></div>
          <div className="nordic-context-consumers">{t.visual.consumers.map((consumer, i) => { const Icon = consumerIcons[i]; return <div key={consumer}><Icon size={17}/><span>{consumer}</span><strong className="nordic-context-consumers__result">{t.visual.sharedResult}</strong></div>; })}</div>
          <LineageFlow kind="fan"/>
          <div className="nordic-context-datus-boundary">
            <div className="nordic-context-datus-boundary__label"><span className="nordic-context-model__mark">D</span><span>Datus</span></div>
            <div className="nordic-context-ontology"><svg viewBox="0 0 126 64" aria-hidden="true"><path d="M12 32 44 12 72 31 112 12M12 32l37 22 23-23 40 22M44 12l5 42"/><circle cx="12" cy="32" r="5"/><circle cx="44" cy="12" r="5"/><circle cx="49" cy="54" r="5"/><circle cx="72" cy="31" r="7"/><circle cx="112" cy="12" r="5"/><circle cx="112" cy="53" r="5"/></svg><div><strong>{t.visual.ontology}</strong><span>{t.visual.ontologyDetail}</span></div></div>
            <LineageFlow kind="spine"/>
            <div className="nordic-context-model"><div className="nordic-context-model__top"><div><strong>{t.visual.model}</strong></div><span className="nordic-context-model__review"><CircleCheck size={13}/>{t.visual.reviewed}</span></div>
              <div className="nordic-context-model__body"><div><span className="nordic-context-model__label"><BarChart3 size={15}/>{t.visual.metrics}</span><div className="nordic-context-model__chips">{t.visual.metricNames.map(name=><span key={name}>{name}</span>)}</div></div><div><span className="nordic-context-model__label"><GitBranch size={15}/>{t.visual.relationships}</span><strong className="nordic-context-model__relation">{t.visual.relationshipExample}</strong></div></div>
              <div className="nordic-context-audit"><span><ShieldCheck size={14}/>{t.visual.audit}</span><div>{t.visual.trace.map((item, i) => { const Icon = [CircleCheck, Terminal, GitBranch][i]; return <span key={item}><Icon size={12}/>{item}</span>; })}</div></div>
            </div>
          </div>
          <LineageFlow kind="merge"/>
          <div className="nordic-context-sources"><div className="nordic-context-knowledge">{t.visual.knowledge.map((source, i) => { const Icon = [FileText, GitBranch, Database][i]; return <div key={source}><Icon size={16}/><span>{source}</span></div>; })}</div><div className="nordic-context-warehouses"><span>{t.visual.selectedSource}</span><div>{t.visual.silos.map(silo=><img key={silo.warehouse} src={`/semantic-converter/icons/${silo.warehouse}.png`} alt={warehouseNames[silo.warehouse]} title={warehouseNames[silo.warehouse]}/>)}</div></div></div>
        </div>
      </div>
      <div className="nordic-context-comparison__divider" aria-hidden="true"><span><ArrowRight size={14}/><ArrowRight size={14}/></span></div>
      <input className="nordic-context-comparison__range" type="range" min="0" max="100" value={split} onChange={e=>setSplit(Number(e.target.value))} aria-label={`${t.dragHint}: ${t.colProblem} / ${t.colDatus}`} />
    </div>
    <p className="nordic-context-comparison__hint">{t.dragHint}</p>
    <details className="nordic-context-comparison__details"><summary>{t.detailsLabel}</summary>
      {t.rows.map((row, i) => <p key={i}><strong>{row.problem}</strong> {row.solution}</p>)}
    </details>
  </div>;
}

export default function App() {
  const t = useT(HOME);
  const l = useHref();
  const stars = useGitHubStars();

  return <SiteLayout className="nordic-home">
    <Hero t={t}/>
    <section className="nordic-proof nordic-wrap" aria-label={t.hero.eyebrow}>{t.proof.map((p,i)=><div key={p.label}><strong>{i===0 ? `${formatStarCount(stars)}+` : p.value}</strong><span>{p.label}</span></div>)}</section>
    <section id="shared-context" className="nordic-section nordic-wrap nordic-problem">
      <SectionTitle {...t.problem}/>
      <ContextComparison t={t.problem}/>
    </section>
    <section id="how-it-works" className="nordic-section nordic-wrap nordic-watermark-section">
      <SectionTitle {...t.lifecycle}/>
      <KnowledgeJourney/>
    </section>
    <Surfaces t={t}/>
    <IndustryUseCases/>
    <section id="pillars" className="nordic-section nordic-wrap">
      <SectionTitle {...t.pillars}/>
      <HomePillars t={t.pillars}/>
    </section>
    <section id="stack" className="nordic-band"><div className="nordic-section nordic-wrap">
      <SectionTitle {...t.stack}/>
      <StackIntegrations/>
      <a className="nordic-text-link" href={l('/integrations/')}>{t.stack.seeAll}<ArrowUpRight size={17}/></a>
    </div></section>
    <HomeResources/>
    <FAQ items={t.faq.items} currentUrl="/" lead={t.faq.lead} maxWidth={1180}/>
    <div className="nordic-wrap nordic-faq-link"><a className="nordic-text-link" href={l('/faq/')}>{t.faq.browseAll}<ArrowRight size={16}/></a></div>
    <section className="nordic-closing nordic-wrap nordic-watermark-section"><Watermark variant="weave"/><span className="nordic-dot"/><h2>{t.closing.heading}</h2><div className="nordic-lead">{t.closing.lead}</div><a className="btn btn-primary btn-lg" href={STUDIO_LOGIN_URL}>{t.closing.cta}<ArrowUpRight size={18}/></a></section>
  </SiteLayout>;
}
