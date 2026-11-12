import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import ProjectsCatalogClient from '../ProjectsCatalogClient';
import { useAdminMode } from '@/context/AdminModeContext';
import { supabase } from '@/lib/supabase';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// Mock AdminModeContext
jest.mock('@/context/AdminModeContext', () => ({
  useAdminMode: jest.fn(),
}));

// Mock Supabase with hoisted inline data
jest.mock('@/lib/supabase', () => {
  const inlineProjects = [
    {
      id: 'proj-1',
      title: 'Sentinal WAF Engine',
      slug: 'sentinal-waf',
      description: 'Real-time cybersecurity intrusion detection system',
      featured: true,
      published: true,
      technologies: ['FastAPI', 'Redis', 'Python'],
      tags: ['cybersecurity'],
    },
    {
      id: 'proj-2',
      title: 'Aurora Flow',
      slug: 'aurora-flow',
      description: 'Distributed workflow engine',
      featured: false,
      published: false,
      technologies: ['Next.js', 'Go'],
      tags: ['cloud'],
    },
  ];

  return {
    supabase: {
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({ data: inlineProjects, error: null }),
          }),
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

const testProjects = [
  {
    id: 'proj-1',
    title: 'Sentinal WAF Engine',
    slug: 'sentinal-waf',
    description: 'Real-time cybersecurity intrusion detection system',
    featured: true,
    published: true,
    technologies: ['FastAPI', 'Redis', 'Python'],
    tags: ['cybersecurity'],
  },
  {
    id: 'proj-2',
    title: 'Aurora Flow',
    slug: 'aurora-flow',
    description: 'Distributed workflow engine',
    featured: false,
    published: false,
    technologies: ['Next.js', 'Go'],
    tags: ['cloud'],
  },
];

describe('ProjectsCatalogClient Component', () => {
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

  it('renders public catalog without admin toolbars when isAdmin is false', async () => {
    useAdminMode.mockReturnValue({
      isAdmin: false,
      editMode: false,
      openDrawer: jest.fn(),
      showToast: jest.fn(),
    });

    await act(async () => {
      root.render(<ProjectsCatalogClient projects={testProjects} />);
    });

    expect(container.textContent).toContain('Sentinal WAF Engine');
    expect(container.textContent).toContain('Aurora Flow');
    expect(container.querySelector('button[aria-label="Edit project"]')).toBeNull();
  });

  it('renders in-context admin toolbars, draft badges, and edit triggers in Admin Mode', async () => {
    const mockOpenDrawer = jest.fn();
    const mockShowToast = jest.fn();

    useAdminMode.mockReturnValue({
      isAdmin: true,
      editMode: true,
      openDrawer: mockOpenDrawer,
      showToast: mockShowToast,
    });

    await act(async () => {
      root.render(<ProjectsCatalogClient projects={testProjects} />);
    });

    // Check Add Project button
    expect(container.textContent).toContain('Add Project');

    // Check status badges
    expect(container.textContent).toContain('Published');
    expect(container.textContent).toContain('Draft / Hidden');

    // Test clicking Edit on first project
    const editBtn = container.querySelector('button[aria-label="Edit project"]');
    expect(editBtn).toBeTruthy();

    await act(async () => {
      editBtn.click();
    });

    expect(mockOpenDrawer).toHaveBeenCalledWith('project-edit', expect.objectContaining({ id: 'proj-1' }));
  });
});
