import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendCivicEngagementReminder } from "@/lib/notifications";

export const dynamic = "force-dynamic";

/**
 * Route: /api/cron/civic-reminders
 * Wires email reminders to:
 * 1. Active consultations / unvoted polls (members who haven't cast a vote in active polls)
 * 2. Incomplete member profiles (missing constituency)
 */
async function processCivicReminders(req: Request) {
  try {
    const cronSecret = process.env.CRON_SECRET?.trim();
    if (cronSecret) {
      const authHeader = req.headers.get("authorization");
      if (authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "UNVOTED_POLLS";

    let sent = 0;
    let skipped = 0;

    if (type === "UNVOTED_POLLS") {
      // Find latest active poll
      const activePoll = await prisma.poll.findFirst({
        where: { active: true },
        orderBy: { createdAt: "desc" },
      });

      if (!activePoll) {
        return NextResponse.json({ message: "No active poll to remind members about." });
      }

      // Find members who haven't voted in this poll
      const unvotedMembers = await prisma.user.findMany({
        where: {
          votes: {
            none: { pollId: activePoll.id },
          },
        },
        take: 25, // batch size
        select: { id: true, name: true, email: true },
      });

      for (const m of unvotedMembers) {
        const res = await sendCivicEngagementReminder({
          name: m.name,
          email: m.email,
          reminderType: "UNVOTED_POLLS",
          title: "Have your say in the National Youth Budget Pulse",
          description: `An active national budget consultation ("${activePoll.question}") is currently open for voting. Make sure your county's voice is counted before Parliament reviews the results.`,
          actionUrl: `${process.env.NEXTAUTH_URL || "https://nybf.ke"}/youth-voice`,
          actionText: "Vote in National Pulse →",
        });

        if (res.success) sent++;
        else skipped++;
      }

      return NextResponse.json({ success: true, pollId: activePoll.id, sent, skipped });
    }

    if (type === "INCOMPLETE_PROFILE") {
      const incompleteMembers = await prisma.user.findMany({
        where: {
          OR: [{ constituency: null }, { constituency: "" }],
        },
        take: 25,
        select: { id: true, name: true, email: true, county: true },
      });

      for (const m of incompleteMembers) {
        const res = await sendCivicEngagementReminder({
          name: m.name,
          email: m.email,
          reminderType: "INCOMPLETE_PROFILE",
          title: "Complete Your County & Constituency Profile",
          description: `You are currently registered in ${m.county || "Kenya"} without a designated constituency. Connecting your constituency ensures you receive ward-specific youth bursary notices and local assembly hearing dates.`,
          actionUrl: `${process.env.NEXTAUTH_URL || "https://nybf.ke"}/my-nybf`,
          actionText: "Update My NYBF Profile →",
        });

        if (res.success) sent++;
        else skipped++;
      }

      return NextResponse.json({ success: true, type: "INCOMPLETE_PROFILE", sent, skipped });
    }

    return NextResponse.json({ error: "Invalid reminder type" }, { status: 400 });
  } catch (error) {
    console.error("[CivicReminders] Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  return processCivicReminders(req);
}

export async function POST(req: Request) {
  return processCivicReminders(req);
}
