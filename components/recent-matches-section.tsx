type RecentMatch = {
  matchId: string;
  championName: string;
  kills: number;
  deaths: number;
  assists: number;
  win: boolean;
  gameDuration: number;
  queueId: number;
};

type RecentMatchesResponse = {
  matches: RecentMatch[];
  error?: string;
};

type RecentMatchesSectionProps = {
  baseUrl: string;
  puuid: string;
  server: string;
};

function formatDuration(totalSeconds: number) {
  const minutes = Math.max(1, Math.round(totalSeconds / 60));

  return `${minutes} min`;
}

export async function RecentMatchesSection({
  baseUrl,
  puuid,
  server,
}: RecentMatchesSectionProps) {
  // Match history is intentionally non-blocking.
  // If the request fails, this section falls back to a small empty state instead of breaking the profile page.
  let payload: RecentMatchesResponse = { matches: [] };

  try {
    const response = await fetch(
      `${baseUrl}/api/riot/matches?puuid=${encodeURIComponent(
        puuid,
      )}&server=${encodeURIComponent(server.toUpperCase())}`,
      {
        cache: "no-store",
      },
    );

    payload = (await response.json().catch(() => ({ matches: [] }))) as RecentMatchesResponse;
  } catch {
    payload = { matches: [], error: "Failed to fetch match list" };
  }

  return (
    <section className="rounded-3xl border border-border bg-background/70 p-5">
      <div className="space-y-5">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-white">Recent Matches</h2>
          <p className="text-sm leading-6 text-textMuted">
            Your latest five games, loaded separately so match history never
            blocks the profile.
          </p>
        </div>

        {payload.matches.length === 0 ? (
          <div className="space-y-2">
            <p className="text-sm leading-6 text-textMuted">
              No recent matches available
            </p>
            {payload.error ? (
              <p className="text-xs leading-6 text-textMuted">
                {payload.error}
              </p>
            ) : null}
          </div>
        ) : (
          <div className="space-y-3">
            {payload.matches.map((match) => (
              <article
                key={match.matchId}
                className="grid gap-4 rounded-2xl border border-border bg-surfaceAlt/70 p-4 sm:grid-cols-[1.1fr_1fr_auto]"
              >
                <div>
                  <p className="text-sm font-semibold text-white">
                    {match.championName}
                  </p>
                  <p className="mt-1 text-sm text-textMuted">
                    {match.kills}/{match.deaths}/{match.assists} KDA
                  </p>
                </div>

                <div>
                  <p
                    className={`text-sm font-semibold ${
                      match.win ? "text-accentSoft" : "text-rose-300"
                    }`}
                  >
                    {match.win ? "Win" : "Loss"}
                  </p>
                  <p className="mt-1 text-sm text-textMuted">
                    Queue {match.queueId}
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <p className="text-sm font-semibold text-white">
                    {formatDuration(match.gameDuration)}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
