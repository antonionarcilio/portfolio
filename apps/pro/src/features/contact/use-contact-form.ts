'use client';

import { useCallback, useState, type FormEvent } from 'react';

import {
  INITIAL_CONTACT_FORM_VALUES,
  validateContactForm,
  type ContactFieldName,
  type ContactFormErrors,
  type ContactFormValues,
} from './contact-form-schema';
import type { SendContactMessage } from './send-contact-message';

export type ContactSubmitStatus = 'idle' | 'submitting' | 'success' | 'failed';

/** Ordem visual dos campos obrigatórios — o primeiro inválido recebe o foco. */
const REQUIRED_FIELD_ORDER: ContactFieldName[] = [
  'name',
  'email',
  'projectDescription',
  'budgetMinimum',
  'budgetMaximum',
  'consent',
];

function focusFirstInvalidField(form: HTMLFormElement, errors: ContactFormErrors): void {
  const firstInvalidField = REQUIRED_FIELD_ORDER.find((field) => errors[field]);
  if (!firstInvalidField) return;
  (form.elements.namedItem(firstInvalidField) as HTMLElement | null)?.focus();
}

/**
 * Estado, validação (Zod) e envio do formulário de contato. O envio é injetado para a página
 * não depender de um backend específico.
 * @example const form = useContactForm(sendContactMessage);
 */
export function useContactForm(sendMessage: SendContactMessage) {
  const [values, setValues] = useState<ContactFormValues>(INITIAL_CONTACT_FORM_VALUES);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [status, setStatus] = useState<ContactSubmitStatus>('idle');

  const setFieldValue = useCallback(<Field extends ContactFieldName>(field: Field, value: ContactFormValues[Field]) => {
    setValues((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: undefined }));
    setStatus((previous) => (previous === 'failed' ? 'idle' : previous));
  }, []);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === 'submitting' || status === 'success') return;

    const nextErrors = validateContactForm(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return focusFirstInvalidField(event.currentTarget, nextErrors);

    setStatus('submitting');
    try {
      await sendMessage(values);
      setStatus('success');
    } catch {
      setStatus('failed');
    }
  };

  return { values, errors, status, setFieldValue, submit };
}

export type ContactFormState = ReturnType<typeof useContactForm>;
