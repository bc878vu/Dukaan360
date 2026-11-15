# security tests

Placeholder — tests for this layer are added as the P0 modules land.

- `integration/` — Supabase + RLS behaviour against a local Supabase stack.
- `e2e/` — web + mobile user flows (Playwright / Maestro).
- `security/` — tenant isolation: tenant A cannot read tenant B's rows,
  non-members get nothing, role escalation is rejected.
