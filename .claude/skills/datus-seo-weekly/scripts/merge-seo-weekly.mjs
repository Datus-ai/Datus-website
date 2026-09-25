#!/usr/bin/env node
/**
 * GSC + GA4 + blog catalog → $DATUS_SEO_HOME/data/seo-report-bundle-<sunday>.json,
 * the single file the report is written from.
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { parse as parseYaml } from 'yaml';
import { DATA_DIR, REPORTS_DIR, REGISTRY_DIR, ensureDirs } from './lib/paths.mjs';
import { getReportPeriods, pctChange } from './lib/periods.mjs';
import { sumMetrics } from './lib/ga4-client.mjs';
import { splitBrandedMetrics } from './lib/brand-matcher.mjs';
import { classifyLandingPage, stripDomain, normalizePath } from './lib/landing-page-classifier.mjs';
import {
  makeClusterResolver,
  aggregateClusterMetrics,
  findPostsInRange,
  attachGsc,
  summarizeInventory,
} from './lib/content-cluster-matcher.mjs';

const readJson = (p) => (existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : null);
const readYaml = (p) => parseYaml(readFileSync(p, 'utf8'));

function ga4Section(ga4, conversionEvents) {
  if (!ga4) return null;
  const r = ga4.reports;
  const cur = sumMetrics(r.byChannel, 'current');
  const prev = sumMetrics(r.byChannel, 'previous');
  const organic = r.byChannel.find((x) => x.dimensions.sessionDefaultChannelGroup === 'Organic Search');
  const pages = (rows) =>
    rows
      .map((x) => {
        const path = stripDomain(x.dimensions.landingPage);
        return { path, pageType: classifyLandingPage(path).pageType, sessions: x.metrics.current.sessions, sessionsPrev: x.metrics.previous.sessions, engagedSessions: x.metrics.current.engagedSessions };
      })
      .filter((x) => x.path)
      .sort((a, b) => b.sessions - a.sessions);
  const wanted = new Set(conversionEvents);
  return {
    overall: { sessions: cur.sessions || 0, totalUsers: cur.totalUsers || 0, engagedSessions: cur.engagedSessions || 0, screenPageViews: cur.screenPageViews || 0 },
    overallPrev: { sessions: prev.sessions || 0, totalUsers: prev.totalUsers || 0, engagedSessions: prev.engagedSessions || 0, screenPageViews: prev.screenPageViews || 0 },
    organicSearch: organic ? { sessions: organic.metrics.current.sessions, sessionsPrev: organic.metrics.previous.sessions } : null,
    channels: r.byChannel
      .map((x) => ({ channel: x.dimensions.sessionDefaultChannelGroup, sessions: x.metrics.current.sessions, sessionsPrev: x.metrics.previous.sessions }))
      .sort((a, b) => b.sessions - a.sessions),
    sourceMedium: r.bySourceMedium
      .map((x) => ({ source: x.dimensions.sessionSource, medium: x.dimensions.sessionMedium, sessions: x.metrics.current.sessions, sessionsPrev: x.metrics.previous.sessions }))
      .sort((a, b) => b.sessions - a.sessions)
      .slice(0, 20),
    topLandingPages: pages(r.topLandingPages).slice(0, 30),
    organicLandingPages: pages(r.organicLandingPages).slice(0, 30),
    conversionEvents: r.events
      .filter((x) => wanted.has(x.dimensions.eventName))
      .map((x) => ({ eventName: x.dimensions.eventName, eventCount: x.metrics.current.eventCount, eventCountPrev: x.metrics.previous.eventCount, totalUsers: x.metrics.current.totalUsers })),
    conversionEventsMissing: [...wanted].filter((e) => !r.events.some((x) => x.dimensions.eventName === e)),
  };
}

/** Where the next blog posts / title fixes should come from. */
function opportunities(queries, pages) {
  return {
    // High impressions, almost no clicks: title / description problem.
    lowCtrPages: pages.filter((p) => p.impressions >= 200 && p.ctr < 0.005).sort((a, b) => b.impressions - a.impressions).slice(0, 15),
    // Ranking 8–20: a refresh or a better-targeted post could reach page one.
    strikingDistanceQueries: queries
      .filter((q) => !q.isBranded && q.position >= 8 && q.position <= 20 && q.impressions >= 20)
      .sort((a, b) => b.impressions - a.impressions)
      .slice(0, 25),
    // Non-brand queries with impressions but no page of ours in the top 20: topic candidates.
    unservedQueries: queries
      .filter((q) => !q.isBranded && q.position > 20 && q.impressions >= 20)
      .sort((a, b) => b.impressions - a.impressions)
      .slice(0, 25),
  };
}

try {
  ensureDirs();
  const periods = getReportPeriods(process.env.REPORT_WEEK_END);
  const sfx = periods.fileSuffix;
  const gsc = readJson(join(DATA_DIR, `gsc-weekly-${sfx}.json`));
  const ga4 = readJson(join(DATA_DIR, `ga4-weekly-${sfx}.json`));
  const catalog = readJson(join(DATA_DIR, 'blog-catalog.json'));
  if (!gsc && !ga4) throw new Error(`no gsc-weekly-${sfx}.json or ga4-weekly-${sfx}.json in ${DATA_DIR} — run the fetch scripts, or use manual mode`);
  if (!catalog) throw new Error('no blog-catalog.json — run `npm run sync-blog` first');

  const brands = readYaml(join(REGISTRY_DIR, 'brand-queries.yaml'));
  const clusters = readYaml(join(REGISTRY_DIR, 'content-clusters.yaml'));
  const resolve = makeClusterResolver(clusters, catalog);

  const pages = gsc?.dimensions?.pages || [];
  const queries = [...(gsc?.dimensions?.queries || [])];
  const branded = queries.length ? splitBrandedMetrics(queries, brands) : null; // also tags each query

  const newThisWeek = attachGsc(findPostsInRange(catalog, periods.current.start, periods.current.end), pages, periods.current.end);
  const newLastWeek = attachGsc(findPostsInRange(catalog, periods.previous.start, periods.previous.end), pages, periods.current.end);
  const ga4s = ga4Section(ga4, clusters.conversionEvents || []);

  const prevSunday = periods.previous.end;
  const prevReport = join(REPORTS_DIR, `datus-seo-weekly-report-${prevSunday}.md`);
  const gscOrganicRatio = gsc && ga4s?.organicSearch?.sessions ? gsc.overall.clicks / ga4s.organicSearch.sessions : null;
  const ga4Paths = new Set((ga4s?.topLandingPages || []).map((p) => p.path));
  const topGsc = pages.filter((p) => p.clicks > 0).map((p) => normalizePath(p.url));

  const bundle = {
    source: gsc && ga4 ? 'api-auto' : gsc ? 'gsc-only' : 'ga4-only',
    fetchedAt: new Date().toISOString(),
    period: { current: periods.current, previous: periods.previous },
    gsc: gsc && {
      dataState: gsc.dataState,
      overall: gsc.overall,
      overallPrev: gsc.overallPrev,
      overallChange: { clicksPct: pctChange(gsc.overall.clicks, gsc.overallPrev.clicks), impressionsPct: pctChange(gsc.overall.impressions, gsc.overallPrev.impressions) },
      blogSummary: gsc.blogSummary,
      branded: branded?.branded || null,
      nonBranded: branded?.nonBranded || null,
      category: branded?.category || null,
      pages: [...pages].sort((a, b) => b.clicks - a.clicks || b.impressions - a.impressions).slice(0, 50),
      lostPages: pages.filter((p) => p.impressions === 0 && p.impressionsPrev >= 20).slice(0, 20),
      queries: queries.sort((a, b) => b.clicks - a.clicks || b.impressions - a.impressions).slice(0, 50),
      countries: (gsc.dimensions.countries || []).sort((a, b) => b.clicks - a.clicks).slice(0, 20),
      devices: gsc.dimensions.devices || [],
      opportunities: opportunities(queries, pages),
    },
    ga4: ga4s,
    blog: {
      inventory: summarizeInventory(catalog),
      newThisWeek,
      newLastWeek,
    },
    contentClusters: pages.length ? aggregateClusterMetrics(pages, resolve) : [],
    healthCheck: {
      d1_period: `${periods.current.start}~${periods.current.end} vs ${periods.previous.start}~${periods.previous.end}`,
      d2_gscDimensions: Object.fromEntries(['pages', 'queries', 'countries', 'devices'].map((k) => [k, Boolean(gsc?.dimensions?.[k]?.length)])),
      d3_ga4Present: Boolean(ga4),
      d4_catalogSyncedAt: catalog.meta.syncedAt,
      d5_gscPagesSeenInGa4: topGsc.length ? topGsc.filter((p) => ga4Paths.has(p)).length / topGsc.length : null,
      d6_gscClicksPerGa4OrganicSession: gscOrganicRatio,
      d7_previousReport: existsSync(prevReport) ? prevReport : null,
      gscDataState: gsc?.dataState || null,
    },
  };

  const out = join(DATA_DIR, `seo-report-bundle-${sfx}.json`);
  writeFileSync(out, JSON.stringify(bundle, null, 2), 'utf8');
  console.log(`bundle (${bundle.source}): ${newThisWeek.length} new post(s) this week, ${bundle.contentClusters.length} clusters → ${out}`);
} catch (err) {
  console.error('merge failed:', err.message || err);
  process.exit(1);
}
