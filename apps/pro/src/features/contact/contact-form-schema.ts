import { z } from 'zod';

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

const requiredText = (errorKey: ContactErrorKey) => z.string().trim().min(1, errorKey);

/**
 * Obrigatórios: nome, e-mail, descrição do projeto, orçamento (mínimo e máximo) e consentimento. As escolhas
 * dos scrollers são opcionais. O consentimento também é obrigatório e já vem marcado.
 */
export const contactFormSchema = z
  .object({
    name: requiredText('nameRequired'),
    email: requiredText('emailRequired').pipe(z.email('emailInvalid')),
    help: z.string(),
    projectType: z.string(),
    technology: z.string(),
    deadline: z.string(),
    projectDescription: requiredText('projectDescriptionRequired'),
    budgetMinimum: requiredText('budgetRequired'),
    budgetMaximum: requiredText('budgetRequired'),
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
