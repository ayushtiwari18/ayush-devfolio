import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import BlogReadingNav from '../BlogReadingNav';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href, ...props }) => (
    <a href={href} {...props}>
      {children}
    </a>
  );
});

describe('BlogReadingNav Component', () => {
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

  it('renders without error and displays progress percentage', async () => {
    await act(async () => {
      root.render(
        <BlogReadingNav
          postTitle="Testing Architecture Patterns"
          postUrl="https://ayushtiwari.dev/blog/testing-architecture"
          category="Architecture"
        />
      );
    });

    expect(container.textContent).toContain('Testing Architecture Patterns');
    expect(container.textContent).toContain('Architecture');
    expect(container.textContent).toContain('0%');
  });

  it('updates progress on scroll', async () => {
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => cb());

    // Mock document scroll properties before render
    Object.defineProperty(document.documentElement, 'scrollTop', { value: 500, configurable: true });
    Object.defineProperty(document.documentElement, 'scrollHeight', { value: 1500, configurable: true });
    Object.defineProperty(document.documentElement, 'clientHeight', { value: 500, configurable: true });

    await act(async () => {
      root.render(
        <BlogReadingNav
          postTitle="Scroll Test"
          postUrl="https://ayushtiwari.dev/blog/scroll-test"
          category="Testing"
        />
      );
    });

    expect(container.textContent).toContain('50%');
  });
});
