import Link from "next/link";
import { WifiOff, RefreshCw, BookOpen, Home } from "lucide-react";

export default function OfflineFallbackPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-bg px-4 py-16 text-ink">
      <div className="max-w-md w-full rounded-3xl border border-line bg-surface p-8 shadow-xl text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
          <WifiOff size={32} />
        </div>

        <span className="mt-6 inline-block rounded-full bg-brand/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-brand dark:text-brand-light">
          Offline Mode
        </span>

        <h1 className="mt-3 font-serif text-2xl font-bold text-ink sm:text-3xl">
          You are currently offline
        </h1>

        <p className="mt-3 text-xs sm:text-sm text-muted leading-relaxed">
          It looks like your internet connection dropped. Any Budget Hub modules you previously visited remain fully cached and readable offline.
        </p>

        <div className="mt-6 space-y-3">
          <Link
            href="/budget-hub"
            className="flex items-center justify-center gap-2 w-full rounded-full bg-brand py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-brand/20 hover:bg-brand-light transition"
          >
            <BookOpen size={16} />
            <span>Read Cached Budget Hub</span>
          </Link>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full rounded-full border border-line bg-bg py-3 text-xs font-bold uppercase tracking-wider text-ink hover:border-brand/40 transition"
          >
            <Home size={16} />
            <span>Go to Home</span>
          </Link>
        </div>

        <div className="mt-6 pt-4 border-t border-line text-[11px] text-muted">
          National Youth Budget Forum &bull; 47 Counties, 1 Voice
        </div>
      </div>
    </main>
  );
}
