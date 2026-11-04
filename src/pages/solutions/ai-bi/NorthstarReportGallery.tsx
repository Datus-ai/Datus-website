import { useState, type CSSProperties, type KeyboardEvent } from 'react';
import { ArrowUpRight, Bot, Braces, Database, FileText, Monitor, PlugZap, SearchCheck, Share2 } from 'lucide-react';
import { NORTHSTAR_REPORT } from '../../../content/northstarReport';
import { useHref, useT } from '../../../i18n/LocaleContext';
import { AI_BI_CONTENT } from './content';
import ExploratoryChatDemo from './ExploratoryChatDemo';
import './report-gallery.css';

const customers = NORTHSTAR_REPORT.customers;
const premier = customers.filter(customer => customer.premier_a);
const margin = premier.reduce((sum, customer) => sum + (customer.margin ?? 0), 0);
const allMargin = customers.reduce((sum, customer) => sum + (customer.margin ?? 0), 0);
const orders = premier.reduce((sum, customer) => sum + customer.orders, 0);
const money = (value: number) => value.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 });
const pct = (value: number) => `${(value * 100).toFixed(1)}%`;
const icons = [SearchCheck, Monitor, Share2];

function ArrowKeys({ event, index, count, set }: { event: KeyboardEvent<HTMLButtonElement>; index: number; count: number; set: (index: number) => void }) {
  const next = event.key === 'ArrowRight' ? (index + 1) % count : event.key === 'ArrowLeft' ? (index + count - 1) % count : event.key === 'Home' ? 0 : event.key === 'End' ? count - 1 : null;
  if (next === null) return;
  event.preventDefault();
  set(next);
  event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('button')[next]?.focus();
}

function Chrome({ path }: { path: string }) {
  return <div className="ai-bi-gallery__chrome"><i/><i/><i/><span>{path}</span></div>;
}

function ScenarioChannel({ active, onChange, labels, title }: { active: number; onChange: (index: number) => void; labels: string[]; title: string }) {
  return <div className="ai-bi-scenario__channel" role="group" aria-label={title}>{labels.map((label, index) => <button key={label} type="button" aria-pressed={active === index} onClick={() => onChange(index)} onKeyDown={event => ArrowKeys({event,index,count:labels.length,set:onChange})}>{label}</button>)}</div>;
}

function Conversation({ channel, prompt, action, answer, labels }: { channel: string; prompt: string; action: string; answer?: string; labels: {you: string; agent: string; tool: string} }) {
  return <div className="ai-bi-scenario__conversation"><div className="ai-bi-scenario__bubble ai-bi-scenario__bubble--you"><span>{labels.you}</span><p>{prompt}</p></div><div className="ai-bi-scenario__bubble"><span><Bot size={14}/>{channel}</span><p>{action}</p></div><div className="ai-bi-scenario__tool"><Braces size={15}/><span>{labels.tool}</span><strong>northstar_premier.yaml</strong></div>{answer && <div className="ai-bi-scenario__bubble"><span><Bot size={14}/>{labels.agent}</span><p>{answer}</p></div>}</div>;
}

function AgentSupportStrip({ t }: { t: (typeof AI_BI_CONTENT)['en']['scenarios'] }) {
  const agents = [
    { name: 'Datus Agent', logo: '/logo_light.svg', kind: 'datus' },
    { name: 'ChatGPT', logo: '/integrations/logos/openai.svg', kind: 'external' },
    { name: 'Claude', logo: '/integrations/logos/claude.svg', kind: 'external' },
    { name: 'Codex', logo: '/integrations/logos/openai.svg', kind: 'external' },
  ];
  return <div className="ai-bi-scenario__agents"><span className="ai-bi-scenario__field-label">{t.report.agentsLabel}</span><div className="ai-bi-scenario__agent-list">{agents.map(agent => <span key={agent.name} className={`ai-bi-scenario__agent-pill ai-bi-scenario__agent-pill--${agent.kind}`}><img src={agent.logo} alt=""/>{agent.name}</span>)}<span className="ai-bi-scenario__agent-pill"><PlugZap size={16}/>{t.report.anyAgent}</span></div></div>;
}

function DashboardPreview({ t }: { t: (typeof AI_BI_CONTENT)['en']['scenarios'] }) {
  const share = margin / allMargin;
  return <div className="ai-bi-scenario__dashboard ai-bi-gallery__window--dark"><Chrome path="Northstar / premier-dashboard"/><div className="ai-bi-gallery__inner"><div className="ai-bi-gallery__brand">NORTHSTAR <small>Rule A · DOSI</small></div><h3>{t.monitor.title}</h3><div className="ai-bi-gallery__kpis"><div><span>{t.audience}</span><strong>{premier.length}</strong></div><div><span>{t.margin}</span><strong>{money(margin)}</strong></div><div><span>{t.orders}</span><strong>{orders}</strong></div></div><div className="ai-bi-gallery__charts"><div><h4>{t.monitor.ranking}</h4>{premier.map(customer => <div className="ai-bi-gallery__bar" key={customer.customer_id}><span>{customer.full_name}</span><strong>{money(customer.margin ?? 0)}</strong><i><b style={{width:`${(customer.margin ?? 0)/(premier[0].margin ?? 1)*100}%`}}/></i></div>)}</div><div className="ai-bi-gallery__donut-panel"><h4>{t.monitor.share}</h4><div className="ai-bi-gallery__donut" style={{'--share':`${share*100}%`} as CSSProperties}><strong>{pct(share)}</strong></div></div></div></div></div>;
}

function ReportPreview({ t, style }: { t: (typeof AI_BI_CONTENT)['en']['scenarios']; style: number }) {
  const r = t.report;
  return <div className={`ai-bi-scenario__report ai-bi-scenario__report--${style}`}><Chrome path="Northstar / premier-membership-brief.html"/>
    {style === 0 && <div className="ai-bi-scenario__report-executive"><aside><span>NORTHSTAR</span><strong>{r.executiveTag}</strong></aside><div><small>HTML REPORT</small><h3>{r.title}</h3><p>{r.summary}</p><div className="ai-bi-scenario__rule"><strong>{r.ruleTitle}</strong><span>{t.rule}</span></div><h4>{r.who}</h4><CustomerTable t={t}/></div></div>}
    {style === 1 && <div className="ai-bi-scenario__report-visual"><div className="ai-bi-scenario__report-visual-top"><span>NORTHSTAR / PREMIER</span><small>{r.visualTag}</small><h3>{r.visualLead}</h3></div><div className="ai-bi-scenario__report-visual-body"><div className="ai-bi-scenario__visual-stat"><strong>{money(margin)}</strong><span>{t.margin} · {orders} {t.orders}</span></div>{premier.map(customer => <div className="ai-bi-gallery__bar" key={customer.customer_id}><span>{customer.full_name}</span><strong>{money(customer.margin ?? 0)}</strong><i><b style={{width:`${(customer.margin ?? 0)/(premier[0].margin ?? 1)*100}%`}}/></i></div>)}<p>{t.rule}</p></div></div>}
    {style === 2 && <div className="ai-bi-scenario__report-analyst"><div className="ai-bi-scenario__report-analyst-head"><span>NORTHSTAR / {r.analystTag}</span><h3>{r.title}</h3><p>{r.summary}</p></div><div className="ai-bi-scenario__report-analyst-kpis"><span>{premier.length} {t.audience}</span><span>{money(margin)} {t.margin}</span><span>{orders} {t.orders}</span></div><CustomerTable t={t}/><div className="ai-bi-scenario__method"><strong>{r.ruleTitle}</strong><p>{t.rule}</p><small>{r.analystScope}</small><small>{r.analystMethod}</small></div></div>}
  </div>;
}

function CustomerTable({ t }: { t: (typeof AI_BI_CONTENT)['en']['scenarios'] }) {
  return <div className="ai-bi-gallery__table"><table><thead><tr><th>{t.customer}</th><th>{t.margin}</th><th>{t.orders}</th><th>{t.returnRate}</th></tr></thead><tbody>{premier.map(customer => <tr key={customer.customer_id}><td>{customer.full_name}</td><td>{money(customer.margin ?? 0)}</td><td>{customer.orders}</td><td>{pct(customer.return_rate ?? 0)}</td></tr>)}</tbody></table></div>;
}

export default function NorthstarReportGallery() {
  const t = useT(AI_BI_CONTENT).scenarios;
  const l = useHref();
  const [scenario, setScenario] = useState(0);
  const [channel, setChannel] = useState(0);
  const [reportStyle, setReportStyle] = useState(0);
  return <section className="ai-bi-gallery" aria-labelledby="ai-bi-gallery-title"><div className="container ai-bi-section">
    <div className="ai-bi-section-head"><span className="eyebrow">{t.eyebrow}</span><h2 id="ai-bi-gallery-title">{t.title}</h2><p className="lead">{t.lead}</p></div>
    <div className="ai-bi-gallery__definition"><span>{t.shared}</span><strong>{t.rule}</strong></div>
    <div className="ai-bi-scenario__tabs" role="group" aria-label={t.eyebrow}>{t.modes.map((mode,index) => {const Icon=icons[index];return <button key={mode.title} type="button" aria-pressed={scenario===index} onClick={()=>setScenario(index)} onKeyDown={event=>ArrowKeys({event,index,count:t.modes.length,set:setScenario})}><Icon size={20}/><strong>{mode.title}</strong><span>{mode.detail}</span></button>;})}</div>
    {scenario===0 && <div className="ai-bi-scenario__chat-scene"><div className="ai-bi-scenario__chat-intro"><div><span className="ai-bi-scenario__number">01 / 03</span><h3>{t.explore.heading}</h3><p>{t.chat.sceneLead}</p></div><div><span className="ai-bi-scenario__field-label">{t.channelLabel}</span><ScenarioChannel active={channel} onChange={setChannel} labels={t.channels} title={t.channelLabel}/></div></div><ExploratoryChatDemo t={t} channel={channel}/></div>}
    {scenario!==0 && <div className="ai-bi-scenario__layout" key={scenario}><div className="ai-bi-scenario__story">
      <span className="ai-bi-scenario__number">0{scenario+1} / 03</span><h3>{scenario===0?t.explore.heading:scenario===1?t.monitor.heading:t.report.heading}</h3>
      {scenario===2 && <><Conversation channel={t.report.agentLabel} prompt={t.report.prompt} action={t.report.workflow} labels={t}/><AgentSupportStrip t={t}/><p className="ai-bi-scenario__note">{t.report.agentNote}</p></>}
      {scenario===1 && <><p>{t.monitor.body}</p><div className="ai-bi-scenario__monitor-list"><span><Braces size={16}/>{t.rule}</span><span><Database size={16}/>Northstar · DuckDB</span><span><FileText size={16}/>{t.audience} · {t.margin} · {t.orders}</span></div><p className="ai-bi-scenario__note">{t.monitor.note}</p></>}
    </div><div className="ai-bi-scenario__result">
      {scenario===1&&<DashboardPreview t={t}/>}
      {scenario===2&&<><div className="ai-bi-scenario__style-tabs" role="group" aria-label={t.report.stylesLabel}>{t.report.styles.map((name,index)=><button key={name} type="button" aria-pressed={reportStyle===index} onClick={()=>setReportStyle(index)} onKeyDown={event=>ArrowKeys({event,index,count:t.report.styles.length,set:setReportStyle})}>{name}</button>)}</div><ReportPreview t={t} style={reportStyle}/></>}
    </div></div>}
    <div className="ai-bi-scenario__foot"><p>{t.source}</p><a href={l('/blog/composable-analytics-agent-built-dashboards/')}>{t.link}<ArrowUpRight size={15}/></a></div>
  </div></section>;
}
