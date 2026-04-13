"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const regions = [
  "EUW",
  "EUNE",
  "NA",
  "KR",
  "BR",
  "LAN",
  "LAS",
  "OCE",
];

export function SearchPanel() {
  const router = useRouter();
  const [riotId, setRiotId] = useState("");
  const [region, setRegion] = useState("EUW");
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedRiotId = riotId.trim();

    // Riot IDs must include a hashtag so we can separate the game name from the tag.
    if (!normalizedRiotId.includes("#")) {
      setError("Enter a Riot ID in the format SummonerName#TAG.");
      return;
    }

    const [name, tag] = normalizedRiotId.split("#");

    // Both parts are required, otherwise the input is still incomplete.
    if (!name || !tag) {
      setError("Both the player name and tag are required.");
      return;
    }

    setError("");

    // The current route only needs the player name and region.
    // We still parse the tag now so the form logic is ready for future expansions.
    router.push(`/player/${encodeURIComponent(name)}/${region.toLowerCase()}`);
  }

  return (
    <section className="rounded-[2rem] border border-border bg-surface/90 p-5 shadow-glow sm:p-6 lg:p-8">
      <div className="space-y-6">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accentSoft">
            Search a Riot ID
          </p>
          <h2 className="text-2xl font-semibold text-white sm:text-3xl">
            Start with a single player lookup
          </h2>
          <p className="text-sm leading-6 text-textMuted sm:text-base">
            Enter a Riot ID and region to jump into the player profile route.
          </p>
        </div>

        {/* App Router navigation happens on submit so the UI stays simple and scalable. */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label
              htmlFor="riot-id"
              className="text-sm font-medium text-white"
            >
              Riot ID
            </label>
            <input
              id="riot-id"
              type="text"
              placeholder="SummonerName#TAG"
              value={riotId}
              onChange={(event) => setRiotId(event.target.value)}
              className="w-full rounded-2xl border border-border bg-background/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-textMuted focus:border-accent"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="region"
              className="text-sm font-medium text-white"
            >
              Region
            </label>
            <select
              id="region"
              value={region}
              onChange={(event) => setRegion(event.target.value)}
              className="w-full rounded-2xl border border-border bg-background/70 px-4 py-3 text-sm text-white outline-none transition focus:border-accent"
            >
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>

          {error ? (
            <p className="text-sm text-rose-300">{error}</p>
          ) : null}

          <button
            type="submit"
            className="w-full rounded-2xl bg-accent px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-accentSoft"
          >
            View Stats
          </button>
        </form>

        <div className="grid gap-3 rounded-3xl border border-border bg-background/70 p-4 sm:grid-cols-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accentSoft">
              Search
            </p>
            <p className="mt-2 text-sm text-textMuted">
              Riot ID and region inputs are ready for future form logic.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accentSoft">
              Routing
            </p>
            <p className="mt-2 text-sm text-textMuted">
              The page structure already supports dedicated stat views.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accentSoft">
              Scaling
            </p>
            <p className="mt-2 text-sm text-textMuted">
              Shared components keep future growth manageable.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
