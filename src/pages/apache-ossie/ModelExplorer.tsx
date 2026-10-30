import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { isMap, isSeq, parse, parseDocument } from 'yaml';
import { Braces, Database, Download, FileCode2, GitBranch, Layers3, MessageSquare } from 'lucide-react';
import { useT } from '../../i18n/LocaleContext';
import { OSSIE_PAGE } from './content';
import { OSSIE_MODEL_UI } from './modelUi';
import northstar from '../../public/examples/apache-ossie/northstar-explained.yaml?raw';

type Format='yaml'|'json';
const keys=['datasets','fields','relationships','metrics','context'];
const icons=[Database,Braces,GitBranch,Layers3,MessageSquare];
const documents:Record<Format,string>={yaml:northstar.trimEnd(),json:JSON.stringify(parse(northstar),null,2)};
function categorize(text:string){
 const lines=text.split('\n'),starts:number[]=[];let offset=0;
 lines.forEach(line=>{starts.push(offset);offset+=line.length+1});
 const categories=lines.map(()=>new Set<string>()),document=parseDocument(text);
 function mark(start:number,end:number,key:string,remove?:string){starts.forEach((position,i)=>{if(position<end&&(starts[i+1]??text.length+1)>start){categories[i].add(key);if(remove)categories[i].delete(remove)}});}
 if(isMap(document.contents))for(const pair of document.contents.items){
  const key=String(pair.key),node=pair.value;
  if(!node||!('range' in node)||!node.range)continue;
  const start=(pair.key as {range?:number[]})?.range?.[0]??node.range[0];
  if(['datasets','relationships','metrics','ai_context'].includes(key))mark(start,node.range[1],key==='ai_context'?'context':key);
  if(key==='datasets'&&isSeq(node))for(const dataset of node.items){
   if(!isMap(dataset))continue;
   const fieldPair=dataset.items.find(item=>String(item.key)==='fields');
   if(fieldPair?.value&&'range' in fieldPair.value&&fieldPair.value.range){
    const fieldStart=(fieldPair.key as {range?:number[]})?.range?.[0]??fieldPair.value.range[0];
    mark(fieldStart,fieldPair.value.range[1],'fields','datasets');
   }
  }
 }
 return {lines,categories};
}
const snippets={yaml:categorize(documents.yaml),json:categorize(documents.json)};
export default function ModelExplorer(){
 const t=useT(OSSIE_PAGE).model,ui=useT(OSSIE_MODEL_UI),[active,setActive]=useState(0),[format,setFormat]=useState<Format>('yaml');
 const code=useRef<Record<Format,HTMLPreElement|null>>({yaml:null,json:null}),buttons=useRef<(HTMLButtonElement|null)[]>([]);
 useEffect(()=>{const first=snippets[format].categories.findIndex(set=>set.has(keys[active]));const viewport=code.current[format],row=viewport?.querySelector<HTMLElement>(`[data-line="${first}"]`);if(row&&viewport)viewport.scrollTo({top:row.offsetTop-18,behavior:'instant'});},[active,format]);
 function keyboard(event:KeyboardEvent<HTMLButtonElement>,index:number){const next=event.key==='ArrowDown'||event.key==='ArrowRight'?(index+1)%5:event.key==='ArrowUp'||event.key==='ArrowLeft'?(index+4)%5:event.key==='Home'?0:event.key==='End'?4:null;if(next===null)return;event.preventDefault();setActive(next);buttons.current[next]?.focus();}
 return <div className="ossie-explorer"><div className="ossie-explorer__choices" role="tablist" aria-label={ui.choose} aria-orientation="vertical">{t.items.map((item,i)=>{const Icon=icons[i];return <button key={item.key} ref={el=>{buttons.current[i]=el}} type="button" role="tab" id={`northstar-attribute-${i}`} aria-selected={active===i} aria-controls="northstar-code" tabIndex={active===i?0:-1} onClick={()=>setActive(i)} onKeyDown={e=>keyboard(e,i)}><Icon size={20}/><span><strong>{item.label}</strong><code>{item.code}</code><span>{item.body}</span></span></button>})}</div><div className="ossie-example ossie-explorer__document" id="formats"><div className="ossie-example__toolbar ossie-explorer__formatbar"><span><FileCode2 size={15}/>northstar-explained.{format}</span><div className="ossie-format-switch" role="group" aria-label={ui.format}>{(['yaml','json'] as const).map(value=><button type="button" key={value} aria-pressed={format===value} onClick={()=>setFormat(value)}>{value.toUpperCase()}</button>)}</div></div><p className="ossie-explorer__highlight" aria-live="polite">{ui.highlighted}: {t.items[active].label}</p><div role="tabpanel" id="northstar-code" aria-labelledby={`northstar-attribute-${active}`} tabIndex={0}>{(['yaml','json'] as const).map(value=><pre key={value} ref={el=>{code.current[value]=el}} hidden={format!==value} aria-label={value.toUpperCase()}><code>{snippets[value].lines.map((line,i)=><span key={i} data-line={i} className={snippets[value].categories[i].has(keys[active])?'ossie-yaml-line is-highlighted':'ossie-yaml-line'}><span className="ossie-yaml-number" aria-hidden="true">{i+1}</span><span>{line||' '}{'\n'}</span></span>)}</code></pre>)}</div><div className="ossie-example__footer"><a href={format==='yaml'?'/examples/apache-ossie/northstar-explained.yaml':`data:application/json;charset=utf-8,${encodeURIComponent(documents.json)}`} download={`northstar-explained.${format}`}><Download size={14}/>{ui.download}</a><span>{ui.scope}</span></div></div><p className="ossie-explorer__note">{ui.note}</p></div>;
}
