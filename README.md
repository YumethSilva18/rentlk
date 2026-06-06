# SL Vehicle Rental Platform

A full-stack vehicle rental marketplace for Sri Lanka.

## Monorepo Structure

```
sl-vehicle-rental-platform/
├── apps/
│   ├── backend/          # NestJS API server
│   ├── frontend/         # Next.js web app
│   └── mobile-app/       # React Native mobile app
├── libs/
│   ├── shared-types/     # Shared TypeScript types
│   └── validation-schemas/ # Shared Zod validation schemas
└── docker-compose.yml    # Development infrastructure
```

## Tech Stack

- **Backend**: NestJS, Prisma, PostgreSQL, Redis, BullMQ
- **Frontend**: Next.js 14, React 18, TailwindCSS
- **Mobile**: React Native (Expo)

## Getting Started

1. Clone the repository
2. Start infrastructure: `docker-compose up -d`
3. Install dependencies: `npm install`
4. Set up environment: `cp apps/backend/.env.example apps/backend/.env`
5. Run migrations: `npm run db:migrate`
6. Start backend: `npm run dev:backend`
7. Start frontend: `cd apps/frontend && npm run dev`

## Environment Variables

See `apps/backend/.env.example` for all required environment variables.
