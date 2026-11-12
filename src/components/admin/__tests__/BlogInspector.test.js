import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import BlogInspector from '../inspectors/BlogInspector';
import { useAdminMode } from '@/context/AdminModeContext';
import { supabase } from '@/lib/supabase';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// Mock react-markdown because it is ESM-only in Jest
jest.mock('react-markdown', () => {
  return function MockReactMarkdown({ children }) {
    return <div data-testid="markdown-preview">{children}</div>;
  };
});

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({ refresh: jest.fn() }),
}));

// Mock AdminModeContext
jest.mock('@/context/AdminModeContext', () => ({
  useAdminMode: jest.fn(),
}));

const mockInsert = jest.fn().mockResolvedValue({ data: null, error: null });
const mockEq = jest.fn().mockResolvedValue({ data: null, error: null });
const mockUpdate = jest.fn().mockReturnValue({ eq: mockEq });
const mockFrom = jest.fn().mockReturnValue({
  insert: mockInsert,
  update: mockUpdate,
});

// Mock Supabase
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: (...args) => mockFrom(...args),
  },
}));

describe('BlogInspector Component', () => {
  let container;
  let root;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    mockFrom.mockClear();
    mockInsert.mockClear();
    mockUpdate.mockClear();
    mockEq.mockClear();
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

  it('renders in create mode and allows publishing an article', async () => {
    const mockShowToast = jest.fn();
    const mockClose = jest.fn();

    useAdminMode.mockReturnValue({
      showToast: mockShowToast,
    });

    await act(async () => {
      root.render(<BlogInspector mode="new" onClose={mockClose} />);
    });

    expect(container.textContent).toContain('Write New Article');

    // Type Title
    const titleInput = container.querySelector('input[placeholder="Building High-Performance Next.js Systems"]');
    expect(titleInput).toBeTruthy();

    await act(async () => {
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      setter.call(titleInput, 'Deep Dive into Distributed Tracing');
      titleInput.dispatchEvent(new Event('input', { bubbles: true }));
      titleInput.dispatchEvent(new Event('change', { bubbles: true }));
    });

    // Test tab switching
    const previewTab = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent.includes('Live Preview')
    );
    expect(previewTab).toBeTruthy();

    await act(async () => {
      previewTab.click();
    });

    expect(container.textContent).toContain('Deep Dive into Distributed Tracing');

    // Click submit drawer button
    const submitBtn = container.querySelector('[data-testid="save-drawer-btn"]');
    expect(submitBtn).toBeTruthy();

    await act(async () => {
      submitBtn.click();
    });

    expect(mockFrom).toHaveBeenCalledWith('blog_posts');
    expect(mockShowToast).toHaveBeenCalledWith(
      expect.stringContaining('published successfully'),
      'success'
    );
    expect(mockClose).toHaveBeenCalled();
  });

  it('renders in edit mode with article content and saves changes', async () => {
    const mockShowToast = jest.fn();
    const mockClose = jest.fn();

    useAdminMode.mockReturnValue({
      showToast: mockShowToast,
    });

    const samplePost = {
      id: 'post-101',
      title: 'Cache Invalidation Mechanics',
      slug: 'cache-invalidation',
      excerpt: 'Cache patterns',
      content: '# Heading\nThis is content.',
      tags: ['caching', 'systems'],
      published: true,
      featured: false,
    };

    await act(async () => {
      root.render(<BlogInspector mode="edit" post={samplePost} onClose={mockClose} />);
    });

    expect(container.textContent).toContain('Edit: Cache Invalidation Mechanics');

    const submitBtn = container.querySelector('[data-testid="save-drawer-btn"]');
    expect(submitBtn).toBeTruthy();

    await act(async () => {
      submitBtn.click();
    });

    expect(mockFrom).toHaveBeenCalledWith('blog_posts');
    expect(mockShowToast).toHaveBeenCalledWith(
      expect.stringContaining('updated successfully'),
      'success'
    );
    expect(mockClose).toHaveBeenCalled();
  });
});
