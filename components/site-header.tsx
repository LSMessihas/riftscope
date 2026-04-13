import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="flex items-center justify-between rounded-full border border-border bg-surface/80 px-4 py-3 backdrop-blur sm:px-5">
      <Link href="/" className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-base font-bold text-slate-950">
          RS
        </div>

        <div>
          <p className="text-lg font-semibold tracking-wide text-white">
            RiftScope
          </p>
          <p className="text-xs uppercase tracking-[0.24em] text-textMuted">
            Competitive stats hub
          </p>
        </div>
      </Link>

      <nav className="hidden items-center gap-4 text-sm text-textMuted sm:flex">
        <Link href="/player-profile" className="hover:text-white">
          Profile
        </Link>
        <Link href="/recent-matches" className="hover:text-white">
          Matches
        </Link>
        <Link href="/top-champions" className="hover:text-white">
          Champions
        </Link>
      </nav>
    </header>
  );
}
