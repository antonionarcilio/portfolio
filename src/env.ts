import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    MY_DOMAIN: z.url(),
    MY_PHONE: z.string().min(10),
  },
  runtimeEnv: {
    MY_DOMAIN: process.env.MY_DOMAIN,
    MY_PHONE: process.env.MY_PHONE,
  },
});
