import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createServer } from 'vite';
import { runInNewContext } from 'node:vm';
import { pageShells, renderPageShell } from './lib/page-shells.mjs';

const vite = await createServer({
  server: { middlewareMode: true }, appType: 'custom', logLevel: 'error',
  optimizeDeps: { noDiscovery: true, entries: [] },
});
const temporary = mkdtempSync(join(tmpdir(), 'datus-page-shells-'));
try {
  const { PAGE_ENTRIES: pages, PAGE_REDIRECTS: redirects } = await vite.ssrLoadModule('/src/seo/pages.ts');
  const { MIRRORED_PATHS, ENGLISH_ONLY_PATHS, SITE } = await vite.ssrLoadModule('/src/i18n/build.ts');
  const { CONVERTER_FLOWS, CONVERTER_PATH } = await vite.ssrLoadModule('/src/modules/semantic-converter/routes.ts');
  const { flowCopy } = await vite.ssrLoadModule('/src/pages/tools/semantic-model-converter/flows.ts');
  assert.deepEqual(pages.map(p => p.path).sort(), [...MIRRORED_PATHS, ...ENGLISH_ONLY_PATHS, '/datafun/', '/wechat/'].sort());
  const template = readFileSync('scripts/templates/page.html', 'utf8');
  for (const page of pages) {
    assert(readFileSync(`.${page.entry}`, 'utf8'), `Entry exists: ${page.path}`);
    const shell = renderPageShell(template, page, SITE);
    assert.equal(readFileSync(`.${page.path}index.html`, 'utf8'), shell);
    assert.equal((shell.match(/<title>/g) ?? []).length, 1);
    assert(shell.includes(`href="${SITE}${page.path}"`), page.path);
    for (const [, data] of shell.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)) JSON.parse(data);
  }
  for (const flow of CONVERTER_FLOWS) {
    const page = pages.find(page => page.path === `${CONVERTER_PATH}${flow.slug}/`);
    assert.equal(page.title, `${flowCopy.en[flow.slug].title} — Datus`);
    assert.equal(page.description, flowCopy.en[flow.slug].description);
  }
  const shell = path => readFileSync(`.${path}index.html`, 'utf8');
  const wechat = shell('/wechat/');
  assert(wechat.includes('viewport-fit=cover') && wechat.includes('telephone=no'));
  assert(wechat.includes('noindex, follow') && wechat.includes('lang="zh-CN"'));
  assert(!wechat.includes('cookie-consent') && !wechat.includes('twitter:card'));
  assert(shell('/datafun/').includes('fonts.googleapis.com'));
  assert(shell('/osi-field-mapping/').includes('property="og:type" content="article"'));
  assert(shell('/solutions/semantic-layer/').includes('href="/brand-mark.svg"'));
  assert(shell('/glossary/').includes('DefinedTermSet'));
  const unsafe = renderPageShell(template, {
    path: '/sample/', entry: '/src/main.tsx', title: '<Title> & "quoted"',
    description: 'Description & "quoted"', image: '/og/home-1200x630.png',
    structuredData: [{ text: '</script><script>bad()</script>' }],
  }, SITE);
  assert(unsafe.includes('&lt;Title&gt; &amp; &quot;quoted&quot;'));
  assert(!unsafe.includes('</script><script>bad()'));
  const json = unsafe.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1];
  assert.equal(JSON.parse(json).text, '</script><script>bad()</script>');
  assert.throws(() => renderPageShell('{{typo}}', pages[0], SITE), /Unknown HTML template field/);

  mkdirSync(join(temporary, 'scripts/templates'), { recursive: true });
  writeFileSync(join(temporary, 'scripts/templates/page.html'), template);
  const options = { root: temporary, pages, redirects, site: SITE };
  const plugin = pageShells(options);
  const redirectScript = readFileSync(join(temporary, 'tools/semantic-model-converter/index.html'), 'utf8')
    .match(/<script>(.*?)<\/script>/s)[1];
  for (const prefix of ['', '/zh']) {
    let destination;
    runInNewContext(redirectScript, { location: {
      pathname: `${prefix}/tools/semantic-model-converter/`, search: '?platform=cube', hash: '#converter',
      replace: value => { destination = value; },
    } });
    assert.equal(destination, `${prefix}/apache-ossie-converter/?platform=cube#converter`);
  }
  const file = join(temporary, 'index.html');
  const timestamp = statSync(file).mtimeMs;
  pageShells(options);
  assert.equal(statSync(file).mtimeMs, timestamp, 'Unchanged generation does not rewrite inputs');
  let templateChange;
  let reload;
  plugin.configureServer({
    watcher: { add: () => {}, on: (_event, callback) => { templateChange = callback; } },
    ws: { send: message => { reload = message.type; } },
  });
  const temporaryTemplate = join(temporary, 'scripts/templates/page.html');
  writeFileSync(temporaryTemplate, template.replace('</head>', '<!-- shared template edit -->\n</head>'));
  templateChange(temporaryTemplate);
  assert(readFileSync(file, 'utf8').includes('<!-- shared template edit -->'));
  assert.equal(reload, 'full-reload');
  assert.throws(() => pageShells({ ...options, pages: [...pages, pages[0]] }), /Duplicate HTML page path/);
  assert.throws(() => pageShells({ ...options, pages: [{ ...pages[0], path: '/../outside/' }] }), /Invalid HTML page path/);
  console.log(`PASS ${pages.length} generated page entries: route coverage, copy, special settings, escaping and idempotent generation`);
} finally {
  rmSync(temporary, { recursive: true, force: true });
  await vite.close();
}
