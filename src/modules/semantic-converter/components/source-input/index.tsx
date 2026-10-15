import { useRef, type ChangeEvent } from 'react';
import { Select } from 'antd';
import { ExternalLink, Upload } from 'lucide-react';
import { useConverterCopy } from '../../copy';
import { SAMPLES, UPSTREAM_REVISION } from '../../samples';
import { ConverterEditor } from '../editor';

interface ISourceInputProps {
  source: string;
  sourceName: string;
  sampleId?: string;
  busy: boolean;
  onChange: (source: string) => void;
  onSample: (id: string) => void;
  onUpload: (file: File) => void;
}

export function SourceInput({
  source,
  sourceName,
  sampleId,
  busy,
  onChange,
  onSample,
  onUpload,
}: ISourceInputProps) {
  const t = useConverterCopy();
  const upload = useRef<HTMLInputElement>(null);
  const sample = SAMPLES.find((item) => item.id === sampleId);

  function readUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (file) {
      onUpload(file);
    }
  }

  return (
    <div className="sc-source">
      <div className="sc-source-bar">
        <strong>{t.source}</strong>
        <span className="sc-secondary sc-source-name" title={sourceName}>
          {sourceName}
        </span>
        <div className="sc-source-actions">
          <Select
            aria-label={t.examples}
            placeholder={t.choose_example}
            value={sampleId}
            disabled={busy}
            onChange={onSample}
            options={SAMPLES.map((item) => ({
              value: item.id,
              label: item.label,
            }))}
          />
          <button
            type="button"
            className="sc-button"
            disabled={busy}
            onClick={() => upload.current?.click()}
          >
            <Upload size={12} />
            {t.upload}
          </button>
          <input
            ref={upload}
            type="file"
            accept=".yml,.yaml,text/yaml,application/yaml"
            hidden
            onChange={readUpload}
          />
        </div>
      </div>
      <div className="sc-source-editor">
        <ConverterEditor
          label={t.source}
          placeholder={t.source_placeholder}
          value={source}
          path="inmemory://semantic-converter/source.yml"
          onChange={onChange}
        />
      </div>
      <div className="sc-source-notes">
        <span>{t.privacy_hint}</span>
        {sample && (
          <a
            href={`https://github.com/apache/ossie/blob/${UPSTREAM_REVISION}/${sample.path}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink size={11} />
            {t.source_link}
          </a>
        )}
        {sampleId === 'retail' && <span>{t.retail_hint}</span>}
      </div>
    </div>
  );
}
