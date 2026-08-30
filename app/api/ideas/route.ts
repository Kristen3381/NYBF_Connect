import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const createSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  category: z.string().optional(),
});

// FR-5.4: submit a free-text policy idea
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const idea = await prisma.idea.create({
    data: { ...parsed.data, userId: (session.user as any).id },
  });

  return NextResponse.json({ idea }, { status: 201 });
}

// List current user's ideas
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ideas = await prisma.idea.findMany({
    where: { userId: (session.user as any).id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ ideas });
}
