import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { AdminModeProvider, useAdminMode } from '../AdminModeContext';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// Mock Supabase
jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: jest.fn().mockReturnValue({
        data: { subscription: { unsubscribe: jest.fn() } },
      }),
      signOut: jest.fn().mockResolvedValue({}),
    },
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({ count: 0, error: null }),
      }),
    }),
  },
}));

describe('AdminModeContext', () => {
  let container;
  let root;

  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
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
  });

  it('renders children with public defaults when no session exists', async () => {
    let contextValues = null;

    function TestConsumer() {
      contextValues = useAdminMode();
      return (
        <div>
          <span id="admin-status">{contextValues.isAdmin ? 'admin' : 'public'}</span>
          <span id="drawer-status">{contextValues.activeDrawer ? contextValues.activeDrawer.id : 'none'}</span>
        </div>
      );
    }

    await act(async () => {
      root.render(
        <AdminModeProvider>
          <TestConsumer />
        </AdminModeProvider>
      );
    });

    expect(container.querySelector('#admin-status').textContent).toBe('public');
    expect(container.querySelector('#drawer-status').textContent).toBe('none');
    expect(contextValues.isAdmin).toBe(false);
    expect(contextValues.editMode).toBe(false);
    expect(contextValues.loginModalOpen).toBe(false);
  });

  it('allows opening and closing drawers and modals', async () => {
    let contextValues = null;

    function TestConsumer() {
      contextValues = useAdminMode();
      return (
        <div>
          <button id="open-hero" onClick={() => contextValues.openDrawer('hero')} />
          <button id="close-drawer" onClick={() => contextValues.closeDrawer()} />
          <button id="open-login" onClick={() => contextValues.openLoginModal()} />
          <button id="close-login" onClick={() => contextValues.closeLoginModal()} />
        </div>
      );
    }

    await act(async () => {
      root.render(
        <AdminModeProvider>
          <TestConsumer />
        </AdminModeProvider>
      );
    });

    await act(async () => {
      container.querySelector('#open-hero').click();
    });
    expect(contextValues.activeDrawer).toEqual({ id: 'hero', data: null });

    await act(async () => {
      container.querySelector('#close-drawer').click();
    });
    expect(contextValues.activeDrawer).toBeNull();

    await act(async () => {
      container.querySelector('#open-login').click();
    });
    expect(contextValues.loginModalOpen).toBe(true);

    await act(async () => {
      container.querySelector('#close-login').click();
    });
    expect(contextValues.loginModalOpen).toBe(false);
  });

  it('throws an error if useAdminMode is used outside AdminModeProvider', () => {
    function InvalidConsumer() {
      useAdminMode();
      return null;
    }

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => {
      renderWithoutProvider(<InvalidConsumer />);
    }).toThrow('useAdminMode must be used within an AdminModeProvider');
    consoleSpy.mockRestore();

    function renderWithoutProvider(element) {
      const tempDiv = document.createElement('div');
      const tempRoot = createRoot(tempDiv);
      try {
        act(() => {
          tempRoot.render(element);
        });
      } finally {
        tempRoot.unmount();
      }
    }
  });
});
