import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const requestSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required").optional().nullable(),
  phone: z.string().min(9, "Valid phone number required").optional().nullable(),
  county: z.string().optional().nullable(),
  constituency: z.string().min(2, "Constituency is required"),
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  proposedDate: z.string().optional().nullable(),
});

// Submit a youth dialogue event request (Public / Member)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id || null;

    const body = await req.json();
    const parsed = requestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const { name, email, phone, county, constituency, title, description, proposedDate } = parsed.data;

    const eventRequest = await prisma.eventRequest.create({
      data: {
        userId,
        name,
        email: email || null,
        phone: phone || null,
        county: county || null,
        constituency,
        title,
        description,
        proposedDate: proposedDate ? new Date(proposedDate) : null,
        status: "PENDING",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Your youth dialogue proposal has been submitted to the NYBF Secretariat for review.",
        eventRequest,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[EventRequest] POST error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Get all event requests (Admin / Coordinator only)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !(session.user as any)?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const role = (session.user as any).role;
    if (role !== "ADMIN" && role !== "COORDINATOR" && role !== "MODERATOR") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const requests = await prisma.eventRequest.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ requests });
  } catch (error) {
    console.error("Failed to fetch event requests:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
