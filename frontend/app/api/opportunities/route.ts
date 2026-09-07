import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// FR-6.2: search/filter by type, location, deadline
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const typeParam = searchParams.get("type");
    const type = typeParam && typeParam !== "ALL" ? typeParam : undefined;
    const location = searchParams.get("location") ?? undefined;

    const opportunities = await prisma.opportunity.findMany({
      where: {
        expired: false,
        ...(type ? { type: type as any } : {}),
        ...(location ? { location: { contains: location, mode: "insensitive" } } : {}),
      },
      orderBy: { deadline: "asc" },
    });

    return NextResponse.json({ opportunities });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

const createSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  type: z.enum(["PROGRAMME", "FELLOWSHIP", "INTERNSHIP", "GRANT", "JOB"]),
  location: z.string().min(2, "Location is required"),
  deadline: z.string(),
  description: z.string().optional(),
  stipend: z.string().optional(),
  applyUrl: z.string().optional(),
});

// FR-6.3: admins/coordinators can create listings
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
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const opportunity = await prisma.opportunity.create({
      data: {
        ...parsed.data,
        deadline: new Date(parsed.data.deadline),
        createdBy: (session.user as any).id,
      },
    });

    return NextResponse.json({ opportunity }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
