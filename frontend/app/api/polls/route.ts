import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// FR-5.1: present active polls with options
// FR-5.3: include aggregate results when visible
export async function GET() {
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
}
