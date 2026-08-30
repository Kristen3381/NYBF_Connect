# NYBF Connect

Digital platform for Kenya's National Youth Budget Forum — continuous youth
engagement in budget education, consultations, opportunities, and events.
Built to the accompanying SRS.

## Stack
Next.js 14 (App Router) · TypeScript · Tailwind CSS · Prisma · PostgreSQL ·
NextAuth (credentials) · Zod

## What's already built
- Prisma schema covering every SRS entity (Users, BudgetModule,
  ModuleProgress, Poll/PollOption/Vote, Idea, Opportunity, Event,
  EventRegistration, AuditLog)
- Auth: registration API + NextAuth credentials provider
- Working API routes: `/api/register`, `/api/opportunities`, `/api/events`,
  `/api/events/[eventId]/register`, `/api/polls`,
  `/api/polls/[pollId]/vote`, `/api/ideas`, `/api/admin/ideas/[ideaId]`
- Pages wired to live data: Home, Join, Youth Voice (vote + submit idea),
  Budget Hub, Opportunities, Events (with registration)
- Seed script with sample content matching the original prototype

## What's not built yet
See `ANTIGRAVITY_TICKETS.md` — Member Dashboard, Budget module detail page,
Admin Dashboard, notifications, PWA service worker, and tests are scoped
as discrete tickets to hand to Antigravity CLI one at a time.

## Design system

- **Palette:** built entirely from teal `#215D6E` (`--brand`), with light/dark
  tints and a full light/dark surface system defined as CSS variables in
  `app/globals.css` (`:root` for light, `.dark` for dark) — flip via the
  toggle in the nav, powered by `next-themes`
- **Type:** Times New Roman (`font-serif`) for headings, Arial (`font-sans`)
  for body copy — configured in `tailwind.config.ts`
- **Signature look:** glassmorphism — translucent, blurred panels
  (`.glass-panel` in `app/globals.css`) floating over full-bleed photography,
  rounded-2xl/3xl corners throughout, slow 8s photo crossfades in the hero
  (`components/hero-photo-collage.tsx`)
- **Dark mode:** `components/theme-provider.tsx` wraps the app;
  `components/theme-toggle.tsx` is the sun/moon button in the nav

`app/preview/page.tsx` is the reference implementation. `ANTIGRAVITY_TICKETS.md`
(Ticket 9) covers porting it to the real, database-backed pages.

## Photo assets
- `public/community/` — used in the rotating hero background crossfade
- `public/currency/` — Kenyan shilling imagery, used as a translucent
  background behind the Budget Hub section
- `public/events/` — real event/forum photos, used as poster-style
  backgrounds on the Events cards

## See the UI with zero setup

`app/preview/page.tsx` renders the full homepage design with hardcoded
sample data — no `.env`, no Postgres, no Prisma calls at all. Just:

```bash
npm install
npm run dev
```

Then open **http://localhost:3000/preview**. The poll vote and join modal
are interactive but don't persist anywhere — it's for looking at the design
only. `http://localhost:3000/` (the real homepage) will still error until
you connect a database, since it queries Prisma directly.

## Local setup (real, database-backed app)

```bash
npm install
cp .env.example .env       # fill in DATABASE_URL, NEXTAUTH_SECRET, etc.
npx prisma generate
npx prisma db push         # creates tables from schema.prisma
npm run db:seed            # loads sample opportunities/events/poll/modules
npm run dev
```

Generate a `NEXTAUTH_SECRET` with:
```bash
openssl rand -base64 32
```

## Working alongside Antigravity CLI
This repo is intentionally structured so an agent can extend it safely:
- Every API route is scoped to one resource, validated with Zod
- `prisma/schema.prisma` is the single source of truth for data shape —
  extend it, then `npx prisma migrate dev` to generate a migration
- `components/ui-blocks.tsx` holds shared presentational components — reuse
  them rather than duplicating markup in new pages
- `ANTIGRAVITY_TICKETS.md` has ready-to-paste, self-contained tasks mapped
  to SRS requirement IDs (FR-x.x) — feed them one at a time, run
  `npm run lint && npx tsc --noEmit` between tickets, commit after each

## Folder structure
```
app/
  api/            # route handlers, one folder per resource
  join/           # registration page
  budget-hub/     # Budget Hub listing (+ module detail — ticket 2)
  youth-voice/    # polls + idea submission
  opportunities/  # opportunity listings
  events/         # events + registration
  dashboard/      # member dashboard — ticket 1
  admin/          # admin dashboard — ticket 3
components/       # shared UI (nav, cards, dashboard blocks)
lib/               # prisma client, auth config, utils
prisma/            # schema + seed script
```
