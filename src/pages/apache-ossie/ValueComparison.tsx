import { useRef, type CSSProperties, type KeyboardEvent } from 'react';
import { ArrowDown, Pause, Play } from 'lucide-react';
import { useT } from '../../i18n/LocaleContext';
import { UI } from '../../i18n/ui';
import { useTimedTabs } from '../../hooks/useTimedTabs';
import { OSSIE_DETAILS } from './details';
import '../../styles/tab-countdown.css';

function Diagram({index,after}:{index:number;after:boolean}) {
 const d=useT(OSSIE_DETAILS).value.diagrams[index];
 const points=index===1?[[90,70],[350,70],[90,225],[350,225]]:[[80,85],[220,85],[360,85]];
 const node=(x:number,y:number,label:string,key:string)=><g key={key}><rect x={x-62} y={y-22} width="124" height="44" rx="7"/><text x={x} y={y+4}>{label}</text></g>;
 return <svg viewBox="0 0 440 300" className={`ossie-value-art ${after?'is-shared':''}`} aria-hidden="true">
  <g className="ossie-value-wires" fill="none">
   {index===1?points.flatMap(([x,y],i)=>after?[<path key={i} d={`M${x} ${y} Q220 ${y} 220 148`}/>]:points.slice(i+1).map(([a,b],j)=><path key={`${i}-${j}`} d={`M${x} ${y} L${a} ${b}`}/>)):
    points.map(([x,y],i)=><path key={i} d={after?`M${x} ${y+22} C${x} 158 220 146 220 184`:`M${x} ${y+22} L${x} 184`}/>)}
  </g>
  {points.map(([x,y],i)=>node(x,y,d.nodes[i],`node-${i}`))}
  {after?<g className="ossie-value-core"><rect x="144" y={index===1?119:181} width="152" height="58" rx="12"/><text x="220" y={index===1?152:214}>{d.center}</text></g>:index!==1&&points.map(([x],i)=><g className="ossie-value-fragment" key={i}><path d={`M${x-60} 184 H${x+46} L${x+60} 198 V239 H${x-60} Z`}/><text x={x} y="216">{d.before[i]}</text></g>)}
  {after&&<text x="220" y="282" className="ossie-value-caption">{d.after}</text>}
 </svg>;
}

export default function ValueComparison(){
 const t=useT(OSSIE_DETAILS).value,ui=useT(UI).common;
 const root=useRef<HTMLElement>(null),tabs=useTimedTabs(root,3,9000);
 function key(e:KeyboardEvent<HTMLButtonElement>,i:number){const next=e.key==='ArrowRight'?(i+1)%3:e.key==='ArrowLeft'?(i+2)%3:e.key==='Home'?0:e.key==='End'?2:null;if(next===null)return;e.preventDefault();tabs.select(next);root.current?.querySelectorAll<HTMLButtonElement>('[role=tab]')[next]?.focus()}
 return <section ref={root} className="ossie-section ossie-section--alt" id="value" aria-labelledby="ossie-value-heading"><div className="container">
  <div className="ossie-section-head"><span className="eyebrow">{t.eyebrow}</span><h2 id="ossie-value-heading">{t.title}</h2><p>{t.body}</p></div>
  <div className="ossie-value-tabs" role="tablist" aria-label={t.eyebrow} onFocusCapture={()=>tabs.setPaused(true)}>{t.tabs.map((title,i)=><button key={title} type="button" role="tab" id={`value-tab-${i}`} aria-controls={`value-panel-${i}`} aria-selected={tabs.active===i} tabIndex={tabs.active===i?0:-1} onClick={()=>tabs.select(i)} onKeyDown={e=>key(e,i)}><span>0{i+1}</span>{title}{tabs.active===i&&<span className="tab-countdown-line" key={tabs.cycle} data-running={tabs.running} aria-hidden="true" style={{'--tab-duration':`${tabs.duration}ms`} as CSSProperties}/>}</button>)}</div>
  {t.rows.map((row,i)=><div role="tabpanel" tabIndex={0} id={`value-panel-${i}`} aria-labelledby={`value-tab-${i}`} key={i} hidden={tabs.active!==i} className="ossie-value-panel"><div className="ossie-value-pair">{t.headers.map((heading,j)=><figure key={heading}><h3>{heading}</h3><Diagram index={i} after={j===1}/><figcaption>{j===0?row.current:row.benefit}</figcaption></figure>)}</div></div>)}
  <div className="ossie-value-controls"><span>{tabs.active+1} / 3</span>{!tabs.reduced&&<button type="button" aria-pressed={tabs.paused} onClick={()=>tabs.setPaused(v=>!v)}>{tabs.paused?<Play size={14}/>:<Pause size={14}/>} {tabs.paused?ui.playAnimation:ui.pauseAnimation}</button>}</div>
  <p className="ossie-proof-note">{t.note}</p><a className="ossie-text-link" href="#exchange">{t.link}<ArrowDown size={16}/></a>
 </div></section>;
}
