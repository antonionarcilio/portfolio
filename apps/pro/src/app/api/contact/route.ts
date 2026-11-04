import { DEFAULT_LOCALE } from 'portfolio-content-model';

import { env } from '@/env';
import { cmsClient } from '@/lib/cms-client';
import { createContactRateLimiter } from '@/lib/contact/contact-rate-limiter';
import { createResendEmailSender } from '@/lib/contact/email-sender';
import { handleContactRequest, type ContactDependencies } from '@/lib/contact/handle-contact-request';
import { createTurnstileVerifier } from '@/lib/contact/verify-turnstile';

export const runtime = 'nodejs';

async function loadProfileLinks() {
  const portfolio = await cmsClient.getPortfolio(DEFAULT_LOCALE);
  if (!portfolio) throw new Error(`CMS returned no portfolio for locale "${DEFAULT_LOCALE}"; expected profile links`);
  return { linkedinUrl: portfolio.linkedinUrl, githubUrl: portfolio.githubUrl };
}

function resolveContactDependencies(): ContactDependencies | null {
  const { RESEND_API_KEY, CONTACT_FROM_EMAIL, CONTACT_NOTIFICATION_EMAIL, TURNSTILE_SECRET_KEY } = env;
  if (!RESEND_API_KEY || !CONTACT_FROM_EMAIL || !CONTACT_NOTIFICATION_EMAIL || !TURNSTILE_SECRET_KEY) return null;

  const { UPSTASH_REDIS_REST_URL: rateLimitUrl, UPSTASH_REDIS_REST_TOKEN: rateLimitToken } = env;
  return {
    verifyTurnstileToken: createTurnstileVerifier(TURNSTILE_SECRET_KEY),
    isWithinRateLimit:
      rateLimitUrl && rateLimitToken ? createContactRateLimiter({ url: rateLimitUrl, token: rateLimitToken }) : null,
    sendEmail: createResendEmailSender(RESEND_API_KEY, CONTACT_FROM_EMAIL),
    notificationEmail: CONTACT_NOTIFICATION_EMAIL,
    loadProfileLinks,
  };
}

export async function POST(request: Request) {
  const dependencies = resolveContactDependencies();
  if (!dependencies) {
    console.error(JSON.stringify({ scope: 'contact', event: 'not_configured' }));
    return Response.json({ error: 'not_configured' }, { status: 503 });
  }
  return handleContactRequest(request, dependencies);
}
