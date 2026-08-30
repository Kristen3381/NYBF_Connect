"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, MessageSquare, ArrowRight, ShieldCheck, MapPin, Users } from "lucide-react";

const photos = [
  {
    src: "/pictures/rally-flags.jpeg",
    title: "National Youth Mobilization",
    subtitle: "Rallying outside Parliament for open budget data",
    badge: "Civic Action",
    location: "Nairobi Central",
  },
  {
    src: "/pictures/roundtable-overhead.jpeg",
    title: "Youth Budget Formulation",
    subtitle: "Overhead analysis of fiscal allocation lines",
    badge: "Policy Review",
    location: "NYBF Executive Table",
  },
  {
    src: "/pictures/panel-speech.jpeg",
    title: "Youth Voice at the Dais",
    subtitle: "Delegates defending education loan funding",
    badge: "Direct Consultation",
    location: "National Forum",
  },
  {
    src: "/pictures/auditorium-crowd.jpeg",
    title: "2,400+ Delegates Gathered",
    subtitle: "Universities & community chapters united",
    badge: "Devolution Reach",
    location: "47 Counties",
  },
  {
    src: "/pictures/field-circle.jpeg",
    title: "Grassroots County Circles",
    subtitle: "Devolved economic dialogues in local communities",
    badge: "County Pulse",
    location: "Rift Valley / Coast / Nyanza",
  },
];

export function HeroInteractiveStack() {
  const [activeIdx, setActiveIdx] = useState(0);
  const activePhoto = photos[activeIdx];

  return (
    <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
      {/* Background ambient glow */}
      <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-emerald-500/20 via-brand/20 to-amber-500/20 blur-2xl" />

      {/* Main Photographic Frame */}
      <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-brand-dark/90 shadow-2xl">
        <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full overflow-hidden">
          {photos.map((photo, i) => (
            <div
              key={photo.src}
              className={`absolute inset-0 transition-all duration-700 ease-out ${
                i === activeIdx ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
              }`}
            >
              <Image
                src={photo.src}
                alt={photo.title}
                fill
                priority={i === 0}
                sizes="(max-width: 768px) 100vw, 550px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            </div>
          ))}

          {/* Top Pill Overlay */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <span className="glass-panel-photo inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-white">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              {activePhoto.badge}
            </span>
            <span className="glass-panel-photo inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-white/90">
              <MapPin size={12} className="text-emerald-400" />
              {activePhoto.location}
            </span>
          </div>

          {/* Bottom Card Content */}
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 text-white">
            <h3 className="font-serif text-xl font-bold leading-tight sm:text-2xl text-white">
              {activePhoto.title}
            </h3>
            <p className="mt-1.5 text-xs sm:text-sm text-white/80 line-clamp-2">
              {activePhoto.subtitle}
            </p>

            {/* Interactive Selector Tabs */}
            <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1 pt-2">
              {photos.map((p, i) => (
                <button
                  key={p.src}
                  onClick={() => setActiveIdx(i)}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold tracking-wide transition-all shrink-0 ${
                    i === activeIdx
                      ? "bg-emerald-400 text-brand-dark shadow-md"
                      : "bg-white/20 text-white/80 hover:bg-white/30"
                  }`}
                >
                  <span>0{i + 1}</span>
                  <span className="hidden sm:inline">{p.badge}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Overlapping Badge: Youth Quote */}
      <div className="glass-panel-photo absolute -bottom-6 -left-4 sm:-left-6 hidden sm:flex max-w-[280px] items-start gap-3 rounded-2xl p-4 text-white shadow-xl animate-float">
        <div className="rounded-xl bg-emerald-400/20 p-2 text-emerald-300 shrink-0">
          <MessageSquare size={16} />
        </div>
        <div>
          <p className="text-xs leading-snug text-white/90 font-medium">
            &ldquo;We don&apos;t want handouts in the budget. We want transparent procurement and innovation funding.&rdquo;
          </p>
          <p className="mt-1.5 text-[10px] font-bold uppercase tracking-widest text-emerald-300">
            — Machakos County Delegate
          </p>
        </div>
      </div>

      {/* Floating Overlapping Badge: Verification Stamp */}
      <div className="glass-panel-photo absolute -top-5 -right-3 hidden sm:flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold text-white shadow-lg">
        <ShieldCheck size={18} className="text-emerald-400" />
        <div>
          <div className="text-[10px] uppercase tracking-wider text-white/60">Legislation</div>
          <div className="text-xs font-black text-white">47 County Chapters</div>
        </div>
      </div>
    </div>
  );
}
