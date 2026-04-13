import { Suspense } from "react";
import Image from "next/image";
import { headers } from "next/headers";
import { RecentMatchesSection } from "@/components/recent-matches-section";

type PlayerProfileRouteProps = {
  params: {
    name: string;
    region: string;
  };
  searchParams: {
    tagLine?: string;
  };
};

type RankedSummary = {
  tier: string;
  rank: string;
  lp: number;
  wins: number;
  losses: number;
};

type RiotAccountResponse = {
  puuid: string;
  gameName: string;
  tagLine: string;
  server: string;
  regionalRouting: string;
  platformRouting: string;
  summonerLevel: number;
  profileIconId: number;
  ranked: {
    soloDuo: RankedSummary | null;
    flex: RankedSummary | null;
  } | null;
  rankedMessage: string | null;
  partialProfile?: boolean;
};

const DATA_DRAGON_VERSION = "16.7.1";

function buildBaseUrl() {
  const requestHeaders = headers();
  const host = requestHeaders.get("host");
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "http";

  if (!host) {
    throw new Error("Missing host header for internal API request.");
  }

  return `${protocol}://${host}`;
}

function formatRank(entry: RankedSummary | null) {
  if (!entry || entry.tier === "UNRANKED") {
    return "Unranked";
  }

  return `${entry.tier} ${entry.rank} ${entry.lp} LP`;
}

function formatWinrate(entry: RankedSummary | null) {
  if (!entry) {
    return "No games played";
  }

  const totalGames = entry.wins + entry.losses;

  if (totalGames === 0) {
    return "No games played";
  }

  const winrate = Math.round((entry.wins / totalGames) * 100);

  return `${winrate}% win rate`;
}

function RecentMatchesLoading() {
  return (
    <section className="rounded-3xl border border-border bg-background/70 p-5">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-white">Recent Matches</h2>
        <p className="text-sm leading-6 text-textMuted">Loading matches...</p>
      </div>
    </section>
  );
}

export default async function PlayerProfileRoute({
  params,
  searchParams,
}: PlayerProfileRouteProps) {
  const { name, region } = params;
  const tagLine =
    typeof searchParams.tagLine === "string" ? searchParams.tagLine : "";

  try {
    if (!tagLine) {
      return (
        <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
          <section className="rounded-[2rem] border border-border bg-surface/90 p-8 shadow-glow sm:p-10">
            <div className="space-y-5">
              <span className="inline-flex rounded-full border border-rose-400/20 bg-rose-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-rose-200">
                Invalid Riot ID
              </span>

              <div className="space-y-3">
                <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Player Profile
                </h1>
                <p className="max-w-2xl text-base leading-7 text-textMuted">
                  The player route is missing the Riot tagLine value.
                </p>
              </div>
            </div>
          </section>
        </main>
      );
    }

    const baseUrl = buildBaseUrl();

    // This page fetches from our own API route on the server.
    // The internal route handles Riot authentication plus the account, summoner, and ranked lookups.
    const response = await fetch(
      `${baseUrl}/api/riot/account?gameName=${encodeURIComponent(
        name,
      )}&tagLine=${encodeURIComponent(tagLine)}&server=${encodeURIComponent(
        region.toUpperCase(),
      )}`,
      {
        cache: "no-store",
      },
    );

    if (!response.ok) {
      const errorPayload = (await response.json().catch(() => null)) as
        | { error?: string; details?: string }
        | null;

      return (
        <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
          <section className="rounded-[2rem] border border-border bg-surface/90 p-8 shadow-glow sm:p-10">
            <div className="space-y-5">
              <span className="inline-flex rounded-full border border-rose-400/20 bg-rose-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-rose-200">
                Request Failed
              </span>

              <div className="space-y-3">
                <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Player Profile
                </h1>
                <p className="max-w-2xl text-base leading-7 text-textMuted">
                  The profile could not be loaded from the internal Riot API.
                </p>
              </div>

              <div className="rounded-3xl border border-border bg-background/70 p-5">
                <p className="text-sm font-semibold text-white">Error</p>
                <p className="mt-2 text-sm leading-6 text-textMuted">
                  {errorPayload?.error ?? "Unknown API error"}
                </p>
                <p className="mt-2 text-sm leading-6 text-textMuted">
                  {errorPayload?.details ?? "No extra details were returned."}
                </p>
              </div>
            </div>
          </section>
        </main>
      );
    }

    const account = (await response.json()) as RiotAccountResponse;
    const profileIconUrl = `https://ddragon.leagueoflegends.com/cdn/${DATA_DRAGON_VERSION}/img/profileicon/${account.profileIconId}.png`;

    return (
      <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] border border-border bg-surface/90 p-8 shadow-glow sm:p-10">
          <div className="space-y-8">
            <span className="inline-flex rounded-full border border-border bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-accentSoft">
              Live Account Data
            </span>

            <div className="flex flex-col gap-6 rounded-3xl border border-border bg-background/70 p-5 sm:flex-row sm:items-center">
              <Image
                src={profileIconUrl}
                alt={`${account.gameName} profile icon`}
                width={96}
                height={96}
                className="h-24 w-24 rounded-3xl border border-border bg-surfaceAlt/70 object-cover"
              />

              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  {account.gameName}#{account.tagLine}
                </h1>
                <p className="text-base leading-7 text-textMuted">
                  Level {account.summonerLevel} on {account.server.toUpperCase()}
                  , routed through {account.platformRouting}.api and{" "}
                  {account.regionalRouting}.api.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-border bg-surfaceAlt/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accentSoft">
                  Game Name
                </p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {account.gameName}
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-surfaceAlt/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accentSoft">
                  Tag Line
                </p>
                <p className="mt-2 text-xl font-semibold text-white">
                  #{account.tagLine}
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-surfaceAlt/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accentSoft">
                  Summoner Level
                </p>
                <p className="mt-2 text-xl font-semibold text-white">
                  {account.summonerLevel}
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-surfaceAlt/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accentSoft">
                  Ranked Status
                </p>
                <p className="mt-2 text-xl font-semibold text-white">
                  {account.ranked?.soloDuo
                    ? formatRank(account.ranked.soloDuo)
                    : "Unavailable"}
                </p>
              </div>
            </div>

            {/* Ranked data is optional for now, so a warning should not block the profile UI. */}
            {account.ranked === null ? (
              <div className="rounded-3xl border border-border bg-background/70 p-5">
                <p className="text-sm font-semibold text-white">Ranked Status</p>
                <p className="mt-2 text-sm leading-6 text-textMuted">
                  {account.rankedMessage ?? "Ranked data is currently unavailable"}
                </p>
              </div>
            ) : null}

            <div className="grid gap-4 rounded-3xl border border-border bg-background/70 p-5 sm:grid-cols-2">
              <div className="rounded-2xl border border-border bg-surfaceAlt/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accentSoft">
                  PUUID
                </p>
                <p className="mt-2 break-all text-sm leading-7 text-white">
                  {account.puuid}
                </p>
              </div>

              {account.ranked ? (
                <div className="rounded-2xl border border-border bg-surfaceAlt/70 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accentSoft">
                    Winrate
                  </p>
                  <p className="mt-2 text-xl font-semibold text-white">
                    {formatWinrate(account.ranked.soloDuo)}
                  </p>
                </div>
              ) : (
                <div className="rounded-2xl border border-border bg-surfaceAlt/70 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accentSoft">
                    Profile
                  </p>
                  <p className="mt-2 text-sm leading-7 text-textMuted">
                    Account and summoner details loaded successfully even without
                    ranked data.
                  </p>
                </div>
              )}
            </div>

            <Suspense fallback={<RecentMatchesLoading />}>
              <RecentMatchesSection
                baseUrl={baseUrl}
                puuid={account.puuid}
                server={region}
              />
            </Suspense>
          </div>
        </section>
      </main>
    );
  } catch (error) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] border border-border bg-surface/90 p-8 shadow-glow sm:p-10">
          <div className="space-y-5">
            <span className="inline-flex rounded-full border border-rose-400/20 bg-rose-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-rose-200">
              Server Error
            </span>

            <div className="space-y-3">
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Player Profile
              </h1>
              <p className="max-w-2xl text-base leading-7 text-textMuted">
                The server could not complete the profile request.
              </p>
            </div>

            <div className="rounded-3xl border border-border bg-background/70 p-5">
              <p className="text-sm font-semibold text-white">Details</p>
              <p className="mt-2 text-sm leading-6 text-textMuted">
                {error instanceof Error ? error.message : "Unknown server error"}
              </p>
            </div>
          </div>
        </section>
      </main>
    );
  }
}
