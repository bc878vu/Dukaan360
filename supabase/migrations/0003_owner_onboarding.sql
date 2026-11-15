-- Dukaan360 migration 0003 — safe first-owner onboarding.
-- A signed-in user may add themselves as the initial owner only for a
-- business they own. This closes the onboarding gap without permitting
-- arbitrary role escalation or cross-tenant membership creation.

create policy "Business owners can add themselves as initial owner"
on public.business_members
for insert
to authenticated
with check (
  user_id = (select auth.uid())
  and role = 'owner'
  and status = 'active'
  and public.is_business_owner(business_id)
);

-- Ensure new auth accounts have a profile row for account and admin views.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
