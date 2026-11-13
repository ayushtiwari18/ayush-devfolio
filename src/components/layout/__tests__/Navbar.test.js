import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import Navbar from '../Navbar';
import { usePathname } from 'next/navigation';
import { ROUTES, NAV_LINKS } from '@/lib/constants';
import { useAdminMode } from '@/context/AdminModeContext';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let mockPathname = '/';
jest.mock('next/navigation', () => ({
  usePathname: () => mockPathname,
}));

jest.mock('@/context/AdminModeContext', () => ({
  useAdminMode: jest.fn(),
}));

// Mock next/image
jest.mock('next/image', () => {
  return function MockImage({ src, alt, fill, priority, ...props }) {
    return <img src={src} alt={alt} {...props} />;
  };
});

describe('Navbar Component', () => {
  let container;
  let root;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    mockPathname = '/';
    useAdminMode.mockReturnValue({
      isAdmin: false,
      editMode: false,
      toggleEditMode: jest.fn(),
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

  it('defines ROUTES.HACKATHONS and includes Hackathons in NAV_LINKS', () => {
    expect(ROUTES.HACKATHONS).toBe('/hackathons');
    const hackathonLink = NAV_LINKS.find((link) => link.href === '/hackathons');
    expect(hackathonLink).toBeDefined();
    expect(hackathonLink.label).toBe('Hackathons');
  });

  it('renders all desktop navigation links including Hackathons', async () => {
    mockPathname = '/';

    await act(async () => {
      root.render(<Navbar />);
    });

    const links = Array.from(container.querySelectorAll('a[href="/hackathons"]'));
    expect(links.length).toBeGreaterThanOrEqual(1);
    expect(links[0].textContent).toContain('Hackathons');
  });

  it('highlights the Hackathons link when viewing /hackathons', async () => {
    mockPathname = '/hackathons';

    await act(async () => {
      root.render(<Navbar />);
    });

    const hackathonLink = container.querySelector('a[href="/hackathons"]');
    expect(hackathonLink).not.toBeNull();
    expect(hackathonLink.className).toContain('text-white');
  });

  it('renders Hackathons link in mobile drawer when toggled open', async () => {
    mockPathname = '/';

    await act(async () => {
      root.render(<Navbar />);
    });

    const menuToggle = container.querySelector('button[aria-label="Toggle navigation menu"]');
    expect(menuToggle).not.toBeNull();

    await act(async () => {
      menuToggle.click();
    });

    // Mobile drawer should now be open
    const hackathonLinks = container.querySelectorAll('a[href="/hackathons"]');
    expect(hackathonLinks.length).toBe(2); // Desktop + Mobile
  });

  it('does not render admin controller or legacy /admin/dashboard link when isAdmin is false', async () => {
    await act(async () => {
      root.render(<Navbar />);
    });

    expect(container.querySelector('a[href="/admin/dashboard"]')).toBeNull();
    expect(container.querySelector('button[aria-label*="edit mode"]')).toBeNull();
  });

  it('renders in-context admin toggle button without navigating away when isAdmin is true', async () => {
    const mockToggleEdit = jest.fn();
    useAdminMode.mockReturnValue({
      isAdmin: true,
      editMode: false,
      toggleEditMode: mockToggleEdit,
    });

    await act(async () => {
      root.render(<Navbar />);
    });

    // Must NOT contain legacy page redirect link
    expect(container.querySelector('a[href="/admin/dashboard"]')).toBeNull();

    // Must contain in-place admin button
    const adminBtn = container.querySelector('button[aria-label="Enable edit mode"]');
    expect(adminBtn).not.toBeNull();
    expect(adminBtn.textContent).toContain('Admin');

    // Click triggers toggleEditMode
    await act(async () => {
      adminBtn.click();
    });
    expect(mockToggleEdit).toHaveBeenCalled();
  });

  it('reflects active edit mode in visual indicator and mobile drawer', async () => {
    const mockToggleEdit = jest.fn();
    useAdminMode.mockReturnValue({
      isAdmin: true,
      editMode: true,
      toggleEditMode: mockToggleEdit,
    });

    await act(async () => {
      root.render(<Navbar />);
    });

    const activeAdminBtn = container.querySelector('button[aria-label="Disable edit mode"]');
    expect(activeAdminBtn).not.toBeNull();
    expect(activeAdminBtn.textContent).toContain('Editing');

    // Open mobile menu
    const menuToggle = container.querySelector('button[aria-label="Toggle navigation menu"]');
    await act(async () => {
      menuToggle.click();
    });

    // In mobile drawer, in-context admin button is rendered
    const mobileAdminBtn = container.querySelectorAll('button[aria-label="Disable edit mode"]')[1];
    expect(mobileAdminBtn).toBeDefined();
    expect(mobileAdminBtn.textContent).toContain('In-Context Admin (Edit Mode)');

    await act(async () => {
      mobileAdminBtn.click();
    });
    expect(mockToggleEdit).toHaveBeenCalled();
  });
});
