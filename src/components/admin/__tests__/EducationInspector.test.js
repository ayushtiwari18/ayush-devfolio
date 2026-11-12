import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import EducationInspector from '../inspectors/EducationInspector';
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

describe('EducationInspector Component', () => {
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
          json: () => Promise.resolve({ id: 'edu-new', institution: 'JEC', degree: 'B.Tech' }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve([
            {
              id: 'edu-1',
              institution: 'Jabalpur Engineering College',
              degree: 'Bachelor of Technology',
              field: 'Computer Science & Engineering',
              start_date: '2021',
              end_date: '2025',
              location: 'Jabalpur, MP',
              description: 'Core Degree Program',
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

  it('renders existing credentials and allows switching to add form', async () => {
    const mockShowToast = jest.fn();
    const mockClose = jest.fn();

    useAdminMode.mockReturnValue({
      showToast: mockShowToast,
    });

    await act(async () => {
      root.render(<EducationInspector onClose={mockClose} />);
    });

    expect(container.textContent).toContain('Academic Pedigree & Degrees');
    expect(container.textContent).toContain('Jabalpur Engineering College');
    expect(container.textContent).toContain('Bachelor of Technology');

    // Click "Add Degree"
    const addDegreeBtn = container.querySelector('button.bg-primary\\/10');
    expect(addDegreeBtn).toBeTruthy();

    await act(async () => {
      addDegreeBtn.click();
    });

    expect(container.textContent).toContain('+ New Credential');
    expect(container.textContent).toContain('Institution / University');
  });
});
