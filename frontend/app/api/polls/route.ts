import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
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

    const formatted = polls.map((poll) => ({
      ...poll,
      options: poll.options.map((opt) => ({
        id: opt.id,
        pollId: opt.pollId,
        label: opt.label,
        votesCount: opt._count.votes,
      })),
    }));

    return NextResponse.json({ polls: formatted });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

const createPollSchema = z.object({
  question: z.string().min(5, "Question must be at least 5 characters"),
  category: z.string().optional(),
  options: z.array(z.string().min(1, "Option text required")).min(2, "At least 2 options are required"),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !(session.user as any)?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const role = (session.user as any).role;
    if (role !== "ADMIN" && role !== "COORDINATOR") {
      return NextResponse.json({ error: "Forbidden: Admin or Coordinator access required" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = createPollSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const poll = await prisma.poll.create({
      data: {
        question: parsed.data.question,
        category: parsed.data.category || "National Priority",
        options: {
          create: parsed.data.options.map((label) => ({ label })),
        },
      },
      include: {
        options: {
          include: { _count: { select: { votes: true } } },
        },
      },
    });

    const formattedPoll = {
      ...poll,
      options: poll.options.map((opt) => ({
        id: opt.id,
        pollId: opt.pollId,
        label: opt.label,
        votesCount: opt._count.votes,
      })),
    };

    return NextResponse.json({ poll: formattedPoll }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
