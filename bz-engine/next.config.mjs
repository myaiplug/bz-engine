/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // GitHub Pages serves under /bz-engine; Vercel serves at the domain root.
  basePath: process.env.VERCEL ? '' : '/bz-engine',
  trailingSlash: true,
  images: { unoptimized: true },
}

export default nextConfig
