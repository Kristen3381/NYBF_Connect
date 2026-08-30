# NYBF Connect — Build Tickets for Antigravity

Scaffold status: Next.js App Router + TS + Tailwind + Prisma/PostgreSQL + NextAuth
is in place with working DB models, auth, and API routes for registration,
opportunities, events, polls, and ideas. Home, Join, Youth Voice, Budget Hub,
Opportunities, and Events pages are live and hitting the real DB.

Each ticket below is scoped to hand to Antigravity as a single prompt/task.
Reference file paths so it edits in place rather than reinventing structure.

---

### TICKET 1 — Member Dashboard (FR-3.1, FR-3.2)
**Files:** `app/dashboard/page.tsx` (new), `app/api/me/route.ts` (new)
Build an authenticated dashboard at `/dashboard` showing:
- votes cast (join `Vote` -> `Poll`)
- ideas submitted with status badges (`Idea.status`)
- events registered (`EventRegistration` -> `Event`)
- budget modules completed (`ModuleProgress` where completed = true)
- a profile edit form (name, county) that PATCHes `/api/me`
Redirect unauthenticated users to `/join`. Use `getServerSession(authOptions)`.

---

### TICKET 2 — Budget Module Detail Page (FR-4.2, FR-4.3)
**Files:** `app/budget-hub/[moduleId]/page.tsx` (new)
Render `BudgetModule.contentBody` (or embed `contentUrl` video), with a
"Mark as complete" button that upserts `ModuleProgress` for the logged-in
user. Show a progress badge on the Budget Hub listing (`app/budget-hub/page.tsx`)
using `ModuleProgress` counts per module.

---

### TICKET 3 — Admin Dashboard (FR-8.1–FR-8.4)
**Files:** `app/admin/page.tsx`, `app/admin/ideas/page.tsx`,
`app/admin/opportunities/page.tsx`, `app/admin/events/page.tsx`,
`app/admin/users/page.tsx` (all new)
Gate the whole `/admin` route group with a layout that checks
`session.user.role === "ADMIN"` and redirects otherwise. Build:
- Overview: registrations by county (bar chart), votes cast, ideas pending
- Ideas moderation table calling `PATCH /api/admin/ideas/[ideaId]`
- CRUD tables for Opportunities and Events (reuse existing POST routes,
  add PATCH/DELETE handlers to `app/api/opportunities/[id]/route.ts` and
  `app/api/events/[id]/route.ts`)
- User management: list/deactivate, promote to COORDINATOR

---

### TICKET 4 — County Coordinator role scoping
**Files:** `app/api/opportunities/route.ts`, `app/api/events/route.ts`
Coordinators should only manage listings where `createdBy` matches their
user id (admins see/manage everything). Add this filter to GET for the
admin views and enforce on PATCH/DELETE.

---

### TICKET 5 — Notifications (FR-2.3, FR-7.3)
**Files:** `lib/notifications.ts` (new)
Implement `sendConfirmationEmail(user)` via Resend and
`sendEventReminder(registration)` via Africa's Talking SMS. Wire
`sendConfirmationEmail` into `app/api/register/route.ts`. Add a cron-style
route `app/api/cron/event-reminders/route.ts` that finds registrations for
events happening in the next 24h where `reminded = false`, sends SMS, and
flips the flag. Document how to schedule it (Vercel Cron or external cron).

---

### TICKET 6 — PWA service worker (FR-9.2, FR-9.3)
Add `next-pwa` to `next.config.js`, configure caching strategy for Budget
Hub pages (cache-first) and API routes (network-first with fallback).
Add app icons referenced in `public/manifest.json`.

---

### TICKET 7 — Tests
Add Playwright (or Vitest + Testing Library) coverage for: registration
flow, poll voting (including duplicate-vote rejection), idea submission,
and event registration. Wire into a `test` script and a GitHub Actions
workflow.

---

### TICKET 9 — Port the design system to the remaining DB-backed pages
**Status: `app/page.tsx` (homepage) is done — has the full teal glass system,
working photo rotation, and light/dark mode.**
**Remaining files:** `app/join/page.tsx`, `app/youth-voice/page.tsx`,
`app/budget-hub/page.tsx`, `app/opportunities/page.tsx`, `app/events/page.tsx`
Use `app/page.tsx` and `app/preview/page.tsx` as the reference — same
palette, fonts, glass panels, rounded corners. Important contrast rule
learned the hard way: any panel with white text sitting over a photo must
use `.glass-panel-photo` (fixed-dark), never `.glass-panel` (theme-adaptive,
turns white in light mode). `components/nav.tsx`, `components/ui-blocks.tsx`,
`components/hero-photo-collage.tsx`, `components/theme-toggle.tsx`, and
`components/theme-provider.tsx` are already updated — the remaining pages
just need their markup/classNames brought in line while keeping their live
Prisma data fetching intact. Also swap the placeholder icon blocks in
`app/events/page.tsx` for the poster-style photo cards the same way
`app/preview/page.tsx` does.

---

### TICKET 8 — Auth polish
Add a real login form at `/login` (currently registration only creates an
account; NextAuth credentials sign-in isn't yet wired to a UI). Add a
session-aware header state (show "Dashboard"/"Sign out" instead of
"Join NYBF" when logged in) in `components/nav.tsx`.

---

## How to run each ticket through Antigravity
1. Open this repo in Antigravity CLI.
2. Paste one ticket at a time as the task description — they're scoped to
   be self-contained.
3. Ask it to run `npm run lint` and `npx tsc --noEmit` after each ticket
   before moving to the next.
4. Commit after each ticket passes so changes stay reviewable.
