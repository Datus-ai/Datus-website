/** Use recorded content dates, never the clock time of an otherwise unchanged build. */
export function latestDate(values) {
 const dates = values.filter(value => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const time = Date.parse(`${value}T00:00:00Z`);
  return Number.isFinite(time) && new Date(time).toISOString().slice(0, 10) === value;
 });
 return dates.sort().at(-1);
}

export function sitemapLastmod(xml) {
 return latestDate([...xml.matchAll(/<lastmod>\s*(\d{4}-\d{2}-\d{2})(?:T[^<]+)?\s*<\/lastmod>/g)].map(match => match[1]));
}

export function sitemapIndex(site, children) {
 const body = children.map(({path, xml}) => {
  const lastmod = sitemapLastmod(xml);
  return `  <sitemap><loc>${site}${path}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}</sitemap>`;
 }).join('\n');
 return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</sitemapindex>\n`;
}
