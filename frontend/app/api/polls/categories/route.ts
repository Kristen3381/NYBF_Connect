import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const categorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters"),
});

// GET /api/polls/categories — list all poll categories
export async function GET() {
  try {
    const categories = await prisma.pollCategory.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json({ categories });
  } catch (error) {
    console.error("[PollCategory GET] error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST /api/polls/categories — add category (ADMIN / COORDINATOR)
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
    const parsed = categorySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const existing = await prisma.pollCategory.findUnique({
      where: { name: parsed.data.name },
    });
    if (existing) {
      return NextResponse.json({ category: existing });
    }

    const created = await prisma.pollCategory.create({
      data: { name: parsed.data.name },
    });

    return NextResponse.json({ category: created }, { status: 201 });
  } catch (error) {
    console.error("[PollCategory POST] error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
