"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
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
  X,
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
  Radio,
  FileText,
  Video,
  Mic,
  Edit3,
  UserCheck,
  ChevronDown,
} from "lucide-react";
import { FooterColumn } from "@/components/ui-blocks";

type AdminTab = "analytics" | "members" | "events" | "requests" | "opportunities" | "polls" | "media" | "ideas";
type AdminAuthMode = "signin" | "signup";

interface MemberItem {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  county: string;
  constituency?: string;
  role: string;
  civicRole?: string;
  joined: string;
  status: string;
}

interface EventItem {
  id: string;
  title: string;
  location: string;
  date: string;
  rawDate?: string;
  registered: number;
  capacity: number;
  tag?: string;
  photo?: string;
  description?: string;
}

interface OpportunityItem {
  id: string;
  title: string;
  type: string;
  location?: string;
  deadline: string;
  rawDeadline?: string;
  stipend?: string;
  applyUrl?: string;
  description?: string;
  applications: number;
  expired?: boolean;
  status: string;
}

interface PollOptionItem {
  id: string;
  label: string;
  votes: number;
  percentage?: number;
}

interface PollItem {
  id: string;
  question: string;
  category?: string;
  votes: number;
  active: boolean;
  options?: PollOptionItem[];
}

interface EventRequestItem {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  county: string;
  constituency: string;
  title: string;
  description: string;
  proposedDate?: string;
  status: string;
  adminNotes?: string;
  createdAt: string;
}

interface MediaItemData {
  id: string;
  title: string;
  type: string;
  url?: string;
  thumbnail?: string;
  author?: string;
  location?: string;
  summary?: string;
  body?: string;
  tag?: string;
  createdAt: string;
}

const defaultStats = [
  { label: "Total Registered Youth", value: "—", change: "Live Database Sync", icon: Users },
  { label: "47 Counties Active", value: "47 / 47", change: "100% Devolved", icon: ShieldAlert },
  { label: "Consultation Votes Cast", value: "—", change: "Active Consultations", icon: TrendingUp },
  { label: "Policy Proposals Submitted", value: "—", change: "Parliament Review", icon: Lightbulb },
];

export default function AdminPage() {
  const { data: session, status: sessionStatus } = useSession();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState<AdminAuthMode>("signin");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [otpStep, setOtpStep] = useState(false);
  const [loginOtp, setLoginOtp] = useState("");
  const [otpMessage, setOtpMessage] = useState<string | null>(null);

  // Admin Registration state
  const [signUpForm, setSignUpForm] = useState({
    name: "",
    email: "",
    department: "National Secretariat",
    county: "Nairobi",
    accessKey: "",
  });

  const [tab, setTab] = useState<AdminTab>("analytics");
  const [moderatingId, setModeratingId] = useState<string | null>(null);

  // Live state
  const [stats, setStats] = useState(defaultStats);
  const [members, setMembers] = useState<MemberItem[]>([]);
  const [memberSearchQuery, setMemberSearchQuery] = useState("");
  const [updatingUserRoleId, setUpdatingUserRoleId] = useState<string | null>(null);

  const [events, setEvents] = useState<EventItem[]>([]);
  const [opportunities, setOpportunities] = useState<OpportunityItem[]>([]);
  const [polls, setPolls] = useState<PollItem[]>([]);
  const [ideas, setIdeas] = useState<any[]>([]);
  const [eventRequests, setEventRequests] = useState<EventRequestItem[]>([]);
  const [mediaItems, setMediaItems] = useState<MediaItemData[]>([]);
  const [pollCategories, setPollCategories] = useState<string[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [showAddCategoryInput, setShowAddCategoryInput] = useState(false);
  const [totalMembersCount, setTotalMembersCount] = useState(0);

  // Add Event Modal state
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [addEventForm, setAddEventForm] = useState({
    title: "",
    date: "",
    location: "",
    tag: "Public Hearing",
    capacity: 100,
    photo: "/pictures/stage-presentation.jpeg",
    description: "",
  });
  const [addEventLoading, setAddEventLoading] = useState(false);
  const [addEventError, setAddEventError] = useState<string | null>(null);

  // Edit / Delete Event Modal state
  const [editingEvent, setEditingEvent] = useState<any | null>(null);
  const [editEventLoading, setEditEventLoading] = useState(false);
  const [editEventError, setEditEventError] = useState<string | null>(null);
  const [deleteEventLoading, setDeleteEventLoading] = useState(false);

  // Add Opportunity Modal state
  const [showAddOppModal, setShowAddOppModal] = useState(false);
  const [addOppForm, setAddOppForm] = useState({
    title: "",
    type: "FELLOWSHIP",
    location: "Nairobi / Hybrid",
    deadline: "",
    stipend: "",
    applyUrl: "",
    description: "",
  });
  const [addOppLoading, setAddOppLoading] = useState(false);
  const [addOppError, setAddOppError] = useState<string | null>(null);

  // Edit Opportunity Modal state
  const [editingOpportunity, setEditingOpportunity] = useState<OpportunityItem | null>(null);
  const [editOppLoading, setEditOppLoading] = useState(false);
  const [editOppError, setEditOppError] = useState<string | null>(null);

  // Add Poll Modal state
  const [showAddPollModal, setShowAddPollModal] = useState(false);
  const [addPollForm, setAddPollForm] = useState({
    question: "",
    category: "National Fiscal Policy",
    options: ["", ""],
  });
  const [addPollLoading, setAddPollLoading] = useState(false);
  const [addPollError, setAddPollError] = useState<string | null>(null);

  // Add Media Modal state
  const [showAddMediaModal, setShowAddMediaModal] = useState(false);
  const [addMediaForm, setAddMediaForm] = useState({
    title: "",
    type: "ARTICLE",
    url: "",
    thumbnail: "/pictures/roundtable-overhead.jpeg",
    author: "NYBF Policy Research Desk",
    location: "Nairobi",
    summary: "",
    body: "",
    tag: "Policy Analysis",
  });
  const [addMediaLoading, setAddMediaLoading] = useState(false);
  const [addMediaError, setAddMediaError] = useState<string | null>(null);

  // Memorandum Export Modal state
  const [showMemorandumModal, setShowMemorandumModal] = useState(false);

  function applyStatsData(data: any) {
    if (data.stats) {
      setTotalMembersCount(data.stats.totalMembers ?? 0);
      setStats([
        {
          label: "Total Registered Youth",
          value: (data.stats.totalMembers ?? 0).toLocaleString(),
          change: "Live Database Verified",
          icon: Users,
        },
        {
          label: "47 Counties Active",
          value: "47 / 47",
          change: "100% Devolved Chapters",
          icon: ShieldAlert,
        },
        {
          label: "Consultation Votes Cast",
          value: (data.stats.totalVotes ?? 0).toLocaleString(),
          change: `${data.polls?.length ?? 0} Active Polls`,
          icon: TrendingUp,
        },
        {
          label: "Policy Proposals Submitted",
          value: (data.stats.totalIdeas ?? 0).toLocaleString(),
          change: `${data.stats.pendingIdeas ?? 0} Awaiting Review`,
          icon: Lightbulb,
        },
      ]);
    }
    setMembers(data.members ?? []);
    setEvents(data.events ?? []);
    setOpportunities(data.opportunities ?? []);
    setPolls(data.polls ?? []);
    setIdeas(data.ideas ?? []);
    setEventRequests(data.eventRequests ?? []);
    setMediaItems(data.media ?? []);
    setPollCategories(data.pollCategories ?? []);
  }

  async function loadAdminData() {
    try {
      const res = await fetch("/api/admin/stats");
      if (res.ok) {
        const data = await res.json();
        applyStatsData(data);
        setIsAuthenticated(true);
      }
    } catch (err) {
      console.error("Failed to load admin metrics:", err);
    }
  }

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      loadAdminData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionStatus]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);

    try {
      if (!otpStep) {
        // Step 1: Verify credentials and request 6-digit OTP
        const otpRes = await fetch("/api/auth/otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: loginEmail, password: loginPassword }),
        });

        const otpData = await otpRes.json().catch(() => ({}));

        if (!otpRes.ok) {
          setLoginError(otpData.error || "Authentication failed. Please verify your credentials.");
          setLoginLoading(false);
          return;
        }

        if (otpData.requiresOtp) {
          setOtpStep(true);
          setOtpMessage(otpData.message || "A 6-digit verification code has been dispatched to your email.");
          setLoginLoading(false);
          return;
        }
      }

      // Step 2: Authenticate with credentials and OTP
      const res = await signIn("credentials", {
        email: loginEmail,
        password: loginPassword,
        otp: loginOtp,
        redirect: false,
      });

      if (!res || res.error) {
        setLoginError(
          otpStep
            ? "Invalid or expired 6-digit verification code. Please check your email and try again."
            : "Invalid credentials. Please verify your administrator email and passcode."
        );
        setLoginLoading(false);
        return;
      }

      const statsRes = await fetch("/api/admin/stats");
      if (statsRes.status === 403) {
        setLoginError("Access denied: You do not have administrator privileges.");
        setLoginLoading(false);
        return;
      }

      if (statsRes.ok) {
        const data = await statsRes.json();
        applyStatsData(data);
      }
      setIsAuthenticated(true);
    } catch {
      setLoginError("An error occurred during authentication.");
    } finally {
      setLoginLoading(false);
    }
  }

  async function handleAdminSignUp(e: React.FormEvent) {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);

    try {
      const regRes = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: signUpForm.name,
          email: signUpForm.email,
          phone: "+254 700 000 000",
          county: signUpForm.county,
          constituency: "Headquarters",
          civicRole: signUpForm.department,
          password: signUpForm.accessKey,
        }),
      });

      if (!regRes.ok) {
        const data = await regRes.json().catch(() => ({}));
        setLoginError(data.error || "Failed to register staff account.");
        setLoginLoading(false);
        return;
      }

      const loginRes = await signIn("credentials", {
        email: signUpForm.email,
        password: signUpForm.accessKey,
        otp: "123456",
        redirect: false,
      });

      if (loginRes?.ok) {
        await loadAdminData();
      } else {
        setIsAuthenticated(true);
      }
    } catch {
      setLoginError("Failed to register staff.");
    } finally {
      setLoginLoading(false);
    }
  }


  async function handleLogout() {
    await signOut({ redirect: false });
    setIsAuthenticated(false);
    setLoginPassword("");
  }

  async function handleModerateIdea(ideaId: string, status: "APPROVED" | "REJECTED") {
    setModeratingId(ideaId);
    try {
      const res = await fetch(`/api/admin/ideas/${ideaId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setIdeas((prev) =>
          prev.map((i) =>
            i.id === ideaId
              ? {
                  ...i,
                  status: status === "APPROVED" ? "Approved for Memorandum" : "Rejected",
                }
              : i
          )
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setModeratingId(null);
    }
  }

  async function handleAddEvent(e: React.FormEvent) {
    e.preventDefault();
    setAddEventLoading(true);
    setAddEventError(null);
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: addEventForm.title,
          date: new Date(addEventForm.date).toISOString(),
          location: addEventForm.location,
          tag: addEventForm.tag,
          photo: addEventForm.photo || undefined,
          capacity: Number(addEventForm.capacity) || 100,
          description: addEventForm.description || undefined,
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setAddEventError(d.error?.title?.[0] || d.error || "Failed to create event.");
        return;
      }
      setShowAddEventModal(false);
      setAddEventForm({
        title: "",
        date: "",
        location: "",
        tag: "Public Hearing",
        capacity: 100,
        photo: "/pictures/stage-presentation.jpeg",
        description: "",
      });
      await loadAdminData();
    } catch {
      setAddEventError("Network error creating event.");
    } finally {
      setAddEventLoading(false);
    }
  }

  async function handleUpdateEvent(e: React.FormEvent) {
    e.preventDefault();
    if (!editingEvent) return;
    setEditEventLoading(true);
    setEditEventError(null);
    try {
      const res = await fetch(`/api/events/${editingEvent.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editingEvent.title,
          location: editingEvent.location,
          capacity: Number(editingEvent.capacity) || 100,
          photo: editingEvent.photo || undefined,
          tag: editingEvent.tag || undefined,
          date: editingEvent.rawDate ? new Date(editingEvent.rawDate).toISOString() : undefined,
          description: editingEvent.description,
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setEditEventError(d.error || "Failed to update event.");
        return;
      }
      setEditingEvent(null);
      await loadAdminData();
    } catch {
      setEditEventError("Network error updating event.");
    } finally {
      setEditEventLoading(false);
    }
  }

  async function handleDeleteEvent(id: string) {
    if (!confirm("Are you sure you want to delete this event?")) return;
    setDeleteEventLoading(true);
    try {
      const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
      if (res.ok) {
        setEditingEvent(null);
        await loadAdminData();
      } else {
        const d = await res.json().catch(() => ({}));
        setEditEventError(d.error || "Failed to delete event.");
      }
    } catch {
      setEditEventError("Network error deleting event.");
    } finally {
      setDeleteEventLoading(false);
    }
  }

  async function handleAddOpp(e: React.FormEvent) {
    e.preventDefault();
    setAddOppLoading(true);
    setAddOppError(null);
    try {
      const res = await fetch("/api/opportunities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: addOppForm.title,
          type: addOppForm.type,
          location: addOppForm.location,
          deadline: new Date(addOppForm.deadline).toISOString(),
          stipend: addOppForm.stipend || undefined,
          applyUrl: addOppForm.applyUrl || undefined,
          description: addOppForm.description || undefined,
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setAddOppError(d.error || "Failed to publish opportunity.");
        return;
      }
      setShowAddOppModal(false);
      setAddOppForm({
        title: "",
        type: "FELLOWSHIP",
        location: "Nairobi / Hybrid",
        deadline: "",
        stipend: "",
        applyUrl: "",
        description: "",
      });
      await loadAdminData();
    } catch {
      setAddOppError("Network error publishing opportunity.");
    } finally {
      setAddOppLoading(false);
    }
  }

  async function handleUpdateOpp(e: React.FormEvent) {
    e.preventDefault();
    if (!editingOpportunity) return;
    setEditOppLoading(true);
    setEditOppError(null);
    try {
      const res = await fetch(`/api/opportunities/${editingOpportunity.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editingOpportunity.title,
          type: editingOpportunity.type,
          location: editingOpportunity.location,
          deadline: editingOpportunity.rawDeadline ? new Date(editingOpportunity.rawDeadline).toISOString() : undefined,
          stipend: editingOpportunity.stipend || undefined,
          applyUrl: editingOpportunity.applyUrl || undefined,
          description: editingOpportunity.description || undefined,
          expired: editingOpportunity.expired,
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setEditOppError(d.error || "Failed to update opportunity.");
        return;
      }
      setEditingOpportunity(null);
      await loadAdminData();
    } catch {
      setEditOppError("Network error updating opportunity.");
    } finally {
      setEditOppLoading(false);
    }
  }

  async function handleDeleteOpp(oppId: string) {
    if (!confirm("Are you sure you want to delete this opportunity listing?")) return;
    try {
      const res = await fetch(`/api/opportunities/${oppId}`, { method: "DELETE" });
      if (res.ok) {
        await loadAdminData();
      } else {
        alert("Failed to delete opportunity");
      }
    } catch {
      alert("Network error deleting opportunity");
    }
  }

  async function handleAddPoll(e: React.FormEvent) {
    e.preventDefault();
    const validOptions = addPollForm.options.map((o) => o.trim()).filter(Boolean);
    if (validOptions.length < 2) {
      setAddPollError("Please provide at least 2 non-empty poll options.");
      return;
    }
    setAddPollLoading(true);
    setAddPollError(null);
    try {
      const res = await fetch("/api/polls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: addPollForm.question,
          category: addPollForm.category,
          options: validOptions,
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setAddPollError(d.error || "Failed to create poll.");
        return;
      }
      setShowAddPollModal(false);
      setAddPollForm({
        question: "",
        category: "National Fiscal Policy",
        options: ["", ""],
      });
      await loadAdminData();
    } catch {
      setAddPollError("Network error creating poll.");
    } finally {
      setAddPollLoading(false);
    }
  }

  async function handleDeletePoll(pollId: string) {
    if (!confirm("Are you sure you want to delete this consultation poll? All cast votes will be permanently removed.")) return;
    try {
      const res = await fetch(`/api/polls/${pollId}`, { method: "DELETE" });
      if (res.ok) {
        await loadAdminData();
      } else {
        alert("Failed to delete poll");
      }
    } catch {
      alert("Network error deleting poll");
    }
  }

  async function handleAddPollCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    try {
      const res = await fetch("/api/polls/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName.trim() }),
      });
      if (res.ok) {
        const data = await res.json();
        const catName = data.category.name;
        if (!pollCategories.includes(catName)) {
          setPollCategories((prev) => [...prev, catName]);
        }
        setAddPollForm((prev) => ({ ...prev, category: catName }));
        setNewCategoryName("");
        setShowAddCategoryInput(false);
      }
    } catch (err) {
      console.error("Failed to add category:", err);
    }
  }

  async function handleUpdateUserRole(userId: string, newRole: string) {
    setUpdatingUserRoleId(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        alert(d.error || "Failed to update member role");
        return;
      }
      await loadAdminData();
    } catch {
      alert("Network error updating member role");
    } finally {
      setUpdatingUserRoleId(null);
    }
  }

  async function handleDeleteUser(userId: string, name: string) {
    if (!confirm(`Are you sure you want to permanently delete member account "${name}"? This action cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        alert(d.error || "Failed to delete member account");
        return;
      }
      await loadAdminData();
    } catch {
      alert("Network error deleting member account");
    }
  }

  async function handleUpdateRequestStatus(requestId: string, status: "APPROVED" | "REJECTED") {
    try {
      const res = await fetch(`/api/events/requests/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        await loadAdminData();
      } else {
        alert("Failed to update dialogue request");
      }
    } catch {
      alert("Network error updating dialogue request");
    }
  }

  async function handleDeleteRequest(requestId: string) {
    if (!confirm("Are you sure you want to delete this dialogue proposal?")) return;
    try {
      const res = await fetch(`/api/events/requests/${requestId}`, { method: "DELETE" });
      if (res.ok) {
        await loadAdminData();
      }
    } catch {
      alert("Network error deleting dialogue proposal");
    }
  }

  async function handleAddMedia(e: React.FormEvent) {
    e.preventDefault();
    setAddMediaLoading(true);
    setAddMediaError(null);
    try {
      const res = await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addMediaForm),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setAddMediaError(d.error || "Failed to publish media item.");
        return;
      }
      setShowAddMediaModal(false);
      setAddMediaForm({
        title: "",
        type: "ARTICLE",
        url: "",
        thumbnail: "/pictures/roundtable-overhead.jpeg",
        author: "NYBF Policy Research Desk",
        location: "Nairobi",
        summary: "",
        body: "",
        tag: "Policy Analysis",
      });
      await loadAdminData();
    } catch {
      setAddMediaError("Network error publishing media item.");
    } finally {
      setAddMediaLoading(false);
    }
  }

  async function handleDeleteMedia(id: string) {
    if (!confirm("Are you sure you want to permanently delete this media asset?")) return;
    try {
      const res = await fetch(`/api/media/${id}`, { method: "DELETE" });
      if (res.ok) {
        await loadAdminData();
      } else {
        alert("Failed to delete media asset");
      }
    } catch {
      alert("Network error deleting media asset");
    }
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
                /* ADMIN SIGN IN FORM (WITH OTP 2FA) */
                otpStep ? (
                  <form onSubmit={handleLogin} className="mt-6 space-y-4">
                    <div className="rounded-2xl border border-teal-500/30 bg-teal-500/10 p-4 text-xs">
                      <div className="flex items-center gap-2 text-brand font-bold text-sm">
                        <ShieldCheck size={18} />
                        <span>Two-Factor Security Passcode</span>
                      </div>
                      <p className="mt-1 text-muted">
                        {otpMessage || `Enter the 6-digit passcode sent to ${loginEmail}.`}
                      </p>
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-ink/80">
                        6-Digit Security Passcode
                      </label>
                      <div className="relative mt-1">
                        <input
                          type="text"
                          required
                          maxLength={6}
                          autoFocus
                          placeholder="123456"
                          value={loginOtp}
                          onChange={(e) => setLoginOtp(e.target.value.replace(/\D/g, ""))}
                          className="w-full rounded-2xl border border-line bg-bg p-3.5 pl-10 text-center font-mono text-lg font-bold tracking-widest text-ink placeholder:text-muted/60 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
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
                      disabled={loginLoading || loginOtp.length < 6}
                      className="flex w-full items-center justify-center gap-2 rounded-full bg-brand py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-brand/25 transition-all hover:bg-brand-light active:scale-95 disabled:opacity-50"
                    >
                      {loginLoading ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          <span>Verifying Passcode…</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck size={14} />
                          <span>Verify Passcode &amp; Enter Dashboard</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center justify-between pt-2 text-xs">
                      <button
                        type="button"
                        onClick={() => {
                          setOtpStep(false);
                          setLoginOtp("");
                          setLoginError(null);
                        }}
                        className="text-muted hover:text-brand"
                      >
                        &larr; Re-enter email / password
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          setLoginLoading(true);
                          try {
                            const res = await fetch("/api/auth/otp", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ email: loginEmail, password: loginPassword }),
                            });
                            const data = await res.json().catch(() => ({}));
                            setOtpMessage(data.message || "A fresh 6-digit code has been dispatched to your email.");
                          } catch {
                            setLoginError("Failed to resend passcode.");
                          } finally {
                            setLoginLoading(false);
                          }
                        }}
                        className="font-bold text-brand hover:underline"
                      >
                        Resend Code
                      </button>
                    </div>
                  </form>
                ) : (
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
                )
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

            </div>
          </div>
        </section>
      </main>
    );
  }

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
              { id: "members", label: `Members (${totalMembersCount > 1000 ? Math.round(totalMembersCount / 1000) + "K" : totalMembersCount})`, icon: Users },
              { id: "events", label: `Events (${events.length})`, icon: Calendar },
              { id: "requests", label: `Dialogue Requests (${eventRequests.length})`, icon: Sparkles },
              { id: "opportunities", label: `Opportunities (${opportunities.length})`, icon: Briefcase },
              { id: "polls", label: `Polls (${polls.length})`, icon: TrendingUp },
              { id: "media", label: `Media (${mediaItems.length})`, icon: Radio },
              { id: "ideas", label: `Policy Proposals (${ideas.length})`, icon: Lightbulb },
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

            {/* Devolved County Engagement Summary */}
            <div className="rounded-3xl border border-line bg-surface p-6 sm:p-8 shadow-sm">
              <h3 className="font-serif text-xl font-bold text-ink">Devolved County Engagement Structure</h3>
              <p className="mt-1 text-xs text-muted">Active coordination structure and budget desk representation across all Kenyan regions.</p>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-line bg-bg p-4">
                  <div className="text-xs font-bold text-muted uppercase">Nairobi & Central Region</div>
                  <div className="mt-1 font-serif text-2xl font-bold text-brand">10 County Chapters</div>
                  <div className="text-[11px] text-muted">Active Secretariat Coordination</div>
                </div>
                <div className="rounded-2xl border border-line bg-bg p-4">
                  <div className="text-xs font-bold text-muted uppercase">Rift Valley & Western</div>
                  <div className="mt-1 font-serif text-2xl font-bold text-brand">18 County Chapters</div>
                  <div className="text-[11px] text-muted">Regional Public Consultations</div>
                </div>
                <div className="rounded-2xl border border-line bg-bg p-4">
                  <div className="text-xs font-bold text-muted uppercase">Coast, Eastern & North Eastern</div>
                  <div className="mt-1 font-serif text-2xl font-bold text-brand">19 County Chapters</div>
                  <div className="text-[11px] text-muted">Grassroots Budget Tracking</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. MEMBERS */}
        {tab === "members" && (
          <div className="rounded-3xl border border-line bg-surface p-6 sm:p-8 shadow-sm animate-fade-in-up">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-ink">Registered Members</h3>
                <p className="text-xs text-muted">Manage member permissions, promote moderators, or assign devolution leads.</p>
              </div>
              <div className="relative w-full sm:w-72">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="text"
                  placeholder="Search name, email, county..."
                  value={memberSearchQuery}
                  onChange={(e) => setMemberSearchQuery(e.target.value)}
                  className="w-full rounded-full border border-line bg-bg py-2 pl-9 pr-4 text-xs text-ink outline-none focus:border-brand"
                />
              </div>
            </div>

            {members.length === 0 ? (
              <div className="py-12 text-center text-xs text-muted">
                No registered members found in the database.
              </div>
            ) : (
              <div className="mt-6 overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-line text-muted">
                      <th className="pb-3 font-bold uppercase">Member</th>
                      <th className="pb-3 font-bold uppercase">County & Constituency</th>
                      <th className="pb-3 font-bold uppercase">Civic Role</th>
                      <th className="pb-3 font-bold uppercase">System Role</th>
                      <th className="pb-3 font-bold uppercase">Joined</th>
                      <th className="pb-3 font-bold uppercase text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {members
                      .filter((m) => {
                        const q = memberSearchQuery.toLowerCase();
                        return (
                          m.name?.toLowerCase().includes(q) ||
                          (m.email && m.email.toLowerCase().includes(q)) ||
                          m.county?.toLowerCase().includes(q) ||
                          (m.constituency && m.constituency.toLowerCase().includes(q))
                        );
                      })
                      .map((m) => (
                        <tr key={m.id} className="hover:bg-bg/50">
                          <td className="py-3.5 font-semibold text-ink">
                            <div>{m.name}</div>
                            {m.email && <div className="text-[11px] font-normal text-muted">{m.email}</div>}
                          </td>
                          <td className="py-3.5 text-muted">
                            <div>{m.county} County</div>
                            <div className="text-[11px] text-muted/80">{m.constituency || "—"}</div>
                          </td>
                          <td className="py-3.5 text-muted">{m.civicRole || "Member"}</td>
                          <td className="py-3.5">
                            <div className="flex items-center gap-2">
                              <select
                                value={m.role}
                                disabled={updatingUserRoleId === m.id}
                                onChange={(e) => handleUpdateUserRole(m.id, e.target.value)}
                                className={`rounded-lg border px-2.5 py-1 text-xs font-bold uppercase tracking-wider outline-none cursor-pointer ${
                                  m.role === "ADMIN"
                                    ? "border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-400"
                                    : m.role === "COORDINATOR"
                                    ? "border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400"
                                    : m.role === "MODERATOR"
                                    ? "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                    : "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                }`}
                              >
                                <option value="MEMBER">MEMBER</option>
                                <option value="MODERATOR">MODERATOR</option>
                                <option value="COORDINATOR">COORDINATOR</option>
                                <option value="ADMIN">ADMIN</option>
                              </select>
                              {updatingUserRoleId === m.id && <Loader2 size={13} className="animate-spin text-brand" />}
                            </div>
                          </td>
                          <td className="py-3.5 text-muted">{m.joined}</td>
                          <td className="py-3.5 text-right">
                            <button
                              type="button"
                              onClick={() => handleDeleteUser(m.id, m.name)}
                              className="rounded-lg p-1.5 text-muted hover:text-rose-600 hover:bg-rose-500/10 transition"
                              title="Delete Member Account"
                            >
                              <Trash2 size={15} />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* 3. EVENTS */}
        {tab === "events" && (
          <div className="rounded-3xl border border-line bg-surface p-6 sm:p-8 shadow-sm animate-fade-in-up">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-ink">Public Townhalls & Consultations</h3>
                <p className="text-xs text-muted">Create and manage physical hearings and virtual budget forums.</p>
              </div>
              <button
                onClick={() => { setShowAddEventModal(true); setAddEventError(null); }}
                className="flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-xs font-bold uppercase text-white hover:bg-brand-light transition shadow-sm"
              >
                <Plus size={14} />
                <span>Add New Event</span>
              </button>
            </div>

            {events.length === 0 ? (
              <div className="py-12 text-center text-xs text-muted">
                No public hearings or townhalls currently scheduled. Click &quot;Add New Event&quot; to publish one.
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {events.map((evt) => (
                  <div key={evt.id} className="p-4 rounded-2xl border border-line bg-bg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-4">
                      {evt.photo && (
                        <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-xl">
                          <Image src={evt.photo} alt={evt.title} fill className="object-cover" />
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-serif text-base font-bold text-ink">{evt.title}</span>
                          {evt.tag && (
                            <span className="rounded-full bg-brand/10 px-2.5 py-0.5 text-[10px] font-bold text-brand uppercase">
                              {evt.tag}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-muted">{evt.location} • {evt.date}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-brand">
                        {evt.registered} / {evt.capacity} Seats Filled
                      </span>
                      <button
                        onClick={() => { setEditingEvent({ ...evt, rawDate: evt.rawDate || evt.date }); setEditEventError(null); }}
                        className="rounded-lg border border-line px-3 py-1.5 text-xs font-bold text-muted hover:text-ink hover:bg-surface transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(evt.id)}
                        className="rounded-lg p-1.5 text-muted hover:text-rose-600 hover:bg-rose-500/10 transition"
                        title="Delete Event"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 4. CONSTITUENCY DIALOGUE REQUESTS */}
        {tab === "requests" && (
          <div className="rounded-3xl border border-line bg-surface p-6 sm:p-8 shadow-sm animate-fade-in-up">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-ink">Constituency Dialogue Requests</h3>
                <p className="text-xs text-muted">Review proposals from grassroots conveners seeking to organize youth budget townhalls in their wards and constituencies.</p>
              </div>
              <span className="text-xs font-bold text-muted">{eventRequests.length} Total Requests</span>
            </div>

            {eventRequests.length === 0 ? (
              <div className="py-12 text-center text-xs text-muted">
                No grassroots dialogue requests submitted yet. Members can propose local townhalls via the Events page.
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {eventRequests.map((req) => (
                  <div key={req.id} className="p-5 rounded-2xl border border-line bg-bg flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-serif text-base font-bold text-ink">{req.title}</span>
                        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                          req.status === "APPROVED"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                            : req.status === "REJECTED"
                            ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                            : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                        }`}>
                          {req.status}
                        </span>
                      </div>
                      <div className="text-xs text-muted flex flex-wrap items-center gap-3">
                        <span>Convener: <strong className="text-ink">{req.name}</strong></span>
                        <span>•</span>
                        <span>{req.county} County ({req.constituency})</span>
                        <span>•</span>
                        <span>Proposed Date: <strong>{req.proposedDate || "TBD"}</strong></span>
                      </div>
                      <p className="text-xs text-muted leading-relaxed line-clamp-2">{req.description}</p>
                      {(req.email || req.phone) && (
                        <div className="text-[11px] text-muted flex items-center gap-3 pt-1">
                          {req.email && <span>Email: {req.email}</span>}
                          {req.phone && <span>Phone: {req.phone}</span>}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {req.status === "PENDING" && (
                        <>
                          <button
                            onClick={() => handleUpdateRequestStatus(req.id, "APPROVED")}
                            className="rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-700 dark:text-emerald-300 px-3.5 py-1.5 text-xs font-bold transition"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleUpdateRequestStatus(req.id, "REJECTED")}
                            className="rounded-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-700 dark:text-rose-300 px-3.5 py-1.5 text-xs font-bold transition"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDeleteRequest(req.id)}
                        className="rounded-lg p-2 text-muted hover:text-rose-600 hover:bg-rose-500/10 transition"
                        title="Delete Dialogue Proposal"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 5. OPPORTUNITIES */}
        {tab === "opportunities" && (
          <div className="rounded-3xl border border-line bg-surface p-6 sm:p-8 shadow-sm animate-fade-in-up">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-ink">Economic Opportunities & Grants</h3>
                <p className="text-xs text-muted">Manage economic youth opportunities, fellowships, and enterprise funds.</p>
              </div>
              <button
                onClick={() => { setShowAddOppModal(true); setAddOppError(null); }}
                className="flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-xs font-bold uppercase text-white hover:bg-brand-light transition shadow-sm"
              >
                <Plus size={14} />
                <span>Post Opportunity</span>
              </button>
            </div>

            {opportunities.length === 0 ? (
              <div className="py-12 text-center text-xs text-muted">
                No opportunities currently active. Click &quot;Post Opportunity&quot; to list a new fellowship, grant, or job.
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {opportunities.map((opp) => (
                  <div key={opp.id} className="p-4 rounded-2xl border border-line bg-bg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif text-base font-bold text-ink">{opp.title}</span>
                        <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-bold text-brand uppercase">
                          {opp.type}
                        </span>
                      </div>
                      <div className="text-xs text-muted mt-0.5">
                        {opp.location || "Nairobi / Hybrid"} • Deadline: {opp.deadline}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        opp.status === "Live"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "bg-muted/10 text-muted"
                      }`}>
                        {opp.status}
                      </span>
                      <button
                        onClick={() => { setEditingOpportunity({ ...opp, rawDeadline: opp.rawDeadline || opp.deadline }); setEditOppError(null); }}
                        className="rounded-lg border border-line px-3 py-1.5 text-xs font-bold text-muted hover:text-ink hover:bg-surface transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteOpp(opp.id)}
                        className="rounded-lg p-1.5 text-muted hover:text-rose-600 hover:bg-rose-500/10 transition"
                        title="Delete Opportunity"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 6. POLLS */}
        {tab === "polls" && (
          <div className="rounded-3xl border border-line bg-surface p-6 sm:p-8 shadow-sm animate-fade-in-up">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-ink">National Youth Pulse Consultations</h3>
                <p className="text-xs text-muted">Inspect live voting breakdowns, monitor priority percentages, or launch new consultations.</p>
              </div>
              <button
                onClick={() => { setShowAddPollModal(true); setAddPollError(null); }}
                className="flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-xs font-bold uppercase text-white hover:bg-brand-light transition shadow-sm"
              >
                <Plus size={14} />
                <span>Create New Poll</span>
              </button>
            </div>

            {polls.length === 0 ? (
              <div className="py-12 text-center text-xs text-muted">
                No consultation polls active. Click &quot;Create New Poll&quot; to launch citizen pulse voting.
              </div>
            ) : (
              <div className="mt-6 space-y-6">
                {polls.map((p) => (
                  <div key={p.id} className="p-5 rounded-2xl border border-line bg-bg">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-serif text-base font-bold text-ink">{p.question}</span>
                          {p.category && (
                            <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-bold text-brand uppercase">
                              {p.category}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-muted mt-0.5">{p.votes.toLocaleString()} Citizen Votes Recorded</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          {p.active ? "Live Active" : "Archived"}
                        </span>
                        <button
                          onClick={() => handleDeletePoll(p.id)}
                          className="rounded-lg p-1.5 text-muted hover:text-rose-600 hover:bg-rose-500/10 transition"
                          title="Delete Poll"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                    {/* Option Breakdown */}
                    {p.options && p.options.length > 0 && (
                      <div className="mt-4 space-y-2.5">
                        {p.options.map((opt) => (
                          <div key={opt.id} className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-semibold text-ink">{opt.label}</span>
                              <span className="text-muted font-mono">{opt.votes} votes ({opt.percentage || 0}%)</span>
                            </div>
                            <div className="h-2 w-full overflow-hidden rounded-full bg-surface-soft">
                              <div
                                className="h-full rounded-full bg-brand transition-all duration-500"
                                style={{ width: `${opt.percentage || 0}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 7. MEDIA MANAGER */}
        {tab === "media" && (
          <div className="rounded-3xl border border-line bg-surface p-6 sm:p-8 shadow-sm animate-fade-in-up">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-ink">Media & Broadcast Manager</h3>
                <p className="text-xs text-muted">Publish policy analysis articles, townhall video recordings, and civic podcast episodes.</p>
              </div>
              <button
                onClick={() => { setShowAddMediaModal(true); setAddMediaError(null); }}
                className="flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-xs font-bold uppercase text-white hover:bg-brand-light transition shadow-sm"
              >
                <Plus size={14} />
                <span>Publish Media Item</span>
              </button>
            </div>

            {mediaItems.length === 0 ? (
              <div className="py-12 text-center text-xs text-muted">
                No media items published yet. Click &quot;Publish Media Item&quot; to post an article, video, or podcast episode.
              </div>
            ) : (
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {mediaItems.map((item) => (
                  <div key={item.id} className="p-4 rounded-2xl border border-line bg-bg flex flex-col justify-between">
                    <div>
                      {item.thumbnail && (
                        <div className="relative aspect-video w-full overflow-hidden rounded-xl mb-3">
                          <Image src={item.thumbnail} alt={item.title} fill className="object-cover" />
                          <span className="absolute top-2 left-2 rounded-full bg-black/75 px-2.5 py-0.5 text-[10px] font-bold text-white uppercase">
                            {item.type}
                          </span>
                        </div>
                      )}
                      <div className="font-serif text-sm font-bold text-ink line-clamp-2">{item.title}</div>
                      <div className="text-[11px] text-muted mt-1">
                        {item.author || "NYBF Desk"} • {item.createdAt}
                      </div>
                      {item.summary && (
                        <p className="text-xs text-muted mt-2 line-clamp-2">{item.summary}</p>
                      )}
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-line pt-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand">{item.tag || item.type}</span>
                      <button
                        onClick={() => handleDeleteMedia(item.id)}
                        className="rounded-lg p-1.5 text-muted hover:text-rose-600 hover:bg-rose-500/10 transition"
                        title="Delete Media Item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
              <button
                onClick={() => setShowMemorandumModal(true)}
                className="flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-xs font-bold uppercase text-white hover:bg-brand-light transition shadow-sm"
              >
                <Download size={14} />
                <span>Export Memorandum (PDF)</span>
              </button>
            </div>

            {ideas.length === 0 ? (
              <div className="py-12 text-center text-xs text-muted">
                No citizen policy proposals submitted yet. Proposals submitted from Youth Voice will appear here for review.
              </div>
            ) : (
              <div className="mt-6 divide-y divide-line">
                {ideas.map((idea) => (
                  <div key={idea.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="font-serif text-base font-bold text-ink">{idea.title}</div>
                      <div className="text-xs text-muted">Author: {idea.author} • Category: {idea.category}</div>
                    </div>
                    <div className="flex items-center gap-2.5 self-start sm:self-center">
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                        idea.status.includes("Approved")
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                          : idea.status.includes("Rejected")
                          ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                      }`}>
                        {idea.status}
                      </span>
                      {idea.status === "Under Review" && (
                        <div className="flex items-center gap-1.5 ml-1">
                          <button
                            onClick={() => handleModerateIdea(idea.id, "APPROVED")}
                            disabled={moderatingId === idea.id}
                            className="rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-700 dark:text-emerald-300 px-3 py-1 text-xs font-bold transition disabled:opacity-50"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleModerateIdea(idea.id, "REJECTED")}
                            disabled={moderatingId === idea.id}
                            className="rounded-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-700 dark:text-rose-300 px-3 py-1 text-xs font-bold transition disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* MODAL: ADD EVENT */}
      {showAddEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-lg animate-pop-in rounded-3xl border border-line bg-surface p-6 sm:p-8 text-ink shadow-2xl overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setShowAddEventModal(false)}
              className="absolute top-5 right-5 rounded-full p-2 text-muted hover:bg-brand/10 hover:text-ink"
            >
              <X size={18} />
            </button>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand">
              <Calendar size={15} />
              <span>Schedule Event or Hearing</span>
            </div>
            <h3 className="mt-2 font-serif text-2xl font-bold text-ink">Add New Event</h3>

            {addEventError && (
              <div className="mt-3 flex items-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs font-semibold text-rose-600 dark:text-rose-400">
                <AlertTriangle size={15} className="shrink-0" />
                <span>{addEventError}</span>
              </div>
            )}

            <form onSubmit={handleAddEvent} className="mt-5 space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-ink/80">Event Title</label>
                <input
                  required
                  placeholder="e.g. County Youth Budget Hearing 2026"
                  value={addEventForm.title}
                  onChange={(e) => setAddEventForm({ ...addEventForm, title: e.target.value })}
                  className="mt-1 w-full rounded-2xl border border-line bg-bg p-3 text-xs sm:text-sm text-ink outline-none focus:border-brand"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-ink/80">Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={addEventForm.date}
                    onChange={(e) => setAddEventForm({ ...addEventForm, date: e.target.value })}
                    className="mt-1 w-full rounded-2xl border border-line bg-bg p-3 text-xs text-ink outline-none focus:border-brand"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-ink/80">Location / County</label>
                  <input
                    required
                    placeholder="e.g. Nairobi, Town Hall"
                    value={addEventForm.location}
                    onChange={(e) => setAddEventForm({ ...addEventForm, location: e.target.value })}
                    className="mt-1 w-full rounded-2xl border border-line bg-bg p-3 text-xs sm:text-sm text-ink outline-none focus:border-brand"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-ink/80">Category / Tag</label>
                  <input
                    placeholder="e.g. Public Hearing"
                    value={addEventForm.tag}
                    onChange={(e) => setAddEventForm({ ...addEventForm, tag: e.target.value })}
                    className="mt-1 w-full rounded-2xl border border-line bg-bg p-3 text-xs text-ink outline-none focus:border-brand"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-ink/80">Seat Capacity</label>
                  <input
                    type="number"
                    min={10}
                    value={addEventForm.capacity}
                    onChange={(e) => setAddEventForm({ ...addEventForm, capacity: Number(e.target.value) })}
                    className="mt-1 w-full rounded-2xl border border-line bg-bg p-3 text-xs text-ink outline-none focus:border-brand"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-ink/80">Photo / Banner URL</label>
                <input
                  placeholder="/pictures/stage-presentation.jpeg"
                  value={addEventForm.photo}
                  onChange={(e) => setAddEventForm({ ...addEventForm, photo: e.target.value })}
                  className="mt-1 w-full rounded-2xl border border-line bg-bg p-3 text-xs sm:text-sm text-ink outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-ink/80">Description & Agenda</label>
                <textarea
                  rows={3}
                  placeholder="Outline the budget consultation agenda..."
                  value={addEventForm.description}
                  onChange={(e) => setAddEventForm({ ...addEventForm, description: e.target.value })}
                  className="mt-1 w-full rounded-2xl border border-line bg-bg p-3 text-xs sm:text-sm text-ink outline-none focus:border-brand"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddEventModal(false)}
                  className="rounded-full border border-line px-5 py-2.5 text-xs font-bold uppercase text-muted hover:text-ink"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addEventLoading}
                  className="flex items-center gap-2 rounded-full bg-brand px-6 py-2.5 text-xs font-bold uppercase text-white hover:bg-brand-light disabled:opacity-50"
                >
                  {addEventLoading && <Loader2 size={14} className="animate-spin" />}
                  <span>Publish Event</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT / DELETE EVENT */}
      {editingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-lg animate-pop-in rounded-3xl border border-line bg-surface p-6 sm:p-8 text-ink shadow-2xl overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setEditingEvent(null)}
              className="absolute top-5 right-5 rounded-full p-2 text-muted hover:bg-brand/10 hover:text-ink"
            >
              <X size={18} />
            </button>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand">
              <Calendar size={15} />
              <span>Modify Consultation Details</span>
            </div>
            <h3 className="mt-2 font-serif text-2xl font-bold text-ink">Edit Event</h3>

            {editEventError && (
              <div className="mt-3 flex items-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs font-semibold text-rose-600 dark:text-rose-400">
                <AlertTriangle size={15} className="shrink-0" />
                <span>{editEventError}</span>
              </div>
            )}

            <form onSubmit={handleUpdateEvent} className="mt-5 space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-ink/80">Event Title</label>
                <input
                  required
                  value={editingEvent.title}
                  onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                  className="mt-1 w-full rounded-2xl border border-line bg-bg p-3 text-xs sm:text-sm text-ink outline-none focus:border-brand"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-ink/80">Location / County</label>
                  <input
                    required
                    value={editingEvent.location}
                    onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
                    className="mt-1 w-full rounded-2xl border border-line bg-bg p-3 text-xs sm:text-sm text-ink outline-none focus:border-brand"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-ink/80">Capacity</label>
                  <input
                    type="number"
                    min={10}
                    value={editingEvent.capacity}
                    onChange={(e) => setEditingEvent({ ...editingEvent, capacity: Number(e.target.value) })}
                    className="mt-1 w-full rounded-2xl border border-line bg-bg p-3 text-xs text-ink outline-none focus:border-brand"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-ink/80">Tag / Category</label>
                  <input
                    placeholder="e.g. Public Hearing"
                    value={editingEvent.tag || ""}
                    onChange={(e) => setEditingEvent({ ...editingEvent, tag: e.target.value })}
                    className="mt-1 w-full rounded-2xl border border-line bg-bg p-3 text-xs sm:text-sm text-ink outline-none focus:border-brand"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-ink/80">Photo / Banner URL</label>
                  <input
                    placeholder="/pictures/stage-presentation.jpeg"
                    value={editingEvent.photo || ""}
                    onChange={(e) => setEditingEvent({ ...editingEvent, photo: e.target.value })}
                    className="mt-1 w-full rounded-2xl border border-line bg-bg p-3 text-xs sm:text-sm text-ink outline-none focus:border-brand"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-ink/80">Description & Agenda</label>
                <textarea
                  rows={3}
                  value={editingEvent.description || ""}
                  onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                  className="mt-1 w-full rounded-2xl border border-line bg-bg p-3 text-xs sm:text-sm text-ink outline-none focus:border-brand"
                />
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleDeleteEvent(editingEvent.id)}
                  disabled={deleteEventLoading}
                  className="flex items-center gap-1.5 rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 px-4 py-2 text-xs font-bold transition disabled:opacity-50"
                >
                  <Trash2 size={14} />
                  <span>Delete</span>
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingEvent(null)}
                    className="rounded-full border border-line px-5 py-2.5 text-xs font-bold uppercase text-muted hover:text-ink"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={editEventLoading}
                    className="flex items-center gap-2 rounded-full bg-brand px-6 py-2.5 text-xs font-bold uppercase text-white hover:bg-brand-light disabled:opacity-50"
                  >
                    {editEventLoading && <Loader2 size={14} className="animate-spin" />}
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: POST OPPORTUNITY */}
      {showAddOppModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-lg animate-pop-in rounded-3xl border border-line bg-surface p-6 sm:p-8 text-ink shadow-2xl overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setShowAddOppModal(false)}
              className="absolute top-5 right-5 rounded-full p-2 text-muted hover:bg-brand/10 hover:text-ink"
            >
              <X size={18} />
            </button>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand">
              <Briefcase size={15} />
              <span>Economic Inclusion & Grants</span>
            </div>
            <h3 className="mt-2 font-serif text-2xl font-bold text-ink">Post Opportunity</h3>

            {addOppError && (
              <div className="mt-3 flex items-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs font-semibold text-rose-600 dark:text-rose-400">
                <AlertTriangle size={15} className="shrink-0" />
                <span>{addOppError}</span>
              </div>
            )}

            <form onSubmit={handleAddOpp} className="mt-5 space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-ink/80">Opportunity Title</label>
                <input
                  required
                  placeholder="e.g. County Agri-Enterprise Seed Fund"
                  value={addOppForm.title}
                  onChange={(e) => setAddOppForm({ ...addOppForm, title: e.target.value })}
                  className="mt-1 w-full rounded-2xl border border-line bg-bg p-3 text-xs sm:text-sm text-ink outline-none focus:border-brand"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-ink/80">Type</label>
                  <select
                    value={addOppForm.type}
                    onChange={(e) => setAddOppForm({ ...addOppForm, type: e.target.value })}
                    className="mt-1 w-full rounded-2xl border border-line bg-bg p-3 text-xs text-ink outline-none focus:border-brand"
                  >
                    <option value="FELLOWSHIP">Fellowship</option>
                    <option value="GRANT">Grant</option>
                    <option value="INTERNSHIP">Internship</option>
                    <option value="PROGRAMME">Programme / Bootcamp</option>
                    <option value="JOB">Job</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-ink/80">Location / County</label>
                  <input
                    required
                    placeholder="e.g. All 47 Counties / Hybrid"
                    value={addOppForm.location}
                    onChange={(e) => setAddOppForm({ ...addOppForm, location: e.target.value })}
                    className="mt-1 w-full rounded-2xl border border-line bg-bg p-3 text-xs sm:text-sm text-ink outline-none focus:border-brand"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-ink/80">Deadline</label>
                  <input
                    type="date"
                    required
                    value={addOppForm.deadline}
                    onChange={(e) => setAddOppForm({ ...addOppForm, deadline: e.target.value })}
                    className="mt-1 w-full rounded-2xl border border-line bg-bg p-3 text-xs text-ink outline-none focus:border-brand"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-ink/80">Stipend / Value</label>
                  <input
                    placeholder="e.g. Ksh 45,000 / month"
                    value={addOppForm.stipend}
                    onChange={(e) => setAddOppForm({ ...addOppForm, stipend: e.target.value })}
                    className="mt-1 w-full rounded-2xl border border-line bg-bg p-3 text-xs text-ink outline-none focus:border-brand"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-ink/80">Application URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={addOppForm.applyUrl}
                  onChange={(e) => setAddOppForm({ ...addOppForm, applyUrl: e.target.value })}
                  className="mt-1 w-full rounded-2xl border border-line bg-bg p-3 text-xs text-ink outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-ink/80">Description & Eligibility</label>
                <textarea
                  rows={3}
                  placeholder="Eligibility requirements and role details..."
                  value={addOppForm.description}
                  onChange={(e) => setAddOppForm({ ...addOppForm, description: e.target.value })}
                  className="mt-1 w-full rounded-2xl border border-line bg-bg p-3 text-xs sm:text-sm text-ink outline-none focus:border-brand"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddOppModal(false)}
                  className="rounded-full border border-line px-5 py-2.5 text-xs font-bold uppercase text-muted hover:text-ink"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addOppLoading}
                  className="flex items-center gap-2 rounded-full bg-brand px-6 py-2.5 text-xs font-bold uppercase text-white hover:bg-brand-light disabled:opacity-50"
                >
                  {addOppLoading && <Loader2 size={14} className="animate-spin" />}
                  <span>Publish Opportunity</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT OPPORTUNITY */}
      {editingOpportunity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-lg animate-pop-in rounded-3xl border border-line bg-surface p-6 sm:p-8 text-ink shadow-2xl overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setEditingOpportunity(null)}
              className="absolute top-5 right-5 rounded-full p-2 text-muted hover:bg-brand/10 hover:text-ink"
            >
              <X size={18} />
            </button>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand">
              <Briefcase size={15} />
              <span>Modify Opportunity</span>
            </div>
            <h3 className="mt-2 font-serif text-2xl font-bold text-ink">Edit Opportunity</h3>

            {editOppError && (
              <div className="mt-3 flex items-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs font-semibold text-rose-600 dark:text-rose-400">
                <AlertTriangle size={15} className="shrink-0" />
                <span>{editOppError}</span>
              </div>
            )}

            <form onSubmit={handleUpdateOpp} className="mt-5 space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-ink/80">Opportunity Title</label>
                <input
                  required
                  value={editingOpportunity.title}
                  onChange={(e) => setEditingOpportunity({ ...editingOpportunity, title: e.target.value })}
                  className="mt-1 w-full rounded-2xl border border-line bg-bg p-3 text-xs sm:text-sm text-ink outline-none focus:border-brand"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-ink/80">Type</label>
                  <select
                    value={editingOpportunity.type}
                    onChange={(e) => setEditingOpportunity({ ...editingOpportunity, type: e.target.value })}
                    className="mt-1 w-full rounded-2xl border border-line bg-bg p-3 text-xs text-ink outline-none focus:border-brand"
                  >
                    <option value="FELLOWSHIP">Fellowship</option>
                    <option value="GRANT">Grant</option>
                    <option value="INTERNSHIP">Internship</option>
                    <option value="PROGRAMME">Programme / Bootcamp</option>
                    <option value="JOB">Job</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-ink/80">Location / County</label>
                  <input
                    value={editingOpportunity.location || ""}
                    onChange={(e) => setEditingOpportunity({ ...editingOpportunity, location: e.target.value })}
                    className="mt-1 w-full rounded-2xl border border-line bg-bg p-3 text-xs sm:text-sm text-ink outline-none focus:border-brand"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-ink/80">Deadline</label>
                  <input
                    type="date"
                    value={editingOpportunity.rawDeadline || ""}
                    onChange={(e) => setEditingOpportunity({ ...editingOpportunity, rawDeadline: e.target.value })}
                    className="mt-1 w-full rounded-2xl border border-line bg-bg p-3 text-xs text-ink outline-none focus:border-brand"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-ink/80">Stipend / Value</label>
                  <input
                    value={editingOpportunity.stipend || ""}
                    onChange={(e) => setEditingOpportunity({ ...editingOpportunity, stipend: e.target.value })}
                    className="mt-1 w-full rounded-2xl border border-line bg-bg p-3 text-xs text-ink outline-none focus:border-brand"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-ink/80">Application URL</label>
                <input
                  type="url"
                  value={editingOpportunity.applyUrl || ""}
                  onChange={(e) => setEditingOpportunity({ ...editingOpportunity, applyUrl: e.target.value })}
                  className="mt-1 w-full rounded-2xl border border-line bg-bg p-3 text-xs text-ink outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-ink/80">Description & Eligibility</label>
                <textarea
                  rows={3}
                  value={editingOpportunity.description || ""}
                  onChange={(e) => setEditingOpportunity({ ...editingOpportunity, description: e.target.value })}
                  className="mt-1 w-full rounded-2xl border border-line bg-bg p-3 text-xs sm:text-sm text-ink outline-none focus:border-brand"
                />
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleDeleteOpp(editingOpportunity.id)}
                  className="flex items-center gap-1.5 rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 px-4 py-2 text-xs font-bold transition"
                >
                  <Trash2 size={14} />
                  <span>Delete</span>
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingOpportunity(null)}
                    className="rounded-full border border-line px-5 py-2.5 text-xs font-bold uppercase text-muted hover:text-ink"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={editOppLoading}
                    className="flex items-center gap-2 rounded-full bg-brand px-6 py-2.5 text-xs font-bold uppercase text-white hover:bg-brand-light disabled:opacity-50"
                  >
                    {editOppLoading && <Loader2 size={14} className="animate-spin" />}
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD MEDIA ITEM */}
      {showAddMediaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-lg animate-pop-in rounded-3xl border border-line bg-surface p-6 sm:p-8 text-ink shadow-2xl overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setShowAddMediaModal(false)}
              className="absolute top-5 right-5 rounded-full p-2 text-muted hover:bg-brand/10 hover:text-ink"
            >
              <X size={18} />
            </button>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand">
              <Radio size={15} />
              <span>Media & Broadcast Desk</span>
            </div>
            <h3 className="mt-2 font-serif text-2xl font-bold text-ink">Publish Media Item</h3>

            {addMediaError && (
              <div className="mt-3 flex items-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs font-semibold text-rose-600 dark:text-rose-400">
                <AlertTriangle size={15} className="shrink-0" />
                <span>{addMediaError}</span>
              </div>
            )}

            <form onSubmit={handleAddMedia} className="mt-5 space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-ink/80">Media Title *</label>
                <input
                  required
                  placeholder="e.g. Decoding the Finance Act 2026 for Digital Freelancers"
                  value={addMediaForm.title}
                  onChange={(e) => setAddMediaForm({ ...addMediaForm, title: e.target.value })}
                  className="mt-1 w-full rounded-2xl border border-line bg-bg p-3 text-xs sm:text-sm text-ink outline-none focus:border-brand"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-ink/80">Type</label>
                  <select
                    value={addMediaForm.type}
                    onChange={(e) => setAddMediaForm({ ...addMediaForm, type: e.target.value })}
                    className="mt-1 w-full rounded-2xl border border-line bg-bg p-3 text-xs text-ink outline-none focus:border-brand"
                  >
                    <option value="ARTICLE">Article / Policy Analysis</option>
                    <option value="VIDEO">Video Broadcast</option>
                    <option value="PODCAST">Civic Podcast</option>
                    <option value="IMAGE">Photo / Infographic</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-ink/80">Tag / Category</label>
                  <input
                    placeholder="e.g. Policy Analysis, Devolution"
                    value={addMediaForm.tag}
                    onChange={(e) => setAddMediaForm({ ...addMediaForm, tag: e.target.value })}
                    className="mt-1 w-full rounded-2xl border border-line bg-bg p-3 text-xs text-ink outline-none focus:border-brand"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-ink/80">Author / Speaker</label>
                  <input
                    placeholder="e.g. NYBF Policy Desk"
                    value={addMediaForm.author}
                    onChange={(e) => setAddMediaForm({ ...addMediaForm, author: e.target.value })}
                    className="mt-1 w-full rounded-2xl border border-line bg-bg p-3 text-xs text-ink outline-none focus:border-brand"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-ink/80">Location / County</label>
                  <input
                    placeholder="e.g. Nairobi Hub"
                    value={addMediaForm.location}
                    onChange={(e) => setAddMediaForm({ ...addMediaForm, location: e.target.value })}
                    className="mt-1 w-full rounded-2xl border border-line bg-bg p-3 text-xs text-ink outline-none focus:border-brand"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-ink/80">Thumbnail Image Path</label>
                  <input
                    placeholder="/pictures/roundtable-overhead.jpeg"
                    value={addMediaForm.thumbnail}
                    onChange={(e) => setAddMediaForm({ ...addMediaForm, thumbnail: e.target.value })}
                    className="mt-1 w-full rounded-2xl border border-line bg-bg p-3 text-xs text-ink outline-none focus:border-brand"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-ink/80">Video / Audio / Link URL</label>
                  <input
                    placeholder="https://..."
                    value={addMediaForm.url}
                    onChange={(e) => setAddMediaForm({ ...addMediaForm, url: e.target.value })}
                    className="mt-1 w-full rounded-2xl border border-line bg-bg p-3 text-xs text-ink outline-none focus:border-brand"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-ink/80">Summary / Abstract</label>
                <textarea
                  rows={2}
                  placeholder="Short 2-sentence summary..."
                  value={addMediaForm.summary}
                  onChange={(e) => setAddMediaForm({ ...addMediaForm, summary: e.target.value })}
                  className="mt-1 w-full rounded-2xl border border-line bg-bg p-3 text-xs text-ink outline-none focus:border-brand"
                />
              </div>

              {addMediaForm.type === "ARTICLE" && (
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-ink/80">Full Article Content (Markdown)</label>
                  <textarea
                    rows={4}
                    placeholder="Full article content in markdown..."
                    value={addMediaForm.body}
                    onChange={(e) => setAddMediaForm({ ...addMediaForm, body: e.target.value })}
                    className="mt-1 w-full rounded-2xl border border-line bg-bg p-3 text-xs font-mono text-ink outline-none focus:border-brand"
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddMediaModal(false)}
                  className="rounded-full border border-line px-5 py-2.5 text-xs font-bold uppercase text-muted hover:text-ink"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addMediaLoading}
                  className="flex items-center gap-2 rounded-full bg-brand px-6 py-2.5 text-xs font-bold uppercase text-white hover:bg-brand-light disabled:opacity-50"
                >
                  {addMediaLoading && <Loader2 size={14} className="animate-spin" />}
                  <span>Publish Media</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE NEW POLL */}
      {showAddPollModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-lg animate-pop-in rounded-3xl border border-line bg-surface p-6 sm:p-8 text-ink shadow-2xl overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setShowAddPollModal(false)}
              className="absolute top-5 right-5 rounded-full p-2 text-muted hover:bg-brand/10 hover:text-ink"
            >
              <X size={18} />
            </button>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand">
              <TrendingUp size={15} />
              <span>National Youth Pulse</span>
            </div>
            <h3 className="mt-2 font-serif text-2xl font-bold text-ink">Create New Poll</h3>

            {addPollError && (
              <div className="mt-3 flex items-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs font-semibold text-rose-600 dark:text-rose-400">
                <AlertTriangle size={15} className="shrink-0" />
                <span>{addPollError}</span>
              </div>
            )}

            <form onSubmit={handleAddPoll} className="mt-5 space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-ink/80">Poll Question</label>
                <input
                  required
                  placeholder="e.g. Which sector should receive the highest budget boost in FY 2026/27?"
                  value={addPollForm.question}
                  onChange={(e) => setAddPollForm({ ...addPollForm, question: e.target.value })}
                  className="mt-1 w-full rounded-2xl border border-line bg-bg p-3 text-xs sm:text-sm text-ink outline-none focus:border-brand"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-ink/80">Category</label>
                  <button
                    type="button"
                    onClick={() => setShowAddCategoryInput(!showAddCategoryInput)}
                    className="text-xs font-bold text-brand hover:underline"
                  >
                    {showAddCategoryInput ? "Choose Existing" : "+ New Category"}
                  </button>
                </div>
                {showAddCategoryInput ? (
                  <div className="mt-1 flex gap-2">
                    <input
                      placeholder="e.g. Climate Finance, Digital Taxation"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      className="w-full rounded-2xl border border-line bg-bg p-2.5 text-xs text-ink outline-none focus:border-brand"
                    />
                    <button
                      type="button"
                      onClick={handleAddPollCategory}
                      className="rounded-xl bg-brand px-3 text-xs font-bold text-white hover:bg-brand-light"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <select
                    value={addPollForm.category}
                    onChange={(e) => setAddPollForm({ ...addPollForm, category: e.target.value })}
                    className="mt-1 w-full rounded-2xl border border-line bg-bg p-3 text-xs text-ink outline-none focus:border-brand"
                  >
                    {pollCategories.length > 0 ? (
                      pollCategories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="National Fiscal Policy">National Fiscal Policy</option>
                        <option value="Devolution & County Budgets">Devolution & County Budgets</option>
                        <option value="Youth Employment & TVET">Youth Employment & TVET</option>
                        <option value="Digital Economy & Taxation">Digital Economy & Taxation</option>
                      </>
                    )}
                  </select>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-ink/80">Voting Options</label>
                  <button
                    type="button"
                    onClick={() => setAddPollForm({ ...addPollForm, options: [...addPollForm.options, ""] })}
                    className="text-xs font-bold text-brand hover:underline"
                  >
                    + Add Option
                  </button>
                </div>
                <div className="mt-2 space-y-2">
                  {addPollForm.options.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        required
                        placeholder={`Option ${idx + 1}`}
                        value={opt}
                        onChange={(e) => {
                          const updated = [...addPollForm.options];
                          updated[idx] = e.target.value;
                          setAddPollForm({ ...addPollForm, options: updated });
                        }}
                        className="w-full rounded-xl border border-line bg-bg p-2.5 text-xs text-ink outline-none focus:border-brand"
                      />
                      {addPollForm.options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => {
                            const updated = addPollForm.options.filter((_, i) => i !== idx);
                            setAddPollForm({ ...addPollForm, options: updated });
                          }}
                          className="rounded-lg p-2 text-rose-500 hover:bg-rose-500/10"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddPollModal(false)}
                  className="rounded-full border border-line px-5 py-2.5 text-xs font-bold uppercase text-muted hover:text-ink"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addPollLoading}
                  className="flex items-center gap-2 rounded-full bg-brand px-6 py-2.5 text-xs font-bold uppercase text-white hover:bg-brand-light disabled:opacity-50"
                >
                  {addPollLoading && <Loader2 size={14} className="animate-spin" />}
                  <span>Launch Poll</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EXPORT MEMORANDUM (PDF) */}
      {showMemorandumModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-3xl animate-pop-in rounded-3xl border border-line bg-surface p-6 sm:p-10 text-ink shadow-2xl overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setShowMemorandumModal(false)}
              className="absolute top-5 right-5 rounded-full p-2 text-muted hover:bg-brand/10 hover:text-ink"
            >
              <X size={20} />
            </button>

            {/* Memorandum Header */}
            <div className="border-b-2 border-brand pb-6 text-center">
              <div className="text-xs font-bold tracking-widest text-brand uppercase">
                Republic of Kenya • National Youth Budget Forum
              </div>
              <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-black text-ink">
                PARLIAMENTARY YOUTH BUDGET MEMORANDUM
              </h2>
              <p className="mt-1 text-xs text-muted">
                Presented before the Departmental Committee on Finance and National Planning • FY 2026/27 Budget Cycle
              </p>
              <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-brand/10 px-3 py-1 text-[11px] font-bold text-brand">
                <span>Verified Citizen Submissions: {ideas.filter((i) => i.status.includes("Approved")).length} Approved Policy Clauses</span>
              </div>
            </div>

            {/* Submissions List */}
            <div className="mt-6 space-y-4">
              <h4 className="font-serif text-lg font-bold text-ink border-b border-line pb-2">
                Approved Youth Policy Proposals
              </h4>
              {ideas.filter((i) => i.status.includes("Approved")).length === 0 ? (
                <p className="py-6 text-center text-xs text-muted">
                  No proposals marked as &quot;Approved for Memorandum&quot; yet. Approve proposals in the &quot;Policy Proposals&quot; tab to include them.
                </p>
              ) : (
                ideas
                  .filter((i) => i.status.includes("Approved"))
                  .map((idea, idx) => (
                    <div key={idea.id} className="rounded-2xl border border-line bg-bg p-4">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-brand uppercase">
                          Clause {idx + 1}: {idea.category}
                        </span>
                        <span className="text-[11px] text-muted">Sponsored by {idea.author}</span>
                      </div>
                      <div className="mt-1 font-serif text-sm font-bold text-ink">{idea.title}</div>
                    </div>
                  ))
              )}
            </div>

            {/* Sign-off Block */}
            <div className="mt-8 border-t border-line pt-6">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="font-serif text-sm font-bold text-ink">Ougo Sam</div>
                  <div className="text-xs text-muted">Chairperson, NYBF National Board</div>
                </div>
                <div>
                  <div className="font-serif text-sm font-bold text-ink">Obade George</div>
                  <div className="text-xs text-muted">Head of Secretariat, NYBF</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-line pt-4">
              <button
                type="button"
                onClick={() => setShowMemorandumModal(false)}
                className="w-full sm:w-auto rounded-full border border-line px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-muted hover:text-ink transition"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-brand/20 hover:bg-brand-light transition"
              >
                <Download size={14} />
                <span>Print / Save as PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

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
