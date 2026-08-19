import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useLayoutEffect, useRef, useState, type MouseEvent } from 'react';

import { minimalistExpansionTransition, minimalistFadeTransition } from '../animations';
import { useMinimalistSoundPreference } from '../contexts/sound-preference-context';
import { useMinimalistCardFlip } from '../hooks/use-minimalist-card-flip';
import { useMinimalistSoundEffects } from '../sound-controller';
import type { MinimalistCardProps } from '../types';
import { cardVariants } from '../variants';
import { Button } from './button';

type CardComponentProps = MinimalistCardProps & {
  appearance: 'light' | 'dark';
  state?: 'regular' | 'hover' | 'focus';
};
const CARD_CORNERS = ['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const;
const cardExpansionTransition = { ...minimalistExpansionTransition, opacity: minimalistFadeTransition };
const seedTransition = { duration: 0, opacity: minimalistFadeTransition };
const PROJECT_GRID_SELECTOR = '.minimalist__project-grid';

function clampScrollTop(grid: HTMLElement) {
  return Math.min(grid.scrollTop, Math.max(grid.scrollHeight - grid.clientHeight, 0));
}

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
  const gridRef = useRef<HTMLElement | null>(null);
  const expandedContentRef = useRef<HTMLDivElement>(null);
  const [showExpandedGradient, setShowExpandedGradient] = useState(false);
  const handleAnchorClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!href) event.preventDefault();
  };
  const expandedContentId = expansionId ? `${expansionId}-content` : undefined;
  const flip = useMinimalistCardFlip({
    containerRef: gridRef,
    expanded,
    captureContainerScroll: () => {
      const grid = gridRef.current;
      return grid ? clampScrollTop(grid) : 0;
    },
    restoreContainerScroll: (scrollTop) => {
      const grid = gridRef.current;
      if (grid) grid.scrollTop = Math.min(scrollTop, Math.max(grid.scrollHeight - grid.clientHeight, 0));
    },
  });
  // Re-derived every render (cheap) instead of once on mount, so it stays correct if the card's
  // position in the grid tree ever changes.
  useLayoutEffect(() => {
    gridRef.current = flip.slotRef.current?.closest<HTMLElement>(PROJECT_GRID_SELECTOR) ?? null;
  });
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
      ref={flip.slotRef}
      data-project-card={dataProjectCard}
      className={clsx(
        'minimalist-card-slot',
        expanded && 'minimalist-card-slot--expanded',
        flip.isCollapsing && 'minimalist-card-slot--collapsing',
      )}
      data-project-scroll-lock={expanded ? flip.expandedScrollTop : undefined}
      style={flip.slotSize ? { height: flip.slotSize.height, width: flip.slotSize.width } : undefined}
    >
      <motion.article
        key={flip.overlayCycle}
        data-expanded={expanded ? 'true' : 'false'}
        animate={{
          ...(flip.isOverlay && flip.overlayGeometry ? flip.overlayGeometry[flip.overlayTarget] : {}),
          opacity: dimmed ? 0.6 : 1,
        }}
        transition={flip.isSeedingOverlay ? seedTransition : cardExpansionTransition}
        className={clsx(
          'flex flex-col gap-5.5 w-full h-full',
          cardVariants({ appearance, state }),
          flip.showExpandedLayout && 'minimalist-card--expanded',
          flip.isOverlay && 'minimalist-card--overlay',
        )}
      >
        {CARD_CORNERS.map((corner) => (
          <motion.span
            key={corner}
            className={`minimalist-card__corner minimalist-card__corner--${corner}`}
            animate={{ opacity: active ? 1 : 0 }}
            transition={minimalistFadeTransition}
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
          {!flip.showExpandedLayout && <div className="minimalist-card__content">{children}</div>}

          {flip.showExpandedLayout && expandedContent && (
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
                if (!expanded) flip.captureExpansionGeometry();
              }}
              onClick={() => {
                playExpandSound();
                flip.requestExpand();
                onExpandedChange();
              }}
            />
          )}
        </footer>
      </motion.article>
    </div>
  );
}
