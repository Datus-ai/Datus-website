import { ArrowDown, ArrowRight, ArrowUpRight, Network } from 'lucide-react';
import ValueComparison from './ValueComparison';
import ModelExplorer from './ModelExplorer';
import { OSSIE_MODEL_UI } from './modelUi';
import DatusArchitecture from '../../components/DatusArchitecture';
import SiteLayout from '../../components/SiteLayout';
import Breadcrumb from '../../components/Breadcrumb';
import FAQ from '../../components/FAQ';
import { useHref, useLocale, useT } from '../../i18n/LocaleContext';
import { UI } from '../../i18n/ui';
import { studioCtaUrl } from '../../lib/studio-cta';
import { STUDIO_START_URL } from '../../config/nav';
import { OSSIE_PAGE } from './content';
import { OSSIE_DETAILS } from './details';
import { OSSIE_EDUCATION } from './education';
import { ConceptArt, IdentityWatermark } from './ConceptArt';
import './style.css';

function ModelField() {
 const t=useT(OSSIE_PAGE).visual;
 return <div className="ossie-field" role="img" aria-label={t.alt}>
  <svg className="ossie-field__paths" viewBox="0 0 600 500" fill="none" aria-hidden="true">
   <g stroke="currentColor" strokeWidth="1">
    {['M100 145 C155 145 175 180 219 202','M500 145 C445 145 425 180 381 202','M100 350 C155 350 175 316 219 294','M500 350 C445 350 425 316 381 294'].map((path,i)=><g key={path}><path d={path} opacity=".35"/>{[-9,0,9].map(offset=><path key={offset} className="ossie-field__stream" transform={`translate(0 ${offset})`} style={{animationDelay:`${i*-.8}s`}} d={path}/>)}</g>)}
    <ellipse cx="300" cy="248" rx="122" ry="122"/><ellipse cx="300" cy="248" rx="147" ry="157" transform="rotate(34 300 248)" opacity=".3"/>
    <path d="M 176 272 A 127 127 0 0 1 242 137" strokeWidth="4" opacity=".35"/>
   </g>
   <circle cx="300" cy="248" r="100" className="ossie-field__disc"/>
   <circle cx="300" cy="248" r="102" stroke="currentColor" strokeWidth="1"/>
   <g fill="currentColor"><circle cx="189" cy="194" r="4"/><circle cx="416" cy="203" r="4"/><circle cx="251" cy="361" r="4"/><circle cx="446" cy="304" r="3"/></g>
  </svg>
  <div className="ossie-field__core"><span>Apache</span><strong>Ossie</strong><small>{t.model}</small></div>
  <span className="ossie-field__label ossie-field__label--fields">{t.fields}</span>
  <span className="ossie-field__label ossie-field__label--metrics">{t.metrics}</span>
  <span className="ossie-field__label ossie-field__label--relations">{t.relationships}</span>
  <span className="ossie-field__label ossie-field__label--context">{t.context}</span>
  <p className="ossie-field__caption">{t.footer}</p>
 </div>;
}

export default function ApacheOssiePage(){
 const details=useT(OSSIE_DETAILS), education=useT(OSSIE_EDUCATION),modelUi=useT(OSSIE_MODEL_UI);
 const t=useT(OSSIE_PAGE),locale=useLocale(),l=useHref(),ui=UI[locale];
 return <SiteLayout className="ossie-page" staggerSections>
  <Breadcrumb currentUrl="/apache-ossie/" items={[{label:ui.nav.home,href:'/'},{label:'Apache Ossie'}]}/>
  <section className="ossie-hero" aria-labelledby="ossie-heading">
   <div className="container ossie-hero__grid"><div className="ossie-hero__copy"><span className="eyebrow">{t.eyebrow}</span><h1 id="ossie-heading"><span>{t.title}</span><span>{t.titleAfter}</span><span className="ossie-accent">{t.titleAccent}</span></h1><p className="ossie-lead">{t.lead}</p><div className="ossie-actions"><a className="btn btn-primary" href="#definition">{t.heroCta}<ArrowDown size={16}/></a><a className="ossie-text-link" href="#model">{t.secondaryCta}<ArrowRight size={16}/></a></div><p className="ossie-hero__badge"><span/>{t.badge}</p></div><ModelField/></div>
  </section>
  <nav className="ossie-toc" aria-label={t.contentsLabel}><div className="ossie-toc__links container">{t.contents.map(([id,label])=><a key={id} href={`#${id}`}>{label}</a>)}</div></nav>
  <section className="ossie-section" id="definition"><IdentityWatermark motif="shared"/><div className="container"><div className="ossie-section-head"><span className="eyebrow">{t.definition.eyebrow}</span><h2>{t.definition.title}</h2><p>{t.definition.body}</p></div><div className="ossie-principles">{t.definition.cards.map((c,i)=><article key={c.title}><ConceptArt kind={i}/><span className="ossie-index">0{i+1}</span><h3>{c.title}</h3><p>{c.body}</p></article>)}</div><div className="ossie-inline-links"><a href={l('/blog/open-semantic-interchange-osi/')}>{t.definition.history}<ArrowRight size={15}/></a></div></div></section>
  <ValueComparison/>
  <section className="ossie-section ossie-section--alt" id="model"><div className="container"><div className="ossie-section-head"><span className="eyebrow">{t.model.eyebrow}</span><h2>{t.model.title}</h2><p>{t.model.lead}</p><p className="ossie-format-note">{details.format}</p></div><ModelExplorer/><div className="ossie-model-note"><p>{t.model.note}</p><a className="ossie-text-link" href={l('/blog/semantic-model-examples/')}>{t.model.example}<ArrowRight size={16}/></a></div><div className="ossie-model-ontology" id="ontology" aria-labelledby="ossie-ontology-heading"><h3 id="ossie-ontology-heading">{details.ontology.title}</h3><p>{details.ontology.body}</p><div className="ossie-model-relationships">{details.ontology.layers.map((item,i)=><div key={item.title}><span className="ossie-index">0{i+1}</span><h4>{item.title}</h4><code>{item.example}</code><p>{item.body}</p></div>)}</div><p className="ossie-proof-note">{details.ontology.note}</p><a className="ossie-text-link" href="https://github.com/apache/ossie/blob/main/ontology/ontology.md">{details.ontology.link}<ArrowUpRight size={16}/></a></div></div></section>
  <section className="ossie-section" id="exchange"><div className="container"><div className="ossie-section-head"><span className="eyebrow">{details.exchange.eyebrow}</span><h2>{details.exchange.title}</h2><p>{details.exchange.body}</p></div><h3>{education.conversion.title}</h3><p className="ossie-conversion-intro">{education.conversion.body}</p><div className="ossie-conversion-flow"><div><h4>{education.conversion.inputTitle}</h4>{education.conversion.inputs.map(item=><a href={l('/apache-ossie-converter/')} className="ossie-conversion-tool" key={item.name}><strong>{item.name}</strong><span>{item.format}</span><ArrowRight size={17}/></a>)}</div><div className="ossie-conversion-hub"><svg viewBox="0 0 300 300" fill="none" aria-hidden="true">{[65,120,180,235].map(y=><path key={y} d={`M -20 ${y} C 60 ${y}, 60 150, 150 150 S 240 ${y}, 320 ${y}`}/>)}<ellipse cx="150" cy="150" rx="130" ry="115" transform="rotate(-35 150 150)"/><circle cx="150" cy="150" r="95"/></svg><div><strong>{education.conversion.center}</strong><span>YAML / JSON</span><small>{education.conversion.centerNote}</small></div></div><div><h4>{education.conversion.outputTitle}</h4>{education.conversion.outputs.map(item=><a href={l('/apache-ossie-converter/')} className="ossie-conversion-tool" key={item.name}><strong>{item.name}</strong><span>{item.format}</span><ArrowRight size={17}/></a>)}</div></div><p className="ossie-proof-note">{education.conversion.note}</p><div className="ossie-inline-links"><a href={l('/apache-ossie-converter/')}>{education.conversion.cta}<ArrowRight size={15}/></a></div></div></section>
  <section className="ossie-section ossie-project-summary" id="project"><span id="community" className="ossie-anchor-alias" aria-hidden="true"/><div className="container"><div className="ossie-section-head"><span className="eyebrow">{education.overview.eyebrow}</span><h2>{education.overview.title}</h2></div><ol className="ossie-history ossie-history--compact">{education.history.timeline.map(event=><li key={event.date}><time>{event.date}</time><h3>{event.title}</h3></li>)}</ol><div className="ossie-project-summary__copy"><p>{education.overview.body}</p><p>{education.overview.governance}</p></div><div className="ossie-inline-links"><a href="https://ossie.apache.org/updates/ossie-enters-apache-incubator/">{education.overview.history}<ArrowUpRight size={14}/></a><a href="https://github.com/apache/ossie/blob/main/CONTRIBUTING.md">{education.overview.contribute}<ArrowUpRight size={14}/></a></div></div></section>

  <section className="ossie-section ossie-section--alt" id="agents"><IdentityWatermark motif="agent"/><div className="container"><div className="ossie-section-head"><span className="eyebrow">{details.agents.eyebrow}</span><h2>{details.agents.title}</h2><p>{details.agents.body}</p></div><div className="ossie-datus-architecture"><DatusArchitecture/><p className="ossie-architecture-attribution">{details.agents.architectureNote}</p></div><div className="ossie-role-grid">{details.agents.roles.map(role=><article key={role.name}><h3>{role.name}</h3><p>{role.body}</p></article>)}</div><p className="ossie-proof-note">{details.agents.note}</p><a className="ossie-text-link" href="#execution">{details.agents.link}<ArrowDown size={16}/></a></div></section>
  <section className="ossie-section" id="execution"><IdentityWatermark motif="audit"/><div className="container"><div className="ossie-section-head"><span className="eyebrow">{t.execution.eyebrow}</span><h2>{t.execution.title}</h2><p>{t.execution.lead}</p></div><div className="ossie-execution-grid"><div className="ossie-execution-copy">{t.execution.steps.map((s,i)=><div key={s.title} className="ossie-step"><span>0{i+1}</span><div><h3>{s.title}</h3><p>{s.body}</p></div></div>)}<a className="ossie-text-link" href={l('/blog/first-native-apache-ossie-engine/')}>{t.execution.readMore}<ArrowRight size={16}/></a></div><div className="ossie-walkthrough"><iframe src="https://www.youtube-nocookie.com/embed/rvTLpOCUVLo?rel=0" title={modelUi.videoTitle} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen/><p>{modelUi.videoNote}</p><a className="ossie-text-link" href="https://www.youtube.com/watch?v=rvTLpOCUVLo">{modelUi.youtube}<ArrowUpRight size={15}/></a></div></div><a className="ossie-text-link ossie-runtime-link" href={l('/blog/apache-ossie-dosi-quickstart/')}>{t.execution.quickstart}<ArrowRight size={16}/></a></div></section>
  <section className="ossie-section" id="adopt"><div className="container"><div className="ossie-section-head"><span className="eyebrow">{t.adopt.eyebrow}</span><h2>{t.adopt.title}</h2><p>{t.adopt.lead}</p></div><div className="ossie-adopt-grid">{t.adopt.paths.map(p=><article key={p.number}><span className="ossie-index">{p.number}</span><h3>{p.title}</h3><p>{p.body}</p><a className="ossie-text-link" href={l(p.href)}>{p.label}<ArrowUpRight size={16}/></a></article>)}</div></div></section>
  <section className="ossie-section ossie-section--alt" id="compatibility"><div className="container ossie-compat-grid"><div className="ossie-section-head"><span className="eyebrow">{t.compatibility.eyebrow}</span><h2>{t.compatibility.title}</h2><p>{t.compatibility.lead}</p><div className="ossie-license"><Network size={20}/><h3>{t.compatibility.licenseTitle}</h3><p>{t.compatibility.license}</p></div></div><div><div className="ossie-table-scroll"><table><thead><tr>{t.compatibility.headers.map(h=><th scope="col" key={h}>{h}</th>)}</tr></thead><tbody>{t.compatibility.rows.map(([layer,body])=><tr key={layer}><th scope="row">{layer}</th><td>{body}</td></tr>)}</tbody></table></div><div className="ossie-inline-links"><a href="https://dosi.datus.ai/extensions-guide/">{t.compatibility.docs}<ArrowUpRight size={14}/></a><a href={l('/osi-field-mapping/')}>{t.compatibility.mapping}<ArrowRight size={14}/></a></div></div></div></section>

  <section className="ossie-section ossie-section--alt" id="resources"><div className="container"><div className="ossie-section-head"><span className="eyebrow">{t.resources.eyebrow}</span><h2>{t.resources.title}</h2><p>{t.resources.lead}</p></div><div className="ossie-resource-grid">{t.resources.groups.map(g=><div key={g.title}><h3>{g.title}</h3>{g.items.map(item=><a className="ossie-resource" href={l(item.href)} key={item.href}><span>{item.label}<ArrowUpRight size={16}/></span><p>{item.detail}</p></a>)}</div>)}</div><div className="ossie-sources"><span>{t.resources.officialTitle}</span>{t.resources.officialLinks.map(a=><a key={a.href} href={a.href}>{a.label}<ArrowUpRight size={14}/></a>)}</div></div></section>
  <FAQ currentUrl="/apache-ossie/" items={[...t.faq,...details.faq]} heading={t.faqTitle}/>
  <section className="ossie-section ossie-closing"><IdentityWatermark motif="loops"/><div className="container"><span className="eyebrow">{t.closing.eyebrow}</span><h2>{t.closing.title}</h2><p>{t.closing.body}</p><div className="ossie-actions"><a className="btn btn-primary" href={studioCtaUrl(STUDIO_START_URL,'apache_ossie_closing',locale)}>{ui.common.tryStudio}<ArrowUpRight size={16}/></a><a className="ossie-text-link" href="https://dosi.datus.ai/tutorials/first-metric-query/">{t.closing.secondary}<ArrowUpRight size={16}/></a></div></div></section>
 </SiteLayout>;
}
