import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@nzlab/ui', '@nzlab/nz-sources'],
  typedRoutes: true,
  devIndicators: false,
  // GitHub Pages serves static files only, so the app exports to plain HTML.
  // The Pages workflow sets NEXT_PUBLIC_BASE_PATH to /<repo-name>; it stays
  // empty for local dev and Vercel builds so URLs remain root-relative.
  output: 'export',
  // Story routes become <slug>/index.html so GitHub Pages serves
  // /microsites/<slug>/ without an .html extension.
  trailingSlash: true,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? '',
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH ?? '',
  images: {
    unoptimized: true,
    remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }],
  },
};

export default nextConfig;
