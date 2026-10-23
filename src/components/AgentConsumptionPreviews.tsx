import { useId, useState, type KeyboardEvent } from 'react';
import { ArrowUp, Bot, Braces, ChevronDown, FileCode2, FileText, LayoutDashboard, MessageSquare, Plus } from 'lucide-react';
import { useT } from '../i18n/LocaleContext';
import { HOME_AUDIENCES } from '../content/homeAudiences';
import { NORTHSTAR_REPORT_UI } from '../content/northstarReportUi';
import { NORTHSTAR_REPORT } from '../content/northstarReport';
import { NORTHSTAR } from '../content/northstarPreview';
import { NORTHSTAR_LINEAGE } from '../content/northstarLineage';
import '../styles/agent-consumption-previews.css';

const margin=NORTHSTAR_LINEAGE.nodes.find(n=>n.id==='metric:contribution_margin')!;
const customers=NORTHSTAR_REPORT.customers;
const money=(value:number)=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(value);
const percent=(value:number)=>`${(value*100).toFixed(1)}%`;
function aggregate(rows:readonly typeof customers[number][]){
 const orders=rows.reduce((sum,row)=>sum+row.orders,0);
 return {margin:rows.reduce((sum,row)=>sum+(row.margin??0),0),orders,customers:rows.length,returns:rows.reduce((sum,row)=>sum+row.returned_orders,0)/orders};
}
const total=aggregate(customers),premier=aggregate(customers.filter(row=>row.premier_a));
function keys(e:KeyboardEvent<HTMLButtonElement>,index:number,choose:(n:number)=>void){const next=e.key==='ArrowRight'||e.key==='ArrowLeft'?1-index:e.key==='Home'?0:e.key==='End'?1:null;if(next===null)return;e.preventDefault();choose(next);(e.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role=tab]')[next])?.focus()}

/** A report composed from the recorded demo cohort; no synthetic time series. */
function CustomerReport({document=false,conversation=false}:{document?:boolean;conversation?:boolean}){
 const t=useT(NORTHSTAR_REPORT_UI),[all,setAll]=useState(false),[selected,setSelected]=useState<number|null>(null);
 const rows=customers.filter(row=>all||row.premier_a),stats=aggregate(rows);
 const ranked=[...rows].filter(row=>row.margin!==null).sort((a,b)=>(b.margin??0)-(a.margin??0));
 const max=ranked[0]?.margin??1,share=stats.margin/total.margin;
 const person=rows.find(row=>row.customer_id===selected);
 const metrics=[[t.margin,money(stats.margin)],[t.orders,String(stats.orders)],[t.customers,String(stats.customers)],[t.returns,percent(stats.returns)]];
 return <div className={`aud-report-board${document?' aud-report-document':''}${conversation?' aud-report-conversation':''}`}>
  <div className="aud-report-heading"><div><span>{document?t.reportTag:t.period}</span><h4>{document?t.document:t.title}</h4></div><div className="aud-cohort-switch" role="group" aria-label={t.scope}><button type="button" aria-pressed={!all} onClick={()=>{setAll(false);setSelected(null)}}>{t.premier}</button><button type="button" aria-pressed={all} onClick={()=>{setAll(true);setSelected(null)}}>{t.all}</button></div></div>
  {document&&<p className="aud-executive-summary">{t.summary}</p>}
  <div className="aud-report-metrics">{metrics.map(([label,value])=><div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>
  <div className="aud-report-charts"><section className="aud-ranking"><header><h5>{t.ranking}</h5><span>USD</span></header><div className="aud-report-bars" aria-label={t.select}>{ranked.map(row=><button type="button" key={row.customer_id} aria-pressed={selected===row.customer_id} onClick={()=>setSelected(selected===row.customer_id?null:row.customer_id)}><span>{row.full_name}</span><i><b style={{width:`${(row.margin??0)/max*100}%`}}/></i><strong>{money(row.margin??0)}</strong></button>)}</div></section>
   <section className="aud-cohort-chart"><h5>{t.share}</h5><div className="aud-share-visual"><svg viewBox="0 0 100 100" role="img" aria-label={`${t.ofTotal}: ${percent(share)}`}><circle className="aud-share-track" cx="50" cy="50" r="39"/><circle className="aud-share-value" cx="50" cy="50" r="39" pathLength="100" strokeDasharray={`${share*100} 100`}/></svg><strong>{percent(share)}<small>{t.ofTotal}</small></strong></div><div className="aud-return-compare"><span>{t.returns}</span><div><b>{t.premier}</b><i><em style={{width:`${premier.returns/0.2*100}%`}}/></i><strong>{percent(premier.returns)}</strong></div><div><b>{t.total}</b><i><em style={{width:`${total.returns/0.2*100}%`}}/></i><strong>{percent(total.returns)}</strong></div></div></section>
  </div>
  {document?<div className="aud-report-findings"><div><h5>{t.findingTitle}</h5><p>{t.finding}</p></div><div><h5>{t.methodTitle}</h5><p>{t.method}</p></div></div>:!conversation&&<div className="aud-customer-table" tabIndex={0} aria-label={t.table}><table><thead><tr>{t.columns.map(label=><th key={label}>{label}</th>)}</tr></thead><tbody>{rows.map(row=><tr key={row.customer_id} data-selected={selected===row.customer_id}><td><button type="button" aria-pressed={selected===row.customer_id} onClick={()=>setSelected(selected===row.customer_id?null:row.customer_id)}>{row.full_name}</button></td><td>{row.orders}</td><td>{row.margin===null?'—':money(row.margin)}</td><td>{row.return_rate===null?'—':percent(row.return_rate)}</td></tr>)}</tbody></table></div>}
  <div className="aud-report-caption">{person?<><strong>{person.full_name}</strong><span>{t.marginPerOrder}: {person.orders?money((person.margin??0)/person.orders):'—'}</span><button type="button" onClick={()=>setSelected(null)}>{t.clear}</button></>:<><FileText size={11}/><span>{t.rule}</span></>}</div>
 </div>;
}

/** Studio Agent plus a rendered dashboard/HTML artifact, using recorded data. */
export function AnalystPreview(){
 const t=useT(HOME_AUDIENCES).analyst,[view,setView]=useState(0),id=useId();
 return <figure className="aud-preview aud-analyst"><header className="aud-chrome"><span><LayoutDashboard size={17}/>{t.workspace}</span><small>{t.sample}</small></header>
  <div className="aud-analyst-layout"><aside className="aud-agent-pane"><strong><Bot size={16}/>{t.assistant}</strong><div className="aud-question">{t.request}</div><p>{t.response}</p><div className="aud-agent-file"><FileCode2 size={14}/>{t.files}</div><code>render/app.jsx</code><code>queries/premier.sql</code><span className="aud-composer">{t.prompt}<MessageSquare size={13}/></span></aside>
   <main className="aud-artifact-pane"><div className="aud-artifact-tabs" role="tablist" aria-label={t.render}>{[t.dashboard,t.report].map((label,i)=><button type="button" key={label} role="tab" id={`${id}-tab-${i}`} aria-controls={`${id}-panel-${i}`} aria-selected={view===i} tabIndex={view===i?0:-1} onClick={()=>setView(i)} onKeyDown={e=>keys(e,i,setView)}>{i===0?<LayoutDashboard size={13}/>:<FileText size={13}/>} {label}</button>)}</div>
    <div className="aud-artifact-path"><FileCode2 size={12}/>{view===0?t.dashboardFile:t.artifact}</div>
    {[0,1].map(i=><div key={i} id={`${id}-panel-${i}`} role="tabpanel" aria-labelledby={`${id}-tab-${i}`} hidden={view!==i} className="aud-artifact-content" tabIndex={0}><CustomerReport document={i===1}/></div>)}
   </main>
  </div>
 </figure>;
}

/** ChatGPT-style illustration of a configured MCP client; no message is sent. */
export function BusinessAssistantPreview(){
 const t=useT(HOME_AUDIENCES).business,[client,setClient]=useState<'ChatGPT'|'Claude'>('ChatGPT');
 return <div className="aud-consumer-layout"><figure className="aud-preview aud-assistant"><header className="aud-chrome"><span><img src={`/integrations/logos/${client==='ChatGPT'?'openai':'claude'}.svg`} width="21" height="21" alt=""/>{client}<ChevronDown size={13}/></span><small>{t.example}</small></header>
   <div className="aud-chat-content"><div className="aud-chat-user">{t.request}</div><div className="aud-chat-tool"><Braces size={13}/>{t.tools}<span>MCP</span></div><p>{t.reply}</p><CustomerReport conversation/><details className="aud-chat-evidence"><summary><FileText size={12}/>{t.evidence}</summary><span>{t.metric}</span><pre>{margin.expression.replace(/([+-])(?=COALESCE)/g,'\n$1')}</pre><span>{t.sql}</span><pre>{NORTHSTAR.compiledSql}</pre></details><div className="aud-chat-input"><Plus size={15}/><span>{t.input}</span><ArrowUp size={15}/></div></div>
  </figure><aside className="aud-client-list"><span>{t.clients}</span><button type="button" aria-pressed={client==='ChatGPT'} onClick={()=>setClient('ChatGPT')}><img src="/integrations/logos/openai.svg" alt="" width="29" height="29"/>ChatGPT</button><button type="button" aria-pressed={client==='Claude'} onClick={()=>setClient('Claude')}><img src="/integrations/logos/claude.svg" alt="" width="29" height="29"/>Claude</button><small>{t.clientHint}</small></aside>
 </div>;
}
