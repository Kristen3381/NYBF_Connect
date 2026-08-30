"use client";

import { useState } from "react";
import { OpportunityCard } from "@/components/ui-blocks";
import { Briefcase, GraduationCap, Award, DollarSign, ShieldCheck, Filter } from "lucide-react";

type Opp = {
  id: string;
  title: string;
  type: string;
  location: string;
  deadline: string | Date;
  description?: string;
  stipend?: string;
};

export function OpportunitiesClient({ initialOpportunities }: { initialOpportunities: Opp[] }) {
  const [selectedType, setSelectedType] = useState<string>("ALL");

  const categories = [
    { id: "ALL", label: "All Opportunities" },
    { id: "JOB", label: "Jobs", icon: Briefcase },
    { id: "INTERNSHIP", label: "Internships", icon: GraduationCap },
    { id: "FELLOWSHIP", label: "Fellowships & Scholarships", icon: Award },
    { id: "GRANT", label: "Grants & Seed Funding", icon: DollarSign },
    { id: "PROGRAMME", label: "AGPO & Bootcamps", icon: ShieldCheck },
  ];

  const filtered = initialOpportunities.filter((item) => {
    if (selectedType === "ALL") return true;
    return item.type.toUpperCase() === selectedType;
  });

  return (
    <div className="space-y-8">
      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => {
          const isSelected = selectedType === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedType(cat.id)}
              className={`rounded-full px-5 py-2.5 text-xs sm:text-sm font-bold tracking-wide transition-all ${
                isSelected
                  ? "bg-brand text-white shadow-md"
                  : "border border-line bg-surface text-ink/80 hover:border-brand/40 hover:text-brand"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => {
          const deadlineStr =
            item.deadline instanceof Date
              ? item.deadline.toLocaleDateString("en-KE", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : String(item.deadline);

          return (
            <div key={item.id} className="h-full">
              <OpportunityCard
                title={item.title}
                type={item.type}
                location={item.location}
                deadline={deadlineStr}
                href="/my-nybf"
              />
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-3xl border border-line bg-surface p-12 text-center text-muted">
          <p className="text-sm">No opportunities currently listed under this filter.</p>
          <button
            onClick={() => setSelectedType("ALL")}
            className="mt-3 text-xs font-bold uppercase tracking-wider text-brand"
          >
            Show All Opportunities
          </button>
        </div>
      )}
    </div>
  );
}
