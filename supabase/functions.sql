-- =====================================================
-- VIEW COUNTING FUNCTIONS
-- Increment view counts for projects and blog posts
-- =====================================================

-- Function to increment project view count
CREATE OR REPLACE FUNCTION increment_project_views(project_slug TEXT)
RETURNS VOID AS $$
BEGIN
    UPDATE projects
    SET view_count = view_count + 1
    WHERE slug = project_slug AND published = true;
END;
$$ LANGUAGE plpgsql;

-- Function to increment blog post view count
CREATE OR REPLACE FUNCTION increment_blog_views(blog_slug TEXT)
RETURNS VOID AS $$
BEGIN
    UPDATE blog_posts
    SET view_count = view_count + 1
    WHERE slug = blog_slug AND published = true;
END;
$$ LANGUAGE plpgsql;
