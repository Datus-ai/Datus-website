import { ArrowRight, HelpCircle } from "lucide-react";
import SiteLayout from "../../components/SiteLayout";
import Breadcrumb from "../../components/Breadcrumb";
import FAQ from "../../components/FAQ";
import { SLACK_URL } from "../../config/nav";
import { useHref, useLocale, useT } from "../../i18n/LocaleContext";
import { UI } from "../../i18n/ui";
import { faqPage } from "./content";

export default function FaqPage() {
  const t = useT(faqPage);
  const ui = UI[useLocale()];
  const l = useHref();
  return (
    <SiteLayout>
      <Breadcrumb
        currentUrl="/faq/"
        items={[{ label: ui.nav.home, href: "/" }, { label: t.hero.eyebrow }]}
      />
      {/* Hero */}
      <section className="section" style={{ paddingTop: 72, paddingBottom: 40 }}>
        <div className="container" style={{ maxWidth: 880 }}>
          <span className="eyebrow"><HelpCircle size={13} /> {t.hero.eyebrow}</span>
          <h1 style={{ fontSize: "clamp(32px,4.6vw,52px)", lineHeight: 1.06, letterSpacing: "-0.03em", fontWeight: 750, margin: "20px 0 0" }}>
            {t.hero.heading}
          </h1>
          <p className="lead" style={{ maxWidth: 660 }}>
            {t.hero.lead}
          </p>
        </div>
      </section>

      {/* Products */}
      <section className="section" style={{ background: "rgba(11,18,48,0.4)", borderBlock: "1px solid var(--line)" }}>
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">{t.productsSection.eyebrow}</span>
            <h2 className="h2" style={{ fontSize: "clamp(24px,3vw,34px)" }}>{t.productsSection.heading}</h2>
            <p className="lead" style={{ marginTop: 10, maxWidth: 720 }}>
              {t.productsSection.lead}
            </p>
          </div>
          <div className="grid grid-2">
            {t.products.map((p) => (
              <div className="card" key={p.name} style={{ display: "flex", flexDirection: "column" }}>
                <h3 className="card__title" style={{ fontSize: 18 }}>{p.name}</h3>
                <p className="card__body" style={{ marginTop: 6 }}>{p.body}</p>
                <a className="link-arrow" href={l(p.href)} style={{ marginTop: "auto", paddingTop: 14 }}>
                  {t.productsSection.learnMore} <ArrowRight size={15} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Common questions */}
      <FAQ
        items={t.faqs}
        currentUrl="/faq/"
        eyebrow={t.questions.eyebrow}
        heading={t.questions.heading}
      />

      {/* Closing CTA */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="card" style={{
            textAlign: "center",
            padding: "44px 32px",
            background: "radial-gradient(700px 300px at 50% -20%, var(--brand-soft), transparent 70%), var(--panel)",
            borderColor: "var(--line-strong)",
          }}>
            <h2 className="h2" style={{ fontSize: "clamp(22px,2.6vw,30px)" }}>{t.closing.heading}</h2>
            <p className="lead" style={{ marginInline: "auto", maxWidth: 560 }}>
              {t.closing.lead}
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginTop: 24 }}>
              <a className="btn btn-primary btn-lg" href="https://docs.datus.ai" target="_blank" rel="noopener noreferrer">
                {t.closing.docs} <ArrowRight size={17} />
              </a>
              <a className="btn btn-ghost btn-lg" href="https://github.com/Datus-ai/Datus-agent" target="_blank" rel="noopener noreferrer">
                {t.closing.github}
              </a>
              <a className="btn btn-ghost btn-lg" href={SLACK_URL} target="_blank" rel="noopener noreferrer">
                {t.closing.slack}
              </a>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
