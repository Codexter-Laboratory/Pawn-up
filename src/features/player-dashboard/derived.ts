import type { DashboardResponse, PuzzleRushPoint } from './types';

export type StatsSummary = {
  chess: { label: string; rating: number | null; date: string | null; games: number | null; win: number | null; loss: number | null; draw: number | null }[];
  puzzles: {
    rushDailyAttempts: number | null;
    rushDailyScore: number | null;
    rushBestScore: number | null;
  };
};

export function computeStatsSummary(stats: unknown): StatsSummary | null {
  if (!stats) return null;
  const s = stats as Record<string, unknown>;

  const tc = s?.tactics as Record<string, unknown> | undefined;
  const puzzleRushDaily = (tc?.puzzle_rush as Record<string, unknown>)?.daily as Record<string, number> | undefined;
  const puzzleRushBest = (tc?.puzzle_rush as Record<string, unknown>)?.best as Record<string, number> | undefined;

  const chess = [
    ['Bullet', s?.chess_bullet],
    ['Blitz', s?.chess_blitz],
    ['Rapid', s?.chess_rapid],
    ['Daily', s?.chess_daily],
  ] as const;

  const summarizeTimeControl = (obj: unknown) => {
    const o = obj as { last?: { rating?: number; date?: number }; record?: { win?: number; loss?: number; draw?: number } } | undefined;
    const last = o?.last;
    return {
      rating: typeof last?.rating === 'number' ? last.rating : null,
      date: typeof last?.date === 'number' ? new Date(last.date * 1000).toISOString().slice(0, 10) : null,
      games: typeof o?.record?.win === 'number' ? (o.record.win + (o.record.loss ?? 0) + (o.record.draw ?? 0)) : null,
      win: typeof o?.record?.win === 'number' ? o.record.win : null,
      loss: typeof o?.record?.loss === 'number' ? o.record.loss : null,
      draw: typeof o?.record?.draw === 'number' ? o.record.draw : null,
    };
  };

  return {
    chess: chess
      .map(([label, obj]) => ({ label, ...summarizeTimeControl(obj) }))
      .filter((x) => x.rating !== null || x.games !== null),
    puzzles: {
      rushDailyAttempts: typeof puzzleRushDaily?.total_attempts === 'number' ? puzzleRushDaily.total_attempts : null,
      rushDailyScore: typeof puzzleRushDaily?.score === 'number' ? puzzleRushDaily.score : null,
      rushBestScore: typeof puzzleRushBest?.score === 'number' ? puzzleRushBest.score : null,
    },
  };
}

export type AttemptsChartPoint = {
  date: string;
  attemptsDelta: number | null;
  scoreDelta: number | null;
  totalAttempts: number | null;
  totalScore: number | null;
};

export function computeAttemptsChart(
  data: DashboardResponse | null,
  stats: unknown,
  statsSummary: StatsSummary | null
): AttemptsChartPoint[] {
  const empty = [{ date: '', attemptsDelta: null, scoreDelta: null, totalAttempts: null, totalScore: null }];
  if (!stats || !statsSummary) return empty;

  if (data?.puzzleRush?.points?.length) {
    return data.puzzleRush.points.map((p: PuzzleRushPoint) => ({
      date: p.date,
      attemptsDelta: typeof p.attemptsDelta === 'number' ? p.attemptsDelta : null,
      scoreDelta: typeof p.scoreDelta === 'number' ? p.scoreDelta : null,
      totalAttempts: typeof p.attemptsTotal === 'number' ? p.attemptsTotal : null,
      totalScore: typeof p.scoreTotal === 'number' ? p.scoreTotal : null,
    }));
  }

  const today = new Date().toISOString().slice(0, 10);
  return [{
    date: today,
    attemptsDelta: statsSummary.puzzles.rushDailyAttempts ?? 0,
    scoreDelta: statsSummary.puzzles.rushDailyScore ?? 0,
    totalAttempts: statsSummary.puzzles.rushDailyAttempts ?? 0,
    totalScore: statsSummary.puzzles.rushDailyScore ?? 0,
  }];
}

export type PuzzleRushSummary = {
  dailyAttempts: number | null;
  dailyScore: number | null;
  bestScore: number | null;
  accuracy: number | null;
  lastUpdated: string;
};

export function computePuzzleRushSummary(statsSummary: StatsSummary | null): PuzzleRushSummary | null {
  if (!statsSummary) return null;

  const dailyAttempts = statsSummary.puzzles.rushDailyAttempts;
  const dailyScore = statsSummary.puzzles.rushDailyScore;
  const bestScore = statsSummary.puzzles.rushBestScore;
  const accuracy = dailyAttempts && dailyScore ? Math.round((dailyScore / dailyAttempts) * 100) : null;

  return {
    dailyAttempts,
    dailyScore,
    bestScore,
    accuracy,
    lastUpdated: new Date().toLocaleString(),
  };
}

export type RatingChartPoint = { date: string; rating: number | null };

export function computeRatingChart(games: { points: { date: string; rating: number }[] } | null): RatingChartPoint[] {
  const points = (games?.points ?? []).map((p) => ({
    date: p.date,
    rating: typeof p.rating === 'number' && Number.isFinite(p.rating) ? p.rating : null,
  }));
  return points.length > 0 ? points : [{ date: '', rating: null }];
}
