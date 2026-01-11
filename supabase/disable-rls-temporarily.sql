-- =====================================================
-- NUCLEAR OPTION: Disable RLS Temporarily
-- This will help us confirm RLS is the issue
-- Run this, test your app, then re-enable RLS
-- =====================================================

-- Check current RLS status
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('projects', 'blog_posts')
ORDER BY tablename;

-- TEMPORARILY disable RLS on projects and blog_posts
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('projects', 'blog_posts')
ORDER BY tablename;

-- Test queries (should definitely work now)
SELECT COUNT(*) as total_projects FROM projects;
SELECT id, title, featured, published FROM projects WHERE featured = true LIMIT 3;

-- =====================================================
-- AFTER TESTING: Re-enable RLS with proper policies
-- =====================================================
/*
-- Re-enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Create proper public read policy
CREATE POLICY "allow_anon_read_projects"
ON projects
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "allow_anon_read_blog_posts"
ON blog_posts
FOR SELECT
TO anon, authenticated
USING (true);
*/
