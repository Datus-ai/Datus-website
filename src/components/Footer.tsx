import "./Footer.css";
import { useHref, useLocale } from "../i18n/LocaleContext";
import { UI } from "../i18n/ui";
import { TRUST_CENTER_URL } from "../config/nav";

const Footer = ({ logoSrc = "/logo_dark.svg" }: { logoSrc?: string }) => {
  const year = new Date().getFullYear();
  const locale = useLocale();
  const l = useHref();
  const t = UI[locale].footer;
  const p = UI[locale].products;

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <a href={l("/")} className="site-footer__logo" aria-label="Datus">
            <img src={logoSrc} alt="Datus" />
          </a>
          <p className="site-footer__tagline">{t.tagline}</p>
          <div className="site-footer__social">
            <a href="https://www.linkedin.com/company/datusai/" target="_blank" rel="noopener noreferrer" aria-label={t.linkedin} title={t.linkedin}>
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="currentColor"><path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S.02 4.88.02 3.5 1.13 1 2.5 1s2.48 1.12 2.48 2.5ZM5 8H0v16h5V8Zm7.98 0H8.01v16h4.97v-8.4c0-4.67 6.03-5.05 6.03 0V24H24V13.87c0-7.88-8.92-7.59-11.02-3.71V8Z"/></svg>
            </a>
            <a href="https://x.com/Datus_AI" target="_blank" rel="noopener noreferrer" aria-label={t.x} title={t.x}>
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="https://www.youtube.com/@Datus-AI" target="_blank" rel="noopener noreferrer" aria-label={t.youtube} title={t.youtube}>
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="currentColor"><path fillRule="evenodd" d="M21.58 6.21a2.75 2.75 0 0 0-1.94-1.94C17.92 3.8 12 3.8 12 3.8s-5.92 0-7.64.47A2.75 2.75 0 0 0 2.42 6.2C1.96 7.93 1.96 12 1.96 12s0 4.07.46 5.79a2.75 2.75 0 0 0 1.94 1.94c1.72.47 7.64.47 7.64.47s5.92 0 7.64-.47a2.75 2.75 0 0 0 1.94-1.94c.46-1.72.46-5.79.46-5.79s0-4.07-.46-5.79ZM10 15.4V8.6l5.9 3.4-5.9 3.4Z"/></svg>
            </a>
          </div>
        </div>

        <nav className="site-footer__cols" aria-label="Footer">
          <div className="site-footer__col">
            <h3 className="site-footer__heading">{t.products}</h3>
            <ul>
              <li><a href={l("/products/studio/")}>{p.studio}</a></li>
              <li><a href={l("/products/cli/")}>{p.cli}</a></li>
              <li><a href="https://dosi.datus.ai" target="_blank" rel="noopener noreferrer">{p.dosi}</a></li>
              <li><a href={l("/products/vscode/")}>{p.vscode}</a></li>
              <li><a href={l("/products/enterprise/")}>{p.enterprise}</a></li>
            </ul>
          </div>

          <div className="site-footer__col">
            <h3 className="site-footer__heading">{t.resources}</h3>
            <ul>
              <li><a href={l("/solutions/semantic-layer/")}>{UI[locale].nav.semanticLayer}</a></li>
              <li><a href={l("/integrations/")}>{t.integrations}</a></li>
              <li><a href={l("/pricing/")}>{t.pricing}</a></li>
              {/* The blog is English-only — no /zh mirror, so the href is left bare. */}
              <li><a href="/blog/">{t.blog}</a></li>
              <li><a href={l("/glossary/")}>{t.glossary}</a></li>
              <li><a href={l("/apache-ossie-converter/")}>{t.semanticConverter}</a></li>
              <li><a href={l("/faq/")}>{t.faq}</a></li>
              <li><a href={l("/support/")}>{t.support}</a></li>
              <li>
                <a href="https://docs.datus.ai" target="_blank" rel="noopener noreferrer">
                  {t.docs}
                </a>
              </li>
            </ul>
          </div>

          <div className="site-footer__col">
            <h3 className="site-footer__heading">{t.company}</h3>
            <ul>
              <li><a href="mailto:contact@datus.ai">{t.contact}</a></li>
              <li><a href={l("/security/")}>{t.security}</a></li>
              <li>
                <a href="https://github.com/Datus-ai/Datus-agent" target="_blank" rel="noopener noreferrer">
                  {t.github}
                </a>
              </li>
              <li>
                <a
                  href="https://join.slack.com/t/datus-ai/shared_invite/zt-3g6h4fsdg-iOl5uNoz6A4GOc4xKKWUYg"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t.community}
                </a>
              </li>
              <li>
                <a
                  href={TRUST_CENTER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t.trustCenter}
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <div className="site-footer__apache"><p><a href="https://ossie.apache.org/">{t.apacheDisclaimer.project}</a>{t.apacheDisclaimer.afterProject}<a href="https://www.apache.org/">{t.apacheDisclaimer.foundation}</a>{t.apacheDisclaimer.afterFoundation}</p></div>

      <div className="site-footer__bar">
        <span>© {year} {t.rights}</span>
        <a href={l("/policies/cookies/")}>{t.cookiePolicy}</a>
        <a href={l("/policies/privacy/")}>{t.privacyPolicy}</a>
        <a href={l("/policies/terms/")}>{t.termsOfService}</a>
        <button type="button" data-cookie-settings>{t.cookieSettings}</button>
      </div>
    </footer>
  );
};

export default Footer;
