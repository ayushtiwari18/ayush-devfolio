import { createClient } from '@supabase/supabase-js';

// Mock @supabase/supabase-js to capture options passed to createClient
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn((url, key, config) => ({
    url,
    key,
    config,
    customFetch: config?.global?.fetch,
  })),
}));

describe('Supabase Client Global Fetch Polyfill', () => {
  const originalFetch = globalThis.fetch;
  let mockFetch;

  beforeEach(() => {
    mockFetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true }) });
    globalThis.fetch = mockFetch;
    delete globalThis.__FORCE_SERVER_FETCH__;
    jest.isolateModules(() => {
      require('../supabase');
    });
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    delete globalThis.__FORCE_SERVER_FETCH__;
    jest.clearAllMocks();
  });

  it('bypasses Next.js ISR cache on client-side requests', async () => {
    const { supabase } = require('../supabase');
    const customFetch = supabase.customFetch;

    globalThis.__FORCE_SERVER_FETCH__ = false;

    await customFetch('https://example.supabase.co/rest/v1/posts', {
      method: 'GET',
      headers: { apikey: 'test' },
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [, passedOptions] = mockFetch.mock.calls[0];
    expect(passedOptions.next).toBeUndefined();
  });

  it('bypasses Next.js ISR cache on server-side mutation requests (POST/PATCH/DELETE)', async () => {
    const { supabase } = require('../supabase');
    const customFetch = supabase.customFetch;

    globalThis.__FORCE_SERVER_FETCH__ = true;

    // Test POST
    await customFetch('https://example.supabase.co/rest/v1/posts', {
      method: 'POST',
      body: JSON.stringify({ title: 'New Post' }),
    });

    let [, passedOptions] = mockFetch.mock.calls[0];
    expect(passedOptions.next).toBeUndefined();

    // Test PATCH
    await customFetch('https://example.supabase.co/rest/v1/posts?id=eq.1', {
      method: 'PATCH',
      body: JSON.stringify({ title: 'Updated' }),
    });

    [, passedOptions] = mockFetch.mock.calls[1];
    expect(passedOptions.next).toBeUndefined();

    // Test DELETE
    await customFetch('https://example.supabase.co/rest/v1/posts?id=eq.1', {
      method: 'DELETE',
    });

    [, passedOptions] = mockFetch.mock.calls[2];
    expect(passedOptions.next).toBeUndefined();
  });

  it('applies ISR revalidation to server-side read requests', async () => {
    const { supabase } = require('../supabase');
    const customFetch = supabase.customFetch;

    globalThis.__FORCE_SERVER_FETCH__ = true;

    await customFetch('https://example.supabase.co/rest/v1/posts?select=*', {
      method: 'GET',
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [, passedOptions] = mockFetch.mock.calls[0];
    expect(passedOptions.next).toEqual({ revalidate: 60 });
  });

  it('respects caller cache opt-out (cache: no-store) on server read requests', async () => {
    const { supabase } = require('../supabase');
    const customFetch = supabase.customFetch;

    globalThis.__FORCE_SERVER_FETCH__ = true;

    await customFetch('https://example.supabase.co/rest/v1/profile', {
      method: 'GET',
      cache: 'no-store',
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [, passedOptions] = mockFetch.mock.calls[0];
    expect(passedOptions.cache).toBe('no-store');
    expect(passedOptions.next).toBeUndefined();
  });
});
