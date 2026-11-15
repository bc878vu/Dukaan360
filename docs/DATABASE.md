# Dukaan360 Database

**Version:** 1.0 (foundation, 2026-11-15)
**Engine:** PostgreSQL via Supabase. Migrations: `supabase/migrations/`.

## Principles

- Every business-owned record has a `business_id`.
- A user can belong to many businesses; a business can have many users
  (`business_members` with a role + status).
- Money uses `numeric(20,4)` — never floats.
- Invoice numbers are unique per business.
- Posted financial transactions are never silently deleted — corrections use
  reversals or adjustment records.
- Audit history is preserved (`audit_logs`).

## Core tables (migration 0001)

| Group | Tables |
|---|---|
| Identity / tenancy | `profiles`, `businesses`, `business_members`, `branches` |
| Products / inventory | `categories`, `products` (variants, warehouses, stock tables follow) |
| Customers / suppliers | `customers`, `suppliers` (ledger + payments follow) |
| Sales | `sales`, `sale_items` (returns + payments follow) |
| Expenses | `expenses` (categories follow) |
| Audit | `audit_logs` |

Full table list and relationships: PRD Part 5. Purchases, payments, inventory
movements, ledger entries, accounting journals, warehouses, returns,
subscriptions and permissions tables are added by later migrations, before
their workflows are enabled.

## Security (migration 0002)

- RLS enabled on every exposed table.
- Helper `public.is_business_member(business_id)` — true when the caller is
  an active member of that business.
- Policies use both `USING` and `WITH CHECK` for writes.
- Members can view their businesses' records; only owners/admins change
  business settings; users cannot change their own roles.
- Sensitive operations (money movement, subscription changes) run through
  trusted server-side code (Edge Functions), never directly from the client.

## Conventions

- Primary keys: `uuid` (`gen_random_uuid()`), except `profiles.id` which
  references `auth.users(id)`.
- Timestamps: `created_at timestamptz default now()`; `updated_at` where
  rows change.
- Currency codes are stored with monetary records (`currency_code char(3)`).
