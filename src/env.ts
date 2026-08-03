import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    MY_DOMAIN: z.url(),
    CMS_GITHUB_OWNER: z.string().min(1),
    CMS_GITHUB_REPO: z.string().min(1),
    CMS_GITHUB_BRANCH: z.string().min(1).default('master'),
    CMS_GITHUB_WEBHOOK_SECRET: z.string().min(1).optional(),
    VERCEL_DEPLOY_HOOK_URL: z.url().optional(),
  },
  runtimeEnv: {
    MY_DOMAIN: process.env.MY_DOMAIN,
    CMS_GITHUB_OWNER: process.env.CMS_GITHUB_OWNER,
    CMS_GITHUB_REPO: process.env.CMS_GITHUB_REPO,
    CMS_GITHUB_BRANCH: process.env.CMS_GITHUB_BRANCH,
    CMS_GITHUB_WEBHOOK_SECRET: process.env.CMS_GITHUB_WEBHOOK_SECRET,
    VERCEL_DEPLOY_HOOK_URL: process.env.VERCEL_DEPLOY_HOOK_URL,
  },
});
