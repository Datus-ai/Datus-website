// Shared early-paint theme policy for Vite MPA shells and generated blog HTML.
// No stored preference (or unavailable storage) always starts in light mode.
export const THEME_BOOTSTRAP = `(function(){var theme="light";try{if(localStorage.getItem("datus-home-theme")==="dark")theme="dark";}catch(e){}document.documentElement.dataset.theme=theme;})();`;

export function withSiteTheme(html) {
  if (!/<html\b/i.test(html)) return html;
  const themed = html.replace(/<html\b([^>]*)>/i, (_, attributes) =>
    `<html${attributes.replace(/\sdata-theme=(?:"[^"]*"|'[^']*')/gi, '')} data-theme="light">`);
  if (themed.includes('id="datus-theme-init"')) return themed;
  return themed.replace(/<head\b[^>]*>/i, head =>
    `${head}\n<meta name="color-scheme" content="light dark" />\n<script id="datus-theme-init">${THEME_BOOTSTRAP}</script>`);
}
