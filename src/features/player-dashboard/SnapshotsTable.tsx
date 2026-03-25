import { Panel } from '../../components';
import type { PuzzleRushPoint } from './types';

type SnapshotsTableProps = {
  points: PuzzleRushPoint[];
};

export function SnapshotsTable({ points }: SnapshotsTableProps) {
  const rows = points.slice(0, 10);

  return (
    <Panel title="Recent Puzzle Rush Snapshots">
      <div className="muted" style={{ fontSize: 12, marginBottom: 10 }}>
        Daily snapshots captured when you click &ldquo;Load Player Stats&rdquo;.
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ color: 'rgba(255,255,255,0.7)' }}>
              <th style={{ padding: '6px 4px', textAlign: 'left' }}>Date</th>
              <th style={{ padding: '6px 4px', textAlign: 'left' }}>Attempts</th>
              <th style={{ padding: '6px 4px', textAlign: 'left' }}>Score</th>
            </tr>
          </thead>
          <tbody>
            {rows.length > 0 ? (
              rows.map((p, i) => (
                <tr key={i} style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <td style={{ padding: '6px 4px' }}>{p.date}</td>
                  <td style={{ padding: '6px 4px' }}>
                    {typeof p.attemptsTotal === 'number' ? p.attemptsTotal : '-'}
                  </td>
                  <td style={{ padding: '6px 4px' }}>
                    {typeof p.scoreTotal === 'number' ? p.scoreTotal : '-'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} style={{ padding: '10px 6px', color: 'rgba(255,255,255,0.7)' }}>
                  No snapshots yet. Use &ldquo;Load Player Stats&rdquo;.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}
