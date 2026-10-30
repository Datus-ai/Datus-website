import historicalPages from './pages.json';
import structuredData from './shell-structured-data.json';
import { CONVERTER_PATH, CONVERTER_FLOWS, LEGACY_CONVERTER_PATH } from '../modules/semantic-converter/routes';
import { converterPage } from '../pages/tools/semantic-model-converter/content';
import { flowCopy } from '../pages/tools/semantic-model-converter/flows';

export interface PageEntry {
  path: string;
  entry: string;
  title: string;
  description: string;
  image: string;
  author?: boolean;
  favicon?: string;
  ogType?: string;
  imageDimensions?: boolean;
  lang?: string;
  viewport?: string;
  robots?: string;
  ogTitle?: string;
  ogDescription?: string;
  imageAlt?: string;
  twitter?: boolean;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  consent?: boolean;
  headLinks?: Record<string, string | null>[];
  extraMeta?: Record<string, string>[];
  structuredData?: unknown[];
}

const converterEntry = '/src/pages/tools/semantic-model-converter/main.tsx';
const converterImage = '/og/tools-semantic-model-converter-1200x630.png';

/** Shared Vite inputs and HTML metadata; converter entries reuse their body copy. */
export const PAGE_ENTRIES: PageEntry[] = [
  ...historicalPages.map(page => ({
    ...page,
    structuredData: (structuredData as Record<string, unknown[]>)[page.path],
  })),
  {
    path: CONVERTER_PATH,
    entry: converterEntry,
    title: `${converterPage.en.title} — Datus`,
    description: converterPage.en.lead,
    image: converterImage,
  },
  ...CONVERTER_FLOWS.map(flow => ({
    path: `${CONVERTER_PATH}${flow.slug}/`,
    entry: converterEntry,
    title: `${flowCopy.en[flow.slug].title} — Datus`,
    description: flowCopy.en[flow.slug].description,
    image: converterImage,
  })),
];

export const PAGE_REDIRECTS = [{ path: LEGACY_CONVERTER_PATH, target: CONVERTER_PATH }];
