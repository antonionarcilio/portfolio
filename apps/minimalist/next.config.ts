import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import './src/env';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  transpilePackages: ['portfolio-content-model', 'portfolio-cms-client'],
  images: {
    // O retrato (`avatarUrl`) pode vir do repo público do CMS via raw.githubusercontent.com (wikilink em `assets/me/`);
    // capas em URL completa vêm do Cloudinary.
    remotePatterns: [
      { protocol: 'https', hostname: 'raw.githubusercontent.com', pathname: '/**' },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    return process.env.NODE_ENV === 'production'
      ? [
          { source: '/dev/:path*', destination: '/404', permanent: false },
          { source: '/en/dev/:path*', destination: '/404', permanent: false },
        ]
      : [];
  },
};

export default withNextIntl(nextConfig);
