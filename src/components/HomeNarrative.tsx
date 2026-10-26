import { useEffect, useRef, useState, useId, type CSSProperties, type KeyboardEvent } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, Bot, Braces, ChevronDown, Code2, Database, FileCode2, GitBranch, Layers3, LayoutDashboard, Network, Pause, Play, ShieldCheck } from 'lucide-react';
import { HOME_NARRATIVE } from '../content/homeNarrative';
import { HOME_AUDIENCES } from '../content/homeAudiences';
import { AnalystPreview, BusinessAssistantPreview } from './AgentConsumptionPreviews';
import { useHref, useT, useLocale } from '../i18n/LocaleContext';
import { HOME_WALKTHROUGH_UI } from '../i18n/ui';
import KnowledgeJourney from './KnowledgeJourney';
import AuditRuntimePreview from './AuditRuntimePreview';
import BusinessContextIllustration from './BusinessContextIllustration';
import { HOME_LAUNCH_MEDIA } from '../config/homeLaunchMedia';
import ProductInterfacePreview from './ProductInterfacePreview';
import NorthstarLineage, { NorthstarLineageInspector } from './NorthstarLineage';
import { NORTHSTAR } from '../content/northstarPreview';
import { INTERFACE_PREVIEWS } from '../content/interfacePreviews';
import { NORTHSTAR_MODEL_EXCERPT } from '../pages/solutions/semantic-layer/northstarSnippets';
import { DOSI_URL } from '../config/nav';

type HeadingCopy={eyebrow:string;heading:string;lead:string};
export function NarrativeHeading({t}:{t:HeadingCopy}) {
 return <div className="nordic-section-head hp-heading"><span className="nordic-label">{t.eyebrow}</span><h2>{t.heading}</h2><p className="nordic-lead">{t.lead}</p></div>;
}
function tabKey(event:KeyboardEvent<HTMLButtonElement>,index:number,count:number,select:(index:number)=>void){
 const next=event.key==='ArrowRight'||event.key==='ArrowDown'?(index+1)%count:event.key==='ArrowLeft'||event.key==='ArrowUp'?(index+count-1)%count:event.key==='Home'?0:event.key==='End'?count-1:null;
 if(next===null)return;event.preventDefault();select(next);
 (event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role=tab]')[next])?.focus();
}

function ArchitectureFlow({output=false}:{output?:boolean}){
 // Soft branches share a single entry/exit instead of targeting product layers.
 const desktop=[40,120,200].map(y=>output
  ?`M0 120C52 120 48 ${y} 100 ${y}`
  :`M0 ${y}C52 ${y} 48 120 100 120`);
 const mobile=[50,150,250].map(x=>output
  ?`M150 0C150 24 ${x} 20 ${x} 44`
  :`M${x} 0C${x} 24 150 20 150 44`);
 return <div className={`hp-architecture-bus hp-architecture-bus--${output?'output':'input'}`} aria-hidden="true">
  {[desktop,mobile].map((paths,index)=><svg key={index} className={index?'hp-bus-mobile':'hp-bus-desktop'} viewBox={index?'0 0 300 44':'0 0 100 240'} preserveAspectRatio="none">
   {paths.map((d,i)=><g key={i}>
    <path className="hp-flow-track" d={d}/>
    <path className="hp-flow-packet" d={d} pathLength="100" style={{'--flow-delay':`${i*.65+(output?2.6:0)}s`} as CSSProperties}/>
   </g>)}
  </svg>)}
 </div>;
}

/** Source and application branches connect to one shared Datus boundary. */
export function LaunchOverview(){
 const t=useT(HOME_NARRATIVE).overview,locale=useLocale(),diagram=useRef<HTMLElement>(null);
 const [flowing,setFlowing]=useState(false);
 useEffect(()=>{
  const media=matchMedia('(prefers-reduced-motion: reduce)');let visible=false;
  const update=()=>setFlowing(visible&&!document.hidden&&!media.matches);
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;update()},{threshold:.15});
  if(diagram.current)observer.observe(diagram.current);
  media.addEventListener('change',update);document.addEventListener('visibilitychange',update);
  return()=>{observer.disconnect();media.removeEventListener('change',update);document.removeEventListener('visibilitychange',update)};
 },[]);
 const sourceIcons=[FileCode2,Braces,Database],outputIcons=[LayoutDashboard,Bot,Layers3];
 const module=(index:number)=>{const item=t.modules[index];return <div className={`hp-architecture-module hp-architecture-module--${index}`} key={item.name}><img className="hp-module-art" src={`/brand/product-modules/${['studio','agent','dosi','ossie'][index]}.svg`} alt="" aria-hidden="true" width="180" height="80"/><div><h3>{item.name}</h3><p>{item.body}</p></div></div>};
 return <section id="overview" className="nordic-section nordic-wrap hp-section hp-overview">
  <NarrativeHeading t={t}/>
  {HOME_LAUNCH_MEDIA.src?<div className="hp-launch-video"><video controls playsInline preload="metadata" poster={HOME_LAUNCH_MEDIA.poster||undefined} aria-label={t.videoTitle}>
   <source src={HOME_LAUNCH_MEDIA.src}/>
   {HOME_LAUNCH_MEDIA.captions[locale]&&<track kind="captions" src={HOME_LAUNCH_MEDIA.captions[locale]} srcLang={locale} default/>}
  </video></div>:<figure ref={diagram} className="hp-architecture" data-flowing={flowing} aria-label={t.heading}>
   <div className="hp-architecture-end hp-architecture-end--sources"><h3>{t.sources}</h3>{t.inputs.map((label,i)=>{const Icon=sourceIcons[i];return <div key={label}><Icon size={19} strokeWidth={1.5}/><span>{label}</span></div>})}</div>
   <ArchitectureFlow/>
   <div className="hp-architecture-core"><div className="hp-architecture-brand">Datus</div>{module(0)}{module(1)}<div className="hp-architecture-foundation"><span>{t.foundation}</span>{module(2)}{module(3)}</div></div>
   <ArchitectureFlow output/>
   <div className="hp-architecture-end hp-architecture-end--outputs"><h3>{t.destinations}</h3>{t.outputs.map((label,i)=>{const Icon=outputIcons[i];return <div key={label}><Icon size={19} strokeWidth={1.5}/><span>{label}</span></div>})}</div>
  </figure>}
  <PillarOverview/>
 </section>;
}
export function PillarOverview(){
 const t=useT(HOME_NARRATIVE).pillars,l=useHref(),icons=[Network,Bot,ShieldCheck];
 return <div id="pillars" className="hp-overview-pillars" role="group" aria-label={t.eyebrow}>
  <div className="hp-pillar-columns">{t.items.map((item,i)=>{const Icon=icons[i];return <article key={item.name}><Icon size={27} strokeWidth={1.5}/><h3>{item.name}</h3><p>{item.body}</p><a href={l(item.href)} className="nordic-text-link">{item.link}<ArrowDown size={15}/></a></article>})}</div>
 </div>;
}

/** Three compact illustrations explain the layers without an entire workspace. */
export function BusinessModel(){
 const t=useT(HOME_NARRATIVE).model,l=useHref(),[active,setActive]=useState(0),id=useId();
 const [vertical,setVertical]=useState(true);
 useEffect(()=>{const media=matchMedia('(min-width:901px)'),update=()=>setVertical(media.matches);update();media.addEventListener('change',update);return()=>media.removeEventListener('change',update)},[]);
 const icons=[Network,Braces,Database];
 return <section id="shared-context" className="nordic-section nordic-wrap hp-section hp-business">
  <NarrativeHeading t={t}/>
  <div className="hp-business-explainer">
   <div className="hp-business-tabs" role="tablist" aria-orientation={vertical?'vertical':'horizontal'} aria-label={t.heading}>{t.layers.map((layer,i)=>{const Icon=icons[i];return <button type="button" key={layer.name} id={`${id}-tab-${i}`} role="tab" aria-selected={active===i} aria-controls={`${id}-panel-${i}`} tabIndex={active===i?0:-1} onClick={()=>setActive(i)} onKeyDown={event=>tabKey(event,i,3,setActive)}><Icon size={19} strokeWidth={1.5}/>{layer.name}<ArrowRight size={15}/></button>})}</div>
   {t.layers.map((layer,i)=><div key={layer.name} className="hp-business-panel" role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={active!==i} tabIndex={0}>
    <div className="hp-business-story"><h3>{layer.question}</h3><p>{layer.detail}</p><a className="nordic-text-link" href={l('/solutions/semantic-layer/')}>{t.link}<ArrowUpRight size={15}/></a></div>
    <BusinessContextIllustration kind={i}/>
   </div>)}
  </div>
 </section>;
}

/** Read-only artifacts from the supplied Northstar demo; never sends execution requests. */
export function RuntimeEvidence({compact=false}:{compact?:boolean}){
 const t=useT(HOME_NARRATIVE).runtime,preview=useT(INTERFACE_PREVIEWS),id=useId();
 const [active,setActive]=useState(0),[selected,setSelected]=useState('metric:contribution_margin');
 return <div className={`hp-evidence sm-window${compact?' hp-evidence--compact':''}`}>
  <div className="hp-evidence-bar"><span><ShieldCheck size={15}/>{t.recorded}</span><span>OSI → SQL</span></div>
  <div className="hp-evidence-tabs" role="tablist" aria-label={t.heading}>{t.tabs.map((label,i)=><button key={label} type="button" role="tab" id={`${id}-tab-${i}`} aria-controls={`${id}-panel-${i}`} aria-selected={active===i} tabIndex={active===i?0:-1} onClick={()=>setActive(i)} onKeyDown={event=>tabKey(event,i,3,setActive)}>{label}</button>)}</div>
  <div role="tabpanel" id={`${id}-panel-0`} aria-labelledby={`${id}-tab-0`} hidden={active!==0} tabIndex={0}><p className="hp-artifact-note">{t.excerpt}</p><pre className="hp-artifact-code" tabIndex={0} aria-label="northstar_premier.yaml">{NORTHSTAR_MODEL_EXCERPT}</pre></div>
  <div role="tabpanel" id={`${id}-panel-1`} aria-labelledby={`${id}-tab-1`} hidden={active!==1} tabIndex={0}><p className="hp-artifact-note">{t.sqlNote}</p><pre className="hp-artifact-code" tabIndex={0} aria-label="DuckDB SQL">{NORTHSTAR.compiledSql}</pre></div>
  <div role="tabpanel" id={`${id}-panel-2`} aria-labelledby={`${id}-tab-2`} hidden={active!==2} tabIndex={0}><p className="hp-artifact-note">{t.lineageNote}</p><div className="hp-evidence-graph" tabIndex={0} aria-label={t.tabs[2]}><NorthstarLineage selected={selected} onSelect={setSelected} t={preview}/></div><details className="hp-node-details"><summary><GitBranch size={13}/>{selected.replace(/^[^:]+:/,'')}<ChevronDown size={13}/></summary><NorthstarLineageInspector selected={selected} t={preview}/></details><div className="hp-result-scroll"><table><thead><tr>{t.resultColumns.map(label=><th key={label}>{label}</th>)}</tr></thead><tbody>{NORTHSTAR.rows.map(row=><tr key={row.customer_id}><td>{row.full_name}</td><td>{row.customer_margin.toFixed(2)}</td><td>{row.customer_orders}</td><td>{(row.customer_return_rate*100).toFixed(1)}%</td></tr>)}</tbody></table></div></div>
 </div>;
}
export function TrustworthyRuntime(){
 const t=useT(HOME_NARRATIVE).runtime,[active,setActive]=useState(0),id=useId();
 return <section id="runtime" className="hp-runtime-section"><div className="nordic-section nordic-wrap hp-section hp-runtime">
  <NarrativeHeading t={t}/>
  <div className="hp-execution-chain hp-audit-tabs" role="tablist" aria-label={t.heading}>{t.chain.map((step,i)=><button key={step} type="button" role="tab" id={`${id}-audit-tab-${i}`} aria-selected={active===i} aria-controls={`${id}-audit-panel-${i}`} tabIndex={active===i?0:-1} onClick={()=>setActive(i)} onKeyDown={event=>tabKey(event,i,4,setActive)}><span>{String(i+1).padStart(2,'0')}</span><strong>{step}</strong>{i<3&&<ArrowRight size={15} aria-hidden="true"/>}</button>)}</div>
  <div className="hp-runtime-stage"><AuditRuntimePreview active={active} id={id}/></div>
 </div></section>;
}
export function OpenContext(){
 const t=useT(HOME_NARRATIVE).open,l=useHref(),icons=[FileCode2,Code2,Database];
 return <section id="stack" className="nordic-section nordic-wrap hp-section hp-open">
  <NarrativeHeading t={t}/>
  <p className="hp-ossie-definition"><span className="hp-ossie-mark" aria-hidden="true"><Code2 size={23}/></span><span>{t.definition}</span></p>
  <ol className="hp-spec-execution">{t.flow.map((item,i)=>{const Icon=icons[i];return <li key={item.name}><span className="hp-spec-role">{item.role}</span><div className="hp-spec-name"><Icon size={25} strokeWidth={1.5}/><h3>{item.name}</h3></div><p>{item.detail}</p>{i<2&&<ArrowRight className="hp-spec-arrow" size={24} strokeWidth={1.3} aria-hidden="true"/>}</li>})}</ol>
  <div className="hp-spec-links">{t.links.map(link=><a key={link.href} className="nordic-text-link" href={l(link.href)}>{link.label}<ArrowUpRight size={15}/></a>)}</div>
  <p className="hp-license">{t.license}</p>
 </section>;
}

/** Homepage uses the simpler animated explanation; full UI remains reusable. */
export function ContextJourney(){
 const t=useT(HOME_NARRATIVE).journey;
 return <section id="how-it-works" className="nordic-band"><div className="nordic-section nordic-wrap hp-section hp-journey"><NarrativeHeading t={t}/><KnowledgeJourney/></div></section>;
}
export function WorkingPaths(){
 const t=useT(HOME_AUDIENCES),l=useHref(),id=useId(),[active,setActive]=useState(0);
 return <section id="interfaces" className="nordic-section nordic-wrap hp-section hp-experience hp-audiences">
  <NarrativeHeading t={t}/>
  <div className="hp-path-tabs" role="tablist" aria-label={t.heading}>{t.paths.map((path,i)=><button key={path.name} type="button" role="tab" id={`${id}-tab-${i}`} aria-controls={`${id}-panel-${i}`} aria-selected={active===i} tabIndex={active===i?0:-1} onClick={()=>setActive(i)} onKeyDown={event=>tabKey(event,i,3,setActive)}>{path.name}<ArrowRight size={16}/></button>)}</div>
  {t.paths.map((path,i)=><div key={path.name} role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={active!==i} tabIndex={0}><div className="hp-path-layout hp-role-layout"><div className="hp-path-copy"><h3>{path.title}</h3><p>{path.body}</p><a className="nordic-text-link" href={l(path.href)}>{path.link}<ArrowUpRight size={16}/></a></div>{active===i&&(i===0?<ProductInterfacePreview kind="studio"/>:i===1?<AnalystPreview/>:<BusinessAssistantPreview/>)}</div></div>)}
 </section>;
}
