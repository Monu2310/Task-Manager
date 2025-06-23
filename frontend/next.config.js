/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  },
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  generateEtags: false,
  httpAgentOptions: {
    keepAlive: true,
  },
  experimental: {
    optimizePackageImports: ['@radix-ui/react-icons'],
  },
}

module.exports = nextConfig
