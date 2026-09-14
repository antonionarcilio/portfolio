import { useCallback, useLayoutEffect, useState } from 'react';

export type MinimalistCardEmphasis = { active: boolean; dimmed: boolean };

const CARD_SELECTOR = '[data-project-card]';
type EmphasisState = { pointerProjectId: string | null; focusedProjectIds: ReadonlySet<string> };

const EMPTY_EMPHASIS_STATE: EmphasisState = { pointerProjectId: null, focusedProjectIds: new Set() };

/**
 * Tracks pointer and keyboard emphasis independently so hovering another card
 * never replaces a card that still owns focus.
 *
 * The grid element is captured via a callback ref (returned as `gridRef`, attach it to the grid's
 * `ref` prop) instead of accepting an external `RefObject`. AnimatePresence's `mode="wait"` unmounts
 * the collapsed grid when a project expands and only remounts it once the exit animation finishes —
 * a later, separate commit than the state flip that triggered it. A plain RefObject gives no signal
 * for that later commit, so an effect keyed off a derived boolean either fires too early (grid still
 * null) or never fires again once the grid actually reappears, leaving pointer/focus listeners
 * permanently unattached. A callback ref fires exactly when the DOM node itself attaches or detaches,
 * so the effect below re-attaches at the right time regardless of animation timing.
 */
export function useMinimalistCardEmphasis() {
  const [gridElement, setGridElement] = useState<HTMLDivElement | null>(null);
  const [emphasisState, setEmphasisState] = useState<EmphasisState>(EMPTY_EMPHASIS_STATE);
  const gridRef = useCallback((node: HTMLDivElement | null) => setGridElement(node), []);

  useLayoutEffect(() => {
    setEmphasisState(EMPTY_EMPHASIS_STATE);
    if (!gridElement) return;
    const grid = gridElement;

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
  }, [gridElement]);

  const activeProjectIds = new Set([
    ...(emphasisState.pointerProjectId ? [emphasisState.pointerProjectId] : []),
    ...emphasisState.focusedProjectIds,
  ]);
  const visibleSiblingIds = new Set<string>();
  if (activeProjectIds.size) {
    const gridRect = gridElement?.getBoundingClientRect();
    gridElement?.querySelectorAll<HTMLElement>(CARD_SELECTOR).forEach((sibling) => {
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

  return { getCardEmphasis, gridRef };
}
