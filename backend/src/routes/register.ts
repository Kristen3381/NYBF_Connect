import { Router, Request, Response } from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
import { sendConfirmationEmail } from "../lib/notifications";

const router = Router();

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

router.post("/", async (req: Request, res: Response) => {
  try {
    const parsed = registerSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten().fieldErrors });
    }

    const { name, email, phone, county, password, constituency, role, civicRole } = parsed.data;

    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { phone }] },
    });
    if (existing) {
      const field = existing.email.toLowerCase() === email.toLowerCase() ? "email" : "phone";
      return res.status(409).json({ error: `An account with this ${field} already exists.` });
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

    sendConfirmationEmail(user).catch((err) =>
      console.error("[Register] Failed to send confirmation email:", err)
    );

    return res.status(201).json({ user });
  } catch (error) {
    console.error("[Register Error]:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
