import {
  Component,
  Suspense,
  lazy,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { useConverterCopy } from '../../copy';

const Monaco = lazy(() =>
  import('./monaco').then((module) => ({ default: module.ConverterMonaco })),
);

export interface IEditorProps {
  value: string;
  onChange: (value: string) => void;
  path: string;
  language?: string;
  readOnly?: boolean;
  label: string;
  placeholder?: string;
  loading?: ReactNode;
}

class EditorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export function ConverterEditor(props: IEditorProps) {
  const t = useConverterCopy();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const text = (
    <textarea
      aria-label={props.label}
      placeholder={props.placeholder}
      value={props.value}
      onChange={(event) => props.onChange(event.target.value)}
      readOnly={props.readOnly}
      spellCheck={false}
    />
  );

  return (
    <div className="sc-editor">
      <EditorBoundary
        fallback={
          <div className="sc-editor-fallback">
            <p role="status">{t.editor_failed}</p>
            {text}
          </div>
        }
      >
        {mounted ? (
          <Suspense
            fallback={
              <div className="sc-loading" role="status">
                {t.editor_loading}
              </div>
            }
          >
            <Monaco
              {...props}
              loading={<div className="sc-loading">{t.editor_loading}</div>}
            />
          </Suspense>
        ) : (
          text
        )}
      </EditorBoundary>
    </div>
  );
}
