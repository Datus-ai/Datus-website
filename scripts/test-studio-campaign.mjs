import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { studioUrl } from '../src/lib/studio-url.mjs';
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
  if (selector.startsWith('.site-nav')) assert.equal(url.pathname, '/', 'Navigation enters Studio at its root');
  assert.deepEqual(Object.fromEntries(url.searchParams), expected);
  if (expected.utm_source) assert.equal([...url.searchParams.keys()][0], 'utm_source', 'Source is always the first query parameter');
  return href;
}
const hero = '.nordic-actions a[href^="https://studio.datus.ai"]';
const nav = '.site-nav a[href^="https://studio.datus.ai"]';
const incoming = '?utm_source=linkedin&utm_medium=social&utm_campaign=product_launch&utm_content=external_creative&code=private&token=private&utm_term=discard#private';
const linkedin = { utm_source: 'linkedin', utm_medium: 'social', utm_campaign: 'product_launch' };

try {
  assert.equal(studioUrl('https://studio.datus.ai/login?next=%2Fproject&utm_source=old&utm_medium=old&utm_campaign=old&utm_content=home_hero#section', { utm_source: 'youtube' }),
    'https://studio.datus.ai/login?utm_source=youtube&next=%2Fproject&utm_content=home_hero#section');
  // Check every generated marketing and blog anchor, including raw HTML in posts.
  let studioLinks = 0;
  for (const file of readdirSync('dist', { recursive: true }).filter(file => file.endsWith('.html'))) {
    const html = readFileSync(`dist/${file}`, 'utf8');
    for (const match of html.matchAll(/<a\b[^>]*\bhref=["'](https:\/\/studio\.datus\.ai(?:[/?#][^"']*)?)["']/gi)) {
      const url = new URL(match[1].replace(/&amp;/g, '&'));
      assert.equal(url.searchParams.get('utm_source'), 'datus.ai', file);
      assert.equal([...url.searchParams.keys()][0], 'utm_source', file);
      studioLinks++;
    }
  }
  assert.ok(studioLinks > 100, 'Checks marketing, support, blog navigation, CTAs and article links');
  console.log(`Source-first fallback verified in ${studioLinks} prerendered Studio links`);
  {
    const { context, page } = await newScenario(true);
    for (const path of ['/support/', '/zh/support/', '/blog/', '/blog/one-person-data-team/']) {
      await go(page, path + '?utm_source=youtube');
      const links = await page.$$eval('a[href^="https://studio.datus.ai"]', links => links.map(link => link.href));
      assert.ok(links.length >= (path === '/blog/' ? 1 : 2), path);
      for (const href of links) {
        const url = new URL(href);
        assert.equal(url.searchParams.get('utm_source'), 'youtube', `${path}: ${href}`);
        assert.equal([...url.searchParams.keys()][0], 'utm_source');
        assert.equal(url.searchParams.has('utm_medium'), false);
        assert.equal(url.searchParams.has('utm_campaign'), false);
      }
    }
    // Dynamically inserted links without a CTA tag use the same shared handoff.
    await page.evaluate(() => {
      const link = document.createElement('a');
      link.href = 'https://studio.datus.ai/feedback?next=%2Fproject#details';
      link.id = 'dynamic-studio';
      document.body.append(link);
    });
    await campaign(page, '#dynamic-studio', { utm_source: 'youtube', next: '/project' });
    await go(page, '/blog/', 'https://www.google.com/');
    await campaign(page, nav, { utm_source: 'google', utm_medium: 'organic', utm_content: 'blog_header' });
    await context.close();
    console.log('All support and blog links preserve external sources; untagged dynamic links and Google search use the shared handoff');
  }
  {
    const { context, page } = await newScenario(true);
    await go(page, '/');
    await campaign(page, hero, { utm_content: 'home_hero', utm_source: 'datus.ai' });
    assert.equal(await page.evaluate(key => sessionStorage.getItem(key), KEY), null, 'Fallback is not stored as campaign evidence');
    await go(page, '/zh/pricing/');
    await campaign(page, nav, { utm_content: 'zh_pricing_header', utm_source: 'datus.ai' });
    await page.setViewport({ width: 390, height: 844 });
    await page.click('.site-nav__burger');
    await campaign(page, '.site-nav__mobile a[href^="https://studio.datus.ai"]', { utm_content: 'zh_pricing_mobile_menu', utm_source: 'datus.ai' });
    await go(page, '/?utm_source=youtube');
    await campaign(page, hero, { utm_content: 'home_hero', utm_source: 'youtube' });
    await go(page, '/?utm_campaign=external_only');
    await campaign(page, hero, { utm_content: 'home_hero', utm_campaign: 'external_only' });
    await context.close();
    console.log('Website fallback covers direct, localized and mobile links without storage or mixing partial campaigns');
  }
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
    await campaign(page, nav, { utm_content: 'pricing_header', utm_source: 'datus.ai' });
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
    await campaign(page, nav, { utm_content: 'pricing_header', utm_source: 'datus.ai' });
    await context.close();
  }
  console.log('Unknown and refused consent forward only current-URL fields without persistence');

  {
    const { context, page } = await newScenario(true, true);
    await go(page, '/' + incoming);
    await campaign(page, hero, { utm_content: 'home_hero', ...linkedin });
    await go(page, '/pricing/');
    await campaign(page, nav, { utm_content: 'pricing_header', utm_source: 'datus.ai' });
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
    await campaign(page, hero, { utm_content: 'home_hero', utm_source: 'datus.ai' });
    assert.equal(await page.evaluate(key => sessionStorage.getItem(key), KEY), null);
    // Also reject stale cache on a new document, without waiting 30 minutes.
    await page.evaluate(({ key, age }) => sessionStorage.setItem(key, JSON.stringify({ fields: { utm_source: 'stale' }, capturedAt: new Date().getTime() - age - 1 })), { key: KEY, age: MAX_AGE });
    await go(page, '/pricing/');
    await campaign(page, nav, { utm_content: 'pricing_header', utm_source: 'datus.ai' });
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
    await campaign(page, hero, { utm_content: 'home_hero', utm_source: 'datus.ai' });
    await page.evaluate(() => {
      for (const href of ['https://studio.datus.ai.evil.example/?utm_content=external', 'https://studio.datus.ai:444/feedback', 'http://studio.datus.ai/feedback', '/pricing/']) {
        const link = document.createElement('a'); link.href = href; link.dataset.scopeTest = href; document.querySelector('main').append(link);
      }
    });
    const links = await page.$$eval('a[data-scope-test]', as => as.map(a => [a.dataset.scopeTest, a.getAttribute('href')]));
    for (const [before, after] of links) assert.equal(after, before);
    await context.close();
    console.log('Blank, overlong, and control-character values rejected; unrelated destinations left unchanged');
  }

  for (const path of ['/', '/zh/', '/solutions/semantic-layer/', '/zh/solutions/semantic-layer/']) {
    const html = readFileSync(`dist${path}index.html`, 'utf8');
    assert.ok(html.includes('utm_source=datus.ai'), 'Website fallback is available without JavaScript');
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
    await campaign(page, hero, { utm_content: 'home_hero', utm_campaign: 'explicit_only', utm_source: 'www.google.com' });
    // Paid arrivals retain their referrer domain without claiming organic traffic.
    for (const key of ['gclid', 'dclid', 'gbraid', 'wbraid', 'msclkid', 'yclid', 'NaPm']) {
      await go(page, '/?' + key + '=not-forwarded', 'https://www.google.com/');
      await campaign(page, hero, { utm_content: 'home_hero', utm_source: 'www.google.com' });
      assert.deepEqual(await page.evaluate(key => JSON.parse(sessionStorage.getItem(key)).fields, KEY), { utm_source: 'www.google.com' });
    }
    await context.close();
    console.log('Organic search replaces old campaigns, persists across pages/locales, respects explicit UTM, and records paid-click referrer domains without an organic medium');
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
      await campaign(page, hero, referrer
        ? { utm_content: 'home_hero', utm_source: new URL(referrer).hostname, utm_medium: 'referral' }
        : { utm_content: 'home_hero', utm_source: 'datus.ai' });
    }
    await context.close();
    console.log('Regional Google and 12 other search engines recognized; direct visits use the fallback; other hosts retain their own referral domain');
  }
  {
    const { context, page } = await newScenario(true);
    await go(page, '/' + incoming);
    const claude = { utm_source: 'claude.ai', utm_medium: 'referral' };
    await go(page, '/', 'https://claude.ai/chat/private?prompt=secret');
    await campaign(page, hero, { utm_content: 'home_hero', ...claude });
    assert.deepEqual(await page.evaluate(key => JSON.parse(sessionStorage.getItem(key)).fields, KEY), claude);
    await go(page, '/zh/pricing/', base + '/');
    await campaign(page, nav, { utm_content: 'zh_pricing_header', ...claude });
    await go(page, '/blog/', base + '/zh/pricing/');
    await campaign(page, nav, { utm_content: 'blog_header', ...claude });
    await go(page, '/?utm_source=chatgpt.com', 'https://claude.ai/');
    await campaign(page, hero, { utm_source: 'chatgpt.com', utm_content: 'home_hero' });
    await go(page, '/?utm_campaign=partial', 'https://claude.ai/');
    await campaign(page, hero, { utm_campaign: 'partial', utm_content: 'home_hero', utm_source: 'claude.ai' });
    await go(page, '/?gclid=advertisement', 'https://chatgpt.com/');
    await campaign(page, hero, { utm_source: 'chatgpt.com', utm_content: 'home_hero' });
    await context.close();
  }
  {
    const { context, page } = await newScenario(false);
    for (const [referrer, source] of [
      ['https://chatgpt.com/c/private?prompt=secret', 'chatgpt.com'],
      ['https://www.chatgpt.com/', 'chatgpt.com'],
      ['https://chat.openai.com/', 'chatgpt.com'],
      ['https://claude.ai/chat/private', 'claude.ai'],
      ['https://www.claude.ai/', 'claude.ai'],
      ['https://perplexity.ai/search/private', 'perplexity.ai'],
      ['https://www.perplexity.ai/', 'perplexity.ai'],
      ['https://gemini.google.com/app/private', 'gemini.google.com'],
      ['https://copilot.microsoft.com/', 'copilot.microsoft.com'],
      ['https://copilot.com/', 'copilot.microsoft.com'],
      ['https://copilot.cloud.microsoft/', 'copilot.microsoft.com'],
      ['https://m365.cloud.microsoft/', 'copilot.microsoft.com'],
      ['https://chat.deepseek.com/a/chat/private', 'chat.deepseek.com'],
    ]) {
      await go(page, '/', referrer);
      await campaign(page, hero, { utm_source: source, utm_medium: 'referral', utm_content: 'home_hero' });
      assert.equal(await page.evaluate(key => sessionStorage.getItem(key), KEY), null);
    }
    for (const referrer of ['https://openai.com/', 'https://platform.openai.com/', 'https://anthropic.com/', 'https://claude.com/', 'https://console.anthropic.com/', 'https://chatgpt.com.evil.example/', 'https://claude.ai.evil.example/', 'https://notclaude.ai/', 'https://support.claude.ai/', 'https://ai.google.com/', 'https://microsoft.com/', 'https://deepseek.com/']) {
      await go(page, '/', referrer);
      await campaign(page, hero, { utm_source: new URL(referrer).hostname, utm_medium: 'referral', utm_content: 'home_hero' });
    }
    await context.close();
    console.log('AI referrals preserved across pages, locales and blog; explicit UTM wins; vendor sites and lookalikes retain their own domains');
  }
  {
    const { context, page } = await newScenario(true);
    await go(page, '/' + incoming);
    await go(page, '/', 'https://www.linkedin.com/feed/?token=private#post');
    const capturedReferral = await page.evaluate(key => JSON.parse(sessionStorage.getItem(key)), KEY);
    assert.deepEqual(capturedReferral.fields, { utm_source: 'www.linkedin.com', utm_medium: 'referral' }, 'Referrer compensation is saved at capture time, before a Studio click');
    await go(page, '/?utm_campaign=launch&utm_medium=social', 'https://www.linkedin.com/feed/?token=private#post');
    const referral = { utm_source: 'www.linkedin.com', utm_medium: 'social', utm_campaign: 'launch' };
    await campaign(page, hero, { ...referral, utm_content: 'home_hero' });
    const saved = await page.evaluate(key => JSON.parse(sessionStorage.getItem(key)), KEY);
    assert.deepEqual(saved.fields, referral);
    assert.ok(!JSON.stringify(saved).includes('private'));
    for (const [path, content] of [['/zh/pricing/', 'zh_pricing_header'], ['/support/', 'support_header'], ['/blog/', 'blog_header']]) {
      await go(page, path, base + '/');
      await campaign(page, nav, { ...referral, utm_content: content });
      assert.equal(await page.evaluate(key => JSON.parse(sessionStorage.getItem(key)).capturedAt, KEY), saved.capturedAt);
    }
    await context.close();
  }
  for (const [analytics, blocked] of [[undefined, false], [false, false], [true, true]]) {
    const { context, page } = await newScenario(analytics, blocked);
    for (const [path, content] of [['/', 'home_header'], ['/zh/support/', 'zh_support_header'], ['/blog/', 'blog_header']]) {
      await go(page, path, 'https://news.example/article?secret=private');
      await campaign(page, nav, { utm_source: 'news.example', utm_medium: 'referral', utm_content: content });
    }
    if (!blocked) assert.equal(await page.evaluate(key => sessionStorage.getItem(key), KEY), null);
    await context.close();
  }
  {
    const { context, page } = await newScenario(true);
    for (const referrer of ['https://datus.ai/pricing/', 'https://www.datus.ai/blog/']) {
      await go(page, '/', referrer);
      await campaign(page, hero, { utm_source: 'datus.ai', utm_content: 'home_hero' });
      assert.equal(await page.evaluate(key => sessionStorage.getItem(key), KEY), null);
    }
    await go(page, '/?utm_source=%20%20&utm_campaign=launch', 'https://github.com/Datus-ai');
    await campaign(page, hero, { utm_source: 'github.com', utm_campaign: 'launch', utm_content: 'home_hero' });
    await context.close();
  }
  console.log('Generic referrals fill missing sources, preserve current campaign fields, survive consented internal navigation, and work without storage');
  assert.deepEqual(errors, []);
  console.log('Prerendering and hydration passed');
} finally {
  await browser.close();
  await new Promise(resolve => server.httpServer.close(resolve));
}
