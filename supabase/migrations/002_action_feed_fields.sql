-- =============================================================================
-- Cadence — Migration 002: Action Feed Fields
-- Apply in Supabase SQL editor
-- =============================================================================

-- contacts: per-contact follow-up cadence
alter table contacts
  add column if not exists contact_cadence_days int not null default 14;

-- tasks: source tracking + snooze support
alter table tasks
  add column if not exists source text not null default 'manual',
  add column if not exists snoozed_until timestamptz;

-- opportunities: updated_at for stale detection
alter table opportunities
  add column if not exists updated_at timestamptz default now();

-- auto-update updated_at on opportunity changes
create or replace function update_opportunity_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger opportunities_updated_at
  before update on opportunities
  for each row execute function update_opportunity_updated_at();
