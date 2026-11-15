-- Dukaan360 migration 0005 — platform admin CRUD RPCs.
-- Why RPCs, not direct table access: migration 0002 RLS is tenant-scoped —
-- a caller only sees businesses they belong to. A platform admin using the
-- browser client therefore cannot list or manage OTHER tenants' rows.
-- These SECURITY DEFINER functions follow the migration 0004 pattern:
-- they check the server-side app_metadata.role = 'platform_admin' claim
-- and only then touch cross-tenant data. The admin panel UI calls them.
-- Nothing here grants anything to the browser client directly.

-- Shared claim check for all admin RPCs below.
create or replace function public.assert_platform_admin()
returns void
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  claims jsonb;
begin
  claims := coalesce(auth.jwt() -> 'app_metadata', '{}'::jsonb);
  if claims ->> 'role' is distinct from 'platform_admin' then
    raise exception 'platform administrator access required'
      using errcode = '42501';
  end if;
end;
$$;

revoke all on function public.assert_platform_admin() from public;
grant execute on function public.assert_platform_admin() to authenticated;

-- All businesses with owner name + member/sales counts, newest first.
create or replace function public.admin_list_businesses()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  result jsonb;
begin
  perform public.assert_platform_admin();
  select coalesce(jsonb_agg(x order by x.created_at desc), '[]'::jsonb)
    into result
    from (
      select b.id, b.name, b.slug, b.business_type, b.country_code,
        b.currency_code, b.timezone, b.owner_id, b.created_at, b.updated_at,
        (select full_name from public.profiles where id = b.owner_id) as owner_name,
        (select count(*) from public.business_members where business_id = b.id) as member_count,
        (select count(*) from public.sales where business_id = b.id) as sales_count
      from public.businesses b
    ) x;
  return result;
end;
$$;

-- Create a business for an existing user (who becomes its owner member).
create or replace function public.admin_create_business(
  p_owner_id uuid,
  p_name text,
  p_slug text,
  p_business_type text,
  p_country_code text,
  p_currency_code text,
  p_timezone text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  new_id uuid;
  result jsonb;
begin
  perform public.assert_platform_admin();
  if p_name is null or btrim(p_name) = '' then
    raise exception 'business name is required';
  end if;
  if p_slug is null or btrim(p_slug) = '' then
    raise exception 'business slug is required';
  end if;
  insert into public.businesses
    (name, slug, business_type, country_code, currency_code, timezone, owner_id)
  values
    (btrim(p_name), btrim(p_slug), p_business_type, p_country_code, p_currency_code, p_timezone, p_owner_id)
  returning id into new_id;
  insert into public.business_members (business_id, user_id, role, status)
  values (new_id, p_owner_id, 'owner', 'active');
  select to_jsonb(b) into result from public.businesses b where b.id = new_id;
  return result;
end;
$$;

-- Update a business's editable fields (slug and owner never change here).
create or replace function public.admin_update_business(
  p_business_id uuid,
  p_name text,
  p_business_type text,
  p_country_code text,
  p_currency_code text,
  p_timezone text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  result jsonb;
begin
  perform public.assert_platform_admin();
  update public.businesses
  set name = btrim(p_name),
    business_type = p_business_type,
    country_code = p_country_code,
    currency_code = p_currency_code,
    timezone = p_timezone,
    updated_at = now()
  where id = p_business_id;
  if not found then
    raise exception 'business not found';
  end if;
  select to_jsonb(b) into result from public.businesses b where b.id = p_business_id;
  return result;
end;
$$;

-- Delete a business and everything under it (sales + items, expenses,
-- products, customers, suppliers, categories, branches, members, audit).
create or replace function public.admin_delete_business(p_business_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  sales_n int := 0;
begin
  perform public.assert_platform_admin();
  if not exists (select 1 from public.businesses where id = p_business_id) then
    raise exception 'business not found';
  end if;
  delete from public.sale_items
  where sale_id in (select id from public.sales where business_id = p_business_id);
  delete from public.sales where business_id = p_business_id;
  get diagnostics sales_n = row_count;
  delete from public.expenses where business_id = p_business_id;
  delete from public.products where business_id = p_business_id;
  delete from public.customers where business_id = p_business_id;
  delete from public.suppliers where business_id = p_business_id;
  delete from public.categories where business_id = p_business_id;
  delete from public.branches where business_id = p_business_id;
  delete from public.business_members where business_id = p_business_id;
  delete from public.audit_logs where business_id = p_business_id;
  delete from public.businesses where id = p_business_id;
  return jsonb_build_object('id', p_business_id, 'deleted', true, 'sales_deleted', sales_n);
end;
$$;

-- Members of one business, with profile names.
create or replace function public.admin_list_members(p_business_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  result jsonb;
begin
  perform public.assert_platform_admin();
  select coalesce(jsonb_agg(x order by x.created_at), '[]'::jsonb)
    into result
    from (
      select bm.id, bm.user_id, bm.role, bm.status, bm.created_at,
        p.full_name, p.phone
      from public.business_members bm
      left join public.profiles p on p.id = bm.user_id
      where bm.business_id = p_business_id
    ) x;
  return result;
end;
$$;

-- All user profiles with owned-business + membership counts, newest first.
create or replace function public.admin_list_profiles()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  result jsonb;
begin
  perform public.assert_platform_admin();
  select coalesce(jsonb_agg(x order by x.created_at desc), '[]'::jsonb)
    into result
    from (
      select p.id, p.full_name, p.phone, p.preferred_language, p.created_at,
        (select count(*) from public.businesses where owner_id = p.id) as businesses_owned,
        (select count(*) from public.business_members where user_id = p.id and status = 'active') as memberships
      from public.profiles p
    ) x;
  return result;
end;
$$;

-- Update a profile's editable fields.
create or replace function public.admin_update_profile(
  p_user_id uuid,
  p_full_name text,
  p_phone text,
  p_preferred_language text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  result jsonb;
begin
  perform public.assert_platform_admin();
  update public.profiles
  set full_name = p_full_name,
    phone = p_phone,
    preferred_language = p_preferred_language
  where id = p_user_id;
  if not found then
    raise exception 'profile not found';
  end if;
  select to_jsonb(p) into result from public.profiles p where p.id = p_user_id;
  return result;
end;
$$;

-- Recent sales across all tenants, newest first (default 100 rows).
create or replace function public.admin_list_sales(p_limit int default 100)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  result jsonb;
begin
  perform public.assert_platform_admin();
  select coalesce(jsonb_agg(x order by x.created_at desc), '[]'::jsonb)
    into result
    from (
      select s.id, s.business_id, b.name as business_name, b.currency_code,
        s.invoice_number, s.status, s.subtotal, s.discount, s.tax, s.total,
        s.created_at,
        (select count(*) from public.sale_items where sale_id = s.id) as items_count
      from public.sales s
      join public.businesses b on b.id = s.business_id
      order by s.created_at desc
      limit least(greatest(p_limit, 1), 500)
    ) x;
  return result;
end;
$$;

-- One sale with its line items (product names included).
create or replace function public.admin_sale_detail(p_sale_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  result jsonb;
begin
  perform public.assert_platform_admin();
  select to_jsonb(s) || jsonb_build_object(
      'business_name', b.name,
      'currency_code', b.currency_code,
      'items', (
        select coalesce(
          jsonb_agg(
            to_jsonb(si) || jsonb_build_object('product_name', pr.name)
            order by si.created_at
          ),
          '[]'::jsonb
        )
        from public.sale_items si
        left join public.products pr on pr.id = si.product_id
        where si.sale_id = s.id
      )
    )
    into result
    from public.sales s
    join public.businesses b on b.id = s.business_id
    where s.id = p_sale_id;
  if result is null then
    raise exception 'sale not found';
  end if;
  return result;
end;
$$;

-- Change a sale's status (draft / completed / cancelled).
create or replace function public.admin_update_sale_status(
  p_sale_id uuid,
  p_status text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  result jsonb;
begin
  perform public.assert_platform_admin();
  if p_status not in ('draft', 'completed', 'cancelled') then
    raise exception 'invalid sale status';
  end if;
  update public.sales set status = p_status where id = p_sale_id;
  if not found then
    raise exception 'sale not found';
  end if;
  select to_jsonb(s) into result from public.sales s where s.id = p_sale_id;
  return result;
end;
$$;

-- Delete a sale and its line items.
create or replace function public.admin_delete_sale(p_sale_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.assert_platform_admin();
  if not exists (select 1 from public.sales where id = p_sale_id) then
    raise exception 'sale not found';
  end if;
  delete from public.sale_items where sale_id = p_sale_id;
  delete from public.sales where id = p_sale_id;
  return jsonb_build_object('id', p_sale_id, 'deleted', true);
end;
$$;

revoke all on function public.admin_list_businesses() from public;
revoke all on function public.admin_create_business(uuid, text, text, text, text, text, text) from public;
revoke all on function public.admin_update_business(uuid, text, text, text, text, text) from public;
revoke all on function public.admin_delete_business(uuid) from public;
revoke all on function public.admin_list_members(uuid) from public;
revoke all on function public.admin_list_profiles() from public;
revoke all on function public.admin_update_profile(uuid, text, text, text) from public;
revoke all on function public.admin_list_sales(int) from public;
revoke all on function public.admin_sale_detail(uuid) from public;
revoke all on function public.admin_update_sale_status(uuid, text) from public;
revoke all on function public.admin_delete_sale(uuid) from public;

grant execute on function public.admin_list_businesses() to authenticated;
grant execute on function public.admin_create_business(uuid, text, text, text, text, text, text) to authenticated;
grant execute on function public.admin_update_business(uuid, text, text, text, text, text) to authenticated;
grant execute on function public.admin_delete_business(uuid) to authenticated;
grant execute on function public.admin_list_members(uuid) to authenticated;
grant execute on function public.admin_list_profiles() to authenticated;
grant execute on function public.admin_update_profile(uuid, text, text, text) to authenticated;
grant execute on function public.admin_list_sales(int) to authenticated;
grant execute on function public.admin_sale_detail(uuid) to authenticated;
grant execute on function public.admin_update_sale_status(uuid, text) to authenticated;
grant execute on function public.admin_delete_sale(uuid) to authenticated;
