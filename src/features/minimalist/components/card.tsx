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
    <div data-project-card={dataProjectCard} className="minimalist-card-slot">
      <motion.article
        className={clsx('flex flex-col gap-5.5 w-full h-full', cardVariants({ appearance, state }))}
        animate={{ opacity: dimmed ? 0.6 : 1 }}
        transition={minimalistFadeTransition}
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
          </div>
        </header>
        <div className="minimalist-card__main">
          <div className="minimalist-card__content">{children}</div>
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
              variant="secondary"
              label={expansionLabel ?? t('open')}
              icon={<AnimatedIcon icon="chevrons-up-down" size={16} />}
              type="button"
              className="minimalist-card__expand-control whitespace-nowrap"
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
