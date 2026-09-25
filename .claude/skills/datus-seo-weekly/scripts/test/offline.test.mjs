// Offline tests: no Google credentials needed. `npm test`
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, readFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import { parseDualPeriodRows } from '../lib/ga4-client.mjs';
import { getReportPeriods, pctChange } from '../lib/periods.mjs';
import { parseCategories } from '../lib/blog-catalog.mjs';
import { mergeDualPeriod } from '../lib/gsc-client.mjs';

const here = dirname(fileURLToPath(import.meta.url));

test('GA4 two named date ranges fold into current/previous', () => {
  const response = {
    dimensionHeaders: [{ name: 'eventName' }, { name: 'dateRange' }],
    metricHeaders: [{ name: 'eventCount' }, { name: 'totalUsers' }],
    rows: [
      { dimensionValues: [{ value: 'github_click' }, { value: 'current' }], metricValues: [{ value: '12' }, { value: '9' }] },
      { dimensionValues: [{ value: 'github_click' }, { value: 'previous' }], metricValues: [{ value: '4' }, { value: '3' }] },
      { dimensionValues: [{ value: 'sign_up' }, { value: 'previous' }], metricValues: [{ value: '2' }, { value: '2' }] },
    ],
  };
  const rows = parseDualPeriodRows(response, ['eventName'], ['eventCount', 'totalUsers']);
  const gh = rows.find((r) => r.dimensions.eventName === 'github_click');
  assert.deepEqual(gh.metrics, { current: { eventCount: 12, totalUsers: 9 }, previous: { eventCount: 4, totalUsers: 3 } });
  const su = rows.find((r) => r.dimensions.eventName === 'sign_up');
  assert.deepEqual(su.metrics.current, { eventCount: 0, totalUsers: 0 });
  assert.equal(su.metrics.previous.eventCount, 2);
});

test('report week is Monday–Sunday and must end on a Sunday', () => {
  const p = getReportPeriods(undefined, new Date(2026, 8, 25)); // Fri 2026-09-25
  assert.deepEqual(p.current, { start: '2026-09-14', end: '2026-09-20' });
  assert.deepEqual(p.previous, { start: '2026-09-07', end: '2026-09-13' });
  assert.throws(() => getReportPeriods('2026-09-19'), /Sunday/);
  assert.equal(pctChange(5, 0), null);
});

test('CATEGORIES parsing matches the live build-blog.mjs (first category wins)', () => {
  const src = readFileSync(join(here, '../../../../../scripts/build-blog.mjs'), 'utf8');
  const map = parseCategories(src);
  assert.equal(map.get('what-is-schema-linking'), 'Glossary');
  assert.equal(map.get('what-is-semantic-layer'), 'Semantic Layer');
  assert.ok(map.size > 80);
});

test('GSC dual-period merge keeps pages that lost all impressions', () => {
  const merged = mergeDualPeriod([{ url: '/a', clicks: 1, impressions: 10 }], [{ url: '/b', clicks: 2, impressions: 30 }], 'url');
  const b = merged.find((r) => r.url === '/b');
  assert.equal(b.impressions, 0);
  assert.equal(b.impressionsPrev, 30);
});

test('sync + merge end to end on fake GSC/GA4 data', () => {
  const home = mkdtempSync(join(tmpdir(), 'datus-seo-'));
  const env = { ...process.env, DATUS_SEO_HOME: home, REPORT_WEEK_END: '2026-09-20' };
  execFileSync('node', ['sync-blog-catalog.mjs'], { cwd: join(here, '..'), env });
  const catalog = JSON.parse(readFileSync(join(home, 'data/blog-catalog.json'), 'utf8'));
  const newPost = catalog.posts.find((p) => p.date >= '2026-09-14' && p.date <= '2026-09-20');

  const m = (clicks, impressions, position, prev = {}) => ({ clicks, impressions, ctr: impressions ? clicks / impressions : 0, position, clicksPrev: prev.c || 0, impressionsPrev: prev.i || 0, ctrPrev: 0, positionPrev: 0 });
  const gsc = {
    source: 'gsc-api', dataState: 'final',
    overall: { clicks: 30, impressions: 3000, ctr: 0.01, position: 18 },
    overallPrev: { clicks: 20, impressions: 2500, ctr: 0.008, position: 20 },
    blogSummary: { clicks: 20, impressions: 2000, clicksPrev: 12, impressionsPrev: 1500, pageCount: 3 },
    dimensions: {
      pages: [
        { url: '/blog/what-is-schema-linking', ...m(10, 900, 9) },
        { url: '/blog/what-is-semantic-layer', ...m(0, 600, 14) },
        { url: '/osi-field-mapping', ...m(5, 200, 7) },
        { url: '/blog/old-gone', ...m(0, 0, 0, { i: 50 }) },
        ...(newPost ? [{ url: `/blog/${newPost.slug}`, ...m(1, 40, 25) }] : []),
      ],
      queries: [
        { query: 'datus', ...m(8, 40, 1.2) },
        { query: 'schema linking', ...m(6, 300, 11) },
        { query: 'semantic layer vs ontology', ...m(0, 90, 32) },
      ],
      countries: [{ country: 'usa', ...m(12, 900, 15) }],
      devices: [{ device: 'DESKTOP', ...m(25, 2500, 17) }],
    },
  };
  const row = (dims, cur, prev) => ({ dimensions: dims, metrics: { current: cur, previous: prev } });
  const ga4 = {
    source: 'ga4-api',
    reports: {
      byChannel: [row({ sessionDefaultChannelGroup: 'Organic Search' }, { sessions: 25, totalUsers: 20, engagedSessions: 15, screenPageViews: 40 }, { sessions: 18, totalUsers: 15, engagedSessions: 10, screenPageViews: 30 })],
      bySourceMedium: [row({ sessionSource: 'google', sessionMedium: 'organic' }, { sessions: 25 }, { sessions: 18 })],
      topLandingPages: [row({ landingPage: '/blog/what-is-schema-linking/' }, { sessions: 9, engagedSessions: 6 }, { sessions: 5, engagedSessions: 3 })],
      organicLandingPages: [row({ landingPage: '/blog/what-is-schema-linking/', sessionDefaultChannelGroup: 'Organic Search' }, { sessions: 8, engagedSessions: 5 }, { sessions: 4, engagedSessions: 2 })],
      events: [row({ eventName: 'github_click' }, { eventCount: 3, totalUsers: 3 }, { eventCount: 1, totalUsers: 1 })],
    },
  };
  mkdirSync(join(home, 'data'), { recursive: true });
  writeFileSync(join(home, 'data/gsc-weekly-2026-09-20.json'), JSON.stringify(gsc));
  writeFileSync(join(home, 'data/ga4-weekly-2026-09-20.json'), JSON.stringify(ga4));
  execFileSync('node', ['merge-seo-weekly.mjs'], { cwd: join(here, '..'), env });
  const b = JSON.parse(readFileSync(join(home, 'data/seo-report-bundle-2026-09-20.json'), 'utf8'));

  assert.equal(b.source, 'api-auto');
  assert.equal(b.gsc.branded.clicks, 8);
  assert.equal(b.gsc.opportunities.strikingDistanceQueries[0].query, 'schema linking');
  assert.equal(b.gsc.opportunities.unservedQueries[0].query, 'semantic layer vs ontology');
  assert.equal(b.gsc.opportunities.lowCtrPages[0].url, '/blog/what-is-semantic-layer');
  assert.equal(b.gsc.lostPages[0].url, '/blog/old-gone');
  const glossary = b.contentClusters.find((c) => c.id === 'blog:Glossary');
  assert.equal(glossary.clicks, 10);
  assert.ok(b.contentClusters.some((c) => c.id === 'osi-tools'));
  assert.ok(b.contentClusters.some((c) => c.id === 'blog:unknown'));
  assert.deepEqual(b.ga4.conversionEventsMissing, ['file_download', 'sign_up', 'login', 'generate_lead']);
  assert.equal(b.healthCheck.d5_gscPagesSeenInGa4, newPost ? 1 / 3 : 1 / 2); // pages with clicks > 0 that GA4 also saw
  if (newPost) assert.equal(b.blog.newThisWeek.find((p) => p.slug === newPost.slug).gsc.impressions, 40);
});
