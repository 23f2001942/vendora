# Vendora

A three-tier B2B2C marketplace connecting customers, retailers, and wholesalers — built with React, TypeScript, and Supabase.

---

## What it does

- **Customers** browse products from nearby retailers, add to cart, place orders, and track delivery
- **Retailers** manage their product listings, handle customer orders, and restock by ordering from wholesalers
- **Wholesalers** manage bulk inventory, set minimum order quantities, and process retailer orders

Each user registers with a single role. The dashboard and navigation adapt based on that role.

---

## Tech stack

| Layer | Tools |
|-------|-------|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS, shadcn/ui (Radix UI) |
| State | TanStack Query, React Context |
| Backend | Supabase (PostgreSQL + Auth + Edge Functions) |
| Address search | OpenStreetMap Nominatim (free, no key needed) |
| Auth | Email/password + Google OAuth |

---

## Local setup

```bash
# Install dependencies
npm install

# Copy env file and fill in your Supabase project details
cp .env.example .env

# Start dev server (runs on port 8080)
npm run dev
```

**.env values needed:**
```
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<anon-key>
```

---

## Project structure

```
src/
├── components/       # Reusable UI components
│   ├── ui/           # shadcn base components
│   ├── auth/         # Login, register, address autocomplete
│   ├── customer/     # Customer-specific components
│   ├── retailer/     # Retailer-specific components
│   ├── wholesaler/   # Wholesaler-specific components
│   └── shared/       # Shared business components
├── pages/            # Route-level pages
├── hooks/            # Custom React hooks
├── contexts/         # AuthContext
└── integrations/     # Supabase client and types

supabase/
├── functions/        # Edge functions (Deno)
└── migrations/       # SQL migration history
```

---

## Documentation

- [Database](./docs/database.md) — table overview and relationships
- [API & Edge Functions](./docs/api.md) — Supabase client patterns and edge function reference
- [Tech stack details](./docs/stack.md) — full library list and architecture notes
- [Pages & routes](./docs/pages.md) — all routes and what each page does
