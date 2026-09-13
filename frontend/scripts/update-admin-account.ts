import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import crypto from "crypto";

if (typeof (process as any).loadEnvFile === "function") {
  try {
    (process as any).loadEnvFile();
  } catch {
    // ignore
  }
}

const prisma = new PrismaClient();

async function main() {
  console.log("==> Running Admin Account Secure Provisioning...");

  // 1. Determine Password securely
  let adminPassword = process.argv[2] || process.env.ADMIN_PASSWORD;
  let generated = false;

  if (!adminPassword && process.stdin.isTTY) {
    const readline = await import("readline");
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    adminPassword = await new Promise<string>((resolve) => {
      rl.question("Enter new password for nybfsecretariat@gmail.com: ", (answer) => {
        rl.close();
        resolve(answer.trim());
      });
    });
  }

  if (!adminPassword) {
    adminPassword = crypto.randomBytes(16).toString("base64url") + "!2026";
    generated = true;
  }

  const passwordHash = await bcrypt.hash(adminPassword, 10);

  // 2. Remove placeholder admin account if it exists
  const placeholder = await prisma.user.findUnique({
    where: { email: "abilakamaloka75@gmail.com" },
  });

  if (placeholder) {
    console.log("Removing placeholder admin user: abilakamaloka75@gmail.com...");
    await prisma.auditLog.deleteMany({ where: { actorId: placeholder.id } });
    await prisma.vote.deleteMany({ where: { userId: placeholder.id } });
    await prisma.moduleProgress.deleteMany({ where: { userId: placeholder.id } });
    await prisma.eventRegistration.deleteMany({ where: { userId: placeholder.id } });
    await prisma.eventRequest.deleteMany({ where: { userId: placeholder.id } });
    await prisma.event.deleteMany({ where: { createdBy: placeholder.id } });
    await prisma.opportunity.deleteMany({ where: { createdBy: placeholder.id } });
    await prisma.idea.deleteMany({ where: { userId: placeholder.id } });
    await prisma.user.delete({ where: { id: placeholder.id } });
    console.log("Placeholder admin deleted successfully.");
  } else {
    console.log("No placeholder admin (abilakamaloka75@gmail.com) found in database.");
  }

  // 3. Upsert real admin user: Obade George
  const realAdmin = await prisma.user.upsert({
    where: { email: "nybfsecretariat@gmail.com" },
    update: {
      name: "Obade George",
      phone: "0769778941",
      county: "Nairobi",
      constituency: "Westlands",
      civicRole: "Secretariat Lead",
      role: Role.ADMIN,
      passwordHash,
    },
    create: {
      email: "nybfsecretariat@gmail.com",
      name: "Obade George",
      phone: "0769778941",
      county: "Nairobi",
      constituency: "Westlands",
      civicRole: "Secretariat Lead",
      role: Role.ADMIN,
      passwordHash,
    },
  });

  console.log(`Successfully provisioned Admin account:
- Name: ${realAdmin.name}
- Email: ${realAdmin.email}
- Phone: ${realAdmin.phone}
- Role: ${realAdmin.role}
- Civic Role: ${realAdmin.civicRole}
- County: ${realAdmin.county}, ${realAdmin.constituency}`);

  if (generated) {
    console.log("\n[ATTENTION] A temporary secure password was generated because ADMIN_PASSWORD was not set:");
    console.log(`Temporary Password: ${adminPassword}`);
    console.log("Store this securely and update via ADMIN_PASSWORD in your environment.\n");
  } else {
    console.log("\n[OK] Admin password was hashed with bcrypt (10 rounds) from environment without plaintext logging.\n");
  }
}

main()
  .catch((err) => {
    console.error("Failed to provision admin account:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
