import { env } from '@/env';
import { createContactRateLimiter, EMAIL_CHECK_POLICY } from '@/lib/contact/contact-rate-limiter';
import { getDefaultContactEmailChecker } from '@/lib/contact/email-reputation/contact-email-checker';
import { handleEmailCheckRequest, type EmailCheckDependencies } from '@/lib/contact/handle-email-check-request';

/** `nodejs`: a checagem de MX usa `node:dns`, que não existe no runtime edge. */
export const runtime = 'nodejs';

function resolveEmailCheckDependencies(): EmailCheckDependencies {
  const { UPSTASH_REDIS_REST_URL: url, UPSTASH_REDIS_REST_TOKEN: token } = env;
  return {
    checkEmail: getDefaultContactEmailChecker(),
    isWithinRateLimit: url && token ? createContactRateLimiter({ url, token }, EMAIL_CHECK_POLICY) : null,
  };
}

/** BFF do chat de contato: recusa e-mail descartável ou de domínio sem servidor de e-mail. */
export async function POST(request: Request) {
  return handleEmailCheckRequest(request, resolveEmailCheckDependencies());
}
