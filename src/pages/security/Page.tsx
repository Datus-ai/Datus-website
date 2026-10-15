import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Boxes,
  Check,
  ChevronDown,
  Code2,
  Database,
  FileText,
  Fingerprint,
  KeyRound,
  LockKeyhole,
  Mail,
  MessageSquare,
  Network,
  ScanLine,
  Server,
  Share2,
  Shield,
  SlidersHorizontal,
  Trash2,
} from "lucide-react";
import type { ReactNode } from "react";
import SiteLayout from "../../components/SiteLayout";
import Breadcrumb from "../../components/Breadcrumb";
import FAQ from "../../components/FAQ";
import { CONTACT_EMAIL, TRUST_CENTER_URL } from "../../config/nav";
import { useHref, useLocale, useT } from "../../i18n/LocaleContext";
import { UI } from "../../i18n/ui";
import {
  SECURITY_UPDATED_AT,
  securityPage,
  type ISecurityDetail,
} from "./content";
import "./security.css";

const CONTROL_ICONS = [LockKeyhole, Fingerprint, Share2, ScanLine];
const RESOURCE_ICONS = [Shield, Server, Mail];

function SectionHeading({
  id,
  eyebrow,
  title,
  lead,
}: {
  id: string;
  eyebrow?: string;
  title: string;
  lead?: string;
}) {
  return (
    <div className="security-section-head">
      {eyebrow && <span className="security-kicker">{eyebrow}</span>}
      <h2 id={id}>{title}</h2>
      {lead && <p>{lead}</p>}
    </div>
  );
}

function SecurityDetails({
  label,
  items,
}: {
  label: string;
  items: ISecurityDetail[];
}) {
  return (
    <details className="security-details">
      <summary>
        {label}
        <ChevronDown size={15} aria-hidden="true" />
      </summary>
      <div className="security-details__body">
        {items.map((item) => (
          <div key={item.title}>
            <h4>{item.title}</h4>
            {item.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        ))}
      </div>
    </details>
  );
}

function FeatureCard({
  title,
  body,
  detailsLabel,
  details,
  children,
}: {
  title: string;
  body: string;
  detailsLabel: string;
  details: ISecurityDetail[];
  children: ReactNode;
}) {
  return (
    <article className="security-feature card">
      <div className="security-feature__intro">
        <h3>{title}</h3>
        <p>{body}</p>
      </div>
      {children}
      <SecurityDetails label={detailsLabel} items={details} />
    </article>
  );
}

export default function SecurityPage() {
  const t = useT(securityPage);
  const ui = UI[useLocale()];
  const l = useHref();
  const v = t.visuals;

  return (
    <SiteLayout>
      <div className="security-page" id="top">
        <Breadcrumb
          currentUrl="/security/"
          items={[{ label: ui.nav.home, href: "/" }, { label: t.title }]}
        />
        <section className="security-hero" aria-labelledby="security-title">
          <div className="container">
            <span className="eyebrow">
              <Shield size={13} aria-hidden="true" />
              {t.eyebrow}
            </span>
            <h1 id="security-title">{t.title}</h1>
            <p className="lead">{t.lead}</p>
            <div className="security-hero__actions">
              <a
                className="btn btn-primary btn-lg"
                href={TRUST_CENTER_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t.trustCenter}
                <ArrowUpRight size={17} aria-hidden="true" />
              </a>
              <a className="btn btn-ghost btn-lg" href="#security-contact">
                {t.contactAction}
                <ArrowDown size={17} aria-hidden="true" />
              </a>
            </div>
            <p className="security-scope">{t.scope}</p>
          </div>
        </section>

        <section
          className="security-section security-features"
          id="ai-data"
          aria-labelledby="ai-data-heading"
        >
          <div className="container">
            <SectionHeading id="ai-data-heading" {...t.features} />
            <div className="security-features__grid">
              <FeatureCard {...t.models}>
                <div
                  className="security-illustration security-model-visual"
                  aria-hidden="true"
                >
                  <div className="security-config">
                    <div className="security-config__header">
                      <span>
                        <SlidersHorizontal size={14} />
                        {v.modelConnection}
                      </span>
                      <span className="security-config__tag">
                        <Check size={11} />
                        {v.configuredByYou}
                      </span>
                    </div>
                    <dl>
                      <div>
                        <dt>{v.model}</dt>
                        <dd>{v.modelValue}</dd>
                      </div>
                      <div>
                        <dt>{v.endpoint}</dt>
                        <dd>{v.endpointValue}</dd>
                      </div>
                      <div>
                        <dt>{v.credential}</dt>
                        <dd className="security-secret">••••••••••••</dd>
                      </div>
                    </dl>
                  </div>
                  <div className="security-model-route">
                    <span className="security-model-route__brand">
                      <img src="/logo_dark.svg" alt="" />
                    </span>
                    <span className="security-model-route__line">
                      <ArrowRight size={16} />
                    </span>
                    <span className="security-model-route__provider">
                      <Network size={17} />
                      {v.provider}
                    </span>
                  </div>
                </div>
              </FeatureCard>
              <FeatureCard {...t.conversations}>
                <div
                  className="security-illustration security-history-visual"
                  aria-hidden="true"
                >
                  <div className="security-history">
                    <div className="security-history__heading">
                      <MessageSquare size={14} />
                      {v.conversation}
                      <span className="security-history__dots">
                        <i></i>
                        <i></i>
                        <i></i>
                      </span>
                    </div>
                    <div className="security-message security-message--question">
                      <MessageSquare size={14} />
                      <span>{v.prompt}</span>
                      <i></i>
                    </div>
                    <div className="security-message security-message--context">
                      <Code2 size={14} />
                      <span>{v.context}</span>
                      <i></i>
                    </div>
                    <div className="security-message security-message--response">
                      <FileText size={14} />
                      <span>{v.response}</span>
                      <i></i>
                    </div>
                    <div className="security-history__footer">
                      <span>
                        <span className="security-history__dot"></span>Datus
                        Studio
                      </span>
                      <span className="security-delete">
                        <Trash2 size={13} />
                        {v.delete}
                      </span>
                    </div>
                  </div>
                </div>
              </FeatureCard>
            </div>
            <p className="security-feature-note">
              <Shield size={15} aria-hidden="true" />
              <span>{t.features.note}</span>
            </p>
          </div>
        </section>

        <section
          className="security-section security-controls"
          id="security-controls"
          aria-labelledby="controls-heading"
        >
          <div className="container">
            <SectionHeading id="controls-heading" {...t.controls} />
            <div className="security-controls__grid">
              {t.controls.cards.map((card, index) => {
                const Icon = CONTROL_ICONS[index];
                return (
                  <article
                    className="card security-control"
                    id={card.id}
                    key={card.id}
                  >
                    <span className="card__icon">
                      <Icon size={20} aria-hidden="true" />
                    </span>
                    <h3>{card.title}</h3>
                    <p className="security-control__body">{card.body}</p>
                    <SecurityDetails
                      label={t.controls.detailsLabel}
                      items={card.details}
                    />
                  </article>
                );
              })}
            </div>
            <p className="security-control-note">{t.controls.note}</p>
          </div>
        </section>

        <section
          className="security-section security-deployment"
          id="infrastructure"
          aria-labelledby="deployment-heading"
        >
          <div className="container">
            <SectionHeading id="deployment-heading" {...t.deployment} />
            <div className="security-deployment__grid">
              {t.deployment.cards.map((card, index) => (
                <article
                  className="card security-deployment-card"
                  key={card.title}
                >
                  <div
                    className={`security-boundary${index === 1 ? " security-boundary--private" : ""}`}
                    aria-hidden="true"
                  >
                    <span className="security-boundary__label">
                      {index === 0 ? "AWS" : v.yourInfrastructure}
                    </span>
                    {index === 0 ? (
                      <>
                        <div className="security-workspaces">
                          {["01", "02"].map((number) => (
                            <div className="security-workspace" key={number}>
                              <Boxes size={26} />
                              <span>
                                {v.workspace} {number}
                              </span>
                              <small>{v.runtime}</small>
                            </div>
                          ))}
                        </div>
                        <div className="security-boundary__access">
                          <LockKeyhole size={13} />
                          {v.access}
                        </div>
                      </>
                    ) : (
                      <div className="security-private-nodes">
                        <div>
                          <Server size={26} />
                          <span>{v.runtime}</span>
                        </div>
                        <div>
                          <Database size={26} />
                          <span>{v.storage}</span>
                        </div>
                        <div>
                          <KeyRound size={26} />
                          <span>{v.keys}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <h3>{card.title}</h3>
                  <p>{card.paragraphs[0]}</p>
                  <p className="security-deployment-card__note">
                    {card.paragraphs[1]}
                  </p>
                </article>
              ))}
            </div>
            <p className="security-responsibility">
              {t.deployment.responsibility}
            </p>
          </div>
        </section>

        <section
          className="security-section security-compliance"
          id="compliance"
          aria-labelledby="compliance-heading"
        >
          <div className="container">
            <SectionHeading
              id="compliance-heading"
              eyebrow={t.compliance.eyebrow}
              title={t.compliance.title}
            />
            <div className="security-compliance__panel">
              <div className="security-compliance__mark" aria-hidden="true">
                <Shield size={38} />
                <span>SOC 2</span>
                <span className="security-compliance__line"></span>
              </div>
              <div className="security-compliance__copy">
                <span className="security-status">{t.compliance.status}</span>
                <p>{t.compliance.body}</p>
                <a
                  className="link-arrow"
                  href={t.compliance.link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t.compliance.link.label}
                  <ArrowUpRight size={15} aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section
          className="security-section security-resources"
          aria-labelledby="resources-heading"
        >
          <div className="container">
            <SectionHeading id="resources-heading" title={t.resources.title} />
            <div className="security-resources__grid">
              {t.resources.cards.map((card, index) => {
                const Icon = RESOURCE_ICONS[index];
                const external = card.href.startsWith("https:");
                return (
                  <a
                    className={`security-resource${index === 0 ? " security-resource--featured" : ""}`}
                    href={l(card.href)}
                    key={card.title}
                    {...(external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    <span className="security-resource__icon">
                      <Icon size={24} aria-hidden="true" />
                    </span>
                    <div className="security-resource__copy">
                      <h3>{card.title}</h3>
                      <p>{card.body}</p>
                      <span className="security-resource__action">
                        {card.action}
                        <ArrowUpRight size={15} aria-hidden="true" />
                      </span>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        <div className="security-faq" id={t.faq.id}>
          <FAQ
            items={t.faq.items}
            currentUrl="/security/"
            eyebrow=""
            heading={t.faq.title}
          />
        </div>

        <section
          className="security-contact"
          id="security-contact"
          aria-labelledby="contact-heading"
        >
          <div className="container">
            <div className="security-contact__inner">
              <div>
                <h2 id="contact-heading">{t.contact.title}</h2>
                <p>{t.contact.body}</p>
              </div>
              <a
                className="btn btn-primary btn-lg"
                href={`mailto:${CONTACT_EMAIL}`}
              >
                {CONTACT_EMAIL}
                <ArrowUpRight size={17} aria-hidden="true" />
              </a>
            </div>
            <div className="security-page-meta">
              <span>
                {t.updated} <time dateTime={SECURITY_UPDATED_AT}>{t.date}</time>
              </span>
              <a className="security-back-top" href="#top">
                {t.backToTop}
                <ArrowUp size={13} aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}
