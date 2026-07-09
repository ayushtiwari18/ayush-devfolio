import { countWords, extractExcerpt } from '@/lib/blogUtils';

describe('BlogEditor Utility Models', () => {
  describe('countWords', () => {
    it('returns 0 for empty or invalid input', () => {
      expect(countWords([])).toBe(0);
      expect(countWords(null)).toBe(0);
      expect(countWords(undefined)).toBe(0);
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

  describe('extractExcerpt', () => {
    it('returns empty string for invalid inputs', () => {
      expect(extractExcerpt([])).toBe('');
      expect(extractExcerpt(null)).toBe('');
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

    it('extracts excerpt perfectly if length is exactly right', () => {
      const text = 'This is a test block that contains exactly enough characters to surpass the twenty character minimum limit for excerpt generation in the editor model.';
      const blocks = [
        {
          type: 'paragraph',
          content: [{ type: 'text', text }]
        }
      ];
      expect(extractExcerpt(blocks)).toBe(text);
    });

    it('adds an ellipsis when text exceeds 200 characters', () => {
      const longText = 'A'.repeat(250);
      const blocks = [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: longText }]
        }
      ];
      const result = extractExcerpt(blocks);
      expect(result.length).toBe(200); // 197 chars + 3 dots
      expect(result.endsWith('...')).toBe(true);
    });
  });
});
