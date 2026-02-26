/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Three.js and its addons use window/document/WebGL at module level.
      // Tell webpack to return an empty module for them on the server so
      // the build doesn't crash. They are always loaded dynamically on the
      // client (ssr:false / dynamic import), so this is safe.
      config.resolve.alias = {
        ...config.resolve.alias,
        three: false,
        'three/addons/controls/OrbitControls.js': false,
        'three/addons/postprocessing/EffectComposer.js': false,
        'three/addons/postprocessing/RenderPass.js': false,
        'three/addons/postprocessing/UnrealBloomPass.js': false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
