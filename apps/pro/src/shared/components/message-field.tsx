'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { useId, type ComponentProps } from 'react';

import { FieldFrame } from '@/shared/components/field-frame';
import { fieldBoxVariants } from '@/shared/variants/field-box-variants';

type FieldLabelCasing = NonNullable<ComponentProps<typeof FieldFrame>['label']['casing']>;

/**
 * Altura mínima da caixa: `regular` 68px (formulário original), `tall` 112px (área de texto do chat de
 * contato). Nos dois, cresce com o texto até 6 linhas — `6lh` acompanha o line-height real e os 30px são o
 * padding vertical (2 × 14px) mais a borda (2 × 1px). `overflow-y-auto!` vence o `overflow-hidden` da caixa.
 */
const messageBoxVariants = cva('max-h-[calc(6lh+30px)] resize-none overflow-y-auto! field-sizing-content', {
  variants: { height: { regular: 'min-h-[68px]', tall: 'min-h-[112px]' } },
  defaultVariants: { height: 'regular' },
});

type MessageFieldProps = VariantProps<typeof messageBoxVariants> & {
  name: string;
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  required?: boolean;
  hint?: string;
  errorMessage?: string;
  labelCasing?: FieldLabelCasing;
  optionalText?: string;
  autoFocus?: boolean;
  /** Igual ao teto do schema que valida o campo. */
  maxLength?: number;
  /** Bloqueia a edição sem tirar o campo do foco nem da leitura (ex.: enquanto o valor é verificado). */
  readOnly?: boolean;
};

/**
 * Campo de várias linhas do Figma (`message-field`), sem alça de redimensionamento.
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
  labelCasing,
  optionalText,
  autoFocus,
  height,
  maxLength,
  readOnly,
}: MessageFieldProps) {
  const textareaId = useId();
  const hintId = `${textareaId}-hint`;
  const hasHint = Boolean(hint ?? errorMessage);

  return (
    <FieldFrame
      label={{ text: label, htmlFor: textareaId, required, casing: labelCasing, optionalText }}
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
        autoFocus={autoFocus}
        maxLength={maxLength}
        readOnly={readOnly}
        aria-busy={readOnly || undefined}
        aria-invalid={errorMessage ? true : undefined}
        aria-describedby={hasHint ? hintId : undefined}
        onChange={(event) => onChange(event.target.value)}
        className={`${fieldBoxVariants({ status: errorMessage ? 'error' : 'regular' })} ${messageBoxVariants({ height })}`}
      />
    </FieldFrame>
  );
}
