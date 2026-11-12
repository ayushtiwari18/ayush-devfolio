import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import AboutInspector from '../inspectors/AboutInspector';
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

describe('AboutInspector Component', () => {
  let container;
  let root;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);

    global.fetch = jest.fn((url, options) => {
      if (options?.method === 'PATCH') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        });
      }

      if (url === '/api/admin/profile') {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              id: 'prof-456',
              about_bio: 'Started with competitive programming.\n\nNow architecting cloud systems.',
              about_availability: 'Available for full-time engineering',
              about_location: 'Jabalpur, MP, India',
              about_email: 'ayushtiwari.dev@gmail.com',
            }),
        });
      }

      if (url === '/api/admin/achievements') {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve([
              {
                id: 'ach-1',
                label: 'GitHub Commits',
                value: '5,600+',
                description: 'Open source work',
                icon: 'github',
              },
            ]),
        });
      }

      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
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

  it('renders bio paragraph narrative and saves updates', async () => {
    const mockShowToast = jest.fn();
    const mockClose = jest.fn();

    useAdminMode.mockReturnValue({
      showToast: mockShowToast,
    });

    await act(async () => {
      root.render(<AboutInspector onClose={mockClose} />);
    });

    // Verify title and paragraph structure
    expect(container.textContent).toContain('About & Engineering Narrative');
    expect(container.textContent).toContain('Biographical Narrative (Paragraphs)');
    expect(container.textContent).toContain('Live Website Preview');

    const textarea = container.querySelector('textarea');
    expect(textarea).toBeTruthy();
    expect(textarea.value).toContain('Started with competitive programming');

    // Verify live preview renders paragraphs
    expect(container.textContent).toContain('Now architecting cloud systems.');

    // Save About Section
    const saveBtn = container.querySelector('[data-testid="save-drawer-btn"]');
    expect(saveBtn).toBeTruthy();

    await act(async () => {
      saveBtn.click();
    });

    expect(global.fetch).toHaveBeenCalledWith(
      '/api/admin/profile',
      expect.objectContaining({
        method: 'PATCH',
        body: expect.stringContaining('Started with competitive programming'),
      })
    );

    expect(mockShowToast).toHaveBeenCalledWith(
      expect.stringContaining('updated successfully'),
      'success'
    );
    expect(mockClose).toHaveBeenCalled();
  });

  it('allows tab switching to deliverables bar', async () => {
    const mockClose = jest.fn();
    useAdminMode.mockReturnValue({ showToast: jest.fn() });

    await act(async () => {
      root.render(<AboutInspector onClose={mockClose} />);
    });

    const deliverablesTab = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent.includes('Deliverables Bar')
    );
    expect(deliverablesTab).toBeTruthy();

    await act(async () => {
      deliverablesTab.click();
    });

    expect(container.textContent).toContain('Quantified engineering metrics');
    expect(container.textContent).toContain('Metric #1');
    expect(container.textContent).toContain('Numeric Value');
  });
});
