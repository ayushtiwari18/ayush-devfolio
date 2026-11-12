import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import BlogSectionInspector from '../inspectors/BlogSectionInspector';
import { useAdminMode } from '@/context/AdminModeContext';
import { supabase } from '@/lib/supabase';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({ refresh: jest.fn() }),
}));

// Mock AdminModeContext
jest.mock('@/context/AdminModeContext', () => ({
  useAdminMode: jest.fn(),
}));

// Mock Supabase
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

describe('BlogSectionInspector Component', () => {
  let container;
  let root;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);

    const mockPosts = [
      {
        id: 'post-1',
        title: 'Distributed Systems with Next.js',
        slug: 'distributed-systems',
        excerpt: 'Architecture patterns for web systems',
        featured: true,
        published: true,
        tags: ['Architecture', 'Next.js'],
      },
      {
        id: 'post-2',
        title: 'Draft Article on Three.js',
        slug: 'threejs-draft',
        excerpt: 'WebGL shaders',
        featured: false,
        published: false,
        tags: ['WebGL'],
      },
    ];

    supabase.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        order: jest.fn().mockResolvedValue({ data: mockPosts, error: null }),
      }),
      update: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({ error: null }),
      }),
      delete: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({ error: null }),
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

  it('renders articles and triggers new article drawer', async () => {
    const mockShowToast = jest.fn();
    const mockOpenDrawer = jest.fn();
    useAdminMode.mockReturnValue({
      openDrawer: mockOpenDrawer,
      showToast: mockShowToast,
    });

    await act(async () => {
      root.render(<BlogSectionInspector onClose={jest.fn()} />);
    });

    expect(container.textContent).toContain('Recent Articles & Blog Management');
    expect(container.textContent).toContain('Distributed Systems with Next.js');
    expect(container.textContent).toContain('Draft Article on Three.js');

    // Click Add Article button
    const addBtn = container.querySelector('[data-testid="add-blog-btn"]');
    expect(addBtn).toBeTruthy();

    await act(async () => {
      addBtn.click();
    });

    expect(mockOpenDrawer).toHaveBeenCalledWith('blog-new');
  });
});
