import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    MY_DOMAIN: z.url(),
    CMS_GITHUB_OWNER: z.string().min(1),
    CMS_GITHUB_REPO: z.string().min(1),
    CMS_GITHUB_BRANCH: z.string().min(1).default('master'),
    CMS_GITHUB_WEBHOOK_SECRET: z.string().min(1).optional(),
    CMS_REVALIDATE_SECONDS: z.coerce.number().int().positive().optional().default(3600),
  },
  runtimeEnv: {
    MY_DOMAIN: process.env.MY_DOMAIN,
    CMS_GITHUB_OWNER: process.env.CMS_GITHUB_OWNER,
    CMS_GITHUB_REPO: process.env.CMS_GITHUB_REPO,
    CMS_GITHUB_BRANCH: process.env.CMS_GITHUB_BRANCH,
    CMS_GITHUB_WEBHOOK_SECRET: process.env.CMS_GITHUB_WEBHOOK_SECRET,
    CMS_REVALIDATE_SECONDS: process.env.CMS_REVALIDATE_SECONDS,
  },
});
