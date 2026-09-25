#!/usr/bin/env node
/** GA4 for the report week → $DATUS_SEO_HOME/data/ga4-weekly-<sunday>.json */

import { writeFileSync } from 'fs';
import { join } from 'path';
import { DATA_DIR, ensureDirs } from './lib/paths.mjs';
import { createGa4Client, getGa4Config, runDualPeriodReport } from './lib/ga4-client.mjs';
import { getReportPeriods } from './lib/periods.mjs';

const LIGHT = ['sessions', 'totalUsers', 'engagedSessions', 'screenPageViews'];
const REPORTS = [
  { key: 'byChannel', dimensions: ['sessionDefaultChannelGroup'], metrics: [...LIGHT, 'engagementRate', 'averageSessionDuration'] },
  { key: 'bySourceMedium', dimensions: ['sessionSource', 'sessionMedium'], metrics: LIGHT },
  { key: 'topLandingPages', dimensions: ['landingPage'], metrics: LIGHT },
  { key: 'organicLandingPages', dimensions: ['landingPage', 'sessionDefaultChannelGroup'], metrics: ['sessions', 'engagedSessions'] },
  { key: 'events', dimensions: ['eventName'], metrics: ['eventCount', 'totalUsers'] },
];

try {
  ensureDirs();
  const client = createGa4Client();
  const { propertyId } = getGa4Config();
  const periods = getReportPeriods(process.env.REPORT_WEEK_END);
  console.log(`GA4 ${periods.current.start}~${periods.current.end} vs ${periods.previous.start}~${periods.previous.end}`);

  const reports = {};
  for (const spec of REPORTS) {
    process.stdout.write(`  ${spec.key}... `);
    reports[spec.key] = await runDualPeriodReport(client, propertyId, spec);
    console.log(`✓ ${reports[spec.key].length} rows`);
  }
  reports.organicLandingPages = reports.organicLandingPages.filter(
    (r) => r.dimensions.sessionDefaultChannelGroup === 'Organic Search',
  );

  const out = join(DATA_DIR, `ga4-weekly-${periods.fileSuffix}.json`);
  writeFileSync(out, JSON.stringify({ source: 'ga4-api', fetchedAt: new Date().toISOString(), period: periods, reports }, null, 2), 'utf8');
  console.log(`saved → ${out}`);
} catch (err) {
  console.error('GA4 fetch failed:', err.message || err);
  process.exit(1);
}
