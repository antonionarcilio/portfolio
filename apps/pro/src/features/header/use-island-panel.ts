'use client';
import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';

export type ToolsTab = 'visuals' | 'accessibility' | 'languages';

type IslandPanel = {
  activeTab: ToolsTab | null;
  openTab: (tab: ToolsTab) => void;
  closePanel: () => void;
};

/**
 * Estado do painel de ferramentas da ilha. `null` = painel fechado (a ilha mostra o menu).
 * Fecha com clique fora de `containerRef` ou Escape, e devolve o foco ao botão que abriu —
 * sem isso o foco cairia no <body> ao fechar pelo teclado.
 * @example const { activeTab, openTab } = useIslandPanel(islandRef); openTab('accessibility');
 */
export function useIslandPanel(containerRef: RefObject<HTMLElement | null>): IslandPanel {
  const [activeTab, setActiveTab] = useState<ToolsTab | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const shouldRestoreFocusRef = useRef(false);

  const openTab = useCallback((tab: ToolsTab) => {
    setActiveTab((previous) => {
      if (previous === null) triggerRef.current = document.activeElement as HTMLElement | null;
      return tab;
    });
  }, []);

  const closePanel = useCallback(() => {
    setActiveTab(null);
    shouldRestoreFocusRef.current = true;
  }, []);

  // Os botões que abrem o painel ficam desabilitados enquanto ele está aberto; só dá para
  // devolver o foco depois que o React os reabilitou (disabled não aceita `focus()`).
  useEffect(() => {
    if (activeTab || !shouldRestoreFocusRef.current) return;
    shouldRestoreFocusRef.current = false;
    triggerRef.current?.focus();
    triggerRef.current = null;
  }, [activeTab]);

  useEffect(() => {
    if (!activeTab) return;
    const closeOnOutsidePress = (event: MouseEvent) => {
      if (containerRef.current?.contains(event.target as Node)) return;
      setActiveTab(null);
      triggerRef.current = null;
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closePanel();
    };
    document.addEventListener('mousedown', closeOnOutsidePress);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('mousedown', closeOnOutsidePress);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [activeTab, containerRef, closePanel]);

  return { activeTab, openTab, closePanel };
}
