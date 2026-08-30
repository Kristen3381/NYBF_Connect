import Image from "next/image";
import Link from "next/link";
import { Nav } from "@/components/nav";
import { BookOpen, Compass, ArrowRight, CheckCircle2, Clock, Sparkles, Download, Layers, ShieldCheck, PieChart, TrendingUp } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { FooterColumn } from "@/components/ui-blocks";
import { BudgetExplorer } from "@/components/budget-explorer";

export const revalidate = 300;

const fallbackModules = [
  {
    id: "mod-1",
    title: "Understanding Kenya's National Budget Architecture",
    description: "Learn how the National Treasury plans revenue estimates, borrows public debt, and allocates resources to national priorities and 47 county governments.",
    contentType: "text",
    order: 1,
    duration: "15 min read",
    difficulty: "Beginner",
    topics: ["Equitable Share", "Consolidated Fund", "Appropriation Act", "Debt Ceiling"],
  },
  {
    id: "mod-2",
    title: "The National & Devolved Budget Cycle (Formulation to Audit)",
    description: "Step-by-step citizen guide to the 4 phases: Formulation (Treasury/BROP), Approval (Parliament/Budget Committee), Execution (MDAs), and Oversight (Auditor-General).",
    contentType: "text",
    order: 2,
    duration: "20 min read",
    difficulty: "Intermediate",
    topics: ["Budget Policy Statement (BPS)", "County Fiscal Strategy Paper", "Public Participation"],
  },
  {
    id: "mod-3",
    title: "Youth Economic Planning & Access to Public Procurement (AGPO)",
    description: "Discover where young Kenyans fit into national economic planning and how to legally leverage the mandatory 30% AGPO youth procurement reservation.",
    contentType: "text",
    order: 3,
    duration: "18 min read",
    difficulty: "Practical Guide",
    topics: ["30% AGPO Quota", "Youth Enterprise Fund", "Hustler Fund Group Lending", "County Tenders"],
  },
  {
    id: "mod-4",
    title: "Taxation, the Finance Bill & Citizen Economic Rights",
    description: "Demystifying direct vs. indirect taxes, VAT, fuel levies, housing levies, and how youth memorandums can amend regressive tax proposals in Parliament.",
    contentType: "text",
    order: 4,
    duration: "22 min read",
    difficulty: "Advanced",
    topics: ["Finance Act", "KRA Revenue Targets", "Public Debt Service", "Constitution Art. 201"],
  },
  {
    id: "mod-5",
    title: "County Budget Tracking: ADPs, CFSPs & Citizen Audits",
    description: "How to read your county government's Annual Development Plan and hold Governors and MCAs accountable for local youth development allocations.",
    contentType: "text",
    order: 5,
    duration: "15 min read",
    difficulty: "Devolution Guide",
    topics: ["County Bursary Funds", "Ward Development Fund", "Social Audits", "County Assembly Petitions"],
  },
  {
    id: "mod-6",
    title: "Public Debt, Eurobonds & Future Generational Liability",
    description: "An empirical breakdown of Kenya's Ksh 10.5 Trillion public debt portfolio, interest service ratios, and what debt restructuring means for youth employment.",
    contentType: "text",
    order: 6,
    duration: "25 min read",
    difficulty: "Macroeconomics",
    topics: ["Debt-to-GDP", "Multilateral Loans (IMF/World Bank)", "Eurobond Maturities", "Fiscal Deficit"],
  },
];

export default async function BudgetHubPage() {
  let modules: any[] = [];

  try {
    const dbModules = await prisma.budgetModule.findMany({ orderBy: { order: "asc" } });
    if (dbModules && dbModules.length > 0) {
      modules = dbModules.map((m, idx) => ({
        ...m,
        duration: `${15 + idx * 5} min read`,
        difficulty: idx === 0 ? "Beginner" : idx === 1 ? "Intermediate" : "Advanced",
        topics: fallbackModules[idx % fallbackModules.length].topics,
      }));
    } else {
      modules = fallbackModules;
    }
  } catch {
    modules = fallbackModules;
  }

  return (
    <main className="min-h-screen text-ink selection:bg-brand/20 selection:text-brand">
      <Nav />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden border-b border-line bg-brand-dark py-16 text-white sm:py-24">
        <div className="absolute inset-0">
          <Image
            src="/pictures/shillings-fan.jpeg"
            alt="Kenyan Shilling notes"
            fill
            sizes="100vw"
            className="object-cover opacity-60 object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/85 via-brand-dark/60 to-brand-dark/35" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-transparent to-brand-dark/50" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-emerald-300">
            <Compass size={14} />
            Demystifying Kenya&apos;s Public Finance
          </div>
          <h1 className="mt-4 font-serif text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
            Understand the Economy.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">
            Complex economic documents should not be accessible only to Treasury technocrats. NYBF Connect translates Kenya&apos;s Ksh 4.2 Trillion national budget into youth-friendly learning modules.
          </p>
        </div>
      </section>

      {/* INTERACTIVE BUDGET EXPLORER SECTION */}
      <section className="border-b border-line bg-bg-alt/50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <BudgetExplorer />
        </div>
      </section>

      {/* MODULES LISTING */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end mb-12">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-brand/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-brand dark:bg-brand/20 dark:text-brand-light">
              <BookOpen size={14} />
              Curated Curriculum
            </div>
            <h2 className="mt-3 font-serif text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              Civic Finance Learning Modules
            </h2>
            <p className="mt-2 text-sm sm:text-base text-muted max-w-2xl">
              Master the mechanisms of Kenyan public revenue, debt obligations, county equitable share transfers, and participatory budgeting.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-muted shrink-0">
            <span>{modules.length} Modules Available</span>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((m, i) => (
            <div
              key={m.id}
              className="group relative flex flex-col justify-between rounded-3xl border border-line bg-surface p-7 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-brand/40 hover:shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-xl bg-brand/10 px-3 py-1 font-mono text-xs font-black text-brand dark:bg-brand/20 dark:text-brand-light">
                    MODULE {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                      {m.difficulty}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted">
                      <Clock size={12} />
                      {m.duration}
                    </span>
                  </div>
                </div>

                <h3 className="mt-5 font-serif text-xl font-bold leading-snug text-ink group-hover:text-brand transition-colors">
                  {m.title}
                </h3>

                <p className="mt-3 text-xs sm:text-sm leading-relaxed text-muted">
                  {m.description}
                </p>

                {m.topics && (
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {m.topics.map((tag: string) => (
                      <span
                        key={tag}
                        className="rounded-lg border border-line bg-bg px-2 py-0.5 text-[10px] font-medium text-ink/80"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-6 pt-5 border-t border-line">
                <Link
                  href={`/budget-hub/${m.id}`}
                  className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-brand transition-all group-hover:text-brand-light dark:text-brand-light"
                >
                  <span>Start Learning</span>
                  <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* CITIZEN TOOLKIT DOWNLOAD BANNER */}
        <div className="mt-20 relative overflow-hidden rounded-3xl border border-white/20 bg-brand-dark p-8 sm:p-12 text-white shadow-xl">
          <div className="absolute inset-0">
            <Image
              src="/pictures/roundtable-overhead.jpeg"
              alt="Youth budget toolkits"
              fill
              className="object-cover opacity-50 object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/90 via-brand-dark/70 to-brand-dark/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-transparent to-brand-dark/50" />
          </div>

          <div className="relative z-10 grid gap-8 lg:grid-cols-12 items-center">
            <div className="lg:col-span-8">
              <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-emerald-300">
                Free Downloadable Toolkits
              </span>
              <h3 className="mt-3 font-serif text-2xl font-bold text-white sm:text-4xl">
                The NYBF 2026 Citizen Budget Guide & Audit Template
              </h3>
              <p className="mt-2 text-sm text-white/80 max-w-2xl leading-relaxed">
                Download printable cheat sheets for budget public participation hearings, county fiscal calendars, and template memorandums for submission to County Assemblies.
              </p>
            </div>
            <div className="lg:col-span-4 flex lg:justify-end">
              <Link
                href="/join"
                className="flex items-center gap-2 rounded-full bg-white px-7 py-4 text-xs font-bold uppercase tracking-wider text-brand-dark shadow-xl transition-all hover:bg-emerald-300"
              >
                <Download size={16} />
                <span>Download Citizen Guide (PDF)</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-brand-dark text-white border-t border-white/10">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-4 lg:px-8">
          <div>
            <div className="font-serif text-2xl font-bold tracking-tight text-white">
              NYBF <span className="text-xs uppercase font-sans tracking-widest text-brand-gold">Connect</span>
            </div>
            <p className="mt-3 text-xs text-white/70">
              National Youth Budget Forum — Making Kenya&apos;s budget accessible to every young citizen.
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
              { label: "Mombasa Chapter", href: "/events" },
              { label: "Kisumu Chapter", href: "/events" },
              { label: "Nakuru Chapter", href: "/events" },
            ]}
          />
          <FooterColumn
            title="Governance"
            links={[
              { label: "About NYBF", href: "/#about" },
              { label: "Constitution Art. 201", href: "https://kenyalaw.org" },
              { label: "Join Network", href: "/join" },
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

