import { Resend } from "resend";

export interface UserNotificationPayload {
  name: string;
  email: string;
  county?: string | null;
  civicRole?: string | null;
}

export interface EventReminderPayload {
  attendeeName?: string | null;
  attendeePhone: string;
  eventTitle: string;
  eventDate: string | Date;
  eventLocation: string;
}

/**
 * Sends a welcome/confirmation email upon successful registration.
 * Uses Resend. If RESEND_API_KEY is unset in development, logs a warning and skips gracefully.
 */
export async function sendConfirmationEmail(user: UserNotificationPayload) {
  const apiKey = process.env.RESEND_API_KEY?.trim();

  if (!apiKey) {
    console.warn(
      `[Notifications] RESEND_API_KEY is not configured. Skipping welcome email to: ${user.email}`
    );
    return { success: false, skipped: true, reason: "MISSING_API_KEY" };
  }

  try {
    const resend = new Resend(apiKey);
    const countyText = user.county ? `representing ${user.county} County` : "from across the 47 counties";
    const roleText = user.civicRole ? ` (${user.civicRole})` : "";

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "NYBF Connect <onboarding@resend.dev>",
      to: [user.email],
      subject: "Karibu NYBF Connect — National Youth Budget Forum",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #042f2e; color: #1e293b; margin: 0; padding: 24px; }
              .container { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
              .header { background: #0f766e; padding: 32px 24px; text-align: center; color: #ffffff; }
              .header h1 { margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
              .header p { margin: 8px 0 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #99f6e4; }
              .content { padding: 32px 28px; line-height: 1.6; color: #334155; }
              .content h2 { font-size: 18px; color: #0f766e; margin-top: 0; }
              .badge { display: inline-block; background: #ccfbf1; color: #0f766e; padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: 700; text-transform: uppercase; margin-bottom: 16px; }
              .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin: 20px 0; }
              .btn { display: inline-block; background: #0f766e; color: #ffffff !important; font-weight: 700; font-size: 13px; text-decoration: none; padding: 12px 28px; border-radius: 9999px; margin-top: 16px; }
              .footer { background: #f1f5f9; padding: 20px 24px; font-size: 11px; text-align: center; color: #64748b; border-top: 1px solid #e2e8f0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>NYBF Connect</h1>
                <p>National Youth Budget Forum</p>
              </div>
              <div class="content">
                <span class="badge">Verified Youth Citizen</span>
                <h2>Jambo ${user.name}${roleText},</h2>
                <p>
                  Welcome to <strong>NYBF Connect</strong>, the civic participation network ${countyText}.
                  Under Article 201 of the Constitution of Kenya, public finance must adhere to openness, accountability, and citizen participation.
                </p>
                <div class="card">
                  <strong>What you can do right now:</strong>
                  <ul style="margin: 8px 0 0 0; padding-left: 20px;">
                    <li><strong>Budget Hub:</strong> Learn budget cycles and county devolution mechanics.</li>
                    <li><strong>Youth Voice:</strong> Vote in national priority polls and submit policy ideas for Parliament.</li>
                    <li><strong>Opportunities:</strong> Access AGPO tenders, fellowships, and youth grants.</li>
                    <li><strong>Events:</strong> Register for public participation hearings in your county.</li>
                  </ul>
                </div>
                <p style="text-align: center;">
                  <a href="${process.env.NEXTAUTH_URL || "https://nybf-connect.vercel.app"}/my-nybf" class="btn">
                    Access My NYBF Profile &rarr;
                  </a>
                </p>
              </div>
              <div class="footer">
                &copy; 2026 National Youth Budget Forum. All 47 Counties &bull; 1 Collective Voice.<br>
                This is an automated notification from the NYBF Secretariat.
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error("[Notifications] Resend API error sending confirmation email:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error("[Notifications] Exception in sendConfirmationEmail:", err);
    return { success: false, error: err };
  }
}

export interface CivicReminderPayload {
  name: string;
  email: string;
  reminderType: "UNVOTED_POLLS" | "INCOMPLETE_PROFILE" | "UPCOMING_EVENT";
  title: string;
  description: string;
  actionUrl?: string;
  actionText?: string;
}

/**
 * Sends civic engagement reminders (e.g. unvoted active consultations, incomplete county profile).
 * Gracefully skips if RESEND_API_KEY is unset.
 */
export async function sendCivicEngagementReminder(payload: CivicReminderPayload) {
  const apiKey = process.env.RESEND_API_KEY?.trim();

  if (!apiKey) {
    console.warn(
      `[Notifications] RESEND_API_KEY is not configured. Skipping civic reminder to: ${payload.email}`
    );
    return { success: false, skipped: true, reason: "MISSING_API_KEY" };
  }

  try {
    const resend = new Resend(apiKey);
    const actionUrl = payload.actionUrl || `${process.env.NEXTAUTH_URL || "https://nybf.ke"}/youth-voice`;
    const actionText = payload.actionText || "Participate Now →";

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "NYBF Connect <onboarding@resend.dev>",
      to: [payload.email],
      subject: `NYBF Civic Reminder: ${payload.title}`,
      html: `
        <!DOCTYPE html>
        <html>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #042f2e; color: #1e293b; margin: 0; padding: 24px;">
            <div style="max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
              <div style="background: #0f766e; padding: 28px 24px; text-align: center; color: #ffffff;">
                <h1 style="margin: 0; font-size: 22px; font-weight: 800;">NYBF Connect</h1>
                <p style="margin: 4px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #99f6e4;">National Youth Budget Forum</p>
              </div>
              <div style="padding: 28px; line-height: 1.6; color: #334155;">
                <h2 style="font-size: 18px; color: #0f766e; margin-top: 0;">Jambo ${payload.name},</h2>
                <p style="font-size: 14px; margin-top: 8px;">${payload.description}</p>
                <div style="text-align: center; margin-top: 24px;">
                  <a href="${actionUrl}" style="display: inline-block; background: #0f766e; color: #ffffff !important; font-weight: 700; font-size: 13px; text-decoration: none; padding: 12px 28px; border-radius: 9999px;">
                    ${actionText}
                  </a>
                </div>
              </div>
              <div style="background: #f1f5f9; padding: 16px 24px; font-size: 11px; text-align: center; color: #64748b;">
                &copy; 2026 National Youth Budget Forum. Article 201 — 47 Counties, 1 Voice.
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error("[Notifications] Resend API error sending civic reminder:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error("[Notifications] Exception in sendCivicEngagementReminder:", err);
    return { success: false, error: err };
  }
}

/**
 * Sends an SMS event reminder via Africa's Talking.
 * If AFRICASTALKING_API_KEY or AFRICASTALKING_USERNAME is unset, logs a warning and skips gracefully.
 */
export async function sendEventReminder(registration: EventReminderPayload) {
  const apiKey = process.env.AFRICASTALKING_API_KEY?.trim();
  const username = process.env.AFRICASTALKING_USERNAME?.trim();

  if (!apiKey || !username) {
    console.warn(
      `[Notifications] Africa's Talking credentials unset. Skipping SMS reminder for ${registration.attendeePhone}`
    );
    return { success: false, skipped: true, reason: "MISSING_AFRICASTALKING_CONFIG" };
  }

  // Format date nicely
  const dateStr =
    registration.eventDate instanceof Date
      ? registration.eventDate.toLocaleDateString("en-KE", {
          weekday: "short",
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : String(registration.eventDate);

  // Normalize phone number to E.164 format (+254...)
  let formattedPhone = registration.attendeePhone.replace(/[\s\-\(\)]/g, "");
  if (formattedPhone.startsWith("0")) {
    formattedPhone = "+254" + formattedPhone.slice(1);
  } else if (formattedPhone.startsWith("254")) {
    formattedPhone = "+" + formattedPhone;
  } else if (!formattedPhone.startsWith("+")) {
    formattedPhone = "+" + formattedPhone;
  }

  const greeting = registration.attendeeName ? `Jambo ${registration.attendeeName}` : "Jambo";
  const message = `${greeting}, reminder for NYBF event: "${registration.eventTitle}" on ${dateStr} at ${registration.eventLocation}. Your voice shapes Kenya's budget! Access details at ${process.env.NEXTAUTH_URL || "nybf.ke"}`;

  try {
    const isSandbox = username.toLowerCase() === "sandbox";
    const endpoint = isSandbox
      ? "https://api.sandbox.africastalking.com/version1/messaging"
      : "https://api.africastalking.com/version1/messaging";

    const params = new URLSearchParams();
    params.append("username", username);
    params.append("to", formattedPhone);
    params.append("message", message);
    if (process.env.AFRICASTALKING_SENDER_ID) {
      params.append("from", process.env.AFRICASTALKING_SENDER_ID);
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        apiKey: apiKey,
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const responseData = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error("[Notifications] Africa's Talking SMS API error:", response.status, responseData);
      return { success: false, error: responseData };
    }

    return { success: true, data: responseData };
  } catch (err) {
    console.error("[Notifications] Exception sending Africa's Talking SMS reminder:", err);
    return { success: false, error: err };
  }
}

export interface OtpEmailPayload {
  name?: string | null;
  email: string;
  code: string;
}

/**
 * Sends a 6-digit one-time passcode (OTP) for admin/coordinator two-factor authentication.
 * Uses Resend. If RESEND_API_KEY is unset, logs development passcode to console.
 */
export async function sendOtpEmail({ email, name, code }: OtpEmailPayload) {
  const apiKey = process.env.RESEND_API_KEY?.trim();

  if (!apiKey) {
    console.warn(
      `[Notifications] RESEND_API_KEY is not configured. Admin OTP for ${email} is: [${code}]`
    );
    return { success: true, devMode: true, code };
  }

  try {
    const resend = new Resend(apiKey);
    const greeting = name ? `Jambo ${name}` : "Jambo Administrator";

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "NYBF Connect Security <security@resend.dev>",
      to: [email],
      subject: `Your NYBF Security Passcode: ${code}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #042f2e; color: #1e293b; margin: 0; padding: 24px; }
              .container { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
              .header { background: #0f766e; padding: 28px 24px; text-align: center; color: #ffffff; }
              .header h1 { margin: 0; font-size: 22px; font-weight: 800; }
              .header p { margin: 6px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #99f6e4; }
              .content { padding: 32px 28px; line-height: 1.6; color: #334155; text-align: center; }
              .otp-box { background: #f0fdfa; border: 2px dashed #0f766e; border-radius: 12px; padding: 20px; margin: 24px 0; }
              .otp-code { font-family: monospace; font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #0f766e; }
              .footer { background: #f8fafc; padding: 16px 24px; font-size: 11px; text-align: center; color: #64748b; border-top: 1px solid #e2e8f0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>NYBF Connect Staff Security</h1>
                <p>Two-Factor Authentication Passcode</p>
              </div>
              <div class="content">
                <p style="text-align: left; font-size: 14px;"><strong>${greeting}</strong>,</p>
                <p style="text-align: left; font-size: 14px; color: #64748b;">
                  A login request was initiated for your administrator / coordinator account on NYBF Connect. Enter the one-time passcode below to verify your session:
                </p>
                <div class="otp-box">
                  <div class="otp-code">${code}</div>
                  <div style="font-size: 11px; color: #0f766e; font-weight: 700; margin-top: 8px; text-transform: uppercase; letter-spacing: 1px;">
                    Valid for 10 Minutes
                  </div>
                </div>
                <p style="text-align: left; font-size: 12px; color: #94a3b8;">
                  If you did not request this code, please secure your administrative credentials immediately.
                </p>
              </div>
              <div class="footer">
                &copy; 2026 National Youth Budget Forum. Staff Security Operations.
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error("[Notifications] Resend API error sending OTP email:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error("[Notifications] Exception sending OTP email:", err);
    return { success: false, error: err };
  }
}

