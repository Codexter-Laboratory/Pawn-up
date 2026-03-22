import { NextResponse } from 'next/server';
import { fetchPlayerOnlineStatus } from '../../../lib/chesscom';

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
    const onlineStatus = await fetchPlayerOnlineStatus(username, controller.signal);
    return NextResponse.json({ username, onlineStatus });
  } catch (e: any) {
    // Don't fail the entire request for online status - return a default response
    console.error('Online status fetch failed:', e?.message);
    return NextResponse.json({ 
      username, 
      onlineStatus: { online: false } 
    });
  }
}
