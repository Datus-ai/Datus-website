import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "../index.css";
import "../styles/globals.css";
import "../styles/site.css";
import { LocaleProvider } from "../i18n/LocaleContext";
import { DEFAULT_LOCALE, localeFromPathname, stripLocale } from "../i18n/config";

/**
 * Shared React bootstrap for every MPA entry point. Each page's `main.tsx`
 * collapses to `mount(<Page />)`, so global CSS, StrictMode and the locale
 * provider are wired once.
 *
 * Production builds are prerendered to static HTML (see scripts/prerender.mjs),
 * so #root already has server markup → hydrate. In dev #root is empty → render.
 *
 * The locale comes from the URL and nothing else — no Accept-Language sniffing,
 * no cookie. A crawler (or anyone sharing a link) gets exactly the language the
 * path says, and the hydrated tree matches the prerendered one.
 */
export function mount(node: React.ReactNode) {
  const el = document.getElementById("root");
  if (!el) throw new Error("Root element #root not found");
  const pathname = typeof window === "undefined" ? "/" : window.location.pathname;
  const locale = typeof window === "undefined" ? DEFAULT_LOCALE : localeFromPathname(pathname);
  const tree = (
    <React.StrictMode>
      <LocaleProvider locale={locale} path={stripLocale(pathname)}>
        {node}
      </LocaleProvider>
    </React.StrictMode>
  );
  if (el.hasChildNodes()) {
    hydrateRoot(el, tree);
  } else {
    createRoot(el).render(tree);
  }
}
