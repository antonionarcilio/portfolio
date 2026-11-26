import {
  EMAIL_CHECK_ENDPOINT,
  emailCheckResponseSchema,
  type EmailCheckRequest,
  type EmailCheckVerdict,
} from '../email-check-contract';

/** Assinatura da checagem injetada no chat: devolve o veredito do BFF para um e-mail já validado no formato. */
export type VerifyEmailAddress = (email: string) => Promise<EmailCheckVerdict>;

/** Acima disso o visitante segue sem a checagem — o envio final revalida no servidor. */
const EMAIL_CHECK_TIMEOUT_MILLISECONDS = 5_000;

async function postEmailCheck(email: string): Promise<EmailCheckVerdict> {
  const body: EmailCheckRequest = { email };
  const response = await fetch(EMAIL_CHECK_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(EMAIL_CHECK_TIMEOUT_MILLISECONDS),
  });
  if (!response.ok) throw new Error(`POST ${EMAIL_CHECK_ENDPOINT} answered ${response.status}; expected 200`);
  return emailCheckResponseSchema.parse(await response.json()).verdict;
}

/**
 * Checagem real via BFF. Fail-open: rede fora, 429 ou 5xx devolvem `accepted` — esta checagem é UX (avisa cedo);
 * quem barra de verdade é o `/api/contact` no envio final.
 * @example const verdict = await requestEmailCheck('ana@mailinator.com') // 'disposable'
 */
export const requestEmailCheck: VerifyEmailAddress = async (email) => {
  try {
    return await postEmailCheck(email);
  } catch {
    return 'accepted';
  }
};
