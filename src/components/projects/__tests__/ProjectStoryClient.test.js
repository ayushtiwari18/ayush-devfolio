import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import ProjectStoryClient from '../ProjectStoryClient';
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

// Mock BlogEditor to avoid loading BlockNote in Node/Jest DOM environment
jest.mock('@/components/blog/BlogEditor', () => {
  return function MockBlogEditor({ value, onChange }) {
    return (
      <div data-testid="mock-project-editor">
        <textarea
          data-testid="mock-project-editor-textarea"
          value={typeof value === 'string' ? value : JSON.stringify(value)}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    );
  };
});

const sampleProject = {
  id: 'proj-101',
  title: 'Sentinal — Cloud Security',
  slug: 'sentinal',
  description: 'Intelligent digital border checkpoint for web apps.',
  cover_image: 'https://images.unsplash.com/photo-1?auto=format',
  live_url: 'https://sentinal.example.com',
  github_url: 'https://github.com/ayushtiwari18/sentinal',
  featured: true,
  published: true,
  technologies: ['Next.js', 'Python', 'XGBoost'],
  tags: ['Security', 'Cloud'],
  architecture_type: 'text',
  architecture_plan: '## Pipeline\nSub-millisecond packet filtering.',
};

describe('ProjectStoryClient Component', () => {
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
        <ProjectStoryClient
          initialProject={sampleProject}
          authorHeroImage="/profile.png"
          authorName="Ayush Tiwari"
          relatedProjects={[]}
        />
      );
    });

    expect(container.textContent).toContain('Sentinal — Cloud Security');
    expect(container.textContent).toContain('Intelligent digital border checkpoint');
    expect(container.textContent).not.toContain('Story Editor');
  });

  it('renders in-context editorial toolbar when isAdmin is true and editMode is active', async () => {
    useAdminMode.mockReturnValue({
      isAdmin: true,
      editMode: true,
      showToast: jest.fn(),
    });

    await act(async () => {
      root.render(
        <ProjectStoryClient
          initialProject={sampleProject}
          authorHeroImage="/profile.png"
          authorName="Ayush Tiwari"
          relatedProjects={[]}
        />
      );
    });

    expect(container.textContent).toContain('Read View');
    expect(container.textContent).toContain('Story Editor');
    expect(container.textContent).toContain('Published');
  });

  it('switches to Story Editor mode and renders in-canvas editor controls', async () => {
    useAdminMode.mockReturnValue({
      isAdmin: true,
      editMode: true,
      showToast: jest.fn(),
    });

    await act(async () => {
      root.render(
        <ProjectStoryClient
          initialProject={sampleProject}
          authorHeroImage="/profile.png"
          authorName="Ayush Tiwari"
          relatedProjects={[]}
        />
      );
    });

    const editViewBtn = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent.includes('Story Editor')
    );
    expect(editViewBtn).toBeTruthy();

    await act(async () => {
      editViewBtn.click();
    });

    // Verify in-canvas editor sections are rendered
    expect(container.textContent).toContain('Case Study Metadata Header');
    expect(container.textContent).toContain('Project Title');
    expect(container.textContent).toContain('Hero Cover Image URL');
    expect(container.textContent).toContain('Architecture & Engineering Narrative (Notion Canvas)');
    expect(container.querySelector('[data-testid="mock-project-editor"]')).toBeTruthy();

    // Edit title
    const titleInput = container.querySelector('input[placeholder*="Sentinal"]');
    expect(titleInput).toBeTruthy();

    await act(async () => {
      const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      nativeSetter.call(titleInput, 'Sentinal 2.0 Security Core');
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
      root.render(
        <ProjectStoryClient
          initialProject={sampleProject}
          authorHeroImage="/profile.png"
          authorName="Ayush Tiwari"
          relatedProjects={[]}
        />
      );
    });

    expect(container.textContent).toContain('Case Study Metadata Header');
    expect(container.textContent).toContain('Architecture & Engineering Narrative (Notion Canvas)');
  });
});
