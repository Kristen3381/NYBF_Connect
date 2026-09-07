"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, RotateCcw, Trash2, Users, Loader2 } from "lucide-react";

type Option = { id: string; label: string; votesCount?: number };
type Poll = { id: string; question: string; resultsVisible: boolean; options: Option[]; category?: string };

export function PollCard({ poll }: { poll: Poll }) {
  const [votedId, setVotedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Map option vote counts into reactive state
  const [optionCounts, setOptionCounts] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    poll.options.forEach((o) => {
      initial[o.id] = o.votesCount ?? 0;
    });
    return initial;
  });

  const totalVotes = Object.values(optionCounts).reduce((sum, v) => sum + v, 0);

  // Check if current authenticated user has already voted on this poll
  useEffect(() => {
    let isMounted = true;
    fetch(`/api/polls/${poll.id}/vote`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data?.hasVoted && data.optionId) {
          setVotedId(data.optionId);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [poll.id]);

  async function castOrChangeVote(optionId: string) {
    if (loading || actionLoading) return;
    if (votedId === optionId) return; // already voted for this

    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const res = await fetch(`/api/polls/${poll.id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optionId }),
      });

      if (res.status === 401) {
        setError("Please sign in to cast or change your vote.");
        return;
      }

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || "Failed to record vote.");
        return;
      }

      if (data.changed && data.previousOptionId) {
        // Updated existing vote: decrement previous, increment new
        setOptionCounts((prev) => ({
          ...prev,
          [data.previousOptionId]: Math.max(0, (prev[data.previousOptionId] || 1) - 1),
          [optionId]: (prev[optionId] || 0) + 1,
        }));
        setSuccessMsg("Your vote was updated successfully.");
      } else {
        // New vote
        setOptionCounts((prev) => ({
          ...prev,
          [optionId]: (prev[optionId] || 0) + 1,
        }));
        setSuccessMsg("Your response has been counted into the National Youth Memorandum.");
      }

      setVotedId(optionId);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function withdrawVote() {
    if (!votedId || actionLoading) return;
    setError(null);
    setSuccessMsg(null);
    setActionLoading(true);

    try {
      const res = await fetch(`/api/polls/${poll.id}/vote`, {
        method: "DELETE",
      });

      if (res.status === 401) {
        setError("Please sign in to manage your vote.");
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Failed to withdraw vote.");
        return;
      }

      const withdrawnId = votedId;
      setOptionCounts((prev) => ({
        ...prev,
        [withdrawnId]: Math.max(0, (prev[withdrawnId] || 1) - 1),
      }));

      setVotedId(null);
      setSuccessMsg("Your vote has been withdrawn. You can now vote again.");
    } catch {
      setError("Network error withdrawing vote.");
    } finally {
      setActionLoading(false);
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

      {error && (
        <div className="mt-3 rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center justify-between gap-2">
          <span>{error}</span>
          {error.includes("sign in") && (
            <a href="/my-nybf" className="font-bold underline text-brand dark:text-brand-light shrink-0">
              Sign In &rarr;
            </a>
          )}
        </div>
      )}

      {successMsg && (
        <div className="mt-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
          <CheckCircle2 size={15} />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="mt-6 space-y-3">
        {poll.options.map((option) => {
          const optVotes = optionCounts[option.id] || 0;
          const pct = totalVotes > 0 ? Math.round((optVotes / totalVotes) * 100) : 0;
          const isVoted = votedId === option.id;

          return (
            <button
              key={option.id}
              onClick={() => castOrChangeVote(option.id)}
              disabled={loading || actionLoading}
              className={`group relative w-full overflow-hidden rounded-2xl border p-4 text-left transition-all ${
                isVoted
                  ? "border-emerald-500 bg-emerald-500/10 text-ink shadow-sm dark:bg-emerald-500/20"
                  : votedId
                  ? "border-line bg-surface hover:border-brand/40 hover:bg-brand/5 text-ink/80"
                  : "border-line bg-surface hover:border-brand/40 hover:bg-brand/5 text-ink"
              }`}
            >
              {/* Progress Fill */}
              {totalVotes > 0 && (
                <div
                  className={`absolute inset-y-0 left-0 transition-all duration-700 ease-out ${
                    isVoted ? "bg-emerald-500/20 dark:bg-emerald-500/30" : "bg-brand/5 dark:bg-brand/10"
                  }`}
                  style={{ width: `${pct}%` }}
                />
              )}

              <div className="relative flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold">
                <span className="flex-1 leading-snug">{option.label}</span>
                <span className="flex items-center gap-2 shrink-0">
                  <span className="font-mono text-xs font-bold text-brand dark:text-emerald-300">
                    {pct}% ({optVotes})
                  </span>
                  {isVoted && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500 text-white px-2 py-0.5 text-[10px] font-bold">
                      <CheckCircle2 size={12} />
                      <span>Your Vote</span>
                    </span>
                  )}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {votedId && (
        <div className="mt-5 flex items-center justify-between gap-3 pt-3 border-t border-line text-xs">
          <span className="text-muted">
            Click another option to <strong>change</strong> your vote.
          </span>
          <button
            type="button"
            onClick={withdrawVote}
            disabled={actionLoading}
            className="inline-flex items-center gap-1 font-bold text-rose-600 hover:text-rose-700 transition dark:text-rose-400"
          >
            {actionLoading ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                <span>Withdrawing...</span>
              </>
            ) : (
              <>
                <Trash2 size={13} />
                <span>Withdraw Vote</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
