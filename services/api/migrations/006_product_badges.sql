-- Admin-assigned trust badges shown to customers ("Our pick", "Most sold", ...). They used to be a
-- single isChoice flag tucked into the specs JSON; now they are a proper column so the catalog can
-- filter on them and the admin can combine several.

alter table products add column if not exists badges text[] not null default '{}';

update products set badges = array['our_pick'] where specs->>'isChoice' = 'true';
update products set specs = specs - 'isChoice' where specs ? 'isChoice';

create index if not exists products_badges_idx on products using gin (badges) where is_active;
