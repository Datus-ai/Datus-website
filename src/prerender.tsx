import { renderToString } from "react-dom/server";
import { createCache, extractStyle, StyleProvider } from "@ant-design/cssinjs";
import App from "./App";
import SemanticLayerSolution from "./pages/solutions/semantic-layer/Page";
import DatafunPage from "./pages/datafun/Page";
import CliPage from "./pages/products/cli/Page";
import VscodePage from "./pages/products/vscode/Page";
import StudioPage from "./pages/products/studio/Page";
import EnterprisePage from "./pages/products/enterprise/Page";
import IntegrationsPage from "./pages/integrations/Page";
import DatabasesPage from "./pages/databases/Page";
import ModelsPage from "./pages/models/Page";
import McpPage from "./pages/mcp/Page";
import ChatbotPage from "./pages/chatbot/Page";
import PricingPage from "./pages/pricing/Page";
import FaqPage from "./pages/faq/Page";
import CookiePolicyPage from "./pages/policies/cookies/Page";
import PrivacyPolicyPage from "./pages/policies/privacy/Page";
import TermsPage from "./pages/policies/terms/Page";
import SecurityPage from "./pages/security/Page";
import SupportPage from "./pages/support/Page";
import OsiFieldMappingPage from "./pages/osi-field-mapping/Page";
import OsiPlaygroundPage from "./pages/tools/osi-playground/Page";
import SemanticConverterPage from "./pages/tools/semantic-model-converter/Page";
import GlossaryPage from "./components/GlossaryPage";
import { LocaleProvider } from "./i18n/LocaleContext";
import { LOCALES, isMirrored, localizePath, type Locale } from "./i18n/config";

/**
 * SSR entry for build-time prerendering. Loaded via Vite's ssrLoadModule in
 * scripts/prerender.mjs. Each marketing route is rendered to a static HTML
 * string and injected into the Vite-built shell's <div id="root">, then the
 * client hydrates it (see src/lib/mount.tsx). The content lives in the HTML
 * for crawlers; React only takes over the interactive bits.
 *
 * Every route is rendered once per locale it has a shell for. English keeps its
 * unprefixed output path; Chinese lands under `dist/zh/…`, matching the URL
 * contract in src/i18n/config.ts.
 */
const PAGES: { path: string; page: () => JSX.Element }[] = [
  { path: "/", page: () => <App /> },
  { path: "/solutions/semantic-layer/", page: () => <SemanticLayerSolution /> },
  { path: "/datafun/", page: () => <DatafunPage /> },
  { path: "/products/cli/", page: () => <CliPage /> },
  { path: "/products/vscode/", page: () => <VscodePage /> },
  { path: "/products/studio/", page: () => <StudioPage /> },
  { path: "/products/enterprise/", page: () => <EnterprisePage /> },
  { path: "/integrations/", page: () => <IntegrationsPage /> },
  { path: "/databases/", page: () => <DatabasesPage /> },
  { path: "/models/", page: () => <ModelsPage /> },
  { path: "/mcp/", page: () => <McpPage /> },
  { path: "/chatbot/", page: () => <ChatbotPage /> },
  { path: "/pricing/", page: () => <PricingPage /> },
  { path: "/faq/", page: () => <FaqPage /> },
  { path: "/policies/cookies/", page: () => <CookiePolicyPage /> },
  { path: "/policies/privacy/", page: () => <PrivacyPolicyPage /> },
  { path: "/policies/terms/", page: () => <TermsPage /> },
  { path: "/security/", page: () => <SecurityPage /> },
  { path: "/support/", page: () => <SupportPage /> },
  { path: "/osi-field-mapping/", page: () => <OsiFieldMappingPage /> },
  { path: "/tools/osi-playground/", page: () => <OsiPlaygroundPage /> },
  { path: "/tools/semantic-model-converter/", page: () => <SemanticConverterPage /> },
  { path: "/glossary/", page: () => <GlossaryPage /> },
];

/** `/products/cli/` + zh → `zh/products/cli/index.html`. */
function outFile(path: string, locale: Locale): string {
  return `${localizePath(path, locale).replace(/^\//, "")}index.html`;
}

export const ROUTES: { out: string; path: string; locale: Locale; node: JSX.Element }[] =
  PAGES.flatMap(({ path, page }) =>
    LOCALES.filter((locale) => locale === "en" || isMirrored(path)).map((locale) => ({
      out: outFile(path, locale),
      path,
      locale,
      node: (
        <LocaleProvider locale={locale} path={path}>
          {page()}
        </LocaleProvider>
      ),
    })),
  );

export function render(node: JSX.Element): { html: string; styles: string } {
  // Use a fresh cache for each locale/route so prerendered controls include
  // their initial styles, rather than waiting for a client-side state change.
  const cache = createCache();
  const html = renderToString(<StyleProvider cache={cache}>{node}</StyleProvider>);
  const styles = cache.cache.size ? extractStyle(cache) : "";

  return { html, styles };
}
