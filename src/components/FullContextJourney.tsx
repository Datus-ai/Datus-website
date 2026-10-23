/** Preserved full-size product walkthrough. Not mounted on the public homepage. */
import { useEffect, useRef, useState, useId, type CSSProperties, type KeyboardEvent } from 'react';
import { Pause, Play } from 'lucide-react';
import { useT } from '../i18n/LocaleContext';
import { HOME_NARRATIVE } from '../content/homeNarrative';
import { HOME_WALKTHROUGH_UI } from '../i18n/ui';
import { useTimedTabs } from '../hooks/useTimedTabs';
import { GatherKnowledge, DraftModel, ReviewModel } from '../pages/solutions/semantic-layer/SourceBasedWorkflow';
import { ModelWindow } from '../pages/solutions/semantic-layer/ModelingWorkflow';
import { NarrativeHeading, RuntimeEvidence } from './HomeNarrative';
import '../styles/home-narrative.css';
function tabKey(event:KeyboardEvent<HTMLButtonElement>,index:number,count:number,select:(index:number)=>void){
 const next=event.key==='ArrowRight'?(index+1)%count:event.key==='ArrowLeft'?(index+count-1)%count:event.key==='Home'?0:event.key==='End'?count-1:null;
 if(next===null)return;event.preventDefault();select(next);
 (event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role=tab]')[next])?.focus();
}

function JourneyScene({step}:{step:number}){
 if(step===0)return <GatherKnowledge/>;
 if(step===1)return <DraftModel/>;
 if(step===2)return <ReviewModel/>;
 if(step===3)return <RuntimeEvidence compact/>;
 return <ReviewModel initialView={1}/>;
}
export function FullContextJourney(){
 const t=useT(HOME_NARRATIVE).journey,ui=useT(HOME_WALKTHROUGH_UI),steps=useRef<HTMLDivElement>(null),id=useId();
 const rotation=useTimedTabs(steps,5,10000);
 const [vertical,setVertical]=useState(true);
 useEffect(()=>{const media=window.matchMedia('(min-width: 901px)'),update=()=>setVertical(media.matches);update();media.addEventListener('change',update);return()=>media.removeEventListener('change',update)},[]);
 function choose(index:number){rotation.select(index);rotation.setPaused(true)}
 function stepKey(event:KeyboardEvent<HTMLButtonElement>,index:number){
  if(event.key==='ArrowDown'||event.key==='ArrowUp'){
   event.preventDefault();const next=(index+(event.key==='ArrowDown'?1:4))%5;choose(next);
   (event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role=tab]')[next])?.focus();
  }else tabKey(event,index,5,choose);
 }
 return <section id="how-it-works" className="nordic-band"><div className="nordic-section nordic-wrap hp-section hp-journey">
  <NarrativeHeading t={t}/>
  <div className="hp-journey-stage" onFocusCapture={event=>{if((event.target as HTMLElement).closest('[role=tabpanel],[role=tablist]'))rotation.setPaused(true)}}>
   <aside className="hp-journey-sidebar">
    <div ref={steps} className="hp-journey-navigation">
     <div className="hp-step-tabs" role="tablist" aria-orientation={vertical?'vertical':'horizontal'} aria-label={t.heading}>{t.steps.map((step,i)=><button key={step.name} type="button" role="tab" id={`${id}-tab-${i}`} aria-selected={rotation.active===i} aria-controls={`${id}-panel-${i}`} tabIndex={rotation.active===i?0:-1} onClick={()=>choose(i)} onKeyDown={event=>stepKey(event,i)}><span>0{i+1}</span>{step.name}{rotation.active===i&&<i key={rotation.cycle} className="tab-countdown-line" style={{'--tab-duration':`${rotation.duration}ms`} as CSSProperties} data-running={rotation.running}/>}</button>)}</div>
     <button type="button" className="hp-motion" aria-label={rotation.paused?ui.play:ui.pause} onClick={()=>rotation.setPaused(!rotation.paused)} disabled={rotation.reduced}>{rotation.paused?<Play size={15}/>:<Pause size={15}/>}</button>
    </div>
   </aside>
   <div className="hp-journey-panels">{t.steps.map((step,i)=><div key={step.name} id={`${id}-panel-${i}`} role="tabpanel" aria-labelledby={`${id}-tab-${i}`} hidden={rotation.active!==i} tabIndex={0}>
    <div className="hp-journey-intro"><h3>{step.title}</h3><p>{step.body}</p></div>
    {rotation.active===i&&<div className="hp-journey-demo" onPointerDown={()=>rotation.setPaused(true)}><ModelWindow label={i===2||i===4?'Semantic Hub':'Northstar'}><JourneyScene step={i}/></ModelWindow></div>}
    <p className="hp-provenance">{step.evidence}</p>
   </div>)}</div>
  </div>
 </div></section>;
}

/** Retained compact/expandable iteration, for future embedded previews. */
export function CompactContextJourney(){
 const t=useT(HOME_NARRATIVE).journey,ui=useT(HOME_WALKTHROUGH_UI),root=useRef<HTMLElement>(null),id=useId();
 const rotation=useTimedTabs(root,5,10000),[expanded,setExpanded]=useState(false);
 const choose=(index:number)=>{rotation.select(index);rotation.setPaused(true)};
 return <section ref={root} className="nordic-band"><div className="nordic-section nordic-wrap hp-section hp-journey">
  <NarrativeHeading t={t}/>
  <div className="hp-journey-toolbar"><div className="hp-step-tabs" role="tablist" aria-label={t.heading}>{t.steps.map((step,i)=><button key={step.name} role="tab" id={`${id}-tab-${i}`} aria-controls={`${id}-panel-${i}`} aria-selected={rotation.active===i} tabIndex={rotation.active===i?0:-1} onClick={()=>choose(i)} onKeyDown={e=>tabKey(e,i,5,choose)}><span>0{i+1}</span>{step.name}{rotation.active===i&&<i key={rotation.cycle} className="tab-countdown-line" data-running={rotation.running} style={{'--tab-duration':`${rotation.duration}ms`} as CSSProperties}/>}</button>)}</div><button className="hp-motion" disabled={rotation.reduced} aria-label={rotation.paused?ui.play:ui.pause} onClick={()=>rotation.setPaused(!rotation.paused)}>{rotation.paused?<Play size={15}/>:<Pause size={15}/>}</button></div>
  {t.steps.map((step,i)=><div key={step.name} role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={rotation.active!==i}><div className="hp-journey-layout"><div className="hp-journey-copy"><h3>{step.title}</h3><p>{step.body}</p><p className="hp-provenance">{step.evidence}</p></div>{rotation.active===i&&<div className="hp-product-stage" data-expanded={expanded} onPointerDown={()=>rotation.setPaused(true)} onFocusCapture={()=>rotation.setPaused(true)}><div className="hp-product-stage-bar"><span>{t.preview}</span><button onClick={()=>setExpanded(!expanded)} aria-expanded={expanded}>{expanded?t.closePreview:t.openPreview}</button></div><div className="hp-product-scroll" tabIndex={0}><ModelWindow label={i===2||i===4?'Semantic Hub':'Northstar'}><JourneyScene step={i}/></ModelWindow></div></div>}</div></div>)}
 </div></section>;
}
