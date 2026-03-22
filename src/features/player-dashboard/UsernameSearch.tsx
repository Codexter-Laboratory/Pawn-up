import { Panel } from '../../components';

type UsernameSearchProps = {
  username: string;
  onUsernameChange: (value: string) => void;
  onLoadPlayerStats: () => void;
  onRefreshCached: () => void;
  isLoading: boolean;
  hasUsername: boolean;
  error: string | null;
};

export function UsernameSearch({
  username,
  onUsernameChange,
  onLoadPlayerStats,
  onRefreshCached,
  isLoading,
  hasUsername,
  error,
}: UsernameSearchProps) {
  return (
    <Panel>
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            type="text"
            value={username}
            onChange={(e) => onUsernameChange(e.target.value)}
            placeholder="Chess.com username"
          />
          <button
            className="btn btnPrimary"
            onClick={onLoadPlayerStats}
            disabled={isLoading || !hasUsername}
          >
            Load Player Stats
          </button>
          <button
            className="btn"
            onClick={onRefreshCached}
            disabled={isLoading || !hasUsername}
          >
            Refresh cached view
          </button>
        </div>
      </div>
      <div className="muted" style={{ fontSize: 12, marginTop: 10 }}>
        &ldquo;Load Player Stats&rdquo; gets fresh Chess.com data, saves today&apos;s puzzle snapshot, and refreshes
        all charts/cards.
      </div>
      {error ? <div className="error" style={{ marginTop: 12 }}>{error}</div> : null}
    </Panel>
  );
}
