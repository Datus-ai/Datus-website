import { useEffect, useRef, useState } from "react";
import { Check, Globe } from "lucide-react";
import { useCurrentPath, useLocale } from "../i18n/LocaleContext";
import { LOCALES, LOCALE_LABEL, HREFLANG, isMirrored, localizePath } from "../i18n/config";
import { UI } from "../i18n/ui";

/**
 * Language switcher for the current page.
 *
 * A globe icon (no locale text, so the English UI never shows Chinese glyphs)
 * opens a menu listing every locale in `LOCALES`, so adding a language later is
 * a config change, not a component change. Each entry is a plain `<a>` to the
 * same path under that locale's prefix, so the links are crawlable and work
 * without JS. Any `?query` on the current URL is carried over (spec §6.3) — the
 * target path never changes, only the prefix.
 *
 * On a page with no Chinese mirror (the blog) the links point at each locale's
 * homepage rather than fabricating a `/zh/blog/...` URL.
 *
 * In the mobile burger menu (`--mobile`) the options render inline as a row
 * instead of a popup, which would otherwise position awkwardly in the stack.
 */
export default function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const path = useCurrentPath();
  const t = UI[locale].nav;
  const base = isMirrored(path) ? path : "/";
  const isMobile = !!className && className.includes("mobile");

  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close the popup on outside click or Escape.
  useEffect(() => {
    if (!open || isMobile) return;
    const onDown = (e: PointerEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, isMobile]);

  // The prerendered hrefs can't know the query string. Re-append it once we're
  // in the browser so `/pricing/?utm_source=x` survives the language switch.
  useEffect(() => {
    const search = window.location.search;
    if (!search || !menuRef.current) return;
    for (const a of menuRef.current.querySelectorAll<HTMLAnchorElement>("a[data-lang-href]")) {
      a.href = `${a.dataset.langHref}${search}`;
    }
  }, [base]);

  const options = (
    <div ref={menuRef} className={isMobile ? "nav-lang__row" : "nav-dd__menu nav-lang__menu"} role="menu">
      {LOCALES.map((loc) => {
        const href = localizePath(base, loc);
        const current = loc === locale;
        return (
          <a
            key={loc}
            className="nav-lang__item"
            href={href}
            data-lang-href={href}
            hrefLang={HREFLANG[loc]}
            role="menuitem"
            aria-current={current ? "true" : undefined}
            onClick={() => setOpen(false)}
          >
            <span>{LOCALE_LABEL[loc]}</span>
            {current && <Check size={14} aria-hidden="true" />}
          </a>
        );
      })}
    </div>
  );

  if (isMobile) {
    return (
      <div className="nav-lang-dd nav-lang-dd--mobile">
        <span className="nav-lang__label">{t.language}</span>
        {options}
      </div>
    );
  }

  return (
    <div ref={wrapRef} className={`nav-lang-dd${open ? " open" : ""}`}>
      <button
        type="button"
        className={className ?? "nav-lang"}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t.switchAria}
        onClick={() => setOpen((v) => !v)}
      >
        <Globe size={16} aria-hidden="true" />
      </button>
      {options}
    </div>
  );
}
