'use client';

import { useTranslations } from 'next-intl';

import { IconInteractionProvider, useIconInteractionHandlers } from '../contexts/icon-interaction-context';
import type { MinimalistAppearance } from '../types';
import { paginationVariants } from '../variants';
import { AnimatedIcon } from './animated-icon';

type PaginationButtonProps = {
  appearance: MinimalistAppearance;
  direction: 'previous' | 'next';
  disabled?: boolean;
  onClick: () => void;
  state?: 'regular' | 'hover' | 'focus';
};

export function PaginationButton({
  appearance,
  direction,
  disabled = false,
  onClick,
  state = 'regular',
}: PaginationButtonProps) {
  const t = useTranslations('minimalist.controls');
  const isPrevious = direction === 'previous';
  const { state: iconInteractionState, handlers } = useIconInteractionHandlers({ disabled });
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-2.5 rounded-md border-0 bg-transparent p-1 text-minimalist-sm text-minimalist-foreground cursor-pointer disabled:cursor-not-allowed ${paginationVariants({ appearance, state })}`}
      aria-label={t(isPrevious ? 'previous' : 'next')}
      disabled={disabled}
      onClick={onClick}
      {...handlers}
    >
      <IconInteractionProvider value={iconInteractionState}>
        <AnimatedIcon icon={isPrevious ? 'chevron-left' : 'chevron-right'} size={12} />
      </IconInteractionProvider>
    </button>
  );
}
