import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import ExperienceInspector from '../inspectors/ExperienceInspector';
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

describe('ExperienceInspector Component', () => {
  let container;
  let root;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);

    global.fetch = jest.fn((url, options) => {
      if (options?.method === 'POST') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ id: 'exp-new', company: 'Google', role: 'SWE' }),
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
            {
              id: 'exp-1',
              company: 'Verto Labs',
              role: 'Full Stack Intern',
              employment_type: 'Internship',
              start_date: 'June 2024',
              end_date: 'Aug 2024',
              location: 'Remote',
              technologies: 'Next.js, FastAPI',
            },
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

  it('renders existing experiences and allows switching to add form', async () => {
    const mockShowToast = jest.fn();
    const mockClose = jest.fn();

    useAdminMode.mockReturnValue({
      showToast: mockShowToast,
    });

    await act(async () => {
      root.render(<ExperienceInspector onClose={mockClose} />);
    });

    expect(container.textContent).toContain('Experience & Milestones');
    expect(container.textContent).toContain('Verto Labs');
    expect(container.textContent).toContain('Full Stack Intern');

    // Click "Add Role"
    const addRoleBtn = container.querySelector('button.bg-primary\\/10');
    expect(addRoleBtn).toBeTruthy();

    await act(async () => {
      addRoleBtn.click();
    });

    expect(container.textContent).toContain('+ New Role');
    expect(container.textContent).toContain('Company / Organization');
  });
});
