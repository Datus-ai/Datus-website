import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { latestDate, sitemapLastmod, sitemapIndex } from './lib/sitemap-dates.mjs';

assert.equal(latestDate(['2026-02-30', 'bad', '2026-10-27', '2026-06-11']), '2026-10-27');
assert.equal(latestDate([]), undefined);
const old = '<url><lastmod>2026-06-11</lastmod></url>';
const newer = '<url><lastmod>2026-10-27</lastmod></url>';
const fixture = sitemapIndex('https://datus.ai', [{path:'/pages.xml',xml:newer},{path:'/blog.xml',xml:old},{path:'/empty.xml',xml:''}]);
assert(fixture.includes('<loc>https://datus.ai/pages.xml</loc><lastmod>2026-10-27</lastmod>'));
assert(fixture.includes('<loc>https://datus.ai/blog.xml</loc><lastmod>2026-06-11</lastmod>'));
assert(fixture.includes('<loc>https://datus.ai/empty.xml</loc></sitemap>'));
const read = path => readFileSync(join('dist', path), 'utf8');
const attr = (tag, name) => tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];
const metas = html => Object.fromEntries([...html.matchAll(/<meta\b[^>]*>/g)].map(([tag])=>[attr(tag,'name')||attr(tag,'property'),attr(tag,'content')]));
const canonical = html => [...html.matchAll(/<link\b[^>]*>/g)].map(([tag])=>tag).find(tag=>attr(tag,'rel')==='canonical');
const sitemap = read('sitemap-pages.xml');
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);
const titles = new Set();
const converterHeadings = new Set();
const converterIntros = new Set();
for (const url of urls) {
 const path = url.replace('https://datus.ai/', '');
 const html = read(`${path}index.html`), meta = metas(html);
 const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
 assert(title && !titles.has(title), `Unique title: ${url}`); titles.add(title);
 assert(meta.description, `Description: ${url}`);
 assert.equal(attr(canonical(html)||'', 'href'), url, `Canonical: ${url}`);
 assert.equal((html.match(/<h1\b/g)||[]).length, 1, `SSR heading: ${url}`);
 if (/apache-ossie-converter\/[^/]+\/$/.test(path)) {
  const heading = html.match(/<h1[^>]*>(.*?)<\/h1>/s)?.[1];
  const intro = html.match(/class="container converter-prose"><h2>[^<]*<\/h2><p>(.*?)<\/p>/s)?.[1];
  assert(heading && !converterHeadings.has(heading), `Unique converter H1: ${url}`);
  assert(intro && !converterIntros.has(intro), `Unique converter body: ${url}`);
  converterHeadings.add(heading); converterIntros.add(intro);
 }

 if (!path.startsWith('policies/privacy/') && !path.startsWith('policies/terms/')) {
  for (const lang of ['en','zh-Hans','x-default']) assert(html.includes(`hreflang="${lang}"`),`hreflang ${url}`);
 }
 for (const key of ['og:image','twitter:image']) {
  assert(meta[key]?.startsWith('https://datus.ai/'), `Share image: ${url}`);
  assert(existsSync(join('dist',meta[key].replace('https://datus.ai/',''))), `Existing image: ${url}`);
 }
 for (const [,json] of html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) JSON.parse(json);
}
console.log(`PASS ${urls.length} marketing pages: unique titles, descriptions, SSR, canonicals, hreflang, images and JSON-LD parsing`);
for (const prefix of ['', 'zh/']) for (const path of ['', 'products/cli/', 'products/studio/', 'solutions/semantic-layer/']) {
 const html = read(`${prefix}${path}index.html`);
 const matches = [...html.matchAll(/<script id="datus-entity-graph" type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
 assert.equal(matches.length,1);
 const graph = JSON.parse(matches[0][1])['@graph'];
 const ids = new Set(graph.map(n=>n['@id']));assert.equal(ids.size,graph.length,'No duplicate entity IDs');
 const organization = graph.find(n=>n['@type']==='Organization');
 assert.equal(organization['@id'],'https://datus.ai/#organization');assert.equal(organization.url,'https://datus.ai/');
 const page = graph.find(n=>n['@type']==='WebPage');
 assert.equal(page.url,`https://datus.ai/${prefix}${path}`);
 assert.equal(page.inLanguage,prefix?'zh-CN':'en-US');
 assert.equal(page.name,html.match(/<title>(.*?)<\/title>/s)[1]);
 for (const ref of page.about) assert(ids.has(ref['@id']));
 const applications=graph.filter(n=>['SoftwareApplication','WebApplication'].includes(n['@type']));
 for(const app of applications) assert.equal(app.publisher['@id'],organization['@id']);
 const dosi=applications.find(n=>n.name==='DOSI');if(dosi) assert.equal(dosi.license,'Elastic License 2.0');
 const agent=applications.find(n=>n.name==='Datus Agent');if(agent) assert.equal(agent.license,'https://www.apache.org/licenses/LICENSE-2.0');
}
console.log('PASS entity identities, localized page names/URLs, publisher links and product licensing in 8 SSR pages');
const index=read('sitemap.xml');
for(const [,entry] of index.matchAll(/<sitemap>(.*?)<\/sitemap>/gs)){
 const loc=entry.match(/<loc>(.*?)<\/loc>/)[1];
 assert.equal(sitemapLastmod(entry),sitemapLastmod(read(loc.replace('https://datus.ai/',''))));
}
const blog=read('blog/sitemap.xml');
assert(!blog.includes('/zh/blog/'));assert(!read('blog/index.html').includes('hreflang="zh-Hans"'));
const llms=read('llms.txt');assert(llms.includes('The trusted enterprise data context for AI agents.'));
assert(llms.includes('Elastic License 2.0'));assert(llms.includes('https://datus.ai/solutions/semantic-layer/'));
for(const [,url] of llms.matchAll(/\]\((https:\/\/datus.ai\/[^)]*)\)/g)){
 const relative=url.replace('https://datus.ai/','');assert(existsSync(join('dist',relative))||existsSync(join('dist',relative,'index.html')),url);
}
assert(read('robots.txt').includes('Allow: /'));
console.log('PASS sitemap dates, English-only blog, llms links/positioning and crawler access');
