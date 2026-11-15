# Dukaan360 Product Requirements

## Vision
A multilingual, multi-tenant business management SaaS for small and growing businesses on web, Android and iOS.

## Initial customers
Retail and general stores first; shared core designed to extend to garments, wholesalers, distributors, restaurants and service businesses.

## MVP
1. Authentication and profiles
2. Business onboarding and membership
3. Products and categories
4. Customers and suppliers
5. Inventory and stock movements
6. Sales and billing
7. Purchases
8. Expenses
9. Digital Khata
10. Basic reports

## Later releases
Offline-first POS and synchronization, staff permissions, branches, subscriptions, online storefront, AI insights and business-specific extensions.

## Non-functional requirements
- Tenant isolation enforced by database policies
- Auditable financial and stock changes
- Exact decimal arithmetic for money
- Idempotent transaction processing
- Responsive and accessible interfaces
- Secure credential handling
- Backup and recovery procedures
- Automated authorization and financial tests

## Monetization
Freemium, paid monthly/yearly plans, enterprise services and limited non-intrusive ads in free-tier non-critical areas. Validate pricing with customers.

Do not enable production financial workflows until constraints, transaction atomicity, RLS and end-to-end tests are verified.
