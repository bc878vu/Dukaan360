# Supabase setup

Create a dedicated Dukaan360 development project and a separate production project.

Before exposing any table: create a versioned migration, enable RLS, add tenant membership and role-based policies for all required operations, add cross-tenant isolation tests, verify grants and Data API exposure, and run database security advisors.

Do not use production credentials in local development. Never expose a service-role key in browser or mobile code.

No production schema has been applied by this scaffold.
