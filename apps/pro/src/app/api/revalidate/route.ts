import { handleRevalidateWebhook } from 'portfolio-cms-client/revalidate';

import { env } from '@/env';

export async function POST(request: Request) {
  return handleRevalidateWebhook(request, {
    secret: env.CMS_GITHUB_WEBHOOK_SECRET,
    deployHookUrl: env.VERCEL_DEPLOY_HOOK_URL,
    branch: env.CMS_GITHUB_BRANCH,
  });
}
