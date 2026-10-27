import { useState } from 'react';
import { CalendarDays, Database, FileText, KeyRound, Network, Package, ShoppingBag, Sigma, Sparkles, Truck, Undo2, Users, Wallet, BadgeCheck, Braces } from 'lucide-react';
import { useT } from '../i18n/LocaleContext';
import { BUSINESS_CONTEXT_DETAILS } from '../content/businessContextDetails';
import { NORTHSTAR } from '../content/northstarPreview';
import '../styles/business-definition-details.css';

export function OssieDefinitionIllustration(){
 const t=useT(BUSINESS_CONTEXT_DETAILS),icons=[Sigma,CalendarDays,Network,KeyRound,FileText,Sparkles];
 return <div className="bc-spec-map" role="img" aria-label={t.facets.map(f=>f.name).join(', ')}>
  <svg viewBox="0 0 600 350" preserveAspectRatio="none" aria-hidden="true"><ellipse cx="300" cy="175" rx="155" ry="137"/><path d="M105 64Q200 100 300 175M300 48V175M495 64Q400 100 300 175M105 287Q200 250 300 175M300 302V175M495 287Q400 250 300 175"/></svg>
  {t.facets.map((facet,i)=>{const Icon=icons[i];return <div className={`bc-spec-facet bc-spec-facet--${i}`} key={facet.name}><Icon size={22} strokeWidth={1.4}/><strong>{facet.name}</strong><span>{facet.detail}</span><code>{facet.example}</code></div>})}
  <div className="bc-spec-core"><Braces size={26} strokeWidth={1.4}/><strong>{t.spec}</strong><span>{t.core}</span></div>
 </div>;
}

const nodePositions:Record<string,[number,number]>={Customer:[13,29],Order:[43,32],OrderLine:[74,32],Product:[92,76],Delivery:[43,7],Return:[66,80],Refund:[36,80],Membership:[10,75]};
const icons:Record<string,typeof Users>={Customer:Users,Order:ShoppingBag,OrderLine:Package,Product:Package,Delivery:Truck,Return:Undo2,Refund:Wallet,Membership:BadgeCheck};
export function BusinessOntologyIllustration(){
 const t=useT(BUSINESS_CONTEXT_DETAILS),[selected,setSelected]=useState('Customer');
 const concept=NORTHSTAR.concepts.find(c=>c.name===selected)!;
 const edges=NORTHSTAR.relationships.filter(e=>nodePositions[e.source]&&nodePositions[e.target]);
 const related=NORTHSTAR.relationships.filter(e=>e.source===selected||e.target===selected);
 const properties=concept.properties.filter(p=>!['id','email','name','premier_b'].includes(p.name)).slice(0,4);
 return <div className="bc-ontology"><div className="bc-ontology-label"><span>{t.ontology}</span><small>{t.choose}</small></div>
  <div className="bc-ontology-map"><svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">{edges.map(edge=>{const a=nodePositions[edge.source],b=nodePositions[edge.target];return <path key={edge.source+edge.name} data-active={edge.source===selected||edge.target===selected} d={`M${a[0]} ${a[1]}C${a[0]+(b[0]-a[0])*.5} ${a[1]},${a[0]+(b[0]-a[0])*.5} ${b[1]},${b[0]} ${b[1]}`}/>})}</svg>
   {Object.entries(nodePositions).map(([name,[x,y]])=>{const Icon=icons[name];return <button key={name} type="button" className="bc-concept" style={{left:`${x}%`,top:`${y}%`}} aria-pressed={selected===name} onClick={()=>setSelected(name)}><span><Icon size={19} strokeWidth={1.4}/></span><strong>{name}</strong></button>})}
  </div>
  <div className="bc-concept-detail"><strong>{selected}</strong><div><span>{t.mapped}</span><code>{concept.dataset} · {concept.keys.join(', ')}</code></div><div><span>{t.properties}</span><code>{properties.map(p=>p.name).join(' · ')}</code></div><div><span>{t.relations}</span><code>{related.slice(0,2).map(r=>`${r.source} → ${r.name} → ${r.target}`).join('\n')}</code></div>{selected==='Membership'&&<p>{t.membership}</p>}</div>
 </div>;
}
