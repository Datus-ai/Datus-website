import { Input, Select } from 'antd';
import {
  ArrowRightLeft,
  LockKeyhole,
  LoaderCircle,
  Database,
} from 'lucide-react';
import type { IImportCatalog, IImportOptions } from '../../contracts';
import { useConverterCopy } from '../../copy';
import { ConverterTips } from '../tips';
import { DialectLabel } from '../dialect-label';

export function ImportConfiguration({
  catalog,
  failed,
  errorStatus,
  formatId,
  options,
  busy,
  converting,
  valid,
  onRetry,
  onFormat,
  onOption,
  onConvert,
  onCancel,
}: {
  catalog: IImportCatalog | null;
  failed: boolean;
  errorStatus: number;
  formatId: string;
  options: IImportOptions;
  busy: boolean;
  converting: boolean;
  valid: boolean;
  onRetry: () => void;
  onFormat: (id: string) => void;
  onOption: (key: string, value?: string) => void;
  onConvert: () => void;
  onCancel: () => void;
}) {
  const t = useConverterCopy();
  const source = catalog?.sources.find(
    (item) => item.id === formatId && item.available,
  );
  const missing = source?.options.some(
    (option) =>
      option.required && !options[option.key as keyof IImportOptions]?.trim(),
  );

  return (
    <aside className="sc-configuration">
      <h3>{t.configuration}</h3>
      {failed ? (
        <div className="sc-catalog-error">
          <ConverterTips type="warning">
            {errorStatus === 404
              ? t.import_unavailable
              : errorStatus === 429
                ? t.rate_limited
                : t.import_catalog_failed}
          </ConverterTips>
          <button className="sc-button" type="button" onClick={onRetry}>
            {t.retry}
          </button>
        </div>
      ) : !catalog ? (
        <div className="sc-loading">
          <LoaderCircle size={16} className="sc-spin" />
        </div>
      ) : (
        <>
          <label className="sc-field">
            <span>
              {t.source_platform}
              <span className="sc-required">*</span>
            </span>
            <Select
              aria-label={t.source_platform}
              aria-required
              value={formatId}
              disabled={busy}
              onChange={onFormat}
              showSearch
              optionFilterProp="label"
              options={catalog.sources.map((item) => ({
                value: item.id,
                disabled: !item.available,
                label:
                  item.label.replace(/ — export only$/, '') +
                  (item.available ? '' : ` · ${t.export_only}`),
              }))}
            />
          </label>
          <label className="sc-field">
            <span>{t.target}</span>
            <div className="sc-fixed-target">
              <Database size={12} />
              {t.fixed_target}
              <LockKeyhole size={12} />
            </div>
          </label>
          <label className="sc-field">
            <span>
              {t.import_options.model_name}{' '}
              <span className="sc-secondary">{t.optional}</span>
            </span>
            <Input
              aria-label={t.import_options.model_name}
              disabled={busy}
              maxLength={200}
              value={options.model_name ?? ''}
              onChange={(event) => onOption('model_name', event.target.value)}
            />
          </label>
          {source?.options
            .filter((option) => option.key !== 'model_name')
            .map((option) => {
              const key = option.key as keyof typeof t.import_options;
              const label = t.import_options[key] ?? option.label;
              return (
                <label className="sc-field" key={key}>
                  <span>
                    {label}
                    {option.required ? (
                      <span className="sc-required">*</span>
                    ) : (
                      <span className="sc-secondary"> {t.optional}</span>
                    )}
                  </span>
                  {key === 'sql_dialect' ? (
                    <Select
                      aria-label={label}
                      aria-required={option.required}
                      allowClear
                      showSearch
                      disabled={busy}
                      value={options.sql_dialect ?? undefined}
                      onChange={(value) => onOption(key, value)}
                      options={[
                        'ANSI_SQL',
                        'SNOWFLAKE',
                        'BIGQUERY',
                        'DATABRICKS',
                        'POSTGRES',
                        'STARROCKS',
                      ].map((value) => ({
                        value,
                        label: <DialectLabel dialect={value} />,
                      }))}
                    />
                  ) : (
                    <Input
                      aria-label={label}
                      aria-required={option.required}
                      maxLength={200}
                      disabled={busy}
                      value={options[key] ?? ''}
                      onChange={(event) => onOption(key, event.target.value)}
                    />
                  )}
                  <span className="sc-hint">
                    {t.import_option_hints[
                      key as keyof typeof t.import_option_hints
                    ] ?? option.description}
                  </span>
                </label>
              );
            })}
          {!!source?.limitations.length && (
            <ConverterTips>
              <strong>{t.source_notes}</strong>
              {source.limitations.map((note) => (
                <p key={note}>{note}</p>
              ))}
            </ConverterTips>
          )}
          <ConverterTips>{t.import_snapshot_hint}</ConverterTips>
          <button
            type="button"
            className="sc-button sc-primary"
            disabled={busy || !valid || !source || missing}
            onClick={onConvert}
          >
            {busy ? (
              <LoaderCircle size={12} className="sc-spin" />
            ) : (
              <ArrowRightLeft size={12} />
            )}
            {busy ? t.converting : t.convert}
          </button>
          {converting && (
            <button type="button" className="sc-button" onClick={onCancel}>
              {t.cancel_conversion}
            </button>
          )}
        </>
      )}
    </aside>
  );
}
