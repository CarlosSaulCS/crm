## CRM — Modern Next.js App

A professional, elegant CRM built with Next.js 15 App Router, TypeScript, Tailwind CSS, Prisma + PostgreSQL, NextAuth, Zod, React Query, React Hook Form, and Zustand.

## 🚀 Features

- **Dashboard Profesional**: Gráficos avanzados con Recharts, KPIs en tiempo real
- **Gestión Avanzada de Datos**: Búsqueda, filtrado, paginación, exportación CSV
- **Módulos CRM Completos**: Contactos, Empresas, Deals, Tareas con interfaces profesionales
- **Responsive Design**: Optimizado para móviles y desktop

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS + shadcn/ui
- Prisma ORM + PostgreSQL
- NextAuth (JWT sessions, credentials provider)
- Zod, React Query, React Hook Form, Zustand
- Recharts para visualizaciones

## Prerequisites

- Node.js 18+
- PostgreSQL instance (local o cloud)

## 🛠️ Setup Local

1. Copy environment variables and adjust values:

```bash
cp .env.example .env
```

2. Configure your PostgreSQL database in `.env`:

```bash
# For local development with Docker
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/crm?schema=public

# Or use your PostgreSQL instance
DATABASE_URL=postgresql://username:password@host:port/database
```

3. Install dependencies:

```bash
npm install
```

4. Generate Prisma client and push schema:

```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

5. Run the dev server:

```bash
npm run dev
```

## 🌐 Deployment on Vercel

### 1. Configure Database

**Option A: Vercel Postgres (Recommended)**

1. Go to your Vercel project dashboard
2. Navigate to "Storage" tab
3. Create a new "Postgres Database"
4. Copy the `DATABASE_URL` provided

**Option B: External PostgreSQL**

- Use Supabase, Railway, or any PostgreSQL provider
- Get the connection string

### 2. Set Environment Variables in Vercel

Add these variables in your Vercel project settings:

```bash
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-strong-secret-key
DATABASE_URL=your-postgresql-connection-string
AUTH_SALT_ROUNDS=12
```

### 3. Deploy

```bash
git add .
git commit -m "feat: Configure PostgreSQL for production"
git push
```

Vercel will automatically deploy when you push to your main branch.

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
```
