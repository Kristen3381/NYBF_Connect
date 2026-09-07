import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEventReminder } from "@/lib/notifications";

export const dynamic = "force-dynamic";

/**
 * Cron Job: Event Reminders (SMS)
 * Sends SMS reminders for all events scheduled within the next 24 hours
 * where reminded = false, then sets reminded = true to prevent re-sending.
 */
async function processEventReminders(req: Request) {
  try {
    // Optional Bearer token authorization in production
    const cronSecret = process.env.CRON_SECRET?.trim();
    if (cronSecret) {
      const authHeader = req.headers.get("authorization");
      if (authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const now = new Date();
    const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    // Find registrations for events occurring within the next 24 hours where reminder has not been sent
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
      const phone = reg.user.phone;

      if (!phone) {
        // No phone available, mark reminded to not stall future runs
        await prisma.eventRegistration.update({
          where: { id: reg.id },
          data: { reminded: true },
        });
        skippedCount++;
        continue;
      }

      const smsResult = await sendEventReminder({
        attendeeName: reg.user.name,
        attendeePhone: phone,
        eventTitle: reg.event.title,
        eventDate: reg.event.date,
        eventLocation: reg.event.location,
      });

      if (smsResult.success) {
        sentCount++;
      } else if (smsResult.skipped) {
        skippedCount++;
      } else {
        errors.push({ registrationId: reg.id, error: smsResult.error });
      }

      // Flip reminded flag to true so this registration is never re-processed
      await prisma.eventRegistration.update({
        where: { id: reg.id },
        data: { reminded: true },
      });
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      matched: pendingRegistrations.length,
      sent: sentCount,
      skipped: skippedCount,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("[Cron:EventReminders] Error processing event reminders:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: (error as any)?.message },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  return processEventReminders(req);
}

export async function POST(req: Request) {
  return processEventReminders(req);
}
