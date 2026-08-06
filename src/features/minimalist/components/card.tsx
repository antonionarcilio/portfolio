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
    } else {
      const slot = cardSlotRef.current?.getBoundingClientRect();
      const grid = cardSlotRef.current?.closest<HTMLElement>('.minimalist__project-grid');
      const gridBounds = grid?.getBoundingClientRect();
      if (slot && grid && gridBounds) {
        setExpandedBounds({
          top: slot.top - gridBounds.top + grid.scrollTop,
          left: slot.left - gridBounds.left,
          width: slot.width,
          height: slot.height,
        });
      }
      setIsCollapsing(true);
      const preservedScrollTop = expandedScrollTopRef.current;
      const preserveScrollPosition = () => {
        if (grid) grid.scrollTop = preservedScrollTop;
        collapseFrameRef.current = window.requestAnimationFrame(preserveScrollPosition);
      };
      preserveScrollPosition();
      collapseTimerRef.current = window.setTimeout(() => {
        if (collapseFrameRef.current) window.cancelAnimationFrame(collapseFrameRef.current);
        if (grid) grid.scrollTop = Math.min(preservedScrollTop, Math.max(grid.scrollHeight - grid.clientHeight, 0));
        setCardSlotSize(null);
        setExpandedBounds(null);
        setIsOverlay(false);
        setIsCollapsing(false);
      }, 500);
    }
    onExpandedChange?.();
  };
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
      data-project-scroll-lock={isCollapsing ? expandedScrollTopRef.current : undefined}
      style={cardSlotSize ? { height: cardSlotSize.height, width: cardSlotSize.width } : undefined}
    >
      {isOverlay && <span className="minimalist-card-slot__placeholder" aria-hidden="true" />}
      <motion.article
        {...flipLayout}
        style={isOverlay && expandedBounds ? expandedBounds : undefined}
        className={clsx(
          cardVariants({ appearance, state }),
          expanded && 'minimalist-card--expanded',
          isOverlay && 'minimalist-card--overlay',
        )}
      >
        <span className="minimalist-card__corner minimalist-card__corner--top-left" aria-hidden="true" />
        <span className="minimalist-card__corner minimalist-card__corner--top-right" aria-hidden="true" />
        <span className="minimalist-card__corner minimalist-card__corner--bottom-left" aria-hidden="true" />
        <span className="minimalist-card__corner minimalist-card__corner--bottom-right" aria-hidden="true" />
        <header className="minimalist-card__header">
          <p className="minimalist-card__eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
        </header>
        <div className="minimalist-card__content">{children}</div>
        <AnimatePresence initial={false} mode="popLayout">
          {expanded && expandedContent && (
            <motion.div
              key="expanded-content"
              className="minimalist-card__expanded-content-shell"
              layout
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              exit={{ opacity: 0, scaleY: 0 }}
              style={{ transformOrigin: 'top center' }}
              transition={{ duration: 0.45, ease: [0.2, 0.7, 0.2, 1] }}
              onWheel={(event) => event.stopPropagation()}
            >
              <div
                ref={expandedContentRef}
                id={expandedContentId}
                className="minimalist-card__expanded-content"
                data-project-expanded-content="true"
                onWheel={(event) => event.stopPropagation()}
              >
                {expandedContent}
              </div>
              {showExpandedGradient && <span className="minimalist-card__expanded-gradient" aria-hidden="true" />}
            </motion.div>
          )}
        </AnimatePresence>
        <footer className="minimalist-card__footer">
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
