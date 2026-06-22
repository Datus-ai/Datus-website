import { ArrowRight, HelpCircle } from "lucide-react";
import SiteLayout from "../../components/SiteLayout";
import Breadcrumb from "../../components/Breadcrumb";
import FAQ from "../../components/FAQ";
import { SLACK_URL } from "../../config/nav";
import { faqProducts, faqs } from "./content";

export default function FaqPage() {
  return (
    <SiteLayout>
      <Breadcrumb
        currentUrl="/faq/"
        items={[{ label: "Home", href: "/" }, { label: "FAQ" }]}
      />
      {/* Hero */}
      <section className="section" style={{ paddingTop: 72, paddingBottom: 40 }}>
        <div className="container" style={{ maxWidth: 880 }}>
          <span className="eyebrow"><HelpCircle size={13} /> FAQ</span>
          <h1 style={{ fontSize: "clamp(32px,4.6vw,52px)", lineHeight: 1.06, letterSpacing: "-0.03em", fontWeight: 750, margin: "20px 0 0" }}>
            Frequently asked questions about Datus.
          </h1>
          <p className="lead" style={{ maxWidth: 660 }}>
            What Datus is, what each product does, and the questions teams ask
            most often when adopting an open-source data engineering agent.
          </p>
        </div>
      </section>

      {/* Products */}
      <section className="section" style={{ background: "rgba(11,18,48,0.4)", borderBlock: "1px solid var(--line)" }}>
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Products</span>
            <h2 className="h2" style={{ fontSize: "clamp(24px,3vw,34px)" }}>What are the Datus products?</h2>
            <p className="lead" style={{ marginTop: 10, maxWidth: 720 }}>
              One context engine, four ways to use it, from a local terminal to a governed enterprise platform.
            </p>
          </div>
          <div className="grid grid-2">
            {faqProducts.map((p) => (
              <div className="card" key={p.name} style={{ display: "flex", flexDirection: "column" }}>
                <h3 className="card__title" style={{ fontSize: 18 }}>{p.name}</h3>
                <p className="card__body" style={{ marginTop: 6 }}>{p.body}</p>
                <a className="link-arrow" href={p.href} style={{ marginTop: "auto", paddingTop: 14 }}>
                  Learn more <ArrowRight size={15} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Common questions */}
      <FAQ
        items={faqs}
        currentUrl="/faq/"
        eyebrow="Common questions"
        heading="Datus, answered."
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
            <h2 className="h2" style={{ fontSize: "clamp(22px,2.6vw,30px)" }}>Still have a question?</h2>
            <p className="lead" style={{ marginInline: "auto", maxWidth: 560 }}>
              Read the docs, browse the open-source repo, or ask the team in our community Slack.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginTop: 24 }}>
              <a className="btn btn-primary btn-lg" href="https://docs.datus.ai" target="_blank" rel="noopener noreferrer">
                Read the docs <ArrowRight size={17} />
              </a>
              <a className="btn btn-ghost btn-lg" href="https://github.com/Datus-ai/Datus-agent" target="_blank" rel="noopener noreferrer">
                View on GitHub
              </a>
              <a className="btn btn-ghost btn-lg" href={SLACK_URL} target="_blank" rel="noopener noreferrer">
                Ask in Slack
              </a>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
