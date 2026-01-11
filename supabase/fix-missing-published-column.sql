-- =====================================================
-- FIX: Add missing 'published' column
-- Run this in Supabase SQL Editor
-- =====================================================

-- Add 'published' column to projects table
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT true;

-- Set all existing projects to published
UPDATE projects 
SET published = true 
WHERE published IS NULL;

-- Add 'published' column to blog_posts table
ALTER TABLE blog_posts 
ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT true;

-- Set all existing blog posts to published
UPDATE blog_posts 
SET published = true 
WHERE published IS NULL;

-- Verify the columns exist
SELECT 
    column_name, 
    data_type, 
    column_default,
    is_nullable
FROM information_schema.columns
WHERE table_name IN ('projects', 'blog_posts')
    AND column_name = 'published'
ORDER BY table_name;

-- Test query (should work now)
SELECT 
    id, 
    title, 
    featured, 
    published, 
    status 
FROM projects 
WHERE published = true AND featured = true;
