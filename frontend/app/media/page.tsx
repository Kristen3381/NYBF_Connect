"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Nav } from "@/components/nav";
import {
  FileText,
  Video,
  Mic,
  Play,
  Clock,
  Calendar,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Share2,
  Headphones,
  Radio,
} from "lucide-react";
import { FooterColumn } from "@/components/ui-blocks";

type MediaTab = "all" | "articles" | "videos" | "podcasts";

const articles = [
  {
    id: "art-1",
    title: "Decoding the Finance Act 2026: What Changed for Youth and Tech Freelancers?",
    author: "Faith Chebet, NYBF Policy Desk",
    date: "28 August 2026",
    readTime: "6 min read",
    category: "Policy Analysis",
    photo: "/pictures/roundtable-overhead.jpeg",
    excerpt: "A line-by-line review of the newly gazetted Finance Act, detailing digital services tax exemptions and the reformed TVET training capitation fund.",
  },
  {
    id: "art-2",
    title: "Kenya's Public Debt Dilemma: Why Debt Servicing Exceeds 60% of Ordinary Revenue",
    author: "Brian Ochieng, Fiscal Economist",
    date: "15 August 2026",
    readTime: "9 min read",
    category: "Macroeconomics",
    photo: "/pictures/shillings-fan.jpeg",
    excerpt: "Analyzing the amortization schedule of Kenya's Eurobond obligations and their direct squeeze on county equitable share disbursements.",
  },
  {
    id: "art-3",
    title: "How to Win Your First County Government AGPO Tender Under the 30% Youth Quota",
    author: "Kelvin Mwangi, Procurement Lead",
    date: "04 August 2026",
    readTime: "7 min read",
    category: "Youth AGPO Guide",
    photo: "/pictures/leaders-exterior.jpeg",
    excerpt: "Step-by-step citizen guide to obtaining your AGPO Certificate, navigating eCitizen BRS, and submitting responsive county procurement bids.",
  },
];

const videos = [
  {
    id: "vid-1",
    title: "National Youth Budget Town Hall 2026 — Keynote & Parliamentary Debate",
    duration: "42:18",
    date: "12 August 2026",
    location: "KICC Nairobi",
    photo: "/pictures/stage-presentation.jpeg",
    views: "18.4K views",
  },
  {
    id: "vid-2",
    title: "Youth Voices on Devolution: County Budget Allocations & Bursary Governance",
    duration: "28:45",
    date: "22 July 2026",
    location: "Mombasa County Hub",
    photo: "/pictures/panel-speech.jpeg",
    views: "12.1K views",
  },
  {
    id: "vid-3",
    title: "Grassroots Budget Dialogue: Understanding County Fiscal Strategy Papers",
    duration: "34:10",
    date: "10 July 2026",
    location: "Kajiado Chapter",
    photo: "/pictures/field-circle.jpeg",
    views: "9.8K views",
  },
];

const podcasts = [
  {
    id: "pod-1",
    title: "Sauti ya Bajeti Ep 14: Is the Hustler Fund Achieving Economic Graduation for Youth?",
    host: "Amina Hassan with Special Guests from Treasury",
    duration: "38 min",
    date: "25 August 2026",
    photo: "/pictures/auditorium-crowd.jpeg",
    tag: "Episode 14",
  },
  {
    id: "pod-2",
    title: "Sauti ya Bajeti Ep 13: Demystifying Kenya's Tax System — Direct vs Indirect Taxes",
    host: "Amani Mwangi & Youth Policy Panel",
    duration: "44 min",
    date: "18 August 2026",
    photo: "/pictures/roundtable-overhead.jpeg",
    tag: "Episode 13",
  },
];

export default function MediaPage() {
  const [tab, setTab] = useState<MediaTab>("all");

  return (
    <main className="min-h-screen text-ink selection:bg-brand/20 selection:text-brand">
      <Nav />

      {/* HERO SECTION — Minimal dimming */}
      <section className="relative overflow-hidden border-b border-line bg-brand-dark py-16 text-white sm:py-24">
        <div className="absolute inset-0">
          <Image
            src="/pictures/stage-presentation.jpeg"
            alt="NYBF Media Hub"
            fill
            sizes="100vw"
            className="object-cover opacity-75 object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/90 via-brand-dark/65 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/95 via-transparent to-brand-dark/40" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="glass-panel-photo mb-3 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-emerald-300">
            <Radio size={14} />
            Articles, Videos & Podcasts
          </div>
          <h1 className="font-serif text-4xl font-extrabold tracking-tight text-white sm:text-6xl text-shadow-strong">
            NYBF Media Hub
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white sm:text-lg text-shadow-strong">
            In-depth policy essays, recorded townhall debates, and our weekly civic podcast <em>&quot;Sauti ya Bajeti&quot;</em> breaking down public finance for Kenyan youth.
          </p>

          {/* Filter Pills */}
          <div className="mt-8 flex flex-wrap gap-2">
            {[
              { id: "all", label: "All Media" },
              { id: "articles", label: "Articles & Analysis", icon: FileText },
              { id: "videos", label: "Recorded Townhalls (Videos)", icon: Video },
              { id: "podcasts", label: "Sauti ya Bajeti (Podcasts)", icon: Mic },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setTab(item.id as MediaTab)}
                className={`rounded-full px-5 py-2 text-xs sm:text-sm font-bold tracking-wide transition-all ${
                  tab === item.id
                    ? "bg-white text-brand-dark shadow-md"
                    : "glass-panel-photo text-white/80 hover:bg-white/20 hover:text-white"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CONTENT SECTIONS */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 space-y-20">
        {/* 1. ARTICLES */}
        {(tab === "all" || tab === "articles") && (
          <div>
            <div className="flex items-center justify-between border-b border-line pb-4 mb-8">
              <div className="flex items-center gap-2 font-serif text-2xl font-bold text-ink">
                <FileText size={22} className="text-brand" />
                <span>Policy Analysis & Articles</span>
              </div>
              <span className="text-xs font-bold text-muted">{articles.length} Published</span>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {articles.map((art) => (
                <article
                  key={art.id}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-line bg-surface shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-xl"
                >
                  <div>
                    <div className="relative aspect-[16/10] w-full overflow-hidden">
                      <Image
                        src={art.photo}
                        alt={art.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="glass-panel-photo rounded-full px-3 py-1 text-[10px] font-bold text-emerald-300">
                          {art.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center gap-2 text-xs text-muted">
                        <Calendar size={12} />
                        <span>{art.date}</span>
                        <span>•</span>
                        <Clock size={12} />
                        <span>{art.readTime}</span>
                      </div>

                      <h3 className="mt-3 font-serif text-lg font-bold leading-snug text-ink group-hover:text-brand transition-colors">
                        {art.title}
                      </h3>

                      <p className="mt-2.5 text-xs text-muted leading-relaxed line-clamp-3">
                        {art.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0 border-t border-line mt-4 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-muted">{art.author}</span>
                    <span className="flex items-center gap-1 text-xs font-bold text-brand group-hover:text-brand-light">
                      <span>Read</span>
                      <ArrowRight size={13} />
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* 2. VIDEOS */}
        {(tab === "all" || tab === "videos") && (
          <div>
            <div className="flex items-center justify-between border-b border-line pb-4 mb-8">
              <div className="flex items-center gap-2 font-serif text-2xl font-bold text-ink">
                <Video size={22} className="text-rose-600" />
                <span>Recorded Forum Keynotes & Debates</span>
              </div>
              <span className="text-xs font-bold text-muted">{videos.length} Sessions</span>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {videos.map((vid) => (
                <div
                  key={vid.id}
                  className="group relative overflow-hidden rounded-3xl border border-line bg-surface shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-black">
                    <Image
                      src={vid.photo}
                      alt={vid.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105 opacity-90"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-brand-dark shadow-xl transition-transform group-hover:scale-110">
                        <Play size={22} className="fill-brand-dark ml-1" />
                      </div>
                    </div>
                    <div className="absolute bottom-3 right-3 rounded-lg bg-black/80 px-2 py-0.5 font-mono text-[10px] font-bold text-white">
                      {vid.duration}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between text-xs text-muted">
                      <span>{vid.location}</span>
                      <span>{vid.views}</span>
                    </div>

                    <h3 className="mt-2.5 font-serif text-base font-bold text-ink group-hover:text-brand transition-colors">
                      {vid.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. PODCASTS */}
        {(tab === "all" || tab === "podcasts") && (
          <div>
            <div className="flex items-center justify-between border-b border-line pb-4 mb-8">
              <div className="flex items-center gap-2 font-serif text-2xl font-bold text-ink">
                <Headphones size={22} className="text-brand-gold" />
                <span>Sauti ya Bajeti Podcast</span>
              </div>
              <span className="text-xs font-bold text-muted">Weekly Civic Episodes</span>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {podcasts.map((pod) => (
                <div
                  key={pod.id}
                  className="rounded-3xl border border-line bg-surface p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row gap-6 items-center justify-between transition-all hover:shadow-lg"
                >
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl">
                    <Image
                      src={pod.photo}
                      alt={pod.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <Mic size={24} className="text-white" />
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-xs text-brand-gold font-bold uppercase tracking-wider">
                      <span>{pod.tag}</span>
                      <span>•</span>
                      <span className="text-muted">{pod.duration}</span>
                    </div>

                    <h3 className="mt-2 font-serif text-base font-bold text-ink">
                      {pod.title}
                    </h3>
                    <p className="mt-1 text-xs text-muted">{pod.host}</p>

                    <div className="mt-4 flex items-center gap-3">
                      <button className="flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-brand-light">
                        <Play size={12} className="fill-white" />
                        <span>Listen Now</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
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
            title="Media"
            links={[
              { label: "Articles", href: "/media" },
              { label: "Recorded Videos", href: "/media" },
              { label: "Podcast Episodes", href: "/media" },
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
