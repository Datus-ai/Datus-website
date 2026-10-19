import { useEffect, useRef, useState } from 'react';
import { Dropdown, Input, Modal, Select } from 'antd';
import { ExternalLink, FilePlus2, Plus, Trash2, Upload } from 'lucide-react';
import type { IImportFile } from '../../contracts';
import type { ISession } from '../../utils/session';
import { validSourceBundle } from '../../utils/session';
import { safeRelativePath } from '../../utils/artifacts';
import { useConverterCopy } from '../../copy';
import { SAMPLES, UPSTREAM_REVISION } from '../../samples';
import { IMPORT_EXAMPLES } from '../../examples';
import { ConverterEditor } from '../editor';
import { ConverterTips } from '../tips';

export function SourceInput({
  session,
  importing,
  busy,
  stale,
  maxBytes,
  maxFiles,
  modelRoot,
  onUpdate,
  onFiles,
  onExample,
  onReading,
  confirm,
}: {
  session: ISession;
  importing: boolean;
  busy: boolean;
  stale: boolean;
  maxBytes: number;
  maxFiles: number;
  modelRoot: string;
  onUpdate: (change: Partial<ISession>) => void;
  onFiles: (files: IImportFile[]) => void;
  onExample: (id: string) => void;
  onReading: (value: boolean) => void;
  confirm: (kind?: 'source' | 'results' | 'files') => Promise<boolean>;
}) {
  const t = useConverterCopy();
  const fileInput = useRef<HTMLInputElement>(null);
  const folderInput = useRef<HTMLInputElement>(null);
  const active = useRef(true);
  const reading = useRef(false);
  const [pasteOpen, setPasteOpen] = useState(false);
  const [path, setPath] = useState('model.yml');
  const [content, setContent] = useState('');
  const selected =
    session.files.find((file) => file.path === session.selectedSource) ??
    session.files[0];
  const sample =
    !importing && SAMPLES.find((item) => item.id === session.sampleId);

  useEffect(() => {
    active.current = true;
    return () => {
      active.current = false;
    };
  }, []);

  async function merge(incoming: IImportFile[]) {
    if (!incoming.length || !active.current) {
      return false;
    }
    const replace = incoming.some((file) =>
      session.files.some(
        (old) => old.path.toLowerCase() === file.path.toLowerCase(),
      ),
    );
    if (
      (replace ||
        (!importing &&
          (session.inputDirty || session.result?.artifacts.length))) &&
      !(await confirm('files'))
    ) {
      return false;
    }
    if (!active.current) {
      return false;
    }
    const files = importing
      ? [
          ...session.files.filter(
            (file) =>
              !incoming.some(
                (next) => next.path.toLowerCase() === file.path.toLowerCase(),
              ),
          ),
          ...incoming,
        ]
      : incoming;
    if (!validSourceBundle(files, maxBytes, importing ? maxFiles : 1)) {
      onUpdate({ error: t.invalid_bundle });
      return false;
    }
    onFiles(files);
    onUpdate({ selectedSource: incoming[0].path });
    return true;
  }

  async function upload(list: FileList | null) {
    if (!list || busy || reading.current) {
      return;
    }
    const incoming = Array.from(list);
    if (
      incoming.length > (importing ? maxFiles : 1) ||
      incoming.reduce(
        (total, file) =>
          total +
          file.size +
          new TextEncoder().encode(file.webkitRelativePath || file.name).length,
        0,
      ) > maxBytes ||
      incoming.some(
        (file) =>
          !(importing ? /\.(ya?ml|json|bim|tml)$/i : /\.ya?ml$/i).test(
            file.name,
          ),
      )
    ) {
      onUpdate({ error: t.invalid_bundle });
      return;
    }
    reading.current = true;
    onReading(true);
    try {
      const files = await Promise.all(
        incoming.map(async (file) => ({
          path: file.webkitRelativePath || file.name,
          content: await file.text(),
        })),
      );
      // Reject duplicate paths in the incoming batch before merge can conceal them.
      if (!validSourceBundle(files, maxBytes, importing ? maxFiles : 1)) {
        onUpdate({ error: t.invalid_bundle });
        return;
      }
      await merge(files);
    } catch {
      if (active.current) {
        onUpdate({ error: t.upload_failed });
      }
    } finally {
      reading.current = false;
      if (active.current) {
        onReading(false);
      }
    }
  }

  return (
    <section className="sc-source" aria-label={t.source_files}>
      <div className="sc-panel-title">
        <strong>{t.source_files}</strong>
        <span className="sc-secondary">{session.files.length}</span>
        {session.sampleId && <span className="sc-tag">{t.example}</span>}
      </div>
      <div className="sc-source-actions">
        <Select
          aria-label={importing ? t.import_examples : t.examples}
          value={session.sampleId}
          placeholder={t.choose_example}
          disabled={busy}
          onChange={onExample}
          options={
            importing
              ? IMPORT_EXAMPLES.map((item) => ({
                  value: item.id,
                  label:
                    t.import_labels[item.id as keyof typeof t.import_labels],
                }))
              : SAMPLES.map((item) => ({ value: item.id, label: item.label }))
          }
        />
        {importing ? (
          <>
            <Dropdown
              trigger={['click']}
              menu={{
                items: [
                  { key: 'files', label: t.choose_files },
                  { key: 'folder', label: t.choose_folder },
                ],
                onClick: ({ key }) =>
                  key === 'files'
                    ? fileInput.current?.click()
                    : folderInput.current?.click(),
              }}
            >
              <button type="button" className="sc-button" disabled={busy}>
                <Plus size={12} />
                {t.add_files}
              </button>
            </Dropdown>
            <button
              type="button"
              className="sc-button"
              disabled={busy}
              onClick={() => setPasteOpen(true)}
            >
              <FilePlus2 size={12} />
              {t.paste_code}
            </button>
          </>
        ) : (
          <button
            type="button"
            className="sc-button"
            disabled={busy}
            onClick={() => fileInput.current?.click()}
          >
            <Upload size={12} />
            {t.upload}
          </button>
        )}
        <input
          ref={fileInput}
          type="file"
          multiple={importing}
          hidden
          accept={importing ? '.yml,.yaml,.json,.bim,.tml' : '.yml,.yaml'}
          onChange={(event) => {
            void upload(event.target.files);
            event.target.value = '';
          }}
        />
        <input
          ref={(element) => {
            folderInput.current = element;
            element?.setAttribute('webkitdirectory', '');
          }}
          type="file"
          multiple
          hidden
          onChange={(event) => {
            void upload(event.target.files);
            event.target.value = '';
          }}
        />
      </div>
      {selected ? (
        <>
          <div className="sc-source-file-bar">
            <Select
              aria-label={t.choose_source_file}
              value={selected.path}
              onChange={(value) => onUpdate({ selectedSource: value })}
              disabled={busy}
              options={session.files.map((file) => ({
                value: file.path,
                label: file.path,
              }))}
            />
            {importing && (
              <button
                type="button"
                className="sc-info sc-danger"
                aria-label={t.remove_source}
                disabled={busy}
                onClick={() =>
                  onFiles(
                    session.files.filter((file) => file.path !== selected.path),
                  )
                }
              >
                <Trash2 size={12} />
              </button>
            )}
          </div>
          <div className="sc-source-editor">
            <ConverterEditor
              label={t.source_files}
              value={selected.content}
              path={`${modelRoot}/${selected.path}`}
              language={/\.(json|bim)$/i.test(selected.path) ? 'json' : 'yaml'}
              readOnly={busy}
              onChange={(value) =>
                onUpdate({
                  files: session.files.map((file) =>
                    file.path === selected.path
                      ? { ...file, content: value }
                      : file,
                  ),
                  inputDirty: true,
                  sampleId: undefined,
                })
              }
            />
          </div>
        </>
      ) : (
        <div className="sc-empty">{t.add_source_hint}</div>
      )}
      <div className="sc-source-notes">
        {stale ? t.snapshot_changed : t.bundle_hint}
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
      </div>
      <Modal
        open={pasteOpen}
        title={t.paste_title}
        okText={t.add_file}
        cancelText={t.cancel}
        okButtonProps={{
          disabled: busy || !safeRelativePath(path) || !content.trim(),
        }}
        onCancel={() => setPasteOpen(false)}
        onOk={async () => {
          if (await merge([{ path, content }])) {
            setPasteOpen(false);
            setContent('');
          }
        }}
        destroyOnHidden
      >
        <div className="sc-paste-form">
          <label>
            {t.relative_path}
            <Input
              aria-label={t.relative_path}
              value={path}
              onChange={(event) => setPath(event.target.value)}
              maxLength={1024}
            />
          </label>
          <label>
            {t.source_code}
            <Input.TextArea
              aria-label={t.source_code}
              rows={12}
              value={content}
              onChange={(event) => setContent(event.target.value)}
            />
          </label>
          <ConverterTips>{t.bundle_hint}</ConverterTips>
        </div>
      </Modal>
    </section>
  );
}
