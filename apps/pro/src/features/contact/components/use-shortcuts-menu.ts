'use client';

import { useCallback, useEffect, useId, useRef, useState, type RefObject } from 'react';

export type ShortcutsMenuControls = {
  /** `id` do painel, para o `aria-controls` do botão "/ Atalhos". */
  menuId: string;
  isOpen: boolean;
  triggerRef: RefObject<HTMLButtonElement | null>;
  panelRef: RefObject<HTMLDivElement | null>;
  toggle: () => void;
  /** `restoreFocus` devolve o foco ao botão (Esc, item escolhido); clique fora deixa o foco onde caiu. */
  close: (restoreFocus: boolean) => void;
};

/** Fecha o menu quando o ponteiro desce fora do painel e do botão que o abriu (também no menu de moeda). */
export function useCloseOnOutsidePointer(
  isOpen: boolean,
  elements: readonly RefObject<HTMLElement | null>[],
  onOutside: () => void,
) {
  useEffect(() => {
    if (!isOpen) return;
    const closeIfOutside = (event: PointerEvent) => {
      const target = event.target as Node;
      if (elements.some((element) => element.current?.contains(target))) return;
      onOutside();
    };
    document.addEventListener('pointerdown', closeIfOutside);
    return () => document.removeEventListener('pointerdown', closeIfOutside);
  }, [isOpen, elements, onOutside]);
}

/**
 * Estado do menu de atalhos (G06). Fica preso à etapa em que foi aberto (`scopeKey`): mudar de etapa — ou o
 * compositor sumir (`isAvailable` falso, ex.: "digitando…") — fecha o menu sem efeito extra.
 * @example const shortcuts = useShortcutsMenu(state.currentTarget, Boolean(step) && !isTyping);
 */
export function useShortcutsMenu(scopeKey: string, isAvailable: boolean): ShortcutsMenuControls {
  const menuId = useId();
  const [openScope, setOpenScope] = useState<string | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [elements] = useState(() => [triggerRef, panelRef] as const);
  const isOpen = isAvailable && openScope === scopeKey;

  const close = useCallback((restoreFocus: boolean) => {
    setOpenScope(null);
    if (restoreFocus) triggerRef.current?.focus();
  }, []);
  const closeFromOutside = useCallback(() => close(false), [close]);
  useCloseOnOutsidePointer(isOpen, elements, closeFromOutside);

  const toggle = () => setOpenScope(isOpen ? null : scopeKey);
  return { menuId, isOpen, triggerRef, panelRef, toggle, close };
}
