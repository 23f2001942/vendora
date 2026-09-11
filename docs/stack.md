# Tech Stack

## Frontend

| | |
|-|-|
| Framework | React 18 with TypeScript |
| Build tool | Vite |
| Styling | Tailwind CSS |
| Components | shadcn/ui (built on Radix UI) |
| Routing | React Router v6 |
| Server state | TanStack Query v5 |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Icons | Lucide React |

## Backend

| | |
|-|-|
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth — email/password + Google OAuth |
| Edge Functions | Deno runtime (deployed to Supabase) |
| Address search | Nominatim (OpenStreetMap) — free, no API key |

## Dev environment

- Node.js v18+
- Dev server runs on port **8080**
- Path alias: `@/` maps to `src/`

## Edge functions

| Function | Purpose |
|----------|---------|
| `check-auth-provider` | Returns auth method (email/google) for a given email |
| `seed-wholesaler-products` | Seeds 24 demo products for a wholesaler account |
