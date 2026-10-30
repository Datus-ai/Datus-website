import assert from 'node:assert/strict';
import { mkdirSync } from 'node:fs';
import { preview } from 'vite';
import puppeteer from 'puppeteer';

const server = await preview({ preview: { host: '127.0.0.1', port: 0 } });
const base = `http://127.0.0.1:${server.httpServer.address().port}`;
const browser = await puppeteer.launch({ headless: true });
const shots = '/tmp/datus-converter-themes';
mkdirSync(shots, { recursive: true });
const errors = [];
const entry = (id) => ({ id, label: id, available: true, options: [], limitations: [] });
const limits = { input_bytes: 1048576, input_files: 50 };
const catalogs = {
  targets: { limits, targets: [entry('dbt'), entry('omni')] },
  sources: { limits, sources: [entry('cube'), entry('dbt')] },
};

async function open(locale, direction, { saved = null, mobile = false, storageBlocked = false, javascript = true, holdHydration = false, resultStatus = 'success' } = {}) {
  const page = await browser.newPage();
  page.setDefaultTimeout(15000);
  await page.setViewport({ width: mobile ? 390 : 1600, height: 1100 });
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error' && /hydration|hydrating|Minified React error/.test(message.text())) errors.push(message.text());
  });
  await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'dark' }, { name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.evaluateOnNewDocument((choice, blocked) => {
    localStorage.clear();
    if (choice) localStorage.setItem('datus-home-theme', choice);
    localStorage.setItem('datus_website_cookie_consent', JSON.stringify({ necessary: true, analytics: false, version: '2026-10-15', savedAt: Date.now() }));
    if (blocked) Object.defineProperty(window, 'localStorage', { get() { throw new Error('Storage blocked'); } });
  }, saved, storageBlocked);
  await page.setRequestInterception(true);
  page.on('request', (request) => {
    const url = request.url();
    if (holdHydration && url.startsWith(base) && request.resourceType() === 'script') {
      return request.respond({ status: 200, contentType: 'application/javascript', body: '' });
    }
    if (url.startsWith(base) || url.startsWith('data:') || url.startsWith('blob:')) return request.continue();
    if (request.method() === 'OPTIONS') return request.respond({
      status: 204, headers: { 'access-control-allow-origin': '*', 'access-control-allow-methods': 'GET, POST, OPTIONS', 'access-control-allow-headers': 'Content-Type' },
    });
    let data;
    if (url.includes('/api/public/semantic-converter/')) {
      const method = url.split('/').pop();
      data = catalogs[method];
      if (request.method() === 'POST') {
        const body = JSON.parse(request.postData());
        data = {
          target: method === 'import' ? 'ossie' : body.target,
          status: resultStatus,
          issues: resultStatus === 'success' ? [] : [{ code: 'review', message: 'Review this definition.', severity: resultStatus === 'blocked' ? 'error' : 'warning' }],
          artifacts: [
            { path: 'models/orders.yaml', content: '# Generated example\nname: orders\n', format: 'yaml' },
            { path: 'queries/orders.sql', content: 'SELECT COUNT(*) FROM orders;\n', format: 'yaml' },
          ],
        };
      }
    } else if (url.includes('api.github.com')) data = { stargazers_count: 1248 };
    return request.respond({
      status: 200, contentType: data ? 'application/json' : 'application/javascript',
      headers: { 'access-control-allow-origin': '*' },
      body: data ? JSON.stringify({ ...(url.includes('api.github.com') ? data : { success: true, data }) }) : '',
    });
  });
  await page.setJavaScriptEnabled(javascript);
  const platform = direction === 'import' ? 'cube' : 'dbt';
  await page.goto(`${base}${locale}/apache-ossie-converter/?direction=${direction}&platform=${platform}&example=${direction === 'import' ? 'cube' : 'nvidia'}`, { waitUntil: 'networkidle0' });
  if (javascript && !holdHydration) await page.waitForSelector('.sc-source .monaco-editor .view-lines');
  return page;
}

async function colors(page, dark) {
  await page.waitForFunction((expected) => {
    const palette = getComputedStyle(document.documentElement);
    const probe = document.createElement('div');
    probe.style.background = palette.getPropertyValue('--panel-solid');
    document.body.append(probe);
    const surface = getComputedStyle(probe).backgroundColor;
    probe.remove();
    const editor = document.querySelector('.sc-source .monaco-editor');
    return document.documentElement.dataset.theme === (expected ? 'dark' : 'light')
      && editor && getComputedStyle(editor).backgroundColor === surface
      && getComputedStyle(document.querySelector('.sc-configuration .ant-select')).backgroundColor === surface;
  }, {}, dark);
  const data = await page.evaluate(() => {
    const root = getComputedStyle(document.documentElement);
    const bg = (selector) => getComputedStyle(document.querySelector(selector)).backgroundColor;
    return {
      surface: bg('.semantic-converter'), editor: bg('.sc-source .monaco-editor'),
      input: bg('.sc-configuration .ant-select'), scheme: getComputedStyle(document.querySelector('.semantic-converter')).colorScheme,
      text: getComputedStyle(document.querySelector('.semantic-converter')).color,
      expected: root.getPropertyValue('--panel-solid').trim(),
      oldNavy: [...document.querySelectorAll('.semantic-converter *')].some((el) => ['rgb(11, 18, 48)', 'rgb(14, 22, 56)'].includes(getComputedStyle(el).backgroundColor)),
    };
  });
  const luminance = (rgb) => rgb.match(/[\d.]+/g).slice(0, 3)
    .map(Number).map((value) => value / 255)
    .map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4)
    .reduce((sum, value, i) => sum + value * [0.2126, 0.7152, 0.0722][i], 0);
  const text = luminance(data.text);
  const background = luminance(data.surface);
  assert.ok((Math.max(text, background) + 0.05) / (Math.min(text, background) + 0.05) >= 4.5, 'Readable text contrast');
  assert.equal(data.scheme, dark ? 'dark' : 'light');
  assert.equal(data.surface, data.editor);
  assert.equal(data.input, data.editor);
  assert.equal(data.oldNavy, false, 'No legacy navy surfaces');
  return data.surface;
}

async function expectSurface(page, selector, surface) {
  await page.waitForSelector(selector, { visible: true });
  await page.waitForFunction((selector, surface) => getComputedStyle(document.querySelector(selector)).backgroundColor === surface, {}, selector, surface);
}

try {
  for (const locale of ['', '/zh']) {
    for (const direction of ['import', 'export']) {
      for (const initialDark of [false, true]) {
        const page = await open(locale, direction, { saved: initialDark ? 'dark' : null });
        let surface = await colors(page, initialDark);
        await page.click('.sc-configuration input[role=combobox]');
        await expectSurface(page, '.ant-select-dropdown', surface);
        await page.keyboard.press('Escape');
        await page.click('.sc-configuration .sc-primary');
        await page.waitForSelector('.sc-output-editor .monaco-editor .view-lines');
        await page.locator('.sc-output-editor .view-line').click();
        await page.keyboard.press('Home');
        await page.keyboard.type('# output-buffer-preserved\n');
        await page.waitForFunction(() => document.querySelector('.sc-output-editor .view-lines').textContent.includes('output-buffer-preserved'));
        await page.locator('.sc-source .view-line').click();
        await page.keyboard.press('Home');
        await page.keyboard.type('# theme-buffer-preserved\n');
        await page.waitForFunction(() => document.querySelector('.sc-source .view-lines').textContent.includes('theme-buffer-preserved'));
        await page.evaluate(() => {
          window.testSourceNode = document.querySelector('.sc-source .monaco-editor');
          window.testOutputNode = document.querySelector('.sc-output-editor .monaco-editor');
        });
        await page.click('.nordic-theme-toggle');
        surface = await colors(page, !initialDark);
        await page.waitForFunction(() =>
          document.querySelector('.sc-output-editor .monaco-editor') === window.testOutputNode
          && getComputedStyle(window.testOutputNode).backgroundColor === getComputedStyle(window.testSourceNode).backgroundColor);
        assert.equal(await page.evaluate(() => document.querySelector('.sc-source .monaco-editor') === window.testSourceNode), true);
        assert.ok(await page.$eval('.sc-source .view-lines', (el) => el.textContent.includes('theme-buffer-preserved')));
        assert.ok(await page.$eval('.sc-output-editor .view-lines', (el) => el.textContent.includes('output-buffer-preserved')));
        await page.$eval('.sc-result-toolbar .sc-info', (el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
        await page.click('.sc-result-toolbar .sc-info');
        await expectSurface(page, '.ant-popover-container', surface);
        await page.click('.sc-heading');
        // Modal.useModal's context holder must receive the current theme as well.
        await page.click('.sc-result-toolbar .sc-danger');
        await expectSurface(page, '.ant-modal-container', surface);
        await page.focus('.ant-modal-confirm .ant-btn-default');
        await page.keyboard.press('Enter');
        await page.waitForSelector('.ant-modal-confirm', { hidden: true });
        await page.click('.nordic-theme-toggle');
        await colors(page, initialDark);
        if (locale === '' && direction === 'export') {
          await page.$eval('.semantic-converter', (el) => window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - 108, behavior: 'instant' }));
          await (await page.$('.semantic-converter')).screenshot({ path: `${shots}/export-${initialDark ? 'dark' : 'light'}.png` });
        }
        await page.close();
      }
    }
  }
  const mobile = await open('/zh', 'import', { mobile: true });
  await colors(mobile, false);
  await mobile.click('.sc-source-actions button:last-of-type');
  await expectSurface(mobile, '.ant-modal-container', 'rgb(255, 254, 249)');
  await mobile.click('.ant-modal-close');
  await mobile.waitForSelector('.ant-modal', { hidden: true });
  await mobile.click('.nordic-theme-toggle');
  await colors(mobile, true);
  await (await mobile.$('.semantic-converter')).screenshot({ path: `${shots}/mobile-dark.png` });
  assert.equal(await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, 'Mobile layout fits');
  await mobile.close();

  for (const status of ['partial', 'blocked']) {
    const page = await open('', 'export', { resultStatus: status });
    await page.click('.sc-configuration .sc-primary');
    await page.waitForSelector('.sc-diagnostics .sc-tips');
    for (const dark of [false, true]) {
      if (dark) await page.click('.nordic-theme-toggle');
      await colors(page, dark);
      const matches = await page.evaluate((status) => {
        const expected = document.createElement('span');
        expected.style.color = `var(--sc-${status === 'blocked' ? 'danger' : 'warning'})`;
        document.body.append(expected);
        const matches = getComputedStyle(expected).color === getComputedStyle(document.querySelector('.sc-diagnostics .sc-tips > svg')).color;
        expected.remove();
        return matches;
      }, status);
      assert.ok(matches, 'Diagnostics use readable theme status colors');
    }
    await page.close();
  }

  const blocked = await open('', 'export', { storageBlocked: true });
  await colors(blocked, false);
  await blocked.click('.nordic-theme-toggle');
  await colors(blocked, true);
  await blocked.close();

  const beforeHydration = await open('', 'export', { saved: 'dark', holdHydration: true });
  assert.equal(await beforeHydration.$eval('html', (el) => el.dataset.theme), 'dark');
  assert.equal(await beforeHydration.$eval('.sc-source-actions .ant-select', (el) => getComputedStyle(el).backgroundColor), 'rgb(35, 40, 34)', 'SSR selects honor saved dark before hydration');
  assert.equal(await beforeHydration.$eval('.sc-editor textarea', (el) => getComputedStyle(el).backgroundColor), 'rgb(35, 40, 34)');
  await beforeHydration.close();

  const nojs = await open('', 'export', { javascript: false });
  assert.equal(await nojs.$eval('.sc-editor textarea', (el) => getComputedStyle(el).backgroundColor), 'rgb(255, 254, 249)');
  await nojs.close();
  assert.deepEqual(errors, [], 'No uncaught errors or hydration mismatch');
  console.log(`PASS: converter themes in both locales/directions, live toggles, preserved buffers/results, dropdowns, popovers, modals, mobile, blocked storage, and no-JS fallback. Screenshots: ${shots}`);
} catch (error) {
  const last = (await browser.pages()).at(-1);
  console.error('Failed at', last?.url());
  await last?.screenshot({ path: `${shots}/failure.png` });
  throw error;
} finally {
  await browser.close();
  server.httpServer.closeAllConnections();
  await new Promise((resolve) => server.httpServer.close(resolve));
}
