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
  tracking_url text default ''
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

-- Allow anyone to READ orders (needed for the Track Order page lookup).
-- The app filters by order_id + email/phone in application code. For
-- stricter privacy, replace this with a Postgres function that only
-- returns a single matching row instead of the full table.
create policy "Anyone can read orders"
  on orders for select
  to anon
  using (true);

-- Only signed-in Supabase Auth users (your admin accounts) can update orders.
create policy "Authenticated users can update orders"
  on orders for update
  to authenticated
  using (true)
  with check (true);

-- Create your admin login at: Supabase Dashboard -> Authentication -> Users -> Add User.
-- Use that email + password to sign in at yoursite.com/admin.
