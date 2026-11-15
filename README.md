# Dukaan360

**Manage. Grow. Succeed.**

Dukaan360 is a multilingual, multi-tenant business management platform for retail, wholesale, service and other small businesses.

## Planned platforms
- Web: Next.js + TypeScript
- Mobile: React Native + Expo
- Backend: Supabase / PostgreSQL

## Repository workspace
- `apps/web` — web application
- `apps/mobile` — Expo mobile application
- `packages/*` — shared types, schemas and localization
- `supabase/migrations` — versioned database migrations
- `docs` — product, architecture and security documentation

## Getting started
Requirements: Node.js LTS and pnpm.

```bash
corepack enable
pnpm install
pnpm dev:web
```

See [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) before configuring credentials.

## Security
This is an initial scaffold, not a production service. Use a dedicated Supabase project for Dukaan360. Never expose a Supabase service-role key in browser or mobile code. All tenant-owned tables must have reviewed Row Level Security policies before production use.

## Product
- Initial languages: English and Urdu
- Initial market: Pakistan, with internationalization built in
- Business model: Free tier, subscriptions and carefully placed advertising
