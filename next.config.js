/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // ⚠️ Dangerously allow production builds to successfully complete even if
    // your project has TypeScript errors.
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // Optimize for Vercel deployment
  output: process.env.DOCKER_BUILD ? 'standalone' : undefined,
  
  // Disable static optimization to prevent SSR issues with Clerk
  trailingSlash: false,
  
  // Optimize images
  images: {
    domains: ['localhost', 'images.clerk.dev', 'clerk.com'],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  
  // Security headers - disabled in development to fix Clerk loading issues
  async headers() {
    // Skip CSP in development
    if (process.env.NODE_ENV === 'development') {
      return []
    }
    
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self' 'unsafe-eval' 'unsafe-inline'; script-src 'self' 'unsafe-eval' 'unsafe-inline' * data: blob: https://challenges.cloudflare.com; script-src-elem 'self' 'unsafe-eval' 'unsafe-inline' * data: blob: https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline' *; font-src 'self' *; img-src 'self' * data: blob:; connect-src 'self' * wss: data: blob:; frame-src 'self' * https://challenges.cloudflare.com;",
          },
        ],
      },
    ]
  },
  
  // Environment variables validation
  env: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
  },
  
  // External packages
  transpilePackages: ['clsx', 'tailwind-merge'],
  
  // Production optimizations
  poweredByHeader: false,
  compress: true,
  
  // Experimental features for production
  experimental: {
    optimizePackageImports: ['@radix-ui/react-icons', 'lucide-react'],
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
}

module.exports = nextConfig 