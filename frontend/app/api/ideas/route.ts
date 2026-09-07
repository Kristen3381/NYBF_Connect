import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const createSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  category: z.string().optional(),
});

// FR-5.4: submit a free-text policy idea
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !(session.user as any)?.id) {
      return NextResponse.json({ error: "Please sign in to submit a policy proposal." }, { status: 401 });
    }

    const body = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const idea = await prisma.idea.create({
      data: { ...parsed.data, userId: (session.user as any).id },
    });

    return NextResponse.json({ idea }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// List ideas: all ideas for admins, or user's ideas, or approved ideas
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;
    const userId = (session?.user as any)?.id;
    const { searchParams } = new URL(req.url);
    const fetchAll = searchParams.get("all") === "true";

    if (fetchAll && role === "ADMIN") {
      const ideas = await prisma.idea.findMany({
        include: {
          user: {
            select: { name: true, county: true, email: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json({ ideas });
    }

    if (userId) {
      const ideas = await prisma.idea.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json({ ideas });
    }

    // Public view: return approved ideas
    const ideas = await prisma.idea.findMany({
      where: { status: "APPROVED" },
      include: {
        user: { select: { name: true, county: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ ideas });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
