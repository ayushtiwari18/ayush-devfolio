import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import BlogSidebar, { extractHeadings } from '../BlogSidebar';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// Mock next/image to prevent invalid DOM attribute warnings
jest.mock('next/image', () => {
  return function MockImage({ src, alt, fill, unoptimized, ...props }) {
    return <img src={src} alt={alt} {...props} />;
  };
});

describe('BlogSidebar & extractHeadings', () => {
  let container;
  let root;
  let observeMock;
  let disconnectMock;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);

    observeMock = jest.fn();
    disconnectMock = jest.fn();
    window.IntersectionObserver = jest.fn().mockImplementation((callback) => ({
      observe: observeMock,
      disconnect: disconnectMock,
      unobserve: jest.fn(),
    }));
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
    delete window.IntersectionObserver;
    jest.clearAllMocks();
  });

  describe('extractHeadings function', () => {
    it('returns empty array for empty or invalid content', () => {
      expect(extractHeadings('')).toEqual([]);
      expect(extractHeadings(null)).toEqual([]);
      expect(extractHeadings(undefined)).toEqual([]);
      expect(extractHeadings({})).toEqual([]);
    });

    it('extracts headings from legacy BlockNote JSON blocks', () => {
      const blockNoteBlocks = [
        {
          id: '1',
          type: 'heading',
          props: { level: 2 },
          content: [{ type: 'text', text: 'Distributed Consensus' }],
        },
        {
          id: '2',
          type: 'paragraph',
          content: [{ type: 'text', text: 'Some body text...' }],
        },
        {
          id: '3',
          type: 'heading',
          props: { level: 3 },
          content: [{ type: 'text', text: 'Raft vs Paxos' }],
        },
      ];

      const headings = extractHeadings(blockNoteBlocks);
      expect(headings).toHaveLength(2);
      expect(headings[0]).toEqual({
        id: 'distributed-consensus',
        text: 'Distributed Consensus',
        level: 2,
      });
      expect(headings[1]).toEqual({
        id: 'raft-vs-paxos',
        text: 'Raft vs Paxos',
        level: 3,
      });
    });

    it('extracts headings from Markdown strings with code fence protection', () => {
      const markdown = `
# Executive Summary

## Architecture Deep-Dive

Here is some sample code:
\`\`\`python
# This is a python comment, not a heading!
## Neither is this
def init():
    pass
\`\`\`

### Caching Strategy with **Redis**
Details about Redis.

## Deployment Checklist
Checklist items...
`;

      const headings = extractHeadings(markdown);
      expect(headings).toHaveLength(4);
      expect(headings[0]).toEqual({
        id: 'executive-summary',
        text: 'Executive Summary',
        level: 1,
      });
      expect(headings[1]).toEqual({
        id: 'architecture-deep-dive',
        text: 'Architecture Deep-Dive',
        level: 2,
      });
      expect(headings[2]).toEqual({
        id: 'caching-strategy-with-redis',
        text: 'Caching Strategy with Redis',
        level: 3,
      });
      expect(headings[3]).toEqual({
        id: 'deployment-checklist',
        text: 'Deployment Checklist',
        level: 2,
      });
    });

    it('disambiguates duplicate heading slugs', () => {
      const markdown = `
## Summary
Intro summary.

## Summary
Conclusion summary.
`;
      const headings = extractHeadings(markdown);
      expect(headings).toHaveLength(2);
      expect(headings[0].id).toBe('summary');
      expect(headings[1].id).toBe('summary-1');
    });
  });

  describe('BlogSidebar component', () => {
    const sampleMarkdown = `
## System Architecture
Intro.

### State Management
Sub.
`;

    it('renders Table of Contents and links for markdown content', async () => {
      await act(async () => {
        root.render(
          <BlogSidebar
            content={sampleMarkdown}
            postUrl="https://ayushtiwari.dev/blog/system-architecture"
            postTitle="System Architecture"
            readingTime={5}
            tags={['Architecture', 'Systems']}
          />
        );
      });

      expect(container.textContent).toContain('Contents');
      expect(container.textContent).toContain('2 Sections');
      expect(container.textContent).toContain('System Architecture');
      expect(container.textContent).toContain('State Management');

      const links = container.querySelectorAll('a[href^="#"]');
      expect(links).toHaveLength(2);
      expect(links[0].getAttribute('href')).toBe('#system-architecture');
      expect(links[1].getAttribute('href')).toBe('#state-management');
    });

    it('does not render TOC if showToc is false', async () => {
      await act(async () => {
        root.render(
          <BlogSidebar
            content={sampleMarkdown}
            postUrl="https://ayushtiwari.dev/blog/test"
            postTitle="Test"
            showToc={false}
          />
        );
      });

      expect(container.textContent).not.toContain('Contents');
      expect(container.querySelector('a[href^="#"]')).toBeNull();
    });
  });
});
