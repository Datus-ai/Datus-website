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
              <li><a href={l("/tools/semantic-model-converter/")}>{t.semanticConverter}</a></li>
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
