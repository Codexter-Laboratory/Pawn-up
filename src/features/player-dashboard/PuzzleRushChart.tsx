import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Panel } from '../../components';
import type { AttemptsChartPoint } from './derived';
import type { PuzzleRushSummary } from './derived';
import type { DashboardResponse } from './types';

type PuzzleRushChartProps = {
  puzzleRushSummary: PuzzleRushSummary | null;
  attemptsChart: AttemptsChartPoint[];
  data: DashboardResponse | null;
  hasUsername: boolean;
};

const CHART_TOOLTIP_STYLE = {
  background: 'rgba(10,15,25,0.95)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 12,
};

function tooltipFormatter(value: unknown, name: string | undefined): [string, string] {
  const nameStr = String(name ?? '');
  const displayValue = String(value ?? '-');
  if (nameStr === 'attemptsDelta') return [displayValue, 'Daily Attempts'];
  if (nameStr === 'scoreDelta') return [displayValue, 'Daily Score'];
  if (nameStr === 'totalAttempts') return [displayValue, 'Total Attempts'];
  if (nameStr === 'totalScore') return [displayValue, 'Total Score'];
  return [displayValue, nameStr || 'Unknown'];
}

export function PuzzleRushChart({
  puzzleRushSummary,
  attemptsChart,
  data,
  hasUsername,
}: PuzzleRushChartProps) {
  return (
    <Panel title="Puzzle Rush Performance">
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: 12,
          marginBottom: 20,
        }}
      >
        <div
          style={{
            padding: 12,
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8,
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 24, fontWeight: 'bold', color: '#60a5fa' }}>
            {puzzleRushSummary?.dailyAttempts ?? '-'}
          </div>
          <div className="muted" style={{ fontSize: 12 }}>Daily Attempts</div>
        </div>
        <div
          style={{
            padding: 12,
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8,
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 24, fontWeight: 'bold', color: '#34d399' }}>
            {puzzleRushSummary?.dailyScore ?? '-'}
          </div>
          <div className="muted" style={{ fontSize: 12 }}>Daily Score</div>
        </div>
        <div
          style={{
            padding: 12,
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8,
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 24, fontWeight: 'bold', color: '#f59e0b' }}>
            {puzzleRushSummary?.bestScore ?? '-'}
          </div>
          <div className="muted" style={{ fontSize: 12 }}>Best Score</div>
        </div>
        <div
          style={{
            padding: 12,
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8,
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 24, fontWeight: 'bold', color: '#8b5cf6' }}>
            {puzzleRushSummary?.accuracy != null ? `${puzzleRushSummary.accuracy}%` : '-'}
          </div>
          <div className="muted" style={{ fontSize: 12 }}>Accuracy</div>
        </div>
      </div>

      <div className="chartBox" style={{ height: 320, minHeight: 200, marginBottom: 16 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={attemptsChart}>
            <CartesianGrid stroke="rgba(255,255,255,0.08)" />
            <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }} />
            <YAxis tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }} />
            <Tooltip
              contentStyle={CHART_TOOLTIP_STYLE}
              formatter={(value: unknown, name: unknown) =>
                tooltipFormatter(value, typeof name === 'string' ? name : undefined)
              }
            />
            <Line
              type="monotone"
              dataKey="attemptsDelta"
              stroke="#60a5fa"
              strokeWidth={2}
              dot={false}
              connectNulls={false}
              name="Daily Attempts"
            />
            <Line
              type="monotone"
              dataKey="scoreDelta"
              stroke="#34d399"
              strokeWidth={2}
              dot={false}
              connectNulls={false}
              name="Daily Score"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {!hasUsername ? (
        <div className="muted" style={{ fontSize: 12, minHeight: 20 }}>
          Enter a Chess.com username, then click &ldquo;Load Player Stats&rdquo; to see puzzle rush performance.
        </div>
      ) : puzzleRushSummary ? (
        <div className="muted" style={{ fontSize: 12, marginTop: 10 }}>
          <div>📊 Live data from Chess.com · Updated: {puzzleRushSummary.lastUpdated}</div>
          <div>
            💡{' '}
            {data?.puzzleRush?.points?.length
              ? `Showing ${data.puzzleRush.points.length} days of historical data with current live stats`
              : 'Showing current live performance. Historical data will appear over time.'}
          </div>
        </div>
      ) : (
        <div className="muted" style={{ fontSize: 12, marginTop: 10 }}>
          Click &ldquo;Load Player Stats&rdquo; to load puzzle rush data.
        </div>
      )}
    </Panel>
  );
}
