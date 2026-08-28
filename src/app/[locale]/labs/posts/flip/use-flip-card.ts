import { MotionGlobalConfig } from 'framer-motion';
import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react';

import { FLIP_DEMO_EXPANSION_DURATION_MS } from './animations';

type FlipBounds = { top: number; left: number; width: number | string; height: number | string };
export type FlipGeometry = { collapsed: FlipBounds; expanded: FlipBounds };
export type FlipTarget = keyof FlipGeometry;

type UseFlipCardOptions = {
  containerRef: RefObject<HTMLElement | null>;
  expanded: boolean;
};

/**
 * FLIP (First-Last-Invert-Play) overlay machine: captures the real collapsed/expanded
 * geometry from the DOM and animates it as an absolutely positioned overlay, instead of
 * Framer's `layout`/`layoutId` transform-based projection (that path causes a measured
 * layout jump on collapse). Cloned from
 * `src/features/minimalist/hooks/use-minimalist-card-flip.ts` and trimmed of the
 * scrolling-grid-container concerns — this demo's container never scrolls.
 */
export function useFlipCard({ containerRef, expanded }: UseFlipCardOptions) {
  const slotRef = useRef<HTMLDivElement>(null);
  const expansionGeometryCapturedRef = useRef(false);
  const wasExpandedRef = useRef(expanded);
  const shouldRestoreFocusRef = useRef(false);
  const [slotSize, setSlotSize] = useState<{ height: number; width: number } | null>(null);
  const [overlayGeometry, setOverlayGeometry] = useState<FlipGeometry | null>(null);
  const [overlayTarget, setOverlayTarget] = useState<FlipTarget>('collapsed');
  const [isOverlay, setIsOverlay] = useState(false);
  const [isCollapsing, setIsCollapsing] = useState(false);
  const [overlayCycle, setOverlayCycle] = useState(0);
  // Keeps the expanded content mounted through the whole collapse animation (not just while
  // `expanded` is true) — unmounting it immediately collapses the layout and snaps the footer up
  // before the element has finished shrinking.
  const showExpandedLayout = expanded || isCollapsing;
  const isSeedingOverlay = isOverlay && expanded && overlayTarget === 'collapsed';

  const captureExpansionGeometry = () => {
    const slot = slotRef.current;
    const container = containerRef.current;
    if (!slot || !container) return;
    const slotBounds = slot.getBoundingClientRect();
    const containerBounds = container.getBoundingClientRect();
    setSlotSize({ height: slotBounds.height, width: slotBounds.width });
    setOverlayGeometry({
      collapsed: {
        top: slotBounds.top - containerBounds.top,
        left: slotBounds.left - containerBounds.left,
        width: slotBounds.width,
        height: slotBounds.height,
      },
      expanded: { top: 0, left: 0, width: '100%', height: '100%' },
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
    setSlotSize(null);
    setOverlayGeometry(null);
    setIsOverlay(false);
    setIsCollapsing(false);
    // Remount so Framer discards the motion values it created for the overlay — dropping the
    // geometry keys from `animate` does not release them, a fresh element starts with no inline
    // geometry and no motion values.
    setOverlayCycle((cycle) => cycle + 1);
  };
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
    shouldRestoreFocusRef.current = !!slot && !!document.activeElement && slot.contains(document.activeElement);
    // reduceMotion sets MotionGlobalConfig.skipAnimations, so the element is already at its final
    // geometry — waiting the full duration would strand it as an overlay.
    const settleDelay = MotionGlobalConfig.skipAnimations ? 0 : FLIP_DEMO_EXPANSION_DURATION_MS;
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
    captureExpansionGeometry: beginExpansionCapture,
    requestExpand,
  };
}
