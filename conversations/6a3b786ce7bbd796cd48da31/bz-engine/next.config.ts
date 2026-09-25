import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/bz-engine',
  images: { unoptimized: true },
}

export default nextConfig
