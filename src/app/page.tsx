'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { EmptyState, LoadingState, Panel, StatCard } from '../components';

type DateISO = string;

type PuzzleRushPoint = {
  date: DateISO;
  attemptsTotal: number | null;
  scoreTotal: number | null;
  attemptsDelta: number | null;
  scoreDelta: number | null;
};

type GamesTimeClass =
  | 'bullet'
  | 'blitz'
  | 'rapid'
  | 'daily'
  | 'chess960'
  | 'bughouse'
  | 'crazyhouse'
  | 'kingofthehill'
  | 'threecheck'
  | 'atomic';

type DashboardResponse = {
  username: string;
  puzzleRush: {
    points: PuzzleRushPoint[];
    streak: { current: number; best: number; endingDate: DateISO | null };
  };
};

function todayISOUTC(): DateISO {
  return new Date().toISOString().slice(0, 10);
}

function toFriendlyErrorMessage(err: unknown, fallback: string) {
  const raw = err instanceof Error ? err.message : String(err ?? '');
  const msg = raw.toLowerCase();

  if (msg.includes('404') || msg.includes('not found')) {
    return "Couldn't find that Chess.com username. Please check the spelling and try again.";
  }
  if (msg.includes('invalid username') || msg.includes('missing or invalid username')) {
    return 'Please enter a valid Chess.com username.';
  }
  return raw || fallback;
}

export default function Page() {
  const [mounted, setMounted] = useState(false);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [data, setData] = useState<DashboardResponse | null>(null);

  const [stats, setStats] = useState<any | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  // New state variables for expanded Chess.com data
  const [profile, setProfile] = useState<any | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  
  const [onlineStatus, setOnlineStatus] = useState<any | null>(null);
  const [onlineStatusLoading, setOnlineStatusLoading] = useState(false);
  
  const [clubs, setClubs] = useState<any | null>(null);
  const [clubsLoading, setClubsLoading] = useState(false);
  
  const [tournaments, setTournaments] = useState<any | null>(null);
  const [tournamentsLoading, setTournamentsLoading] = useState(false);
  
  const [matches, setMatches] = useState<any | null>(null);
  const [matchesLoading, setMatchesLoading] = useState(false);
  
  const [currentGames, setCurrentGames] = useState<any | null>(null);
  const [currentGamesLoading, setCurrentGamesLoading] = useState(false);
  
  const [toMoveGames, setToMoveGames] = useState<any | null>(null);
  const [toMoveGamesLoading, setToMoveGamesLoading] = useState(false);

  const [timeClass, setTimeClass] = useState<GamesTimeClass>('blitz');
  const [months, setMonths] = useState(6);
  const [gamesLoading, setGamesLoading] = useState(false);
  const [games, setGames] = useState<{
    points: { date: string; rating: number; result: 'win' | 'loss' | 'draw' | 'other' }[];
    summary: { games: number; win: number; loss: number; draw: number };
  } | null>(null);

  async function loadDashboard(nextUsername = username) {
    setLoading(true);
    try {
      const res = await fetch(`/api/dashboard?username=${encodeURIComponent(nextUsername)}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Failed to load dashboard.');
      setData(json ?? null);
      return json;
    } catch (e: any) {
      setData(null);
      // Don't set error for non-critical data
    } finally {
      setLoading(false);
    }
  }

  async function loadStats(nextUsername = username) {
    setStatsLoading(true);
    try {
      const res = await fetch(`/api/stats?username=${encodeURIComponent(nextUsername)}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Failed to load stats.');
      setStats(json?.stats ?? null);
      return json?.stats;
    } catch (e: any) {
      setStats(null);
      // Don't set error for non-critical data
    } finally {
      setStatsLoading(false);
    }
  }

  async function loadProfile(nextUsername = username) {
    setProfileLoading(true);
    try {
      const res = await fetch(`/api/profile?username=${encodeURIComponent(nextUsername)}`);
      const json = await res.json();
      if (!res.ok) {
        // Handle error gracefully without throwing
        setProfile(null);
        return null;
      }
      setProfile(json?.profile ?? null);
      return json?.profile;
    } catch (e: any) {
      setProfile(null);
      // Don't re-throw - handle error gracefully
      return null;
    } finally {
      setProfileLoading(false);
    }
  }

  async function loadOnlineStatus(nextUsername = username) {
    setOnlineStatusLoading(true);
    try {
      const res = await fetch(`/api/online-status?username=${encodeURIComponent(nextUsername)}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Failed to load online status.');
      setOnlineStatus(json?.onlineStatus ?? null);
    } catch (e: any) {
      // Don't set error for non-critical data
      setOnlineStatus(null);
    } finally {
      setOnlineStatusLoading(false);
    }
  }

  async function loadClubs(nextUsername = username) {
    setClubsLoading(true);
    try {
      const res = await fetch(`/api/clubs?username=${encodeURIComponent(nextUsername)}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Failed to load clubs.');
      setClubs(json?.clubs ?? null);
    } catch (e: any) {
      // Don't set error for non-critical data
      setClubs(null);
    } finally {
      setClubsLoading(false);
    }
  }

  async function loadTournaments(nextUsername = username) {
    setTournamentsLoading(true);
    try {
      const res = await fetch(`/api/tournaments?username=${encodeURIComponent(nextUsername)}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Failed to load tournaments.');
      setTournaments(json?.tournaments ?? null);
    } catch (e: any) {
      // Don't set error for non-critical data
      setTournaments(null);
    } finally {
      setTournamentsLoading(false);
    }
  }

  async function loadMatches(nextUsername = username) {
    setMatchesLoading(true);
    try {
      const res = await fetch(`/api/matches?username=${encodeURIComponent(nextUsername)}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Failed to load matches.');
      setMatches(json?.matches ?? null);
    } catch (e: any) {
      // Don't set error for non-critical data
      setMatches(null);
    } finally {
      setMatchesLoading(false);
    }
  }

  async function loadCurrentGames(nextUsername = username) {
    setCurrentGamesLoading(true);
    try {
      const res = await fetch(`/api/current-games?username=${encodeURIComponent(nextUsername)}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Failed to load current games.');
      setCurrentGames(json?.currentGames ?? null);
    } catch (e: any) {
      // Don't set error for non-critical data
      setCurrentGames(null);
    } finally {
      setCurrentGamesLoading(false);
    }
  }

  async function loadToMoveGames(nextUsername = username) {
    setToMoveGamesLoading(true);
    try {
      const res = await fetch(`/api/current-games?username=${encodeURIComponent(nextUsername)}`);
      const json = await res.json();
      console.log('Current games for to-move filtering:', json);
      
      if (!res.ok) throw new Error(json?.error || 'Failed to load current games.');
      
      // Filter current games to only show games where it's the user's turn
      const currentGamesData = json?.currentGames;
      if (currentGamesData && currentGamesData.games) {
        const myTurnGames = currentGamesData.games.filter((game: any) => {
          // Extract usernames from URLs
          let whiteUsername, blackUsername;
          
          if (typeof game.white === 'string') {
            whiteUsername = game.white.split('/').pop() || '';
          } else {
            whiteUsername = game.white?.url?.split('/').pop() || '';
          }
          
          if (typeof game.black === 'string') {
            blackUsername = game.black.split('/').pop() || '';
          } else {
            blackUsername = game.black?.url?.split('/').pop() || '';
          }
          
          const currentUsername = nextUsername.trim();
          const isUserWhite = whiteUsername === currentUsername;
          const isUserBlack = blackUsername === currentUsername;
          
          // Return true if it's the user's turn
          if (isUserWhite && game.turn === 'white') return true;
          if (isUserBlack && game.turn === 'black') return true;
          return false;
        });
        
        console.log('Filtered to-move games:', myTurnGames);
        setToMoveGames({ games: myTurnGames });
      } else {
        setToMoveGames({ games: [] });
      }
    } catch (e: any) {
      console.error('To-move games error:', e);
      setToMoveGames(null);
    } finally {
      setToMoveGamesLoading(false);
    }
  }

  async function loadGames(nextUsername = username, nextTimeClass = timeClass, nextMonths = months) {
    setGamesLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/games?username=${encodeURIComponent(nextUsername)}&timeClass=${encodeURIComponent(
          nextTimeClass
        )}&months=${encodeURIComponent(String(nextMonths))}`
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Failed to load games.');
      setGames({
        points: Array.isArray(json?.points)
          ? json.points.map((p: any) => ({
              date: String(p?.date ?? ''),
              rating: Number(p?.rating ?? 0),
              result: (p?.result ?? 'other') as any,
            }))
          : [],
        summary: json?.summary ?? { games: 0, win: 0, loss: 0, draw: 0 },
      });
    } catch (e: any) {
      setError(toFriendlyErrorMessage(e, 'Failed to load games.'));
      setGames(null);
    } finally {
      setGamesLoading(false);
    }
  }

  async function refreshAll(nextUsername = username, options?: { withIngest?: boolean }) {
    // Clean username more aggressively - remove all spaces and trim
    const clean = nextUsername.replace(/\s+/g, '').trim();
    if (!clean) return;
    
    // Clear error immediately
    setError(null);

    if (options?.withIngest) {
      try {
        await fetch(`/api/ingest?username=${encodeURIComponent(clean)}`);
      } catch {
        // Continue loading read endpoints even if ingest fails.
      }
    }

    // Load profile first and wait for it to complete
    try {
      const profileResult = await loadProfile(clean);
      
      // Check if profile loaded successfully by making a direct API call
      // This avoids relying on React state timing
      const profileResponse = await fetch(`/api/profile?username=${encodeURIComponent(clean)}`);
      const profileData = await profileResponse.json();
      
      if (!profileResponse.ok || !profileData.profile) {
        setError("Couldn't find that Chess.com username. Please check the spelling and try again.");
        return;
      }
      
      // Profile is valid - clear any errors and load all other data
      setError(null);
      
      // Load all other data in parallel
      const loadPromises = [
        loadDashboard(clean), 
        loadStats(clean), 
        loadGames(clean, timeClass, months),
        loadOnlineStatus(clean),
        loadClubs(clean),
        loadTournaments(clean),
        loadMatches(clean),
        loadCurrentGames(clean),
        loadToMoveGames(clean)
      ];
      
      await Promise.allSettled(loadPromises);
      
    } catch (e: any) {
      // Handle any unexpected errors
      console.error('Data loading error:', e);
      setError("Failed to load data. Please try again.");
    }
  }

  useEffect(() => {
    // Start empty and wait for explicit user input/actions.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  const statsSummary = useMemo(() => {
    if (!stats) return null;
    const s: any = stats;

    const tc = s?.tactics;
    const puzzleRushDaily = tc?.puzzle_rush?.daily ?? null;
    const puzzleRushBest = tc?.puzzle_rush?.best ?? null;

    const chess = [
      ['Bullet', s?.chess_bullet],
      ['Blitz', s?.chess_blitz],
      ['Rapid', s?.chess_rapid],
      ['Daily', s?.chess_daily],
    ] as const;

    const summarizeTimeControl = (obj: any) => {
      const last = obj?.last;
      return {
        rating: typeof last?.rating === 'number' ? last.rating : null,
        date: typeof last?.date === 'number' ? new Date(last.date * 1000).toISOString().slice(0, 10) : null,
        games: typeof obj?.record?.win === 'number' ? (obj.record.win + obj.record.loss + (obj.record.draw ?? 0)) : null,
        win: typeof obj?.record?.win === 'number' ? obj.record.win : null,
        loss: typeof obj?.record?.loss === 'number' ? obj.record.loss : null,
        draw: typeof obj?.record?.draw === 'number' ? obj.record.draw : null,
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
  }, [stats]);

  const attemptsChart = useMemo(() => {
    // Create a more comprehensive puzzle rush chart using live stats data
    if (!stats || !statsSummary) return [{ date: '', attemptsDelta: null, scoreDelta: null, totalAttempts: null, totalScore: null }];
    
    // If we have historical data from dashboard, use it for the trend
    if (data && data.puzzleRush.points.length > 0) {
      return data.puzzleRush.points.map((p) => ({
        date: p.date,
        attemptsDelta: typeof p.attemptsDelta === 'number' ? p.attemptsDelta : null,
        scoreDelta: typeof p.scoreDelta === 'number' ? p.scoreDelta : null,
        totalAttempts: typeof p.attemptsTotal === 'number' ? p.attemptsTotal : null,
        totalScore: typeof p.scoreTotal === 'number' ? p.scoreTotal : null,
      }));
    }
    
    // Fallback: create a single data point from current live stats
    const today = new Date().toISOString().slice(0, 10);
    return [{
      date: today,
      attemptsDelta: statsSummary.puzzles.rushDailyAttempts || 0,
      scoreDelta: statsSummary.puzzles.rushDailyScore || 0,
      totalAttempts: statsSummary.puzzles.rushDailyAttempts || 0,
      totalScore: statsSummary.puzzles.rushDailyScore || 0,
    }];
  }, [data, stats, statsSummary]);

  // Create a puzzle rush performance summary
  const puzzleRushSummary = useMemo(() => {
    if (!statsSummary) return null;
    
    const dailyAttempts = statsSummary.puzzles.rushDailyAttempts;
    const dailyScore = statsSummary.puzzles.rushDailyScore;
    const bestScore = statsSummary.puzzles.rushBestScore;
    
    // Calculate performance metrics
    const accuracy = dailyAttempts && dailyScore ? Math.round((dailyScore / dailyAttempts) * 100) : null;
    
    return {
      dailyAttempts,
      dailyScore,
      bestScore,
      accuracy,
      lastUpdated: new Date().toLocaleString(),
    };
  }, [statsSummary]);

  const ratingChart = useMemo(() => {
    const points = (games?.points ?? []).map((p) => ({
      date: p.date,
      rating: typeof p.rating === 'number' && Number.isFinite(p.rating) ? p.rating : null,
    }));
    return points.length > 0 ? points : [{ date: '', rating: null }];
  }, [games]);


  const isLoading = loading || statsLoading || gamesLoading || profileLoading || onlineStatusLoading || clubsLoading || tournamentsLoading || matchesLoading || currentGamesLoading || toMoveGamesLoading;

  const hasUsername = username.trim().length > 0;

  if (!mounted) {
    return <Panel>Loading UI…</Panel>;
  }

  return (
    <div>
      <Panel>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Chess.com username"
            />
            <button
              className="btn btnPrimary"
              onClick={() => refreshAll(username, { withIngest: true })}
              disabled={isLoading || !hasUsername}
            >
              Load Player Stats
            </button>
            <button
              className="btn"
              onClick={() => loadDashboard(username)}
              disabled={isLoading || !hasUsername}
            >
              Refresh cached view
            </button>
          </div>
        </div>
        <div className="muted" style={{ fontSize: 12, marginTop: 10 }}>
          “Load Player Stats” gets fresh Chess.com data, saves today&apos;s puzzle snapshot, and refreshes all charts/cards.
        </div>
        {error ? <div className="error" style={{ marginTop: 12 }}>{error}</div> : null}
      </Panel>

      <div style={{ height: 14 }} />

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
              <>Click “Load Player Stats”.</>
            )}
          </div>
        </StatCard>
      </div>

      <div style={{ height: 24 }} />

      {/* Player Profile Section */}
      {profileLoading ? (
        <LoadingState title="Player Profile" message="Loading profile…" />
      ) : profile ? (
        <Panel title="Player Profile">
          <div className="row" style={{ gap: 20, alignItems: 'flex-start' }}>
            {profile.avatar && (
              <img 
                src={profile.avatar} 
                alt={`${profile.username} avatar`}
                style={{ width: 80, height: 80, borderRadius: 8 }}
              />
            )}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>
                {profile.name ? profile.name : profile.username}
                {profile.title && <span style={{ marginLeft: 8, color: '#60a5fa' }}>{profile.title}</span>}
              </div>
              <div className="muted" style={{ fontSize: 13, lineHeight: 1.6 }}>
                <div>@{profile.username} · ID: {profile.player_id}</div>
                {profile.location && <div>📍 {profile.location}</div>}
                <div>📅 Joined: {new Date(profile.joined * 1000).toLocaleDateString()}</div>
                <div>👥 Followers: {profile.followers.toLocaleString()}</div>
                <div>📊 Status: {profile.status}</div>
                {profile.fide && <div>🏆 FIDE Rating: {profile.fide}</div>}
                {profile.is_streamer && profile.twitch_url && (
                  <div>🎮 Streamer: <a href={profile.twitch_url} target="_blank" rel="noopener noreferrer" style={{ color: '#60a5fa' }}>{profile.twitch_url}</a></div>
                )}
                {onlineStatus && (
                  <div style={{ marginTop: 8 }}>
                    <span style={{ 
                      display: 'inline-block', 
                      width: 8, 
                      height: 8, 
                      borderRadius: '50%', 
                      backgroundColor: onlineStatus.online ? '#34d399' : '#ef4444',
                      marginRight: 8
                    }}></span>
                    {onlineStatus.online ? 'Online now' : `Last seen: ${new Date(profile.last_online * 1000).toLocaleDateString()}`}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Panel>
      ) : (
        <EmptyState
          title="Player Profile"
          message='Enter a username and click "Load Player Stats" to load profile.'
        />
      )}

      <div style={{ height: 24 }} />

      {/* Graphs Section */}
      <div className="grid2">
        <Panel title="Puzzle Rush Performance">
          
          {/* Performance Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginBottom: 20 }}>
            <div style={{ padding: 12, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: '#60a5fa' }}>
                {puzzleRushSummary?.dailyAttempts || '-'}
              </div>
              <div className="muted" style={{ fontSize: 12 }}>Daily Attempts</div>
            </div>
            <div style={{ padding: 12, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: '#34d399' }}>
                {puzzleRushSummary?.dailyScore || '-'}
              </div>
              <div className="muted" style={{ fontSize: 12 }}>Daily Score</div>
            </div>
            <div style={{ padding: 12, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: '#f59e0b' }}>
                {puzzleRushSummary?.bestScore || '-'}
              </div>
              <div className="muted" style={{ fontSize: 12 }}>Best Score</div>
            </div>
            <div style={{ padding: 12, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: '#8b5cf6' }}>
                {puzzleRushSummary?.accuracy ? `${puzzleRushSummary.accuracy}%` : '-'}
              </div>
              <div className="muted" style={{ fontSize: 12 }}>Accuracy</div>
            </div>
          </div>

          {/* Chart Section */}
          <div className="chartBox" style={{ height: 320, minHeight: 200, marginBottom: 16 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={attemptsChart}>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(10,15,25,0.95)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 12,
                  }}
                  formatter={(value: any, name: any) => {
                    const nameStr = String(name || '');
                    if (nameStr === 'attemptsDelta') return [value ?? '-', 'Daily Attempts'];
                    if (nameStr === 'scoreDelta') return [value ?? '-', 'Daily Score'];
                    if (nameStr === 'totalAttempts') return [value ?? '-', 'Total Attempts'];
                    if (nameStr === 'totalScore') return [value ?? '-', 'Total Score'];
                    return [value ?? '-', nameStr || 'Unknown'];
                  }}
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
          
          {/* Info Section */}
          {!hasUsername ? (
            <div className="muted" style={{ fontSize: 12, minHeight: 20 }}>
              Enter a Chess.com username, then click "Load Player Stats" to see puzzle rush performance.
            </div>
          ) : puzzleRushSummary ? (
            <div className="muted" style={{ fontSize: 12, marginTop: 10 }}>
              <div>📊 Live data from Chess.com · Updated: {puzzleRushSummary.lastUpdated}</div>
              <div>💡 {data && data.puzzleRush.points.length > 0 
                ? `Showing ${data.puzzleRush.points.length} days of historical data with current live stats` 
                : 'Showing current live performance. Historical data will appear over time.'}</div>
            </div>
          ) : (
            <div className="muted" style={{ fontSize: 12, marginTop: 10 }}>
              Click "Load Player Stats" to load puzzle rush data.
            </div>
          )}
        </Panel>

        <Panel title="Games graph (choose category)">

          <div className="row" style={{ marginBottom: 10 }}>
            <label className="muted" style={{ fontSize: 12 }}>
              Category
            </label>
            <select
              value={timeClass}
              onChange={(e) => {
                const next = e.target.value as GamesTimeClass;
                setTimeClass(next);
                if (hasUsername) loadGames(username, next, months);
              }}
            >
              {[
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
              ].map(([id, label]) => (
                <option key={id} value={id}>
                  {label}
                </option>
              ))}
            </select>

            <label className="muted" style={{ fontSize: 12, marginLeft: 6 }}>
              Lookback
            </label>
            <select
              value={months}
              onChange={(e) => {
                const next = Number(e.target.value);
                setMonths(next);
                if (hasUsername) loadGames(username, timeClass, next);
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
            {games?.summary ? (
              <>
                {' '}
                · Games: {games.summary.games} · W {games.summary.win} / L {games.summary.loss} / D{' '}
                {games.summary.draw}
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
                  contentStyle={{
                    background: 'rgba(10,15,25,0.95)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 12,
                  }}
                  formatter={(value: any) => [value ?? '-', 'Rating']}
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
      </div>

      <div style={{ height: 24 }} />

      {/* Current Games Section */}
      {currentGamesLoading ? (
        <LoadingState title="Current Games" message="Loading current games…" />
      ) : currentGames && currentGames.games && currentGames.games.length > 0 ? (
        <Panel title={`Current Games (${currentGames.games.length})`}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>
                  <th style={{ padding: '8px 6px' }}>Opponent</th>
                  <th style={{ padding: '8px 6px' }}>Time Control</th>
                  <th style={{ padding: '8px 6px' }}>Turn</th>
                  <th style={{ padding: '8px 6px' }}>Move By</th>
                </tr>
              </thead>
              <tbody>
                {currentGames.games.map((game: any, index: number) => {
                  // Handle different API response structures
                  const getOpponent = () => {
                    // Handle both string and object formats
                    let whiteUsername, blackUsername;
                    
                    if (typeof game.white === 'string') {
                      whiteUsername = game.white.split('/').pop() || '';
                    } else {
                      whiteUsername = game.white?.url?.split('/').pop() || '';
                    }
                    
                    if (typeof game.black === 'string') {
                      blackUsername = game.black.split('/').pop() || '';
                    } else {
                      blackUsername = game.black?.url?.split('/').pop() || '';
                    }
                    
                    // Return the opponent with proper capitalization
                    const currentUsername = username.trim();
                    if (whiteUsername === currentUsername) {
                      return blackUsername.charAt(0).toUpperCase() + blackUsername.slice(1);
                    } else {
                      return whiteUsername.charAt(0).toUpperCase() + whiteUsername.slice(1);
                    }
                  };

                  const getMyColor = () => {
                    // Determine what color the current user is playing
                    let whiteUsername, blackUsername;
                    
                    if (typeof game.white === 'string') {
                      whiteUsername = game.white.split('/').pop() || '';
                    } else {
                      whiteUsername = game.white?.url?.split('/').pop() || '';
                    }
                    
                    if (typeof game.black === 'string') {
                      blackUsername = game.black.split('/').pop() || '';
                    } else {
                      blackUsername = game.black?.url?.split('/').pop() || '';
                    }
                    
                    const currentUsername = username.trim();
                    if (whiteUsername === currentUsername) return 'white';
                    if (blackUsername === currentUsername) return 'black';
                    return 'unknown';
                  };

                  const getTurnDisplay = () => {
                    const myColor = getMyColor();
                    const opponent = getOpponent();
                    const turnColor = game.turn.charAt(0).toUpperCase() + game.turn.slice(1);
                    const turnPlayer = game.turn === myColor ? 'You' : opponent;
                    return `${turnColor} to move (${turnPlayer})`;
                  };

                  return (
                    <tr key={index} style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                      <td style={{ padding: '8px 6px', color: 'rgba(255,255,255,0.9)' }}>
                        {getOpponent()}
                      </td>
                      <td style={{ padding: '8px 6px' }}>
                        {game.time_class.charAt(0).toUpperCase() + game.time_class.slice(1)}
                      </td>
                      <td style={{ padding: '8px 6px' }}>
                        {getTurnDisplay()}
                      </td>
                      <td style={{ padding: '8px 6px' }}>
                        {game.last_activity 
                          ? `Last: ${new Date(game.last_activity * 1000).toLocaleDateString()}`
                          : game.move_by > 0 
                            ? new Date(game.move_by * 1000).toLocaleString()
                            : 'No time limit'
                        }
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Panel>
      ) : (
        <EmptyState
          title="Current Games"
          message={
            hasUsername
              ? "No active games right now."
              : 'Enter a username and click "Load Player Stats" to see current games.'
          }
        />
      )}

      <div style={{ height: 24 }} />

      {/* To-Move Games Section */}
      {toMoveGamesLoading ? (
        <LoadingState
          title="Games Requiring Your Move"
          message="Loading games requiring your move…"
        />
      ) : toMoveGames && toMoveGames.games && toMoveGames.games.length > 0 ? (
        <Panel title={`Games Requiring Your Move (${toMoveGames.games.length})`}>
          <div className="muted" style={{ fontSize: 12, marginBottom: 10 }}>
            These games need your immediate attention
          </div>
          {toMoveGames.games.map((game: any, index: number) => (
            <div key={index} style={{ 
              padding: 10, 
              border: '1px solid rgba(255,255,255,0.1)', 
              borderRadius: 8, 
              marginBottom: 8,
              backgroundColor: 'rgba(34,197,94,0.1)'
            }}>
              <div style={{ fontSize: 14, fontWeight: 'bold' }}>
                <a href={game.url} target="_blank" rel="noopener noreferrer" style={{ color: '#60a5fa' }}>
                  View Game
                </a>
              </div>
              <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>
                Move by: {game.move_by > 0 ? new Date(game.move_by * 1000).toLocaleString() : 'No time limit'}
                {game.draw_offer && ' · Draw offer received'}
              </div>
            </div>
          ))}
        </Panel>
      ) : (
        <EmptyState
          title="Games Requiring Your Move"
          message={
            hasUsername
              ? "Great! No games need your immediate attention. 🎉"
              : 'Enter a username and click "Load Player Stats" to see games requiring your move.'
          }
        />
      )}

      <div style={{ height: 24 }} />

      {/* Clubs Section */}
      {clubsLoading ? (
        <LoadingState title="Club Memberships" message="Loading clubs…" />
      ) : clubs && clubs.clubs && clubs.clubs.length > 0 ? (
        <Panel title={`Club Memberships (${clubs.clubs.length})`}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
            {clubs.clubs.map((club: any, index: number) => (
              <div key={index} style={{ 
                padding: 12, 
                border: '1px solid rgba(255,255,255,0.1)', 
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                gap: 12
              }}>
                {club.icon && (
                  <img 
                    src={club.icon} 
                    alt={club.name}
                    style={{ width: 40, height: 40, borderRadius: 4 }}
                  />
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold', fontSize: 14 }}>{club.name}</div>
                  <div className="muted" style={{ fontSize: 11 }}>
                    Joined: {new Date(club.joined * 1000).toLocaleDateString()}
                    {club.last_activity && ` · Active: ${new Date(club.last_activity * 1000).toLocaleDateString()}`}
                  </div>
                </div>
                <a href={club.url} target="_blank" rel="noopener noreferrer" style={{ color: '#60a5fa', fontSize: 12 }}>
                  View
                </a>
              </div>
            ))}
          </div>
        </Panel>
      ) : (
        <EmptyState
          title="Club Memberships"
          message={
            hasUsername
              ? "No club memberships."
              : 'Enter a username and click "Load Player Stats" to see club memberships.'
          }
        />
      )}

      <div style={{ height: 24 }} />

      {/* Tournaments Section */}
      {tournamentsLoading ? (
        <LoadingState title="Tournament History" message="Loading tournaments…" />
      ) : tournaments ? (
        <Panel title="Tournament History">
          
          {tournaments.finished && tournaments.finished.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 8, color: 'rgba(255,255,255,0.9)' }}>
                Finished Tournaments ({tournaments.finished.length})
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr style={{ color: 'rgba(255,255,255,0.7)' }}>
                      <th style={{ padding: '6px 4px', textAlign: 'left' }}>Name</th>
                      <th style={{ padding: '6px 4px', textAlign: 'left' }}>Result</th>
                      <th style={{ padding: '6px 4px', textAlign: 'left' }}>Placement</th>
                      <th style={{ padding: '6px 4px', textAlign: 'left' }}>Players</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tournaments.finished.slice(0, 5).map((tournament: any, index: number) => (
                      <tr key={index} style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                        <td style={{ padding: '6px 4px' }}>
                          <a href={tournament.url} target="_blank" rel="noopener noreferrer" style={{ color: '#60a5fa' }}>
                            {tournament.name || 'Tournament'}
                          </a>
                        </td>
                        <td style={{ padding: '6px 4px' }}>
                          W: {tournament.wins || 0} / L: {tournament.losses || 0} / D: {tournament.draws || 0}
                        </td>
                        <td style={{ padding: '6px 4px' }}>
                          {tournament.placement ? `#${tournament.placement}` : '-'}
                        </td>
                        <td style={{ padding: '6px 4px' }}>
                          {tournament.total_players || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tournaments.in_progress && tournaments.in_progress.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 8, color: 'rgba(255,255,255,0.9)' }}>
                In Progress ({tournaments.in_progress.length})
              </div>
              {tournaments.in_progress.map((tournament: any, index: number) => (
                <div key={index} style={{ padding: 8, backgroundColor: 'rgba(59,130,246,0.1)', borderRadius: 4, marginBottom: 4 }}>
                  <a href={tournament.url} target="_blank" rel="noopener noreferrer" style={{ color: '#60a5fa', fontSize: 12 }}>
                    {tournament.name || 'Tournament'} · Status: {tournament.status}
                  </a>
                </div>
              ))}
            </div>
          )}

          {tournaments.registered && tournaments.registered.length > 0 && (
            <div>
              <div style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 8, color: 'rgba(255,255,255,0.9)' }}>
                Registered ({tournaments.registered.length})
              </div>
              {tournaments.registered.map((tournament: any, index: number) => (
                <div key={index} style={{ padding: 8, backgroundColor: 'rgba(156,163,175,0.1)', borderRadius: 4, marginBottom: 4 }}>
                  <a href={tournament.url} target="_blank" rel="noopener noreferrer" style={{ color: '#60a5fa', fontSize: 12 }}>
                    {tournament.name || 'Tournament'} · Status: {tournament.status}
                  </a>
                </div>
              ))}
            </div>
          )}

          {!tournaments.finished?.length && !tournaments.in_progress?.length && !tournaments.registered?.length && (
            <div className="muted" style={{ fontSize: 13 }}>No tournament history.</div>
          )}
        </Panel>
      ) : (
        <EmptyState
          title="Tournament History"
          message={
            hasUsername
              ? "No tournament history."
              : 'Enter a username and click "Load Player Stats" to see tournament history.'
          }
        />
      )}

      <div style={{ height: 24 }} />

      {/* Team Matches Section */}
      {matchesLoading ? (
        <LoadingState title="Team Matches" message="Loading matches…" />
      ) : matches ? (
        <Panel title="Team Matches">
          
          {matches.finished && matches.finished.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 8, color: 'rgba(255,255,255,0.9)' }}>
                Finished Matches ({matches.finished.length})
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr style={{ color: 'rgba(255,255,255,0.7)' }}>
                      <th style={{ padding: '6px 4px', textAlign: 'left' }}>Match</th>
                      <th style={{ padding: '6px 4px', textAlign: 'left' }}>White</th>
                      <th style={{ padding: '6px 4px', textAlign: 'left' }}>Black</th>
                    </tr>
                  </thead>
                  <tbody>
                    {matches.finished.slice(0, 5).map((match: any, index: number) => (
                      <tr key={index} style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                        <td style={{ padding: '6px 4px' }}>
                          <a href={match.url} target="_blank" rel="noopener noreferrer" style={{ color: '#60a5fa' }}>
                            {match.name}
                          </a>
                        </td>
                        <td style={{ padding: '6px 4px' }}>{match.results?.played_as_white || '-'}</td>
                        <td style={{ padding: '6px 4px' }}>{match.results?.played_as_black || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {matches.in_progress && matches.in_progress.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 8, color: 'rgba(255,255,255,0.9)' }}>
                In Progress ({matches.in_progress.length})
              </div>
              {matches.in_progress.map((match: any, index: number) => (
                <div key={index} style={{ padding: 8, backgroundColor: 'rgba(59,130,246,0.1)', borderRadius: 4, marginBottom: 4 }}>
                  <a href={match.url} target="_blank" rel="noopener noreferrer" style={{ color: '#60a5fa', fontSize: 12 }}>
                    {match.name}
                  </a>
                </div>
              ))}
            </div>
          )}

          {matches.registered && matches.registered.length > 0 && (
            <div>
              <div style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 8, color: 'rgba(255,255,255,0.9)' }}>
                Registered ({matches.registered.length})
              </div>
              {matches.registered.map((match: any, index: number) => (
                <div key={index} style={{ padding: 8, backgroundColor: 'rgba(156,163,175,0.1)', borderRadius: 4, marginBottom: 4 }}>
                  <a href={match.url} target="_blank" rel="noopener noreferrer" style={{ color: '#60a5fa', fontSize: 12 }}>
                    {match.name}
                  </a>
                </div>
              ))}
            </div>
          )}

          {!matches.finished?.length && !matches.in_progress?.length && !matches.registered?.length && (
            <div className="muted" style={{ fontSize: 13 }}>No team matches.</div>
          )}
        </Panel>
      ) : (
        <EmptyState
          title="Team Matches"
          message={
            hasUsername
              ? "No team matches."
              : 'Enter a username and click "Load Player Stats" to see team matches.'
          }
        />
      )}

      <div style={{ height: 24 }} />

      {/* Recent Snapshots Table */}
      <Panel title="Recent Puzzle Rush Snapshots">
        <div className="muted" style={{ fontSize: 12, marginBottom: 10 }}>
          Daily snapshots captured when you click "Load Player Stats".
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
              {data?.puzzleRush.points.length ? (
                data.puzzleRush.points.slice(0, 10).map((p, i) => (
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
                    No snapshots yet. Use "Load Player Stats".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

