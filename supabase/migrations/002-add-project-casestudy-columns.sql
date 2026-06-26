-- =====================================================
-- MIGRATION 002: Add case-study + missing columns to projects
-- Run in: Supabase Dashboard → SQL Editor
-- Safe: uses ADD COLUMN IF NOT EXISTS
-- =====================================================
ALTER TABLE projects ADD COLUMN IF NOT EXISTS content              TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS duration             TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS date                 DATE;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS tags                 TEXT[]  DEFAULT '{}';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS order_index          INTEGER DEFAULT 0;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS problem_statement    TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS solution             TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS architecture_plan    TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS code_structure       TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS performance_notes    TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS trade_offs           TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS lessons_learned      TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS future_improvements  TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS security_notes       TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS strategies           JSONB   DEFAULT '[]';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS challenges           JSONB   DEFAULT '[]';
