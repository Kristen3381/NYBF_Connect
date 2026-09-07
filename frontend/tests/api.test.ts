import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST as registerHandler } from "@/app/api/register/route";
import { POST as voteHandler } from "@/app/api/polls/[pollId]/vote/route";
import { POST as createIdeaHandler } from "@/app/api/ideas/route";
import { POST as registerEventHandler } from "@/app/api/events/[eventId]/register/route";
import { PATCH as moderateIdeaHandler } from "@/app/api/admin/ideas/[ideaId]/route";
import { POST as otpHandler } from "@/app/api/auth/otp/route";
import { getCidpForCounty } from "@/lib/kenya-data";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { sendConfirmationEmail } from "@/lib/notifications";

// Mock next-auth
vi.mock("next-auth", () => ({
  getServerSession: vi.fn(),
}));

// Mock notifications to prevent external HTTP calls
vi.mock("@/lib/notifications", () => ({
  sendConfirmationEmail: vi.fn().mockResolvedValue({ success: true }),
  sendEventReminder: vi.fn().mockResolvedValue({ success: true }),
  sendOtpEmail: vi.fn().mockResolvedValue({ success: true }),
}));

// Mock prisma
vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    poll: {
      findUnique: vi.fn(),
    },
    vote: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    idea: {
      create: vi.fn(),
      update: vi.fn(),
    },
    event: {
      findUnique: vi.fn(),
    },
    eventRegistration: {
      count: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    auditLog: {
      create: vi.fn(),
    },
    otpCode: {
      create: vi.fn(),
      deleteMany: vi.fn(),
      findFirst: vi.fn(),
    },
  },
}));

describe("1. Registration API (POST /api/register)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("successfully signs up a new user and returns 201", async () => {
    (prisma.user.findFirst as any).mockResolvedValue(null);
    (prisma.user.create as any).mockResolvedValue({
      id: "user-123",
      name: "Amani Mwangi",
      email: "amani@example.com",
      phone: "+254712345678",
      county: "Nairobi",
      constituency: "Westlands",
      civicRole: "Young Professional / Citizen",
      role: "MEMBER",
    });

    const req = new Request("http://localhost:3000/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Amani Mwangi",
        email: "amani@example.com",
        phone: "+254712345678",
        county: "Nairobi",
        password: "Password123!",
      }),
    });

    const res = await registerHandler(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.user.id).toBe("user-123");
    expect(data.user.email).toBe("amani@example.com");
    expect(prisma.user.create).toHaveBeenCalledTimes(1);
    expect(sendConfirmationEmail).toHaveBeenCalledTimes(1);
  });

  it("rejects signup with duplicate email and returns 409 Conflict", async () => {
    (prisma.user.findFirst as any).mockResolvedValue({
      id: "existing-user",
      email: "amani@example.com",
      phone: "+254799999999",
    });

    const req = new Request("http://localhost:3000/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Duplicate User",
        email: "amani@example.com",
        phone: "+254712345678",
        county: "Nairobi",
        password: "Password123!",
      }),
    });

    const res = await registerHandler(req);
    expect(res.status).toBe(409);
    const data = await res.json();
    expect(data.error).toMatch(/account with this email already exists/i);
    expect(prisma.user.create).not.toHaveBeenCalled();
  });

  it("rejects signup with duplicate phone number and returns 409 Conflict", async () => {
    (prisma.user.findFirst as any).mockResolvedValue({
      id: "existing-user",
      email: "other@example.com",
      phone: "+254712345678",
    });

    const req = new Request("http://localhost:3000/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Duplicate Phone User",
        email: "unique@example.com",
        phone: "+254712345678",
        county: "Mombasa",
        password: "Password123!",
      }),
    });

    const res = await registerHandler(req);
    expect(res.status).toBe(409);
    const data = await res.json();
    expect(data.error).toMatch(/account with this phone already exists/i);
    expect(prisma.user.create).not.toHaveBeenCalled();
  });
});

describe("2. Poll Voting API (POST /api/polls/[pollId]/vote)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("successfully records a vote for an authenticated user and returns 201", async () => {
    (getServerSession as any).mockResolvedValue({
      user: { id: "user-123", email: "user@nybf.ke" },
    });
    (prisma.poll.findUnique as any).mockResolvedValue({
      id: "poll-1",
      question: "Which sector requires highest budget priority?",
      active: true,
    });
    (prisma.vote.findUnique as any).mockResolvedValue(null);
    (prisma.vote.create as any).mockResolvedValue({
      id: "vote-1",
      userId: "user-123",
      pollId: "poll-1",
      pollOptionId: "opt-1",
    });

    const req = new Request("http://localhost:3000/api/polls/poll-1/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ optionId: "opt-1" }),
    });

    const res = await voteHandler(req, { params: { pollId: "poll-1" } });
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.vote.pollOptionId).toBe("opt-1");
  });

  it("rejects a second vote on the same poll by the same user with a clean 409", async () => {
    (getServerSession as any).mockResolvedValue({
      user: { id: "user-123", email: "user@nybf.ke" },
    });
    (prisma.poll.findUnique as any).mockResolvedValue({ id: "poll-1", active: true });
    // Simulate user already voted in check
    (prisma.vote.findUnique as any).mockResolvedValue({
      id: "vote-1",
      userId: "user-123",
      pollId: "poll-1",
      pollOptionId: "opt-1",
    });

    const req = new Request("http://localhost:3000/api/polls/poll-1/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ optionId: "opt-1" }),
    });

    const res = await voteHandler(req, { params: { pollId: "poll-1" } });
    expect(res.status).toBe(409);
    const data = await res.json();
    expect(data.error).toBe("You have already voted in this poll.");
  });

  it("allows changing an existing vote to a different option in the same poll", async () => {
    (getServerSession as any).mockResolvedValue({
      user: { id: "user-123", email: "user@nybf.ke" },
    });
    (prisma.poll.findUnique as any).mockResolvedValue({ id: "poll-1", active: true });
    (prisma.vote.findUnique as any).mockResolvedValue({
      id: "vote-1",
      userId: "user-123",
      pollId: "poll-1",
      pollOptionId: "opt-1",
    });
    (prisma.vote.update as any).mockResolvedValue({
      id: "vote-1",
      userId: "user-123",
      pollId: "poll-1",
      pollOptionId: "opt-2",
    });

    const req = new Request("http://localhost:3000/api/polls/poll-1/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ optionId: "opt-2" }),
    });

    const res = await voteHandler(req, { params: { pollId: "poll-1" } });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.changed).toBe(true);
    expect(data.vote.pollOptionId).toBe("opt-2");
  });

  it("handles database-level unique constraint violation (P2002) with a clean 409", async () => {
    (getServerSession as any).mockResolvedValue({
      user: { id: "user-123", email: "user@nybf.ke" },
    });
    (prisma.poll.findUnique as any).mockResolvedValue({ id: "poll-1", active: true });
    (prisma.vote.findUnique as any).mockResolvedValue(null);

    // Simulate race condition where prisma.vote.create hits the unique constraint P2002
    const p2002Error: any = new Error("Unique constraint failed on the fields: (`userId`,`pollId`)");
    p2002Error.code = "P2002";
    (prisma.vote.create as any).mockRejectedValue(p2002Error);

    const req = new Request("http://localhost:3000/api/polls/poll-1/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ optionId: "opt-1" }),
    });

    const res = await voteHandler(req, { params: { pollId: "poll-1" } });
    expect(res.status).toBe(409);
    const data = await res.json();
    expect(data.error).toBe("You have already voted in this poll.");
  });
});

describe("3. Idea Submission API (POST /api/ideas)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("successfully creates a policy idea proposal and returns 201", async () => {
    (getServerSession as any).mockResolvedValue({
      user: { id: "user-123", email: "user@nybf.ke" },
    });
    (prisma.idea.create as any).mockResolvedValue({
      id: "idea-1",
      userId: "user-123",
      title: "Ringfence 30% Procurement for Youth Enterprises",
      description: "Require quarterly audit reports from all 47 counties on AGPO compliance.",
      category: "Public Procurement",
      status: "PENDING",
    });

    const req = new Request("http://localhost:3000/api/ideas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Ringfence 30% Procurement for Youth Enterprises",
        description: "Require quarterly audit reports from all 47 counties on AGPO compliance.",
        category: "Public Procurement",
      }),
    });

    const res = await createIdeaHandler(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.idea.id).toBe("idea-1");
  });

  it("rejects invalid submission with short title or description and returns 400", async () => {
    (getServerSession as any).mockResolvedValue({
      user: { id: "user-123", email: "user@nybf.ke" },
    });

    const req = new Request("http://localhost:3000/api/ideas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "A", // too short (min 3)
        description: "B", // too short (min 5)
      }),
    });

    const res = await createIdeaHandler(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBeDefined();
    expect(prisma.idea.create).not.toHaveBeenCalled();
  });
});

describe("4. Event Registration API (POST /api/events/[eventId]/register)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("successfully registers an authenticated user for an event and returns 201", async () => {
    (getServerSession as any).mockResolvedValue({
      user: { id: "user-123", email: "user@nybf.ke" },
    });
    (prisma.event.findUnique as any).mockResolvedValue({
      id: "event-1",
      title: "National Youth Budget Town Hall 2026",
      capacity: 100,
    });
    (prisma.eventRegistration.count as any).mockResolvedValue(45);
    (prisma.eventRegistration.findUnique as any).mockResolvedValue(null);
    (prisma.eventRegistration.create as any).mockResolvedValue({
      id: "reg-1",
      userId: "user-123",
      eventId: "event-1",
      reminded: false,
    });

    const req = new Request("http://localhost:3000/api/events/event-1/register", {
      method: "POST",
    });

    const res = await registerEventHandler(req, { params: { eventId: "event-1" } });
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.registration.id).toBe("reg-1");
  });

  it("rejects duplicate registration for the same event by the same user with 409", async () => {
    (getServerSession as any).mockResolvedValue({
      user: { id: "user-123", email: "user@nybf.ke" },
    });
    (prisma.event.findUnique as any).mockResolvedValue({
      id: "event-1",
      capacity: 100,
    });
    (prisma.eventRegistration.count as any).mockResolvedValue(10);
    (prisma.eventRegistration.findUnique as any).mockResolvedValue({
      id: "reg-existing",
      userId: "user-123",
      eventId: "event-1",
    });

    const req = new Request("http://localhost:3000/api/events/event-1/register", {
      method: "POST",
    });

    const res = await registerEventHandler(req, { params: { eventId: "event-1" } });
    expect(res.status).toBe(409);
    const data = await res.json();
    expect(data.error).toBe("You are already registered for this event.");
  });

  it("rejects registration when event is at full capacity with 409", async () => {
    (getServerSession as any).mockResolvedValue({
      user: { id: "user-123", email: "user@nybf.ke" },
    });
    (prisma.event.findUnique as any).mockResolvedValue({
      id: "event-1",
      capacity: 50,
    });
    // Already 50 registered
    (prisma.eventRegistration.count as any).mockResolvedValue(50);

    const req = new Request("http://localhost:3000/api/events/event-1/register", {
      method: "POST",
    });

    const res = await registerEventHandler(req, { params: { eventId: "event-1" } });
    expect(res.status).toBe(409);
    const data = await res.json();
    expect(data.error).toBe("This event is at full capacity.");
    expect(prisma.eventRegistration.create).not.toHaveBeenCalled();
  });
});

describe("5. Admin Idea Moderation (PATCH /api/admin/ideas/[ideaId])", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("approves idea when requested by an ADMIN and records audit log", async () => {
    (getServerSession as any).mockResolvedValue({
      user: { id: "admin-1", email: "admin@nybf.go.ke", role: "ADMIN" },
    });
    (prisma.idea.update as any).mockResolvedValue({
      id: "idea-1",
      status: "APPROVED",
      adminResponse: "Included in Parliamentary Memorandum Clause 4.",
    });
    (prisma.auditLog.create as any).mockResolvedValue({ id: "audit-1" });

    const req = new Request("http://localhost:3000/api/admin/ideas/idea-1", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: "APPROVED",
        adminResponse: "Included in Parliamentary Memorandum Clause 4.",
      }),
    });

    const res = await moderateIdeaHandler(req, { params: { ideaId: "idea-1" } });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.idea.status).toBe("APPROVED");
    expect(prisma.auditLog.create).toHaveBeenCalledWith({
      data: {
        actorId: "admin-1",
        action: "IDEA_APPROVED",
        targetId: "idea-1",
      },
    });
  });

  it("rejects idea when requested by an ADMIN", async () => {
    (getServerSession as any).mockResolvedValue({
      user: { id: "admin-1", email: "admin@nybf.go.ke", role: "ADMIN" },
    });
    (prisma.idea.update as any).mockResolvedValue({
      id: "idea-2",
      status: "REJECTED",
      adminResponse: "Does not fall within public finance scope.",
    });
    (prisma.auditLog.create as any).mockResolvedValue({ id: "audit-2" });

    const req = new Request("http://localhost:3000/api/admin/ideas/idea-2", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: "REJECTED",
        adminResponse: "Does not fall within public finance scope.",
      }),
    });

    const res = await moderateIdeaHandler(req, { params: { ideaId: "idea-2" } });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.idea.status).toBe("REJECTED");
    expect(prisma.auditLog.create).toHaveBeenCalledWith({
      data: {
        actorId: "admin-1",
        action: "IDEA_REJECTED",
        targetId: "idea-2",
      },
    });
  });

  it("returns 403 Forbidden when non-admin user attempts moderation", async () => {
    (getServerSession as any).mockResolvedValue({
      user: { id: "member-1", email: "member@nybf.ke", role: "MEMBER" },
    });

    const req = new Request("http://localhost:3000/api/admin/ideas/idea-1", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: "APPROVED",
      }),
    });

    const res = await moderateIdeaHandler(req, { params: { ideaId: "idea-1" } });
    expect(res.status).toBe(403);
    const data = await res.json();
    expect(data.error).toMatch(/Admin access required/i);
    expect(prisma.idea.update).not.toHaveBeenCalled();
    expect(prisma.auditLog.create).not.toHaveBeenCalled();
  });
});

describe("6. Two-Factor OTP Authentication API (POST /api/auth/otp)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("dispatches 6-digit OTP code when an ADMIN requests login verification", async () => {
    (prisma.user.findUnique as any).mockResolvedValue({
      id: "admin-1",
      name: "Secretariat Lead",
      email: "secretariat@nybf.ke",
      role: "ADMIN",
      passwordHash: null,
    });
    (prisma.otpCode.deleteMany as any).mockResolvedValue({ count: 1 });
    (prisma.otpCode.create as any).mockResolvedValue({
      id: "otp-1",
      email: "secretariat@nybf.ke",
      code: "654321",
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    const req = new Request("http://localhost:3000/api/auth/otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "secretariat@nybf.ke" }),
    });

    const res = await otpHandler(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.requiresOtp).toBe(true);
    expect(data.role).toBe("ADMIN");
    expect(prisma.otpCode.create).toHaveBeenCalled();
  });

  it("returns requiresOtp: false for regular MEMBER accounts without generating OTP", async () => {
    (prisma.user.findUnique as any).mockResolvedValue({
      id: "member-1",
      name: "Youth Citizen",
      email: "citizen@nybf.ke",
      role: "MEMBER",
      passwordHash: null,
    });

    const req = new Request("http://localhost:3000/api/auth/otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "citizen@nybf.ke" }),
    });

    const res = await otpHandler(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.requiresOtp).toBe(false);
    expect(data.role).toBe("MEMBER");
    expect(prisma.otpCode.create).not.toHaveBeenCalled();
  });
});

describe("7. County Devolution & CIDP Resolution", () => {
  it("resolves statutory CIDP documents and COG repository links for counties", () => {
    const nairobiCidp = getCidpForCounty("Nairobi");
    expect(nairobiCidp.county).toBe("Nairobi");
    expect(nairobiCidp.title).toContain("Nairobi County Integrated Development Plan");
    expect(nairobiCidp.cycle).toBe("2023 – 2027");
    expect(nairobiCidp.documentUrl).toContain("cog.go.ke");
    expect(nairobiCidp.statutoryBasis).toContain("Section 108");

    const mombasaCidp = getCidpForCounty("Mombasa");
    expect(mombasaCidp.county).toBe("Mombasa");
    expect(mombasaCidp.title).toContain("Mombasa");
    expect(mombasaCidp.documentUrl).toContain("Mombasa");
  });
});

