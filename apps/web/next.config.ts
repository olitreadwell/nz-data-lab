import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@nzlab/ui'],
  typedRoutes: true,
  devIndicators: false,
  // GitHub Pages serves static files only, so the app exports to plain HTML.
  // The Pages workflow sets NEXT_PUBLIC_BASE_PATH to /<repo-name>; it stays
  // empty for local dev and Vercel builds so URLs remain root-relative.
  output: 'export',
  basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? '',
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH ?? '',
  images: {
    unoptimized: true,
    remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }],
  },
};

export default nextConfig;
