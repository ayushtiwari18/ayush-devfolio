import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import PublicShell from '../PublicShell';
import { useAdminMode } from '@/context/AdminModeContext';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let mockPathname = '/';
jest.mock('next/navigation', () => ({
  usePathname: () => mockPathname,
}));

jest.mock('@/context/AdminModeContext', () => ({
  useAdminMode: jest.fn(),
}));

jest.mock('@/components/layout/Navbar', () => {
  return function MockNavbar() {
    return <header data-testid="navbar">Navbar</header>;
  };
});

jest.mock('@/components/layout/Footer', () => {
  return function MockFooter() {
    return <footer data-testid="footer">Footer</footer>;
  };
});

describe('PublicShell Component', () => {
  let container;
  let root;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    mockPathname = '/';
    useAdminMode.mockReturnValue({
      isAdmin: false,
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

  it('renders neutral div#main-shell without outer main landmark', async () => {
    await act(async () => {
      root.render(
        <PublicShell>
          <main id="main-content">Page Content</main>
        </PublicShell>
      );
    });

    const shell = container.querySelector('#main-shell');
    expect(shell).not.toBeNull();
    expect(shell.tagName.toLowerCase()).toBe('div');

    // Exactly one main element exists (the child page template)
    const mains = container.querySelectorAll('main');
    expect(mains).toHaveLength(1);
    expect(mains[0].id).toBe('main-content');
    expect(mains[0].textContent).toBe('Page Content');
  });

  it('renders Navbar and Footer for public routes', async () => {
    mockPathname = '/blog';

    await act(async () => {
      root.render(
        <PublicShell>
          <main id="main-content">Blog Archive</main>
        </PublicShell>
      );
    });

    expect(container.querySelector('[data-testid="navbar"]')).not.toBeNull();
    expect(container.querySelector('[data-testid="footer"]')).not.toBeNull();
  });

  it('hides Navbar and Footer on admin routes', async () => {
    mockPathname = '/admin/dashboard';

    await act(async () => {
      root.render(
        <PublicShell>
          <div>Admin Content</div>
        </PublicShell>
      );
    });

    expect(container.querySelector('[data-testid="navbar"]')).toBeNull();
    expect(container.querySelector('[data-testid="footer"]')).toBeNull();
  });
});
