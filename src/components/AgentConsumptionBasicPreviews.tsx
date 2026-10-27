import { useId, useState, type KeyboardEvent } from 'react';
import { ArrowUp, Bot, Braces, ChevronDown, Code2, FileCode2, FileText, LayoutDashboard, MessageSquare, Plus, Sparkles } from 'lucide-react';
import { useT } from '../i18n/LocaleContext';
import { HOME_AUDIENCES } from '../content/homeAudiences';
import { NORTHSTAR } from '../content/northstarPreview';
import { NORTHSTAR_LINEAGE } from '../content/northstarLineage';
import '../styles/agent-consumption-basic-previews.css';

const margin=NORTHSTAR_LINEAGE.nodes.find(n=>n.id==='metric:contribution_margin')!;
function keys(e:KeyboardEvent<HTMLButtonElement>,index:number,choose:(n:number)=>void){const next=e.key==='ArrowRight'||e.key==='ArrowLeft'?1-index:e.key==='Home'?0:e.key==='End'?1:null;if(next===null)return;e.preventDefault();choose(next);(e.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role=tab]')[next])?.focus()}
function MarginBars(){const max=Math.max(...NORTHSTAR.rows.map(r=>r.customer_margin));return <div className="aud-basic-margin-bars">{NORTHSTAR.rows.map(row=><div key={row.customer_id}><span>{row.full_name}</span><i style={{width:`${row.customer_margin/max*100}%`}}/><strong>{row.customer_margin.toFixed(2)}</strong></div>)}</div>}

/** Adapted Studio Agent + artifact composition, with recorded demo rows. */
export function BasicAnalystPreview(){
 const t=useT(HOME_AUDIENCES).analyst,[view,setView]=useState(0),id=useId();
 return <figure className="aud-basic-preview aud-basic-analyst"><header className="aud-basic-chrome"><span><LayoutDashboard size={17}/>{t.workspace}</span><small>{t.sample}</small></header>
  <div className="aud-basic-analyst-layout"><aside className="aud-basic-agent-pane"><strong><Bot size={16}/>{t.assistant}</strong><div className="aud-basic-question">{t.request}</div><p>{t.response}</p><div className="aud-basic-agent-file"><FileCode2 size={14}/>{t.files}</div><code>render/app.jsx</code><code>queries/premier.sql</code><span className="aud-basic-composer">{t.prompt}<MessageSquare size={13}/></span></aside>
   <main className="aud-basic-artifact-pane"><div className="aud-basic-artifact-tabs" role="tablist" aria-label={t.render}>{[t.dashboard,t.report].map((label,i)=><button type="button" key={label} role="tab" id={`${id}-tab-${i}`} aria-controls={`${id}-panel-${i}`} aria-selected={view===i} tabIndex={view===i?0:-1} onClick={()=>setView(i)} onKeyDown={e=>keys(e,i,setView)}>{i===0?<LayoutDashboard size={13}/>:<FileText size={13}/>} {label}</button>)}</div>
    <div className="aud-basic-artifact-path"><FileCode2 size={12}/>{view===0?t.dashboardFile:t.artifact}</div>
    <div id={`${id}-panel-0`} role="tabpanel" aria-labelledby={`${id}-tab-0`} hidden={view!==0} className="aud-basic-artifact-content" tabIndex={0}><div className="aud-basic-dashboard-title"><h4>{t.title}</h4><span>{t.qualified}<strong>{NORTHSTAR.rows.length}</strong></span></div><p className="aud-basic-chart-label">{t.margin}</p><MarginBars/></div>
    <div id={`${id}-panel-1`} role="tabpanel" aria-labelledby={`${id}-tab-1`} hidden={view!==1} className="aud-basic-artifact-content aud-basic-html-report" tabIndex={0}><h4>{t.title}</h4><p>{t.reportBody}</p><div className="aud-basic-report-rule"/><MarginBars/></div>
   </main>
  </div>
 </figure>;
}

/** ChatGPT-style illustration of a configured MCP client; no message is sent. */
export function BasicBusinessAssistantPreview(){
 const t=useT(HOME_AUDIENCES).business,[client,setClient]=useState<'ChatGPT'|'Claude'>('ChatGPT');
 return <div className="aud-basic-consumer-layout"><figure className="aud-basic-preview aud-basic-assistant"><header className="aud-basic-chrome"><span><img src={`/integrations/logos/${client==='ChatGPT'?'openai':'claude'}.svg`} width="21" height="21" alt=""/>{client}<ChevronDown size={13}/></span><small>{t.example}</small></header>
   <div className="aud-basic-chat-content"><div className="aud-basic-chat-user">{t.request}</div><div className="aud-basic-chat-tool"><Braces size={13}/>{t.tools}<span>MCP</span></div><p>{t.reply}</p><div className="aud-basic-chat-results"><div className="aud-basic-chat-results-head">{t.values.map(x=><strong key={x}>{x}</strong>)}</div>{NORTHSTAR.rows.map(row=><div key={row.customer_id}><span>{row.full_name}</span><code>{row.customer_margin.toFixed(2)}</code></div>)}</div><details className="aud-basic-chat-evidence"><summary><FileText size={12}/>{t.evidence}</summary><span>{t.metric}</span><pre>{margin.expression.replace(/([+-])(?=COALESCE)/g,'\n$1')}</pre><span>{t.sql}</span><pre>{NORTHSTAR.compiledSql}</pre></details><div className="aud-basic-chat-input"><Plus size={15}/><span>{t.input}</span><ArrowUp size={15}/></div></div>
  </figure><aside className="aud-basic-client-list"><span>{t.clients}</span><button type="button" aria-pressed={client==='ChatGPT'} onClick={()=>setClient('ChatGPT')}><img src="/integrations/logos/openai.svg" alt="" width="29" height="29"/>ChatGPT</button><button type="button" aria-pressed={client==='Claude'} onClick={()=>setClient('Claude')}><img src="/integrations/logos/claude.svg" alt="" width="29" height="29"/>Claude</button><div><img src="/integrations/logos/openai.svg" alt="" width="29" height="29"/>Codex</div><small>{t.clientHint}</small></aside>
 </div>;
}
