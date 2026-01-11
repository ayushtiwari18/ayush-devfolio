import { supabase } from '@/lib/supabase';

export async function getPublishedProjects() {
  try {
    console.log('📦 Fetching published projects...');
    
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching published projects:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
      throw error;
    }

    console.log(`✅ Fetched ${data?.length || 0} published projects`);
    return data || [];
  } catch (err) {
    console.error('❌ Exception in getPublishedProjects:', err);
    throw err;
  }
}

export async function getFeaturedProjects() {
  try {
    console.log('⭐ Fetching featured projects...');
    
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('published', true)
      .eq('featured', true)
      .order('created_at', { ascending: false })
      .limit(3);

    if (error) {
      console.error('❌ Error fetching featured projects:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
      throw error;
    }

    console.log(`✅ Fetched ${data?.length || 0} featured projects`);
    return data || [];
  } catch (err) {
    console.error('❌ Exception in getFeaturedProjects:', err);
    throw err;
  }
}

export async function getProjectBySlug(slug) {
  try {
    console.log(`🔍 Fetching project with slug: ${slug}`);
    
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single();

    if (error) {
      console.error(`❌ Error fetching project ${slug}:`, {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
      throw error;
    }

    console.log(`✅ Fetched project: ${data?.title}`);
    return data;
  } catch (err) {
    console.error(`❌ Exception in getProjectBySlug(${slug}):`, err);
    throw err;
  }
}

export async function incrementProjectViews(slug) {
  try {
    const { error } = await supabase.rpc('increment_project_views', {
      project_slug: slug,
    });

    if (error) {
      console.warn('⚠️ Failed to increment project views:', error);
    } else {
      console.log(`👁️ Incremented views for project: ${slug}`);
    }
  } catch (err) {
    console.warn('⚠️ Exception incrementing views:', err);
  }
}
