'use client';

/**
 * BfCacheManager — Client component that mounts the useBfCache hook globally.
 * Rendered in RootLayout so it covers ALL pages with a single registration.
 * Returns null — no DOM output.
 */

import { useBfCache } from '@/hooks/useBfCache';

export default function BfCacheManager() {
  useBfCache();
  return null;
}
