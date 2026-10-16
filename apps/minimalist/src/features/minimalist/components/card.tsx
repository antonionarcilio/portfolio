import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import type { MouseEvent } from 'react';

import { minimalistFadeTransition } from '../animations';
import { useMinimalistSoundPreference } from '../contexts/sound-preference-context';
import { useMinimalistSoundEffects } from '../sound-controller';
import type { MinimalistCardProps } from '../types';
import { cardVariants } from '../variants';
import { AnimatedIcon } from './animated-icon';
import { Button } from './button';

type CardComponentProps = MinimalistCardProps & {
  appearance: 'light' | 'dark';
  state?: 'regular' | 'hover' | 'focus';
};
const CARD_CORNERS = ['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const;
const CARD_CORNER_EDGE_CLASSES: Record<(typeof CARD_CORNERS)[number], string> = {
  'top-left': 'top-0 left-0 border-t border-l',
  'top-right': 'top-0 right-0 border-t border-r',
  'bottom-left': 'bottom-0 left-0 border-b border-l',
  'bottom-right': 'right-0 bottom-0 border-r border-b',
};

export function MinimalistCard({
  appearance,
  meta,
  eyebrow,
  children,
  footer,
  onExpandedChange,
  expansionLabel,
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
  const handleAnchorClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!href) event.preventDefault();
  };
  return (
    <div data-project-card={dataProjectCard} className="min-w-0">
      <motion.article
        className={clsx('flex flex-col gap-5.5 w-full h-full', cardVariants({ appearance, state }))}
        animate={{ opacity: dimmed ? 0.6 : 1 }}
        transition={minimalistFadeTransition}
      >
        {CARD_CORNERS.map((corner) => (
          <motion.span
            key={corner}
            className={clsx(
              'absolute h-4 w-4 border-solid opacity-0 pointer-events-none',
              appearance === 'light' ? 'border-minimalist-alpha-black-100' : 'border-minimalist-alpha-white-100',
              CARD_CORNER_EDGE_CLASSES[corner],
            )}
            animate={{ opacity: active ? 1 : 0 }}
            transition={minimalistFadeTransition}
            aria-hidden="true"
          />
        ))}
        <header className="flex items-center justify-between gap-5">
          <p
            className={clsx(
              'm-0 text-minimalist-sm font-minimalist-semibold uppercase',
              appearance === 'light' ? 'text-minimalist-alpha-black-100' : 'text-minimalist-alpha-white-100',
            )}
          >
            {eyebrow}
          </p>
          <div>
            <h2
              className={clsx(
                'm-0 text-right text-minimalist-sm font-minimalist-regular uppercase',
                appearance === 'light' ? 'text-minimalist-alpha-black-100' : 'text-minimalist-alpha-white-100',
              )}
            >
              {meta}
            </h2>
          </div>
        </header>
        <div className="contents">
          <div
            className={clsx(
              'minimalist-card__content m-0 line-clamp-4 text-left text-minimalist-md font-minimalist-light break-words hyphens-auto [line-height:var(--minimalist-card-content-line-height)] [&_strong]:font-minimalist-semibold',
              appearance === 'light' ? 'text-minimalist-alpha-black-80' : 'text-minimalist-alpha-white-80',
            )}
          >
            {children}
          </div>
        </div>
        <footer className="flex items-center justify-between gap-5 text-minimalist-sm text-minimalist-muted">
          {href && (
            <a href={href} target="_blank" rel="noopener noreferrer" onClick={handleAnchorClick}>
              {linkLabel ?? t('open')}
            </a>
          )}
          {footer}
          {onExpandedChange && (
            <Button
              appearance={appearance}
              variant="secondary"
              label={expansionLabel ?? t('open')}
              icon={<AnimatedIcon icon="chevrons-up-down" size={16} />}
              type="button"
              className="minimalist-card__expand-control ml-auto whitespace-nowrap"
              aria-controls="minimalist-project-expanded-content"
              onClick={() => {
                playExpandSound();
                onExpandedChange();
              }}
            />
          )}
        </footer>
      </motion.article>
    </div>
  );
}
