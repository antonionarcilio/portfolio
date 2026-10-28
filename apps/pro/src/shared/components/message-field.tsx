'use client';

import { useId } from 'react';

import { FieldFrame } from '@/shared/components/field-frame';
import { fieldBoxVariants } from '@/shared/variants/field-box-variants';

type MessageFieldProps = {
  name: string;
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  required?: boolean;
  hint?: string;
  errorMessage?: string;
};

/**
 * Campo de várias linhas do Figma (`message-field`): altura mínima de 68px que cresce com o
 * texto (`field-sizing-content`), sem alça de redimensionamento.
 * @example <MessageField name="projectDescription" label="Conte-me sobre seu projeto" value={text} placeholder="Contexto…" onChange={setText} required />
 */
export function MessageField({
  name,
  label,
  value,
  placeholder,
  onChange,
  required = false,
  hint,
  errorMessage,
}: MessageFieldProps) {
  const textareaId = useId();
  const hintId = `${textareaId}-hint`;
  const hasHint = Boolean(hint ?? errorMessage);

  return (
    <FieldFrame
      label={{ text: label, htmlFor: textareaId, required }}
      hintId={hintId}
      hint={hint}
      errorMessage={errorMessage}
    >
      <textarea
        id={textareaId}
        name={name}
        value={value}
        placeholder={placeholder}
        required={required}
        aria-invalid={errorMessage ? true : undefined}
        aria-describedby={hasHint ? hintId : undefined}
        onChange={(event) => onChange(event.target.value)}
        className={`${fieldBoxVariants({ status: errorMessage ? 'error' : 'regular' })} min-h-[68px] resize-none field-sizing-content`}
      />
    </FieldFrame>
  );
}
