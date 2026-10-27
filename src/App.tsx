import { ArrowRight, ArrowUpRight, Check, CircleCheck, Copy } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import SiteLayout from "./components/SiteLayout";
import FAQ from "./components/FAQ";
import IndustryUseCases from "./components/IndustryUseCases";
import HomeResources from "./components/HomeResources";
import RotatingPrompt from "./components/RotatingPrompt";
import { EnterpriseInquiryDialog } from "./components/EnterpriseInquiryDialog";
import { DOSI_URL, STUDIO_LOGIN_URL } from "./config/nav";
import { useHref, useLocale, useT } from "./i18n/LocaleContext";
import { studioCtaUrl } from "./lib/studio-cta";
import { HOME_NARRATIVE } from "./content/homeNarrative";
import { LaunchOverview, BusinessModel, TrustworthyRuntime, OpenContext, ContextJourney, WorkingPaths } from "./components/HomeNarrative";
import { HOME, type HomeCopy } from "./content/home";
import { UI } from "./i18n/ui";
import "./styles/home-nordic.css";
import "./styles/tab-countdown.css";
import "./styles/home-laptop.css";
import "./styles/home-narrative.css";

const INSTALL_CMD = "curl -fsSL https://datus.ai/install.sh | sh";

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
  const studioHref = studioCtaUrl(STUDIO_LOGIN_URL, "home_hero", useLocale());
  return <section className="nordic-hero nordic-wrap">
    <div className="nordic-hero__grid">
      <div className="nordic-hero__copy">
        <span className="nordic-label"><span className="nordic-dot" />{t.hero.eyebrow}</span>
        <h1 className={t.hero.stackTitle ? "nordic-hero__title--stacked" : undefined}>
          {t.hero.stackTitle ? <>
            <span className="nordic-hero__title-line">{t.hero.titleLead.trim()}</span>{" "}
            <span className="nordic-hero__title-line nordic-hero__title-line--accent">{t.hero.titleAccent}</span>{" "}
            <span className="nordic-hero__title-line">{t.hero.titleTail?.trim()}</span>
          </> : <>{t.hero.titleLead}<span>{t.hero.titleAccent}</span>{t.hero.titleTail}</>}
        </h1>
        <div className="nordic-lead">{t.hero.lead}</div>
        <div className="nordic-actions"><a className="btn btn-primary btn-lg" href={studioHref}>{t.hero.ctaPrimary}<ArrowUpRight size={18}/></a><a className="nordic-text-link" href={DOSI_URL} target="_blank" rel="noopener noreferrer">{t.hero.ctaDeveloper}<ArrowUpRight size={16}/></a></div>
        <EnterpriseInquiryDialog><button className="nordic-enterprise">{t.hero.contact}<ArrowRight size={15}/></button></EnterpriseInquiryDialog>
      </div>
      <HeroTerminal t={t}/>
    </div>
    <div className="nordic-hero__foot"><div className="nordic-byos"><span>{t.hero.byoModel}</span><span className="nordic-byo-option"><CircleCheck size={13} aria-hidden="true"/>{t.hero.ownWarehouse}</span><span className="nordic-byo-option"><CircleCheck size={13} aria-hidden="true"/>{t.hero.ownModel}</span></div></div>
  </section>;
}

const WAREHOUSES = ["snowflake", "bigquery", "redshift", "starrocks", "clickhouse", "trino", "postgresql", "mysql"];

// Original live-site crossfade: 2.2s hold, 320ms fade, then the next source.
function RotatingWarehouse({ running }: { running: boolean }) {
  const [index,setIndex]=useState(0),[visible,setVisible]=useState(true);
  useEffect(()=>{if(!running)return;const timer=setTimeout(()=>setVisible(false),2200);return()=>clearTimeout(timer)},[index,running]);
  useEffect(()=>{if(!running||visible)return;const timer=setTimeout(()=>{setIndex(value=>(value+1)%WAREHOUSES.length);setVisible(true)},320);return()=>clearTimeout(timer)},[visible,running]);
  return <span className="nordic-terminal-warehouse" style={{opacity:running&&!visible?0:1}}>{WAREHOUSES[index]}</span>;
}

function HeroTerminal({ t }: { t: HomeCopy }) {
  const ui = useT(UI).install;
  const root=useRef<HTMLDivElement>(null),[visible,setVisible]=useState(false),[reduced,setReduced]=useState(true),[pageVisible,setPageVisible]=useState(true);
  useEffect(()=>{
    const media=window.matchMedia('(prefers-reduced-motion: reduce)'),motion=()=>setReduced(media.matches),page=()=>setPageVisible(!document.hidden);
    motion();page();media.addEventListener('change',motion);document.addEventListener('visibilitychange',page);
    const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting),{threshold:.1});if(root.current)observer.observe(root.current);
    return()=>{observer.disconnect();media.removeEventListener('change',motion);document.removeEventListener('visibilitychange',page)};
  },[]);
  const running=visible&&pageVisible&&!reduced;
  return <InstallCommand><div ref={root} className="nordic-terminal-session" data-running={running}>
    <div className="nordic-terminal-session__label">{ui.example}</div>
    <div className="nordic-terminal-line"><span className="nordic-terminal-prompt">$</span><code>datus init --datasource <RotatingWarehouse running={running}/></code></div>
    <div className="nordic-terminal-output">{t.terminal.connected}</div>
    <div className="nordic-terminal-success">{t.terminal.ready}</div>
    <div className="nordic-terminal-question"><RotatingPrompt phrases={t.prompts} running={running} reducedMotion={reduced}/></div>
    <div className="nordic-terminal-output">{t.terminal.pipeline}<span>{t.terminal.captured}</span></div>
    <div className="nordic-terminal-evolve">{t.terminal.selfEvolve}</div>
    <div className="nordic-terminal-output">{t.terminal.memory}</div>
  </div></InstallCommand>;
}

export default function App() {
  const t = useT(HOME);
  const l = useHref();
  const story = useT(HOME_NARRATIVE);
  const studioHref = studioCtaUrl(STUDIO_LOGIN_URL, "home_closing", useLocale());

  return <SiteLayout className="nordic-home" staggerSections>
    <Hero t={t}/>
    <LaunchOverview/>
    <BusinessModel/>
    <div className="nordic-band"><WorkingPaths/></div>
    <TrustworthyRuntime/>
    <ContextJourney/>
    <OpenContext/>
    <IndustryUseCases/>
    <section id="get-started" className="nordic-closing nordic-wrap nordic-watermark-section"><Watermark variant="weave"/><span className="nordic-dot"/><h2>{story.closing.heading}</h2><div className="nordic-lead">{story.closing.lead}</div><a className="btn btn-primary btn-lg" href={studioHref}>{story.closing.primary}<ArrowUpRight size={18}/></a><a className="nordic-text-link" href={DOSI_URL}>{story.closing.secondary}<ArrowUpRight size={16}/></a></section>
    <FAQ items={story.faq.items} currentUrl="/" lead={story.faq.lead} maxWidth={1180}/>
    <div className="nordic-wrap nordic-faq-link"><a className="nordic-text-link" href={l('/faq/')}>{story.faq.browseAll}<ArrowRight size={16}/></a></div>
    <HomeResources/>

  </SiteLayout>;
}
