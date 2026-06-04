import "./GlossaryPage.css";
import Footer from "./Footer";
import { glossary, allTerms, GLOSSARY_UPDATED } from "../glossary/glossaryData";

const GlossaryPage = () => {
  return (
    <div className="glossary">
      {/* Header */}
      <header className="glossary-header">
        <div className="glossary-header__inner">
          <a href="/" className="glossary-header__logo" aria-label="Datus home">
            <img src="/logo_dark.svg" alt="Datus" />
          </a>
          <nav className="glossary-header__nav" aria-label="Primary">
            <a href="/blog/">Blog</a>
            <a href="https://docs.datus.ai" target="_blank" rel="noopener noreferrer">
              Docs
            </a>
            <a href="https://github.com/Datus-ai/Datus-agent" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <a
              className="glossary-header__cta"
              href="https://studio.datus.ai/overview"
              target="_blank"
              rel="noopener noreferrer"
            >
              Get started
            </a>
          </nav>
        </div>
      </header>

      <main className="glossary-main">
        {/* Hero */}
        <section className="glossary-hero">
          <p className="glossary-hero__eyebrow">Glossary</p>
          <h1 className="glossary-hero__title">Data engineering glossary</h1>
          <p className="glossary-hero__subtitle">
            Plain-language definitions of the {allTerms.length} concepts Datus
            agents work with day to day — from semantic layer and lakehouse to
            schema linking, MCP, and RAG. One page, no fluff.
          </p>
          <p className="glossary-hero__meta">
            {glossary.length} categories · {allTerms.length} terms · Updated{" "}
            {GLOSSARY_UPDATED}
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
                {cat.terms.length} terms
              </span>
            </div>
            <div className="glossary-grid">
              {cat.terms.map((t) => (
                <article key={t.slug} id={t.slug} className="glossary-card">
                  <h3 className="glossary-card__term">{t.term}</h3>
                  <p className="glossary-card__def">{t.definition}</p>
                </article>
              ))}
            </div>
          </section>
        ))}

        {/* Closing CTA */}
        <section className="glossary-cta">
          <h2>From definitions to a working agent</h2>
          <p>
            Datus turns these concepts into an evolvable Context Engine — so your
            data engineering agent understands your warehouse, not just the
            words.
          </p>
          <div className="glossary-cta__actions">
            <a
              className="glossary-cta__primary"
              href="https://github.com/Datus-ai/Datus-agent"
              target="_blank"
              rel="noopener noreferrer"
            >
              Explore the agent
            </a>
            <a
              className="glossary-cta__secondary"
              href="https://docs.datus.ai"
              target="_blank"
              rel="noopener noreferrer"
            >
              Read the docs
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default GlossaryPage;
