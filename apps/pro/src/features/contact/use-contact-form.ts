'use client';

import { useCallback, useState, type FormEvent } from 'react';

import {
  INITIAL_CONTACT_FORM_VALUES,
  validateContactForm,
  type ContactFieldName,
  type ContactFormErrors,
  type ContactFormValues,
} from './contact-form-schema';
import type { ContactSubmissionContext } from './contact-request-schema';
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
 * O token do Turnstile e o honeypot (`website`) acompanham o envio; o widget é remontado
 * (`turnstileWidgetKey`) a cada falha para gerar um token novo.
 * @example const form = useContactForm(sendContactMessage, 'pt-BR');
 */
export function useContactForm(sendMessage: SendContactMessage, locale: ContactSubmissionContext['locale']) {
  const [values, setValues] = useState<ContactFormValues>(INITIAL_CONTACT_FORM_VALUES);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [status, setStatus] = useState<ContactSubmitStatus>('idle');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [turnstileWidgetKey, setTurnstileWidgetKey] = useState(0);
  const [website, setWebsite] = useState('');

  const failSubmission = () => {
    setStatus('failed');
    setTurnstileToken('');
    setTurnstileWidgetKey((previous) => previous + 1);
  };

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

    // Sem token o servidor recusaria; falha já aqui e remonta o widget para tentar de novo.
    if (!turnstileToken) return failSubmission();

    setStatus('submitting');
    try {
      await sendMessage({ ...values, locale, turnstileToken, website });
      setStatus('success');
    } catch {
      failSubmission();
    }
  };

  return {
    values,
    errors,
    status,
    setFieldValue,
    submit,
    setTurnstileToken,
    turnstileWidgetKey,
    website,
    setWebsite,
  };
}

export type ContactFormState = ReturnType<typeof useContactForm>;
