import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '../..');
const apiOrigin = process.env.API_ORIGIN ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  outputFileTracingRoot: root,
  reactStrictMode: true,
  transpilePackages: ['@spaceborn/web-core'],
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: '**' },
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
      { protocol: 'https', hostname: 'robu-prod-media.s3.ap-south-1.amazonaws.com' },
      { protocol: 'https', hostname: 'robu.in' },
      { protocol: 'https', hostname: 'robocraze.com' },
      { protocol: 'https', hostname: 'cdn.shopify.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  async rewrites() {
    if (process.env.API_ORIGIN || process.env.NEXT_PUBLIC_API_URL || process.env.NODE_ENV !== 'production') {
      return [{ source: '/v1/:path*', destination: `${apiOrigin}/v1/:path*` }];
    }
    return [];
  },
};

export default nextConfig;
