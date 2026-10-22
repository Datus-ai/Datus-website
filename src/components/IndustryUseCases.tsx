import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { useT } from '../i18n/LocaleContext';
import { INDUSTRY_USE_CASES } from '../content/industryUseCases';
import '../styles/industry-use-cases.css';
export default function IndustryUseCases(){
 const t=useT(INDUSTRY_USE_CASES);
 const [active,setActive]=useState(0);
 const [paused,setPaused]=useState(false);
 const [visible,setVisible]=useState(false);
 const root=useRef<HTMLElement>(null);
 useEffect(()=>{const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting),{threshold:.15});if(root.current)observer.observe(root.current);return()=>observer.disconnect()},[]);
 return <section ref={root} id="industry-use-cases" className="nordic-section nordic-wrap industry-use-cases" data-motion={visible&&!paused}>
  <div className="nordic-section-head"><span className="nordic-label">{t.eyebrow}</span><h2>{t.heading}</h2><div className="nordic-lead">{t.lead}</div></div>
  <div className="industry-use-cases__tabs" role="tablist" aria-label={t.eyebrow}>
   {t.items.map((item,index)=><button key={item.id} type="button" id={`industry-tab-${item.id}`} role="tab" aria-selected={active===index} aria-controls={`industry-panel-${item.id}`} tabIndex={active===index?0:-1} onClick={()=>setActive(index)} onKeyDown={event=>{
    const next=event.key==='ArrowRight'?(index+1)%t.items.length:event.key==='ArrowLeft'?(index+t.items.length-1)%t.items.length:event.key==='Home'?0:event.key==='End'?t.items.length-1:null;
    if(next===null)return;event.preventDefault();setActive(next);(event.currentTarget.parentElement?.children[next] as HTMLButtonElement)?.focus();
   }}>{item.industry}</button>)}
  </div>
  <div className="industry-use-cases__stage">
   {t.items.map((item,index)=><article key={item.id} id={`industry-panel-${item.id}`} role="tabpanel" aria-labelledby={`industry-tab-${item.id}`} hidden={active!==index} tabIndex={0}>
    <img className="industry-use-cases__background" src={item.image} alt={item.alt} width="1600" height="1000" loading="lazy" decoding="async"/>
    <div className="industry-use-cases__shade" aria-hidden="true"/>
    <div className="industry-use-cases__copy"><h3>{item.title}</h3><p>{item.body}</p><div className="industry-use-cases__question"><span>{t.example}</span><blockquote>{item.question}</blockquote></div></div>
   </article>)}
   <button type="button" className="industry-use-cases__motion" aria-label={paused?t.playMotion:t.pauseMotion} onClick={()=>setPaused(!paused)}>{paused?<Play size={16}/>:<Pause size={16}/>}</button>
  </div>
 </section>
}
