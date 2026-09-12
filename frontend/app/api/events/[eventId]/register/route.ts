import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// FR-7.2: member registers for an event
export async function POST(
  req: Request,
  { params }: { params: { eventId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !(session.user as any)?.id) {
      return NextResponse.json({ error: "Please sign in to register for events." }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const eventId = params.eventId;

    // Check event existence
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Check event capacity
    if (event.capacity !== null && event.capacity !== undefined) {
      const currentRegistrations = await prisma.eventRegistration.count({
        where: { eventId },
      });
      if (currentRegistrations >= event.capacity) {
        return NextResponse.json(
          { error: "This event is at full capacity." },
          { status: 409 }
        );
      }
    }

    const existing = await prisma.eventRegistration.findUnique({
      where: { userId_eventId: { userId, eventId } },
    });
    if (existing) {
      return NextResponse.json(
        { error: "You are already registered for this event." },
        { status: 409 }
      );
    }

    try {
      const registration = await prisma.eventRegistration.create({
        data: { userId, eventId },
      });
      return NextResponse.json({ registration }, { status: 201 });
    } catch (dbErr: any) {
      if (dbErr.code === "P2002") {
        return NextResponse.json(
          { error: "You are already registered for this event." },
          { status: 409 }
        );
      }
      throw dbErr;
    }
  } catch (error) {
    console.error("Failed to register for event:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
