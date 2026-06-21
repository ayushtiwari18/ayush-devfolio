/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  poweredByHeader: false, // Remove X-Powered-By: Next.js header (minor security + bytes)
  compress: true,         // Enable gzip/brotli compression on responses

  // ── Package Import Optimisation ───────────────────────────
  // Tells Next.js/webpack to only bundle named exports you actually import.
  // Critical for framer-motion (~400KB saved) and lucide-react (~200KB saved).
  experimental: {
    optimizePackageImports: [
      'framer-motion',
      'lucide-react',
      '@radix-ui/react-icons',
      'three',  // Added: tree-shake Three.js namespace imports
    ],
  },

  // ── Security & Cache Headers ──────────────────────────────
  async headers() {
    return [
      {
        source: '/_next/static/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          { key: 'X-DNS-Prefetch-Control',  value: 'on' },
          { key: 'X-Frame-Options',          value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options',   value: 'nosniff' },
          { key: 'Referrer-Policy',          value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',       value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Strict-Transport-Security',value: 'max-age=63072000; includeSubDomains; preload' },
        ],
      },
    ];
  },

  // ── Images ────────────────────────────────────────────────
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: '**.supabase.in' },
    ],
  },

  // ── Webpack ───────────────────────────────────────────────
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Three.js is client-only — completely exclude from server bundle
      config.resolve.alias = {
        ...config.resolve.alias,
        three: false,
        'three/src/scenes/Scene.js': false,
        'three/src/math/Color.js': false,
        'three/src/cameras/PerspectiveCamera.js': false,
        'three/src/renderers/WebGLRenderer.js': false,
        'three/src/core/BufferGeometry.js': false,
        'three/src/core/BufferAttribute.js': false,
        'three/src/geometries/SphereGeometry.js': false,
        'three/src/geometries/RingGeometry.js': false,
        'three/src/materials/MeshStandardMaterial.js': false,
        'three/src/materials/MeshBasicMaterial.js': false,
        'three/src/materials/LineBasicMaterial.js': false,
        'three/src/materials/PointsMaterial.js': false,
        'three/src/objects/Mesh.js': false,
        'three/src/objects/Line.js': false,
        'three/src/objects/Points.js': false,
        'three/src/lights/AmbientLight.js': false,
        'three/src/lights/PointLight.js': false,
        'three/src/math/Vector2.js': false,
        'three/src/math/Vector3.js': false,
        'three/src/constants.js': false,
        'three/addons/controls/OrbitControls.js': false,
        'three/addons/postprocessing/EffectComposer.js': false,
        'three/addons/postprocessing/RenderPass.js': false,
        'three/addons/postprocessing/UnrealBloomPass.js': false,
        'three/addons/postprocessing/OutputPass.js': false,
      };
    }

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
