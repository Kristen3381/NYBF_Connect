import Image from "next/image";
import Link from "next/link";
import { Nav } from "@/components/nav";
import { ShieldCheck, Target, Users, BookOpen, Scale, ArrowRight, Sparkles, Award, MapPin } from "lucide-react";
import { FooterColumn } from "@/components/ui-blocks";

export const metadata = {
  title: "About NYBF | National Youth Budget Forum",
  description: "Learn about the mission, governance, and 47-county grassroots network of the National Youth Budget Forum.",
};

const pillars = [
  {
    icon: BookOpen,
    title: "Civic Budget Literacy",
    description: "Translating complex treasury policy papers, finance acts, and debt instruments into actionable citizen learning modules.",
  },
  {
    icon: Users,
    title: "Devolved Public Participation",
    description: "Organizing physical and virtual budget hearings in all 47 counties to demand accountability on local youth funds and bursaries.",
  },
  {
    icon: Scale,
    title: "Legislative Advocacy",
    description: "Synthesizing youth polling data into formal Memoranda submitted to Parliament's Departmental Committee on Finance and Planning.",
  },
  {
    icon: Award,
    title: "Economic Empowerment (AGPO)",
    description: "Democratizing access to the mandatory 30% Youth Public Procurement Quota and entrepreneurship seed grants.",
  },
];

const leadershipTeam = [
  {
    name: "Ougo Sam",
    role: "Chairperson",
    county: "National Executive Council",
    photo: "/pictures/chairperson-ougo-sam.jpeg",
  },
  {
    name: "Obade George",
    role: "Head of Secretariat",
    county: "National Secretariat Desk",
    photo: "/pictures/secretariat-obade-george.jpeg",
  },
  {
    name: "Faith Chebet",
    role: "Rift Valley Regional Coordinator",
    county: "Kericho / Nakuru",
    photo: "/pictures/panel-speech.jpeg",
  },
  {
    name: "Brian Ochieng",
    role: "Western Regional Coordinator",
    county: "Kisumu / Kakamega",
    photo: "/pictures/roundtable-overhead.jpeg",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen text-ink selection:bg-brand/20 selection:text-brand">
      <Nav />

      {/* HERO SECTION — Minimal dimming, vivid photography */}
      <section className="relative overflow-hidden border-b border-line bg-brand-dark py-20 text-white sm:py-28">
        <div className="absolute inset-0">
          <Image
            src="/pictures/leaders-exterior.jpeg"
            alt="National Youth Budget Forum Delegates"
            fill
            sizes="100vw"
            className="object-cover opacity-75 object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/90 via-brand-dark/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/95 via-transparent to-brand-dark/40" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="glass-panel-photo mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-emerald-300">
            <ShieldCheck size={14} />
            The Voice of Kenya&apos;s Youth in Public Finance
          </div>
          <h1 className="font-serif text-4xl font-extrabold tracking-tight text-white sm:text-6xl text-shadow-strong">
            About National Youth Budget Forum
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white sm:text-lg text-shadow-strong">
            NYBF Connect is Kenya&apos;s non-partisan civic-tech coalition uniting young Kenyans across all 47 counties to decode the national budget, demand public accountability, and shape economic policy.
          </p>
        </div>
      </section>

      {/* MISSION & VISION */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-brand dark:text-brand-light">
              Our Constitutional Mandate
            </span>
            <h2 className="font-serif text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              Anchored in Article 201 of the Constitution of Kenya (2010)
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-muted">
              Public money belongs to the citizens. Article 201 mandates that there shall be openness and accountability, including public participation in all financial matters, with the burden of taxation shared fairly across generations.
            </p>
            <p className="text-sm sm:text-base leading-relaxed text-muted">
              Founded by young economists, lawyers, grassroots community organizers, and student leaders, NYBF provides the digital tools, data visualizations, and policy toolkits required to make youth voices decisive in Parliament and County Assemblies.
            </p>

            <div className="pt-4 flex flex-wrap gap-4">
              <Link
                href="/budget-hub"
                className="flex items-center gap-2 rounded-full bg-brand px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-brand/20 transition-all hover:bg-brand-light"
              >
                <span>Explore Budget Hub</span>
                <ArrowRight size={14} />
              </Link>
              <Link
                href="/my-nybf"
                className="rounded-full border border-line bg-surface px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-ink hover:border-brand/40"
              >
                <span>Join 47 County Chapters</span>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 relative aspect-[4/3] overflow-hidden rounded-3xl border border-line shadow-xl">
            <Image
              src="/pictures/auditorium-crowd.jpeg"
              alt="Youth forum auditorium"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <div className="text-xs font-bold uppercase tracking-widest text-emerald-400">National Townhall</div>
              <div className="font-serif text-xl font-bold">2,500+ Youth Delegates Assembled in Nairobi</div>
            </div>
          </div>
        </div>

        {/* 4 CORE PILLARS */}
        <div className="mt-24">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-brand dark:text-brand-light">
              Strategic Framework
            </span>
            <h2 className="mt-2 font-serif text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              The 4 Pillars of NYBF Connect
            </h2>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="rounded-3xl border border-line bg-surface p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-lg"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand dark:bg-brand/20 dark:text-brand-light">
                    <Icon size={22} />
                  </div>
                  <h3 className="mt-5 font-serif text-lg font-bold text-ink">{pillar.title}</h3>
                  <p className="mt-2 text-xs sm:text-sm text-muted leading-relaxed">{pillar.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* LEADERSHIP GRID */}
        <div className="mt-24">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand dark:text-brand-light">
                Coordination Desk
              </span>
              <h2 className="mt-2 font-serif text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
                National Leadership Team
              </h2>
            </div>
            <div className="text-xs font-bold text-muted">
              Representing 47 Devolved Chapters
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {leadershipTeam.map((leader) => (
              <div
                key={leader.name}
                className="group relative overflow-hidden rounded-3xl border border-line bg-surface shadow-sm transition-all hover:shadow-xl"
              >
                <div className="relative aspect-square w-full overflow-hidden">
                  <Image
                    src={leader.photo}
                    alt={leader.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="flex items-center gap-1 text-[11px] text-emerald-300 font-semibold">
                      <MapPin size={12} />
                      <span>{leader.county}</span>
                    </div>
                    <div className="font-serif text-lg font-bold">{leader.name}</div>
                    <div className="text-xs text-white/80">{leader.role}</div>
                  </div>
                </div>
              </div>
            ))}
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
            title="47 Counties"
            links={[
              { label: "Nairobi Hub", href: "/events" },
              { label: "Coast Chapter", href: "/events" },
              { label: "Rift Valley Chapter", href: "/events" },
            ]}
          />
          <FooterColumn
            title="Governance"
            links={[
              { label: "About NYBF", href: "/about" },
              { label: "Constitution Art. 201", href: "https://kenyalaw.org" },
              { label: "Join Network", href: "/my-nybf" },
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
