import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useLayoutEffect, useRef, useState, type MouseEvent } from 'react';

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
const CARD_CORNERS = ['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const;

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
  const collapseFrameRef = useRef<number | null>(null);
  const expandedScrollTopRef = useRef(0);
  const expansionGeometryCapturedRef = useRef(false);
  const wasExpandedRef = useRef(expanded);
  const shouldRestoreFocusRef = useRef(false);
  const expandedContentRef = useRef<HTMLDivElement>(null);
  const [showExpandedGradient, setShowExpandedGradient] = useState(false);
  const [cardSlotSize, setCardSlotSize] = useState<{ height: number; width: number } | null>(null);
  const [expandedBounds, setExpandedBounds] = useState<CardBounds | null>(null);
  const [collapsedPosition, setCollapsedPosition] = useState<{ top: number; left: number } | null>(null);
  const [isOverlay, setIsOverlay] = useState(false);
  const [isCollapsing, setIsCollapsing] = useState(false);
  const handleAnchorClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!href) event.preventDefault();
  };
  const expandedContentId = expansionId ? `${expansionId}-content` : undefined;
  // Keeps the expanded grid/content mounted through the whole collapse animation (not just
  // while `expanded` is true) — unmounting it immediately collapses the grid's middle row and
  // snaps the footer up before the card has finished shrinking.
  const showExpandedLayout = expanded || isCollapsing;
  const captureExpansionGeometry = () => {
    const slot = cardSlotRef.current?.getBoundingClientRect();
    const viewport = cardSlotRef.current?.closest('.minimalist__project-grid');
    const viewportRect = viewport?.getBoundingClientRect();
    if (viewport) {
      expandedScrollTopRef.current = Math.min(
        viewport.scrollTop,
        Math.max(viewport.scrollHeight - viewport.clientHeight, 0),
      );
    }
    if (slot) setCardSlotSize({ height: slot.height, width: slot.width });
    if (slot && viewport && viewportRect) {
      setCollapsedPosition({
        top: slot.top - viewportRect.top + viewport.scrollTop,
        left: slot.left - viewportRect.left,
      });
    }
    if (viewport && viewportRect) {
      setExpandedBounds({
        top: viewport.scrollTop,
        left: 0,
        width: viewport.clientWidth,
        height: viewport.clientHeight,
      });
    }
  };
  const handleExpandedChange = () => {
    if (!expanded) {
      if (collapseFrameRef.current) window.cancelAnimationFrame(collapseFrameRef.current);
      setIsCollapsing(false);
      if (!expansionGeometryCapturedRef.current) captureExpansionGeometry();
      setIsOverlay(true);
      expansionGeometryCapturedRef.current = false;
    }
    onExpandedChange?.();
  };
  const handleCollapseAnimationComplete = () => {
    if (!isCollapsing) return;
    if (collapseFrameRef.current) window.cancelAnimationFrame(collapseFrameRef.current);
    const grid = cardSlotRef.current?.closest<HTMLElement>('.minimalist__project-grid');
    if (grid) {
      grid.scrollTop = Math.min(expandedScrollTopRef.current, Math.max(grid.scrollHeight - grid.clientHeight, 0));
    }
    setCardSlotSize(null);
    setExpandedBounds(null);
    setCollapsedPosition(null);
    setIsOverlay(false);
    setIsCollapsing(false);
    if (shouldRestoreFocusRef.current) {
      cardSlotRef.current?.querySelector<HTMLButtonElement>('[aria-expanded]')?.focus();
    }
  };
  useLayoutEffect(() => {
    const wasExpanded = wasExpandedRef.current;
    wasExpandedRef.current = expanded;
    if (expanded || !wasExpanded) return;
    const slot = cardSlotRef.current;
    const slotBounds = slot?.getBoundingClientRect();
    const grid = slot?.closest<HTMLElement>('.minimalist__project-grid');
    const gridBounds = grid?.getBoundingClientRect();
    if (slotBounds && grid && gridBounds) {
      setExpandedBounds({
        top: slotBounds.top - gridBounds.top + grid.scrollTop,
        left: slotBounds.left - gridBounds.left,
        width: slotBounds.width,
        height: slotBounds.height,
      });
    }
    setIsCollapsing(true);
    const preservedScrollTop = expandedScrollTopRef.current;
    if (grid) grid.scrollTop = preservedScrollTop;
    const preserveScrollPosition = () => {
      if (grid) grid.scrollTop = preservedScrollTop;
      collapseFrameRef.current = window.requestAnimationFrame(preserveScrollPosition);
    };
    preserveScrollPosition();
    shouldRestoreFocusRef.current = !!slot && !!document.activeElement && slot.contains(document.activeElement);
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
        data-expanded={expanded ? 'true' : 'false'}
        animate={{
          top: isOverlay && expandedBounds ? expandedBounds.top : (collapsedPosition?.top ?? 0),
          left: isOverlay && expandedBounds ? expandedBounds.left : (collapsedPosition?.left ?? 0),
          width: isOverlay && expandedBounds ? expandedBounds.width : (null as unknown as number),
          height: isOverlay && expandedBounds ? expandedBounds.height : (null as unknown as number),
          opacity: dimmed ? 0.6 : 1,
        }}
        transition={{ duration: 2, ease: [0.2, 0.7, 0.2, 1] }}
        onAnimationComplete={handleCollapseAnimationComplete}
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
            transition={{ duration: 0.2, ease: [0.2, 0.7, 0.2, 1] }}
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
          <div className="minimalist-card__content">{children}</div>

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
