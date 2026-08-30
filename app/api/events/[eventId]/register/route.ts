import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// FR-7.2: member registers for an event
export async function POST(
  req: Request,
  { params }: { params: { eventId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id;

  const existing = await prisma.eventRegistration.findUnique({
    where: { userId_eventId: { userId, eventId: params.eventId } },
  });
  if (existing) {
    return NextResponse.json(
      { error: "Already registered for this event." },
      { status: 409 }
    );
  }

  const registration = await prisma.eventRegistration.create({
    data: { userId, eventId: params.eventId },
  });

  // TODO: FR-7.3 — schedule reminder notification (cron/queue) ahead of event date

  return NextResponse.json({ registration }, { status: 201 });
}
