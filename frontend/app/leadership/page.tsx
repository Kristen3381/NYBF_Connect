import Image from "next/image";
import Link from "next/link";
import { Nav } from "@/components/nav";
import {
  ShieldCheck,
  Award,
  Users,
  MapPin,
  Mail,
  ArrowRight,
  Sparkles,
  Scale,
  BookOpen,
  Calendar,
  Building2,
  ExternalLink,
  Landmark,
} from "lucide-react";
import { FooterColumn } from "@/components/ui-blocks";

export const metadata = {
  title: "NYBF Leadership | National Youth Budget Forum",
  description: "Meet the executive leadership steering the National Youth Budget Forum across Kenya's 47 counties.",
};

const executiveLeaders = [
  {
    name: "Ougo Sam",
    title: "Chairperson",
    organization: "National Youth Budget Forum",
    photo: "/pictures/chairperson-ougo-sam.jpeg",
    roleDescription:
      "Steering the National Executive Council and presiding over multi-county youth delegations. Leads strategic engagements with the National Treasury, Parliament's Budget Committee, and national development partners to champion equitable fiscal policies for Kenyan youth.",
    quote: "Our economy cannot prosper when youth are merely spectators in national budgeting. Article 201 guarantees our seat at the decision table.",
    badge: "Executive Council Lead",
  },
  {
    name: "Obade George",
    title: "Head of Secretariat",
    organization: "National Youth Budget Forum",
    photo: "/pictures/secretariat-obade-george.jpeg",
    roleDescription:
      "Directing operational execution, research synthesis, and county chapter coordination across all 47 devolved units. Coordinates the compilation and presentation of the National Youth Budget Memoranda before legislative committees.",
    quote: "Every public shilling allocated must have measurable impact on youth enterprise, TVET skills, and county devolution governance.",
    badge: "Executive Secretary",
  },
];

export default function LeadershipPage() {
  return (
    <main className="min-h-screen text-ink selection:bg-brand/20 selection:text-brand">
      <Nav />

      {/* HERO SECTION — Minimal dimming, vivid photography */}
      <section className="relative overflow-hidden border-b border-line bg-brand-dark py-18 text-white sm:py-26">
        <div className="absolute inset-0">
          <Image
            src="/pictures/auditorium-crowd.jpeg"
            alt="National Youth Budget Forum Assembly"
            fill
            sizes="100vw"
            className="object-cover opacity-75 object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/95 via-brand-dark/75 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/95 via-transparent to-brand-dark/40" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="glass-panel-photo mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-emerald-300">
            <Users size={14} />
            National Executive Council
          </div>
          <h1 className="font-serif text-4xl font-extrabold tracking-tight text-white sm:text-6xl text-shadow-strong">
            NYBF Leadership
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg text-shadow-strong">
            Meet the dedicated leadership team driving youth fiscal literacy, legislative public participation, and devolved budget accountability across Kenya.
          </p>
        </div>
      </section>

      {/* EXECUTIVE PRINCIPALS SECTION */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-brand dark:text-brand-light">
            Executive Bureau
          </span>
          <h2 className="mt-2 font-serif text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            National Executive Leadership
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted">
            The executive principals providing strategic oversight and operational management for the National Youth Budget Forum.
          </p>
        </div>

        {/* 2 EXECUTIVE PROFILES (OUGO SAM & OBADE GEORGE) */}
        <div className="grid gap-10 lg:grid-cols-2">
          {executiveLeaders.map((leader) => (
            <div
              key={leader.name}
              className="group relative overflow-hidden rounded-3xl border border-line bg-surface shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-2xl flex flex-col md:flex-row"
            >
              {/* Photo Column */}
              <div className="relative w-full md:w-5/12 aspect-[4/5] md:aspect-auto overflow-hidden bg-brand-dark">
                <Image
                  src={leader.photo}
                  alt={`${leader.name} - ${leader.title}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 350px"
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent md:hidden" />
                <div className="absolute top-4 left-4">
                  <span className="glass-panel-photo rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                    {leader.badge}
                  </span>
                </div>
              </div>

              {/* Bio & Details Column */}
              <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <div className="hidden md:inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-brand dark:bg-brand/20 dark:text-brand-light">
                    {leader.badge}
                  </div>

                  <h3 className="mt-3 font-serif text-2xl font-black text-ink sm:text-3xl">
                    {leader.name}
                  </h3>
                  <div className="text-sm font-bold text-brand dark:text-brand-light">
                    {leader.title}, {leader.organization}
                  </div>

                  <p className="mt-4 text-xs sm:text-sm text-muted leading-relaxed">
                    {leader.roleDescription}
                  </p>

                  {/* Leader Quote Callout */}
                  <blockquote className="mt-5 rounded-2xl border-l-4 border-brand bg-bg p-4 text-xs italic text-ink/90">
                    &ldquo;{leader.quote}&rdquo;
                  </blockquote>
                </div>

                <div className="mt-6 pt-4 border-t border-line flex items-center justify-between text-xs font-semibold">
                  <span className="flex items-center gap-1 text-muted">
                    <MapPin size={13} className="text-brand" />
                    <span>National Secretariat (Nairobi)</span>
                  </span>
                  <Link
                    href="/my-nybf"
                    className="flex items-center gap-1 text-brand hover:text-brand-light font-bold"
                  >
                    <span>Connect</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* KEY GOVERNMENT & INSTITUTIONAL PARTNERS SECTION */}
        <div className="mt-24 pt-16 border-t border-line">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-brand dark:text-brand-light">
              Institutional Engagement &amp; Devolution Partners
            </span>
            <h2 className="mt-2 font-serif text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              Key Government &amp; Institutional Partners
            </h2>
            <p className="mt-3 text-sm sm:text-base text-muted">
              Official government ministries, regulatory bodies, and public authorities engaged through constitutional budget participation, public hearings, and policy memoranda under Article 201.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="group relative overflow-hidden rounded-3xl border border-line bg-surface shadow-md transition-all duration-300 hover:border-brand/40 hover:shadow-2xl flex flex-col md:flex-row">
              {/* Photo Column */}
              <div className="relative w-full md:w-5/12 aspect-[4/5] md:aspect-auto overflow-hidden bg-brand-dark">
                <Image
                  src="/pictures/cs-john-mbadi.jpeg"
                  alt="Hon. John Mbadi, EGH - Cabinet Secretary, The National Treasury & Economic Planning"
                  fill
                  sizes="(max-width: 768px) 100vw, 350px"
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent md:hidden" />
                <div className="absolute top-4 left-4">
                  <span className="glass-panel-photo rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-300">
                    Institutional Partner
                  </span>
                </div>
              </div>

              {/* Bio & Details Column */}
              <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-brand dark:bg-brand/20 dark:text-brand-light">
                      <Landmark size={12} />
                      National Government
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-[11px] font-bold text-amber-700 dark:text-amber-400 border border-amber-500/20">
                      Official Partner Context
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl font-black text-ink sm:text-3xl">
                    Hon. John Mbadi, EGH
                  </h3>
                  <div className="text-sm font-bold text-brand dark:text-brand-light">
                    Cabinet Secretary, The National Treasury &amp; Economic Planning
                  </div>
                  <div className="text-xs font-semibold text-muted">
                    Republic of Kenya
                  </div>

                  <p className="mt-4 text-xs sm:text-sm text-muted leading-relaxed">
                    The National Treasury coordinates national fiscal policy, the Budget Policy Statement (BPS), and the national Division of Revenue. NYBF Connect engages the National Treasury through statutory Article 201 public participation hearings, technical youth budget submissions, and youth empowerment fiscal oversight.
                  </p>

                  {/* Explicit Mandatory Context Disclaimer */}
                  <div className="mt-5 rounded-2xl border border-line bg-bg p-3.5 text-xs text-muted">
                    <div className="flex items-start gap-2">
                      <ShieldCheck size={16} className="text-brand dark:text-brand-light shrink-0 mt-0.5" />
                      <div className="leading-relaxed">
                        <strong className="text-ink">Official Government Partner Context: </strong>
                        This profile acknowledges public institutional dialogue under constitutional budget participation (Article 201). This listing does not constitute a personal endorsement of NYBF Connect or a personal relationship.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Official Public Contact Channels (Only Official Government Link) */}
                <div className="mt-6 pt-4 border-t border-line flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-semibold">
                  <div className="flex items-center gap-1.5 text-muted">
                    <Building2 size={14} className="text-brand shrink-0" />
                    <span>The National Treasury, Treasury Building, Harambee Ave, Nairobi</span>
                  </div>
                  <a
                    href="https://www.treasury.go.ke"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-brand hover:text-brand-light font-bold hover:underline"
                  >
                    <span>Official Portal (treasury.go.ke)</span>
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA BANNER */}
        <div className="mt-20 rounded-3xl border border-line bg-brand-dark p-8 sm:p-12 text-white relative overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/pictures/rally-flags.jpeg"
              alt="Join NYBF"
              fill
              className="object-cover opacity-35 object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-dark/80 to-transparent" />
          </div>

          <div className="relative max-w-2xl space-y-4">
            <span className="glass-panel-photo inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-300">
              Grassroots Leadership
            </span>
            <h3 className="font-serif text-3xl font-extrabold sm:text-4xl text-shadow-strong">
              Interested in Leading Your County Chapter?
            </h3>
            <p className="text-sm text-white/85 leading-relaxed text-shadow-subtle">
              NYBF is expanding county budget desks in all 47 counties. Join our leadership development program to represent youth in your County Assembly.
            </p>
            <div className="pt-2">
              <Link
                href="/my-nybf"
                className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-brand-dark hover:bg-emerald-300 transition-all shadow-lg"
              >
                <span>Apply for County Leadership</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-brand-dark text-white border-t border-white/10 mt-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-4 lg:px-8">
          <div>
            <div className="font-serif text-2xl font-bold tracking-tight text-white">
              NYBF <span className="text-xs uppercase font-sans tracking-widest text-brand-gold">Connect</span>
            </div>
            <p className="mt-3 text-xs text-white/70">
              National Youth Budget Forum — Your Voice, Your Economy.
            </p>
          </div>
          <FooterColumn
            title="Platform"
            links={[
              { label: "Budget Hub", href: "/budget-hub" },
              { label: "Youth Voice", href: "/youth-voice" },
              { label: "Opportunities", href: "/opportunities" },
              { label: "Events", href: "/events" },
            ]}
          />
          <FooterColumn
            title="Governance"
            links={[
              { label: "Leadership", href: "/leadership" },
              { label: "About NYBF", href: "/about" },
              { label: "Member Portal", href: "/my-nybf" },
            ]}
          />
          <FooterColumn
            title="47 Counties"
            links={[
              { label: "Nairobi Chapter", href: "/events" },
              { label: "Coast Chapter", href: "/events" },
              { label: "Rift Valley Chapter", href: "/events" },
            ]}
          />
        </div>
        <div className="border-t border-white/10 py-6 text-center text-xs text-white/50">
          © 2026 National Youth Budget Forum. Built for the youth of Kenya.
        </div>
      </footer>
    </main>
  );
}
