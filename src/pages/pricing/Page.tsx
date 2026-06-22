import { ArrowRight, Check } from "lucide-react";
import SiteLayout from "../../components/SiteLayout";
import Breadcrumb from "../../components/Breadcrumb";
import { EnterpriseInquiryDialog } from "../../components/EnterpriseInquiryDialog";
import { GITHUB_URL, STUDIO_URL } from "../../config/nav";

interface Tier {
  name: string;
  price: string;
  tagline: string;
  features: string[];
  cta: { label: string; href?: string; external?: boolean; dialog?: boolean };
  featured?: boolean;
}

const TIERS: Tier[] = [
  {
    name: "Open Source",
    price: "Free",
    tagline: "Apache-2.0 · self-hosted",
    features: [
      "Full Datus CLI + VS Code extension",
      "Context engine & subagents",
      "Bring your own warehouse & model",
      "Community support",
    ],
    cta: { label: "View on GitHub", href: GITHUB_URL, external: true },
  },
  {
    name: "Cloud Personal",
    price: "Free",
    tagline: "Studio · Early access",
    features: [
      "Hosted workspace — no setup",
      "Connect your warehouse in minutes",
      "Chat, subagents & evolving context",
      "Free during early access",
    ],
    cta: { label: "Sign up free", href: STUDIO_URL },
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    tagline: "For data teams",
    features: [
      "SSO & access control",
      "Org-level context store & versioning",
      "Governance, sandboxing & approvals",
      "Long-running agents",
      "Deployment & support services",
    ],
    cta: { label: "Contact us", dialog: true },
  },
];

function CtaFor({ tier }: { tier: Tier }) {
  const cls = `btn btn-lg ${tier.featured ? "btn-primary" : "btn-ghost"}`;
  if (tier.cta.dialog) {
    return (
      <EnterpriseInquiryDialog source="datus.ai pricing — Contact us">
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
  return (
    <SiteLayout>
      <Breadcrumb
        currentUrl="/pricing/"
        items={[{ label: "Home", href: "/" }, { label: "Pricing" }]}
      />
      <section className="section" style={{ paddingTop: 72, paddingBottom: 40 }}>
        <div className="container section-head center" style={{ marginBottom: 44 }}>
          <span className="eyebrow">Pricing</span>
          <h1 style={{ fontSize: "clamp(32px,4.6vw,52px)", lineHeight: 1.06, letterSpacing: "-0.03em", fontWeight: 750, margin: "16px 0 0" }}>
            Free for individuals. Custom for enterprises.
          </h1>
          <p className="lead" style={{ marginInline: "auto", maxWidth: 560 }}>
            Personal productivity is fully open and free. We make money from the
            enterprise edition — shared context, governance, and support.
          </p>
        </div>

        <div className="container">
          <div className="grid grid-3" style={{ alignItems: "stretch" }}>
            {TIERS.map((tier) => (
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
                  <CtaFor tier={tier} />
                </div>
              </div>
            ))}
          </div>
          <p className="muted" style={{ textAlign: "center", marginTop: 28, fontSize: 14 }}>
            Open source is real and stays free. Enterprise pricing is tailored to your deployment.
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}
