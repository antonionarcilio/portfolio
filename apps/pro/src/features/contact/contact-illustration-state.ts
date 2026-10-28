import type { StaticImageData } from 'next/image';

import jobApplicationIllustration from '@/_assets/illustrations/n105-job-application.svg';
import sleepingIllustration from '@/_assets/illustrations/n81-sleeping.svg';
import envelopeIllustration from '@/_assets/illustrations/n90-envelope.svg';

import { INITIAL_CONTACT_FORM_VALUES, type ContactFieldName, type ContactFormValues } from './contact-form-schema';

export type ContactIllustrationState = 'empty' | 'filling' | 'submitted';

/**
 * Ilustração de cada estado da coluna 1 (frames do Figma: `empty-form` 6097:14535,
 * `not-empty-form` 6119:2918 e `filled-form` 6102:9639).
 */
export const CONTACT_ILLUSTRATIONS: Record<ContactIllustrationState, StaticImageData> = {
  empty: sleepingIllustration,
  filling: jobApplicationIllustration,
  submitted: envelopeIllustration,
};

/** O consentimento já vem marcado e é só um aceite: marcar ou desmarcar não muda a ilustração. */
const FIELDS_IGNORED_BY_ILLUSTRATION: ContactFieldName[] = ['consent'];

/** Compara com os valores iniciais, ignorando os campos que não contam como "preenchido". */
function hasAnyValue(values: ContactFormValues): boolean {
  const fields = Object.keys(INITIAL_CONTACT_FORM_VALUES) as ContactFieldName[];
  return fields
    .filter((field) => !FIELDS_IGNORED_BY_ILLUSTRATION.includes(field))
    .some((field) => values[field] !== INITIAL_CONTACT_FORM_VALUES[field]);
}

/**
 * Escolhe a ilustração: sucesso do envio > pelo menos um campo preenchido > formulário vazio.
 * @example resolveContactIllustrationState(values, false) // 'filling' se `values.name !== ''`
 */
export function resolveContactIllustrationState(
  values: ContactFormValues,
  isSubmitted: boolean,
): ContactIllustrationState {
  if (isSubmitted) return 'submitted';
  return hasAnyValue(values) ? 'filling' : 'empty';
}
