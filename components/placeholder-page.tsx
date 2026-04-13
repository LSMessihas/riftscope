import Link from "next/link";

type PlaceholderPageProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PlaceholderPage({
  eyebrow,
  title,
  description,
}: PlaceholderPageProps) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-border bg-surface/90 p-8 shadow-glow sm:p-10">
        <div className="space-y-5">
          <span className="inline-flex rounded-full border border-border bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-accentSoft">
            {eyebrow}
          </span>

          <div className="space-y-3">
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {title}
            </h1>
            <p className="max-w-2xl text-base leading-7 text-textMuted">
              {description}
            </p>
          </div>

          {/* These content blocks show how future data modules could slot into the layout. */}
          <div className="grid gap-4 rounded-3xl border border-border bg-background/70 p-5 sm:grid-cols-3">
            <div>
              <p className="text-sm font-semibold text-white">Stats cards</p>
              <p className="mt-2 text-sm leading-6 text-textMuted">
                Reserve space for ranked KPIs and account metrics.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Filters</p>
              <p className="mt-2 text-sm leading-6 text-textMuted">
                Add queue, role, and patch filters when data is available.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Visuals</p>
              <p className="mt-2 text-sm leading-6 text-textMuted">
                Expand this layout with charts, tables, and champion cards.
              </p>
            </div>
          </div>

          <Link
            href="/"
            className="inline-flex w-fit rounded-full border border-accent/30 bg-accent px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-accentSoft"
          >
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
