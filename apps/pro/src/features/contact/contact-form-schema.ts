import { z } from 'zod';

import { CONTACT_OPTION_KEYS, type ContactOptionGroup } from './contact-options';
import { containsInjectionPattern, containsLink, containsMarkup, normalizeContactText } from './contact-text-sanitizer';

/** Chaves de `pro.contactPage.errors` — o schema devolve a chave, o componente traduz. */
export const CONTACT_ERROR_KEYS = [
  'nameRequired',
  'emailRequired',
  'emailInvalid',
  'projectDescriptionRequired',
  'budgetRequired',
  'budgetInvalid',
  'budgetRangeInverted',
  'consentRequired',
  'nameInvalid',
  'linksNotAllowed',
  'contentNotAllowed',
  'projectDescriptionTooLong',
] as const;

export type ContactErrorKey = (typeof CONTACT_ERROR_KEYS)[number];

export type ContactFieldName = keyof ContactFormValues;

/**
 * Valor monetário digitado em reais, no formato brasileiro ("1.000,00") ou simples ("1000.5").
 * Devolve `NaN` quando o texto não é um número positivo.
 * @example parseBudgetAmount('4.500,00') // 4500
 */
export function parseBudgetAmount(text: string): number {
  const normalized = text.includes(',') ? text.replace(/\./g, '').replace(',', '.') : text;
  const amount = Number(normalized);
  return Number.isFinite(amount) && amount > 0 ? amount : Number.NaN;
}

function addBudgetIssues(values: { budgetMinimum: string; budgetMaximum: string }, context: z.RefinementCtx): void {
  const minimum = parseBudgetAmount(values.budgetMinimum);
  const maximum = parseBudgetAmount(values.budgetMaximum);
  const invalid: ContactErrorKey = 'budgetInvalid';

  if (values.budgetMinimum && Number.isNaN(minimum)) {
    context.addIssue({ code: 'custom', path: ['budgetMinimum'], message: invalid });
  }
  if (values.budgetMaximum && Number.isNaN(maximum)) {
    context.addIssue({ code: 'custom', path: ['budgetMaximum'], message: invalid });
  }
  if (minimum > maximum) {
    const inverted: ContactErrorKey = 'budgetRangeInverted';
    context.addIssue({ code: 'custom', path: ['budgetMaximum'], message: inverted });
  }
}

const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;
const MAX_DESCRIPTION_LENGTH = 2000;
const MAX_BUDGET_LENGTH = 15;
/** Letras de qualquer idioma (com acento), espaço, apóstrofo, ponto e hífen — "D'Ávila", "Jr.", "Ana-Maria". */
const NAME_PATTERN = /^[\p{L}\p{M}][\p{L}\p{M}' .-]*$/u;
const BUDGET_PATTERN = /^[0-9.,]+$/;

const requiredText = (errorKey: ContactErrorKey) =>
  z.string().transform(normalizeContactText).pipe(z.string().min(1, errorKey));

function addUnsafeContentIssues(text: string, context: z.RefinementCtx): void {
  const unsafeKey: ContactErrorKey | null = containsLink(text)
    ? 'linksNotAllowed'
    : containsMarkup(text) || containsInjectionPattern(text)
      ? 'contentNotAllowed'
      : null;
  if (unsafeKey) context.addIssue({ code: 'custom', message: unsafeKey });
}

/** Texto obrigatório, normalizado, com teto de tamanho e sem links, marcação nem padrões de injeção. */
const safeText = (requiredKey: ContactErrorKey, maxLength: number, tooLongKey: ContactErrorKey) =>
  requiredText(requiredKey).pipe(z.string().max(maxLength, tooLongKey).superRefine(addUnsafeContentIssues));

/** Escolha de um scroller: vazia ou exatamente uma das chaves cadastradas — nunca texto livre. */
const optionChoice = (group: ContactOptionGroup) =>
  z.string().refine((value) => value === '' || (CONTACT_OPTION_KEYS[group] as readonly string[]).includes(value), {
    message: 'contentNotAllowed' satisfies ContactErrorKey,
  });

const budgetText = requiredText('budgetRequired').pipe(
  z.string().max(MAX_BUDGET_LENGTH, 'budgetInvalid').regex(BUDGET_PATTERN, 'budgetInvalid'),
);

/**
 * Obrigatórios: nome, e-mail, descrição do projeto, orçamento (mínimo e máximo) e consentimento. As escolhas
 * dos scrollers são opcionais. O consentimento também é obrigatório e já vem marcado.
 */
export const contactFormSchema = z
  .object({
    name: requiredText('nameRequired').pipe(
      z.string().max(MAX_NAME_LENGTH, 'nameInvalid').regex(NAME_PATTERN, 'nameInvalid'),
    ),
    email: requiredText('emailRequired').pipe(
      z.string().max(MAX_EMAIL_LENGTH, 'emailInvalid').pipe(z.email('emailInvalid')),
    ),
    help: optionChoice('help'),
    projectType: optionChoice('projectType'),
    technology: optionChoice('technology'),
    deadline: optionChoice('deadline'),
    projectDescription: safeText('projectDescriptionRequired', MAX_DESCRIPTION_LENGTH, 'projectDescriptionTooLong'),
    budgetMinimum: budgetText,
    budgetMaximum: budgetText,
    consent: z.boolean().refine((isChecked) => isChecked, 'consentRequired'),
  })
  .superRefine(addBudgetIssues);

export type ContactFormValues = z.infer<typeof contactFormSchema>;

export const INITIAL_CONTACT_FORM_VALUES: ContactFormValues = {
  name: '',
  email: '',
  help: '',
  projectType: '',
  technology: '',
  deadline: '',
  projectDescription: '',
  budgetMinimum: '',
  budgetMaximum: '',
  consent: true,
};

export type ContactFormErrors = Partial<Record<ContactFieldName, ContactErrorKey>>;

function isContactErrorKey(message: string): message is ContactErrorKey {
  return (CONTACT_ERROR_KEYS as readonly string[]).includes(message);
}

/**
 * Valida os valores e devolve um erro por campo (o primeiro de cada um); vazio quando válido.
 * @example validateContactForm({ ...INITIAL_CONTACT_FORM_VALUES, name: '' }).name // 'nameRequired'
 */
export function validateContactForm(values: ContactFormValues): ContactFormErrors {
  const result = contactFormSchema.safeParse(values);
  if (result.success) return {};

  const errors: ContactFormErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as ContactFieldName;
    if (errors[field] || !isContactErrorKey(issue.message)) continue;
    errors[field] = issue.message;
  }
  return errors;
}
