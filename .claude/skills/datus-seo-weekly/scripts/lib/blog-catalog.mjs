/**
 * blog/posts/*.md frontmatter + the CATEGORIES table in scripts/build-blog.mjs
 * → a catalog of live posts. Categories are not frontmatter in this repo; a
 * post's category is the CATEGORIES entry that lists its slug (first wins, as
 * in build-blog.mjs), else "More essays".
 */

import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { parse as parseYaml } from 'yaml';

export const UNCATEGORIZED = 'More essays';
const SKIP = new Set(['index.md']);

export function parseFrontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return {};
  try {
    return parseYaml(m[1]) || {};
  } catch {
    return {};
  }
}

/** slug → category label, read from the source of build-blog.mjs. */
export function parseCategories(buildBlogSource) {
  const start = buildBlogSource.indexOf('const CATEGORIES = [');
  if (start < 0) throw new Error('CATEGORIES not found in scripts/build-blog.mjs');
  const end = buildBlogSource.indexOf('\n];', start);
  const block = buildBlogSource.slice(start, end);
  const map = new Map();
  const entry = /label:\s*"([^"]+)"[\s\S]*?slugs:\s*\[([\s\S]*?)\]/g;
  for (const [, label, slugs] of block.matchAll(entry)) {
    for (const [, slug] of slugs.matchAll(/"([^"]+)"/g)) {
      if (!map.has(slug)) map.set(slug, label);
    }
  }
  return map;
}

function normalizeTags(tags) {
  if (!tags) return [];
  const list = Array.isArray(tags) ? tags : String(tags).split(',');
  return [...new Set(list.map((t) => String(t).trim().toLowerCase()).filter(Boolean))];
}

function toDate(v) {
  if (!v) return null;
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  return String(v).slice(0, 10);
}

export function scanBlog(repoRoot) {
  const postsDir = join(repoRoot, 'blog', 'posts');
  const categories = parseCategories(readFileSync(join(repoRoot, 'scripts', 'build-blog.mjs'), 'utf8'));

  const posts = readdirSync(postsDir)
    .filter((f) => f.endsWith('.md') && !SKIP.has(f))
    .map((file) => {
      const slug = file.replace(/\.md$/, '');
      const fm = parseFrontmatter(readFileSync(join(postsDir, file), 'utf8'));
      const tags = normalizeTags(fm.tags);
      return {
        slug,
        title: fm.title || slug,
        date: toDate(fm.date),
        lastmod: toDate(fm.lastmod),
        author: fm.author || '',
        category: categories.get(slug) || UNCATEGORIZED,
        insight: tags.includes('insight'),
        path: `/blog/${slug}/`,
      };
    })
    .sort((a, b) => (a.date || '').localeCompare(b.date || '') || a.slug.localeCompare(b.slug));

  return {
    meta: { source: 'blog/posts', syncedAt: new Date().toISOString(), totalPosts: posts.length },
    posts,
  };
}
