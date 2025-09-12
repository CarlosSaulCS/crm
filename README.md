## CRM — Modern Next.js App

A professional, elegant CRM built with Next.js 14 App Router, TypeScript, Tailwind CSS v4, Prisma + PostgreSQL, NextAuth, Zod, React Query, React Hook Form, and Zustand.

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS v4
- Prisma ORM + PostgreSQL
- NextAuth (JWT sessions, credentials provider)
- Zod, React Query, React Hook Form, Zustand

## Prerequisites

- Node.js 18+
- Docker Desktop (for PostgreSQL) or an external Postgres instance

## Setup

1. Copy environment variables and adjust values:

```bash
cp .env.example .env
```

2. Start PostgreSQL (if you have Docker):

```bash
docker compose up -d db
```

Alternatively, point `DATABASE_URL` in `.env` to your Postgres instance.

3. Generate Prisma client:

```bash
npm run postinstall
```

4. Push schema and seed data:

```bash
npx prisma db push
npm run db:seed
```

5. Run the dev server:

```bash
npm run dev
```

Open http://localhost:3000

Seeded login: `admin@acme.com` / `admin123`

## Scripts

- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run start` — Start production server
- `npm run lint` — Lint
- `npm run postinstall` — Generate Prisma client
- `npm run db:push` — Push schema to DB
- `npm run db:migrate` — Create/apply migrations (dev)
- `npm run db:seed` — Seed database

## Project Structure

- `app/` — App Router routes and pages
- `app/api/*` — Route handlers (REST) for core entities
- `lib/` — Prisma and auth setup
- `prisma/` — Prisma schema and seeds
- `.vscode/` — Editor settings

## Notes

- Tailwind CSS v4 is enabled via PostCSS integration and `@import "tailwindcss";` in `app/globals.css`.
- Authentication protects everything except `/login` and `/api/auth/*` (see `middleware.ts`).
