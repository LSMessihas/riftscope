import { FeatureCard } from "@/components/feature-card";
import { SearchPanel } from "@/components/search-panel";
import { SiteHeader } from "@/components/site-header";

// These cards double as placeholder navigation and a simple roadmap for growth.
const featureCards = [
  {
    title: "Player Profile",
    description:
      "A future-ready overview for rank, account identity, and season performance.",
    href: "/player-profile",
  },
  {
    title: "Recent Matches",
    description:
      "A placeholder space for match timelines, outcomes, and role-by-role breakdowns.",
    href: "/recent-matches",
  },
  {
    title: "Top Champions",
    description:
      "A starting point for champion mastery, win rate trends, and comfort picks.",
    href: "/top-champions",
  },
];

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
      <SiteHeader />

      <section className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[1.15fr_0.85fr] lg:py-16">
        <div className="space-y-6">
          <span className="inline-flex rounded-full border border-border bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-accentSoft">
            League of Legends Stats
          </span>

          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Track the climb with RiftScope
            </h1>
            <p className="max-w-2xl text-base leading-7 text-textMuted sm:text-lg">
              A clean, mobile-first foundation for summoner insights, match
              history, and champion performance. Built to feel modern today and
              scale smoothly when live data arrives.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {featureCards.map((card) => (
              // Shared cards keep the homepage easy to expand with more sections later.
              <FeatureCard key={card.href} {...card} />
            ))}
          </div>
        </div>

        <SearchPanel />
      </section>
    </main>
  );
}
