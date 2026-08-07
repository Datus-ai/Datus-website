/**
 * Everything the build scripts need from the i18n layer, in one module.
 *
 * `scripts/prerender.mjs` loads this through Vite's `ssrLoadModule`, which is
 * how a plain Node script gets to read the TypeScript source of record instead
 * of keeping a second, drift-prone copy of the route list and locale codes.
 */
export {
  DEFAULT_LOCALE,
  HREFLANG,
  HTML_LANG,
  LOCALES,
  LOCALE_PREFIX,
  MIRRORED_PATHS,
  OG_LOCALE,
  SITE,
  absoluteUrl,
  alternateLinks,
  isMirrored,
  localizePath,
} from "./config";

export { ZH_PAGE_META, missingZhMeta } from "./pageMeta";
