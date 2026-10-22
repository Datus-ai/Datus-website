import { useRef, useState, type KeyboardEvent } from 'react';
import { ArrowRight, Check, FileChartColumn, FileDiff, GitBranch, GitMerge, Network, RotateCcw, X } from 'lucide-react';
import { useT } from '../../../i18n/LocaleContext';
import NorthstarLineage, { NorthstarLineageInspector } from '../../../components/NorthstarLineage';
import { INTERFACE_PREVIEWS } from '../../../content/interfacePreviews';
import { WORKFLOW_PRODUCT_UI } from './workflowProductCopy';
import SolutionClickHint from './SolutionClickHint';
import './semantic-hub-review.css';

// A local review fixture, not a historical Northstar MR. The proposed expression
// matches the supplied model; the previous version leaves return handling in cents.
const contextLines = [
 'name: contribution_margin',
 'expression:',
 '  dialects:',
 '  - dialect: ANSI_SQL',
 '    expression: >-',
 '      COALESCE(SUM((lines.gross_sales_cents-lines.discount_cents)*0.01),0)',
 '      -COALESCE(SUM(refunds.merchandise_refund_cents*0.01),0)',
 '      -COALESCE(SUM(line_costs.cogs_cents*0.01),0)',
 '      +COALESCE(SUM(returns.recoverable_cogs_credit_cents*0.01),0)',
 '      -COALESCE(SUM(deliveries.shipping_cost_cents*0.01),0)',
 '      -COALESCE(SUM(line_costs.payment_fee_cents*0.01),0)',
];
const oldLine='      -COALESCE(SUM(returns.processing_cost_cents),0)';
const addedLine='      -COALESCE(SUM(returns.processing_cost_cents*0.01),0)';

function tabKey(event:KeyboardEvent<HTMLButtonElement>, index:number, choose:(index:number)=>void) {
 const next=event.key==='ArrowRight'||event.key==='ArrowLeft'?1-index:event.key==='Home'?0:event.key==='End'?1:null;
 if(next===null)return;
 event.preventDefault();choose(next);(event.currentTarget.parentElement?.children[next] as HTMLButtonElement)?.focus();
}

/** Adapted from Semantic Hub MrDetail: inline YAML diff, checks, approval, merge. */
export default function SemanticHubReview() {
 const t=useT(WORKFLOW_PRODUCT_UI).hub, preview=useT(INTERFACE_PREVIEWS);
 const [view,setView]=useState(0),[selected,setSelected]=useState('metric:contribution_margin');
 const [status,setStatus]=useState<'open'|'approved'|'merged'>('open'),[bottom,setBottom]=useState(0);
 const replay=useRef<HTMLButtonElement>(null),mergeButton=useRef<HTMLButtonElement>(null),approveButton=useRef<HTMLButtonElement>(null);
 const approved=status!=='open';
 const labels=[t.lineage,t.mergeRequest],bottomLabels=[t.checks,t.conversation];
 function approve(){setStatus('approved');requestAnimationFrame(()=>mergeButton.current?.focus())}
 function merge(){if(!approved)return;setStatus('merged');requestAnimationFrame(()=>replay.current?.focus())}
 function reset(){setStatus('open');setBottom(0);requestAnimationFrame(()=>approveButton.current?.focus())}
 return <div className="sh-review">
  <div className="sh-review-navigation"><div role="tablist" aria-label={t.name}>{labels.map((label,i)=><button key={label} type="button" role="tab" id={`hub-view-${i}`} aria-selected={view===i} aria-controls={`hub-view-panel-${i}`} tabIndex={view===i?0:-1} onClick={()=>setView(i)} onKeyDown={event=>tabKey(event,i,setView)}>{i===0?<Network size={15}/>:<GitMerge size={15}/>} {label}{i===1&&<small>1</small>}</button>)}</div><span>Northstar</span></div>
  <div role="tabpanel" id="hub-view-panel-0" aria-labelledby="hub-view-0" hidden={view!==0} tabIndex={0}>
   <div className="sh-lineage-heading"><p>{preview.hint}</p><button className="sw-primary sh-guided-action" onClick={()=>setView(1)}><FileDiff size={14}/>{t.review}<ArrowRight size={14}/>{view===0&&<SolutionClickHint repeat label={t.guideDiff}/>}</button></div>
   <p className="sh-lineage-pan">{t.pan}</p>
   <div className="sh-lineage-scroll" tabIndex={0} aria-label={t.lineage}><NorthstarLineage selected={selected} onSelect={setSelected} t={preview}/></div>
   <aside className="sh-lineage-inspector"><NorthstarLineageInspector selected={selected} t={preview}/></aside>
  </div>
  <div role="tabpanel" id="hub-view-panel-1" aria-labelledby="hub-view-1" hidden={view!==1} tabIndex={0}>
   <header className="sh-mr-header"><div><div className="sh-mr-title"><h3>{t.title}</h3><span className="sh-status" data-status={status} role="status">{t[status]}</span></div><p className="sh-mr-meta">MR #12 <span>·</span> {t.author} <span>·</span> northstar_premier</p><p className="sh-mr-path"><ArrowRight size={12}/>subject/semantic_models/northstar_premier.yaml</p></div>
    {status!=='merged'&&<div className="sh-mr-actions"><div><button ref={approveButton} className="sw-outline sh-guided-action" disabled={approved} onClick={approve}><Check size={13}/>{approved?t.approved:t.approve}{view===1&&!approved&&<SolutionClickHint repeat label={t.guideApprove}/>}</button><i/><button ref={mergeButton} className="sw-primary sh-guided-action" disabled={!approved} onClick={merge}><GitBranch size={13}/>{t.merge}{view===1&&approved&&<SolutionClickHint repeat label={t.guideMerge}/>}</button></div>{!approved&&<div className="sh-blockers"><strong>{t.blocked}</strong><span data-ok={false}><X size={13}/>{t.approvalCheck}</span><span data-ok={true}><Check size={13}/>{t.conflictCheck}</span><span data-ok={true}><Check size={13}/>{t.validationCheck}</span></div>}</div>}
   </header>
   {status==='merged'&&<div className="sh-merged" role="status"><GitMerge size={18}/><span>{t.mergeNote}</span><button ref={replay} className="sh-guided-action" onClick={reset}><RotateCcw size={13}/>{t.replay}{view===1&&<SolutionClickHint label={t.guideReplay}/>}</button></div>}
   <div className="sh-mr-body"><aside className="sh-tree-diff"><header>{t.treeDiff}<span>~1</span></header><div aria-current="true"><b>~</b><FileChartColumn size={14}/><span>contribution_margin</span></div></aside>
    <div className="sh-mr-main"><div className="sh-node-heading"><code>northstar_premier / contribution_margin</code><span>{t.modified}</span></div>
     <div className="sh-yaml-diff" role="region" aria-label={t.diffLabel} tabIndex={0}><pre>{contextLines.map((line,i)=><span key={i}><i aria-hidden="true">{i+1}</i><b aria-hidden="true"> </b><code>{line}</code></span>)}<span data-diff="removed"><i aria-hidden="true">12</i><b aria-hidden="true">−</b><code><span className="sh-sr-only">{t.before}: </span>{oldLine}</code></span><span data-diff="added"><i aria-hidden="true">12</i><b aria-hidden="true">+</b><code><span className="sh-sr-only">{t.after}: </span>{addedLine}</code></span></pre></div>
     <div className="sh-mr-bottom"><div role="tablist" aria-label={t.mergeRequest}>{bottomLabels.map((label,i)=><button key={label} role="tab" id={`hub-detail-${i}`} aria-controls={`hub-detail-panel-${i}`} aria-selected={bottom===i} tabIndex={bottom===i?0:-1} onClick={()=>setBottom(i)} onKeyDown={event=>tabKey(event,i,setBottom)}>{label}<small>{i===0?2:approved?1:0}</small></button>)}</div><div role="tabpanel" id="hub-detail-panel-0" aria-labelledby="hub-detail-0" hidden={bottom!==0}><p className="sh-check"><Check size={14}/>{t.conflictCheck}</p><p className="sh-check"><Check size={14}/>{t.validationCheck}</p></div><div role="tabpanel" id="hub-detail-panel-1" aria-labelledby="hub-detail-1" hidden={bottom!==1}>{approved?<div className="sh-conversation"><span><Check size={14}/>{t.reviewer}<i>{t.approved}</i></span><p>{t.approvedNote}</p></div>:<p className="sh-no-comments">{t.noComments}</p>}</div></div>
    </div>
   </div>
  </div>
 </div>;
}
