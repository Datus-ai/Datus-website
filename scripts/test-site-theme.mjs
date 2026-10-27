import assert from 'node:assert/strict';
import vm from 'node:vm';
import { THEME_BOOTSTRAP, withSiteTheme } from './lib/site-theme.mjs';

// Exercise the actual early-paint script, including storage-free browsers.
for (const [stored, expected] of [[null,'light'],['dark','dark'],['light','light'],['unknown','light']]) {
  const document={documentElement:{dataset:{}}};
  vm.runInNewContext(THEME_BOOTSTRAP,{document,localStorage:{getItem:key=>{assert.equal(key,'datus-home-theme');return stored}}});
  assert.equal(document.documentElement.dataset.theme,expected);
}
const document={documentElement:{dataset:{}}};
vm.runInNewContext(THEME_BOOTSTRAP,{document,localStorage:{getItem:()=>{throw new Error('Storage unavailable')}}});
assert.equal(document.documentElement.dataset.theme,'light');

const original='<!doctype html><html lang="zh-CN" data-theme="dark"><head><meta charset="UTF-8"><link rel="canonical" href="https://datus.ai/zh/"></head><body>正文</body></html>';
const themed=withSiteTheme(original);
assert.match(themed,/<html lang="zh-CN" data-theme="light">/);
assert.match(themed,/name="color-scheme" content="light dark"/);
assert.equal((themed.match(/id="datus-theme-init"/g)||[]).length,1);
assert.equal(withSiteTheme(themed),themed,'Theme injection is idempotent');
assert.ok(themed.includes('<link rel="canonical" href="https://datus.ai/zh/">'));
assert.ok(themed.includes('<body>正文</body>'));
assert.equal(withSiteTheme('<urlset/>'),'<urlset/>','Sitemaps are untouched');
console.log('Site theme checks passed: light default, saved preference, unavailable storage, and HTML shells.');
