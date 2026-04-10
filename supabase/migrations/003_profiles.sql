-- User profiles for personalization
create table profiles (
  id            uuid primary key references auth.users on delete cascade,
  first_name    text,
  last_name     text,
  targeted_job  text,
  industry      text,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

alter table profiles enable row level security;
create policy "own profile" on profiles for all using (id = auth.uid());

-- Auto-update updated_at (reuse function if already created by migration 002)
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on profiles
  for each row execute function update_updated_at_column();
