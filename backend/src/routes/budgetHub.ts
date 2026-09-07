import { Router, Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";

const router = Router();

function getUserId(req: Request): string | null {
  return (req.headers["x-user-id"] as string) || (req.body?.userId as string) || null;
}

const progressSchema = z.object({
  moduleId: z.string().min(1),
  completed: z.boolean().default(true),
  userId: z.string().optional(),
});

// POST /api/budget-hub/progress
router.post("/progress", async (req: Request, res: Response) => {
  try {
    const parsed = progressSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten().fieldErrors });
    }

    const userId = parsed.data.userId || getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Please sign in to track module completion." });
    }

    const { moduleId, completed } = parsed.data;

    const mod = await prisma.budgetModule.findUnique({ where: { id: moduleId } });
    if (!mod) {
      return res.status(404).json({ error: "Module not found" });
    }

    const progress = await prisma.moduleProgress.upsert({
      where: {
        userId_moduleId: {
          userId,
          moduleId,
        },
      },
      update: {
        completed,
      },
      create: {
        userId,
        moduleId,
        completed,
      },
    });

    return res.status(200).json({ progress });
  } catch (error) {
    console.error("[Budget Hub Progress Error]:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
