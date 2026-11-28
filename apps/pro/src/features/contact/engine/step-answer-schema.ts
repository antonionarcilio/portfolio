import { z } from 'zod';

/** Ids de etapa, campo e opção são curtos ("project.deadline"); o teto barra chaves gigantes no payload. */
const MAXIMUM_IDENTIFIER_LENGTH = 64;
/** Maior campo dos fluxos (URL, 2048) com folga; o limite real de cada campo é o `validator` dele. */
const MAXIMUM_VALUE_LENGTH = 2_100;
/** A etapa com mais campos tem 3; acima disso o payload foi montado à mão. */
const MAXIMUM_FIELDS_PER_STEP = 8;

const identifierSchema = z.string().min(1).max(MAXIMUM_IDENTIFIER_LENGTH);

const fieldValuesSchema = z
  .record(identifierSchema, z.string().max(MAXIMUM_VALUE_LENGTH))
  .refine((values) => Object.keys(values).length <= MAXIMUM_FIELDS_PER_STEP, 'tooManyFields');

/**
 * Resposta de uma etapa, estrita (chave a mais = inválida). Usada no sessionStorage e no POST de
 * `/api/contact`; a estrutura passa aqui, o conteúdo de cada campo é validado contra o fluxo
 * (`validate-contact-submission.ts`).
 */
export const stepAnswerSchema = z.discriminatedUnion('type', [
  z.strictObject({ type: z.literal('option'), optionId: identifierSchema, values: fieldValuesSchema.optional() }),
  z.strictObject({ type: z.literal('fields'), values: fieldValuesSchema }),
  z.strictObject({ type: z.literal('skipped') }),
]);

/** `"<flowId>.<stepId>"`. */
export const stepKeySchema = z.custom<`${string}.${string}`>(
  (value) => typeof value === 'string' && value.length <= MAXIMUM_IDENTIFIER_LENGTH * 2 && value.includes('.'),
);
