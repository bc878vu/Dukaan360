# Dukaan360 — Manage. Grow. Succeed.

Multi-tenant business management SaaS for Pakistan and beyond.
Retail, general stores, grocery, garment, wholesale, restaurants, services and online sellers — one unified system.

**Foundation:** v1.0 (approved 2026-11-15). Full PRD: [docs/PRD.md](docs/PRD.md).

## Stack

| Layer | Technology |
|---|---|
| Web | Next.js + React + TypeScript + Tailwind CSS + shadcn/ui |
| Mobile | React Native + Expo + TypeScript + NativeWind |
| Backend | Supabase (Auth, PostgreSQL, Storage, Realtime, Edge Functions) |
| Monorepo | pnpm workspaces + Turborepo |
| Hosting | Vercel (web) + Supabase (backend) + EAS Build (mobile) |

## Monorepo layout

```text
apps/web        Next.js web app (dashboard, POS, inventory, reports)
apps/mobile     Expo mobile app (Android + iOS)
packages/*      Shared types, schemas, business logic, UI, i18n, API client
supabase/       Migrations, edge functions, seed data
docs/           PRD, architecture, database, API, security, deployment
tests/          Unit, integration, e2e, security tests
```

## Quick start

```bash
# 1. Install dependencies (pnpm required)
pnpm install

# 2. Copy env template and fill in your Supabase project values
cp .env.example .env.local

# 3. Run the web app
pnpm --filter @dukaan360/web dev

# 4. Run the mobile app
pnpm --filter @dukaan360/mobile start
```

## Scripts

| Command | What it does |
|---|---|
| `pnpm dev` | Start all apps in dev mode |
| `pnpm build` | Build all apps and packages |
| `pnpm lint` | Lint everything |
| `pnpm typecheck` | Type-check everything |
| `pnpm test` | Run the test suites |

## Rules

- Never commit `.env` files or service-role credentials.
- Every business-owned record carries a `business_id`; Row Level Security is mandatory on every table.
- Do not mix Easy Khata code into this repository without an explicit code audit and approval.
- Database changes go through versioned migrations in `supabase/migrations/`.
