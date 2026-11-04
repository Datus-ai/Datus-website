import DatabricksFlow from './DatabricksFlow';
import { DATABRICKS_EVALUATION } from './databricks-evaluation';
import { BIGQUERY_EVALUATION } from './bigquery-evaluation';
import { Bot, ChartNoAxesCombined, ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, FileCode2, GitBranch, Layers3, Network, ScanEye, Terminal } from 'lucide-react';
import SiteLayout from '../../../components/SiteLayout';
import Breadcrumb from '../../../components/Breadcrumb';
import FAQ from '../../../components/FAQ';
import { CodeBlock } from '../../../components/catalog';
import { useHref, useLocale, useT } from '../../../i18n/LocaleContext';
import { UI } from '../../../i18n/ui';
import { studioCtaUrl } from '../../../lib/studio-cta';
import { ENGINE_PAGES, type Engine, type EnginePageData } from './content';
import '../snowflake/style.css';
import './style.css';

const external = { target: '_blank', rel: 'noopener noreferrer' };
const benefitIcons = [GitBranch, Network, ScanEye];

function EngineDiagram({ data }: { data: EnginePageData }) {
  const d = useT(data.copy).diagram;
  const warehouseLogo = data.slug === 'databricks' ? '/integrations/logos/databricks.png' : `/integrations/logos/${data.slug}.svg`;
  return <figure className="sf-architecture ed-diagram" aria-label={d.label}>
    <figcaption className="sf-architecture__label">{d.label}</figcaption>
    <div className="ed-diagram__flow">
      <div className="ed-diagram__node ed-diagram__node--model"><span>{d.input}</span><ArrowDown size={15} aria-hidden="true"/><small>{d.review}</small><strong><Layers3 size={18} aria-hidden="true"/>{d.model}</strong></div>
      <ArrowRight className="ed-diagram__arrow" size={19} aria-hidden="true"/>
      <div className="ed-diagram__node ed-diagram__node--engine"><span>{d.access}</span><strong><img className="ed-diagram__brand" src="/brand-mark.svg" alt="" aria-hidden="true" width="24" height="24"/>{d.engine}</strong><small>{d.sql}</small></div>
      <ArrowRight className="ed-diagram__arrow" size={19} aria-hidden="true"/>
      <div className="ed-diagram__node ed-diagram__node--warehouse"><img className={`ed-diagram__brand ed-diagram__brand--${data.slug}`} src={warehouseLogo} alt="" aria-hidden="true" width="28" height="28"/><strong>{d.target}</strong></div>
    </div>
    <div className="sf-architecture__return"><ArrowLeft size={15} aria-hidden="true"/>{d.result}</div>
    <p className="sf-architecture__caption">{d.caption}</p>
  </figure>;
}

function EngineComparison({ data }: { data: EnginePageData }) {
  const c = useT(data.copy).comparison;
  const warehouseLogo = data.slug === 'databricks' ? '/integrations/logos/databricks.png' : `/integrations/logos/${data.slug}.svg`;
  const lanes = [
    { key: 'native', content: c.native, contextLogo: data.slug === 'bigquery' ? '/integrations/logos/looker.svg' : warehouseLogo },
    { key: 'datus', content: c.datus, contextLogo: '/brand-mark.svg' },
  ];
  return <figure className="ed-compare" aria-label={c.label}>
    <div className="ed-compare__grid">{lanes.map(({ key, content, contextLogo }) => <div className={`ed-compare__lane ed-compare__lane--${key}`} key={key}>
      <h3>{content.title}</h3>
      <div className="ed-compare__node ed-compare__node--inputs">{content.inputs}</div>
      <ArrowDown className="ed-compare__arrow" size={18} aria-hidden="true"/>
      <div className="ed-compare__node ed-compare__node--context"><img className={data.slug === 'duckdb' && key === 'native' ? 'ed-compare__duckdb-logo' : undefined} src={contextLogo} alt="" aria-hidden="true" width="23" height="23"/><strong>{content.context}</strong></div>
      <ArrowDown className="ed-compare__arrow" size={18} aria-hidden="true"/>
      <div className="ed-compare__node">{content.consumers}</div>
      <ArrowDown className="ed-compare__arrow" size={18} aria-hidden="true"/>
      <div className="ed-compare__node ed-compare__node--warehouse"><img className={data.slug === 'duckdb' ? 'ed-compare__duckdb-logo' : undefined} src={warehouseLogo} alt="" aria-hidden="true" width="21" height="21"/>{content.warehouse}</div>
      <p>{content.note}</p>
    </div>)}</div>
    <figcaption><span>{c.caption}</span>{c.sources.map(source => <a key={source.href} href={source.href} {...external}>{source.label}<ArrowUpRight size={15} aria-hidden="true"/></a>)}</figcaption>
  </figure>;
}

function EnginePage({ data }: { data: EnginePageData }) {
  const evaluation = useT(data.slug === 'databricks' ? DATABRICKS_EVALUATION : BIGQUERY_EVALUATION);
  const t = useT(data.copy), ui = useT(UI), locale = useLocale(), l = useHref();
  const signup = (placement: string) => studioCtaUrl('https://studio.datus.ai/', `databases_${data.slug}_${placement}`, locale);
  return <SiteLayout className="snowflake-page engine-page" staggerSections>
    <Breadcrumb currentUrl={data.path} items={[{ label: ui.nav.home, href: '/' }, { label: ui.products.databases, href: '/databases/' }, { label: data.name }]} />
    <section className="sf-hero container" aria-labelledby="engine-title">
      <div className="sf-hero-copy"><span className="eyebrow">{t.eyebrow}</span><h1 id="engine-title">{t.heading}</h1><p className="lead">{t.lead}</p><div className="sf-actions"><a className="btn btn-primary btn-lg" href={signup('hero')}>{ui.common.tryStudio}<ArrowUpRight size={17}/></a><a className="sf-text-link" href="#connect">{t.setupLink}<ArrowDown size={16}/></a></div></div>
      <EngineDiagram data={data}/>
      <div className="sf-hero-facts">{t.facts.map(fact => <span key={fact}><span className="sf-dot"/>{fact}</span>)}</div>
    </section>
    <div className="sf-band"><section className="sf-section container" aria-labelledby="engine-value-title"><div className="sf-heading"><span className="eyebrow">{t.value.eyebrow}</span><h2 id="engine-value-title">{t.value.heading}</h2><p className="lead">{t.value.lead}</p></div><EngineComparison data={data}/><div className="sf-benefits">{t.value.items.map((item, i) => { const Icon = benefitIcons[i]; return <article key={item.title}><Icon size={26} strokeWidth={1.4}/><h3>{item.title}</h3><p>{item.body}</p></article>; })}</div></section></div>
    {data.slug !== 'duckdb' && <section className="sf-section container ed-evaluation" id="evaluate" aria-labelledby="evaluation-title"><div className="sf-heading"><span className="eyebrow">{evaluation.eyebrow}</span><h2 id="evaluation-title">{evaluation.heading}</h2><p className="lead">{evaluation.lead}</p></div><div className="ed-evaluation-grid">{evaluation.items.map((item,i)=><article key={item.title}><span className="sf-index">0{i+1}</span><h3>{item.title}</h3><p>{item.body}</p><a className="sf-text-link" href={l(item.href)} {...(item.href.startsWith('https:')?external:{})}>{item.label}<ArrowUpRight size={15}/></a></article>)}</div>{data.slug === 'databricks' && <DatabricksFlow/>}</section>}
    <section className="sf-section container" id="example" aria-labelledby="engine-example-title"><div className="sf-heading"><span className="eyebrow">{t.example.eyebrow}</span><h2 id="engine-example-title">{t.example.heading}</h2><p className="lead">{t.example.lead}</p></div><div className="ed-example"><div><h3><FileCode2 size={20} aria-hidden="true"/>{t.example.profile}</h3><CodeBlock themeAware filename="dosi-connections.yaml" lang="YAML" code={data.profile}/></div><div><h3><Terminal size={20} aria-hidden="true"/>{t.example.command}</h3><CodeBlock themeAware filename="dosi" lang="CLI" code={data.command}/></div></div><p className="sf-caption">{t.example.note}</p></section>
    <div className="sf-band"><section className="sf-section container" id="connect" aria-labelledby="engine-connect-title"><div className="sf-connect-head"><div className="sf-heading"><span className="eyebrow">{t.steps.eyebrow}</span><h2 id="engine-connect-title">{t.steps.heading}</h2><p className="lead">{t.steps.lead}</p></div><a className="sf-text-link" href={data.docs} {...external}>{t.steps.docsLabel}<ArrowUpRight size={16}/></a></div><ol className="sf-steps">{t.steps.items.map((item, i) => <li key={item.title}><span>0{i + 1}</span><div><h3>{item.title}</h3><p>{item.body}</p></div></li>)}</ol><div className="sf-boundary"><ScanEye size={20}/><p>{t.steps.boundary}</p></div>{data.agentDocs && t.steps.agentLabel && <a className="sf-text-link" href={data.agentDocs} {...external}>{t.steps.agentLabel}<ArrowUpRight size={15}/></a>}</section></div>
    <section className="sf-section container" aria-labelledby="engine-use-title"><div className="sf-heading"><span className="eyebrow">{t.use.eyebrow}</span><h2 id="engine-use-title">{t.use.heading}</h2><p className="lead">{t.use.lead}</p></div><div className="sf-usage">{t.use.items.map((item, i) => <article key={item.title}>{data.slug === 'databricks' ? <span className="ed-use-icon" aria-hidden="true">{i === 0 ? <Bot size={32} strokeWidth={1.5}/> : <ChartNoAxesCombined size={32} strokeWidth={1.5}/>}</span> : <span className="sf-index">0{i + 1}</span>}<h3>{item.title}</h3><p>{item.body}</p></article>)}</div></section>
    <div className="sf-band"><FAQ items={data.slug !== 'duckdb' ? [...t.faq.items,...evaluation.faq] : t.faq.items} heading={t.faq.heading} lead={t.faq.lead} currentUrl={data.path}/></div>
    <section className="sf-section sf-closing container" aria-labelledby="engine-closing-title"><h2 id="engine-closing-title">{t.closing.heading}</h2><p className="lead">{t.closing.lead}</p><div className="sf-actions"><a className="btn btn-primary btn-lg" href={signup('closing')}>{ui.common.tryStudio}<ArrowUpRight size={17}/></a><a className="sf-text-link" href={data.docs} {...external}>{t.closing.docsLabel}<ArrowUpRight size={15}/></a></div></section>
    <div className="sf-band"><section className="sf-section container" aria-labelledby="engine-resources-title"><h2 id="engine-resources-title">{t.resources.heading}</h2><div className="sf-resources">{t.resources.items.map(item => <a key={item.title} href={l(item.href)} {...(item.href.startsWith('https:') ? external : {})}><h3>{item.title}<ArrowUpRight size={18}/></h3><p>{item.body}</p></a>)}</div></section></div>
  </SiteLayout>;
}

export function DatabricksPage() { return <EnginePage data={ENGINE_PAGES.databricks}/>; }
export function BigQueryPage() { return <EnginePage data={ENGINE_PAGES.bigquery}/>; }
export function DuckDBPage() { return <EnginePage data={ENGINE_PAGES.duckdb}/>; }
