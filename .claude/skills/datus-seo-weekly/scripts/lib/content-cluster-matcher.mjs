/**
 * Content clusters. A blog page's cluster is its CATEGORIES label from the
 * catalog (the same grouping /blog/ shows); every other page is matched
 * against the pathPatterns of the non-blog groups in content-clusters.yaml.
 */

import { normalizePath, blogSlugFromPath } from './landing-page-classifier.mjs';

function globToRegex(glob) {
  const escaped = normalizePath(glob)
    .replace(/[.+^${}()|[\]\\]/g, '\\$&')
    .replace(/\*\*/g, '<<G>>')
    .replace(/\*/g, '[^/]*')
    .replace(/<<G>>/g, '.*');
  return new RegExp(`^${escaped}$`, 'i');
}

export function makeClusterResolver(registry, catalog) {
  const bySlug = new Map((catalog?.posts || []).map((p) => [p.slug, p]));
  const groups = (registry.pageGroups || []).map((g) => ({ ...g, res: (g.pathPatterns || []).map(globToRegex) }));

  return function resolve(rawPath) {
    const path = normalizePath(rawPath);
    const slug = blogSlugFromPath(path);
    if (slug) {
      const post = bySlug.get(slug);
      return post
        ? { clusterId: `blog:${post.category}`, clusterLabel: `Blog · ${post.category}` }
        : { clusterId: 'blog:unknown', clusterLabel: 'Blog · not in catalog (redirect stub or removed)' };
    }
    for (const g of groups) if (g.res.some((re) => re.test(path))) return { clusterId: g.id, clusterLabel: g.label };
    return { clusterId: 'other', clusterLabel: 'Other' };
  };
}

export function aggregateClusterMetrics(pages, resolve) {
  const byCluster = new Map();
  for (const page of pages) {
    const { clusterId, clusterLabel } = resolve(page.url);
    if (!byCluster.has(clusterId)) {
      byCluster.set(clusterId, { id: clusterId, label: clusterLabel, clicks: 0, impressions: 0, clicksPrev: 0, impressionsPrev: 0, pageCount: 0, topPages: [] });
    }
    const c = byCluster.get(clusterId);
    c.clicks += page.clicks || 0;
    c.impressions += page.impressions || 0;
    c.clicksPrev += page.clicksPrev || 0;
    c.impressionsPrev += page.impressionsPrev || 0;
    c.pageCount += 1;
    c.topPages.push({ path: normalizePath(page.url), clicks: page.clicks || 0, impressions: page.impressions || 0 });
  }
  return [...byCluster.values()]
    .map((c) => ({ ...c, topPages: c.topPages.sort((a, b) => b.clicks - a.clicks || b.impressions - a.impressions).slice(0, 5) }))
    .sort((a, b) => b.clicks - a.clicks || b.impressions - a.impressions);
}

/** Posts whose frontmatter date falls in [start, end]. */
export function findPostsInRange(catalog, start, end) {
  return (catalog.posts || []).filter((p) => p.date && p.date >= start && p.date <= end);
}

export function attachGsc(posts, gscPages, weekEnd) {
  const byPath = new Map(gscPages.map((p) => [normalizePath(p.url), p]));
  return posts.map((post) => {
    const g = byPath.get(normalizePath(post.path));
    return {
      slug: post.slug,
      title: post.title,
      category: post.category,
      date: post.date,
      path: post.path,
      gsc: g
        ? { clicks: g.clicks, impressions: g.impressions, ctr: g.ctr, position: g.position, clicksPrev: g.clicksPrev, impressionsPrev: g.impressionsPrev }
        : null,
      daysSincePublish: Math.max(0, Math.round((new Date(weekEnd) - new Date(post.date)) / 86400000)),
    };
  });
}

export function summarizeInventory(catalog) {
  const byCategory = {};
  for (const p of catalog.posts || []) byCategory[p.category] = (byCategory[p.category] || 0) + 1;
  return { totalPosts: (catalog.posts || []).length, byCategory, lastSyncedAt: catalog.meta?.syncedAt || null };
}
