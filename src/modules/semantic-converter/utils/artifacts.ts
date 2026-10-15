import type { IArtifact } from '../contracts';

export function safeRelativePath(path: string): boolean {
  return (
    Boolean(path) &&
    !/^[/.]|[\\\x00-\x1f\x7f:]/.test(path) &&
    path
      .split('/')
      .every(
        (part) =>
          Boolean(part) &&
          part !== '.' &&
          part !== '..' &&
          !part.startsWith('.'),
      )
  );
}

export function validateArtifacts(artifacts: IArtifact[]): void {
  if (!Array.isArray(artifacts) || artifacts.length > 500) {
    throw new Error('invalid_export');
  }

  let bytes = 0;
  const paths = new Set<string>();

  for (const artifact of artifacts) {
    if (
      typeof artifact.path !== 'string' ||
      !safeRelativePath(artifact.path) ||
      typeof artifact.content !== 'string' ||
      paths.has(artifact.path.toLowerCase())
    ) {
      throw new Error('invalid_export');
    }

    paths.add(artifact.path.toLowerCase());
    bytes += new TextEncoder().encode(artifact.content).length;
  }

  if (bytes > 10 * 1024 * 1024) {
    throw new Error('invalid_export');
  }
}

export function workingArtifacts(
  artifacts: IArtifact[],
  edits: Record<string, string>,
): IArtifact[] {
  return artifacts.map((file) => ({
    ...file,
    content: edits[file.path] ?? file.content,
  }));
}

export async function downloadArtifacts(
  artifacts: IArtifact[],
  archiveName: string,
): Promise<void> {
  validateArtifacts(artifacts);

  if (!artifacts.length) {
    throw new Error('invalid_export');
  }

  let blob: Blob;
  let filename: string;

  if (artifacts.length === 1) {
    blob = new Blob([artifacts[0].content], {
      type: 'text/plain;charset=utf-8',
    });
    filename = artifacts[0].path.split('/').pop()!;
  } else {
    const { default: JSZip } = await import('jszip');
    const zip = new JSZip();

    for (const file of artifacts) {
      zip.file(file.path, file.content);
    }

    blob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE' });
    filename = `${archiveName}.zip`;
  }

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);

  try {
    link.click();
  } finally {
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 30000);
  }
}
