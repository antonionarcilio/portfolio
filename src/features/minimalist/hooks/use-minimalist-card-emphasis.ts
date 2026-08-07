import { useLayoutEffect, useState, type RefObject } from 'react';

export type MinimalistCardEmphasis = { active: boolean; dimmed: boolean };

const CARD_SELECTOR = '[data-project-card]';
type EmphasisState = { pointerProjectId: string | null; focusedProjectIds: ReadonlySet<string> };

const EMPTY_EMPHASIS_STATE: EmphasisState = { pointerProjectId: null, focusedProjectIds: new Set() };

/**
 * Tracks pointer and keyboard emphasis independently so hovering another card
 * never replaces a card that still owns focus.
 */
export function useMinimalistCardEmphasis(gridRef: RefObject<HTMLDivElement | null>) {
  const [emphasisState, setEmphasisState] = useState<EmphasisState>(EMPTY_EMPHASIS_STATE);

  useLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const activatePointer = (projectId: string) => {
      setEmphasisState((current) => ({ ...current, pointerProjectId: projectId }));
    };
    const deactivatePointer = (projectId: string) => {
      setEmphasisState((current) =>
        current.pointerProjectId === projectId ? { ...current, pointerProjectId: null } : current,
      );
    };
    const activateFocus = (projectId: string) => {
      setEmphasisState((current) => ({
        ...current,
        focusedProjectIds: new Set([...current.focusedProjectIds, projectId]),
      }));
    };
    const deactivateFocus = (projectId: string) => {
      setEmphasisState((current) => {
        if (!current.focusedProjectIds.has(projectId)) return current;
        const focusedProjectIds = new Set(current.focusedProjectIds);
        focusedProjectIds.delete(projectId);
        return { ...current, focusedProjectIds };
      });
    };

    const cleanups: Array<() => void> = [];
    const attachListeners = () => {
      cleanups.splice(0).forEach((cleanup) => cleanup());
      grid.querySelectorAll<HTMLElement>(CARD_SELECTOR).forEach((slot) => {
        const projectId = slot.dataset.projectCard;
        if (!projectId) return;
        const onPointerEnter = () => activatePointer(projectId);
        const onPointerLeave = () => deactivatePointer(projectId);
        const onFocusIn = () => activateFocus(projectId);
        const onFocusOut = (event: FocusEvent) => {
          if (!slot.contains(event.relatedTarget as Node | null)) deactivateFocus(projectId);
        };
        slot.addEventListener('pointerenter', onPointerEnter);
        slot.addEventListener('pointerleave', onPointerLeave);
        slot.addEventListener('focusin', onFocusIn);
        slot.addEventListener('focusout', onFocusOut);
        cleanups.push(() => {
          slot.removeEventListener('pointerenter', onPointerEnter);
          slot.removeEventListener('pointerleave', onPointerLeave);
          slot.removeEventListener('focusin', onFocusIn);
          slot.removeEventListener('focusout', onFocusOut);
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

  const activeProjectIds = new Set([
    ...(emphasisState.pointerProjectId ? [emphasisState.pointerProjectId] : []),
    ...emphasisState.focusedProjectIds,
  ]);
  const visibleSiblingIds = new Set<string>();
  if (activeProjectIds.size) {
    const grid = gridRef.current;
    const gridRect = grid?.getBoundingClientRect();
    grid?.querySelectorAll<HTMLElement>(CARD_SELECTOR).forEach((sibling) => {
      const siblingId = sibling.dataset.projectCard;
      const rect = sibling.getBoundingClientRect();
      if (
        siblingId &&
        !activeProjectIds.has(siblingId) &&
        gridRect &&
        rect.bottom > gridRect.top &&
        rect.top < gridRect.bottom
      ) {
        visibleSiblingIds.add(siblingId);
      }
    });
  }

  const getCardEmphasis = (projectId: string): MinimalistCardEmphasis => ({
    active: activeProjectIds.has(projectId),
    dimmed: activeProjectIds.size > 0 && !activeProjectIds.has(projectId) && visibleSiblingIds.has(projectId),
  });

  return { getCardEmphasis };
}
