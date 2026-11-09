import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import './src/env';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  transpilePackages: ['portfolio-content-model', 'portfolio-cms-client'],
  images: {
    // `gallery`/avatares do CMS vêm do repo público via raw.githubusercontent.com; capas e logos em URL vêm do Cloudinary
    remotePatterns: [
      { protocol: 'https', hostname: 'raw.githubusercontent.com', pathname: '/**' },
      { protocol: 'https', hostname: 'res.cloudinary.com', pathname: '/**' },
    ],
  },
  async redirects() {
    return [
      // Temporário: precisa vir antes das regras `:path*` abaixo (a primeira que casa vence), senão a raiz
      // de /portfolios/minimalist continuaria indo para o domínio do app minimalist.
      { source: '/portfolios/minimalist', destination: '/', permanent: false },
      { source: '/:locale/portfolios/minimalist', destination: '/:locale', permanent: false },
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
