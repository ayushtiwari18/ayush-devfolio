-- ============================================================
-- Phase 3: Advanced Project Display System
-- Extends `projects` table with case-study + media columns
-- ALL columns nullable — zero impact on existing rows
-- Run once in Supabase SQL Editor
-- ============================================================

ALTER TABLE projects
  -- Hero media
  ADD COLUMN IF NOT EXISTS hero_image        text,
  ADD COLUMN IF NOT EXISTS preview_video     text,
  ADD COLUMN IF NOT EXISTS youtube_url       text,

  -- Metadata
  ADD COLUMN IF NOT EXISTS tags              text[]  DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS duration          text,
  ADD COLUMN IF NOT EXISTS "order"           integer DEFAULT 0,

  -- Case study — flat markdown
  ADD COLUMN IF NOT EXISTS problem_statement   text,
  ADD COLUMN IF NOT EXISTS solution            text,
  ADD COLUMN IF NOT EXISTS architecture_plan   text,
  ADD COLUMN IF NOT EXISTS code_structure      text,
  ADD COLUMN IF NOT EXISTS performance_notes   text,
  ADD COLUMN IF NOT EXISTS trade_offs          text,
  ADD COLUMN IF NOT EXISTS lessons_learned     text,
  ADD COLUMN IF NOT EXISTS future_improvements text,

  -- Case study — structured JSONB arrays
  -- strategies: Array<{ title: string, description: string }>
  -- challenges: Array<{ problem: string, fix: string }>
  ADD COLUMN IF NOT EXISTS strategies        jsonb,
  ADD COLUMN IF NOT EXISTS challenges        jsonb,

  -- Technical expansion
  ADD COLUMN IF NOT EXISTS api_flow_diagram  text,
  ADD COLUMN IF NOT EXISTS db_schema_visual  text,
  ADD COLUMN IF NOT EXISTS security_notes    text,

  -- Related content (arrays of slugs)
  ADD COLUMN IF NOT EXISTS related_projects  text[]  DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS related_blogs     text[]  DEFAULT '{}';

-- Index on tags for related-content queries
CREATE INDEX IF NOT EXISTS idx_projects_tags
  ON projects USING GIN (tags);

-- Index on order for admin sort
CREATE INDEX IF NOT EXISTS idx_projects_order
  ON projects ("order" ASC);

-- Existing RLS policies cover the new columns automatically
-- (SELECT on published rows, full CRUD for admin)
-- No new policies needed.
