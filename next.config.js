/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // B8 FIX: swcMinify was deprecated in Next.js 14+ (it's on by default).
  // Explicitly setting it caused build warnings. Removed.
  poweredByHeader: false,
  compress: true,

  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-icons',
    ],
  },

  async headers() {
    return [
      {
        source: '/_next/static/(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/(.*)',
        headers: [
          { key: 'X-DNS-Prefetch-Control',   value: 'on' },
          { key: 'X-Frame-Options',           value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options',    value: 'nosniff' },
          { key: 'Referrer-Policy',           value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',        value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
        ],
      },
    ];
  },

  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: '**.supabase.in' },
    ],
  },

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

    return config;
  },
};

module.exports = nextConfig;
