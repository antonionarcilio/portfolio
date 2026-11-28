'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { useEffect, useId, useRef, useState, type ComponentProps, type KeyboardEvent, type RefObject } from 'react';

import { FieldFrame } from '@/shared/components/field-frame';
import { OverlayScrollArea } from '@/shared/components/overlay-scroll-area';
import { fieldBoxVariants } from '@/shared/variants/field-box-variants';

type FieldLabelCasing = NonNullable<ComponentProps<typeof FieldFrame>['label']['casing']>;

/**
 * A `textarea` cresce com o texto (`field-sizing-content`) e não rola sozinha: quem rola é a `OverlayScrollArea`
 * em volta (a lib não aceita `textarea` direto), com a scrollbar sobreposta do app. Altura mínima sem a borda de
 * 1px da caixa: `regular` 66px (68 com borda, formulário original), `tall` 110px (112, área de texto do chat).
 * Sem `field-sizing` (Firefox), a `textarea` fica na altura mínima e rola sozinha (`overflow-y-auto`).
 */
const messageTextVariants = cva(
  'block w-full resize-none overflow-y-auto bg-transparent px-lg py-[14px] field-sizing-content placeholder:text-alpha-black-40 focus-visible:outline-none',
  {
    variants: { height: { regular: 'min-h-[66px]', tall: 'min-h-[110px]' } },
    defaultVariants: { height: 'regular' },
  },
);

/**
 * Até 6 linhas visíveis — `6lh` acompanha o line-height real — mais o padding vertical da `textarea` (2 × 14px).
 * `fadeBottom`: enquanto há texto abaixo da área visível, os últimos 24px (`2xl`) esmaecem até sumir, sinal de que
 * há mais conteúdo. É máscara (transparência sobre o fundo real da caixa, em qualquer tema), aplicada no viewport
 * que rola e não no host, para a scrollbar sobreposta não esmaecer junto.
 */
const messageScrollVariants = cva('w-full max-h-[calc(6lh+28px)]', {
  variants: {
    fadeBottom: {
      true: '[&_[data-overlayscrollbars-viewport]]:mask-b-from-[calc(100%-var(--spacing-2xl))]',
      false: '',
    },
  },
  defaultVariants: { fadeBottom: false },
});

type MessageFieldProps = VariantProps<typeof messageTextVariants> & {
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
 * Quem rola é a área em volta, não a `textarea`: ao digitar no fim do texto, desce até o fim para o cursor não
 * sumir abaixo da sexta linha.
 */
function useFollowCaret(
  textareaRef: RefObject<HTMLTextAreaElement | null>,
  viewportRef: RefObject<HTMLElement | null>,
  value: string,
) {
  useEffect(() => {
    const textarea = textareaRef.current;
    const viewport = viewportRef.current;
    if (!textarea || !viewport || document.activeElement !== textarea) return;
    if (textarea.selectionEnd === textarea.value.length) viewport.scrollTop = viewport.scrollHeight;
  }, [value, textareaRef, viewportRef]);
}

/**
 * Enter envia o formulário do campo; Shift+Enter quebra a linha. Não envia enquanto um IME compõe texto (acentos,
 * teclados asiáticos: o Enter confirma a composição) e, como nos campos de uma linha, respeita o botão de enviar
 * desabilitado — sem ele, Enter não envia.
 */
function submitOnEnter(event: KeyboardEvent<HTMLTextAreaElement>): void {
  if (event.key !== 'Enter' || event.shiftKey || event.nativeEvent.isComposing) return;
  event.preventDefault();
  const form = event.currentTarget.form;
  const submitButton = form?.querySelector<HTMLButtonElement>('button[type="submit"]');
  if (form && !submitButton?.disabled) form.requestSubmit();
}

/**
 * Campo de várias linhas do Figma (`message-field`), sem alça de redimensionamento. A caixa (borda, fundo, foco)
 * fica no contêiner; acima de 6 linhas o texto rola com a scrollbar sobreposta (`OverlayScrollArea`). Enter envia o
 * formulário e Shift+Enter quebra a linha.
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
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const viewportRef = useRef<HTMLElement | null>(null);
  const [hasContentBelow, setHasContentBelow] = useState(false);
  useFollowCaret(textareaRef, viewportRef, value);

  return (
    <FieldFrame
      label={{ text: label, htmlFor: textareaId, required, casing: labelCasing, optionalText }}
      hintId={hintId}
      hint={hint}
      errorMessage={errorMessage}
    >
      <div className={fieldBoxVariants({ status: errorMessage ? 'error' : 'regular', padded: false })}>
        <OverlayScrollArea
          className={messageScrollVariants({ fadeBottom: hasContentBelow })}
          viewportRef={viewportRef}
          onScrollEdgesChange={(edges) => setHasContentBelow(edges.hasContentBelow)}
        >
          <textarea
            ref={textareaRef}
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
            onKeyDown={submitOnEnter}
            className={messageTextVariants({ height })}
          />
        </OverlayScrollArea>
      </div>
    </FieldFrame>
  );
}
