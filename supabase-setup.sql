-- Run this ONCE in Supabase: SQL Editor > New query > paste > Run
create table if not exists settings(key text primary key, value jsonb not null default '{}');
create table if not exists gallery(id uuid primary key default gen_random_uuid(), kind text, url text, path text, caption text, created_at timestamptz default now());
create table if not exists sermons(id uuid primary key default gen_random_uuid(), title text, preacher text, date text, link text, notes text, kind text, url text, path text, created_at timestamptz default now());
create table if not exists events(id uuid primary key default gen_random_uuid(), title text, date date, time text, place text, descr text, created_at timestamptz default now());
create table if not exists prayers(id uuid primary key default gen_random_uuid(), name text, request text, created_at timestamptz default now());
create table if not exists donations(id uuid primary key default gen_random_uuid(), name text, amount numeric, purpose text, note text, created_at timestamptz default now());

do $$ declare t text; begin
 foreach t in array array['settings','gallery','sermons','events','prayers','donations'] loop
  execute format('alter table %I enable row level security', t);
  execute format('create policy "admin all %1$s" on %1$I for all to authenticated using (true) with check (true)', t);
 end loop;
 foreach t in array array['settings','gallery','sermons','events'] loop
  execute format('create policy "public read %1$s" on %1$I for select to anon using (true)', t);
 end loop;
end $$;

-- Visitors may SEND prayer requests and gift records, but only the admin can read them
create policy "visitors send prayers" on prayers for insert to anon with check (true);
create policy "visitors send donations" on donations for insert to anon with check (true);

-- Storage bucket for pictures, videos and audio
insert into storage.buckets (id, name, public) values ('media','media',true) on conflict (id) do nothing;
create policy "media admin upload" on storage.objects for insert to authenticated with check (bucket_id='media');
create policy "media admin delete" on storage.objects for delete to authenticated using (bucket_id='media');
