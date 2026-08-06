import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useLayoutEffect, useRef, useState, type MouseEvent } from 'react';

import { useMinimalistSoundPreference } from '../contexts/sound-preference-context';
import { useMinimalistFlipLayout } from '../hooks/use-minimalist-flip';
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
  title,
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
  const collapseTimerRef = useRef<number | null>(null);
  const collapseFrameRef = useRef<number | null>(null);
  const expandedScrollTopRef = useRef(0);
  const expansionGeometryCapturedRef = useRef(false);
  const wasExpandedRef = useRef(expanded);
  const expandedContentRef = useRef<HTMLDivElement>(null);
  const [showExpandedGradient, setShowExpandedGradient] = useState(false);
  const [cardSlotSize, setCardSlotSize] = useState<{ height: number; width: number } | null>(null);
  const [expandedBounds, setExpandedBounds] = useState<CardBounds | null>(null);
  const [isOverlay, setIsOverlay] = useState(false);
  const [isCollapsing, setIsCollapsing] = useState(false);
  const handleAnchorClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!href) event.preventDefault();
  };
  const flipLayout = useMinimalistFlipLayout(expansionId ?? title, expanded);
  const expandedContentId = expansionId ? `${expansionId}-content` : undefined;
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
      if (collapseTimerRef.current) window.clearTimeout(collapseTimerRef.current);
      if (collapseFrameRef.current) window.cancelAnimationFrame(collapseFrameRef.current);
      setIsCollapsing(false);
      if (!expansionGeometryCapturedRef.current) captureExpansionGeometry();
      setIsOverlay(true);
      expansionGeometryCapturedRef.current = false;
    }
    onExpandedChange?.();
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
    const shouldRestoreFocus = !!slot && !!document.activeElement && slot.contains(document.activeElement);
    collapseTimerRef.current = window.setTimeout(() => {
      if (collapseFrameRef.current) window.cancelAnimationFrame(collapseFrameRef.current);
      if (grid) grid.scrollTop = Math.min(preservedScrollTop, Math.max(grid.scrollHeight - grid.clientHeight, 0));
      setCardSlotSize(null);
      setExpandedBounds(null);
      setIsOverlay(false);
      setIsCollapsing(false);
      if (shouldRestoreFocus) slot?.querySelector<HTMLButtonElement>('[aria-expanded]')?.focus();
    }, 500);
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
      {isOverlay && <span className="minimalist-card-slot__placeholder" aria-hidden="true" />}
      <motion.article
        {...flipLayout}
        animate={{ opacity: dimmed ? 0.6 : 1 }}
        transition={{ layout: flipLayout.transition, opacity: { duration: 0.2, ease: [0.2, 0.7, 0.2, 1] } }}
        style={isOverlay && expandedBounds ? expandedBounds : undefined}
        className={clsx(
          cardVariants({ appearance, state }),
          expanded && 'minimalist-card--expanded',
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
        <motion.header layout transition={flipLayout.transition} className="minimalist-card__header">
          <motion.p layout transition={flipLayout.transition} className="minimalist-card__eyebrow">
            {eyebrow}
          </motion.p>
          <motion.h2 layout transition={flipLayout.transition}>
            {title}
          </motion.h2>
        </motion.header>
        <motion.div layout transition={flipLayout.transition} className="minimalist-card__content">
          {children}
        </motion.div>
        <AnimatePresence initial={false} mode="popLayout">
          {expanded && expandedContent && (
            <motion.div
              key="expanded-content"
              className="minimalist-card__expanded-content-shell"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.2, 0.7, 0.2, 1] }}
              onWheel={(event) => event.stopPropagation()}
            >
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
            </motion.div>
          )}
        </AnimatePresence>
        <motion.footer layout transition={flipLayout.transition} className="minimalist-card__footer">
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
        </motion.footer>
      </motion.article>
    </div>
  );
}
