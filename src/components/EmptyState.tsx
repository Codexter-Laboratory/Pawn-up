import { ReactNode } from 'react';

type EmptyStateProps = {
  title: string;
  message: ReactNode;
};

export function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <div className="panel">
      <div className="panelTitle">{title}</div>
      <div className="muted" style={{ fontSize: 13 }}>
        {message}
      </div>
    </div>
  );
}
