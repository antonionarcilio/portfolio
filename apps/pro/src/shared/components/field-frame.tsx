import { cva, type VariantProps } from 'class-variance-authority';
import type { ReactNode } from 'react';

import { FieldHint } from '@/shared/components/field-hint';
import { ScrambleText } from '@/shared/components/scramble-text';

/**
 * Rótulo do campo. `uppercase` é o `label-caps` do formulário original; `sentence` é o rótulo do chat de
 * contato (mesmo peso e tracking, em caixa normal — ex.: "Como posso te chamar?").
 */
const fieldLabelVariants = cva(
  'flex items-center gap-[2px] font-portfolio text-sm font-semibold tracking-[0.56px] text-alpha-black-60',
  {
    variants: { casing: { uppercase: 'uppercase', sentence: '' } },
    defaultVariants: { casing: 'uppercase' },
  },
);

type FieldLabelProps = VariantProps<typeof fieldLabelVariants> & {
  text: string;
  id?: string;
  htmlFor?: string;
  required?: boolean;
  /** Texto "(opcional)" ao lado do rótulo; só aparece quando o campo não é obrigatório. */
  optionalText?: string;
};

/** Rótulo; o asterisco vermelho marca os campos obrigatórios e `optionalText` marca os opcionais. */
export function FieldLabel({ text, id, htmlFor, required = false, optionalText, casing }: FieldLabelProps) {
  const Element = htmlFor ? 'label' : 'p';

  return (
    <Element id={id} htmlFor={htmlFor} className={fieldLabelVariants({ casing })}>
      <ScrambleText>{text}</ScrambleText>
      {required && (
        <span aria-hidden className="text-red-500">
          *
        </span>
      )}
      {!required && optionalText && (
        <span className="ml-[2px] text-xs font-regular tracking-normal normal-case text-alpha-black-60">
          <ScrambleText>{optionalText}</ScrambleText>
        </span>
      )}
    </Element>
  );
}

type FieldFrameProps = {
  label: FieldLabelProps;
  hintId: string;
  hint?: string;
  errorMessage?: string;
  children: ReactNode;
};

/**
 * Rótulo + controle + texto de apoio. Com erro, o texto de apoio dá lugar à mensagem de erro
 * (em vermelho), que é o que explica o porquê da borda vermelha.
 * @example <FieldFrame label={{ text: 'Email', htmlFor: id, required: true }} hintId={hintId}>…</FieldFrame>
 */
export function FieldFrame({ label, hintId, hint, errorMessage, children }: FieldFrameProps) {
  const hintText = errorMessage ?? hint;

  return (
    <div className="group flex w-full flex-col gap-[6px]">
      <FieldLabel {...label} />
      {children}
      {hintText && <FieldHint id={hintId} text={hintText} status={errorMessage ? 'error' : 'regular'} />}
    </div>
  );
}
