import type { ReactNode } from 'react';
import { AlertTriangle, Info, XCircle } from 'lucide-react';

export function ConverterTips({
  children,
  type = 'info',
}: {
  children: ReactNode;
  type?: 'info' | 'warning' | 'error';
}) {
  const Icon =
    type === 'error' ? XCircle : type === 'warning' ? AlertTriangle : Info;

  return (
    <div
      className={`sc-tips sc-tips-${type}`}
      role={type === 'error' ? 'alert' : undefined}
    >
      <Icon size={14} />
      <div>{children}</div>
    </div>
  );
}
