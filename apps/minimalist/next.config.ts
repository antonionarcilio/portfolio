import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import './src/env';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  transpilePackages: ['portfolio-content-model', 'portfolio-cms-client'],
  images: {
    remotePatterns: [
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
