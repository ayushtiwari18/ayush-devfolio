import { NextResponse } from 'next/server';
import { supabase, testSupabaseConnection } from '@/lib/supabase';

export async function GET() {
  const diagnostics = {
    timestamp: new Date().toISOString(),
    environment: {
      NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    },
    tests: {},
  };

  // Test 1: Basic connection
  try {
    const connectionTest = await testSupabaseConnection();
    diagnostics.tests.connection = {
      status: connectionTest.success ? 'PASS' : 'FAIL',
      message: connectionTest.success
        ? 'Successfully connected to Supabase'
        : connectionTest.error,
    };
  } catch (error) {
    diagnostics.tests.connection = {
      status: 'FAIL',
      message: error.message,
    };
  }

  // Test 2: Check projects table
  try {
    const { data, error, count } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: false })
      .limit(5);

    if (error) {
      diagnostics.tests.projects_table = {
        status: 'FAIL',
        error: error.message,
        code: error.code,
        hint: error.hint,
      };
    } else {
      diagnostics.tests.projects_table = {
        status: 'PASS',
        total_count: count,
        sample_data: data?.length || 0,
        projects: data?.map((p) => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
          published: p.published,
          featured: p.featured,
        })),
      };
    }
  } catch (error) {
    diagnostics.tests.projects_table = {
      status: 'FAIL',
      message: error.message,
    };
  }

  // Test 3: Check featured projects
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('published', true)
      .eq('featured', true);

    if (error) {
      diagnostics.tests.featured_projects = {
        status: 'FAIL',
        error: error.message,
        code: error.code,
        hint: error.hint,
      };
    } else {
      diagnostics.tests.featured_projects = {
        status: 'PASS',
        count: data?.length || 0,
        message:
          data?.length === 0
            ? 'No featured projects found. Set featured=true on some projects.'
            : `Found ${data.length} featured project(s)`,
      };
    }
  } catch (error) {
    diagnostics.tests.featured_projects = {
      status: 'FAIL',
      message: error.message,
    };
  }

  // Test 4: Check blog_posts table
  try {
    const { data, error, count } = await supabase
      .from('blog_posts')
      .select('*', { count: 'exact', head: true });

    if (error) {
      diagnostics.tests.blog_posts_table = {
        status: 'FAIL',
        error: error.message,
        code: error.code,
        hint: error.hint,
      };
    } else {
      diagnostics.tests.blog_posts_table = {
        status: 'PASS',
        total_count: count,
      };
    }
  } catch (error) {
    diagnostics.tests.blog_posts_table = {
      status: 'FAIL',
      message: error.message,
    };
  }

  // Test 5: Check RLS policies
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('id')
      .limit(1);

    diagnostics.tests.rls_policies = {
      status: error ? 'FAIL' : 'PASS',
      message: error
        ? 'RLS may be blocking access. Check Supabase policies.'
        : 'RLS policies appear to be configured correctly',
      error: error?.message,
    };
  } catch (error) {
    diagnostics.tests.rls_policies = {
      status: 'FAIL',
      message: error.message,
    };
  }

  // Determine overall status
  const allTests = Object.values(diagnostics.tests);
  const failedTests = allTests.filter((test) => test.status === 'FAIL');
  diagnostics.overall_status = failedTests.length === 0 ? 'HEALTHY' : 'UNHEALTHY';
  diagnostics.failed_tests_count = failedTests.length;

  return NextResponse.json(diagnostics, {
    status: diagnostics.overall_status === 'HEALTHY' ? 200 : 500,
  });
}
