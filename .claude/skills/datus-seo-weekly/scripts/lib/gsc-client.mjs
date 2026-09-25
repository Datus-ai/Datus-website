/**
 * Search Console Search Analytics client.
 *
 * Totals come from a query with no dimensions — summing page rows over-counts
 * impressions (one search can show several of our pages) and loses position.
 */

import { google } from 'googleapis';
import './paths.mjs';
import { getReportPeriods } from './periods.mjs';
import { stripDomain } from './landing-page-classifier.mjs';

export function getGscConfig() {
  const siteUrl = process.env.GSC_SITE_URL || 'https://datus.ai/';
  const clientEmail = process.env.GSC_CLIENT_EMAIL;
  const privateKey = process.env.GSC_PRIVATE_KEY;
  if (!clientEmail || !privateKey) {
    throw new Error('Missing GSC credentials: set GSC_CLIENT_EMAIL and GSC_PRIVATE_KEY in ~/.datus-seo-weekly/.env');
  }
  return { siteUrl, clientEmail, privateKey: privateKey.replace(/\\n/g, '\n'), dataState: process.env.GSC_DATA_STATE || 'final' };
}

function createClient({ clientEmail, privateKey }) {
  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
  });
  return google.searchconsole({ version: 'v1', auth });
}

async function query(client, cfg, { dimensions, startDate, endDate }) {
  const rows = [];
  for (let startRow = 0; ; startRow += 25000) {
    const res = await client.searchanalytics.query({
      siteUrl: cfg.siteUrl,
      requestBody: { startDate, endDate, dimensions, rowLimit: 25000, startRow, dataState: cfg.dataState, type: 'web' },
    });
    const batch = res.data.rows || [];
    rows.push(...batch);
    if (batch.length < 25000) return rows;
  }
}

const metricsOf = (r) => ({ clicks: r?.clicks || 0, impressions: r?.impressions || 0, ctr: r?.ctr || 0, position: r?.position || 0 });

export function mergeDualPeriod(current, previous, key) {
  const prev = new Map(previous.map((r) => [r[key], r]));
  const keys = new Set([...current.map((r) => r[key]), ...previous.map((r) => r[key])]);
  const cur = new Map(current.map((r) => [r[key], r]));
  return [...keys].map((k) => {
    const c = cur.get(k) || { [key]: k, ...metricsOf(null) };
    const p = prev.get(k) || metricsOf(null);
    return { ...c, clicksPrev: p.clicks, impressionsPrev: p.impressions, ctrPrev: p.ctr, positionPrev: p.position };
  });
}

export async function fetchGscWeeklyBundle() {
  const cfg = getGscConfig();
  const client = createClient(cfg);
  const periods = getReportPeriods(process.env.REPORT_WEEK_END);
  const range = (p) => ({ startDate: periods[p].start, endDate: periods[p].end });

  const [totalCur, totalPrev] = await Promise.all([
    query(client, cfg, { dimensions: [], ...range('current') }),
    query(client, cfg, { dimensions: [], ...range('previous') }),
  ]);

  const dims = { page: 'pages', query: 'queries', country: 'countries', device: 'devices' };
  const dimensions = {};
  for (const [dim, name] of Object.entries(dims)) {
    process.stdout.write(`  GSC ${dim}... `);
    const [cur, prev] = await Promise.all([
      query(client, cfg, { dimensions: [dim], ...range('current') }),
      query(client, cfg, { dimensions: [dim], ...range('previous') }),
    ]);
    const map = (rows) =>
      rows.map((r) => ({ [dim === 'page' ? 'url' : dim]: dim === 'page' ? stripDomain(r.keys[0]) : r.keys[0], ...metricsOf(r) }));
    dimensions[name] = mergeDualPeriod(map(cur), map(prev), dim === 'page' ? 'url' : dim);
    console.log(`✓ ${dimensions[name].length} rows`);
  }

  const blogPages = dimensions.pages.filter((p) => p.url.startsWith('/blog/'));
  return {
    periods,
    dataState: cfg.dataState,
    siteUrl: cfg.siteUrl,
    overall: metricsOf(totalCur[0]),
    overallPrev: metricsOf(totalPrev[0]),
    blogSummary: {
      clicks: blogPages.reduce((s, p) => s + p.clicks, 0),
      impressions: blogPages.reduce((s, p) => s + p.impressions, 0),
      clicksPrev: blogPages.reduce((s, p) => s + p.clicksPrev, 0),
      impressionsPrev: blogPages.reduce((s, p) => s + p.impressionsPrev, 0),
      pageCount: blogPages.filter((p) => p.impressions > 0).length,
    },
    dimensions,
  };
}
