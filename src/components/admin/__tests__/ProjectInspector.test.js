import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import ProjectInspector from '../inspectors/ProjectInspector';
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

describe('ProjectInspector Component', () => {
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

  it('renders in create mode and allows submitting a new project', async () => {
    const mockShowToast = jest.fn();
    const mockClose = jest.fn();

    useAdminMode.mockReturnValue({
      showToast: mockShowToast,
    });

    await act(async () => {
      root.render(<ProjectInspector mode="new" onClose={mockClose} />);
    });

    expect(container.textContent).toContain('Create New Project');

    // Change title input
    const titleInput = container.querySelector('input[placeholder="Sentinal WAF Engine"]');
    expect(titleInput).toBeTruthy();

    await act(async () => {
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      setter.call(titleInput, 'Quantum Mesh');
      titleInput.dispatchEvent(new Event('input', { bubbles: true }));
      titleInput.dispatchEvent(new Event('change', { bubbles: true }));
    });

    // Click submit
    const submitBtn = container.querySelector('[data-testid="save-drawer-btn"]');
    expect(submitBtn).toBeTruthy();

    await act(async () => {
      submitBtn.click();
    });

    expect(mockFrom).toHaveBeenCalledWith('projects');
    expect(mockShowToast).toHaveBeenCalledWith(
      expect.stringContaining('created successfully'),
      'success'
    );
    expect(mockClose).toHaveBeenCalled();
  });

  it('renders in edit mode with project details and saves updates', async () => {
    const mockShowToast = jest.fn();
    const mockClose = jest.fn();

    useAdminMode.mockReturnValue({
      showToast: mockShowToast,
    });

    const sampleProject = {
      id: 'proj-123',
      title: 'Sentinal WAF',
      slug: 'sentinal-waf',
      description: 'Web application firewall',
      technologies: ['FastAPI', 'Redis'],
      tags: ['security'],
      featured: true,
      published: true,
    };

    await act(async () => {
      root.render(<ProjectInspector mode="edit" project={sampleProject} onClose={mockClose} />);
    });

    expect(container.textContent).toContain('Edit: Sentinal WAF');
    expect(container.textContent).toContain('FastAPI');
    expect(container.textContent).toContain('Redis');

    // Save
    const submitBtn = container.querySelector('[data-testid="save-drawer-btn"]');
    expect(submitBtn).toBeTruthy();

    await act(async () => {
      submitBtn.click();
    });

    expect(mockFrom).toHaveBeenCalledWith('projects');
    expect(mockShowToast).toHaveBeenCalledWith(
      expect.stringContaining('updated successfully'),
      'success'
    );
    expect(mockClose).toHaveBeenCalled();
  });
});
