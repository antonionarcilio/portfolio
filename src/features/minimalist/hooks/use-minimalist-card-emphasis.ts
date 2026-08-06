import { useLayoutEffect, useState, type RefObject } from 'react';

export type MinimalistCardEmphasis = { active: boolean; dimmed: boolean };

const CARD_SELECTOR = '[data-project-card]';

/**
 * Tracks which project card is under pointer/focus and which visible siblings
 * should dim, using non-bubbling pointerenter/pointerleave + focusin/focusout
 * attached directly to each card slot (so hovering inside a card's own
 * children never mis-fires enter/leave for the card itself).
 */
export function useMinimalistCardEmphasis(gridRef: RefObject<HTMLDivElement | null>) {
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [visibleSiblingIds, setVisibleSiblingIds] = useState<ReadonlySet<string>>(new Set());

  useLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const activate = (projectId: string, slot: HTMLElement) => {
      const gridRect = grid.getBoundingClientRect();
      const visible = new Set<string>();
      grid.querySelectorAll<HTMLElement>(CARD_SELECTOR).forEach((sibling) => {
        const siblingId = sibling.dataset.projectCard;
        if (!siblingId || sibling === slot) return;
        const rect = sibling.getBoundingClientRect();
        if (rect.bottom > gridRect.top && rect.top < gridRect.bottom) visible.add(siblingId);
      });
      setActiveProjectId(projectId);
      setVisibleSiblingIds(visible);
    };
    const deactivate = (projectId: string) => {
      setActiveProjectId((current) => (current === projectId ? null : current));
    };

    const cleanups: Array<() => void> = [];
    const attachListeners = () => {
      cleanups.splice(0).forEach((cleanup) => cleanup());
      grid.querySelectorAll<HTMLElement>(CARD_SELECTOR).forEach((slot) => {
        const projectId = slot.dataset.projectCard;
        if (!projectId) return;
        const onEnter = () => activate(projectId, slot);
        const onLeave = () => deactivate(projectId);
        slot.addEventListener('pointerenter', onEnter);
        slot.addEventListener('pointerleave', onLeave);
        slot.addEventListener('focusin', onEnter);
        slot.addEventListener('focusout', onLeave);
        cleanups.push(() => {
          slot.removeEventListener('pointerenter', onEnter);
          slot.removeEventListener('pointerleave', onLeave);
          slot.removeEventListener('focusin', onEnter);
          slot.removeEventListener('focusout', onLeave);
        });
      });
    };

    attachListeners();
    const mutationObserver = new MutationObserver(attachListeners);
    mutationObserver.observe(grid, { childList: true, subtree: true });

    return () => {
      mutationObserver.disconnect();
      cleanups.splice(0).forEach((cleanup) => cleanup());
    };
  }, [gridRef]);

  const getCardEmphasis = (projectId: string): MinimalistCardEmphasis => ({
    active: activeProjectId === projectId,
    dimmed: activeProjectId !== null && activeProjectId !== projectId && visibleSiblingIds.has(projectId),
  });

  return { getCardEmphasis };
}
