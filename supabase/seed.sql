-- Dukaan360 seed — subscription plans (PRD Module L).
-- Runs only once the subscription tables land (later migration); the DO
-- block below is a no-op until then, so this file is safe to apply now.
do $$
begin
  if to_regclass('public.subscription_plans') is not null then
    insert into public.subscription_plans (id, name, price_monthly, currency_code, is_active)
    values
      ('free', 'Free', 0, 'PKR', true),
      ('starter', 'Starter', 999, 'PKR', true),
      ('business', 'Business', 2499, 'PKR', true),
      ('enterprise', 'Enterprise', 5999, 'PKR', true)
    on conflict (id) do nothing;
  end if;
end $$;
