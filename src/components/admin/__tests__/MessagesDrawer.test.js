import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import MessagesDrawer from '../inspectors/MessagesDrawer';
import { useAdminMode } from '@/context/AdminModeContext';
import { supabase } from '@/lib/supabase';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// Mock AdminModeContext
jest.mock('@/context/AdminModeContext', () => ({
  useAdminMode: jest.fn(),
}));

const mockMessages = [
  {
    id: 'msg-1',
    name: 'Sarah Connor',
    email: 'sarah@skynet.ai',
    message: 'Interested in discussing a senior distributed systems role.',
    status: 'unread',
    created_at: '2026-03-01T12:00:00Z',
  },
  {
    id: 'msg-2',
    name: 'Alex Rivera',
    email: 'alex@startup.io',
    message: 'Can you consult on our Next.js architecture?',
    status: 'read',
    created_at: '2026-02-28T10:00:00Z',
  },
];

// Mock Supabase
jest.mock('@/lib/supabase', () => {
  return {
    supabase: {
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({
            data: [
              {
                id: 'msg-1',
                name: 'Sarah Connor',
                email: 'sarah@skynet.ai',
                message: 'Interested in discussing a senior distributed systems role.',
                status: 'unread',
                created_at: '2026-03-01T12:00:00Z',
              },
              {
                id: 'msg-2',
                name: 'Alex Rivera',
                email: 'alex@startup.io',
                message: 'Can you consult on our Next.js architecture?',
                status: 'read',
                created_at: '2026-02-28T10:00:00Z',
              },
            ],
            error: null,
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

describe('MessagesDrawer Component', () => {
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

  it('renders messages and updates read/unread status on click', async () => {
    const mockRefresh = jest.fn();
    const mockShowToast = jest.fn();
    const mockClose = jest.fn();

    useAdminMode.mockReturnValue({
      refreshUnreadCount: mockRefresh,
      showToast: mockShowToast,
    });

    await act(async () => {
      root.render(<MessagesDrawer onClose={mockClose} />);
    });

    expect(container.textContent).toContain('Contact Inquiries Inbox');
    expect(container.textContent).toContain('Sarah Connor');
    expect(container.textContent).toContain('Alex Rivera');

    // Test clicking Mark Read
    const markReadBtn = container.querySelector('button[title="Mark as read"]');
    expect(markReadBtn).toBeTruthy();

    await act(async () => {
      markReadBtn.click();
    });

    expect(supabase.from).toHaveBeenCalledWith('contact_messages');
    expect(mockRefresh).toHaveBeenCalled();
  });
});
