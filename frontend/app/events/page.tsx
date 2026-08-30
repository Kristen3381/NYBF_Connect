import Image from "next/image";
import Link from "next/link";
import { Nav } from "@/components/nav";
import { CalendarDays, MapPin, Sparkles, Users, ArrowRight, ShieldCheck } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { RegisterButton } from "./register-button";
import { FooterColumn } from "@/components/ui-blocks";

export const revalidate = 60;

const fallbackEvents = [
  {
    id: "evt-1",
    title: "National Youth Budget Town Hall 2026",
    description: "Annual hybrid keynote bringing together 2,000+ youth leaders and the Parliamentary Budget Office to debate national resource allocation.",
    date: new Date("2026-09-12T09:00:00"),
    location: "Nairobi (KICC & Online Live-Stream)",
    photo: "/pictures/stage-presentation.jpeg",
    tag: "Hybrid Summit",
    spotsLeft: 45,
  },
  {
    id: "evt-2",
    title: "Youth Economic & Public Debt Dialogue",
    description: "Deep dive into Kenya's debt service ratios, Eurobond obligations, and their impact on youth entrepreneurship and taxation.",
    date: new Date("2026-09-26T14:00:00"),
    location: "Machakos County Hub",
    photo: "/pictures/roundtable-overhead.jpeg",
    tag: "Regional Roundtable",
    spotsLeft: 20,
  },
  {
    id: "evt-3",
    title: "County Youth Budget Forum & Devolution Clinic",
    description: "Grassroots public participation session on County Fiscal Strategy Papers (CFSP) and local bursary governance.",
    date: new Date("2026-10-03T10:00:00"),
    location: "Kajiado County Council Hall",
    photo: "/pictures/field-circle.jpeg",
    tag: "Grassroots Circle",
    spotsLeft: 35,
  },
  {
    id: "evt-4",
    title: "Digital Economy & Youth TVET Funding Forum",
    description: "Examining digital taxes, freelancing incentives, and public investments in constituency tech hubs and TVET centers.",
    date: new Date("2026-10-18T11:00:00"),
    location: "Mombasa Youth Center & Virtual",
    photo: "/pictures/panel-speech.jpeg",
    tag: "Policy Panel",
    spotsLeft: 60,
  },
  {
    id: "evt-5",
    title: "Western Kenya Youth Agriculture & AGPO Summit",
    description: "Accessing the 30% Youth Public Procurement Quota (AGPO) and agricultural financing in the 2026/27 budget.",
    date: new Date("2026-11-05T09:30:00"),
    location: "Kisumu City Hall",
    photo: "/pictures/auditorium-crowd.jpeg",
    tag: "Economic Summit",
    spotsLeft: 80,
  },
  {
    id: "evt-6",
    title: "National Youth Policy Working Group",
    description: "Final consolidation of youth budget amendments submitted to the Clerk of the National Assembly.",
    date: new Date("2026-11-20T10:00:00"),
    location: "Nairobi Central",
    photo: "/pictures/leaders-exterior.jpeg",
    tag: "Delegates Assembly",
    spotsLeft: 15,
  },
];

const photoPool = [
  "/pictures/stage-presentation.jpeg",
  "/pictures/roundtable-overhead.jpeg",
  "/pictures/field-circle.jpeg",
  "/pictures/panel-speech.jpeg",
  "/pictures/auditorium-crowd.jpeg",
  "/pictures/leaders-exterior.jpeg",
];

export default async function EventsPage() {
  let events: any[] = [];

  try {
    const dbEvents = await prisma.event.findMany({ orderBy: { date: "asc" } });
    if (dbEvents && dbEvents.length > 0) {
      events = dbEvents.map((evt, idx) => ({
        ...evt,
        photo: photoPool[idx % photoPool.length],
        tag: idx === 0 ? "Hybrid Summit" : "County Forum",
        spotsLeft: 25 + (idx * 15) % 60,
      }));
    } else {
      events = fallbackEvents;
    }
  } catch {
    events = fallbackEvents;
  }

  return (
    <main className="min-h-screen text-ink selection:bg-brand/20 selection:text-brand">
      <Nav />

      {/* HEADER HERO */}
      <section className="relative overflow-hidden border-b border-line bg-brand-dark py-16 text-white sm:py-24">
        <div className="absolute inset-0">
          <Image
            src="/pictures/auditorium-crowd.jpeg"
            alt="National Youth Budget Forum Townhall"
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
            Townhalls, Summits & Devolution Clinics
          </div>
          <h1 className="mt-4 font-serif text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
            Join the Conversation.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">
            Physical townhalls and hybrid forums taking place across all 47 counties of Kenya. Meet county budget executives, dissect fiscal allocations, and voice youth priorities.
          </p>
        </div>
      </section>

      {/* EVENTS GRID */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => {
            const dateStr = event.date instanceof Date ? event.date.toLocaleDateString("en-KE", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }) : String(event.date);

            return (
              <div
                key={event.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/20 bg-brand-dark shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
              >
                {/* Poster Photo Header */}
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <Image
                    src={event.photo || "/pictures/stage-presentation.jpeg"}
                    alt={event.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />

                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <span className="glass-panel-photo rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                      {event.tag || "County Forum"}
                    </span>
                    <span className="glass-panel-photo rounded-full px-3 py-1 text-[10px] font-bold text-white/90">
                      {event.spotsLeft ? `${event.spotsLeft} Seats Open` : "Open Event"}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <div className="flex items-center gap-1.5 text-xs text-emerald-300 font-semibold">
                      <MapPin size={13} />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>

                {/* Body Content */}
                <div className="flex flex-1 flex-col justify-between p-6 text-white">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-white/60">
                      <CalendarDays size={13} className="text-emerald-400" />
                      <span>{dateStr}</span>
                    </div>

                    <h3 className="mt-3 font-serif text-xl font-bold leading-snug text-white group-hover:text-emerald-300 transition-colors">
                      {event.title}
                    </h3>

                    <p className="mt-2.5 text-xs leading-relaxed text-white/75 line-clamp-3">
                      {event.description || "Join fellow youth leaders, economic researchers and county representatives in an in-depth budget consultation session."}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-white/15 pt-4">
                    <RegisterButton
                      eventId={event.id}
                      eventTitle={event.title}
                      eventDate={dateStr}
                      eventLocation={event.location}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* HOST A FORUM BANNER */}
        <div className="mt-20 relative overflow-hidden rounded-3xl border border-line bg-surface p-8 sm:p-12 shadow-lg">
          <div className="grid gap-8 lg:grid-cols-12 items-center">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-brand/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-brand dark:bg-brand/20 dark:text-brand-light">
                <Users size={14} />
                Devolution Desk
              </div>
              <h2 className="mt-3 font-serif text-2xl font-bold text-ink sm:text-3xl">
                Want to organize a Youth Budget Dialogue in your constituency?
              </h2>
              <p className="mt-2 text-sm text-muted max-w-2xl">
                NYBF provides discussion toolkits, budget data summaries for your county, and speaker connections to help you host an impactful local dialogue.
              </p>
            </div>
            <div className="lg:col-span-4 flex lg:justify-end">
              <Link
                href="/join"
                className="flex items-center gap-2 rounded-full bg-brand px-7 py-4 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-brand/20 transition-all hover:bg-brand-light hover:shadow-lg"
              >
                <span>Apply as Coordinator</span>
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
              National Youth Budget Forum — Empowering Kenyan youth in public finance and governance.
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
              { label: "Mombasa & Coast", href: "/events" },
              { label: "Rift Valley Hub", href: "/events" },
              { label: "Western Hub", href: "/events" },
            ]}
          />
          <FooterColumn
            title="Governance"
            links={[
              { label: "About NYBF", href: "/#about" },
              { label: "Public Finance Act", href: "https://kenyalaw.org" },
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

