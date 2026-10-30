import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Modal } from 'antd';
import type { ICatalog, IImportCatalog, IImportFile } from '../contracts';
import {
  convertModel,
  importModel,
  getSources,
  getTargets,
  ConverterApiError,
} from '../api';
import { useConverterCopy } from '../copy';
import { SAMPLES } from '../samples';
import { importExample } from '../examples';
import {
  createSession,
  inputSnapshot,
  validSourceBundle,
} from '../utils/session';
import type { IDirection, ISession } from '../utils/session';
import { MAX_SOURCE_BYTES, inspectSource } from '../utils/source';
import { downloadArtifacts, workingArtifacts } from '../utils/artifacts';
import {
  readWorkbenchLink,
  resolveWorkbenchLink,
  workbenchUrl,
  type IWorkbenchLink,
} from '../utils/url-state';
import { replaceLocation } from '../../../lib/location-change';

export function useWorkbench(initialDirection: IDirection = 'export') {
  const t = useConverterCopy();
  const [modal, contextHolder] = Modal.useModal();
  const [direction, setDirection] = useState<IDirection>(initialDirection);
  const [sessions, setSessions] = useState<Record<IDirection, ISession>>(
    () => ({
      export: createSession(
        SAMPLES[0].target,
        [{ path: SAMPLES[0].filename, content: SAMPLES[0].source }],
        SAMPLES[0].id,
      ),
      import: createSession('cube', importExample('cube'), 'cube'),
    }),
  );
  const [catalog, setCatalog] = useState<ICatalog | null>(null);
  const [importCatalog, setImportCatalog] = useState<IImportCatalog | null>(
    null,
  );
  const [catalogErrors, setCatalogErrors] = useState({
    import: 0,
    export: 0,
  });
  const [attempt, setAttempt] = useState(0);
  const [link, setLink] = useState<IWorkbenchLink | null>(null);
  const [linkReady, setLinkReady] = useState(false);
  const [linkNotice, setLinkNotice] = useState(false);
  const appliedLink = useRef(false);
  const touched = useRef(new Set<IDirection>());
  const [converting, setConverting] = useState(false);
  const [reading, setReading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const controller = useRef<AbortController | null>(null);
  const mounted = useRef(true);
  const locked = useRef(false);
  const readingRef = useRef(false);
  const directionRef = useRef(direction);
  directionRef.current = direction;
  const session = sessions[direction];
  const busy = converting || reading || downloading;
  const update = useCallback(
    (
      change: Partial<ISession> | ((old: ISession) => Partial<ISession>),
      side: IDirection = directionRef.current,
    ) => {
      touched.current.add(side);
      setLinkReady(true);
      setLinkNotice(false);
      setSessions((old) => ({
        ...old,
        [side]: {
          ...old[side],
          ...(typeof change === 'function' ? change(old[side]) : change),
        },
      }));
    },
    [],
  );
  const info = useMemo(
    () =>
      inspectSource(
        session.files[0]?.content ?? '',
        session.options.model_name ?? undefined,
      ),
    [session.files, session.options.model_name],
  );
  const artifacts = useMemo(
    () => workingArtifacts(session.result?.artifacts ?? [], session.edits),
    [session.result, session.edits],
  );
  const limits =
    direction === 'import' ? importCatalog?.limits : catalog?.limits;
  const maxBytes = Math.min(
    limits?.input_bytes ?? MAX_SOURCE_BYTES,
    MAX_SOURCE_BYTES,
  );
  const maxFiles = Math.min(importCatalog?.limits.input_files ?? 50, 50);
  const selected =
    direction === 'import'
      ? importCatalog?.sources.find(
          (item) => item.id === session.formatId && item.available,
        )
      : catalog?.targets.find((item) => item.id === session.formatId);
  const validInput =
    direction === 'import'
      ? validSourceBundle(session.files, maxBytes, maxFiles)
      : Boolean(session.files[0]?.content.trim()) &&
        new TextEncoder().encode(session.files[0]?.content ?? '').length <=
          maxBytes;
  const dirty =
    Object.values(sessions).some(
      (value) => value.inputDirty || value.result?.artifacts.length,
    ) || converting;

  useEffect(() => {
    // Read only after hydration so prerendered markup stays deterministic.
    const requested = readWorkbenchLink(window.location.search, initialDirection);
    setLink(requested);
    setDirection(requested.direction);
    mounted.current = true;
    return () => {
      mounted.current = false;
      controller.current?.abort();
    };
  }, [initialDirection]);

  useEffect(() => {
    const abort = new AbortController();
    setCatalogErrors({ import: 0, export: 0 });
    void getTargets(abort.signal)
      .then((value) => {
        if (!abort.signal.aborted) {
          setCatalog(value);
        }
      })
      .catch((failure) => {
        if (!abort.signal.aborted) {
          setCatalogErrors((old) => ({
            ...old,
            export: failure instanceof ConverterApiError ? failure.status : -1,
          }));
        }
      });
    void getSources(abort.signal)
      .then((value) => {
        if (!abort.signal.aborted) {
          setImportCatalog(value);
        }
      })
      .catch((failure) => {
        if (!abort.signal.aborted) {
          setCatalogErrors((old) => ({
            ...old,
            import: failure instanceof ConverterApiError ? failure.status : -1,
          }));
        }
      });
    return () => abort.abort();
  }, [attempt]);

  useEffect(() => {
    if (!link || appliedLink.current) return;
    const available = link.direction === 'import' ? importCatalog : catalog;
    if (!available) return; // A failed request can be retried without losing the link.
    const resolved = resolveWorkbenchLink(link, available);
    appliedLink.current = true;
    if (resolved && !touched.current.has(link.direction)) {
      setSessions((old) => ({ ...old, [link.direction]: resolved.session }));
      setLinkNotice(resolved.invalid);
    }
    setLinkReady(true);
  }, [link, catalog, importCatalog]);

  useEffect(() => {
    if (linkReady && selected) {
      replaceLocation(workbenchUrl(window.location.href, direction, session));
    }
  }, [
    linkReady, direction, session.formatId, session.sampleId,
    session.inputDirty, selected,
  ]);

  useEffect(() => {
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };
    if (dirty) {
      window.addEventListener('beforeunload', handler);
    }
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirty]);

  async function confirm(
    kind: 'source' | 'results' | 'files' = 'results',
  ): Promise<boolean> {
    return Boolean(
      await modal.confirm({
        title:
          kind === 'files'
            ? t.replace_files_title
            : kind === 'source'
              ? t.replace_title
              : t.discard_title,
        content:
          kind === 'files'
            ? t.replace_files_hint
            : kind === 'source'
              ? t.replace_hint
              : t.discard_hint,
        okText: kind === 'results' ? t.discard : t.replace,
        cancelText: t.cancel,
        okButtonProps: { danger: true },
      }),
    );
  }

  async function loadExample(id: string) {
    if (locked.current || readingRef.current || downloading) {
      return;
    }
    if (
      (session.inputDirty || session.result?.artifacts.length) &&
      !(await confirm('source'))
    ) {
      return;
    }
    if (!mounted.current) {
      return;
    }
    if (direction === 'import') {
      const files = importExample(id);
      if (files.length) {
        update(createSession(id, files, id));
      }
    } else {
      const example = SAMPLES.find((item) => item.id === id);
      if (example) {
        update(
          createSession(
            example.target,
            [{ path: example.filename, content: example.source }],
            id,
          ),
        );
      }
    }
  }

  async function changeFormat(formatId: string) {
    if (
      locked.current ||
      readingRef.current ||
      downloading ||
      formatId === session.formatId
    ) {
      return;
    }
    if (
      (session.inputDirty || session.result?.artifacts.length) &&
      !(await confirm('source'))
    ) {
      return;
    }
    if (!mounted.current) {
      return;
    }
    const files =
      direction === 'import' && session.sampleId
        ? importExample(formatId)
        : session.files;
    update({
      ...createSession(
        formatId,
        files,
        direction === 'export'
          ? session.sampleId
          : session.sampleId && files.length
            ? formatId
            : undefined,
      ),
      inputDirty: session.inputDirty,
    });
  }

  async function convert() {
    if (locked.current || readingRef.current || !selected || !validInput) {
      return;
    }
    locked.current = true;
    const side = direction;
    // Capture input BEFORE confirmation and the async request; edits never mutate a pending request.
    const current = {
      ...session,
      files: session.files.map((file) => ({ ...file })),
      options: { ...session.options },
    };
    const abort = new AbortController();
    controller.current = abort;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let timedOut = false;
    try {
      if (current.result?.artifacts.length && !(await confirm())) {
        return;
      }
      if (abort.signal.aborted) {
        return;
      }
      setConverting(true);
      update({ error: '' }, side);
      timer = setTimeout(() => {
        timedOut = true;
        abort.abort();
      }, 45000);
      const options = Object.fromEntries(
        Object.entries(current.options).filter(
          ([key, value]) =>
            value &&
            (key === 'model_name' ||
              selected.options.some((option) => option.key === key)),
        ),
      );
      const result =
        side === 'import'
          ? await importModel(
              {
                source_format: current.formatId,
                files: current.files,
                options,
              },
              abort.signal,
            )
          : await convertModel(
              {
                source: current.files[0].content,
                target: current.formatId,
                options,
              },
              abort.signal,
            );
      if (!abort.signal.aborted) {
        update(
          (old) => ({
            result,
            snapshot: inputSnapshot(current),
            edits: {},
            selectedPath: result.artifacts[0]?.path ?? null,
            generation: old.generation + 1,
            view: result.status === 'success' ? 'files' : 'diagnostics',
          }),
          side,
        );
      }
    } catch (failure) {
      if (mounted.current && (!abort.signal.aborted || timedOut)) {
        update(
          {
            error:
              failure instanceof ConverterApiError && failure.status === 429
                ? t.rate_limited
                : failure instanceof ConverterApiError &&
                    [404, 502, 503, 504].includes(failure.status)
                  ? t.unavailable
                  : t.conversion_failed,
          },
          side,
        );
      }
    } finally {
      clearTimeout(timer);
      controller.current = null;
      locked.current = false;
      if (mounted.current) {
        setConverting(false);
      }
    }
  }

  async function download() {
    if (
      !session.result ||
      session.result.status === 'blocked' ||
      busy ||
      !artifacts.length
    ) {
      return;
    }
    setDownloading(true);
    try {
      const stem = (session.files[0]?.path.split('/').pop() ?? 'model')
        .replace(/\.[^.]+$/, '')
        .replace(/[^\p{L}\p{N}_-]/gu, '_');
      await downloadArtifacts(artifacts, `${stem}-${session.result.target}`);
    } catch {
      if (mounted.current) {
        update({ error: t.download_failed });
      }
    } finally {
      if (mounted.current) {
        setDownloading(false);
      }
    }
  }

  return {
    contextHolder,
    direction,
    session,
    catalog,
    importCatalog,
    linkNotice,
    catalogError: Boolean(catalogErrors[direction]),
    catalogErrorStatus: catalogErrors[direction],
    busy,
    converting,
    downloading,
    reading,
    validInput,
    maxBytes,
    maxFiles,
    info,
    artifacts,
    selected,
    stale: Boolean(
      session.snapshot && session.snapshot !== inputSnapshot(session),
    ),
    update,
    confirm,
    loadExample,
    changeFormat,
    convert,
    download,
    cancel: () => controller.current?.abort(),
    retry: () => setAttempt((old) => old + 1),
    setReading: (value: boolean) => {
      readingRef.current = value;
      setReading(value);
    },
    setDirection: (value: IDirection) => {
      if (!locked.current && !readingRef.current && !downloading) {
        setLinkReady(true);
        setLinkNotice(false);
        setDirection(value);
      }
    },
    setFiles: (files: IImportFile[]) =>
      update({
        files,
        selectedSource: files[0]?.path ?? null,
        sampleId: undefined,
        inputDirty: true,
        error: '',
      }),
    discard: async () => {
      if (!busy && (await confirm())) {
        update({ result: null, edits: {}, snapshot: '', error: '' });
      }
    },
  };
}
