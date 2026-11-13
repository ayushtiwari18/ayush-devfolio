import { verifyAdminAuth } from '../adminAuth';

const mockGetUser = jest.fn();

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    auth: {
      getUser: mockGetUser,
    },
  })),
}));

function createMockRequest(headers = {}) {
  const map = new Map(Object.entries(headers).map(([k, v]) => [k.toLowerCase(), v]));
  return {
    headers: {
      get: (k) => map.get(k.toLowerCase()) || null,
    },
  };
}

describe('verifyAdminAuth Utility', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = {
      ...originalEnv,
      ADMIN_SECRET: 'super-server-secret',
      NEXT_PUBLIC_SUPABASE_URL: 'https://test.supabase.co',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: 'test-anon-key',
    };
    mockGetUser.mockReset();
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.clearAllMocks();
  });

  it('authorizes when x-admin-secret matches process.env.ADMIN_SECRET', async () => {
    const request = createMockRequest({
      'x-admin-secret': 'super-server-secret',
    });

    const isAuthorized = await verifyAdminAuth(request);
    expect(isAuthorized).toBe(true);
    expect(mockGetUser).not.toHaveBeenCalled();
  });

  it('authorizes when valid Bearer JWT is passed', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'admin-user-id', email: 'admin@test.com' } },
      error: null,
    });

    const request = createMockRequest({
      Authorization: 'Bearer valid.jwt.token',
    });

    const isAuthorized = await verifyAdminAuth(request);
    expect(isAuthorized).toBe(true);
    expect(mockGetUser).toHaveBeenCalledWith('valid.jwt.token');
  });

  it('authorizes when valid Supabase auth cookie is present', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'cookie-user-id' } },
      error: null,
    });

    const cookieVal = encodeURIComponent(JSON.stringify(['cookie.jwt.token', 'refresh']));
    const request = createMockRequest({
      cookie: `sb-testproj-auth-token=${cookieVal}; other=cookie`,
    });

    const isAuthorized = await verifyAdminAuth(request);
    expect(isAuthorized).toBe(true);
    expect(mockGetUser).toHaveBeenCalledWith('cookie.jwt.token');
  });

  it('rejects when Bearer token is rejected by Supabase auth', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: null },
      error: { message: 'Token expired' },
    });

    const request = createMockRequest({
      Authorization: 'Bearer expired.jwt.token',
    });

    const isAuthorized = await verifyAdminAuth(request);
    expect(isAuthorized).toBe(false);
  });

  it('rejects when neither token nor secret is provided', async () => {
    const request = createMockRequest();
    const isAuthorized = await verifyAdminAuth(request);
    expect(isAuthorized).toBe(false);
  });
});
