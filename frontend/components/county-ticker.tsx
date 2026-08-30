"use client";

import { Sparkles, ArrowUpRight, Flame } from "lucide-react";

const tickerItems = [
  "⚡ FY 2026/27 NATIONAL BUDGET FORMULATION OPEN",
  "🇰🇪 47 COUNTIES ENGAGED",
  "📊 OVER 14,200 YOUTH VOTES CAST IN NATIONAL PULSE",
  "💡 NEW POLICY MEMORANDUM: YOUTH TVET & DIGITAL TAX REFORM",
  "🌱 KSH 850M ALLOCATED FOR COUNTY GREEN INNOVATION GRANTS",
  "📍 NAIROBI • MOMBASA • KISUMU • TURKANA • MACHAKOS • NAKURU",
  "🔥 NEXT HYBRID TOWNHALL: 12TH SEPT 2026",
];

export function CountyTicker() {
  return (
    <div className="relative overflow-hidden border-y border-line bg-surface/90 py-3 backdrop-blur-md">
      <div className="flex w-fit animate-marquee whitespace-nowrap">
        <div className="flex items-center gap-8 px-4">
          {tickerItems.map((item, i) => (
            <div key={i} className="flex items-center gap-3 text-xs font-bold tracking-widest text-ink">
              <span className="text-brand-gold">●</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-8 px-4">
          {tickerItems.map((item, i) => (
            <div key={`dup-${i}`} className="flex items-center gap-3 text-xs font-bold tracking-widest text-ink">
              <span className="text-brand-gold">●</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
