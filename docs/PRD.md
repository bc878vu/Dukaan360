# Dukaan360 — Official Project Foundation

**Foundation finalized — Version 1.0**
**Received from user:** 2026-11-15 (WhatsApp side chat)
**Status:** Approved Foundation
**Source conversation:** https://chatgpt.com/share/6af91753-feb0-83ee-857e-865d8b996280
**Short link:** https://chatgpt.com/s/t_6af917482a648191976807abe4702e32

> New independent project. Completely separate from Easy Khata — its own repository, database, credentials and deployment. Do not mix Easy Khata code in without an explicit code audit and approval.

---

Product: Dukaan360
Tagline: Manage. Grow. Succeed.
Business: Multi-tenant Business Management SaaS
Platforms: Android, iOS, Web
Languages: English, Urdu
Initial market: Pakistan + International
Budget: Bootstrapped / low cost
Architecture: Completely separate new project

## 1. Finalized product decisions

| Decision | Final selection |
|---|---|
| Product name | Dukaan360 |
| Project | New independent repository |
| Database | New dedicated Supabase project |
| Frontend web | Next.js + TypeScript |
| Mobile | React Native + Expo |
| Backend | Supabase + PostgreSQL |
| UI | Tailwind CSS + NativeWind |
| Hosting | Vercel + Supabase |
| First release | Universal business core |
| Languages | English + Urdu |
| Monetization | Ads + subscriptions |
| Architecture | Multi-tenant SaaS |

Important architecture decision: All business categories will be supported by a configurable business-type system. However, the first release will use a shared core of products, inventory, sales, purchases, expenses, customers and suppliers. Specialized restaurant, pharmacy, garment and wholesale workflows will be added as separate extensions instead of making the first release unnecessarily complicated.

Dukaan360 will not depend on Easy Khata's existing database, repository, credentials or deployment.

---

# DUKAAN360
## Product Requirements Document (PRD) & Technical Foundation

**Document Version:** 1.0
**Status:** Approved Foundation
**Product Type:** Multi-tenant SaaS Business Management Platform
**Platforms:** Android, iOS, Web
**Languages:** English, Urdu
**Target Markets:** Pakistan and International
**Development Strategy:** Bootstrapped, MVP-first

---

# PART 1 — PRODUCT REQUIREMENTS DOCUMENT

## 1. Product Overview

Dukaan360 is a cloud-based business management platform designed to help businesses manage daily operations through one unified system.

It will support:
- Retail shops
- General stores
- Grocery businesses
- Garment shops
- Wholesale and distribution
- Restaurants
- Service businesses
- Online sellers
- Other small and medium businesses

### Product objectives

1. Simplify daily business operations.
2. Replace disconnected spreadsheets and manual records.
3. Provide accurate inventory and financial tracking.
4. Support multiple branches and employees.
5. Provide access through mobile and desktop.
6. Enable offline business operations.
7. Provide business insights and analytics.
8. Generate recurring subscription revenue.

## 2. User Roles

| Role | Permissions |
|---|---|
| Platform Super Admin | Manage entire SaaS |
| Business Owner | Full business control |
| Business Admin | Manage business operations |
| Branch Manager | Manage assigned branch |
| Accountant | Financial records and reports |
| Cashier | POS and sales |
| Inventory Manager | Products and stock |
| Staff | Assigned permissions only |

A user may belong to multiple businesses and have different roles in each business.

## 3. Functional Requirements

### Module A — Authentication
- Email registration.
- Email verification.
- Login and logout.
- Password reset.
- Session management.
- Optional Google authentication.
- Business onboarding.
- Account deletion request.

### Module B — Business Management
- Create business.
- Edit business details.
- Select business category.
- Set currency and timezone.
- Configure tax settings.
- Create branches.
- Switch between businesses.
- Manage business logo and branding.

### Module C — Products
- Create, edit and archive products.
- Product categories.
- SKU and barcode.
- Purchase and selling prices.
- Units of measurement.
- Product variants.
- Product images.
- Low-stock threshold.
- Tax configuration.

### Module D — Inventory
- Stock balance.
- Stock in/out.
- Stock adjustments.
- Stock transfers.
- Purchase receiving.
- Sales deductions.
- Stock movement history.
- Inventory valuation.
- Low-stock alerts.

### Module E — Sales and POS
- Fast checkout.
- Barcode scanning.
- Product search.
- Cart management.
- Discounts.
- Tax calculation.
- Multiple payment methods.
- Partial payments.
- Credit sales.
- Returns and refunds.
- Receipt generation.
- Daily sales closing.

### Module F — Customers and Suppliers
- Customer profiles.
- Supplier profiles.
- Contact information.
- Outstanding balances.
- Transaction history.
- Payment history.
- Customer statements.
- Supplier statements.
- Due-date reminders.

### Module G — Digital Khata
- Credit entries.
- Debit entries.
- Customer ledger.
- Supplier ledger.
- Payments and settlements.
- Outstanding balance.
- Transaction references.
- PDF statements.

### Module H — Purchases
- Purchase orders.
- Supplier selection.
- Purchase items.
- Goods received.
- Purchase invoices.
- Purchase payments.
- Purchase returns.
- Stock updates.

### Module I — Expenses
- Expense categories.
- Expense entry.
- Payment method.
- Expense attachments.
- Recurring expenses.
- Expense reports.

### Module J — Financial Reports
- Profit and loss.
- Sales summary.
- Purchase summary.
- Cash flow.
- Expense reports.
- Stock valuation.
- Customer balances.
- Supplier balances.
- Daily, weekly, monthly and yearly reports.

### Module K — Staff
- Invite employees.
- Assign roles.
- Custom permissions.
- Branch assignment.
- Employee activity.
- Login history.
- Audit logs.

### Module L — Subscription
- Free plan.
- Starter plan.
- Business plan.
- Enterprise plan.
- Monthly and annual billing.
- Usage limits.
- Subscription renewal.
- Payment history.
- Upgrade and downgrade.
- Grace periods and cancellation.

### Module M — Notifications
- Low-stock alerts.
- Customer payment reminders.
- Purchase reminders.
- Daily business summaries.
- Subscription reminders.
- Staff notifications.

### Module N — Offline Support
- Local database.
- Offline POS.
- Offline stock lookup.
- Pending transaction queue.
- Automatic synchronization.
- Conflict detection.
- Duplicate prevention.
- Sync status.

### Module O — Online Store
- Public business storefront.
- Product catalog.
- Product availability.
- Customer orders.
- Order management.
- Order status.
- Online payment integration.

### Module P — AI Assistant (Future)
- Natural-language business questions.
- Sales summaries.
- Expense insights.
- Inventory recommendations.
- Anomaly detection.
- Automated report explanations.

AI must use permission-checked, aggregated business data and must not independently create or modify financial records without explicit authorization.

---

# PART 2 — MVP FEATURE PRIORITY

## P0: Mandatory for first usable release

1. Authentication.
2. Business creation.
3. Multi-tenant security.
4. Business dashboard.
5. Product management.
6. Customer management.
7. Supplier management.
8. Inventory management.
9. Sales and billing.
10. Purchases.
11. Expenses.
12. Digital Khata.
13. Basic reports.
14. Responsive website.
15. Basic Android and iOS application.

## P1: First major upgrade

- Offline POS and synchronization.
- Barcode scanning.
- Staff and permissions.
- PDF invoices.
- Advanced reports.
- Notifications.
- Subscription management.
- Multiple branches.

## P2: Expansion

- AI business assistant.
- Online storefront.
- Advanced accounting.
- Multiple warehouses.
- Automated payment reconciliation.
- Specialized business modules.
- Advanced integrations.

---

# PART 3 — TECHNOLOGY ARCHITECTURE

## 1. Frontend

### Web
- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Zustand
- TanStack Query
- React Hook Form
- Zod
- Recharts

### Mobile
- React Native
- Expo
- TypeScript
- NativeWind
- Zustand
- TanStack Query
- Expo Router
- Expo SQLite
- Expo Camera
- Expo Notifications

## 2. Backend

- Supabase Authentication
- PostgreSQL
- Supabase Storage
- Supabase Realtime
- Supabase Edge Functions
- Row Level Security
- Scheduled background jobs

## 3. Infrastructure

| Service | Purpose |
|---|---|
| GitHub | Source control |
| Vercel | Web deployment |
| Supabase | Backend and database |
| EAS Build | Android/iOS builds |
| Sentry | Error monitoring |
| GitHub Actions | CI/CD |
| Expo | Mobile development |

## 4. Architecture principles

- Separate frontend and backend concerns.
- Shared TypeScript business logic where practical.
- Centralized validation.
- Reusable UI components.
- Database-level authorization.
- Tenant isolation.
- Offline-first mobile architecture.
- Secure server-side business operations.
- Automated testing.
- Version-controlled database migrations.

---

# PART 4 — REPOSITORY STRUCTURE

Use a monorepo to share types, validation and business logic.

```text
dukaan360/
│
├── apps/
│   ├── web/
│   │   ├── app/
│   │   │   ├── (public)/
│   │   │   ├── (auth)/
│   │   │   ├── dashboard/
│   │   │   ├── products/
│   │   │   ├── inventory/
│   │   │   ├── sales/
│   │   │   ├── purchases/
│   │   │   ├── customers/
│   │   │   ├── suppliers/
│   │   │   ├── expenses/
│   │   │   ├── reports/
│   │   │   ├── settings/
│   │   │   └── admin/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── lib/
│   │
│   └── mobile/
│       ├── app/
│       │   ├── (auth)/
│       │   ├── (tabs)/
│       │   ├── sales/
│       │   ├── inventory/
│       │   └── settings/
│       ├── components/
│       ├── hooks/
│       ├── database/
│       └── services/
│
├── packages/
│   ├── ui/
│   ├── types/
│   ├── schemas/
│   ├── business-logic/
│   ├── localization/
│   ├── api-client/
│   ├── utilities/
│   └── config/
│
├── supabase/
│   ├── migrations/
│   ├── functions/
│   ├── seed.sql
│   └── config.toml
│
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── e2e/
│   └── security/
│
├── docs/
│   ├── PRD.md
│   ├── ARCHITECTURE.md
│   ├── DATABASE.md
│   ├── API.md
│   ├── SECURITY.md
│   └── DEPLOYMENT.md
│
├── .github/
│   └── workflows/
│
├── .env.example
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
├── tsconfig.base.json
└── README.md
```

### Repository rules

- Never commit `.env` files.
- Never expose service-role credentials.
- Pin dependency versions.
- Commit lockfiles.
- Use feature branches.
- Require pull-request checks.
- Keep database migrations in Git.
- Do not mix Easy Khata code into this repository without an explicit code audit and approval.

---

# PART 5 — DATABASE DESIGN

## 1. Database principles

Dukaan360 will use PostgreSQL.

The database must support:

- Multiple users.
- Multiple businesses per user.
- Multiple branches per business.
- Multiple staff members.
- Separate business records.
- Multiple currencies.
- Business-specific settings.
- Audit history.
- Subscription management.
- Future integrations.

Every business-owned record must be associated with a `business_id`.

## 2. Core database tables

### Identity and tenancy

```text
profiles
businesses
business_members
business_roles
business_permissions
branches
business_settings
```

### Product and inventory

```text
categories
units
products
product_variants
warehouses
stock_balances
stock_movements
stock_transfers
stock_transfer_items
```

### Customers and suppliers

```text
customers
suppliers
customer_addresses
supplier_addresses
ledger_accounts
ledger_entries
payments
```

### Sales

```text
sales
sale_items
sale_payments
sales_returns
sales_return_items
```

### Purchases

```text
purchase_orders
purchase_order_items
purchases
purchase_items
purchase_payments
purchase_returns
```

### Expenses and finance

```text
expense_categories
expenses
financial_accounts
journal_entries
journal_entry_lines
accounting_periods
```

### Workforce and operations

```text
employees
staff_invitations
audit_logs
notifications
attachments
sync_operations
```

### SaaS billing

```text
subscription_plans
subscriptions
subscription_invoices
subscription_payments
usage_records
feature_entitlements
```

## 3. Important database relationships

```text
auth.users
    |
    └── profiles

profiles
    |
    └── business_members
             |
             ├── businesses
             │      |
             │      ├── branches
             │      ├── products
             │      ├── customers
             │      ├── suppliers
             │      ├── sales
             │      ├── purchases
             │      ├── expenses
             │      └── subscriptions
             │
             └── business_roles
```

A user can be a member of multiple businesses. A business can have multiple users.

## 4. Initial PostgreSQL schema

The following is a foundational schema draft, not a production migration. Add complete foreign keys, indexes, policies and constraints during implementation.

```sql
create extension if not exists pgcrypto;

create table public.profiles (
    id uuid primary key references auth.users(id)
        on delete cascade,
    full_name text,
    phone text,
    preferred_language text default 'en',
    created_at timestamptz default now()
);

create table public.businesses (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    slug text unique not null,
    business_type text not null,
    country_code char(2) not null,
    currency_code char(3) not null,
    timezone text not null,
    owner_id uuid not null references auth.users(id),
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create table public.business_members (
    id uuid primary key default gen_random_uuid(),
    business_id uuid not null
        references public.businesses(id),
    user_id uuid not null references auth.users(id),
    role text not null default 'staff',
    status text not null default 'active',
    created_at timestamptz default now(),
    unique (business_id, user_id)
);

create table public.branches (
    id uuid primary key default gen_random_uuid(),
    business_id uuid not null
        references public.businesses(id),
    name text not null,
    address text,
    is_active boolean default true,
    created_at timestamptz default now()
);

create table public.categories (
    id uuid primary key default gen_random_uuid(),
    business_id uuid not null
        references public.businesses(id),
    name text not null,
    parent_id uuid references public.categories(id),
    created_at timestamptz default now()
);

create table public.products (
    id uuid primary key default gen_random_uuid(),
    business_id uuid not null
        references public.businesses(id),
    category_id uuid references public.categories(id),
    name text not null,
    sku text,
    barcode text,
    unit text default 'piece',
    purchase_price numeric(20,4) default 0,
    selling_price numeric(20,4) default 0,
    reorder_level numeric(20,4) default 0,
    is_active boolean default true,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    unique (business_id, sku)
);

create table public.customers (
    id uuid primary key default gen_random_uuid(),
    business_id uuid not null
        references public.businesses(id),
    name text not null,
    phone text,
    email text,
    opening_balance numeric(20,4) default 0,
    created_at timestamptz default now()
);

create table public.suppliers (
    id uuid primary key default gen_random_uuid(),
    business_id uuid not null
        references public.businesses(id),
    name text not null,
    phone text,
    email text,
    opening_balance numeric(20,4) default 0,
    created_at timestamptz default now()
);

create table public.sales (
    id uuid primary key default gen_random_uuid(),
    business_id uuid not null
        references public.businesses(id),
    branch_id uuid references public.branches(id),
    customer_id uuid references public.customers(id),
    invoice_number text not null,
    status text not null default 'draft',
    subtotal numeric(20,4) default 0,
    discount numeric(20,4) default 0,
    tax numeric(20,4) default 0,
    total numeric(20,4) default 0,
    created_by uuid references auth.users(id),
    created_at timestamptz default now(),
    unique (business_id, invoice_number)
);

create table public.sale_items (
    id uuid primary key default gen_random_uuid(),
    business_id uuid not null
        references public.businesses(id),
    sale_id uuid not null references public.sales(id),
    product_id uuid not null references public.products(id),
    quantity numeric(20,4) not null,
    unit_price numeric(20,4) not null,
    discount numeric(20,4) default 0,
    tax numeric(20,4) default 0,
    line_total numeric(20,4) not null
);

create table public.expenses (
    id uuid primary key default gen_random_uuid(),
    business_id uuid not null
        references public.businesses(id),
    branch_id uuid references public.branches(id),
    description text not null,
    amount numeric(20,4) not null,
    expense_date date not null,
    created_by uuid references auth.users(id),
    created_at timestamptz default now()
);

create table public.audit_logs (
    id uuid primary key default gen_random_uuid(),
    business_id uuid not null
        references public.businesses(id),
    actor_id uuid references auth.users(id),
    action text not null,
    entity_type text not null,
    entity_id uuid,
    metadata jsonb default '{}'::jsonb,
    created_at timestamptz default now()
);
```

### Additional tables required before production

Implement purchases, payments, inventory movements, ledger entries, accounting journals, warehouses, returns, subscriptions and permissions before enabling their respective workflows.

## 5. Database security

Security requirements are mandatory.

- Enable Row Level Security on every exposed table.
- Verify membership before accessing business records.
- Use role-based authorization.
- Use both `USING` and `WITH CHECK` for update policies.
- Prevent users from changing their own roles.
- Protect sensitive operations through trusted server-side code.
- Keep privileged credentials on the server.
- Audit financial changes.
- Never trust a client-provided business ID without checking membership.

Example read policy for a tenant-owned table:

```sql
alter table public.products
enable row level security;

create policy "Members can view business products"
on public.products
for select
to authenticated
using (
    exists (
        select 1
        from public.business_members bm
        where bm.business_id = products.business_id
          and bm.user_id = (select auth.uid())
          and bm.status = 'active'
    )
);
```

This is only an example read policy. Production policies must separately cover insert, update and delete operations and enforce business-level permissions. Additional ownership and relationship constraints are required to prevent cross-tenant references.

## 6. Accounting integrity requirements

- Posted financial transactions must not be silently deleted.
- Corrections should use reversals or adjustment records.
- Inventory changes must be traceable.
- Financial operations should use database transactions.
- All monetary calculations must use exact numeric representations.
- Store currency codes with monetary records.
- Prevent duplicate invoice numbers within a business.
- Use server-side transaction IDs and idempotency keys.
- Preserve audit history.

---

# PART 6 — DESIGN SYSTEM

## Visual identity

Brand: Dukaan360

Suggested visual direction:
- Primary: Emerald green.
- Secondary: Deep navy.
- Background: Neutral white and light grey.
- Dark theme: Deep charcoal.
- Accent: Soft green.
