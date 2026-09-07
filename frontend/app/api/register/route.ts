import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { sendConfirmationEmail } from "@/lib/notifications";

export const dynamic = "force-dynamic";

// FR-2.1 / FR-2.2: validated registration
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(9, "Phone number is too short").max(20, "Phone number is too long"),
  county: z.string().min(2, "County is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  constituency: z.string().optional(),
  role: z.string().optional(),
  civicRole: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, phone, county, password, constituency, role, civicRole } = parsed.data;

    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { phone }] },
    });
    if (existing) {
      const field = existing.email.toLowerCase() === email.toLowerCase() ? "email" : "phone";
      return NextResponse.json(
        { error: `An account with this ${field} already exists.` },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        county,
        constituency: constituency || null,
        civicRole: civicRole || role || "Young Professional / Citizen",
        passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        county: true,
        constituency: true,
        civicRole: true,
        role: true,
      },
    });

    // Send confirmation email via Resend (gracefully skips if unconfigured)
    sendConfirmationEmail(user).catch((err) =>
      console.error("[Register] Failed to send confirmation email:", err)
    );

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
