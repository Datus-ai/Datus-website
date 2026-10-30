import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { preview } from 'vite';
import puppeteer from 'puppeteer';

const server = await preview({ preview: { host: '127.0.0.1', port: 0 } });
const base = `http://127.0.0.1:${server.httpServer.address().port}`;
const browser = await puppeteer.launch({ headless: true });
const route = '/tools/semantic-model-converter/';
const limits = { input_bytes: 1048576, input_files: 50 };
const entry = (id) => ({ id, label: id, available: true, options: [], limitations: [] });
const catalogs = {
  targets: { limits, targets: ['omni', 'dbt', 'snowflake'].map(entry) },
  sources: { limits, sources: [
    ...['cube', 'omni', 'dbt', 'microsoft'].map(entry),
    { ...entry('snowflake'), available: false },
  ] },
};
const errors = [];
let conversions = 0;
let checks = 0;

async function open(path, { failSources = false, holdSources = false, mobile = false } = {}) {
  const page = await browser.newPage();
  page.setDefaultTimeout(10000);
  await page.setViewport({ width: mobile ? 390 : 1440, height: 1000 });
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error' && /hydration|hydrating|Minified React error/.test(message.text())) {
      errors.push(message.text());
    }
  });
  let pendingSource;
  let failures = failSources ? 1 : 0;
  await page.setRequestInterception(true);
  const respond = (request, data) => request.respond({
    status: 200, contentType: 'application/json',
    headers: { 'access-control-allow-origin': '*' },
    body: JSON.stringify({ success: true, data }),
  });
  page.on('request', async (request) => {
    const url = request.url();
    const method = url.split('/').pop();
    if (url.includes('/api/public/semantic-converter/')) {
      if (method === 'import' || method === 'convert') conversions++;
      if (method === 'sources' && failures) {
        failures--;
        return request.respond({ status: 503, headers: { 'access-control-allow-origin': '*' }, body: '' });
      }
      if (method === 'sources' && holdSources) {
        pendingSource = request;
        return;
      }
      return respond(request, catalogs[method]);
    }
    if (url.startsWith(base) || url.startsWith('data:') || url.startsWith('blob:')) return request.continue();
    if (url.includes('api.github.com')) return request.respond({
      status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' },
      body: JSON.stringify({ stargazers_count: 1248 }),
    });
    return request.respond({ status: 200, contentType: 'application/javascript', body: '' });
  });
  await page.goto(`${base}${path}`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.sc-direction [aria-selected=true]');
  return {
    page,
    releaseSources: async () => {
      assert.ok(pendingSource, 'The source catalog request should be pending');
      holdSources = false;
      await respond(pendingSource, catalogs.sources);
    },
  };
}

async function selected(page, direction, platform) {
  await page.waitForFunction((side, id) => {
    const params = new URLSearchParams(location.search);
    return params.get('direction') === side && params.get('platform') === id
      && document.querySelector('.sc-configuration .ant-select-content-value')?.textContent === id;
  }, {}, direction, platform);
  assert.equal(await page.$eval('.sc-direction [role=tab]:first-child', (el) => el.getAttribute('aria-selected')), direction === 'import' ? 'true' : 'false');
  checks++;
}

async function choosePlatform(page, id) {
  await page.click('.sc-configuration input[role=combobox]');
  await page.keyboard.type(id);
  await page.waitForFunction((value) =>
    document.querySelector('.ant-select-dropdown:not(.ant-select-dropdown-hidden) .ant-select-item-option-active')?.getAttribute('title') === value,
  {}, id);
  await page.keyboard.press('Enter');
}

try {
  for (const locale of ['', '/zh']) {
    const html = readFileSync(`dist${locale}${route}index.html`, 'utf8');
    assert.ok(html.includes('class="semantic-converter"'), 'Workbench is prerendered');
    assert.ok(html.includes(`href="https://datus.ai${locale}${route}"`), 'Canonical omits query');
    for (const [query, direction, platform] of [
      ['direction=import&platform=dbt', 'import', 'dbt'],
      ['direction=import&example=microsoft', 'import', 'microsoft'],
      ['direction=export&platform=snowflake&example=nvidia', 'export', 'snowflake'],
      ['platform=dbt', 'export', 'dbt'],
      ['direction=import&platform=snowflake', 'import', 'cube'],
      ['direction=import&platform=dbt&example=cube', 'import', 'dbt'],
    ]) {
      const { page } = await open(`${locale}${route}?${query}`);
      await selected(page, direction, platform);
      if ((query.includes('platform=snowflake') && direction === 'import') || query.includes('example=cube')) {
        assert.ok(await page.$('.semantic-converter [role=status]'));
      }
      if (query.includes('example=nvidia')) assert.equal(new URL(page.url()).searchParams.get('example'), 'nvidia');
      await page.close();
    }
  }

  const { page } = await open(`${route}?direction=import&platform=cube&utm_source=partner&review=1#converter`);
  await selected(page, 'import', 'cube');
  const historyLength = await page.evaluate(() => {
    history.replaceState({ review: 'retained' }, '', location.href);
    return history.length;
  });
  await choosePlatform(page, 'dbt');
  await selected(page, 'import', 'dbt');
  assert.equal(await page.evaluate(() => history.length), historyLength);
  assert.deepEqual(await page.evaluate(() => history.state), { review: 'retained' });
  assert.equal(new URL(page.url()).searchParams.get('utm_source'), 'partner');
  assert.equal(new URL(page.url()).searchParams.get('review'), '1');
  assert.equal(new URL(page.url()).hash, '#converter');
  const links = await page.$$eval('a[data-lang-href]', (els) => els.map((el) => el.href));
  assert.ok(links.length >= 2, 'Desktop language links exist');
  assert.ok(links.every((href) => new URL(href).searchParams.get('platform') === 'dbt'));
  const chinese = links.find((href) => new URL(href).pathname.startsWith('/zh/'));
  await page.goto(chinese, { waitUntil: 'domcontentloaded' });
  await selected(page, 'import', 'dbt');
  await page.reload({ waitUntil: 'domcontentloaded' });
  await selected(page, 'import', 'dbt');
  await page.click('.sc-direction [role=tab]:last-child');
  await selected(page, 'export', 'omni');
  await page.click('.sc-direction [role=tab]:first-child');
  await selected(page, 'import', 'dbt');

  // Editing an input must remove the fixture claim without exposing its contents.
  await page.waitForSelector('.sc-source .monaco-editor textarea');
  await page.click('.sc-source .monaco-editor .view-lines');
  await page.keyboard.type('# private edit\n');
  await page.waitForFunction(() => !new URLSearchParams(location.search).has('example'));
  const beforeCancel = page.url();
  await choosePlatform(page, 'cube');
  await page.waitForSelector('.ant-modal-confirm');
  await page.click('.ant-modal-confirm .ant-btn-default');
  await page.waitForFunction(() => !document.querySelector('.ant-modal-confirm'));
  assert.equal(page.url(), beforeCancel);
  await selected(page, 'import', 'dbt');
  await page.close();

  const retry = await open(`${route}?direction=import&platform=microsoft`, { failSources: true });
  await retry.page.waitForSelector('.sc-catalog-error button');
  assert.equal(new URL(retry.page.url()).searchParams.get('platform'), 'microsoft');
  await retry.page.click('.sc-catalog-error button');
  await selected(retry.page, 'import', 'microsoft');
  await retry.page.close();

  // Late catalog responses must not replace a user-selected example.
  const delayed = await open(`${route}?direction=import&platform=microsoft`, { holdSources: true });
  await delayed.page.waitForSelector('.sc-source-actions .ant-select');
  await delayed.page.click('.sc-source-actions .ant-select');
  await delayed.page.waitForSelector('.ant-select-dropdown:not(.ant-select-dropdown-hidden) .ant-select-item-option[title*="dbt"]', { visible: true });
  await delayed.page.locator('.ant-select-dropdown:not(.ant-select-dropdown-hidden) .ant-select-item-option[title*="dbt"]').click();
  await delayed.releaseSources();
  await selected(delayed.page, 'import', 'dbt');
  await delayed.page.close();

  const mobile = await open(`/zh${route}?direction=export&platform=snowflake&example=retail`, { mobile: true });
  await selected(mobile.page, 'export', 'snowflake');
  await choosePlatform(mobile.page, 'dbt');
  await selected(mobile.page, 'export', 'dbt');
  await mobile.page.click('.site-nav__burger');
  await mobile.page.waitForSelector('.nav-lang-dd--mobile a[data-lang-href]');
  assert.ok((await mobile.page.$$eval('.nav-lang-dd--mobile a[data-lang-href]', (els) => els.map((el) => el.href)))
    .every((href) => new URL(href).searchParams.get('platform') === 'dbt'));
  await mobile.page.close();

  assert.equal(conversions, 0, 'Links and selection changes never auto-submit models');
  assert.deepEqual(errors, [], 'No uncaught errors or hydration mismatches');
  console.log(`PASS: ${checks} converter link browser scenarios`);
} catch (error) {
  const pages = await browser.pages();
  const last = pages.at(-1);
  console.error('Converter link scenario failed at:', last?.url());
  throw error;
} finally {
  await browser.close();
  await new Promise((resolve) => server.httpServer.close(resolve));
}
