import { headers } from "next/headers";

type PlayerProfileRouteProps = {
  params: {
    name: string;
    region: string;
  };
};

type RiotAccountResponse = {
  puuid: string;
  gameName: string;
  tagLine: string;
};

function buildBaseUrl() {
  const requestHeaders = headers();
  const host = requestHeaders.get("host");
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "http";

  if (!host) {
    throw new Error("Missing host header for internal API request.");
  }

  return `${protocol}://${host}`;
}

export default async function PlayerProfileRoute({
  params,
}: PlayerProfileRouteProps) {
  const { name, region } = params;

  try {
    const baseUrl = buildBaseUrl();

    // This server component fetches from our internal API route, not directly from Riot.
    // That keeps the Riot API key on the server while still giving the page real data.
    const response = await fetch(
      `${baseUrl}/api/riot/account?name=${encodeURIComponent(
        name,
      )}&tag=${encodeURIComponent(region)}`,
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

    return (
      <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] border border-border bg-surface/90 p-8 shadow-glow sm:p-10">
          <div className="space-y-5">
            <span className="inline-flex rounded-full border border-border bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-accentSoft">
              Live Account Data
            </span>

            <div className="space-y-3">
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Player Profile
              </h1>
              <p className="max-w-2xl text-base leading-7 text-textMuted">
                This page is rendered on the server and populated through the
                internal Riot API route.
              </p>
            </div>

            <div className="grid gap-4 rounded-3xl border border-border bg-background/70 p-5 sm:grid-cols-2">
              <div className="rounded-2xl border border-border bg-surfaceAlt/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accentSoft">
                  Game Name
                </p>
                <p className="mt-2 text-xl font-semibold text-white">
                  {account.gameName}
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-surfaceAlt/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accentSoft">
                  Tag Line
                </p>
                <p className="mt-2 text-xl font-semibold text-white">
                  {account.tagLine}
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-surfaceAlt/70 p-4 sm:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accentSoft">
                  PUUID
                </p>
                <p className="mt-2 break-all text-sm leading-7 text-white">
                  {account.puuid}
                </p>
              </div>
            </div>
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
