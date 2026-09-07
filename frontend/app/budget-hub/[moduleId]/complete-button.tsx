"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";

export function ModuleCompleteButton({
  moduleId,
  initialCompleted = false,
}: {
  moduleId: string;
  initialCompleted?: boolean;
}) {
  const [completed, setCompleted] = useState(initialCompleted);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleComplete = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);

    const nextCompleted = !completed;

    try {
      const res = await fetch(`/api/budget-hub/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moduleId, completed: nextCompleted }),
      });

      if (res.status === 401) {
        setError("Please sign in at My NYBF to save your module completion progress.");
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Failed to update module progress. Please try again.");
        return;
      }

      setCompleted(nextCompleted);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
      <button
        onClick={toggleComplete}
        disabled={loading}
        className={`flex items-center gap-2 rounded-full px-6 py-3 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
          completed
            ? "bg-emerald-500/20 text-emerald-600 border border-emerald-500/40 dark:text-emerald-300"
            : "bg-brand text-white shadow-md shadow-brand/20 hover:bg-brand-light hover:shadow-lg active:scale-95 disabled:opacity-50"
        }`}
      >
        {loading ? (
          <>
            <Loader2 size={15} className="animate-spin" />
            <span>Saving…</span>
          </>
        ) : completed ? (
          <>
            <CheckCircle2 size={16} className="text-emerald-500" />
            <span>Module Completed ✓</span>
          </>
        ) : (
          <>
            <CheckCircle2 size={16} />
            <span>Mark as Complete</span>
          </>
        )}
      </button>

      {error && (
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20">
          <AlertCircle size={14} className="shrink-0" />
          <span>{error}</span>
          {error.includes("sign in") && (
            <Link href="/my-nybf" className="underline font-bold text-brand dark:text-brand-light">
              Sign in &rarr;
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
