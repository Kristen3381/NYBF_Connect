# NYBF Connect — Standalone Backend & API Engine

Node.js / Express & Prisma backend service for Kenya's **National Youth Budget Forum (NYBF) Connect**.

---

## 🚀 Quickstart

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Generate Prisma Client
npm run db:generate

# Push schema to database
npm run db:push

# Seed initial database records
npm run db:seed

# Start development server (auto-reloads on file changes)
npm run dev
```

The server runs by default on [http://localhost:5000](http://localhost:5000).

---

## 📡 Endpoints Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Health check & service status |
| `POST` | `/api/register` | Citizen & member registration |
| `POST` | `/api/auth/otp` | Two-Factor Authentication OTP passcode dispatch |
| `GET` | `/api/admin/stats` | High-level metrics, registrations, and recent items |
| `PATCH` | `/api/admin/ideas/:id` | Secretariat idea moderation (Approve / Reject) |
| `PATCH/DELETE` | `/api/admin/users/:id` | Role elevation and account management |
| `GET/POST` | `/api/polls` | National Youth Pulse consultations and voting |
| `GET/POST` | `/api/ideas` | Citizen policy proposals |
| `GET/POST` | `/api/events` | Dialogue events, town halls, and RSVPs |
| `GET/POST` | `/api/opportunities` | Fellowships, grants, and internships |
| `GET/POST` | `/api/media` | Articles, broadcasts, and policy briefs |
| `POST` | `/api/budget-hub/progress` | User module tracking and completion |
| `ALL` | `/api/cron/event-reminders` | Scheduled 24-hour event SMS dispatch via Africa's Talking |
| `GET/PATCH` | `/api/me` | Logged-in citizen profile and participation dashboard |

---

## 🔧 Environment Variables

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Key variables:
- `PORT`: Server port (default `5000`).
- `CORS_ORIGIN`: Allowed origins (e.g. `http://localhost:3000`).
- `DATABASE_URL`: PostgreSQL connection string.
- `RESEND_API_KEY`: Resend API key for confirmation and OTP emails.
- `AFRICASTALKING_API_KEY` & `AFRICASTALKING_USERNAME`: SMS reminders integration.
- `CRON_SECRET`: Optional Bearer token for securing scheduled jobs.
