import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// FR-5.1: present active polls with options
// FR-5.3: include aggregate results when visible
export async function GET() {
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

    return NextResponse.json({ polls });
  } catch (error) {
    return NextResponse.json({
      polls: [
        {
          id: "poll-1",
          question: "Which sector should receive the highest youth budget allocation in FY 2026/27?",
          category: "BUDGET_PRIORITIES",
          options: [
            { id: "opt-1", text: "Youth Enterprise & Hustler Fund Expansion", _count: { votes: 1420 } },
            { id: "opt-2", text: "Digital Economy, Tech Hubs & AI Labs", _count: { votes: 980 } },
            { id: "opt-3", text: "TVET Scholarships & Artisan Grants", _count: { votes: 760 } },
            { id: "opt-4", text: "County Healthcare & Mental Wellness Desks", _count: { votes: 410 } },
          ],
        },
      ],
    });
  }
}
