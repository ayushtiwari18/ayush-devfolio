/**
 * M6 FIX: Prevent Google from indexing any /admin route.
 * Next.js App Router supports per-segment robots.js files.
 * This overrides the root robots config for the entire /admin subtree.
 */
export default function adminRobots() {
  return {
    rules: [
      {
        userAgent: '*',
        disallow: '/admin',
      },
    ],
  };
}
