"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Nav } from "@/components/nav";
import {
  Users,
  Calendar,
  Briefcase,
  TrendingUp,
  Lightbulb,
  BarChart3,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Plus,
  Search,
  Filter,
  Eye,
  Trash2,
  Sparkles,
  Download,
  Lock,
  Mail,
  KeyRound,
  LogOut,
  Loader2,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { FooterColumn } from "@/components/ui-blocks";

type AdminTab = "analytics" | "members" | "events" | "opportunities" | "polls" | "ideas";
type AdminAuthMode = "signin" | "signup";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState<AdminAuthMode>("signin");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Admin Registration state
  const [signUpForm, setSignUpForm] = useState({
    name: "",
    email: "",
    department: "National Secretariat",
    county: "Nairobi",
    accessKey: "",
  });

  const [tab, setTab] = useState<AdminTab>("analytics");
  const [searchTerm, setSearchTerm] = useState("");

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);

    setTimeout(() => {
      if (loginPassword.length >= 4 || loginEmail.includes("nybf.ke")) {
        setIsAuthenticated(true);
        setLoginLoading(false);
      } else {
        setLoginError("Invalid administrator credentials. Please check your passcode.");
        setLoginLoading(false);
      }
    }, 600);
  }

  function handleAdminSignUp(e: React.FormEvent) {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);

    setTimeout(() => {
      if (signUpForm.accessKey.length >= 4) {
        setIsAuthenticated(true);
        setLoginLoading(false);
      } else {
        setLoginError("Secretariat Access Key must be at least 4 characters.");
        setLoginLoading(false);
      }
    }, 600);
  }

  function handleQuickDemoAuth() {
    setLoginLoading(true);
    setTimeout(() => {
      setIsAuthenticated(true);
      setLoginLoading(false);
    }, 400);
  }

  function handleLogout() {
    setIsAuthenticated(false);
    setLoginPassword("");
  }

  // --- UN-AUTHENTICATED SIGN IN / SIGN UP VIEW ---
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen text-ink selection:bg-brand/20 selection:text-brand">
        <Nav />

        <section className="relative min-h-[calc(100vh-80px)] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-brand-dark overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/pictures/roundtable-overhead.jpeg"
              alt="NYBF Secretariat"
              fill
              sizes="100vw"
              className="object-cover opacity-70 object-center"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/95 via-brand-dark/80 to-brand-dark/60" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/95 via-transparent to-brand-dark/50" />
          </div>

          <div className="relative z-10 w-full max-w-md">
            <div className="rounded-3xl border border-white/20 bg-surface/95 dark:bg-surface/90 p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-white shadow-lg shadow-brand/30">
                  <Lock size={24} />
                </div>
                <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-brand dark:bg-brand/20 dark:text-brand-light">
                  <ShieldCheck size={13} />
                  <span>Secretariat Portal</span>
                </div>
                <h1 className="mt-2 font-serif text-2xl font-bold text-ink">
                  NYBF Admin Access
                </h1>
                <p className="mt-1.5 text-xs text-muted">
                  Sign in or register as authorized Secretariat or County Coordinator staff.
                </p>

                {/* Auth Mode Toggle Pills */}
                <div className="mt-6 flex rounded-full border border-line bg-bg p-1">
                  <button
                    type="button"
                    onClick={() => { setAuthMode("signin"); setLoginError(null); }}
                    className={`flex-1 flex items-center justify-center gap-1.5 rounded-full py-2 text-xs font-bold uppercase tracking-wider transition ${
                      authMode === "signin"
                        ? "bg-brand text-white shadow-sm"
                        : "text-ink/70 hover:text-brand"
                    }`}
                  >
                    <Lock size={13} />
                    <span>Admin Sign In</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setAuthMode("signup"); setLoginError(null); }}
                    className={`flex-1 flex items-center justify-center gap-1.5 rounded-full py-2 text-xs font-bold uppercase tracking-wider transition ${
                      authMode === "signup"
                        ? "bg-brand text-white shadow-sm"
                        : "text-ink/70 hover:text-brand"
                    }`}
                  >
                    <Users size={13} />
                    <span>Staff Sign Up</span>
                  </button>
                </div>
              </div>

              {authMode === "signin" ? (
                /* ADMIN SIGN IN FORM */
                <form onSubmit={handleLogin} className="mt-6 space-y-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-ink/80">
                      Administrator Email
                    </label>
                    <div className="relative mt-1">
                      <input
                        type="email"
                        required
                        placeholder="secretariat@nybf.ke"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="w-full rounded-2xl border border-line bg-bg p-3.5 pl-10 text-xs sm:text-sm text-ink placeholder:text-muted/60 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                      />
                      <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-ink/80">
                      Security Passcode
                    </label>
                    <div className="relative mt-1">
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full rounded-2xl border border-line bg-bg p-3.5 pl-10 text-xs sm:text-sm text-ink placeholder:text-muted/60 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                      />
                      <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                    </div>
                  </div>

                  {loginError && (
                    <div className="flex items-center gap-2 rounded-xl bg-rose-500/10 p-3 text-xs font-semibold text-rose-600 dark:text-rose-400">
                      <AlertTriangle size={15} className="shrink-0" />
                      <span>{loginError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loginLoading}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-brand py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-brand/25 transition-all hover:bg-brand-light active:scale-95 disabled:opacity-50"
                  >
                    {loginLoading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Authenticating…</span>
                      </>
                    ) : (
                      <>
                        <Lock size={14} />
                        <span>Sign In to Admin Portal</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* ADMIN / STAFF SIGN UP FORM */
                <form onSubmit={handleAdminSignUp} className="mt-6 space-y-3.5">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-ink/80">
                      Staff Full Name
                    </label>
                    <input
                      required
                      placeholder="e.g. Brian Ochieng"
                      value={signUpForm.name}
                      onChange={(e) => setSignUpForm({ ...signUpForm, name: e.target.value })}
                      className="mt-1 w-full rounded-2xl border border-line bg-bg p-3.5 text-xs sm:text-sm text-ink placeholder:text-muted/60 outline-none transition focus:border-brand"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-ink/80">
                      Official Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="brian@nybf.ke"
                      value={signUpForm.email}
                      onChange={(e) => setSignUpForm({ ...signUpForm, email: e.target.value })}
                      className="mt-1 w-full rounded-2xl border border-line bg-bg p-3.5 text-xs sm:text-sm text-ink placeholder:text-muted/60 outline-none transition focus:border-brand"
                    />
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-ink/80">
                        Department
                      </label>
                      <select
                        value={signUpForm.department}
                        onChange={(e) => setSignUpForm({ ...signUpForm, department: e.target.value })}
                        className="mt-1 w-full rounded-2xl border border-line bg-bg p-3 text-xs text-ink outline-none"
                      >
                        <option value="National Secretariat">Secretariat</option>
                        <option value="County Coordinator">County Lead</option>
                        <option value="Policy Research">Policy Desk</option>
                        <option value="Media & Comms">Media Desk</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-ink/80">
                        Access Key
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={signUpForm.accessKey}
                        onChange={(e) => setSignUpForm({ ...signUpForm, accessKey: e.target.value })}
                        className="mt-1 w-full rounded-2xl border border-line bg-bg p-3 text-xs text-ink outline-none"
                      />
                    </div>
                  </div>

                  {loginError && (
                    <div className="flex items-center gap-2 rounded-xl bg-rose-500/10 p-3 text-xs font-semibold text-rose-600 dark:text-rose-400">
                      <AlertTriangle size={15} className="shrink-0" />
                      <span>{loginError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loginLoading}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-brand py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-brand/25 transition-all hover:bg-brand-light active:scale-95 disabled:opacity-50"
                  >
                    {loginLoading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Registering Staff…</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck size={14} />
                        <span>Create Staff Profile</span>
                      </>
                    )}
                  </button>
                </form>
              )}

              <div className="mt-6 border-t border-line pt-4 text-center">
                <button
                  type="button"
                  onClick={handleQuickDemoAuth}
                  className="text-xs font-bold text-brand dark:text-brand-light hover:underline"
                >
                  ⚡ Quick Demo: Unlock Admin Session
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const stats = [
    { label: "Total Registered Youth", value: "254,120", change: "+12.4% this month", icon: Users },
    { label: "47 Counties Active", value: "47 / 47", change: "100% Devolved", icon: ShieldAlert },
    { label: "Consultation Votes Cast", value: "42,890", change: "3 Active Polls", icon: TrendingUp },
    { label: "Policy Proposals Submitted", value: "1,480", change: "186 Vetted for Parliament", icon: Lightbulb },
  ];

  const members = [
    { id: "mem-1", name: "Wangari Ochieng", county: "Nairobi", role: "Researcher", joined: "29 Aug 2026", status: "Active" },
    { id: "mem-2", name: "Ahmed Kiptoo", county: "Uasin Gishu", role: "Youth Leader", joined: "27 Aug 2026", status: "Active" },
    { id: "mem-3", name: "Fatuma Ali", county: "Mombasa", role: "Entrepreneur", joined: "24 Aug 2026", status: "Active" },
    { id: "mem-4", name: "John Mutua", county: "Machakos", role: "Student", joined: "20 Aug 2026", status: "Active" },
    { id: "mem-5", name: "Mercy Chepngetich", county: "Bomet", role: "Organizer", joined: "18 Aug 2026", status: "Active" },
  ];

  const events = [
    { id: "evt-1", title: "National Youth Budget Town Hall 2026", location: "Nairobi", date: "12 Sept 2026", registered: 455, capacity: 500 },
    { id: "evt-2", title: "Youth Economic & Public Debt Dialogue", location: "Machakos", date: "26 Sept 2026", registered: 80, capacity: 100 },
    { id: "evt-3", title: "County Youth Budget Forum", location: "Kajiado", date: "03 Oct 2026", registered: 65, capacity: 100 },
  ];

  const opportunities = [
    { id: "opp-1", title: "Youth Policy Research Fellowship", type: "FELLOWSHIP", deadline: "15 Oct 2026", applications: 142, status: "Live" },
    { id: "opp-2", title: "County Agri-Enterprise Grant", type: "GRANT", deadline: "30 Oct 2026", applications: 310, status: "Live" },
    { id: "opp-3", title: "Digital Economy Policy Internship", type: "INTERNSHIP", deadline: "10 Oct 2026", applications: 98, status: "Live" },
  ];

  const polls = [
    { id: "poll-1", question: "Which fiscal priority should receive highest increase in FY 2026/27?", votes: 14180, active: true },
    { id: "poll-2", question: "How should Government fund university and TVET education?", votes: 12170, active: true },
    { id: "poll-3", question: "What is your biggest concern regarding County Government allocation?", votes: 11220, active: true },
  ];

  const ideas = [
    { id: "idea-1", title: "Mandatory 5-year tax holiday for youth climate tech startups", author: "Amani Mwangi", category: "Taxation", status: "Approved for Memorandum" },
    { id: "idea-2", title: "100% state scholarship funding for orphaned & vulnerable TVET trainees", author: "Faith Chebet", category: "Education", status: "Under Review" },
    { id: "idea-3", title: "Real-time SMS tracking for county bursary disbursements", author: "Kelvin Mwangi", category: "Devolution", status: "Under Review" },
    { id: "idea-4", title: "Dedicated 5% youth digital freelancing procurement quota in parastatals", author: "Brian Ochieng", category: "AGPO", status: "Approved for Memorandum" },
  ];

  return (
    <main className="min-h-screen text-ink selection:bg-brand/20 selection:text-brand">
      <Nav />

      {/* ADMIN HEADER */}
      <section className="border-b border-line bg-brand-dark py-12 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-emerald-300">
                <ShieldAlert size={14} />
                Administrative Command Center
              </div>
              <h1 className="mt-2 font-serif text-3xl font-extrabold sm:text-4xl text-white">
                NYBF Management Portal
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20">
                Admin Session Active
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-rose-500 hover:border-rose-500 transition-all"
              >
                <LogOut size={13} />
                <span>Lock Portal</span>
              </button>
            </div>
          </div>

          {/* Admin Navigation Tabs */}
          <div className="mt-8 flex flex-wrap gap-2 border-t border-white/10 pt-4">
            {[
              { id: "analytics", label: "Analytics", icon: BarChart3 },
              { id: "members", label: "Members (254K)", icon: Users },
              { id: "events", label: "Events & Hearings", icon: Calendar },
              { id: "opportunities", label: "Opportunities", icon: Briefcase },
              { id: "polls", label: "Consultation Polls", icon: TrendingUp },
              { id: "ideas", label: "Policy Proposals", icon: Lightbulb },
            ].map((item) => {
              const Icon = item.icon;
              const isCurrent = tab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setTab(item.id as AdminTab)}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                    isCurrent
                      ? "bg-white text-brand-dark shadow-md"
                      : "glass-panel-photo text-white/80 hover:bg-white/20 hover:text-white"
                  }`}
                >
                  <Icon size={14} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* TAB CONTENT */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        {/* 1. ANALYTICS */}
        {tab === "analytics" && (
          <div className="space-y-8 animate-fade-in-up">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((st) => {
                const Icon = st.icon;
                return (
                  <div key={st.label} className="rounded-3xl border border-line bg-surface p-6 shadow-sm">
                    <div className="flex items-center justify-between text-muted">
                      <span className="text-xs font-bold uppercase tracking-wider">{st.label}</span>
                      <Icon size={18} className="text-brand dark:text-brand-light" />
                    </div>
                    <div className="mt-3 font-serif text-3xl font-black text-ink">{st.value}</div>
                    <div className="mt-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">{st.change}</div>
                  </div>
                );
              })}
            </div>

            {/* Devolution 47 Counties Distribution Matrix */}
            <div className="rounded-3xl border border-line bg-surface p-6 sm:p-8 shadow-sm">
              <h3 className="font-serif text-xl font-bold text-ink">Devolved County Engagement Summary</h3>
              <p className="mt-1 text-xs text-muted">Real-time breakdown of youth member representation and active budget desks across Kenyan regions.</p>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-line bg-bg p-4">
                  <div className="text-xs font-bold text-muted uppercase">Nairobi & Central Region</div>
                  <div className="mt-1 font-serif text-2xl font-bold text-brand">104,200 Members</div>
                  <div className="text-[11px] text-muted">10 County Chapters Active</div>
                </div>
                <div className="rounded-2xl border border-line bg-bg p-4">
                  <div className="text-xs font-bold text-muted uppercase">Rift Valley & Western</div>
                  <div className="mt-1 font-serif text-2xl font-bold text-brand">88,450 Members</div>
                  <div className="text-[11px] text-muted">18 County Chapters Active</div>
                </div>
                <div className="rounded-2xl border border-line bg-bg p-4">
                  <div className="text-xs font-bold text-muted uppercase">Coast, Eastern & North Eastern</div>
                  <div className="mt-1 font-serif text-2xl font-bold text-brand">61,470 Members</div>
                  <div className="text-[11px] text-muted">19 County Chapters Active</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. MEMBERS */}
        {tab === "members" && (
          <div className="rounded-3xl border border-line bg-surface p-6 sm:p-8 shadow-sm animate-fade-in-up">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
              <h3 className="font-serif text-xl font-bold text-ink">Registered Youth Members</h3>
              <span className="text-xs font-bold text-muted">Showing latest 5 of 254,120</span>
            </div>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-line text-muted">
                    <th className="pb-3 font-bold uppercase">Name</th>
                    <th className="pb-3 font-bold uppercase">County</th>
                    <th className="pb-3 font-bold uppercase">Role</th>
                    <th className="pb-3 font-bold uppercase">Joined Date</th>
                    <th className="pb-3 font-bold uppercase text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {members.map((m) => (
                    <tr key={m.id} className="hover:bg-bg/50">
                      <td className="py-3.5 font-semibold text-ink">{m.name}</td>
                      <td className="py-3.5 text-muted">{m.county}</td>
                      <td className="py-3.5 text-muted">{m.role}</td>
                      <td className="py-3.5 text-muted">{m.joined}</td>
                      <td className="py-3.5 text-right">
                        <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          {m.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. EVENTS */}
        {tab === "events" && (
          <div className="rounded-3xl border border-line bg-surface p-6 sm:p-8 shadow-sm animate-fade-in-up">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
              <h3 className="font-serif text-xl font-bold text-ink">Public Townhalls & Consultations</h3>
              <button className="flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-xs font-bold uppercase text-white hover:bg-brand-light">
                <Plus size={14} />
                <span>Add New Event</span>
              </button>
            </div>

            <div className="mt-6 space-y-4">
              {events.map((evt) => (
                <div key={evt.id} className="p-4 rounded-2xl border border-line bg-bg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="font-serif text-base font-bold text-ink">{evt.title}</div>
                    <div className="text-xs text-muted">{evt.location} • {evt.date}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-brand">
                      {evt.registered} / {evt.capacity} Seats Filled
                    </span>
                    <button className="text-xs font-bold text-muted hover:text-brand">Edit</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. OPPORTUNITIES */}
        {tab === "opportunities" && (
          <div className="rounded-3xl border border-line bg-surface p-6 sm:p-8 shadow-sm animate-fade-in-up">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
              <h3 className="font-serif text-xl font-bold text-ink">Economic Opportunities & Grants</h3>
              <button className="flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-xs font-bold uppercase text-white hover:bg-brand-light">
                <Plus size={14} />
                <span>Post Opportunity</span>
              </button>
            </div>

            <div className="mt-6 space-y-4">
              {opportunities.map((opp) => (
                <div key={opp.id} className="p-4 rounded-2xl border border-line bg-bg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="font-serif text-base font-bold text-ink">{opp.title}</div>
                    <div className="text-xs text-muted">Type: {opp.type} • Deadline: {opp.deadline}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-muted">{opp.applications} Applications</span>
                    <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      {opp.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. POLLS */}
        {tab === "polls" && (
          <div className="rounded-3xl border border-line bg-surface p-6 sm:p-8 shadow-sm animate-fade-in-up">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
              <h3 className="font-serif text-xl font-bold text-ink">National Youth Pulse Consultations</h3>
              <button className="flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-xs font-bold uppercase text-white hover:bg-brand-light">
                <Plus size={14} />
                <span>Create New Poll</span>
              </button>
            </div>

            <div className="mt-6 space-y-4">
              {polls.map((p) => (
                <div key={p.id} className="p-4 rounded-2xl border border-line bg-bg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="font-serif text-base font-bold text-ink">{p.question}</div>
                    <div className="text-xs text-muted">{p.votes.toLocaleString()} Citizen Votes Recorded</div>
                  </div>
                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    Live Active
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. IDEAS */}
        {tab === "ideas" && (
          <div className="rounded-3xl border border-line bg-surface p-6 sm:p-8 shadow-sm animate-fade-in-up">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-ink">Citizen Policy Proposals</h3>
                <p className="text-xs text-muted">Review proposals submitted by young Kenyans for inclusion in the Parliamentary Memorandum.</p>
              </div>
              <button className="flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-xs font-bold uppercase text-white hover:bg-brand-light">
                <Download size={14} />
                <span>Export Memorandum (PDF)</span>
              </button>
            </div>

            <div className="mt-6 divide-y divide-line">
              {ideas.map((idea) => (
                <div key={idea.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="font-serif text-base font-bold text-ink">{idea.title}</div>
                    <div className="text-xs text-muted">Author: {idea.author} • Category: {idea.category}</div>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                    idea.status.includes("Approved")
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                      : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                  }`}>
                    {idea.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer className="bg-brand-dark text-white border-t border-white/10 mt-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-4 lg:px-8">
          <div>
            <div className="font-serif text-2xl font-bold tracking-tight text-white">
              NYBF <span className="text-xs uppercase font-sans tracking-widest text-brand-gold">Admin</span>
            </div>
            <p className="mt-3 text-xs text-white/70">
              Administrative cockpit for National Youth Budget Forum.
            </p>
          </div>
          <FooterColumn
            title="Admin Modules"
            links={[
              { label: "Analytics", href: "/admin" },
              { label: "Members Registry", href: "/admin" },
              { label: "Events Manager", href: "/admin" },
              { label: "Policy Ideas Desk", href: "/admin" },
            ]}
          />
          <FooterColumn
            title="Public Platform"
            links={[
              { label: "Home", href: "/" },
              { label: "Budget Hub", href: "/budget-hub" },
              { label: "Youth Voice", href: "/youth-voice" },
            ]}
          />
          <FooterColumn
            title="Governance"
            links={[
              { label: "About NYBF", href: "/about" },
              { label: "Member Portal", href: "/my-nybf" },
            ]}
          />
        </div>
        <div className="border-t border-white/10 py-6 text-center text-xs text-white/50">
          © 2026 National Youth Budget Forum. System Administrator Access.
        </div>
      </footer>
    </main>
  );
}
