"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Nav } from "@/components/nav";
import {
  FileText,
  Video,
  Mic,
  Play,
  Pause,
  Clock,
  Calendar,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Share2,
  Headphones,
  Radio,
  X,
  Volume2,
  CheckCircle2,
} from "lucide-react";
import { FooterColumn } from "@/components/ui-blocks";

type MediaTab = "all" | "articles" | "videos" | "podcasts";

interface ArticleItem {
  id: string;
  title: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  photo: string;
  excerpt: string;
  body: string;
}

interface VideoItem {
  id: string;
  title: string;
  duration: string;
  date: string;
  location: string;
  photo: string;
  views: string;
  summary: string;
}

interface PodcastItem {
  id: string;
  title: string;
  host: string;
  duration: string;
  date: string;
  photo: string;
  tag: string;
}

const articles: ArticleItem[] = [
  {
    id: "art-1",
    title: "Decoding the Finance Act 2026: What Changed for Youth and Tech Freelancers?",
    author: "NYBF Policy Research Desk",
    date: "28 August 2026",
    readTime: "6 min read",
    category: "Policy Analysis",
    photo: "/pictures/roundtable-overhead.jpeg",
    excerpt: "A line-by-line review of the newly gazetted Finance Act, detailing digital services tax exemptions and the reformed TVET training capitation fund.",
    body: `### 1. Executive Summary
The enacted Finance Act contains critical fiscal policy adjustments directly impacting Kenya's informal economy and youth-led technology startups. Following public memorandums submitted during parliamentary committee hearings, key concessions were secured for digital workers and early-stage entrepreneurs.

### 2. Key Legislative Highlights
- **Digital Economy Withholding Tax Exemptions:** Micro-freelancers earning below statutory thresholds are shielded from aggressive turnover deductions.
- **TVET Capitation Ringfencing:** Mandatory budgetary transfers to public vocational institutions must now be disbursed directly within 30 days of exchequer release.
- **Green Enterprise Incentives:** Solar assembly, battery equipment, and climate-smart irrigation machinery retain zero-rated Value Added Tax (VAT) treatment.

### 3. Recommended Citizen Action
Young citizens are encouraged to monitor local County Assembly budget committees and report irregularities in bursary or enterprise fund disbursements to the NYBF Devolution Desk.`,
  },
  {
    id: "art-2",
    title: "Kenya's Public Debt Dilemma: Why Debt Servicing Exceeds 60% of Ordinary Revenue",
    author: "NYBF Economics & Fiscal Desk",
    date: "15 August 2026",
    readTime: "9 min read",
    category: "Macroeconomics",
    photo: "/pictures/shillings-fan.jpeg",
    excerpt: "Analyzing the amortization schedule of Kenya's Eurobond obligations and their direct squeeze on county equitable share disbursements.",
    body: `### 1. The Fiscal Reality
Kenya's public debt portfolio has reached levels where debt servicing absorbs over 60% of ordinary tax revenue. This historic burden limits the state's capacity to finance development projects, TVET bursaries, and youth economic stimulus programs.

### 2. Composition of National Debt Obligations
- **Domestic Treasury Debt:** High local borrowing yields (14–17%) create aggressive debt servicing obligations that crowd out private sector credit.
- **Eurobonds & Commercial Debt:** Foreign-currency-denominated debt increases vulnerability to exchange rate fluctuations.
- **Multilateral Concessional Financing:** Facilities from the World Bank and IMF provide lower coupon rates but require strict fiscal compliance.

### 3. Policy Interventions Submitted to Parliament
NYBF advocates for establishing a dedicated Public Debt Sinking Fund and enforcing strict compliance with Article 201(c) of the Constitution: borrowing must strictly finance productive capital projects that yield verifiable economic returns.`,
  },
  {
    id: "art-3",
    title: "How to Win Your First County Government AGPO Tender Under the 30% Youth Quota",
    author: "NYBF Youth AGPO & Enterprise Desk",
    date: "04 August 2026",
    readTime: "7 min read",
    category: "Youth AGPO Guide",
    photo: "/pictures/leaders-exterior.jpeg",
    excerpt: "Step-by-step citizen guide to obtaining your AGPO Certificate, navigating eCitizen BRS, and submitting responsive county procurement bids.",
    body: `### 1. The Statutory Framework
The Public Procurement and Asset Disposal Act (2015) mandates all procuring entities to allocate at least 30% of their annual procurement spend to enterprises owned by youth, women, and persons with disabilities.

### 2. Step-by-Step Bidding Preparation
1. **Business Registration:** Register an enterprise (Sole Proprietorship or Limited Company) via the eCitizen Business Registration Service (BRS).
2. **KRA Tax Compliance:** Maintain an active Tax Compliance Certificate (TCC) through the eTIMS platform.
3. **AGPO Certification:** Apply online at agpo.go.ke with your national ID, registration certificate, and CR12 document.
4. **Portal Sourcing:** Monitor tenders.go.ke and county government procurement portals for reserved tenders.

### 3. Verification & Compliance Checklist
Ensure that your bid submissions include mandatory serialized pages, valid tender securing declarations, and compliant financial schedules to avoid technical disqualification.`,
  },
];

const videos: VideoItem[] = [
  {
    id: "vid-1",
    title: "National Youth Budget Town Hall 2026 — Keynote & Parliamentary Debate",
    duration: "42:18",
    date: "12 August 2026",
    location: "KICC Nairobi",
    photo: "/pictures/stage-presentation.jpeg",
    views: "18.4K views",
    summary: "Comprehensive plenary debate between youth delegates, the Parliamentary Budget Office, and the National Treasury discussing the FY 2026/27 Budget Policy Statement.",
  },
  {
    id: "vid-2",
    title: "Youth Voices on Devolution: County Budget Allocations & Bursary Governance",
    duration: "28:45",
    date: "22 July 2026",
    location: "Mombasa County Hub",
    photo: "/pictures/panel-speech.jpeg",
    views: "12.1K views",
    summary: "Grassroots symposium addressing equitable county resource allocation, bursary distribution transparency, and civic participation in ward public hearings.",
  },
  {
    id: "vid-3",
    title: "Grassroots Budget Dialogue: Understanding County Fiscal Strategy Papers",
    duration: "34:10",
    date: "10 July 2026",
    location: "Kajiado Chapter",
    photo: "/pictures/field-circle.jpeg",
    views: "9.8K views",
    summary: "Capacity building circle instructing youth community organizers on interrogating County Fiscal Strategy Papers and drafting formal public memoranda.",
  },
];

const podcasts: PodcastItem[] = [
  {
    id: "pod-1",
    title: "Sauti ya Bajeti Ep 14: Is the Hustler Fund Achieving Economic Graduation for Youth?",
    host: "NYBF Civic Media Desk with Special Guests from National Treasury",
    duration: "38 min",
    date: "25 August 2026",
    photo: "/pictures/auditorium-crowd.jpeg",
    tag: "Episode 14",
  },
  {
    id: "pod-2",
    title: "Sauti ya Bajeti Ep 13: Demystifying Kenya's Tax System — Direct vs Indirect Taxes",
    host: "NYBF Civic Media Desk & Devolved Policy Panel",
    duration: "44 min",
    date: "18 August 2026",
    photo: "/pictures/roundtable-overhead.jpeg",
    tag: "Episode 13",
  },
];

export default function MediaPage() {
  const [tab, setTab] = useState<MediaTab>("all");
  const [readingArticle, setReadingArticle] = useState<ArticleItem | null>(null);
  const [watchingVideo, setWatchingVideo] = useState<VideoItem | null>(null);
  const [activePodcast, setActivePodcast] = useState<PodcastItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const [dbArticles, setDbArticles] = useState<ArticleItem[]>(articles);
  const [dbVideos, setDbVideos] = useState<VideoItem[]>(videos);
  const [dbPodcasts, setDbPodcasts] = useState<PodcastItem[]>(podcasts);

  useEffect(() => {
    async function loadMedia() {
      try {
        const res = await fetch("/api/media");
        if (res.ok) {
          const data = await res.json();
          if (data.items && data.items.length > 0) {
            const fetchedArticles: ArticleItem[] = [];
            const fetchedVideos: VideoItem[] = [];
            const fetchedPodcasts: PodcastItem[] = [];

            for (const item of data.items) {
              const formattedDate = new Date(item.createdAt).toLocaleDateString("en-KE", {
                day: "numeric",
                month: "short",
                year: "numeric",
              });

              if (item.type === "ARTICLE") {
                fetchedArticles.push({
                  id: item.id,
                  title: item.title,
                  author: item.author || "NYBF Policy Research Desk",
                  date: formattedDate,
                  readTime: "5 min read",
                  category: item.tag || "Policy Analysis",
                  photo: item.thumbnail || "/pictures/roundtable-overhead.jpeg",
                  excerpt: item.summary || item.body?.slice(0, 150) || "",
                  body: item.body || item.summary || "",
                });
              } else if (item.type === "VIDEO") {
                fetchedVideos.push({
                  id: item.id,
                  title: item.title,
                  duration: "Full Session",
                  date: formattedDate,
                  location: item.location || "Nairobi",
                  photo: item.thumbnail || "/pictures/stage-presentation.jpeg",
                  views: "Verified Broadcast",
                  summary: item.summary || "",
                });
              } else if (item.type === "PODCAST") {
                fetchedPodcasts.push({
                  id: item.id,
                  title: item.title,
                  host: item.author || "NYBF Civic Media Desk",
                  duration: "Audio Episode",
                  date: formattedDate,
                  photo: item.thumbnail || "/pictures/panel-speech.jpeg",
                  tag: item.tag || "Civic Audio",
                });
              }
            }

            if (fetchedArticles.length > 0) setDbArticles(fetchedArticles);
            if (fetchedVideos.length > 0) setDbVideos(fetchedVideos);
            if (fetchedPodcasts.length > 0) setDbPodcasts(fetchedPodcasts);
          }
        }
      } catch (err) {
        console.error("Failed to load dynamic media:", err);
      }
    }
    loadMedia();
  }, []);

  return (
    <main className="min-h-screen text-ink selection:bg-brand/20 selection:text-brand pb-24">
      <Nav />

      {/* HERO SECTION */}
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
              <span className="text-xs font-bold text-muted">{dbArticles.length} Published</span>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {dbArticles.map((art) => (
                <article
                  key={art.id}
                  onClick={() => setReadingArticle(art)}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-line bg-surface shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-xl cursor-pointer"
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
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setReadingArticle(art);
                      }}
                      className="flex items-center gap-1 text-xs font-bold text-brand group-hover:text-brand-light"
                    >
                      <span>Read</span>
                      <ArrowRight size={13} />
                    </button>
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
              <span className="text-xs font-bold text-muted">{dbVideos.length} Sessions</span>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {dbVideos.map((vid) => (
                <div
                  key={vid.id}
                  onClick={() => setWatchingVideo(vid)}
                  className="group relative overflow-hidden rounded-3xl border border-line bg-surface shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between cursor-pointer"
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
              {dbPodcasts.map((pod) => (
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
                      <button
                        type="button"
                        onClick={() => {
                          setActivePodcast(pod);
                          setIsPlaying(true);
                        }}
                        className="flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-brand-light transition-all active:scale-95"
                      >
                        {activePodcast?.id === pod.id && isPlaying ? (
                          <>
                            <Pause size={12} className="fill-white" />
                            <span>Pause Episode</span>
                          </>
                        ) : (
                          <>
                            <Play size={12} className="fill-white" />
                            <span>Listen Now</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ARTICLE READER MODAL */}
      {readingArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto animate-pop-in rounded-3xl border border-line bg-surface p-6 sm:p-10 shadow-2xl text-ink">
            <button
              onClick={() => setReadingArticle(null)}
              className="absolute top-5 right-5 rounded-full p-2 text-muted hover:bg-bg hover:text-ink transition"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand">
              <FileText size={15} />
              <span>{readingArticle.category}</span>
              <span>•</span>
              <span className="text-muted">{readingArticle.readTime}</span>
            </div>

            <h2 className="mt-3 font-serif text-2xl sm:text-3xl font-bold leading-snug text-ink">
              {readingArticle.title}
            </h2>

            <div className="mt-3 flex items-center gap-3 text-xs text-muted pb-4 border-b border-line">
              <span className="font-semibold text-ink">{readingArticle.author}</span>
              <span>•</span>
              <span>{readingArticle.date}</span>
            </div>

            <div className="mt-6 whitespace-pre-line text-sm leading-relaxed text-ink/90 font-sans space-y-4">
              {readingArticle.body}
            </div>

            <div className="mt-8 pt-6 border-t border-line flex items-center justify-between">
              <span className="text-xs text-muted font-medium">Published by National Youth Budget Forum</span>
              <button
                onClick={() => setReadingArticle(null)}
                className="rounded-full bg-brand px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-brand-light"
              >
                Close Briefing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIDEO PLAYBACK MODAL */}
      {watchingVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-3xl animate-pop-in rounded-3xl border border-white/20 bg-brand-dark p-6 sm:p-8 text-white shadow-2xl">
            <button
              onClick={() => setWatchingVideo(null)}
              className="absolute top-5 right-5 rounded-full p-2 text-white/60 hover:bg-white/10 hover:text-white transition"
            >
              <X size={20} />
            </button>

            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black flex items-center justify-center border border-white/10">
              <Image
                src={watchingVideo.photo}
                alt={watchingVideo.title}
                fill
                className="object-cover opacity-60"
              />
              <div className="relative z-10 text-center p-6">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-400 text-brand-dark shadow-2xl">
                  <Play size={26} className="fill-brand-dark ml-1" />
                </div>
                <div className="mt-3 font-serif text-lg font-bold text-white">
                  Archived Forum Session Playback
                </div>
                <div className="mt-1 text-xs text-white/70">
                  Recorded Live at {watchingVideo.location} ({watchingVideo.duration})
                </div>
              </div>
            </div>

            <div className="mt-5">
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold uppercase tracking-wider">
                <span>{watchingVideo.location}</span>
                <span>•</span>
                <span>{watchingVideo.date}</span>
                <span>•</span>
                <span className="text-white/60">{watchingVideo.views}</span>
              </div>
              <h3 className="mt-2 font-serif text-xl sm:text-2xl font-bold text-white">
                {watchingVideo.title}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-white/80 leading-relaxed">
                {watchingVideo.summary}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-white/15 flex items-center justify-between">
              <span className="text-xs text-white/60">Official NYBF Civic Forum Archives</span>
              <button
                onClick={() => setWatchingVideo(null)}
                className="rounded-full bg-white px-6 py-2 text-xs font-bold uppercase tracking-wider text-brand-dark hover:bg-emerald-300"
              >
                Close Session
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STICKY PODCAST AUDIO BAR */}
      {activePodcast && (
        <div className="fixed bottom-4 inset-x-4 max-w-4xl mx-auto z-50 animate-fade-in-up">
          <div className="rounded-2xl border border-white/20 bg-brand-dark p-4 shadow-2xl text-white backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative h-12 w-12 shrink-0 rounded-xl overflow-hidden bg-black/40">
                <Image src={activePodcast.photo} alt={activePodcast.title} fill className="object-cover" />
              </div>
              <div className="overflow-hidden">
                <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wide">
                  Now Playing • {activePodcast.tag}
                </div>
                <div className="text-xs font-bold text-white truncate max-w-xs sm:max-w-md">
                  {activePodcast.title}
                </div>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-400 text-brand-dark shadow-md hover:bg-emerald-300 transition active:scale-95"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? <Pause size={18} className="fill-brand-dark" /> : <Play size={18} className="fill-brand-dark ml-0.5" />}
                </button>
                <div className="text-xs text-white/70 font-mono">
                  {isPlaying ? "04:15 / " : "Paused / "} {activePodcast.duration}
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setActivePodcast(null);
                  setIsPlaying(false);
                }}
                className="rounded-full p-1.5 text-white/60 hover:bg-white/10 hover:text-white"
                aria-label="Close audio player"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

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
