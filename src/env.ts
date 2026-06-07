import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    MY_DOMAIN: z.url(),
    // Strapi CMS — opcionais: ausentes, o portfólio cai no fallback local.
    STRAPI_API_URL: z.url().optional(),
    STRAPI_API_TOKEN: z.string().min(1).optional(),
    STRAPI_WEBHOOK_SECRET: z.string().min(1).optional(),
  },
  runtimeEnv: {
    MY_DOMAIN: process.env.MY_DOMAIN,
    STRAPI_API_URL: process.env.STRAPI_API_URL,
    STRAPI_API_TOKEN: process.env.STRAPI_API_TOKEN,
    STRAPI_WEBHOOK_SECRET: process.env.STRAPI_WEBHOOK_SECRET,
  },
});
