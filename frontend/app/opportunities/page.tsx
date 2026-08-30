import Image from "next/image";
import Link from "next/link";
import { Nav } from "@/components/nav";
import { BriefcaseBusiness, ArrowRight, ShieldCheck } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { OpportunityCard, FooterColumn } from "@/components/ui-blocks";
import { OpportunitiesClient } from "./opportunities-client";

export const revalidate = 60;

const fallbackOpportunities = [
  {
    id: "opp-1",
    title: "National Youth Public Policy Research Fellowship 2026",
    type: "FELLOWSHIP",
    location: "Nairobi / Hybrid",
    deadline: new Date("2026-10-15"),
    description: "Paid 6-month fellowship analyzing Kenya's parliamentary finance bills and drafting youth policy amendments.",
    stipend: "Ksh 65,000 / month",
  },
  {
    id: "opp-2",
    title: "County Agri-Enterprise & Green Innovation Grant",
    type: "GRANT",
    location: "All 47 Counties",
    deadline: new Date("2026-10-30"),
    description: "Seed grants up to Ksh 500,000 for youth-led climate-smart agriculture and value-addition enterprises.",
    stipend: "Up to Ksh 500,000",
  },
  {
    id: "opp-3",
    title: "Digital Economy & AI Policy Research Internship",
    type: "INTERNSHIP",
    location: "Nairobi Central / Remote",
    deadline: new Date("2026-10-10"),
    description: "Hands-on policy research analyzing digital services taxation, gig worker protections, and AI governance in Kenya.",
    stipend: "Ksh 45,000 / month",
  },
  {
    id: "opp-4",
    title: "Youth Public Procurement (AGPO) Capacity Bootcamp",
    type: "PROGRAMME",
    location: "Nairobi, Mombasa, Kisumu & Virtual",
    deadline: new Date("2026-11-12"),
    description: "Intensive 4-week certification training on bidding for the mandatory 30% government procurement quota.",
    stipend: "Fully Funded Training",
  },
  {
    id: "opp-5",
    title: "Devolution Budget Monitoring Officer",
    type: "JOB",
    location: "Rift Valley / Western Region",
    deadline: new Date("2026-11-25"),
    description: "Full-time position coordinating county youth budget desks, analyzing Annual Development Plans and organizing civic clinics.",
    stipend: "Competitive NGO Scale",
  },
  {
    id: "opp-6",
    title: "Young Women in Fiscal Governance Leadership Cohort",
    type: "PROGRAMME",
    location: "National (47 Counties)",
    deadline: new Date("2026-12-05"),
    description: "Leadership accelerator mentoring 100 young Kenyan women to contest and participate in county budget committees.",
    stipend: "Full Travel & Fellowship Grant",
  },
];

export default async function OpportunitiesPage() {
  let opportunities: any[] = [];

  try {
    const dbOpps = await prisma.opportunity.findMany({
      where: { expired: false },
      orderBy: { deadline: "asc" },
    });
    if (dbOpps && dbOpps.length > 0) {
      opportunities = dbOpps;
    } else {
      opportunities = fallbackOpportunities;
    }
  } catch {
    opportunities = fallbackOpportunities;
  }

  const serializedOpportunities = opportunities.map((opp) => ({
    id: opp.id,
    title: opp.title,
    type: opp.type,
    location: opp.location,
    deadline: opp.deadline instanceof Date ? opp.deadline.toISOString() : String(opp.deadline),
    description: opp.description,
    stipend: opp.stipend,
  }));

  return (
    <main className="min-h-screen text-ink selection:bg-brand/20 selection:text-brand">
      <Nav />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden border-b border-line bg-brand-dark py-16 text-white sm:py-24">
        <div className="absolute inset-0">
          <Image
            src="/pictures/roundtable-overhead.jpeg"
            alt="Economic opportunities for youth"
            fill
            sizes="100vw"
            className="object-cover opacity-25 object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/95 via-brand-dark/85 to-brand-dark/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/95 via-transparent to-brand-dark/60" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-emerald-300">
            <BriefcaseBusiness size={14} />
            Economic Pathways & Youth Procurement
          </div>
          <h1 className="mt-4 font-serif text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
            Find Your Next Opportunity.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">
            Vetted fellowships, government procurement access (AGPO), innovation grants, and policy research internships for young Kenyans across all 47 counties.
          </p>
        </div>
      </section>

      {/* FILTERABLE LISTING */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand dark:text-brand-light">
              Live Verified Listings
            </span>
            <h2 className="mt-2 font-serif text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              Open Calls & Economic Grants
            </h2>
          </div>
          <div className="text-xs font-bold text-muted">
            {serializedOpportunities.length} Active Listings
          </div>
        </div>

        <OpportunitiesClient initialOpportunities={serializedOpportunities} />

        {/* 30% AGPO PROCUREMENT ADVISORY CARD */}
        <div className="mt-20 relative overflow-hidden rounded-3xl border border-line bg-surface p-8 sm:p-12 shadow-lg">
          <div className="grid gap-8 lg:grid-cols-12 items-center">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                <ShieldCheck size={14} />
                AGPO 30% Youth Reservation
              </div>
              <h3 className="mt-3 font-serif text-2xl font-bold text-ink sm:text-3xl">
                Are you registered for the 30% Government Procurement Quota?
              </h3>
              <p className="mt-2 text-sm text-muted max-w-2xl leading-relaxed">
                By law, every government ministry, parastatal, and county government must award 30% of its tenders to youth, women, and PWDs. NYBF connects youth enterprises with tender notices and bidding mentorship.
              </p>
            </div>
            <div className="lg:col-span-4 flex lg:justify-end">
              <Link
                href="/budget-hub"
                className="flex items-center gap-2 rounded-full bg-brand px-7 py-4 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-brand/20 transition-all hover:bg-brand-light hover:shadow-lg"
              >
                <span>Read AGPO Module Guide</span>
                <ArrowRight size={15} />
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
              { label: "Coast Hub", href: "/events" },
              { label: "Rift Valley Hub", href: "/events" },
            ]}
          />
          <FooterColumn
            title="Governance"
            links={[
              { label: "About NYBF", href: "/#about" },
              { label: "AGPO Regulations", href: "https://agpo.go.ke" },
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

