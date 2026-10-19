import SiteLayout from '../../../components/SiteLayout';
import Breadcrumb from '../../../components/Breadcrumb';
import FAQ from '../../../components/FAQ';
import { useHref, useLocale, useT } from '../../../i18n/LocaleContext';
import { UI } from '../../../i18n/ui';
import { absoluteUrl } from '../../../i18n/config';
import { SemanticConverterWorkbench } from '../../../modules/semantic-converter/components/workbench';
import { converterPage, TARGET_FORMATS, IMPORT_FORMATS } from './content';
import { converterFaq } from './faq';
import './page.css';

const ROUTE = '/tools/semantic-model-converter/';

export default function SemanticConverterPage() {
  const t = useT(converterPage);
  const locale = useLocale();
  const l = useHref();
  const faq = useT(converterFaq);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: t.title,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web',
    url: absoluteUrl(ROUTE, locale),
    description: t.lead,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };

  return (
    <SiteLayout>
      <Breadcrumb
        currentUrl={ROUTE}
        items={[{ label: UI[locale].nav.home, href: '/' }, { label: t.title }]}
      />
      <section className="section converter-hero">
        <div className="container">
          <span className="eyebrow">{t.eyebrow}</span>
          <h1>{t.title}</h1>
          <p className="lead">{t.lead}</p>
          <p className="converter-free">{t.free}</p>
        </div>
      </section>
      <section className="converter-tool-section">
        <div className="converter-tool-container">
          <SemanticConverterWorkbench />
        </div>
      </section>
      <section className="section">
        <div className="container converter-prose">
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
              <a href="https://studio.datus.ai/?utm_source=datus.ai&utm_medium=tool&utm_campaign=semantic-model-converter">
                {t.studio}
              </a>
            </li>
          </ul>
        </div>
      </section>
      <FAQ items={faq} currentUrl={ROUTE} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />
    </SiteLayout>
  );
}
