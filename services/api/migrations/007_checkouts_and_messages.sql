-- One customer payment can cover several store orders when nearby stock is split.
-- One message thread per store, between that vendor and the admins who can see the store.

create table checkouts (
  id               uuid primary key default gen_random_uuid(),
  customer_id      text not null references users(id),
  idempotency_key  text not null,
  items_total      numeric(10, 2) not null,
  delivery_fee     numeric(10, 2) not null,
  platform_fee     numeric(10, 2) not null,
  grand_total      numeric(10, 2) not null,
  delivery_address jsonb not null,
  created_at       timestamptz not null default now(),
  unique (customer_id, idempotency_key)
);

alter table orders add column checkout_id uuid references checkouts(id);
create index orders_checkout_idx on orders (checkout_id);

alter table payments add column checkout_id uuid unique references checkouts(id);
alter table payments drop constraint payments_one_target;
alter table payments add constraint payments_one_target
  check (num_nonnulls(order_id, fab_job_id, checkout_id) = 1);

create table store_messages (
  id          bigint generated always as identity primary key,
  store_id    uuid not null references stores(id) on delete cascade,
  sender_role text not null check (sender_role in ('admin', 'vendor')),
  sender_id   text not null,
  body        text not null check (length(btrim(body)) between 1 and 2000),
  created_at  timestamptz not null default now()
);
create index store_messages_store_idx on store_messages (store_id, id);
