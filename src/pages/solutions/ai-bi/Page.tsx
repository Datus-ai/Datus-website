import { ArrowDown, ArrowUpRight } from 'lucide-react';
import Breadcrumb from '../../../components/Breadcrumb';
import FAQ from '../../../components/FAQ';
import { HomeArchitectureDiagram } from '../../../components/HomeNarrative';
import SiteLayout from '../../../components/SiteLayout';
import { STUDIO_LOGIN_URL } from '../../../config/nav';
import { useHref, useLocale, useT } from '../../../i18n/LocaleContext';
import { UI } from '../../../i18n/ui';
import { studioCtaUrl } from '../../../lib/studio-cta';
import { AI_BI_CONTENT } from './content';
import HeroVideo from './HeroVideo';
import ContextProductExperience from './ContextProductExperience';
import NorthstarReportGallery from './NorthstarReportGallery';
import './style.css';
import '../../../styles/home-narrative.css';

export default function AiBiSolution() {
  const t = useT(AI_BI_CONTENT);
  const ui = useT(UI);
  const locale = useLocale();
  const l = useHref();

  return <SiteLayout className="ai-bi-solution" staggerSections>
    <Breadcrumb currentUrl="/solutions/ai-bi/" items={[{ label: ui.nav.home, href: '/' }, { label: ui.nav.solutions, noSchema: true }, { label: ui.nav.aiBi }]}/>

    <section className="ai-bi-hero container" aria-labelledby="ai-bi-title">
      <div className="ai-bi-hero__copy">
        <span className="eyebrow">{t.eyebrow}</span>
        <h1 id="ai-bi-title">{t.title}</h1>
        <p className="lead">{t.lead}</p>
        <div className="ai-bi-actions">
          <a className="btn btn-primary btn-lg" href={studioCtaUrl(STUDIO_LOGIN_URL, 'ai_bi_hero', locale)}>{t.primary}<ArrowUpRight size={17}/></a>
          <a className="ai-bi-text-link" href="#how-it-works">{t.secondary}<ArrowDown size={16}/></a>
        </div>
      </div>
      <HeroVideo copy={t.demo}/>
    </section>

    <NorthstarReportGallery/>

    <ContextProductExperience/>

    <FAQ items={t.faqs} heading={t.faqTitle} currentUrl="/solutions/ai-bi/"/>
    <section className="container ai-bi-reading" aria-labelledby="ai-bi-reading-title"><h2 id="ai-bi-reading-title">{t.reading}</h2><div>{t.resources.map(item=><a key={item.href} href={l(item.href)}>{item.title}<ArrowUpRight size={15}/></a>)}</div></section>
    <section id="how-it-works" className="ai-bi-band ai-bi-flow" aria-labelledby="ai-bi-flow-title"><div className="container ai-bi-section">
      <div className="ai-bi-section-head"><span className="eyebrow">{t.flow.eyebrow}</span><h2 id="ai-bi-flow-title">{t.flow.title}</h2><p className="lead">{t.flow.lead}</p></div>
      <HomeArchitectureDiagram/>
      <p className="ai-bi-caption">{t.flow.caption}</p>
    </div></section>
    <section className="ai-bi-band" aria-labelledby="ai-bi-closing-title"><div className="container ai-bi-section ai-bi-closing"><h2 id="ai-bi-closing-title">{t.closing}</h2><p className="lead">{t.closingLead}</p><a className="btn btn-primary btn-lg" href={studioCtaUrl(STUDIO_LOGIN_URL, 'ai_bi_closing', locale)}>{t.primary}<ArrowUpRight size={17}/></a></div></section>
  </SiteLayout>;
}
