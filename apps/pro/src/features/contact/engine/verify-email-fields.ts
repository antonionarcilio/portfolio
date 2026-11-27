import type { EmailCheckVerdict } from '../email-check-contract';
import type { ChatErrorKey } from './field-validators';
import type { FieldDefinition } from './flow-types';
import type { VerifyEmailAddress } from './request-email-check';
import type { FieldErrors } from './validate-fields';

const ERROR_BY_VERDICT: Record<EmailCheckVerdict, ChatErrorKey | undefined> = {
  accepted: undefined,
  disposable: 'emailDisposable',
  undeliverable: 'emailUndeliverable',
};

/**
 * Segunda etapa da validação, só para campos `email` preenchidos e já aprovados no formato: pergunta ao BFF
 * se o endereço é descartável ou de domínio sem servidor de e-mail. Vazio quando tudo passou.
 * @example await verifyEmailFields(fields, { email: 'ana@mailinator.com' }, requestEmailCheck) // { email: 'emailDisposable' }
 */
export async function verifyEmailFields(
  fields: readonly FieldDefinition[],
  values: Record<string, string>,
  verifyEmail: VerifyEmailAddress,
): Promise<FieldErrors> {
  const emailFields = fields.filter((field) => field.kind === 'email' && values[field.id]);
  const verdicts = await Promise.all(emailFields.map((field) => verifyEmail(values[field.id] ?? '')));
  const errors: FieldErrors = {};
  emailFields.forEach((field, index) => {
    const errorKey = ERROR_BY_VERDICT[verdicts[index] ?? 'accepted'];
    if (errorKey) errors[field.id] = errorKey;
  });
  return errors;
}
