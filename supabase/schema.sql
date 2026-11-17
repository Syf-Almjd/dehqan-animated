-- Fizzo schema. Safe to re-run: Supabase Dashboard → SQL Editor → paste & run.
-- Then run supabase/seed.sql for demo products, reviews and coupons.

create extension if not exists "pgcrypto";

-- ───────── Tables ─────────
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'customer' check (role in ('customer','admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  color text not null default '#FF4A1C',
  sort int not null default 0
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text not null default '',
  price_cents int not null check (price_cents >= 0),
  compare_at_cents int check (compare_at_cents is null or compare_at_cents > 0),
  category_id uuid references public.categories(id) on delete set null,
  image_url text,
  art_kind text not null default 'can' check (art_kind in ('can','bottle','tumbler','bag','box','jar')),
  color text not null default '#FF4A1C',
  stock int not null default 0 check (stock >= 0),
  featured boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists products_category_idx on public.products(category_id);

create table if not exists public.coupons (
  code text primary key check (code = upper(code)),
  percent_off int check (percent_off between 1 and 100),
  amount_off_cents int check (amount_off_cents > 0),
  min_subtotal_cents int not null default 0,
  active boolean not null default true,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  check (percent_off is not null or amount_off_cents is not null)
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete restrict,
  status text not null default 'pending' check (status in ('pending','paid','shipped','delivered','cancelled')),
  subtotal_cents int not null default 0,
  discount_cents int not null default 0,
  coupon_code text,
  shipping_cents int not null default 0,
  total_cents int not null default 0,
  shipping jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.orders add column if not exists discount_cents int not null default 0;
alter table public.orders add column if not exists coupon_code text;
create index if not exists orders_user_idx on public.orders(user_id);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  name text not null,
  unit_price_cents int not null,
  qty int not null check (qty > 0)
);
create index if not exists order_items_order_idx on public.order_items(order_id);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,   -- null = seeded/imported review
  rating int not null check (rating between 1 and 5),
  title text,
  body text not null check (char_length(body) between 3 and 2000),
  author_name text not null,
  created_at timestamptz not null default now(),
  unique (product_id, user_id)
);
create index if not exists reviews_product_idx on public.reviews(product_id);

create table if not exists public.newsletter_subscribers (
  email text primary key check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  created_at timestamptz not null default now()
);

-- ───────── Helpers ─────────
create or replace function public.is_admin()
returns boolean language sql security definer stable set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name')
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Returns the discount (in cents) a coupon gives on a subtotal, or raises a friendly error.
create or replace function public.coupon_discount(p_code text, p_subtotal int)
returns int language plpgsql security definer stable set search_path = public as $$
declare c public.coupons%rowtype;
begin
  select * into c from public.coupons where code = upper(trim(p_code));
  if not found or not c.active or (c.expires_at is not null and c.expires_at < now()) then
    raise exception 'That code isn''t valid';
  end if;
  if p_subtotal < c.min_subtotal_cents then
    raise exception 'Spend $% or more to use %', round(c.min_subtotal_cents / 100.0, 2), c.code;
  end if;
  return least(p_subtotal, coalesce(c.amount_off_cents, 0) + floor(p_subtotal * coalesce(c.percent_off, 0) / 100.0)::int);
end $$;
grant execute on function public.coupon_discount(text, int) to anon, authenticated;

-- Atomic, server-trusted checkout: prices, stock and discounts all come from the DB.
drop function if exists public.place_order(jsonb, jsonb);
create or replace function public.place_order(p_items jsonb, p_shipping jsonb, p_coupon text default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_user uuid := auth.uid();
  v_order uuid;
  v_sub int := 0;
  v_disc int := 0;
  v_ship int;
  r record;
  p public.products%rowtype;
begin
  if v_user is null then raise exception 'Please sign in to place an order'; end if;
  if p_items is null or jsonb_array_length(p_items) = 0 then raise exception 'Your cart is empty'; end if;

  insert into public.orders (user_id, shipping) values (v_user, coalesce(p_shipping, '{}'::jsonb))
  returning id into v_order;

  for r in
    select (e->>'product_id')::uuid as pid, (e->>'qty')::int as qty
    from jsonb_array_elements(p_items) e
  loop
    if r.qty is null or r.qty < 1 or r.qty > 50 then raise exception 'Invalid quantity'; end if;
    select * into p from public.products where id = r.pid and active for update;
    if not found then raise exception 'A product in your cart is no longer available'; end if;
    if p.stock < r.qty then raise exception 'Only % left of %', p.stock, p.name; end if;
    update public.products set stock = stock - r.qty where id = p.id;
    insert into public.order_items (order_id, product_id, name, unit_price_cents, qty)
    values (v_order, p.id, p.name, p.price_cents, r.qty);
    v_sub := v_sub + p.price_cents * r.qty;
  end loop;

  if nullif(trim(p_coupon), '') is not null then
    v_disc := public.coupon_discount(p_coupon, v_sub);
  end if;
  v_ship := case when v_sub >= 5000 then 0 else 500 end;

  update public.orders
     set subtotal_cents = v_sub, discount_cents = v_disc,
         coupon_code = case when v_disc > 0 then upper(trim(p_coupon)) end,
         shipping_cents = v_ship, total_cents = greatest(0, v_sub - v_disc) + v_ship
   where id = v_order;
  return v_order;
end $$;
revoke all on function public.place_order(jsonb, jsonb, text) from public, anon;
grant execute on function public.place_order(jsonb, jsonb, text) to authenticated;

-- ───────── Row Level Security ─────────
alter table public.profiles               enable row level security;
alter table public.categories             enable row level security;
alter table public.products               enable row level security;
alter table public.coupons                enable row level security;
alter table public.orders                 enable row level security;
alter table public.order_items            enable row level security;
alter table public.reviews                enable row level security;
alter table public.newsletter_subscribers enable row level security;

drop policy if exists "profiles read own or admin" on public.profiles;
create policy "profiles read own or admin" on public.profiles for select using (id = auth.uid() or public.is_admin());
drop policy if exists "profiles update own" on public.profiles;
create policy "profiles update own" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());
-- customers may only change their name – never their role
revoke update on public.profiles from authenticated;
grant update (full_name) on public.profiles to authenticated;

drop policy if exists "categories public read" on public.categories;
create policy "categories public read" on public.categories for select using (true);
drop policy if exists "categories admin write" on public.categories;
create policy "categories admin write" on public.categories for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "products public read" on public.products;
create policy "products public read" on public.products for select using (active or public.is_admin());
drop policy if exists "products admin write" on public.products;
create policy "products admin write" on public.products for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "coupons admin" on public.coupons;
create policy "coupons admin" on public.coupons for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "orders read own or admin" on public.orders;
create policy "orders read own or admin" on public.orders for select using (user_id = auth.uid() or public.is_admin());
drop policy if exists "orders admin update" on public.orders;
create policy "orders admin update" on public.orders for update using (public.is_admin()) with check (public.is_admin());
drop policy if exists "order_items read own or admin" on public.order_items;
create policy "order_items read own or admin" on public.order_items for select using (
  exists (select 1 from public.orders o where o.id = order_id and (o.user_id = auth.uid() or public.is_admin()))
);

drop policy if exists "reviews public read" on public.reviews;
create policy "reviews public read" on public.reviews for select using (true);
drop policy if exists "reviews insert own" on public.reviews;
create policy "reviews insert own" on public.reviews for insert with check (user_id = auth.uid());
drop policy if exists "reviews delete own or admin" on public.reviews;
create policy "reviews delete own or admin" on public.reviews for delete using (user_id = auth.uid() or public.is_admin());

drop policy if exists "newsletter anyone can join" on public.newsletter_subscribers;
create policy "newsletter anyone can join" on public.newsletter_subscribers for insert with check (true);
drop policy if exists "newsletter admin read" on public.newsletter_subscribers;
create policy "newsletter admin read" on public.newsletter_subscribers for select using (public.is_admin());

-- Make yourself admin after signing up:
--   update public.profiles set role = 'admin' where id = (select id from auth.users where email = 'you@example.com');
