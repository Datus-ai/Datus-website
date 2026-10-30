import { useEffect, useId, useState } from 'react';
import { ConfigProvider, theme } from 'antd';
import enUS from 'antd/locale/en_US';
import zhCN from 'antd/locale/zh_CN';
import { Allotment } from 'allotment';
import { ArrowRightLeft } from 'lucide-react';
import { useLocale } from '../../../../i18n/LocaleContext';
import { useConverterCopy } from '../../copy';
import { useWorkbench } from '../../hooks/use-workbench';
import { ConverterAppearanceContext, useWebsiteAppearance } from '../../theme';
import type { IDirection } from '../../utils/session';
import { Configuration } from '../configuration';
import { ImportConfiguration } from '../import-configuration';
import { SourceInput } from '../source-input';
import { ResultFiles } from '../result-files';
import { ResultToolbar } from '../result-toolbar';
import { Diagnostics } from '../diagnostics';
import { ConverterTips } from '../tips';
import '../../styles.css';

export function SemanticConverterWorkbench({initialDirection = 'export'}: {initialDirection?: IDirection} = {}) {
  const t = useConverterCopy();
  const locale = useLocale();
  const instanceId = useId();
  const appearance = useWebsiteAppearance();
  const state = useWorkbench(initialDirection);
  const { session, direction, busy } = state;
  const importing = direction === 'import';
  const result = session.result;
  const [stacked, setStacked] = useState(false);
  useEffect(() => {
    const media = window.matchMedia('(max-width: 900px)');
    const sync = () => setStacked(media.matches);
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);
  const onOption = (key: string, value?: string) =>
    state.update((old) => ({
      options: { ...old.options, [key]: value || undefined },
    }));
  const hasDiagnostics = Boolean(
    result && result.status !== 'success' && result.issues.length,
  );
  const source = (
    <SourceInput
      session={session}
      importing={importing}
      busy={busy}
      stale={state.stale}
      maxBytes={state.maxBytes}
      maxFiles={state.maxFiles}
      modelRoot={`inmemory://semantic-converter/${instanceId}/${direction}/source`}
      onUpdate={state.update}
      onFiles={state.setFiles}
      onExample={(id) => void state.loadExample(id)}
      onReading={state.setReading}
      confirm={state.confirm}
    />
  );
  const output = (
    <section className="sc-results" aria-label={t.results_status}>
      <div className="sc-panel-title">
        <strong>{t.results_status}</strong>
        <span className="sc-secondary">
          {importing ? t.fixed_target : state.selected?.label}
        </span>
      </div>
      {!result ? (
        <div className="sc-empty">{importing ? t.import_empty : t.empty}</div>
      ) : (
        <>
          <ResultToolbar
            result={result}
            targetLabel={
              importing
                ? t.fixed_target
                : (state.catalog?.targets.find(
                    (item) => item.id === result.target,
                  )?.label ?? result.target)
            }
            canExport={
              result.status !== 'blocked' &&
              Boolean(state.artifacts.length) &&
              !busy
            }
            busy={busy}
            downloading={state.downloading}
            onDiscard={() => void state.discard()}
            onDownload={() => void state.download()}
            importing={importing}
          />
          {state.stale && <ConverterTips>{t.snapshot_changed}</ConverterTips>}
          {result.status !== 'success' && (
            <ConverterTips
              type={result.status === 'blocked' ? 'error' : 'warning'}
            >
              {result.status === 'blocked' ? t.blocked_hint : t.review_hint}
            </ConverterTips>
          )}
          {hasDiagnostics && (
            <div
              className="sc-tabs"
              role="tablist"
              aria-label={t.results_status}
            >
              <button
                type="button"
                role="tab"
                aria-selected={session.view === 'files'}
                onClick={() => state.update({ view: 'files' })}
              >
                {t.files}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={session.view === 'diagnostics'}
                onClick={() => state.update({ view: 'diagnostics' })}
              >
                {t.diagnostics_total.replace(
                  '{{total}}',
                  String(result.issues.length),
                )}
              </button>
            </div>
          )}
          {hasDiagnostics && session.view === 'diagnostics' ? (
            <Diagnostics issues={result.issues} />
          ) : (
            <ResultFiles
              key={`${direction}/${session.generation}`}
              artifacts={state.artifacts}
              selectedPath={session.selectedPath}
              modelRoot={`inmemory://semantic-converter/${instanceId}/${direction}/${session.generation}`}
              readOnly={busy || result.status === 'blocked'}
              onSelect={(value) => state.update({ selectedPath: value })}
              onChange={(path, value) =>
                state.update((old) => ({
                  edits: { ...old.edits, [path]: value },
                }))
              }
            />
          )}
        </>
      )}
    </section>
  );

  return (
    <ConverterAppearanceContext.Provider value={appearance}>
    <ConfigProvider
      locale={locale === 'zh' ? zhCN : enUS}
      theme={{
        algorithm: appearance.dark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        components: {
          Button: { dangerColor: appearance.dark ? appearance.background : '#fff' },
        },
        token: {
          colorPrimary: appearance.brand,
          colorPrimaryBg: appearance.tint,
          colorPrimaryText: appearance.accent,
          colorLink: appearance.accent,
          colorBgBase: appearance.background,
          colorBgContainer: appearance.surface,
          colorBgElevated: appearance.surface,
          colorText: appearance.text,
          colorTextSecondary: appearance.secondary,
          colorTextPlaceholder: appearance.faint,
          colorBorder: appearance.border,
          colorBorderSecondary: appearance.line,
          colorSuccess: appearance.green,
          colorWarning: appearance.warning,
          colorError: appearance.danger,
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
        </header>
        <div
          className="sc-tabs sc-direction"
          role="tablist"
          aria-label={t.title}
        >
          {(['import', 'export'] as IDirection[]).map((side) => (
            <button
              key={side}
              type="button"
              role="tab"
              aria-selected={direction === side}
              disabled={busy}
              onClick={() => state.setDirection(side)}
            >
              {side === 'import' ? t.import_direction : t.export_direction}
            </button>
          ))}
        </div>
        {state.linkNotice && (
          <div className="sc-error" role="status">
            <ConverterTips type="warning">{t.invalid_link}</ConverterTips>
          </div>
        )}
        {(session.error ||
          (!state.validInput &&
            session.files.some((file) => file.content.trim()))) && (
          <div className="sc-error">
            <ConverterTips type="error">
              {session.error || t.invalid_bundle}
            </ConverterTips>
          </div>
        )}
        <div className="sc-body">
          {importing ? (
            <ImportConfiguration
              catalog={state.importCatalog}
              failed={state.catalogError}
              errorStatus={state.catalogErrorStatus}
              formatId={session.formatId}
              options={session.options}
              busy={busy}
              converting={state.converting}
              valid={state.validInput}
              onRetry={state.retry}
              onFormat={(id) => void state.changeFormat(id)}
              onOption={onOption}
              onConvert={() => void state.convert()}
              onCancel={state.cancel}
            />
          ) : (
            <Configuration
              catalog={state.catalog}
              catalogError={state.catalogError}
              targetId={session.formatId}
              options={session.options}
              info={state.info}
              busy={busy}
              converting={state.converting}
              validInput={state.validInput}
              onRetry={state.retry}
              onTargetChange={(id) => void state.changeFormat(id)}
              onOptionChange={onOption}
              onConvert={() => void state.convert()}
              onCancel={state.cancel}
            />
          )}
          <div className={`sc-editors${stacked ? ' sc-stacked' : ''}`}>
            {stacked ? (
              <>
                {source}
                {output}
              </>
            ) : (
              <Allotment>
                <Allotment.Pane minSize={280}>{source}</Allotment.Pane>
                <Allotment.Pane minSize={320}>{output}</Allotment.Pane>
              </Allotment>
            )}
          </div>
        </div>
        <div className="sc-source-notes">{t.privacy_hint}</div>
      </section>
      {state.contextHolder}
    </ConfigProvider>
    </ConverterAppearanceContext.Provider>
  );
}
