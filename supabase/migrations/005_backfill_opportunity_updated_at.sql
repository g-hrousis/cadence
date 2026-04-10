-- =============================================================================
-- Migration 005 — Backfill NULL updated_at on opportunities
-- =============================================================================
-- Opportunities created before migration 002 have updated_at = NULL.
-- The stale opportunity feed check uses `lt('updated_at', threshold)`,
-- which silently excludes NULL rows — they never appear in the feed.
-- Fix: set updated_at = created_at for any rows where it is NULL.

update opportunities
set updated_at = created_at
where updated_at is null;
