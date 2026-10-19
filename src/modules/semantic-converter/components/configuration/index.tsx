import { Input, Select } from 'antd';
import { ArrowRightLeft, LoaderCircle, X } from 'lucide-react';
import type { ICatalog, IConversionOptions } from '../../contracts';
import { useConverterCopy } from '../../copy';
import { inspectSource } from '../../utils/source';
import { ConverterTips } from '../tips';
import { DialectLabel } from '../dialect-label';

interface IConfigurationProps {
  catalog: ICatalog | null;
  catalogError: boolean;
  targetId: string;
  options: IConversionOptions;
  info: ReturnType<typeof inspectSource>;
  busy: boolean;
  converting: boolean;
  validInput: boolean;
  onRetry: () => void;
  onTargetChange: (target: string) => void;
  onOptionChange: (key: string, value?: string) => void;
  onConvert: () => void;
  onCancel: () => void;
}

export function Configuration(props: IConfigurationProps) {
  const {
    catalog,
    catalogError,
    targetId,
    options,
    info,
    busy,
    converting,
    validInput,
    onRetry,
    onTargetChange,
    onOptionChange,
    onConvert,
    onCancel,
  } = props;
  const t = useConverterCopy();
  const target = catalog?.targets.find((item) => item.id === targetId);
  const missing = target?.options.some(
    (option) =>
      option.required &&
      !options[option.key as keyof IConversionOptions]?.trim(),
  );

  function label(key: string, fallback: string): string {
    return t.options[key as keyof typeof t.options] ?? fallback;
  }

  return (
    <aside className="sc-configuration">
      <h3>{t.configuration}</h3>
      {catalogError ? (
        <div className="sc-catalog-error">
          <ConverterTips type="error">{t.catalog_failed}</ConverterTips>
          <button type="button" className="sc-button" onClick={onRetry}>
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
              {t.target}
              <span className="sc-required" aria-hidden="true">
                *
              </span>
            </span>
            <Select
              aria-label={t.target}
              aria-required
              value={targetId || undefined}
              onChange={onTargetChange}
              disabled={busy}
              showSearch
              optionFilterProp="label"
              options={catalog.targets.map((item) => ({
                value: item.id,
                label: item.label,
              }))}
            />
          </label>
          {info.models.length > 1 && (
            <label className="sc-field">
              <span>
                {t.options.model_name}
                <span className="sc-required" aria-hidden="true">
                  *
                </span>
              </span>
              <Select
                aria-label={t.options.model_name}
                aria-required
                placeholder={t.select_model}
                value={options.model_name ?? undefined}
                disabled={busy}
                onChange={(value) => {
                  onOptionChange('model_name', value);
                  onOptionChange('base_dataset');
                }}
                options={info.models.map((name) => ({
                  value: name,
                  label: name,
                }))}
              />
            </label>
          )}
          {target?.options.map((option) => {
            const name = label(option.key, option.label);
            const key = option.key as keyof IConversionOptions;
            return (
              <label className="sc-field" key={key}>
                <span>
                  {name}
                  {option.required && (
                    <span className="sc-required" aria-hidden="true">
                      *
                    </span>
                  )}
                </span>
                {key === 'base_dataset' ? (
                  <Select
                    aria-label={name}
                    aria-required={option.required}
                    placeholder={t.automatic}
                    allowClear
                    value={options[key] ?? undefined}
                    disabled={busy}
                    onChange={(value) => onOptionChange(key, value)}
                    options={info.datasets.map((value) => ({
                      value,
                      label: value,
                    }))}
                  />
                ) : key === 'sql_dialect' ? (
                  <Select
                    aria-label={name}
                    aria-required={option.required}
                    placeholder={t.automatic}
                    allowClear
                    showSearch
                    optionFilterProp="value"
                    value={options[key] ?? undefined}
                    disabled={busy}
                    onChange={(value) => onOptionChange(key, value)}
                    options={[
                      ...new Set([
                        ...info.dialects,
                        'ANSI_SQL',
                        'SNOWFLAKE',
                        'BIGQUERY',
                        'DATABRICKS',
                        'STARROCKS',
                        'POSTGRES',
                      ]),
                    ].map((value) => ({
                      value,
                      label: <DialectLabel dialect={value} />,
                    }))}
                  />
                ) : (
                  <Input
                    aria-label={name}
                    aria-required={option.required}
                    value={options[key] ?? ''}
                    disabled={busy}
                    maxLength={key.startsWith('powerbi_') ? 100 : 200}
                    onChange={(event) =>
                      onOptionChange(key, event.target.value)
                    }
                  />
                )}
                {key === 'base_dataset' && (
                  <span className="sc-hint">{t.base_hint}</span>
                )}
                {key === 'sql_dialect' && (
                  <span className="sc-hint">{t.dialect_hint}</span>
                )}
              </label>
            );
          })}
          {!!target?.limitations.length && (
            <ConverterTips>
              <strong>{t.target_notes}</strong>
              {target.limitations.map((note) => (
                <p key={note}>{note}</p>
              ))}
            </ConverterTips>
          )}
          <ConverterTips>{t.snapshot_hint}</ConverterTips>
          <button
            type="button"
            className="sc-button sc-primary"
            disabled={
              busy ||
              !target ||
              !validInput ||
              missing ||
              (info.models.length > 1 && !options.model_name)
            }
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
              <X size={12} />
              {t.cancel_conversion}
            </button>
          )}
        </>
      )}
    </aside>
  );
}
