import { Router, Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";

const router = Router();

// Helper to extract actor from request (from header if proxied or body)
function getActor(req: Request) {
  const actorId = (req.headers["x-user-id"] as string) || (req.body?.actorId as string) || "";
  const actorRole = (req.headers["x-user-role"] as string) || (req.body?.actorRole as string) || "ADMIN";
  return { actorId, actorRole };
}

// GET /api/admin/stats
router.get("/stats", async (req: Request, res: Response) => {
  try {
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
        take: 100,
      }),
      prisma.idea.findMany({
        include: {
          user: {
            select: { name: true, county: true, constituency: true },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
      prisma.auditLog.findMany({
        include: {
          actor: {
            select: { name: true, email: true, role: true },
          },
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

    return res.json({
      stats: {
        totalMembers,
        totalVotes,
        totalIdeas,
        pendingIdeas,
      },
      events,
      opportunities,
      polls,
      members,
      ideas: recentIdeas,
      auditLogs,
      eventRequests,
      media: mediaItems,
      pollCategories: pollCategories.map((c) => c.name),
    });
  } catch (error) {
    console.error("[Admin Stats Error]:", error);
    return res.status(500).json({ error: "Failed to load admin statistics." });
  }
});

const moderateSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
  adminResponse: z.string().optional(),
});

// PATCH /api/admin/ideas/:ideaId
router.patch("/ideas/:ideaId", async (req: Request, res: Response) => {
  try {
    const { ideaId } = req.params;
    if (!ideaId) {
      return res.status(400).json({ error: "Idea ID is required" });
    }

    const parsed = moderateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }

    const idea = await prisma.idea.update({
      where: { id: ideaId },
      data: parsed.data,
    });

    const { actorId } = getActor(req);
    if (actorId) {
      await prisma.auditLog.create({
        data: {
          actorId,
          action: `IDEA_${parsed.data.status}`,
          targetId: idea.id,
        },
      });
    }

    return res.json({ idea });
  } catch (error) {
    console.error("[Admin Idea Moderation Error]:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

const roleSchema = z.object({
  role: z.enum(["MEMBER", "COORDINATOR", "MODERATOR", "ADMIN"]),
});

// PATCH /api/admin/users/:userId
router.patch("/users/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const parsed = roleSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten().fieldErrors });
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!targetUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { role: parsed.data.role },
      select: {
        id: true,
        name: true,
        email: true,
        county: true,
        constituency: true,
        civicRole: true,
        role: true,
        createdAt: true,
      },
    });

    const { actorId } = getActor(req);
    if (actorId) {
      await prisma.auditLog.create({
        data: {
          actorId,
          action: "USER_ROLE_UPDATED",
          targetId: userId,
          metadata: {
            previousRole: targetUser.role,
            newRole: parsed.data.role,
            targetEmail: targetUser.email,
          },
        },
      });
    }

    return res.json({ success: true, user: updated });
  } catch (error) {
    console.error("[Admin User PATCH Error]:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// DELETE /api/admin/users/:userId
router.delete("/users/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!targetUser) {
      return res.status(404).json({ error: "User not found" });
    }

    await prisma.auditLog.deleteMany({ where: { actorId: userId } });
    await prisma.user.delete({ where: { id: userId } });

    return res.json({ success: true, message: `Account ${targetUser.email} deleted.` });
  } catch (error) {
    console.error("[Admin User DELETE Error]:", error);
    return res.status(500).json({ error: "Failed to delete user account." });
  }
});

export default router;
