type LoadingStateProps = {
  title: string;
  message?: string;
};

export function LoadingState({ title, message = 'Loading…' }: LoadingStateProps) {
  return (
    <div className="panel">
      <div className="panelTitle">{title}</div>
      <div className="muted" style={{ fontSize: 13 }}>
        {message}
      </div>
    </div>
  );
}
