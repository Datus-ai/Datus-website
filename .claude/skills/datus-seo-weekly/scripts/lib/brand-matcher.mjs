/**
 * Brand query matching for Datus GSC queries.
 */

function normalizeQuery(q, { caseInsensitive = true, stripPunctuation = true } = {}) {
  let s = (q || '').trim();
  if (caseInsensitive) s = s.toLowerCase();
  if (stripPunctuation) s = s.replace(/[^\w\s.-]/g, ' ').replace(/\s+/g, ' ').trim();
  return s;
}

export function loadBrandConfig(registry) {
  const groups = registry.brandGroups || [];
  const competitorTerms = (registry.competitorBrandTerms || []).map((t) => normalizeQuery(t));
  const categoryTerms = (registry.categoryTerms || []).map((t) => normalizeQuery(t));
  const matching = registry.matching || {};

  const brandPatterns = [];
  for (const g of groups) {
    for (const p of g.patterns || []) {
      brandPatterns.push({
        groupId: g.id,
        groupLabel: g.label,
        pattern: normalizeQuery(p, matching),
        raw: p,
      });
    }
  }

  return { brandPatterns, competitorTerms, categoryTerms, matching };
}

export function classifyQuery(query, registry) {
  const { brandPatterns, competitorTerms, categoryTerms, matching } = loadBrandConfig(registry);
  const nq = normalizeQuery(query, matching);

  for (const c of competitorTerms) {
    if (nq.includes(c)) {
      return { isBranded: false, isCompetitor: true, isCategory: false, brandGroup: null };
    }
  }

  for (const bp of brandPatterns) {
    if (nq.includes(bp.pattern)) {
      return {
        isBranded: true,
        isCompetitor: false,
        isCategory: false,
        brandGroup: bp.groupId,
        brandGroupLabel: bp.groupLabel,
      };
    }
  }

  for (const ct of categoryTerms) {
    if (nq.includes(ct)) {
      return { isBranded: false, isCompetitor: false, isCategory: true, brandGroup: null };
    }
  }

  return { isBranded: false, isCompetitor: false, isCategory: false, brandGroup: null };
}

export function splitBrandedMetrics(queries, registry) {
  let brandedClicks = 0;
  let brandedImpressions = 0;
  let nonBrandedClicks = 0;
  let nonBrandedImpressions = 0;
  let categoryClicks = 0;
  let categoryImpressions = 0;

  for (const q of queries) {
    const c = classifyQuery(q.query, registry);
    const clicks = q.clicks || 0;
    const impressions = q.impressions || 0;

    if (c.isBranded) {
      brandedClicks += clicks;
      brandedImpressions += impressions;
    } else if (c.isCategory) {
      categoryClicks += clicks;
      categoryImpressions += impressions;
      nonBrandedClicks += clicks;
      nonBrandedImpressions += impressions;
    } else {
      nonBrandedClicks += clicks;
      nonBrandedImpressions += impressions;
    }

    q.isBranded = c.isBranded;
    q.isCategory = c.isCategory;
    q.isCompetitor = c.isCompetitor;
    q.brandGroup = c.brandGroup;
  }

  const totalClicks = brandedClicks + nonBrandedClicks;
  return {
    branded: {
      clicks: brandedClicks,
      impressions: brandedImpressions,
      share: totalClicks > 0 ? brandedClicks / totalClicks : 0,
    },
    nonBranded: {
      clicks: nonBrandedClicks,
      impressions: nonBrandedImpressions,
      share: totalClicks > 0 ? nonBrandedClicks / totalClicks : 0,
    },
    category: {
      clicks: categoryClicks,
      impressions: categoryImpressions,
    },
  };
}
