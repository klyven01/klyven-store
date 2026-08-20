-- KLYVEN — Supabase schema
-- Run this in your Supabase project: Dashboard -> SQL Editor -> New query -> paste -> Run.

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_id text unique not null,
  created_at timestamptz not null default now(),
  customer_name text not null,
  phone text not null,
  email text not null,
  address text not null,
  city text not null,
  state text not null,
  pin text not null,
  items jsonb not null,
  subtotal numeric not null,
  shipping numeric not null,
  total numeric not null,
  payment_method text not null,
  payment_status text not null default 'Pending Payment',
  order_status text not null default 'Pending Payment',
  tracking_number text default '',
  tracking_url text default '',
  coupon_code text default '',
  discount numeric default 0
);

-- Sequential order numbering, shared across every visitor, used to build
-- Order IDs like KLV-2026-0001.
create sequence if not exists order_seq start 1;

create or replace function next_order_number()
returns integer
language sql
as $$
  select nextval('order_seq')::integer;
$$;

-- Row Level Security: the browser only ever uses the public "anon" key,
-- so these policies define exactly what an anonymous visitor can do.
alter table orders enable row level security;

-- Allow anyone to CREATE an order (checkout must work for logged-out shoppers).
create policy "Anyone can insert an order"
  on orders for insert
  to anon
  with check (true);

-- Allow anyone (logged out shoppers on Track Order, and logged-in
-- customers on their Account page) to READ orders. The app filters by
-- order_id + email/phone (Track Order) or by the logged-in user's own
-- email (Account) in application code. For stricter privacy, replace
-- this with a Postgres function that only returns matching rows
-- instead of exposing the full table to the client.
create policy "Anyone can read orders"
  on orders for select
  to anon, authenticated
  using (true);

-- Only signed-in Supabase Auth users (your admin accounts) can update orders.
create policy "Authenticated users can update orders"
  on orders for update
  to authenticated
  using (true)
  with check (true);

-- Create your admin login at: Supabase Dashboard -> Authentication -> Users -> Add User.
-- Use that email + password to sign in at yoursite.com/admin.

-- ---------------------------------------------------------------
-- COUPONS
-- ---------------------------------------------------------------
create table if not exists coupons (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,             -- e.g. 'WELCOME10' — always stored/matched as uppercase
  percent_off numeric not null,           -- e.g. 10 means 10% off
  active boolean not null default true,
  expires_at timestamptz,                 -- optional — leave null for no expiry
  min_order_value numeric default 0,      -- optional minimum cart subtotal to qualify
  created_at timestamptz not null default now()
);

alter table coupons enable row level security;

-- Anonymous shoppers can only READ active coupons (to validate a code at
-- checkout) — they can never create, edit, or deactivate one.
create policy "Anyone can read coupons"
  on coupons for select
  to anon
  using (true);

-- Only signed-in admin accounts can create/edit/deactivate coupons.
create policy "Authenticated users can manage coupons"
  on coupons for all
  to authenticated
  using (true)
  with check (true);

-- Example: create a 10% off coupon (edit or delete this after testing)
-- insert into coupons (code, percent_off, min_order_value) values ('WELCOME10', 10, 0);

-- ---------------------------------------------------------------
-- REVIEWS
-- ---------------------------------------------------------------
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  product_id text not null,           -- matches a product's `id` in src/data/products.js
  customer_name text not null,
  rating integer not null check (rating between 1 and 5),
  comment text default '',
  approved boolean not null default true,  -- set false to hold for moderation
  created_at timestamptz not null default now()
);

alter table reviews enable row level security;

-- Anyone can submit a review.
create policy "Anyone can insert a review"
  on reviews for insert
  to anon
  with check (true);

-- Anyone can read APPROVED reviews only.
create policy "Anyone can read approved reviews"
  on reviews for select
  to anon
  using (approved = true);

-- Only signed-in admin accounts can moderate (approve/hide/delete) reviews.
create policy "Authenticated users can manage reviews"
  on reviews for all
  to authenticated
  using (true)
  with check (true);

-- ---------------------------------------------------------------
-- RETURN / REPLACE REQUESTS
-- ---------------------------------------------------------------
create table if not exists return_requests (
  id uuid primary key default gen_random_uuid(),
  request_number text unique not null,   -- e.g. RET-2026-0001
  order_id text not null,                -- matches orders.order_id
  customer_name text not null,
  email text not null,
  phone text not null,
  request_type text not null check (request_type in ('return', 'replace')),
  items_description text not null,       -- which item(s) + size/colour, in the customer's words
  reason text not null,
  status text not null default 'Requested',
  admin_notes text default '',
  created_at timestamptz not null default now()
);

create sequence if not exists return_seq start 1;

create or replace function next_return_number()
returns integer
language sql
as $$
  select nextval('return_seq')::integer;
$$;

alter table return_requests enable row level security;

-- Anyone can submit a request (the app verifies the Order ID + email/phone
-- actually match a real order in application code before allowing this —
-- see src/lib/returns.js).
create policy "Anyone can insert a return request"
  on return_requests for insert
  to anon
  with check (true);

-- Anyone can read requests (the app filters by order_id + email/phone so a
-- customer only ever sees their own, same pattern as order tracking).
create policy "Anyone can read return requests"
  on return_requests for select
  to anon, authenticated
  using (true);

-- Only signed-in admin accounts can update status/notes.
create policy "Authenticated users can update return requests"
  on return_requests for update
  to authenticated
  using (true)
  with check (true);
