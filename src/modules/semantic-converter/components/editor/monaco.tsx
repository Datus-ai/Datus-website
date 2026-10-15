import Editor, { loader } from '@monaco-editor/react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js';
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import 'monaco-editor/esm/vs/basic-languages/yaml/yaml.contribution';
import 'monaco-editor/esm/vs/basic-languages/sql/sql.contribution';
import 'monaco-editor/esm/vs/language/json/monaco.contribution';
import type { IEditorProps } from './index';

// Bundle workers and language assets on the website origin; never upload YAML to a CDN.
self.MonacoEnvironment = {
  getWorker(_id: string, label: string) {
    return label === 'json' ? new JsonWorker() : new EditorWorker();
  },
};
loader.config({ monaco });
monaco.editor.defineTheme('datus-website-dark', {
  base: 'vs-dark',
  inherit: true,
  rules: [],
  colors: {
    'editor.background': '#0b1230',
    'editor.foreground': '#c2c8ec',
    'editorLineNumber.foreground': '#8a93c4',
    'editorLineNumber.activeForeground': '#eef1ff',
    'editor.lineHighlightBackground': '#402df326',
    'editor.selectionBackground': '#402df34d',
    'editorGutter.background': '#0b1230',
  },
});

export function ConverterMonaco({
  value,
  onChange,
  path,
  language = 'yaml',
  readOnly,
  label,
  loading,
  placeholder,
}: IEditorProps) {
  return (
    <Editor
      path={path}
      value={value}
      language={language}
      theme="datus-website-dark"
      onChange={(content) => onChange(content ?? '')}
      loading={loading}
      options={{
        ariaLabel: label,
        placeholder,
        fontSize: 12,
        lineNumbers: 'on',
        // Avoid Monaco's pending word-highlight cancellation when switching
        // temporary models; this viewer does not need cross-editor highlights.
        occurrencesHighlight: 'off',
        lineNumbersMinChars: 1,
        minimap: { enabled: true },
        automaticLayout: true,
        scrollBeyondLastLine: false,
        tabSize: 2,
        wordWrap: 'off',
        fixedOverflowWidgets: true,
        scrollbar: { horizontalScrollbarSize: 8, verticalScrollbarSize: 8 },
        readOnly,
      }}
    />
  );
}
