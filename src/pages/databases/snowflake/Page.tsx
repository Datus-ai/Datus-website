import { useRef, type CSSProperties, type KeyboardEvent } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Braces, Database, FileCode2, GitBranch, Layers3, Network, Pause, Play, ScanEye, Terminal } from 'lucide-react';
import SiteLayout from '../../../components/SiteLayout';
import Breadcrumb from '../../../components/Breadcrumb';
import FAQ from '../../../components/FAQ';
import { CodeBlock } from '../../../components/catalog';
import { useHref, useLocale, useT } from '../../../i18n/LocaleContext';
import { UI } from '../../../i18n/ui';
import { studioCtaUrl } from '../../../lib/studio-cta';
import { useTimedTabs } from '../../../hooks/useTimedTabs';
import { SNOWFLAKE_PAGE, SNOWFLAKE_DOCS, AGENT_SNOWFLAKE_DOCS, MODEL_DOWNLOAD, MODEL_EXCERPT, SNOWFLAKE_SQL, SNOWFLAKE_CONNECTION, SNOWFLAKE_COMMAND } from './content';
import '../../../styles/tab-countdown.css';
import './style.css';

const PATH = '/databases/snowflake/';
const external = { target: '_blank', rel: 'noopener' };
const codes = [MODEL_EXCERPT, SNOWFLAKE_SQL, SNOWFLAKE_CONNECTION];
const icons = [FileCode2, Braces, Database];

function DefinitionPreview() {
 const t=useT(SNOWFLAKE_PAGE).proof, ui=useT(UI).common, l=useHref();
 const root=useRef<HTMLElement>(null), tabs=useTimedTabs(root,3);
 function key(event:KeyboardEvent<HTMLButtonElement>,index:number){
  const next=event.key==='ArrowRight'?(index+1)%3:event.key==='ArrowLeft'?(index+2)%3:event.key==='Home'?0:event.key==='End'?2:null;
  if(next===null)return;event.preventDefault();tabs.setPaused(true);tabs.select(next);
  root.current?.querySelectorAll<HTMLButtonElement>('[role=tab]')[next]?.focus();
 }
 return <section id="inspect" ref={root} className="sf-section sf-proof container" aria-labelledby="sf-proof-title">
  <div className="sf-heading"><span className="eyebrow">{t.eyebrow}</span><h2 id="sf-proof-title">{t.heading}</h2><p className="lead">{t.lead}</p></div>
  <div className="sf-proof-layout"><div className="sf-proof-navigation">
   <div role="tablist" aria-label={t.heading} className="sf-tabs" onFocusCapture={()=>tabs.setPaused(true)}>{t.tabs.map((label,i)=>{const Icon=icons[i];return <button type="button" key={label} role="tab" id={`sf-tab-${i}`} aria-selected={tabs.active===i} aria-controls={`sf-panel-${i}`} tabIndex={tabs.active===i?0:-1} onClick={()=>tabs.select(i)} onKeyDown={event=>key(event,i)}><span className="sf-tab-index">0{i+1}</span><Icon size={18}/><span>{label}</span><ArrowRight size={16}/>{tabs.active===i&&<span className="tab-countdown-line" aria-hidden="true" key={tabs.cycle} data-running={tabs.running} style={{'--tab-duration':`${tabs.duration}ms`} as CSSProperties}/>}</button>})}</div>
   <div className="sf-tab-controls"><span>{tabs.active+1} / 3</span>{!tabs.reduced&&<button type="button" onClick={()=>tabs.setPaused(value=>!value)} aria-pressed={tabs.paused}>{tabs.paused?<Play size={13}/>:<Pause size={13}/>} {tabs.paused?ui.playAnimation:ui.pauseAnimation}</button>}</div>
   <a className="sf-text-link" href={l(MODEL_DOWNLOAD)} download>{t.download}<ArrowDown size={15}/></a>
  </div><div className="sf-proof-panes">{t.tabs.map((label,i)=><div id={`sf-panel-${i}`} key={label} role="tabpanel" aria-labelledby={`sf-tab-${i}`} tabIndex={0} hidden={tabs.active!==i}><div className="sf-pane-intro"><h3>{t.titles[i]}</h3><p>{t.descriptions[i]}</p></div><CodeBlock filename={t.files[i]} lang={i===1?'SQL':'YAML'} code={codes[i]} themeAware/></div>)}<p className="sf-caption">{t.caption}</p></div></div>
  <details className="sf-command"><summary><Terminal size={17}/>{t.command}</summary><CodeBlock filename="dosi" lang="CLI" code={SNOWFLAKE_COMMAND} themeAware/></details>
 </section>;
}

function ArchitectureComparison() {
 const d=useT(SNOWFLAKE_PAGE).why.diagram,l=useHref();
 return <figure className="sf-compare" aria-label={d.label}>
  <div className="sf-compare__lanes">
   <div className="sf-compare__lane">
    <div className="sf-compare__head"><span>{d.native.tag}</span><h3><img className="sf-compare__heading-logo" src="/integrations/logos/snowflake.svg" alt="" aria-hidden="true" width="24" height="24"/>{d.native.title}</h3></div>
    <div className="sf-compare__consumer">{d.native.consumers}</div>
    <ArrowDown className="sf-compare__down" size={19} aria-hidden="true"/>
    <div className="sf-compare__boundary">
     <span className="sf-compare__boundary-label">{d.native.boundary}</span>
     <div className="sf-compare__box"><Layers3 size={20} aria-hidden="true"/><strong>{d.native.model}</strong><small>{d.native.modelDetail}</small></div>
     <ArrowDown className="sf-compare__down" size={19} aria-hidden="true"/>
     <div className="sf-compare__box"><img className="sf-compare__logo" src="/integrations/logos/snowflake.svg" alt="" aria-hidden="true" width="22" height="22"/><strong>{d.native.warehouse}</strong></div>
    </div>
    <p className="sf-compare__summary">{d.native.summary}</p>
   </div>
   <div className="sf-compare__lane sf-compare__lane--datus">
    <div className="sf-compare__head"><span>{d.datus.tag}</span><h3><img className="sf-compare__heading-logo" src="/brand-mark.svg" alt="" aria-hidden="true" width="24" height="24"/>{d.datus.title}</h3></div>
    <div className="sf-compare__consumer">{d.datus.consumers}</div>
    <ArrowDown className="sf-compare__down" size={19} aria-hidden="true"/>
    <div className="sf-compare__external">
     <span className="sf-compare__boundary-label">{d.datus.outside}</span>
     <div className="sf-compare__pair">
      <div className="sf-compare__box"><Layers3 size={20} aria-hidden="true"/><strong>{d.datus.model}</strong><small>{d.datus.modelDetail}</small></div>
      <ArrowRight size={19} aria-hidden="true"/>
      <div className="sf-compare__box sf-compare__box--dosi"><img className="sf-compare__logo" src="/brand-mark.svg" alt="" aria-hidden="true" width="22" height="22"/><strong>{d.datus.engine}</strong><small>{d.datus.engineDetail}</small></div>
     </div>
    </div>
    <ArrowDown className="sf-compare__down" size={19} aria-hidden="true"/>
    <div className="sf-compare__boundary sf-compare__boundary--warehouse">
     <span className="sf-compare__boundary-label">{d.datus.boundary}</span>
     <div className="sf-compare__box"><img className="sf-compare__logo" src="/integrations/logos/snowflake.svg" alt="" aria-hidden="true" width="22" height="22"/><strong>{d.datus.warehouse}</strong></div>
    </div>
    <p className="sf-compare__summary">{d.datus.summary}</p>
   </div>
  </div>
  <figcaption className="sf-compare__caption"><span>{d.note}</span><a href="https://docs.snowflake.com/en/user-guide/views-semantic/overview" {...external}>{d.source}<ArrowUpRight size={14}/></a><a href={l('/blog/what-is-snowflake-osi/')}>{d.explainer}<ArrowRight size={14}/></a></figcaption>
 </figure>;
}

export default function SnowflakePage(){
 const t=useT(SNOWFLAKE_PAGE), ui=useT(UI), l=useHref(),locale=useLocale();
 const signup=(placement:string)=>studioCtaUrl('https://studio.datus.ai/',`databases_snowflake_${placement}`,locale);
 const featureIcons=[GitBranch,Network,ScanEye];
 return <SiteLayout className="snowflake-page" staggerSections>
  <Breadcrumb currentUrl={PATH} items={[{label:ui.nav.home,href:'/'},{label:ui.products.databases,href:'/databases/'},{label:'Snowflake'}]}/>
  <section className="sf-hero container" aria-labelledby="sf-title">
   <div className="sf-hero-copy"><a className="sf-back" href={l('/databases/')}><ArrowRight size={14}/>{t.back}</a><span className="eyebrow">{t.eyebrow}</span><h1 id="sf-title">{t.heading}</h1><p className="lead">{t.lead}</p><div className="sf-actions"><a className="btn btn-primary btn-lg" href={signup('hero')}>{ui.common.tryStudio}<ArrowUpRight size={17}/></a><a className="sf-text-link" href="#connect">{t.setupLink}<ArrowDown size={16}/></a></div><a className="sf-hero-comparison" href="#semantic-views">{t.comparisonLink}<ArrowRight size={14}/></a></div>
   <figure className="sf-architecture">
    <figcaption className="sf-architecture__label">{t.architecture.label}</figcaption>
    <div className="sf-architecture__main">
     <div className="sf-architecture__node sf-architecture__node--model"><span className="sf-architecture__small">{t.architecture.inputs}</span><ArrowDown size={13} aria-hidden="true"/><span className="sf-architecture__small">{t.architecture.authoring}</span><span className="sf-architecture__model"><Layers3 size={17} aria-hidden="true"/>{t.architecture.model}</span></div>
     <ArrowRight className="sf-architecture__arrow" size={19} aria-hidden="true"/>
     <div className="sf-architecture__entry"><strong>{t.architecture.consumer}</strong><span>{t.architecture.interface}</span><ArrowDown size={15} aria-hidden="true"/></div>
     <div className="sf-architecture__node sf-architecture__node--engine"><div className="sf-architecture__brand"><img src="/brand-mark.svg" alt="" aria-hidden="true" width="22" height="22"/><strong>{t.architecture.engine}</strong></div><span>{t.architecture.planning}</span></div>
     <ArrowRight className="sf-architecture__arrow" size={19} aria-hidden="true"/>
     <div className="sf-architecture__node sf-architecture__node--warehouse"><img className="sf-architecture__logo" src="/integrations/logos/snowflake.svg" alt="" aria-hidden="true" width="26" height="26"/><strong>{t.architecture.warehouse}</strong><span>{t.architecture.sql}</span></div>
    </div>
    <div className="sf-architecture__return"><ArrowLeft size={15} aria-hidden="true"/>{t.architecture.returnPath}</div>
    <p className="sf-architecture__caption">{t.architecture.caption}</p>
   </figure>
   <div className="sf-hero-facts">{t.facts.map(fact=><span key={fact}><span className="sf-dot"/>{fact}</span>)}</div>
  </section>
  <div className="sf-band"><section id="semantic-views" className="sf-section container" aria-labelledby="sf-why-title"><div className="sf-heading"><span className="eyebrow">{t.why.eyebrow}</span><h2 id="sf-why-title">{t.why.heading}</h2><p className="lead">{t.why.lead}</p></div><ArchitectureComparison/><div className="sf-benefits">{t.why.items.map((item,i)=>{const Icon=featureIcons[i];return <article key={item.title}><Icon size={26} strokeWidth={1.4}/><h3>{item.title}</h3><p>{item.body}</p></article>})}</div></section></div>
  <DefinitionPreview/>
  <div className="sf-band"><section id="connect" className="sf-section container" aria-labelledby="sf-connect-title"><div className="sf-connect-head"><div className="sf-heading"><span className="eyebrow">{t.steps.eyebrow}</span><h2 id="sf-connect-title">{t.steps.heading}</h2><p className="lead">{t.steps.lead}</p></div><a className="sf-text-link" href={SNOWFLAKE_DOCS} {...external}>{t.steps.docs}<ArrowUpRight size={16}/></a></div><ol className="sf-steps">{t.steps.items.map((item,i)=><li key={item.title}><span>0{i+1}</span><div><h3>{item.title}</h3><p>{item.body}</p></div></li>)}</ol><div className="sf-boundary"><ScanEye size={20}/><p>{t.steps.note}</p></div><a className="sf-text-link" href={AGENT_SNOWFLAKE_DOCS} {...external}>{t.steps.agent}<ArrowUpRight size={15}/></a></section></div>
  <section className="sf-section container" aria-labelledby="sf-use-title"><div className="sf-heading"><span className="eyebrow">{t.usage.eyebrow}</span><h2 id="sf-use-title">{t.usage.heading}</h2><p className="lead">{t.usage.lead}</p></div><div className="sf-usage">{t.usage.items.map((item,i)=><article key={item.title}><span className="sf-index">0{i+1}</span><h3>{item.title}</h3><p>{item.body}</p><a className="sf-text-link" href={l(item.href)} {...(item.href.startsWith('https:')?external:{})}>{item.link}<ArrowUpRight size={15}/></a></article>)}</div></section>
  <div className="sf-band"><FAQ items={t.faq.items} heading={t.faq.heading} lead={t.faq.lead} currentUrl={PATH}/></div>
  <section className="sf-section sf-closing container" aria-labelledby="sf-closing-title"><h2 id="sf-closing-title">{t.closing.heading}</h2><p className="lead">{t.closing.lead}</p><div className="sf-actions"><a className="btn btn-primary btn-lg" href={signup('closing')}>{ui.common.tryStudio}<ArrowUpRight size={17}/></a><a className="sf-text-link" href={SNOWFLAKE_DOCS} {...external}>{t.closing.secondary}<ArrowUpRight size={15}/></a></div></section>
  <div className="sf-band"><section className="sf-section container" aria-labelledby="sf-resources-title"><h2 id="sf-resources-title">{t.resources.heading}</h2><div className="sf-resources">{t.resources.items.map(item=><a key={item.title} href={l(item.href)} {...(item.href.startsWith('https:')?external:{})}><h3>{item.title}<ArrowUpRight size={18}/></h3><p>{item.body}</p></a>)}</div></section></div>
 </SiteLayout>;
}
