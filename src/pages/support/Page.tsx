import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Copy,
  Cpu,
  Database,
  KeyRound,
  LifeBuoy,
  Mail,
  MessageSquare,
  PanelsTopLeft,
  Search,
  Server,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import SiteLayout from "../../components/SiteLayout";
import FAQ from "../../components/FAQ";
import { CONTACT_EMAIL, DOCS_URL, SLACK_URL } from "../../config/nav";
import { useHref, useT, useLocale } from "../../i18n/LocaleContext";
import { supportPage } from "./content";
import { searchSupport, type ISupportMatch } from "./search";
import { studioCtaUrl } from "../../lib/studio-cta";
import "./support.css";

const STUDIO_HOME = "https://studio.datus.ai";
const FEEDBACK_URL = `${STUDIO_HOME}/feedback`;
const SUPPORT_EMAIL = `mailto:${CONTACT_EMAIL}?subject=Datus%20Product%20Support`;
const CHANNEL_ICONS = [MessageSquare, Mail, BookOpen];
const CHANNEL_LINKS = [FEEDBACK_URL, SUPPORT_EMAIL, SLACK_URL];
const TOPIC_ICONS = [UserRound, Database, Cpu, KeyRound, PanelsTopLeft, Server];
const external = { target: "_blank", rel: "noopener noreferrer" };

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Local clipboard fallback for browsers that do not expose the async API.
    const focused = document.activeElement;
    const field = document.createElement("textarea");
    field.value = text;
    field.className = "support-clipboard-field";
    document.body.append(field);
    field.select();
    try {
      return document.execCommand("copy");
    } catch {
      return false;
    } finally {
      field.remove();
      if (focused instanceof HTMLElement)
        focused.focus({ preventScroll: true });
    }
  }
}

export default function SupportPage() {
  const t = useT(supportPage);
  const l = useHref();
  const locale = useLocale();
  const [query, setQuery] = useState("");
  const [activeGuide, setActiveGuide] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [jumpToResults, setJumpToResults] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const noticeTimer = useRef<ReturnType<typeof setTimeout>>();
  const hasQuery = Boolean(query.trim());
  const matches = useMemo(
    () => searchSupport(query, t.guides, t.faqs, t.faqCategory),
    [query, t],
  );

  useEffect(() => {
    if (jumpToResults) {
      resultsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      setJumpToResults(false);
    }
  }, [jumpToResults, query]);

  useEffect(() => {
    if (!activeGuide) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const overflow = document.body.style.overflow;
    if (!dialog.open) dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [activeGuide]);

  useEffect(() => () => clearTimeout(noticeTimer.current), []);

  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    if (hasQuery) setJumpToResults(true);
  };
  const selectMatch = (match: ISupportMatch) => {
    if (match.kind === "guide") {
      setActiveGuide(match.id);
      return;
    }
    const faq =
      faqRef.current?.querySelectorAll("details")[match.faqIndex ?? 0];
    if (faq) {
      faq.open = true;
      faq.scrollIntoView({ behavior: "smooth", block: "center" });
      faq.querySelector("summary")?.focus({ preventScroll: true });
    }
  };
  const copyTemplate = async () => {
    const copied = await copyText(t.template.join("\n"));
    setNotice(copied ? t.copied : t.copyFailed);
    clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(""), 4000);
  };

  return (
    <SiteLayout>
      <div className="support-page">
        <section className="support-hero">
          <div className="container">
            <div className="support-eyebrow">
              <LifeBuoy size={15} aria-hidden="true" />
              {t.eyebrow}
            </div>
            <h1>{t.heading}</h1>
            <p className="support-hero-lead">
              {t.lead.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </p>
            <form
              className="support-search-form"
              role="search"
              onSubmit={submitSearch}
            >
              <Search
                className="support-search-icon"
                size={20}
                aria-hidden="true"
              />
              <input
                ref={searchRef}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t.searchPlaceholder}
                aria-label={t.searchLabel}
                autoComplete="off"
                aria-controls="support-search-results"
              />
              <button type="submit" aria-label={t.searchAction}>
                ↵
              </button>
            </form>
            <div className="support-quick">
              <span>{t.quickLabel}</span>
              {t.quick.map((item) => (
                <button
                  type="button"
                  key={item.query}
                  onClick={() => {
                    setQuery(item.query);
                    setJumpToResults(true);
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </section>
        <div className="container">
          <section className="support-channels" aria-label={t.channelsLabel}>
            {t.channels.map((channel, i) => {
              const Icon = CHANNEL_ICONS[i];
              return (
                <article className="support-channel" key={channel.title}>
                  <div className="support-channel-top">
                    <Icon size={20} aria-hidden="true" />
                    <h2>{channel.title}</h2>
                  </div>
                  <p>{channel.body}</p>
                  <a
                    className="support-text-link"
                    href={i === 0 ? studioCtaUrl(FEEDBACK_URL, "support_feedback_channel", locale) : CHANNEL_LINKS[i]}
                    {...(i !== 1 ? external : {})}
                  >
                    {channel.action}
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </a>
                </article>
              );
            })}
          </section>
          <section
            className="support-search-results"
            id="support-search-results"
            ref={resultsRef}
            aria-label={t.searchResults}
            hidden={!hasQuery}
          >
            <div className="support-result-head">
              <span aria-live="polite" role="status">
                {t.searchCount
                  .replace("{query}", query.trim())
                  .replace("{count}", String(matches.length))}
              </span>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  searchRef.current?.focus({ preventScroll: true });
                }}
              >
                {t.clearSearch}
              </button>
            </div>
            <div className="support-result-list">
              {matches.map((match) => (
                <button
                  type="button"
                  className="support-result-item"
                  key={match.id}
                  onClick={() => selectMatch(match)}
                >
                  <span>
                    <strong>{match.title}</strong>
                    <small>{match.category}</small>
                  </span>
                  <ArrowRight size={16} aria-hidden="true" />
                </button>
              ))}
              {!matches.length && (
                <div className="support-empty">
                  {t.empty} <a href={SUPPORT_EMAIL}>{t.emptyContact}</a>
                </div>
              )}
            </div>
          </section>
          <section aria-labelledby="support-topics-title">
            <div className="support-section-head">
              <div>
                <h2 id="support-topics-title">{t.topicsTitle}</h2>
                <p>{t.topicsLead}</p>
              </div>
              <a className="support-text-link" href={DOCS_URL} {...external}>
                {t.docs}
                <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            </div>
            <div className="support-topics">
              {t.topics.map((topic, i) => {
                const Icon = TOPIC_ICONS[i];
                return (
                  <article className="support-topic" key={topic.id}>
                    <Icon
                      className="support-topic-icon"
                      size={22}
                      aria-hidden="true"
                    />
                    <h3>{topic.title}</h3>
                    <p>{topic.body}</p>
                    <div className="support-article-links">
                      {topic.guides.map((id) => {
                        const guide = t.guides.find((item) => item.id === id)!;
                        return (
                          <button
                            type="button"
                            key={id}
                            onClick={() => setActiveGuide(id)}
                          >
                            {guide.title}
                            <ArrowRight size={15} aria-hidden="true" />
                          </button>
                        );
                      })}
                    </div>
                  </article>
                );
              })}
            </div>
            <div className="support-doti-line">
              <Sparkles size={18} aria-hidden="true" />
              <span>
                <strong>{t.dotiTitle}</strong> {t.dotiBody}
              </span>
              <a className="support-text-link" href={studioCtaUrl(STUDIO_HOME, "support_open_studio", locale)} {...external}>
                {t.openStudio}
                <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            </div>
          </section>
          <div className="support-lower">
            <div className="support-faq" ref={faqRef}>
              <FAQ
                items={t.faqs}
                currentUrl="/support/"
                eyebrow=""
                heading={t.faqTitle}
              />
            </div>
            <section
              className="support-request-box"
              aria-labelledby="support-request-title"
            >
              <h2 id="support-request-title">{t.requestTitle}</h2>
              <p>{t.requestLead}</p>
              <ol className="support-request-list">
                {t.requestItems.map((item, i) => (
                  <li key={item.title}>
                    <span className="support-number" aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <strong>{item.title}</strong>
                      <p>{item.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="support-request-actions">
                <a
                  className="support-button support-primary"
                  href={studioCtaUrl(FEEDBACK_URL, "support_feedback", locale)}
                  {...external}
                >
                  {t.submit}
                  <ArrowUpRight size={16} aria-hidden="true" />
                </a>
                <button
                  className="support-button"
                  type="button"
                  onClick={copyTemplate}
                >
                  <Copy size={16} aria-hidden="true" />
                  {t.copyTemplate}
                </button>
              </div>
              <div className="support-request-note">{t.requestNote}</div>
            </section>
          </div>
          <section
            className="support-resource-bar"
            aria-label={t.resourcesLabel}
          >
            <div>
              <h3>{t.resourcesTitle}</h3>
              <p>{t.resourcesBody}</p>
            </div>
            <div className="support-links">
              <a
                className="support-text-link"
                href={studioCtaUrl(`${STUDIO_HOME}/deployment`, "support_deployment", locale)}
                {...external}
                rel="noopener"
              >
                {t.deployment}
                <ArrowUpRight size={15} aria-hidden="true" />
              </a>
              <a className="support-text-link" href={l("/security/")}>
                {t.security}
                <ArrowUpRight size={15} aria-hidden="true" />
              </a>
              <a className="support-text-link" href={SUPPORT_EMAIL}>
                {t.contact}
                <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            </div>
          </section>
        </div>
        <dialog
          ref={dialogRef}
          className="support-guide-dialog"
          aria-labelledby={
            activeGuide ? `support-guide-title-${activeGuide}` : undefined
          }
          onClose={() => setActiveGuide(null)}
          onClick={(event) => {
            if (event.target !== event.currentTarget) return;
            const bounds = event.currentTarget.getBoundingClientRect();
            if (
              event.clientX < bounds.left ||
              event.clientX > bounds.right ||
              event.clientY < bounds.top ||
              event.clientY > bounds.bottom
            )
              event.currentTarget.close();
          }}
        >
          <button
            className="support-close-button"
            type="button"
            aria-label={t.closeGuide}
            onClick={() => dialogRef.current?.close()}
          >
            <X size={20} aria-hidden="true" />
          </button>
          {/* Include every guide in prerendered HTML, not an AJAX-only article. */}
          {t.guides.map((guide) => (
            <article key={guide.id} hidden={activeGuide !== guide.id}>
              <div className="support-dialog-head">
                <div className="support-dialog-tag">{guide.category}</div>
                <h2 id={`support-guide-title-${guide.id}`}>{guide.title}</h2>
              </div>
              <div className="support-dialog-body">
                <p className="support-article-intro">{guide.intro}</p>
                <ol className="support-article-steps">
                  {guide.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
                <p className="support-article-callout">{guide.note}</p>
                <div className="support-article-foot">
                  <a
                    className="support-button support-primary"
                    href={studioCtaUrl(FEEDBACK_URL, "support_feedback", locale)}
                    {...external}
                  >
                    {t.guideHelp}
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </a>
                  <a className="support-button" href={SUPPORT_EMAIL}>
                    {t.emailHelp}
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </dialog>
        <div
          className={`support-toast${notice ? " show" : ""}`}
          role="status"
          aria-live="polite"
        >
          {notice}
        </div>
      </div>
    </SiteLayout>
  );
}
