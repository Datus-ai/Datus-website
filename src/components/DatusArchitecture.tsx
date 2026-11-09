import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Bot, Braces, Database, FileCode2, Layers3, LayoutDashboard } from 'lucide-react';
import { HOME_NARRATIVE } from '../content/homeNarrative';
import { useT } from '../i18n/LocaleContext';
import '../styles/home-narrative.css';

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

/** Shared homepage architecture: all sources and destinations use a common boundary. */
export default function DatusArchitecture(){
 const t=useT(HOME_NARRATIVE).overview,diagram=useRef<HTMLElement>(null);
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
 return <figure ref={diagram} className="hp-architecture" data-flowing={flowing} aria-label={t.heading}>
   <div className="hp-architecture-end hp-architecture-end--sources"><h3>{t.sources}</h3>{t.inputs.map((label,i)=>{const Icon=sourceIcons[i];return <div key={label}><Icon size={19} strokeWidth={1.5}/><span>{label}</span></div>})}</div>
   <ArchitectureFlow/>
   <div className="hp-architecture-core"><div className="hp-architecture-brand">Datus</div>{module(0)}{module(1)}<div className="hp-architecture-foundation"><span>{t.foundation}</span>{module(2)}{module(3)}</div></div>
   <ArchitectureFlow output/>
   <div className="hp-architecture-end hp-architecture-end--outputs"><h3>{t.destinations}</h3>{t.outputs.map((label,i)=>{const Icon=outputIcons[i];return <div key={label}><Icon size={19} strokeWidth={1.5}/><span>{label}</span></div>})}</div>
  </figure>;
}
