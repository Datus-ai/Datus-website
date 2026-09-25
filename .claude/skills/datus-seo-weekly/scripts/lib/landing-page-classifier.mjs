/**
 * datus.ai landing-page classification. Paths are normalised WITHOUT a
 * trailing slash so GSC URLs, GA4 paths and catalog paths compare equal.
 */

const RULES = [
  { type: 'homepage', test: (p) => p === '/' },
  { type: 'zh', test: (p) => p === '/zh' || p.startsWith('/zh/') },
  { type: 'blog-index', test: (p) => p === '/blog' },
  { type: 'blog', test: (p) => p.startsWith('/blog/') },
  { type: 'glossary', test: (p) => p === '/glossary' || p.startsWith('/glossary/') },
  { type: 'product', test: (p) => p.startsWith('/products/') || ['/mcp', '/chatbot'].includes(p) },
  { type: 'pricing', test: (p) => p === '/pricing' },
  { type: 'integrations', test: (p) => ['/integrations', '/databases', '/models'].includes(p) || p.startsWith('/integrations/') },
  { type: 'faq', test: (p) => p === '/faq' },
  { type: 'osi-tool', test: (p) => p === '/osi-field-mapping' || p.startsWith('/tools/osi-playground') },
  { type: 'tools', test: (p) => p.startsWith('/tools/') },
  { type: 'event', test: (p) => p === '/datafun' || p === '/wechat' },
];

export function normalizePath(raw) {
  if (!raw || raw === '(not set)') return '';
  let p = raw.split('#')[0].split('?')[0].trim();
  if (!p.startsWith('/')) p = `/${p}`;
  return p.replace(/\/+$/, '') || '/';
}

export function stripDomain(url) {
  if (!url) return '';
  if (/^https?:\/\//.test(url)) {
    try {
      return normalizePath(new URL(url).pathname);
    } catch {
      /* fall through */
    }
  }
  return normalizePath(url);
}

export function classifyLandingPage(rawPath) {
  const path = normalizePath(rawPath);
  if (!path) return { path: '', pageType: 'other' };
  for (const rule of RULES) {
    if (rule.test(path)) return { path, pageType: rule.type };
  }
  return { path, pageType: 'other' };
}

export function blogSlugFromPath(path) {
  const m = normalizePath(path).match(/^\/blog\/([^/]+)$/);
  return m ? m[1] : null;
}
