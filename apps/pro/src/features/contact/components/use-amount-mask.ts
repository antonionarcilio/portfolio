'use client';

import { formatAmount, type CurrencyCode } from '../engine/field-validators';
import { useMaskedInput } from './use-masked-input';

/** Só dígitos, sem zero à esquerda — o mesmo formato que o validador `budgetAmount` aceita. */
const toDigits = (text: string): string => text.replace(/\D/g, '').replace(/^0+/, '');

/** `maxLength` do HTML para o texto formatado: os dígitos mais um separador a cada três. */
export const amountDisplayLength = (maximumDigits: number): number =>
  maximumDigits + Math.floor((maximumDigits - 1) / 3);

/**
 * Máscara do campo de valor: a caixa mostra os milhares separados conforme a moeda ("15.000" em real, "15,000" em
 * dólar), mas o valor guardado (e validado no servidor) continua só com dígitos; o limitador para em
 * `maximumDigits` dígitos.
 * @example const mask = useAmountMask('15000', 'BRL', 12, setDigits); <input ref={mask.inputRef} value={mask.display} />
 */
export function useAmountMask(
  digits: string,
  currency: CurrencyCode,
  maximumDigits: number,
  onChange: (digits: string) => void,
) {
  return useMaskedInput(digits, onChange, {
    toStored: (typed) => {
      const next = toDigits(typed);
      return next.length > maximumDigits ? undefined : next;
    },
    toDisplay: (stored) => (stored ? formatAmount(stored, currency) : ''),
  });
}
