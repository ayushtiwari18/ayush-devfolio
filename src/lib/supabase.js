// Supabase client mock for deployment without environment variables
// This will be replaced with actual Supabase client when you add credentials

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a complete mock Supabase client that returns empty data
const createMockSupabase = () => {
  const mockResponse = {
    data: null,
    error: null,
  };

  const mockQuery = {
    select: () => mockQuery,
    insert: () => mockQuery,
    update: () => mockQuery,
    delete: () => mockQuery,
    eq: () => mockQuery,
    neq: () => mockQuery,
    gt: () => mockQuery,
    gte: () => mockQuery,
    lt: () => mockQuery,
    lte: () => mockQuery,
    like: () => mockQuery,
    ilike: () => mockQuery,
    is: () => mockQuery,
    in: () => mockQuery,
    contains: () => mockQuery,
    containedBy: () => mockQuery,
    range: () => mockQuery,
    order: () => mockQuery,
    limit: () => mockQuery,
    single: () => Promise.resolve(mockResponse),
    maybeSingle: () => Promise.resolve(mockResponse),
    then: (resolve) => resolve(mockResponse),
    catch: () => mockQuery,
  };

  return {
    from: () => mockQuery,
    auth: {
      signIn: () => Promise.resolve(mockResponse),
      signOut: () => Promise.resolve(mockResponse),
      getUser: () => Promise.resolve(mockResponse),
      getSession: () => Promise.resolve(mockResponse),
    },
    storage: {
      from: () => ({
        upload: () => Promise.resolve(mockResponse),
        download: () => Promise.resolve(mockResponse),
        list: () => Promise.resolve(mockResponse),
        remove: () => Promise.resolve(mockResponse),
      }),
    },
  };
};

export const supabase = createMockSupabase();

// TODO: Replace with actual Supabase client when environment variables are added:
// import { createClient } from '@supabase/supabase-js';
// export const supabase = createClient(supabaseUrl, supabaseKey);
