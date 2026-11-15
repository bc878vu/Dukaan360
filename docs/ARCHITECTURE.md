# Dukaan360 Architecture

**Version:** 1.0 (foundation, 2026-11-15)
**Source of truth:** [PRD.md](PRD.md) (Parts 1–6).

## Overview

Dukaan360 is a multi-tenant SaaS. One codebase serves many businesses; every
business-owned record carries a `business_id`, and Row Level Security (RLS) in
PostgreSQL enforces tenant isolation at the database level — never trust a
client-provided business ID without a membership check.

## System map

```text
Web (Next.js) ─┐
Mobile (Expo) ─┤── Supabase Auth ──► PostgreSQL + RLS
               ├── Supabase Storage (product images, attachments, logos)
               ├── Supabase Realtime (stock + sales updates)
               └── Edge Functions (server-side money operations, billing)
```

## Monorepo

pnpm workspaces + Turborepo. Shared code lives in `packages/` so web and
mobile never duplicate business rules:

- `packages/types` — canonical TypeScript types for every entity.
- `packages/schemas` — Zod validation schemas (single source of truth).
- `packages/business-logic` — pure functions (totals, tax, low-stock, balances).
- `packages/ui` — shared presentational components.
- `packages/localization` — English + Urdu strings.
- `packages/api-client` — typed Supabase client factory.
- `packages/utilities` — currency/date formatting, helpers.
- `packages/config` — app constants (plans, currencies, roles).

## Principles

1. Separate frontend and backend concerns.
2. Shared TypeScript business logic where practical.
3. Centralized validation (Zod schemas in `packages/schemas`).
4. Reusable UI components.
5. Database-level authorization (RLS on every table).
6. Tenant isolation (`business_id` everywhere).
7. Offline-first mobile architecture (Expo SQLite + sync queue).
8. Secure server-side business operations (Edge Functions for money).
9. Automated testing (unit + integration + e2e + security).
10. Version-controlled database migrations (`supabase/migrations/`).

## First release scope (P0)

Auth, business creation, multi-tenant security, dashboard, products,
customers, suppliers, inventory, sales + billing, purchases, expenses,
digital khata, basic reports, responsive web, basic Android + iOS app.

## Later (P1 / P2)

Offline POS + sync, barcode scanning, staff + permissions, PDF invoices,
advanced reports, notifications, subscriptions, multiple branches, AI
assistant, online storefront, advanced accounting, multiple warehouses,
specialized business modules (restaurant, pharmacy, garment, wholesale).
