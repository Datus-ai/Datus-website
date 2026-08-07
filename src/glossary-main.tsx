import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import GlossaryPage from "./components/GlossaryPage";
import "./index.css";
import "./styles/globals.css";
import { LocaleProvider } from "./i18n/LocaleContext";
import { localeFromPathname, stripLocale } from "./i18n/config";

// Glossary has its own design system (GlossaryPage.css) and so does not use the
// shared mount() helper, which pulls in site.css. Everything else matches:
// locale comes from the URL, and a prerendered #root is hydrated rather than
// re-rendered so the crawler-visible markup is the markup React keeps.
const pathname = window.location.pathname;
const tree = (
  <React.StrictMode>
    <LocaleProvider locale={localeFromPathname(pathname)} path={stripLocale(pathname)}>
      <GlossaryPage />
    </LocaleProvider>
  </React.StrictMode>
);

const el = document.getElementById("root")!;
if (el.hasChildNodes()) {
  hydrateRoot(el, tree);
} else {
  createRoot(el).render(tree);
}
