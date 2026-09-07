# NYBF Connect

Digital platform for Kenya's National Youth Budget Forum — continuous youth
engagement in budget education, consultations, opportunities, and events.

## Repository Structure

```
NYBF_Connect/
│
├── frontend/             # Next.js 14 (App Router) · TypeScript · Tailwind CSS · Prisma
│   ├── app/              # Routes & pages (Home, About, Leadership, Budget Hub, Youth Voice, Opportunities, Events, Media, My NYBF, Admin)
│   ├── components/       # UI components, navigation, charts, modals
│   ├── lib/              # Database clients, auth config, utility helpers
│   ├── pictures/         # Authentic Kenyan youth photography assets
│   ├── public/           # Static assets, manifests, and optimized media
│   ├── prisma/           # Database schema and seed scripts
│   └── package.json      # Frontend scripts & dependencies
│
└── backend/              # Node.js / Express · TypeScript · Prisma API Engine
    ├── src/              # Server, API routes (Auth, Admin, Polls, Events, Ideas, etc.), and services
    ├── prisma/           # Database schema and seed scripts
    └── package.json      # Backend scripts & dependencies
```

## Running the Platform

### 1. Frontend (Next.js 14)
Navigate to `frontend/`:
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Standalone Backend (Express API Engine)
Navigate to `backend/`:
```bash
cd backend
npm install
npm run db:generate
npm run dev
```
The API engine will start on [http://localhost:5000](http://localhost:5000). To route frontend API calls to this backend, set `BACKEND_URL="http://localhost:5000"` in `frontend/.env`.

### Quality & Type Checks (in `frontend/`):
```bash
npx tsc --noEmit
npm run lint
npm run test
```

## Notifications & Scheduled Cron Jobs

NYBF Connect supports automated transactional emails and SMS reminders:

1. **Email Confirmations (Resend):**
   - Automatically dispatched upon successful account creation (`POST /api/register`).
   - Configured via `RESEND_API_KEY` in `.env`.
   - In development or if unset, it logs a warning and skips gracefully without throwing.

2. **Event SMS Reminders (Africa's Talking):**
   - Dispatched to registered citizens prior to scheduled public hearings and town halls.
   - Configured via `AFRICASTALKING_API_KEY` and `AFRICASTALKING_USERNAME` (sandbox or production).
   - In development or if unset, it logs a warning and skips gracefully.

3. **Scheduled Reminder Cron Route (`/api/cron/event-reminders`):**
   - Scans the database for event registrations where `reminded = false` and the event is taking place within the next 24 hours.
   - Sends the SMS reminder and updates `reminded = true` atomically to guarantee zero duplicate messages.

### Triggering the Cron Job in Production

The cron route `/api/cron/event-reminders` must be invoked on a regular schedule (e.g. hourly):

#### Option A: Vercel Cron (Recommended for Vercel Deployments)
`frontend/vercel.json` defines the hourly schedule:
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
Set `CRON_SECRET` in your Vercel Project Environment Variables. Vercel automatically passes `Authorization: Bearer <CRON_SECRET>` on every invocation.

#### Option B: External Scheduler (cURL / GitHub Actions / Upstash QStash / Linux Cron)
If hosted outside Vercel, invoke the route via an authenticated HTTP request:
```bash
curl -X POST https://your-domain.com/api/cron/event-reminders \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```
Or with a standard Linux crontab entry:
```crontab
0 * * * * curl -s -X POST https://your-domain.com/api/cron/event-reminders -H "Authorization: Bearer $CRON_SECRET" > /dev/null
```

## Progressive Web App (PWA) & Offline Support

NYBF Connect is a Progressive Web App powered by `@ducanh2912/next-pwa` and Workbox:
- **Budget Hub Caching (Cache-First)**: Learning modules under `/budget-hub/*` are cached for 30 days. Once opened online, citizens can study them anywhere without data or connectivity.
- **Dynamic Endpoints (Network-First)**: Interactive endpoints under `/api/*` query the network first (with a 10s timeout) and fall back gracefully.
- **Offline Fallback Page (`/~offline`)**: Rendered automatically when an uncached route fails offline.
- **Icons & Metadata**: Includes 192x192, 512x512, maskable icons, Apple touch icons (`/apple-touch-icon.png`), and standalone viewport metadata.
- **Installability**: Android users receive native install prompts in Chrome/Edge; iOS Safari users install via Share -> "Add to Home Screen".

## Automated Testing & CI

The platform includes test coverage for all core user journeys:
```bash
npm run test
```
Tested flows:
- **Registration**: Signup success, duplicate email rejection (409), duplicate phone rejection (409).
- **Poll Voting**: Successful vote, double voting rejection on unique constraint (409).
- **Youth Voice Ideas**: Successful submission, schema validation failure handling (400).
- **Event Registration**: Registration, duplicate registration rejection (409), and capacity limit enforcement (409).
- **Admin Idea Moderation**: Approve/reject status transition, and non-admin role rejection (403).

