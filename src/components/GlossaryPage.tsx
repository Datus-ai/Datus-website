import "./GlossaryPage.css";
import SiteLayout from "./SiteLayout";

import { allTerms, glossaryFor, glossaryUpdated } from "../glossary/glossaryData";
import { useHref, useLocale } from "../i18n/LocaleContext";
import { UI } from "../i18n/ui";
import { GLOSSARY_PAGE_COPY } from "../glossary/pageContent";
import { STUDIO_START_URL } from "../config/nav";
import { studioCtaUrl } from "../lib/studio-cta";

const GlossaryPage = () => {
  const locale = useLocale();
  const l = useHref();
  const t = GLOSSARY_PAGE_COPY[locale];
  const ui = UI[locale];
  const glossary = glossaryFor(locale);

  return (
    <SiteLayout className="glossary">
      <div className="glossary-main">
        {/* Breadcrumb */}
        <nav className="glossary-breadcrumb" aria-label="Breadcrumb">
          <ol>
            <li>
              <a href={l("/")}>{ui.nav.home}</a>
              <span className="glossary-breadcrumb__sep" aria-hidden="true">/</span>
            </li>
            <li>
              <span aria-current="page">{t.eyebrow}</span>
            </li>
          </ol>
        </nav>

        {/* Hero */}
        <section className="glossary-hero">
          <p className="glossary-hero__eyebrow">{t.eyebrow}</p>
          <h1 className="glossary-hero__title">{t.title}</h1>
          <p className="glossary-hero__subtitle">{t.subtitle(allTerms.length)}</p>
          <p className="glossary-hero__meta">
            {t.meta(glossary.length, allTerms.length, glossaryUpdated(locale))}
          </p>
        </section>

        {/* Category anchor nav */}
        <nav className="glossary-nav" aria-label="Categories">
          {glossary.map((cat) => (
            <a key={cat.id} href={`#${cat.id}`} className="glossary-nav__link">
              {cat.name}
              <span className="glossary-nav__count">{cat.terms.length}</span>
            </a>
          ))}
        </nav>

        {/* Category sections */}
        {glossary.map((cat) => (
          <section key={cat.id} id={cat.id} className="glossary-section">
            <div className="glossary-section__head">
              <h2 className="glossary-section__title">{cat.name}</h2>
              <span className="glossary-section__count">
                {t.termsSuffix(cat.terms.length)}
              </span>
            </div>
            <div className="glossary-grid">
              {cat.terms.map((term) => (
                <article key={term.slug} id={term.slug} className="glossary-card">
                  <h3 className="glossary-card__term">{term.term}</h3>
                  <p className="glossary-card__def">{term.definition}</p>
                  {/* Guides live on the blog, which ships English only. */}
                  {term.article && (
                    <a className="glossary-card__link" href={term.article}>
                      {t.readGuide}
                    </a>
                  )}
                </article>
              ))}
            </div>
          </section>
        ))}

        {/* Closing CTA */}
        <section className="glossary-cta">
          <h2>{t.ctaTitle}</h2>
          <p>{t.ctaBody}</p>
          <div className="glossary-cta__actions">
            <a
              className="glossary-cta__primary"
              href={studioCtaUrl(STUDIO_START_URL, "glossary_closing", locale)}
            >
              {t.ctaPrimary}
            </a>
            <a
              className="glossary-cta__secondary"
              href="https://docs.datus.ai"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.ctaSecondary}
            </a>
          </div>
        </section>
      </div>

    </SiteLayout>
  );
};

export default GlossaryPage;
