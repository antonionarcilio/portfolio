import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import './src/env';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  transpilePackages: ['portfolio-content-model', 'portfolio-cms-client'],
  async redirects() {
    return [
      {
        source: '/portfolios/minimalist/:path*',
        destination: 'https://minimalist.antoniomascarenhas.com.br/:path*',
        permanent: true,
      },
      {
        source: '/:locale/portfolios/minimalist/:path*',
        destination: 'https://minimalist.antoniomascarenhas.com.br/:locale/:path*',
        permanent: true,
      },
      {
        source: '/portfolios/gamified/:path*',
        destination: 'https://gamified.antoniomascarenhas.com.br/:path*',
        permanent: true,
      },
      {
        source: '/:locale/portfolios/gamified/:path*',
        destination: 'https://gamified.antoniomascarenhas.com.br/:locale/:path*',
        permanent: true,
      },
      { source: '/portfolios', destination: '/', permanent: true },
      { source: '/:locale/portfolios', destination: '/:locale', permanent: true },
    ];
  },
};

export default withNextIntl(nextConfig);
