import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { fetchPuzzleRushDailyStats } from '../../../lib/chesscom';

function isoDateUTC(d: Date) {
  return d.toISOString().slice(0, 10);
}

function parseISODateUTC(iso: string) {
  return new Date(iso + 'T00:00:00.000Z');
}

function validateUsername(username: string) {
  // Chess.com usernames are generally [a-zA-Z0-9_]
  // We'll be permissive but avoid obviously invalid values.
  return /^[a-zA-Z0-9_]{1,64}$/.test(username);
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

  const asOfISO = isoDateUTC(new Date());
  const asOf = parseISODateUTC(asOfISO);

  try {
    const controller = new AbortController();
    const stats = await fetchPuzzleRushDailyStats(username, controller.signal);

    const snapshot = await prisma.puzzleRushSnapshot.upsert({
      where: { username_asOf: { username, asOf } },
      create: {
        username,
        asOf,
        attemptsTotal: stats.attemptsTotal,
        scoreTotal: stats.scoreTotal,
      },
      update: {
        attemptsTotal: stats.attemptsTotal,
        scoreTotal: stats.scoreTotal,
      },
    });

    return NextResponse.json({
      ok: true,
      username,
      asOf: asOfISO,
      attemptsTotal: snapshot.attemptsTotal,
      scoreTotal: snapshot.scoreTotal,
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || 'Failed to ingest.' },
      { status: 500 }
    );
  }
}

