import { MotionGlobalConfig } from 'framer-motion';
import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react';

import { MINIMALIST_EXPANSION_DURATION_MS } from '../animations';

type MinimalistFlipBounds = { top: number; left: number; width: number | string; height: number | string };
export type MinimalistFlipGeometry = { collapsed: MinimalistFlipBounds; expanded: MinimalistFlipBounds };
export type MinimalistFlipTarget = keyof MinimalistFlipGeometry;

type UseMinimalistCardFlipOptions = {
  containerRef: RefObject<HTMLElement | null>;
  expanded: boolean;
  /** Reads the container's current scroll offset to save before entering the overlay. Defaults to a no-op (0) for non-scrolling containers. */
  captureContainerScroll?: () => number;
  /** Restores the container's scroll offset saved by `captureContainerScroll`. Defaults to a no-op for non-scrolling containers. */
  restoreContainerScroll?: (scrollTop: number) => void;
};

/**
 * Shared FLIP overlay machine for Minimalist expansions (project cards, experience detail):
 * captures real collapsed/expanded geometry from the DOM and animates it as an absolutely
 * positioned overlay, instead of Framer's `layout`/`layoutId` transform-based projection — see
 * `card.tsx` for why (measured layout jump on collapse).
 */
export function useMinimalistCardFlip({
  containerRef,
  expanded,
  captureContainerScroll = () => 0,
  restoreContainerScroll = () => {},
}: UseMinimalistCardFlipOptions) {
  const slotRef = useRef<HTMLDivElement>(null);
  const expandedScrollTopRef = useRef(0);
  const expansionGeometryCapturedRef = useRef(false);
  const wasExpandedRef = useRef(expanded);
  const shouldRestoreFocusRef = useRef(false);
  const [slotSize, setSlotSize] = useState<{ height: number; width: number } | null>(null);
  const [overlayGeometry, setOverlayGeometry] = useState<MinimalistFlipGeometry | null>(null);
  const [overlayTarget, setOverlayTarget] = useState<MinimalistFlipTarget>('collapsed');
  const [isOverlay, setIsOverlay] = useState(false);
  const [isCollapsing, setIsCollapsing] = useState(false);
  const [overlayCycle, setOverlayCycle] = useState(0);
  // Keeps the expanded content mounted through the whole collapse animation (not just while
  // `expanded` is true) — unmounting it immediately collapses the layout and snaps the footer up
  // before the element has finished shrinking.
  const showExpandedLayout = expanded || isCollapsing;
  const isSeedingOverlay = isOverlay && expanded && overlayTarget === 'collapsed';

  // Both rects are expressed in the container's scroll-content space, because the overlay is
  // absolutely positioned inside the container. `expanded.top` is therefore the container's
  // scrollTop, not 0 — `top: 0` would pin the element to the top of the scrolled content instead
  // of the visible viewport.
  const captureExpansionGeometry = () => {
    const slot = slotRef.current;
    const container = containerRef.current;
    if (!slot || !container) return;
    const slotBounds = slot.getBoundingClientRect();
    const containerBounds = container.getBoundingClientRect();
    const scrollTop = captureContainerScroll();
    expandedScrollTopRef.current = scrollTop;
    setSlotSize({ height: slotBounds.height, width: slotBounds.width });
    setOverlayGeometry({
      collapsed: {
        top: slotBounds.top - containerBounds.top + scrollTop,
        left: slotBounds.left - containerBounds.left,
        width: slotBounds.width,
        height: slotBounds.height,
      },
      expanded: { top: scrollTop, left: 0, width: '100%', height: '100%' },
    });
  };
  // Call on pointerdown, before the click that flips `expanded`, so geometry is captured while
  // the element still sits in its collapsed cell.
  const beginExpansionCapture = () => {
    captureExpansionGeometry();
    expansionGeometryCapturedRef.current = true;
  };
  // Call when the consumer's own expand handler fires. Falls back to capturing geometry itself
  // (keyboard activation skips pointerdown, so `beginExpansionCapture` may not have run yet).
  const requestExpand = () => {
    if (expanded) return;
    if (!expansionGeometryCapturedRef.current) captureExpansionGeometry();
    expansionGeometryCapturedRef.current = false;
    // Enter the overlay pinned to the element's own cell. The seed effect below releases it to
    // the expanded rect one frame later, so Framer always interpolates from the real cell.
    setIsCollapsing(false);
    setOverlayTarget('collapsed');
    setIsOverlay(true);
  };
  const finishCollapse = () => {
    restoreContainerScrollRef.current(expandedScrollTopRef.current);
    setSlotSize(null);
    setOverlayGeometry(null);
    setIsOverlay(false);
    setIsCollapsing(false);
    // Remount so Framer discards the motion values it created for the overlay — dropping the
    // geometry keys from `animate` does not release them (see `card.tsx` history for the measured
    // regression), a fresh element starts with no inline geometry and no motion values.
    setOverlayCycle((cycle) => cycle + 1);
  };
  // Read through refs inside the effects below so neither has to sit in a dependency array —
  // both are fresh closures every render (`restoreContainerScroll` comes from the consumer,
  // `finishCollapse` closes over it), and listing them would rerun the effect on every render.
  const restoreContainerScrollRef = useRef(restoreContainerScroll);
  restoreContainerScrollRef.current = restoreContainerScroll;
  const finishCollapseRef = useRef(finishCollapse);
  finishCollapseRef.current = finishCollapse;
  // Focus lands after the remount above, so it cannot be restored synchronously in finishCollapse
  // — the button the user pressed no longer exists at that point.
  useEffect(() => {
    if (isOverlay || !shouldRestoreFocusRef.current) return;
    shouldRestoreFocusRef.current = false;
    slotRef.current?.querySelector<HTMLButtonElement>('[aria-expanded]')?.focus();
  }, [isOverlay]);
  // Seed frame: hold the overlay on the collapsed rect for exactly one paint, then release.
  // Two nested rAFs because the first only guarantees the React commit was scheduled; the second
  // guarantees Framer has flushed the zero-duration seed before the real target lands.
  useLayoutEffect(() => {
    if (!expanded || !isOverlay || overlayTarget === 'expanded') return;
    let inner = 0;
    const outer = window.requestAnimationFrame(() => {
      inner = window.requestAnimationFrame(() => setOverlayTarget('expanded'));
    });
    return () => {
      window.cancelAnimationFrame(outer);
      window.cancelAnimationFrame(inner);
    };
  }, [expanded, isOverlay, overlayTarget]);
  // Teardown is driven by the transition's own duration, not by `onAnimationComplete` — that
  // callback fires per animation definition, and this element's definition changes mid-cycle
  // (seed → run), so it fires too early and tears the overlay down mid-flight.
  useLayoutEffect(() => {
    const wasExpanded = wasExpandedRef.current;
    wasExpandedRef.current = expanded;
    if (expanded || !wasExpanded) return;
    const slot = slotRef.current;
    setIsCollapsing(true);
    setOverlayTarget('collapsed');
    restoreContainerScrollRef.current(expandedScrollTopRef.current);
    shouldRestoreFocusRef.current = !!slot && !!document.activeElement && slot.contains(document.activeElement);
    // reduceMotion sets MotionGlobalConfig.skipAnimations, so the element is already at its final
    // geometry — waiting the full duration would strand it as an overlay.
    const settleDelay = MotionGlobalConfig.skipAnimations ? 0 : MINIMALIST_EXPANSION_DURATION_MS;
    const timer = window.setTimeout(() => finishCollapseRef.current(), settleDelay);
    return () => window.clearTimeout(timer);
  }, [expanded]);

  return {
    slotRef,
    slotSize,
    overlayGeometry,
    overlayTarget,
    isOverlay,
    isCollapsing,
    overlayCycle,
    showExpandedLayout,
    isSeedingOverlay,
    expandedScrollTop: expandedScrollTopRef.current,
    captureExpansionGeometry: beginExpansionCapture,
    requestExpand,
  };
}
