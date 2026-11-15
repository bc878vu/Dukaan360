# Supabase Edge Functions

Server-side operations live here (Deno + TypeScript):

- Money movement (payments, settlements) — transactions + idempotency keys.
- Billing (subscription renewals, usage limits).
- PDF generation (invoices, statements).
- Anything that must not trust the client.

Add one folder per function with its own `index.ts` + `deno.json`.
