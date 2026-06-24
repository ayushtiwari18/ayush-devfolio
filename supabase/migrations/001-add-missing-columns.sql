-- =====================================================
-- MIGRATION 001: Add missing columns
-- Run in: Supabase Dashboard → SQL Editor
-- Safe: uses ADD COLUMN IF NOT EXISTS (no data loss)
-- =====================================================

-- blog_posts: missing columns
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS excerpt       TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS reading_time  INTEGER DEFAULT 5;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS view_count    INTEGER DEFAULT 0;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS updated_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- projects: missing columns
ALTER TABLE projects   ADD COLUMN IF NOT EXISTS view_count    INTEGER DEFAULT 0;
ALTER TABLE projects   ADD COLUMN IF NOT EXISTS updated_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Auto-update updated_at trigger for blog_posts (safe if already exists)
DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER update_blog_posts_updated_at
    BEFORE UPDATE ON blog_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-update updated_at trigger for projects (safe if already exists)
DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
