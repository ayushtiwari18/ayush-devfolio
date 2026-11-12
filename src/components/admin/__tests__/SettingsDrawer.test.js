import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import SettingsDrawer from '../inspectors/SettingsDrawer';
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

describe('SettingsDrawer Component', () => {
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
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            id: 'settings-123',
            name: 'Ayush Tiwari',
            title: 'Systems Developer',
            about_email: 'tiwariaayush780@gmail.com',
            about_location: 'Jabalpur, IN',
            about_availability: 'Open for work',
            github_url: 'https://github.com/ayushtiwari18',
            about_bio: 'Full Stack Engineer with 5,600+ commits.',
          }),
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

  it('renders settings fields and saves updates', async () => {
    const mockShowToast = jest.fn();
    const mockClose = jest.fn();

    useAdminMode.mockReturnValue({
      showToast: mockShowToast,
    });

    await act(async () => {
      root.render(<SettingsDrawer onClose={mockClose} />);
    });

    expect(container.textContent).toContain('Global Site & SEO Settings');
    expect(container.textContent).toContain('About Bio Narrative');
    expect(container.querySelector('textarea').value).toBe('Full Stack Engineer with 5,600+ commits.');

    // Click Save Settings button
    const submitBtn = container.querySelector('[data-testid="save-drawer-btn"]');
    expect(submitBtn).toBeTruthy();

    await act(async () => {
      submitBtn.click();
    });

    expect(global.fetch).toHaveBeenCalledWith(
      '/api/admin/profile',
      expect.objectContaining({
        method: 'PATCH',
      })
    );
    expect(mockShowToast).toHaveBeenCalledWith(
      expect.stringContaining('updated successfully'),
      'success'
    );
    expect(mockClose).toHaveBeenCalled();
  });
});
