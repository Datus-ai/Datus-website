export const WEBSITE_SOURCE = 'datus.ai';
const CAMPAIGN_FIELDS = ['utm_source', 'utm_medium', 'utm_campaign'];

/**
 * Build every Studio handoff with source first; never mix partial campaigns.
 * @param {string} href
 * @param {Partial<Record<'utm_source' | 'utm_medium' | 'utm_campaign', string>>} campaign
 * @returns {string}
 */
export function studioUrl(href, campaign = {}) {
  const url = new URL(href);
  if (url.origin !== 'https://studio.datus.ai') return href;
  for (const key of CAMPAIGN_FIELDS) url.searchParams.delete(key);
  const params = new URLSearchParams();
  if (!CAMPAIGN_FIELDS.some(key => campaign[key])) params.set('utm_source', WEBSITE_SOURCE);
  for (const key of CAMPAIGN_FIELDS) if (campaign[key]) params.set(key, campaign[key]);
  for (const [key, value] of url.searchParams) params.append(key, value);
  url.search = params.toString();
  return url.href;
}
