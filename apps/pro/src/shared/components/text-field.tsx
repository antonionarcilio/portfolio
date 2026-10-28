'use client';

import { useId } from 'react';

import { FieldFrame } from '@/shared/components/field-frame';
import { fieldBoxVariants } from '@/shared/variants/field-box-variants';

type TextFieldProps = {
  name: string;
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email';
  autoComplete?: string;
  required?: boolean;
  hint?: string;
  errorMessage?: string;
};

/**
 * Campo de uma linha do Figma (`text-field`). `errorMessage` ativa o estado de erro e é lido por
 * leitores de tela via `aria-describedby`.
 * @example <TextField name="name" label="Seu nome" value={name} placeholder="Como podemos chamar você?" onChange={setName} required />
 */
export function TextField({
  name,
  label,
  value,
  placeholder,
  onChange,
  type = 'text',
  autoComplete,
  required = false,
  hint,
  errorMessage,
}: TextFieldProps) {
  const inputId = useId();
  const hintId = `${inputId}-hint`;
  const hasHint = Boolean(hint ?? errorMessage);

  return (
    <FieldFrame
      label={{ text: label, htmlFor: inputId, required }}
      hintId={hintId}
      hint={hint}
      errorMessage={errorMessage}
    >
      <input
        id={inputId}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        aria-invalid={errorMessage ? true : undefined}
        aria-describedby={hasHint ? hintId : undefined}
        onChange={(event) => onChange(event.target.value)}
        className={fieldBoxVariants({ status: errorMessage ? 'error' : 'regular' })}
      />
    </FieldFrame>
  );
}
