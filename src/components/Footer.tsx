import "./Footer.css";

const Footer = () => {
  const year = 2026;

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <a href="/" className="site-footer__logo" aria-label="Datus home">
            <img src="/logo_dark.svg" alt="Datus" />
          </a>
          <p className="site-footer__tagline">
            The open-source data engineering agent with an evolvable Context
            Engine — natural language to governed, production-ready data work.
          </p>
        </div>

        <nav className="site-footer__cols" aria-label="Footer">
          <div className="site-footer__col">
            <h3 className="site-footer__heading">Product</h3>
            <ul>
              <li>
                <a href="https://studio.datus.ai/overview" target="_blank" rel="noopener noreferrer">
                  Datus Studio
                </a>
              </li>
              <li>
                <a href="https://docs.datus.ai" target="_blank" rel="noopener noreferrer">
                  Docs
                </a>
              </li>
              <li>
                <a href="https://github.com/Datus-ai/Datus-agent" target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              </li>
            </ul>
          </div>

          <div className="site-footer__col">
            <h3 className="site-footer__heading">Learn</h3>
            <ul>
              <li>
                <a href="/glossary">Glossary</a>
              </li>
              <li>
                <a href="/blog/">Blog</a>
              </li>
            </ul>
          </div>

          <div className="site-footer__col">
            <h3 className="site-footer__heading">Company</h3>
            <ul>
              <li>
                <a href="mailto:contact@datus.ai">Contact</a>
              </li>
              <li>
                <a
                  href="https://join.slack.com/t/datus-ai/shared_invite/zt-3g6h4fsdg-iOl5uNoz6A4GOc4xKKWUYg"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Community
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <div className="site-footer__bar">
        <span>© {year} Datus</span>
        <a href="https://github.com/Datus-ai/Datus-agent/blob/main/LICENSE" target="_blank" rel="noopener noreferrer">
          Apache 2.0 License
        </a>
      </div>
    </footer>
  );
};

export default Footer;
