import React, { act } from 'react';
import { createRoot } from 'react-dom/client';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

jest.mock('react-syntax-highlighter', () => ({
  Prism: function MockPrism({ children, language }) {
    return (
      <pre data-language={language}>
        <code>{children}</code>
      </pre>
    );
  },
}));
jest.mock('react-syntax-highlighter/dist/cjs/styles/prism', () => ({
  oneDark: {},
}));

jest.mock('remark-gfm', () => () => {});
jest.mock('rehype-slug', () => () => {});

jest.mock('react-markdown', () => {
  return function MockReactMarkdown({ children, components = {} }) {
    if (!children) return null;
    const lines = children.split('\n');
    const elements = [];
    let inCode = false;
    let codeLang = '';
    let codeLines = [];
    let listItems = [];
    let tableRows = [];

    const flushList = () => {
      if (listItems.length) {
        const UlComp = components.ul || 'ul';
        const LiComp = components.li || 'li';
        elements.push(
          <UlComp key={`ul-${elements.length}`}>
            {listItems.map((item, idx) => <LiComp key={idx}>{item}</LiComp>)}
          </UlComp>
        );
        listItems = [];
      }
    };

    const flushTable = () => {
      if (tableRows.length) {
        const TableComp = components.table || 'table';
        const TheadComp = components.thead || 'thead';
        const ThComp = components.th || 'th';
        const TdComp = components.td || 'td';
        const [headers, ...rows] = tableRows;
        elements.push(
          <TableComp key={`table-${elements.length}`}>
            <TheadComp>
              <tr>
                {headers.map((h, i) => <ThComp key={i}>{h}</ThComp>)}
              </tr>
            </TheadComp>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => <TdComp key={ci}>{cell}</TdComp>)}
                </tr>
              ))}
            </tbody>
          </TableComp>
        );
        tableRows = [];
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.startsWith('```')) {
        flushList();
        flushTable();
        if (inCode) {
          const PreComp = components.pre || 'pre';
          const CodeComp = components.code || 'code';
          const codeString = codeLines.join('\n');
          elements.push(
            <PreComp key={`code-${elements.length}`}>
              <CodeComp className={codeLang ? `language-${codeLang}` : ''}>
                {codeString}
              </CodeComp>
            </PreComp>
          );
          inCode = false;
          codeLang = '';
          codeLines = [];
        } else {
          inCode = true;
          codeLang = line.replace('```', '').trim();
          codeLines = [];
        }
        continue;
      }

      if (inCode) {
        codeLines.push(line);
        continue;
      }

      if (line.startsWith('|')) {
        flushList();
        if (!line.includes('---')) {
          const cells = line.split('|').map(c => c.trim()).filter(Boolean);
          if (cells.length) tableRows.push(cells);
        }
        continue;
      } else {
        flushTable();
      }

      if (line.startsWith('- ')) {
        listItems.push(line.replace(/^- /, '').trim());
        continue;
      } else {
        flushList();
      }

      if (line.startsWith('# ')) {
        const H1Comp = components.h1 || 'h1';
        elements.push(<H1Comp key={`h1-${elements.length}`}>{line.replace(/^# /, '').trim()}</H1Comp>);
        continue;
      }
      if (line.startsWith('## ')) {
        const H2Comp = components.h2 || 'h2';
        elements.push(<H2Comp key={`h2-${elements.length}`}>{line.replace(/^## /, '').trim()}</H2Comp>);
        continue;
      }
      if (line.startsWith('### ')) {
        const H3Comp = components.h3 || 'h3';
        elements.push(<H3Comp key={`h3-${elements.length}`}>{line.replace(/^### /, '').trim()}</H3Comp>);
        continue;
      }

      if (line.trim()) {
        const PComp = components.p || 'p';
        elements.push(<PComp key={`p-${elements.length}`}>{line.trim()}</PComp>);
      }
    }

    flushList();
    flushTable();

    return <div>{elements}</div>;
  };
});

import BlogContent from '../BlogContent';

describe('BlogContent Component', () => {
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

  it('renders null when content is empty or falsy', async () => {
    await act(async () => {
      root.render(<BlogContent content="" />);
    });
    expect(container.innerHTML).toBe('');

    await act(async () => {
      root.render(<BlogContent content={null} />);
    });
    expect(container.innerHTML).toBe('');
  });

  describe('Legacy BlockNote JSON content', () => {
    const blockNoteBlocks = [
      {
        id: 'block-1',
        type: 'heading',
        props: { level: 2 },
        content: [{ type: 'text', text: 'Architecture Overview', styles: {} }],
        children: [],
      },
      {
        id: 'block-2',
        type: 'paragraph',
        props: {},
        content: [{ type: 'text', text: 'Production grade Next.js stack with Tailwind.', styles: {} }],
        children: [],
      },
      {
        id: 'block-3',
        type: 'codeBlock',
        props: { language: 'typescript' },
        content: [{ type: 'text', text: 'const answer: number = 42;', styles: {} }],
        children: [],
      },
    ];

    it('renders BlockNote JSON array correctly with heading IDs and code blocks', async () => {
      await act(async () => {
        root.render(<BlogContent content={blockNoteBlocks} />);
      });

      const heading = container.querySelector('h2');
      expect(heading).not.toBeNull();
      expect(heading.textContent).toContain('Architecture Overview');
      expect(heading.id).toBe('architecture-overview');

      expect(container.textContent).toContain('Production grade Next.js stack with Tailwind.');
      expect(container.textContent).toContain('typescript');
      expect(container.textContent).toContain('const answer: number = 42;');

      const copyBtn = container.querySelector('button[aria-label="Copy code to clipboard"]');
      expect(copyBtn).not.toBeNull();
    });

    it('renders BlockNote stringified JSON array', async () => {
      await act(async () => {
        root.render(<BlogContent content={JSON.stringify(blockNoteBlocks)} />);
      });

      const heading = container.querySelector('h2');
      expect(heading).not.toBeNull();
      expect(heading.textContent).toContain('Architecture Overview');
      expect(heading.id).toBe('architecture-overview');
    });
  });

  describe('Markdown string content', () => {
    const markdownSample = `
# Main Article Title

## System Architecture

Here is an introductory paragraph detailing the scalable platform design.

\`\`\`javascript
function calculateScore(items) {
  return items.reduce((acc, curr) => acc + curr.score, 0);
}
\`\`\`

### Key Features
- High-throughput WebSocket pipelines
- Distributed Redis caching

| Metric | Target |
| --- | --- |
| Latency | < 50ms |
| Uptime | 99.99% |
`;

    it('renders Markdown string with semantic headings and slugified IDs', async () => {
      await act(async () => {
        root.render(<BlogContent content={markdownSample} />);
      });

      const h1 = container.querySelector('h1');
      expect(h1).not.toBeNull();
      expect(h1.textContent).toContain('Main Article Title');
      expect(h1.id).toBe('main-article-title');

      const h2 = container.querySelector('h2');
      expect(h2).not.toBeNull();
      expect(h2.textContent).toContain('System Architecture');
      expect(h2.id).toBe('system-architecture');

      const h3 = container.querySelector('h3');
      expect(h3).not.toBeNull();
      expect(h3.textContent).toContain('Key Features');
      expect(h3.id).toBe('key-features');
    });

    it('renders code blocks with language badge and tactile copy button', async () => {
      await act(async () => {
        root.render(<BlogContent content={markdownSample} />);
      });

      expect(container.textContent).toContain('javascript');
      expect(container.textContent).toContain('calculateScore');

      const copyBtn = container.querySelector('button[aria-label="Copy code to clipboard"]');
      expect(copyBtn).not.toBeNull();
    });

    it('renders lists and tables correctly', async () => {
      await act(async () => {
        root.render(<BlogContent content={markdownSample} />);
      });

      expect(container.textContent).toContain('High-throughput WebSocket pipelines');
      expect(container.textContent).toContain('Distributed Redis caching');

      expect(container.textContent).toContain('Metric');
      expect(container.textContent).toContain('Latency');
      expect(container.textContent).toContain('< 50ms');

      const table = container.querySelector('table');
      expect(table).not.toBeNull();
    });
  });
});
