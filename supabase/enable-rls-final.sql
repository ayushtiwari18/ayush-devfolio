-- =====================================================
-- FINAL: Re-enable RLS with Correct Policies
-- Now that everything works, secure your database
-- =====================================================

-- Re-enable RLS on both tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE hackathons ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE coding_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_settings ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies first
DROP POLICY IF EXISTS "anon_read_projects" ON projects;
DROP POLICY IF EXISTS "anon_read_blog_posts" ON blog_posts;
DROP POLICY IF EXISTS "Public read certifications" ON certifications;
DROP POLICY IF EXISTS "Public read hackathons" ON hackathons;
DROP POLICY IF EXISTS "Public read education" ON education;
DROP POLICY IF EXISTS "Public read experiences" ON experiences;
DROP POLICY IF EXISTS "Public read coding_profiles" ON coding_profiles;
DROP POLICY IF EXISTS "Public read profile_settings" ON profile_settings;

-- Create PUBLIC READ policies (for portfolio site)
CREATE POLICY "anon_read_projects"
ON projects FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "anon_read_blog_posts"
ON blog_posts FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "anon_read_certifications"
ON certifications FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "anon_read_hackathons"
ON hackathons FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "anon_read_education"
ON education FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "anon_read_experiences"
ON experiences FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "anon_read_coding_profiles"
ON coding_profiles FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "anon_read_profile_settings"
ON profile_settings FOR SELECT
TO anon, authenticated
USING (true);

-- Admin helper function
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_access
    WHERE user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admin WRITE policies
CREATE POLICY "admin_write_projects"
ON projects FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "admin_write_blog_posts"
ON blog_posts FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "admin_write_certifications"
ON certifications FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "admin_write_hackathons"
ON hackathons FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- Contact messages: Anyone can insert
DROP POLICY IF EXISTS "anyone_insert_contact" ON contact_messages;
CREATE POLICY "anyone_insert_contact"
ON contact_messages FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Admin can read contact messages
DROP POLICY IF EXISTS "admin_read_contact" ON contact_messages;
CREATE POLICY "admin_read_contact"
ON contact_messages FOR SELECT
TO authenticated
USING (is_admin());

-- Verify all policies
SELECT 
  tablename,
  policyname,
  roles,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Final test
SELECT COUNT(*) as total_projects FROM projects;
SELECT COUNT(*) as featured_projects FROM projects WHERE featured = true;
