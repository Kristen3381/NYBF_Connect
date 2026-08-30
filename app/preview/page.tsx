"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  GraduationCap,
  Lightbulb,
  MessageSquare,
  ShieldCheck,
  X,
} from "lucide-react";
import { Nav } from "@/components/nav";
import { HeroPhotoCollage } from "@/components/hero-photo-collage";
import {
  DashboardCard,
  Stat,
  Feature,
  Course,
  OpportunityCard,
  FooterColumn,
} from "@/components/ui-blocks";

// Sample data only — no Prisma, no .env needed. Visit /preview with zero setup.

const opportunities = [
  { title: "Youth Entrepreneurship Programme", type: "Programme", location: "Kenya", deadline: "30 Sept 2026" },
  { title: "Youth Policy Research Fellowship", type: "Fellowship", location: "Nairobi", deadline: "15 Oct 2026" },
  { title: "Digital Skills Internship", type: "Internship", location: "Nairobi / Online", deadline: "10 Oct 2026" },
];

const events = [
  { title: "National Youth Budget Town Hall", date: "12 September 2026", location: "Nairobi", photo: "/pictures/stage-presentation.jpeg" },
  { title: "Youth Economic Dialogue", date: "26 September 2026", location: "Machakos", photo: "/pictures/roundtable-overhead.jpeg" },
  { title: "County Youth Budget Forum", date: "3 October 2026", location: "Kajiado", photo: "/pictures/field-circle.jpeg" },
];

const pollOptions = ["Jobs & employment", "Education & skills", "Entrepreneurship", "Digital economy"];

export default function PreviewPage() {
  const [joined, setJoined] = useState(false);
  const [vote, setVote] = useState<string | null>(null);
  const [ideaText, setIdeaText] = useState("");
  const [ideaSubmitted, setIdeaSubmitted] = useState(false);

  return (
    <main className="min-h-screen bg-bg text-ink">
      <div className="border-b border-line bg-brand px-5 py-1.5 text-center text-xs font-semibold text-white">
        Preview mode — sample data only, nothing is saved
      </div>

      <Nav />

      {/* HERO — full-bleed photo background with translucent gradient */}
      <section className="relative isolate overflow-hidden bg-brand-dark">
        <HeroPhotoCollage />

        <div className="mx-auto max-w-4xl px-5 pt-5 pb-24 text-left md:pb-32">
          <div className="glass-panel-photo mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-white">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-300" />
            Youth. Economy. Participation.
          </div>

          <h1 className="font-serif text-4xl leading-tight text-white md:text-6xl">
            National Youth Budget Forum
          </h1>
          <p className="mt-3 text-xl font-medium text-white/85 md:text-2xl">
            Your Voice, Your Economy.
          </p>

          <p className="mt-7 max-w-xl text-base leading-7 text-white/80">
            NYBF Connect brings young Kenyans together to understand the
            national budget, participate in economic discussions, access
            opportunities and contribute ideas that can shape Kenya&apos;s
            future.
          </p>

          <div className="mt-9 flex flex-col items-start justify-start gap-3 sm:flex-row">
            <button
              onClick={() => setJoined(true)}
              className="flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 font-semibold text-brand-dark shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0"
            >
              Join the Forum <ArrowRight size={18} />
            </button>
            <a
              href="#budget"
              className="glass-panel-photo flex items-center justify-center rounded-full px-7 py-3.5 font-semibold text-white transition hover:-translate-y-0.5"
            >
              Explore Budget Hub
            </a>
          </div>

          <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4">
            <DashboardCard icon={<BookOpen />} title="Budget Hub" value="12" label="Learning modules" />
            <DashboardCard icon={<MessageSquare />} title="Youth Voice" value="4" label="Active consultations" />
            <DashboardCard icon={<BriefcaseBusiness />} title="Opportunities" value="27" label="Current listings" />
            <DashboardCard icon={<CalendarDays />} title="Events" value="8" label="Upcoming events" />
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-b border-line bg-surface">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-5 py-14 md:grid-cols-4">
          <Stat number="47" label="Counties" />
          <Stat number="1M+" label="Youth reach" />
          <Stat number="200+" label="Youth leaders" />
          <Stat number="24/7" label="Engagement" />
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="mx-auto max-w-7xl px-5 py-20">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-widest text-brand">About NYBF Connect</p>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl">
            Turning youth participation into a continuous conversation.
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted">
            The platform is designed to move beyond physical conferences.
            Young people can learn, debate, vote, submit ideas, discover
            opportunities and remain connected to the Forum throughout the
            year.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          <Feature icon={<GraduationCap />} title="Learn" text="Understand Kenya's budget, economic planning and public policy in simple language." />
          <Feature icon={<MessageSquare />} title="Participate" text="Take part in consultations, surveys, polls and economic discussions." />
          <Feature icon={<Lightbulb />} title="Influence" text="Submit ideas and contribute to the development of youth economic priorities." />
        </div>
      </section>

      {/* BUDGET HUB — image as translucent background, not a boxed photo */}
      <section id="budget" className="relative overflow-hidden border-y border-line">
        <div className="absolute inset-0">
          <Image src="/pictures/shillings-fan.jpeg" alt="" fill className="object-cover" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/95 via-brand-dark/90 to-brand-dark/95" />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 py-20 text-white">
          <p className="text-sm font-bold uppercase tracking-widest text-white/70">Budget Hub</p>
          <h2 className="mt-3 font-serif text-4xl">Understand the economy.</h2>
          <p className="mt-4 max-w-2xl text-white/80">
            Complex economic documents should not be accessible only to
            experts. NYBF Connect translates important economic concepts into
            youth-friendly learning.
          </p>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <Course number="01" title="Understanding Kenya's Budget" description="Learn how government plans and allocates public resources." />
            <Course number="02" title="The National Budget Cycle" description="Understand formulation, approval, implementation and oversight." />
            <Course number="03" title="Youth & Economic Planning" description="Discover where young people fit into national economic planning." />
          </div>
        </div>
      </section>

      {/* YOUTH VOICE — image as translucent background */}
      <section id="voice" className="relative overflow-hidden border-b border-line">
        <div className="absolute inset-0">
          <Image src="/pictures/panel-speech.jpeg" alt="" fill className="object-cover" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/90 via-brand-dark/85 to-brand-dark/90" />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 py-20">
          <p className="text-sm font-bold uppercase tracking-widest text-white/70">Youth Voice</p>
          <h2 className="mt-3 font-serif text-4xl text-white md:text-5xl">
            What should government prioritize?
          </h2>
          <p className="mt-5 max-w-2xl leading-7 text-white/80">
            Youth participation should be measurable. Vote in the National
            Youth Pulse and submit your own policy ideas below.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {/* Poll — lively voting with animated result bars */}
            <div className="glass-panel-photo rounded-3xl p-7 text-white">
              <p className="text-xs font-bold uppercase tracking-widest text-white/60">National Youth Pulse</p>
              <h3 className="mt-2 font-serif text-2xl">What should receive greater priority?</h3>

              <div className="mt-6 space-y-3">
                {pollOptions.map((option, i) => {
                  const fakePct = [38, 27, 21, 14][i];
                  const isVoted = vote === option;
                  return (
                    <button
                      key={option}
                      onClick={() => setVote(option)}
                      className={`relative w-full overflow-hidden rounded-2xl border p-4 text-left transition ${
                        isVoted ? "border-white bg-white/15" : "border-white/25 hover:border-white/50 hover:bg-white/10"
                      }`}
                    >
                      {vote && (
                        <div
                          className="absolute inset-y-0 left-0 bg-white/10 transition-all duration-700 ease-out"
                          style={{ width: `${fakePct}%` }}
                        />
                      )}
                      <span className="relative flex items-center justify-between font-medium">
                        {option}
                        <span className="flex items-center gap-2">
                          {vote && <span className="text-sm text-white/70">{fakePct}%</span>}
                          {isVoted && <CheckCircle2 className="animate-pop-in text-emerald-300" size={20} />}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>

              {vote && (
                <p className="mt-5 animate-fade-in-up text-sm font-semibold text-emerald-300">
                  ✓ Your response has been recorded in this preview.
                </p>
              )}
            </div>

            {/* Idea submission — lively with live character count */}
            <div className="glass-panel-photo rounded-3xl p-7 text-white">
              <p className="text-xs font-bold uppercase tracking-widest text-white/60">Submit an Idea</p>
              <h3 className="mt-2 font-serif text-2xl">Have a policy idea?</h3>
              <p className="mt-2 text-sm text-white/70">Your idea will be reviewed by the NYBF team.</p>

              {!ideaSubmitted ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setIdeaSubmitted(true);
                  }}
                  className="mt-6 space-y-3"
                >
                  <input
                    required
                    placeholder="Idea title"
                    className="w-full rounded-2xl border border-white/25 bg-white/10 p-4 text-white placeholder:text-white/50 outline-none transition focus:border-white focus:ring-4 focus:ring-white/20"
                  />
                  <div>
                    <textarea
                      required
                      rows={4}
                      maxLength={500}
                      value={ideaText}
                      onChange={(e) => setIdeaText(e.target.value)}
                      placeholder="Describe your idea"
                      className="w-full rounded-2xl border border-white/25 bg-white/10 p-4 text-white placeholder:text-white/50 outline-none transition focus:border-white focus:ring-4 focus:ring-white/20"
                    />
                    <div className="mt-1 text-right text-xs text-white/50">{ideaText.length}/500</div>
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-full bg-white py-4 font-semibold text-brand-dark transition hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
                  >
                    Submit Idea
                  </button>
                </form>
              ) : (
                <div className="mt-8 animate-pop-in text-center">
                  <CheckCircle2 className="mx-auto text-emerald-300" size={40} />
                  <p className="mt-3 font-semibold text-emerald-300">Idea submitted — thank you!</p>
                  <button
                    onClick={() => { setIdeaSubmitted(false); setIdeaText(""); }}
                    className="mt-4 text-sm text-white/70 underline underline-offset-4"
                  >
                    Submit another idea
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* OPPORTUNITIES */}
      <section id="opportunities" className="bg-bg">
        <div className="mx-auto max-w-7xl px-5 py-20">
          <p className="text-sm font-bold uppercase tracking-widest text-brand">Opportunities</p>
          <h2 className="mt-3 font-serif text-4xl">Find your next opportunity.</h2>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {opportunities.map((item) => (
              <div key={item.title} className="rounded-3xl bg-brand-dark p-1">
                <OpportunityCard {...item} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EVENTS — poster-style cards with photo as background */}
      <section id="events" className="mx-auto max-w-7xl px-5 py-20">
        <p className="text-sm font-bold uppercase tracking-widest text-brand">Events</p>
        <h2 className="mt-3 font-serif text-4xl">Join the conversation.</h2>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {events.map((event) => (
            <div key={event.title} className="group relative h-72 overflow-hidden rounded-3xl transition hover:-translate-y-1">
              <Image
                src={event.photo}
                alt={event.title}
                fill
                className="object-cover transition duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 360px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <h3 className="font-serif text-xl leading-tight">{event.title}</h3>
                <p className="mt-2 text-xs text-white/70">{event.date}</p>
                <p className="text-sm font-semibold">{event.location}</p>
                <button className="mt-4 flex items-center gap-2 text-sm font-semibold transition group-hover:gap-3">
                  Register <ArrowRight size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden border-y border-line">
        <div className="absolute inset-0">
          <Image src="/pictures/auditorium-crowd.jpeg" alt="" fill className="object-cover" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-br from-brand-dark/95 via-brand/85 to-brand-dark/95" />
          <div className="absolute inset-0 bg-black/30" />
        </div>
        <div className="relative mx-auto max-w-5xl px-5 py-20 text-center text-white">
          <ShieldCheck className="mx-auto text-white" size={42} />
          <h2 className="mt-5 font-serif text-4xl md:text-5xl">Your participation matters.</h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/85">
            Join a growing digital network of young people engaging with
            Kenya&apos;s economy, opportunities and future.
          </p>
          <button
            onClick={() => setJoined(true)}
            className="mt-8 rounded-full bg-white px-8 py-4 font-semibold text-brand-dark transition hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0"
          >
            Join NYBF Connect
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-brand-dark text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-4">
          <div>
            <div className="font-serif text-2xl italic">NYBF</div>
            <div className="text-xs uppercase tracking-widest text-white/50">Connect</div>
            <p className="mt-5 text-sm leading-6 text-white/70">
              A digital platform for youth economic participation, learning
              and engagement.
            </p>
          </div>
          <FooterColumn title="Platform" links={["Budget Hub", "Youth Voice", "Opportunities", "Events"]} />
          <FooterColumn title="About" links={["About NYBF", "Leadership", "Partners", "Contact"]} />
          <FooterColumn title="Legal" links={["Privacy Policy", "Terms", "Data Protection"]} />
        </div>
        <div className="border-t border-white/10 py-6 text-center text-xs uppercase tracking-widest text-white/40">
          © 2026 National Youth Budget Forum — Preview Mode
        </div>
      </footer>

      {/* JOIN MODAL */}
      {joined && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-5">
          <div className="w-full max-w-lg animate-pop-in rounded-3xl border border-line bg-surface p-7 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-brand">Join NYBF</p>
                <h2 className="mt-1 font-serif text-3xl">Become part of the network.</h2>
              </div>
              <button
                onClick={() => setJoined(false)}
                className="rounded-full p-2 transition hover:bg-brand/10"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-7 space-y-4">
              <input
                placeholder="Full name"
                className="w-full rounded-2xl border border-line bg-bg p-4 outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/15"
              />
              <input
                placeholder="Email address"
                type="email"
                className="w-full rounded-2xl border border-line bg-bg p-4 outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/15"
              />
              <input
                placeholder="Phone number"
                className="w-full rounded-2xl border border-line bg-bg p-4 outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/15"
              />
              <select className="w-full rounded-2xl border border-line bg-bg p-4 outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/15">
                <option>Select county</option>
                <option>Nairobi</option>
                <option>Machakos</option>
                <option>Kajiado</option>
                <option>Other</option>
              </select>
              <button
                onClick={() => setJoined(false)}
                className="w-full rounded-full bg-brand py-4 font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
              >
                Create My NYBF Profile
              </button>
            </div>

            <p className="mt-5 text-center text-xs text-muted">
              Preview mode — nothing is saved here.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
