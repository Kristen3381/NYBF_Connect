import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  HeartHandshake,
  Lightbulb,
  MapPin,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import { Nav } from "@/components/nav";
import { HeroPhotoCollage } from "@/components/hero-photo-collage";
import { HeroInteractiveStack } from "@/components/hero-interactive-stack";
import { CountyTicker } from "@/components/county-ticker";
import { BudgetExplorer } from "@/components/budget-explorer";
import { LivePulseVoting } from "@/components/live-pulse-voting";
import {
  DashboardCard,
  Stat,
  Feature,
  OpportunityCard,
  FooterColumn,
} from "@/components/ui-blocks";
import { prisma } from "@/lib/prisma";

export const revalidate = 60; // ISR: refresh homepage data every 60s

export default async function Home() {
  // Safe DB queries with fallbacks if DB is still seeding/initializing
  let opportunities: any[] = [];
  let eventCount = 0;
  let moduleCount = 0;
  let activePolls = 0;
  let recentPoll: any = null;
  let upcomingEvents: any[] = [];

  try {
    const [opps, eventsCnt, modsCnt, pollsCnt, pollData, eventsData] = await Promise.all([
      prisma.opportunity.findMany({
        where: { expired: false },
        orderBy: { deadline: "asc" },
        take: 3,
      }),
      prisma.event.count(),
      prisma.budgetModule.count(),
      prisma.poll.count({ where: { active: true } }),
      prisma.poll.findFirst({
        where: { active: true },
        include: {
          options: {
            include: {
              _count: {
                select: { votes: true },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.event.findMany({
        orderBy: { date: "asc" },
        take: 3,
      }),
    ]);

    opportunities = opps;
    eventCount = eventsCnt;
    moduleCount = modsCnt;
    activePolls = pollsCnt;
    recentPoll = pollData;
    upcomingEvents = eventsData;
  } catch (error) {
    // Graceful fallback for offline / preview rendering
    opportunities = [
      {
        id: "1",
        title: "Youth Entrepreneurship Programme",
        type: "PROGRAMME",
        location: "All 47 Counties",
        deadline: new Date("2026-09-30"),
      },
      {
        id: "2",
        title: "Youth Policy Research Fellowship",
        type: "FELLOWSHIP",
        location: "Nairobi / Remote",
        deadline: new Date("2026-10-15"),
      },
      {
        id: "3",
        title: "Digital Skills & AI Policy Internship",
        type: "INTERNSHIP",
        location: "Nairobi / Hybrid",
        deadline: new Date("2026-10-10"),
      },
    ];
    eventCount = 8;
    moduleCount = 3;
    activePolls = 4;
  }

  // Format recent poll for the client voting card
  const formattedPoll = recentPoll
    ? {
        id: recentPoll.id,
        question: recentPoll.question,
        options: recentPoll.options.map((opt: any) => ({
          id: opt.id,
          label: opt.label,
          count: opt._count.votes,
        })),
      }
    : undefined;

  return (
    <main className="min-h-screen text-ink selection:bg-brand/20 selection:text-brand">
      <Nav />

      {/* HERO SECTION — Asymmetric, Layered, Bold Photography */}
      <section className="relative isolate overflow-hidden bg-brand-dark pt-8 pb-20 sm:pt-12 sm:pb-28">
        <HeroPhotoCollage />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            {/* Left Column: Bold Editorial Typography & Mission */}
            <div className="lg:col-span-7 text-left text-white">
              {/* Kicker Pill */}
              <div className="glass-panel-photo mb-6 inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 text-xs font-bold tracking-wide text-white">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                <span className="text-emerald-300">YOUTH. ECONOMY. PARTICIPATION.</span>
                <span className="text-white/40">•</span>
                <span>NATIONAL YOUTH BUDGET FORUM</span>
              </div>

              {/* Main Headline */}
              <h1 className="font-serif text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-6xl sm:leading-[1.1] lg:text-7xl">
                National Youth Budget Forum
              </h1>

              {/* Sub-headline */}
              <p className="mt-3 text-xl font-semibold sm:text-2xl lg:text-3xl text-emerald-300">
                Your Voice, Your Economy.
              </p>

              {/* Description */}
              <p className="mt-6 max-w-2xl text-base font-normal leading-relaxed text-white/90 sm:text-lg sm:leading-8">
                NYBF Connect brings young Kenyans together to understand the national budget, participate in economic discussions, access opportunities and contribute ideas that can shape Kenya&apos;s future.
              </p>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
                <Link
                  href="/my-nybf"
                  className="group flex items-center justify-center gap-2.5 rounded-full bg-white px-8 py-4 text-sm font-bold uppercase tracking-wider text-brand-dark shadow-xl shadow-black/30 transition-all duration-300 hover:-translate-y-1 hover:bg-emerald-300 hover:shadow-2xl active:translate-y-0"
                >
                  <span>My NYBF Portal</span>
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/budget-hub"
                  className="glass-panel-photo flex items-center justify-center gap-2 rounded-full px-7 py-4 text-sm font-bold tracking-wider text-white transition-all duration-300 hover:-translate-y-1 hover:border-white/40 hover:bg-white/20"
                >
                  <span>Explore Budget Hub</span>
                  <ChevronRight size={16} />
                </Link>
              </div>

              {/* Quick Module Metric Cards */}
              <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                <DashboardCard
                  icon={<BookOpen size={20} />}
                  title="Budget Hub"
                  value={String(moduleCount)}
                  label="Learning modules"
                  href="/budget-hub"
                />
                <DashboardCard
                  icon={<MessageSquare size={20} />}
                  title="Youth Voice"
                  value={String(activePolls)}
                  label="Active consultations"
                  href="/youth-voice"
                />
                <DashboardCard
                  icon={<BriefcaseBusiness size={20} />}
                  title="Opportunities"
                  value={String(opportunities.length)}
                  label="Current listings"
                  href="/opportunities"
                />
                <DashboardCard
                  icon={<CalendarDays size={20} />}
                  title="Townhalls"
                  value={String(eventCount)}
                  label="County forums"
                  href="/events"
                />
              </div>
            </div>

            {/* Right Column: Layered Photography Stack & Live Badges */}
            <div className="lg:col-span-5">
              <HeroInteractiveStack />
            </div>
          </div>
        </div>
      </section>

      {/* KINETIC 47-COUNTY TICKER */}
      <CountyTicker />

      {/* STATS STRIP — High Contrast Editorial Numbers */}
      <section className="border-b border-line bg-surface/70 backdrop-blur-md">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-4 lg:gap-6 lg:px-8">
          <Stat number="47" label="Counties Represented" subtext="From Mandera to Kwale" />
          <Stat number="Ksh 4.2T" label="National Budget Monitored" subtext="FY 2026/27 Estimates" />
          <Stat number="250K+" label="Youth Voices Connected" subtext="Digital & on the ground" />
          <Stat number="100%" label="Open Civic Data" subtext="Citizen-audited resources" />
        </div>
      </section>

      {/* ABOUT — Three Pillars of Youth Economic Power */}
      <section id="about" className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-brand dark:bg-brand/20 dark:text-brand-light">
            <ShieldCheck size={14} />
            The Platform Mission
          </div>
          <h2 className="mt-4 font-serif text-3xl font-extrabold tracking-tight text-ink sm:text-5xl">
            Turning youth participation into concrete economic influence.
          </h2>
          <p className="mt-6 text-base leading-relaxed text-muted sm:text-lg sm:leading-8">
            Kenyan youth make up over 70% of the population, yet public finance decisions are often made behind closed doors. NYBF Connect breaks the barrier between technical Treasury jargon and real everyday economic lives.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          <Feature
            icon={<GraduationCap size={24} />}
            badge="Decode"
            title="Learn & Track"
            text="Master how Kenya's budget formulation, revenue collection, debt management, and county devolution disbursements actually function."
          />
          <Feature
            icon={<MessageSquare size={24} />}
            badge="Influence"
            title="Debate & Vote"
            text="Participate in live National Youth Pulse consultations. Vote on sectoral priorities that get compiled into the official NYBF Memorandum."
          />
          <Feature
            icon={<Lightbulb size={24} />}
            badge="Empower"
            title="Access Resources"
            text="Discover curated government tenders (AGPO), fellowship programs, innovation grants, and digital skills bootcamps across all 47 counties."
          />
        </div>
      </section>

      {/* INTERACTIVE BUDGET BREAKDOWN — "Follow the Shilling" */}
      <section className="border-y border-line bg-bg-alt/50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <BudgetExplorer />
        </div>
      </section>

      {/* YOUTH VOICE — Live Voting Card & Policy Proposal Pitch */}
      <section id="voice" className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end mb-12">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-brand/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-brand dark:bg-brand/20 dark:text-brand-light">
              <Sparkles size={14} />
              Youth Voice in Action
            </div>
            <h2 className="mt-3 font-serif text-3xl font-extrabold tracking-tight text-ink sm:text-5xl">
              What should government prioritize?
            </h2>
            <p className="mt-3 max-w-2xl text-sm sm:text-base text-muted">
              Don&apos;t wait for elections to speak up. Cast your vote in the live National Youth Pulse consultation below or pitch your own policy amendment.
            </p>
          </div>
          <Link
            href="/youth-voice"
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand transition-colors hover:text-brand-light dark:text-brand-light shrink-0"
          >
            <span>Explore All Consultations</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <LivePulseVoting initialPoll={formattedPoll} />
      </section>

      {/* OPPORTUNITIES — Live Database-Backed Matrix */}
      <section id="opportunities" className="relative overflow-hidden border-t border-line bg-brand-dark py-20 text-white sm:py-28">
        <div className="absolute inset-0">
          <Image
            src="/pictures/roundtable-overhead.jpeg"
            alt="Youth policy roundtable"
            fill
            sizes="100vw"
            className="object-cover opacity-15 mix-blend-luminosity"
          />
          <div className="scrim-hero absolute inset-0" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end border-b border-white/15 pb-8">
            <div>
              <span className="rounded-full bg-emerald-500/20 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-emerald-300">
                Direct Economic Access
              </span>
              <h2 className="mt-3 font-serif text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
                Featured Youth Opportunities
              </h2>
              <p className="mt-2 text-sm text-white/80 max-w-xl">
                Verified grants, policy research fellowships, and public procurement opportunities.
              </p>
            </div>

            <Link
              href="/opportunities"
              className="group flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-300 transition hover:text-white"
            >
              <span>View All Opportunities</span>
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {opportunities.map((item) => (
              <div key={item.id} className="h-full">
                <OpportunityCard
                  title={item.title}
                  type={item.type}
                  location={item.location}
                  deadline={item.deadline instanceof Date ? item.deadline.toLocaleDateString("en-KE", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  }) : String(item.deadline)}
                  href="/opportunities"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EVENTS — County Townhalls & Summits */}
      <section id="events" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end mb-12">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-brand/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-brand dark:bg-brand/20 dark:text-brand-light">
              <CalendarDays size={14} />
              Gatherings & Summits
            </div>
            <h2 className="mt-3 font-serif text-3xl font-extrabold tracking-tight text-ink sm:text-5xl">
              Upcoming County Forums
            </h2>
            <p className="mt-3 text-sm sm:text-base text-muted max-w-2xl">
              Connect with fellow youth delegates, county budget executives, and members of parliament at our physical and hybrid townhalls.
            </p>
          </div>

          <Link
            href="/events"
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand transition hover:text-brand-light dark:text-brand-light shrink-0"
          >
            <span>See Full Calendar</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Card 1 */}
          <div className="group relative h-80 overflow-hidden rounded-3xl border border-white/20 bg-brand-dark shadow-xl transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl">
            <Image
              src="/pictures/stage-presentation.jpeg"
              alt="National Youth Budget Town Hall"
              fill
              className="object-cover transition duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 400px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white">
              <span className="rounded-full bg-emerald-500/30 border border-emerald-400/40 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                Hybrid • National
              </span>
              <h3 className="mt-3 font-serif text-xl font-bold leading-tight text-white">
                National Youth Budget Town Hall
              </h3>
              <div className="mt-2 flex items-center justify-between text-xs text-white/80">
                <span>12 September 2026</span>
                <span className="flex items-center gap-1 font-semibold text-emerald-300">
                  <MapPin size={12} /> Nairobi
                </span>
              </div>
              <Link
                href="/events"
                className="mt-4 flex items-center justify-between border-t border-white/20 pt-3 text-xs font-bold uppercase tracking-wider text-white transition group-hover:text-emerald-300"
              >
                <span>Register Attendance</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Card 2 */}
          <div className="group relative h-80 overflow-hidden rounded-3xl border border-white/20 bg-brand-dark shadow-xl transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl">
            <Image
              src="/pictures/roundtable-overhead.jpeg"
              alt="Youth Economic Dialogue"
              fill
              className="object-cover transition duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 400px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white">
              <span className="rounded-full bg-amber-500/30 border border-amber-400/40 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-300">
                County Dialogue
              </span>
              <h3 className="mt-3 font-serif text-xl font-bold leading-tight text-white">
                Youth Economic & Debt Dialogue
              </h3>
              <div className="mt-2 flex items-center justify-between text-xs text-white/80">
                <span>26 September 2026</span>
                <span className="flex items-center gap-1 font-semibold text-amber-300">
                  <MapPin size={12} /> Machakos
                </span>
              </div>
              <Link
                href="/events"
                className="mt-4 flex items-center justify-between border-t border-white/20 pt-3 text-xs font-bold uppercase tracking-wider text-white transition group-hover:text-amber-300"
              >
                <span>Register Attendance</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Card 3 */}
          <div className="group relative h-80 overflow-hidden rounded-3xl border border-white/20 bg-brand-dark shadow-xl transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl">
            <Image
              src="/pictures/field-circle.jpeg"
              alt="County Youth Budget Forum"
              fill
              className="object-cover transition duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 400px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white">
              <span className="rounded-full bg-sky-500/30 border border-sky-400/40 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-sky-300">
                Grassroots Forum
              </span>
              <h3 className="mt-3 font-serif text-xl font-bold leading-tight text-white">
                County Youth Budget Circle
              </h3>
              <div className="mt-2 flex items-center justify-between text-xs text-white/80">
                <span>03 October 2026</span>
                <span className="flex items-center gap-1 font-semibold text-sky-300">
                  <MapPin size={12} /> Kajiado
                </span>
              </div>
              <Link
                href="/events"
                className="mt-4 flex items-center justify-between border-t border-white/20 pt-3 text-xs font-bold uppercase tracking-wider text-white transition group-hover:text-sky-300"
              >
                <span>Register Attendance</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* LEADERSHIP & COMMUNITY GALLERY STRIP */}
      <section className="border-y border-line bg-surface py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12 items-center">
            <div className="lg:col-span-6 relative overflow-hidden rounded-3xl border border-line shadow-2xl">
              <div className="relative aspect-[16/11] w-full">
                <Image
                  src="/pictures/leaders-exterior.jpeg"
                  alt="NYBF Youth Leaders Gathering"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 600px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                    Nairobi Delegation
                  </div>
                  <div className="font-serif text-lg font-bold">
                    47 County Coordinators & Youth Budget Delegates
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-brand/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-brand dark:bg-brand/20 dark:text-brand-light">
                <Users size={14} />
                Grassroots Leadership
              </div>
              <h2 className="mt-4 font-serif text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
                Led by youth, across all 47 counties of Kenya.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted">
                NYBF Connect is not managed by bureaucrats in glass towers. It is built and driven by grassroots community organizers, university student leaders, young entrepreneurs, and policy researchers from every corner of Kenya.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3.5 rounded-2xl border border-line bg-bg p-4">
                  <CheckCircle2 size={20} className="text-brand shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-ink">Devolved County Working Groups</h4>
                    <p className="text-xs text-muted mt-0.5">
                      Each county maintains an active youth budget desk that analyzes local Annual Development Plans (ADPs) and County Fiscal Strategy Papers (CFSPs).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 rounded-2xl border border-line bg-bg p-4">
                  <CheckCircle2 size={20} className="text-brand shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-ink">Direct Parliamentary Memoranda</h4>
                    <p className="text-xs text-muted mt-0.5">
                      Youth consultation responses are synthesized and formally presented before the Departmental Committee on Finance and National Planning.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NYBF LEADERSHIP SECTION — Chairperson & Secretariat */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 border-t border-line">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-brand/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-brand dark:bg-brand/20 dark:text-brand-light">
              <Users size={14} />
              National Leadership
            </div>
            <h2 className="mt-3 font-serif text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              NYBF Executive Leadership
            </h2>
            <p className="mt-2 text-sm sm:text-base text-muted max-w-2xl">
              Meet the executive leadership steering the National Youth Budget Forum across all 47 counties of Kenya.
            </p>
          </div>
          <Link
            href="/leadership"
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand hover:text-brand-light"
          >
            <span>View Full Leadership Council</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Chairperson Ougo Sam */}
          <div className="group relative overflow-hidden rounded-3xl border border-line bg-surface shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-xl flex flex-col sm:flex-row">
            <div className="relative w-full sm:w-5/12 aspect-[4/5] sm:aspect-auto overflow-hidden bg-brand-dark">
              <Image
                src="/pictures/chairperson-ougo-sam.jpeg"
                alt="Ougo Sam - Chairperson NYBF"
                fill
                sizes="(max-width: 768px) 100vw, 300px"
                className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-3 left-3">
                <span className="glass-panel-photo rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                  Chairperson
                </span>
              </div>
            </div>
            <div className="flex-1 p-6 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted">National Youth Budget Forum</span>
                <h3 className="mt-1 font-serif text-2xl font-black text-ink">Ougo Sam</h3>
                <p className="text-xs font-bold text-brand dark:text-brand-light">Chairperson</p>
                <p className="mt-3 text-xs text-muted leading-relaxed">
                  Steering the National Executive Council, orchestrating national parliamentary engagements, and mobilizing youth budget delegations across all 47 counties.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-line flex items-center justify-between text-xs">
                <span className="text-muted">Executive Council Lead</span>
                <Link href="/leadership" className="font-bold text-brand hover:underline">Profile & Mandate →</Link>
              </div>
            </div>
          </div>

          {/* Secretariat Obade George */}
          <div className="group relative overflow-hidden rounded-3xl border border-line bg-surface shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-xl flex flex-col sm:flex-row">
            <div className="relative w-full sm:w-5/12 aspect-[4/5] sm:aspect-auto overflow-hidden bg-brand-dark">
              <Image
                src="/pictures/secretariat-obade-george.jpeg"
                alt="Obade George - Head of Secretariat NYBF"
                fill
                sizes="(max-width: 768px) 100vw, 300px"
                className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-3 left-3">
                <span className="glass-panel-photo rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                  Secretariat
                </span>
              </div>
            </div>
            <div className="flex-1 p-6 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted">National Youth Budget Forum</span>
                <h3 className="mt-1 font-serif text-2xl font-black text-ink">Obade George</h3>
                <p className="text-xs font-bold text-brand dark:text-brand-light">Head of Secretariat</p>
                <p className="mt-3 text-xs text-muted leading-relaxed">
                  Directing operational execution, fiscal policy research synthesis, and coordination of the 47 county devolution chapters and Parliamentary Memoranda submissions.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-line flex items-center justify-between text-xs">
                <span className="text-muted">Executive Secretary</span>
                <Link href="/leadership" className="font-bold text-brand hover:underline">Profile & Mandate →</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION — High-Energy Full Bleed */}
      <section className="relative overflow-hidden border-y border-line bg-brand-dark py-24 sm:py-32">
        <div className="absolute inset-0">
          <Image
            src="/pictures/rally-flags.jpeg"
            alt="Young Kenyans rallying for public participation"
            fill
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-brand-dark/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-transparent to-brand-dark/50" />
        </div>

        <div className="relative mx-auto max-w-4xl px-4 text-center text-white sm:px-6 lg:px-8">
          <div className="glass-panel-photo mx-auto inline-flex rounded-2xl p-4 text-emerald-400 backdrop-blur-md">
            <ShieldCheck size={36} />
          </div>

          <h2 className="mt-6 font-serif text-4xl font-extrabold tracking-tight text-white sm:text-6xl text-shadow-strong">
            Claim your seat at the budget table.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white sm:text-lg sm:leading-8 text-shadow-strong">
            Don&apos;t let politicians decide your economic future without your input. Join a growing digital movement of over 250,000 young Kenyans shaping national policy.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/my-nybf"
              className="w-full sm:w-auto rounded-full bg-white px-9 py-4 font-bold uppercase tracking-wider text-brand-dark shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:bg-emerald-300 hover:shadow-emerald-500/25 active:translate-y-0"
            >
              Enter Member Portal
            </Link>
            <Link
              href="/youth-voice"
              className="w-full sm:w-auto glass-panel-photo rounded-full px-8 py-4 font-bold uppercase tracking-wider text-white transition-all duration-300 hover:-translate-y-1 hover:bg-white/20"
            >
              Vote in Active Polls
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-brand-dark text-white border-t border-white/10">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-5 lg:px-8">
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 font-serif text-lg font-bold italic text-emerald-400 border border-white/20">
                NY
              </div>
              <div>
                <div className="font-serif text-2xl font-bold tracking-tight text-white">
                  NYBF <span className="text-xs uppercase font-sans tracking-widest text-brand-gold">Connect</span>
                </div>
                <div className="text-[10px] tracking-wider text-white/60">NATIONAL YOUTH BUDGET FORUM</div>
              </div>
            </div>

            <p className="mt-5 max-w-sm text-xs leading-relaxed text-white/70">
              An independent, non-partisan digital platform empowering young Kenyans across all 47 counties to decode the national budget, participate in legislative consultations, and access economic opportunities.
            </p>

            <div className="mt-6 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-xs font-semibold text-emerald-400">Open Public Civic-Tech Platform</span>
            </div>
          </div>

          {/* Col 2: Platform Links */}
          <FooterColumn
            title="Platform"
            links={[
              { label: "Budget Hub Modules", href: "/budget-hub" },
              { label: "National Youth Pulse", href: "/youth-voice" },
              { label: "Submit Policy Proposal", href: "/youth-voice" },
              { label: "Economic Opportunities", href: "/opportunities" },
              { label: "Townhalls & Summits", href: "/events" },
            ]}
          />

          {/* Col 3: Devolution Hubs */}
          <FooterColumn
            title="47 Counties"
            links={[
              { label: "Nairobi & Central Hub", href: "/events" },
              { label: "Coast Regional Chapter", href: "/events" },
              { label: "Rift Valley Youth Forum", href: "/events" },
              { label: "Western & Nyanza Chapter", href: "/events" },
              { label: "Northern Kenya Desks", href: "/events" },
            ]}
          />

          {/* Col 4: Governance & Legal */}
          <FooterColumn
            title="Governance"
            links={[
              { label: "About NYBF", href: "/#about" },
              { label: "Constitution Art. 201 (Public Finance)", href: "https://kenyalaw.org" },
              { label: "Access to Info Act 2016", href: "https://kenyalaw.org" },
              { label: "Privacy Policy", href: "/join" },
              { label: "Terms of Engagement", href: "/join" },
            ]}
          />
        </div>

        {/* Subfooter */}
        <div className="border-t border-white/10 py-6">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8 text-xs text-white/50">
            <div>
              © 2026 National Youth Budget Forum (NYBF). Built for the youth of Kenya.
            </div>
            <div className="flex items-center gap-4">
              <span>Nairobi, Kenya</span>
              <span>•</span>
              <span>Non-partisan Civic Technology</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

