import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import {
  computePuzzleRushActivityStreak,
  type PuzzleRushPoint,
} from '../../../lib/streaks';

function validateUsername(username: string) {
  return /^[a-zA-Z0-9_]{1,64}$/.test(username);
}

function isoDateUTC(d: Date) {
  return d.toISOString().slice(0, 10);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get('username')?.trim() ?? '';

  if (!username || !validateUsername(username)) {
    return NextResponse.json(
      { error: 'Missing or invalid username.' },
      { status: 400 }
    );
  }

  const snapshots = await prisma.puzzleRushSnapshot.findMany({
    where: { username },
    orderBy: { asOf: 'asc' },
    select: {
      asOf: true,
      attemptsTotal: true,
      scoreTotal: true,
    },
  });

  const points: PuzzleRushPoint[] = snapshots.map((s) => ({
    date: isoDateUTC(s.asOf),
    attemptsTotal: s.attemptsTotal,
    scoreTotal: s.scoreTotal,
    attemptsDelta: null,
    scoreDelta: null,
  }));

  // Compute day-over-day deltas from totals snapshots.
  for (let i = 0; i < points.length; i++) {
    const prev = points[i - 1];
    const cur = points[i];
    if (!prev) continue;
    if (typeof prev.attemptsTotal === 'number' && typeof cur.attemptsTotal === 'number') {
      cur.attemptsDelta = cur.attemptsTotal - prev.attemptsTotal;
    }
    if (typeof prev.scoreTotal === 'number' && typeof cur.scoreTotal === 'number') {
      cur.scoreDelta = cur.scoreTotal - prev.scoreTotal;
    }
  }

  const puzzleRushStreak = computePuzzleRushActivityStreak(points);

  return NextResponse.json({
    username,
    puzzleRush: {
      points,
      streak: puzzleRushStreak,
    },
  });
}

