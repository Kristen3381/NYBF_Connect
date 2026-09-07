import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;

    if (!session || (role !== "ADMIN" && role !== "COORDINATOR")) {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const [
      totalMembers,
      totalVotes,
      totalIdeas,
      pendingIdeas,
      events,
      opportunities,
      polls,
      members,
      recentIdeas,
      auditLogs,
      eventRequests,
      mediaItems,
      pollCategories,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.vote.count(),
      prisma.idea.count(),
      prisma.idea.count({ where: { status: "PENDING" } }),
      prisma.event.findMany({
        include: { _count: { select: { registrations: true } } },
        orderBy: { date: "asc" },
      }),
      prisma.opportunity.findMany({
        orderBy: { createdAt: "desc" },
      }),
      prisma.poll.findMany({
        include: {
          options: {
            include: { _count: { select: { votes: true } } },
          },
          _count: { select: { votes: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          county: true,
          constituency: true,
          civicRole: true,
          role: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        take: 150,
      }),
      prisma.idea.findMany({
        include: {
          user: { select: { name: true, county: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.auditLog.findMany({
        include: {
          actor: { select: { name: true, role: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 30,
      }),
      prisma.eventRequest.findMany({
        orderBy: { createdAt: "desc" },
      }),
      prisma.mediaItem.findMany({
        orderBy: { createdAt: "desc" },
      }),
      prisma.pollCategory.findMany({
        orderBy: { name: "asc" },
      }),
    ]);

    return NextResponse.json({
      stats: {
        totalMembers,
        totalVotes,
        totalIdeas,
        pendingIdeas,
        totalRequests: eventRequests.length,
        totalMedia: mediaItems.length,
      },
      events: events.map((e) => ({
        id: e.id,
        title: e.title,
        description: e.description || "",
        location: e.location,
        photo: e.photo || "",
        tag: e.tag || "Public Hearing",
        date: e.date.toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" }),
        rawDate: e.date.toISOString().split("T")[0],
        registered: e._count.registrations,
        capacity: e.capacity || 100,
      })),
      opportunities: opportunities.map((o) => ({
        id: o.id,
        title: o.title,
        type: o.type,
        location: o.location || "Nairobi / Hybrid",
        stipend: o.stipend || "",
        applyUrl: o.applyUrl || "",
        description: o.description || "",
        deadline: o.deadline.toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" }),
        rawDeadline: o.deadline.toISOString().split("T")[0],
        applications: 0,
        expired: o.expired,
        status: o.expired ? "Expired" : "Live",
      })),
      polls: polls.map((p) => {
        const totalPollVotes = p._count.votes;
        return {
          id: p.id,
          question: p.question,
          category: p.category,
          votes: totalPollVotes,
          active: p.active,
          options: p.options.map((opt) => ({
            id: opt.id,
            label: opt.label,
            votes: opt._count.votes,
            percentage: totalPollVotes > 0 ? Math.round((opt._count.votes / totalPollVotes) * 100) : 0,
          })),
        };
      }),
      members: members.map((m) => ({
        id: m.id,
        name: m.name,
        email: m.email,
        phone: m.phone || "",
        county: m.county,
        constituency: m.constituency || "—",
        role: m.role,
        civicRole: m.civicRole || m.role,
        joined: m.createdAt.toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" }),
        status: "Active",
      })),
      ideas: recentIdeas.map((i) => ({
        id: i.id,
        title: i.title,
        author: i.user?.name || "Anonymous Member",
        category: i.category || "General",
        status: i.status === "APPROVED" ? "Approved for Memorandum" : i.status === "REJECTED" ? "Rejected" : "Under Review",
        rawStatus: i.status,
      })),
      eventRequests: eventRequests.map((r) => ({
        id: r.id,
        name: r.name,
        email: r.email || "",
        phone: r.phone || "",
        county: r.county || "—",
        constituency: r.constituency,
        title: r.title,
        description: r.description,
        proposedDate: r.proposedDate ? r.proposedDate.toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" }) : "TBD",
        status: r.status,
        adminNotes: r.adminNotes || "",
        createdAt: r.createdAt.toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" }),
      })),
      media: mediaItems.map((m) => ({
        id: m.id,
        title: m.title,
        type: m.type,
        url: m.url || "",
        thumbnail: m.thumbnail || "",
        author: m.author || "",
        location: m.location || "",
        summary: m.summary || "",
        body: m.body || "",
        tag: m.tag || "",
        createdAt: m.createdAt.toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" }),
      })),
      pollCategories: pollCategories.map((c) => c.name),
      auditLogs,
    });
  } catch (error) {
    console.error("[Admin Stats GET] error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
