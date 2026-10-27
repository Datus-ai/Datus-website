/** Preserved two-path homepage iteration. */
import { useId, useState, type KeyboardEvent } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { useHref, useT } from '../i18n/LocaleContext';
import { HOME_NARRATIVE } from '../content/homeNarrative';
import { NarrativeHeading } from './HomeNarrative';
import ProductInterfacePreview from './ProductInterfacePreview';
function tabKey(event:KeyboardEvent<HTMLButtonElement>,index:number,count:number,select:(index:number)=>void){
 const next=event.key==='ArrowRight'||event.key==='ArrowDown'?(index+1)%count:event.key==='ArrowLeft'||event.key==='ArrowUp'?(index+count-1)%count:event.key==='Home'?0:event.key==='End'?count-1:null;
 if(next===null)return;event.preventDefault();select(next);
 (event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role=tab]')[next])?.focus();
}

export function WorkingPathsTwoAudiencePreview(){
 const t=useT(HOME_NARRATIVE).experience,l=useHref(),id=useId(),[active,setActive]=useState(0);
 return <section id="interfaces" className="nordic-section nordic-wrap hp-section hp-experience">
  <NarrativeHeading t={t}/>
  <div className="hp-path-tabs" role="tablist" aria-label={t.heading}>{t.paths.map((path,i)=><button key={path.name} type="button" role="tab" id={`${id}-tab-${i}`} aria-controls={`${id}-panel-${i}`} aria-selected={active===i} tabIndex={active===i?0:-1} onClick={()=>setActive(i)} onKeyDown={event=>tabKey(event,i,2,setActive)}>{path.name}<ArrowRight size={16}/></button>)}</div>
  {t.paths.map((path,i)=><div key={path.name} role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={active!==i} tabIndex={0}><div className="hp-path-layout"><div className="hp-path-copy"><h3>{path.title}</h3><p>{path.body}</p><a className="nordic-text-link" href={l(path.href)}>{path.link}<ArrowUpRight size={16}/></a>{i===1&&<p className="hp-provenance">{t.developerNote}</p>}</div>{active===i&&<ProductInterfacePreview kind={i===0?'studio':'connect'}/>}</div></div>)}
 </section>;
}
