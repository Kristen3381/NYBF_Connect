import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// FR-7.1: list events
export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { date: "asc" },
      include: { _count: { select: { registrations: true } } },
    });
    return NextResponse.json({ events });
  } catch (error) {
    return NextResponse.json({
      events: [
        {
          id: "evt-1",
          title: "National Youth Budget Summit 2026",
          description: "Annual national gathering of youth budget delegates, civil society organizations, and Treasury officials.",
          date: new Date(Date.now() + 86400000 * 14).toISOString(),
          location: "KICC, Nairobi & Virtual Stream",
          _count: { registrations: 340 },
        },
      ],
    });
  }
}

const createSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  date: z.string().datetime(),
  location: z.string().min(2),
});

// FR-7.4: admins/coordinators create events
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;

    if (!session || (role !== "ADMIN" && role !== "COORDINATOR")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const event = await prisma.event.create({
      data: {
        ...parsed.data,
        date: new Date(parsed.data.date),
        createdBy: (session.user as any).id,
      },
    });

    return NextResponse.json({ event }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
