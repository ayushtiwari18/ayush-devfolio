-- =====================================================
-- MIGRATION: timeline_events
-- Phase 2 — Timeline & Scroll Architecture
-- Run this in Supabase SQL Editor
-- =====================================================

-- Enable UUID extension (idempotent)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLE: timeline_events
-- Purpose: Unified chronological events for the
--          scroll-based timeline on the homepage/about page.
--          Covers: work, hackathon, freelancing, college,
--                  project, enjoyment event types.
-- Sort: Enforced at DB layer — start_date DESC, order ASC
-- =====================================================
CREATE TABLE IF NOT EXISTS timeline_events (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Core identity
    type          TEXT NOT NULL CHECK (type IN (
                    'hackathon',
                    'work',
                    'freelancing',
                    'college',
                    'project',
                    'enjoyment'
                  )),
    title         TEXT NOT NULL,
    description   TEXT NOT NULL,

    -- Dates — ISO 8601 strings (stored as DATE for proper sort)
    start_date    DATE NOT NULL,
    end_date      DATE,           -- NULL = ongoing

    -- Media — JSONB array of { url, alt, width, height }
    -- Example: '[{"url": "https://...", "alt": "desc", "width": 1200, "height": 630}]'
    media         JSONB DEFAULT '[]'::jsonb,

    -- Optional video preview URL
    video_url     TEXT,

    -- Admin-controlled tie-breaker for events in the same month.
    -- Lower order = shown first within same start_date.
    -- Default 0 means sort falls back to start_date only.
    "order"       INTEGER DEFAULT 0,

    -- Visibility controls
    featured      BOOLEAN DEFAULT FALSE,
    published     BOOLEAN DEFAULT FALSE,

    -- Audit
    created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- Primary sort: start_date DESC (reverse chronological)
-- Secondary sort: order ASC (admin tie-breaker)
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_timeline_events_start_date
    ON timeline_events(start_date DESC);

CREATE INDEX IF NOT EXISTS idx_timeline_events_order
    ON timeline_events("order" ASC);

CREATE INDEX IF NOT EXISTS idx_timeline_events_published
    ON timeline_events(published);

CREATE INDEX IF NOT EXISTS idx_timeline_events_type
    ON timeline_events(type);

CREATE INDEX IF NOT EXISTS idx_timeline_events_featured
    ON timeline_events(featured);

-- Composite index for the primary public query:
-- WHERE published = true ORDER BY start_date DESC, order ASC
CREATE INDEX IF NOT EXISTS idx_timeline_events_public_sort
    ON timeline_events(published, start_date DESC, "order" ASC);

-- =====================================================
-- AUTO-UPDATE TRIGGER
-- Matches the update_updated_at() function in schema.sql
-- =====================================================
CREATE TRIGGER update_timeline_events_updated_at
    BEFORE UPDATE ON timeline_events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =====================================================
-- ROW LEVEL SECURITY
-- Pattern: public SELECT on published rows; admin full CRUD
-- Matches rls-policies.sql pattern exactly.
-- =====================================================
ALTER TABLE timeline_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published timeline events"
    ON timeline_events FOR SELECT
    USING (published = true OR is_admin());

CREATE POLICY "Admin can insert timeline events"
    ON timeline_events FOR INSERT
    WITH CHECK (is_admin());

CREATE POLICY "Admin can update timeline events"
    ON timeline_events FOR UPDATE
    USING (is_admin());

CREATE POLICY "Admin can delete timeline events"
    ON timeline_events FOR DELETE
    USING (is_admin());
