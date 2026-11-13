import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import Navbar from '../Navbar';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ROUTES, NAV_LINKS } from '@/lib/constants';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let mockPathname = '/';
jest.mock('next/navigation', () => ({
  usePathname: () => mockPathname,
}));

jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn().mockResolvedValue({ data: { session: null }, error: null }),
      onAuthStateChange: jest.fn().mockReturnValue({
        data: { subscription: { unsubscribe: jest.fn() } },
      }),
    },
  },
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
});
