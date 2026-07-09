export function countWords(blocks) {
  if (!blocks?.length) return 0;
  let count = 0;
  const walk = (blocks) => {
    for (const block of blocks) {
      if (Array.isArray(block.content)) {
        for (const inline of block.content) {
          if (inline.type === 'text')
            count += inline.text.trim().split(/\s+/).filter(Boolean).length;
        }
      }
      if (block.children?.length) walk(block.children);
    }
  };
  walk(blocks);
  return count;
}

export function extractExcerpt(blocks) {
  if (!blocks?.length) return '';
  for (const block of blocks) {
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
  return '';
}
