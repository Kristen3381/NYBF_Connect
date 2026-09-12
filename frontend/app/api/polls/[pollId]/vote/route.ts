import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const voteSchema = z.object({
  optionId: z.string().min(1, "Option ID is required."),
});

// Check current user's vote status for this poll
export async function GET(
  req: Request,
  { params }: { params: { pollId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !(session.user as any)?.id) {
      return NextResponse.json({ hasVoted: false, optionId: null });
    }

    const userId = (session.user as any).id;
    const vote = await prisma.vote.findUnique({
      where: { userId_pollId: { userId, pollId: params.pollId } },
    });

    return NextResponse.json({
      hasVoted: !!vote,
      optionId: vote?.pollOptionId || null,
    });
  } catch {
    return NextResponse.json({ hasVoted: false, optionId: null });
  }
}

// Cast or Change Vote (FR-5.2)
export async function POST(
  req: Request,
  { params }: { params: { pollId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !(session.user as any)?.id) {
      return NextResponse.json({ error: "Please sign in to vote in consultations." }, { status: 401 });
    }

    const body = await req.json();
    const parsed = voteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const { optionId } = parsed.data;
    const userId = (session.user as any).id;
    const pollId = params.pollId;

    // Check if poll exists
    const poll = await prisma.poll.findUnique({ where: { id: pollId } });
    if (!poll) {
      return NextResponse.json({ error: "Poll not found" }, { status: 404 });
    }

    // Check if user already voted in this poll
    const existingVote = await prisma.vote.findUnique({
      where: { userId_pollId: { userId, pollId } },
    });

    if (existingVote) {
      // If voting for the same option, return clean 409
      if (existingVote.pollOptionId === optionId) {
        return NextResponse.json(
          { error: "You have already voted in this poll." },
          { status: 409 }
        );
      }

      // Change existing vote to new option
      const updatedVote = await prisma.vote.update({
        where: { id: existingVote.id },
        data: { pollOptionId: optionId },
      });

      return NextResponse.json(
        { vote: updatedVote, changed: true, previousOptionId: existingVote.pollOptionId },
        { status: 200 }
      );
    }

    try {
      const vote = await prisma.vote.create({
        data: {
          userId,
          pollId,
          pollOptionId: optionId,
        },
      });
      return NextResponse.json({ vote }, { status: 201 });
    } catch (err: any) {
      if (err.code === "P2002") {
        return NextResponse.json(
          { error: "You have already voted in this poll." },
          { status: 409 }
        );
      }
      throw err;
    }
  } catch (error) {
    console.error("Failed to submit vote:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Withdraw Vote (FR-5.2)
export async function DELETE(
  req: Request,
  { params }: { params: { pollId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !(session.user as any)?.id) {
      return NextResponse.json({ error: "Please sign in to withdraw your vote." }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const pollId = params.pollId;

    const existingVote = await prisma.vote.findUnique({
      where: { userId_pollId: { userId, pollId } },
    });

    if (!existingVote) {
      return NextResponse.json({ error: "No vote found to withdraw." }, { status: 404 });
    }

    await prisma.vote.delete({
      where: { id: existingVote.id },
    });

    return NextResponse.json({
      success: true,
      message: "Vote withdrawn successfully.",
      withdrawnOptionId: existingVote.pollOptionId,
    });
  } catch (error) {
    console.error("Failed to withdraw vote:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
