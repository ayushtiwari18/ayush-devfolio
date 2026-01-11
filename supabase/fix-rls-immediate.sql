-- =====================================================
-- IMMEDIATE FIX: RLS Policies
-- This will allow public read access immediately
-- =====================================================

-- First, let's see current policies
SELECT 
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('projects', 'blog_posts')
ORDER BY tablename, policyname;

-- Drop ALL existing policies on projects
DROP POLICY IF EXISTS "Public read access to projects" ON projects;
DROP POLICY IF EXISTS "Admin full access to projects" ON projects;
DROP POLICY IF EXISTS "Enable read access for all users" ON projects;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON projects;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON projects;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON projects;

-- Drop ALL existing policies on blog_posts
DROP POLICY IF EXISTS "Public read access to blog_posts" ON blog_posts;
DROP POLICY IF EXISTS "Admin full access to blog_posts" ON blog_posts;
DROP POLICY IF EXISTS "Enable read access for all users" ON blog_posts;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON blog_posts;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON blog_posts;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON blog_posts;

-- Enable RLS (if not already enabled)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Create SIMPLE public read policy for projects
CREATE POLICY "allow_public_read_projects"
ON projects
FOR SELECT
TO public
USING (true);

-- Create SIMPLE public read policy for blog_posts
CREATE POLICY "allow_public_read_blog_posts"
ON blog_posts
FOR SELECT
TO public
USING (true);

-- Verify policies were created
SELECT 
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('projects', 'blog_posts')
ORDER BY tablename, policyname;

-- Test queries (should work now)
SELECT COUNT(*) as total_projects FROM projects;
SELECT COUNT(*) as featured_projects FROM projects WHERE featured = true AND published = true;
SELECT id, title FROM projects WHERE featured = true AND published = true LIMIT 3;
