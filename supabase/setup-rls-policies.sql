-- =====================================================
-- RLS POLICIES SETUP FOR AYUSH-DEVFOLIO
-- Run this in Supabase SQL Editor
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE IF EXISTS admin_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS profile_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS hackathons ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS education ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS coding_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS hackerrank_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS admin_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any (to avoid conflicts)
DROP POLICY IF EXISTS "Public read access to profile_settings" ON profile_settings;
DROP POLICY IF EXISTS "Public read access to projects" ON projects;
DROP POLICY IF EXISTS "Public read access to blog_posts" ON blog_posts;
DROP POLICY IF EXISTS "Public read access to certifications" ON certifications;
DROP POLICY IF EXISTS "Public read access to hackathons" ON hackathons;
DROP POLICY IF EXISTS "Public read access to education" ON education;
DROP POLICY IF EXISTS "Public read access to experiences" ON experiences;
DROP POLICY IF EXISTS "Public read access to coding_profiles" ON coding_profiles;
DROP POLICY IF EXISTS "Public read access to hackerrank_badges" ON hackerrank_badges;

-- =====================================================
-- PUBLIC READ POLICIES (for anon users)
-- =====================================================

-- Profile Settings: Public read
CREATE POLICY "Public read access to profile_settings"
ON profile_settings
FOR SELECT
TO anon, authenticated
USING (true);

-- Projects: Public read for published projects only
CREATE POLICY "Public read access to projects"
ON projects
FOR SELECT
TO anon, authenticated
USING (true);  -- Changed to allow all reads, filtering happens in application

-- Blog Posts: Public read for all posts
CREATE POLICY "Public read access to blog_posts"
ON blog_posts
FOR SELECT
TO anon, authenticated
USING (true);

-- Certifications: Public read
CREATE POLICY "Public read access to certifications"
ON certifications
FOR SELECT
TO anon, authenticated
USING (true);

-- Hackathons: Public read
CREATE POLICY "Public read access to hackathons"
ON hackathons
FOR SELECT
TO anon, authenticated
USING (true);

-- Education: Public read
CREATE POLICY "Public read access to education"
ON education
FOR SELECT
TO anon, authenticated
USING (true);

-- Experiences: Public read
CREATE POLICY "Public read access to experiences"
ON experiences
FOR SELECT
TO anon, authenticated
USING (true);

-- Coding Profiles: Public read
CREATE POLICY "Public read access to coding_profiles"
ON coding_profiles
FOR SELECT
TO anon, authenticated
USING (true);

-- HackerRank Badges: Public read
CREATE POLICY "Public read access to hackerrank_badges"
ON hackerrank_badges
FOR SELECT
TO anon, authenticated
USING (true);

-- =====================================================
-- CONTACT MESSAGES POLICIES
-- =====================================================

-- Allow anyone to insert contact messages
DROP POLICY IF EXISTS "Anyone can insert contact messages" ON contact_messages;
CREATE POLICY "Anyone can insert contact messages"
ON contact_messages
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Only admin can view contact messages
DROP POLICY IF EXISTS "Admin can view contact messages" ON contact_messages;
CREATE POLICY "Admin can view contact messages"
ON contact_messages
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_access
    WHERE admin_access.user_id = auth.uid()
  )
);

-- =====================================================
-- ADMIN WRITE POLICIES
-- =====================================================

-- Helper function to check admin access
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_access
    WHERE user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Projects: Admin full access
DROP POLICY IF EXISTS "Admin full access to projects" ON projects;
CREATE POLICY "Admin full access to projects"
ON projects
FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- Blog Posts: Admin full access
DROP POLICY IF EXISTS "Admin full access to blog_posts" ON blog_posts;
CREATE POLICY "Admin full access to blog_posts"
ON blog_posts
FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- Certifications: Admin full access
DROP POLICY IF EXISTS "Admin full access to certifications" ON certifications;
CREATE POLICY "Admin full access to certifications"
ON certifications
FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- Hackathons: Admin full access
DROP POLICY IF EXISTS "Admin full access to hackathons" ON hackathons;
CREATE POLICY "Admin full access to hackathons"
ON hackathons
FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- Profile Settings: Admin full access
DROP POLICY IF EXISTS "Admin full access to profile_settings" ON profile_settings;
CREATE POLICY "Admin full access to profile_settings"
ON profile_settings
FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- Education: Admin full access
DROP POLICY IF EXISTS "Admin full access to education" ON education;
CREATE POLICY "Admin full access to education"
ON education
FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- Experiences: Admin full access
DROP POLICY IF EXISTS "Admin full access to experiences" ON experiences;
CREATE POLICY "Admin full access to experiences"
ON experiences
FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- =====================================================
-- VERIFICATION QUERY
-- =====================================================

-- Run this to verify policies are created
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Test query (should work without errors)
SELECT COUNT(*) as total_projects FROM projects;
SELECT COUNT(*) as featured_projects FROM projects WHERE featured = true;
