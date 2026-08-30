import Image from "next/image";
import Link from "next/link";
import { Nav } from "@/components/nav";
import { MessageSquare, Sparkles, Send, ShieldCheck, ArrowRight, CheckCircle2, TrendingUp, Users } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PollCard } from "./poll-card";
import { IdeaForm } from "./idea-form";
import { FooterColumn } from "@/components/ui-blocks";

export const revalidate = 30;

const fallbackPolls = [
  {
    id: "poll-1",
    question: "Which fiscal priority should receive the highest increase in the FY 2026/27 Budget?",
    category: "Macro Spending Priority",
    active: true,
    resultsVisible: true,
    options: [
      { id: "p1-opt-1", label: "Job creation & MSME startup grants (Hustler Fund reform)", votesCount: 5240 },
      { id: "p1-opt-2", label: "Higher Education Loan Board (HELB) & free TVET capitation", votesCount: 4120 },
      { id: "p1-opt-3", label: "Digital economy tax relief & local tech infrastructure", votesCount: 2980 },
      { id: "p1-opt-4", label: "County healthcare facilities & youth mental health clinics", votesCount: 1840 },
    ],
  },
  {
    id: "poll-2",
    question: "How should the Government fund university education and TVET colleges?",
    category: "Higher Education Financing",
    active: true,
    resultsVisible: true,
    options: [
      { id: "p2-opt-1", label: "100% state scholarship for vulnerable and low-income students", votesCount: 6810 },
      { id: "p2-opt-2", label: "Income-contingent loans with zero interest until formal employment", votesCount: 3940 },
      { id: "p2-opt-3", label: "Public-private partnerships and corporate education levies", votesCount: 1420 },
    ],
  },
  {
    id: "poll-3",
    question: "What is your biggest concern regarding County Government resource allocation?",
    category: "Devolution Governance",
    active: true,
    resultsVisible: true,
    options: [
      { id: "p3-opt-1", label: "Lack of transparency in county bursary distributions", votesCount: 4620 },
      { id: "p3-opt-2", label: "Non-compliance with the 30% AGPO youth procurement quota", votesCount: 3890 },
      { id: "p3-opt-3", label: "Stalled ward development projects and pending bills", votesCount: 2710 },
    ],
  },
];

export default async function YouthVoicePage() {
  let polls: any[] = [];

  try {
    const dbPolls = await prisma.poll.findMany({
      where: { active: true },
      include: { options: { include: { _count: { select: { votes: true } } } } },
      orderBy: { createdAt: "desc" },
    });

    if (dbPolls && dbPolls.length > 0) {
      polls = dbPolls.map((p, idx) => ({
        ...p,
        category: idx === 0 ? "National Priority" : "Devolution Governance",
      }));
    } else {
      polls = fallbackPolls;
    }
  } catch {
    polls = fallbackPolls;
  }

  return (
    <main className="min-h-screen text-ink selection:bg-brand/20 selection:text-brand">
      <Nav />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden border-b border-line bg-brand-dark py-16 text-white sm:py-24">
        <div className="absolute inset-0">
          <Image
            src="/pictures/panel-speech.jpeg"
            alt="Youth voice in action"
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
            <Sparkles size={14} />
            Direct Citizen Public Participation
          </div>
          <h1 className="mt-4 font-serif text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
            What Should Government Prioritize?
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">
            Youth participation should be measurable, not performative. Vote in the live National Youth Pulse consultations below and submit your own policy proposals.
          </p>
        </div>
      </section>

      {/* MAIN CONTENT GRID */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12 items-start">
          {/* Left Column: Active Consultations */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between pb-2">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <h2 className="font-serif text-2xl font-bold text-ink">Active Consultations</h2>
              </div>
              <span className="text-xs font-bold text-muted">{polls.length} Polls Open</span>
            </div>

            {polls.map((poll) => (
              <PollCard key={poll.id} poll={poll} />
            ))}
          </div>

          {/* Right Column: Policy Pitch Form & Legislative Route */}
          <div className="lg:col-span-5 space-y-8">
            <IdeaForm />

            {/* Pipeline info card */}
            <div className="rounded-3xl border border-line bg-surface p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand dark:text-brand-light">
                <ShieldCheck size={16} />
                <span>The Legislative Pipeline</span>
              </div>
              <h4 className="mt-3 font-serif text-xl font-bold text-ink">
                How your vote reaches Parliament
              </h4>

              <div className="mt-5 space-y-4 text-xs text-muted">
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/10 font-mono text-xs font-bold text-brand dark:bg-brand/20 dark:text-brand-light">
                    1
                  </div>
                  <div>
                    <span className="font-bold text-ink">Online Consultation: </span>
                    Votes and policy ideas are recorded in real-time across all 47 counties.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/10 font-mono text-xs font-bold text-brand dark:bg-brand/20 dark:text-brand-light">
                    2
                  </div>
                  <div>
                    <span className="font-bold text-ink">NYBF Research Synthesis: </span>
                    Economists and youth policy fellows synthesize top priorities into the National Youth Budget Memorandum.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/10 font-mono text-xs font-bold text-brand dark:bg-brand/20 dark:text-brand-light">
                    3
                  </div>
                  <div>
                    <span className="font-bold text-ink">Parliamentary Presentation: </span>
                    Delegates formally present the Memorandum during Finance Bill public hearings.
                  </div>
                </div>
              </div>
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

