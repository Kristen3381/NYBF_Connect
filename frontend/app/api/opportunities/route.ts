import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// FR-6.2: search/filter by type, location, deadline
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") ?? undefined;
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
}

const createSchema = z.object({
  title: z.string().min(3),
  type: z.enum(["PROGRAMME", "FELLOWSHIP", "INTERNSHIP", "GRANT", "JOB"]),
  location: z.string().min(2),
  deadline: z.string().datetime(),
  description: z.string().optional(),
  applyUrl: z.string().url().optional(),
});

// FR-6.3: admins/coordinators can create listings
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;

  if (!session || (role !== "ADMIN" && role !== "COORDINATOR")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
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
}
