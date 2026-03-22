import { ReactNode } from 'react';

type PanelProps = {
  title?: string;
  children: ReactNode;
};

export function Panel({ title, children }: PanelProps) {
  return (
    <div className="panel">
      {title ? <div className="panelTitle">{title}</div> : null}
      {children}
    </div>
  );
}
