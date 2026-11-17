# Fizzo — Next.js + Supabase e-commerce

Storefront, cart, checkout, customer accounts and an admin dashboard.
Landing page features a GSAP ScrollTrigger "ticker-tape" sentence (`src/components/Ticker.tsx`).

## Stack
Next.js 16 (App Router, `proxy.ts`, Server Actions) · Supabase (Postgres, Auth, RLS) · Tailwind 4 · GSAP · Zustand

## Setup
1. Create a project at supabase.com.
2. SQL Editor → run `supabase/schema.sql`, then `supabase/seed.sql`.
3. `cp .env.example .env.local` and fill in the project URL + anon/publishable key (Settings → API).
4. `npm run dev` → http://localhost:3000
5. Sign up on the site, then make yourself admin (SQL Editor):
   ```sql
   update public.profiles set role = 'admin' where id = (select id from auth.users where email = 'you@example.com');
   ```
   Then open `/admin` to manage products and orders.

Without env vars the storefront still runs on built-in demo data (browse + cart only; auth/checkout need Supabase).
For quick testing, disable "Confirm email" in Supabase Auth settings.

## Features
- **Storefront:** animated landing page (3D hero, GSAP scroll-pinned ticker, review marquee), shop with category / price / stock / sale filters + sort, ⌘K instant search, product pages with a drag-to-spin 3D viewer, ratings & reviews, sticky add-to-cart bar, recently viewed.
- **Cart:** slide-out drawer, fly-to-cart animation, quick add from cards, free-shipping meter, wishlist (saved per device).
- **Checkout:** coupon codes (`WELCOME10`, `FIZZ5` in the seed), server-verified prices/stock, order tracking timeline.
- **Accounts:** sign up / in, order history, profile editing.
- **Admin (`/admin`):** dashboard, products CRUD, order status, coupons.
- **Motion:** Lenis smooth scroll, page-transition wipe, scroll reveals, 3D tilt cards, magnetic buttons.
- **SEO:** metadata, product JSON-LD, `sitemap.xml`, `robots.txt`. Set `NEXT_PUBLIC_SITE_URL` in production.

## How it works
- **Security:** Row Level Security on every table. Customers only see their own orders; only admins write the catalog.
- **Checkout:** `place_order()` (Postgres function) re-reads prices, stock and coupon discounts from the DB, decrements stock and creates the order atomically — the browser's cart prices are never trusted.
- `schema.sql` is safe to re-run, so after pulling updates just run it again (then `seed.sql`).
- **Shipping:** free over $50, else $5 (`src/lib/format.ts` + `place_order`).
- **Payments:** orders are "pay on delivery". To take cards, add Stripe Checkout in `src/app/actions/checkout.ts` and set status to `paid` from a webhook.
- Regenerate seed after editing demo data: `node --experimental-strip-types scripts/make-seed.ts > supabase/seed.sql`
