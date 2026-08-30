import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const moderateSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
  adminResponse: z.string().optional(),
});

// FR-5.5 / FR-8.3: admin approves/rejects submitted ideas
export async function PATCH(
  req: Request,
  { params }: { params: { ideaId: string } }
) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;

  if (!session || role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = moderateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const idea = await prisma.idea.update({
    where: { id: params.ideaId },
    data: parsed.data,
  });

  // Auditability NFR: log admin moderation action
  await prisma.auditLog.create({
    data: {
      actorId: (session.user as any).id,
      action: `IDEA_${parsed.data.status}`,
      targetId: idea.id,
    },
  });

  return NextResponse.json({ idea });
}
