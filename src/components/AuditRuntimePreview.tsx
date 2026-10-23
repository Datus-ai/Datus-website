import { useId, useState, type KeyboardEvent } from 'react';
import { ArrowRight, Check, Code2, Database, FileCode2, FileSearch, GitMerge, ShieldCheck } from 'lucide-react';
import { useT } from '../i18n/LocaleContext';
import { HOME_NARRATIVE } from '../content/homeNarrative';
import { NORTHSTAR } from '../content/northstarPreview';
import { NORTHSTAR_LINEAGE } from '../content/northstarLineage';
import '../pages/solutions/semantic-layer/modeling-workflow.css';
import '../styles/audit-runtime-preview.css';
import '../styles/audit-runtime-simple.css';

const margin=NORTHSTAR_LINEAGE.nodes.find(n=>n.id==='metric:contribution_margin')!;
const handling=NORTHSTAR_LINEAGE.nodes.find(n=>n.id==='metric:return_handling')!;
// Only physical tables named by the recorded SQL are shown, without a graph.
const sourceTables=NORTHSTAR_LINEAGE.nodes.filter(n=>n.layer===0&&NORTHSTAR.compiledSql.includes(n.name));
function reportKey(e:KeyboardEvent<HTMLButtonElement>,index:number,choose:(n:number)=>void){
 const next=e.key==='ArrowRight'||e.key==='ArrowLeft'?1-index:e.key==='Home'?0:e.key==='End'?1:null;
 if(next===null)return;e.preventDefault();choose(next);(e.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role=tab]')[next])?.focus();
}

/** Focused product fragments; data and expressions come from the Northstar demo. */
export default function AuditRuntimePreview({active,id}:{active:number;id:string}){
 const t=useT(HOME_NARRATIVE).runtime,w=t.walkthrough,s=w.simplified,reportId=useId();
 const [status,setStatus]=useState<'open'|'approved'|'merged'>('open'),[reportView,setReportView]=useState(0);
 return <div className="hp-audit-window hp-audit-window--simple sm-window">
  <div className="hp-audit-chrome"><span><ShieldCheck size={15}/>{s.recorded}</span><span className="hp-audit-status">DuckDB</span></div>
  {w.titles.map((title,i)=><div key={title} id={`${id}-audit-panel-${i}`} role="tabpanel" aria-labelledby={`${id}-audit-tab-${i}`} hidden={active!==i} tabIndex={0} className="hp-audit-panel">
   <div className="hp-audit-simple-body">
    {i===0&&<div className="ar-review"><div className="ar-file-heading"><FileCode2 size={15}/><code>{s.file}</code><small>{s.review}</small></div><div className="ar-diff"><div><span>− {s.before}</span><pre>name: return_handling{'\n'}expression: &gt;-{'\n'}  SUM(returns.processing_cost_cents)</pre></div><div><span>+ {s.after}</span><pre>name: return_handling{'\n'}expression: &gt;-{'\n'}  {handling.expression}</pre></div></div><div className="ar-review-actions"><span role="status">{status==='approved'?s.approved:status==='merged'?s.merged:''}</span>{status==='merged'?<button onClick={()=>setStatus('open')}>{s.replay}</button>:<><button disabled={status==='approved'} onClick={()=>setStatus('approved')}><Check size={14}/>{status==='approved'?s.approved:s.approve}</button><button disabled={status!=='approved'} onClick={()=>setStatus('merged')}><GitMerge size={14}/>{s.merge}</button></>}</div></div>}
    {i===1&&<div className="ar-planning"><div className="ar-query"><div className="ar-file-heading"><Code2 size={15}/><strong>{s.requestTitle}</strong></div><dl><div><dt>{w.source}</dt><dd>customers</dd></div><div><dt>{w.fields}</dt><dd>{NORTHSTAR.request.fields.map(field=><code key={field}>{field}</code>)}</dd></div><div><dt>{w.filter}</dt><dd><code>{NORTHSTAR.request.where_sql}</code></dd></div></dl></div><div className="ar-execution"><span>{w.model}</span><strong>northstar_premier</strong><FileCode2 size={25}/><code>Apache Ossie</code><ArrowRight size={20}/><strong>DOSI</strong><ArrowRight size={20}/><span>{s.target}</span><strong>DuckDB SQL</strong></div></div>}
    {i===2&&<div className="ar-sql"><div className="ar-file-heading"><FileCode2 size={15}/><code>northstar_premier.sql</code><small>{s.sqlExcerpt}</small></div><pre>{NORTHSTAR.compiledSql.split('\n').slice(0,14).join('\n')}{'\n-- …'}</pre><details><summary>{s.fullSql}</summary><pre>{NORTHSTAR.compiledSql}</pre></details></div>}
    {i===3&&<div className="ar-report"><div className="ar-report-main"><div className="ar-report-title"><FileSearch size={17}/><strong>{s.report}</strong></div><div className="ar-report-metric"><span>{s.metric}</span><button onClick={()=>setReportView(1)} aria-label={s.clickMetric}><FileSearch size={14}/>{s.insight}</button></div><div className="ar-report-bars">{NORTHSTAR.rows.map(row=><div key={row.customer_id}><span>{row.full_name}</span><i style={{width:`${Math.max(12,row.customer_margin/Math.max(...NORTHSTAR.rows.map(x=>x.customer_margin))*100)}%`}}/><strong>{row.customer_margin.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})}</strong></div>)}</div><div className="ar-report-filter"><span>{s.filter}</span><code>{NORTHSTAR.request.where_sql}</code></div></div>
     <aside className="ar-report-inspector"><div className="ar-file-heading"><FileSearch size={14}/><strong>{s.insight}</strong></div><div role="tablist" aria-label={s.insight} className="ar-report-tabs">{[s.source,s.calculation].map((label,index)=><button key={label} role="tab" id={`${reportId}-tab-${index}`} aria-selected={reportView===index} aria-controls={`${reportId}-panel-${index}`} tabIndex={reportView===index?0:-1} onClick={()=>setReportView(index)} onKeyDown={e=>reportKey(e,index,setReportView)}>{label}</button>)}</div>
      <div role="tabpanel" id={`${reportId}-panel-0`} aria-labelledby={`${reportId}-tab-0`} hidden={reportView!==0}><p>{s.sourceHeading}</p><ul>{sourceTables.map(table=><li key={table.id}><Database size={12}/><code>{table.name}</code></li>)}</ul></div>
      <div role="tabpanel" id={`${reportId}-panel-1`} aria-labelledby={`${reportId}-tab-1`} hidden={reportView!==1}><p>{s.calculationHeading}</p><code className="ar-metric-name">{margin.name}</code><pre>{margin.expression.replace(/([+-])(?=COALESCE)/g,'\n$1')}</pre></div>
     </aside></div>}
   </div>
   <p className="hp-audit-note">{w.notes[i]}</p>
  </div>)}
 </div>;
}
