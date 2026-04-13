import Link from "next/link";

type FeatureCardProps = {
  title: string;
  description: string;
  href: string;
};

export function FeatureCard({ title, description, href }: FeatureCardProps) {
  return (
    <Link
      href={href}
      className="group rounded-3xl border border-border bg-surface/80 p-5 shadow-glow transition duration-200 hover:border-accent/40 hover:bg-surfaceAlt"
    >
      <div className="space-y-3">
        <p className="text-lg font-semibold text-white">{title}</p>
        <p className="text-sm leading-6 text-textMuted">{description}</p>
        <span className="inline-flex text-sm font-medium text-accent transition group-hover:text-accentSoft">
          Explore placeholder
        </span>
      </div>
    </Link>
  );
}
