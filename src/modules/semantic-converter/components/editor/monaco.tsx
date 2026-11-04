import { useContext, useEffect } from 'react';
import Editor, { loader } from '@monaco-editor/react';
import { ConverterAppearanceContext, type ConverterAppearance } from '../../theme';
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
function defineTheme(palette: ConverterAppearance) {
  const name = palette.dark ? 'datus-website-dark' : 'datus-website-light';
  const hex = (color: string) => color.replace('#', '');
  monaco.editor.defineTheme(name, {
    base: palette.dark ? 'vs-dark' : 'vs',
    inherit: true,
    rules: [
      { token: '', foreground: hex(palette.text) },
      { token: 'comment', foreground: hex(palette.secondary) },
      { token: 'string', foreground: hex(palette.green) },
      { token: 'string.yaml', foreground: hex(palette.green) },
      { token: 'number', foreground: hex(palette.pink) },
      { token: 'keyword', foreground: hex(palette.accent) },
      { token: 'type', foreground: hex(palette.cyan) },
      { token: 'string.key.json', foreground: hex(palette.cyan) },
    ],
    colors: {
      'editor.background': palette.surface,
      'editor.foreground': palette.text,
      'editorLineNumber.foreground': palette.faint,
      'editorLineNumber.activeForeground': palette.text,
      'editor.lineHighlightBackground': palette.panel,
      'editor.selectionBackground': `${palette.accent}30`,
      'editor.inactiveSelectionBackground': palette.tint,
      'editorCursor.foreground': palette.accent,
      'editorGutter.background': palette.surface,
      'editorWidget.background': palette.surface,
      'editorWidget.border': palette.border,
      'editorSuggestWidget.background': palette.surface,
      'editorSuggestWidget.foreground': palette.text,
      'editorSuggestWidget.border': palette.border,
      'editorSuggestWidget.selectedBackground': palette.tint,
      'editorHoverWidget.background': palette.surface,
      'editorHoverWidget.foreground': palette.text,
      'editorHoverWidget.border': palette.border,
      'editorError.foreground': palette.danger,
      'editorWarning.foreground': palette.warning,
      'minimap.background': palette.surface,
      'scrollbarSlider.background': `${palette.secondary}30`,
      'scrollbarSlider.hoverBackground': `${palette.secondary}50`,
      'scrollbarSlider.activeBackground': `${palette.secondary}70`,
      'focusBorder': palette.accent,
    },
  });
  return name;
}

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
  const appearance = useContext(ConverterAppearanceContext);
  useEffect(() => {
    monaco.editor.setTheme(defineTheme(appearance));
  }, [appearance]);
  return (
    <Editor
      path={path}
      value={value}
      language={language}
      theme={appearance.dark ? 'datus-website-dark' : 'datus-website-light'}
      beforeMount={() => defineTheme(appearance)}
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
