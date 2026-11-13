import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import BlogPostClient from '../BlogPostClient';
import { useAdminMode } from '@/context/AdminModeContext';
import { supabase } from '@/lib/supabase';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const mockPush = jest.fn();
const mockRefresh = jest.fn();
let mockSearchParams = new URLSearchParams();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
  useSearchParams: () => mockSearchParams,
}));

jest.mock('@/context/AdminModeContext', () => ({
  useAdminMode: jest.fn(),
}));

jest.mock('next/image', () => {
  return function MockImage({ src, alt, fill, unoptimized, priority, ...props }) {
    return <img src={src} alt={alt} {...props} />;
  };
});

jest.mock('@/lib/supabase', () => {
  const mockUpdate = jest.fn().mockReturnValue({
    eq: jest.fn().mockResolvedValue({ data: null, error: null }),
  });
  return {
    supabase: {
      from: jest.fn().mockReturnValue({
        update: mockUpdate,
      }),
    },
    __mockUpdate: mockUpdate,
  };
});

// Mock react-markdown & syntax highlighter for BlogContent within BlogPostClient
jest.mock('react-syntax-highlighter', () => ({
  Prism: function MockPrism({ children, language }) {
    return (
      <pre data-language={language}>
        <code>{children}</code>
      </pre>
    );
  },
}));
jest.mock('react-syntax-highlighter/dist/cjs/styles/prism', () => ({
  oneDark: {},
}));
jest.mock('remark-gfm', () => () => {});
jest.mock('rehype-slug', () => () => {});
jest.mock('react-markdown', () => {
  return function MockReactMarkdown({ children }) {
    return <div data-testid="markdown-content">{children}</div>;
  };
});

// Mock BlogEditor to avoid loading BlockNote in Node/Jest DOM environment
jest.mock('@/components/blog/BlogEditor', () => {
  return function MockBlogEditor({ value, onChange }) {
    return (
      <div data-testid="mock-blog-editor">
        <textarea
          data-testid="mock-blog-editor-textarea"
          value={typeof value === 'string' ? value : JSON.stringify(value)}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    );
  };
});

const samplePost = {
  id: 'post-101',
  title: 'Microservices vs Monoliths',
  slug: 'microservices-vs-monoliths',
  excerpt: 'A pragmatic evaluation of distributed systems versus modular monoliths.',
  content: '## Core Tradeoffs\n\nLatency, deployment independence, and network boundaries.',
  cover_image: 'https://images.unsplash.com/photo-1?auto=format',
  featured: false,
  published: true,
  reading_time: 6,
  tags: ['Systems', 'Architecture'],
  created_at: '2026-03-01T00:00:00Z',
};

describe('BlogPostClient Component', () => {
  let container;
  let root;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    mockSearchParams = new URLSearchParams();
    jest.clearAllMocks();
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

  it('renders public reading view without admin toolbar when isAdmin is false', async () => {
    useAdminMode.mockReturnValue({
      isAdmin: false,
      editMode: false,
      showToast: jest.fn(),
    });

    await act(async () => {
      root.render(
        <BlogPostClient
          initialPost={samplePost}
          authorHeroImage="/profile.png"
          authorName="Ayush Tiwari"
          isAyush={true}
          postUrl="https://ayushtiwari.dev/blog/microservices-vs-monoliths"
        />
      );
    });

    expect(container.textContent).toContain('Microservices vs Monoliths');
    expect(container.textContent).toContain('A pragmatic evaluation of distributed systems');
    expect(container.textContent).not.toContain('In-Context Edit');
    expect(container.textContent).not.toContain('Split Preview');
  });

  it('renders in-context editorial toolbar when isAdmin is true and editMode is active', async () => {
    useAdminMode.mockReturnValue({
      isAdmin: true,
      editMode: true,
      showToast: jest.fn(),
    });

    await act(async () => {
      root.render(
        <BlogPostClient
          initialPost={samplePost}
          authorHeroImage="/profile.png"
          authorName="Ayush Tiwari"
          isAyush={true}
          postUrl="https://ayushtiwari.dev/blog/microservices-vs-monoliths"
        />
      );
    });

    expect(container.textContent).toContain('Read View');
    expect(container.textContent).toContain('In-Context Edit');
    expect(container.textContent).toContain('Split Preview');
  });

  it('switches to In-Context Edit mode and supports editing fields', async () => {
    useAdminMode.mockReturnValue({
      isAdmin: true,
      editMode: true,
      showToast: jest.fn(),
    });

    await act(async () => {
      root.render(
        <BlogPostClient
          initialPost={samplePost}
          authorHeroImage="/profile.png"
          authorName="Ayush Tiwari"
          isAyush={true}
          postUrl="https://ayushtiwari.dev/blog/microservices-vs-monoliths"
        />
      );
    });

    const editViewBtn = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent.includes('In-Context Edit')
    );
    expect(editViewBtn).toBeTruthy();

    await act(async () => {
      editViewBtn.click();
    });

    // Verify editable inputs are rendered
    expect(container.textContent).toContain('Article Headline (H1)');
    expect(container.textContent).toContain('Article Blocks (Notion Editor)');
    expect(container.textContent).toContain('Save Changes');

    // Edit title
    const titleTextarea = container.querySelector('textarea[placeholder="Article Headline..."]');
    expect(titleTextarea).toBeTruthy();

    await act(async () => {
      titleTextarea.value = 'Distributed Systems in 2026';
      titleTextarea.dispatchEvent(new Event('input', { bubbles: true }));
      titleTextarea.dispatchEvent(new Event('change', { bubbles: true }));
    });

    expect(container.textContent).toContain('Save Changes');
  });

  it('opens directly in edit mode when ?edit=true search parameter is present for admin', async () => {
    mockSearchParams = new URLSearchParams('edit=true');
    useAdminMode.mockReturnValue({
      isAdmin: true,
      editMode: false,
      showToast: jest.fn(),
    });

    await act(async () => {
      root.render(
        <BlogPostClient
          initialPost={samplePost}
          authorHeroImage="/profile.png"
          authorName="Ayush Tiwari"
          isAyush={true}
          postUrl="https://ayushtiwari.dev/blog/microservices-vs-monoliths"
        />
      );
    });

    expect(container.textContent).toContain('Article Headline (H1)');
    expect(container.textContent).toContain('Article Blocks (Notion Editor)');
    expect(container.textContent).toContain('Save Changes');
  });

  it('supports Split Preview mode with live rendering', async () => {
    useAdminMode.mockReturnValue({
      isAdmin: true,
      editMode: true,
      showToast: jest.fn(),
    });

    await act(async () => {
      root.render(
        <BlogPostClient
          initialPost={samplePost}
          authorHeroImage="/profile.png"
          authorName="Ayush Tiwari"
          isAyush={true}
          postUrl="https://ayushtiwari.dev/blog/microservices-vs-monoliths"
        />
      );
    });

    const splitBtn = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent.includes('Split Preview')
    );
    expect(splitBtn).toBeTruthy();

    await act(async () => {
      splitBtn.click();
    });

    expect(container.textContent).toContain('Live Reader Preview');
  });
});
