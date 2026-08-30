import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const voteSchema = z.object({ optionId: z.string() });

// FR-5.2: record one vote per member per poll; prevent duplicates
export async function POST(
  req: Request,
  { params }: { params: { pollId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = voteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const userId = (session.user as any).id;

  try {
    const vote = await prisma.vote.create({
      data: {
        userId,
        pollId: params.pollId,
        pollOptionId: parsed.data.optionId,
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
}
