export default function PlayerProfileLoading() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
      <section className="rounded-[2rem] border border-border bg-surface/90 p-8 shadow-glow sm:p-10">
        <div className="space-y-5">
          <span className="inline-flex rounded-full border border-border bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-accentSoft">
            Loading Profile
          </span>

          <div className="space-y-3">
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Player Profile
            </h1>
            <p className="max-w-2xl text-base leading-7 text-textMuted">
              Fetching account data from the internal Riot API.
            </p>
          </div>

          <div className="grid gap-4 rounded-3xl border border-border bg-background/70 p-5 sm:grid-cols-2">
            <div className="h-24 animate-pulse rounded-2xl border border-border bg-surfaceAlt/70" />
            <div className="h-24 animate-pulse rounded-2xl border border-border bg-surfaceAlt/70" />
            <div className="h-24 animate-pulse rounded-2xl border border-border bg-surfaceAlt/70 sm:col-span-2" />
          </div>
        </div>
      </section>
    </main>
  );
}
