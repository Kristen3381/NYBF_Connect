"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Send, Sparkles, ArrowRight, ShieldCheck, Loader2, AlertCircle } from "lucide-react";

interface PollOption {
  id: string;
  label: string;
  votesCount: number;
}

interface PollProps {
  initialPoll?: {
    id: string;
    question: string;
    options: PollOption[];
  } | null;
}

export function LivePulseVoting({ initialPoll }: PollProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [voteError, setVoteError] = useState<string | null>(null);

  const initialTotal = initialPoll?.options
    ? initialPoll.options.reduce((acc, curr) => acc + (curr.votesCount || 0), 0)
    : 0;
  const [totalVotes, setTotalVotes] = useState(initialTotal);

  // Idea pitch state
  const [ideaTitle, setIdeaTitle] = useState("");
  const [ideaCategory, setIdeaCategory] = useState("Taxation & Cost of Living");
  const [ideaBody, setIdeaBody] = useState("");
  const [ideaSubmitted, setIdeaSubmitted] = useState(false);
  const [ideaLoading, setIdeaLoading] = useState(false);
  const [ideaError, setIdeaError] = useState<string | null>(null);

  const handleVote = async (optionId: string) => {
    if (hasVoted || submitting || !initialPoll?.id) return;
    setVoteError(null);
    setSubmitting(true);

    try {
      const res = await fetch(`/api/polls/${initialPoll.id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optionId }),
      });

      if (res.status === 401) {
        setVoteError("Please sign in to register your vote in this consultation.");
        return;
      }
      if (res.status === 409) {
        setVoteError("You have already voted in this poll.");
        setHasVoted(true);
        setSelectedOption(optionId);
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setVoteError(data.error || "Failed to register vote. Please try again.");
        return;
      }

      setSelectedOption(optionId);
      setHasVoted(true);
      setTotalVotes((prev) => prev + 1);
    } catch {
      setVoteError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleIdeaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIdeaLoading(true);
    setIdeaError(null);

    try {
      const res = await fetch("/api/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: ideaTitle,
          description: ideaBody,
          category: ideaCategory,
        }),
      });

      if (res.status === 401) {
        setIdeaError("Please sign in to submit a policy proposal to Parliament.");
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setIdeaError(data.error || "Failed to submit proposal. Please check your inputs.");
        return;
      }

      setIdeaSubmitted(true);
    } catch {
      setIdeaError("Network error. Please try again.");
    } finally {
      setIdeaLoading(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-12 items-stretch">
      {/* Left Column: Live Poll Voting Card */}
      <div className="lg:col-span-6 relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/20 bg-brand-dark p-6 sm:p-8 text-white shadow-2xl">
        <div className="absolute inset-0">
          <Image
            src="/pictures/panel-speech.jpeg"
            alt="Youth speaking on panel"
            fill
            sizes="(max-width: 1024px) 100vw, 600px"
            className="object-cover opacity-20"
          />
          <div className="scrim-hero absolute inset-0" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between border-b border-white/15 pb-4">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 animate-ping rounded-full bg-rose-500" />
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                National Youth Pulse
              </span>
            </div>
            {initialPoll && (
              <span className="text-xs text-white/70">
                {totalVotes.toLocaleString()} Votes Recorded
              </span>
            )}
          </div>

          {initialPoll && initialPoll.options.length > 0 ? (
            <>
              <h3 className="mt-4 font-serif text-2xl font-bold leading-snug text-white sm:text-3xl">
                {initialPoll.question}
              </h3>

              {voteError && (
                <div className="mt-4 rounded-xl bg-amber-500/20 border border-amber-400/30 p-3 text-xs font-semibold text-amber-200 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <AlertCircle size={15} className="shrink-0 text-amber-300" />
                    <span>{voteError}</span>
                  </div>
                  {voteError.includes("sign in") && (
                    <Link href="/my-nybf" className="underline font-bold text-white hover:text-emerald-300 shrink-0">
                      Sign in &rarr;
                    </Link>
                  )}
                </div>
              )}

              <div className="mt-6 space-y-3">
                {initialPoll.options.map((opt) => {
                  const voteDelta = hasVoted && selectedOption === opt.id ? 1 : 0;
                  const count = (opt.votesCount || 0) + voteDelta;
                  const pct = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
                  const isSelected = selectedOption === opt.id;

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleVote(opt.id)}
                      disabled={hasVoted || submitting}
                      className={`group relative w-full overflow-hidden rounded-2xl border p-4 text-left transition-all ${
                        isSelected
                          ? "border-emerald-400 bg-emerald-500/20 text-white shadow-md"
                          : hasVoted
                          ? "border-white/10 bg-white/5 text-white/80"
                          : "border-white/20 bg-white/10 hover:border-emerald-400 hover:bg-white/15 text-white"
                      }`}
                    >
                      {/* Result Bar on vote */}
                      {hasVoted && (
                        <div
                          className="absolute inset-y-0 left-0 bg-emerald-500/30 transition-all duration-1000 ease-out"
                          style={{ width: `${pct}%` }}
                        />
                      )}

                      <div className="relative flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold">
                        <span className="flex-1 leading-snug">{opt.label}</span>
                        <span className="flex items-center gap-2 shrink-0">
                          {hasVoted && (
                            <span className="font-mono text-xs font-bold text-emerald-300">
                              {pct}%
                            </span>
                          )}
                          {isSelected && (
                            <CheckCircle2 size={18} className="text-emerald-400 animate-pop-in" />
                          )}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="py-12 text-center space-y-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-emerald-400">
                <ShieldCheck size={28} />
              </div>
              <h3 className="font-serif text-2xl font-bold text-white">Public Consultation Active</h3>
              <p className="text-xs sm:text-sm text-white/70 max-w-sm mx-auto">
                No open citizen polls at this immediate moment. The next consultation for the upcoming budget cycle will appear here soon.
              </p>
            </div>
          )}
        </div>

        <div className="relative z-10 mt-6 pt-4 border-t border-white/15 flex items-center justify-between text-xs text-white/80">
          {hasVoted ? (
            <div className="flex items-center gap-2 text-emerald-300 font-bold">
              <CheckCircle2 size={16} />
              <span>Vote submitted. Thank you for making your voice count!</span>
            </div>
          ) : (
            <span>Tap an option to cast your vote directly.</span>
          )}
          <Link
            href="/youth-voice"
            className="font-bold uppercase tracking-wider text-emerald-400 hover:text-white transition-colors"
          >
            All Consultations →
          </Link>
        </div>
      </div>

      {/* Right Column: Idea Pitch Box */}
      <div className="lg:col-span-6 relative flex flex-col justify-between rounded-3xl border border-line bg-surface p-6 sm:p-8 shadow-xl">
        <div>
          <div className="flex items-center justify-between border-b border-line pb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-brand-gold" />
              <span className="text-xs font-bold uppercase tracking-widest text-brand dark:text-brand-light">
                Citizen Policy Pitch
              </span>
            </div>
            <span className="rounded-full bg-brand/10 px-2.5 py-0.5 text-[11px] font-bold text-brand dark:text-brand-light">
              Sent to Parliament Review
            </span>
          </div>

          <h3 className="mt-4 font-serif text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Have a policy idea for Kenya?
          </h3>
          <p className="mt-1.5 text-xs sm:text-sm text-muted">
            The National Youth Budget Forum compiles vetted youth proposals into the official Youth Budget Memorandum presented before the National Assembly.
          </p>

          {ideaError && (
            <div className="mt-4 rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <AlertCircle size={15} className="shrink-0" />
                <span>{ideaError}</span>
              </div>
              {ideaError.includes("sign in") && (
                <Link href="/my-nybf" className="underline font-bold text-brand dark:text-brand-light shrink-0">
                  Sign in &rarr;
                </Link>
              )}
            </div>
          )}

          {!ideaSubmitted ? (
            <form onSubmit={handleIdeaSubmit} className="mt-5 space-y-3.5">
              <input
                required
                placeholder="What is your policy proposal title?"
                value={ideaTitle}
                onChange={(e) => setIdeaTitle(e.target.value)}
                className="w-full rounded-2xl border border-line bg-bg p-3.5 text-xs sm:text-sm text-ink placeholder:text-muted/60 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
              />

              <div className="grid grid-cols-2 gap-2">
                {["Taxation & Living Costs", "TVET & Jobs", "Tech & Digital Hubs", "County Bursaries"].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setIdeaCategory(cat)}
                    className={`rounded-xl border p-2 text-left text-xs font-semibold transition ${
                      ideaCategory === cat
                        ? "border-brand bg-brand text-white shadow-sm"
                        : "border-line bg-surface text-ink/70 hover:border-brand/40"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div>
                <textarea
                  required
                  rows={3}
                  maxLength={500}
                  placeholder="Describe how the government should allocate resources or amend the law..."
                  value={ideaBody}
                  onChange={(e) => setIdeaBody(e.target.value)}
                  className="w-full rounded-2xl border border-line bg-bg p-3.5 text-xs sm:text-sm text-ink placeholder:text-muted/60 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                />
                <div className="mt-1 flex justify-between text-[11px] text-muted">
                  <span>Be constructive & specific</span>
                  <span>{ideaBody.length}/500</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={ideaLoading}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-brand py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-brand/25 transition-all hover:-translate-y-0.5 hover:bg-brand-light hover:shadow-lg active:translate-y-0 disabled:opacity-50"
              >
                {ideaLoading ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    <span>Submitting proposal…</span>
                  </>
                ) : (
                  <>
                    <span>Submit Policy Idea</span>
                    <Send size={14} />
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="mt-8 animate-pop-in rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center">
              <CheckCircle2 size={36} className="mx-auto text-emerald-600 dark:text-emerald-400" />
              <h4 className="mt-3 font-serif text-lg font-bold text-ink">Proposal Received!</h4>
              <p className="mt-1.5 text-xs text-muted">
                Your proposal has been logged for review by the NYBF policy research committee.
              </p>
              <button
                type="button"
                onClick={() => {
                  setIdeaSubmitted(false);
                  setIdeaTitle("");
                  setIdeaBody("");
                }}
                className="mt-4 text-xs font-bold uppercase tracking-wider text-brand underline underline-offset-4"
              >
                Submit another proposal
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
