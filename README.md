# PolarSnacks

Record every meal on your travels. Pin it on a map. Relive the flavors.

## Stack

- **Next.js 16** (App Router) with TypeScript
- **Supabase** (Postgres, Auth, Storage)
- **Tailwind CSS** + shadcn/ui
- **Leaflet** for maps
- **Rabobank betaalverzoek** for payments
- Deployed on **Vercel**

## Getting Started

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```
2. Fill in your credentials (see [Environment Variables](#environment-variables) below)
3. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000)

## Database Setup

Run the migration in `supabase/migrations/001_initial_schema.sql` against your Supabase project.

Create storage buckets:
- `meal-photos` (private)
- `trip-covers` (private)

## Environment Variables

### Supabase

| Variable | Where to find it |
|----------|-----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | [Supabase Dashboard](https://supabase.com/dashboard) → your project → **Settings → API** → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Same page → **Project API keys** → `anon` / `public` key |
| `SUPABASE_SERVICE_ROLE_KEY` | Same page → **Project API keys** → `service_role` key (keep secret, never expose client-side) |

### Payments

| Variable | Where to find it |
|----------|-----------------|
| `NEXT_PUBLIC_RABOBANK_BETAALVERZOEK_URL` | Your Rabobank betaalverzoek link (e.g. `https://betaalverzoek.rabobank.nl/betaalverzoek/?id=...`). Create one in the Rabobank app under **Betaalverzoek** |

### App

| Variable | Where to find it |
|----------|-----------------|
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` for local development. Set to your deployed URL (e.g. your Vercel domain) in production |

## Project Structure

```
src/
├── app/              # Next.js App Router pages
│   ├── (auth)/       # Login, auth callback
│   ├── (app)/        # Authenticated app pages
│   └── api/          # API routes (payment confirmation)
├── components/       # React components
├── lib/              # Supabase clients, utilities
└── types/            # TypeScript type definitions
```
