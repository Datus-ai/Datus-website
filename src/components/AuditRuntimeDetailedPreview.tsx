import { useState } from 'react';
import { Code2, Database, FileCode2, GitBranch, ShieldCheck } from 'lucide-react';
import { useT } from '../i18n/LocaleContext';
import { HOME_NARRATIVE } from '../content/homeNarrative';
import { AUDIT_DETAILED_PREVIEW } from '../content/auditDetailedPreview';
import { INTERFACE_PREVIEWS } from '../content/interfacePreviews';
import { NORTHSTAR } from '../content/northstarPreview';
import { NORTHSTAR_MODEL_EXCERPT } from '../pages/solutions/semantic-layer/northstarSnippets';
import SemanticHubReview from '../pages/solutions/semantic-layer/SemanticHubReview';
import NorthstarLineage, { NorthstarLineageInspector } from './NorthstarLineage';
import '../pages/solutions/semantic-layer/modeling-workflow.css';
import '../pages/solutions/semantic-layer/source-based-workflow.css';
import '../styles/audit-runtime-preview.css';

/** Source-backed product fragments and recorded artifacts; no live execution. */
export default function AuditRuntimeDetailedPreview({active,id}:{active:number;id:string}){
 const t=useT(HOME_NARRATIVE).runtime,archived=useT(AUDIT_DETAILED_PREVIEW),preview=useT(INTERFACE_PREVIEWS);
 const w={...t.walkthrough,titles:t.walkthrough.titles.map((title,i)=>i===3?archived.title:title),notes:t.walkthrough.notes.map((note,i)=>i===3?archived.note:note)};
 const [selected,setSelected]=useState('metric:contribution_margin');
 return <div className="hp-audit-window sm-window">
  <div className="hp-audit-chrome"><span><ShieldCheck size={15}/>{w.workspace}</span><div aria-hidden="true"><i/><i/><i/></div></div>
  {w.titles.map((title,i)=><div key={title} id={`${id}-audit-panel-${i}`} role="tabpanel" aria-labelledby={`${id}-audit-tab-${i}`} hidden={active!==i} tabIndex={0} className="hp-audit-panel">
   <header className="hp-audit-title"><span>0{i+1}</span><strong>{title}</strong>{i>0&&<small>DuckDB</small>}</header>
   <div className="hp-audit-body" tabIndex={0} aria-label={title}>
    {i===0&&<SemanticHubReview initialView={1}/>}
    {i===1&&<div className="hp-audit-request">
     <div className="hp-audit-request-heading"><Code2 size={15}/><strong>{w.request}</strong><code>northstar_premier</code></div>
     <dl className="hp-audit-fields"><div><dt>{w.source}</dt><dd><Database size={13}/>{NORTHSTAR.request.from}</dd></div><div><dt>{w.fields}</dt><dd>{NORTHSTAR.request.fields.map(field=><code key={field}>{field}</code>)}</dd></div><div><dt>{w.filter}</dt><dd><code>{NORTHSTAR.request.where_sql}</code></dd></div></dl>
     <div className="hp-audit-request-heading"><FileCode2 size={15}/><strong>{w.model}</strong><code>northstar_premier.yaml</code></div><pre className="hp-audit-code">{NORTHSTAR_MODEL_EXCERPT}</pre>
    </div>}
    {i===2&&<div className="hp-audit-sql"><div className="hp-audit-file"><FileCode2 size={14}/>northstar_premier.sql</div><pre className="hp-audit-code hp-audit-code--numbered">{NORTHSTAR.compiledSql.split('\n').map((line,index)=><span key={index}><i aria-hidden="true">{index+1}</i><code>{line||' '}</code></span>)}</pre></div>}
    {i===3&&<div className="hp-audit-results"><div className="hp-audit-request-heading"><Database size={15}/><strong>{w.results}</strong><small>{w.rows}</small></div><div className="hp-result-scroll"><table><thead><tr>{t.resultColumns.map(label=><th key={label}>{label}</th>)}</tr></thead><tbody>{NORTHSTAR.rows.map(row=><tr key={row.customer_id}><td>{row.full_name}</td><td>{row.customer_margin.toFixed(2)}</td><td>{row.customer_orders}</td><td>{(row.customer_return_rate*100).toFixed(1)}%</td></tr>)}</tbody></table></div>
     <div className="hp-audit-request-heading"><GitBranch size={15}/><strong>{w.lineage}</strong></div><div className="hp-audit-lineage" tabIndex={0} aria-label={w.lineage}><NorthstarLineage selected={selected} onSelect={setSelected} t={preview}/></div><aside className="hp-audit-inspector"><NorthstarLineageInspector selected={selected} t={preview}/></aside>
    </div>}
   </div>
   <p className="hp-audit-note">{w.notes[i]}</p>
  </div>)}
 </div>;
}
