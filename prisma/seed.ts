import { PrismaClient, Role, OpportunityType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Admin user
  await prisma.user.upsert({
    where: { email: "admin@nybf.go.ke" },
    update: {},
    create: {
      name: "NYBF Admin",
      email: "admin@nybf.go.ke",
      county: "Nairobi",
      role: Role.ADMIN,
    },
  });

  // Budget Hub modules
  await prisma.budgetModule.createMany({
    data: [
      {
        title: "Understanding Kenya's Budget",
        description: "Learn how government plans and allocates public resources.",
        contentType: "text",
        order: 1,
      },
      {
        title: "The National Budget Cycle",
        description: "Understand formulation, approval, implementation and oversight.",
        contentType: "text",
        order: 2,
      },
      {
        title: "Youth & Economic Planning",
        description: "Discover where young people fit into national economic planning.",
        contentType: "text",
        order: 3,
      },
    ],
    skipDuplicates: true,
  });

  // Sample opportunities
  await prisma.opportunity.createMany({
    data: [
      {
        title: "Youth Entrepreneurship Programme",
        type: OpportunityType.PROGRAMME,
        location: "Kenya",
        deadline: new Date("2026-09-30"),
        createdBy: "system",
      },
      {
        title: "Youth Policy Research Fellowship",
        type: OpportunityType.FELLOWSHIP,
        location: "Nairobi",
        deadline: new Date("2026-10-15"),
        createdBy: "system",
      },
      {
        title: "Digital Skills Internship",
        type: OpportunityType.INTERNSHIP,
        location: "Nairobi / Online",
        deadline: new Date("2026-10-10"),
        createdBy: "system",
      },
    ],
  });

  // Sample events
  await prisma.event.createMany({
    data: [
      {
        title: "National Youth Budget Town Hall",
        date: new Date("2026-09-12"),
        location: "Nairobi",
        createdBy: "system",
      },
      {
        title: "Youth Economic Dialogue",
        date: new Date("2026-09-26"),
        location: "Machakos",
        createdBy: "system",
      },
      {
        title: "County Youth Budget Forum",
        date: new Date("2026-10-03"),
        location: "Kajiado",
        createdBy: "system",
      },
    ],
  });

  // Sample poll (National Youth Pulse)
  await prisma.poll.create({
    data: {
      question: "What should receive greater priority?",
      options: {
        create: [
          { label: "Jobs & employment" },
          { label: "Education & skills" },
          { label: "Entrepreneurship" },
          { label: "Digital economy" },
        ],
      },
    },
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
