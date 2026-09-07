import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const progressSchema = z.object({
  moduleId: z.string().min(1),
  completed: z.boolean().default(true),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !(session.user as any)?.id) {
      return NextResponse.json({ error: "Please sign in to track module completion." }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await req.json();
    const parsed = progressSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const { moduleId, completed } = parsed.data;

    // Verify module exists
    const mod = await prisma.budgetModule.findUnique({ where: { id: moduleId } });
    if (!mod) {
      return NextResponse.json({ error: "Module not found" }, { status: 404 });
    }

    const progress = await prisma.moduleProgress.upsert({
      where: {
        userId_moduleId: {
          userId,
          moduleId,
        },
      },
      update: {
        completed,
      },
      create: {
        userId,
        moduleId,
        completed,
      },
    });

    return NextResponse.json({ progress }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
