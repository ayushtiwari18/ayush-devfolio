import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import SkillsInspector from '../inspectors/SkillsInspector';
import { useAdminMode } from '@/context/AdminModeContext';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({ refresh: jest.fn() }),
}));

// Mock AdminModeContext
jest.mock('@/context/AdminModeContext', () => ({
  useAdminMode: jest.fn(),
}));

describe('SkillsInspector Component', () => {
  let container;
  let root;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);

    global.fetch = jest.fn((url, options) => {
      if (options?.method === 'POST') {
        const body = JSON.parse(options.body);
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ id: 'skill-new', ...body }),
        });
      }

      if (options?.method === 'PATCH') {
        const body = JSON.parse(options.body);
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ ...body }),
        });
      }

      if (options?.method === 'DELETE') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        });
      }

      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve([
            { id: 'skill-1', name: 'React', category: 'frontend', level: 90, icon: 'react' },
            { id: 'skill-2', name: 'Node.js', category: 'backend', level: 85, icon: 'nodejs' },
            { id: 'skill-3', name: 'Docker', category: 'tools', level: 80, icon: 'docker' },
          ]),
      });
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

  it('renders skills and category filter counts', async () => {
    useAdminMode.mockReturnValue({ showToast: jest.fn() });

    await act(async () => {
      root.render(<SkillsInspector onClose={jest.fn()} />);
    });

    expect(container.textContent).toContain('Skills & Technical Capabilities');
    expect(container.textContent).toContain('React');
    expect(container.textContent).toContain('Node.js');
    expect(container.textContent).toContain('Docker');
  });

  it('filters skills by search input', async () => {
    useAdminMode.mockReturnValue({ showToast: jest.fn() });

    await act(async () => {
      root.render(<SkillsInspector onClose={jest.fn()} />);
    });

    const searchInput = container.querySelector('input[placeholder*="Filter skills"]');
    expect(searchInput).toBeTruthy();

    const nativeSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      'value'
    ).set;

    await act(async () => {
      nativeSetter.call(searchInput, 'Docker');
      searchInput.dispatchEvent(new Event('input', { bubbles: true }));
      searchInput.dispatchEvent(new Event('change', { bubbles: true }));
    });

    expect(container.textContent).toContain('Docker');
    expect(container.textContent).not.toContain('React');
  });

  it('submits a new skill', async () => {
    const mockShowToast = jest.fn();
    useAdminMode.mockReturnValue({ showToast: mockShowToast });

    await act(async () => {
      root.render(<SkillsInspector onClose={jest.fn()} />);
    });

    // Click + Add Skill button to toggle form
    const toggleBtn = container.querySelector('[data-testid="add-skill-toggle-btn"]');
    expect(toggleBtn).toBeTruthy();

    await act(async () => {
      toggleBtn.click();
    });

    const nameInput = container.querySelector('input[placeholder*="Next.js"]');
    expect(nameInput).toBeTruthy();

    const nativeSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      'value'
    ).set;

    await act(async () => {
      nativeSetter.call(nameInput, 'Kubernetes');
      nameInput.dispatchEvent(new Event('input', { bubbles: true }));
      nameInput.dispatchEvent(new Event('change', { bubbles: true }));
    });

    const form = container.querySelector('form');
    expect(form).toBeTruthy();

    await act(async () => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });

    expect(global.fetch).toHaveBeenCalledWith(
      '/api/admin/skills',
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('Kubernetes'),
      })
    );
    expect(mockShowToast).toHaveBeenCalledWith(
      expect.stringContaining('created successfully'),
      'success'
    );
  });
});
