-- Dukaan360 migration 0001 — initial core schema (PRD Part 5, foundation draft).
-- Covers identity/tenancy, products, customers/suppliers, sales, expenses, audit.
-- Purchases, payments, inventory movements, ledger entries, accounting
-- journals, warehouses, returns, subscriptions and permissions tables are
-- added by later migrations, before their workflows are enabled.

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

-- Helpful indexes for tenant-scoped lookups.
create index idx_products_business on public.products (business_id);
create index idx_customers_business on public.customers (business_id);
create index idx_suppliers_business on public.suppliers (business_id);
create index idx_sales_business on public.sales (business_id);
create index idx_sale_items_sale on public.sale_items (sale_id);
create index idx_expenses_business on public.expenses (business_id);
create index idx_audit_business on public.audit_logs (business_id);
create index idx_members_user on public.business_members (user_id);
create index idx_members_business on public.business_members (business_id);
