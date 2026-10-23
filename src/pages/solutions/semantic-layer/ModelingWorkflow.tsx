import { useState, type KeyboardEvent, type ReactNode } from 'react';
import { Bot, Database, GitBranch, Layers3 } from 'lucide-react';
import { useT } from '../../../i18n/LocaleContext';
import { WORKFLOW_PRODUCT_UI } from './workflowProductCopy';
import { MODELING_COPY } from './modelingCopy';
import { GatherKnowledge, DraftModel, ReviewModel } from './SourceBasedWorkflow';
import { SOLUTION_EXPERIENCE } from './experience';
import SolutionClickHint from './SolutionClickHint';
import './modeling-workflow.css';

function tabKey(event: KeyboardEvent<HTMLButtonElement>, index: number, count: number, choose: (index: number) => void) {
 const next = event.key === 'ArrowRight' ? (index + 1) % count : event.key === 'ArrowLeft' ? (index + count - 1) % count : event.key === 'Home' ? 0 : event.key === 'End' ? count - 1 : null;
 if (next === null) return;
 event.preventDefault(); choose(next);
 (event.currentTarget.parentElement?.children[next] as HTMLButtonElement)?.focus();
}

export function ModelWindow({children, label}:{children: ReactNode; label:string}) {
 const t = useT(MODELING_COPY);
 return <div className="sm-window"><header className="sm-window__header"><span><Layers3 size={19}/>Datus Studio</span><span className="sm-window__path">{label}</span><small>{t.illustration}</small></header>{children}</div>;
}

export default function ModelingWorkflow() {
 const x=useT(SOLUTION_EXPERIENCE), t=useT(MODELING_COPY),product=useT(WORKFLOW_PRODUCT_UI),[active,setActive]=useState(0),[hint,setHint]=useState(true);
 function choose(index:number){setActive(index);setHint(false)}
 const icons=[Database,Bot,GitBranch];
 return <div className="sm-workflow"><div className="sm-workflow-tabs" role="tablist" aria-label={x.buildTitle}>{x.buildSteps.map((step,i)=>{const Icon=icons[i];return <button key={step.title} type="button" role="tab" id={`model-step-${i}`} tabIndex={active===i?0:-1} aria-selected={active===i} aria-controls={`model-step-panel-${i}`} onClick={()=>choose(i)} onKeyDown={event=>tabKey(event,i,3,choose)}><span className="sm-step-number" aria-hidden="true">0{i+1}</span><Icon size={21}/><strong>{step.title}</strong>{i===2&&hint&&<SolutionClickHint repeat/>}</button>})}</div>
  {x.buildSteps.map((step,i)=><div key={step.title} role="tabpanel" id={`model-step-panel-${i}`} aria-labelledby={`model-step-${i}`} hidden={active!==i} tabIndex={0}><p className="sm-step-description">{step.body}</p><ModelWindow label={i===2?product.hub.name:t.workspace}><div className="sm-enter">{i===0?<GatherKnowledge/>:i===1?<DraftModel/>:<ReviewModel/>}</div></ModelWindow></div>)}
 </div>;
}
