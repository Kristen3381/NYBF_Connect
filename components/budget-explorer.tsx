"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, GraduationCap, Laptop, Sprout, HeartPulse, CheckCircle2, TrendingUp, Sparkles } from "lucide-react";

const sectors = [
  {
    id: "education",
    name: "Education & TVET",
    icon: GraduationCap,
    allocation: "Ksh 654 Billion",
    share: "15.6% of Budget",
    youthFocus: "HELB Higher Education Loans & University funding model, free TVET capitation, and technical vocational upgrades across all 47 counties.",
    actionItem: "Track whether your county TVET center received its capitation disbursement on schedule.",
    moduleId: "1",
    moduleTitle: "Understanding Kenya's Budget Architecture",
  },
  {
    id: "digital",
    name: "Digital & Tech Hubs",
    icon: Laptop,
    allocation: "Ksh 142 Billion",
    share: "3.4% of Budget",
    youthFocus: "National fiber optic backbone, Jitume ICT digital labs in constituencies, digital jobs incentives, and digital economy tax policies.",
    actionItem: "Examine the digital services tax and remote work withholding tax provisions in the Finance Bill.",
    moduleId: "2",
    moduleTitle: "The National Budget Cycle & Citizen Oversight",
  },
  {
    id: "enterprise",
    name: "Enterprise & Agri-Jobs",
    icon: Sprout,
    allocation: "Ksh 290 Billion",
    share: "6.9% of Budget",
    youthFocus: "Youth Enterprise Development Fund, Hustler Fund group lending, Access to Government Procurement Opportunities (AGPO 30% quota).",
    actionItem: "Audit your local county government's 30% AGPO youth procurement tenders compliance.",
    moduleId: "3",
    moduleTitle: "Youth & Devolved Economic Planning",
  },
  {
    id: "health",
    name: "Health & Social Safety",
    icon: HeartPulse,
    allocation: "Ksh 188 Billion",
    share: "4.5% of Budget",
    youthFocus: "Universal Health Coverage (UHC), emergency medical funds, youth wellness programs, and social protection safety nets.",
    actionItem: "Review SHA/SHIF statutory deductions and healthcare benefit packages for gig workers.",
    moduleId: "1",
    moduleTitle: "Understanding Kenya's Budget Architecture",
  },
];

export function BudgetExplorer() {
  const [selectedId, setSelectedId] = useState(sectors[0].id);
  const activeSector = sectors.find((s) => s.id === selectedId) || sectors[0];
  const Icon = activeSector.icon;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-brand-dark shadow-2xl">
      {/* Background Photography Asset with Scrim */}
      <div className="absolute inset-0">
        <Image
          src="/pictures/shillings-fan.jpeg"
          alt="Kenyan currency shillings fan"
          fill
          sizes="(max-width: 1024px) 100vw, 1200px"
          className="object-cover opacity-25 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/95 via-brand-dark/90 to-brand-dark/95" />
      </div>

      <div className="relative p-6 sm:p-10 text-white">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end border-b border-white/15 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-emerald-300">
              <Sparkles size={13} />
              Interactive Budget Explorer
            </div>
            <h3 className="mt-3 font-serif text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Where does Ksh 4.2 Trillion go?
            </h3>
            <p className="mt-2 text-sm text-white/80 max-w-xl">
              Select a national spending priority to see the actual shilling allocation and what it means for youth in your county.
            </p>
          </div>

          <Link
            href="/budget-hub"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-300 hover:text-white transition-colors"
          >
            <span>Full Budget Hub Modules</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        {/* Sector Tabs */}
        <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {sectors.map((sector) => {
            const SIcon = sector.icon;
            const isSelected = sector.id === selectedId;
            return (
              <button
                key={sector.id}
                onClick={() => setSelectedId(sector.id)}
                className={`flex items-center gap-2.5 rounded-2xl border p-3.5 text-left transition-all ${
                  isSelected
                    ? "border-emerald-400 bg-emerald-500/20 text-white shadow-lg"
                    : "border-white/10 bg-white/5 text-white/70 hover:border-white/30 hover:bg-white/10"
                }`}
              >
                <SIcon size={18} className={isSelected ? "text-emerald-300" : "text-white/60"} />
                <span className="text-xs font-bold tracking-wide">{sector.name}</span>
              </button>
            );
          })}
        </div>

        {/* Active Sector Card */}
        <div className="mt-6 grid gap-6 rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-md lg:grid-cols-12 items-center">
          <div className="lg:col-span-5 border-b border-white/10 pb-4 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-emerald-400/20 p-3 text-emerald-300">
                <Icon size={24} />
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-emerald-300 font-bold">{activeSector.share}</div>
                <div className="font-serif text-3xl font-black text-white">{activeSector.allocation}</div>
              </div>
            </div>
            <div className="mt-4 rounded-xl bg-black/30 p-3 text-xs text-white/80">
              <span className="font-bold text-white">Youth Impact Focus:</span> {activeSector.youthFocus}
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300">
                <CheckCircle2 size={14} />
                Your Civic Action Opportunity
              </div>
              <p className="mt-1.5 text-sm text-white/90 leading-relaxed font-medium">
                {activeSector.actionItem}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <div className="flex items-center gap-2.5">
                <BookOpen size={16} className="text-emerald-400 shrink-0" />
                <div className="text-xs">
                  <span className="text-white/60">Related Module: </span>
                  <span className="font-bold text-white">{activeSector.moduleTitle}</span>
                </div>
              </div>
              <Link
                href={`/budget-hub`}
                className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-dark transition hover:bg-emerald-300"
              >
                <span>Study</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
