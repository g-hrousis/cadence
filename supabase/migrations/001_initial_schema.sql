-- =============================================================================
-- Cadence MVP — Initial Schema
-- Apply via: Supabase SQL editor or `npx supabase db push`
-- =============================================================================

-- -----------------------------------------------------------------------
-- ENUMS
-- -----------------------------------------------------------------------
create type opportunity_type   as enum ('job', 'referral', 'coffee_chat', 'interview');
create type opportunity_status as enum ('applied', 'networking', 'interviewing', 'offer', 'rejected');
create type interaction_channel as enum ('linkedin', 'email', 'call', 'in_person');
create type interaction_outcome as enum ('no_response', 'responded', 'follow_up_needed');
create type task_status         as enum ('pending', 'completed');

-- -----------------------------------------------------------------------
-- CONTACTS
-- -----------------------------------------------------------------------
create table contacts (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references auth.users not null,
  name            text not null,
  email           text,
  company         text,
  role            text,
  tags            text[] default '{}',
  last_contacted  timestamptz,
  next_follow_up  timestamptz,
  notes           text default '',
  created_at      timestamptz default now()
);

alter table contacts enable row level security;
create policy "users manage own contacts"
  on contacts for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- -----------------------------------------------------------------------
-- OPPORTUNITIES
-- -----------------------------------------------------------------------
create table opportunities (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users not null,
  title      text not null,
  type       opportunity_type not null,
  status     opportunity_status not null default 'networking',
  created_at timestamptz default now()
);

alter table opportunities enable row level security;
create policy "users manage own opportunities"
  on opportunities for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- -----------------------------------------------------------------------
-- OPPORTUNITY ↔ CONTACT JUNCTION
-- -----------------------------------------------------------------------
create table opportunity_contacts (
  opportunity_id uuid references opportunities on delete cascade,
  contact_id     uuid references contacts on delete cascade,
  primary key (opportunity_id, contact_id)
);

alter table opportunity_contacts enable row level security;
create policy "users manage own opportunity_contacts"
  on opportunity_contacts for all
  using (
    exists (
      select 1 from opportunities o
      where o.id = opportunity_id and o.user_id = auth.uid()
    )
  );

-- -----------------------------------------------------------------------
-- INTERACTIONS
-- -----------------------------------------------------------------------
create table interactions (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users not null,
  contact_id uuid references contacts on delete cascade not null,
  date       timestamptz not null default now(),
  channel    interaction_channel not null,
  outcome    interaction_outcome not null,
  notes      text default ''
);

alter table interactions enable row level security;
create policy "users manage own interactions"
  on interactions for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- -----------------------------------------------------------------------
-- TASKS
-- -----------------------------------------------------------------------
create table tasks (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid references auth.users not null,
  title                 text not null,
  due_date              timestamptz,
  linked_contact_id     uuid references contacts on delete set null,
  linked_opportunity_id uuid references opportunities on delete set null,
  status                task_status not null default 'pending',
  created_at            timestamptz default now()
);

alter table tasks enable row level security;
create policy "users manage own tasks"
  on tasks for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
