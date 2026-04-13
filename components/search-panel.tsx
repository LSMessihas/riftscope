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
            This form is intentionally static for now, so the project stays easy
            to extend when API integration begins.
          </p>
        </div>

        {/* The form is presentational for now and can later be wired to routing or API calls. */}
        <form className="space-y-4">
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
              defaultValue="EUW"
              className="w-full rounded-2xl border border-border bg-background/70 px-4 py-3 text-sm text-white outline-none transition focus:border-accent"
            >
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
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
