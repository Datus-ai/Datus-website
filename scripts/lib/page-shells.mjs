import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { converterRedirectStub } from './converter-redirects.mjs';

const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[c]);
const tag = (name, attributes) => `<${name} ${Object.entries(attributes)
  .map(([key, value]) => value === null ? key : `${key}="${escapeHtml(value)}"`).join(' ')} />`;

export function renderPageShell(template, page, site) {
  const absolute = value => new URL(value, site).href;
  const ogTitle = page.ogTitle ?? page.title;
  const ogDescription = page.ogDescription ?? page.description;
  const image = absolute(page.image);
  const extras = [
    ...(page.imageAlt ? [tag('meta', { property: 'og:image:alt', content: page.imageAlt })] : []),
    ...(page.twitter === false ? [] : [
      tag('meta', { name: 'twitter:card', content: 'summary_large_image' }),
      tag('meta', { name: 'twitter:title', content: page.twitterTitle ?? ogTitle }),
      tag('meta', { name: 'twitter:description', content: page.twitterDescription ?? ogDescription }),
      tag('meta', { name: 'twitter:image', content: absolute(page.twitterImage ?? page.image) }),
    ]),
    ...(page.extraMeta ?? []).map(attrs => tag('meta', attrs)),
    ...(page.headLinks ?? []).map(attrs => tag('link', attrs)),
    ...(page.structuredData ?? []).map(data =>
      `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`),
    ...(page.consent === false ? [] : [
      '<link rel="stylesheet" href="/cookie-consent.css" />',
      '<script type="module" src="/src/cookie-consent/main.ts"></script>',
    ]),
  ];
  const values = {
    lang: page.lang ?? 'en-US',
    viewport: page.viewport ?? 'width=device-width, initial-scale=1.0',
    title: page.title, description: page.description,
    robots: page.robots ?? 'index, follow, max-image-preview:large',
    canonical: absolute(page.path), ogLocale: page.lang === 'zh-CN' ? 'zh_CN' : 'en_US',
    favicon: page.favicon ?? '/favicon.svg', ogType: page.ogType ?? 'website',
    ogTitle, ogDescription, image, entry: page.entry,
  };
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    if (key === 'headExtras') return extras.join('\n    ');
    if (key === 'author') return page.author === false ? '' : tag('meta', { name: 'author', content: 'Datus' });
    if (key === 'imageDimensions') return page.imageDimensions === false ? '' : [
      tag('meta', { property: 'og:image:width', content: '1200' }),
      tag('meta', { property: 'og:image:height', content: '630' }),
    ].join('\n    ');
    if (!(key in values)) throw new Error(`Unknown HTML template field: ${key}`);
    return escapeHtml(values[key]);
  });
}

/** Generate ignored Vite inputs before dev/build, including direct CLI usage. */
export function pageShells({ root, pages, redirects, site }) {
  const templateFile = resolve(root, 'scripts/templates/page.html');
  const paths = [...pages, ...redirects].map(page => page.path);
  if (new Set(paths).size !== paths.length) throw new Error('Duplicate HTML page path');
  for (const path of paths) {
    if (!/^\/(?:[a-z0-9-]+\/)*$/.test(path)) throw new Error(`Invalid HTML page path: ${path}`);
  }
  const files = paths.map(path => resolve(root, `.${path}index.html`));
  const generate = () => {
    const template = readFileSync(templateFile, 'utf8');
    const html = [
      ...pages.map(page => renderPageShell(template, page, site)),
      ...redirects.map(page => converterRedirectStub(new URL(page.target, site).href)),
    ];
    files.forEach((file, index) => {
      let previous;
      try { previous = readFileSync(file, 'utf8'); } catch (error) {
        if (error.code !== 'ENOENT') throw error;
      }
      if (previous === html[index]) return;
      mkdirSync(dirname(file), { recursive: true });
      writeFileSync(file, html[index]);
    });
  };
  generate();
  return {
    name: 'page-shells',
    configureServer(server) {
      server.watcher.add(templateFile);
      server.watcher.on('change', file => {
        if (file !== templateFile) return;
        generate();
        server.ws.send({ type: 'full-reload' });
      });
    },
  };
}
