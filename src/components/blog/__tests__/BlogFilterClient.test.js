import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import BlogFilterClient from '../BlogFilterClient';
import { useAdminMode } from '@/context/AdminModeContext';
import { supabase } from '@/lib/supabase';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// Mock AdminModeContext
jest.mock('@/context/AdminModeContext', () => ({
  useAdminMode: jest.fn(),
}));

// Mock Supabase with hoisted inline data
jest.mock('@/lib/supabase', () => {
  const inlinePosts = [
    {
      id: 'post-1',
      title: 'Building High-Performance Next.js Systems',
      slug: 'nextjs-systems',
      excerpt: 'Deep-dive into performance and streaming architecture',
      featured: true,
      published: true,
      tags: ['nextjs', 'architecture'],
      created_at: '2026-01-15T00:00:00Z',
    },
    {
      id: 'post-2',
      title: 'Draft: Distributed Consensus Explained',
      slug: 'consensus-draft',
      excerpt: 'Unpublished draft on Raft and Paxos algorithms',
      featured: false,
      published: false,
      tags: ['distributed'],
      created_at: '2026-02-01T00:00:00Z',
    },
  ];

  return {
    supabase: {
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({ data: inlinePosts, error: null }),
        }),
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({ data: null, error: null }),
        }),
        delete: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({ data: null, error: null }),
        }),
      }),
    },
  };
});

const testPosts = [
  {
    id: 'post-1',
    title: 'Building High-Performance Next.js Systems',
    slug: 'nextjs-systems',
    excerpt: 'Deep-dive into performance and streaming architecture',
    featured: true,
    published: true,
    tags: ['nextjs', 'architecture'],
    created_at: '2026-01-15T00:00:00Z',
  },
  {
    id: 'post-2',
    title: 'Draft: Distributed Consensus Explained',
    slug: 'consensus-draft',
    excerpt: 'Unpublished draft on Raft and Paxos algorithms',
    featured: false,
    published: false,
    tags: ['distributed'],
    created_at: '2026-02-01T00:00:00Z',
  },
];

describe('BlogFilterClient Component', () => {
  let container;
  let root;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
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

  it('renders public blog archive without admin toolbars when isAdmin is false', async () => {
    useAdminMode.mockReturnValue({
      isAdmin: false,
      editMode: false,
      openDrawer: jest.fn(),
      showToast: jest.fn(),
    });

    await act(async () => {
      root.render(<BlogFilterClient posts={testPosts} />);
    });

    expect(container.textContent).toContain('Building High-Performance Next.js Systems');
    expect(container.querySelector('button[aria-label="Edit post"]')).toBeNull();
  });

  it('renders in-context admin toolbars, draft chips, and edit triggers in Admin Mode', async () => {
    const mockOpenDrawer = jest.fn();
    const mockShowToast = jest.fn();

    useAdminMode.mockReturnValue({
      isAdmin: true,
      editMode: true,
      openDrawer: mockOpenDrawer,
      showToast: mockShowToast,
    });

    await act(async () => {
      root.render(<BlogFilterClient posts={testPosts} />);
    });

    // Check New Article button
    expect(container.textContent).toContain('New Article');

    // Check status chips
    expect(container.textContent).toContain('Published');
    expect(container.textContent).toContain('Draft / Hidden');

    // Test clicking Edit on post
    const editBtn = container.querySelector('button[aria-label="Edit post"]');
    expect(editBtn).toBeTruthy();

    await act(async () => {
      editBtn.click();
    });

    expect(mockOpenDrawer).toHaveBeenCalledWith('blog-edit', expect.objectContaining({ id: 'post-1' }));
  });
});
