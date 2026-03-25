import { EmptyState, LoadingState, Panel } from '../../components';

type Profile = {
  avatar?: string;
  username: string;
  name?: string;
  title?: string;
  player_id: string;
  location?: string;
  joined: number;
  followers: number;
  status: string;
  fide?: number;
  is_streamer?: boolean;
  twitch_url?: string;
  last_online: number;
};

type PlayerProfileSectionProps = {
  profileLoading: boolean;
  profile: Profile | null;
  onlineStatus: { online: boolean } | null;
};

export function PlayerProfileSection({
  profileLoading,
  profile,
  onlineStatus,
}: PlayerProfileSectionProps) {
  if (profileLoading) {
    return <LoadingState title="Player Profile" message="Loading profile…" />;
  }

  const typedProfile = profile as Profile | null;
  if (!typedProfile) {
    return (
      <EmptyState
        title="Player Profile"
        message='Enter a username and click "Load Player Stats" to load profile.'
      />
    );
  }

  const typedOnlineStatus = onlineStatus as { online: boolean } | null;

  return (
    <Panel title="Player Profile">
      <div className="row" style={{ gap: 20, alignItems: 'flex-start' }}>
        {typedProfile.avatar && (
          <img
            src={typedProfile.avatar}
            alt={`${typedProfile.username} avatar`}
            style={{ width: 80, height: 80, borderRadius: 8 }}
          />
        )}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>
            {typedProfile.name ? typedProfile.name : typedProfile.username}
            {typedProfile.title && (
              <span style={{ marginLeft: 8, color: '#60a5fa' }}>{typedProfile.title}</span>
            )}
          </div>
          <div className="muted" style={{ fontSize: 13, lineHeight: 1.6 }}>
            <div>@{typedProfile.username} · ID: {typedProfile.player_id}</div>
            {typedProfile.location && <div>📍 {typedProfile.location}</div>}
            <div>📅 Joined: {new Date(typedProfile.joined * 1000).toLocaleDateString()}</div>
            <div>👥 Followers: {typedProfile.followers.toLocaleString()}</div>
            <div>📊 Status: {typedProfile.status}</div>
            {typedProfile.fide && <div>🏆 FIDE Rating: {typedProfile.fide}</div>}
            {typedProfile.is_streamer && typedProfile.twitch_url && (
              <div>
                🎮 Streamer:{' '}
                <a
                  href={typedProfile.twitch_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#60a5fa' }}
                >
                  {typedProfile.twitch_url}
                </a>
              </div>
            )}
            {typedOnlineStatus && (
              <div style={{ marginTop: 8 }}>
                <span
                  style={{
                    display: 'inline-block',
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: typedOnlineStatus.online ? '#34d399' : '#ef4444',
                    marginRight: 8,
                  }}
                />
                {typedOnlineStatus.online
                  ? 'Online now'
                  : `Last seen: ${new Date(typedProfile.last_online * 1000).toLocaleDateString()}`}
              </div>
            )}
          </div>
        </div>
      </div>
    </Panel>
  );
}
