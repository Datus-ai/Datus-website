import type {
  IConversionOptions,
  IImportOptions,
  IImportFile,
  IConversionResult,
} from '../contracts';
import { MAX_SOURCE_BYTES } from './source';
import { safeRelativePath } from './artifacts';

export type IDirection = 'import' | 'export';
export type IOptions = IConversionOptions & IImportOptions;

export interface ISession {
  formatId: string;
  files: IImportFile[];
  selectedSource: string | null;
  sampleId?: string;
  options: IOptions;
  inputDirty: boolean;
  result: IConversionResult | null;
  snapshot: string;
  edits: Record<string, string>;
  selectedPath: string | null;
  view: 'files' | 'diagnostics';
  generation: number;
  error: string;
}

export function createSession(
  formatId: string,
  files: IImportFile[],
  sampleId?: string,
): ISession {
  return {
    formatId,
    files,
    selectedSource: files[0]?.path ?? null,
    sampleId,
    options: {},
    inputDirty: false,
    result: null,
    snapshot: '',
    edits: {},
    selectedPath: null,
    view: 'files',
    generation: 0,
    error: '',
  };
}

export function inputSnapshot(session: ISession): string {
  return JSON.stringify({
    format: session.formatId,
    files: session.files,
    options: session.options,
  });
}

export function validSourceBundle(
  files: IImportFile[],
  maxBytes = MAX_SOURCE_BYTES,
  maxFiles = 50,
): boolean {
  const paths = files.map((file) => file.path.toLowerCase());
  return (
    Boolean(files.length) &&
    files.length <= maxFiles &&
    files.every((file) => safeRelativePath(file.path)) &&
    new Set(paths).size === paths.length &&
    files.reduce(
      (total, file) =>
        total + new TextEncoder().encode(file.path + file.content).length,
      0,
    ) <= maxBytes
  );
}
