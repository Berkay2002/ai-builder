-- idempotent seed example
insert into public.products (id, active, name, description)
values ('demo', true, 'Demo', 'Demo product')
on conflict (id) do nothing;


