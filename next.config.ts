import type { NextConfig } from 'next';
import './src/env';

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
    return process.env.NODE_ENV === 'production'
      ? [{ source: '/minigames/snake', destination: '/404', permanent: false }]
      : [];
  },
};

export default nextConfig;
