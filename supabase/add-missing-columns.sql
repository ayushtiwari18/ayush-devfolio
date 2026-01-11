-- =====================================================
-- ADD MISSING COLUMNS: created_at, updated_at
-- Your table has 'date' but code expects 'created_at'
-- =====================================================

-- Check current columns
SELECT 
    column_name, 
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'projects'
ORDER BY ordinal_position;

-- Add created_at column (if missing)
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Add updated_at column (if missing)
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Migrate data from 'date' to 'created_at' (if date column exists)
UPDATE projects 
SET created_at = COALESCE(date::timestamp, NOW())
WHERE created_at IS NULL OR created_at = NOW();

-- Same for blog_posts
ALTER TABLE blog_posts 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

ALTER TABLE blog_posts 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Verify columns exist
SELECT 
    table_name,
    column_name, 
    data_type
FROM information_schema.columns
WHERE table_name IN ('projects', 'blog_posts')
    AND column_name IN ('created_at', 'updated_at', 'date')
ORDER BY table_name, column_name;

-- Test query (should work now)
SELECT 
    id, 
    title, 
    featured, 
    published,
    created_at,
    date
FROM projects 
WHERE published = true 
ORDER BY created_at DESC
LIMIT 5;
