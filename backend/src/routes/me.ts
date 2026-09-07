import { Router, Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";

const router = Router();

function getUserId(req: Request): string | null {
  return (req.headers["x-user-id"] as string) || (req.query.userId as string) || (req.body?.userId as string) || null;
}

// GET /api/me — fetch profile & participation records
router.get("/", async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        votes: {
          include: {
            poll: { select: { id: true, question: true, category: true } },
            option: { select: { id: true, label: true } },
          },
          orderBy: { createdAt: "desc" },
        },
        ideas: {
          orderBy: { createdAt: "desc" },
        },
        eventRegistrations: {
          include: {
            event: { select: { id: true, title: true, date: true, location: true } },
          },
          orderBy: { createdAt: "desc" },
        },
        moduleProgress: {
          where: { completed: true },
          include: {
            module: { select: { id: true, title: true, order: true } },
          },
          orderBy: { updatedAt: "desc" },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        county: user.county,
        constituency: user.constituency || "General Ward",
        civicRole: user.civicRole || "Young Professional / Citizen",
        role: user.role,
        createdAt: user.createdAt,
        votes: user.votes,
        ideas: user.ideas,
        eventRegistrations: user.eventRegistrations,
        moduleProgress: user.moduleProgress,
      },
    });
  } catch (error) {
    console.error("[Me GET Error]:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().min(9).optional(),
  county: z.string().min(2).optional(),
  constituency: z.string().optional(),
  civicRole: z.string().optional(),
});

// PATCH /api/me — update user profile
router.patch("/", async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const parsed = updateProfileSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten().fieldErrors });
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: parsed.data,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        county: true,
        constituency: true,
        civicRole: true,
        role: true,
      },
    });

    return res.json({ user: updated });
  } catch (error) {
    console.error("[Me PATCH Error]:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
