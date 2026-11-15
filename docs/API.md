# Dukaan360 API

**Version:** 1.0 (foundation, 2026-11-15)

## Access pattern

There is no custom REST server in v1. Clients talk to Supabase directly
through the typed client in `packages/api-client`:

- **Auth** — Supabase Auth (email + optional Google). Sessions via
  `supabase.auth`.
- **Data** — PostgREST over PostgreSQL, guarded by RLS. Every query is
  scoped by `business_id`; the client never sends a business ID the user
  is not a member of.
- **Files** — Supabase Storage (product images, expense attachments,
  business logos).
- **Realtime** — Supabase Realtime subscriptions for stock and sales
  updates inside a business.
- **Server-side operations** — Supabase Edge Functions under
  `supabase/functions/` for money movement, billing, PDF generation and
  anything that must not trust the client (idempotency keys, server-side
  transaction IDs).

## Conventions

- All money is `numeric`; the client sends amounts as strings/Decimals,
  never floats.
- Invoice numbers are unique per business; the server assigns them.
- Every mutation that moves money or stock runs in a database transaction
  and writes an `audit_logs` row.
- Errors are surfaced with a stable `{ code, message }` shape; the UI
  maps codes to English/Urdu strings via `packages/localization`.

## To be defined as modules land

Per-module endpoints, Edge Function contracts and webhook handlers are
documented here as each P0 module ships (products → sales → purchases →
expenses → khata → reports).
