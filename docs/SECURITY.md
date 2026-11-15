# Dukaan360 Security

**Version:** 1.0 (foundation, 2026-11-15)

## Non-negotiables

1. **RLS on every exposed table.** No table is readable without a policy.
2. **Tenant isolation.** Every business-owned row has `business_id`.
   Membership is verified in the policy (`business_members`, status
   `active`). A client-provided business ID is never trusted on its own.
3. **Both `USING` and `WITH CHECK`** on every write policy.
4. **No self-role-escalation.** Users cannot change their own role.
5. **Secrets stay server-side.** Service-role key is never shipped to
   web/mobile clients. `.env` files are never committed.
6. **Money is server-side.** Financial writes go through Edge Functions
   with transactions + idempotency keys + audit rows.
7. **Audit everything financial.** `audit_logs` records actor, action,
   entity and metadata.

## Roles

Super Admin (platform) → Business Owner → Business Admin → Branch Manager
→ Accountant → Cashier → Inventory Manager → Staff (assigned permissions
only). A user may hold different roles in different businesses.

## Accounting integrity

- Posted transactions are never silently deleted; corrections use
  reversals/adjustments.
- Inventory changes are traceable (`stock_movements`).
- Duplicate invoice numbers are impossible within a business (unique
  constraint on `(business_id, invoice_number)`).
- Monetary math uses exact numerics; currency codes travel with records.

## Reviews

- Every PR touching RLS, auth or money paths needs a security review.
- `tests/security/` holds RLS policy tests (tenant A cannot read tenant
  B's rows; non-members get nothing; role escalation is rejected).
