/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // 核心性能优化
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  // 压缩配置 - 核心优化
  compress: true,
}

export default nextConfig