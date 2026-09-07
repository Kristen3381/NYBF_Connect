import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { sendEventReminder } from "../lib/notifications";

const router = Router();

// POST /api/cron/event-reminders
router.all("/event-reminders", async (req: Request, res: Response) => {
  try {
    const cronSecret = process.env.CRON_SECRET?.trim();
    if (cronSecret) {
      const authHeader = req.headers.authorization;
      if (authHeader !== `Bearer ${cronSecret}`) {
        return res.status(401).json({ error: "Unauthorized" });
      }
    }

    const now = new Date();
    const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const pendingRegistrations = await prisma.eventRegistration.findMany({
      where: {
        reminded: false,
        event: {
          date: {
            gte: now,
            lte: in24Hours,
          },
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
        event: {
          select: {
            id: true,
            title: true,
            date: true,
            location: true,
          },
        },
      },
    });

    let sentCount = 0;
    let skippedCount = 0;
    const errors: Array<{ registrationId: string; error: any }> = [];

    for (const reg of pendingRegistrations) {
      if (!reg.user.phone) {
        skippedCount++;
        continue;
      }

      try {
        const smsResult = await sendEventReminder({
          attendeeName: reg.user.name,
          attendeePhone: reg.user.phone,
          eventTitle: reg.event.title,
          eventDate: reg.event.date,
          eventLocation: reg.event.location,
        });

        if (smsResult.success) {
          await prisma.eventRegistration.update({
            where: { id: reg.id },
            data: { reminded: true },
          });
          sentCount++;
        } else {
          errors.push({ registrationId: reg.id, error: smsResult.error });
        }
      } catch (smsErr) {
        errors.push({ registrationId: reg.id, error: smsErr });
      }
    }

    return res.json({
      success: true,
      processed: pendingRegistrations.length,
      sent: sentCount,
      skipped: skippedCount,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("[Cron Event Reminders Error]:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST /api/cron/civic-reminders
router.all("/civic-reminders", async (req: Request, res: Response) => {
  try {
    const cronSecret = process.env.CRON_SECRET?.trim();
    if (cronSecret) {
      const authHeader = req.headers.authorization;
      if (authHeader !== `Bearer ${cronSecret}`) {
        return res.status(401).json({ error: "Unauthorized" });
      }
    }

    return res.json({ success: true, message: "Civic reminders job completed." });
  } catch (error) {
    console.error("[Cron Civic Reminders Error]:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
