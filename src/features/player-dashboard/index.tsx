import { useMounted } from '../../hooks/useMounted';
import { Panel } from '../../components';
import { usePlayerDashboard } from './hooks';
import { UsernameSearch } from './UsernameSearch';
import { StatCardsSection } from './StatCardsSection';
import { PlayerProfileSection } from './PlayerProfileSection';
import { PuzzleRushChart } from './PuzzleRushChart';
import { GamesRatingChart } from './GamesRatingChart';
import { CurrentGamesTable } from './CurrentGamesTable';
import { ToMoveGamesSection } from './ToMoveGamesSection';
import { ClubsSection } from './ClubsSection';
import { TournamentsSection } from './TournamentsSection';
import { TeamMatchesSection } from './TeamMatchesSection';
import { SnapshotsTable } from './SnapshotsTable';

export function PlayerDashboard() {
  const mounted = useMounted();
  const {
    username,
    setUsername,
    error,
    data,
    statsLoading,
    profile,
    profileLoading,
    onlineStatus,
    clubs,
    clubsLoading,
    tournaments,
    tournamentsLoading,
    matches,
    matchesLoading,
    currentGames,
    currentGamesLoading,
    toMoveGames,
    toMoveGamesLoading,
    timeClass,
    setTimeClass,
    months,
    setMonths,
    games,
    statsSummary,
    attemptsChart,
    puzzleRushSummary,
    ratingChart,
    isLoading,
    hasUsername,
    loadDashboard,
    loadGames,
    refreshAll,
  } = usePlayerDashboard();

  if (!mounted) {
    return <Panel>Loading UI…</Panel>;
  }

  const handleCategoryChange = (nextTimeClass: typeof timeClass, nextMonths: number) => {
    if (hasUsername) loadGames(username, nextTimeClass, nextMonths);
  };

  const handleLookbackChange = (nextTimeClass: typeof timeClass, nextMonths: number) => {
    if (hasUsername) loadGames(username, nextTimeClass, nextMonths);
  };

  return (
    <div>
      <UsernameSearch
        username={username}
        onUsernameChange={setUsername}
        onLoadPlayerStats={() => refreshAll(username, { withIngest: true })}
        onRefreshCached={() => loadDashboard(username)}
        isLoading={isLoading}
        hasUsername={hasUsername}
        error={error}
      />

      <div style={{ height: 14 }} />

      <StatCardsSection
        data={data}
        statsLoading={statsLoading}
        statsSummary={statsSummary}
      />

      <div style={{ height: 24 }} />

      <PlayerProfileSection
        profileLoading={profileLoading}
        profile={profile as { avatar?: string; username: string; name?: string; title?: string; player_id: string; location?: string; joined: number; followers: number; status: string; fide?: number; is_streamer?: boolean; twitch_url?: string; last_online: number } | null}
        onlineStatus={onlineStatus as { online: boolean } | null}
      />

      <div style={{ height: 24 }} />

      <div className="grid2">
        <PuzzleRushChart
          puzzleRushSummary={puzzleRushSummary}
          attemptsChart={attemptsChart}
          data={data}
          hasUsername={hasUsername}
        />

        <GamesRatingChart
          timeClass={timeClass}
          setTimeClass={setTimeClass}
          months={months}
          setMonths={setMonths}
          ratingChart={ratingChart}
          gamesSummary={games?.summary ?? null}
          hasUsername={hasUsername}
          onCategoryChange={handleCategoryChange}
          onLookbackChange={handleLookbackChange}
        />
      </div>

      <div style={{ height: 24 }} />

      <CurrentGamesTable
        currentGamesLoading={currentGamesLoading}
        currentGames={currentGames}
        username={username}
        hasUsername={hasUsername}
      />

      <div style={{ height: 24 }} />

      <ToMoveGamesSection
        toMoveGamesLoading={toMoveGamesLoading}
        toMoveGames={toMoveGames}
        hasUsername={hasUsername}
      />

      <div style={{ height: 24 }} />

      <ClubsSection
        clubsLoading={clubsLoading}
        clubs={clubs}
        hasUsername={hasUsername}
      />

      <div style={{ height: 24 }} />

      <TournamentsSection
        tournamentsLoading={tournamentsLoading}
        tournaments={tournaments}
        hasUsername={hasUsername}
      />

      <div style={{ height: 24 }} />

      <TeamMatchesSection
        matchesLoading={matchesLoading}
        matches={matches}
        hasUsername={hasUsername}
      />

      <div style={{ height: 24 }} />

      <SnapshotsTable points={data?.puzzleRush?.points ?? []} />
    </div>
  );
}
