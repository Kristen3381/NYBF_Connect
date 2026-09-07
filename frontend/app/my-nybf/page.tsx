"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { Nav } from "@/components/nav";
import {
  User,
  MapPin,
  Activity,
  Award,
  CheckCircle2,
  Clock,
  Download,
  Share2,
  Calendar,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Briefcase,
  FileText,
  TrendingUp,
  AlertCircle,
  BookOpen,
  Lock,
  Mail,
  Phone,
  KeyRound,
  LogOut,
  Loader2,
  ArrowRight,
  UserPlus,
  LogIn,
} from "lucide-react";
import { FooterColumn } from "@/components/ui-blocks";
import { ALL_COUNTY_NAMES, getConstituenciesForCounty, getGovernorForCounty, getCidpForCounty, getCountyInfo } from "@/lib/kenya-data";

const kenyaCounties = ALL_COUNTY_NAMES;

const roles = [
  "Young Professional / Citizen",
  "University / College Student",
  "Youth Entrepreneur / MSME Owner",
  "Grassroots Community Organizer",
  "Economic / Policy Researcher",
];

type TabType = "profile" | "county" | "activity" | "certificates";
type AuthMode = "signin" | "signup";

const defaultActivities = [
  {
    id: "act-1",
    type: "VOTE",
    title: "Voted in National Youth Pulse",
    detail: "Prioritized Higher Education Loan Board (HELB) funding",
    date: "2 hours ago",
    status: "Counted",
  },
  {
    id: "act-2",
    type: "MODULE",
    title: "Completed Learning Module 01",
    detail: "Understanding Kenya's National Budget Architecture",
    date: "Yesterday",
    status: "Certified",
  },
  {
    id: "act-3",
    type: "IDEA",
    title: "Submitted Policy Pitch",
    detail: "5-Year Tax Holiday for Youth-led Climate Tech Startups",
    date: "3 days ago",
    status: "Under Review by Research Desk",
  },
  {
    id: "act-4",
    type: "EVENT",
    title: "Registered for Event",
    detail: "National Youth Budget Town Hall 2026 (KICC Nairobi)",
    date: "1 week ago",
    status: "Confirmed Attending",
  },
];

const defaultCertificates = [
  {
    id: "cert-01",
    title: "Certificate of Civic Finance Literacy: Level 1",
    issuer: "National Youth Budget Forum & Parliamentary Initiative",
    date: "August 2026",
    credId: "NYBF-KE-2026-8942",
    modulesCompleted: "Understanding Kenya's Budget & The National Budget Cycle",
  },
  {
    id: "cert-02",
    title: "Certificate of Public Participation Advocacy",
    issuer: "National Youth Budget Forum — Devolution Directorate",
    date: "July 2026",
    credId: "NYBF-KE-2026-4190",
    modulesCompleted: "County Budget Tracking & AGPO Youth Procurement",
  },
];

export default function MyNybfPage() {
  const { data: session, status: sessionStatus } = useSession();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("signin");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Sign In Form State
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");

  // Sign Up Form State
  const [signUpForm, setSignUpForm] = useState({
    name: "",
    email: "",
    phone: "",
    county: "Nairobi",
    constituency: "Westlands",
    role: roles[0],
    password: "",
  });

  // Dynamic user profile state
  const [user, setUser] = useState({
    name: "Amani Mwangi",
    email: "amani.mwangi@nybf.ke",
    phone: "+254 712 345 678",
    county: "Nairobi",
    constituency: "Westlands",
    role: "Youth Entrepreneur & Policy Advocate",
    joinedDate: "August 2026",
    verified: true,
  });

  const [stats, setStats] = useState({
    votesCount: 4,
    modulesCompletedCount: 2,
    ideasCount: 1,
    eventsCount: 1,
  });

  const [activitiesList, setActivitiesList] = useState<any[]>(defaultActivities);
  const [certList, setCertList] = useState<any[]>(defaultCertificates);
  const [activeTab, setActiveTab] = useState<TabType>("profile");

  async function loadUserData() {
    try {
      const res = await fetch("/api/me");
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setUser({
            name: data.user.name || "Amani Mwangi",
            email: data.user.email || "amani.mwangi@nybf.ke",
            phone: data.user.phone || "+254 712 345 678",
            county: data.user.county || "Nairobi",
            constituency: data.user.constituency || "Westlands",
            role: data.user.civicRole || "Youth Entrepreneur & Policy Advocate",
            joinedDate: data.user.joinedDate || "August 2026",
            verified: true,
          });
        }
        if (data.stats) {
          setStats(data.stats);
        }

        const generatedActivities: any[] = [];
        if (data.votes && data.votes.length > 0) {
          for (const v of data.votes) {
            generatedActivities.push({
              id: v.id,
              type: "VOTE",
              title: "Voted in National Youth Pulse",
              detail: v.poll?.question ? `Response to: "${v.poll.question}"` : "Consultation Vote Counted",
              date: new Date(v.createdAt).toLocaleDateString("en-GB"),
              status: "Counted",
            });
          }
        }
        if (data.completedModules && data.completedModules.length > 0) {
          for (const m of data.completedModules) {
            generatedActivities.push({
              id: m.id,
              type: "MODULE",
              title: `Completed Learning Module ${String(m.module?.order || 1).padStart(2, "0")}`,
              detail: m.module?.title || "Understanding Kenya's Budget Architecture",
              date: new Date(m.updatedAt || m.createdAt).toLocaleDateString("en-GB"),
              status: "Certified",
            });
          }
        }
        if (data.ideas && data.ideas.length > 0) {
          for (const i of data.ideas) {
            generatedActivities.push({
              id: i.id,
              type: "IDEA",
              title: `Submitted Policy Pitch: ${i.title}`,
              detail: i.content ? (i.content.length > 70 ? i.content.slice(0, 70) + "…" : i.content) : "Policy Proposal Under Review",
              date: new Date(i.createdAt).toLocaleDateString("en-GB"),
              status: i.status === "APPROVED" ? "Approved by Research Desk" : i.status === "REJECTED" ? "Closed" : "Under Review by Research Desk",
            });
          }
        }
        if (data.registrations && data.registrations.length > 0) {
          for (const r of data.registrations) {
            generatedActivities.push({
              id: r.id,
              type: "EVENT",
              title: "Registered for Event",
              detail: r.event ? `${r.event.title} (${r.event.location || "Kenya"})` : "National Youth Budget Town Hall",
              date: new Date(r.createdAt).toLocaleDateString("en-GB"),
              status: "Confirmed Attending",
            });
          }
        }

        if (generatedActivities.length > 0) {
          setActivitiesList(generatedActivities);
        }

        if (data.completedModules && data.completedModules.length > 0) {
          const dynamicCerts = data.completedModules.map((m: any, idx: number) => ({
            id: m.id,
            title: `Certificate of Civic Finance Literacy: Level ${idx + 1}`,
            issuer: "National Youth Budget Forum & Parliamentary Initiative",
            date: new Date(m.updatedAt || m.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" }),
            credId: `NYBF-KE-2026-${m.id.slice(0, 4).toUpperCase()}`,
            modulesCompleted: m.module?.title || "Understanding Kenya's Budget Architecture",
          }));
          setCertList(dynamicCerts);
        }

        setIsAuthenticated(true);
      }
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      loadUserData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionStatus]);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);

    try {
      const res = await signIn("credentials", {
        email: signInEmail,
        password: signInPassword,
        redirect: false,
      });

      if (!res || res.error) {
        setAuthError("Invalid password or email. Please verify your credentials.");
        setAuthLoading(false);
        return;
      }

      await loadUserData();
    } catch {
      setAuthError("Could not connect to authentication service.");
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: signUpForm.name,
          email: signUpForm.email,
          phone: signUpForm.phone,
          county: signUpForm.county,
          constituency: signUpForm.constituency,
          civicRole: signUpForm.role,
          password: signUpForm.password,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setAuthError(data.error || "Failed to create account. Email or phone may already exist.");
        setAuthLoading(false);
        return;
      }

      const loginRes = await signIn("credentials", {
        email: signUpForm.email,
        password: signUpForm.password,
        redirect: false,
      });

      if (loginRes?.ok) {
        await loadUserData();
      } else {
        setIsAuthenticated(true);
      }
    } catch {
      setAuthError("Failed to register. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  }


  async function handleLogout() {
    await signOut({ redirect: false });
    setIsAuthenticated(false);
    setSignInPassword("");
  }

  // --- UN-AUTHENTICATED SIGN IN / SIGN UP GATE ---
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen text-ink selection:bg-brand/20 selection:text-brand">
        <Nav />

        <section className="relative min-h-[calc(100vh-80px)] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-brand-dark overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/pictures/leaders-exterior.jpeg"
              alt="NYBF Member Network"
              fill
              sizes="100vw"
              className="object-cover opacity-75 object-center"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/95 via-brand-dark/80 to-brand-dark/60" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/95 via-transparent to-brand-dark/50" />
          </div>

          <div className="relative z-10 w-full max-w-lg">
            <div className="rounded-3xl border border-white/20 bg-surface/95 dark:bg-surface/90 p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-white shadow-lg shadow-brand/30">
                  <User size={24} />
                </div>
                <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-brand dark:bg-brand/20 dark:text-brand-light">
                  <Sparkles size={13} />
                  <span>Member Portal</span>
                </div>
                <h1 className="mt-2 font-serif text-3xl font-bold text-ink">
                  Welcome to My NYBF
                </h1>
                <p className="mt-1.5 text-xs text-muted">
                  Sign in to your member profile or register to represent youth across all 47 counties.
                </p>

                {/* Auth Mode Toggle Pills */}
                <div className="mt-6 flex rounded-full border border-line bg-bg p-1">
                  <button
                    type="button"
                    onClick={() => { setAuthMode("signin"); setAuthError(null); }}
                    className={`flex-1 flex items-center justify-center gap-1.5 rounded-full py-2 text-xs font-bold uppercase tracking-wider transition ${
                      authMode === "signin"
                        ? "bg-brand text-white shadow-sm"
                        : "text-ink/70 hover:text-brand"
                    }`}
                  >
                    <LogIn size={13} />
                    <span>Sign In</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setAuthMode("signup"); setAuthError(null); }}
                    className={`flex-1 flex items-center justify-center gap-1.5 rounded-full py-2 text-xs font-bold uppercase tracking-wider transition ${
                      authMode === "signup"
                        ? "bg-brand text-white shadow-sm"
                        : "text-ink/70 hover:text-brand"
                    }`}
                  >
                    <UserPlus size={13} />
                    <span>Sign Up</span>
                  </button>
                </div>
              </div>

              {/* 1. SIGN IN FORM */}
              {authMode === "signin" ? (
                <form onSubmit={handleSignIn} className="mt-6 space-y-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-ink/80">
                      Email Address
                    </label>
                    <div className="relative mt-1">
                      <input
                        type="email"
                        required
                        placeholder="amani.mwangi@nybf.ke"
                        value={signInEmail}
                        onChange={(e) => setSignInEmail(e.target.value)}
                        className="w-full rounded-2xl border border-line bg-bg p-3.5 pl-10 text-xs sm:text-sm text-ink placeholder:text-muted/60 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                      />
                      <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-ink/80">
                      Password
                    </label>
                    <div className="relative mt-1">
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={signInPassword}
                        onChange={(e) => setSignInPassword(e.target.value)}
                        className="w-full rounded-2xl border border-line bg-bg p-3.5 pl-10 text-xs sm:text-sm text-ink placeholder:text-muted/60 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                      />
                      <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                    </div>
                  </div>

                  {authError && (
                    <div className="flex items-center gap-2 rounded-xl bg-rose-500/10 p-3 text-xs font-semibold text-rose-600 dark:text-rose-400">
                      <AlertCircle size={15} className="shrink-0" />
                      <span>{authError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-brand py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-brand/25 transition-all hover:bg-brand-light active:scale-95 disabled:opacity-50"
                  >
                    {authLoading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Signing In…</span>
                      </>
                    ) : (
                      <>
                        <LogIn size={14} />
                        <span>Sign In to My NYBF</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* 2. SIGN UP FORM */
                <form onSubmit={handleSignUp} className="mt-6 space-y-3.5">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-ink/80">
                      Full Legal Name
                    </label>
                    <div className="relative mt-1">
                      <input
                        required
                        placeholder="e.g. Amani Mwangi"
                        value={signUpForm.name}
                        onChange={(e) => setSignUpForm({ ...signUpForm, name: e.target.value })}
                        className="w-full rounded-2xl border border-line bg-bg p-3.5 pl-10 text-xs sm:text-sm text-ink placeholder:text-muted/60 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                      />
                      <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-ink/80">
                        Email Address
                      </label>
                      <div className="relative mt-1">
                        <input
                          type="email"
                          required
                          placeholder="you@domain.ke"
                          value={signUpForm.email}
                          onChange={(e) => setSignUpForm({ ...signUpForm, email: e.target.value })}
                          className="w-full rounded-2xl border border-line bg-bg p-3.5 pl-10 text-xs sm:text-sm text-ink placeholder:text-muted/60 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                        />
                        <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-ink/80">
                        Phone Number
                      </label>
                      <div className="relative mt-1">
                        <input
                          required
                          placeholder="+254 700 000 000"
                          value={signUpForm.phone}
                          onChange={(e) => setSignUpForm({ ...signUpForm, phone: e.target.value })}
                          className="w-full rounded-2xl border border-line bg-bg p-3.5 pl-10 text-xs sm:text-sm text-ink placeholder:text-muted/60 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                        />
                        <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-ink/80">
                        County
                      </label>
                      <select
                        value={signUpForm.county}
                        onChange={(e) => {
                          const c = e.target.value;
                          const constList = getConstituenciesForCounty(c);
                          setSignUpForm({
                            ...signUpForm,
                            county: c,
                            constituency: constList[0] || "",
                          });
                        }}
                        className="mt-1 w-full rounded-2xl border border-line bg-bg p-3.5 text-xs sm:text-sm text-ink outline-none transition focus:border-brand"
                      >
                        {kenyaCounties.map((c) => (
                          <option key={c} value={c}>{c} County</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-ink/80">
                        Constituency ({signUpForm.county})
                      </label>
                      <select
                        value={signUpForm.constituency}
                        onChange={(e) => setSignUpForm({ ...signUpForm, constituency: e.target.value })}
                        className="mt-1 w-full rounded-2xl border border-line bg-bg p-3.5 text-xs sm:text-sm text-ink outline-none transition focus:border-brand"
                      >
                        {getConstituenciesForCounty(signUpForm.county).map((con) => (
                          <option key={con} value={con}>{con}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-ink/80">
                      Civic Role
                    </label>
                    <select
                      value={signUpForm.role}
                      onChange={(e) => setSignUpForm({ ...signUpForm, role: e.target.value })}
                      className="mt-1 w-full rounded-2xl border border-line bg-bg p-3.5 text-xs sm:text-sm text-ink outline-none transition focus:border-brand"
                    >
                      {roles.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-ink/80">
                      Password (min 8 characters)
                    </label>
                    <div className="relative mt-1">
                      <input
                        type="password"
                        required
                        minLength={8}
                        placeholder="••••••••"
                        value={signUpForm.password}
                        onChange={(e) => setSignUpForm({ ...signUpForm, password: e.target.value })}
                        className="w-full rounded-2xl border border-line bg-bg p-3.5 pl-10 text-xs sm:text-sm text-ink placeholder:text-muted/60 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                      />
                      <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-brand py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-brand/25 transition-all hover:bg-brand-light active:scale-95 disabled:opacity-50"
                  >
                    {authLoading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Creating Profile…</span>
                      </>
                    ) : (
                      <>
                        <UserPlus size={14} />
                        <span>Create Account & Enter Portal</span>
                      </>
                    )}
                  </button>
                </form>
              )}

            </div>
          </div>
        </section>
      </main>
    );
  }

  const cidpInfo = getCidpForCounty(user.county);
  const countyInfo = getCountyInfo(user.county);
  const countyMetrics = {
    county: `${user.county} County`,
    governor: getGovernorForCounty(user.county),
    capital: countyInfo?.capital || user.county,
    constituenciesCount: getConstituenciesForCounty(user.county).length,
    adpStatus: "ADP 2026/27 Public Participation",
    nextHearing: `County Assembly Main Hall — ${user.county}`,
  };

  return (
    <main className="min-h-screen text-ink selection:bg-brand/20 selection:text-brand">
      <Nav />

      {/* HEADER SECTION — Minimal dimming */}
      <section className="relative overflow-hidden border-b border-line bg-brand-dark py-14 text-white sm:py-20">
        <div className="absolute inset-0">
          <Image
            src="/pictures/leaders-exterior.jpeg"
            alt="My NYBF Dashboard"
            fill
            sizes="100vw"
            className="object-cover opacity-70 object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/95 via-brand-dark/75 to-brand-dark/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/95 via-transparent to-brand-dark/40" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-emerald-300">
                <Sparkles size={13} />
                Member Portal
              </div>
              <h1 className="mt-3 font-serif text-3xl font-extrabold sm:text-5xl text-white text-shadow-strong">
                My NYBF Hub
              </h1>
              <p className="mt-2 text-sm sm:text-base text-white/90 max-w-xl text-shadow-subtle">
                Manage your civic profile, track budget allocations for {user.county} County, view your consultation votes, and download certified credentials.
              </p>
            </div>

            {/* User Quick Info Chip */}
            <div className="glass-panel-photo flex flex-col sm:flex-row sm:items-center gap-4 rounded-3xl p-4 sm:p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-400 font-serif text-2xl font-bold text-brand-dark">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2 font-serif text-lg font-bold text-white">
                    <span>{user.name}</span>
                    {user.verified && <CheckCircle2 size={16} className="text-emerald-400" />}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-white/80">
                    <MapPin size={12} className="text-emerald-400" />
                    <span>{user.county} County</span>
                    <span className="text-white/40">•</span>
                    <span className="text-emerald-300">{user.role}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-rose-500 hover:border-rose-500 transition-all self-start sm:self-center"
              >
                <LogOut size={13} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs Bar */}
          <div className="mt-10 flex flex-wrap gap-2 border-b border-white/15 pb-2">
            {[
              { id: "profile", label: "Profile", icon: User },
              { id: "county", label: `My County (${user.county})`, icon: MapPin },
              { id: "activity", label: "Activity & Votes", icon: Activity },
              { id: "certificates", label: "Certificates", icon: Award },
            ].map((tab) => {
              const Icon = tab.icon;
              const isCurrent = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs sm:text-sm font-bold tracking-wide transition-all ${
                    isCurrent
                      ? "bg-white text-brand-dark shadow-lg shadow-black/20"
                      : "glass-panel-photo text-white/80 hover:bg-white/20 hover:text-white"
                  }`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* TAB CONTENTS */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        {/* 1. PROFILE TAB */}
        {activeTab === "profile" && (
          <div className="grid gap-8 lg:grid-cols-12 animate-fade-in-up">
            <div className="lg:col-span-8 space-y-6">
              <div className="rounded-3xl border border-line bg-surface p-6 sm:p-8 shadow-sm">
                <div className="flex items-center justify-between border-b border-line pb-4">
                  <h3 className="font-serif text-xl font-bold text-ink">Personal Information</h3>
                  <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    Verified Citizen Member
                  </span>
                </div>

                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted">Full Name</label>
                    <div className="mt-1 font-semibold text-ink text-sm sm:text-base">{user.name}</div>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted">Email Address</label>
                    <div className="mt-1 font-semibold text-ink text-sm sm:text-base">{user.email}</div>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted">Phone Number</label>
                    <div className="mt-1 font-semibold text-ink text-sm sm:text-base">{user.phone}</div>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted">County / Constituency</label>
                    <div className="mt-1 font-semibold text-ink text-sm sm:text-base">{user.county} / {user.constituency}</div>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted">Primary Civic Role</label>
                    <div className="mt-1 font-semibold text-ink text-sm sm:text-base">{user.role}</div>
                  </div>
                </div>
              </div>

              {/* Notification Preferences */}
              <div className="rounded-3xl border border-line bg-surface p-6 sm:p-8 shadow-sm">
                <h3 className="font-serif text-xl font-bold text-ink border-b border-line pb-4">
                  Civic Notification Alerts
                </h3>
                <div className="mt-6 space-y-4 text-xs sm:text-sm">
                  <label className="flex items-center justify-between p-3 rounded-2xl border border-line bg-bg">
                    <div>
                      <div className="font-bold text-ink">National Budget Hearing SMS Alerts</div>
                      <div className="text-muted text-xs">Receive SMS when Treasury or Parliament tables Finance Bills</div>
                    </div>
                    <input type="checkbox" defaultChecked className="h-5 w-5 accent-brand rounded" />
                  </label>
                  <label className="flex items-center justify-between p-3 rounded-2xl border border-line bg-bg">
                    <div>
                      <div className="font-bold text-ink">Nairobi County Fiscal Strategy Notices</div>
                      <div className="text-muted text-xs">Direct invitations to Nairobi County Assembly budget consultations</div>
                    </div>
                    <input type="checkbox" defaultChecked className="h-5 w-5 accent-brand rounded" />
                  </label>
                  <label className="flex items-center justify-between p-3 rounded-2xl border border-line bg-bg">
                    <div>
                      <div className="font-bold text-ink">30% AGPO Tender Opportunities Digest</div>
                      <div className="text-muted text-xs">Weekly newsletter on reserved government procurement quotas</div>
                    </div>
                    <input type="checkbox" defaultChecked className="h-5 w-5 accent-brand rounded" />
                  </label>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-6">
              <div className="rounded-3xl border border-line bg-surface p-6 shadow-sm text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-brand font-serif text-3xl font-bold text-white shadow-lg shadow-brand/20">
                  {user.name.charAt(0)}
                </div>
                <h3 className="mt-4 font-serif text-xl font-bold text-ink">{user.name}</h3>
                <p className="text-xs text-muted">Member since {user.joinedDate}</p>

                <div className="mt-6 grid grid-cols-2 gap-2 border-y border-line py-4">
                  <div>
                    <div className="font-serif text-2xl font-black text-brand dark:text-brand-light">{stats.votesCount}</div>
                    <div className="text-[11px] text-muted">Consultation Votes</div>
                  </div>
                  <div>
                    <div className="font-serif text-2xl font-black text-brand-gold">{stats.modulesCompletedCount}</div>
                    <div className="text-[11px] text-muted">Certificates</div>
                  </div>
                </div>

                <Link
                  href="/youth-voice"
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-brand py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-brand/20 hover:bg-brand-light"
                >
                  <span>Vote in Open Polls</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* 2. MY COUNTY TAB */}
        {activeTab === "county" && (
          <div className="space-y-8 animate-fade-in-up">
            <div className="rounded-3xl border border-line bg-surface p-6 sm:p-10 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-brand dark:text-brand-light">
                    <MapPin size={14} />
                    County Devolution Desk
                  </div>
                  <h2 className="mt-2 font-serif text-3xl font-bold text-ink">
                    {countyMetrics.county} Budget Dashboard
                  </h2>
                  <p className="text-xs sm:text-sm text-muted">Governor: {countyMetrics.governor}</p>
                </div>
                <span className="self-start sm:self-center rounded-full bg-brand/10 px-4 py-1.5 text-xs font-bold text-brand dark:bg-brand/20 dark:text-brand-light">
                  FY 2026/27 Cycle
                </span>
              </div>

              {/* County Profile & Governance Overview */}
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-line bg-bg p-5">
                  <div className="text-xs font-bold uppercase tracking-wider text-muted">Sitting Governor</div>
                  <div className="mt-2 font-serif text-lg font-bold text-ink">
                    {countyMetrics.governor}
                  </div>
                  <div className="mt-1 text-[11px] text-muted">County Executive Leadership (2022–2027)</div>
                </div>

                <div className="rounded-2xl border border-line bg-bg p-5">
                  <div className="text-xs font-bold uppercase tracking-wider text-muted">County Headquarters</div>
                  <div className="mt-2 font-serif text-lg font-bold text-brand dark:text-brand-light">
                    {countyMetrics.capital}
                  </div>
                  <div className="mt-1 text-[11px] text-muted">County Government Seat &amp; Assembly</div>
                </div>

                <div className="rounded-2xl border border-line bg-bg p-5">
                  <div className="text-xs font-bold uppercase tracking-wider text-muted">Devolved Representation</div>
                  <div className="mt-2 font-serif text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    {countyMetrics.constituenciesCount} Constituencies
                  </div>
                  <div className="mt-1 text-[11px] text-muted">Active Constituency Youth Desks</div>
                </div>
              </div>

              {/* VERIFIED CIDP (COUNTY INTEGRATED DEVELOPMENT PLAN) CARD */}
              <div className="mt-8 rounded-3xl border border-brand/30 bg-gradient-to-br from-brand/5 via-surface to-brand/10 p-6 sm:p-8 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line/60 pb-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-white shadow-md shadow-brand/20">
                      <BookOpen size={24} />
                    </div>
                    <div>
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-brand dark:bg-brand/20 dark:text-brand-light">
                        Verified Statutory Document
                      </div>
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-ink mt-0.5">
                        {cidpInfo.title}
                      </h3>
                    </div>
                  </div>
                  <span className="self-start md:self-center rounded-full bg-emerald-500/10 px-3.5 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    {cidpInfo.cycle}
                  </span>
                </div>

                <div className="mt-5 space-y-3 text-xs sm:text-sm text-muted leading-relaxed">
                  <p>{cidpInfo.summary}</p>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-xs font-semibold text-ink/80">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck size={14} className="text-brand" />
                      <span>Legal Mandate: {cidpInfo.statutoryBasis}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <ExternalLink size={14} className="text-brand" />
                      <span>Source: {cidpInfo.source}</span>
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-line/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="text-xs text-muted">
                    Official statutory repository maintained by the Council of Governors of Kenya.
                  </div>
                  <a
                    href={cidpInfo.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-brand/20 hover:bg-brand-light transition"
                  >
                    <span>View Official CIDP Document</span>
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>

              {/* Data Integrity Standard Notice */}
              <div className="mt-6 rounded-2xl border border-line bg-surface/60 p-4 text-xs text-muted flex items-start gap-3">
                <ShieldCheck size={18} className="text-brand dark:text-brand-light shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong className="text-ink">NYBF Verified Data Integrity Notice: </strong>
                  Under Section 108 of the County Governments Act, the CIDP is the 5-year master development framework that binds all annual county appropriations. Per platform standards, county AGPO quotas and County Assembly contact rosters are currently withheld until verified, per-county primary datasets are certified with each County Secretariat.
                </div>
              </div>

              {/* Upcoming Hearing Alert */}
              <div className="mt-8 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <Calendar size={24} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-1" />
                  <div>
                    <h4 className="font-serif text-lg font-bold text-ink">
                      {countyMetrics.adpStatus}
                    </h4>
                    <p className="text-xs sm:text-sm text-muted mt-0.5">
                      Venue: {countyMetrics.nextHearing}
                    </p>
                  </div>
                </div>
                <Link
                  href="/events"
                  className="rounded-full bg-brand px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-brand-light"
                >
                  Register Seat
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* 3. ACTIVITY & VOTES TAB */}
        {activeTab === "activity" && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="rounded-3xl border border-line bg-surface p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between border-b border-line pb-4">
                <div>
                  <h3 className="font-serif text-xl font-bold text-ink">Your Civic Participation Log</h3>
                  <p className="text-xs text-muted">Every consultation response is cryptographically counted into the National Youth Memorandum.</p>
                </div>
                <span className="text-xs font-bold text-muted">{activitiesList.length} Actions</span>
              </div>

              <div className="mt-6 divide-y divide-line">
                {activitiesList.map((act) => (
                  <div key={act.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3.5">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand dark:bg-brand/20 dark:text-brand-light">
                        {act.type === "VOTE" && <TrendingUp size={18} />}
                        {act.type === "MODULE" && <BookOpen size={18} />}
                        {act.type === "IDEA" && <FileText size={18} />}
                        {act.type === "EVENT" && <Calendar size={18} />}
                      </div>
                      <div>
                        <div className="font-serif text-base font-bold text-ink">{act.title}</div>
                        <div className="text-xs text-muted">{act.detail}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 sm:text-right self-end sm:self-center">
                      <div className="text-[11px] text-muted">{act.date}</div>
                      <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        {act.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 4. CERTIFICATES TAB */}
        {activeTab === "certificates" && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-brand dark:text-brand-light">
                  Verified Credentials
                </span>
                <h2 className="mt-1 font-serif text-3xl font-bold text-ink">
                  Civic Finance Certificates
                </h2>
                <p className="text-xs sm:text-sm text-muted">
                  Earn digital credentials by completing Budget Hub modules and participating in county forums.
                </p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {certList.map((cert) => (
                <div
                  key={cert.id}
                  className="rounded-3xl border border-line bg-surface p-7 shadow-sm transition-all hover:shadow-lg flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-gold">
                        <Award size={16} />
                        Verified Digital Certificate
                      </span>
                      <span className="font-mono text-[11px] text-muted">{cert.date}</span>
                    </div>

                    <h3 className="mt-4 font-serif text-xl font-bold text-ink">{cert.title}</h3>
                    <p className="mt-2 text-xs text-muted">{cert.issuer}</p>

                    <div className="mt-4 rounded-2xl border border-line bg-bg p-3.5">
                      <div className="text-[10px] font-bold uppercase text-muted">Curriculum Modules Verified:</div>
                      <div className="text-xs font-semibold text-ink mt-0.5">{cert.modulesCompleted}</div>
                      <div className="mt-2 font-mono text-[10px] text-muted">Credential ID: {cert.credId}</div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-line flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand hover:text-brand-light transition-colors"
                    >
                      <Download size={14} />
                      <span>Download PDF</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const shareUrl = typeof window !== "undefined" ? window.location.origin + "/my-nybf" : "https://nybf.ke";
                        const shareText = `I have completed certified budget training with National Youth Budget Forum (Credential ID: ${cert.credId})`;
                        window.open(
                          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(cert.title)}&summary=${encodeURIComponent(shareText)}`,
                          "_blank",
                          "noopener,noreferrer"
                        );
                      }}
                      className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted hover:text-ink transition-colors"
                    >
                      <Share2 size={14} />
                      <span>Share on LinkedIn</span>
                    </button>
                  </div>
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
              NYBF <span className="text-xs uppercase font-sans tracking-widest text-brand-gold">Connect</span>
            </div>
            <p className="mt-3 text-xs text-white/70">
              National Youth Budget Forum — Your Voice, Your Economy.
            </p>
          </div>
          <FooterColumn
            title="Platform"
            links={[
              { label: "Budget Hub", href: "/budget-hub" },
              { label: "Youth Voice", href: "/youth-voice" },
              { label: "Opportunities", href: "/opportunities" },
              { label: "Events", href: "/events" },
            ]}
          />
          <FooterColumn
            title="My NYBF"
            links={[
              { label: "Profile", href: "/my-nybf" },
              { label: "My County", href: "/my-nybf" },
              { label: "Certificates", href: "/my-nybf" },
            ]}
          />
          <FooterColumn
            title="Governance"
            links={[
              { label: "About NYBF", href: "/about" },
              { label: "Constitution Art. 201", href: "https://kenyalaw.org" },
              { label: "Join Network", href: "/join" },
            ]}
          />
        </div>
        <div className="border-t border-white/10 py-6 text-center text-xs text-white/50">
          © 2026 National Youth Budget Forum. Built for the youth of Kenya.
        </div>
      </footer>
    </main>
  );
}
