import { useState } from 'react';
import { Database, GitBranch, Layers3, Network } from 'lucide-react';
import { useT } from '../../../i18n/LocaleContext';
import { NORTHSTAR } from '../../../content/northstarPreview';
import { NORTHSTAR_LINEAGE } from '../../../content/northstarLineage';
import { MODELING_COPY } from './modelingCopy';
import { ModelWindow } from './ModelingWorkflow';
import SolutionClickHint from './SolutionClickHint';

const positions: Record<string,[number,number]> = {
 Customer:[338,66], Order:[338,222], OrderLine:[338,378], Product:[570,410],
 Delivery:[570,80], LineCost:[570,245], Membership:[106,66], BenefitEntitlement:[106,222],
 Benefit:[106,378], Refund:[802,80], Return:[802,330],
};
const metrics = NORTHSTAR_LINEAGE.nodes.filter(node=>['booked_revenue','order_count','order_return_rate'].includes(node.name));
const dimensions = [NORTHSTAR.concepts[0].properties[3],NORTHSTAR.concepts[3].properties[2],NORTHSTAR.concepts[1].properties[1]];

export default function SemanticModelPreview() {
 const t=useT(MODELING_COPY), [active,setActive]=useState(0),[selected,setSelected]=useState('Customer'),[hint,setHint]=useState(true);
 const concept=NORTHSTAR.concepts.find(item=>item.name===selected)!;
 const tabs=[t.metrics,t.relationships,t.mappings];
 const icons=[Layers3,Network,GitBranch];
 return <div className="sm-model-preview"><ModelWindow label={t.model}>
  <div className="sm-model-tabs" role="tablist" aria-label={t.model}>{tabs.map((tab,i)=>{const Icon=icons[i];return <button key={tab} role="tab" type="button" id={`meaning-tab-${i}`} aria-selected={active===i} aria-controls={`meaning-panel-${i}`} tabIndex={active===i?0:-1} onClick={()=>{setActive(i);setHint(false)}} onKeyDown={event=>{
   const next=event.key==='ArrowRight'?(i+1)%3:event.key==='ArrowLeft'?(i+2)%3:event.key==='Home'?0:event.key==='End'?2:null;
   if(next===null)return;event.preventDefault();setActive(next);setHint(false);(event.currentTarget.parentElement?.children[next] as HTMLButtonElement)?.focus();
  }}><Icon size={17}/>{tab}{i===1&&hint&&<SolutionClickHint/>}</button>})}<span>Apache Ossie</span></div>
  <div id="meaning-panel-0" role="tabpanel" aria-labelledby="meaning-tab-0" hidden={active!==0} tabIndex={0}><div className="sm-definitions">
   <div><p className="sm-label">{t.metricsLabel}</p>{metrics.map(metric=><article key={metric.id}><Layers3 size={18}/><div><strong>{metric.name}</strong><code>{metric.expression}</code></div></article>)}</div>
   <div><p className="sm-label">{t.dimensions}</p>{dimensions.map(dimension=><article key={dimension.field}><Database size={18}/><div><strong>{dimension.name}</strong><span>{dimension.field}</span><small>{dimension.type}</small></div></article>)}</div>
  </div></div>
  <div id="meaning-panel-1" role="tabpanel" aria-labelledby="meaning-tab-1" hidden={active!==1} tabIndex={0}><p className="sm-pan-hint">↔ {t.panHint}</p><div className="sm-ontology-layout"><div role="region" aria-label={t.ontology} tabIndex={0}><p className="sm-ontology-hint">{t.relationshipHint}</p><svg className="sm-ontology" viewBox="0 0 910 480" aria-label={t.ontology}>
   {NORTHSTAR.relationships.map(edge=>{const [x1,y1]=positions[edge.source],[x2,y2]=positions[edge.target];return <path key={edge.source+edge.name} data-active={edge.source===selected||edge.target===selected} d={`M${x1} ${y1} C${(x1+x2)/2+35} ${y1} ${(x1+x2)/2+35} ${y2} ${x2} ${y2}`}/>})}
   {NORTHSTAR.concepts.map(item=>{const [x,y]=positions[item.name];return <g key={item.name} role="button" tabIndex={0} aria-label={item.name} aria-pressed={item.name===selected} onClick={()=>setSelected(item.name)} onKeyDown={event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();setSelected(item.name)}}} transform={`translate(${x},${y})`}><rect x={-95} y={-30} width={190} height={60} rx={5}/><text y={-3} textAnchor="middle">{item.name}</text><text className="sm-ontology__dataset" y={17} textAnchor="middle">{item.dataset}</text></g>})}
  </svg></div><aside className="sm-entity-inspector"><span className="sm-label">{t.ontology}</span><h3>{concept.name}</h3><p>{t.mappings}</p>{concept.sources.map(source=><code key={source}>{source}</code>)}<p>{t.relationships}</p>{NORTHSTAR.relationships.filter(edge=>edge.source===selected||edge.target===selected).map(edge=><div key={edge.source+edge.name}><strong>{edge.name}</strong><span>{edge.source} → {edge.target}</span></div>)}</aside></div></div>
  <div id="meaning-panel-2" role="tabpanel" aria-labelledby="meaning-tab-2" hidden={active!==2} tabIndex={0}><div className="sm-source-mappings"><p>{t.sourceHint}</p><div className="sm-mapping-table" tabIndex={0} role="region" aria-label={t.mappings}><table><thead><tr><th>{t.source}</th><th>{t.model}</th><th>{t.ontology}</th></tr></thead><tbody>{NORTHSTAR.concepts.filter(concept=>concept.sources.length).slice(0,6).map(concept=><tr key={concept.name}><td><Database size={15}/>{concept.sources[0]}</td><td>{concept.properties[0].field}</td><td><Network size={15}/>{concept.name}<span>{concept.properties[0].name}</span></td></tr>)}</tbody></table></div></div></div>
 </ModelWindow></div>;
}
