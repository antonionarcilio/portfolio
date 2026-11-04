'use client';
import { useEffect, useState } from 'react';

import { ISLAND_CARD_HIDE_DELAY_MILLISECONDS, ISLAND_CARD_REVEAL_DELAY_MILLISECONDS } from './animations';

type IslandSequence = {
  /** O container mostra as abas de ferramentas (e não o menu de páginas). */
  isToolsBarShown: boolean;
  /** O cartão com a lista está visível abaixo do container. */
  isCardShown: boolean;
};

/**
 * Orquestra a abertura/fechamento da ilha em duas etapas:
 * abrir  → o container troca o menu pelas abas e ajusta a largura; só depois o cartão aparece;
 * fechar → o cartão some primeiro; só depois o container volta ao menu.
 * O atraso de cada etapa vem de `animations.ts`, a mesma fonte das durações animadas.
 * @example const { isToolsBarShown, isCardShown } = useIslandSequence(activeTab !== null);
 */
export function useIslandSequence(isOpen: boolean): IslandSequence {
  const [isToolsBarShown, setIsToolsBarShown] = useState(false);
  const [isCardShown, setIsCardShown] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsToolsBarShown(true);
      const revealTimer = setTimeout(() => setIsCardShown(true), ISLAND_CARD_REVEAL_DELAY_MILLISECONDS);
      return () => clearTimeout(revealTimer);
    }
    setIsCardShown(false);
    const hideTimer = setTimeout(() => setIsToolsBarShown(false), ISLAND_CARD_HIDE_DELAY_MILLISECONDS);
    return () => clearTimeout(hideTimer);
  }, [isOpen]);

  return { isToolsBarShown, isCardShown };
}
