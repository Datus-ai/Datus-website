#!/usr/bin/env node
/** GSC Search Analytics for the report week → $DATUS_SEO_HOME/data/gsc-weekly-<sunday>.json */

import { writeFileSync } from 'fs';
import { join } from 'path';
import { DATA_DIR, ensureDirs } from './lib/paths.mjs';
import { fetchGscWeeklyBundle } from './lib/gsc-client.mjs';

try {
  ensureDirs();
  const bundle = await fetchGscWeeklyBundle();
  const { periods } = bundle;
  console.log(`GSC ${periods.current.start}~${periods.current.end} vs ${periods.previous.start}~${periods.previous.end} (dataState=${bundle.dataState})`);
  const out = join(DATA_DIR, `gsc-weekly-${periods.fileSuffix}.json`);
  writeFileSync(out, JSON.stringify({ source: 'gsc-api', fetchedAt: new Date().toISOString(), ...bundle }, null, 2), 'utf8');
  console.log(`saved → ${out}`);
} catch (err) {
  console.error('GSC fetch failed:', err.message || err);
  process.exit(1);
}
