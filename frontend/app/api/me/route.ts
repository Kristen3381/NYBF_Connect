import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !(session.user as any)?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        votes: {
          include: {
            poll: { select: { id: true, question: true, category: true } },
            option: { select: { id: true, label: true } },
          },
          orderBy: { createdAt: "desc" },
        },
        ideas: {
          orderBy: { createdAt: "desc" },
        },
        eventRegistrations: {
          include: {
            event: { select: { id: true, title: true, date: true, location: true } },
          },
          orderBy: { createdAt: "desc" },
        },
        moduleProgress: {
          where: { completed: true },
          include: {
            module: { select: { id: true, title: true, order: true } },
          },
          orderBy: { updatedAt: "desc" },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        county: user.county,
        constituency: user.constituency || "General Ward",
        civicRole: user.civicRole || "Young Professional / Citizen",
        role: user.role,
        joinedDate: user.createdAt.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
        verified: true,
      },
      votes: user.votes,
      ideas: user.ideas,
      registrations: user.eventRegistrations,
      completedModules: user.moduleProgress,
      stats: {
        votesCount: user.votes.length,
        ideasCount: user.ideas.length,
        eventsCount: user.eventRegistrations.length,
        modulesCompletedCount: user.moduleProgress.length,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  county: z.string().min(2).optional(),
  phone: z.string().min(9).max(20).optional(),
  constituency: z.string().optional(),
  civicRole: z.string().optional(),
});

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !(session.user as any)?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await req.json();
    const parsed = updateProfileSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: parsed.data,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        county: true,
        constituency: true,
        civicRole: true,
        role: true,
      },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
