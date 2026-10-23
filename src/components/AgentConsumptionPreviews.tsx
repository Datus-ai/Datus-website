import { useId, useState, type KeyboardEvent } from 'react';
import { ArrowRight, ArrowUp, BarChart3, Bot, Braces, ChevronDown, Database, FileCode2, FileText, LayoutDashboard, MessageSquare, Plus, SlidersHorizontal } from 'lucide-react';
import { useT } from '../i18n/LocaleContext';
import { HOME_AUDIENCES } from '../content/homeAudiences';
import { AUDIENCE_SCENARIO_UI } from '../content/audienceScenarioUi';
import { NORTHSTAR_REPORT_UI } from '../content/northstarReportUi';
import { NORTHSTAR_REPORT } from '../content/northstarReport';
import { NORTHSTAR } from '../content/northstarPreview';
import { NORTHSTAR_LINEAGE } from '../content/northstarLineage';
import SolutionClickHint from '../pages/solutions/semantic-layer/SolutionClickHint';
import '../styles/agent-consumption-previews.css';
import '../styles/audience-scenarios.css';

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
function DashboardReport(){
 const t=useT(NORTHSTAR_REPORT_UI),s=useT(AUDIENCE_SCENARIO_UI).dashboard,[all,setAll]=useState(false),[selected,setSelected]=useState<number|null>(null),[cycle,setCycle]=useState(0);
 const rows=customers.filter(row=>all||row.premier_a),stats=aggregate(rows);
 const ranked=[...rows].filter(row=>row.margin!==null).sort((a,b)=>(b.margin??0)-(a.margin??0));
 const max=ranked[0]?.margin??1,share=stats.margin/total.margin;
 const person=rows.find(row=>row.customer_id===selected);
 const metrics=[[t.margin,money(stats.margin)],[t.orders,String(stats.orders)],[t.customers,String(stats.customers)],[t.returns,percent(stats.returns)]];
 return <div className="aud-report-board aud-dashboard-board">
  <div className="aud-report-heading"><div><span>{t.period}</span><h4>{t.title}</h4></div><div className="aud-cohort-switch" role="group" aria-label={t.scope}><button type="button" aria-pressed={!all} onClick={()=>{setAll(false);setSelected(null);setCycle(n=>n+1)}}>{t.premier}</button><button type="button" aria-pressed={all} onClick={()=>{setAll(true);setSelected(null);setCycle(n=>n+1)}}>{t.all}</button></div></div>
  <div key={cycle} className="aud-query-flow" data-changed={cycle>0} role="status" aria-label={cycle?s.changed:s.ready}>{[s.filters,s.query,s.update].map((label,i)=>{const Icon=[SlidersHorizontal,Database,BarChart3][i];return <span key={label}><Icon size={12}/>{label}{i<2&&<ArrowRight size={11}/>}</span>})}</div>
  <div className="aud-report-metrics">{metrics.map(([label,value])=><div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>
  <div className="aud-report-charts"><section className="aud-ranking"><header><h5>{t.ranking}</h5><span>USD</span></header><div className="aud-report-bars" aria-label={t.select}>{ranked.map(row=><button type="button" key={row.customer_id} aria-pressed={selected===row.customer_id} onClick={()=>setSelected(selected===row.customer_id?null:row.customer_id)}><span>{row.full_name}</span><i><b style={{width:`${(row.margin??0)/max*100}%`}}/></i><strong>{money(row.margin??0)}</strong></button>)}</div></section>
   <section className="aud-cohort-chart"><h5>{t.share}</h5><div className="aud-share-visual"><svg viewBox="0 0 100 100" role="img" aria-label={`${t.ofTotal}: ${percent(share)}`}><circle className="aud-share-track" cx="50" cy="50" r="39"/><circle className="aud-share-value" cx="50" cy="50" r="39" pathLength="100" strokeDasharray={`${share*100} 100`}/></svg><strong>{percent(share)}<small>{t.ofTotal}</small></strong></div><div className="aud-return-compare"><span>{t.returns}</span><div><b>{t.premier}</b><i><em style={{width:`${premier.returns/0.2*100}%`}}/></i><strong>{percent(premier.returns)}</strong></div><div><b>{t.total}</b><i><em style={{width:`${total.returns/0.2*100}%`}}/></i><strong>{percent(total.returns)}</strong></div></div></section>
  </div>
  <div className="aud-customer-table" tabIndex={0} aria-label={t.table}><table><thead><tr>{t.columns.map(label=><th key={label}>{label}</th>)}</tr></thead><tbody>{rows.map(row=><tr key={row.customer_id} data-selected={selected===row.customer_id}><td><button type="button" aria-pressed={selected===row.customer_id} onClick={()=>setSelected(selected===row.customer_id?null:row.customer_id)}>{row.full_name}</button></td><td>{row.orders}</td><td>{row.margin===null?'—':money(row.margin)}</td><td>{row.return_rate===null?'—':percent(row.return_rate)}</td></tr>)}</tbody></table></div>
  <div className="aud-report-caption">{person?<><strong>{person.full_name}</strong><span>{t.marginPerOrder}: {person.orders?money((person.margin??0)/person.orders):'—'}</span><button type="button" onClick={()=>setSelected(null)}>{t.clear}</button></>:<><FileText size={11}/><span>{t.rule}</span></>}</div>
 </div>;
}

/** A published-report composition: saved results and findings, no query filters. */
function ReportSnapshot(){
 const t=useT(NORTHSTAR_REPORT_UI),s=useT(AUDIENCE_SCENARIO_UI).report;
 const rows=customers.filter(row=>row.premier_a),share=premier.margin/total.margin;
 return <article className="aud-snapshot">
  <header className="aud-snapshot-toolbar"><strong>{s.brand}</strong><span>{s.version}</span><time dateTime="2026-10-20">{s.date}</time></header>
  <div className="aud-snapshot-page"><span className="aud-snapshot-state"><FileText size={11}/>{s.snapshot}</span><h4>{s.title}</h4><p className="aud-snapshot-summary">{s.summary}</p>
   <div className="aud-snapshot-lead"><div><strong>{percent(share)}</strong><span>{s.share}</span></div><div className="aud-snapshot-share"><div role="img" aria-label={`${t.premier}: ${percent(share)}`}><i style={{width:`${share*100}%`}}/><b/></div><p><span><i/>{t.premier}</span><span><i/>{s.others}</span></p></div></div>
   <div className="aud-snapshot-body"><div className="aud-customer-table aud-snapshot-table"><table><thead><tr>{t.columns.map(label=><th key={label}>{label}</th>)}</tr></thead><tbody>{rows.map(row=><tr key={row.customer_id}><td>{row.full_name}</td><td>{row.orders}</td><td>{money(row.margin??0)}</td><td>{percent(row.return_rate??0)}</td></tr>)}</tbody></table></div>
   <div className="aud-snapshot-notes"><h5>{s.finding}</h5><p>{s.findingBody}</p></div></div><p className="aud-snapshot-action"><strong>{s.action}. </strong>{s.actionBody}</p>
   <details className="aud-snapshot-evidence"><summary><FileText size={11}/>{s.basis}</summary><strong>{s.definition}</strong><pre>{margin.expression.replace(/([+-])(?=COALESCE)/g,'\n$1')}</pre><strong>{s.tables}</strong><ul>{NORTHSTAR.sourceTables.filter(table=>NORTHSTAR.compiledSql.includes(table)).map(table=><li key={table}><code>{table}</code></li>)}</ul></details>
  </div>
 </article>;
}

/** Studio uses distinct data lifecycles for a dashboard and a report. */
export function AnalystPreview(){
 const t=useT(HOME_AUDIENCES).analyst,s=useT(AUDIENCE_SCENARIO_UI),[view,setView]=useState(0),id=useId();
 return <figure className="aud-preview aud-analyst"><header className="aud-chrome"><span><LayoutDashboard size={17}/>{t.workspace}</span><small>{t.sample}</small></header>
  <div className="aud-analyst-layout"><aside className="aud-agent-pane"><strong><Bot size={16}/>{t.assistant}</strong><div className="aud-question">{t.request}</div><p>{view===0?s.dashboard.response:s.report.response}</p><div className="aud-agent-file"><FileCode2 size={14}/>{t.files}</div><code>render/app.jsx</code><code>{view===0?s.dashboard.file:s.report.file}</code><span className="aud-composer">{t.prompt}<MessageSquare size={13}/></span></aside>
   <main className="aud-artifact-pane"><div className="aud-artifact-tabs" role="tablist" aria-label={t.render}>{[t.dashboard,t.report].map((label,i)=><button type="button" key={label} role="tab" id={`${id}-tab-${i}`} aria-controls={`${id}-panel-${i}`} aria-selected={view===i} tabIndex={view===i?0:-1} onClick={()=>setView(i)} onKeyDown={e=>keys(e,i,setView)}>{i===0?<LayoutDashboard size={13}/>:<FileText size={13}/>} {label}{i===1&&view===0&&<SolutionClickHint/>}</button>)}</div>
    <div className="aud-artifact-path"><FileCode2 size={12}/>{view===0?t.dashboardFile:t.artifact}</div>
    <div id={`${id}-panel-0`} role="tabpanel" aria-labelledby={`${id}-tab-0`} hidden={view!==0} className="aud-artifact-content" tabIndex={0}><DashboardReport/></div>
    <div id={`${id}-panel-1`} role="tabpanel" aria-labelledby={`${id}-tab-1`} hidden={view!==1} className="aud-artifact-content aud-document-stage" tabIndex={0}><ReportSnapshot/></div>
   </main>
  </div>
 </figure>;
}

function AssistantAnswer(){
 const t=useT(NORTHSTAR_REPORT_UI),s=useT(AUDIENCE_SCENARIO_UI).business,[followup,setFollowup]=useState<0|1|2>(0);
 const rows=customers.filter(row=>row.premier_a).sort((a,b)=>(b.margin??0)-(a.margin??0));
 return <div className="aud-native-answer">
  <details className="aud-native-tool"><summary><Braces size={12}/>{s.used}<span>MCP</span><ChevronDown size={12}/></summary><p>{s.returned}</p><code>{s.source}</code><strong>{s.definition}</strong><pre>{margin.expression.replace(/([+-])(?=COALESCE)/g,'\n$1')}</pre><strong>{s.sql}</strong><pre>{NORTHSTAR.compiledSql}</pre></details>
  <p className="aud-native-reply">{s.reply}</p>
  <div className="aud-native-table"><table><thead><tr>{s.table.map(label=><th key={label}>{label}</th>)}</tr></thead><tbody>{rows.map(row=><tr key={row.customer_id}><td>{row.full_name}</td><td>{new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(row.margin??0)}</td><td><i><b style={{width:`${(row.margin??0)/premier.margin*100}%`}}/></i><span>{percent((row.margin??0)/premier.margin)}</span></td></tr>)}</tbody></table></div>
  <div className="aud-native-prompts" role="group" aria-label={s.suggestions}><button type="button" aria-pressed={followup===1} onClick={()=>setFollowup(followup===1?0:1)}>{s.compare}<ArrowRight size={12}/>{followup===0&&<SolutionClickHint/>}</button><button type="button" aria-pressed={followup===2} onClick={()=>setFollowup(followup===2?0:2)}>{s.detail}<ArrowRight size={12}/></button></div>
  {followup!==0&&<div className="aud-native-followup" aria-live="polite"><div className="aud-chat-user">{followup===1?s.compare:s.detail}</div><p>{followup===1?s.compareReply:s.detailReply}</p><div className="aud-native-table"><table><thead><tr>{(followup===1?s.cohortColumns:s.detailColumns).map(label=><th key={label}>{label}</th>)}</tr></thead><tbody>{followup===1?[[t.premier,premier],[t.all,total]].map(([label,stats])=>{const value=stats as ReturnType<typeof aggregate>;return <tr key={label as string}><td>{label as string}</td><td>{money(value.margin)}</td><td>{value.orders}</td><td>{percent(value.returns)}</td></tr>}):rows.map(row=><tr key={row.customer_id}><td>{row.full_name}</td><td>{row.orders}</td><td>{percent(row.return_rate??0)}</td></tr>)}</tbody></table></div></div>}
 </div>;
}

/** Client-native answers composed from tool results, not a Studio report UI. */
export function BusinessAssistantPreview(){
 const t=useT(HOME_AUDIENCES).business,[client,setClient]=useState<'ChatGPT'|'Claude'>('ChatGPT');
 return <div className="aud-consumer-layout"><figure className="aud-preview aud-assistant aud-assistant-native"><header className="aud-chrome"><span><img src={`/integrations/logos/${client==='ChatGPT'?'openai':'claude'}.svg`} width="21" height="21" alt=""/>{client}<ChevronDown size={13}/></span><small>{t.example}</small></header>
   <div className="aud-chat-content"><div className="aud-chat-user">{t.request}</div><AssistantAnswer/><div className="aud-chat-input"><Plus size={15}/><span>{t.input}</span><ArrowUp size={15}/></div></div>
  </figure><aside className="aud-client-list"><span>{t.clients}</span><button type="button" aria-pressed={client==='ChatGPT'} onClick={()=>setClient('ChatGPT')}><img src="/integrations/logos/openai.svg" alt="" width="29" height="29"/>ChatGPT</button><button type="button" aria-pressed={client==='Claude'} onClick={()=>setClient('Claude')}><img src="/integrations/logos/claude.svg" alt="" width="29" height="29"/>Claude</button><small>{t.clientHint}</small></aside>
 </div>;
}
