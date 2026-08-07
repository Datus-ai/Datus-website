import { useEffect, useRef } from "react";
import { Languages } from "lucide-react";
import { useCurrentPath, useLocale } from "../i18n/LocaleContext";
import { isMirrored, localizePath, otherLocale } from "../i18n/config";
import { UI } from "../i18n/ui";

/**
 * EN ↔ ZH switch for the current page.
 *
 * It is a plain `<a>` to the same path under the other locale prefix, so it is
 * crawlable and works without JS. Any `?query` on the current URL is carried
 * over (spec §6.3) — the target path itself never changes, only the prefix.
 *
 * On a page with no Chinese mirror (the blog) the switcher points at the other
 * locale's homepage rather than fabricating a `/zh/blog/...` URL.
 */
export default function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const path = useCurrentPath();
  const target = otherLocale(locale);
  const t = UI[locale].nav;

  const base = isMirrored(path) ? path : "/";
  const href = localizePath(base, target);

  // The prerendered href can't know the query string. Re-append it once we're
  // in the browser so `/pricing/?utm_source=x` survives the language switch.
  const ref = useRef<HTMLAnchorElement>(null);
  useEffect(() => {
    const search = window.location.search;
    if (search && ref.current) ref.current.href = `${href}${search}`;
  }, [href]);

  return (
    <a
      ref={ref}
      className={className ?? "nav-lang"}
      href={href}
      hrefLang={target === "zh" ? "zh-Hans" : "en"}
      aria-label={t.switchAria}
      data-lang-switch={target}
    >
      <Languages size={15} aria-hidden="true" />
      <span>{t.switchTo}</span>
    </a>
  );
}
