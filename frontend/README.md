# NYBF Connect — Frontend & API Platform

Digital platform for Kenya's **National Youth Budget Forum (NYBF)** — driving continuous youth participation in budget education, legislative consultations, devolved county tracking, economic opportunities, and citizen forums.

---

## 🚀 Quickstart

```bash
# Install dependencies
npm install

# Run database migrations / push schema
npm run db:push

# Seed database with initial modules, polls, opportunities, and events
npm run db:seed

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔔 Notifications & Cron Jobs (Task 1)

NYBF Connect includes automated email and SMS notification pipelines:

### 1. Welcome / Registration Email (`sendConfirmationEmail`)
- **Trigger**: Called automatically from `POST /api/register` upon successful account creation.
- **Provider**: [Resend](https://resend.com)
- **Environment Variables**:
  - `RESEND_API_KEY`: Your Resend API key (`re_...`).
  - `EMAIL_FROM`: (Optional) Sender email address (defaults to `NYBF Connect <onboarding@resend.dev>`).
- **Resilience**: If `RESEND_API_KEY` is not set in development or production, the app logs a console warning and skips delivery gracefully without throwing an unhandled exception or breaking user registration.

### 2. Event Reminder SMS (`sendEventReminder`)
- **Trigger**: Dispatched prior to public budget town halls and county assembly hearings.
- **Provider**: [Africa's Talking SMS](https://africastalking.com)
- **Environment Variables**:
  - `AFRICASTALKING_API_KEY`: Africa's Talking API key.
  - `AFRICASTALKING_USERNAME`: Africa's Talking username (`sandbox` or your live account username).
  - `AFRICASTALKING_SENDER_ID`: (Optional) Alphanumeric sender ID.
- **Resilience**: Automatically formats Kenyan mobile numbers (`07...`, `01...`, `254...` -> E.164 `+254...`). Skips gracefully with a warning if credentials are unset.

### 3. Scheduled Reminder Route (`/api/cron/event-reminders`)
- **Function**: Scans for event registrations happening within the next 24 hours where `reminded = false`.
- **Execution**: Sends the Africa's Talking SMS reminder to each attendee and flips `reminded = true` atomically to guarantee no attendee receives duplicate reminders.
- **Security**: Protected with optional Bearer token authentication via `CRON_SECRET`.

### How to Trigger the Cron Route in Production

#### Option A: Vercel Cron (Recommended for Vercel)
Configured in `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron/event-reminders",
      "schedule": "0 * * * *"
    }
  ]
}
```
Set `CRON_SECRET` in your Vercel Project Environment Settings. Vercel automatically passes `Authorization: Bearer <CRON_SECRET>` with each automated request.

#### Option B: External Schedulers (Linux Crontab / cURL)
```bash
0 * * * * curl -X POST https://nybf-connect.vercel.app/api/cron/event-reminders \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

#### Option C: GitHub Actions Workflow
Add a scheduled workflow `.github/workflows/cron-reminders.yml` running on a cron schedule (`0 * * * *`) that triggers the endpoint using repository secrets.

---

## 📱 PWA & Offline Support (Task 2)

NYBF Connect is a Progressive Web App powered by `@ducanh2912/next-pwa` and Workbox:

- **Budget Hub Caching (Cache-First)**: All learning modules and curriculum pages (`/budget-hub/*`) are stored using a `CacheFirst` strategy (30-day retention). Once visited, citizen educational content remains fully readable with zero internet connectivity.
- **API & Dynamic Pages (Network-First)**: Dynamic endpoints (`/api/*`) use `NetworkFirst` (10s network timeout) before falling back to cached responses.
- **Offline Fallback (`/~offline`)**: If a user navigates to an uncached page while offline, the service worker renders the dedicated offline screen directing them back to cached Budget Hub modules.
- **Valid PWA Icons**: Complete icon suite located in `public/`:
  - `icon-192.png` (192x192, standard)
  - `icon-512.png` (512x512, standard)
  - `icon-maskable-192.png` (192x192, adaptive)
  - `icon-maskable-512.png` (512x512, adaptive)
  - `apple-touch-icon.png` (180x180, iOS Safari)
  - `favicon.ico` (multi-resolution ICO)

### Platform Installation Notes (Android vs iOS)
- **Android**: Installable directly via the ambient browser prompt or "Install App / Add to Home Screen" in Chrome, Edge, and Samsung Internet.
- **iOS Safari**: iOS does not support the `beforeinstallprompt` event or automatic install banners. Users install manually by tapping the **Share** button in Safari and selecting **"Add to Home Screen"**. The app provides dedicated `apple-touch-icon.png` and `apple-mobile-web-app-capable` meta tags. Note: Push notifications on iOS require iOS 16.4+ and standalone home screen installation.

---

## 🧪 Automated Testing (Task 3)

The project includes an automated test suite powered by **Vitest**:

```bash
# Run the test suite
npm run test

# Run tests with coverage
npm run test:coverage
```

### Covered Test Scenarios:
1. **Registration Flow**:
   - Successful user signup with password hashing.
   - Duplicate email rejection (409 Conflict).
   - Duplicate phone number rejection (409 Conflict).
2. **Poll Voting Flow**:
   - Successful cast of vote.
   - Rejection of double voting by the same user on the same poll (clean 409 Conflict via database unique constraint handling).
3. **Youth Voice Idea Submission**:
   - Successful proposal submission.
   - Rejection on validation failures (short title, missing body, 400 Bad Request).
4. **Event Registration**:
   - Successful registration.
   - Rejection of duplicate registration by the same user (409 Conflict).
   - Enforcement of event maximum capacity limits (409 Conflict when full).
5. **Admin Moderation & Role RBAC**:
   - Admin approval / rejection flow with audit trail creation.
   - Non-admin user access rejection (403 Forbidden).

---

## 🔐 Environment Variables Reference

See `.env.example` for all required and optional configuration keys:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/nybf_connect"
NEXTAUTH_SECRET="your-32-char-random-secret"
NEXTAUTH_URL="http://localhost:3000"
RESEND_API_KEY=""
AFRICASTALKING_API_KEY=""
AFRICASTALKING_USERNAME=""
AFRICASTALKING_SENDER_ID=""
CRON_SECRET=""
```
