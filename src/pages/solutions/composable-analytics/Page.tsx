import { useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, Check, Code2, LayoutDashboard, PanelTop, RefreshCw, ShieldCheck } from 'lucide-react';
import Breadcrumb from '../../../components/Breadcrumb';
import FAQ from '../../../components/FAQ';
import SiteLayout from '../../../components/SiteLayout';
import { STUDIO_LOGIN_URL } from '../../../config/nav';
import { useHref, useLocale, useT } from '../../../i18n/LocaleContext';
import { UI } from '../../../i18n/ui';
import { studioCtaUrl } from '../../../lib/studio-cta';
import { COMPOSABLE_CONTENT } from './content';
import './style.css';

const DASHBOARD_DOCS = 'https://docs.datus.ai/dev/subagent/gen_visual_dashboard/';
const REPORT_DOCS = 'https://docs.datus.ai/dev/subagent/gen_visual_report/';

function HeroPreview({ t }: { t: typeof COMPOSABLE_CONTENT.en.hero }) {
  return <div className="ca-hero-visual" role="img" aria-label={`${t.metric}: ${t.total}, ${t.customers}`}>
    <div className="ca-visual-header"><span className="ca-window-dots"><i/><i/><i/></span><span>{t.window}</span><span className="ca-preview-status">{t.status}</span></div>
    <div className="ca-hero-flow">
      <div className="ca-source-card"><div className="ca-visual-kicker"><ShieldCheck size={15}/>{t.sourceLabel}</div><strong>{t.metric}</strong><small>{t.metricDetail}</small></div>
      <div className="ca-flow-connector"><span/><ArrowRight size={17}/></div>
      <div className="ca-output-card"><div className="ca-visual-kicker"><LayoutDashboard size={15}/>{t.viewLabel}</div><strong>{t.viewTitle}</strong><div className="ca-output-mini"><div><small>{t.totalLabel}</small><b>{t.total}</b><small>{t.customers}</small></div><div className="ca-mini-bars"><i/><i/><i/></div></div><small>{t.chartLabel}</small></div>
    </div>
    <div className="ca-visual-footer"><span className="ca-visual-pulse"/>{t.sourceNote}</div>
  </div>;
}

function Dashboard({ t, revised }: { t: typeof COMPOSABLE_CONTENT.en.demo; revised: boolean }) {
  const chart = <div className="ca-dashboard-chart" aria-label={t.chart}><div className="ca-widget-top"><span>{t.chart}</span><span>⋯</span></div><div className="ca-bars">{t.rows.map(row=><div key={row.name}><span>{row.name}</span><div className="ca-bar-track"><i style={{ width: row.width }}/></div><b>{row.margin}</b></div>)}</div></div>;
  const table = <div className="ca-dashboard-table"><div className="ca-widget-top"><span>{t.table}</span><span>⋯</span></div><div className="ca-table-scroll"><table><thead><tr>{t.columns.map(c=><th key={c}>{c}</th>)}</tr></thead><tbody>{t.rows.map(row=><tr key={row.name}><td>{row.name}</td><td>{row.margin}</td><td>{row.orders}</td><td>{row.rate}</td></tr>)}</tbody></table></div></div>;
  return <div className="ca-dashboard"><div className="ca-dashboard-bar"><span className="ca-window-dots"><i/><i/><i/></span><span>{t.windowTitle}</span><span className="ca-review"><Check size={12}/>{t.review}</span></div><div className="ca-dashboard-body"><div className="ca-dashboard-top"><div><small>{t.kpi}</small><strong>{t.value}</strong><span>{t.subtitle}</span></div>{revised && <div className="ca-filter">{t.filter}</div>}</div><div className={`ca-dashboard-grid${revised ? ' ca-dashboard-grid--revised' : ''}`}>{chart}{table}</div></div></div>;
}

function ComposeDemo({ t }: { t: typeof COMPOSABLE_CONTENT.en.demo }) {
  const [active, setActive] = useState(0);
  return <section id="see-it" className="ca-section ca-section--tinted" aria-labelledby="ca-demo-title"><div className="container ca-section-inner"><div className="ca-section-head"><span className="eyebrow">{t.eyebrow}</span><h2 id="ca-demo-title">{t.title}</h2><p>{t.lead}</p></div><div className="ca-demo-shell"><div className="ca-demo-controls"><div className="ca-demo-tabs" role="tablist" aria-label={t.title}>{t.tabs.map((tab,i)=><button type="button" key={tab} id={`ca-tab-${i}`} role="tab" aria-controls="ca-demo-panel" aria-selected={active===i} tabIndex={active===i?0:-1} onClick={()=>setActive(i)} onKeyDown={event=>{ if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();const next=active===0?1:0;setActive(next);event.currentTarget.parentElement?.querySelectorAll('button')[next]?.focus();} }}>{i===1?<RefreshCw size={15}/>:<PanelTop size={15}/>} {tab}</button>)}</div><div className="ca-metric-chip"><ShieldCheck size={14}/><span>{t.metricLabel}: <b>{t.metric}</b></span></div></div><div id="ca-demo-panel" role="tabpanel" aria-labelledby={`ca-tab-${active}`} tabIndex={0} className="ca-demo-main"><div className="ca-demo-prompt"><span>{t.requestLabel}</span><p>“{t.requests[active]}”</p></div><Dashboard t={t} revised={active===1}/></div><p className="ca-demo-note">{t.note}</p></div></div></section>;
}

export default function ComposableAnalyticsPage() {
  const t = useT(COMPOSABLE_CONTENT);
  const ui = useT(UI);
  const l = useHref();
  const locale = useLocale();
  return <SiteLayout className="composable-analytics-page" staggerSections>
    <Breadcrumb currentUrl="/solutions/composable-analytics/" items={[{ label: ui.nav.home, href: '/' }, { label: ui.nav.solutions, noSchema: true }, { label: ui.nav.composableAnalytics }]}/>
    <section className="container ca-hero" aria-labelledby="ca-title"><div className="ca-hero-copy"><span className="eyebrow">{t.eyebrow}</span><h1 id="ca-title"><span>{t.titlePrefix}</span>{' '}<br/>{t.title}</h1><p>{t.lead}</p><div className="ca-actions"><a className="btn btn-primary btn-lg" href="#see-it">{t.heroPrimary}<ArrowDown size={17}/></a><a className="ca-text-link" href={DASHBOARD_DOCS} target="_blank" rel="noopener noreferrer">{t.heroSecondary}<ArrowUpRight size={16}/></a></div></div><HeroPreview t={t.hero}/></section>

    <section className="ca-section" aria-labelledby="ca-definition-title"><div className="container ca-section-inner"><div className="ca-section-head"><span className="eyebrow">{t.definition.eyebrow}</span><h2 id="ca-definition-title">{t.definition.title}</h2><p>{t.definition.body}</p></div><div className="ca-definition-grid"><article><span className="ca-card-label"><ShieldCheck size={17}/>{t.definition.invariant}</span><h3>{t.definition.invariantTitle}</h3><p>{t.definition.invariantBody}</p></article><div className="ca-definition-middle"><div className="ca-definition-node"><Code2 size={19}/><b>{t.definition.modelLabel}</b></div><div className="ca-definition-lines"><i/><i/><i/></div>{t.definition.destinations.map((item,i)=><div className="ca-destination" key={item}><span>{String(i+1).padStart(2,'0')}</span>{item}</div>)}</div><article><span className="ca-card-label"><LayoutDashboard size={17}/>{t.definition.variable}</span><h3>{t.definition.variableTitle}</h3><p>{t.definition.variableBody}</p></article></div><p className="ca-caption">{t.definition.caption}</p></div></section>

    <ComposeDemo t={t.demo}/>

    <section className="ca-section" aria-labelledby="ca-workflow-title"><div className="container ca-section-inner"><div className="ca-section-head"><span className="eyebrow">{t.workflow.eyebrow}</span><h2 id="ca-workflow-title">{t.workflow.title}</h2><p>{t.workflow.lead}</p></div><div className="ca-workflow-strip"><span>{t.workflow.source}</span><ArrowRight size={20}/><span>{t.workflow.agent}</span><ArrowRight size={20}/><span>{t.workflow.output}</span></div><div className="ca-steps">{t.workflow.steps.map(step=><article key={step.number}><span>{step.number}</span><h3>{step.title}</h3><p>{step.body}</p></article>)}</div><div className="ca-workflow-notes"><p><Check size={17}/>{t.workflow.runtime}</p><p><ShieldCheck size={17}/>{t.workflow.boundary}</p></div></div></section>

    <section className="ca-section ca-section--tinted" aria-labelledby="ca-outputs-title"><div className="container ca-section-inner"><div className="ca-section-head"><span className="eyebrow">{t.outputs.eyebrow}</span><h2 id="ca-outputs-title">{t.outputs.title}</h2><p>{t.outputs.lead}</p></div><div className="ca-output-grid">{t.outputs.cards.map((card,i)=><article key={card.label}><span className="ca-output-number">0{i+1} / {card.label}</span><h3>{card.title}</h3><p>{card.body}</p><small>{card.detail}</small></article>)}</div><div className="ca-existing"><LayoutDashboard size={22}/><p>{t.outputs.existing}</p><a href={l('/solutions/ai-bi/')} aria-label={ui.nav.aiBi}><ArrowUpRight size={20}/></a></div></div></section>

    <section className="ca-section" aria-labelledby="ca-proof-title"><div className="container ca-section-inner ca-proof"><div><span className="eyebrow">{t.proof.eyebrow}</span><h2 id="ca-proof-title">{t.proof.title}</h2><p>{t.proof.lead}</p><div className="ca-proof-links"><a href={DASHBOARD_DOCS} target="_blank" rel="noopener noreferrer">{t.proof.docs}<ArrowUpRight size={15}/></a><a href={REPORT_DOCS} target="_blank" rel="noopener noreferrer">{t.proof.reportDocs}<ArrowUpRight size={15}/></a><a href={l('/solutions/semantic-layer/')}>{t.proof.semanticLink}<ArrowUpRight size={15}/></a></div></div><div className="ca-terminal"><div className="ca-terminal-top"><span className="ca-window-dots"><i/><i/><i/></span><span>{t.proof.commandLabel}</span></div><pre><code><span>$</span> {t.proof.commandOne}{'\n'}<span>&gt;</span> {t.proof.commandTwo}</code></pre><p>{t.proof.note}</p></div></div></section>

    <FAQ items={t.faqs} heading={t.faqTitle} currentUrl="/solutions/composable-analytics/"/>
    <section className="container ca-related" aria-labelledby="ca-related-title"><h2 id="ca-related-title">{t.relatedTitle}</h2><div>{t.related.map(item=><a key={item.href} href={l(item.href)}>{item.title}<ArrowUpRight size={15}/></a>)}</div></section>
    <section className="ca-section ca-section--tinted"><div className="container ca-closing"><h2>{t.closingTitle}</h2><p>{t.closingLead}</p><a className="btn btn-primary btn-lg" href={studioCtaUrl(STUDIO_LOGIN_URL,'composable_analytics_closing',locale)}>{t.closingCta}<ArrowUpRight size={17}/></a></div></section>
  </SiteLayout>;
}
