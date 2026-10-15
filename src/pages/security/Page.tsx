import { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  LockKeyhole,
  MessageCircle,
  SlidersHorizontal,
} from "lucide-react";
import SiteLayout from "../../components/SiteLayout";
import Breadcrumb from "../../components/Breadcrumb";
import { faqPageJsonLd } from "../../components/FAQ";
import { CONTACT_EMAIL, TRUST_CENTER_URL } from "../../config/nav";
import { useLocale, useT } from "../../i18n/LocaleContext";
import { UI } from "../../i18n/ui";
import {
  SECURITY_UPDATED_AT,
  securityPage,
  type ISecuritySection,
} from "./content";
import "./security.css";

const OVERVIEW_ICONS = [SlidersHorizontal, LockKeyhole, MessageCircle];
const sectionNumber = (index: number) => String(index + 1).padStart(2, "0");

function Paragraphs({ items }: { items?: string[] }) {
  return items?.map((text) => <p key={text}>{text}</p>);
}

function ResourceLink({ label, href }: { label: string; href: string }) {
  const external = href.startsWith("https:");
  return (
    <a
      className="link-arrow"
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {label} <ArrowUpRight size={15} aria-hidden="true" />
    </a>
  );
}

function SecuritySection({
  section,
  index,
  flowLabel,
}: {
  section: ISecuritySection;
  index: number;
  flowLabel: string;
}) {
  return (
    <section
      className="security-section"
      id={section.id}
      aria-labelledby={`${section.id}-heading`}
    >
      <div className="security-section__heading">
        <span className="security-section__number" aria-hidden="true">
          {sectionNumber(index)}
        </span>
        <h2 id={`${section.id}-heading`}>{section.title}</h2>
      </div>
      {section.status && (
        <span className="security-status">{section.status}</span>
      )}
      <Paragraphs items={section.paragraphs} />
      {section.flow && (
        <ol className="security-flow" aria-label={flowLabel}>
          {section.flow.map((step) => (
            <li key={step.label}>
              <span className="security-flow__step">{step.label}</span>
              <strong>{step.title}</strong>
              <p>{step.body}</p>
            </li>
          ))}
        </ol>
      )}
      {section.cards && (
        <div className="security-deployments">
          {section.cards.map((card) => (
            <div className="card" key={card.title}>
              <h3>{card.title}</h3>
              <Paragraphs items={card.paragraphs} />
            </div>
          ))}
        </div>
      )}
      {section.blocks?.map((block) => (
        <div key={block.title}>
          <h3>{block.title}</h3>
          <Paragraphs items={block.paragraphs} />
        </div>
      ))}
      {section.items && (
        <ul>
          {section.items.map((item) => (
            <li key={item.title}>
              <strong>{item.title}</strong> {item.body}
            </li>
          ))}
        </ul>
      )}
      {section.note && (
        <div className="security-note">
          <p>
            <strong>{section.note.title}</strong> {section.note.body}
          </p>
        </div>
      )}
      {section.link && <ResourceLink {...section.link} />}
    </section>
  );
}

export default function SecurityPage() {
  const t = useT(securityPage);
  const locale = useLocale();
  const ui = UI[locale];
  const { sections, faq } = t;
  const [activeId, setActiveId] = useState(sections[0].id);

  useEffect(() => {
    const elements = [...sections, faq]
      .map(({ id }) => document.getElementById(id))
      .filter((element): element is HTMLElement => !!element);
    let frame = 0;
    const update = () => {
      let active = elements[0];
      for (const element of elements) {
        if (element.getBoundingClientRect().top <= 150) {
          active = element;
        }
      }
      if (active) {
        setActiveId(active.id);
      }
      frame = 0;
    };
    const schedule = () => {
      if (!frame) {
        frame = requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
    };
  }, [sections, faq]);

  const faqSchema = faqPageJsonLd(faq.items, "/security/", locale);
  return (
    <SiteLayout>
      <div className="security-page" id="top">
        <Breadcrumb
          currentUrl="/security/"
          items={[{ label: ui.nav.home, href: "/" }, { label: t.title }]}
        />
        <section className="security-hero" aria-labelledby="security-title">
          <div className="container security-hero__inner">
            <div>
              <span className="eyebrow">{t.eyebrow}</span>
              <h1 id="security-title">{t.title}</h1>
              <p className="lead">{t.lead}</p>
              <div className="security-hero__meta">
                <span>
                  {t.updated}{" "}
                  <time dateTime={SECURITY_UPDATED_AT}>{t.date}</time>
                </span>
                <span>{t.scope}</span>
              </div>
            </div>
            <div className="security-hero__actions">
              <a
                className="btn btn-primary btn-lg"
                href={TRUST_CENTER_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t.trustCenter} <ArrowUpRight size={17} aria-hidden="true" />
              </a>
              <a className="btn btn-ghost btn-lg" href="#security-contact">
                {t.contactAction} <ArrowDown size={17} aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>
        <div className="security-overview">
          <div className="container grid grid-3">
            {t.overview.map((item, index) => {
              const Icon = OVERVIEW_ICONS[index];
              return (
                <div className="card" key={item.title}>
                  <span className="card__icon">
                    <Icon size={20} aria-hidden="true" />
                  </span>
                  <h2 className="card__title">{item.title}</h2>
                  <p className="card__body">{item.body}</p>
                </div>
              );
            })}
          </div>
        </div>
        <div className="container">
          <div className="security-layout">
            <aside className="security-sidebar" aria-label={t.toc}>
              <p className="security-sidebar__title">{t.toc}</p>
              <nav aria-label={t.toc}>
                {[...sections, faq].map((section, index) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    aria-current={
                      activeId === section.id ? "location" : undefined
                    }
                  >
                    <span aria-hidden="true">{sectionNumber(index)}</span>
                    {section.title}
                  </a>
                ))}
              </nav>
              <div className="security-sidebar__contact">
                <p>{t.contactLabel}</p>
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL} ↗</a>
              </div>
              <a className="security-back-top" href="#top">
                {t.backToTop} <ArrowUp size={13} aria-hidden="true" />
              </a>
            </aside>
            <div className="security-article">
              {sections.map((section, index) => (
                <SecuritySection
                  key={section.id}
                  section={section}
                  index={index}
                  flowLabel={t.flowLabel}
                />
              ))}
              <section
                className="security-section security-faq"
                id={faq.id}
                aria-labelledby="security-faq-heading"
              >
                <div className="security-section__heading">
                  <span className="security-section__number" aria-hidden="true">
                    {sectionNumber(sections.length)}
                  </span>
                  <h2 id="security-faq-heading">{faq.title}</h2>
                </div>
                <div className="faq__list">
                  {faq.items.map((item, index) => (
                    <details
                      className="faq__item"
                      key={item.q}
                      open={index === 0}
                    >
                      <summary className="faq__summary">
                        <h3 className="faq__q">{item.q}</h3>
                        <span className="faq__icon" aria-hidden="true" />
                      </summary>
                      <div className="faq__a">
                        <p>{item.a}</p>
                      </div>
                    </details>
                  ))}
                </div>
                <script
                  type="application/ld+json"
                  dangerouslySetInnerHTML={{
                    __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c"),
                  }}
                />
              </section>
            </div>
          </div>
        </div>
        <section
          className="security-contact"
          id="security-contact"
          aria-labelledby="security-contact-heading"
        >
          <div className="container">
            <div className="card security-contact__panel">
              <div>
                <h2 id="security-contact-heading">{t.contact.title}</h2>
                <p>{t.contact.body}</p>
              </div>
              <a
                className="btn btn-primary btn-lg"
                href={`mailto:${CONTACT_EMAIL}`}
              >
                {CONTACT_EMAIL} <ArrowUpRight size={17} aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}
