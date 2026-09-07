import { Router, Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";

const router = Router();

// Helper to extract user ID from header or body
function getUserId(req: Request): string | null {
  return (req.headers["x-user-id"] as string) || (req.body?.userId as string) || null;
}

// GET /api/polls — list active polls with options & vote counts
router.get("/", async (_req: Request, res: Response) => {
  try {
    const polls = await prisma.poll.findMany({
      where: { active: true },
      include: {
        options: {
          include: { _count: { select: { votes: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = polls.map((poll) => ({
      ...poll,
      options: poll.options.map((opt) => ({
        id: opt.id,
        pollId: opt.pollId,
        label: opt.label,
        votesCount: opt._count.votes,
      })),
    }));

    return res.json({ polls: formatted });
  } catch (error) {
    console.error("[Polls GET Error]:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

const createPollSchema = z.object({
  question: z.string().min(5, "Question must be at least 5 characters"),
  category: z.string().optional(),
  options: z.array(z.string().min(1, "Option text required")).min(2, "At least 2 options are required"),
});

// POST /api/polls — create new poll
router.post("/", async (req: Request, res: Response) => {
  try {
    const parsed = createPollSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten().fieldErrors });
    }

    const { question, category, options } = parsed.data;

    const poll = await prisma.poll.create({
      data: {
        question,
        category: category || null,
        options: {
          create: options.map((label) => ({ label })),
        },
      },
      include: {
        options: true,
      },
    });

    return res.status(201).json({ poll });
  } catch (error) {
    console.error("[Polls POST Error]:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET /api/polls/categories
router.get("/categories", async (_req: Request, res: Response) => {
  try {
    const categories = await prisma.pollCategory.findMany({
      orderBy: { name: "asc" },
    });
    return res.json({ categories: categories.map((c) => c.name) });
  } catch (error) {
    console.error("[Poll Categories GET Error]:", error);
    return res.status(500).json({ error: "Failed to load categories" });
  }
});

// POST /api/polls/categories
router.post("/categories", async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ error: "Category name is required" });
    }

    const category = await prisma.pollCategory.upsert({
      where: { name: name.trim() },
      update: {},
      create: { name: name.trim() },
    });

    return res.status(201).json({ category });
  } catch (error) {
    console.error("[Poll Categories POST Error]:", error);
    return res.status(500).json({ error: "Failed to create category" });
  }
});

// DELETE /api/polls/:pollId
router.delete("/:pollId", async (req: Request, res: Response) => {
  try {
    const { pollId } = req.params;
    await prisma.poll.delete({ where: { id: pollId } });
    return res.json({ success: true, message: "Poll deleted successfully" });
  } catch (error) {
    console.error("[Poll DELETE Error]:", error);
    return res.status(500).json({ error: "Failed to delete poll" });
  }
});

const voteSchema = z.object({
  optionId: z.string().min(1, "Option ID is required."),
  userId: z.string().optional(),
});

// GET /api/polls/:pollId/vote — check vote status
router.get("/:pollId/vote", async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.json({ hasVoted: false, optionId: null });
    }

    const vote = await prisma.vote.findUnique({
      where: { userId_pollId: { userId, pollId: req.params.pollId } },
    });

    return res.json({
      hasVoted: !!vote,
      optionId: vote?.pollOptionId || null,
    });
  } catch {
    return res.json({ hasVoted: false, optionId: null });
  }
});

// POST /api/polls/:pollId/vote — cast vote
router.post("/:pollId/vote", async (req: Request, res: Response) => {
  try {
    const parsed = voteSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten().fieldErrors });
    }

    const { optionId } = parsed.data;
    const userId = parsed.data.userId || getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Please sign in to vote in consultations." });
    }

    const { pollId } = req.params;

    const poll = await prisma.poll.findUnique({ where: { id: pollId } });
    if (!poll || !poll.active) {
      return res.status(404).json({ error: "Consultation poll is no longer active." });
    }

    const option = await prisma.pollOption.findFirst({
      where: { id: optionId, pollId },
    });
    if (!option) {
      return res.status(400).json({ error: "Invalid poll option selected." });
    }

    // Upsert vote (one vote per member per poll)
    const vote = await prisma.vote.upsert({
      where: { userId_pollId: { userId, pollId } },
      create: { userId, pollId, pollOptionId: optionId },
      update: { pollOptionId: optionId },
    });

    return res.status(200).json({ vote, message: "Vote successfully cast." });
  } catch (error) {
    console.error("[Poll Vote Error]:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
