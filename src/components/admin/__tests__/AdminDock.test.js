import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import AdminDock from '../AdminDock';
import { useAdminMode } from '@/context/AdminModeContext';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// Mock next/navigation
jest.mock('next/navigation', () => {
  const push = jest.fn();
  const refresh = jest.fn();
  return {
    usePathname: jest.fn().mockReturnValue('/'),
    useRouter: jest.fn().mockReturnValue({
      push,
      refresh,
    }),
  };
});

// Mock AdminModeContext hook
jest.mock('@/context/AdminModeContext', () => ({
  useAdminMode: jest.fn(),
}));

// Mock Supabase
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

describe('AdminDock Component', () => {
  let container;
  let root;
  let mockPush;
  let mockRefresh;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    const router = useRouter();
    mockPush = router.push;
    mockRefresh = router.refresh;
    mockPush.mockClear();
    mockRefresh.mockClear();
    usePathname.mockReturnValue('/');

    supabase.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: {
          id: 'test-123',
          title: 'Test Article',
          slug: 'test-slug',
          published: true,
          live_url: 'https://example.com/demo',
        },
        error: null,
      }),
      update: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({ data: null, error: null }),
      }),
    });
  });

  afterEach(async () => {
    if (root) {
      await act(async () => {
        root.unmount();
      });
    }
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
    jest.clearAllMocks();
  });

  it('renders nothing when user is not admin', async () => {
    useAdminMode.mockReturnValue({
      isAdmin: false,
      editMode: false,
      toggleEditMode: jest.fn(),
      unreadCount: 0,
      openDrawer: jest.fn(),
      logout: jest.fn(),
      user: null,
    });

    await act(async () => {
      root.render(<AdminDock />);
    });

    expect(container.innerHTML).toBe('');
  });

  it('renders Admin HUD with preview/edit modes and actions when isAdmin is true', async () => {
    const mockToggleEdit = jest.fn();
    const mockOpenDrawer = jest.fn();
    const mockLogout = jest.fn();

    useAdminMode.mockReturnValue({
      isAdmin: true,
      editMode: true,
      toggleEditMode: mockToggleEdit,
      unreadCount: 3,
      openDrawer: mockOpenDrawer,
      logout: mockLogout,
      user: { email: 'ayush@example.com' },
    });

    await act(async () => {
      root.render(<AdminDock />);
    });

    expect(container.textContent).toContain('Admin HUD');
    expect(container.textContent).toContain('Preview');
    expect(container.textContent).toContain('Edit');
    expect(container.textContent).toContain('3'); // unread badge

    // Test clicking Preview mode button
    const previewBtn = container.querySelector('button[title*="Preview Mode"]');
    expect(previewBtn).toBeTruthy();
    await act(async () => {
      previewBtn.click();
    });
    expect(mockToggleEdit).toHaveBeenCalled();

    // Test opening messages drawer
    const messagesBtn = container.querySelector('button[aria-label="Open contact inquiries inbox"]');
    expect(messagesBtn).toBeTruthy();
    await act(async () => {
      messagesBtn.click();
    });
    expect(mockOpenDrawer).toHaveBeenCalledWith('messages');

    // Test opening settings drawer
    const settingsBtn = container.querySelector('button[aria-label="Open global site settings"]');
    expect(settingsBtn).toBeTruthy();
    await act(async () => {
      settingsBtn.click();
    });
    expect(mockOpenDrawer).toHaveBeenCalledWith('settings');

    // Test logout button
    const logoutBtn = container.querySelector('button[aria-label="Sign out from admin mode"]');
    expect(logoutBtn).toBeTruthy();
    await act(async () => {
      logoutBtn.click();
    });
    expect(mockLogout).toHaveBeenCalled();
  });

  it('supports collapsing into mini pill and expanding back', async () => {
    useAdminMode.mockReturnValue({
      isAdmin: true,
      editMode: true,
      toggleEditMode: jest.fn(),
      unreadCount: 0,
      openDrawer: jest.fn(),
      logout: jest.fn(),
      user: { email: 'ayush@example.com' },
    });

    await act(async () => {
      root.render(<AdminDock />);
    });

    const collapseBtn = container.querySelector('button[aria-label="Minimize admin dock"]');
    expect(collapseBtn).toBeTruthy();

    await act(async () => {
      collapseBtn.click();
    });

    // Should now show collapsed mini button
    const expandBtn = container.querySelector('button[title="Click to expand Admin HUD"]');
    expect(expandBtn).toBeTruthy();

    await act(async () => {
      expandBtn.click();
    });

    // Expanded again
    expect(container.querySelector('button[aria-label="Minimize admin dock"]')).toBeTruthy();
  });

  it('renders section jump navigation on homepage route "/"', async () => {
    usePathname.mockReturnValue('/');
    useAdminMode.mockReturnValue({
      isAdmin: true,
      editMode: true,
      toggleEditMode: jest.fn(),
      unreadCount: 0,
      openDrawer: jest.fn(),
      logout: jest.fn(),
      user: { email: 'ayush@example.com' },
    });

    await act(async () => {
      root.render(<AdminDock />);
    });

    const jumpBtn = container.querySelector('button[title="Jump to Section"]');
    expect(jumpBtn).toBeTruthy();
    expect(jumpBtn.textContent).toContain('Jump');
  });

  it('renders "New Post" on blog catalog route "/blog"', async () => {
    usePathname.mockReturnValue('/blog');
    const mockOpenDrawer = jest.fn();
    useAdminMode.mockReturnValue({
      isAdmin: true,
      editMode: true,
      toggleEditMode: jest.fn(),
      unreadCount: 0,
      openDrawer: mockOpenDrawer,
      logout: jest.fn(),
      user: { email: 'ayush@example.com' },
    });

    await act(async () => {
      root.render(<AdminDock />);
    });

    const newPostBtn = container.querySelector('button[aria-label="New Post"]');
    expect(newPostBtn).toBeTruthy();
    expect(newPostBtn.textContent).toContain('New Post');

    await act(async () => {
      newPostBtn.click();
    });
    expect(mockOpenDrawer).toHaveBeenCalledWith('blog-new');
  });

  it('renders contextual article actions on dynamic slug route "/blog/[slug]"', async () => {
    usePathname.mockReturnValue('/blog/future-of-realtime-web');
    const mockToggleEdit = jest.fn();
    const mockShowToast = jest.fn();

    useAdminMode.mockReturnValue({
      isAdmin: true,
      editMode: false,
      toggleEditMode: mockToggleEdit,
      unreadCount: 0,
      openDrawer: jest.fn(),
      logout: jest.fn(),
      user: { email: 'ayush@example.com' },
      showToast: mockShowToast,
    });

    const dispatchSpy = jest.spyOn(window, 'dispatchEvent');

    await act(async () => {
      root.render(<AdminDock />);
    });

    // Verify presence of all three contextual article controls
    const editArticleBtn = container.querySelector('button[aria-label="Edit Article"]');
    const togglePubBtn = container.querySelector('button[aria-label="Toggle Published"]');
    const catalogBtn = container.querySelector('button[aria-label="Back to Catalog"]');

    expect(editArticleBtn).toBeTruthy();
    expect(togglePubBtn).toBeTruthy();
    expect(catalogBtn).toBeTruthy();

    expect(editArticleBtn.textContent).toContain('Edit Article');
    expect(togglePubBtn.textContent).toContain('Toggle Published');
    expect(catalogBtn.textContent).toContain('Back to Catalog');

    // Test Edit Article click
    await act(async () => {
      editArticleBtn.click();
    });
    expect(mockToggleEdit).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith('/blog/future-of-realtime-web?edit=true');
    expect(dispatchSpy).toHaveBeenCalledWith(expect.objectContaining({ type: 'admin:edit-article' }));

    // Test Back to Catalog click
    await act(async () => {
      catalogBtn.click();
    });
    expect(mockPush).toHaveBeenCalledWith('/blog');

    // Test Toggle Published click
    await act(async () => {
      togglePubBtn.click();
    });
    expect(dispatchSpy).toHaveBeenCalledWith(expect.objectContaining({ type: 'admin:toggle-published' }));

    dispatchSpy.mockRestore();
  });

  it('renders contextual project actions on dynamic slug route "/projects/[slug]"', async () => {
    usePathname.mockReturnValue('/projects/sentinal');
    supabase.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: {
          id: 'proj-1',
          title: 'Sentinal Security',
          slug: 'sentinal',
          live_url: 'https://sentinal.example.com',
        },
        error: null,
      }),
    });

    const mockOpenDrawer = jest.fn();
    const mockToggleEdit = jest.fn();
    const windowOpenSpy = jest.spyOn(window, 'open').mockImplementation(() => null);

    useAdminMode.mockReturnValue({
      isAdmin: true,
      editMode: true,
      toggleEditMode: mockToggleEdit,
      unreadCount: 0,
      openDrawer: mockOpenDrawer,
      logout: jest.fn(),
      user: { email: 'ayush@example.com' },
    });

    await act(async () => {
      root.render(<AdminDock />);
    });

    const editStoryBtn = container.querySelector('button[aria-label="Edit Story"]');
    const liveDemoBtn = container.querySelector('button[aria-label="View Live Demo"]');

    expect(editStoryBtn).toBeTruthy();
    expect(liveDemoBtn).toBeTruthy();

    expect(editStoryBtn.textContent).toContain('Edit Story');
    expect(liveDemoBtn.textContent).toContain('View Live Demo');

    // Test Edit Story click
    await act(async () => {
      editStoryBtn.click();
    });
    expect(mockOpenDrawer).toHaveBeenCalledWith('project-edit', expect.objectContaining({ slug: 'sentinal' }));

    // Test Live Demo click
    await act(async () => {
      liveDemoBtn.click();
    });
    expect(windowOpenSpy).toHaveBeenCalledWith('https://sentinal.example.com', '_blank', 'noopener,noreferrer');

    windowOpenSpy.mockRestore();
  });
});
