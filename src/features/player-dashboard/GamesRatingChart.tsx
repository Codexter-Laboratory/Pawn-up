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
import type { GamesTimeClass } from './types';
import type { RatingChartPoint } from './derived';

type GamesRatingChartProps = {
  timeClass: GamesTimeClass;
  setTimeClass: (v: GamesTimeClass) => void;
  months: number;
  setMonths: (v: number) => void;
  ratingChart: RatingChartPoint[];
  gamesSummary: { games: number; win: number; loss: number; draw: number } | null;
  hasUsername: boolean;
  onCategoryChange: (timeClass: GamesTimeClass, months: number) => void;
  onLookbackChange: (timeClass: GamesTimeClass, months: number) => void;
};

const TIME_CLASS_OPTIONS: [GamesTimeClass, string][] = [
  ['bullet', 'Bullet'],
  ['blitz', 'Blitz'],
  ['rapid', 'Rapid'],
  ['daily', 'Daily'],
  ['chess960', 'Chess960'],
  ['bughouse', 'Bughouse'],
  ['crazyhouse', 'Crazyhouse'],
  ['kingofthehill', 'King of the Hill'],
  ['threecheck', 'Three-check'],
  ['atomic', 'Atomic'],
];

const CHART_TOOLTIP_STYLE = {
  background: 'rgba(10,15,25,0.95)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 12,
};

export function GamesRatingChart({
  timeClass,
  setTimeClass,
  months,
  setMonths,
  ratingChart,
  gamesSummary,
  hasUsername,
  onCategoryChange,
  onLookbackChange,
}: GamesRatingChartProps) {
  return (
    <Panel title="Games graph (choose category)">
      <div className="row" style={{ marginBottom: 10 }}>
        <label className="muted" style={{ fontSize: 12 }}>Category</label>
        <select
          value={timeClass}
          onChange={(e) => {
            const next = e.target.value as GamesTimeClass;
            setTimeClass(next);
            onCategoryChange(next, months);
          }}
        >
          {TIME_CLASS_OPTIONS.map(([id, label]) => (
            <option key={id} value={id}>
              {label}
            </option>
          ))}
        </select>
        <label className="muted" style={{ fontSize: 12, marginLeft: 6 }}>Lookback</label>
        <select
          value={months}
          onChange={(e) => {
            const next = Number(e.target.value);
            setMonths(next);
            onLookbackChange(timeClass, next);
          }}
        >
          {[3, 6, 12, 24].map((m) => (
            <option key={m} value={m}>
              {m} mo
            </option>
          ))}
        </select>
      </div>

      <div className="muted" style={{ fontSize: 12, marginBottom: 8 }}>
        Graph: your rating after each game (from Chess.com archives) over the last {months} months.
        {gamesSummary ? (
          <>
            {' '}
            · Games: {gamesSummary.games} · W {gamesSummary.win} / L {gamesSummary.loss} / D{' '}
            {gamesSummary.draw}
          </>
        ) : null}
      </div>

      <div className="chartBox" style={{ height: 320, minHeight: 200 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={ratingChart}>
            <CartesianGrid stroke="rgba(255,255,255,0.08)" />
            <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }} />
            <YAxis tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }} />
            <Tooltip
              contentStyle={CHART_TOOLTIP_STYLE}
              formatter={(value: unknown) => [String(value ?? '-'), 'Rating']}
            />
            <Line
              type="monotone"
              dataKey="rating"
              stroke="#34d399"
              strokeWidth={2}
              dot={false}
              connectNulls={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {!hasUsername ? (
        <div className="muted" style={{ fontSize: 12, minHeight: 20 }}>
          Pick a category now; results appear after Load Player Stats.
        </div>
      ) : null}

      <div style={{ height: 12 }} />
      <div className="muted" style={{ fontSize: 12, lineHeight: 1.45 }}>
        📊 Data automatically fetched from Chess.com APIs
      </div>
    </Panel>
  );
}
