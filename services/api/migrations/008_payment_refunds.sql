-- One payment can be refunded in parts when a split checkout loses one delivery at a time.
-- Each part is written once per order (or fabrication job), so a retried worker cannot pay
-- the same part twice and the payment is only marked refunded once the parts add up.

create table payment_refunds (
  id                  bigint generated always as identity primary key,
  payment_id          uuid not null references payments(id),
  reference           text not null,
  amount_paise        bigint not null check (amount_paise > 0),
  provider_refund_id  text,
  created_at          timestamptz not null default now(),
  unique (payment_id, reference)
);
