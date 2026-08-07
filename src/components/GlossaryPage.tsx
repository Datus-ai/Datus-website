import "./GlossaryPage.css";
import Footer from "./Footer";
import LanguageSwitcher from "./LanguageSwitcher";
import { allTerms, glossaryFor, glossaryUpdated } from "../glossary/glossaryData";
import { useHref, useLocale } from "../i18n/LocaleContext";
import { UI } from "../i18n/ui";
import type { Locale } from "../i18n/config";

type GlossaryCopy = {
  eyebrow: string;
  title: string;
  subtitle: (count: number) => string;
  meta: (categories: number, terms: number, updated: string) => string;
  termsSuffix: (n: number) => string;
  readGuide: string;
  ctaTitle: string;
  ctaBody: string;
  ctaPrimary: string;
  ctaSecondary: string;
};

const COPY: Record<Locale, GlossaryCopy> = {
  en: {
    eyebrow: "Glossary",
    title: "Data engineering glossary",
    subtitle: (count) =>
      `Plain-language definitions of the ${count} concepts Datus agents work with day to day — from semantic layer and lakehouse to schema linking, MCP, and RAG. One page, no fluff.`,
    meta: (categories, terms, updated) =>
      `${categories} categories · ${terms} terms · Updated ${updated}`,
    termsSuffix: (n) => `${n} terms`,
    readGuide: "Read the full guide →",
    ctaTitle: "From definitions to a working agent",
    ctaBody:
      "Datus turns these concepts into an evolvable Context Engine — so your data engineering agent understands your warehouse, not just the words.",
    ctaPrimary: "Explore the agent",
    ctaSecondary: "Read the docs",
  },
  zh: {
    eyebrow: "术语表",
    title: "数据工程术语表",
    subtitle: (count) =>
      `用大白话解释 Datus Agent 每天打交道的 ${count} 个概念——从语义层、湖仓，到 Schema Linking、MCP 与 RAG。一页看完，不灌水。`,
    meta: (categories, terms, updated) =>
      `${categories} 个分类 · ${terms} 个词条 · 更新于 ${updated}`,
    termsSuffix: (n) => `${n} 个词条`,
    readGuide: "阅读完整指南 →",
    ctaTitle: "从定义到一个真正能干活的 Agent",
    ctaBody:
      "Datus 把这些概念变成一套可演进的上下文引擎——让你的数据工程 Agent 真正理解你的数仓，而不只是认得这些词。",
    ctaPrimary: "了解这个 Agent",
    ctaSecondary: "阅读文档",
  },
};

const GlossaryPage = () => {
  const locale = useLocale();
  const l = useHref();
  const t = COPY[locale];
  const ui = UI[locale];
  const glossary = glossaryFor(locale);

  return (
    <div className="glossary">
      {/* Header */}
      <header className="glossary-header">
        <div className="glossary-header__inner">
          <a href={l("/")} className="glossary-header__logo" aria-label="Datus">
            <img src="/logo_dark.svg" alt="Datus" />
          </a>
          <nav className="glossary-header__nav" aria-label="Primary">
            {/* The blog is English-only, so this href is never prefixed. */}
            <a href="/blog/">{ui.nav.blog}</a>
            <a href="https://docs.datus.ai" target="_blank" rel="noopener noreferrer">
              {ui.nav.docs}
            </a>
            <a href="https://github.com/Datus-ai/Datus-agent" target="_blank" rel="noopener noreferrer">
              {ui.nav.github}
            </a>
            <LanguageSwitcher />
            <a
              className="glossary-header__cta"
              href="https://studio.datus.ai/overview"
              target="_blank"
              rel="noopener noreferrer"
            >
              {ui.nav.getStarted}
            </a>
          </nav>
        </div>
      </header>

      <main className="glossary-main">
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
              href="https://github.com/Datus-ai/Datus-agent"
              target="_blank"
              rel="noopener noreferrer"
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
      </main>

      <Footer />
    </div>
  );
};

export default GlossaryPage;
