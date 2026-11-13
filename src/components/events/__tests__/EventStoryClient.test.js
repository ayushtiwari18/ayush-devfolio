import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import EventStoryClient from '../EventStoryClient';
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

jest.mock('@/lib/supabase', () => {
  const mockUpsert = jest.fn().mockResolvedValue({ data: null, error: null });
  return {
    supabase: {
      from: jest.fn().mockReturnValue({
        upsert: mockUpsert,
      }),
    },
    __mockUpsert: mockUpsert,
  };
});

// Mock react-markdown & syntax highlighter for BlogContent within PehelStoryView
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
      <div data-testid="mock-event-editor">
        <textarea
          data-testid="mock-event-editor-textarea"
          value={typeof value === 'string' ? value : JSON.stringify(value)}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    );
  };
});

const sampleEvent = {
  id: 'evt-101',
  title: 'Pehel — Ek Nayi Subha',
  slug: 'pehel',
  tagline: '8th Edition University-Wide Gratitude Initiative',
  description: 'An annual campus tradition honoring workers who build and protect the campus.',
  category: 'Milestone',
  organizer: 'Gyan Ganga Group',
  location: 'GGITS Campus, Jabalpur',
  date: '2025-01-15',
  duration: '8 Hours Live',
  result: '500+ Attendees',
  prize: 'Community Recognition Award',
  role: 'Video Production & Creative Lead',
  cover_image: 'https://images.unsplash.com/photo-event-1',
  published: true,
  featured: true,
  content: '## Executive Retrospective\nDocumenting the auxiliary staff.',
};

describe('EventStoryClient Component', () => {
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
      root.render(<EventStoryClient initialEvent={sampleEvent} />);
    });

    expect(container.textContent).toContain('Pehel — Ek Nayi Subha');
    expect(container.textContent).toContain('8th Edition University-Wide Gratitude Initiative');
    expect(container.textContent).not.toContain('Event Editor');
  });

  it('renders in-context editorial toolbar when isAdmin is true and editMode is active', async () => {
    useAdminMode.mockReturnValue({
      isAdmin: true,
      editMode: true,
      showToast: jest.fn(),
    });

    await act(async () => {
      root.render(<EventStoryClient initialEvent={sampleEvent} />);
    });

    expect(container.textContent).toContain('Read View');
    expect(container.textContent).toContain('Event Editor');
    expect(container.textContent).toContain('Published');
    expect(container.textContent).toContain('Featured Milestone');
  });

  it('switches to Event Editor mode and renders in-canvas editor controls', async () => {
    useAdminMode.mockReturnValue({
      isAdmin: true,
      editMode: true,
      showToast: jest.fn(),
    });

    await act(async () => {
      root.render(<EventStoryClient initialEvent={sampleEvent} />);
    });

    const editViewBtn = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent.includes('Event Editor')
    );
    expect(editViewBtn).toBeTruthy();

    await act(async () => {
      editViewBtn.click();
    });

    // Verify in-canvas editor sections are rendered
    expect(container.textContent).toContain('Event Header & Metadata Controls');
    expect(container.textContent).toContain('Event Title');
    expect(container.textContent).toContain('Tagline / Theme');
    expect(container.textContent).toContain('Event Overview / Thesis');
    expect(container.textContent).toContain('Event Retrospective & Narrative Canvas (Notion Editor)');
    expect(container.querySelector('[data-testid="mock-event-editor"]')).toBeTruthy();

    // Edit title
    const titleInput = container.querySelector('input[placeholder*="Pehel"]');
    expect(titleInput).toBeTruthy();

    await act(async () => {
      const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      nativeSetter.call(titleInput, 'Pehel 9th Edition — Gratitude Walk');
      titleInput.dispatchEvent(new Event('input', { bubbles: true }));
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
      root.render(<EventStoryClient initialEvent={sampleEvent} />);
    });

    expect(container.textContent).toContain('Event Header & Metadata Controls');
    expect(container.textContent).toContain('Event Retrospective & Narrative Canvas (Notion Editor)');
  });
});
