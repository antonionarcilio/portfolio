import type { ReactNode } from 'react';

import { FieldHint } from '@/shared/components/field-hint';
import { ScrambleText } from '@/shared/components/scramble-text';

type FieldLabelProps = {
  text: string;
  id?: string;
  htmlFor?: string;
  required?: boolean;
};

/** Rótulo em caixa-alta; o asterisco vermelho marca os campos obrigatórios. */
export function FieldLabel({ text, id, htmlFor, required = false }: FieldLabelProps) {
  const Element = htmlFor ? 'label' : 'p';

  return (
    <Element
      id={id}
      htmlFor={htmlFor}
      className="flex items-center gap-[2px] font-portfolio text-sm font-semibold tracking-[0.56px] text-alpha-black-60 uppercase"
    >
      <ScrambleText>{text}</ScrambleText>
      {required && (
        <span aria-hidden className="text-red-500">
          *
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
