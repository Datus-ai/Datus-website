import { useState } from 'react';
import { ArrowUpRight, ArrowRight, MousePointer2, Network, Braces, Route, CheckCircle2 } from 'lucide-react';
import SiteLayout from '../../../components/SiteLayout';
import Breadcrumb from '../../../components/Breadcrumb';
import FAQ from '../../../components/FAQ';
import { useT,useHref,useLocale } from '../../../i18n/LocaleContext';
import { UI } from '../../../i18n/ui';
import { STUDIO_START_URL } from '../../../config/nav';
import { studioCtaUrl } from '../../../lib/studio-cta';
import { ONTOLOGY_CONTENT } from './content';
import DatusArchitecture from '../../../components/DatusArchitecture';
import ProductInterfacePreview from '../../../components/ProductInterfacePreview';
import KnowledgeDemo from './KnowledgeDemo';
import { ScopeIllustration, AccessIllustration } from './UsageIllustrations';
import './style.css';
const guide='https://docs.datus.ai/dev/subagent/ontology_analyst/';
function BusinessGraph(){
 const t=useT(ONTOLOGY_CONTENT).graph;
 return <div className="onto-graph" role="img" aria-label={t.label}><svg viewBox="0 0 600 480" aria-hidden="true"><circle className="onto-orbit" cx="300" cy="230" r="184"/><circle className="onto-orbit" cx="300" cy="230" r="210"/><path className="onto-thread" d="M110 155 Q300 0 475 180 T300 390 Q90 420 110 155 M110 155 Q300 230 475 180 M300 390 Q340 270 110 155 M475 180 Q450 350 300 390"/><path className="onto-pulse" d="M110 155 Q300 230 475 180 Q450 350 300 390 Q90 420 110 155"/>{[[110,155],[475,180],[300,390],[300,230]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r={i===3?46:8} className={i===3?'onto-core':'onto-dot'}/>)}</svg><span className="onto-node onto-customer">{t.customer}</span><span className="onto-node onto-order">{t.order}</span><span className="onto-node onto-product">{t.product}</span><span className="onto-return">{t.return}</span><span className="onto-edge onto-places">{t.places}</span><span className="onto-edge onto-contains">{t.contains}</span><span className="onto-edge onto-refers">{t.refers}</span><span className="onto-center">{t.core}</span><span className="onto-graph-base">{t.base}</span></div>;
}
export default function OntologyPage(){
 const t=useT(ONTOLOGY_CONTENT),ui=useT(UI),l=useHref(),locale=useLocale();
 return <SiteLayout className="ontology-page" staggerSections><Breadcrumb currentUrl="/solutions/ontology/" items={[{label:ui.nav.home,href:'/'},{label:ui.nav.solutions,noSchema:true},{label:ui.nav.ontology}]}/>
 <section className="container onto-hero"><div><span className="eyebrow">{t.eyebrow}</span><h1>{t.title}</h1><p className="onto-lead">{t.lead}</p><div className="onto-actions"><a className="btn btn-primary btn-lg" href={studioCtaUrl(STUDIO_START_URL,'ontology_hero',locale)}>{t.primary}<ArrowUpRight size={17}/></a><a className="onto-link" href="#build-context">{t.secondary}<ArrowRight size={17}/></a></div></div><BusinessGraph/></section>
 <KnowledgeDemo/>
 <section className="container onto-section" id="ontology-context"><span className="eyebrow">{t.definition.eyebrow}</span><h2>{t.definition.title}</h2><p className="onto-lead">{t.definition.body}</p><div className="onto-three">{t.definition.cards.map((c,i)=><article key={c.title}><span className="onto-number">0{i+1}</span><h3>{c.title}</h3><p>{c.body}</p><div className="onto-example">{c.example}</div></article>)}</div><a className="onto-link" href={l('/solutions/semantic-layer/')}>{t.definition.link}<ArrowUpRight size={16}/></a></section>
<section className="onto-band" id="build-context"><div className="container onto-section"><span className="eyebrow">{t.build.eyebrow}</span><h2>{t.build.title}</h2><p className="onto-lead">{t.build.lead}</p><div className="onto-reused-workflow"><ProductInterfacePreview kind="dosi" initialView="ontology"/></div><p className="onto-note">{t.build.note}</p><a className="onto-link" href={l('/products/studio/')}>{t.build.link}<ArrowUpRight size={16}/></a></div></section>
 
 <section className="container onto-section" id="ontology-execution"><span className="eyebrow">{t.execution.eyebrow}</span><h2>{t.execution.title}</h2><p className="onto-lead">{t.execution.lead}</p><div className="onto-reused-architecture"><h3>{t.visuals.architectureTitle}</h3><p className="onto-lead">{t.visuals.architectureLead}</p><DatusArchitecture/><p className="onto-note">{t.visuals.architectureNote}</p></div><p className="onto-standard">{t.execution.standard}</p><div className="onto-actions"><a className="onto-link" href={l('/apache-ossie/')}>{t.execution.standardLink}<ArrowUpRight size={16}/></a><a className="onto-link" href="https://dosi.datus.ai/reference/ontology/">{t.execution.docs}<ArrowUpRight size={16}/></a></div><p className="onto-note">{t.statusBody}</p></section>

 <section className="container onto-section"><span className="eyebrow">{t.practice.eyebrow}</span><h2>{t.practice.title}</h2><p className="onto-lead">{t.practice.lead}</p><div className="onto-three">{t.practice.steps.map((s,i)=><article key={s.title}><ScopeIllustration step={i}/><span className="onto-number">0{i+1}</span><h3>{s.title}</h3><p>{s.body}</p></article>)}</div></section>
 <section className="container onto-section" id="use-context"><span className="eyebrow">{t.access.eyebrow}</span><h2>{t.access.title}</h2><div className="onto-access">{t.access.cards.map((c,i)=><article key={c.title}><AccessIllustration kind={i}/><h3>{c.title}</h3><p>{c.body}</p><a className="onto-link" href={c.href}>{c.label}<ArrowUpRight size={16}/></a></article>)}</div></section>
 <section className="onto-band"><div className="container onto-section"><span className="eyebrow">{t.differences.eyebrow}</span><h2>{t.differences.title}</h2><p className="onto-lead">{t.differences.lead}</p><div className="onto-table" role="region" aria-label={t.differences.title} tabIndex={0}><table><thead><tr>{t.differences.columns.map(c=><th scope="col" key={c}>{c}</th>)}</tr></thead><tbody>{t.differences.rows.map(([label,...values])=><tr key={label}><th scope="row">{label}</th>{values.map(v=><td key={v}>{v}</td>)}</tr>)}</tbody></table></div><p className="onto-note">{t.differences.note}</p></div></section>
 <section className="onto-band"><div className="container onto-section onto-closing"><h2>{t.closing.title}</h2><p className="onto-lead">{t.closing.body}</p><div className="onto-actions"><a className="btn btn-primary btn-lg" href={studioCtaUrl(STUDIO_START_URL,'ontology_closing',locale)}>{t.primary}<ArrowUpRight size={17}/></a><a className="onto-link" href={guide}>{t.closing.docs}<ArrowUpRight size={16}/></a></div></div></section>
 <FAQ items={t.faqs} heading={t.faqTitle} currentUrl="/solutions/ontology/"/>
 <section className="container onto-related"><h2>{t.relatedTitle}</h2><div>{t.related.map(r=><a className="onto-link" key={r.href} href={l(r.href)}>{r.title}<ArrowUpRight size={15}/></a>)}</div></section>
 </SiteLayout>;
}
