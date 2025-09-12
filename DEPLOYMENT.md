# 🚀 Deployment Instructions - Vercel

## Current Issue

The app shows "Server error" because the PostgreSQL database is not configured in Vercel.

## Quick Fix Steps

### 1. 🗄️ Create PostgreSQL Database

**Option A: Vercel Postgres (Recommended)**

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your `crm` project
3. Go to **Storage** tab
4. Click **"Create Database"** → **"Postgres"**
5. Name: `crm-database`
6. Click **"Create"**

**Option B: Supabase (Free)**

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Go to **Settings** → **Database**
4. Copy **Connection string** (URI format)

### 2. ⚙️ Configure Environment Variables

In your Vercel project settings:

1. Go to **Settings** → **Environment Variables**
2. Add these variables for **Production, Preview & Development**:

```bash
NEXTAUTH_URL = https://crm-phi-sooty.vercel.app
NEXTAUTH_SECRET = 5f2bac13df4ffda9d1a05296999094cd1ecc75ae9b7211c1ebc51ef4b11ada30
DATABASE_URL = [your-postgresql-connection-string]
AUTH_SALT_ROUNDS = 12
```

### 3. 🗄️ Migrate Database

After setting up the database and environment variables:

**Option A: Using Vercel CLI (if installed)**

```bash
vercel env pull .env.production
npm run db:migrate-prod
```

**Option B: Manual Setup**

1. Connect to your PostgreSQL database
2. Run these commands with your production DATABASE_URL:

```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

### 4. 🔄 Redeploy

After configuration:

1. Go to Vercel → Your project → Deployments
2. Click on latest deployment → **"Redeploy"**

## Expected Result

✅ App will load successfully
✅ Database will be populated with seed data
✅ All CRM features will work

---

**Note**: The code is ready and working. You just need to configure the database connection in Vercel!
