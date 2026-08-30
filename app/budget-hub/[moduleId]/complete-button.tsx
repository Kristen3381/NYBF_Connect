"use client";

import { useState } from "react";
import { CheckCircle2, Sparkles, Loader2 } from "lucide-react";

export function ModuleCompleteButton({ moduleId }: { moduleId: string }) {
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleComplete = async () => {
    setLoading(true);
    try {
      await fetch(`/api/budget-hub/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moduleId, completed: !completed }),
      });
    } catch {
      // Keep UX responsive in client/preview mode
    } finally {
      setLoading(false);
      setCompleted(!completed);
    }
  };

  return (
    <button
      onClick={toggleComplete}
      disabled={loading}
      className={`flex items-center gap-2 rounded-full px-6 py-3 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
        completed
          ? "bg-emerald-500/20 text-emerald-600 border border-emerald-500/40 dark:text-emerald-300"
          : "bg-brand text-white shadow-md shadow-brand/20 hover:bg-brand-light hover:shadow-lg active:scale-95"
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
  );
}
