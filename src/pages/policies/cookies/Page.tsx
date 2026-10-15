import SiteLayout from "../../../components/SiteLayout";
import Breadcrumb from "../../../components/Breadcrumb";
import { useHref, useLocale, useT } from "../../../i18n/LocaleContext";
import { UI } from "../../../i18n/ui";
import { cookiePolicy } from "./content";
import "./policy.css";
export default function CookiePolicyPage() {
  const t = useT(cookiePolicy);
  const locale = useLocale();
  const l = useHref();
  return (
    <SiteLayout>
      <div className="container cookie-policy">
        <Breadcrumb
          currentUrl="/policies/cookies/"
          items={[
            { label: UI[locale].nav.home, href: "/" },
            { label: t.title },
          ]}
        />
        <header>
          <p className="cookie-policy__updated">{t.updated}</p>
          <h1>{t.title}</h1>
          <p className="lead">{t.lead}</p>
          <p>{t.scope}</p>
        </header>
        {t.sections.map((section, index) => (
          <section key={section.title}>
            <h2>{section.title}</h2>
            {section.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
            {index === 2 && (
              <>
                <h3>{t.inventoryTitle}</h3>
                <div className="cookie-policy__table">
                  <table>
                    <thead>
                      <tr>
                        {t.headers.map((h) => (
                          <th key={h}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {t.rows.map((row) => (
                        <tr key={row[0]}>
                          {row.map((cell, i) => (
                            <td key={i}>{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
            {index === 3 && (
              <button
                type="button"
                className="btn btn-primary"
                data-cookie-settings
              >
                {t.settings}
              </button>
            )}
          </section>
        ))}
        <p>
          <a
            href="https://policies.google.com/technologies/partner-sites"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t.googleLabel}
          </a>
        </p>
        <div className="cookie-policy__links">
          <a href={l("/security/")}>{UI[locale].footer.security}</a>
          <a href="mailto:contact@datus.ai">{t.contact}</a>
        </div>
      </div>
    </SiteLayout>
  );
}
