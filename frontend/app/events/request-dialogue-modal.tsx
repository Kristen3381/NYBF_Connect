"use client";

import { useState } from "react";
import { ALL_COUNTY_NAMES, getConstituenciesForCounty } from "@/lib/kenya-data";
import {
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  HelpCircle,
  Loader2,
  MapPin,
  Sparkles,
  Users,
  X,
} from "lucide-react";

interface RequestDialogueModalProps {
  buttonLabel?: string;
  className?: string;
}

export function RequestDialogueModal({
  buttonLabel = "Host / Request a Youth Dialogue",
  className = "inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-brand-light transition-all",
}: RequestDialogueModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [county, setCounty] = useState("Nairobi");
  const [constituency, setConstituency] = useState(getConstituenciesForCounty("Nairobi")[0] || "");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    title: "",
    description: "",
    proposedDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function handleCountyChange(newCounty: string) {
    setCounty(newCounty);
    const cList = getConstituenciesForCounty(newCounty);
    setConstituency(cList[0] || "");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/events/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email || null,
          phone: form.phone || null,
          county,
          constituency,
          title: form.title,
          description: form.description,
          proposedDate: form.proposedDate || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || data.error || "Failed to submit request");
      }

      setSuccess(true);
      setForm({
        name: "",
        email: "",
        phone: "",
        title: "",
        description: "",
        proposedDate: "",
      });
    } catch (err: any) {
      setError(err.message || "An error occurred while submitting your dialogue request.");
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    setIsOpen(false);
    setSuccess(false);
    setError(null);
  }

  const constituencies = getConstituenciesForCounty(county);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={className}
      >
        <Users size={15} />
        <span>{buttonLabel}</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-line bg-surface p-6 sm:p-8 shadow-2xl text-ink"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute right-5 top-5 rounded-full p-2 text-muted hover:bg-surface-soft hover:text-ink transition-colors"
              aria-label="Close dialog"
            >
              <X size={18} />
            </button>

            {success ? (
              <div className="py-8 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="mt-4 font-serif text-2xl font-bold text-ink">Dialogue Proposal Submitted!</h3>
                <p className="mt-2 text-sm text-muted max-w-md mx-auto leading-relaxed">
                  Thank you for stepping up to lead public participation in{" "}
                  <strong className="text-ink">{constituency}, {county} County</strong>. The NYBF Secretariat Devolution Desk will review your proposal and contact you within 48 business hours with discussion toolkits and facilitation guidelines.
                </p>
                <div className="mt-6 flex justify-center">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="rounded-full bg-brand px-8 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-brand-light transition-all"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-brand">
                  <Sparkles size={13} />
                  Constituency Grassroots Initiative
                </div>
                <h2 className="mt-2 font-serif text-2xl font-bold text-ink sm:text-3xl">
                  Host a Youth Budget Dialogue
                </h2>
                <p className="mt-1.5 text-xs sm:text-sm text-muted leading-relaxed">
                  Bring civic accountability and budget literacy to your ward or constituency. NYBF Secretariat provides event guides, fiscal fact sheets, and coordination support.
                </p>

                {error && (
                  <div className="mt-4 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs text-rose-600 dark:text-rose-400">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-left">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-semibold text-ink mb-1">
                        Organizer / Convener Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Christine Mutheu"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full rounded-xl border border-line bg-surface-soft px-3.5 py-2.5 text-sm text-ink outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-ink mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="e.g. convener@domain.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full rounded-xl border border-line bg-surface-soft px-3.5 py-2.5 text-sm text-ink outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <label className="block text-xs font-semibold text-ink mb-1">
                        Phone / WhatsApp
                      </label>
                      <input
                        type="tel"
                        placeholder="e.g. +254 712 345 678"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full rounded-xl border border-line bg-surface-soft px-3.5 py-2.5 text-sm text-ink outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-ink mb-1">
                        County *
                      </label>
                      <select
                        value={county}
                        onChange={(e) => handleCountyChange(e.target.value)}
                        className="w-full rounded-xl border border-line bg-surface-soft px-3 py-2.5 text-sm text-ink outline-none focus:border-brand"
                      >
                        {ALL_COUNTY_NAMES.map((c) => (
                          <option key={c} value={c}>
                            {c} County
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-ink mb-1">
                        Constituency *
                      </label>
                      <select
                        value={constituency}
                        onChange={(e) => setConstituency(e.target.value)}
                        className="w-full rounded-xl border border-line bg-surface-soft px-3 py-2.5 text-sm text-ink outline-none focus:border-brand"
                      >
                        {constituencies.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-ink mb-1">
                        Proposed Dialogue Title / Theme *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Constituency Youth Bursary Allocation & TVET Fund Dialogue"
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        className="w-full rounded-xl border border-line bg-surface-soft px-3.5 py-2.5 text-sm text-ink outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-ink mb-1">
                        Proposed Target Date
                      </label>
                      <input
                        type="date"
                        value={form.proposedDate}
                        onChange={(e) => setForm({ ...form, proposedDate: e.target.value })}
                        className="w-full rounded-xl border border-line bg-surface-soft px-3 py-2.5 text-sm text-ink outline-none focus:border-brand"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-ink mb-1">
                      Event Concept & Expected Audience * (min 10 characters)
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Outline target participants (e.g. 50 student leaders, boda boda youth, small business owners), key issues to discuss, and proposed venue or online platform."
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      className="w-full rounded-xl border border-line bg-surface-soft px-3.5 py-2.5 text-sm text-ink outline-none focus:border-brand focus:ring-1 focus:ring-brand resize-none"
                    />
                  </div>

                  <div className="mt-6 flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="rounded-full px-5 py-2.5 text-xs font-semibold text-muted hover:text-ink transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-brand-light transition-all disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <span>Submit Dialogue Proposal</span>
                          <ChevronRight size={14} />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
