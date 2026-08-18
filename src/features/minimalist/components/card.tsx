import clsx from 'clsx';
import { motion, MotionGlobalConfig } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from 'react';

import {
  MINIMALIST_CORNER_FADE_DURATION,
  MINIMALIST_EASE,
  MINIMALIST_EXPANSION_DURATION_MS,
  minimalistExpansionTransition,
} from '../animations';
import { useMinimalistSoundPreference } from '../contexts/sound-preference-context';
import { useMinimalistSoundEffects } from '../sound-controller';
import type { MinimalistCardProps } from '../types';
import { cardVariants } from '../variants';
import { Button } from './button';

type CardComponentProps = MinimalistCardProps & {
  appearance: 'light' | 'dark';
  state?: 'regular' | 'hover' | 'focus';
};
type CardBounds = { top: number; left: number; width: number; height: number };
type OverlayGeometry = { collapsed: CardBounds; expanded: CardBounds };
type OverlayTarget = keyof OverlayGeometry;
const CARD_CORNERS = ['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const;
const cardCornerTransition = { duration: MINIMALIST_CORNER_FADE_DURATION, ease: MINIMALIST_EASE };
const cardExpansionTransition = { ...minimalistExpansionTransition, opacity: cardCornerTransition };
const seedTransition = { duration: 0, opacity: cardCornerTransition };

export function MinimalistCard({
  appearance,
  meta,
  metaExpanded,
  eyebrow,
  children,
  footer,
  expandedContent,
  expanded = false,
  onExpandedChange,
  expansionLabel,
  collapseLabel,
  expansionId,
  href,
  linkLabel,
  'data-project-card': dataProjectCard,
  active = false,
  dimmed = false,
  state = 'regular',
}: CardComponentProps) {
  const t = useTranslations('minimalist.card');
  const soundEnabled = useMinimalistSoundPreference();
  const { play: playExpandSound } = useMinimalistSoundEffects('mouseClickClose', soundEnabled);
  const cardSlotRef = useRef<HTMLDivElement>(null);
  const expandedScrollTopRef = useRef(0);
  const expansionGeometryCapturedRef = useRef(false);
  const wasExpandedRef = useRef(expanded);
  const shouldRestoreFocusRef = useRef(false);
  const expandedContentRef = useRef<HTMLDivElement>(null);
  const [showExpandedGradient, setShowExpandedGradient] = useState(false);
  const [cardSlotSize, setCardSlotSize] = useState<{ height: number; width: number } | null>(null);
  const [overlayGeometry, setOverlayGeometry] = useState<OverlayGeometry | null>(null);
  const [overlayTarget, setOverlayTarget] = useState<OverlayTarget>('collapsed');
  const [isOverlay, setIsOverlay] = useState(false);
  const [isCollapsing, setIsCollapsing] = useState(false);
  const [overlayCycle, setOverlayCycle] = useState(0);
  const handleAnchorClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!href) event.preventDefault();
  };
  const expandedContentId = expansionId ? `${expansionId}-content` : undefined;
  // Keeps the expanded grid/content mounted through the whole collapse animation (not just
  // while `expanded` is true) — unmounting it immediately collapses the grid's middle row and
  // snaps the footer up before the card has finished shrinking.
  const showExpandedLayout = expanded || isCollapsing;
  const isSeedingOverlay = isOverlay && expanded && overlayTarget === 'collapsed';
  // Real `top/left/width/height` are animated rather than Framer's `layout` projection. `layout`
  // is transform-based, so the DOM box jumps to its final size on the first frame and only the
  // scale interpolates — measured on collapse: the card's offsetHeight went 610 → 233 in 7ms
  // while the visual box was still at 600. That reads as the content snapping shut. Animating
  // real geometry reflows the children every frame, which is what makes the motion fluid.
  //
  // Both rects are expressed in the grid's scroll-content space, because the overlay is
  // absolutely positioned inside `.minimalist__project-grid`. `expanded.top` is therefore the
  // grid's scrollTop, not 0 — `top: 0` would pin the card to the top of the scrolled content
  // instead of the visible viewport.
  const captureExpansionGeometry = () => {
    const slot = cardSlotRef.current;
    const grid = slot?.closest<HTMLElement>('.minimalist__project-grid');
    if (!slot || !grid) return;
    const slotBounds = slot.getBoundingClientRect();
    const gridBounds = grid.getBoundingClientRect();
    expandedScrollTopRef.current = Math.min(grid.scrollTop, Math.max(grid.scrollHeight - grid.clientHeight, 0));
    setCardSlotSize({ height: slotBounds.height, width: slotBounds.width });
    setOverlayGeometry({
      collapsed: {
        top: slotBounds.top - gridBounds.top + grid.scrollTop,
        left: slotBounds.left - gridBounds.left,
        width: slotBounds.width,
        height: slotBounds.height,
      },
      expanded: { top: grid.scrollTop, left: 0, width: grid.clientWidth, height: grid.clientHeight },
    });
  };
  const handleExpandedChange = () => {
    if (!expanded) {
      setIsCollapsing(false);
      if (!expansionGeometryCapturedRef.current) captureExpansionGeometry();
      expansionGeometryCapturedRef.current = false;
      // Enter the overlay pinned to the card's own cell. The seed effect below releases it to
      // the expanded rect one frame later, so Framer always interpolates from the real cell.
      // Without the seed, a freshly-absolute element has no prior top/left and starts from the
      // grid's origin — which is why only the top-left card ever looked correct.
      setOverlayTarget('collapsed');
      setIsOverlay(true);
    }
    onExpandedChange?.();
  };
  const finishCollapse = () => {
    const grid = cardSlotRef.current?.closest<HTMLElement>('.minimalist__project-grid');
    if (grid) {
      grid.scrollTop = Math.min(expandedScrollTopRef.current, Math.max(grid.scrollHeight - grid.clientHeight, 0));
    }
    setCardSlotSize(null);
    setOverlayGeometry(null);
    setIsOverlay(false);
    setIsCollapsing(false);
    // Remount the card so Framer discards the motion values it created for the overlay.
    // Dropping the geometry keys from `animate` does not release them: Framer animates
    // width/height *back* toward the expanded rect (measured 423px → 832px over the second
    // after teardown) and rewrites the inline style every frame, so clearing it by hand loses
    // the race. A fresh element starts with no inline geometry and no motion values.
    setOverlayCycle((cycle) => cycle + 1);
  };
  // Focus lands after the remount above, so it cannot be restored synchronously in finishCollapse
  // — the button the user pressed no longer exists at that point.
  useEffect(() => {
    if (isOverlay || !shouldRestoreFocusRef.current) return;
    shouldRestoreFocusRef.current = false;
    cardSlotRef.current?.querySelector<HTMLButtonElement>('[aria-expanded]')?.focus();
  }, [isOverlay]);
  // Seed frame: hold the overlay on the collapsed rect for exactly one paint, then release.
  // Two nested rAFs because the first only guarantees the React commit was scheduled; the
  // second guarantees Framer has flushed the zero-duration seed before the real target lands.
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
  // Teardown is driven by the transition's own duration, not by `onAnimationComplete`. That
  // callback fires per animation definition, and this element's definition changes mid-cycle
  // (seed → run, plus the independent opacity transition), so it fired ~70ms into the collapse
  // and tore the overlay down while the card was still at 818px. `section.tsx` already uses this
  // same timeout pattern for the experience panel.
  useLayoutEffect(() => {
    const wasExpanded = wasExpandedRef.current;
    wasExpandedRef.current = expanded;
    if (expanded || !wasExpanded) return;
    const slot = cardSlotRef.current;
    const grid = slot?.closest<HTMLElement>('.minimalist__project-grid');
    setIsCollapsing(true);
    setOverlayTarget('collapsed');
    if (grid) grid.scrollTop = expandedScrollTopRef.current;
    shouldRestoreFocusRef.current = !!slot && !!document.activeElement && slot.contains(document.activeElement);
    // reduceMotion sets MotionGlobalConfig.skipAnimations, so the card is already at its final
    // geometry — waiting the full duration would strand it as an overlay.
    const settleDelay = MotionGlobalConfig.skipAnimations ? 0 : MINIMALIST_EXPANSION_DURATION_MS;
    const timer = window.setTimeout(finishCollapse, settleDelay);
    return () => window.clearTimeout(timer);
  }, [expanded]);
  useLayoutEffect(() => {
    const content = expandedContentRef.current;
    if (!expanded || !content) {
      setShowExpandedGradient(false);
      return;
    }
    const updateGradient = () => {
      const hasOverflow = content.scrollHeight > content.clientHeight + 1;
      const atEnd = content.scrollTop + content.clientHeight >= content.scrollHeight - 1;
      setShowExpandedGradient(hasOverflow && !atEnd);
    };
    updateGradient();
    content.addEventListener('scroll', updateGradient, { passive: true });
    const resizeObserver = new ResizeObserver(updateGradient);
    resizeObserver.observe(content);
    return () => {
      content.removeEventListener('scroll', updateGradient);
      resizeObserver.disconnect();
    };
  }, [expanded, expandedContent]);
  return (
    <div
      ref={cardSlotRef}
      data-project-card={dataProjectCard}
      className={clsx(
        'minimalist-card-slot',
        expanded && 'minimalist-card-slot--expanded',
        isCollapsing && 'minimalist-card-slot--collapsing',
      )}
      data-project-scroll-lock={expanded ? expandedScrollTopRef.current : undefined}
      style={cardSlotSize ? { height: cardSlotSize.height, width: cardSlotSize.width } : undefined}
    >
      <motion.article
        key={overlayCycle}
        data-expanded={expanded ? 'true' : 'false'}
        animate={{ ...(isOverlay && overlayGeometry ? overlayGeometry[overlayTarget] : {}), opacity: dimmed ? 0.6 : 1 }}
        transition={isSeedingOverlay ? seedTransition : cardExpansionTransition}
        className={clsx(
          'flex flex-col gap-5.5 w-full h-full',
          cardVariants({ appearance, state }),
          showExpandedLayout && 'minimalist-card--expanded',
          isOverlay && 'minimalist-card--overlay',
        )}
      >
        {CARD_CORNERS.map((corner) => (
          <motion.span
            key={corner}
            className={`minimalist-card__corner minimalist-card__corner--${corner}`}
            animate={{ opacity: active ? 1 : 0 }}
            transition={cardCornerTransition}
            aria-hidden="true"
          />
        ))}
        <header className="minimalist-card__header flex items-center justify-between gap-5">
          <p className="minimalist-card__eyebrow">{eyebrow}</p>
          <div className="minimalist-card__header-meta">
            <h2 className="minimalist-card__meta minimalist-card__meta--collapsed">{meta}</h2>
            <h2 className="minimalist-card__meta minimalist-card__meta--expanded">{metaExpanded}</h2>
          </div>
        </header>
        <div className="minimalist-card__main">
          {!showExpandedLayout && <div className="minimalist-card__content">{children}</div>}

          {showExpandedLayout && expandedContent && (
            <div className="minimalist-card__expanded-content-shell" onWheel={(event) => event.stopPropagation()}>
              <div
                ref={expandedContentRef}
                id={expandedContentId}
                className="minimalist-card__expanded-content"
                data-project-expanded-content="true"
                tabIndex={0}
                onWheel={(event) => event.stopPropagation()}
              >
                <div className="minimalist-card__content">{children}</div>
                {expandedContent}
              </div>
              {showExpandedGradient && <span className="minimalist-card__expanded-gradient" aria-hidden="true" />}
            </div>
          )}
        </div>
        <footer className="minimalist-card__footer flex items-center justify-between gap-5">
          {href && (
            <a href={href} target="_blank" rel="noopener noreferrer" onClick={handleAnchorClick}>
              {linkLabel ?? t('open')}
            </a>
          )}
          {footer}
          {onExpandedChange && (
            <Button
              appearance={appearance}
              label={expanded ? (collapseLabel ?? t('collapse')) : (expansionLabel ?? t('expand'))}
              type="button"
              className="minimalist-card__expand-control"
              aria-expanded={expanded}
              aria-controls={expandedContentId}
              onPointerDown={() => {
                if (!expanded) {
                  captureExpansionGeometry();
                  expansionGeometryCapturedRef.current = true;
                }
              }}
              onClick={() => {
                playExpandSound();
                handleExpandedChange();
              }}
            />
          )}
        </footer>
      </motion.article>
    </div>
  );
}
