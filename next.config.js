/** @type {import('next').NextConfig} */
const nextConfig = {
  // Compression (gzip/brotli)
  compress: true,
  // Remove X-Powered-By header for speed & security
  poweredByHeader: false,
  // Strict mode for cleaner React execution
  reactStrictMode: true,
  // Allow Three.js imports
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei"],
  // Turbopack options
  turbopack: {},
  // Modern Image Optimization
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days cache for static images
  },
};

module.exports = nextConfig;
