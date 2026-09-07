import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const updateMediaSchema = z.object({
  title: z.string().min(3).optional(),
  type: z.enum(["ARTICLE", "VIDEO", "PODCAST", "IMAGE"]).optional(),
  url: z.string().optional().nullable(),
  thumbnail: z.string().optional().nullable(),
  author: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  summary: z.string().optional().nullable(),
  body: z.string().optional().nullable(),
  tag: z.string().optional().nullable(),
});

export async function PATCH(
  req: Request,
  { params }: { params: { mediaId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !(session.user as any)?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const role = (session.user as any).role;
    if (role !== "ADMIN" && role !== "COORDINATOR") {
      return NextResponse.json({ error: "Forbidden: Admin or Coordinator access required" }, { status: 403 });
    }

    const item = await prisma.mediaItem.findUnique({
      where: { id: params.mediaId },
    });
    if (!item) {
      return NextResponse.json({ error: "Media item not found" }, { status: 404 });
    }

    const body = await req.json();
    const parsed = updateMediaSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const updated = await prisma.mediaItem.update({
      where: { id: params.mediaId },
      data: parsed.data,
    });

    return NextResponse.json({ success: true, item: updated });
  } catch (error) {
    console.error("[Media PATCH] error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { mediaId: string } }
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

    const item = await prisma.mediaItem.findUnique({
      where: { id: params.mediaId },
    });
    if (!item) {
      return NextResponse.json({ error: "Media item not found" }, { status: 404 });
    }

    await prisma.mediaItem.delete({
      where: { id: params.mediaId },
    });

    return NextResponse.json({ success: true, message: "Media item deleted" });
  } catch (error) {
    console.error("[Media DELETE] error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
