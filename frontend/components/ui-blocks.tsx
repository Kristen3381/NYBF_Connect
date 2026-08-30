import Link from "next/link";
import { ArrowRight, Sparkles, MapPin, Clock, Calendar, CheckCircle2, Bookmark, ShieldCheck, TrendingUp } from "lucide-react";

export function DashboardCard({
  icon,
  title,
  value,
  label,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  label: string;
  href?: string;
}) {
  const content = (
    <div className="glass-panel-photo group relative overflow-hidden rounded-2xl p-5 text-white transition-all duration-300 hover:-translate-y-1 hover:border-white/40 hover:shadow-xl">
      <div className="flex items-center justify-between">
        <div className="rounded-xl bg-white/10 p-2.5 text-emerald-400 transition-transform group-hover:scale-110">
          {icon}
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-white/50 group-hover:text-emerald-300">
          Explore →
        </span>
      </div>
      <div className="mt-4 text-3xl font-black tracking-tight text-white">{value}</div>
      <div className="font-serif text-base font-bold text-white/95">{title}</div>
      <div className="mt-0.5 text-xs text-white/70">{label}</div>
      <div className="absolute bottom-0 left-0 h-1 w-0 bg-emerald-400 transition-all duration-300 group-hover:w-full" />
    </div>
  );

  if (href) {
    return <Link href={href} className="block">{content}</Link>;
  }
  return content;
}

export function Stat({
  number,
  label,
  subtext,
}: {
  number: string;
  label: string;
  subtext?: string;
}) {
  return (
    <div className="group relative flex flex-col items-center justify-center rounded-2xl border border-line bg-surface/80 p-6 text-center shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-md">
      <div className="font-serif text-3xl font-black tracking-tight text-brand dark:text-brand-light sm:text-4xl">
        {number}
      </div>
      <div className="mt-1 text-xs font-bold uppercase tracking-widest text-ink/90">{label}</div>
      {subtext && <div className="mt-0.5 text-[11px] text-muted">{subtext}</div>}
    </div>
  );
}

export function Feature({
  icon,
  title,
  text,
  badge,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  badge?: string;
}) {
  return (
    <div className="group relative flex flex-col rounded-3xl border border-line bg-surface p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-xl">
      <div className="flex items-center justify-between">
        <div className="inline-flex rounded-2xl bg-brand/10 p-3.5 text-brand transition-transform duration-300 group-hover:scale-110 dark:bg-brand/20 dark:text-brand-light">
          {icon}
        </div>
        {badge && (
          <span className="rounded-full bg-brand/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-brand dark:bg-brand/20 dark:text-brand-light">
            {badge}
          </span>
        )}
      </div>
      <h3 className="mt-6 font-serif text-2xl font-bold tracking-tight text-ink">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted">{text}</p>
    </div>
  );
}

export function Course({
  number,
  title,
  description,
  href,
  duration,
}: {
  number: string;
  title: string;
  description: string;
  href?: string;
  duration?: string;
}) {
  return (
    <div className="group relative flex flex-col justify-between rounded-3xl border border-line bg-surface p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-xl">
      <div>
        <div className="flex items-center justify-between">
          <span className="rounded-xl bg-brand/10 px-3 py-1 font-mono text-xs font-black text-brand dark:bg-brand/20 dark:text-brand-light">
            MODULE {number}
          </span>
          {duration && (
            <span className="flex items-center gap-1 text-xs text-muted">
              <Clock size={13} />
              {duration}
            </span>
          )}
        </div>
        <h3 className="mt-5 font-serif text-xl font-bold leading-snug text-ink group-hover:text-brand transition-colors">
          {title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted">{description}</p>
      </div>

      <Link
        href={href ?? "/budget-hub"}
        className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand transition-all group-hover:gap-3 dark:text-brand-light"
      >
        <span>Begin Module</span>
        <ArrowRight size={15} />
      </Link>
    </div>
  );
}

export function OpportunityCard({
  title,
  type,
  location,
  deadline,
  href,
}: {
  title: string;
  type: string;
  location: string;
  deadline: string;
  href?: string;
}) {
  const typeBadgeColors: Record<string, string> = {
    PROGRAMME: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    FELLOWSHIP: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    INTERNSHIP: "bg-sky-500/20 text-sky-300 border-sky-500/30",
    GRANT: "bg-rose-500/20 text-rose-300 border-rose-500/30",
    JOB: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  };

  const badgeClass =
    typeBadgeColors[type.toUpperCase()] ?? "bg-white/15 text-white/90 border-white/20";

  return (
    <div className="glass-panel-photo group flex h-full flex-col justify-between rounded-3xl p-6 text-white transition-all duration-300 hover:-translate-y-1.5 hover:border-white/40 hover:shadow-2xl">
      <div>
        <div className="flex items-center justify-between">
          <span className={`rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${badgeClass}`}>
            {type}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-white/70">
            <Clock size={12} />
            {deadline}
          </span>
        </div>

        <h3 className="mt-4 font-serif text-xl font-bold leading-snug text-white group-hover:text-emerald-300 transition-colors">
          {title}
        </h3>

        <div className="mt-3 flex items-center gap-1.5 text-xs text-white/80">
          <MapPin size={14} className="text-emerald-400" />
          <span>{location}</span>
        </div>
      </div>

      <Link
        href={href ?? "/opportunities"}
        className="mt-6 flex items-center justify-between border-t border-white/15 pt-4 text-xs font-bold uppercase tracking-wider text-white/90 transition group-hover:text-emerald-300"
      >
        <span>View Details & Apply</span>
        <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
}

export function FooterColumn({ title, links }: { title: string; links: { href: string; label: string }[] | string[] }) {
  return (
    <div>
      <h3 className="font-serif text-sm font-bold uppercase tracking-widest text-white/90">{title}</h3>
      <div className="mt-4 space-y-2.5">
        {links.map((link) => {
          if (typeof link === "string") {
            return (
              <div key={link} className="text-xs text-white/70 transition hover:text-white cursor-pointer">
                {link}
              </div>
            );
          }
          return (
            <Link
              key={link.label}
              href={link.href}
              className="block text-xs text-white/70 transition hover:text-emerald-300"
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
