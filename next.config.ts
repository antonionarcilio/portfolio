import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import './src/env';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
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
    const homeToPortfolios = [
      { source: '/', destination: '/portfolios', permanent: false },
      { source: '/en', destination: '/en/portfolios', permanent: false },
    ];
    const hiddenInProduction =
      process.env.NODE_ENV === 'production'
        ? [
            { source: '/minigames/snake', destination: '/404', permanent: false },
            { source: '/dev/:path*', destination: '/404', permanent: false },
            { source: '/en/dev/:path*', destination: '/404', permanent: false },
          ]
        : [];
    return [...homeToPortfolios, ...hiddenInProduction];
  },
};

export default withNextIntl(nextConfig);
