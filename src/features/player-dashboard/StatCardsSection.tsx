import { StatCard } from '../../components';
import type { DashboardResponse } from './types';
import type { StatsSummary } from './derived';

type StatCardsSectionProps = {
  data: DashboardResponse | null;
  statsLoading: boolean;
  statsSummary: StatsSummary | null;
};

export function StatCardsSection({ data, statsLoading, statsSummary }: StatCardsSectionProps) {
  return (
    <div className="statCards">
      <StatCard
        label="Puzzle Rush Activity Streak"
        value={data?.puzzleRush.streak.current ?? 0}
      >
        Best: {data?.puzzleRush.streak.best ?? 0}
        {data?.puzzleRush.streak.endingDate ? (
          <> · Ending: {data.puzzleRush.streak.endingDate}</>
        ) : null}
      </StatCard>

      <StatCard
        label="Puzzle Rush Best Streak"
        value={data?.puzzleRush.streak.best ?? 0}
      >
        Current: {data?.puzzleRush.streak.current ?? 0}
        {data?.puzzleRush.streak.endingDate ? (
          <> · Ending: {data.puzzleRush.streak.endingDate}</>
        ) : null}
      </StatCard>

      <StatCard label="Live Chess.com stats">
        <div style={{ fontSize: 13, lineHeight: 1.45 }}>
          {statsLoading ? (
            <>Loading…</>
          ) : statsSummary ? (
            <>
              {statsSummary.puzzles.rushDailyAttempts !== null ? (
                <>
                  Puzzle Rush (daily): {statsSummary.puzzles.rushDailyAttempts} attempts ·{' '}
                  {statsSummary.puzzles.rushDailyScore ?? '-'} score
                  <br />
                </>
              ) : null}
              Ratings: {statsSummary.chess.map((c) => `${c.label} ${c.rating ?? '-'}`).join(' · ')}
            </>
          ) : (
            <>Click &ldquo;Load Player Stats&rdquo;.</>
          )}
        </div>
      </StatCard>
    </div>
  );
}
