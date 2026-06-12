import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "../index.css";
import "../styles/globals.css";
import "../styles/site.css";

/**
 * Shared React bootstrap for every MPA entry point. Each page's `main.tsx`
 * collapses to `mount(<Page />)`, so global CSS and StrictMode are wired once.
 *
 * Production builds are prerendered to static HTML (see scripts/prerender.mjs),
 * so #root already has server markup → hydrate. In dev #root is empty → render.
 */
export function mount(node: React.ReactNode) {
  const el = document.getElementById("root");
  if (!el) throw new Error("Root element #root not found");
  const tree = <React.StrictMode>{node}</React.StrictMode>;
  if (el.hasChildNodes()) {
    hydrateRoot(el, tree);
  } else {
    createRoot(el).render(tree);
  }
}
