import type { MetadataRoute } from 'next';

import { env } from '@/env';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${env.MY_DOMAIN}/portfolios/gamer`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];
}
