# Development setup

Requirements: Node.js LTS, Corepack, pnpm and Git.

```bash
corepack enable
pnpm install
pnpm dev:web
```

Configure a dedicated Dukaan360 Supabase project using local environment files. Never add service-role keys to NEXT_PUBLIC variables or mobile builds.

Current repository contains the initial web scaffold and documentation. Mobile app implementation, shared packages, database migrations, authentication and business workflows remain pending.

Use feature branches, run checks and open pull requests. Keep schema changes in versioned migrations.
