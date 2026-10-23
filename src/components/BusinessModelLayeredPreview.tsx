/** Preserved pre-illustration layout. Not mounted on the homepage. */
import { useId, useState } from 'react';
import { ArrowDown, ArrowUpRight, Braces, Database, GitBranch, Network } from 'lucide-react';
import { useHref, useT } from '../i18n/LocaleContext';
import { HOME_NARRATIVE } from '../content/homeNarrative';
import { HOME_WALKTHROUGH_UI } from '../i18n/ui';
import { NarrativeHeading } from './HomeNarrative';
import '../styles/home-narrative.css';
export default function BusinessModelLayeredPreview(){
 const t=useT(HOME_NARRATIVE).model,ui=useT(HOME_WALKTHROUGH_UI),l=useHref(),[active,setActive]=useState(0),id=useId();
 const icons=[Network,Braces,Database];
 return <section className="nordic-section nordic-wrap hp-section hp-business"><NarrativeHeading t={t}/><div className="hp-model-layout"><div className="hp-layer-notes"><span className="hp-tiny-index">0{active+1} / 03</span><h3>{t.layers[active].name}</h3>{t.layers.map((layer,i)=><div key={layer.name} role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={active!==i}><p>{layer.question}</p><span>{layer.detail}</span></div>)}<a className="nordic-text-link" href={l('/solutions/semantic-layer/')}>{t.link}<ArrowUpRight size={16}/></a></div><div className="hp-layer-map"><div className="hp-layer-connections" aria-hidden="true"><svg viewBox="0 0 680 330" preserveAspectRatio="none"><path d="M110 18C110 75 185 50 185 120S95 183 95 222 228 280 228 315M340 18V315M568 18C568 76 478 57 478 118S587 186 587 222 454 281 454 315"/></svg></div><div className="hp-layers" role="tablist" aria-label={ui.selectLayer}>{t.layers.map((layer,i)=>{const Icon=icons[i];return <button key={layer.name} type="button" role="tab" id={`${id}-tab-${i}`} aria-selected={active===i} aria-controls={`${id}-panel-${i}`} tabIndex={active===i?0:-1} onClick={()=>setActive(i)} onKeyDown={e=>{const n=e.key==='ArrowRight'?(i+1)%3:e.key==='ArrowLeft'?(i+2)%3:e.key==='Home'?0:e.key==='End'?2:null;if(n===null)return;e.preventDefault();setActive(n);(e.currentTarget.parentElement?.children[n] as HTMLButtonElement)?.focus()}} className={`hp-layer hp-layer--${i}`}><span className="hp-layer-name"><Icon size={19} strokeWidth={1.5}/>{layer.name}<ArrowDown size={15}/></span><span className="hp-layer-terms">{layer.terms.map((term,j)=><span key={term} data-relation={i===0&&j%2===1}>{term}</span>)}</span></button>})}</div><p className="hp-model-caption"><GitBranch size={13}/>{t.connection}</p></div></div></section>;
}
