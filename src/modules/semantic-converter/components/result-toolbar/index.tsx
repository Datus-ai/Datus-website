import { Popover } from 'antd';
import { Download, Info, LoaderCircle, Trash2 } from 'lucide-react';
import type { IConversionResult } from '../../contracts';
import { useConverterCopy } from '../../copy';
import { ConverterTips } from '../tips';

export function ResultToolbar({
  result,
  targetLabel,
  canExport,
  busy,
  downloading,
  onDiscard,
  onDownload,
}: {
  result: IConversionResult;
  targetLabel: string;
  canExport: boolean;
  busy: boolean;
  downloading: boolean;
  onDiscard: () => void;
  onDownload: () => void;
}) {
  const t = useConverterCopy();

  return (
    <div className="sc-result-toolbar">
      <div className="sc-result-metadata">
        <div className="sc-summary">
          <span className={`sc-tag sc-${result.status}`}>
            {t.status[result.status]}
          </span>
          <strong>{targetLabel}</strong>
          <span className="sc-secondary">
            {t.files_total.replace(
              '{{total}}',
              String(result.artifacts.length),
            )}
          </span>
        </div>
        {!!result.artifacts.length && (
          <div className="sc-save-state">
            <span className="sc-dot" />
            {t.temporary}
            <Popover
              trigger="click"
              placement="bottomLeft"
              title={t.result_details}
              content={
                <div className="sc-details">
                  <ConverterTips>{t.temporary_hint}</ConverterTips>
                  <ConverterTips>{t.validation_hint}</ConverterTips>
                </div>
              }
            >
              <button
                type="button"
                className="sc-info"
                aria-label={t.result_details}
              >
                <Info size={12} />
              </button>
            </Popover>
          </div>
        )}
      </div>
      <div className="sc-actions">
        <button
          type="button"
          className="sc-button sc-danger"
          disabled={busy || downloading}
          onClick={onDiscard}
        >
          <Trash2 size={12} />
          {t.discard}
        </button>
        <button
          type="button"
          className="sc-button"
          disabled={!canExport || downloading}
          onClick={onDownload}
        >
          {downloading ? (
            <LoaderCircle size={12} className="sc-spin" />
          ) : (
            <Download size={12} />
          )}
          {t.download}
        </button>
      </div>
    </div>
  );
}
