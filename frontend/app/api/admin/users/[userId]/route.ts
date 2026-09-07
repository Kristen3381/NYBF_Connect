import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const roleSchema = z.object({
  role: z.enum(["MEMBER", "COORDINATOR", "MODERATOR", "ADMIN"]),
});

// PATCH /api/admin/users/[userId] — update member role (ADMIN only)
export async function PATCH(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const actorId = (session?.user as any)?.id;
    const actorRole = (session?.user as any)?.role;

    if (!session || actorRole !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = roleSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: params.userId },
    });
    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updated = await prisma.user.update({
      where: { id: params.userId },
      data: { role: parsed.data.role },
      select: {
        id: true,
        name: true,
        email: true,
        county: true,
        constituency: true,
        civicRole: true,
        role: true,
        createdAt: true,
      },
    });

    // Record audit log
    await prisma.auditLog.create({
      data: {
        actorId,
        action: "USER_ROLE_UPDATED",
        targetId: params.userId,
        metadata: {
          previousRole: targetUser.role,
          newRole: parsed.data.role,
          targetEmail: targetUser.email,
        },
      },
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (error) {
    console.error("[Admin User PATCH] error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE /api/admin/users/[userId] — delete user account (ADMIN only)
export async function DELETE(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const actorId = (session?.user as any)?.id;
    const actorRole = (session?.user as any)?.role;

    if (!session || actorRole !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    if (actorId === params.userId) {
      return NextResponse.json({ error: "You cannot delete your own administrator account" }, { status: 400 });
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: params.userId },
    });
    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Clean up dependent records that don't cascade if any, or let Prisma handle cascade
    await prisma.user.delete({
      where: { id: params.userId },
    });

    await prisma.auditLog.create({
      data: {
        actorId,
        action: "USER_DELETED",
        targetId: params.userId,
        metadata: {
          deletedName: targetUser.name,
          deletedEmail: targetUser.email,
          deletedRole: targetUser.role,
        },
      },
    });

    return NextResponse.json({ success: true, message: "User account deleted successfully" });
  } catch (error) {
    console.error("[Admin User DELETE] error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
