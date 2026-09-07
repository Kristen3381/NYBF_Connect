import { Router, Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";

const router = Router();

const createSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  category: z.string().optional(),
  userId: z.string().optional(),
});

// POST /api/ideas — submit policy idea
router.post("/", async (req: Request, res: Response) => {
  try {
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten().fieldErrors });
    }

    const userId = parsed.data.userId || (req.headers["x-user-id"] as string);
    if (!userId) {
      return res.status(401).json({ error: "Please sign in to submit a policy proposal." });
    }

    const { title, description, category } = parsed.data;
    const idea = await prisma.idea.create({
      data: {
        title,
        description,
        category: category || null,
        userId,
      },
    });

    return res.status(201).json({ idea });
  } catch (error) {
    console.error("[Ideas POST Error]:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET /api/ideas — list ideas
router.get("/", async (req: Request, res: Response) => {
  try {
    const fetchAll = req.query.all === "true";
    const userRole = (req.headers["x-user-role"] as string) || "";
    const userId = (req.headers["x-user-id"] as string) || (req.query.userId as string);

    if (fetchAll && userRole === "ADMIN") {
      const ideas = await prisma.idea.findMany({
        include: {
          user: {
            select: { name: true, county: true, email: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });
      return res.json({ ideas });
    }

    if (userId) {
      const ideas = await prisma.idea.findMany({
        where: {
          OR: [{ userId }, { status: "APPROVED" }],
        },
        include: {
          user: {
            select: { name: true, county: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });
      return res.json({ ideas });
    }

    const ideas = await prisma.idea.findMany({
      where: { status: "APPROVED" },
      include: {
        user: { select: { name: true, county: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return res.json({ ideas });
  } catch (error) {
    console.error("[Ideas GET Error]:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
