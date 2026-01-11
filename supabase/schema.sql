-- =====================================================
-- AYUSH-DEVFOLIO DATABASE SCHEMA
-- Production-ready PostgreSQL schema for Supabase
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLE: admin_access
-- Purpose: Manage admin users with role-based access
-- =====================================================
CREATE TABLE IF NOT EXISTS admin_access (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_admin_access_user_id ON admin_access(user_id);
CREATE INDEX idx_admin_access_role ON admin_access(role);

-- =====================================================
-- TABLE: profile_settings
-- Purpose: Single-row table for portfolio owner info
-- =====================================================
CREATE TABLE IF NOT EXISTS profile_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    bio TEXT,
    github_url TEXT,
    linkedin_url TEXT,
    twitter_url TEXT,
    resume_url TEXT,
    avatar_url TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default profile (only one row allowed)
INSERT INTO profile_settings (name, title, description) 
VALUES (
    'Ayush Tiwari',
    'Full Stack Developer',
    'Engineering ideas into impact, one pixel at a time.'
) ON CONFLICT DO NOTHING;

-- =====================================================
-- TABLE: projects
-- Purpose: Portfolio projects with SEO optimization
-- =====================================================
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    content TEXT,
    technologies TEXT[] DEFAULT '{}',
    cover_image TEXT,
    github_url TEXT,
    live_url TEXT,
    featured BOOLEAN DEFAULT FALSE,
    published BOOLEAN DEFAULT FALSE,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_projects_published ON projects(published);
CREATE INDEX idx_projects_featured ON projects(featured);
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);

-- =====================================================
-- TABLE: blog_posts
-- Purpose: Blog articles with markdown support
-- =====================================================
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    cover_image TEXT,
    tags TEXT[] DEFAULT '{}',
    published BOOLEAN DEFAULT FALSE,
    reading_time INTEGER DEFAULT 5,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_published ON blog_posts(published);
CREATE INDEX idx_blog_posts_created_at ON blog_posts(created_at DESC);
CREATE INDEX idx_blog_posts_tags ON blog_posts USING GIN(tags);

-- =====================================================
-- TABLE: certifications
-- Purpose: Professional certifications and courses
-- =====================================================
CREATE TABLE IF NOT EXISTS certifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    issuer TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    certificate_url TEXT,
    issued_date DATE NOT NULL,
    expiry_date DATE,
    credential_id TEXT,
    published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_certifications_issued_date ON certifications(issued_date DESC);
CREATE INDEX idx_certifications_published ON certifications(published);

-- =====================================================
-- TABLE: hackathons
-- Purpose: Hackathon participations and achievements
-- =====================================================
CREATE TABLE IF NOT EXISTS hackathons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    organizer TEXT NOT NULL,
    role TEXT NOT NULL,
    result TEXT,
    description TEXT,
    image_url TEXT,
    project_url TEXT,
    event_date DATE NOT NULL,
    published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_hackathons_event_date ON hackathons(event_date DESC);
CREATE INDEX idx_hackathons_published ON hackathons(published);

-- =====================================================
-- TABLE: contact_messages
-- Purpose: Contact form submissions
-- =====================================================
CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_contact_messages_status ON contact_messages(status);
CREATE INDEX idx_contact_messages_created_at ON contact_messages(created_at DESC);

-- =====================================================
-- FUNCTION: is_admin()
-- Purpose: Check if current user is an admin
-- =====================================================
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM admin_access 
        WHERE user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- FUNCTION: update_updated_at()
-- Purpose: Auto-update updated_at timestamp
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to relevant tables
CREATE TRIGGER update_admin_access_updated_at
    BEFORE UPDATE ON admin_access
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_profile_settings_updated_at
    BEFORE UPDATE ON profile_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_blog_posts_updated_at
    BEFORE UPDATE ON blog_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
