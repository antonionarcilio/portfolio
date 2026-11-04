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
    // Formulário de contato: sem estas variáveis a rota /api/contact responde 503 (não configurada).
    RESEND_API_KEY: z.string().min(1).optional(),
    CONTACT_FROM_EMAIL: z.string().min(1).optional(),
    CONTACT_NOTIFICATION_EMAIL: z.email().optional(),
    TURNSTILE_SITE_KEY: z.string().min(1).optional(),
    TURNSTILE_SECRET_KEY: z.string().min(1).optional(),
    UPSTASH_REDIS_REST_URL: z.url().optional(),
    UPSTASH_REDIS_REST_TOKEN: z.string().min(1).optional(),
  },
  runtimeEnv: {
    MY_DOMAIN: process.env.MY_DOMAIN,
    CMS_GITHUB_OWNER: process.env.CMS_GITHUB_OWNER,
    CMS_GITHUB_REPO: process.env.CMS_GITHUB_REPO,
    CMS_GITHUB_BRANCH: process.env.CMS_GITHUB_BRANCH,
    CMS_GITHUB_WEBHOOK_SECRET: process.env.CMS_GITHUB_WEBHOOK_SECRET,
    VERCEL_DEPLOY_HOOK_URL: process.env.VERCEL_DEPLOY_HOOK_URL,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    CONTACT_FROM_EMAIL: process.env.CONTACT_FROM_EMAIL,
    CONTACT_NOTIFICATION_EMAIL: process.env.CONTACT_NOTIFICATION_EMAIL,
    TURNSTILE_SITE_KEY: process.env.TURNSTILE_SITE_KEY,
    TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
  },
});
