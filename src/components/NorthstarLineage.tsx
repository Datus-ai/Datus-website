import { Database, Layers3, Sigma, GitMerge } from 'lucide-react';
import { NORTHSTAR_LINEAGE as graph } from '../content/northstarLineage';
import type { PreviewCopy } from '../content/interfacePreviews';
import '../styles/northstar-lineage.css';
const columns = [{x:14,width:210},{x:266,width:134},{x:446,width:172},{x:660,width:164}];
const positions = new Map(graph.nodes.map(node=>{
 const peers=graph.nodes.filter(n=>n.layer===node.layer);
 const index=peers.findIndex(n=>n.id===node.id);
 const y=node.layer===3?210+index*156:54+index*(430/(peers.length-1));
 return [node.id,{...columns[node.layer],y}];
}));
function ancestors(id:string){
 const ids=new Set([id]);
 let changed=true;
 while(changed){changed=false;for(const edge of graph.edges)if(ids.has(edge.target)&&!ids.has(edge.source)){ids.add(edge.source);changed=true}}
 return ids;
}
export function NorthstarLineageInspector({selected,t}:{selected:string;t:PreviewCopy}){
 const node=graph.nodes.find(n=>n.id===selected)!;
 const upstream=graph.edges.filter(e=>e.target===selected).map(e=>graph.nodes.find(n=>n.id===e.source)!);
 const labels=[t.tables,t.models,t.atomic,t.derived];
 return <><h4>{node.name}</h4><span className="pi-tag">{labels[node.layer]}</span><label>{t.mapping}</label><div className="pi-lineage-upstream">{upstream.map(n=><div key={n.id}>{n.name}</div>)}{!upstream.length&&<div>{node.name}</div>}</div>{node.expression&&<><label>{node.layer<2?t.fields:t.metrics}</label><pre className="pi-lineage-expression">{node.expression}</pre></>}<p>{t.lineageSubset}</p></>;
}
export default function NorthstarLineage({selected,onSelect,t}:{selected:string;onSelect:(id:string)=>void;t:PreviewCopy}){
 const active=ancestors(selected);
 const labels=[t.tables,t.models,t.atomic,t.derived];
 return <div className="pi-graph-area pi-real-lineage">
  <div className="pi-real-lineage__lanes">{labels.map((label,i)=><span key={label} style={{left:columns[i].x,width:columns[i].width}}>{label}</span>)}</div>
  <svg className="pi-real-lineage__edges" viewBox="0 0 836 510" aria-hidden="true">
   {graph.edges.map(edge=>{const a=positions.get(edge.source)!;const b=positions.get(edge.target)!;const x=a.x+a.width;const y=a.y+14;const end=b.y+14;const highlighted=active.has(edge.source)&&active.has(edge.target);return <path key={edge.id} data-source={edge.source} data-target={edge.target} className={highlighted?'is-active':'is-dim'} d={`M${x} ${y} C${x+25} ${y},${b.x-25} ${end},${b.x} ${end}`}/>})}
  </svg>
  {graph.nodes.map(node=>{const position=positions.get(node.id)!;const Icon=[Database,Layers3,Sigma,GitMerge][node.layer];return <button key={node.id} type="button" className={`pi-real-lineage__node pi-real-lineage__node--${node.layer}`} data-active={active.has(node.id)} data-node={node.id} style={{left:position.x,top:position.y,width:position.width}} title={node.name} aria-pressed={selected===node.id} onClick={()=>onSelect(node.id)}><Icon size={11}/><span>{node.name}</span></button>})}
  <span className="pi-canvas-note">{t.lineageSubset}</span>
 </div>;
}
