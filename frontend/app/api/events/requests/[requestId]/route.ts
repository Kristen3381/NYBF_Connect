import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const patchSchema = z.object({
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
  adminNotes: z.string().optional().nullable(),
});

export async function PATCH(
  req: Request,
  { params }: { params: { requestId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !(session.user as any)?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const role = (session.user as any).role;
    if (role !== "ADMIN" && role !== "COORDINATOR" && role !== "MODERATOR") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = patchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const existing = await prisma.eventRequest.findUnique({
      where: { id: params.requestId },
    });
    if (!existing) {
      return NextResponse.json({ error: "Dialogue request not found" }, { status: 404 });
    }

    const updated = await prisma.eventRequest.update({
      where: { id: params.requestId },
      data: {
        ...(parsed.data.status ? { status: parsed.data.status } : {}),
        ...(parsed.data.adminNotes !== undefined ? { adminNotes: parsed.data.adminNotes } : {}),
      },
    });

    return NextResponse.json({ success: true, request: updated });
  } catch (error) {
    console.error("[EventRequest PATCH] error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { requestId: string } }
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

    const existing = await prisma.eventRequest.findUnique({
      where: { id: params.requestId },
    });
    if (!existing) {
      return NextResponse.json({ error: "Dialogue request not found" }, { status: 404 });
    }

    await prisma.eventRequest.delete({
      where: { id: params.requestId },
    });

    return NextResponse.json({ success: true, message: "Dialogue request deleted" });
  } catch (error) {
    console.error("[EventRequest DELETE] error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
