import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import AdminDock from '../AdminDock';
import { useAdminMode } from '@/context/AdminModeContext';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn().mockReturnValue('/'),
}));

// Mock AdminModeContext hook
jest.mock('@/context/AdminModeContext', () => ({
  useAdminMode: jest.fn(),
}));

describe('AdminDock Component', () => {
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

  it('renders nothing when user is not admin', async () => {
    useAdminMode.mockReturnValue({
      isAdmin: false,
      editMode: false,
      toggleEditMode: jest.fn(),
      unreadCount: 0,
      openDrawer: jest.fn(),
      logout: jest.fn(),
      user: null,
    });

    await act(async () => {
      root.render(<AdminDock />);
    });

    expect(container.innerHTML).toBe('');
  });

  it('renders Admin HUD with preview/edit modes and actions when isAdmin is true', async () => {
    const mockToggleEdit = jest.fn();
    const mockOpenDrawer = jest.fn();
    const mockLogout = jest.fn();

    useAdminMode.mockReturnValue({
      isAdmin: true,
      editMode: true,
      toggleEditMode: mockToggleEdit,
      unreadCount: 3,
      openDrawer: mockOpenDrawer,
      logout: mockLogout,
      user: { email: 'ayush@example.com' },
    });

    await act(async () => {
      root.render(<AdminDock />);
    });

    expect(container.textContent).toContain('Admin HUD');
    expect(container.textContent).toContain('Preview');
    expect(container.textContent).toContain('Edit');
    expect(container.textContent).toContain('3'); // unread badge

    // Test clicking Preview mode button
    const previewBtn = container.querySelector('button[title*="Preview Mode"]');
    expect(previewBtn).toBeTruthy();
    await act(async () => {
      previewBtn.click();
    });
    expect(mockToggleEdit).toHaveBeenCalled();

    // Test opening messages drawer
    const messagesBtn = container.querySelector('button[aria-label="Open contact inquiries inbox"]');
    expect(messagesBtn).toBeTruthy();
    await act(async () => {
      messagesBtn.click();
    });
    expect(mockOpenDrawer).toHaveBeenCalledWith('messages');

    // Test opening settings drawer
    const settingsBtn = container.querySelector('button[aria-label="Open global site settings"]');
    expect(settingsBtn).toBeTruthy();
    await act(async () => {
      settingsBtn.click();
    });
    expect(mockOpenDrawer).toHaveBeenCalledWith('settings');

    // Test logout button
    const logoutBtn = container.querySelector('button[aria-label="Sign out from admin mode"]');
    expect(logoutBtn).toBeTruthy();
    await act(async () => {
      logoutBtn.click();
    });
    expect(mockLogout).toHaveBeenCalled();
  });

  it('supports collapsing into mini pill and expanding back', async () => {
    useAdminMode.mockReturnValue({
      isAdmin: true,
      editMode: true,
      toggleEditMode: jest.fn(),
      unreadCount: 0,
      openDrawer: jest.fn(),
      logout: jest.fn(),
      user: { email: 'ayush@example.com' },
    });

    await act(async () => {
      root.render(<AdminDock />);
    });

    const collapseBtn = container.querySelector('button[aria-label="Minimize admin dock"]');
    expect(collapseBtn).toBeTruthy();

    await act(async () => {
      collapseBtn.click();
    });

    // Should now show collapsed mini button
    const expandBtn = container.querySelector('button[title="Click to expand Admin HUD"]');
    expect(expandBtn).toBeTruthy();

    await act(async () => {
      expandBtn.click();
    });

    // Expanded again
    expect(container.querySelector('button[aria-label="Minimize admin dock"]')).toBeTruthy();
  });
});
