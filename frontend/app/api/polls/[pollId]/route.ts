import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const patchPollSchema = z.object({
  active: z.boolean().optional(),
  question: z.string().min(5).optional(),
  category: z.string().optional(),
});

// GET /api/polls/[pollId] — full poll details with option breakdown
export async function GET(
  req: Request,
  { params }: { params: { pollId: string } }
) {
  try {
    const poll = await prisma.poll.findUnique({
      where: { id: params.pollId },
      include: {
        options: {
          include: {
            _count: { select: { votes: true } },
          },
        },
        _count: { select: { votes: true } },
      },
    });

    if (!poll) {
      return NextResponse.json({ error: "Poll not found" }, { status: 404 });
    }

    const totalVotes = poll._count.votes;
    const formatted = {
      id: poll.id,
      question: poll.question,
      category: poll.category,
      active: poll.active,
      createdAt: poll.createdAt,
      totalVotes,
      options: poll.options.map((opt) => ({
        id: opt.id,
        label: opt.label,
        votesCount: opt._count.votes,
        percentage: totalVotes > 0 ? Math.round((opt._count.votes / totalVotes) * 100) : 0,
      })),
    };

    return NextResponse.json({ poll: formatted });
  } catch (error) {
    console.error("[Poll GET [pollId]] error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PATCH /api/polls/[pollId] — toggle active or update details (ADMIN / COORDINATOR)
export async function PATCH(
  req: Request,
  { params }: { params: { pollId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !(session.user as any)?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const role = (session.user as any).role;
    if (role !== "ADMIN" && role !== "COORDINATOR") {
      return NextResponse.json({ error: "Forbidden: Admin or Coordinator access required" }, { status: 403 });
    }

    const poll = await prisma.poll.findUnique({
      where: { id: params.pollId },
    });
    if (!poll) {
      return NextResponse.json({ error: "Poll not found" }, { status: 404 });
    }

    const body = await req.json();
    const parsed = patchPollSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const updated = await prisma.poll.update({
      where: { id: params.pollId },
      data: parsed.data,
      include: {
        options: {
          include: { _count: { select: { votes: true } } },
        },
      },
    });

    return NextResponse.json({ success: true, poll: updated });
  } catch (error) {
    console.error("[Poll PATCH] error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE /api/polls/[pollId] — delete poll (ADMIN only)
export async function DELETE(
  req: Request,
  { params }: { params: { pollId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !(session.user as any)?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const role = (session.user as any).role;
    if (role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const poll = await prisma.poll.findUnique({
      where: { id: params.pollId },
    });
    if (!poll) {
      return NextResponse.json({ error: "Poll not found" }, { status: 404 });
    }

    await prisma.poll.delete({
      where: { id: params.pollId },
    });

    return NextResponse.json({ success: true, message: "Poll deleted successfully" });
  } catch (error) {
    console.error("[Poll DELETE] error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
