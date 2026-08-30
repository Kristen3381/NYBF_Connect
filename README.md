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
└── backend/              # Dedicated backend services & APIs
    └── .gitkeep
```

## Running the Frontend

Navigate to the `frontend/` directory:

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Quality & Type Checks (in `frontend/`):
```bash
npx tsc --noEmit
npm run lint
```
