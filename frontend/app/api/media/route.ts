import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const createMediaSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  type: z.enum(["ARTICLE", "VIDEO", "PODCAST", "IMAGE"]).default("ARTICLE"),
  url: z.string().optional().nullable(),
  thumbnail: z.string().optional().nullable(),
  author: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  summary: z.string().optional().nullable(),
  body: z.string().optional().nullable(),
  tag: z.string().optional().nullable(),
});

// GET /api/media — fetch published media items
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const typeParam = searchParams.get("type");

    const where: any = {};
    if (typeParam && ["ARTICLE", "VIDEO", "PODCAST", "IMAGE"].includes(typeParam.toUpperCase())) {
      where.type = typeParam.toUpperCase();
    }

    const items = await prisma.mediaItem.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ items });
  } catch (error) {
    console.error("[Media GET] error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST /api/media — create a media item (ADMIN / COORDINATOR)
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
    const parsed = createMediaSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const item = await prisma.mediaItem.create({
      data: {
        title: parsed.data.title,
        type: parsed.data.type,
        url: parsed.data.url || null,
        thumbnail: parsed.data.thumbnail || null,
        author: parsed.data.author || null,
        location: parsed.data.location || null,
        summary: parsed.data.summary || null,
        body: parsed.data.body || null,
        tag: parsed.data.tag || null,
      },
    });

    return NextResponse.json({ success: true, item }, { status: 201 });
  } catch (error) {
    console.error("[Media POST] error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
