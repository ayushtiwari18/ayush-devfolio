import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import ContactInspector from '../inspectors/ContactInspector';
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

describe('ContactInspector Component', () => {
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
            id: 'prof-settings',
            about_email: 'ayushtiwari.dev@gmail.com',
            about_location: 'Jabalpur, MP',
            about_availability: 'Open for roles',
          }),
      });
    });

    supabase.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        order: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue({
            data: [
              {
                id: 'msg-1',
                name: 'Alice Cooper',
                email: 'alice@example.com',
                message: 'Looking for a full stack developer for our startup.',
                status: 'unread',
                created_at: new Date().toISOString(),
              },
            ],
            error: null,
          }),
        }),
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

  it('renders contact settings and saves updates', async () => {
    const mockShowToast = jest.fn();
    const mockClose = jest.fn();
    useAdminMode.mockReturnValue({
      showToast: mockShowToast,
    });

    await act(async () => {
      root.render(<ContactInspector onClose={mockClose} />);
    });

    expect(container.textContent).toContain('Contact Section & Inquiries');
    expect(container.textContent).toContain('Primary Inquiries Email');

    // Click Save Contact Settings
    const saveBtn = container.querySelector('[data-testid="save-drawer-btn"]');
    expect(saveBtn).toBeTruthy();

    await act(async () => {
      saveBtn.click();
    });

    expect(global.fetch).toHaveBeenCalledWith(
      '/api/admin/profile',
      expect.objectContaining({
        method: 'PATCH',
        body: expect.stringContaining('ayushtiwari.dev@gmail.com'),
      })
    );
    expect(mockShowToast).toHaveBeenCalledWith(
      expect.stringContaining('Contact channels & settings updated'),
      'success'
    );
    expect(mockClose).toHaveBeenCalled();
  });

  it('switches to Inquiries Inbox tab and displays messages', async () => {
    useAdminMode.mockReturnValue({
      showToast: jest.fn(),
    });

    await act(async () => {
      root.render(<ContactInspector onClose={jest.fn()} />);
    });

    const inboxTab = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent.includes('Inquiries Inbox')
    );
    expect(inboxTab).toBeTruthy();

    await act(async () => {
      inboxTab.click();
    });

    expect(container.textContent).toContain('Alice Cooper');
    expect(container.textContent).toContain('Looking for a full stack developer');
  });
});
