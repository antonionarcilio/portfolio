'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import type { FieldDefinition, StepAnswer } from '../engine/flow-types';
import type { VerifyEmailAddress } from '../engine/request-email-check';
import { hasFieldErrors, validateFields, type FieldErrors } from '../engine/validate-fields';
import { verifyEmailFields } from '../engine/verify-email-fields';

type FieldsSubmission = {
  errors: FieldErrors;
  /** Esperando o BFF responder sobre o e-mail: o envio fica desabilitado para não disparar duas vezes. */
  isVerifying: boolean;
  clearError: (fieldId: string) => void;
  submitDraft: (draft: Record<string, string>) => Promise<void>;
};

/** `false` depois que o compositor desmonta (Voltar, Editar): uma resposta do BFF que chega tarde é descartada. */
function useIsMounted(): () => boolean {
  const isMounted = useRef(false);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  return useCallback(() => isMounted.current, []);
}

/**
 * Envio de uma etapa de campos: formato (Zod, síncrono) e, se passar, a checagem de e-mail no BFF.
 * @example const { errors, isVerifying, clearError, submitDraft } = useFieldsSubmission(fields, verifyEmail, onAnswer);
 */
export function useFieldsSubmission(
  fields: readonly FieldDefinition[],
  verifyEmail: VerifyEmailAddress,
  onAnswer: (answer: StepAnswer) => void,
): FieldsSubmission {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isVerifying, setIsVerifying] = useState(false);
  const isMounted = useIsMounted();

  const submitDraft = async (draft: Record<string, string>) => {
    const result = validateFields(fields, draft);
    if (hasFieldErrors(result.errors)) return setErrors(result.errors);
    setIsVerifying(true);
    const emailErrors = await verifyEmailFields(fields, result.values, verifyEmail);
    if (!isMounted()) return;
    setIsVerifying(false);
    if (hasFieldErrors(emailErrors)) setErrors(emailErrors);
    else onAnswer({ type: 'fields', values: result.values });
  };

  const clearError = (fieldId: string) => setErrors((current) => ({ ...current, [fieldId]: undefined }));
  return { errors, isVerifying, clearError, submitDraft };
}
