type PlayerProfileRouteProps = {
  params: {
    name: string;
    region: string;
  };
};

export default function PlayerProfileRoute({
  params,
}: PlayerProfileRouteProps) {
  // In the App Router, folder names wrapped in brackets become dynamic params.
  // For `/player/faker/kr`, Next.js passes `{ name: "faker", region: "kr" }`.
  const { name, region } = params;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
      <section className="rounded-[2rem] border border-border bg-surface/90 p-8 shadow-glow sm:p-10">
        <div className="space-y-5">
          <span className="inline-flex rounded-full border border-border bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-accentSoft">
            Dynamic Route
          </span>

          <div className="space-y-3">
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Player Profile
            </h1>
            <p className="max-w-2xl text-base leading-7 text-textMuted">
              This route reads the player name and region directly from the URL.
            </p>
          </div>

          <div className="grid gap-4 rounded-3xl border border-border bg-background/70 p-5 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-surfaceAlt/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accentSoft">
                Player Name
              </p>
              <p className="mt-2 text-xl font-semibold text-white">{name}</p>
            </div>

            <div className="rounded-2xl border border-border bg-surfaceAlt/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accentSoft">
                Region
              </p>
              <p className="mt-2 text-xl font-semibold text-white">
                {region.toUpperCase()}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
