import React from "react";
import ReactDOM from "react-dom/client";
import "../index.css";
import "../styles/globals.css";
import "../styles/site.css";

/**
 * Shared React bootstrap for every MPA entry point. Each page's `main.tsx`
 * collapses to `mount(<Page />)`, so global CSS and StrictMode are wired once.
 */
export function mount(node: React.ReactNode) {
  const el = document.getElementById("root");
  if (!el) throw new Error("Root element #root not found");
  ReactDOM.createRoot(el).render(
    <React.StrictMode>{node}</React.StrictMode>,
  );
}
