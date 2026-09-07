import { Router, Request, Response } from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
import { sendOtpEmail } from "../lib/notifications";

const router = Router();

const otpRequestSchema = z.object({
  email: z.string().email("Please provide a valid email address."),
  password: z.string().optional(),
});

router.post("/otp", async (req: Request, res: Response) => {
  try {
    const parsed = otpRequestSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten().fieldErrors });
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ error: "No account found with this email address." });
    }

    // If password provided, verify it first before sending OTP
    if (password && user.passwordHash) {
      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) {
        return res.status(401).json({ error: "Invalid credentials. Please verify your email and passcode." });
      }
    }

    const isStaff = user.role === "ADMIN" || user.role === "COORDINATOR" || user.role === "MODERATOR";

    if (!isStaff) {
      return res.json({
        requiresOtp: false,
        role: user.role,
        message: "No OTP required for member accounts.",
      });
    }

    // Generate random 6-digit OTP passcode
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await prisma.otpCode.deleteMany({
      where: { email: user.email },
    });

    await prisma.otpCode.create({
      data: {
        email: user.email,
        code,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    await sendOtpEmail({
      email: user.email,
      name: user.name,
      code,
    });

    return res.json({
      requiresOtp: true,
      role: user.role,
      message: `A 6-digit verification code has been dispatched to ${user.email}.`,
    });
  } catch (error) {
    console.error("[OTP API Error]:", error);
    return res.status(500).json({ error: "Failed to process authentication request." });
  }
});

export default router;
