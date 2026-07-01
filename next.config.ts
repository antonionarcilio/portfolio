import type { NextConfig } from 'next';
import './src/env';

const strapiUrl = new URL(process.env.STRAPI_API_URL ?? 'http://localhost:1337');

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: strapiUrl.protocol.replace(':', '') as 'http' | 'https',
        hostname: strapiUrl.hostname,
        port: strapiUrl.port,
        pathname: '/uploads/**',
      },
    ],
  },
  async redirects() {
    return process.env.NODE_ENV === 'production'
      ? [{ source: '/minigames/cobrinha', destination: '/404', permanent: false }]
      : [];
  },
};

export default nextConfig;
