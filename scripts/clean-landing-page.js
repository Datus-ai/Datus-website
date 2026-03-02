#!/usr/bin/env node

/**
 * Post-build sanity hook used by `npm run merge:builds`.
 *
 * This script intentionally keeps behavior minimal and deterministic:
 * - verifies merged build outputs exist
 * - keeps CI step explicit (instead of a missing-file crash)
 */

const fs = require('fs');
const path = require('path');

const root = process.cwd();
const requiredFiles = [
  path.join(root, 'dist', 'index.html'),
  path.join(root, 'dist', 'blog', 'index.html'),
  path.join(root, 'dist', 'data-engineering-agent', 'index.html'),
];

const missing = requiredFiles.filter((file) => !fs.existsSync(file));

if (missing.length > 0) {
  console.error('[merge:builds] Missing expected build artifacts:');
  for (const file of missing) console.error(` - ${path.relative(root, file)}`);
  process.exit(1);
}

console.log('[merge:builds] Build artifacts verified.');
