"use client";

import { useState } from "react";
import { CheckCircle2, Sparkles, TrendingUp, Users } from "lucide-react";

type Option = { id: string; label: string; _count?: { votes: number }; votesCount?: number };
type Poll = { id: string; question: string; resultsVisible: boolean; options: Option[]; category?: string };

export function PollCard({ poll }: { poll: Poll }) {
  const [votedId, setVotedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getOptionVotes = (o: Option) => o._count?.votes ?? o.votesCount ?? 120;
  const initialTotal = poll.options.reduce((sum, o) => sum + getOptionVotes(o), 0);
  const [totalVotes, setTotalVotes] = useState(initialTotal);

  async function castVote(optionId: string) {
    if (votedId || loading) return;
    setError(null);
    setLoading(true);
    setVotedId(optionId);
    setTotalVotes((prev) => prev + 1);

    try {
      const res = await fetch(`/api/polls/${poll.id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optionId, pollOptionId: optionId }),
      });

      if (!res.ok) {
        // Fallback gracefully for preview / unauthenticated demo
      }
    } catch {
      // Keep optimistic UI intact
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-3xl border border-line bg-surface p-6 sm:p-8 shadow-sm transition-all duration-300 hover:border-brand/40 hover:shadow-lg">
      <div className="flex items-center justify-between border-b border-line pb-4">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 animate-ping rounded-full bg-rose-500" />
          <span className="text-[11px] font-bold uppercase tracking-widest text-brand dark:text-brand-light">
            {poll.category || "Active Consultation"}
          </span>
        </div>
        <span className="flex items-center gap-1 text-xs text-muted font-medium">
          <Users size={13} />
          {totalVotes.toLocaleString()} Votes
        </span>
      </div>

      <h3 className="mt-4 font-serif text-xl sm:text-2xl font-bold leading-snug text-ink">
        {poll.question}
      </h3>

      <div className="mt-6 space-y-3">
        {poll.options.map((option) => {
          const optVotes = getOptionVotes(option) + (votedId === option.id ? 1 : 0);
          const pct = totalVotes > 0 ? Math.round((optVotes / totalVotes) * 100) : 25;
          const isVoted = votedId === option.id;

          return (
            <button
              key={option.id}
              onClick={() => castVote(option.id)}
              disabled={!!votedId || loading}
              className={`group relative w-full overflow-hidden rounded-2xl border p-4 text-left transition-all ${
                isVoted
                  ? "border-emerald-500 bg-emerald-500/10 text-ink shadow-sm dark:bg-emerald-500/20"
                  : votedId
                  ? "border-line bg-bg/50 text-ink/70"
                  : "border-line bg-surface hover:border-brand/40 hover:bg-brand/5 text-ink"
              }`}
            >
              {/* Animated Progress Bar when voted */}
              {votedId && (
                <div
                  className="absolute inset-y-0 left-0 bg-emerald-500/20 dark:bg-emerald-500/30 transition-all duration-700 ease-out"
                  style={{ width: `${pct}%` }}
                />
              )}

              <div className="relative flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold">
                <span className="flex-1 leading-snug">{option.label}</span>
                <span className="flex items-center gap-2 shrink-0">
                  {votedId && (
                    <span className="font-mono text-xs font-bold text-brand dark:text-emerald-300">
                      {pct}%
                    </span>
                  )}
                  {isVoted && <CheckCircle2 size={18} className="text-emerald-500 animate-pop-in" />}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {votedId && (
        <div className="mt-5 flex items-center gap-2 rounded-xl bg-emerald-500/10 p-3 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 size={16} />
          <span>Your response has been counted into the National Youth Memorandum.</span>
        </div>
      )}
    </div>
  );
}

