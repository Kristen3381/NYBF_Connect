import { Router, Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";

const router = Router();

const createMediaSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  type: z.enum(["ARTICLE", "VIDEO", "PODCAST", "IMAGE"]).default("ARTICLE"),
  url: z.string().optional().nullable(),
  thumbnail: z.string().optional().nullable(),
  author: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  summary: z.string().optional().nullable(),
  body: z.string().optional().nullable(),
  tag: z.string().optional().nullable(),
});

// GET /api/media — fetch media items
router.get("/", async (req: Request, res: Response) => {
  try {
    const typeParam = req.query.type as string;
    const where: any = {};
    if (typeParam && ["ARTICLE", "VIDEO", "PODCAST", "IMAGE"].includes(typeParam.toUpperCase())) {
      where.type = typeParam.toUpperCase();
    }

    const items = await prisma.mediaItem.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return res.json({ items });
  } catch (error) {
    console.error("[Media GET Error]:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST /api/media — create media item
router.post("/", async (req: Request, res: Response) => {
  try {
    const parsed = createMediaSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten().fieldErrors });
    }

    const item = await prisma.mediaItem.create({
      data: parsed.data,
    });

    return res.status(201).json({ item });
  } catch (error) {
    console.error("[Media POST Error]:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

const updateMediaSchema = z.object({
  title: z.string().min(3).optional(),
  type: z.enum(["ARTICLE", "VIDEO", "PODCAST", "IMAGE"]).optional(),
  url: z.string().optional().nullable(),
  thumbnail: z.string().optional().nullable(),
  author: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  summary: z.string().optional().nullable(),
  body: z.string().optional().nullable(),
  tag: z.string().optional().nullable(),
});

// PATCH /api/media/:mediaId
router.patch("/:mediaId", async (req: Request, res: Response) => {
  try {
    const { mediaId } = req.params;
    const parsed = updateMediaSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten().fieldErrors });
    }

    const updated = await prisma.mediaItem.update({
      where: { id: mediaId },
      data: parsed.data,
    });

    return res.json({ success: true, item: updated });
  } catch (error) {
    console.error("[Media PATCH Error]:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// DELETE /api/media/:mediaId
router.delete("/:mediaId", async (req: Request, res: Response) => {
  try {
    const { mediaId } = req.params;
    await prisma.mediaItem.delete({ where: { id: mediaId } });
    return res.json({ success: true, message: "Media asset deleted" });
  } catch (error) {
    console.error("[Media DELETE Error]:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
