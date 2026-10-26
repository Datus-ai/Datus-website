import { useEffect, useState } from 'react';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import SiteLayout from '../../../components/SiteLayout';
import Breadcrumb from '../../../components/Breadcrumb';
import FAQ from '../../../components/FAQ';
import { useHref, useLocale, useT } from '../../../i18n/LocaleContext';
import { studioCtaUrl } from '../../../lib/studio-cta';
import { UI } from '../../../i18n/ui';
import { STUDIO_LOGIN_URL } from '../../../config/nav';
import { SEMANTIC_LAYER_SOLUTION } from './content';
import { ExecutionFlow } from './SolutionExperience';
import SemanticLens from './SemanticLens';
import ModelingWorkflow from './ModelingWorkflow';
import SemanticReuse from './SemanticReuse';
import SemanticModelPreview from './SemanticModelPreview';
import ModelConversion from './ModelConversion';
import { CONVERSION_COPY } from './conversionCopy';
import { SOLUTION_EXPERIENCE } from './experience';
import './style.css';

export default function SemanticLayerSolution() {
 const t = useT(SEMANTIC_LAYER_SOLUTION), x = useT(SOLUTION_EXPERIENCE), ui = useT(UI), c=useT(CONVERSION_COPY), l = useHref();
 const locale = useLocale();
 const [scrolled,setScrolled]=useState(false);
 useEffect(()=>{const update=()=>setScrolled(window.scrollY>35);update();window.addEventListener('scroll',update,{passive:true});return()=>window.removeEventListener('scroll',update)},[]);
 return <SiteLayout className={`semantic-solution${scrolled?' solution-scrolled':''}`}>
  <Breadcrumb currentUrl="/solutions/semantic-layer/" items={[{ label: ui.nav.home, href: '/' }, { label: ui.nav.solutions, noSchema: true }, { label: ui.nav.semanticLayer }]}/>
  <section className="solution-hero" aria-labelledby="semantic-solution-title">
   <SemanticLens/>
   <div className="solution-hero__copy"><span className="eyebrow">{t.eyebrow}</span><h1 id="semantic-solution-title">{t.titleBefore}<span className="solution-hero__accent">{t.titleAccent}</span>{t.titleAfter}</h1><p className="lead">{t.leadBefore}<a className="solution-hero__dosi" href="https://dosi.datus.ai/">DOSI</a>{t.leadAfter}</p><div className="solution-actions"><a className="btn btn-primary btn-lg" href={studioCtaUrl(STUDIO_LOGIN_URL, 'semantic_layer_hero', locale)}>{t.primary}<ArrowUpRight size={17}/></a><a className="solution-link" href="#solution-workflow">{t.secondary}<ArrowDown size={16}/></a></div></div>
  </section>
  <section id="shared-definition" className="container solution-section" aria-labelledby="solution-shared-title">
   <h2 id="solution-shared-title">{x.sharedTitle}</h2><p className="lead">{x.sharedLead}</p>
   <SemanticModelPreview/><p className="solution-preview-caption">{x.modelPreview}</p>
  </section>
  <section id="open-foundation" className="solution-band" aria-labelledby="solution-neutral-title"><div className="container solution-section">
   <div className="solution-neutral-head"><div><h2 id="solution-neutral-title">{x.neutralTitle}</h2><p className="lead">{x.neutralLeadParts.map((part,i)=>part.highlight?<strong className="solution-keyword" key={i}>{part.text}</strong>:part.text)}</p></div><aside className="solution-ossie-definition"><h3>{c.ossieTitle}</h3><p>{c.ossieBody}</p><a className="solution-link" href="https://ossie.apache.org/">{c.ossieLink}<ArrowUpRight size={14}/></a></aside></div>
   <ModelConversion/>
  </div></section>
  <ExecutionFlow/>
  <section id="modeling-workspace" className="solution-band" aria-labelledby="solution-build-title"><div className="container solution-section">
   <h2 id="solution-build-title">{x.buildTitle}</h2><p className="lead">{x.buildLead}</p>
   <ModelingWorkflow/>
   <div className="solution-build-links"><a className="solution-link" href={l('/products/studio/')}>{x.studioLink}<ArrowUpRight size={15}/></a><a className="solution-link" href={l('/products/cli/')}>{x.agentLink}<ArrowUpRight size={15}/></a></div>
  </div></section>
  <section id="model-reuse" className="container solution-section" aria-labelledby="solution-consumers-title">
   <h2 id="solution-consumers-title">{x.consumerTitle}</h2><p className="lead">{x.consumerLead}</p>
   <SemanticReuse/>
  </section>
  <FAQ items={x.faqs} heading={x.faqTitle} currentUrl="/solutions/semantic-layer/"/>
  <section className="container solution-reading" aria-labelledby="solution-reading-title"><h2 id="solution-reading-title">{x.reading}</h2><div>{x.resources.map(item => <a key={item.href} className="solution-link" href={l(item.href)}>{item.title}<ArrowUpRight size={15}/></a>)}</div></section>
  <section className="solution-band"><div className="container solution-section solution-closing"><h2>{t.closing}</h2><p className="lead">{t.closingLead}</p><a className="btn btn-primary btn-lg" href={studioCtaUrl(STUDIO_LOGIN_URL, 'semantic_layer_closing', locale)}>{t.primary}<ArrowUpRight size={17}/></a></div></section>
 </SiteLayout>;
}
