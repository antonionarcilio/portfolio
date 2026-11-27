'use client';

import { useState } from 'react';

import { formatPhone, phoneValueOf, type PhoneCountry } from '@/shared/utils/phone-number';

import { useMaskedInput } from './use-masked-input';

/**
 * Máscara do telefone/WhatsApp. O valor guardado é E.164 (`+5511987654321`, o que o servidor valida); a caixa mostra
 * o formato do país de casa enquanto o visitante digita sem "+" ("(11) 98765-4321" no pt-BR, "(415) 555-0132" no
 * en) e o internacional quando ele começa com "+" ("+44 20 7946 0958"). O limitador descarta dígitos além do
 * tamanho que o país permite.
 * @example const mask = usePhoneMask(value, 'BR', setValue); <input ref={mask.inputRef} value={mask.display} />
 */
export function usePhoneMask(stored: string, homeCountry: PhoneCountry, onChange: (stored: string) => void) {
  // Quem digita "+" vê o número no formato internacional até o fim; ao reabrir, o número de casa volta ao nacional.
  const [typesInternational, setTypesInternational] = useState(false);
  const mask = useMaskedInput(stored, onChange, {
    toStored: (typed) => phoneValueOf(typed, homeCountry),
    toDisplay: (value) => formatPhone(value, homeCountry, typesInternational ? 'international' : 'national'),
  });
  const change = (typed: string) => {
    setTypesInternational(typed.trim().startsWith('+'));
    mask.change(typed);
  };
  return { ...mask, change };
}
