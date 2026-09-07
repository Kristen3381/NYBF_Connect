import { Router, Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";

const router = Router();

// Helper to extract user ID from header or body
function getUserId(req: Request): string | null {
  return (req.headers["x-user-id"] as string) || (req.body?.userId as string) || null;
}

// GET /api/events — list events
router.get("/", async (_req: Request, res: Response) => {
  try {
    const events = await prisma.event.findMany({
      orderBy: { date: "asc" },
      include: { _count: { select: { registrations: true } } },
    });
    return res.json({ events });
  } catch (error) {
    console.error("[Events GET Error]:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

const createEventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  date: z.string(),
  location: z.string().min(2, "Location is required"),
  photo: z.string().optional(),
  tag: z.string().optional(),
  capacity: z.number().int().positive().optional(),
  createdBy: z.string().optional(),
});

// POST /api/events — create event
router.post("/", async (req: Request, res: Response) => {
  try {
    const parsed = createEventSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten().fieldErrors });
    }

    const createdBy = parsed.data.createdBy || getUserId(req) || "system-admin";

    const event = await prisma.event.create({
      data: {
        title: parsed.data.title,
        description: parsed.data.description,
        date: new Date(parsed.data.date),
        location: parsed.data.location,
        photo: parsed.data.photo,
        tag: parsed.data.tag,
        capacity: parsed.data.capacity,
        createdBy,
      },
    });

    return res.status(201).json({ event });
  } catch (error) {
    console.error("[Events POST Error]:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// PATCH /api/events/:eventId
router.patch("/:eventId", async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const body = req.body;

    const dataToUpdate: any = {};
    if (body.title) dataToUpdate.title = body.title;
    if (body.description !== undefined) dataToUpdate.description = body.description;
    if (body.date) dataToUpdate.date = new Date(body.date);
    if (body.location) dataToUpdate.location = body.location;
    if (body.photo !== undefined) dataToUpdate.photo = body.photo;
    if (body.tag !== undefined) dataToUpdate.tag = body.tag;
    if (body.capacity !== undefined) dataToUpdate.capacity = Number(body.capacity);

    const event = await prisma.event.update({
      where: { id: eventId },
      data: dataToUpdate,
    });

    return res.json({ event });
  } catch (error) {
    console.error("[Events PATCH Error]:", error);
    return res.status(500).json({ error: "Failed to update event" });
  }
});

// DELETE /api/events/:eventId
router.delete("/:eventId", async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    await prisma.event.delete({ where: { id: eventId } });
    return res.json({ success: true, message: "Event deleted successfully" });
  } catch (error) {
    console.error("[Events DELETE Error]:", error);
    return res.status(500).json({ error: "Failed to delete event" });
  }
});

// POST /api/events/:eventId/register — register for event
router.post("/:eventId/register", async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Please sign in to register for events." });
    }

    const { eventId } = req.params;
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    if (event.capacity !== null && event.capacity !== undefined) {
      const currentRegistrations = await prisma.eventRegistration.count({
        where: { eventId },
      });
      if (currentRegistrations >= event.capacity) {
        return res.status(409).json({ error: "This event is at full capacity." });
      }
    }

    const existing = await prisma.eventRegistration.findUnique({
      where: { userId_eventId: { userId, eventId } },
    });
    if (existing) {
      return res.status(409).json({ error: "You are already registered for this event." });
    }

    const registration = await prisma.eventRegistration.create({
      data: { userId, eventId },
    });

    return res.status(201).json({ registration });
  } catch (error: any) {
    if (error?.code === "P2002") {
      return res.status(409).json({ error: "You are already registered for this event." });
    }
    console.error("[Events Register Error]:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

const requestSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required").optional().nullable(),
  phone: z.string().min(9, "Valid phone number required").optional().nullable(),
  county: z.string().optional().nullable(),
  constituency: z.string().min(2, "Constituency is required"),
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  proposedDate: z.string().optional().nullable(),
  userId: z.string().optional().nullable(),
});

// GET /api/events/requests — list dialogue requests
router.get("/requests", async (_req: Request, res: Response) => {
  try {
    const requests = await prisma.eventRequest.findMany({
      orderBy: { createdAt: "desc" },
    });
    return res.json({ requests });
  } catch (error) {
    console.error("[Event Requests GET Error]:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST /api/events/requests — submit dialogue request
router.post("/requests", async (req: Request, res: Response) => {
  try {
    const parsed = requestSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten().fieldErrors });
    }

    const { name, email, phone, county, constituency, title, description, proposedDate } = parsed.data;
    const userId = parsed.data.userId || getUserId(req);

    const eventRequest = await prisma.eventRequest.create({
      data: {
        userId,
        name,
        email: email || null,
        phone: phone || null,
        county: county || null,
        constituency,
        title,
        description,
        proposedDate: proposedDate ? new Date(proposedDate) : null,
        status: "PENDING",
      },
    });

    return res.status(201).json({
      success: true,
      message: "Your youth dialogue proposal has been submitted to the NYBF Secretariat for review.",
      eventRequest,
    });
  } catch (error) {
    console.error("[Event Requests POST Error]:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// PATCH /api/events/requests/:requestId — update status
router.patch("/requests/:requestId", async (req: Request, res: Response) => {
  try {
    const { requestId } = req.params;
    const { status, adminNotes } = req.body;

    const eventRequest = await prisma.eventRequest.update({
      where: { id: requestId },
      data: {
        status: status || undefined,
        adminNotes: adminNotes || undefined,
      },
    });

    return res.json({ eventRequest });
  } catch (error) {
    console.error("[Event Requests PATCH Error]:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// DELETE /api/events/requests/:requestId
router.delete("/requests/:requestId", async (req: Request, res: Response) => {
  try {
    const { requestId } = req.params;
    await prisma.eventRequest.delete({ where: { id: requestId } });
    return res.json({ success: true, message: "Request deleted" });
  } catch (error) {
    console.error("[Event Requests DELETE Error]:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
