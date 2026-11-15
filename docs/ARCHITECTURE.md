# Architecture

- apps/web: Next.js web application
- apps/mobile: Expo React Native application
- packages/*: shared types, validation, localization and domain logic
- Supabase: PostgreSQL, Auth, Storage, Realtime and server-side functions

## Multi-tenancy
Users join businesses through business_members. Every tenant-owned row carries business_id. Access must be checked against active membership and role permissions in PostgreSQL RLS policies.

## Financial integrity
Use PostgreSQL transactions for sale posting, payment posting and stock movement. Correct posted records through reversals/adjustments, not silent deletion. Use idempotency keys for retryable requests.

## Offline strategy (planned)
Mobile SQLite outbox, stable operation IDs, server-side idempotency, sync status and explicit conflict handling. Never silently overwrite financial records.

Use separate development and production Supabase projects. Never commit credentials.
