-- Dukaan360 migration 0002 — Row Level Security for tenant isolation.
-- Rule: a caller sees a business's rows only when they are an ACTIVE
-- member of that business. Every policy uses USING + WITH CHECK for writes.
-- Users can never change their own role (no update policy on
-- business_members.role for non-owners; role changes go through an
-- Edge Function in the staff module).

-- Membership helper (security definer, stable).
create or replace function public.is_business_member(p_business_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.business_members bm
    where bm.business_id = p_business_id
      and bm.user_id = (select auth.uid())
      and bm.status = 'active'
  );
$$;

create or replace function public.is_business_owner(p_business_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.businesses b
    where b.id = p_business_id
      and b.owner_id = (select auth.uid())
  );
$$;

-- Enable RLS on every table from migration 0001.
alter table public.profiles enable row level security;
alter table public.businesses enable row level security;
alter table public.business_members enable row level security;
alter table public.branches enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.customers enable row level security;
alter table public.suppliers enable row level security;
alter table public.sales enable row level security;
alter table public.sale_items enable row level security;
alter table public.expenses enable row level security;
alter table public.audit_logs enable row level security;

-- Profiles: users read/update their own profile only.
create policy "Users manage own profile"
on public.profiles for all to authenticated
using (id = (select auth.uid()))
with check (id = (select auth.uid()));

-- Businesses: members read; owners update.
create policy "Members can view their businesses"
on public.businesses for select to authenticated
using (public.is_business_member(id) or owner_id = (select auth.uid()));

create policy "Owners can update their business"
on public.businesses for update to authenticated
using (owner_id = (select auth.uid()))
with check (owner_id = (select auth.uid()));

create policy "Authenticated users can create a business"
on public.businesses for insert to authenticated
with check (owner_id = (select auth.uid()));

-- Business members: members can see the roster of their businesses.
create policy "Members can view their business roster"
on public.business_members for select to authenticated
using (public.is_business_member(business_id));

-- Branches, categories, products, customers, suppliers, sales, sale_items,
-- expenses: full CRUD for members of the owning business.
-- (Finer role checks — cashier vs accountant — are enforced in the app and
-- in Edge Functions for money movement; RLS guarantees tenant isolation.)

create policy "Members manage branches"
on public.branches for all to authenticated
using (public.is_business_member(business_id))
with check (public.is_business_member(business_id));

create policy "Members manage categories"
on public.categories for all to authenticated
using (public.is_business_member(business_id))
with check (public.is_business_member(business_id));

create policy "Members manage products"
on public.products for all to authenticated
using (public.is_business_member(business_id))
with check (public.is_business_member(business_id));

create policy "Members manage customers"
on public.customers for all to authenticated
using (public.is_business_member(business_id))
with check (public.is_business_member(business_id));

create policy "Members manage suppliers"
on public.suppliers for all to authenticated
using (public.is_business_member(business_id))
with check (public.is_business_member(business_id));

create policy "Members manage sales"
on public.sales for all to authenticated
using (public.is_business_member(business_id))
with check (public.is_business_member(business_id));

create policy "Members manage sale items"
on public.sale_items for all to authenticated
using (public.is_business_member(business_id))
with check (public.is_business_member(business_id));

create policy "Members manage expenses"
on public.expenses for all to authenticated
using (public.is_business_member(business_id))
with check (public.is_business_member(business_id));

-- Audit logs: members read; rows are written server-side only (no client insert/update/delete policy).
create policy "Members can view their audit logs"
on public.audit_logs for select to authenticated
using (public.is_business_member(business_id));
