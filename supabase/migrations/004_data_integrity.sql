-- =============================================================================
-- Migration 004 — Data Integrity Hardening
-- =============================================================================

-- ─── opportunity_contacts: verify BOTH records belong to the same user ────────
-- The existing policy only checks opportunity ownership.
-- An attacker could link someone else's contact to their opportunity.
-- This replaces the policy with a stricter cross-entity check.

drop policy if exists "users manage own opportunity_contacts" on opportunity_contacts;

create policy "users manage own opportunity_contacts"
  on opportunity_contacts for all
  using (
    exists (
      select 1 from opportunities o
      where o.id = opportunity_id and o.user_id = auth.uid()
    )
    and
    exists (
      select 1 from contacts c
      where c.id = contact_id and c.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from opportunities o
      where o.id = opportunity_id and o.user_id = auth.uid()
    )
    and
    exists (
      select 1 from contacts c
      where c.id = contact_id and c.user_id = auth.uid()
    )
  );

-- ─── tasks: add with check clause for insert/update isolation ────────────────
-- The existing policy uses only `using`, which applies to SELECT/DELETE.
-- INSERT and UPDATE need an explicit `with check` to enforce user_id.

drop policy if exists "users manage own tasks" on tasks;

create policy "users manage own tasks"
  on tasks for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ─── interactions: same hardening ────────────────────────────────────────────
drop policy if exists "users manage own interactions" on interactions;

create policy "users manage own interactions"
  on interactions for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
