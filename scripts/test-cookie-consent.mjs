import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { preview } from 'vite';
import puppeteer from 'puppeteer';

// Isolated production preview: port 0 lets the OS allocate a free port.
const server = await preview({ preview: { host: '127.0.0.1', port: 0 } });
const address = server.httpServer.address();
const base = `http://127.0.0.1:${address.port}`;
const browser = await puppeteer.launch({ headless: true });
try {
  for (const path of ['/', '/zh/security/', '/policies/cookies/', '/zh/policies/cookies/', '/blog/']) {
    const context = await browser.createBrowserContext();
    const page = await context.newPage();
    const requests = [];
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.setRequestInterception(true);
    page.on('request', request => {
      if (/googletagmanager|google-analytics/.test(request.url())) {
        requests.push(request.url());
        return request.respond({ status: 200, contentType: 'application/javascript', body: 'document.cookie="datus_website_ga=test; Path=/"; window.__cookieTestGALoaded=true;' });
      }
      if (request.url().startsWith(base)) return request.continue();
      return request.respond({ status: 200, headers: { 'access-control-allow-origin': '*' }, contentType: 'application/json', body: '{}' });
    });
    await page.setViewport({ width: 1440, height: 1000 });
    await page.goto(base + path, { waitUntil: 'networkidle0' });
    assert.equal(requests.length, 0, `${path}: analytics before consent`);
    assert.ok(Math.abs(await page.$eval('.cookie-ui__banner', element => element.getBoundingClientRect().width) - 480) < 1);
    await page.click('.cookie-ui__banner [data-reject]');
    await page.reload({ waitUntil: 'networkidle0' });
    assert.equal(requests.length, 0);
    await page.click('[data-cookie-settings]');
    assert.equal(await page.$eval('#cookie-analytics', element => element.checked), false);
    await page.click('#cookie-analytics');
    await page.keyboard.press('Escape');
    await page.click('[data-cookie-settings]');
    assert.equal(await page.$eval('#cookie-analytics', element => element.checked), false, 'Cancel must discard the draft');
    await page.click('#cookie-analytics');
    await page.click('[data-save]');
    await page.waitForFunction(() => window.__cookieTestGALoaded === true);
    assert.equal(requests.length, 1);
    await page.evaluate(() => { localStorage.setItem('theme', 'dark'); document.cookie = 'datus_lang=zh-CN; Path=/'; });
    await page.click('[data-cookie-settings]');
    await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle0' }), page.click('dialog [data-reject]')]);
    assert.equal(await page.$('#datus-consented-analytics'), null);
    assert.equal(requests.length, 1, 'Withdrawal must not reload analytics');
    assert.equal(await page.evaluate(() => localStorage.getItem('theme')), 'dark');
    assert.ok(!(await page.cookies()).some(cookie => cookie.name === 'datus_website_ga'));
    assert.ok((await page.cookies()).some(cookie => cookie.name === 'datus_lang'));
    await page.evaluate(() => {
      localStorage.setItem('datus_website_cookie_consent', JSON.stringify({ necessary: true, analytics: true, version: '2026-10-15', savedAt: Date.now() - 181 * 86400000 }));
    });
    await page.reload({ waitUntil: 'networkidle0' });
    assert.equal(requests.length, 1, 'Expired choices must not load analytics');
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewport({ width, height: 844 });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width, `${path}: horizontal overflow at ${width}`);
    }
    await page.click('.cookie-ui__banner [data-open]');
    assert.equal(await page.$$eval('dialog section', elements => elements.length), 2);
    const center = await page.$eval('dialog', element => {
      const rect = element.getBoundingClientRect();
      return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2, targetX: innerWidth / 2, targetY: innerHeight / 2 };
    });
    assert.ok(Math.abs(center.x - center.targetX) < 1 && Math.abs(center.y - center.targetY) < 1, 'Settings dialog must be centered');
    await page.keyboard.press('Escape');
    await page.evaluate(() => { Storage.prototype.setItem = function () { throw new DOMException('blocked'); }; });
    await page.click('.cookie-ui__banner [data-reject]');
    assert.equal(await page.$eval('.cookie-ui__status', element => element.hidden), false);
    assert.equal(requests.length, 1);
    assert.deepEqual(errors, []);
    console.log(`${path}: consent, cancellation, withdrawal, expiry, storage failure, and responsive layout passed`);
    await context.close();
  }
  for (const path of ['/policies/cookies/', '/zh/policies/cookies/']) {
    const html = readFileSync(`dist${path}index.html`, 'utf8');
    assert.ok(html.includes(path.startsWith('/zh') ? '必要用途' : 'Necessary Uses'));
    assert.ok(html.includes(`href="https://datus.ai${path}"`));
    assert.ok(html.includes('hreflang="zh-Hans"'));
    assert.ok(!html.includes('googletagmanager.com'));
  }
  console.log('Policy prerendering and locale metadata passed');
} finally {
  await browser.close();
  await new Promise(resolve => server.httpServer.close(resolve));
}
