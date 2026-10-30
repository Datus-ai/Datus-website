import { useEffect, useRef, useState } from 'react';
import SiteLayout from '../../../components/SiteLayout';
import Breadcrumb from '../../../components/Breadcrumb';
import FAQ from '../../../components/FAQ';
import { LocaleProvider, useCurrentPath, useHref, useLocale, useT } from '../../../i18n/LocaleContext';
import { UI } from '../../../i18n/ui';
import { absoluteUrl, alternateLinks, stripLocale } from '../../../i18n/config';
import { studioCtaUrl } from '../../../lib/studio-cta';
import { SemanticConverterWorkbench } from '../../../modules/semantic-converter/components/workbench';
import { converterPage, TARGET_FORMATS, IMPORT_FORMATS } from './content';
import { converterFaq } from './faq';
import { CONVERTER_PATH, CONVERTER_PATHS, converterFlow } from '../../../modules/semantic-converter/routes';
import { platformUi } from './platforms';
import { flowCopy } from './flows';
import { ConverterDirectory, FlowGuide } from './FlowGuide';
import { LOCATION_CHANGE_EVENT } from '../../../lib/location-change';
import './page.css';

const ROUTE = CONVERTER_PATH;

export default function SemanticConverterPage() {
  const initialPath = useCurrentPath();
  const locale = useLocale();
  const [path, setPath] = useState(initialPath);
  useEffect(() => {
    const sync = () => {
      const next = stripLocale(window.location.pathname);
      if (CONVERTER_PATHS.includes(next)) setPath(next);
    };
    sync();
    window.addEventListener(LOCATION_CHANGE_EVENT, sync);
    return () => window.removeEventListener(LOCATION_CHANGE_EVENT, sync);
  }, []);
  return <LocaleProvider locale={locale} path={path}><ConverterPageContent /></LocaleProvider>;
}

function ConverterPageContent() {
  const t = useT(converterPage);
  const locale = useLocale();
  const l = useHref();
  const flow = converterFlow(useCurrentPath());
  const specific = useT(flowCopy);
  const directory = useT(platformUi);
  const copy = flow ? specific[flow.slug] : undefined;
  const title = copy?.title ?? t.title;
  const lead = copy?.description ?? t.lead;
  const route = flow ? `${ROUTE}${flow.slug}/` : ROUTE;
  const genericFaq = useT(converterFaq);
  const faq = copy?.faq ?? genericFaq;
  const previousRoute = useRef(route);
  useEffect(() => {
    if (previousRoute.current === route) return;
    previousRoute.current = route;
    document.title = `${title} — Datus`;
    const url = absoluteUrl(route, locale);
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', url);
    for (const [key, value] of Object.entries({
      description: lead, 'og:title': `${title} — Datus`, 'og:description': lead,
      'twitter:title': `${title} — Datus`, 'twitter:description': lead, 'og:url': url,
    })) {
      document.querySelector(`meta[${key.startsWith('og:') ? 'property' : 'name'}="${key}"]`)?.setAttribute('content', value);
    }
    for (const [code, href] of Object.entries(alternateLinks(route) ?? {})) {
      document.querySelector(`link[rel="alternate"][hreflang="${code}"]`)?.setAttribute('href', href);
    }
  }, [route, title, lead, locale]);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: title,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web',
    url: absoluteUrl(route, locale),
    description: lead,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };

  return (
    <SiteLayout>
      <Breadcrumb
        currentUrl={route}
        items={[{ label: UI[locale].nav.home, href: '/' }, ...(flow ? [{ label: t.title, href: ROUTE }, { label: flow.name }] : [{ label: t.title }])]}
      />
      <section className="section converter-hero">
        <div className="container">
          <span className="eyebrow">{t.eyebrow}</span>
          <h1>{title}</h1>
          <p className="lead">{lead}</p>
          <p className="converter-free">{t.free}</p>
          <ConverterDirectory active={flow?.slug} />
        </div>
      </section>
      <section className="converter-tool-section" id="converter">
        <div className="converter-tool-container">
          <SemanticConverterWorkbench />
        </div>
      </section>
      {flow ? <FlowGuide flow={flow} /> : <>
      <section className="section">
        <div className="container converter-prose">
          <h2>{directory.directory}</h2>
          <p>{directory.intro}</p>
          <h2>{t.overviewTitle}</h2>
          <p>{t.overview}</p>
          <h2>{t.stepsTitle}</h2>
          <ol className="converter-steps">
            {t.steps.map((step) => (
              <li key={step.title}>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="section converter-alt">
        <div className="container converter-prose">
          <h2>{t.importsTitle}</h2>
          <p>{t.importsIntro}</p>
          <ul className="converter-formats">
            {IMPORT_FORMATS.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
          <h2>{t.formatsTitle}</h2>
          <p>{t.formatsIntro}</p>
          <ul className="converter-formats">
            {TARGET_FORMATS.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
          <h2>{t.examplesTitle}</h2>
          <p>{t.examplesIntro}</p>
          <div className="converter-examples">
            {t.examples.map((example) => (
              <article key={example.name}>
                <h3>{example.name}</h3>
                <p>{example.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container converter-prose">
          <h2>{t.boundariesTitle}</h2>
          {t.boundaries.map((text) => (
            <p key={text}>{text}</p>
          ))}
          <h2>{t.relatedTitle}</h2>
          <ul className="converter-links">
            <li>
              <a href="/blog/convert-semantic-models-to-ossie/">
                {t.importArticle}
              </a>
            </li>
            <li>
              <a href="/blog/apache-ossie-converters/">{t.convertersArticle}</a>
            </li>
            <li>
              <a href={l('/tools/osi-playground/')}>{t.playground}</a>
            </li>
            <li>
              <a href="/blog/semantic-model-examples/">{t.examplesArticle}</a>
            </li>
            <li>
              <a
                href="https://github.com/apache/ossie/blob/main/converters/README.md"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t.ossie}
              </a>
            </li>
            <li>
              <a href={studioCtaUrl('https://studio.datus.ai/', 'semantic_converter_resources', locale)}>
                {t.studio}
              </a>
            </li>
          </ul>
        </div>
      </section>
      </>}
      <FAQ items={faq} currentUrl={route} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />
    </SiteLayout>
  );
}
