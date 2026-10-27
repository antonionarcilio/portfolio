'use client';
import { useLayoutEffect, useRef, useState } from 'react';

export type PillGeometry = { left: number; width: number };

/**
 * Mede a pílula do item ativo depois do layout e a cada resize. Usa `offsetLeft`/`offsetWidth`
 * (e não `getBoundingClientRect`) porque eles ignoram transforms: o painel de ferramentas entra
 * com `scale`, e medir no meio da animação deixaria a pílula ~3% fora do lugar.
 * Pré-requisito: o container dos itens é `relative` (é o `offsetParent` deles).
 * @example const { itemRefs, pill } = usePillGeometry(activeIndex);
 */
export function usePillGeometry(activeIndex: number) {
  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  const [pill, setPill] = useState<PillGeometry | null>(null);

  useLayoutEffect(() => {
    const measure = () => {
      const item = itemRefs.current[activeIndex];
      if (!item) return setPill(null);
      setPill({ left: item.offsetLeft, width: item.offsetWidth });
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [activeIndex]);

  return { itemRefs, pill };
}
