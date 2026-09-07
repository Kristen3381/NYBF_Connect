import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const updateSchema = z.object({
  title: z.string().min(3).optional(),
  type: z.enum(["PROGRAMME", "FELLOWSHIP", "INTERNSHIP", "GRANT", "JOB"]).optional(),
  location: z.string().min(2).optional(),
  deadline: z.string().optional(),
  description: z.string().optional().nullable(),
  stipend: z.string().optional().nullable(),
  applyUrl: z.string().optional().nullable(),
  expired: z.boolean().optional(),
});

// Admin / Coordinator Edit Opportunity
export async function PATCH(
  req: Request,
  { params }: { params: { opportunityId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !(session.user as any)?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const role = (session.user as any).role;
    if (role !== "ADMIN" && role !== "COORDINATOR" && role !== "MODERATOR") {
      return NextResponse.json({ error: "Forbidden: Admin or Coordinator access required" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const updateData: any = { ...parsed.data };
    if (parsed.data.deadline) {
      updateData.deadline = new Date(parsed.data.deadline);
    }

    const updated = await prisma.opportunity.update({
      where: { id: params.opportunityId },
      data: updateData,
    });

    return NextResponse.json({ opportunity: updated });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Admin / Coordinator Delete Opportunity
export async function DELETE(
  req: Request,
  { params }: { params: { opportunityId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !(session.user as any)?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const role = (session.user as any).role;
    if (role !== "ADMIN" && role !== "COORDINATOR") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    await prisma.opportunity.delete({
      where: { id: params.opportunityId },
    });

    return NextResponse.json({ success: true, message: "Opportunity deleted successfully." });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
