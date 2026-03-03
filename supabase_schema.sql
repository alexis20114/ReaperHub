-- ============================================================
-- ReaperHub — Supabase SQL Schema
-- Run this in the Supabase SQL Editor (in order)
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── Profiles ──────────────────────────────────────────────────────────────────
create table public.profiles (
  id                    uuid primary key references auth.users(id) on delete cascade,
  username              text not null unique,
  avatar_url            text,
  bio                   text,
  discord_link          text,
  rank                  text not null default 'Spectral'
                          check (rank in ('Spectral','Reaper','Blood Lord','Death Knight','Lich King','Staff','Admin')),
  scripts_uploaded      integer not null default 0,
  scripts_approved      integer not null default 0,
  ip_address            text,
  notifications_enabled boolean not null default true,
  created_at            timestamptz not null default now()
);

-- RLS
alter table public.profiles enable row level security;
create policy "Public profiles viewable by all"  on public.profiles for select using (true);
create policy "Users can update own profile"      on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile"      on public.profiles for insert with check (auth.uid() = id);

-- ── Scripts ───────────────────────────────────────────────────────────────────
create table public.scripts (
  id              uuid primary key default uuid_generate_v4(),
  title           text not null,
  game            text not null,
  description     text,
  image_url       text,
  script_content  text not null,
  author_id       uuid not null references public.profiles(id) on delete cascade,
  author_username text not null,
  tags            text[] not null default '{}',
  is_premium      boolean not null default false,
  is_approved     boolean not null default false,
  likes           integer not null default 0,
  views           integer not null default 0,
  created_at      timestamptz not null default now()
);

create index scripts_game_idx       on public.scripts(game);
create index scripts_approved_idx   on public.scripts(is_approved);
create index scripts_created_idx    on public.scripts(created_at desc);

alter table public.scripts enable row level security;
create policy "Approved scripts viewable by all" on public.scripts for select using (is_approved = true);
create policy "Authenticated can insert scripts" on public.scripts for insert with check (auth.uid() = author_id);
create policy "Authors can update own scripts"   on public.scripts for update using (auth.uid() = author_id);
-- Staff/Admin can see all (handled via service_role key on backend)

-- Increment views RPC (avoids RLS update restriction)
create or replace function public.increment_views(script_id uuid)
returns void language plpgsql security definer as $$
begin
  update public.scripts set views = views + 1 where id = script_id;
end;
$$;

-- ── Messages ──────────────────────────────────────────────────────────────────
create table public.messages (
  id               uuid primary key default uuid_generate_v4(),
  sender_id        uuid not null references public.profiles(id) on delete cascade,
  sender_username  text not null,
  sender_rank      text not null default 'Spectral',
  recipient_id     uuid not null references public.profiles(id) on delete cascade,
  subject          text not null,
  body             text not null,
  is_read          boolean not null default false,
  created_at       timestamptz not null default now()
);

create index messages_recipient_idx on public.messages(recipient_id);

alter table public.messages enable row level security;
create policy "Users see their own messages"  on public.messages for select  using (auth.uid() = recipient_id);
create policy "Authenticated users can send"  on public.messages for insert  with check (auth.uid() = sender_id);
create policy "Recipients can mark read"      on public.messages for update  using (auth.uid() = recipient_id);

-- ── Script Likes (many-to-many) ───────────────────────────────────────────────
create table public.script_likes (
  user_id   uuid not null references public.profiles(id) on delete cascade,
  script_id uuid not null references public.scripts(id) on delete cascade,
  primary key (user_id, script_id)
);

alter table public.script_likes enable row level security;
create policy "Users can toggle own likes" on public.script_likes for all using (auth.uid() = user_id);

-- Toggle like function
create or replace function public.toggle_like(p_script_id uuid)
returns void language plpgsql security definer as $$
declare
  existing boolean;
begin
  select exists(select 1 from public.script_likes where user_id = auth.uid() and script_id = p_script_id) into existing;
  if existing then
    delete from public.script_likes where user_id = auth.uid() and script_id = p_script_id;
    update public.scripts set likes = likes - 1 where id = p_script_id;
  else
    insert into public.script_likes(user_id, script_id) values (auth.uid(), p_script_id);
    update public.scripts set likes = likes + 1 where id = p_script_id;
  end if;
end;
$$;

-- Auto-increment scripts_uploaded on insert
create or replace function public.on_script_insert()
returns trigger language plpgsql security definer as $$
begin
  update public.profiles set scripts_uploaded = scripts_uploaded + 1 where id = new.author_id;
  return new;
end;
$$;
create trigger script_inserted after insert on public.scripts
  for each row execute function public.on_script_insert();

-- Auto-increment scripts_approved on approval
create or replace function public.on_script_approve()
returns trigger language plpgsql security definer as $$
begin
  if new.is_approved = true and old.is_approved = false then
    update public.profiles set scripts_approved = scripts_approved + 1 where id = new.author_id;
  end if;
  return new;
end;
$$;
create trigger script_approved after update on public.scripts
  for each row execute function public.on_script_approve();
