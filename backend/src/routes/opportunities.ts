import { Router, Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";

const router = Router();

// GET /api/opportunities — search/filter opportunities
router.get("/", async (req: Request, res: Response) => {
  try {
    const typeParam = req.query.type as string;
    const type = typeParam && typeParam !== "ALL" ? typeParam : undefined;
    const location = (req.query.location as string) ?? undefined;

    const opportunities = await prisma.opportunity.findMany({
      where: {
        expired: false,
        ...(type ? { type: type as any } : {}),
        ...(location ? { location: { contains: location, mode: "insensitive" } } : {}),
      },
      orderBy: { deadline: "asc" },
    });

    return res.json({ opportunities });
  } catch (error) {
    console.error("[Opportunities GET Error]:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

const createSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  type: z.enum(["PROGRAMME", "FELLOWSHIP", "INTERNSHIP", "GRANT", "JOB"]),
  location: z.string().min(2, "Location is required"),
  deadline: z.string(),
  description: z.string().optional(),
  stipend: z.string().optional(),
  applyUrl: z.string().optional(),
  createdBy: z.string().optional(),
});

// POST /api/opportunities — create opportunity
router.post("/", async (req: Request, res: Response) => {
  try {
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }

    const createdBy = parsed.data.createdBy || (req.headers["x-user-id"] as string) || "system-admin";

    const opportunity = await prisma.opportunity.create({
      data: {
        title: parsed.data.title,
        type: parsed.data.type,
        location: parsed.data.location,
        deadline: new Date(parsed.data.deadline),
        description: parsed.data.description,
        stipend: parsed.data.stipend,
        applyUrl: parsed.data.applyUrl,
        createdBy,
      },
    });

    return res.status(201).json({ opportunity });
  } catch (error) {
    console.error("[Opportunities POST Error]:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

const updateSchema = z.object({
  title: z.string().min(3).optional(),
  type: z.enum(["PROGRAMME", "FELLOWSHIP", "INTERNSHIP", "GRANT", "JOB"]).optional(),
  location: z.string().min(2).optional(),
  deadline: z.string().optional(),
  description: z.string().optional().nullable(),
  stipend: z.string().optional().nullable(),
  applyUrl: z.string().optional().nullable(),
  expired: z.boolean().optional(),
});

// PATCH /api/opportunities/:opportunityId
router.patch("/:opportunityId", async (req: Request, res: Response) => {
  try {
    const { opportunityId } = req.params;
    const parsed = updateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }

    const updateData: any = { ...parsed.data };
    if (parsed.data.deadline) {
      updateData.deadline = new Date(parsed.data.deadline);
    }

    const opportunity = await prisma.opportunity.update({
      where: { id: opportunityId },
      data: updateData,
    });

    return res.json({ opportunity });
  } catch (error) {
    console.error("[Opportunities PATCH Error]:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// DELETE /api/opportunities/:opportunityId
router.delete("/:opportunityId", async (req: Request, res: Response) => {
  try {
    const { opportunityId } = req.params;
    await prisma.opportunity.delete({ where: { id: opportunityId } });
    return res.json({ success: true, message: "Opportunity deleted" });
  } catch (error) {
    console.error("[Opportunities DELETE Error]:", error);
    return res.status(500).json({ error: "Failed to delete opportunity" });
  }
});

export default router;
