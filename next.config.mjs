import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

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
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-popover',
      '@radix-ui/react-tooltip',
      '@radix-ui/react-select',
      '@radix-ui/react-dialog',
      '@radix-ui/react-accordion',
      'date-fns',
      'recharts',
    ],
  },
  // 压缩配置 - 核心优化
  compress: true,
}

export default withNextIntl(nextConfig);
