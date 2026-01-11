import { supabase } from '@/lib/supabase';

export async function getPublishedBlogPosts() {
  try {
    console.log('📝 Fetching published blog posts...');
    
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching blog posts:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
      throw error;
    }

    console.log(`✅ Fetched ${data?.length || 0} blog posts`);
    return data || [];
  } catch (err) {
    console.error('❌ Exception in getPublishedBlogPosts:', err);
    throw err;
  }
}

export async function getRecentBlogPosts(limit = 3) {
  try {
    console.log(`📝 Fetching ${limit} recent blog posts...`);
    
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('❌ Error fetching recent blog posts:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
      throw error;
    }

    console.log(`✅ Fetched ${data?.length || 0} recent blog posts`);
    return data || [];
  } catch (err) {
    console.error('❌ Exception in getRecentBlogPosts:', err);
    throw err;
  }
}

export async function getBlogPostBySlug(slug) {
  try {
    console.log(`🔍 Fetching blog post with slug: ${slug}`);
    
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single();

    if (error) {
      console.error(`❌ Error fetching blog post ${slug}:`, {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
      throw error;
    }

    console.log(`✅ Fetched blog post: ${data?.title}`);
    return data;
  } catch (err) {
    console.error(`❌ Exception in getBlogPostBySlug(${slug}):`, err);
    throw err;
  }
}

export async function incrementBlogPostViews(slug) {
  try {
    const { error } = await supabase.rpc('increment_blog_views', {
      blog_slug: slug,
    });

    if (error) {
      console.warn('⚠️ Failed to increment blog views:', error);
    } else {
      console.log(`👁️ Incremented views for blog post: ${slug}`);
    }
  } catch (err) {
    console.warn('⚠️ Exception incrementing blog views:', err);
  }
}
