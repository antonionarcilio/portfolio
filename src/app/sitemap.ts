import type { MetadataRoute } from 'next';

import { env } from '@/env';
import { getPathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

export default function sitemap(): MetadataRoute.Sitemap {
  return routing.locales.map((locale) => ({
    url: `${env.MY_DOMAIN}${getPathname({ locale, href: { pathname: '/portfolios/gamified' } })}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 1,
  }));
}
