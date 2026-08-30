"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { ArrowRight, Menu, X, Sparkles, Shield, Compass, MessageSquare, Briefcase, Calendar, Radio, User, Users, ShieldAlert } from "lucide-react";

const links = [
  { href: "/about", label: "About", icon: Shield },
  { href: "/leadership", label: "Leadership", icon: Users },
  { href: "/budget-hub", label: "Budget Hub", icon: Compass },
  { href: "/youth-voice", label: "Youth Voice", icon: MessageSquare },
  { href: "/opportunities", label: "Opportunities", icon: Briefcase },
  { href: "/events", label: "Events", icon: Calendar },
  { href: "/media", label: "Media", icon: Radio },
  { href: "/admin", label: "Admin", icon: ShieldAlert },
];

export function Nav() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full px-3 py-3 sm:px-6 lg:px-8">
        <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-line bg-glass px-4 py-2.5 shadow-sm backdrop-blur-xl transition-all sm:px-6">
          {/* Brand Text */}
          <Link href="/" className="group flex flex-col">
            <span className="font-serif text-lg font-bold leading-none tracking-tight text-ink group-hover:text-brand">
              NYBF <span className="font-sans text-xs font-black uppercase tracking-widest text-brand-gold">Connect</span>
            </span>
            <span className="text-[10px] font-medium tracking-wider text-muted">NATIONAL YOUTH BUDGET FORUM</span>
          </Link>

          {/* Desktop Navigation Links — Spaced & Spread Out */}
          <div className="hidden items-center gap-2 lg:gap-4 md:flex">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative rounded-full px-4 py-2 text-xs lg:text-sm font-semibold tracking-wide transition-all ${
                    isActive
                      ? "bg-brand text-white shadow-sm font-bold"
                      : "text-ink/80 hover:bg-brand/10 hover:text-brand"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right Action Group */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            <Link
              href="/my-nybf"
              className="group hidden items-center gap-1.5 rounded-full bg-brand px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-brand/20 transition-all hover:-translate-y-0.5 hover:bg-brand-light hover:shadow-lg hover:shadow-brand/30 active:translate-y-0 sm:flex"
            >
              <User size={14} />
              <span>My NYBF</span>
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-surface text-ink transition md:hidden"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-md md:hidden">
          <div className="absolute inset-x-4 top-20 animate-pop-in rounded-3xl border border-line bg-surface p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                <span className="text-xs font-bold uppercase tracking-widest text-brand">47 Counties • 1 Voice</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-full p-1.5 text-muted hover:bg-brand/10 hover:text-ink"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 flex flex-col gap-2">
              {links.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                      isActive
                        ? "bg-brand text-white"
                        : "text-ink hover:bg-brand/10 hover:text-brand"
                    }`}
                  >
                    <Icon size={18} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>

            <div className="mt-6 border-t border-line pt-4">
              <Link
                href="/my-nybf"
                onClick={() => setMobileMenuOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand py-3.5 text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-brand/25"
              >
                <User size={16} />
                <span>My NYBF (Sign In / Join)</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
