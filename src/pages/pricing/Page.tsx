import { ArrowRight, Check } from "lucide-react";
import SiteLayout from "../../components/SiteLayout";
import Breadcrumb from "../../components/Breadcrumb";
import FAQ from "../../components/FAQ";
import { EnterpriseInquiryDialog } from "../../components/EnterpriseInquiryDialog";
import { useLocale, useT } from "../../i18n/LocaleContext";
import { UI } from "../../i18n/ui";
import { pricingFaq } from "./faq";
import { pricingPage, type Tier } from "./content";

function CtaFor({ tier, source }: { tier: Tier; source: string }) {
  const cls = `btn btn-lg ${tier.featured ? "btn-primary" : "btn-ghost"}`;
  if (tier.cta.dialog) {
    return (
      <EnterpriseInquiryDialog source={source}>
        <button className={cls} style={{ width: "100%" }}>{tier.cta.label}</button>
      </EnterpriseInquiryDialog>
    );
  }
  const ext = tier.cta.external ? { target: "_blank", rel: "noopener noreferrer" } : {};
  return (
    <a className={cls} href={tier.cta.href} {...ext} style={{ width: "100%" }}>
      {tier.cta.label} <ArrowRight size={16} />
    </a>
  );
}

export default function PricingPage() {
  const t = useT(pricingPage);
  const faqItems = useT(pricingFaq);
  const ui = UI[useLocale()];
  return (
    <SiteLayout>
      <Breadcrumb
        currentUrl="/pricing/"
        items={[{ label: ui.nav.home, href: "/" }, { label: t.eyebrow }]}
      />
      <section className="section" style={{ paddingTop: 72, paddingBottom: 40 }}>
        <div className="container section-head center" style={{ marginBottom: 44 }}>
          <span className="eyebrow">{t.eyebrow}</span>
          <h1 style={{ fontSize: "clamp(32px,4.6vw,52px)", lineHeight: 1.06, letterSpacing: "-0.03em", fontWeight: 750, margin: "16px 0 0" }}>
            {t.heading}
          </h1>
          <p className="lead" style={{ marginInline: "auto", maxWidth: 560 }}>
            {t.lead}
          </p>
        </div>

        <div className="container">
          <div className="grid grid-3" style={{ alignItems: "stretch" }}>
            {t.tiers.map((tier) => (
              <div
                key={tier.name}
                className="card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: 30,
                  borderColor: tier.featured ? "var(--brand)" : undefined,
                  boxShadow: tier.featured ? "var(--shadow-brand)" : undefined,
                }}
              >
                <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>{tier.name}</h2>
                <p className="muted" style={{ margin: "4px 0 0", fontFamily: "var(--font-mono)", fontSize: 13 }}>{tier.tagline}</p>
                <div style={{ fontSize: 38, fontWeight: 750, margin: "18px 0 22px", letterSpacing: "-0.02em" }}>{tier.price}</div>
                <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 12, flex: 1 }}>
                  {tier.features.map((f) => (
                    <li key={f} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 14.5, color: "var(--ink-dim)" }}>
                      <Check size={16} style={{ color: "var(--brand-bright)", flexShrink: 0, marginTop: 2 }} /> {f}
                    </li>
                  ))}
                </ul>
                <div style={{ marginTop: 26 }}>
                  <CtaFor tier={tier} source={t.inquirySource} />
                </div>
              </div>
            ))}
          </div>
          <p className="muted" style={{ textAlign: "center", marginTop: 28, fontSize: 14 }}>
            {t.note}
          </p>
        </div>
      </section>

      <FAQ items={faqItems} currentUrl="/pricing/" lead={t.faqLead} />
    </SiteLayout>
  );
}
