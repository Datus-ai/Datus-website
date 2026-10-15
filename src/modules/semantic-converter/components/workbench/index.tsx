import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { ConfigProvider, Modal, theme } from 'antd';
import enUS from 'antd/locale/en_US';
import zhCN from 'antd/locale/zh_CN';
import { ArrowRightLeft } from 'lucide-react';
import { useLocale } from '../../../../i18n/LocaleContext';
import type {
  ICatalog,
  IConversionOptions,
  IConversionRequest,
  IConversionResult,
} from '../../contracts';
import { ConverterApiError, convertModel, getTargets } from '../../api';
import { useConverterCopy } from '../../copy';
import { SAMPLES } from '../../samples';
import { MAX_SOURCE_BYTES, inspectSource } from '../../utils/source';
import { downloadArtifacts, workingArtifacts } from '../../utils/artifacts';
import { Configuration } from '../configuration';
import { SourceInput } from '../source-input';
import { ResultFiles } from '../result-files';
import { ResultToolbar } from '../result-toolbar';
import { Diagnostics } from '../diagnostics';
import { ConverterTips } from '../tips';
import '../../styles.css';

interface IConfirmation {
  kind: 'source' | 'results';
  action: () => void;
}

const DEFAULT_SAMPLE = SAMPLES[0];

export function SemanticConverterWorkbench() {
  const t = useConverterCopy();
  const locale = useLocale();
  const instanceId = useId();
  const [source, setSource] = useState(DEFAULT_SAMPLE.source);
  const [sourceName, setSourceName] = useState(DEFAULT_SAMPLE.filename);
  const [sampleId, setSampleId] = useState<string | undefined>(DEFAULT_SAMPLE.id);
  const [catalog, setCatalog] = useState<ICatalog | null>(null);
  const [catalogError, setCatalogError] = useState(false);
  const [catalogAttempt, setCatalogAttempt] = useState(0);
  const [targetId, setTargetId] = useState(DEFAULT_SAMPLE.target);
  const [options, setOptions] = useState<IConversionOptions>({});
  const [result, setResult] = useState<IConversionResult | null>(null);
  const [resultRequest, setResultRequest] = useState('');
  const [resultSourceName, setResultSourceName] = useState('source.yml');
  const [generation, setGeneration] = useState(0);
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [view, setView] = useState<'files' | 'diagnostics'>('files');
  const [busy, setBusy] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');
  const [confirmation, setConfirmation] = useState<IConfirmation | null>(null);
  const conversion = useRef<AbortController | null>(null);
  const uploadVersion = useRef(0);
  const mounted = useRef(true);
  const info = useMemo(
    () => inspectSource(source, options.model_name ?? undefined),
    [source, options.model_name],
  );
  const target = catalog?.targets.find((item) => item.id === targetId);
  const artifacts = useMemo(
    () => workingArtifacts(result?.artifacts ?? [], edits),
    [result, edits],
  );
  const inputBytes = new TextEncoder().encode(source).length;
  const inputLimit = Math.min(
    catalog?.limits.input_bytes ?? MAX_SOURCE_BYTES,
    MAX_SOURCE_BYTES,
  );
  const validInput = Boolean(source.trim()) && inputBytes <= inputLimit;
  const request = useMemo<IConversionRequest>(
    () => ({
      source,
      target: targetId,
      options: Object.fromEntries(
        Object.entries(options).filter(
          ([key, value]) =>
            value &&
            (key === 'model_name' ||
              target?.options.some((option) => option.key === key)),
        ),
      ),
    }),
    [source, targetId, options, target],
  );
  const hasResults = Boolean(result?.artifacts.length);
  const hasSourceEdits =
    source !== (SAMPLES.find((item) => item.id === sampleId)?.source ?? '');
  const snapshotChanged = Boolean(
    result && resultRequest !== JSON.stringify(request),
  );
  const hasDiagnostics = Boolean(
    result && result.status !== 'success' && result.issues.length,
  );
  const canExport = Boolean(
    result && result.status !== 'blocked' && artifacts.length && !busy,
  );

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
      uploadVersion.current += 1;
      conversion.current?.abort();
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setCatalogError(false);

    getTargets(controller.signal)
      .then((value) => {
        if (!controller.signal.aborted) {
          setCatalog(value);
          setTargetId((previous) =>
            value.targets.some((item) => item.id === previous)
              ? previous
              : value.targets[0].id,
          );
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setCatalogError(true);
        }
      });

    return () => controller.abort();
  }, [catalogAttempt]);

  useEffect(() => {
    function beforeUnload(event: BeforeUnloadEvent) {
      event.preventDefault();
      event.returnValue = '';
    }

    if (hasSourceEdits || hasResults || busy) {
      window.addEventListener('beforeunload', beforeUnload);
    }

    return () => window.removeEventListener('beforeunload', beforeUnload);
  }, [hasSourceEdits, hasResults, busy]);

  function selectTarget(value: string) {
    setTargetId(value);
    setOptions({});
  }

  function replaceSource(action: () => void) {
    if (source && hasSourceEdits) {
      setConfirmation({ kind: 'source', action });
    } else {
      action();
    }
  }

  function loadSample(id: string) {
    const sample = SAMPLES.find((item) => item.id === id);

    if (!sample) {
      return;
    }

    replaceSource(() => {
      setSource(sample.source);
      setSourceName(sample.filename);
      setSampleId(id);
      setError('');
      selectTarget(sample.target);
    });
  }

  async function upload(file: File) {
    const version = ++uploadVersion.current;

    if (!/\.ya?ml$/i.test(file.name)) {
      setError(t.file_type);
      return;
    }

    if (file.size > inputLimit) {
      setError(t.source_too_large);
      return;
    }

    try {
      const content = await file.text();

      if (!mounted.current || version !== uploadVersion.current) {
        return;
      }

      if (new TextEncoder().encode(content).length > inputLimit) {
        setError(t.source_too_large);
        return;
      }

      replaceSource(() => {
        setSource(content);
        setSourceName(file.name);
        setSampleId(undefined);
        setOptions({});
        setError('');
      });
    } catch {
      if (mounted.current && version === uploadVersion.current) {
        setError(t.upload_failed);
      }
    }
  }

  async function convert() {
    if (conversion.current || !target || !validInput) {
      return;
    }

    // Capture the source and settings once, before starting the request.
    const snapshot = { ...request, options: { ...request.options } };
    const snapshotName = sourceName;
    const controller = new AbortController();
    conversion.current = controller;
    setBusy(true);
    setError('');
    let timedOut = false;
    const timer = window.setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, 45000);

    try {
      const value = await convertModel(snapshot, controller.signal);

      if (!controller.signal.aborted) {
        setResult(value);
        setResultSourceName(snapshotName);
        setResultRequest(JSON.stringify(snapshot));
        setGeneration((previous) => previous + 1);
        setEdits({});
        setSelectedPath(value.artifacts[0]?.path ?? null);
        setView(value.status === 'blocked' ? 'diagnostics' : 'files');
      }
    } catch (failure) {
      if (mounted.current && (!controller.signal.aborted || timedOut)) {
        setError(
          failure instanceof ConverterApiError && failure.status === 429
            ? t.rate_limited
            : failure instanceof ConverterApiError &&
                [404, 502, 503, 504].includes(failure.status)
              ? t.unavailable
              : t.conversion_failed,
        );
      }
    } finally {
      window.clearTimeout(timer);
      conversion.current = null;

      if (mounted.current) {
        setBusy(false);
      }
    }
  }

  function requestConversion() {
    if (hasResults) {
      setConfirmation({
        kind: 'results',
        action: () => {
          void convert();
        },
      });
    } else {
      void convert();
    }
  }

  async function download() {
    if (!canExport || downloading) {
      return;
    }

    setDownloading(true);

    try {
      const stem = resultSourceName
        .replace(/\.ya?ml$/i, '')
        .replace(/[^\p{L}\p{N}_-]/gu, '_');
      await downloadArtifacts(artifacts, `${stem}-${result!.target}`);
    } catch {
      if (mounted.current) {
        setError(t.download_failed);
      }
    } finally {
      if (mounted.current) {
        setDownloading(false);
      }
    }
  }

  function discard() {
    setConfirmation({
      kind: 'results',
      action: () => {
        setResult(null);
        setResultRequest('');
        setEdits({});
        setSelectedPath(null);
        setView('files');
        setError('');
      },
    });
  }

  return (
    <ConfigProvider
      locale={locale === 'zh' ? zhCN : enUS}
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#6b5cff',
          colorBgContainer: '#0b1230',
          colorBgElevated: '#0e1638',
          colorText: '#eef1ff',
          colorTextSecondary: '#8a93c4',
          colorBorder: 'rgba(124, 137, 196, 0.28)',
          fontSize: 12,
          borderRadius: 6,
          controlHeight: 30,
          fontFamily: 'Inter, system-ui, sans-serif',
        },
      }}
    >
      <section className="semantic-converter" aria-label={t.title}>
        <header className="sc-heading">
          <ArrowRightLeft size={13} />
          <strong>{t.title}</strong>
          <span title={sourceName}>{sourceName}</span>
        </header>
        <SourceInput
          source={source}
          sourceName={sourceName}
          sampleId={sampleId}
          busy={busy}
          onChange={setSource}
          onSample={loadSample}
          onUpload={(file) => {
            void upload(file);
          }}
        />
        {(error || inputBytes > inputLimit) && (
          <div className="sc-error">
            <ConverterTips type="error">
              {inputBytes > inputLimit ? t.source_too_large : error}
            </ConverterTips>
          </div>
        )}
        <div className="sc-body">
          <Configuration
            catalog={catalog}
            catalogError={catalogError}
            targetId={targetId}
            options={options}
            info={info}
            busy={busy}
            validInput={validInput}
            onRetry={() => setCatalogAttempt((previous) => previous + 1)}
            onTargetChange={selectTarget}
            onOptionChange={(key, value) =>
              setOptions((previous) => ({
                ...previous,
                [key]: value || undefined,
              }))
            }
            onConvert={requestConversion}
            onCancel={() => conversion.current?.abort()}
          />
          <div className="sc-results" aria-label={t.results_status}>
            {!result ? (
              <div className="sc-empty">{t.empty}</div>
            ) : (
              <>
                <ResultToolbar
                  result={result}
                  targetLabel={
                    catalog?.targets.find((item) => item.id === result.target)
                      ?.label ?? result.target
                  }
                  canExport={canExport}
                  busy={busy}
                  downloading={downloading}
                  onDiscard={discard}
                  onDownload={() => {
                    void download();
                  }}
                />
                {snapshotChanged && (
                  <ConverterTips>{t.snapshot_changed}</ConverterTips>
                )}
                {result.status !== 'success' && (
                  <ConverterTips
                    type={result.status === 'blocked' ? 'error' : 'warning'}
                  >
                    {result.status === 'blocked'
                      ? t.blocked_hint
                      : t.review_hint}
                  </ConverterTips>
                )}
                {hasDiagnostics && (
                  <div className="sc-tabs" role="tablist">
                    <button
                      type="button"
                      role="tab"
                      aria-selected={view === 'files'}
                      onClick={() => setView('files')}
                    >
                      {t.files}
                    </button>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={view === 'diagnostics'}
                      onClick={() => setView('diagnostics')}
                    >
                      {t.diagnostics_total.replace(
                        '{{total}}',
                        String(result.issues.length),
                      )}
                    </button>
                  </div>
                )}
                {hasDiagnostics && view === 'diagnostics' ? (
                  <Diagnostics issues={result.issues} />
                ) : (
                  <ResultFiles
                    key={generation}
                    artifacts={artifacts}
                    selectedPath={selectedPath}
                    modelRoot={`inmemory://semantic-converter/${instanceId}/${generation}`}
                    readOnly={busy || result.status === 'blocked'}
                    onSelect={setSelectedPath}
                    onChange={(path, value) =>
                      setEdits((previous) => ({ ...previous, [path]: value }))
                    }
                  />
                )}
              </>
            )}
          </div>
        </div>
      </section>
      <Modal
        title={
          confirmation?.kind === 'source' ? t.replace_title : t.discard_title
        }
        open={Boolean(confirmation)}
        onCancel={() => setConfirmation(null)}
        onOk={() => {
          const action = confirmation?.action;
          setConfirmation(null);
          action?.();
        }}
        okText={confirmation?.kind === 'source' ? t.replace : t.discard}
        cancelText={t.cancel}
        okButtonProps={{ danger: confirmation?.kind === 'results' }}
        destroyOnHidden
      >
        <p>
          {confirmation?.kind === 'source' ? t.replace_hint : t.discard_hint}
        </p>
      </Modal>
    </ConfigProvider>
  );
}
