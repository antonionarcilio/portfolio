import { isChatErrorKey, type ChatErrorKey } from './field-validators';
import type { FieldDefinition, FieldValidator } from './flow-types';

export type FieldErrors = Partial<Record<string, ChatErrorKey>>;

export type FieldsValidationResult = { values: Record<string, string>; errors: FieldErrors };

/** O que vira uma chave em `values`: o próprio campo ou o prefixo de moeda dele. */
type ValueField = { id: string; validator: FieldValidator };

/**
 * Cada valor que os campos guardam: o campo e, quando ele tem prefixo de moeda, a moeda logo depois. O
 * servidor usa a mesma lista para recusar chaves desconhecidas.
 * @example valueFieldsOf([rangeField]).map((field) => field.id) // ['range', 'currency']
 */
export function valueFieldsOf(fields: readonly FieldDefinition[]): ValueField[] {
  return fields.flatMap((field) => (field.currency ? [field, field.currency] : [field]));
}

/**
 * Valida cada campo (e a moeda dele, quando há) com o seu `validator`; devolve os valores normalizados e a primeira falha de cada um.
 * @example validateFields([emailField()], { email: 'x' }).errors.email // 'emailInvalid'
 */
export function validateFields(
  fields: readonly FieldDefinition[],
  draft: Record<string, string>,
): FieldsValidationResult {
  const result: FieldsValidationResult = { values: {}, errors: {} };
  for (const field of valueFieldsOf(fields)) {
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
