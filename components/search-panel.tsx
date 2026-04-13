"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const servers = [
  "EUW",
  "EUNE",
  "TR",
  "RU",
  "NA",
  "LAN",
  "LAS",
  "BR",
  "KR",
  "JP",
];

export function SearchPanel() {
  const router = useRouter();
  const [riotId, setRiotId] = useState("");
  const [server, setServer] = useState("EUW");
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedRiotId = riotId.trim();

    // Riot ID is the public player identifier in the format `gameName#tagLine`.
    // It is separate from the selected League platform server like EUW or NA.
    if (!normalizedRiotId.includes("#")) {
      setError("Enter a Riot ID in the format SummonerName#TAG.");
      return;
    }

    const riotIdParts = normalizedRiotId.split("#");

    if (riotIdParts.length !== 2) {
      setError("Use exactly one # in the Riot ID, like SummonerName#TAG.");
      return;
    }

    const [gameName, tagLine] = riotIdParts.map((part) => part.trim());

    if (!gameName || !tagLine) {
      setError("Both the game name and tagLine are required.");
      return;
    }

    setError("");

    // The route keeps the selected platform server in the path.
    // The Riot tagLine is passed separately as a query param.
    router.push(
      `/player/${encodeURIComponent(gameName)}/${server.toLowerCase()}?tagLine=${encodeURIComponent(
        tagLine,
      )}`,
    );
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
            Enter a full Riot ID, then choose the League server for the account
            lookup.
          </p>
        </div>

        {/* App Router navigation happens on submit after we split Riot ID into its two parts. */}
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
              htmlFor="server"
              className="text-sm font-medium text-white"
            >
              Server
            </label>
            <select
              id="server"
              value={server}
              onChange={(event) => setServer(event.target.value)}
              className="w-full rounded-2xl border border-border bg-background/70 px-4 py-3 text-sm text-white outline-none transition focus:border-accent"
            >
              {servers.map((serverOption) => (
                <option key={serverOption} value={serverOption}>
                  {serverOption}
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
              Riot ID
            </p>
            <p className="mt-2 text-sm text-textMuted">
              The search input is parsed into `gameName` and `tagLine`.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accentSoft">
              Platform
            </p>
            <p className="mt-2 text-sm text-textMuted">
              The server selector stores the LoL platform shard like EUW or NA.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accentSoft">
              Routing
            </p>
            <p className="mt-2 text-sm text-textMuted">
              The API route later maps the platform server to Riot regional routing.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
