import { countWords, extractExcerpt, contentToMarkdown, estimateReadingTime } from '@/lib/blogUtils';

describe('BlogEditor Utility Models', () => {
  describe('countWords', () => {
    it('returns 0 for empty or invalid input', () => {
      expect(countWords([])).toBe(0);
      expect(countWords(null)).toBe(0);
      expect(countWords(undefined)).toBe(0);
      expect(countWords('')).toBe(0);
    });

    it('correctly counts words in raw markdown string', () => {
      const md = '# Hello World\n\nThis is a sample technical article with markdown.';
      expect(countWords(md)).toBe(10);
    });

    it('correctly counts words in a simple paragraph block', () => {
      const blocks = [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Hello world this is a test.' }]
        }
      ];
      expect(countWords(blocks)).toBe(6);
    });

    it('recursively counts words in nested blocks', () => {
      const blocks = [
        {
          type: 'bulletListItem',
          content: [{ type: 'text', text: 'Parent item' }],
          children: [
            {
              type: 'bulletListItem',
              content: [{ type: 'text', text: 'Nested child item' }]
            }
          ]
        }
      ];
      expect(countWords(blocks)).toBe(5);
    });
  });

  describe('estimateReadingTime', () => {
    it('estimates minimum 1 minute for short content', () => {
      expect(estimateReadingTime('Short sentence.')).toBe(1);
    });

    it('calculates reading time at 200 wpm', () => {
      const words = Array(500).fill('word').join(' ');
      expect(estimateReadingTime(words)).toBe(3);
    });
  });

  describe('extractExcerpt', () => {
    it('returns empty string for invalid inputs', () => {
      expect(extractExcerpt([])).toBe('');
      expect(extractExcerpt(null)).toBe('');
      expect(extractExcerpt('')).toBe('');
    });

    it('ignores blocks that are too short (under 20 chars)', () => {
      const blocks = [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Too short' }]
        }
      ];
      expect(extractExcerpt(blocks)).toBe('');
    });

    it('extracts excerpt from markdown string ignoring headings', () => {
      const md = '# Main Title\n\nThis is a sufficiently long first paragraph that serves as the lead excerpt for the article.';
      const excerpt = extractExcerpt(md);
      expect(excerpt).toContain('This is a sufficiently long');
      expect(excerpt).not.toContain('Main Title');
    });

    it('extracts excerpt from block array', () => {
      const text = 'This is a test block that contains exactly enough characters to surpass the twenty character minimum limit for excerpt generation in the editor model.';
      const blocks = [
        {
          type: 'paragraph',
          content: [{ type: 'text', text }]
        }
      ];
      expect(extractExcerpt(blocks)).toBe(text);
    });
  });

  describe('contentToMarkdown', () => {
    it('returns raw markdown untouched', () => {
      const md = '# Title\n\nParagraph with **bold** text.';
      expect(contentToMarkdown(md)).toBe(md);
    });

    it('converts Tiptap JSON document to Markdown', () => {
      const tiptapJson = JSON.stringify({
        type: 'doc',
        content: [
          { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Architecture Overview' }] },
          { type: 'paragraph', content: [{ type: 'text', text: 'Next.js paired with Supabase.' }] },
          { type: 'codeBlock', attrs: { language: 'typescript' }, content: [{ type: 'text', text: 'const x = 1;' }] }
        ]
      });

      const md = contentToMarkdown(tiptapJson);
      expect(md).toContain('## Architecture Overview');
      expect(md).toContain('Next.js paired with Supabase.');
      expect(md).toContain('```typescript\nconst x = 1;\n```');
    });

    it('converts BlockNote JSON array to Markdown', () => {
      const blockNoteJson = JSON.stringify([
        { type: 'heading', props: { level: 1 }, content: [{ type: 'text', text: 'Master Title' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'Sample paragraph body.' }] },
        { type: 'bulletListItem', content: [{ type: 'text', text: 'Key takeaway' }] }
      ]);

      const md = contentToMarkdown(blockNoteJson);
      expect(md).toContain('# Master Title');
      expect(md).toContain('Sample paragraph body.');
      expect(md).toContain('- Key takeaway');
    });
  });
});
