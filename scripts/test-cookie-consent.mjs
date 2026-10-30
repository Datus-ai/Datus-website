import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { preview } from 'vite';
import puppeteer from 'puppeteer';

// Exercise the real loader and consent commands with a minimal consent-aware
// SDK double. All external requests are intercepted; no real data reaches GA.
const mockGA = `(() => {
  let storage = 'denied';
  const id = 'G-EPVCH78EZP';
  function command(args) {
    if (window['ga-disable-' + id]) return;
    if (args[0] === 'consent') {
      if (args[2].analytics_storage) storage = args[2].analytics_storage;
      if (storage === 'granted') document.cookie = 'datus_website_ga=test; Path=/';
    }
    if (args[0] === 'config' || args[0] === 'event') {
      fetch('https://www.google-analytics.com/g/collect?storage=' + storage).catch(() => {});
    }
  }
  window.dataLayer.forEach(command);
  window.gtag = function () { window.dataLayer.push(arguments); command(arguments); };
  window.__cookieTestGALoaded = true;
})();`;
const server = await preview({ preview: { host: '127.0.0.1', port: 0 } });
const address = server.httpServer.address();
const base = `http://127.0.0.1:${address.port}`;
const browser = await puppeteer.launch({ headless: true });
try {
  for (const path of ['/', '/zh/security/', '/policies/cookies/', '/zh/policies/cookies/', '/blog/']) {
    const context = await browser.createBrowserContext();
    const page = await context.newPage();
    const scripts = [];
    const measurements = [];
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.setRequestInterception(true);
    page.on('request', request => {
      if (request.url().includes('googletagmanager.com/gtag/js')) {
        scripts.push(request.url());
        return request.respond({ status: 200, contentType: 'application/javascript', body: mockGA });
      }
      if (request.url().includes('google-analytics.com')) {
        measurements.push(request.url());
        return request.respond({ status: 204, headers: { 'access-control-allow-origin': '*' } });
      }
      if (request.url().startsWith(base)) return request.continue();
      return request.respond({ status: 200, headers: { 'access-control-allow-origin': '*' }, contentType: 'application/json', body: '{}' });
    });
    const hasAnalyticsCookie = async () => (await page.cookies()).some(cookie => cookie.name === 'datus_website_ga');
    await page.setViewport({ width: 1440, height: 1000 });
    await page.goto(base + path + '?code=secret#private', { waitUntil: 'networkidle0' });
    assert.equal(scripts.length, 1, `${path}: unknown choice loads limited GA`);
    assert.ok(measurements.some(url => url.includes('storage=denied')));
    assert.equal(await hasAnalyticsCookie(), false);
    const commands = await page.evaluate(() => window.dataLayer.map(item => Array.from(item)));
    assert.equal(commands[0][0], 'consent');
    assert.equal(commands[0][2].analytics_storage, 'denied');
    assert.equal(commands[0][2].ad_storage, 'denied');
    assert.equal(commands.find(item => item[0] === 'config')[2].page_location, base + path);
    assert.ok(Math.abs(await page.$eval('.cookie-ui__banner', element => element.getBoundingClientRect().width) - 480) < 1);
    await page.click('.cookie-ui__banner [data-open]');
    assert.equal(await page.$$eval('.cookie-ui__dialog section', elements => elements.length), 2);
    assert.ok(!(await page.$eval('.cookie-ui', element => element.textContent)).includes('Tracking'), 'Website consent UI must not imply first-party Tracking');
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewport({ width, height: 844 });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width);
      const center = await page.$eval('.cookie-ui__dialog', element => {
        const rect = element.getBoundingClientRect();
        return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2, targetX: innerWidth / 2, targetY: innerHeight / 2 };
      });
      assert.ok(Math.abs(center.x - center.targetX) < 1 && Math.abs(center.y - center.targetY) < 1, 'Settings modal must be centered');
    }
    await page.click('#cookie-analytics');
    await page.keyboard.press('Escape');
    assert.equal(await page.evaluate(() => localStorage.getItem('datus_website_cookie_consent')), null);
    await page.click('.cookie-ui__banner [data-open]');
    assert.equal(await page.$eval('#cookie-analytics', element => element.checked), false, 'Cancel discards draft');
    await page.keyboard.press('Escape');
    await page.click('.cookie-ui__banner [data-accept]');
    assert.equal(scripts.length, 1, 'Accept updates consent without reloading GA');
    assert.equal(await hasAnalyticsCookie(), true);
    assert.equal(await page.evaluate(() => window.dataLayer.filter(item => item[0] === 'config').length), 1);
    await page.evaluate(() => window.gtag('event', 'consented_page'));
    await page.waitForFunction(() => performance.getEntriesByType('resource').some(item => item.name.includes('storage=granted')));
    await page.evaluate(() => {
      localStorage.setItem('theme', 'dark');
      sessionStorage.setItem('datus_website_campaign', JSON.stringify({ fields: { utm_source: 'newsletter' }, capturedAt: Date.now() }));
      document.cookie = 'datus_lang=zh-CN; Path=/';
      window.__unsavedMarker = 'current-page';
      const input = document.createElement('textarea');
      input.id = 'unsaved-draft'; input.value = 'unsaved form input';
      document.body.append(input);
    });
    await page.click('[data-cookie-settings]');
    await page.click('.cookie-ui__dialog [data-reject]');
    assert.equal(await page.evaluate(() => window.__unsavedMarker), 'current-page', 'Refusal must not reload');
    assert.equal(await page.$eval('#unsaved-draft', element => element.value), 'unsaved form input');
    assert.equal(await page.evaluate(() => window['ga-disable-G-EPVCH78EZP']), true);
    const stoppedAt = measurements.length;
    assert.equal(scripts.length, 1, 'Withdrawal must not reload the SDK');
    assert.ok(await page.$('#datus-consented-analytics'), 'The disabled SDK stays loaded without discarding the page');
    assert.equal(await hasAnalyticsCookie(), false);
    assert.equal(await page.evaluate(() => localStorage.getItem('theme')), 'dark');
    assert.equal(await page.evaluate(() => sessionStorage.getItem('datus_website_campaign')), null, 'Withdrawal clears campaign storage on every route, including the blog');
    assert.ok((await page.cookies()).some(cookie => cookie.name === 'datus_lang'));
    await page.reload({ waitUntil: 'networkidle0' });
    assert.equal(measurements.length, stoppedAt, 'Stored refusal blocks even cookieless measurements');
    assert.equal(await page.$('#datus-consented-analytics'), null, 'A subsequent visit with saved refusal does not load the SDK');
    await page.click('[data-cookie-settings]');
    await page.click('#cookie-analytics');
    await page.click('[data-save]');
    await page.waitForFunction(() => window.__cookieTestGALoaded === true);
    assert.equal(scripts.length, 2);
    assert.equal(await hasAnalyticsCookie(), true);
    await page.evaluate(() => localStorage.setItem('datus_website_cookie_consent', JSON.stringify({ necessary: true, analytics: true, version: '2026-10-15', savedAt: Date.now() - 181 * 86400000 })));
    await page.reload({ waitUntil: 'networkidle0' });
    assert.equal(scripts.length, 3, 'Expiry returns to limited mode');
    assert.equal(await hasAnalyticsCookie(), false);
    await page.evaluate(() => { Storage.prototype.setItem = function () { throw new DOMException('blocked'); }; });
    await page.click('.cookie-ui__banner [data-reject]');
    assert.equal(await page.$eval('.cookie-ui__status', element => element.hidden), false);
    const blockedAt = measurements.length;
    await page.evaluate(() => window.gtag('event', 'must_not_send'));
    assert.equal(await page.evaluate(() => window['ga-disable-G-EPVCH78EZP']), true);
    assert.equal(measurements.length, blockedAt);
    await page.click('[data-cookie-settings]');
    await page.click('#cookie-analytics');
    await page.click('[data-save]');
    assert.equal(scripts.length, 3, 'Visit-only reacceptance reuses the SDK');
    assert.equal(await hasAnalyticsCookie(), true);
    assert.deepEqual(errors, []);
    console.log(`${path}: limited, accepted, rejected, reaccepted, expired, blocked storage, and centered mobile layouts passed`);
    await context.close();
  }
  // A refusal in another tab must preserve the existing document and drafts.
  {
    const context = await browser.createBrowserContext();
    const tabs = [await context.newPage(), await context.newPage()];
    const navigations = [0, 0];
    let measurements = 0;
    for (const [index, page] of tabs.entries()) {
      page.on('framenavigated', frame => { if (frame === page.mainFrame()) navigations[index]++; });
      await page.setRequestInterception(true);
      page.on('request', request => {
        if (request.url().includes('googletagmanager.com/gtag/js')) return request.respond({ status: 200, contentType: 'application/javascript', body: mockGA });
        if (request.url().includes('google-analytics.com')) { measurements++; return request.respond({ status: 204, headers: { 'access-control-allow-origin': '*' } }); }
        if (request.url().startsWith(base)) return request.continue();
        return request.respond({ status: 200, headers: { 'access-control-allow-origin': '*' }, contentType: 'application/json', body: '{}' });
      });
      await page.goto(base + '/', { waitUntil: 'networkidle0' });
      await page.evaluate(index => {
        window.__unsavedMarker = index;
        const input = document.createElement('textarea'); input.id = 'unsaved-draft'; input.value = 'draft-' + index; document.body.append(input);
      }, index);
    }
    await tabs[0].bringToFront(); await tabs[0].click('[data-accept]');
    await tabs[1].bringToFront();
    await tabs[1].waitForFunction(() => window.dataLayer.some(item => item[0] === 'consent' && item[1] === 'update' && item[2].analytics_storage === 'granted'), { polling: 100 });
    await tabs[0].bringToFront(); await tabs[0].click('[data-cookie-settings]'); await tabs[0].click('.cookie-ui__dialog [data-reject]');
    await tabs[1].bringToFront(); await tabs[1].waitForFunction(() => window['ga-disable-G-EPVCH78EZP'] === true, { polling: 100 });
    const stopped = measurements;
    for (const [index, page] of tabs.entries()) {
      assert.equal(await page.evaluate(() => window.__unsavedMarker), index);
      assert.equal(await page.$eval('#unsaved-draft', input => input.value), 'draft-' + index);
      await page.evaluate(() => window.gtag('event', 'must_not_send'));
    }
    assert.deepEqual(navigations, [1, 1], 'Neither local nor cross-tab refusal may navigate');
    assert.equal(measurements, stopped);
    await context.close();
    console.log('Local and cross-tab refusal preserve unsaved state without navigation');
  }
  for (const path of ['/policies/cookies/', '/zh/policies/cookies/']) {
    const html = readFileSync(`dist${path}index.html`, 'utf8');
    assert.ok(html.includes(path.startsWith('/zh') ? '有限测量' : 'limited page'));
    assert.ok(html.includes(path.startsWith('/zh') ? 'Datus Studio 功能使用事件' : 'Datus Studio Product Events'));
    assert.ok(html.includes(path.startsWith('/zh') ? 'datus.ai 官网不运行这套自建埋点' : 'This collection does not run on datus.ai'));
    assert.ok(html.includes(`href="https://datus.ai${path}"`));
    assert.ok(html.includes('hreflang="zh-Hans"'));
    assert.ok(!html.includes('googletagmanager.com'));
  }
  console.log('Three-state policy prerendering and locale metadata passed');
} finally {
  await browser.close();
  server.httpServer.closeAllConnections();
  await new Promise(resolve => server.httpServer.close(resolve));
}
