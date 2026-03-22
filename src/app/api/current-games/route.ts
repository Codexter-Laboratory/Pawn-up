import { NextResponse } from 'next/server';
import { fetchCurrentGames } from '../../../lib/chesscom';

function validateUsername(username: string) {
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

  try {
    const controller = new AbortController();
    const currentGames = await fetchCurrentGames(username, controller.signal);
    return NextResponse.json({ username, currentGames });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || 'Failed to fetch current games.' },
      { status: 500 }
    );
  }
}
