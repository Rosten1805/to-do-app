-- =============================================================================
-- P4 To-Do App — schema, indexes, RLS and policies for the `todos` table
-- Run this once in the Supabase SQL editor (or via `supabase db push`).
-- Idempotent: safe to re-run.
-- =============================================================================

-- uuid_generate_v4() / gen_random_uuid() require pgcrypto (enabled by default
-- on Supabase projects). Left explicit here for portability.
create extension if not exists pgcrypto;

-- -----------------------------------------------------------------------------
-- Table
-- -----------------------------------------------------------------------------
create table if not exists public.todos (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  title       text not null check (char_length(trim(title)) between 1 and 200),
  is_done     boolean not null default false,
  priority    text check (priority in ('low', 'medium', 'high')),
  due_date    date,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.todos is 'Per-user to-do items for the P4 MVP app.';

-- -----------------------------------------------------------------------------
-- Indexes
-- -----------------------------------------------------------------------------
-- Every query filters by the authenticated user, so this is the primary access
-- path; ordering by created_at desc matches the default list sort.
create index if not exists todos_user_id_created_at_idx
  on public.todos (user_id, created_at desc);

-- Speeds up the "pending / completed" filter tabs.
create index if not exists todos_user_id_is_done_idx
  on public.todos (user_id, is_done);

-- -----------------------------------------------------------------------------
-- updated_at trigger
-- -----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_todos_updated_at on public.todos;
create trigger set_todos_updated_at
  before update on public.todos
  for each row
  execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- Row Level Security
-- -----------------------------------------------------------------------------
alter table public.todos enable row level security;

-- Belt-and-braces: force RLS even for the table owner role.
alter table public.todos force row level security;

drop policy if exists "todos_select_own" on public.todos;
create policy "todos_select_own"
  on public.todos
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "todos_insert_own" on public.todos;
create policy "todos_insert_own"
  on public.todos
  for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "todos_update_own" on public.todos;
create policy "todos_update_own"
  on public.todos
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "todos_delete_own" on public.todos;
create policy "todos_delete_own"
  on public.todos
  for delete
  to authenticated
  using (auth.uid() = user_id);
