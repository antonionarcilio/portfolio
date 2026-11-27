'use client';

import { useRef } from 'react';

type AutoFocusHandlers = {
  onOpenAutoFocus: () => void;
  onCloseAutoFocus: (event: Event) => void;
};

/**
 * Devolve o foco ao elemento que estava focado quando o diálogo abriu. O Radix só faz isso sozinho com o
 * `Trigger` dele; nossos diálogos são controlados (abertos por um menu, por exemplo), então guardamos o
 * elemento no `onOpenAutoFocus` — antes de o Radix mover o foco — e o restauramos no `onCloseAutoFocus`.
 * @example const returnFocus = useReturnFocus(); <Dialog.Content {...returnFocus}>…</Dialog.Content>
 */
export function useReturnFocus(): AutoFocusHandlers {
  const previousElementRef = useRef<HTMLElement | null>(null);
  return {
    onOpenAutoFocus: () => {
      const active = document.activeElement;
      previousElementRef.current = active instanceof HTMLElement ? active : null;
    },
    onCloseAutoFocus: (event) => {
      event.preventDefault();
      previousElementRef.current?.focus();
    },
  };
}
