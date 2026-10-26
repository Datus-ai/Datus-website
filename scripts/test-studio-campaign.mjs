import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { preview } from 'vite';
import puppeteer from 'puppeteer';

const KEY = 'datus_website_campaign';
const MAX_AGE = 30 * 60 * 1000;
const server = await preview({ preview: { host: '127.0.0.1', port: 0 } });
const base = `http://127.0.0.1:${server.httpServer.address().port}`;
const browser = await puppeteer.launch({ headless: true });
const errors = [];
const choice = analytics => ({ necessary: true, analytics, version: '2026-10-15', savedAt: Date.now() });

async function newScenario(analytics, blockedStorage = false) {
  const context = await browser.createBrowserContext();
  const page = await context.newPage();
  await page.setViewport({ width: 1440, height: 1000 });
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => {
    if (message.type() === 'error' && /hydrat|did not match|server html|Minified React error #(418|423|425)/i.test(message.text())) errors.push(message.text());
  });
  // Mock external resources: the real product and GA receive no test traffic.
  await page.setRequestInterception(true);
  page.on('request', request => {
    if (request.url().startsWith(base) || /^(data:|blob:)/.test(request.url())) return request.continue();
    if (request.url().includes('api.github.com')) return request.respond({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: '{"stargazers_count":1248}' });
    return request.respond({ status: 200, contentType: 'application/javascript', body: '' });
  });
  await page.evaluateOnNewDocument((initial, blocked) => {
    // Seed once; do not overwrite actual consent changes on subsequent pages.
    if (initial && !localStorage.getItem('datus_website_cookie_consent')) localStorage.setItem('datus_website_cookie_consent', JSON.stringify(initial));
    if (blocked) Object.defineProperty(window, 'sessionStorage', { get() { throw new DOMException('Blocked storage', 'SecurityError'); } });
  }, analytics === undefined ? null : choice(analytics), blockedStorage);
  return { context, page };
}

async function go(page, path, referrer) {
  // The real site is HTTPS. Permit the synthetic HTTPS referrer on the HTTP
  // localhost preview so downgrade stripping does not invalidate this test.
  await page.goto(base + path, { waitUntil: 'networkidle0', ...(referrer ? { referer: referrer, referrerPolicy: 'unsafe-url' } : {}) });
  await page.waitForSelector('.site-nav a[href*="utm_content="]');
  if (referrer) assert.equal(new URL(await page.evaluate(() => document.referrer)).hostname, new URL(referrer).hostname);
}
async function campaign(page, selector, expected) {
  await page.waitForFunction((sel, fields) => {
    const link = document.querySelector(sel);
    if (!link) return false;
    const url = new URL(link.href);
    return Object.entries(fields).every(([key, value]) => url.searchParams.get(key) === value);
  }, {}, selector, expected);
  const href = await page.$eval(selector, link => link.href);
  const url = new URL(href);
  assert.equal(url.hostname, 'studio.datus.ai');
  assert.deepEqual(Object.fromEntries(url.searchParams), expected);
  return href;
}
const hero = '.nordic-actions a[href^="https://studio.datus.ai"]';
const nav = '.site-nav a[href^="https://studio.datus.ai"]';
const incoming = '?utm_source=linkedin&utm_medium=social&utm_campaign=product_launch&utm_content=external_creative&code=private&token=private&utm_term=discard#private';
const linkedin = { utm_source: 'linkedin', utm_medium: 'social', utm_campaign: 'product_launch' };

try {
  {
    const { context, page } = await newScenario();
    await go(page, '/' + incoming);
    await campaign(page, hero, { utm_content: 'home_hero', ...linkedin });
    assert.equal(await page.evaluate(key => sessionStorage.getItem(key), KEY), null, 'No campaign storage before consent');
    await page.click('.cookie-ui__banner [data-accept]');
    await page.waitForFunction(key => !!sessionStorage.getItem(key), {}, KEY);
    const captured = await page.evaluate(key => JSON.parse(sessionStorage.getItem(key)), KEY);
    assert.deepEqual(captured.fields, linkedin);
    assert.deepEqual(Object.keys(captured).sort(), ['capturedAt', 'fields']);

    // Verify the href exposed to native context menus; no external navigation.
    const beforeMenu = await page.$eval(hero, link => link.href);
    await page.$eval(hero, link => link.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true })));
    assert.equal(await page.$eval(hero, link => link.href), beforeMenu);

    await go(page, '/solutions/semantic-layer/');
    await campaign(page, '.solution-actions a[href^="https://studio.datus.ai"]', { utm_content: 'semantic_layer_hero', ...linkedin });
    assert.equal(await page.evaluate(key => JSON.parse(sessionStorage.getItem(key)).capturedAt, KEY), captured.capturedAt, 'Browsing does not extend expiry');
    await go(page, '/zh/solutions/semantic-layer/');
    await campaign(page, nav, { utm_content: 'zh_solutions_semantic_layer_header', ...linkedin });
    await page.setViewport({ width: 390, height: 844 });
    await page.click('.site-nav__burger');
    await campaign(page, '.site-nav__mobile a[href^="https://studio.datus.ai"]', { utm_content: 'zh_solutions_semantic_layer_mobile_menu', ...linkedin });

    // A partial new campaign replaces all old fields instead of stitching them.
    await go(page, '/?utm_source=youtube');
    await campaign(page, hero, { utm_content: 'home_hero', utm_source: 'youtube' });
    await go(page, '/pricing/');
    await campaign(page, nav, { utm_content: 'pricing_header', utm_source: 'youtube' });
    await page.setViewport({ width: 1440, height: 1000 });
    await page.click('[data-cookie-settings]');
    await page.click('dialog [data-reject]');
    await campaign(page, nav, { utm_content: 'pricing_header' });
    assert.equal(await page.evaluate(key => sessionStorage.getItem(key), KEY), null);
    await context.close();
    console.log('URL allowlist, consent, multi-page and locale handoff, dynamic mobile menu, whole-campaign replacement, and withdrawal passed');
  }

  for (const analytics of [undefined, false]) {
    const { context, page } = await newScenario(analytics);
    await go(page, '/' + incoming);
    await campaign(page, hero, { utm_content: 'home_hero', ...linkedin });
    assert.equal(await page.evaluate(key => sessionStorage.getItem(key), KEY), null);
    await go(page, '/pricing/');
    await campaign(page, nav, { utm_content: 'pricing_header' });
    await context.close();
  }
  console.log('Unknown and refused consent forward only current-URL fields without persistence');

  {
    const { context, page } = await newScenario(true, true);
    await go(page, '/' + incoming);
    await campaign(page, hero, { utm_content: 'home_hero', ...linkedin });
    await go(page, '/pricing/');
    await campaign(page, nav, { utm_content: 'pricing_header' });
    await context.close();
    console.log('Unavailable sessionStorage preserves current-URL handoff without breaking navigation');
  }

  {
    const { context, page } = await newScenario(true);
    await go(page, '/' + incoming);
    await campaign(page, hero, { utm_content: 'home_hero', ...linkedin });
    await page.evaluate(() => {
      const originalNow = Date.now;
      Date.now = () => originalNow() + 31 * 60 * 1000;
      window.dispatchEvent(new Event('focus'));
    });
    await campaign(page, hero, { utm_content: 'home_hero' });
    assert.equal(await page.evaluate(key => sessionStorage.getItem(key), KEY), null);
    // Also reject stale cache on a new document, without waiting 30 minutes.
    await page.evaluate(({ key, age }) => sessionStorage.setItem(key, JSON.stringify({ fields: { utm_source: 'stale' }, capturedAt: new Date().getTime() - age - 1 })), { key: KEY, age: MAX_AGE });
    await go(page, '/pricing/');
    await campaign(page, nav, { utm_content: 'pricing_header' });
    assert.equal(await page.evaluate(key => sessionStorage.getItem(key), KEY), null);
    await context.close();
    console.log('Live expiry and stale-cache rejection passed');
  }

  {
    const { context, page } = await newScenario(true);
    await go(page, '/' + incoming);
    await go(page, '/?utm_source=' + 'x'.repeat(101) + '&utm_medium=email&utm_campaign=%20%20');
    await campaign(page, hero, { utm_content: 'home_hero', utm_medium: 'email' });
    await go(page, '/?utm_source=&utm_campaign=%0A');
    await campaign(page, hero, { utm_content: 'home_hero' });
    await page.evaluate(() => {
      for (const href of ['https://studio.datus.ai/feedback', 'https://studio.datus.ai.evil.example/?utm_content=external', '/pricing/']) {
        const link = document.createElement('a'); link.href = href; link.dataset.scopeTest = href; document.querySelector('main').append(link);
      }
    });
    const links = await page.$$eval('a[data-scope-test]', as => as.map(a => [a.dataset.scopeTest, a.getAttribute('href')]));
    for (const [before, after] of links) assert.equal(after, before);
    await context.close();
    console.log('Blank, overlong, and control-character values rejected; support and unrelated destinations left unchanged');
  }

  for (const path of ['/', '/zh/', '/solutions/semantic-layer/', '/zh/solutions/semantic-layer/']) {
    const html = readFileSync(`dist${path}index.html`, 'utf8');
    assert.ok(html.includes('utm_content='), 'Base tag remains available without JavaScript');
    assert.ok(!html.includes('utm_source=linkedin'), 'Visitor campaign must not leak into static HTML');
  }
  {
    const { context, page } = await newScenario(true);
    await go(page, '/' + incoming);
    // A fresh search visit replaces cached LinkedIn fields, including campaign.
    await go(page, '/', 'https://www.google.com/search?q=private-search-terms');
    const google = { utm_source: 'google', utm_medium: 'organic' };
    await campaign(page, hero, { utm_content: 'home_hero', ...google });
    assert.deepEqual(await page.evaluate(key => JSON.parse(sessionStorage.getItem(key)).fields, KEY), google);
    await go(page, '/solutions/semantic-layer/', base + '/');
    await campaign(page, '.solution-actions a[href^="https://studio.datus.ai"]', { utm_content: 'semantic_layer_hero', ...google });
    await go(page, '/zh/pricing/', base + '/solutions/semantic-layer/');
    await campaign(page, nav, { utm_content: 'zh_pricing_header', ...google });
    // Explicit UTM values win even when the referrer is a search engine.
    await go(page, '/' + incoming, 'https://www.google.com/');
    await campaign(page, hero, { utm_content: 'home_hero', ...linkedin });
    await go(page, '/?utm_campaign=explicit_only', 'https://www.google.com/');
    await campaign(page, hero, { utm_content: 'home_hero', utm_campaign: 'explicit_only' });
    // Known paid identifiers do not get mislabeled organic or reuse old data.
    for (const key of ['gclid', 'dclid', 'gbraid', 'wbraid', 'msclkid', 'yclid', 'NaPm']) {
      await go(page, '/?' + key + '=not-forwarded', 'https://www.google.com/');
      await campaign(page, hero, { utm_content: 'home_hero' });
      assert.equal(await page.evaluate(key => sessionStorage.getItem(key), KEY), null);
    }
    await context.close();
    console.log('Organic search replaces old campaigns, persists across pages/locales, respects explicit UTM, and excludes paid-click arrivals');
  }
  {
    const { context, page } = await newScenario(false);
    const engines = [
      ['https://www.google.co.uk/', 'google'], ['https://www.google.com.hk/', 'google'],
      ['https://www.google.co.jp/', 'google'], ['https://cn.bing.com/', 'bing'],
      ['https://duckduckgo.com/', 'duckduckgo'], ['https://search.yahoo.com/', 'yahoo'],
      ['https://m.baidu.com/', 'baidu'], ['https://www.sogou.com/', 'sogou'],
      ['https://www.so.com/', '360'], ['https://yandex.ru/', 'yandex'],
      ['https://search.naver.com/', 'naver'], ['https://search.brave.com/', 'brave'],
      ['https://www.ecosia.org/', 'ecosia'], ['https://www.startpage.com/', 'startpage'],
      ['https://www.qwant.com/', 'qwant'],
    ];
    for (const [referrer, source] of engines) {
      await go(page, '/', referrer);
      await campaign(page, hero, { utm_content: 'home_hero', utm_source: source, utm_medium: 'organic' });
      assert.equal(await page.evaluate(key => sessionStorage.getItem(key), KEY), null, 'Referrer-based forwarding does not require storage');
    }
    for (const referrer of [undefined, 'https://mail.google.com/', 'https://docs.google.com/', 'https://www.yahoo.com/', 'https://www.google.com.evil.example/', 'https://www.notgoogle.com/', 'https://constructor/', 'https://news.example/']) {
      await go(page, '/', referrer);
      await campaign(page, hero, { utm_content: 'home_hero' });
    }
    await context.close();
    console.log('Regional Google and 12 other search engines recognized; direct, product, unknown, and lookalike referrers are not guessed');
  }
  assert.deepEqual(errors, []);
  console.log('Prerendering and hydration passed');
} finally {
  await browser.close();
  await new Promise(resolve => server.httpServer.close(resolve));
}
