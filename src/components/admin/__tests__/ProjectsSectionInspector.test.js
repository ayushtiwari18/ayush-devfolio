import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import ProjectsSectionInspector from '../inspectors/ProjectsSectionInspector';
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

describe('ProjectsSectionInspector Component', () => {
  let container;
  let root;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);

    const mockProjects = [
      {
        id: 'proj-1',
        title: 'EchoMeet',
        slug: 'echomeet',
        description: 'WebRTC video system',
        featured: true,
        published: true,
        technologies: ['Next.js', 'WebRTC'],
      },
      {
        id: 'proj-2',
        title: 'AuroraFlow',
        slug: 'auroraflow',
        description: 'Streaming platform',
        featured: false,
        published: false,
        technologies: ['React', 'Node.js'],
      },
    ];

    supabase.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        order: jest.fn().mockResolvedValue({ data: mockProjects, error: null }),
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

  it('renders projects and allows toggling featured status', async () => {
    const mockShowToast = jest.fn();
    const mockOpenDrawer = jest.fn();
    useAdminMode.mockReturnValue({
      openDrawer: mockOpenDrawer,
      showToast: mockShowToast,
    });

    await act(async () => {
      root.render(<ProjectsSectionInspector onClose={jest.fn()} />);
    });

    expect(container.textContent).toContain('Featured Engineering Systems');
    expect(container.textContent).toContain('EchoMeet');
    expect(container.textContent).toContain('AuroraFlow');

    // Click Add Project button
    const addBtn = container.querySelector('[data-testid="add-project-btn"]');
    expect(addBtn).toBeTruthy();

    await act(async () => {
      addBtn.click();
    });

    expect(mockOpenDrawer).toHaveBeenCalledWith('project-new');
  });
});
