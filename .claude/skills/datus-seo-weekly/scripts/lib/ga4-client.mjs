/**
 * GA4 Data API helpers.
 *
 * With two named dateRanges, the Data API does NOT interleave metric values:
 * it returns one row per (dimensions × date range) and appends a `dateRange`
 * dimension carrying the range name. parseDualPeriodRows() folds those back
 * into { dimensions, metrics: { current, previous } }.
 */

import { BetaAnalyticsDataClient } from '@google-analytics/data';
import './paths.mjs';
import { getReportPeriods } from './periods.mjs';

export function getGa4Config() {
  const propertyId = process.env.GA4_PROPERTY_ID;
  const clientEmail = process.env.GA4_CLIENT_EMAIL || process.env.GSC_CLIENT_EMAIL;
  const privateKey = process.env.GA4_PRIVATE_KEY || process.env.GSC_PRIVATE_KEY;
  if (!propertyId || !clientEmail || !privateKey) {
    throw new Error('Missing GA4 credentials: set GA4_PROPERTY_ID (+ GA4_* or GSC_* service account) in ~/.datus-seo-weekly/.env');
  }
  return { propertyId, clientEmail, privateKey: privateKey.replace(/\\n/g, '\n') };
}

export function createGa4Client() {
  const { clientEmail, privateKey } = getGa4Config();
  return new BetaAnalyticsDataClient({ credentials: { client_email: clientEmail, private_key: privateKey } });
}

export async function runDualPeriodReport(client, propertyId, { dimensions, metrics, limit = 10000 }) {
  const periods = getReportPeriods(process.env.REPORT_WEEK_END);
  const [response] = await client.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [
      { startDate: periods.current.start, endDate: periods.current.end, name: 'current' },
      { startDate: periods.previous.start, endDate: periods.previous.end, name: 'previous' },
    ],
    dimensions: dimensions.map((name) => ({ name })),
    metrics: metrics.map((name) => ({ name })),
    limit,
  });
  return parseDualPeriodRows(response, dimensions, metrics);
}

export function parseDualPeriodRows(response, dimensions, metrics) {
  const dimHeaders = (response?.dimensionHeaders || []).map((h) => h.name);
  const metricHeaders = (response?.metricHeaders || []).map((h) => h.name);
  const rangeIdx = dimHeaders.indexOf('dateRange');
  const byKey = new Map();

  for (const row of response?.rows || []) {
    const values = (row.dimensionValues || []).map((v) => v?.value ?? '');
    const range = rangeIdx >= 0 ? values[rangeIdx] : 'current';
    const period = range === 'previous' || range === 'date_range_1' ? 'previous' : 'current';

    const dims = {};
    dimensions.forEach((name) => {
      const i = dimHeaders.indexOf(name);
      dims[name] = i >= 0 ? values[i] : '';
    });
    const key = JSON.stringify(dims);
    if (!byKey.has(key)) {
      const zero = () => Object.fromEntries(metrics.map((m) => [m, 0]));
      byKey.set(key, { dimensions: dims, metrics: { current: zero(), previous: zero() } });
    }
    const entry = byKey.get(key);
    metrics.forEach((name) => {
      const i = metricHeaders.indexOf(name);
      entry.metrics[period][name] = parseMetric(row.metricValues?.[i >= 0 ? i : metrics.indexOf(name)]?.value);
    });
  }
  return [...byKey.values()];
}

function parseMetric(val) {
  const n = Number(val);
  return val === undefined || val === null || val === '' || !Number.isFinite(n) ? 0 : n;
}

export function sumMetrics(rows, period = 'current') {
  const totals = {};
  for (const row of rows) {
    for (const [key, val] of Object.entries(row.metrics[period])) totals[key] = (totals[key] || 0) + val;
  }
  return totals;
}
