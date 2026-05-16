/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // ── Compiler ──────────────────────────────────────────────
  // SWC minifier is enabled by default in Next.js 13+.
  // Explicitly confirm here for clarity.
  swcMinify: true,

  // ── Package Import Optimisation ───────────────────────────
  // Tells Next.js to only bundle the specific named exports you import
  // from these packages — prevents the full library landing in the chunk.
  // This is especially critical for framer-motion (saves ~400 KB).
  experimental: {
    optimizePackageImports: [
      'framer-motion',
      'lucide-react',
      '@radix-ui/react-icons',
    ],
  },

  // ── Security & Cache Headers ──────────────────────────────
  async headers() {
    return [
      {
        // Immutable cache for all Next.js static assets (_next/static)
        // These are content-hashed, so they can be cached forever.
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
    ];
  },

  // ── Images ────────────────────────────────────────────────
  images: {
    formats: ['image/avif', 'image/webp'],
    // Serve images at optimal sizes. deviceSizes covers common breakpoints.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.in',
      },
    ],
  },

  // ── Webpack: prevent Three.js from crashing SSR build ─────
  // three is a client-only library. Aliasing to false on the server
  // ensures it is completely excluded from the server bundle.
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        three: false,
        'three/addons/controls/OrbitControls.js': false,
        'three/addons/postprocessing/EffectComposer.js': false,
        'three/addons/postprocessing/RenderPass.js': false,
        'three/addons/postprocessing/UnrealBloomPass.js': false,
        'three/addons/postprocessing/OutputPass.js': false,
      };
    }

    // Split three.js into its own chunk so it doesn't inflate app/page.js.
    // This allows the main page JS to load faster while three.js downloads
    // in parallel (but off the critical path).
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization?.splitChunks,
          cacheGroups: {
            ...config.optimization?.splitChunks?.cacheGroups,
            three: {
              test: /[\\/]node_modules[\\/]three[\\/]/,
              name: 'three-vendor',
              chunks: 'all',
              priority: 30,
              enforce: true,
            },
            framerMotion: {
              test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
              name: 'framer-motion-vendor',
              chunks: 'all',
              priority: 20,
              enforce: true,
            },
          },
        },
      };
    }

    return config;
  },
};

module.exports = nextConfig;
