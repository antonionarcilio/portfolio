'use client';

import { useLayoutEffect, useRef, type RefObject } from 'react';

/** Regras de uma máscara: o que guardar para o texto digitado e o que a caixa mostra para o valor guardado. */
export type MaskRules = {
  /** Valor a guardar; `undefined` recusa a mudança (limitador: o dígito novo passaria do tamanho máximo). */
  toStored: (typed: string) => string | undefined;
  toDisplay: (stored: string) => string;
};

type MaskedInput = {
  inputRef: RefObject<HTMLInputElement | null>;
  display: string;
  change: (typed: string) => void;
};

const countDigits = (text: string): number => text.replace(/\D/g, '').length;

/** Posição do cursor logo depois do `digitCount`-ésimo dígito do texto formatado ("15.0|00" para 3). */
function caretAfterDigits(formatted: string, digitCount: number): number {
  if (digitCount <= 0) return formatted.search(/\d/) === -1 ? formatted.length : formatted.search(/\d/);
  let seen = 0;
  for (let index = 0; index < formatted.length; index += 1) {
    if (/\d/.test(formatted[index] ?? '')) seen += 1;
    if (seen === digitCount) return index + 1;
  }
  return formatted.length;
}

/** Tira o último dígito antes do cursor — o backspace que só apagou um separador apaga o dígito antes dele. */
function withoutDigitBefore(text: string, caret: number): string {
  const index = text.slice(0, caret).search(/\d(?=\D*$)/);
  return index === -1 ? text : text.slice(0, index) + text.slice(index + 1);
}

function restoreCaretLater(input: HTMLInputElement | null, position: number): void {
  if (!input) return;
  requestAnimationFrame(() => input.setSelectionRange(position, position));
}

/**
 * Campo com máscara: a caixa mostra o valor formatado (`toDisplay`) e o valor guardado segue as regras (`toStored`).
 * O cursor fica depois do mesmo dígito em que estava quando separadores aparecem ou somem; apagar um separador
 * apaga o dígito antes dele; letras, símbolos e dígitos recusados pelo limitador são descartados sem mover o cursor.
 * @example const mask = useMaskedInput(value, setValue, { toStored: onlyDigits, toDisplay: format });
 */
export function useMaskedInput(stored: string, onChange: (stored: string) => void, rules: MaskRules): MaskedInput {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const pendingDigitCount = useRef<number | null>(null);
  const display = rules.toDisplay(stored);

  useLayoutEffect(() => {
    const input = inputRef.current;
    const digitCount = pendingDigitCount.current;
    if (!input || digitCount === null || document.activeElement !== input) return;
    pendingDigitCount.current = null;
    const position = caretAfterDigits(display, digitCount);
    input.setSelectionRange(position, position);
  }, [display]);

  const change = (typed: string) => {
    const caret = inputRef.current?.selectionStart ?? typed.length;
    let text = typed;
    let digitsBeforeCaret = countDigits(text.slice(0, caret));
    if (rules.toStored(text) === stored && text.length < display.length && digitsBeforeCaret > 0) {
      text = withoutDigitBefore(text, caret);
      digitsBeforeCaret -= 1;
    }
    const next = rules.toStored(text);
    if (next === undefined || next === stored) {
      const rejectedDigits = Math.max(countDigits(text) - countDigits(display), 0);
      return restoreCaretLater(inputRef.current, caretAfterDigits(display, digitsBeforeCaret - rejectedDigits));
    }
    pendingDigitCount.current = digitsBeforeCaret;
    onChange(next);
  };

  return { inputRef, display, change };
}
