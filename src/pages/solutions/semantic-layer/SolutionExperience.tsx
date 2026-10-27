import { useRef, type CSSProperties } from 'react';
import { ArrowRight, ArrowUpRight, Bot, Database, FileCheck2, Layers3, Pause, Play } from 'lucide-react';
import { useLocale, useT } from '../../../i18n/LocaleContext';
import { studioCtaUrl } from '../../../lib/studio-cta';
import { SOLUTION_EXPERIENCE } from './experience';
import { SEMANTIC_LAYER_SOLUTION } from './content';
import { STUDIO_LOGIN_URL } from '../../../config/nav';
import { useTimedTabs } from '../../../hooks/useTimedTabs';
import { UI } from '../../../i18n/ui';
import '../../../styles/tab-countdown.css';

export function ExecutionFlow() {
 const studioHref = studioCtaUrl(STUDIO_LOGIN_URL, 'semantic_layer_workflow', useLocale());
 const t = useT(SOLUTION_EXPERIENCE), hero=useT(SEMANTIC_LAYER_SOLUTION),ui=useT(UI).common;
 const track=useRef<HTMLDivElement>(null),tabs=useTimedTabs(track,t.flowStages.length),active=tabs.active;
 const icons = [Layers3, FileCheck2, Database, Bot];
 return <section id="solution-workflow" className="container solution-section" aria-labelledby="solution-execution-title">
  <h2 id="solution-execution-title">{t.flowTitle}</h2><p className="lead">{t.flowLead}</p>
  <p className="solution-flow-hint">{t.flowHint}</p>
  <div ref={track} className="solution-flow" role="tablist" aria-label={t.flowTitle} onFocusCapture={event=>{if((event.target as HTMLElement).matches(':focus-visible'))tabs.setPaused(true)}}>
   {t.flowStages.map((stage, i) => { const Icon = icons[i]; return <button key={stage.title} id={`solution-stage-${i}`} type="button" role="tab" tabIndex={active === i ? 0 : -1} aria-selected={active === i} aria-controls={`solution-stage-panel-${i}`} onClick={() => tabs.select(i)} onKeyDown={event => {
    const next = event.key === 'ArrowRight' ? (i + 1) % 4 : event.key === 'ArrowLeft' ? (i + 3) % 4 : event.key === 'Home' ? 0 : event.key === 'End' ? 3 : null;
    if (next === null) return; event.preventDefault();tabs.setPaused(true); tabs.select(next); (event.currentTarget.parentElement?.children[next] as HTMLButtonElement)?.focus();
   }}><Icon size={28} strokeWidth={1.4}/><strong>{stage.title}</strong><span>{stage.caption}</span>{i < 3 && <ArrowRight size={18} className="solution-flow-arrow" aria-hidden="true"/>}{active===i&&<span className="tab-countdown-line" aria-hidden="true" key={tabs.cycle} data-running={tabs.running} style={{'--tab-duration':`${tabs.duration}ms`} as CSSProperties}/>}</button>; })}
  </div>
  <div className="solution-flow-controls"><span>{active+1} / {t.flowStages.length}</span>{!tabs.reduced&&<button type="button" aria-pressed={tabs.paused} onClick={()=>tabs.setPaused(value=>!value)}>{tabs.paused?<Play size={13}/>:<Pause size={13}/>} {tabs.paused?ui.playAnimation:ui.pauseAnimation}</button>}</div>
  <div className="solution-flow-panels">{t.flowStages.map((stage, i) => <div key={stage.title} id={`solution-stage-panel-${i}`} role="tabpanel" aria-labelledby={`solution-stage-${i}`} hidden={active !== i} tabIndex={0}>
   <div><span className="solution-flow-detail">{stage.detail}</span><p>{stage.body}</p></div>
   <div className="solution-flow-terms" aria-label={stage.detail}>{stage.terms.map(term => <span key={term}>{term}</span>)}</div>
  </div>)}</div>
  <div className="solution-start"><div><h3>{t.startTitle}</h3><p>{t.startParts.map((part,i)=>part.highlight?<strong className="solution-keyword" key={i}>{part.text}</strong>:part.text)}</p></div><a className="btn btn-primary" href={studioHref}>{hero.primary}<ArrowUpRight size={16}/></a></div>
  <p className="solution-standard">{t.license}</p>
 </section>;
}
