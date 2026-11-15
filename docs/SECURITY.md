# Security baseline

- Enable RLS on every exposed tenant table.
- Enforce active business membership and scoped permissions.
- Never trust client-supplied business_id without authorization checks.
- Never expose service-role or secret keys in web/mobile clients.
- Validate inputs at trusted server/database boundaries.
- Protect role and subscription changes from self-escalation.
- Audit sensitive business and financial operations.
- Use least-privilege storage policies.
- Test cross-tenant read/write denial.
- Establish backup, recovery and incident-response procedures before production.
