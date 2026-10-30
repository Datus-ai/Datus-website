// Public names stay independent of converter API IDs (Power BI = microsoft).
export const CONVERTER_PATH = '/apache-ossie-converter/';
export const LEGACY_CONVERTER_PATH = '/tools/semantic-model-converter/';
export const CONVERTER_FLOWS = [
  { slug: 'cube-to-ossie', platformSlug: 'cube', name: 'Cube → Ossie', platform: 'cube', direction: 'import', example: 'cube' },
  { slug: 'ossie-to-cube', platformSlug: 'cube', name: 'Ossie → Cube', platform: 'cube', direction: 'export', example: 'omni' },
  { slug: 'dbt-to-ossie', platformSlug: 'dbt', name: 'dbt → Ossie', platform: 'dbt', direction: 'import', example: 'dbt' },
  { slug: 'ossie-to-dbt', platformSlug: 'dbt', name: 'Ossie → dbt', platform: 'dbt', direction: 'export', example: 'nvidia' },
  { slug: 'omni-to-ossie', platformSlug: 'omni', name: 'Omni → Ossie', platform: 'omni', direction: 'import', example: 'omni' },
  { slug: 'ossie-to-omni', platformSlug: 'omni', name: 'Ossie → Omni', platform: 'omni', direction: 'export', example: 'omni' },
  { slug: 'power-bi-to-ossie', platformSlug: 'power-bi', name: 'Power BI → Ossie', platform: 'microsoft', direction: 'import', example: 'microsoft' },
  { slug: 'ossie-to-power-bi', platformSlug: 'power-bi', name: 'Ossie → Power BI', platform: 'microsoft', direction: 'export', example: 'omni' },
  { slug: 'ossie-to-snowflake', platformSlug: 'snowflake', name: 'Ossie → Snowflake', platform: 'snowflake', direction: 'export', example: 'retail' },
] as const;
export type ConverterFlow = typeof CONVERTER_FLOWS[number];
export const CONVERTER_PATHS = [CONVERTER_PATH, ...CONVERTER_FLOWS.map((item) => `${CONVERTER_PATH}${item.slug}/`)];

export function converterFlow(pathname: string): ConverterFlow | undefined {
  const path = pathname.replace(/^\/zh(?=\/)/, '').replace(/\/?$/, '/');
  return CONVERTER_FLOWS.find((item) => path === `${CONVERTER_PATH}${item.slug}/`);
}
