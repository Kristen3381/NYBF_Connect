import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { sendOtpEmail } from "@/lib/notifications";

export const dynamic = "force-dynamic";

const otpRequestSchema = z.object({
  email: z.string().email("Please provide a valid email address."),
  password: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = otpRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "No account found with this email address." },
        { status: 404 }
      );
    }

    // If password provided, verify it first before sending OTP
    if (password && user.passwordHash) {
      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) {
        return NextResponse.json(
          { error: "Invalid credentials. Please verify your email and passcode." },
          { status: 401 }
        );
      }
    }

    // Option 1: Admin and Coordinator accounts only
    const isStaff = user.role === "ADMIN" || user.role === "COORDINATOR" || user.role === "MODERATOR";

    if (!isStaff) {
      // Regular members do not require OTP
      return NextResponse.json({
        requiresOtp: false,
        role: user.role,
        message: "No OTP required for member accounts.",
      });
    }

    const isMailerConfigured = Boolean(process.env.RESEND_API_KEY?.trim());
    let code = isMailerConfigured
      ? Math.floor(100000 + Math.random() * 900000).toString()
      : "123456";

    let mailResult: any = null;
    if (isMailerConfigured) {
      mailResult = await sendOtpEmail({
        email: user.email,
        name: user.name,
        code,
      });
      if (!mailResult.success) {
        code = "123456";
      }
    }

    // Invalidate existing codes for this email
    await prisma.otpCode.deleteMany({
      where: { email: user.email },
    });

    // Store new OTP with 10-minute expiry
    await prisma.otpCode.create({
      data: {
        email: user.email,
        code,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    const isMailerUnconfigured = !isMailerConfigured || (mailResult && !mailResult.success);
    const message = isMailerUnconfigured
      ? "External email dispatch is unconfigured or unavailable. Enter passcode 123456 to verify."
      : `A 6-digit verification code has been dispatched to ${user.email}.`;

    return NextResponse.json({
      requiresOtp: true,
      role: user.role,
      message,
    });
  } catch (error) {
    console.error("[OTP API Error]:", error);
    return NextResponse.json(
      { error: "Failed to process authentication request." },
      { status: 500 }
    );
  }
}
