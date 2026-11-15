-- Dukaan360 migration 0004 — platform admin metrics RPC.
-- The function exposes aggregate counts only and only to a trusted
-- platform_admin claim set server-side in Supabase auth app_metadata.
create or replace function public.platform_admin_metrics()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  claims jsonb;
  result jsonb;
begin
  claims := coalesce(auth.jwt() -> 'app_metadata', '{}'::jsonb);
  if claims ->> 'role' is distinct from 'platform_admin' then
    raise exception 'platform administrator access required'
      using errcode = '42501';
  end if;
  select jsonb_build_object(
    'businesses', (select count(*) from public.businesses),
    'users', (select count(*) from public.profiles),
    'sales', (select count(*) from public.sales)
  ) into result;
  return result;
end;
$$;

revoke all on function public.platform_admin_metrics() from public;
grant execute on function public.platform_admin_metrics() to authenticated;
