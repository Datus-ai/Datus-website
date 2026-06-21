import { renderToString } from "react-dom/server";
import App from "./App";
import CliPage from "./pages/products/cli/Page";
import VscodePage from "./pages/products/vscode/Page";
import StudioPage from "./pages/products/studio/Page";
import EnterprisePage from "./pages/products/enterprise/Page";
import IntegrationsPage from "./pages/integrations/Page";
import PricingPage from "./pages/pricing/Page";
import FaqPage from "./pages/faq/Page";

/**
 * SSR entry for build-time prerendering. Loaded via Vite's ssrLoadModule in
 * scripts/prerender.mjs. Each marketing route is rendered to a static HTML
 * string and injected into the Vite-built shell's <div id="root">, then the
 * client hydrates it (see src/lib/mount.tsx). The content lives in the HTML
 * for crawlers; React only takes over the interactive bits.
 *
 * Glossary is intentionally excluded — it uses a separate CSS system and
 * already ships its definitions as JSON-LD structured data.
 */
export const ROUTES: { out: string; node: JSX.Element }[] = [
  { out: "index.html", node: <App /> },
  { out: "products/cli/index.html", node: <CliPage /> },
  { out: "products/vscode/index.html", node: <VscodePage /> },
  { out: "products/studio/index.html", node: <StudioPage /> },
  { out: "products/enterprise/index.html", node: <EnterprisePage /> },
  { out: "integrations/index.html", node: <IntegrationsPage /> },
  { out: "pricing/index.html", node: <PricingPage /> },
  { out: "faq/index.html", node: <FaqPage /> },
];

export function render(node: JSX.Element): string {
  return renderToString(node);
}
