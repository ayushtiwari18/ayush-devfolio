/**
 * blogUtils.js — Blog parsing, word counting, excerpt extraction, and markdown conversion.
 */

/**
 * Counts total words in either raw markdown text or structured block arrays.
 * @param {string|Array} input
 * @returns {number}
 */
export function countWords(input) {
  if (!input) return 0;
  if (typeof input === 'string') {
    const clean = input
      .replace(/```[\s\S]*?```/g, '') // remove code blocks from word count
      .replace(/[#*`>_~\[\]()!-]/g, ' ')
      .trim();
    return clean ? clean.split(/\s+/).filter(Boolean).length : 0;
  }
  if (!Array.isArray(input)) return 0;

  let count = 0;
  const walk = (blocks) => {
    for (const block of blocks) {
      if (Array.isArray(block.content)) {
        for (const inline of block.content) {
          if (inline.type === 'text' && inline.text) {
            count += inline.text.trim().split(/\s+/).filter(Boolean).length;
          }
        }
      }
      if (block.children?.length) walk(block.children);
    }
  };
  walk(input);
  return count;
}

/**
 * Estimates reading time in minutes based on ~200 WPM.
 * @param {string|Array} input
 * @returns {number}
 */
export function estimateReadingTime(input) {
  const words = countWords(input);
  return Math.max(1, Math.ceil(words / 200));
}

/**
 * Extracts a 1-2 sentence lead excerpt from markdown or block arrays.
 * @param {string|Array} input
 * @returns {string}
 */
export function extractExcerpt(input) {
  if (!input) return '';

  if (typeof input === 'string') {
    // Strip markdown formatting characters to get clean plain text
    const clean = input
      .replace(/^#+.*$/gm, '') // remove headings
      .replace(/```[\s\S]*?```/g, '') // remove code blocks
      .replace(/!\[.*?\]\(.*?\)/g, '') // remove images
      .replace(/\[(.*?)\]\(.*?\)/g, '$1') // remove links keep text
      .replace(/[>*_~`]/g, '')
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 20);

    const firstValidParagraph = clean[0] || '';
    if (firstValidParagraph.length > 200) {
      return firstValidParagraph.substring(0, 197).trim() + '...';
    }
    return firstValidParagraph;
  }

  if (Array.isArray(input)) {
    for (const block of input) {
      if (block.type === 'paragraph' && Array.isArray(block.content)) {
        const text = block.content
          .filter((i) => i.type === 'text')
          .map((i) => i.text)
          .join('');
        if (text.trim().length > 20) {
          let excerpt = text.trim();
          if (excerpt.length > 200) {
            excerpt = excerpt.substring(0, 197).trim() + '...';
          }
          return excerpt;
        }
      }
    }
  }

  return '';
}

/**
 * Converts any legacy JSON (BlockNote or Tiptap) into standardized Markdown.
 * If input is already plain markdown, returns it untouched.
 * @param {string|object|Array} content
 * @returns {string}
 */
export function contentToMarkdown(content) {
  if (!content) return '';

  if (typeof content === 'string') {
    const trimmed = content.trim();
    if (!trimmed.startsWith('[') && !trimmed.startsWith('{')) {
      return content; // already markdown string
    }
    try {
      const parsed = JSON.parse(content);
      return parseJsonToMarkdown(parsed);
    } catch {
      return content; // parsing failed, treat as markdown
    }
  }

  return parseJsonToMarkdown(content);
}

function parseJsonToMarkdown(data) {
  if (!data) return '';

  // Case 1: Tiptap Document: { type: 'doc', content: [...] }
  if (data.type === 'doc' && Array.isArray(data.content)) {
    return data.content.map(renderTiptapNode).filter(Boolean).join('\n\n');
  }

  // Case 2: BlockNote Array: [{ type: 'paragraph', content: [...] }]
  if (Array.isArray(data)) {
    return data.map(renderBlockNoteNode).filter(Boolean).join('\n\n');
  }

  return '';
}

function renderTiptapNode(node) {
  if (!node) return '';
  const text = (node.content || []).map((c) => c.text || '').join('');

  switch (node.type) {
    case 'heading': {
      const level = node.attrs?.level || 2;
      return `${'#'.repeat(level)} ${text}`;
    }
    case 'paragraph':
      return text;
    case 'codeBlock': {
      const lang = node.attrs?.language || '';
      return `\`\`\`${lang}\n${text}\n\`\`\``;
    }
    case 'blockquote':
      return `> ${text}`;
    case 'bulletList':
      return (node.content || []).map((li) => `- ${(li.content || []).map(renderTiptapNode).join(' ')}`).join('\n');
    case 'orderedList':
      return (node.content || []).map((li, idx) => `${idx + 1}. ${(li.content || []).map(renderTiptapNode).join(' ')}`).join('\n');
    case 'horizontalRule':
      return '---';
    case 'image': {
      const src = node.attrs?.src || '';
      const alt = node.attrs?.alt || 'Image';
      return `![${alt}](${src})`;
    }
    default:
      return text;
  }
}

function renderBlockNoteNode(block) {
  if (!block) return '';
  const text = Array.isArray(block.content)
    ? block.content.map((i) => (typeof i === 'string' ? i : i.text || '')).join('')
    : '';

  switch (block.type) {
    case 'heading': {
      const level = block.props?.level || 2;
      return `${'#'.repeat(level)} ${text}`;
    }
    case 'paragraph':
      return text;
    case 'codeBlock':
    case 'code': {
      const lang = block.props?.language || '';
      return `\`\`\`${lang}\n${text}\n\`\`\``;
    }
    case 'bulletListItem':
      return `- ${text}`;
    case 'numberedListItem':
      return `1. ${text}`;
    case 'image': {
      const url = block.props?.url || '';
      const caption = block.props?.caption || 'Image';
      return `![${caption}](${url})`;
    }
    default:
      return text;
  }
}
