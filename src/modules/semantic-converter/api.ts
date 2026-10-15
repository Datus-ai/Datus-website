import type {
  ICatalog,
  IConversionRequest,
  IConversionResult,
} from './contracts';
import { validateArtifacts } from './utils/artifacts';

/** Runtime hostname keeps localhost previews on dev even after a production build. */
export function resolveApiOrigin(hostname: string): string {
  return ['localhost', '127.0.0.1', '::1', '[::1]'].includes(hostname)
    ? 'https://studio-dev.datus.ai'
    : 'https://studio.datus.ai';
}

export class ConverterApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly retryAfter?: string,
  ) {
    super('semantic_converter_request_failed');
  }
}

async function request<T>(
  path: string,
  signal: AbortSignal,
  body?: IConversionRequest,
): Promise<T> {
  const response = await fetch(
    `${resolveApiOrigin(window.location.hostname)}/api/public/semantic-converter/${path}`,
    {
      method: body ? 'POST' : 'GET',
      credentials: 'omit',
      cache: 'no-store',
      signal,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    },
  );

  if (!response.ok) {
    throw new ConverterApiError(
      response.status,
      response.headers.get('Retry-After') ?? undefined,
    );
  }

  const envelope = await response.json();

  if (envelope.success !== true || !envelope.data) {
    throw new ConverterApiError(502);
  }

  return envelope.data;
}

export async function getTargets(signal: AbortSignal): Promise<ICatalog> {
  const catalog = await request<ICatalog>('targets', signal);

  if (!Array.isArray(catalog.targets) || !catalog.targets.length) {
    throw new ConverterApiError(502);
  }

  return catalog;
}

export async function convertModel(
  body: IConversionRequest,
  signal: AbortSignal,
): Promise<IConversionResult> {
  const result = await request<IConversionResult>('convert', signal, body);

  if (
    !['success', 'partial', 'blocked'].includes(result.status) ||
    !Array.isArray(result.issues) ||
    result.target !== body.target
  ) {
    throw new ConverterApiError(502);
  }

  validateArtifacts(result.artifacts);
  return result;
}
