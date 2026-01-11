-- =====================================================
-- ROW LEVEL SECURITY POLICIES
-- Enforce data access rules at database level
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE admin_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE hackathons ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- ADMIN_ACCESS POLICIES
-- =====================================================
CREATE POLICY "Admin can read own record" 
    ON admin_access FOR SELECT 
    USING (user_id = auth.uid());

CREATE POLICY "Super admin can manage admins" 
    ON admin_access FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM admin_access 
            WHERE user_id = auth.uid() 
            AND role = 'super_admin'
        )
    );

-- =====================================================
-- PROFILE_SETTINGS POLICIES
-- =====================================================
CREATE POLICY "Anyone can read profile" 
    ON profile_settings FOR SELECT 
    USING (true);

CREATE POLICY "Admin can update profile" 
    ON profile_settings FOR UPDATE 
    USING (is_admin());

-- =====================================================
-- PROJECTS POLICIES
-- =====================================================
CREATE POLICY "Anyone can read published projects" 
    ON projects FOR SELECT 
    USING (published = true OR is_admin());

CREATE POLICY "Admin can insert projects" 
    ON projects FOR INSERT 
    WITH CHECK (is_admin());

CREATE POLICY "Admin can update projects" 
    ON projects FOR UPDATE 
    USING (is_admin());

CREATE POLICY "Admin can delete projects" 
    ON projects FOR DELETE 
    USING (is_admin());

-- =====================================================
-- BLOG_POSTS POLICIES
-- =====================================================
CREATE POLICY "Anyone can read published blog posts" 
    ON blog_posts FOR SELECT 
    USING (published = true OR is_admin());

CREATE POLICY "Admin can insert blog posts" 
    ON blog_posts FOR INSERT 
    WITH CHECK (is_admin());

CREATE POLICY "Admin can update blog posts" 
    ON blog_posts FOR UPDATE 
    USING (is_admin());

CREATE POLICY "Admin can delete blog posts" 
    ON blog_posts FOR DELETE 
    USING (is_admin());

-- =====================================================
-- CERTIFICATIONS POLICIES
-- =====================================================
CREATE POLICY "Anyone can read published certifications" 
    ON certifications FOR SELECT 
    USING (published = true OR is_admin());

CREATE POLICY "Admin can insert certifications" 
    ON certifications FOR INSERT 
    WITH CHECK (is_admin());

CREATE POLICY "Admin can update certifications" 
    ON certifications FOR UPDATE 
    USING (is_admin());

CREATE POLICY "Admin can delete certifications" 
    ON certifications FOR DELETE 
    USING (is_admin());

-- =====================================================
-- HACKATHONS POLICIES
-- =====================================================
CREATE POLICY "Anyone can read published hackathons" 
    ON hackathons FOR SELECT 
    USING (published = true OR is_admin());

CREATE POLICY "Admin can insert hackathons" 
    ON hackathons FOR INSERT 
    WITH CHECK (is_admin());

CREATE POLICY "Admin can update hackathons" 
    ON hackathons FOR UPDATE 
    USING (is_admin());

CREATE POLICY "Admin can delete hackathons" 
    ON hackathons FOR DELETE 
    USING (is_admin());

-- =====================================================
-- CONTACT_MESSAGES POLICIES
-- =====================================================
CREATE POLICY "Anyone can insert contact messages" 
    ON contact_messages FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Admin can read all messages" 
    ON contact_messages FOR SELECT 
    USING (is_admin());

CREATE POLICY "Admin can update message status" 
    ON contact_messages FOR UPDATE 
    USING (is_admin());

CREATE POLICY "Admin can delete messages" 
    ON contact_messages FOR DELETE 
    USING (is_admin());
