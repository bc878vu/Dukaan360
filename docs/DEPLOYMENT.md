# Dukaan360 Deployment

**Version:** 1.0 (foundation, 2026-11-15)

## Services

| Service | Purpose |
|---|---|
| GitHub | Source control (`bc878vu/Dukaan360`) |
| Vercel | Web deployment (`apps/web`) |
| Supabase | Backend + database (**new dedicated Dukaan360 project**) |
| EAS Build | Android/iOS builds (`apps/mobile`) |
| Sentry | Error monitoring |
| GitHub Actions | CI/CD (`.github/workflows/ci.yml`) |

## Web (Vercel)

1. Import the repo in Vercel, root directory `apps/web`.
2. Framework preset: Next.js.
3. Environment variables: `NEXT_PUBLIC_SUPABASE_URL`,
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_APP_URL`.
4. Never add `SUPABASE_SERVICE_ROLE_KEY` to a client-side Vercel project;
   server-only usage goes through Edge Functions.

## Backend (Supabase)

1. Create a **new** Supabase project for Dukaan360 (do NOT reuse the
   Easy Khata project).
2. Link the CLI: `supabase link --project-ref <ref>`.
3. Push migrations: `supabase db push` (or `pnpm db:push`).
4. Apply the seed: `supabase/seed.sql` (subscription plans).
5. Set Edge Function secrets separately from client env vars.

## Mobile (EAS)

1. `cd apps/mobile && eas build --platform android` / `--platform ios`.
2. App credentials live in EAS, never in the repo.

## Environments

- `main` branch = production. Feature branches + PR checks required.
- Preview deployments for every PR (web only).
