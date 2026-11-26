import { isChatErrorKey, type ChatErrorKey } from './field-validators';
import type { FieldDefinition } from './flow-types';

export type FieldErrors = Partial<Record<string, ChatErrorKey>>;

export type FieldsValidationResult = { values: Record<string, string>; errors: FieldErrors };

/**
 * Valida cada campo com o seu `validator`; devolve os valores normalizados e a primeira falha de cada um.
 * @example validateFields([emailField()], { email: 'x' }).errors.email // 'emailInvalid'
 */
export function validateFields(
  fields: readonly FieldDefinition[],
  draft: Record<string, string>,
): FieldsValidationResult {
  const result: FieldsValidationResult = { values: {}, errors: {} };
  for (const field of fields) {
    const parsed = field.validator.safeParse(draft[field.id] ?? '');
    if (parsed.success) result.values[field.id] = parsed.data;
    else {
      const message = parsed.error.issues[0]?.message ?? '';
      result.errors[field.id] = isChatErrorKey(message) ? message : 'contentNotAllowed';
    }
  }
  return result;
}

/** `true` quando algum campo falhou na validação. */
export function hasFieldErrors(errors: FieldErrors): boolean {
  return Object.values(errors).some(Boolean);
}
