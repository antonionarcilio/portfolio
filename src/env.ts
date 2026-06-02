import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    MY_DOMAIN: z.url(),
  },
  runtimeEnv: {
    MY_DOMAIN: process.env.MY_DOMAIN,
  },
});
