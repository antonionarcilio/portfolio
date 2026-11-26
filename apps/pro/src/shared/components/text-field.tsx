'use client';

import Image, { type StaticImageData } from 'next/image';
import { useId, type ComponentProps, type ReactNode } from 'react';

import { FieldFrame } from '@/shared/components/field-frame';
import { fieldBoxVariants } from '@/shared/variants/field-box-variants';

type FieldLabelCasing = NonNullable<ComponentProps<typeof FieldFrame>['label']['casing']>;

type TextFieldProps = {
  name: string;
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'url' | 'tel';
  autoComplete?: string;
  required?: boolean;
  hint?: string;
  errorMessage?: string;
  /** Ícone de 16px à esquerda, dentro da caixa (campos do chat de contato). */
  icon?: StaticImageData;
  /** Controle à esquerda, dentro da caixa e antes do texto (ex.: seletor de moeda do chat de contato). */
  prefix?: ReactNode;
  labelCasing?: FieldLabelCasing;
  /** "(opcional)" ao lado do rótulo quando `required` é falso. */
  optionalText?: string;
  autoFocus?: boolean;
  /** Igual ao teto do schema que valida o campo. */
  maxLength?: number;
  /** Bloqueia a edição sem tirar o campo do foco nem da leitura (ex.: enquanto o valor é verificado). */
  readOnly?: boolean;
};

const INPUT_MODE_BY_TYPE = { text: 'text', email: 'email', url: 'url', tel: 'tel' } as const;

/**
 * Campo de uma linha do Figma (`text-field`). `errorMessage` ativa o estado de erro e é lido por
 * leitores de tela via `aria-describedby`. Com `icon` ou `prefix`, a caixa vira um wrapper (`focus-within`
 * cobre o foco) e o `input` fica transparente ao lado deles.
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
  icon,
  prefix,
  labelCasing,
  optionalText,
  autoFocus,
  maxLength,
  readOnly,
}: TextFieldProps) {
  const inputId = useId();
  const hintId = `${inputId}-hint`;
  const hasHint = Boolean(hint ?? errorMessage);
  const hasLeading = Boolean(icon ?? prefix);
  const boxClass = fieldBoxVariants({ status: errorMessage ? 'error' : 'regular', withIcon: hasLeading });

  const input = (
    <input
      id={inputId}
      name={name}
      type={type}
      inputMode={INPUT_MODE_BY_TYPE[type]}
      value={value}
      placeholder={placeholder}
      autoComplete={autoComplete}
      required={required}
      autoFocus={autoFocus}
      maxLength={maxLength}
      readOnly={readOnly}
      aria-busy={readOnly || undefined}
      aria-invalid={errorMessage ? true : undefined}
      aria-describedby={hasHint ? hintId : undefined}
      onChange={(event) => onChange(event.target.value)}
      className={
        hasLeading
          ? 'min-w-0 flex-1 bg-transparent placeholder:text-alpha-black-40 focus-visible:outline-none'
          : boxClass
      }
    />
  );

  return (
    <FieldFrame
      label={{ text: label, htmlFor: inputId, required, casing: labelCasing, optionalText }}
      hintId={hintId}
      hint={hint}
      errorMessage={errorMessage}
    >
      {hasLeading ? (
        <div className={boxClass}>
          {prefix}
          {icon && <Image src={icon} alt="" aria-hidden width={16} height={16} className="shrink-0 opacity-60" />}
          {input}
        </div>
      ) : (
        input
      )}
    </FieldFrame>
  );
}
