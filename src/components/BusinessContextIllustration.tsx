import { useEffect, useRef, useState } from 'react';
import { Bot, Database, FileCode2, FileText, Layers3, ShoppingBag, Users, Package, Sigma } from 'lucide-react';
import { useT } from '../i18n/LocaleContext';
import { HOME_NARRATIVE } from '../content/homeNarrative';
import '../styles/business-context-illustration.css';
import { BusinessOntologyIllustration, OssieDefinitionIllustration } from './BusinessDefinitionDetails';

/** Small explanatory drawings, not a simulated full product workspace. */
export default function BusinessContextIllustration({kind}:{kind:number}){
 const t=useT(HOME_NARRATIVE).model.illustration,root=useRef<HTMLDivElement>(null),[flowing,setFlowing]=useState(false);
 useEffect(()=>{let visible=false;const update=()=>setFlowing(visible&&!document.hidden);const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;update()},{threshold:.2});if(root.current)observer.observe(root.current);document.addEventListener('visibilitychange',update);return()=>{observer.disconnect();document.removeEventListener('visibilitychange',update)}},[]);
 const node=(x:number,y:number,label:string,Icon:typeof Bot,accent=false)=><g className={accent?'bc-node bc-node--accent':'bc-node'}><circle cx={x} cy={y} r="30"/><g transform={`translate(${x-12} ${y-12})`}><Icon size={24} strokeWidth={1.4}/></g><text x={x} y={y+(kind===2?45:53)} textAnchor="middle">{label}</text></g>;
 if(kind===0)return <BusinessOntologyIllustration/>;
 if(kind===1)return <OssieDefinitionIllustration/>;
 return <div ref={root} className="bc-art" data-kind={kind} data-flowing={flowing}><svg viewBox="0 0 560 270" role="img" aria-label={t.labels[kind]}>
  <circle className="bc-orbit" cx="280" cy="135" r="117"/><circle className="bc-orbit bc-orbit--outer" cx="280" cy="135" r="135"/>
  {kind===0&&<><path className="bc-connector" d="M98 154C155 154 176 92 244 92M308 92C375 92 395 154 462 154"/><path className="bc-current" d="M98 154C155 154 176 92 244 92M308 92C375 92 395 154 462 154"/>{node(64,154,t.customer,Users)}{node(276,92,t.order,ShoppingBag,true)}{node(496,154,t.line,Package)}<text className="bc-relation" x="167" y="111">{t.places}</text><text className="bc-relation" x="376" y="111">{t.contains}</text></>}
  {kind===1&&<><path className="bc-connector" d="M138 78C180 78 204 144 248 144M138 204C190 204 200 144 248 144M308 144H414"/>{node(108,78,t.metric,Sigma)}{node(108,204,t.dimension,Layers3)}{node(278,144,'Ossie',FileCode2,true)}{node(448,144,t.mapping,Database)}<text className="bc-code" x="278" y="231" textAnchor="middle">customers.customer_id</text></>}
  {kind===2&&<><path className="bc-connector" d="M98 54C230 54 221 135 338 135M98 135H338M98 216C230 216 221 135 338 135"/><path className="bc-current" d="M98 54C230 54 221 135 338 135M98 135H338M98 216C230 216 221 135 338 135"/>{node(68,54,t.documents,FileText)}{node(68,135,t.sql,FileCode2)}{node(68,216,t.warehouse,Database)}{node(370,135,'Datus Agent',Bot,true)}<text className="bc-relation" x="425" y="129">{t.context}</text></>}
 </svg></div>;
}
