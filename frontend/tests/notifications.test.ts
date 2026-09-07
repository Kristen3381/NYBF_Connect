import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { sendConfirmationEmail, sendEventReminder } from "@/lib/notifications";

describe("Notifications Service (lib/notifications.ts)", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("sendConfirmationEmail skips gracefully when RESEND_API_KEY is unset without throwing", async () => {
    delete process.env.RESEND_API_KEY;
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const result = await sendConfirmationEmail({
      name: "Amani Mwangi",
      email: "amani@example.com",
      county: "Nairobi",
    });

    expect(result.success).toBe(false);
    expect(result.skipped).toBe(true);
    expect(result.reason).toBe("MISSING_API_KEY");
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining("RESEND_API_KEY is not configured")
    );
    warnSpy.mockRestore();
  });

  it("sendEventReminder skips gracefully when Africa's Talking credentials are unset", async () => {
    delete process.env.AFRICASTALKING_API_KEY;
    delete process.env.AFRICASTALKING_USERNAME;
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const result = await sendEventReminder({
      attendeeName: "Amani Mwangi",
      attendeePhone: "0712345678",
      eventTitle: "National Youth Budget Town Hall",
      eventDate: new Date("2026-09-12"),
      eventLocation: "KICC Nairobi",
    });

    expect(result.success).toBe(false);
    expect(result.skipped).toBe(true);
    expect(result.reason).toBe("MISSING_AFRICASTALKING_CONFIG");
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining("Africa's Talking credentials unset")
    );
    warnSpy.mockRestore();
  });
});
