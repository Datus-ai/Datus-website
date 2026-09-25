#!/usr/bin/env node
/** blog/posts/*.md + CATEGORIES → $DATUS_SEO_HOME/data/blog-catalog.json */

import { writeFileSync } from 'fs';
import { join } from 'path';
import { REPO_ROOT, DATA_DIR, ensureDirs } from './lib/paths.mjs';
import { scanBlog } from './lib/blog-catalog.mjs';

ensureDirs();
const catalog = scanBlog(REPO_ROOT);
const out = join(DATA_DIR, 'blog-catalog.json');
writeFileSync(out, JSON.stringify(catalog, null, 2), 'utf8');
console.log(`blog catalog: ${catalog.meta.totalPosts} posts from ${join(REPO_ROOT, 'blog/posts')} → ${out}`);
