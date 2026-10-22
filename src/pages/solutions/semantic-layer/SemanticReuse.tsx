import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { useHref, useT } from '../../../i18n/LocaleContext';
import { UI } from '../../../i18n/ui';
import { MODELING_COPY } from './modelingCopy';
import { WORKFLOW_PRODUCT_UI } from './workflowProductCopy';
import { NORTHSTAR_MODEL_EXCERPT } from './northstarSnippets';
import './semantic-reuse.css';

const destinations = [
 [{name:'Metabase',logo:'metabase'},{name:'Superset',logo:'superset'},{name:'Tableau',logo:'tableau'}],
 [{name:'Claude Code',logo:'claude'},{name:'Codex',logo:'openai'},{name:'Datus Agent',logo:'datus'}],
 [{name:'Python',logo:'python'},{name:'JavaScript',logo:'javascript'},{name:'Datus Studio',logo:'datus'}],
];

export default function SemanticReuse() {
 const t=useT(MODELING_COPY).reuse,product=useT(WORKFLOW_PRODUCT_UI),ui=useT(UI),l=useHref();
 const root=useRef<HTMLDivElement>(null),[paused,setPaused]=useState(false),[visible,setVisible]=useState(false),[reduced,setReduced]=useState(true),[documentVisible,setDocumentVisible]=useState(true);
 const layout=useRef<HTMLDivElement>(null),[connections,setConnections]=useState<{width:number;height:number;paths:{d:string;secondary?:boolean}[]}>({width:1200,height:500,paths:[]});
 useEffect(()=>{
  const container=layout.current;if(!container)return;
  function measure(){
   const bounds=container!.getBoundingClientRect(),yaml=container!.querySelector('.sr-yaml')!.getBoundingClientRect(),circle=container!.querySelector('.sr-routing>div')!.getBoundingClientRect();
   const cx=circle.left-bounds.left+circle.width/2,cy=circle.top-bounds.top+circle.height/2,mobile=window.matchMedia('(max-width:700px)').matches;
   const paths:{d:string;secondary?:boolean}[]=[];
   const n=(value:number)=>Math.round(value*100)/100;
   if(mobile)paths.push({d:`M${n(yaml.left-bounds.left+yaml.width/2)} ${n(yaml.bottom-bounds.top)} V${n(cy)}`});
   else paths.push({d:`M${n(yaml.right-bounds.left)} ${n(yaml.top-bounds.top+yaml.height/2)} H${n(cx)}`});
   const ports=[...container!.querySelectorAll('.sr-brand-wave>svg')].flatMap(wave=>{
    const rect=wave.getBoundingClientRect();return [78,91].map((y,i)=>({x:rect.left-bounds.left,y:rect.top-bounds.top+y/130*rect.height,secondary:i===1}));
   });
   if(mobile&&ports.length)paths.push({d:`M${n(cx)} ${n(cy)} C${n(cx)} ${n(cy+65)} 1 ${n(cy+65)} 1 ${n(cy+100)} V${n(ports[ports.length-1].y)}`});
   ports.forEach(port=>paths.push({secondary:port.secondary,d:mobile?`M1 ${n(port.y)} H${n(port.x)}`:`M${n(cx)} ${n(cy)} C${n(cx+(port.x-cx)*.65)} ${n(cy)} ${n(port.x-25)} ${n(port.y)} ${n(port.x)} ${n(port.y)}`}));
   setConnections({width:bounds.width,height:bounds.height,paths});
  }
  const observer=new ResizeObserver(measure);observer.observe(container);container.querySelectorAll('.sr-yaml,.sr-routing,.sr-destination-group').forEach(element=>observer.observe(element));measure();
  return()=>observer.disconnect();
 },[]);
 useEffect(()=>{
  const media=window.matchMedia('(prefers-reduced-motion: reduce)'),update=()=>setReduced(media.matches),updateVisibility=()=>setDocumentVisible(!document.hidden);
  update();updateVisibility();media.addEventListener('change',update);document.addEventListener('visibilitychange',updateVisibility);
  const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting),{threshold:.15});if(root.current)observer.observe(root.current);
  return()=>{observer.disconnect();media.removeEventListener('change',update);document.removeEventListener('visibilitychange',updateVisibility)};
 },[]);
 const labels=[t.bi,t.agents,t.applications],interfaces=[t.biInterface,t.agentInterface,t.appInterface],hrefs=['/integrations/','https://dosi.datus.ai/agents/','https://dosi.datus.ai/'];
 return <div className="semantic-reuse" ref={root} data-running={!paused&&visible&&!reduced&&documentVisible}>
  <span className="sr-vi-motif sr-vi-motif--loop" aria-hidden="true"/>
  <div className="sr-reuse-layout" ref={layout} role="group" aria-label={t.title}>
   <svg className="sr-connections" viewBox={`0 0 ${connections.width} ${connections.height}`} preserveAspectRatio="none" aria-hidden="true" focusable="false">{connections.paths.map((path,i)=><g key={i}><path className="sr-route-base" data-secondary={path.secondary} d={path.d}/>{!path.secondary&&<path className="sr-route-pulse" d={path.d}/>}</g>)}</svg>
   <div className="sr-yaml"><header><span className="sr-file-dot"/><span>northstar_premier.yaml</span><small>{product.excerpt}</small></header><pre tabIndex={0} aria-label="northstar_premier.yaml">{NORTHSTAR_MODEL_EXCERPT.split('\n').map((line,i)=><span className={line.trim().startsWith('#')?'sr-code-comment':undefined} key={i}><i aria-hidden="true">{i+1}</i><code>{line}</code></span>)}</pre><footer>Apache Ossie <span>{t.model}</span></footer></div>
   <div className="sr-routing"><div><strong>DOSI</strong><span>{t.execution}</span></div></div>
   <div className="sr-destinations">{destinations.map((brands,i)=><div className="sr-destination-group" key={labels[i]}><header><h3>{labels[i]}</h3><a href={l(hrefs[i])}>{interfaces[i]}</a></header><div className="sr-brand-wave"><svg viewBox="0 0 400 130" preserveAspectRatio="none" aria-hidden="true"><path d="M0 78 C75 78 70 22 150 35 S270 115 400 52"/><path d="M0 91 C75 91 83 39 153 48 S285 125 400 65"/></svg>{brands.map(brand=><figure className="sr-brand" key={brand.name}><span><img src={brand.logo==='datus'?'/brand-mark.svg':`/integrations/logos/${brand.logo}.svg`} alt="" aria-hidden="true" loading="lazy" width="30" height="30"/></span><figcaption>{brand.name}</figcaption></figure>)}</div></div>)}</div>
  </div>
  {!reduced&&<button type="button" className="sr-motion-control" aria-label={paused?ui.common.playAnimation:ui.common.pauseAnimation} onClick={()=>setPaused(!paused)}>{paused?<Play size={14}/>:<Pause size={14}/>} {paused?ui.common.playAnimation:ui.common.pauseAnimation}</button>}
 </div>;
}
