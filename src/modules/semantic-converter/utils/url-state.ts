import type { ICatalog, IImportCatalog } from '../contracts';
import { IMPORT_EXAMPLES, importExample } from '../examples';
import { SAMPLES } from '../samples';
import { createSession, type IDirection, type ISession } from './session';
import { CONVERTER_PATH, CONVERTER_FLOWS, type ConverterFlow } from '../routes';

export interface IWorkbenchLink {
  direction: IDirection;
  platform?: string;
  example?: string;
  invalidDirection: boolean;
}

export function readWorkbenchLink(
  search: string,
  fallback: IDirection = 'export',
  preset?: ConverterFlow,
): IWorkbenchLink {
  const params = new URLSearchParams(search);
  const direction = params.get('direction');
  const side = direction === 'import' || direction === 'export' ? direction : fallback;
  return {
    direction: side,
    platform: params.get('platform') ?? preset?.platform,
    example: params.get('example') ?? (!params.has('platform') && side === preset?.direction ? preset.example : undefined),
    invalidDirection:
      direction !== null && direction !== 'import' && direction !== 'export',
  };
}

// Resolve against the deployed catalog, never a second hard-coded platform list.
export function resolveWorkbenchLink(
  link: IWorkbenchLink,
  catalog: ICatalog | IImportCatalog,
): { session: ISession; invalid: boolean } | null {
  const importing = link.direction === 'import';
  const platforms =
    'sources' in catalog
      ? catalog.sources.filter((item) => item.available)
      : catalog.targets;
  if (!platforms.length) return null;

  const exportExample = SAMPLES.find((item) => item.id === link.example);
  const example = importing
    ? IMPORT_EXAMPLES.find((item) => item.id === link.example)
    : exportExample;
  const defaultId = importing ? 'cube' : SAMPLES[0].target;
  const examplePlatform = importing ? example?.id : exportExample?.target;
  const requested = link.platform ?? examplePlatform ?? defaultId;
  const platform =
    platforms.find((item) => item.id === requested) ??
    platforms.find((item) => item.id === defaultId) ??
    platforms[0];
  const invalid =
    link.invalidDirection ||
    (link.platform !== undefined && link.platform !== platform.id) ||
    (link.example !== undefined && !example) ||
    Boolean(importing && example && example.id !== platform.id);

  if (importing) {
    const files = importExample(platform.id);
    return {
      session: createSession(
        platform.id, files, files.length ? platform.id : undefined,
      ),
      invalid,
    };
  }
  const sample = exportExample ?? SAMPLES[0];
  return {
    session: createSession(
      platform.id,
      [{ path: sample.filename, content: sample.source }],
      sample.id,
    ),
    invalid,
  };
}

export function workbenchUrl(
  href: string,
  direction: IDirection,
  session: ISession,
  pretty = true,
): string {
  const url = new URL(href);
  const prefix = url.pathname.startsWith('/zh/') ? '/zh' : '';
  const onConverter = url.pathname.replace(/^\/zh(?=\/)/, '').startsWith(CONVERTER_PATH);
  if (onConverter && !pretty) return `${url.pathname}${url.search}${url.hash}`;
  const preset = onConverter
    ? CONVERTER_FLOWS.find((item) => item.platform === session.formatId && item.direction === direction)
    : undefined;
  if (onConverter) url.pathname = `${prefix}${CONVERTER_PATH}${preset ? preset.slug + '/' : ''}`;
  if (direction === preset?.direction) url.searchParams.delete('direction');
  else url.searchParams.set('direction', direction);
  if (session.formatId === preset?.platform) url.searchParams.delete('platform');
  else url.searchParams.set('platform', session.formatId);
  const examples = direction === 'import' ? IMPORT_EXAMPLES : SAMPLES;
  const example = examples.find((item) => item.id === session.sampleId);
  if (!session.inputDirty && example && (example.id !== preset?.example || direction !== preset?.direction)) {
    url.searchParams.set('example', example.id);
  } else {
    url.searchParams.delete('example');
  }
  return `${url.pathname}${url.search}${url.hash}`;
}
